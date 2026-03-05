"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type BlogPost = {
  id: string;
  title: string;
  content: string | null;
};

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadPosts() {
      const res = await fetch("/api/blogs", { cache: "no-store" });
      if (!res.ok || !isMounted) return;

      const data = (await res.json()) as BlogPost[];
      setPosts(data);
    }

    loadPosts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="relative isolate flex min-h-screen items-center justify-center overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white dark:bg-gray-950">
        <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-950" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-800/20" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-800/20" />

        <div className="absolute inset-0 opacity-55 dark:opacity-40">
          <svg width="100%" height="100%" className="text-slate-500 dark:text-slate-500">
            <pattern
              id="tech-pattern"
              x="0"
              y="0"
              width="36"
              height="36"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="18" cy="18" r="1.5" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#tech-pattern)" />
          </svg>
        </div>

        <div className="absolute bottom-0 right-0 h-1/2 w-full bg-linear-to-t from-blue-100/30 to-transparent dark:from-blue-900/15 dark:to-transparent" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8">
        <motion.h1
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="font-mono text-4xl tracking-tight text-gray-900 select-none sm:text-6xl md:text-7xl lg:text-8xl dark:text-white">

              blogs
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.6 }}
            className="mt-4 max-w-2xl text-sm text-slate-600 dark:text-slate-300 sm:text-base"
            >
              Thoughts, expiriments and logs.
            </motion.p>

          {posts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
              className="mt-10 rounded-2xl border border-slate-200/700 bg-white/70 p-6 text-slate-700 shadow-sm backdrop-blur dark:border-slate-700/70 dark:bg-slate-900/40 dark:text-slate-200"
            >
              No blogs posted.
            </motion.div>
          ) : (
            <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5">
              {posts.map((p, i) => (
                <motion.article
                  key={p.id}
                  initial={{ opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.08 * i, duration: 0.5 }}
                  className="group rounded-2xl border border-slate-200/70 bg-white/70 p-5 shadow-sm backdrop-blur transition hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700/70 dark:bg-slate-900/40"
                  >
                    <h2 className="text-xl font-semibold tracking-tight text-slate-900 dark:text-white">
                      {p.title}
                    </h2>

                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {p.content ?? "Geen inhoud toegevoegd."}
                    </p>

                    <div className="mt-4">
                      <button className="inline-flex items-center rounded-full border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
                        Read more
                      </button>
                    </div>
                  </motion.article>
              ))}
              </div>
          )}
      </div>
    </div>
  );
}
