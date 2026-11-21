/**
 * student_registrations.session_label holds per-year JSON metadata ({"sessions":{...},"published":{...}})
 * once roll numbers are allotted, so it must never be shown to people or edited as text.
 * The human-readable session lives in academic_session (e.g. "2022-2023").
 */
const isJsonLike = (v) => typeof v === "string" && v.trim().startsWith("{");

/** Readable session for a registration, or "" when none is on record. */
export function plainSession(reg) {
  const academic = reg?.academic_session;
  if (academic && !isJsonLike(academic)) return String(academic).trim();
  const label = reg?.session_label;
  if (label && !isJsonLike(label)) return String(label).trim();
  return "";
}
