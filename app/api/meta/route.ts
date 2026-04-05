import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
    const supabase = getSupabaseAdminClient();
    const [{ count: blogCount, error: blogError }, { count: projectCount, error: projectError }] = await Promise.all([
        supabase.from("Blog").select("id", { head: true, count: "exact" }).eq("published", true),
        supabase.from("Project").select("id", { head: true, count: "exact" }).eq("published", true),
    ]);

    if (blogError || projectError) {
        console.error("Failed to fetch meta counts", blogError ?? projectError);
        return new Response("Internal server error", { status: 500 });
    }

    return Response.json({
        commit: process.env.NEXT_PUBLIC_GIT_COMMIT ?? null,
        buildTime: process.env.NEXT_PUBLIC_BUILD_TIME ?? null,
        blogs: blogCount ?? 0,
        projects: projectCount ?? 0,
    });
}