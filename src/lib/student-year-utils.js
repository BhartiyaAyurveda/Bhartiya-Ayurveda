import { get6DigitSession } from "@/lib/enrollment-roll-utils";

/**
 * Courses can run up to 4 years (e.g. BEMS, BAMS-AM). Each year has its own
 * roll number column on student_registrations.
 */
export const MAX_YEAR = 4;
export const YEARS = [1, 2, 3, 4];

export const ROLL_FIELDS = {
  1: "roll_no",
  2: "roll_no_2nd_year",
  3: "roll_no_3rd_year",
  4: "roll_no_4th_year",
};

/** Comma separated column list for .select() calls. */
export const ROLL_SELECT = YEARS.map((y) => ROLL_FIELDS[y]).join(", ");

/** PostgREST .or() filter: any roll column contains the given session digits. */
export function rollIlikeFilter(digits) {
  return YEARS.map((y) => `${ROLL_FIELDS[y]}.ilike.%${digits}%`).join(",");
}

/** PostgREST .or() filter: any roll column equals the given value. */
export function rollEqFilter(value) {
  return YEARS.map((y) => `${ROLL_FIELDS[y]}.eq.${value}`).join(",");
}

/** PostgREST .or() filter: at least one roll column is set. */
export const ROLL_ANY_SET_FILTER = YEARS.map((y) => `${ROLL_FIELDS[y]}.not.is.null`).join(",");

/** Normalises "4", 4, "4th", "fourth", "final", "3rd Year" ... to 1-4 (defaults to 1). */
export function parseYear(value) {
  const s = String(value ?? "").trim().toLowerCase();
  if (!s) return 1;
  if (s.startsWith("4") || s.startsWith("four") || s.startsWith("final")) return 4;
  if (s.startsWith("3") || s.startsWith("third")) return 3;
  if (s.startsWith("2") || s.startsWith("second")) return 2;
  return 1;
}

/** Like parseYear but returns null when nothing recognisable was supplied. */
export function parseYearOrNull(value) {
  const s = String(value ?? "").trim().toLowerCase();
  if (!s) return null;
  if (/^(4|four|final)/.test(s) || /^(3|third)/.test(s) || /^(2|second)/.test(s) || /^(1|first)/.test(s)) {
    return parseYear(s);
  }
  return null;
}

export function rollFieldForYear(year) {
  return ROLL_FIELDS[parseYear(year)];
}

export function yearOrdinal(year) {
  return ["", "1st", "2nd", "3rd", "4th"][Number(year)] || "1st";
}

/** Wording used on marksheets / admit cards: First, Second, Third, Fourth / Final Year */
export function yearTitle(year) {
  return ["", "First Year", "Second Year", "Third Year", "Fourth / Final Year"][Number(year)] || "First Year";
}

/** e.g. "4th Year" */
export function yearLabel(year) {
  return `${yearOrdinal(year)} Year`;
}

/** Highest year for which a roll number has been allotted (1 if none). */
export function latestYear(student) {
  for (let y = MAX_YEAR; y >= 2; y--) {
    if (student?.[ROLL_FIELDS[y]]) return y;
  }
  return 1;
}

/** Roll number for a year. Years 2+ fall back to the 1st-year roll number (legacy behaviour). */
export function rollNoForYear(student, year) {
  const y = Number(year) || 1;
  const own = student?.[ROLL_FIELDS[y]];
  if (y === 1) return own || null;
  return own || student?.roll_no || null;
}

/** Closest earlier-year roll number (used to inherit the college initials). */
export function previousRollNo(student, year) {
  for (let y = Number(year) - 1; y >= 1; y--) {
    const v = student?.[ROLL_FIELDS[y]];
    if (v) return v;
  }
  return null;
}

/**
 * Which year a student is sitting in a given exam session: the highest year whose roll number
 * contains the session digits, otherwise the latest allotted year.
 */
export function pickYearForSession(student, sessionDigits) {
  if (sessionDigits) {
    for (let y = MAX_YEAR; y >= 1; y--) {
      const v = student?.[ROLL_FIELDS[y]];
      if (v && String(v).includes(sessionDigits)) return y;
    }
  }
  return latestYear(student);
}

/** Course length in whole years from a label such as "4 Years" (null when unknown). */
export function courseYears(durationLabel) {
  const m = String(durationLabel ?? "").match(/(\d+(?:\.\d+)?)\s*(?:year|yr)/i);
  return m ? Math.ceil(parseFloat(m[1])) : null;
}

/**
 * Parses and returns multi-year metadata from student_registrations.session_label.
 * Expected structure in session_label:
 * {
 *   "sessions": { "1": "uuid", "2": "uuid", "3": "uuid", "4": "uuid" },
 *   "published": { "1": "iso_timestamp", ... },
 *   "admit_cards": { "1": "iso_timestamp", ... }
 * }
 */
export function getStudentYearMeta(student) {
  let meta = {};
  if (student?.session_label && typeof student.session_label === "string" && student.session_label.trim().startsWith("{")) {
    try {
      meta = JSON.parse(student.session_label);
    } catch {
      meta = {};
    }
  }

  const sessions = {};
  const published = {};
  const admitCards = {};

  for (const y of YEARS) {
    sessions[y] = meta.sessions?.[String(y)] || meta.sessions?.[y] || (y === 1 ? student?.exam_session_id : null) || null;
    published[y] = meta.published?.[String(y)] || meta.published?.[y] || (y === 1 ? student?.result_published_at : null) || null;
    admitCards[y] = meta.admit_cards?.[String(y)] || meta.admit_cards?.[y] || (y === 1 ? student?.admit_card_generated_at : null) || null;
  }

  return { sessions, published, admitCards };
}

/**
 * Builds a serialized JSON string to store in student_registrations.session_label.
 */
export function buildStudentYearMeta(student, updates = {}) {
  const current = getStudentYearMeta(student);

  const newSessions = { ...current.sessions, ...(updates.sessions || {}) };
  const newPublished = { ...current.published, ...(updates.published || {}) };
  const newAdmitCards = { ...current.admitCards, ...(updates.admitCards || {}) };

  return JSON.stringify({
    sessions: newSessions,
    published: newPublished,
    admit_cards: newAdmitCards,
  });
}

/**
 * Detects whether a given roll number belongs to the 1st, 2nd, 3rd or 4th year.
 */
export function detectYearFromRollNo(student, rollNo) {
  const clean = String(rollNo || "").trim().toUpperCase();
  if (!clean) return 1;

  for (let y = MAX_YEAR; y >= 1; y--) {
    const v = student?.[ROLL_FIELDS[y]];
    if (v && String(v).toUpperCase() === clean) return y;
  }

  return 1;
}

/**
 * Checks if a specific year result is published for a student.
 */
export function isYearResultPublished(student, year) {
  const y = Number(year) || 1;
  const meta = getStudentYearMeta(student);
  if (meta.published[y]) return true;

  // Fallback: If legacy single result_published_at exists and student only has year 1
  if (y === 1 && !student.roll_no_2nd_year && student.result_published_at) {
    return true;
  }

  return false;
}
