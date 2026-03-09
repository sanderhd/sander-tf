"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AdminProjectForm from "@/components/admin/AdminProjectForm";
import AdminProjectList from "@/components/admin/AdminProjectList";
import AdminNav from "@/components/admin/AdminNav";

export default function AdminBlogsPage() {
    const [refreshToken, setRefreshToken] = useState(0);

    function reloadProjects() {
        setRefreshToken((v) => v + 1);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 24, filter: "blur(6px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900/75"
        >
            <h1 className="font-mono text-3xl tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                Projects Management
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Create and manage your projects.
            </p>

            <div className="mt-8">
                <AdminNav />

                <div className="mt-6 space-y-8">
                    <AdminProjectForm onCreated={reloadProjects} />
                    <AdminProjectList refreshToken={refreshToken} onChanged={reloadProjects} />
                </div>
            </div>
        </motion.div>
    );
}