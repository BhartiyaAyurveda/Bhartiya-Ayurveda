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
