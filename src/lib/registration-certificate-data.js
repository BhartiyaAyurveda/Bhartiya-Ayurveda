import { supabaseAdmin } from "@/lib/supabase";
import { regNoFromSuffix, istDate } from "@/lib/cert-number";

/** Number of years a registration certificate stays valid from the registration date. */
export const REGISTRATION_VALIDITY_YEARS = 5;

function addYears(isoDate, years) {
  const d = new Date(`${isoDate}T00:00:00Z`);
  d.setUTCFullYear(d.getUTCFullYear() + years);
  // Validity ends the day before the anniversary (e.g. 06/04/2023 -> 05/04/2028)
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Hindi salutation / relation words from the gender on record. */
export function hindiPersonWords(gender) {
  const g = String(gender ?? "").trim().toLowerCase();
  if (g.startsWith("f")) return { salutation: "सुश्री", relation: "पुत्री" };
  if (g.startsWith("m")) return { salutation: "श्री", relation: "पुत्र" };
  return { salutation: "श्री / सुश्री", relation: "पुत्र / पुत्री" };
}

/** Joins address parts, dropping blanks and repeats (e.g. city == district). */
function joinAddress(parts) {
  const seen = new Set();
  const out = [];
  for (const p of parts) {
    const v = typeof p === "string" ? p.trim() : "";
    if (!v || seen.has(v.toLowerCase())) continue;
    seen.add(v.toLowerCase());
    out.push(v);
  }
  return out.join(", ");
}

/**
 * Registration certificate for one student. Nothing is returned until the admin has
 * set a certificate number for that student (reg_cert_suffix).
 */
export async function getRegistrationCertificateData(registrationId) {
  const { data: reg, error } = await supabaseAdmin
    .from("student_registrations")
    .select(
      "enrollment_no, candidate_name, father_name, gender, dob, photo_url, status, address, city, district, state, pincode, academic_session, session_label, created_at, reg_cert_suffix, reg_cert_issued_at, courses(course_name), colleges(college_name)"
    )
    .eq("id", registrationId)
    .single();

  if (error) {
    console.error("getRegistrationCertificateData error:", error.message);
    return { data: null, error: "Certificate is not available right now. Please try again later." };
  }
  if (!reg) return { data: null, error: "Registration not found" };

  if (reg.status !== "approved") {
    return {
      data: null,
      error: "Your registration has not been approved yet. Certificate is available only after approval.",
    };
  }

  if (!reg.enrollment_no) {
    return { data: null, error: "Enrollment number has not been allotted yet" };
  }

  // The admin decides who gets the certificate: nothing is shown until a number has been set.
  const suffix = (reg.reg_cert_suffix || "").trim();
  if (!suffix) {
    return {
      data: null,
      error: "Your Registration Certificate has not been issued yet. Please contact your college or the Parishad.",
    };
  }

  // session_label can hold per-year JSON metadata, so only use it when it is a plain label.
  const plainLabel = reg.session_label && !String(reg.session_label).trim().startsWith("{") ? reg.session_label : null;
  const registrationDate = istDate(reg.reg_cert_issued_at ?? reg.created_at);
  const words = hindiPersonWords(reg.gender);

  return {
    data: {
      certificate_no: regNoFromSuffix(suffix),
      enrollment_no: reg.enrollment_no,
      candidate_name: reg.candidate_name,
      father_name: reg.father_name,
      salutation: words.salutation,
      relation: words.relation,
      address: joinAddress([reg.address, reg.city, reg.district, reg.state, reg.pincode]) || "—",
      dob: reg.dob,
      course: reg.courses?.course_name?.trim() || "—",
      institution_name: reg.colleges?.college_name || "—",
      academic_session: reg.academic_session || plainLabel || null,
      photo_url: reg.photo_url,
      registration_date: registrationDate,
      valid_upto: addYears(registrationDate, REGISTRATION_VALIDITY_YEARS),
    },
    error: null,
  };
}
