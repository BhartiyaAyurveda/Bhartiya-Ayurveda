import { supabaseAdmin } from "@/lib/supabase";

function computeGrade(pct) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}

export async function getResultData(registrationId) {
  const { data: reg, error: regError } = await supabaseAdmin
    .from("student_registrations")
    .select("enrollment_no, roll_no, candidate_name, father_name, mother_name, dob, course, photo_url, status, admit_card_generated_at, exam_session_id, college_id, colleges(college_name, username), result_published_at")
    .eq("id", registrationId)
    .single();

  if (regError || !reg) return { data: null, error: "Registration not found" };
  if (reg.status !== "approved") return { data: null, error: "Registration is not approved yet" };
  if (!reg.exam_session_id) return { data: null, error: "Student has not been assigned to an exam session yet" };

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("exam_sessions")
    .select("session_label, exam_year_label")
    .eq("id", reg.exam_session_id)
    .single();

  if (sessionError || !session) return { data: null, error: "Exam session details are missing" };

  const college = reg.colleges;
  const centerName = college?.college_name || "Examination Center";
  const centerCode = college?.username?.toUpperCase() || "BA";

  const { data: subjectRows, error: subjectError } = await supabaseAdmin
    .from("course_subjects")
    .select("id, subject_name, subject_code, theory_max, practical_max, ca_max")
    .eq("course_name", reg.course)
    .order("created_at", { ascending: true });

  if (subjectError) return { data: null, error: subjectError.message };
  if (!subjectRows || subjectRows.length === 0) return { data: null, error: "No subjects defined for this course" };

  const missingMax = subjectRows.some(s => s.theory_max === null || s.practical_max === null || s.ca_max === null);
  if (missingMax) return { data: null, error: "Max marks not set for all subjects in this course" };

  const subjectIds = subjectRows.map(s => s.id);
  const { data: markRows, error: markError } = await supabaseAdmin
    .from("student_subject_marks")
    .select("subject_id, theory_marks, practical_marks, ca_marks")
    .eq("registration_id", registrationId)
    .in("subject_id", subjectIds);

  if (markError) return { data: null, error: markError.message };

  const markMap = new Map((markRows ?? []).map(m => [m.subject_id, m]));

  let grandTotalObtained = 0;
  let grandTotalMax = 0;
  let anyMissing = false;
  let anyFail = false;

  const subjects = subjectRows.map(s => {
    const totalMax = (s.theory_max ?? 0) + (s.practical_max ?? 0) + (s.ca_max ?? 0);
    const m = markMap.get(s.id);
    grandTotalMax += totalMax;

    if (!m) {
      anyMissing = true;
      return { subject_id: s.id, subject_name: s.subject_name, subject_code: s.subject_code, theory_max: s.theory_max, practical_max: s.practical_max, ca_max: s.ca_max, theory_marks: null, practical_marks: null, ca_marks: null, total_marks: null, total_max: totalMax, percentage: null, grade: null, subject_result: null };
    }

    const totalObtained = (m.theory_marks ?? 0) + (m.practical_marks ?? 0) + (m.ca_marks ?? 0);
    const percentage = totalMax > 0 ? (totalObtained / totalMax) * 100 : 0;
    const grade = computeGrade(percentage);
    const subject_result = percentage >= 40 ? "PASS" : "FAIL";
    if (subject_result === "FAIL") anyFail = true;
    grandTotalObtained += totalObtained;

    return { subject_id: s.id, subject_name: s.subject_name, subject_code: s.subject_code, theory_max: s.theory_max, practical_max: s.practical_max, ca_max: s.ca_max, theory_marks: m.theory_marks, practical_marks: m.practical_marks, ca_marks: m.ca_marks, total_marks: totalObtained, total_max: totalMax, percentage: Math.round(percentage * 100) / 100, grade, subject_result };
  });

  const finalResult = anyMissing ? "INCOMPLETE" : anyFail ? "FAIL" : "PASS";

  return {
    data: {
      enrollment_no: reg.enrollment_no,
      roll_no: reg.roll_no,
      candidate_name: reg.candidate_name,
      father_name: reg.father_name,
      mother_name: reg.mother_name,
      dob: reg.dob,
      course: reg.course,
      photo_url: reg.photo_url,
      session_label: session.session_label,
      exam_year_label: session.exam_year_label,
      center_name: centerName,
      center_code: centerCode,
      subjects,
      grand_total_obtained: grandTotalObtained,
      grand_total_max: grandTotalMax,
      final_result: finalResult,
      result_published_at: reg.result_published_at || null,
    },
    error: null,
  };
}

export async function upsertSubjectMarks(registrationId, marks) {
  const rows = marks.map(m => ({
    registration_id: registrationId,
    subject_id: m.subject_id,
    theory_marks: m.theory_marks,
    practical_marks: m.practical_marks,
    ca_marks: m.ca_marks,
    updated_at: new Date().toISOString(),
  }));

  const { error } = await supabaseAdmin
    .from("student_subject_marks")
    .upsert(rows, { onConflict: "registration_id,subject_id" });

  return { error: error?.message || null };
}
