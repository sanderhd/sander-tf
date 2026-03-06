"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
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
          className="font-mono text-5xl tracking-tight text-gray-900 select-none sm:text-7xl md:text-8xl lg:text-9xl dark:text-white">
            sander.tf
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-center text-lg text-gray-600 dark:text-gray-400 max-w-md"
          >
            Welcome to my personal website! Explore my projects, blogs, and more.
          </motion.p>

          <div className="flex gap-4">
            <motion.button
              initial={{ opacity: 0, y: 20}}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = '/blog')}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <span>Blogs</span>
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
            </motion.button>

            <motion.button
              initial={{ opacity: 0, y: 20}}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => (window.location.href = '/projects')}
              className="group inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-900 px-5 py-2 text-sm font-medium text-white shadow-lg transition hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:hover:bg-slate-700"
            >
              <span>Projects</span>
              <ArrowRight className="transition-transform group-hover:translate-x-1" size={18} />
            </motion.button>
          </div>
      </div>
    </div>
  );
}
