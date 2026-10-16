import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import {
  deriveCollegePrefix,
  get6DigitSession,
  getNextSession,
  getPrevSession,
} from "@/lib/enrollment-roll-utils";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const exam_session_id = searchParams.get("exam_session_id");
  const target_year = searchParams.get("target_year");
  const isThirdYear = target_year === "3" || target_year === "3rd";
  const isSecondYear = target_year === "2" || target_year === "2nd";
  const rollField = isThirdYear
    ? "roll_no_3rd_year"
    : isSecondYear
    ? "roll_no_2nd_year"
    : "roll_no";

  // 1. Exam Session details & Auto-link unlinked students
  let sessionDigits = "202324";
  let prevSessionId = null;

  if (exam_session_id) {
    const { data: examSession } = await supabaseAdmin
      .from("exam_sessions")
      .select("id, session_name, session_label, academic_session")
      .eq("id", exam_session_id)
      .maybeSingle();

    const sessionStr =
      examSession?.session_name ||
      examSession?.academic_session ||
      examSession?.session_label;
    if (sessionStr) sessionDigits = get6DigitSession(sessionStr);

    // If 2nd or 3rd year, find previous session ID (e.g. 2025-26 -> 2024-25, or 2024-25 -> 2023-24)
    if ((isSecondYear || isThirdYear) && sessionStr) {
      const prevName = getPrevSession(sessionStr);
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

    // Auto-link any approved students whose academic_session matches this exam session but have null exam_session_id
    if (sessionDigits && !isSecondYear && !isThirdYear) {
      const { data: unlinked } = await supabaseAdmin
        .from("student_registrations")
        .select("id, academic_session, session_label")
        .eq("status", "approved")
        .is("exam_session_id", null);

      const toLink = (unlinked || []).filter((s) => {
        const sDigits = get6DigitSession(s.academic_session || s.session_label || "");
        return sDigits === sessionDigits;
      }).map((s) => s.id);

      if (toLink.length > 0) {
        await supabaseAdmin
          .from("student_registrations")
          .update({ exam_session_id })
          .in("id", toLink);
      }
    }
  }

  // 2. Fetch Allotted Students
  let allottedQuery = supabaseAdmin
    .from("student_registrations")
    .select(`
      id,
      candidate_name,
      roll_no,
      roll_no_2nd_year,
      roll_no_3rd_year,
      enrollment_no,
      exam_session_id,
      admit_card_generated_at,
      colleges(college_name),
      courses(id, course_name)
    `)
    .eq("status", "approved")
    .not(rollField, "is", null)
    .neq(rollField, "")
    .order(rollField, { ascending: true });

  if (exam_session_id) {
    if (sessionDigits) {
      if ((isSecondYear || isThirdYear) && prevSessionId) {
        allottedQuery = allottedQuery.or(`${rollField}.ilike.%${sessionDigits}%,exam_session_id.in.(${exam_session_id},${prevSessionId})`);
      } else {
        allottedQuery = allottedQuery.or(`${rollField}.ilike.%${sessionDigits}%,exam_session_id.eq.${exam_session_id}`);
      }
    } else {
      if ((isSecondYear || isThirdYear) && prevSessionId) {
        allottedQuery = allottedQuery.in("exam_session_id", [exam_session_id, prevSessionId]);
      } else {
        allottedQuery = allottedQuery.eq("exam_session_id", exam_session_id);
      }
    }
  }

  const { data: allottedData, error: allottedErr } = await allottedQuery;
  if (allottedErr) return NextResponse.json({ error: allottedErr.message }, { status: 500 });

  // If no exam_session_id is provided, just return the allotted list
  if (!exam_session_id) {
    return NextResponse.json({
      ok: true,
      data: allottedData || [],
      allotted: allottedData || [],
      pending: [],
      stats: {
        totalApproved: allottedData?.length || 0,
        allottedCount: allottedData?.length || 0,
        pendingCount: 0,
      },
    });
  }

  // 3. Fetch Pending Students
  // For 1st Year: approved, in this exam session, roll_no is null or empty
  // For 2nd Year: approved, has 1st year roll_no, roll_no_2nd_year is null or empty, in [exam_session_id, prevSessionId]
  // For 3rd Year: approved, has 2nd year roll_no (or 1st year), roll_no_3rd_year is null or empty, in [exam_session_id, prevSessionId]
  let pendingQuery = supabaseAdmin
    .from("student_registrations")
    .select(`
      id,
      candidate_name,
      father_name,
      roll_no,
      roll_no_2nd_year,
      roll_no_3rd_year,
      enrollment_no,
      academic_session,
      session_label,
      created_at,
      colleges(college_name),
      courses(id, course_name)
    `)
    .eq("status", "approved");

  if (isThirdYear) {
    const sessionIds = prevSessionId ? [exam_session_id, prevSessionId] : [exam_session_id];
    pendingQuery = pendingQuery
      .in("exam_session_id", sessionIds)
      .not("roll_no_2nd_year", "is", null)
      .neq("roll_no_2nd_year", "")
      .or(`roll_no_3rd_year.is.null,roll_no_3rd_year.eq.""`);
  } else if (isSecondYear) {
    const sessionIds = prevSessionId ? [exam_session_id, prevSessionId] : [exam_session_id];
    pendingQuery = pendingQuery
      .in("exam_session_id", sessionIds)
      .not("roll_no", "is", null)
      .neq("roll_no", "")
      .or(`roll_no_2nd_year.is.null,roll_no_2nd_year.eq.""`);
  } else {
    pendingQuery = pendingQuery
      .eq("exam_session_id", exam_session_id)
      .or(`roll_no.is.null,roll_no.eq.""`);
  }

  pendingQuery = pendingQuery.order("created_at", { ascending: true });

  const { data: pendingData, error: pendingErr } = await pendingQuery;
  if (pendingErr) return NextResponse.json({ error: pendingErr.message }, { status: 500 });

  // 4. Calculate Projected Roll Numbers for Pending Students
  const seqMap = new Map();
  const pendingWithProjected = [];

  for (const s of pendingData || []) {
    let initials = "";
    if (isThirdYear && (s.roll_no_2nd_year || s.roll_no)) {
      const match = (s.roll_no_2nd_year || s.roll_no).match(/^[A-Za-z]+/);
      if (match) initials = match[0].toUpperCase();
    } else if (isSecondYear && s.roll_no) {
      const match = s.roll_no.match(/^[A-Za-z]+/);
      if (match) initials = match[0].toUpperCase();
    }
    if (!initials) {
      initials = deriveCollegePrefix(s.colleges?.college_name, "BAI");
    }

    const prefix = `${initials}${sessionDigits}`;

    if (!seqMap.has(prefix)) {
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
    const expectedRollNo = `${prefix}${String(currentSeq).padStart(2, "0")}`;

    pendingWithProjected.push({
      ...s,
      college_initials: initials,
      projected_roll_no: expectedRollNo,
    });
  }

  const allottedList = allottedData || [];
  const pendingList = pendingWithProjected || [];
  const totalApproved = allottedList.length + pendingList.length;

  return NextResponse.json({
    ok: true,
    data: allottedList,
    allotted: allottedList,
    pending: pendingList,
    stats: {
      totalApproved,
      allottedCount: allottedList.length,
      pendingCount: pendingList.length,
    },
    pattern_info: {
      session_digits: sessionDigits,
      target_year: isThirdYear ? "3rd Year" : isSecondYear ? "2nd Year" : "1st Year",
      roll_field: rollField,
    },
  });
}
