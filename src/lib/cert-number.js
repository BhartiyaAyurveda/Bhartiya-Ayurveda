/** Place of issue printed as "स्थान" on the Registration Certificate, NOC and Affiliation Certificate. */
export const CERT_PLACE = "ऋषिकेश / Rishikesh";

/** Fixed prefixes of the certificate numbers. The admin only types the part after the prefix. */
export const REG_PREFIX = "BAYAPCP/REG/";
export const NOC_PREFIX = "BAYAPCP/NOC/";

/** Letters, digits and / _ . - ; must start with a letter or digit; 1–30 characters. */
const SUFFIX_RE = /^[A-Za-z0-9][A-Za-z0-9/_.-]{0,29}$/;

/** Returns the trimmed suffix if valid, otherwise null. */
export function parseCertSuffix(input) {
  if (typeof input !== "string") return null;
  const s = input.trim();
  if (!SUFFIX_RE.test(s) || s.includes("//")) return null;
  return s;
}

export const regNoFromSuffix = (suffix) => `${REG_PREFIX}${suffix}`;
export const nocNoFromSuffix = (suffix) => `${NOC_PREFIX}${suffix}`;

/** Calendar date (YYYY-MM-DD) of an instant in Indian Standard Time. Today's date when omitted. */
export function istDate(iso) {
  const d = iso ? new Date(iso) : new Date();
  const safe = Number.isNaN(d.getTime()) ? new Date() : d;
  // en-CA formats as YYYY-MM-DD
  return safe.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
}

/** Normalises DD-MM-YYYY, DD/MM/YYYY, YYYY/MM/DD or YYYY-MM-DD into YYYY-MM-DD. Returns the trimmed input if unrecognised. */
export function normalizeDob(dobInput) {
  const trimmed = String(dobInput ?? "").trim();
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return trimmed;

  const dmy = trimmed.match(/^(\d{1,2})[-/](\d{1,2})[-/](\d{4})$/);
  if (dmy) return `${dmy[3]}-${dmy[2].padStart(2, "0")}-${dmy[1].padStart(2, "0")}`;

  const ymd = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (ymd) return `${ymd[1]}-${ymd[2].padStart(2, "0")}-${ymd[3].padStart(2, "0")}`;

  return trimmed;
}

// ───────────── Affiliation certificate (institutes) ─────────────

/** Fixed prefix of every Affiliation No. The admin only types the part after it, e.g. "UP-2044". */
export const AFFIL_PREFIX = "BAYAPCP-";
export const AFFIL_SUFFIX_MAX = 35;

/** Letters, digits, spaces and / _ . - ; must start with a letter or digit; 1–35 characters. */
const AFFIL_SUFFIX_RE = /^[A-Z0-9][A-Z0-9 /_.-]{0,34}$/;

/**
 * Builds the full Affiliation No. from what the admin typed after the fixed prefix, upper-cased.
 * A pasted full number is accepted too: a leading "BAYAPCP-" is dropped, never doubled.
 * Returns e.g. "BAYAPCP-UP-2044", or null if invalid.
 */
export function parseAffilCertNo(input) {
  if (typeof input !== "string") return null;
  let s = input.trim().replace(/\s+/g, " ").toUpperCase();
  if (s.startsWith(AFFIL_PREFIX)) s = s.slice(AFFIL_PREFIX.length).trim();
  if (!AFFIL_SUFFIX_RE.test(s) || s.includes("//")) return null;
  return AFFIL_PREFIX + s;
}

/** The editable part of a saved Affiliation No. (without the prefix). */
export function affilSuffixOf(certNo) {
  if (!certNo) return "";
  return certNo.toUpperCase().startsWith(AFFIL_PREFIX) ? certNo.slice(AFFIL_PREFIX.length) : certNo;
}

/** Max length of a person's name printed on a certificate (e.g. Director / Principal). */
export const PERSON_NAME_MAX = 80;
/** Letters (any script, incl. Hindi), digits, spaces and . , ' ( ) / - ; must start with a letter. */
const PERSON_NAME_RE = /^\p{L}[\p{L}\p{M}\p{N} .,'()/-]*$/u;

/**
 * Validates a person's name typed by the admin for a certificate.
 * Returns the trimmed name, "" when left blank (field cleared), or null when invalid.
 */
export function parsePersonName(input) {
  if (typeof input !== "string") return null;
  const s = input.trim().replace(/\s+/g, " ");
  if (s === "") return "";
  if (s.length > PERSON_NAME_MAX || !PERSON_NAME_RE.test(s)) return null;
  return s;
}

/** A real calendar date as YYYY-MM-DD, "" when left blank, or null when invalid. */
export function parseDateOnly(input) {
  if (typeof input !== "string") return null;
  const s = input.trim();
  if (s === "") return "";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return null;
  const d = new Date(`${s}T00:00:00Z`);
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s ? s : null;
}
