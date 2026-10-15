import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const courseId = searchParams.get("course_id");

  let query = supabaseAdmin
    .from("course_exam_config")
    .select("*, courses(course_name, course_code)")
    .order("created_at", { ascending: false });

  if (courseId) query = query.eq("course_id", courseId);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { course_id, exam_center, exam_date, exam_time, session_label, max_students } = body;

  if (!course_id || !exam_center) {
    return NextResponse.json({ error: "course_id and exam_center are required." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("course_exam_config")
    .insert({ course_id, exam_center, exam_date: exam_date || null, exam_time: exam_time || null, session_label: session_label || null, max_students: max_students || 100 })
    .select("*, courses(course_name, course_code)")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data }, { status: 201 });
}
