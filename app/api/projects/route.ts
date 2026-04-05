import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
    const supabase = getSupabaseAdminClient();
    const { data: projects, error } = await supabase
        .from("Project")
        .select("id,title,slug,content,summary,thumbnail,published,createdAt")
        .eq("published", true)
        .order("createdAt", { ascending: false });

    if (error) {
        console.error("Failed to fetch projects", error);
        return new Response("Internal server error", { status: 500 });
    }

    return Response.json(projects);
}