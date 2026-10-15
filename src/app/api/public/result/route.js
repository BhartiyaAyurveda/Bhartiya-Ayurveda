import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isEmailVerified } from "@/lib/otp";

const REG_SELECT = `id, roll_no, enrollment_no, candidate_name, father_name, mother_name, dob, gender, category, photo_url, session_label, status, courses(id, course_name, duration_label), colleges(college_name, city, state)`;

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
    ({ data: reg, error: err } = await supabaseAdmin.from("student_registrations").select(REG_SELECT).eq("roll_no", roll_no).eq("dob", dob).eq("status", "approved").maybeSingle());
    if (err) return NextResponse.json({ error: err.message }, { status: 500 });
    if (!reg) return NextResponse.json({ error: "No result found for the given Roll Number and Date of Birth." }, { status: 404 });
  }

  // Fetch subject-wise marks
  const { data: marks } = await supabaseAdmin
    .from("student_marks")
    .select(`
      theory_marks, practical_marks,
      subjects(subject_code, subject_name, theory_max, theory_min, practical_max, practical_min, sort_order)
    `)
    .eq("registration_id", reg.id)
    .order("subjects(sort_order)");

  const subjectResults = (marks || []).map((m) => {
    const th = m.theory_marks ?? 0;
    const pr = m.practical_marks ?? 0;
    const total = th + pr;
    const maxTotal = (m.subjects?.theory_max ?? 80) + (m.subjects?.practical_max ?? 20);
    const passing = th >= (m.subjects?.theory_min ?? 32) && pr >= (m.subjects?.practical_min ?? 8);
    return {
      subject_code: m.subjects?.subject_code,
      subject_name: m.subjects?.subject_name,
      theory_marks: th,
      theory_max: m.subjects?.theory_max ?? 80,
      practical_marks: pr,
      practical_max: m.subjects?.practical_max ?? 20,
      total,
      max_total: maxTotal,
      pass: passing,
    };
  });

  const grandTotal = subjectResults.reduce((s, r) => s + r.total, 0);
  const grandMax = subjectResults.reduce((s, r) => s + r.max_total, 0);
  const overallPass = subjectResults.length > 0 && subjectResults.every((r) => r.pass);
  const percentage = grandMax > 0 ? ((grandTotal / grandMax) * 100).toFixed(2) : "0.00";

  return NextResponse.json({
    ok: true,
    student: {
      roll_no: reg.roll_no,
      enrollment_no: reg.enrollment_no,
      candidate_name: reg.candidate_name,
      father_name: reg.father_name,
      mother_name: reg.mother_name,
      dob: reg.dob,
      gender: reg.gender,
      category: reg.category,
      photo_url: reg.photo_url,
      session_label: reg.session_label,
      course: reg.courses?.course_name,
      college: reg.colleges?.college_name,
      college_city: reg.colleges?.city,
      college_state: reg.colleges?.state,
    },
    subjects: subjectResults,
    summary: {
      grand_total: grandTotal,
      grand_max: grandMax,
      percentage,
      result: overallPass ? "PASS" : subjectResults.length === 0 ? "AWAITED" : "FAIL",
    },
  });
}
