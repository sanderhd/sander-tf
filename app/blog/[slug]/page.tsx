import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase";
import Link from "next/link";
import { ArrowBigLeftDash } from "lucide-react";
import { Metadata } from "next";

type BlogPageProps = {
    params: Promise<{
        slug: string;
    }>;
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const supabase = getSupabaseAdminClient();
    const { slug } = await params;
    const { data: blog } = await supabase
        .from("Blog")
        .select("title,summary,content,thumbnail,createdAt")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

    if (!blog) {
        return { title: "Blog not found" };
    }

    const description = blog.summary || blog.content?.slice(0, 160) || "";

    return {
        title: blog.title,
        description,
        openGraph: {
            title: blog.title,
            description,
            images: blog.thumbnail ? [{ url: blog.thumbnail }] : [],
            type: "article",
            publishedTime: new Date(blog.createdAt).toISOString(),
        },
        twitter: {
            card: "summary_large_image",
            title: blog.title,
            description,
            images: blog.thumbnail ? [blog.thumbnail] : [],
        },
    };
}

export default async function BlogDetailPage({ params }: BlogPageProps) {
    const supabase = getSupabaseAdminClient();
    const { slug } = await params;

    const { data: blog } = await supabase
        .from("Blog")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();

    if (!blog) {
        notFound();
    }

    return (
        <main className="relative isolate min-h-screen overflow-hidden px-4 py-16 sm:px-6">
            <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white dark:bg-gray-950">
        <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-950" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-800/20" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-800/20" />

        <div className="absolute inset-0 opacity-55 dark:opacity-40">
          <svg width="100%" height="100%" className="text-slate-500 dark:text-slate-500">
            <pattern
              id="tech-pattern"
              x="0"
              y="0"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="18" cy="18" r="1.5" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#tech-pattern)" />
          </svg>
        </div>

        <div className="absolute bottom-0 right-0 h-1/2 w-full bg-linear-to-t from-blue-100/30 to-transparent dark:from-blue-900/15 dark:to-transparent" />
      </div>

            <article className="relative z-10 mx-auto w-full max-w-3xl rounded-3xl border border-slate-200/70 bg-white/80 p-6 shadow-xl backdrop-blur sm:p-10 dark:border-slate-700/70 dark:bg-slate-900/50 ">
                <Link href="/blog" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors">
                    <ArrowBigLeftDash className="h-4 w-4" />
                    <span>Back to blog</span>
                </Link>

                {blog.thumbnail && (
                    <img 
                        src={blog.thumbnail} 
                        alt={blog.title}
                        className="w-full mt-6 rounded-2xl object-cover h-96"
                    />
                )}

                <h1 className="mt-6 font-mono text-3xl tracking-tight text-slate-900 sm:text-5xl dark:text-white">
                    {blog.title}
                </h1>

                <p className="mt-3 text-sm text-slate-500 dark:text-slate-400">
                    {new Date(blog.createdAt).toLocaleDateString("en-GB", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>

                <div className="mt-8 text-slate-900 dark:text-slate-100">
                {blog.content ? (
                    <ReactMarkdown 
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({node, ...props}) => <h1 className="text-4xl font-bold font-mono mt-6 mb-4" {...props} />,
                            h2: ({node, ...props}) => <h2 className="text-3xl font-bold font-mono mt-5 mb-3" {...props} />,
                            h3: ({node, ...props}) => <h3 className="text-2xl font-bold font-mono mt-4 mb-2" {...props} />,
                            p: ({node, ...props}) => <p className="mb-4 leading-relaxed" {...props} />,
                            ul: ({node, ...props}) => <ul className="list-disc list-inside mb-4 ml-2 space-y-1" {...props} />,
                            ol: ({node, ...props}) => <ol className="list-decimal list-inside mb-4 ml-2 space-y-1" {...props} />,
                            li: ({node, ...props}) => <li className="ml-2" {...props} />,
                            a: ({node, ...props}) => <a className="text-blue-600 dark:text-blue-400 underline font-medium hover:text-blue-700 dark:hover:text-blue-300" {...props} />,
                            code: ({node, ...props}) => <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded text-pink-600 dark:text-pink-400 font-mono text-sm" {...props} />,
                            pre: ({node, ...props}) => <pre className="bg-slate-900 text-slate-100 p-4 rounded-lg overflow-x-auto mb-4" {...props} />,
                            blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-slate-300 dark:border-slate-600 pl-4 italic text-slate-600 dark:text-slate-400 my-4" {...props} />,
                        }}
                    >
                        {blog.content}
                    </ReactMarkdown>
                ) : (
                    <p>No content.</p>
                )}
            </div>
            </article>
        </main>
    )
}
