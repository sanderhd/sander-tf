import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { isAuthenticated } from "@/lib/auth";

function normalizeSlug(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

async function requireAdmin() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return new Response("Unauthorized", { status: 403 });
  }
  return null;
}

export async function POST(req: Request) {
    const forbidden = await requireAdmin();
    if (forbidden) return forbidden;

    try {
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const summary = formData.get("summary") as string;
        const slugInput = (formData.get("slug") as string | null)?.trim() ?? "";
        const published = formData.get("published") === "true";
        const thumbnailFile = formData.get("thumbnail") as File | null;

        if (!title || !content || !summary) {
            return new Response("Missing required fields", { status: 400 });
        }

        let thumbnailPath: string | null = null;

        if (thumbnailFile) {
            const bytes = await thumbnailFile.arrayBuffer();
            const buffer = Buffer.from(bytes);
            
            const uploadsDir = join(process.cwd(), "public", "thumbnails");
            
            if (!existsSync(uploadsDir)) {
                await mkdir(uploadsDir, { recursive: true });
            }

            const filename = `${Date.now()}-${thumbnailFile.name.replace(/[^a-z0-9.-]/gi, "_").toLowerCase()}`;
            const filepath = join(uploadsDir, filename);
            
            await writeFile(filepath, buffer);
            thumbnailPath = `/thumbnails/${filename}`;
        }

        const baseSlug = normalizeSlug(slugInput || title);

        if (!baseSlug) {
            return new Response("Invalid title or slug", { status: 400 });
        }

        for (let attempt = 0; attempt < 50; attempt++) {
            const candidateSlug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;

            try {
                const blog = await prisma.blog.create({
                    data: {
                        title,
                        slug: candidateSlug,
                        content,
                        summary,
                        thumbnail: thumbnailPath,
                        published,
                    },
                });

                return Response.json(blog);
            } catch (error) {
                const isSlugCollision =
                    error instanceof Prisma.PrismaClientKnownRequestError &&
                    error.code === "P2002" &&
                    Array.isArray(error.meta?.target) &&
                    (error.meta.target as string[]).includes("slug");

                if (isSlugCollision) {
                    continue;
                }

                throw error;
            }
        }

        return new Response("Could not generate unique slug", { status: 409 });
    } catch (error) {
        console.error("Upload error:", error);
        return new Response("Internal server error", { status: 500 });
    }
}

export async function GET() {
    const forbidden = await requireAdmin();
    if (forbidden) return forbidden;

    const blogs = await prisma.blog.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            slug: true,
            summary: true,
            published: true,
            createdAt: true,
            thumbnail: true,
        },
    });

    return Response.json(blogs);
}