import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const exam_session_id = searchParams.get("exam_session_id");
  const course_name = searchParams.get("course_name");
  const year_number = searchParams.get("year_number");

  if (!exam_session_id) return NextResponse.json({ error: "exam_session_id required" }, { status: 400 });

  // Get subjects for this course, joined with datesheet entries
  let subjectQuery = supabaseAdmin
    .from("course_subjects")
    .select("id, subject_name, subject_code, theory_max, practical_max, ca_max, year_number")
    .order("created_at", { ascending: true });
  if (course_name) subjectQuery = subjectQuery.eq("course_name", course_name);
  if (year_number) subjectQuery = subjectQuery.eq("year_number", Number(year_number));

  const { data: subjects, error: subjErr } = await subjectQuery;
  if (subjErr) return NextResponse.json({ error: subjErr.message }, { status: 500 });

  const subjectIds = (subjects || []).map(s => s.id);

  const { data: dateRows, error: dateErr } = await supabaseAdmin
    .from("datesheets")
    .select("subject_id, exam_date, exam_time")
    .eq("exam_session_id", exam_session_id)
    .in("subject_id", subjectIds);

  if (dateErr) return NextResponse.json({ error: dateErr.message }, { status: 500 });

  const dateMap = new Map((dateRows || []).map(d => [d.subject_id, d]));
  const data = (subjects || []).map(s => {
    const d = dateMap.get(s.id);
    return { ...s, exam_date: d?.exam_date || null, exam_time: d?.exam_time || null };
  });

  return NextResponse.json({ ok: true, data });
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { exam_session_id, entries } = body;
  // entries: [{subject_id, exam_date, exam_time}]

  if (!exam_session_id || !Array.isArray(entries)) return NextResponse.json({ error: "exam_session_id and entries array required" }, { status: 400 });

  const rows = entries.map(e => ({
    subject_id: e.subject_id,
    exam_session_id,
    exam_date: e.exam_date || null,
    exam_time: e.exam_time || null,
  }));

  const { error } = await supabaseAdmin
    .from("datesheets")
    .upsert(rows, { onConflict: "subject_id,exam_session_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
