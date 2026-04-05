import { notFound } from "next/navigation";
import { getSupabaseAdminClient } from "@/lib/supabase";
import EditProjectForm from "./EditProjectForm";
import AdminNav from "@/components/admin/AdminNav";

type Props = {
    params: Promise<{ id: string }>;
};

export default async function EditProjectPage({ params }: Props) {
    const supabase = getSupabaseAdminClient();
    const { id } = await params;

    const { data: project } = await supabase
        .from("Project")
        .select("id,title,slug,summary,content,published,thumbnail,createdAt")
        .eq("id", id)
        .maybeSingle();

    if (!project) notFound();

    return (
        <div className="rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-2xl backdrop-blur-xl sm:p-8 dark:border-slate-800 dark:bg-slate-900/75">
            <h1 className="font-mono text-3xl tracking-tight text-gray-900 sm:text-4xl dark:text-white">
                Edit Project
            </h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                Update your project content.
            </p>

            <div className="mt-8">
                <AdminNav />
                <div className="mt-6">
                    <EditProjectForm project={project} />
                </div>
            </div>
        </div>
    );
}