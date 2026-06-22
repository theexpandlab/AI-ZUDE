// Shared domain types for The Offer Blueprint.

/** The five discovery answers collected from the quiz (PRD §6.2). */
export interface QuizAnswers {
  /** PHASE 01 · FOUNDATION — "What do people keep coming to you for?" */
  expertise: string;
  /** PHASE 02 · THE PEOPLE — "Who do you most want to help?" */
  audience: string;
  /** PHASE 03 · THE TRANSFORMATION — "Paint the after." */
  transformation: string;
  /** PHASE 04 · YOUR VISION — multi-select, max 2 (option ids). */
  vision: string[];
  /** PHASE 05 · THE SHAPE — single-select (option id). */
  shape: string;
  /** PHASE 05 · stage — single-select (option id). */
  stage: string;
}

/** Lead contact details captured at the email gate (PRD §6.3). */
export interface LeadContact {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  consent: boolean;
}

/** A single generated offer (PRD Appendix A schema). */
export interface Offer {
  label: string; // "OFFER 01"
  name: string;
  format: string;
  oneLiner: string;
  whoFor: string;
  transformation: string; // "from X to Y"
  priceBand: string; // "$1.5K–$3K"
  whyItFits: string;
}

/** The full AI (or fallback) result. */
export interface OfferBlueprint {
  read: string;
  offers: Offer[];
  /** Whether this came from the model or the rules-based fallback. */
  source: "ai" | "fallback";
}

/** Attribution captured from the client (PRD §9). */
export interface Attribution {
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  utmTerm?: string;
  utmContent?: string;
  referrer?: string;
}

/** Request body for POST /api/generate. */
export interface GenerateRequest {
  contact: LeadContact;
  answers: QuizAnswers;
  attribution?: Attribution;
  /** Honeypot field — must be empty (PRD §6.3, §8). */
  company?: string;
}

/** Response from POST /api/generate. */
export interface GenerateResponse {
  blueprint: OfferBlueprint;
  /** Whether the submission was persisted (false if DB not configured). */
  persisted: boolean;
}

/** A submission row as surfaced to the admin dashboard (PRD §7). */
export interface SubmissionRow {
  id: string;
  created_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  consent: boolean;
  consent_at: string | null;
  answer_expertise: string;
  answer_audience: string;
  answer_transformation: string;
  answer_vision: string[];
  answer_shape: string;
  answer_stage: string;
  generated_offers: OfferBlueprint | null;
  email_status: "queued" | "sent" | "failed";
  synced_to_crm: boolean;
  booked_call: boolean;
  source: string | null;
}
