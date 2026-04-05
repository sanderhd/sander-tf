import bcrypt from "bcryptjs";
import { isAuthenticated } from "@/lib/auth";
import { getSupabaseAdminClient, isUniqueViolation } from "@/lib/supabase";
import type { ProfileRole } from "@/lib/database.types";

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

export async function GET() {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const supabase = getSupabaseAdminClient();
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("id,email,role,createdAt")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Failed to fetch profiles", error);
    return new Response("Internal server error", { status: 500 });
  }

  return Response.json(profiles);
}

export async function POST(req: Request) {
  const forbidden = await requireAdmin();
  if (forbidden) return forbidden;

  const supabase = getSupabaseAdminClient();

  try {
    const body = (await req.json()) as {
      email?: string;
      password?: string;
      role?: string;
    };

    const email = body.email?.toLowerCase().trim() ?? "";
    const password = body.password ?? "";
    const role = body.role ?? "USER";

    if (!email || !password) {
      return new Response("Email and password are required", { status: 400 });
    }

    if (password.length < 8) {
      return new Response("Password must be at least 8 characters", { status: 400 });
    }

    if (!isRole(role)) {
      return new Response("Invalid role", { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const { data: profile, error } = await supabase
      .from("profiles")
      .insert({
        email,
        passwordHash,
        role,
      })
      .select("id,email,role,createdAt")
      .single();

    if (error) {
      if (isUniqueViolation(error, "email")) {
        return new Response("Email already exists", { status: 409 });
      }
      console.error("Failed to create profile", error);
      return new Response("Internal server error", { status: 500 });
    }

    return Response.json(profile);
  } catch (error) {
    console.error("Failed to register profile", error);
    return new Response("Internal server error", { status: 500 });
  }
}
