import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { env, isConfigured } from "../env";

/**
 * Service-role Supabase client for trusted server-side writes (persisting
 * submissions, updating booking status). Bypasses RLS — NEVER expose the
 * service-role key to the browser (PRD §8). Returns null when the DB isn't
 * configured so callers can degrade gracefully.
 */
export function getAdminClient(): SupabaseClient | null {
  if (!isConfigured.db()) return null;
  return createClient(env.supabaseUrl!, env.supabaseServiceRoleKey!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
