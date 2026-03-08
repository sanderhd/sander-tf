"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900 dark:text-white">{blog.title}</p>
                <p className="text-xs text-slate-500">{blog.slug}</p>
                <p className="text-xs text-slate-500">{blog.published ? "Published" : "Draft"}</p>
              </div>
              <div className="flex gap-2">
                <Link href={`/admin/blogs/${blog.id}/edit`} className="rounded border px-3 py-1.5">
                  Edit
                </Link>
                <button className="rounded border px-3 py-1.5" onClick={() => togglePublished(blog)}>
                  {blog.published ? "Unpublish" : "Publish"}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
