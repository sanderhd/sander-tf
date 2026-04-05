// lib/auth.ts
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { getSupabaseAdminClient } from "@/lib/supabase";

const SESSION_COOKIE_NAME = "admin_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const supabase = getSupabaseAdminClient();
  const { data: admin, error } = await supabase
    .from("User")
    .select("passwordHash")
    .eq("role", "ADMIN")
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("Failed to load admin user", error);
    return false;
  }

  if (!admin) return false;

  return bcrypt.compare(password, admin.passwordHash);
}

export async function createSession() {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, "authenticated", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
}

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const session = cookieStore.get(SESSION_COOKIE_NAME);
  return session?.value === "authenticated";
}