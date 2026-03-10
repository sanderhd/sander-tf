import { prisma } from "@/lib/prisma";

export async function GET() {
    const [blogCount, projectCount] = await Promise.all([
        prisma.blog.count({ where: { published: true } }),
        prisma.project.count({ where: { published: true } }),
    ]);

    return Response.json({
        commit: process.env.NEXT_PUBLIC_GIT_COMMIT ?? null,
        buildTime: process.env.NEXT_PUBLIC_BUILD_TIME ?? null,
        blogs: blogCount,
        projects: projectCount,
    });
}