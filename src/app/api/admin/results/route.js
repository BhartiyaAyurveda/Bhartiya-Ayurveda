import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { get6DigitSession } from "@/lib/enrollment-roll-utils";
import { getStudentYearMeta, isYearResultPublished, pickYearForSession, rollNoForYear, rollIlikeFilter, yearLabel } from "@/lib/student-year-utils";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const exam_session_id = searchParams.get("exam_session_id");

  let sessionDigits = "";
  if (exam_session_id) {
    const { data: s } = await supabaseAdmin
      .from("exam_sessions")
      .select("id, session_name, academic_session, session_label")
      .eq("id", exam_session_id)
      .maybeSingle();

    const sName = s?.session_name || s?.academic_session || s?.session_label || "";
    sessionDigits = get6DigitSession(sName);
  }

  let query = supabaseAdmin
    .from("student_registrations")
    .select("id, candidate_name, roll_no, roll_no_2nd_year, roll_no_3rd_year, roll_no_4th_year, exam_session_id, session_label, admit_card_generated_at, result_published_at, colleges(college_name), courses(course_name)")
    .eq("status", "approved")
    .not("admit_card_generated_at", "is", null);

  if (sessionDigits) {
    query = query.or(
      `${rollIlikeFilter(sessionDigits)},exam_session_id.eq.${exam_session_id}`
    );
  } else if (exam_session_id) {
    query = query.eq("exam_session_id", exam_session_id);
  }

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const formatted = (data || []).map((d) => {
    const targetYear = pickYearForSession(d, sessionDigits);
    const activeRollNo = targetYear === 1 ? d.roll_no : rollNoForYear(d, targetYear);

    const meta = getStudentYearMeta(d);
    const isPub = isYearResultPublished(d, targetYear);
    const yearPubAt = meta.published[targetYear] || (isPub ? d.result_published_at : null);

    return {
      ...d,
      roll_no: activeRollNo,
      target_year: targetYear,
      year_label: yearLabel(targetYear),
      course: d.courses?.course_name || "—",
      result_published_at: yearPubAt,
    };
  });

  formatted.sort((a, b) => String(a.roll_no || "").localeCompare(String(b.roll_no || "")));

  return NextResponse.json({ ok: true, data: formatted });
}
