"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type BlogItem = {
  id: string;
  title: string;
  slug: string | null;
  summary: string | null;
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
  const [message, setMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "published" | "draft">("all");

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

  useEffect(() => { loadBlogs(); }, [refreshToken]);

  async function togglePublished(blog: BlogItem) {
    const res = await fetch(`/api/admin/blogs/${blog.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !blog.published }),
    });
    if (!res.ok) { setMessage(await res.text()); return; }
    await loadBlogs();
    onChanged?.();
  }

  async function deleteBlog(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/admin/blogs/${id}`, { method: "DELETE" });
    if (!res.ok) { setMessage("Failed to delete"); }
    setDeletingId(null);
    setConfirmId(null);
    await loadBlogs();
    onChanged?.();
  }

  const filtered = blogs
    .filter((b) => filter === "all" || (filter === "published" ? b.published : !b.published))
    .filter((b) => b.title.toLowerCase().includes(search.toLowerCase()));

  if (loading) return <p className="text-sm text-slate-500">Loading blogs...</p>;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Existing blogs</h2>

      <div className="flex flex-wrap gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search blogs..."
          className="rounded-lg border border-slate-200 bg-white/80 px-3 py-1.5 text-sm text-slate-900 outline-none ring-blue-300 transition placeholder:text-slate-400 focus:ring-2 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-100"
        />
        <div className="flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden text-sm">
          {(["all", "published", "draft"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 capitalize transition ${
                filter === f
                  ? "bg-slate-900 text-white dark:bg-slate-700"
                  : "bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-900/50 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {message && <p className="text-sm text-red-500">{message}</p>}

      {filtered.length === 0 ? (
        <p className="text-sm text-slate-500">No blogs found.</p>
      ) : (
        filtered.map((blog) => (
          <div
            key={blog.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/60 px-4 py-3 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/40"
          >
            <div className="min-w-0">
              <p className="font-medium text-slate-900 dark:text-white truncate">{blog.title}</p>
              <p className="text-xs text-slate-400 font-mono">{blog.slug}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                blog.published
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}>
                {blog.published ? "Published" : "Draft"}
              </span>

              <button
                onClick={() => togglePublished(blog)}
                title={blog.published ? "Unpublish" : "Publish"}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                {blog.published ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>

              <Link
                href={`/admin/blogs/${blog.id}/edit`}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                title="Edit"
              >
                <Pencil size={15} />
              </Link>

              {confirmId === blog.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => deleteBlog(blog.id)}
                    disabled={deletingId === blog.id}
                    className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingId === blog.id ? "Deleting..." : "Confirm"}
                  </button>
                  <button
                    onClick={() => setConfirmId(null)}
                    className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs text-slate-600 hover:bg-slate-100 dark:border-slate-700 dark:text-slate-400"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmId(blog.id)}
                  title="Delete"
                  className="rounded-lg border border-slate-200 p-1.5 text-slate-400 transition hover:border-red-300 hover:bg-red-50 hover:text-red-500 dark:border-slate-700 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                >
                  <Trash2 size={15} />
                </button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}