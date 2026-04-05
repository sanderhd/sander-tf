import { isAuthenticated } from "@/lib/auth";
import type { Database } from "@/lib/database.types";
import { getSupabaseAdminClient, isUniqueViolation } from "@/lib/supabase";

function normalizeSlug(value: string): string {
  return value.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

async function requireAdmin() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return new Response("Unauthorized", { status: 403 });
  }
  return null;
}

type PatchBody = {
  published?: boolean;
  title?: string;
  slug?: string;
  summary?: string;
  content?: string;
  thumbnail?: string;
};

type ProjectUpdate = Database["public"]["Tables"]["Project"]["Update"];

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  const supabase = getSupabaseAdminClient();

  const { id } = await params;
  const body = (await req.json()) as PatchBody;

  const data: ProjectUpdate = {};

  if (typeof body.published === "boolean") data.published = body.published;
  if (typeof body.title === "string") data.title = body.title;
  if (typeof body.summary === "string") data.summary = body.summary;
  if (typeof body.content === "string") data.content = body.content;
  if (typeof body.slug === "string") {
    const normalized = normalizeSlug(body.slug);
    if (!normalized) return new Response("Invalid slug", { status: 400 });
    data.slug = normalized;
  }
  if (typeof body.thumbnail === "string") data.thumbnail = body.thumbnail;

  if (Object.keys(data).length === 0) {
    return new Response("No valid fields", { status: 400 });
  }

  try {
    const { data: updated, error } = await supabase
      .from("Project")
      .update(data)
      .eq("id", id)
      .select("*")
      .maybeSingle();

    if (error) {
      if (isUniqueViolation(error, "slug")) {
        return new Response("Slug already exists", { status: 409 });
      }
      console.error(error);
      return new Response("Internal server error", { status: 500 });
    }

    if (!updated) return new Response("Not found", { status: 404 });

    return Response.json(updated);
  } catch (error) {
    console.error(error);
    return new Response("Internal server error", { status: 500 });
  }
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  const supabase = getSupabaseAdminClient();

  const { id } = await params;

  const { data: project, error } = await supabase
    .from("Project")
    .select("id,title,slug,summary,content,published,thumbnail,createdAt")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    console.error("Failed to fetch project", error);
    return new Response("Internal server error", { status: 500 });
  }

  if (!project) return new Response("Not found", { status: 404 });
  return Response.json(project);
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;
  const supabase = getSupabaseAdminClient();

  const { id } = await params;

  const { data: deleted, error } = await supabase
    .from("Project")
    .delete()
    .eq("id", id)
    .select("id")
    .maybeSingle();

  if (error) {
    console.error("Failed to delete project", error);
    return new Response("Internal server error", { status: 500 });
  }

  if (!deleted) {
    return new Response("Not found", { status: 404 });
  }

    return new Response(null, { status: 204 });
}