import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isEmailVerified } from "@/lib/otp";
import { getResultData } from "@/lib/result-data";
import { detectYearFromRollNo } from "@/lib/student-year-utils";

const REG_SELECT = `id, roll_no, roll_no_2nd_year, roll_no_3rd_year, enrollment_no, candidate_name, father_name, mother_name, dob, gender, category, photo_url, session_label, status, result_published_at, courses(id, course_name, duration_label), colleges(college_name, city, state, username)`;

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const roll_no = searchParams.get("roll_no")?.trim();
  const dob     = searchParams.get("dob")?.trim();
  const email   = searchParams.get("email")?.trim().toLowerCase();

  let reg, err;

  // Email-based lookup (OTP must be verified)
  if (email && !roll_no) {
    const verified = await isEmailVerified(email, "student_verification");
    if (!verified) return NextResponse.json({ error: "Email not verified. Please complete OTP verification first." }, { status: 401 });
    ({ data: reg, error: err } = await supabaseAdmin.from("student_registrations").select(REG_SELECT).eq("email", email).eq("status", "approved").maybeSingle());
    if (err) return NextResponse.json({ error: err.message }, { status: 500 });
    if (!reg) return NextResponse.json({ error: "No result found for this email. Results are published after exams are evaluated." }, { status: 404 });
  } else {
    if (!roll_no || !dob) return NextResponse.json({ error: "roll_no and dob are required." }, { status: 400 });
    ({ data: reg, error: err } = await supabaseAdmin
      .from("student_registrations")
      .select(REG_SELECT)
      .or(`roll_no.eq.${roll_no},roll_no_2nd_year.eq.${roll_no},roll_no_3rd_year.eq.${roll_no}`)
      .eq("dob", dob)
      .eq("status", "approved")
      .maybeSingle());
    if (err) return NextResponse.json({ error: err.message }, { status: 500 });
    if (!reg) return NextResponse.json({ error: "No result found for the given Roll Number and Date of Birth." }, { status: 404 });
  }

  // Detect which year this search belongs to based on the searched roll number
  const targetYear = detectYearFromRollNo(reg, roll_no);

  // Fetch verified result data for that specific academic year
  const { data: resultInfo, error: resultErr } = await getResultData(reg.id, targetYear);
  if (resultErr) {
    return NextResponse.json({ error: resultErr }, { status: 400 });
  }

  // Check if result is published for this specific year
  if (!resultInfo.is_published) {
    return NextResponse.json(
      { error: `Result for ${resultInfo.exam_year_label} has not been declared or published yet. Please check back later.` },
      { status: 404 }
    );
  }

  const subjectResults = (resultInfo.subjects || []).map((s) => {
    const th = s.theory_marks ?? 0;
    const pr = s.practical_marks ?? 0;
    const ca = s.ca_marks ?? 0;
    const tot = s.total_marks ?? (th + pr + ca);
    const maxTot = s.total_max ?? ((s.theory_max || 0) + (s.practical_max || 0) + (s.ca_max || 0));
    return {
      subject_code: s.subject_code,
      subject_name: s.subject_name,
      theory_marks: s.theory_marks,
      theory_max: s.theory_max,
      practical_marks: s.practical_max > 0 ? s.practical_marks : null,
      practical_max: s.practical_max,
      ca_marks: s.ca_max > 0 ? s.ca_marks : null,
      ca_max: s.ca_max,
      total: tot,
      total_marks: tot,
      max_total: maxTot,
      grade: s.grade,
      pass: s.subject_result === "PASS",
    };
  });

  const grandTotal = resultInfo.grand_total_obtained ?? 0;
  const grandMax = resultInfo.grand_total_max ?? 0;
  const percentage = grandMax > 0 ? ((grandTotal / grandMax) * 100).toFixed(2) : "0.00";
  const finalResult = resultInfo.final_result === "INCOMPLETE" ? "AWAITED" : resultInfo.final_result;

  return NextResponse.json({
    ok: true,
    student: {
      roll_no: resultInfo.roll_no,
      enrollment_no: resultInfo.enrollment_no || reg.enrollment_no,
      candidate_name: resultInfo.candidate_name || reg.candidate_name,
      father_name: resultInfo.father_name || reg.father_name,
      mother_name: resultInfo.mother_name || reg.mother_name,
      dob: resultInfo.dob || reg.dob,
      gender: reg.gender,
      category: reg.category,
      photo_url: resultInfo.photo_url || reg.photo_url,
      session_label: resultInfo.session_label,
      exam_year_label: resultInfo.exam_year_label,
      course: resultInfo.course || reg.courses?.course_name,
      college: resultInfo.center_name || reg.colleges?.college_name,
      college_code: resultInfo.center_code || reg.colleges?.username?.toUpperCase(),
      college_city: reg.colleges?.city,
      college_state: reg.colleges?.state,
    },
    subjects: subjectResults,
    summary: {
      grand_total: grandTotal,
      grand_max: grandMax,
      percentage,
      result: finalResult,
    },
  });
}
