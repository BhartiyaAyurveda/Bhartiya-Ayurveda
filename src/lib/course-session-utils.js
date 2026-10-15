/**
 * Shared utilities for course duration and session label handling.
 * Supports 1-year (2 semesters) and 2-year (4 semesters) course structures.
 */

export const DURATION_LABELS = {
  "1 Year":  { years: 1, semesters: 2 },
  "2 Years": { years: 2, semesters: 4 },
  "6 Months": { years: 0.5, semesters: 1 },
  "3 Years": { years: 3, semesters: 6 },
};

/**
 * Given a duration label and start year, returns an array of session labels.
 * e.g. "1 Year", 2024 → ["2024-2025 (Semester I)", "2024-2025 (Semester II)"]
 */
export function getSessionLabels(durationLabel, startYear) {
  const config = DURATION_LABELS[durationLabel];
  if (!config) return [];

  const endYear = startYear + Math.ceil(config.years);
  const academicYear = `${startYear}-${endYear}`;

  return Array.from({ length: config.semesters }, (_, i) => ({
    semester: i + 1,
    label: `${academicYear} (Semester ${toRoman(i + 1)})`,
    academic_year: academicYear,
  }));
}

/**
 * Parses a session_label string and extracts year range and semester.
 * e.g. "2024-2025 (Semester II)" → { year: "2024-2025", semester: 2 }
 */
export function parseSessionLabel(label) {
  if (!label) return null;
  const match = label.match(/^(\d{4}-\d{4})(?:\s*\(Semester\s+([IVX]+)\))?/);
  if (!match) return { year: label, semester: null };
  return {
    year: match[1],
    semester: match[2] ? fromRoman(match[2]) : null,
  };
}

/**
 * Returns true if this is a final-semester label for the given duration.
 */
export function isFinalSemester(sessionLabel, durationLabel) {
  const config = DURATION_LABELS[durationLabel];
  if (!config) return false;
  const parsed = parseSessionLabel(sessionLabel);
  return parsed?.semester === config.semesters;
}

/**
 * Returns the academic year string for the current date.
 * Academic year starts in July: July 2024 → "2024-2025"
 */
export function currentAcademicYear() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1; // 1-indexed
  return month >= 7 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

function toRoman(n) {
  const map = [[4,"IV"],[1,"I"],[9,"IX"],[5,"V"],[40,"XL"],[10,"X"],[90,"XC"],[50,"L"],[400,"CD"],[100,"C"],[900,"CM"],[500,"D"],[1000,"M"]];
  let result = "";
  for (const [val, sym] of map.sort((a, b) => b[0] - a[0])) {
    while (n >= val) { result += sym; n -= val; }
  }
  return result;
}

function fromRoman(s) {
  const vals = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 };
  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const cur = vals[s[i]] || 0;
    const next = vals[s[i + 1]] || 0;
    total += cur < next ? -cur : cur;
  }
  return total;
}
