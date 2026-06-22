/**
 * Server-side environment access (PRD §8 — all secrets stay on the server).
 *
 * Every integration degrades gracefully: if a key is missing the relevant
 * feature is skipped (and logged) rather than crashing the request, so the
 * lead never hits a dead end and the app is deployable incrementally.
 *
 * NEVER import this from a Client Component. The only browser-exposed values
 * are the explicit NEXT_PUBLIC_* reads in `publicEnv`.
 */

export const env = {
  // AI
  anthropicApiKey: process.env.ANTHROPIC_API_KEY,
  anthropicModel: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-6",

  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,

  // Email (Resend)
  resendApiKey: process.env.RESEND_API_KEY,
  emailFrom: process.env.EMAIL_FROM || "The Expand Lab <hey@theexpandlab.com>",
  emailReplyTo: process.env.EMAIL_REPLY_TO,

  // CRM — GoHighLevel
  ghlApiKey: process.env.GHL_API_KEY,
  ghlLocationId: process.env.GHL_LOCATION_ID,

  // Scheduling — Cal.com
  calBookingUrl: process.env.NEXT_PUBLIC_CAL_BOOKING_URL || "https://cal.com/the-expand-lab",
  calWebhookSecret: process.env.CAL_WEBHOOK_SECRET,

  // Privacy
  privacyPolicyUrl:
    process.env.NEXT_PUBLIC_PRIVACY_POLICY_URL || "https://theexpandlab.com/privacy",

  // Site
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://build.theexpandlab.com",
};

/** Public, browser-safe values. */
export const publicEnv = {
  calBookingUrl: env.calBookingUrl,
  privacyPolicyUrl: env.privacyPolicyUrl,
};

export const isConfigured = {
  ai: () => Boolean(env.anthropicApiKey),
  db: () => Boolean(env.supabaseUrl && env.supabaseServiceRoleKey),
  auth: () => Boolean(env.supabaseUrl && env.supabaseAnonKey),
  email: () => Boolean(env.resendApiKey),
  crm: () => Boolean(env.ghlApiKey && env.ghlLocationId),
  calWebhook: () => Boolean(env.calWebhookSecret),
};
