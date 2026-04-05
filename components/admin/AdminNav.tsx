"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, BarChart3, FolderKanban, Users } from "lucide-react";

export default function AdminNav() {
    const pathname = usePathname();

    const navItems = [
        { href: "/admin", label: "Dashboard", icon: BarChart3 },
        { href: "/admin/blogs", label: "Blogs", icon: FileText },
        { href: "/admin/projects", label: "Projects", icon: FolderKanban },
        { href: "/admin/users", label: "Users", icon: Users },
        { href: "/admin/analytics", label: "Analytics", icon: BarChart3 }
    ];

    return (
        <nav className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || (item.href !== "/admin" && pathname?.startsWith(item.href));

                return (
                    <Link 
                        key={item.href}
                        href={item.href}
                        className={`
                            flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition
                            ${isActive 
                                ? "bg-slate-900 text-white dark:bg-slate-700" 
                                : "bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
                            }
                            `}
                    >
                        <Icon className="h-4 w-4" />
                        {item.label}
                    </Link>
                );
            })}
        </nav>
    )
}