import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { env, isConfigured } from "../env";

/**
 * Cookie-bound Supabase client for Server Components / Route Handlers, used to
 * read the authenticated admin session (PRD §6.7, §8). Returns null when auth
 * isn't configured.
 */
export function getServerClient() {
  if (!isConfigured.auth()) return null;
  const cookieStore = cookies();
  return createServerClient(env.supabaseUrl!, env.supabaseAnonKey!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          );
        } catch {
          // Called from a Server Component where cookies are read-only — safe to ignore;
          // session refresh happens in middleware / route handlers.
        }
      },
    },
  });
}
