import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getAdmitCardData } from "@/lib/admit-card-data";
import { get6DigitSession } from "@/lib/enrollment-roll-utils";
import { pickYearForSession, rollNoForYear, rollIlikeFilter, parseYearOrNull, ROLL_FIELDS } from "@/lib/student-year-utils";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const exam_session_id = searchParams.get("exam_session_id");
  if (!exam_session_id) return NextResponse.json({ error: "exam_session_id required" }, { status: 400 });

  // Optional filters so an admin can print one course (and one year) at a time
  const courseFilter = (searchParams.get("course_name") || "").trim();
  const yearFilter = parseYearOrNull(searchParams.get("year"));

  const { data: examSession } = await supabaseAdmin
    .from("exam_sessions")
    .select("id, session_name, session_label, academic_session")
    .eq("id", exam_session_id)
    .maybeSingle();

  const sessionStr = examSession?.session_name || examSession?.academic_session || examSession?.session_label || "";
  const sessionDigits = get6DigitSession(sessionStr);

  // Fetch all approved students who belong to this session for Year 1, 2, 3 or 4
  let query = supabaseAdmin
    .from("student_registrations")
    .select("id, candidate_name, roll_no, roll_no_2nd_year, roll_no_3rd_year, roll_no_4th_year, exam_session_id, session_label, courses(course_name)")
    .eq("status", "approved");

  if (sessionDigits) {
    query = query.or(
      `${rollIlikeFilter(sessionDigits)},exam_session_id.eq.${exam_session_id}`
    );
  } else {
    query = query.eq("exam_session_id", exam_session_id);
  }

  const { data: allStudents, error: fetchErr } = await query;

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });

  // Course filter (course names can carry stray spaces, e.g. " BAMS (AM) ..."), then year filter
  const students = (allStudents || []).filter((st) => {
    if (courseFilter && (st.courses?.course_name || "").trim() !== courseFilter) return false;
    if (yearFilter) {
      const roll = st[ROLL_FIELDS[yearFilter]];
      if (!roll) return false;
      // later-year roll numbers encode their session; year 1 may also be linked by exam_session_id
      const inSession = !sessionDigits || String(roll).includes(sessionDigits) || (yearFilter === 1 && st.exam_session_id === exam_session_id);
      if (!inSession) return false;
    }
    return true;
  });

  if (students.length === 0) return NextResponse.json({ ok: true, admitCards: [], skipped: [] });

  const admitCards = [];
  const skipped = [];

  for (const student of students) {
    // Determine which year matches this session
    const targetYear = yearFilter || pickYearForSession(student, sessionDigits);
    const targetRollNo = targetYear === 1 ? student.roll_no : rollNoForYear(student, targetYear);

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
