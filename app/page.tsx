"use client";

import { ArrowRight, Github, Mail, Globe, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Link from "next/link";
import HackclubBanner from "@/components/Hackclub";

type Post = {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  thumbnail: string | null;
  createdAt: string;
};

type Meta = {
  commit: string | null;
  buildTime: string | null;
  blogs: number;
  projects: number;
};

const stack = [
  "TypeScript", "Next.js", "React", "Tailwind CSS",
  "Prisma", "PostgreSQL", "Docker",
];

const socials = [
  { href: "https://github.com/sanderhd", label: "GitHub", icon: Github },
  { href: "mailto:hi@sander.tf", label: "Email", icon: Mail },
  { href: "https://sander.tf", label: "Website", icon: Globe },
];

function useLocalTime(timezone: string) {
  const [time, setTime] = useState("");
  useEffect(() => {
    function update() {
      setTime(new Intl.DateTimeFormat("en-GB", {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      }).format(new Date()));
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [timezone]);
  return time;
}

function timeAgo(isoString: string): string {
  const diff = Math.floor((Date.now() - new Date(isoString).getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export default function Home() {
  const [blogs, setBlogs] = useState<Post[]>([]);
  const [projects, setProjects] = useState<Post[]>([]);
  const [meta, setMeta] = useState<Meta | null>(null);
  const time = useLocalTime("Europe/Amsterdam");

  useEffect(() => {
    fetch("/api/blogs").then(r => r.json()).then(d => setBlogs(d.slice(0, 3))).catch(() => {});
    fetch("/api/projects").then(r => r.json()).then(d => setProjects(d.slice(0, 3))).catch(() => {});
    fetch("/api/meta").then(r => r.json()).then(setMeta).catch(() => {});
  }, []);

  return (
    <div className="relative isolate min-h-screen overflow-hidden bg-white dark:bg-gray-950">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-950" />
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-800/20" />
        <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-800/20" />
        <div className="absolute inset-0 opacity-40 dark:opacity-30">
          <svg width="100%" height="100%" className="text-slate-400 dark:text-slate-600">
            <pattern id="dots" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
              <circle cx="18" cy="18" r="1.5" fill="currentColor" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-3xl px-6 pb-16 pt-28">

        {/* Hero */}
        <motion.section
          initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12"
        >
          <h1 className="font-mono text-5xl tracking-tight text-gray-900 dark:text-white sm:text-7xl">
            sander.tf
          </h1>
          <p className="mt-4 max-w-lg text-base text-slate-600 dark:text-slate-400">
            Developer building things on the web. Interested in full-stack, infrastructure & open source.
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-slate-400 dark:text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <MapPin size={13} />
              South Holland, Netherlands
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono tabular-nums">
              <Clock size={13} />
              {time} CET
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {socials.map(({ href, label, icon: Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1.5 text-sm text-slate-700 shadow-sm transition hover:border-slate-300 hover:shadow dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 dark:hover:border-slate-600"
              >
                <Icon size={14} />
                {label}
              </a>
            ))}
          </div>

          <div className="mt-6">
            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400 dark:text-slate-500">Stack</p>
            <div className="flex flex-wrap gap-2">
              {stack.map((tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-mono text-slate-600 dark:border-slate-700 dark:bg-slate-900/50 dark:text-slate-400"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Projects */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mb-10"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xl tracking-tight text-gray-900 dark:text-white">projects</h2>
            <Link href="/projects" className="inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-900 dark:hover:text-white">
              all projects <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-2">
            {projects.length === 0 ? (
              <p className="text-sm text-slate-400">No projects yet.</p>
            ) : (
              projects.map((project) => (
                <Link
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group flex items-center gap-4 rounded-xl border border-slate-200/70 bg-white/60 px-4 py-3 backdrop-blur transition hover:border-slate-300 hover:shadow-sm dark:border-slate-700/70 dark:bg-slate-900/40 dark:hover:border-slate-600"
                >
                  {project.thumbnail && (
                    <img src={project.thumbnail} alt={project.title} className="h-10 w-14 shrink-0 rounded-lg object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{project.title}</p>
                    {project.summary && (
                      <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">{project.summary}</p>
                    )}
                  </div>
                  <ArrowRight size={15} className="ml-2 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
                </Link>
              ))
            )}
          </div>
        </motion.section>

        {/* Blogs */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-12"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-mono text-xl tracking-tight text-gray-900 dark:text-white">blog</h2>
            <Link href="/blog" className="inline-flex items-center gap-1 text-sm text-slate-500 transition hover:text-slate-900 dark:hover:text-white">
              all posts <ArrowRight size={14} />
            </Link>
          </div>

          <div className="space-y-2">
            {blogs.length === 0 ? (
              <p className="text-sm text-slate-400">No posts yet.</p>
            ) : (
              blogs.map((post) => (
                <Link
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  className="group flex items-center gap-4 rounded-xl border border-slate-200/70 bg-white/60 px-4 py-3 backdrop-blur transition hover:border-slate-300 hover:shadow-sm dark:border-slate-700/70 dark:bg-slate-900/40 dark:hover:border-slate-600"
                >
                  {post.thumbnail && (
                    <img src={post.thumbnail} alt={post.title} className="h-10 w-14 shrink-0 rounded-lg object-cover" />
                  )}
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900 dark:text-white">{post.title}</p>
                    {post.summary && (
                      <p className="mt-0.5 truncate text-sm text-slate-500 dark:text-slate-400">{post.summary}</p>
                    )}
                  </div>
                  <ArrowRight size={15} className="ml-2 shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-slate-700 dark:group-hover:text-slate-200" />
                </Link>
              ))
            )}
          </div>
        </motion.section>

        {/* Footer */}
        {meta && (
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="border-t border-slate-200/60 pt-6 dark:border-slate-800"
          >
            <p className="font-mono text-xs text-slate-400 dark:text-slate-600">
              {meta.commit && meta.buildTime
                ? `Build ${meta.commit} from ${timeAgo(meta.buildTime)}. `
                : meta.commit
                ? `Build ${meta.commit}. `
                : ""}
              {`(Content: ${meta.blogs} blog${meta.blogs !== 1 ? "s" : ""}, ${meta.projects} project${meta.projects !== 1 ? "s" : ""})`}
            </p>
          </motion.footer>
        )}

      </div>

      <HackclubBanner />
    </div>
  );
}