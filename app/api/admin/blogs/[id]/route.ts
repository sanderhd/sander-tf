import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { isAuthenticated } from "@/lib/auth";

function normalizeSlug(value: string): string {
  return value.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

async function requireAdmin() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return new Response("Unauthorized", { status: 403 });
  }
  return null;
}

type PatchBody = {
  published?: boolean;
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
};

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const { id } = await params;
  const body = (await req.json()) as PatchBody;

  const data: Prisma.BlogUpdateInput = {};

  if (typeof body.published === "boolean") data.published = body.published;
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.summary === "string") data.summary = body.summary;
  if (typeof body.content === "string") data.content = body.content;
  if (typeof body.slug === "string") {
    const normalized = normalizeSlug(body.slug);
    if (!normalized) return new Response("Invalid slug", { status: 400 });
    data.slug = normalized;
  }

  if (Object.keys(data).length === 0) {
    return new Response("No valid fields", { status: 400 });
  }

  try {
    const updated = await prisma.blog.update({
      where: { id },
      data,
    });
    return Response.json(updated);
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return new Response("Slug already exists", { status: 409 });
    }
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}