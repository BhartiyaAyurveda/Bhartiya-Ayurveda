import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { isEmailVerified } from "@/lib/otp";
import { getAdmitCardData } from "@/lib/admit-card-data";
import { detectYearFromRollNo } from "@/lib/student-year-utils";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const roll_no = searchParams.get("roll_no")?.trim();
  const dob     = searchParams.get("dob")?.trim();
  const email   = searchParams.get("email")?.trim().toLowerCase();
  const yearParam = searchParams.get("year")?.trim();

  let requestedYear = null;
  if (yearParam) {
    if (yearParam.includes("3") || yearParam.toLowerCase().includes("third") || yearParam === "3") requestedYear = 3;
    else if (yearParam.includes("2") || yearParam.toLowerCase().includes("second") || yearParam === "2") requestedYear = 2;
    else if (yearParam.includes("1") || yearParam.toLowerCase().includes("first") || yearParam === "1") requestedYear = 1;
  }

  // Email-based lookup (OTP must be verified)
  if (email && !roll_no) {
    const verified = await isEmailVerified(email, "student_verification");
    if (!verified) {
      return NextResponse.json({ error: "Email not verified. Please complete OTP verification first." }, { status: 401 });
    }
    const { data: reg, error } = await supabaseAdmin
      .from("student_registrations")
      .select(`id, roll_no, roll_no_2nd_year, roll_no_3rd_year, enrollment_no, candidate_name, father_name, mother_name, dob, gender, category, photo_url, session_label, status, courses(id, course_name, duration_label), colleges(college_name, city, state, address)`)
      .eq("email", email)
      .eq("status", "approved")
      .or("roll_no.not.is.null,roll_no_2nd_year.not.is.null,roll_no_3rd_year.not.is.null")
      .maybeSingle();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    if (!reg) return NextResponse.json({ error: "No approved admit card found for this email. Check if your registration is approved and roll number is allotted." }, { status: 404 });
    return buildResponse(reg, null, requestedYear);
  }

  if (!roll_no || !dob) {
    return NextResponse.json({ error: "roll_no and dob are required." }, { status: 400 });
  }

  const { data: reg, error } = await supabaseAdmin
    .from("student_registrations")
    .select(`
      id, roll_no, roll_no_2nd_year, roll_no_3rd_year, enrollment_no, candidate_name, father_name, mother_name,
      dob, gender, category, photo_url, session_label, status,
      courses(id, course_name, duration_label),
      colleges(college_name, city, state, address)
    `)
    .or(`roll_no.eq.${roll_no},roll_no_2nd_year.eq.${roll_no},roll_no_3rd_year.eq.${roll_no},enrollment_no.eq.${roll_no}`)
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
  return buildResponse(reg, roll_no, requestedYear);
}

async function buildResponse(reg, searchedRollNo, requestedYear = null) {
  let targetYear = requestedYear;
  if (!targetYear) {
    targetYear = searchedRollNo ? detectYearFromRollNo(reg, searchedRollNo) : (reg.roll_no_3rd_year ? 3 : reg.roll_no_2nd_year ? 2 : 1);
  }
  const { data: cardData, error: cardErr } = await getAdmitCardData(reg.id, targetYear);

  if (cardErr) {
    return NextResponse.json({ error: cardErr }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    student: {
      roll_no: cardData.roll_no,
      enrollment_no: cardData.enrollment_no,
      candidate_name: cardData.candidate_name,
      father_name: cardData.father_name,
      mother_name: cardData.mother_name,
      dob: cardData.dob,
      gender: cardData.gender,
      photo_url: cardData.photo_url,
      session_label: cardData.session_label,
      exam_year_label: cardData.exam_year_label,
      course: cardData.course,
      college: cardData.center_name || reg.colleges?.college_name,
      center_code: cardData.center_code,
      college_city: reg.colleges?.city,
      college_state: reg.colleges?.state,
      college_address: reg.colleges?.address,
    },
    subjects: cardData.subjects,
  });
}
