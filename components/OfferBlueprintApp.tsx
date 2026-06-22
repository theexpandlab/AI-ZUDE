"use client";

import { useEffect, useState } from "react";
import {
  landing,
  phases,
  gate,
  results as resultsCopy,
  type Phase,
} from "@/lib/quiz-content";
import type {
  Attribution,
  LeadContact,
  OfferBlueprint,
  QuizAnswers,
} from "@/lib/types";
import BrandMark from "./BrandMark";
import OfferCard from "./OfferCard";

export interface PublicConfig {
  calBookingUrl: string;
  privacyPolicyUrl: string;
}

type Step = "landing" | number | "gate" | "generating" | "results";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const emptyAnswers: QuizAnswers = {
  expertise: "",
  audience: "",
  transformation: "",
  vision: [],
  shape: "",
  stage: "",
};

const emptyContact: LeadContact = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  consent: false,
};

export default function OfferBlueprintApp({ config }: { config: PublicConfig }) {
  const [step, setStep] = useState<Step>("landing");
  const [answers, setAnswers] = useState<QuizAnswers>(emptyAnswers);
  const [contact, setContact] = useState<LeadContact>(emptyContact);
  const [blueprint, setBlueprint] = useState<OfferBlueprint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [attribution, setAttribution] = useState<Attribution | undefined>();

  // Capture UTM / referrer for attribution (PRD §9) — never placed in URLs we emit.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const a: Attribution = {
      utmSource: params.get("utm_source") || undefined,
      utmMedium: params.get("utm_medium") || undefined,
      utmCampaign: params.get("utm_campaign") || undefined,
      utmTerm: params.get("utm_term") || undefined,
      utmContent: params.get("utm_content") || undefined,
      referrer: document.referrer || undefined,
    };
    if (Object.values(a).some(Boolean)) setAttribution(a);
  }, []);

  function reset() {
    setAnswers(emptyAnswers);
    setContact(emptyContact);
    setBlueprint(null);
    setError(null);
    setStep("landing");
    window.scrollTo({ top: 0 });
  }

  async function submit() {
    setStep("generating");
    setError(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contact, answers, attribution, company: honeypot }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong generating your blueprint.");
      }
      const data = (await res.json()) as { blueprint: OfferBlueprint };
      setBlueprint(data.blueprint);
      setStep("results");
      window.scrollTo({ top: 0 });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setStep("gate");
    }
  }

  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-12 sm:py-16">
      <header className="mb-10 flex items-center justify-between">
        <BrandMark />
        {typeof step === "number" && (
          <span className="label-muted">
            {String(step + 1).padStart(2, "0")} / {String(phases.length).padStart(2, "0")}
          </span>
        )}
      </header>

      {step === "landing" && <Landing onStart={() => setStep(0)} />}

      {typeof step === "number" && (
        <PhaseView
          index={step}
          answers={answers}
          setAnswers={setAnswers}
          onBack={() => setStep(step === 0 ? "landing" : step - 1)}
          onNext={() => setStep(step + 1 >= phases.length ? "gate" : step + 1)}
        />
      )}

      {step === "gate" && (
        <Gate
          contact={contact}
          setContact={setContact}
          honeypot={honeypot}
          setHoneypot={setHoneypot}
          error={error}
          privacyPolicyUrl={config.privacyPolicyUrl}
          onBack={() => setStep(phases.length - 1)}
          onSubmit={submit}
        />
      )}

      {step === "generating" && <Generating />}

      {step === "results" && blueprint && (
        <Results
          blueprint={blueprint}
          firstName={contact.firstName}
          calBookingUrl={config.calBookingUrl}
          onReset={reset}
        />
      )}
    </main>
  );
}

/* ------------------------------------------------------------------ Landing */

