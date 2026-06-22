"use client";

import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser Supabase client for the admin login screen. Uses only the public
 * anon key (safe to ship to the browser). Returns null if not configured.
 */
export function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return null;
  return createBrowserClient(url, anon);
}
