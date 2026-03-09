"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { Image as ImageIcon } from "lucide-react";
import type { ICommand } from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type AdminProjectFormProps = {
    onCreated?: () => void;
}

export default function AdminProjectForm({ onCreated }: AdminProjectFormProps) {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [summary, setSummary] = useState("");
    const [slug, setSlug] = useState("");
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<string | null>(null);

    const uploadImageCommand: ICommand = {
        name: "upload-image",
        keyCommand: "upload-image",
        buttonProps: { "aria-label": "Upload image", title: "Upload image" },
        icon: <ImageIcon size={14} />,
        execute: (_state, api) => {
            const input = document.createElement("input");
            input.type = "file";
            input.accept = "image/*";
            input.onchange = async () => {
                const file = input.files?.[0];
                if (!file) return;
                const fd = new FormData();
                fd.append("file", file);
                const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
                if (!res.ok) return;
                const { url } = await res.json();
                api.replaceSelection(`![${file.name}](${url})`);
            };
            input.click();
        },
    };

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

            const res = await fetch("/api/admin/projects", {
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
            setMessage("Project successfully saved!");
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
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">
                    Content
                </label>
                <div data-color-mode="auto">
                    <MDEditor
                        value={content}
                        onChange={(val) => setContent(val ?? "")}
                        height={400}
                        extraCommands={[uploadImageCommand]}
                    />
                </div>
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
                    {isSubmitting ? "Saving..." : "Create Project"}
                </motion.button>
        </form>
    );
}