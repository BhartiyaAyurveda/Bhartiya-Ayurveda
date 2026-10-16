import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getAdmitCardData } from "@/lib/admit-card-data";
import { get6DigitSession } from "@/lib/enrollment-roll-utils";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const exam_session_id = searchParams.get("exam_session_id");
  if (!exam_session_id) return NextResponse.json({ error: "exam_session_id required" }, { status: 400 });

  const { data: examSession } = await supabaseAdmin
    .from("exam_sessions")
    .select("id, session_name, session_label, academic_session")
    .eq("id", exam_session_id)
    .maybeSingle();

  const sessionStr = examSession?.session_name || examSession?.academic_session || examSession?.session_label || "";
  const sessionDigits = get6DigitSession(sessionStr);

  // Fetch all approved students who belong to this session for Year 1, Year 2, or Year 3
  let query = supabaseAdmin
    .from("student_registrations")
    .select("id, candidate_name, roll_no, roll_no_2nd_year, roll_no_3rd_year, exam_session_id, session_label")
    .eq("status", "approved");

  if (sessionDigits) {
    query = query.or(
      `roll_no.ilike.%${sessionDigits}%,roll_no_2nd_year.ilike.%${sessionDigits}%,roll_no_3rd_year.ilike.%${sessionDigits}%,exam_session_id.eq.${exam_session_id}`
    );
  } else {
    query = query.eq("exam_session_id", exam_session_id);
  }

  const { data: students, error: fetchErr } = await query;

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  if (!students || students.length === 0) return NextResponse.json({ ok: true, admitCards: [], skipped: [] });

  const admitCards = [];
  const skipped = [];

  for (const student of students) {
    // Determine which year matches this session
    let targetYear = 1;
    if (student.roll_no_3rd_year && sessionDigits && student.roll_no_3rd_year.includes(sessionDigits)) {
      targetYear = 3;
    } else if (student.roll_no_2nd_year && sessionDigits && student.roll_no_2nd_year.includes(sessionDigits)) {
      targetYear = 2;
    } else if (student.roll_no && sessionDigits && student.roll_no.includes(sessionDigits)) {
      targetYear = 1;
    } else if (student.roll_no_3rd_year) {
      targetYear = 3;
    } else if (student.roll_no_2nd_year) {
      targetYear = 2;
    }

    const targetRollNo =
      targetYear === 3 ? student.roll_no_3rd_year :
      targetYear === 2 ? student.roll_no_2nd_year :
      student.roll_no;

    if (!targetRollNo) continue;

    const { data, error } = await getAdmitCardData(student.id, targetYear, exam_session_id);
    if (error) {
      skipped.push({ id: student.id, candidate_name: student.candidate_name, roll_no: targetRollNo, reason: error });
    } else {
      admitCards.push({ id: student.id, ...data });
    }
  }

  return NextResponse.json({ ok: true, admitCards, skipped });
}
