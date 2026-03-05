import { prisma } from "@/lib/prisma";

export async function GET() {
    const blogs = await prisma.blog.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
    });

    return Response.json(blogs);
}