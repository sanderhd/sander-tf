import { getSupabaseAdminClient } from "@/lib/supabase";

export async function GET() {
    const supabase = getSupabaseAdminClient();
    const { data: blogs, error } = await supabase
        .from("Blog")
        .select("*")
        .eq("published", true)
        .order("createdAt", { ascending: false });

    if (error) {
        console.error("Failed to fetch blogs", error);
        return new Response("Internal server error", { status: 500 });
    }

    return Response.json(blogs);
}