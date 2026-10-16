import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: approved, error } = await supabaseAdmin
    .from("student_registrations")
    .select("id, candidate_name, roll_no, roll_no_2nd_year, roll_no_3rd_year, enrollment_no, exam_session_id, colleges(college_name), courses(course_name)")
    .eq("status", "approved")
    .order("roll_no", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const mismatches = [];

  // Approved students missing roll number
  const noRollNo = (approved || []).filter(r => !r.roll_no);
  for (const r of noRollNo) {
    mismatches.push({ type: "missing_roll_no", id: r.id, candidate_name: r.candidate_name, college: r.colleges?.college_name, course: r.courses?.course_name, detail: "Approved but no roll number assigned" });
  }

  // Duplicate 1st year roll numbers
  const rollNos = (approved || []).filter(r => r.roll_no).map(r => r.roll_no);
  const seen = new Set();
  const dupes = new Set();
  for (const rn of rollNos) {
    if (seen.has(rn)) dupes.add(rn);
    seen.add(rn);
  }
  for (const dup of dupes) {
    const rows = (approved || []).filter(r => r.roll_no === dup);
    for (const r of rows) {
      mismatches.push({ type: "duplicate_roll_no", id: r.id, candidate_name: r.candidate_name, college: r.colleges?.college_name, roll_no: r.roll_no, detail: `Duplicate roll number: ${dup}` });
    }
  }

  // Duplicate 2nd year roll numbers
  const rollNos2 = (approved || []).filter(r => r.roll_no_2nd_year).map(r => r.roll_no_2nd_year);
  const seen2 = new Set();
  const dupes2 = new Set();
  for (const rn of rollNos2) {
    if (seen2.has(rn)) dupes2.add(rn);
    seen2.add(rn);
  }
  for (const dup of dupes2) {
    const rows = (approved || []).filter(r => r.roll_no_2nd_year === dup);
    for (const r of rows) {
      mismatches.push({ type: "duplicate_roll_no_2nd_year", id: r.id, candidate_name: r.candidate_name, college: r.colleges?.college_name, roll_no: r.roll_no_2nd_year, detail: `Duplicate 2nd year roll number: ${dup}` });
    }
  }

  // Duplicate 3rd year roll numbers
  const rollNos3 = (approved || []).filter(r => r.roll_no_3rd_year).map(r => r.roll_no_3rd_year);
  const seen3 = new Set();
  const dupes3 = new Set();
  for (const rn of rollNos3) {
    if (seen3.has(rn)) dupes3.add(rn);
    seen3.add(rn);
  }
  for (const dup of dupes3) {
    const rows = (approved || []).filter(r => r.roll_no_3rd_year === dup);
    for (const r of rows) {
      mismatches.push({ type: "duplicate_roll_no_3rd_year", id: r.id, candidate_name: r.candidate_name, college: r.colleges?.college_name, roll_no: r.roll_no_3rd_year, detail: `Duplicate 3rd year roll number: ${dup}` });
    }
  }

  // Missing enrollment number
  const noEnrollment = (approved || []).filter(r => (r.roll_no || r.roll_no_2nd_year || r.roll_no_3rd_year) && !r.enrollment_no);
  for (const r of noEnrollment) {
    mismatches.push({ type: "missing_enrollment_no", id: r.id, candidate_name: r.candidate_name, roll_no: r.roll_no || r.roll_no_2nd_year || r.roll_no_3rd_year, college: r.colleges?.college_name, detail: "Roll number assigned but no enrollment number" });
  }

  return NextResponse.json({
    ok: true,
    total_approved: (approved || []).length,
    mismatch_count: mismatches.length,
    mismatches,
  });
}
