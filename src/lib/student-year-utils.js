import { get6DigitSession } from "@/lib/enrollment-roll-utils";

/**
 * Parses and returns multi-year metadata from student_registrations.session_label.
 * Expected structure in session_label:
 * {
 *   "sessions": { "1": "uuid", "2": "uuid", "3": "uuid" },
 *   "published": { "1": "iso_timestamp", "2": "iso_timestamp", "3": "iso_timestamp" },
 *   "admit_cards": { "1": "iso_timestamp", "2": "iso_timestamp", "3": "iso_timestamp" }
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

  const sessions = {
    1: meta.sessions?.["1"] || meta.sessions?.[1] || student?.exam_session_id || null,
    2: meta.sessions?.["2"] || meta.sessions?.[2] || null,
    3: meta.sessions?.["3"] || meta.sessions?.[3] || null,
  };

  const published = {
    1: meta.published?.["1"] || meta.published?.[1] || (student?.result_published_at || null),
    2: meta.published?.["2"] || meta.published?.[2] || null,
    3: meta.published?.["3"] || meta.published?.[3] || null,
  };

  const admitCards = {
    1: meta.admit_cards?.["1"] || meta.admit_cards?.[1] || (student?.admit_card_generated_at || null),
    2: meta.admit_cards?.["2"] || meta.admit_cards?.[2] || null,
    3: meta.admit_cards?.["3"] || meta.admit_cards?.[3] || null,
  };

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
 * Detects whether a given roll number belongs to 1st, 2nd, or 3rd year.
 */
export function detectYearFromRollNo(student, rollNo) {
  const clean = String(rollNo || "").trim().toUpperCase();
  if (!clean) return 1;

  if (student.roll_no_3rd_year && student.roll_no_3rd_year.toUpperCase() === clean) return 3;
  if (student.roll_no_2nd_year && student.roll_no_2nd_year.toUpperCase() === clean) return 2;
  if (student.roll_no && student.roll_no.toUpperCase() === clean) return 1;

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
