import { isAuthenticated } from "@/lib/auth";
import { getSupabaseAdminClient, isUniqueViolation } from "@/lib/supabase";

function normalizeSlug(value: string): string {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-");
}

async function requireAdmin() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return new Response("Unauthorized", { status: 403 });
  }
  return null;
}

export async function POST(req: Request) {
    const forbidden = await requireAdmin();
    if (forbidden) return forbidden;
    const supabase = getSupabaseAdminClient();

    try {
        const formData = await req.formData();
        const title = formData.get("title") as string;
        const content = formData.get("content") as string;
        const summary = formData.get("summary") as string;
        const slugInput = (formData.get("slug") as string | null)?.trim() ?? "";
        const published = formData.get("published") === "true";
        const thumbnailFile = formData.get("thumbnail") as File | null;

        if (!title || !content || !summary) {
            return new Response("Missing required fields", { status: 400 });
        }

        const thumbnailPath = (formData.get("thumbnail") as string | null)?.trim() || null;

        const baseSlug = normalizeSlug(slugInput || title);

        if (!baseSlug) {
            return new Response("Invalid title or slug", { status: 400 });
        }

        for (let attempt = 0; attempt < 50; attempt++) {
            const candidateSlug = attempt === 0 ? baseSlug : `${baseSlug}-${attempt + 1}`;

            const { data: project, error } = await supabase
                .from("Project")
                .insert({
                    title,
                    slug: candidateSlug,
                    content,
                    summary,
                    thumbnail: thumbnailPath,
                    published,
                })
                .select("*")
                .single();

            if (!error) {
                return Response.json(project);
            }

            if (isUniqueViolation(error, "slug")) {
                continue;
            }

            throw error;
        }

        return new Response("Could not generate unique slug", { status: 409 });
    } catch (error) {
        console.error("Upload error:", error);
        return new Response("Internal server error", { status: 500 });
    }
}

export async function GET() {
    const forbidden = await requireAdmin();
    if (forbidden) return forbidden;
    const supabase = getSupabaseAdminClient();

    const { data: projects, error } = await supabase
        .from("Project")
        .select("id,title,slug,summary,published,createdAt,thumbnail")
        .order("createdAt", { ascending: false });

    if (error) {
        console.error("Failed to fetch admin projects", error);
        return new Response("Internal server error", { status: 500 });
    }

    return Response.json(projects);
}