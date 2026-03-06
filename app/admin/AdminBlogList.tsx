"use client";

import { useEffect, useState } from "react";

type BlogItem = {
  id: string;
  title: string;
  slug: string | null;
  summary: string | null;
  content?: string | null;
  published: boolean;
  createdAt: string;
};

type Props = {
  refreshToken: number;
  onChanged?: () => void;
};

export default function AdminBlogList({ refreshToken, onChanged }: Props) {
  const [blogs, setBlogs] = useState<BlogItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState({ title: "", slug: "", summary: "", content: "" });
  const [message, setMessage] = useState<string | null>(null);

  async function loadBlogs() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/blogs", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as BlogItem[];
      setBlogs(data);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to load blogs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBlogs();
  }, [refreshToken]);

  async function togglePublished(blog: BlogItem) {
    const res = await fetch(`/api/admin/blogs/${blog.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !blog.published }),
    });
    if (!res.ok) {
      setMessage(await res.text());
      return;
    }
    await loadBlogs();
    onChanged?.();
  }

  function startEdit(blog: BlogItem) {
    setEditingId(blog.id);
    setDraft({
      title: blog.title,
      slug: blog.slug ?? "",
      summary: blog.summary ?? "",
      content: blog.content ?? "",
    });
  }

  async function saveEdit(id: string) {
    const res = await fetch(`/api/admin/blogs/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });

    if (!res.ok) {
      setMessage(await res.text());
      return;
    }

    setEditingId(null);
    await loadBlogs();
    onChanged?.();
  }

  if (loading) return <p className="text-sm text-slate-500">Loading blogs...</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Existing blogs</h2>
      {message ? <p className="text-sm text-red-600">{message}</p> : null}

      {blogs.length === 0 ? (
        <p className="text-sm text-slate-500">No blogs yet.</p>
      ) : (
        blogs.map((blog) => (
          <div key={blog.id} className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
            {editingId === blog.id ? (
              <div className="space-y-2">
                <input className="w-full rounded border px-3 py-2" value={draft.title} onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))} />
                <input className="w-full rounded border px-3 py-2" value={draft.slug} onChange={(e) => setDraft((d) => ({ ...d, slug: e.target.value }))} />
                <input className="w-full rounded border px-3 py-2" value={draft.summary} onChange={(e) => setDraft((d) => ({ ...d, summary: e.target.value }))} />
                <textarea className="w-full rounded border px-3 py-2" value={draft.content} onChange={(e) => setDraft((d) => ({ ...d, content: e.target.value }))} />
                <div className="flex gap-2">
                  <button className="rounded bg-slate-900 px-3 py-1.5 text-white" onClick={() => saveEdit(blog.id)}>Save</button>
                  <button className="rounded border px-3 py-1.5" onClick={() => setEditingId(null)}>Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">{blog.title}</p>
                  <p className="text-xs text-slate-500">{blog.slug}</p>
                  <p className="text-xs text-slate-500">{blog.published ? "Published" : "Draft"}</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded border px-3 py-1.5" onClick={() => startEdit(blog)}>Edit</button>
                  <button className="rounded border px-3 py-1.5" onClick={() => togglePublished(blog)}>
                    {blog.published ? "Unpublish" : "Publish"}
                  </button>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}