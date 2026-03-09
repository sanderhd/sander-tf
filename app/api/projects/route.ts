import { prisma } from "@/lib/prisma";

export async function GET() {
    const projects = await prisma.project.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            title: true,
            slug: true,
            content: true,
            summary: true,
            thumbnail: true,
            published: true,
            createdAt: true,
        },
    });
    return Response.json(projects);
}