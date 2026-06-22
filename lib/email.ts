import { Resend } from "resend";
import type { OfferBlueprint } from "./types";
import { env, isConfigured } from "./env";

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Branded HTML results email (PRD §6.6). Inline styles for email-client safety. */
function renderEmailHtml(blueprint: OfferBlueprint, firstName: string): string {
  const ink = "#1F1B16";
  const muted = "#8A8275";
  const blue = "#3F77C2";
  const blueDeep = "#2C5894";
  const paper = "#F4EFE4";
  const card = "#FBF8F1";
  const line = "#DAD2C0";

  const offerCards = blueprint.offers
    .map(
      (o) => `
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${card};border:1px solid ${line};border-radius:8px;margin:0 0 16px;">
        <tr><td style="padding:22px 24px;">
          <div style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${blueDeep};">${escapeHtml(o.label)}</div>
          <div style="font-size:20px;font-weight:700;color:${ink};margin:6px 0 4px;">${escapeHtml(o.name)}</div>
          <div style="font-size:14px;color:${ink};margin:0 0 14px;">${escapeHtml(o.oneLiner)}</div>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:${ink};">
            <tr><td style="padding:4px 0;width:120px;color:${muted};">Format</td><td style="padding:4px 0;">${escapeHtml(o.format)}</td></tr>
            <tr><td style="padding:4px 0;color:${muted};">Who it's for</td><td style="padding:4px 0;">${escapeHtml(o.whoFor)}</td></tr>
            <tr><td style="padding:4px 0;color:${muted};">Transformation</td><td style="padding:4px 0;">${escapeHtml(o.transformation)}</td></tr>
            <tr><td style="padding:4px 0;color:${muted};">Investment</td><td style="padding:4px 0;">${escapeHtml(o.priceBand)}</td></tr>
            <tr><td style="padding:4px 0;color:${muted};vertical-align:top;">Why it fits</td><td style="padding:4px 0;">${escapeHtml(o.whyItFits)}</td></tr>
          </table>
        </td></tr>
      </table>`,
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:${paper};">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${paper};padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;">
        <tr><td style="padding:0 4px 20px;">
          <div style="font-family:monospace;font-size:11px;letter-spacing:3px;text-transform:uppercase;color:${blueDeep};">The Offer Blueprint</div>
          <div style="font-family:monospace;font-size:11px;letter-spacing:2px;text-transform:uppercase;color:${muted};margin-top:2px;">The Expand Lab</div>
        </td></tr>
        <tr><td style="padding:0 4px 24px;">
          <h1 style="font-size:24px;font-weight:700;color:${ink};margin:0 0 12px;">${escapeHtml(firstName)}, here's your Offer Blueprint.</h1>
          <p style="font-size:15px;line-height:1.6;color:${ink};margin:0;">${escapeHtml(blueprint.read)}</p>
        </td></tr>
        <tr><td style="padding:0 4px;">${offerCards}</td></tr>
        <tr><td style="padding:12px 4px 8px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${blue};border-radius:8px;">
            <tr><td style="padding:24px;text-align:center;">
              <div style="font-size:17px;font-weight:700;color:#ffffff;margin:0 0 6px;">Want to pressure-test this together?</div>
              <div style="font-size:14px;color:#eaf1fb;margin:0 0 16px;">Book a working call — we'll map the path to building the strongest one.</div>
              <a href="${escapeHtml(env.calBookingUrl)}" style="display:inline-block;background:#ffffff;color:${blueDeep};font-size:14px;font-weight:700;text-decoration:none;padding:12px 26px;border-radius:6px;">Book a call with Expand Lab</a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:24px 4px 0;">
          <p style="font-size:12px;line-height:1.6;color:${muted};margin:0;">You're receiving this because you built your Offer Blueprint at The Expand Lab. The Expand Lab — we architect offers, not hype.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
}

function renderEmailText(blueprint: OfferBlueprint, firstName: string): string {
  const lines = [
    `THE OFFER BLUEPRINT — The Expand Lab`,
    ``,
    `${firstName}, here's your Offer Blueprint.`,
    ``,
    blueprint.read,
    ``,
  ];
  for (const o of blueprint.offers) {
    lines.push(
      `${o.label}: ${o.name}`,
      `  ${o.oneLiner}`,
      `  Format: ${o.format}`,
      `  Who it's for: ${o.whoFor}`,
      `  Transformation: ${o.transformation}`,
      `  Investment: ${o.priceBand}`,
      `  Why it fits: ${o.whyItFits}`,
      ``,
    );
  }
  lines.push(`Want to pressure-test this together? Book a call: ${env.calBookingUrl}`);
  return lines.join("\n");
}

export type EmailStatus = "sent" | "failed";

/** Send the results email (PRD §6.6). Returns status for the DB email_status field. */
export async function sendResultsEmail(
  to: string,
  firstName: string,
  blueprint: OfferBlueprint,
): Promise<EmailStatus> {
  if (!isConfigured.email()) {
    console.warn("[email] RESEND_API_KEY not set — skipping results email.");
    return "failed";
  }
  try {
    const resend = new Resend(env.resendApiKey);
    const { error } = await resend.emails.send({
      from: env.emailFrom,
      to,
      ...(env.emailReplyTo ? { replyTo: env.emailReplyTo } : {}),
      subject: `${firstName}, your Offer Blueprint is ready`,
      html: renderEmailHtml(blueprint, firstName),
      text: renderEmailText(blueprint, firstName),
    });
    if (error) {
      console.error("[email] Resend error:", error);
      return "failed";
    }
    return "sent";
  } catch (err) {
    console.error("[email] send failed:", err instanceof Error ? err.message : err);
    return "failed";
  }
}
