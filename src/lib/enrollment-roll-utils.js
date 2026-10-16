/**
 * Enrollment Number and Roll Number generation utilities.
 *
 * 1. Enrollment Number (पंजीकरण संख्या):
 *    Pattern: [ORG_PREFIX] + [COLLEGE_CODE] + [SESSION_DIGITS] + [SEQUENCE_NO]
 *    Example: BAI + 01 + 2324 + 01 = BAI01232401
 *
 * 2. Roll Number (अनुक्रमांक):
 *    Pattern: [COLLEGE_INITIALS] + [6_DIGIT_SESSION] + [SEQUENCE_NO]
 *    Example: NPC + 202324 + 01 = NPC20232401
 *    - 1st Year: roll_no
 *    - 2nd Year: roll_no_2nd_year
 */

/**
 * 4-digit session code for Enrollment Number (e.g., "2023-2024" -> "2324")
 */
export function extractSessionDigits(academicSession) {
  if (!academicSession) {
    const y = new Date().getFullYear();
    return `${String(y).slice(-2)}${String(y + 1).slice(-2)}`;
  }
  const matches = String(academicSession).match(/\d{4}/g);
  if (matches && matches.length >= 2) {
    return matches[0].slice(-2) + matches[1].slice(-2);
  } else if (matches && matches.length === 1) {
    const y1 = parseInt(matches[0].slice(-2), 10);
    const y2 = (y1 + 1) % 100;
    return `${matches[0].slice(-2)}${String(y2).padStart(2, "0")}`;
  }
  return "2324";
}

/**
 * 6-digit session string for Roll Number (e.g., "2023-2024" -> "202324")
 * Start year (4 digits) + End year (last 2 digits)
 */
export function get6DigitSession(sessionStr) {
  if (!sessionStr) {
    const y = new Date().getFullYear();
    return `${y}${String(y + 1).slice(-2)}`;
  }
  const fullMatch = String(sessionStr).match(/(\d{4})[^\d]*(\d{2,4})/);
  if (fullMatch) {
    const y1 = fullMatch[1];
    const y2 = fullMatch[2].slice(-2);
    return `${y1}${y2}`;
  }
  const single = String(sessionStr).match(/\d{4}/);
  if (single) {
    const y1 = parseInt(single[0], 10);
    return `${y1}${String((y1 + 1) % 100).padStart(2, "0")}`;
  }
  return "202324";
}

/**
 * Derive college abbreviation/initials from college name (comma se pehle ka portion)
 * e.g., "National Paramedical College, Patna" -> "NPC"
 * e.g., "Apex Institute of Ayurvedic Sciences" -> "AIAS"
 */
export function deriveCollegePrefix(collegeName, fallback = "BAI") {
  if (!collegeName) return fallback;
  const namePart = collegeName.split(",")[0].trim();
  const initials = namePart
    .split(/[\s-]+/)
    .filter((w) => w.length > 0)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return initials || fallback;
}

/**
 * Generate unique enrollment number for a college and session
 */
export async function generateEnrollmentNumber(db, collegeCodeRaw, academicSession, orgPrefix = "BAI") {
  const collegeCode = String(collegeCodeRaw || "01")
    .trim()
    .padStart(2, "0")
    .slice(-2);
  const sessionDigits = extractSessionDigits(academicSession);
  const prefix = `${orgPrefix}${collegeCode}${sessionDigits}`;

  // Query latest student with this prefix
  const { data: latest } = await db
    .from("student_registrations")
    .select("enrollment_no")
    .like("enrollment_no", `${prefix}%`)
    .order("enrollment_no", { ascending: false })
    .limit(1);

  let nextSeq = 1;
  if (latest && latest.length > 0 && latest[0]?.enrollment_no) {
    const lastSeqStr = latest[0].enrollment_no.slice(prefix.length);
    const parsed = parseInt(lastSeqStr, 10);
    if (!isNaN(parsed)) nextSeq = parsed + 1;
  }

  // Minimum 2 digits zero-padded (e.g. 01, 02... 99, 100)
  const seqStr = String(nextSeq).padStart(2, "0");
  return `${prefix}${seqStr}`;
}

/**
 * Compute the next academic session string (e.g. "2023-24" -> "2024-25")
 */
export function getNextSession(sessionStr) {
  if (!sessionStr) return "";
  const m = String(sessionStr).match(/(\d{4})[^\d]*(\d{2,4})/);
  if (m) {
    const y1 = parseInt(m[1], 10);
    const y2Str = m[2];
    const isTwoDigit = y2Str.length === 2;
    const nextY1 = y1 + 1;
    const nextY2 = (parseInt(y2Str.slice(-2), 10) + 1) % 100;
    if (isTwoDigit) {
      return `${nextY1}-${String(nextY2).padStart(2, "0")}`;
    } else {
      return `${nextY1}-${nextY1 + 1}`;
    }
  }
  const single = String(sessionStr).match(/\d{4}/);
  if (single) {
    const y = parseInt(single[0], 10);
    return `${y + 1}-${String((y + 2) % 100).padStart(2, "0")}`;
  }
  return "";
}

/**
 * Compute the previous academic session string (e.g. "2024-25" -> "2023-24")
 */
export function getPrevSession(sessionStr) {
  if (!sessionStr) return "";
  const m = String(sessionStr).match(/(\d{4})[^\d]*(\d{2,4})/);
  if (m) {
    const y1 = parseInt(m[1], 10);
    const y2Str = m[2];
    const isTwoDigit = y2Str.length === 2;
    const prevY1 = y1 - 1;
    const prevY2 = (parseInt(y2Str.slice(-2), 10) - 1 + 100) % 100;
    if (isTwoDigit) {
      return `${prevY1}-${String(prevY2).padStart(2, "0")}`;
    } else {
      return `${prevY1}-${prevY1 + 1}`;
    }
  }
  const single = String(sessionStr).match(/\d{4}/);
  if (single) {
    const y = parseInt(single[0], 10);
    return `${y - 1}-${String(y % 100).padStart(2, "0")}`;
  }
  return "";
}

