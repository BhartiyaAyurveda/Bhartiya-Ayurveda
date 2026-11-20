import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import {
  deriveCollegePrefix,
  get6DigitSession,
  getPrevSession,
} from "@/lib/enrollment-roll-utils";
import { buildStudentYearMeta, courseYears, parseYear, previousRollNo, rollFieldForYear, yearLabel } from "@/lib/student-year-utils";

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { exam_session_id, prefix: customPrefix, target_year } = body;
  if (!exam_session_id) return NextResponse.json({ error: "exam_session_id required" }, { status: 400 });

  // 1st year (roll_no), 2nd (roll_no_2nd_year), 3rd (roll_no_3rd_year), 4th (roll_no_4th_year)
  const targetYearNum = parseYear(target_year);
  const isLaterYear = targetYearNum > 1;
  const rollField = rollFieldForYear(targetYearNum);
  const prevRollField = isLaterYear ? rollFieldForYear(targetYearNum - 1) : null;

  // Get session info for roll number session digits
  const { data: examSession } = await supabaseAdmin
    .from("exam_sessions")
    .select("session_name, session_label, academic_session")
    .eq("id", exam_session_id)
    .maybeSingle();

  const sessionStr =
    examSession?.session_name ||
    examSession?.academic_session ||
    examSession?.session_label;

  const sessionDigits = get6DigitSession(sessionStr);

  let prevSessionId = null;
  let prevDigits = null;
  if (isLaterYear && sessionStr) {
    const prevName = getPrevSession(sessionStr);
    if (prevName) prevDigits = get6DigitSession(prevName);
    if (prevName) {
      const { data: allSessions } = await supabaseAdmin
        .from("exam_sessions")
        .select("id, session_name, session_label, academic_session");
      const prevSess = (allSessions || []).find((s) => {
        const name = s.session_name || s.academic_session || s.session_label || "";
        return (
          name.includes(prevName) ||
          get6DigitSession(name) === get6DigitSession(prevName)
        );
      });
      if (prevSess) {
        prevSessionId = prevSess.id;
      }
    }
  }

  // Fetch all approved students for this session without a roll number for the target year
  let studentQuery = supabaseAdmin
    .from("student_registrations")
    .select("id, candidate_name, college_id, roll_no, roll_no_2nd_year, roll_no_3rd_year, roll_no_4th_year, session_label, academic_session, colleges(college_name, college_code), courses(id, duration_label)")
    .eq("status", "approved");

  if (isLaterYear) {
    const sessionIds = prevSessionId ? [exam_session_id, prevSessionId] : [exam_session_id];
    // Eligible if linked to this/previous session, or the previous year's roll number was allotted in the previous session
    // (exam_session_id stays on the student's 1st-year session, so it alone misses 3rd/4th year students)
    studentQuery = studentQuery
      .or(prevDigits ? `exam_session_id.in.(${sessionIds.join(",")}),${prevRollField}.ilike.%${prevDigits}%` : `exam_session_id.in.(${sessionIds.join(",")})`)
      .not(prevRollField, "is", null)
      .neq(prevRollField, "")
      .or(`${rollField}.is.null,${rollField}.eq.""`);
  } else {
    studentQuery = studentQuery
      .eq("exam_session_id", exam_session_id)
      .or(`roll_no.is.null,roll_no.eq.""`);
  }

  if (Array.isArray(body.student_ids) && body.student_ids.length > 0) {
    studentQuery = studentQuery.in("id", body.student_ids);
  }

  const { data: fetchedStudents, error: fetchErr } = await studentQuery;

  // 4th year is only for 4-year courses (BEMS, BAMS-AM ...)
  const students = targetYearNum === 4
    ? (fetchedStudents || []).filter((st) => (courseYears(st.courses?.duration_label) ?? 0) >= 4)
    : fetchedStudents;

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  if (!students || students.length === 0) {
    return NextResponse.json({ ok: true, allotted: 0, message: "No eligible students found" });
  }

  // In-memory cache for sequence numbers per prefix to prevent race conditions during bulk loop
  const seqMap = new Map();
  const updates = [];

  for (const student of students) {
    let prefix = customPrefix?.trim();
    if (!prefix) {
      let collegeInitials = "";
      const earlierRoll = isLaterYear ? previousRollNo(student, targetYearNum) : null;
      if (earlierRoll) {
        const match = earlierRoll.match(/^[A-Za-z]+/);
        if (match) collegeInitials = match[0].toUpperCase();
      }
      if (!collegeInitials) {
        collegeInitials = deriveCollegePrefix(student.colleges?.college_name, "BAI");
      }
      prefix = `${collegeInitials}${sessionDigits}`;
    }

    if (!seqMap.has(prefix)) {
      // Find latest roll number with this prefix
      const { data: existing } = await supabaseAdmin
        .from("student_registrations")
        .select(rollField)
        .like(rollField, `${prefix}%`)
        .order(rollField, { ascending: false })
        .limit(1);

      let start = 1;
      if (existing && existing.length > 0 && existing[0]?.[rollField]) {
        const lastSeqStr = existing[0][rollField].slice(prefix.length);
        const parsed = parseInt(lastSeqStr, 10);
        if (!isNaN(parsed)) start = parsed + 1;
      }
      seqMap.set(prefix, start);
    } else {
      seqMap.set(prefix, seqMap.get(prefix) + 1);
    }

    const currentSeq = seqMap.get(prefix);
    const seqStr = String(currentSeq).padStart(2, "0");
    const rollNo = `${prefix}${seqStr}`;

    updates.push({
      id: student.id,
      [rollField]: rollNo,
    });
  }

  // Update each student in DB
  const results = await Promise.all(
    updates.map((u) => {
      const studentObj = students.find((s) => s.id === u.id);
      const updateData = {
        [rollField]: u[rollField],
      };

      if (!isLaterYear) {
        updateData.exam_session_id = exam_session_id;
      }

      const updatedMetaStr = buildStudentYearMeta(studentObj, {
        sessions: { [targetYearNum]: exam_session_id },
      });
      updateData.session_label = updatedMetaStr;

      return supabaseAdmin
        .from("student_registrations")
        .update(updateData)
        .eq("id", u.id);
    })
  );

  const errors = results.filter((r) => r.error);
  if (errors.length > 0) {
    return NextResponse.json(
      {
        error: "Some roll numbers failed to save",
        details: errors.map((e) => e.error?.message),
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    ok: true,
    allotted: updates.length,
    target_year: yearLabel(targetYearNum),
    roll_field: rollField,
    roll_numbers: updates.map((u) => ({ id: u.id, roll_no: u[rollField] })),
  });
}
