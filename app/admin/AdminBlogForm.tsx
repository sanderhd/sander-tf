"use client";
import React, { useState } from "react";
import { motion } from "framer-motion"

export default function AdminBlogForm() {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
           const res = await fetch("/api/admin/blogs", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content, published: true }),
            });

            if (!res.ok) {
                setMessage(await res.text());
                return;
            }

            setTitle("");
            setContent("");
            setMessage("Blog succesfully saved!");
        } catch {
            setMessage("Something went wrong!");
        } finally {
            setIsSubmitting(false);
        }
    } 

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <motion.div
                initial={{ opacity: 0, y: 12}}
                animate={{ opacity: 1, y: 0}}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Title
                </label>
                <input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Title..."
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
                    />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 12}}
                animate={{ opacity: 1, y: 0}}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <label htmlFor="content" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Content
                </label>
                <textarea
                    id="content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="Content..."
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
                    />
            </motion.div>

            {message ? (
                <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>
            ) : null}

            <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                    {isSubmitting ? "Saving..." : "Create Blog"}
                </motion.button>
        </form>
    );
}