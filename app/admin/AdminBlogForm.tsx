"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import React, { useState } from "react";
import { motion } from "framer-motion";

type AdminBlogFormProps = {
    onCreated?: () => void;
}

export default function AdminBlogForm({ onCreated }: AdminBlogFormProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [summary, setSummary] = useState("");
    const [slug, setSlug] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [showPreview, setShowPreview] = useState(false);

    function handleThumbnailChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setMessage("Thumbnail must be under 5MB");
            return;
        }

        setThumbnail(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setThumbnailPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
    }

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage(null);

        try {
            const formData = new FormData();
            formData.append("title", title);
            formData.append("content", content);
            formData.append("summary", summary);
            if (thumbnail) {
                formData.append("thumbnail", thumbnail);
            }
            formData.append("slug", slug);
            formData.append("published", "true");

            const res = await fetch("/api/admin/blogs", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) {
                setMessage(await res.text());
                return;
            }

            setTitle("");
            setContent("");
            setSummary("");
            setSlug("");
            setThumbnail(null);
            setThumbnailPreview(null);
            setMessage("Blog successfully saved!");
            onCreated?.();
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
                <label htmlFor="thumbnail" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Thumbnail
                </label>
                <input
                    id="thumbnail"
                    type="file"
                    accept="image/*"
                    onChange={handleThumbnailChange}
                    className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
                    />
                {thumbnailPreview && (
                    <div className="mt-3 rounded-xl overflow-hidden">
                        <img src={thumbnailPreview} alt="Preview" className="h-32 w-full object-cover rounded-xl" />
                    </div>
                )}
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 12}}
                animate={{ opacity: 1, y: 0}}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <label htmlFor="summary" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Summary
                </label>
                <input
                    id="summary"
                    value={summary}
                    onChange={(e) => setSummary(e.target.value)}
                    placeholder="Summary..."
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100"
                    />
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 12}}
                animate={{ opacity: 1, y: 0}}
                transition={{ delay: 0.1, duration: 0.4 }}
            >
                <label htmlFor="slug" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Slug
                </label>
                <input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="Slug..."
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

            <div className="flex items-center gap-2">
                <input
                    type="checkbox"
                    id="preview"
                    checked={showPreview}
                    onChange={(e) => setShowPreview(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300"
                    />
                    <label htmlFor="preview" className="text-sm text-slate-700 dark:text-slate-300">
                        Show preview
                    </label>
            </div>

            {showPreview && content && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="rounded-xl border border-slate-300 bg-white/90 p-6 dark:border-slate-800 dark:bg-slate-950/60"
                >
                    <h3 className="mb-4 text-sm font-medium text-slate-700 dark:text-slate-300">
                        Preview
                    </h3>

                    <div className="text-slate-900 dark:text-slate-100">
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
                            {content}
                        </ReactMarkdown>
                    </div>
                </motion.div>
            )}

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