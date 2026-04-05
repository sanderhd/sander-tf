"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import AdminNav from "@/components/admin/AdminNav";

type AnalyticsPayload = {
  configured: boolean;
  dashboardUrl?: string;
  analyticsScriptEnabled?: boolean;
  message?: string;
  error?: string;
};

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalyticsPayload | null>(null);

  async function loadAnalytics() {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/analytics", { cache: "no-store" });
      const payload = (await res.json()) as AnalyticsPayload;
      setData(payload);

      if (!res.ok && payload.error) {
        setError(payload.error);
      }
    } catch {
      setError("Failed to load analytics data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAnalytics();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900/75"
    >
      <h1 className="font-mono text-3xl tracking-tight text-gray-900 sm:text-4xl dark:text-white">
        Analytics
      </h1>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        View the official Vercel Analytics dashboard from here.
      </p>

      <div className="mt-8">
        <AdminNav />

        <div className="mt-6 space-y-6">
          <button
            onClick={loadAnalytics}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
          >
            Refresh
          </button>

          {loading && <p className="text-sm text-slate-500">Loading analytics...</p>}

          {!loading && data && !data.configured && (
            <div className="rounded-xl border border-amber-300/50 bg-amber-50/70 p-4 text-sm text-amber-800 dark:border-amber-700/40 dark:bg-amber-900/20 dark:text-amber-300">
              {data.message ?? "Analytics is not configured yet."}
            </div>
          )}

          {error && (
            <div className="rounded-xl border border-red-300/50 bg-red-50/70 p-4 text-sm text-red-700 dark:border-red-700/40 dark:bg-red-900/20 dark:text-red-300">
              {error}
            </div>
          )}

          {!loading && data?.configured && (
            <div className="rounded-xl border border-slate-200/70 bg-white/70 p-4 dark:border-slate-700/70 dark:bg-slate-900/40">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Vercel Analytics</h2>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                {data.message}
              </p>

              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200/70 bg-slate-50/70 px-3 py-2 text-sm dark:border-slate-700/70 dark:bg-slate-900/50">
                  <span className="text-slate-500">Tracking Script</span>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {data.analyticsScriptEnabled ? "Enabled" : "Not enabled"}
                  </p>
                </div>
                <div className="rounded-lg border border-slate-200/70 bg-slate-50/70 px-3 py-2 text-sm dark:border-slate-700/70 dark:bg-slate-900/50">
                  <span className="text-slate-500">Dashboard</span>
                  <p className="font-medium text-slate-900 dark:text-white">Official Vercel UI</p>
                </div>
              </div>

              <a
                href={data.dashboardUrl ?? "https://vercel.com/dashboard"}
                target="_blank"
                rel="noreferrer"
                className="mt-4 inline-flex items-center justify-center rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
              >
                Open Vercel Analytics
              </a>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
