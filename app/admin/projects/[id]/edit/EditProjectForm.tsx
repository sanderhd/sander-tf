"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Image as ImageIcon } from "lucide-react";
import type { ICommand } from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

type Project = {
    id: string;
    title: string;
    slug: string | null;
    summary: string | null;
    content: string | null;
    published: boolean;
    thumbnail: string | null;
};

export default function EditProjectForm({ project }: { project: Project }) {
    const router = useRouter();
    const [title, setTitle] = useState(project.title);
    const [slug, setSlug] = useState(project.slug ?? "");
    const [summary, setSummary] = useState(project.summary ?? "");
    const [content, setContent] = useState(project.content ?? "");
    const [published, setPublished] = useState(project.published);
    const [thumbnailUrl, setThumbnailUrl] = useState(project.thumbnail ?? "");
    const [saving, setSaving] = useState(false);
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

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        const res = await fetch(`/api/admin/projects/${project.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title, slug, summary, content, published,
                thumbnail: thumbnailUrl,
            }),
        });

        if (!res.ok) {
            setMessage(await res.text());
            setSaving(false);
            return;
        }

        setSaving(false);
        setMessage("Changes saved successfully!");
        router.refresh();
    }

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
                <label htmlFor="title" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
                <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title..." required
                    className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.13, duration: 0.4 }}>
                <label htmlFor="thumbnail" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Thumbnail URL</label>
                {thumbnailUrl && (
                    <div className="mb-3 rounded-xl overflow-hidden">
                        <img src={thumbnailUrl} alt="Thumbnail" className="h-32 w-full object-cover rounded-xl" />
                    </div>
                )}
                <input id="thumbnail" type="url" value={thumbnailUrl} onChange={(e) => setThumbnailUrl(e.target.value)} placeholder="https://..."
                    className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
                <label htmlFor="slug" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Slug</label>
                <input id="slug" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug..." required
                    className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }}>
                <label htmlFor="summary" className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Summary</label>
                <input id="summary" value={summary} onChange={(e) => setSummary(e.target.value)} placeholder="Summary..." required
                    className="w-full rounded-xl border border-slate-300 bg-white/90 px-4 py-3 text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-800 dark:bg-slate-950/60 dark:text-slate-100" />
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25, duration: 0.4 }}>
                <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-300">Content (Markdown)</label>
                <div data-color-mode="auto">
                    <MDEditor value={content} onChange={(val) => setContent(val ?? "")} height={400} extraCommands={[uploadImageCommand]} />
                </div>
            </motion.div>

            <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                    <input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="h-4 w-4 rounded border-slate-300" />
                    <span className="text-sm text-slate-700 dark:text-slate-300">Published</span>
                </label>
            </div>

            {message && <p className="text-sm text-slate-600 dark:text-slate-300">{message}</p>}

            <div className="flex gap-3">
                <motion.button type="submit" disabled={saving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700">
                    {saving ? "Saving..." : "Save Changes"}
                </motion.button>
                <Link href="/admin" className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 shadow transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700">
                    Cancel
                </Link>
            </div>
        </form>
    );
}