import { supabaseAdmin } from "@/lib/supabase";
import { getStudentYearMeta, buildStudentYearMeta } from "@/lib/student-year-utils";
import { get6DigitSession } from "@/lib/enrollment-roll-utils";

export async function getAdmitCardData(registrationId, targetYear = null, targetSessionId = null) {
  const { data: reg, error: regError } = await supabaseAdmin
    .from("student_registrations")
    .select("id, enrollment_no, roll_no, roll_no_2nd_year, roll_no_3rd_year, candidate_name, father_name, mother_name, gender, dob, course_id, photo_url, status, admit_card_generated_at, exam_session_id, college_id, session_label, academic_session, colleges(college_name, username), courses(course_name)")
    .eq("id", registrationId)
    .single();

  if (regError || !reg) return { data: null, error: "Registration not found" };
  if (reg.status !== "approved") return { data: null, error: "Registration is not approved yet" };

  // 1. Determine student year (explicit targetYear or active latest year)
  const studentYear = targetYear ? Number(targetYear) : (reg.roll_no_3rd_year ? 3 : reg.roll_no_2nd_year ? 2 : 1);
  const activeRollNo =
    studentYear === 3 ? (reg.roll_no_3rd_year || reg.roll_no) :
    studentYear === 2 ? (reg.roll_no_2nd_year || reg.roll_no) :
    reg.roll_no;

  if (!activeRollNo) {
    return { data: null, error: `Roll number for ${studentYear === 1 ? "1st" : studentYear === 2 ? "2nd" : "3rd"} Year has not been allotted yet` };
  }

  // 2. Resolve exam session for this specific year
  const meta = getStudentYearMeta(reg);
  let resolvedSessionId = targetSessionId || meta.sessions[studentYear];

  if (!resolvedSessionId && studentYear === 1 && reg.exam_session_id) {
    resolvedSessionId = reg.exam_session_id;
  }

  // If still not resolved, lookup by session digits encoded in activeRollNo
  if (!resolvedSessionId && activeRollNo) {
    const rollDigits = get6DigitSession(activeRollNo);
    const { data: allSessions } = await supabaseAdmin
      .from("exam_sessions")
      .select("id, session_name, academic_session, session_label");

    const matchedSess = (allSessions || []).find((s) => {
      const sName = s.session_name || s.academic_session || s.session_label || "";
      return get6DigitSession(sName) === rollDigits;
    });
    if (matchedSess) resolvedSessionId = matchedSess.id;
  }

  if (!resolvedSessionId) {
    resolvedSessionId = reg.exam_session_id;
  }

  if (!resolvedSessionId) {
    return { data: null, error: "Exam session details could not be resolved for this year" };
  }

  const { data: session, error: sessionError } = await supabaseAdmin
    .from("exam_sessions")
    .select("id, session_name, session_label, exam_year_label, academic_session")
    .eq("id", resolvedSessionId)
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

  const courseName = reg.courses?.course_name || reg.course || "";

  let subjectQuery = supabaseAdmin
    .from("course_subjects")
    .select("id, subject_name, subject_code, year_number")
    .eq("course_name", courseName)
    .order("created_at", { ascending: true });

  if (studentYear === 1) {
    subjectQuery = subjectQuery.or("year_number.eq.1,year_number.is.null");
  } else {
    subjectQuery = subjectQuery.eq("year_number", studentYear);
  }

  const { data: subjectRows, error: subjectError } = await subjectQuery;

  if (subjectError) return { data: null, error: subjectError.message };
  if (!subjectRows || subjectRows.length === 0) return { data: null, error: `No subjects defined for Year ${studentYear}` };

  const subjectIds = subjectRows.map(s => s.id);

  const { data: dateRows, error: dateError } = await supabaseAdmin
    .from("datesheets")
    .select("subject_id, exam_date, exam_time")
    .in("subject_id", subjectIds)
    .eq("exam_session_id", resolvedSessionId);

  if (dateError) return { data: null, error: dateError.message };

  const dateMap = new Map((dateRows ?? []).map(d => [d.subject_id, d]));
  const incomplete = subjectRows.some(s => { const d = dateMap.get(s.id); return !d || !d.exam_date || !d.exam_time; });
  if (incomplete) return { data: null, error: `Datesheet is not complete for all Year ${studentYear} subjects in this session` };

  const subjects = subjectRows.map(s => {
    const d = dateMap.get(s.id);
    return { subject_name: s.subject_name, subject_code: s.subject_code, exam_date: d.exam_date, exam_time: d.exam_time };
  });

  // Mark admit card as generated for this year (and update metadata)
  const nowIso = new Date().toISOString();
  const updatedMetaStr = buildStudentYearMeta(reg, {
    sessions: { [studentYear]: resolvedSessionId },
    admitCards: { [studentYear]: nowIso },
  });

  await supabaseAdmin
    .from("student_registrations")
    .update({
      admit_card_generated_at: reg.admit_card_generated_at || nowIso,
      session_label: updatedMetaStr,
    })
    .eq("id", registrationId);

  const rawSession =
    session?.session_label ||
    session?.session_name ||
    session?.academic_session ||
    "";

  let sessionLabel = "Annual Examination";
  if (rawSession) {
    if (rawSession.toLowerCase().includes("examination") || rawSession.toLowerCase().includes("annual")) {
      sessionLabel = rawSession;
    } else {
      sessionLabel = `Annual Examination ${rawSession}`;
    }
  }

  const examYearLabel = `${studentYear === 1 ? "1st" : studentYear === 2 ? "2nd" : "3rd"} Year`;

  return {
    data: {
      enrollment_no: reg.enrollment_no,
      roll_no: activeRollNo,
      candidate_name: reg.candidate_name,
      father_name: reg.father_name,
      mother_name: reg.mother_name || "",
      gender: reg.gender || "",
      dob: reg.dob,
      course: reg.courses?.course_name || reg.course || "—",
      photo_url: reg.photo_url,
      session_label: sessionLabel,
      exam_year_label: examYearLabel,
      center_name: centerName,
      center_code: centerCode,
      subjects,
    },
    error: null,
  };
}
