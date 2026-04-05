import { createClient, type PostgrestError } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export function isUniqueViolation(
  error: PostgrestError | null | undefined,
  column?: string
): boolean {
  if (!error || error.code !== "23505") return false;
  if (!column) return true;
  return error.details?.includes(`(${column})`) ?? false;
}