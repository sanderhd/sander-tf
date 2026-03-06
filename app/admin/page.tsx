"use client";

import { motion } from "framer-motion";
import { useState } from "react"
import AdminBlogForm from "./AdminBlogForm";
import AdminBlogList from "./AdminBlogList";

export default function AdminPage() {
    const [refreshToken, setRefreshtoken] = useState(0);

    function reloadBlogs() {
        setRefreshtoken((v) => v + 1);
    }
    return (
        <main className="relative isolate flex min-h-screen items0center justify-center overflow-hidden px-4 py-10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white dark:bg-gray-950">
                <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-950" />
                <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-800/20" />
                <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-800/20" />

                <div className="absolute inset-0 opacity-55 dark:opacity-40">
                <svg width="100%" height="100%" className="text-slate-500 dark:text-slate-500">
                    <pattern id="tech-pattern-admin" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
                    <circle cx="18" cy="18" r="1.5" fill="currentColor" />
                    </pattern>
                    <rect width="100%" height="100%" fill="url(#tech-pattern-admin)" />
                </svg>
                </div>

                <div className="absolute bottom-0 right-0 h-1/2 w-full bg-linear-to-t from-blue-100/30 to-transparent dark:from-blue-900/15 dark:to-transparent" />
            </div>

            <section className="relative z-10 w-full max-w-3xl">
                <motion.div 
                    initial={{ opacity: 0, y: 24, filter: "blur(6px)"}}
                    animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900/75"
                    >
                        <h1 className="font-mono text-3xl tracking-tight text-gray-900 sm:text04xl dark:text-white">
                            Admin Panel
                        </h1>
                        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                            Create & publish new blog posts.
                        </p>

                        <div className="mt-8">
                            <AdminBlogForm onChanged={reloadBlogs} />
                            <AdminBlogList refreshToken={refreshToken} onChanged={reloadBlogs} />
                        </div>
                </motion.div>
            </section>
        </main>
    )
}