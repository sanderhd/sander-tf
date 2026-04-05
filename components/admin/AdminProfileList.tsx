"use client";

import { useEffect, useState } from "react";

type ProfileItem = {
  id: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
};

type Props = {
  refreshToken: number;
  onChanged?: () => void;
};

export default function AdminProfileList({ refreshToken, onChanged }: Props) {
  const [profiles, setProfiles] = useState<ProfileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function loadProfiles() {
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/admin/profiles", { cache: "no-store" });
      if (!res.ok) throw new Error(await res.text());
      const data = (await res.json()) as ProfileItem[];
      setProfiles(data);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Failed to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadProfiles();
  }, [refreshToken]);

  async function updateRole(profile: ProfileItem, role: "USER" | "ADMIN") {
    setUpdatingId(profile.id);
    setMessage(null);

    try {
      const res = await fetch(`/api/admin/profiles/${profile.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });

      if (!res.ok) {
        setMessage(await res.text());
        return;
      }

      await loadProfiles();
      onChanged?.();
    } catch {
      setMessage("Failed to update role");
    } finally {
      setUpdatingId(null);
    }
  }

  if (loading) return <p className="text-sm text-slate-500">Loading users...</p>;

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Registered users</h2>

      {message && <p className="text-sm text-red-500">{message}</p>}

      {profiles.length === 0 ? (
        <p className="text-sm text-slate-500">No users found.</p>
      ) : (
        profiles.map((profile) => (
          <div
            key={profile.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200/70 bg-white/60 px-4 py-3 backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/40"
          >
            <div className="min-w-0">
              <p className="font-medium text-slate-900 dark:text-white truncate">{profile.email}</p>
              <p className="text-xs text-slate-400">
                Created: {new Date(profile.createdAt).toLocaleDateString("en-GB")}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={profile.role}
                disabled={updatingId === profile.id}
                onChange={(e) => updateRole(profile, e.target.value as "USER" | "ADMIN")}
                className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-sm text-slate-700 outline-none ring-blue-300 transition focus:ring-2 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
