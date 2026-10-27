import { validateNewsletterEmail, type NewsletterResponse } from "@/lib/newsletter";

/**
 * Newsletter integration boundary.
 *
 * Sign-ups are validated here, then forwarded as JSON to the server-only
 * NEWSLETTER_WEBHOOK_URL (e.g. a Zapier/Make webhook that adds the contact to
 * your email platform, or your own endpoint). If NEWSLETTER_WEBHOOK_SECRET is
 * set it is sent as a Bearer token. Use double opt-in at the provider so an
 * address only joins the list after its owner confirms.
 *
 * Without a webhook configured, the endpoint responds 503 so the UI can say
 * honestly that the visitor has not been subscribed.
 */

const MAX_BODY_BYTES = 2_000;

function json(body: NewsletterResponse, status: number) {
  return Response.json(body, { status });
}

export async function POST(request: Request) {
  const raw = await request.text();
  if (raw.length > MAX_BODY_BYTES) {
    return json({ ok: false, error: "bad_request", message: "The request is too large." }, 413);
  }

  let body: { email?: unknown; website?: unknown };
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

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const error = validateNewsletterEmail(email);
  if (error) {
    return json({ ok: false, error: "validation", message: error }, 422);
  }

  const webhookUrl = process.env.NEWSLETTER_WEBHOOK_URL;
  if (!webhookUrl) {
    return json(
      { ok: false, error: "not_configured", message: "Newsletter sign-up isn't connected yet." },
      503,
    );
  }

  try {
    const secret = process.env.NEWSLETTER_WEBHOOK_SECRET;
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(secret ? { Authorization: `Bearer ${secret}` } : {}),
      },
      body: JSON.stringify({ email, source: "adtech-website", subscribedAt: new Date().toISOString() }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!response.ok) throw new Error(`Webhook responded ${response.status}`);
  } catch (error) {
    console.error("[newsletter] delivery failed:", error);
    return json(
      { ok: false, error: "delivery_failed", message: "We couldn't complete your sign-up." },
      502,
    );
  }

  return json({ ok: true }, 200);
}
