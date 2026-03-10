"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import AdminBlogForm from "@/components/admin/AdminBlogForm";
import AdminBlogList from "@/components/admin/AdminBlogList";
import AdminNav from "@/components/admin/AdminNav";
import { Plus, X } from "lucide-react";

export default function AdminBlogsPage() {
    const [refreshToken, setRefreshToken] = useState(0);
    const [formOpen, setFormOpen] = useState(false);

    function reloadBlogs() {
        setRefreshToken((v) => v + 1);
    }

    function handleCreated() {
        reloadBlogs();
        setFormOpen(false);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900/75"
        >
            <h1 className="font-mono text-3xl tracking-tight text-gray-900 sm:text-4xl dark:text-white">Blog Management</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Create and manage your blog posts.</p>

            <div className="mt-8">
                <AdminNav />
                <div className="mt-6 space-y-6">
                    <button
                        onClick={() => setFormOpen((v) => !v)}
                        className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow transition hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
                    >
                        {formOpen ? <X size={15} /> : <Plus size={15} />}
                        {formOpen ? "Cancel" : "New Blog"}
                    </button>

                    <AnimatePresence>
                        {formOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <AdminBlogForm onCreated={handleCreated} />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AdminBlogList refreshToken={refreshToken} onChanged={reloadBlogs} />
                </div>
            </div>
        </motion.div>
    );
}