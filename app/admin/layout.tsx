import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const authenticated = await isAuthenticated();

    if (!authenticated) redirect("/login");

    return (
        <main className="relative isolate flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
            <div className="pointer-events-none absolute inset-0 overflow-hidden bg-white dark:bg-gray-950">
                <div className="absolute inset-0 bg-linear-to-br from-gray-50 via-slate-50 to-gray-100 dark:from-gray-900 dark:via-slate-900 dark:to-gray-950" />
                <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-800/20" />
                <div className="absolute -bottom-20 -left-20 h-72 w-72 rounded-full bg-indigo-200/35 blur-3xl dark:bg-indigo-800/20" />

                <div className="absolute inset-0 opacity-55 dark:opacity-40">
                    <svg width="100%" height="100%" className="text-slate-500 dark:text-slate-500">
                        <pattern id="tech-pattern-admin" x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
                            <circle cx="18" cy="18" r="1.5" fill="currentColor" />
                        </pattern>
                        <rect width="100%" height="100%" fill="url(#tech-pattern-admin)" />
                    </svg>
                </div>

                <div className="absolute bottom-0 right-0 h-1/2 w-full bg-linear-to-t from-blue-100/30 to-transparent dark:from-blue-900/15 dark:to-transparent" />
            </div>

            <section className="relative z-10 w-full max-w-5xl">
                {children}
            </section>
        </main>
    );
}