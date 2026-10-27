/**
 * Contact form schema used by the client form. public/api/contact.php applies
 * the same rules on the server, so update both together.
 */
import { projectTypes } from "@/content/services";

export type ContactPayload = {
  name: string;
  email: string;
  company: string;
  projectType: string;
  details: string;
};

export type ContactField = keyof ContactPayload;
export type ContactErrors = Partial<Record<ContactField, string>>;

export const contactLimits = {
  name: { min: 2, max: 100 },
  email: { max: 254 },
  company: { max: 120 },
  details: { min: 20, max: 4000 },
} as const;

// Pragmatic check: something@domain.tld, no spaces.
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function normalizeContact(input: Partial<Record<ContactField, unknown>>): ContactPayload {
  const text = (value: unknown) => (typeof value === "string" ? value.trim() : "");
  return {
    name: text(input.name),
    email: text(input.email),
    company: text(input.company),
    projectType: text(input.projectType),
    details: text(input.details),
  };
}

export function validateField(field: ContactField, value: string): string | undefined {
  switch (field) {
    case "name":
      if (!value) return "Please enter your name.";
      if (value.length < contactLimits.name.min) return "Your name looks too short.";
      if (value.length > contactLimits.name.max) return `Please keep your name under ${contactLimits.name.max} characters.`;
      return undefined;
    case "email":
      if (!value) return "Please enter your work email.";
      if (value.length > contactLimits.email.max || !EMAIL_PATTERN.test(value))
        return "Please enter a valid email address, like name@company.com.";
      return undefined;
    case "company":
      if (value.length > contactLimits.company.max)
        return `Please keep the company name under ${contactLimits.company.max} characters.`;
      return undefined;
    case "projectType":
      if (!value) return "Please choose a project type.";
      if (!projectTypes.includes(value)) return "Please choose a project type from the list.";
      return undefined;
    case "details":
      if (!value) return "Please tell us a little about your project.";
      if (value.length < contactLimits.details.min)
        return `Please add a bit more detail (at least ${contactLimits.details.min} characters).`;
      if (value.length > contactLimits.details.max)
        return `Please keep project details under ${contactLimits.details.max} characters.`;
      return undefined;
  }
}

export function validateContact(payload: ContactPayload): ContactErrors {
  const errors: ContactErrors = {};
  for (const field of Object.keys(payload) as ContactField[]) {
    const error = validateField(field, payload[field]);
    if (error) errors[field] = error;
  }
  return errors;
}

/** Response shape returned by public/api/contact.php. */
export type ContactResponse =
  | { ok: true }
  | { ok: false; error: "validation"; fields: ContactErrors }
  | { ok: false; error: "not_configured" | "delivery_failed" | "bad_request"; message: string };
