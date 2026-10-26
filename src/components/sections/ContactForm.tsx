"use client";

import { ArrowRight, CircleAlert, CircleCheck, Info, LoaderCircle } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { buttonClasses } from "@/components/ui/Button";
import { projectTypes } from "@/content/services";
import {
  contactLimits,
  validateContact,
  validateField,
  type ContactErrors,
  type ContactField,
  type ContactPayload,
  type ContactResponse,
} from "@/lib/contact";
import { cx } from "@/lib/cx";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success" }
  | { state: "error"; message: string; offerEmail: boolean };

const EMPTY: ContactPayload = { name: "", email: "", company: "", projectType: "", details: "" };
const FIELD_ORDER: ContactField[] = ["name", "email", "company", "projectType", "details"];
const subscribeNoop = () => () => {};

const inputClass =
  "block w-full rounded-md border bg-ink-950/60 px-4 text-[0.9375rem] text-fg placeholder:text-subtle " +
  "transition-[border-color,box-shadow] duration-200 hover:border-line-strong " +
  "focus:border-red-500/70 focus:outline-none focus:ring-4 focus:ring-red-500/15";

function Field({
  id,
  label,
  optional,
  error,
  hint,
  children,
}: {
  id: string;
  label: string;
  optional?: boolean;
  error?: string;
  hint?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-medium text-fg">
          {label}
          {optional ? <span className="ml-1.5 font-normal text-subtle">(optional)</span> : null}
        </label>
        {hint}
      </div>
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-2 flex items-start gap-1.5 text-sm text-red-400">
          <CircleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ContactForm({
  submissionsEnabled,
  emailLink,
}: {
  /** False until CONTACT_WEBHOOK_URL is configured; shows a notice above the form. */
  submissionsEnabled: boolean;
  /** Server-rendered mailto link (includes the placeholder label when applicable). */
  emailLink: ReactNode;
}) {
  const [values, setValues] = useState<ContactPayload>(EMPTY);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [touched, setTouched] = useState<Partial<Record<ContactField, boolean>>>({});
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  // Submitting before hydration would fall back to a native GET that puts
  // the visitor's details in the URL, so the button waits for React.
  const hydrated = useSyncExternalStore(subscribeNoop, () => true, () => false);

  useEffect(() => {
    if (status.state === "success") successRef.current?.focus();
  }, [status.state]);

  const update = (field: ContactField, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    // Once a field has been visited, re-validate as the user corrects it.
    if (touched[field]) setErrors((prev) => ({ ...prev, [field]: validateField(field, value.trim()) }));
  };

  const blur = (field: ContactField) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({ ...prev, [field]: validateField(field, values[field].trim()) }));
  };

  const focusFirstError = (fieldErrors: ContactErrors) => {
    const first = FIELD_ORDER.find((field) => fieldErrors[field]);
    if (first) formRef.current?.querySelector<HTMLElement>(`#contact-${first}`)?.focus();
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status.state === "submitting") return;

    const payload: ContactPayload = {
      name: values.name.trim(),
      email: values.email.trim(),
      company: values.company.trim(),
      projectType: values.projectType,
      details: values.details.trim(),
    };
    const fieldErrors = validateContact(payload);
    setTouched({ name: true, email: true, company: true, projectType: true, details: true });
    setErrors(fieldErrors);
    if (Object.keys(fieldErrors).length > 0) {
      focusFirstError(fieldErrors);
      return;
    }

    const honeypot = new FormData(event.currentTarget).get("website");
    setStatus({ state: "submitting" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, website: honeypot ?? "" }),
        signal: AbortSignal.timeout(20_000),
      });
      const result = (await response.json().catch(() => null)) as ContactResponse | null;

      if (response.ok && result?.ok) {
        setStatus({ state: "success" });
        setValues(EMPTY);
        setTouched({});
        setErrors({});
        return;
      }
      if (result && !result.ok && result.error === "validation") {
        setErrors(result.fields);
        setStatus({ state: "idle" });
        focusFirstError(result.fields);
        return;
      }
      if (result && !result.ok && result.error === "not_configured") {
        setStatus({
          state: "error",
          message: "Online submissions aren't connected yet, so your message was not sent.",
          offerEmail: true,
        });
        return;
      }
      setStatus({
        state: "error",
        message: "Something went wrong and your message was not sent. Please try again.",
        offerEmail: true,
      });
    } catch {
      setStatus({
        state: "error",
        message: "We couldn't reach the server. Check your connection and try again.",
        offerEmail: true,
      });
    }
  };

  const describedBy = (field: ContactField, extra?: string) =>
    [errors[field] ? `contact-${field}-error` : null, extra].filter(Boolean).join(" ") || undefined;

  const submitting = status.state === "submitting";
  const detailsLength = values.details.trim().length;
  const fade = reduceMotion ? { opacity: 0 } : { opacity: 0, y: 8 };

  return (
    <div className="relative rounded-lg border border-line bg-ink-800/80 p-6 shadow-card backdrop-blur sm:p-8">
      <AnimatePresence mode="wait" initial={false}>
        {status.state === "success" ? (
          <motion.div
            key="success"
            ref={successRef}
            tabIndex={-1}
            role="status"
            initial={fade}
            animate={{ opacity: 1, y: 0 }}
            exit={fade}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex min-h-[28rem] flex-col items-start justify-center focus:outline-none"
          >
            <span className="grid size-12 place-items-center rounded-full border border-red-500/40 bg-red-500/10 text-red-400">
              <CircleCheck className="size-6" aria-hidden="true" />
            </span>
            <h3 className="mt-6 text-title font-semibold text-fg">Thank you — your message was sent.</h3>
            <p className="mt-3 max-w-md leading-relaxed text-muted">
              We&apos;ve received your project details and will get back to you at the email
              address you provided.
            </p>
            <button
              type="button"
              onClick={() => setStatus({ state: "idle" })}
              className={buttonClasses("secondary", "md", "mt-8")}
            >
              Send another message
            </button>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            ref={formRef}
            noValidate
            onSubmit={onSubmit}
            aria-describedby={submissionsEnabled ? "contact-required-note" : "contact-preview-notice contact-required-note"}
            initial={fade}
            animate={{ opacity: 1, y: 0 }}
            exit={fade}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid gap-5"
          >
            {submissionsEnabled ? null : (
              <div
                id="contact-preview-notice"
                className="flex gap-3 rounded-md border border-blue-300/30 bg-blue-500/10 p-4 text-sm leading-relaxed text-fg"
              >
                <Info className="mt-0.5 size-4 shrink-0 text-blue-300" aria-hidden="true" />
                <p>
                  <strong className="font-semibold">Preview form.</strong> Online submissions
                  aren&apos;t connected yet, so messages sent here won&apos;t reach us.
                </p>
              </div>
            )}

            <p id="contact-required-note" className="text-sm text-subtle">
              All fields are required unless marked optional.
            </p>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="contact-name" label="Name" error={errors.name}>
                <input
                  id="contact-name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  maxLength={contactLimits.name.max}
                  value={values.name}
                  onChange={(e) => update("name", e.target.value)}
                  onBlur={() => blur("name")}
                  aria-invalid={Boolean(errors.name)}
                  aria-describedby={describedBy("name")}
                  className={cx(inputClass, "h-12", errors.name ? "border-red-500/70" : "border-line")}
                />
              </Field>
              <Field id="contact-email" label="Work email" error={errors.email}>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  maxLength={contactLimits.email.max}
                  placeholder="name@company.com"
                  value={values.email}
                  onChange={(e) => update("email", e.target.value)}
                  onBlur={() => blur("email")}
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={describedBy("email")}
                  className={cx(inputClass, "h-12", errors.email ? "border-red-500/70" : "border-line")}
                />
              </Field>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <Field id="contact-company" label="Company" optional error={errors.company}>
                <input
                  id="contact-company"
                  name="company"
                  type="text"
                  autoComplete="organization"
                  maxLength={contactLimits.company.max}
                  value={values.company}
                  onChange={(e) => update("company", e.target.value)}
                  onBlur={() => blur("company")}
                  aria-invalid={Boolean(errors.company)}
                  aria-describedby={describedBy("company")}
                  className={cx(inputClass, "h-12", errors.company ? "border-red-500/70" : "border-line")}
                />
              </Field>
              <Field id="contact-projectType" label="Project type" error={errors.projectType}>
                <select
                  id="contact-projectType"
                  name="projectType"
                  value={values.projectType}
                  onChange={(e) => update("projectType", e.target.value)}
                  onBlur={() => blur("projectType")}
                  aria-invalid={Boolean(errors.projectType)}
                  aria-describedby={describedBy("projectType")}
                  className={cx(
                    inputClass,
                    "h-12 appearance-none bg-[url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='none' stroke='%23A8B4C8' stroke-width='1.6'%3E%3Cpath d='m4 6 4 4 4-4'/%3E%3C/svg%3E\")] bg-[position:right_1rem_center] bg-no-repeat pr-10",
                    !values.projectType && "text-subtle",
                    errors.projectType ? "border-red-500/70" : "border-line",
                  )}
                >
                  <option value="" disabled>
                    Select a project type
                  </option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type} className="bg-ink-900 text-fg">
                      {type}
                    </option>
                  ))}
                </select>
              </Field>
            </div>

            <Field
              id="contact-details"
              label="Project details"
              error={errors.details}
              hint={
                <span id="contact-details-count" className="font-mono text-xs text-subtle" aria-live="off">
                  {detailsLength}/{contactLimits.details.max}
                </span>
              }
            >
              <textarea
                id="contact-details"
                name="details"
                rows={5}
                maxLength={contactLimits.details.max}
                placeholder="What are you building, who is it for, and where are you today?"
                value={values.details}
                onChange={(e) => update("details", e.target.value)}
                onBlur={() => blur("details")}
                aria-invalid={Boolean(errors.details)}
                aria-describedby={describedBy("details", "contact-details-count")}
                className={cx(inputClass, "resize-y py-3 leading-relaxed", errors.details ? "border-red-500/70" : "border-line")}
              />
            </Field>

            {/* Honeypot for bots — hidden from people and assistive tech */}
            <div aria-hidden="true" className="absolute -left-[9999px] size-px overflow-hidden">
              <label htmlFor="contact-website">Website</label>
              <input id="contact-website" name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <div role="alert" aria-live="assertive">
              {status.state === "error" ? (
                <div className="flex gap-3 rounded-md border border-red-500/40 bg-red-500/10 p-4 text-sm leading-relaxed text-fg">
                  <CircleAlert className="mt-0.5 size-4 shrink-0 text-red-400" aria-hidden="true" />
                  <p>
                    {status.message}
                    {status.offerEmail ? (
                      <>
                        {" "}
                        You can also email us directly at {emailLink}.
                      </>
                    ) : null}
                  </p>
                </div>
              ) : null}
            </div>

            <div className="flex flex-col-reverse gap-4 pt-1 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-relaxed text-subtle">
                We only use your details to respond to this enquiry.
              </p>
              <button
                type="submit"
                disabled={submitting || !hydrated}
                className={buttonClasses("primary", "lg", "w-full sm:w-auto")}
              >
                {submitting ? (
                  <>
                    <LoaderCircle className="size-4 animate-spin motion-reduce:animate-none" aria-hidden="true" />
                    Sending…
                  </>
                ) : (
                  <>
                    Send project details
                    <ArrowRight className="size-4" aria-hidden="true" />
                  </>
                )}
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              {submitting ? "Sending your message." : ""}
            </p>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
