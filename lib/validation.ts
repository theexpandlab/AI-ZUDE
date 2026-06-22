import type { GenerateRequest, LeadContact, QuizAnswers } from "./types";
import { phases } from "./quiz-content";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface ValidationResult {
  ok: boolean;
  errors: string[];
}

function validVisionIds(): Set<string> {
  const p = phases.find((x) => x.key === "vision");
  const opts = p && p.input.kind === "multi" ? p.input.options : [];
  return new Set(opts.map((o) => o.id));
}

function validShapeIds(): { shape: Set<string>; stage: Set<string> } {
  const p = phases.find((x) => x.key === "shape");
  const groups = p && p.input.kind === "dual-single" ? p.input.groups : [];
  const shape = new Set(groups.find((g) => g.key === "shape")?.options.map((o) => o.id) ?? []);
  const stage = new Set(groups.find((g) => g.key === "stage")?.options.map((o) => o.id) ?? []);
  return { shape, stage };
}

export function validateAnswers(a: Partial<QuizAnswers> | undefined): ValidationResult {
  const errors: string[] = [];
  if (!a) return { ok: false, errors: ["Missing answers"] };

  // Free-text inputs require >= 3 chars (PRD §6.2).
  for (const key of ["expertise", "audience", "transformation"] as const) {
    if (typeof a[key] !== "string" || a[key]!.trim().length < 3) {
      errors.push(`${key} must be at least 3 characters`);
    }
  }

  const visionIds = validVisionIds();
  if (!Array.isArray(a.vision) || a.vision.length < 1) {
    errors.push("Select at least one vision");
  } else if (a.vision.length > 2) {
    errors.push("Select at most two vision options");
  } else if (a.vision.some((v) => !visionIds.has(v))) {
    errors.push("Invalid vision option");
  }

  const { shape, stage } = validShapeIds();
  if (!a.shape || !shape.has(a.shape)) errors.push("Select how you want to show up");
  if (!a.stage || !stage.has(a.stage)) errors.push("Select where you're starting from");

  return { ok: errors.length === 0, errors };
}

export function validateContact(c: Partial<LeadContact> | undefined): ValidationResult {
  const errors: string[] = [];
  if (!c) return { ok: false, errors: ["Missing contact"] };
  if (!c.firstName || c.firstName.trim().length < 1) errors.push("First name is required");
  if (!c.lastName || c.lastName.trim().length < 1) errors.push("Last name is required");
  if (!c.email || !EMAIL_RE.test(c.email.trim())) errors.push("A valid email is required");
  if (c.consent !== true) errors.push("Consent is required");
  return { ok: errors.length === 0, errors };
}

export function validateGenerateRequest(body: Partial<GenerateRequest> | undefined): ValidationResult {
  if (!body) return { ok: false, errors: ["Empty request"] };
  // Honeypot — bots fill hidden fields (PRD §6.3, §8).
  if (typeof body.company === "string" && body.company.trim().length > 0) {
    return { ok: false, errors: ["Spam detected"] };
  }
  const c = validateContact(body.contact);
  const a = validateAnswers(body.answers);
  return { ok: c.ok && a.ok, errors: [...c.errors, ...a.errors] };
}
