import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma"

type BlogPageProps = {
    params: Promise<{
        id: string;
    }>;
};

export default async function BlogDetailPage({ params }: BlogPageProps) {
    const { id } = await params;

    const blog = await prisma.blog.findFirst({
        where: {
            id,
            published: true,
        },
    });

    if (!blog) {
        notFound();
    }

    return (
        <main className="relative isolate min-h-screen overflow-hidden px-4 py-16 sm:px-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white dark:bg-gray-950">
                <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-950" />
                <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-800/20" />
                <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-800/20" />
            </div>

            <article className="relative z-10 mx-auto w-full max-w-3xl rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur sm:p-10 dark:border-slate-700/70 dark:bg-slate-900/50 ">
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                    Blog
                </p>

                <h1 className="mt-2 font-mono text-3xl tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                    {blog.title}
                </h1>

                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>

                <div className="prose prose-slate mt-8 max-w-none dark:prose-invert">
                    {blog.content ? (
                        blog.content.split("\n").map((line, i) => (
                            <p key={i}>{line}</p>
                        ))
                    ) : (
                        <p>No content.</p>
                    )}
                </div>
            </article>
        </main>
    )
}