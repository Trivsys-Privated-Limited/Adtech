/**
 * Newsletter sign-up rules shared by the client form and /api/newsletter.
 */
import { EMAIL_PATTERN, contactLimits } from "@/lib/contact";

export function validateNewsletterEmail(value: string): string | undefined {
  if (!value) return "Please enter your email address.";
  if (value.length > contactLimits.email.max || !EMAIL_PATTERN.test(value))
    return "Please enter a valid email address, like name@company.com.";
  return undefined;
}

/** Response shape returned by /api/newsletter. */
export type NewsletterResponse =
  | { ok: true }
  | { ok: false; error: "validation"; message: string }
  | { ok: false; error: "not_configured" | "delivery_failed" | "bad_request"; message: string };
