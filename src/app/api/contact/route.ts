import {
  normalizeContact,
  validateContact,
  type ContactField,
  type ContactResponse,
} from "@/lib/contact";

/**
 * Contact form integration boundary.
 *
 * Submissions are validated here, then forwarded as JSON to the URL in the
 * server-only CONTACT_WEBHOOK_URL environment variable (e.g. a CRM, Zapier,
 * Make, Slack workflow, or your own email service endpoint). If
 * CONTACT_WEBHOOK_SECRET is set it is sent as a Bearer token.
 *
 * Without a webhook configured, the endpoint responds 503 so the UI can tell
 * the visitor honestly that online submission isn't connected yet.
 */

const MAX_BODY_BYTES = 16_000;

function json(body: ContactResponse, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "bad_request", message: "The message is too large." }, 413);
  }

  let body: Partial<Record<ContactField | "website", unknown>>;
  try {
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "bad_request", message: "Invalid request body." }, 400);
  }

  // Honeypot: real visitors never see or fill the "website" field.
  // Bots get a generic 200 and nothing is forwarded.
  if (typeof body.website === "string" && body.website.trim() !== "") {
    return json({ ok: true }, 200);
  }

  const payload = normalizeContact(body);
  const fields = validateContact(payload);
  if (Object.keys(fields).length > 0) {
    return json({ ok: false, error: "validation", fields }, 422);
  }

  const webhookUrl = process.env.CONTACT_WEBHOOK_URL;
  if (!webhookUrl) {
    return json(
      {
        ok: false,
        error: "not_configured",
        message: "Online submissions aren't connected yet.",
      },
      503,
    );
  }

  try {
    const secret = process.env.CONTACT_WEBHOOK_SECRET;
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
      },
      body: JSON.stringify({ ...payload, source: "adtech-website", submittedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
  } catch (error) {
    console.error("[contact] delivery failed:", error);
    return json(
      { ok: false, error: "delivery_failed", message: "We couldn't deliver your message." },
      502,
    );
  }

  return json({ ok: true }, 200);
}
