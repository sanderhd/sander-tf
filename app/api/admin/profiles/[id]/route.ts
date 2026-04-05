import { isAuthenticated } from "@/lib/auth";
import type { ProfileRole } from "@/lib/database.types";
import { getSupabaseAdminClient } from "@/lib/supabase";

async function requireAdmin() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    return new Response("Unauthorized", { status: 403 });
  }
  return null;
}

function isRole(value: string): value is ProfileRole {
  return value === "USER" || value === "ADMIN";
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const { id } = await params;

  try {
    const body = (await req.json()) as { role?: string };
    const role = body.role ?? "";

    if (!isRole(role)) {
      return new Response("Invalid role", { status: 400 });
    }

    const supabase = getSupabaseAdminClient();
    const { data: updated, error } = await supabase
      .from("profiles")
      .update({ role })
      .eq("id", id)
      .select("id,email,role,createdAt")
      .maybeSingle();

    if (error) {
      console.error("Failed to update profile role", error);
      return new Response("Internal server error", { status: 500 });
    }

    if (!updated) {
      return new Response("Not found", { status: 404 });
    }

    return Response.json(updated);
  } catch (error) {
    console.error("Failed to update role", error);
    return new Response("Internal server error", { status: 500 });
  }
}
