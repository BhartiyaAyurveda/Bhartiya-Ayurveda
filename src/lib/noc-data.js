import { supabaseAdmin } from "@/lib/supabase";
import { nocNoFromSuffix, regNoFromSuffix, istDate } from "@/lib/cert-number";
import { hindiPersonWords } from "@/lib/registration-certificate-data";

/**
 * The NOC is available for a student as soon as the admin has set a registration number
 * for them; it carries the same number with the NOC prefix.
 */
export async function getNocData(registrationId) {
  const { data: reg, error } = await supabaseAdmin
    .from("student_registrations")
    .select(
      "enrollment_no, candidate_name, father_name, gender, photo_url, status, created_at, reg_cert_suffix, reg_cert_issued_at, courses(course_name), colleges(college_name)"
    )
    .eq("id", registrationId)
    .single();

  if (error) {
    console.error("getNocData error:", error.message);
    return { data: null, error: "NOC is not available right now. Please try again later." };
  }
  if (!reg) return { data: null, error: "Registration not found" };

  if (reg.status !== "approved") {
    return { data: null, error: "Your registration has not been approved yet." };
  }

  if (!reg.enrollment_no) {
    return { data: null, error: "Enrollment number has not been allotted yet" };
  }

  const suffix = (reg.reg_cert_suffix || "").trim();
  if (!suffix) {
    return {
      data: null,
      error: "Your NOC has not been issued yet. Please contact your college or the Parishad.",
    };
  }

  const words = hindiPersonWords(reg.gender);

  return {
    data: {
      serial_no: nocNoFromSuffix(suffix),
      registration_no: regNoFromSuffix(suffix),
      enrollment_no: reg.enrollment_no,
      candidate_name: reg.candidate_name,
      salutation: words.salutation,
      relation: words.relation,
      father_name: reg.father_name,
      course: reg.courses?.course_name?.trim() || "—",
      institution_name: reg.colleges?.college_name || "—",
      photo_url: reg.photo_url,
      registration_date: istDate(reg.reg_cert_issued_at ?? reg.created_at),
      issue_date: istDate(),
    },
    error: null,
  };
}
