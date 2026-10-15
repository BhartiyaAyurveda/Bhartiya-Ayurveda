import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data: approved, error } = await supabaseAdmin
    .from("student_registrations")
    .select("id, candidate_name, roll_no, enrollment_no, exam_session_id, colleges(college_name), courses(course_name)")
    .eq("status", "approved")
    .order("roll_no", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const mismatches = [];

  // Approved students missing roll number
  const noRollNo = (approved || []).filter(r => !r.roll_no);
  for (const r of noRollNo) {
    mismatches.push({ type: "missing_roll_no", id: r.id, candidate_name: r.candidate_name, college: r.colleges?.college_name, course: r.courses?.course_name, detail: "Approved but no roll number assigned" });
  }

  // Duplicate roll numbers
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

  // Missing enrollment number
  const noEnrollment = (approved || []).filter(r => r.roll_no && !r.enrollment_no);
  for (const r of noEnrollment) {
    mismatches.push({ type: "missing_enrollment_no", id: r.id, candidate_name: r.candidate_name, roll_no: r.roll_no, college: r.colleges?.college_name, detail: "Roll number assigned but no enrollment number" });
  }

  return NextResponse.json({
    ok: true,
    total_approved: (approved || []).length,
    mismatch_count: mismatches.length,
    mismatches,
  });
}
