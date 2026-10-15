import { supabaseAdmin } from "@/lib/supabase";

export async function getAdmitCardData(registrationId) {
  const { data: reg, error: regError } = await supabaseAdmin
    .from("student_registrations")
    .select("enrollment_no, roll_no, candidate_name, father_name, dob, course, course_id, photo_url, status, admit_card_generated_at, exam_session_id, college_id, colleges(college_name, username)")
    .eq("id", registrationId)
    .single();

  if (regError || !reg) return { data: null, error: "Registration not found" };
  if (reg.status !== "approved") return { data: null, error: "Registration is not approved yet" };
  if (!reg.roll_no) return { data: null, error: "Roll number has not been allotted yet" };
  if (!reg.exam_session_id) return { data: null, error: "Student has not been assigned to an exam session yet" };

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("exam_sessions")
    .select("session_label, exam_year_label")
    .eq("id", reg.exam_session_id)
    .single();

  if (sessionError || !session) return { data: null, error: "Exam session details are missing" };

  const college = reg.colleges;
  let centerName = college?.college_name || "Examination Center";
  let centerCode = college?.username?.toUpperCase() || "BA";

  // Override with course_exam_config if available
  if (reg.course_id) {
    const { data: examCfg } = await supabaseAdmin
      .from("course_exam_config")
      .select("exam_center, session_label")
      .eq("course_id", reg.course_id)
      .maybeSingle();
    if (examCfg?.exam_center) {
      centerName = examCfg.exam_center;
      centerCode = examCfg.exam_center.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 4);
    }
  }

  const { data: subjectRows, error: subjectError } = await supabaseAdmin
    .from("course_subjects")
    .select("id, subject_name, subject_code")
    .eq("course_name", reg.course)
    .order("created_at", { ascending: true });

  if (subjectError) return { data: null, error: subjectError.message };
  if (!subjectRows || subjectRows.length === 0) return { data: null, error: "No subjects defined for this course" };

  const subjectIds = subjectRows.map(s => s.id);

  const { data: dateRows, error: dateError } = await supabaseAdmin
    .from("datesheets")
    .select("subject_id, exam_date, exam_time")
    .in("subject_id", subjectIds)
    .eq("exam_session_id", reg.exam_session_id);

  if (dateError) return { data: null, error: dateError.message };

  const dateMap = new Map((dateRows ?? []).map(d => [d.subject_id, d]));
  const incomplete = subjectRows.some(s => { const d = dateMap.get(s.id); return !d || !d.exam_date || !d.exam_time; });
  if (incomplete) return { data: null, error: "Datesheet is not complete for all subjects in this session" };

  const subjects = subjectRows.map(s => {
    const d = dateMap.get(s.id);
    return { subject_name: s.subject_name, subject_code: s.subject_code, exam_date: d.exam_date, exam_time: d.exam_time };
  });

  // Mark admit card as generated (first time only)
  if (!reg.admit_card_generated_at) {
    await supabaseAdmin
      .from("student_registrations")
      .update({ admit_card_generated_at: new Date().toISOString() })
      .eq("id", registrationId)
      .is("admit_card_generated_at", null);
  }

  return {
    data: {
      enrollment_no: reg.enrollment_no,
      roll_no: reg.roll_no,
      candidate_name: reg.candidate_name,
      father_name: reg.father_name,
      dob: reg.dob,
      course: reg.course,
      photo_url: reg.photo_url,
      session_label: session.session_label,
      exam_year_label: session.exam_year_label,
      center_name: centerName,
      center_code: centerCode,
      subjects,
    },
    error: null,
  };
}
