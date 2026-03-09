"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Pencil, Trash2, Eye, EyeOff } from "lucide-react";

type ProjectItem = {
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

export default function AdminProjectList({ refreshToken, onChanged }: Props) {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  async function loadProjects() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/projects", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as ProjectItem[];
      setProjects(data);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Failed to load projects");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { loadProjects(); }, [refreshToken]);

  async function togglePublished(project: ProjectItem) {
    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ published: !project.published }),
    });
    if (!res.ok) { setMessage(await res.text()); return; }
    await loadProjects();
    onChanged?.();
  }

  async function deleteProject(id: string) {
    setDeletingId(id);
    const res = await fetch(`/api/admin/projects/${id}`, { method: "DELETE" });
    if (!res.ok) { setMessage("Failed to delete"); }
    setDeletingId(null);
    setConfirmId(null);
    await loadProjects();
    onChanged?.();
  }

  if (loading) return <p className="text-sm text-slate-500">Loading projects...</p>;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Existing projects</h2>
      {message && <p className="text-sm text-red-500">{message}</p>}

      {projects.length === 0 ? (
        <p className="text-sm text-slate-500">No projects yet.</p>
      ) : (
        projects.map((project) => (
          <div
            key={project.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/60 px-4 py-3 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/40"
          >
            <div className="min-w-0">
              <p className="font-medium text-slate-900 dark:text-white truncate">{project.title}</p>
              <p className="text-xs text-slate-400 font-mono">{project.slug}</p>
            </div>

            <div className="flex items-center gap-2">
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                project.published
                  ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
              }`}>
                {project.published ? "Published" : "Draft"}
              </span>

              <button
                onClick={() => togglePublished(project)}
                title={project.published ? "Unpublish" : "Publish"}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
              >
                {project.published ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>

              <Link
                href={`/admin/projects/${project.id}/edit`}
                className="rounded-lg border border-slate-200 p-1.5 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
                title="Edit"
              >
                <Pencil size={15} />
              </Link>

              {confirmId === project.id ? (
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => deleteProject(project.id)}
                    disabled={deletingId === project.id}
                    className="rounded-lg bg-red-600 px-2.5 py-1 text-xs font-medium text-white hover:bg-red-700 disabled:opacity-50"
                  >
                    {deletingId === project.id ? "Deleting..." : "Confirm"}
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
                  onClick={() => setConfirmId(project.id)}
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