function Landing({ onStart }: { onStart: () => void }) {
  return (
    <section className="animate-fadeUp">
      <p className="label">{landing.eyebrow}</p>
      <h1 className="heading mt-4 text-3xl leading-[1.1] sm:text-5xl">{landing.headline}</h1>
      <p className="mt-5 text-lg leading-relaxed text-inkSoft">{landing.subhead}</p>
      <div className="mt-9 flex flex-col items-start gap-3">
        <button className="btn-primary" onClick={onStart}>
          {landing.cta}
          <span aria-hidden>→</span>
        </button>
        <p className="label-muted">{landing.reassurance}</p>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- Phase views */

function Progress({ index }: { index: number }) {
  return (
    <div className="mb-8 flex gap-1.5" aria-hidden>
      {phases.map((_, i) => (
        <span
          key={i}
          className={`h-1 flex-1 rounded-full ${
            i < index ? "bg-blueprint" : i === index ? "bg-blueprintSoft" : "bg-line"
          }`}
        />
      ))}
    </div>
  );
}

function PhaseView({
  index,
  answers,
  setAnswers,
  onBack,
  onNext,
}: {
  index: number;
  answers: QuizAnswers;
  setAnswers: (a: QuizAnswers) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const phase = phases[index];
  const valid = isPhaseValid(phase, answers);

  return (
    <section className="animate-fadeUp" aria-labelledby="phase-q">
      <Progress index={index} />
      <p className="label">{phase.tag}</p>
      <h2 id="phase-q" className="heading mt-3 text-2xl sm:text-3xl">
        {phase.question}
      </h2>
      {phase.helper && <p className="mt-2 text-[15px] leading-relaxed text-muted">{phase.helper}</p>}

      <div className="mt-6">
        <PhaseInput phase={phase} answers={answers} setAnswers={setAnswers} />
      </div>

      <div className="mt-8 flex items-center justify-between">
        <button className="btn-ghost" onClick={onBack}>
          <span aria-hidden>←</span> Back
        </button>
        <button className="btn-primary" onClick={onNext} disabled={!valid}>
          Continue <span aria-hidden>→</span>
        </button>
      </div>
    </section>
  );
}

function isPhaseValid(phase: Phase, a: QuizAnswers): boolean {
  if (phase.input.kind === "text") {
    return (a[phase.key] as string).trim().length >= 3;
  }
  if (phase.input.kind === "multi") {
    return a.vision.length >= 1 && a.vision.length <= phase.input.max;
  }
  // dual-single
  return Boolean(a.shape) && Boolean(a.stage);
}

function PhaseInput({
  phase,
  answers,
  setAnswers,
}: {
  phase: Phase;
  answers: QuizAnswers;
  setAnswers: (a: QuizAnswers) => void;
}) {
  if (phase.input.kind === "text") {
    const value = answers[phase.key] as string;
    return (
      <textarea
        className="field min-h-[120px] resize-y"
        placeholder={phase.input.placeholder}
        value={value}
        autoFocus
        onChange={(e) => setAnswers({ ...answers, [phase.key]: e.target.value })}
      />
    );
  }

  if (phase.input.kind === "multi") {
    const max = phase.input.max;
    const selected = answers.vision;
    const toggle = (id: string) => {
      const next = selected.includes(id)
        ? selected.filter((x) => x !== id)
        : selected.length < max
          ? [...selected, id]
          : selected;
      setAnswers({ ...answers, vision: next });
    };
    return (
      <div role="group" aria-label={phase.question}>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {phase.input.options.map((o) => {
            const on = selected.includes(o.id);
            const atMax = !on && selected.length >= max;
            return (
              <button
                key={o.id}
                type="button"
                aria-pressed={on}
                disabled={atMax}
                onClick={() => toggle(o.id)}
                className={`chip justify-between ${
                  on
                    ? "border-blueprint bg-blueprintWash text-blueprintDeep"
                    : `border-line bg-card text-ink hover:border-blueprintSoft ${
                        atMax ? "cursor-not-allowed opacity-45 hover:border-line" : ""
                      }`
                }`}
              >
                <span>{o.label}</span>
                {on && <span aria-hidden>✓</span>}
              </button>
            );
          })}
        </div>
        <p className="label-muted mt-3">Pick up to {max}</p>
      </div>
    );
  }

  // dual-single
  return (
    <div className="space-y-7">
      {phase.input.groups.map((group) => {
        const current = answers[group.key];
        return (
          <fieldset key={group.key}>
            <legend className="label-muted mb-3">{group.prompt}</legend>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {group.options.map((o) => {
                const on = current === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setAnswers({ ...answers, [group.key]: o.id })}
                    className={`chip justify-between ${
                      on
                        ? "border-blueprint bg-blueprintWash text-blueprintDeep"
                        : "border-line bg-card text-ink hover:border-blueprintSoft"
                    }`}
                  >
                    <span>{o.label}</span>
                    {on && <span aria-hidden>✓</span>}
                  </button>
                );
              })}
            </div>
          </fieldset>
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------- The gate */

function Gate({
  contact,
  setContact,
  honeypot,
  setHoneypot,
  error,
  privacyPolicyUrl,
  onBack,
  onSubmit,
}: {
  contact: LeadContact;
  setContact: (c: LeadContact) => void;
  honeypot: string;
  setHoneypot: (s: string) => void;
  error: string | null;
  privacyPolicyUrl: string;
  onBack: () => void;
  onSubmit: () => void;
}) {
  const valid =
    contact.firstName.trim().length >= 1 &&
    contact.lastName.trim().length >= 1 &&
    EMAIL_RE.test(contact.email.trim()) &&
    contact.consent === true;

  return (
    <section className="animate-fadeUp">
      <p className="label">{gate.tag}</p>
      <h2 className="heading mt-3 text-2xl sm:text-3xl">{gate.headline}</h2>
      <p className="mt-2 text-[15px] leading-relaxed text-muted">{gate.subhead}</p>

      <form
        className="mt-7 space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (valid) onSubmit();
        }}
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label className="block">
            <span className="label-muted mb-1.5 block">First name *</span>
            <input
              className="field"
              required
              value={contact.firstName}
              autoComplete="given-name"
              onChange={(e) => setContact({ ...contact, firstName: e.target.value })}
            />
          </label>
          <label className="block">
            <span className="label-muted mb-1.5 block">Last name *</span>
            <input
              className="field"
              required
              value={contact.lastName}
              autoComplete="family-name"
              onChange={(e) => setContact({ ...contact, lastName: e.target.value })}
            />
          </label>
        </div>
        <label className="block">
          <span className="label-muted mb-1.5 block">Email *</span>
          <input
            className="field"
            type="email"
            required
            value={contact.email}
            autoComplete="email"
            inputMode="email"
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
          />
        </label>
        <label className="block">
          <span className="label-muted mb-1.5 block">Phone (optional)</span>
          <input
            className="field"
            type="tel"
            value={contact.phone ?? ""}
            autoComplete="tel"
            inputMode="tel"
            onChange={(e) => setContact({ ...contact, phone: e.target.value })}
          />
        </label>

        {/* Honeypot — visually hidden, off-screen; bots fill it (PRD §6.3). */}
        <div aria-hidden className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
          <label>
            Company
            <input
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </label>
        </div>

        <label className="flex cursor-pointer items-start gap-3 pt-1">
          <input
            type="checkbox"
            className="mt-1 h-4 w-4 shrink-0 accent-blueprint"
            checked={contact.consent}
            onChange={(e) => setContact({ ...contact, consent: e.target.checked })}
          />
          <span className="text-sm leading-relaxed text-inkSoft">
            {gate.consentLabel}{" "}
            <a
              href={privacyPolicyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blueprintDeep underline underline-offset-2"
            >
              Privacy policy
            </a>
            .
          </span>
        </label>

        {error && (
          <p className="rounded-sheet border border-rose-300 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {error}
          </p>
        )}

        <div className="flex items-center justify-between pt-2">
          <button type="button" className="btn-ghost" onClick={onBack}>
            <span aria-hidden>←</span> Back
          </button>
          <button type="submit" className="btn-primary" disabled={!valid}>
            {gate.cta} <span aria-hidden>→</span>
          </button>
        </div>
      </form>
    </section>
  );
}

/* ------------------------------------------------------------- Generating */

function Generating() {
  return (
    <section className="animate-fadeUp py-16 text-center" aria-live="polite">
      <div className="mx-auto flex w-40 justify-center gap-1.5">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="h-8 w-2 rounded-full bg-blueprint animate-barPulse"
            style={{ animationDelay: `${i * 140}ms` }}
          />
        ))}
      </div>
      <p className="label mt-8">{gate.generating}</p>
      <p className="mx-auto mt-3 max-w-sm text-[15px] text-muted">
        Reading your answers and architecting offers that fit your vision. This takes a few seconds.
      </p>
    </section>
  );
}

/* ---------------------------------------------------------------- Results */

function Results({
  blueprint,
  firstName,
  calBookingUrl,
  onReset,
}: {
  blueprint: OfferBlueprint;
  firstName: string;
  calBookingUrl: string;
  onReset: () => void;
}) {
  const cal = calBookingUrl;
  return (
    <section className="animate-fadeUp">
      <p className="label">YOUR OFFER BLUEPRINT</p>
      <h2 className="heading mt-3 text-2xl leading-snug sm:text-3xl">
        {firstName ? `${firstName}, ` : ""}here&apos;s what we&apos;d build.
      </h2>
      <p className="mt-4 text-lg leading-relaxed text-inkSoft">{blueprint.read}</p>

      <div className="mt-8 space-y-5">
        {blueprint.offers.map((o) => (
          <OfferCard key={o.label} offer={o} />
        ))}
      </div>

      {/* Next-phase CTA */}
      <div className="mt-10 rounded-sheet bg-blueprint p-7 text-white shadow-lift sm:p-9">
        <p className="font-mono text-[11px] uppercase tracking-label text-blueprintWash">
          {resultsCopy.ctaTag}
        </p>
        <h3 className="mt-3 text-xl font-semibold sm:text-2xl">{resultsCopy.ctaHeadline}</h3>
        <p className="mt-2 text-[15px] leading-relaxed text-blueprintWash">
          {resultsCopy.ctaSubhead}
        </p>
        <a
          href={cal}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center justify-center gap-2 rounded-sheet bg-white px-6 py-3 text-sm font-semibold text-blueprintDeep transition hover:bg-blueprintWash"
        >
          {resultsCopy.ctaButton} <span aria-hidden>→</span>
        </a>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <p className="label-muted">A copy is on its way to your inbox.</p>
        <button className="btn-ghost" onClick={onReset}>
          {resultsCopy.startOver}
        </button>
      </div>
    </section>
  );
}
