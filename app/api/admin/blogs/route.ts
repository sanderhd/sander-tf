import { prisma } from "@/lib/prisma";

async function requireAdmin() {
    const isAdmin = true;
    if (!isAdmin) return new Response("Unauthorized", { status: 403 });
    return null;
}

export async function POST(req: Request) {
    const forbidden = await requireAdmin();
    if (forbidden) return forbidden;

    const body = await req.json();
    const blog = await prisma.blog.create({
        data: {
            title: body.title,
            content: body.content,
            published: body.published ?? true,
        },
    });

    return Response.json(blog);
}