import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import EditBlogForm from "./EditBlogForm";
import AdminNav from "@/components/admin/AdminNav";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: Props) {
    const { id } = await params;

    const blog = await prisma.blog.findUnique({
        where: { id },
        select: {
            id: true,
            title: true,
            slug: true,
            summary: true,
            content: true,
            published: true,
            thumbnail: true,
            createdAt: true,
        },
    });

    if (!blog) notFound();

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900/75">
            <h1 className="font-mono text-3xl tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                Edit Post
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Update your blog post content.
            </p>

            <div className="mt-8">
                <AdminNav />
                <div className="mt-6">
                    <EditBlogForm blog={blog} />
                </div>
            </div>
        </div>
    );
}