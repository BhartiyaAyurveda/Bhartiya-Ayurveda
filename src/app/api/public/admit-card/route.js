import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isEmailVerified } from "@/lib/otp";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const roll_no = searchParams.get("roll_no")?.trim();
  const dob     = searchParams.get("dob")?.trim();
  const email   = searchParams.get("email")?.trim().toLowerCase();

  // Email-based lookup (OTP must be verified)
  if (email && !roll_no) {
    const verified = await isEmailVerified(email, "student_verification");
    if (!verified) {
      return NextResponse.json({ error: "Email not verified. Please complete OTP verification first." }, { status: 401 });
    }
    const { data: reg, error } = await supabaseAdmin
      .from("student_registrations")
      .select(`id, roll_no, enrollment_no, candidate_name, father_name, mother_name, dob, gender, category, photo_url, session_label, status, courses(id, course_name, duration_label), colleges(college_name, city, state, address)`)
      .eq("email", email)
      .eq("status", "approved")
      .not("roll_no", "is", null)
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!reg) return NextResponse.json({ error: "No approved admit card found for this email. Check if your registration is approved and roll number is allotted." }, { status: 404 });
    return buildResponse(reg);
  }

  if (!roll_no || !dob) {
    return NextResponse.json({ error: "roll_no and dob are required." }, { status: 400 });
  }

  const { data: reg, error } = await supabaseAdmin
    .from("student_registrations")
    .select(`
      id, roll_no, enrollment_no, candidate_name, father_name, mother_name,
      dob, gender, category, photo_url, session_label, status,
      courses(id, course_name, duration_label),
      colleges(college_name, city, state, address)
    `)
    .eq("roll_no", roll_no)
    .eq("dob", dob)
    .eq("status", "approved")
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!reg) {
    return NextResponse.json(
      { error: "No approved registration found. Admit card is only available after your registration is approved." },
      { status: 404 }
    );
  }
  return buildResponse(reg);
}

async function buildResponse(reg) {
  const { data: subjects } = await supabaseAdmin
    .from("subjects")
    .select("subject_code, subject_name, exam_date, exam_time, sort_order")
    .eq("course_id", reg.courses?.id)
    .order("sort_order");

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
      photo_url: reg.photo_url,
      session_label: reg.session_label,
      course: reg.courses?.course_name,
      college: reg.colleges?.college_name,
      college_city: reg.colleges?.city,
      college_state: reg.colleges?.state,
      college_address: reg.colleges?.address,
    },
    subjects: (subjects || []).map((s) => ({
      subject_code: s.subject_code,
      subject_name: s.subject_name,
      exam_date: s.exam_date,
      exam_time: s.exam_time || "Morning Shift (10:00 AM – 1:00 PM)",
    })),
  });
}
