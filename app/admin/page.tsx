"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AdminNav from "@/components/admin/AdminNav";
import { FileText, FolderKanban, BarChart3 } from "lucide-react";

export default function AdminDashboard() {
    const quickActions = [
        { 
            href: "/admin/blogs", 
            label: "Manage Blogs", 
            icon: FileText,
            description: "Create and edit blog posts",
        },
        { 
            href: "/admin/projects", 
            label: "Manage Projects", 
            icon: FolderKanban,
            description: "Coming soon",
            disabled: true
        },
        { 
            href: "/admin/analytics", 
            label: "View Analytics", 
            icon: BarChart3,
            description: "Coming soon",
            disabled: true
        },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900/75"
        >
            <h1 className="font-mono text-3xl tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                Admin Dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Manage your content and view analytics.
            </p>

            <div className="mt-8">
                <AdminNav />

                <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {quickActions.map((action, index) => {
                        const Icon = action.icon;
                        return (
                            <motion.div
                                key={action.href}
                                initial={{ opacity: 0, y: 12 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 * index, duration: 0.4 }}
                            >
                                <Link
                                    href={action.disabled ? "#" : action.href}
                                    className={`
                                        group block rounded-xl border p-5 transition
                                        ${action.disabled 
                                            ? "cursor-not-allowed border-slate-200 bg-slate-50 opacity-50 dark:border-slate-800 dark:bg-slate-900" 
                                            : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm dark:border-slate-700 dark:bg-slate-800/50 dark:hover:border-slate-600"
                                        }
                                    `}
                                    onClick={(e) => action.disabled && e.preventDefault()}
                                >
                                    <Icon className="h-5 w-5 text-slate-600 transition group-hover:text-slate-900 dark:text-slate-400 dark:group-hover:text-slate-200" />
                                    <h3 className="mt-3 font-medium text-slate-900 dark:text-white">
                                        {action.label}
                                    </h3>
                                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                        {action.description}
                                    </p>
                                </Link>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}