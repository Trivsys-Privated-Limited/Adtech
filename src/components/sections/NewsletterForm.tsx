"use client";

import { ArrowRight, CircleAlert, CircleCheck, Info, LoaderCircle } from "lucide-react";
import Link from "next/link";
import { useState, useSyncExternalStore, type FormEvent } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { contactLimits } from "@/lib/contact";
import { cx } from "@/lib/cx";
import { validateNewsletterEmail, type NewsletterResponse } from "@/lib/newsletter";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string };

const subscribeNoop = () => () => {};

export function NewsletterForm({
  signupsEnabled,
}: {
  /** False until NEWSLETTER_WEBHOOK_URL is configured; shows a preview notice. */
  signupsEnabled: boolean;
}) {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState<string>();
  const [touched, setTouched] = useState(false);
  const [status, setStatus] = useState<Status>({ state: "idle" });
  // Same as the contact form: never let a pre-hydration submit fall back to a native GET.
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.state === "submitting") return;

    const value = email.trim();
    const error = validateNewsletterEmail(value);
    setTouched(true);
    setFieldError(error);
    if (error) {
      event.currentTarget.querySelector<HTMLInputElement>("#newsletter-email")?.focus();
      return;
    }

    const honeypot = new FormData(event.currentTarget).get("website");
    setStatus({ state: "submitting" });

    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value, website: honeypot ?? "" }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = (await response.json().catch(() => null)) as NewsletterResponse | null;

      if (response.ok && result?.ok) {
        setStatus({ state: "success" });
        setEmail("");
        setTouched(false);
        return;
      }
      if (result && !result.ok && result.error === "validation") {
        setFieldError(result.message);
        setStatus({ state: "idle" });
        return;
      }
      if (result && !result.ok && result.error === "not_configured") {
        setStatus({
          state: "error",
          message: "Newsletter sign-up isn't connected yet, so you have not been subscribed.",
        });
        return;
      }
      setStatus({ state: "error", message: "Something went wrong and you have not been subscribed. Please try again." });
    } catch {
      setStatus({ state: "error", message: "We couldn't reach the server. Check your connection and try again." });
    }
  };

  if (status.state === "success") {
    return (
      <div role="status" className="flex items-start gap-3 rounded-md border border-line bg-ink-800/80 p-4 text-sm leading-relaxed text-fg">
        <CircleCheck className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden="true" />
        <p>
          <strong className="font-semibold">Thanks, your sign-up was received.</strong> Look out
          for an email from us at the address you entered.
        </p>
      </div>
    );
  }

  const submitting = status.state === "submitting";
  const describedBy = [fieldError ? "newsletter-email-error" : null, "newsletter-note"]
    .concat(signupsEnabled ? [] : ["newsletter-preview-notice"])
    .filter(Boolean)
    .join(" ");

  return (
    <form noValidate onSubmit={onSubmit} aria-label="Newsletter sign-up" className="relative">
      <label htmlFor="newsletter-email" className="text-sm font-medium text-fg">
        Email address
      </label>
      <div className="mt-2 flex flex-col gap-3 sm:flex-row">
        <input
          id="newsletter-email"
          name="email"
          type="email"
          inputMode="email"
          autoComplete="email"
          maxLength={contactLimits.email.max}
          placeholder="name@company.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (touched) setFieldError(validateNewsletterEmail(e.target.value.trim()));
          }}
          onBlur={() => {
            // Don't nag about an empty field the visitor merely tabbed through.
            if (!email.trim()) return;
            setTouched(true);
            setFieldError(validateNewsletterEmail(email.trim()));
          }}
          aria-invalid={Boolean(fieldError)}
          aria-describedby={describedBy}
          className={cx(
            "block h-12 w-full min-w-0 flex-1 rounded-md border bg-ink-950/60 px-4 text-[0.9375rem] text-fg placeholder:text-subtle",
            "transition-[border-color,box-shadow] duration-200 hover:border-line-strong",
            "focus:border-red-500/70 focus:outline-none focus:ring-4 focus:ring-red-500/15",
            fieldError ? "border-red-500/70" : "border-line",
          )}
        />
        <button
          type="submit"
          disabled={submitting || !hydrated}
          className={buttonClasses("primary", "lg", "w-full sm:w-auto")}
        >
          {submitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
              Subscribing…
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight className="size-4" aria-hidden="true" />
            </>
          )}
        </button>
      </div>

      {fieldError ? (
        <p id="newsletter-email-error" className="mt-2 flex items-start gap-1.5 text-sm text-red-400">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {fieldError}
        </p>
      ) : null}

      {/* Honeypot for bots — hidden from people and assistive tech */}
      <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
        <label htmlFor="newsletter-website">Website</label>
        <input id="newsletter-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div role="alert" aria-live="assertive">
        {status.state === "error" ? (
          <p className="mt-3 flex gap-2 rounded-md border border-red-500/40 bg-red-500/10 p-3 text-sm leading-relaxed text-fg">
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden="true" />
            {status.message}
          </p>
        ) : null}
      </div>

      {signupsEnabled ? null : (
        <p id="newsletter-preview-notice" className="mt-3 flex gap-2 text-xs leading-relaxed text-muted">
          <Info className="mt-px size-3.5 shrink-0 text-blue-300" aria-hidden="true" />
          <span>
            <strong className="font-semibold text-fg">Preview.</strong> Sign-up isn&apos;t connected
            yet, so you won&apos;t be subscribed.
          </span>
        </p>
      )}
      <p id="newsletter-note" className="mt-3 text-xs leading-relaxed text-subtle">
        We&apos;ll only use your email to send this newsletter. See our{" "}
        <Link href="/privacy-policy" className="underline underline-offset-4 hover:text-fg">
          Privacy Policy
        </Link>
        .
      </p>
      <p className="sr-only" aria-live="polite">
        {submitting ? "Subscribing." : ""}
      </p>
    </form>
  );
}
