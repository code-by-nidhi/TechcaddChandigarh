/**
 * Shared between the browser and the API route, so this file stays free of
 * Node imports — the database work lives in `lib/db.ts`.
 *
 * Every form on the site posts the same shape to `/api/enquiry`. Note the
 * naming: the `enquiries` table already has a `source` column meaning the lead
 * *channel* ('website', 'walk-in', 'phone', …), so which form a lead came from
 * is `formType`, matching the column of that name.
 */

export type EnquiryFormType =
  | "career-start"
  | "book-demo-modal"
  | "enquiry-form"
  | "quick-demo"
  | "future-career";

export interface EnquiryInput {
  formType: EnquiryFormType;
  phone: string;
  name?: string;
  email?: string;
  course?: string;
  branch?: string;
  message?: string;
  /** Which page the form was submitted from, for attribution. */
  pagePath?: string;
}

export const MESSAGE_MAX = 2000;

const FORM_TYPES: readonly EnquiryFormType[] = [
  "career-start",
  "book-demo-modal",
  "enquiry-form",
  "quick-demo",
  "future-career",
];

/**
 * Reduces anything a visitor might type — "+91 98765 43210", "098765-43210" —
 * to the bare 10 digits we store.
 */
export function normalizePhone(value: string): string {
  const digits = value.replace(/\D/g, "");
  if (digits.length === 12 && digits.startsWith("91")) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith("0")) return digits.slice(1);
  return digits;
}

/** Indian mobile numbers are 10 digits starting 6-9. */
export function isValidPhone(value: string): boolean {
  return /^[6-9]\d{9}$/.test(normalizePhone(value));
}

export function isValidEmail(value: string): boolean {
  return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
}

export interface ValidEnquiry {
  formType: EnquiryFormType;
  phone: string;
  name: string | null;
  email: string | null;
  course: string | null;
  branch: string | null;
  message: string | null;
  pagePath: string | null;
}

/**
 * Validates an untrusted payload. Returns either the row to insert or the
 * message to show the visitor — the API route trusts nothing the client sends,
 * since the forms' own checks are only a convenience.
 */
export function validateEnquiry(
  payload: unknown,
): { ok: true; value: ValidEnquiry } | { ok: false; error: string } {
  if (typeof payload !== "object" || payload === null) {
    return { ok: false, error: "Invalid request." };
  }

  const body = payload as Record<string, unknown>;
  const text = (key: string, max: number): string | null => {
    const raw = body[key];
    if (typeof raw !== "string") return null;
    const trimmed = raw.trim();
    return trimmed ? trimmed.slice(0, max) : null;
  };

  const formType = body.formType;
  if (typeof formType !== "string" || !FORM_TYPES.includes(formType as EnquiryFormType)) {
    return { ok: false, error: "Invalid request." };
  }

  const rawPhone = typeof body.phone === "string" ? body.phone : "";
  if (!isValidPhone(rawPhone)) {
    return { ok: false, error: "Please enter a valid 10-digit mobile number." };
  }

  const email = text("email", 254);
  if (email && !isValidEmail(email)) {
    return { ok: false, error: "Please enter a valid email address." };
  }

  return {
    ok: true,
    value: {
      formType: formType as EnquiryFormType,
      phone: normalizePhone(rawPhone),
      name: text("name", 120),
      email,
      course: text("course", 80),
      branch: text("branch", 80),
      message: text("message", MESSAGE_MAX),
      pagePath: text("pagePath", 500),
    },
  };
}

/**
 * Posts a lead from any of the forms. Never throws — a form should show a
 * friendly message rather than break, so network failures come back as `ok:
 * false` like any other rejection.
 */
export async function submitEnquiry(
  input: EnquiryInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const response = await fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...input,
        pagePath: input.pagePath ?? window.location.pathname,
      }),
    });

    const data = (await response.json().catch(() => null)) as { error?: string } | null;

    if (!response.ok) {
      return {
        ok: false,
        error: data?.error ?? "Something went wrong. Please try again or call us.",
      };
    }
    return { ok: true };
  } catch {
    return {
      ok: false,
      error: "Could not reach the server. Please check your connection and try again.",
    };
  }
}
