import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const exam_session_id = searchParams.get("exam_session_id");

  let query = supabaseAdmin
    .from("student_registrations")
    .select("id, candidate_name, roll_no, exam_session_id, admit_card_generated_at, colleges(college_name), courses(course_name)")
    .eq("status", "approved")
    .not("roll_no", "is", null)
    .order("roll_no", { ascending: true });

  if (exam_session_id) query = query.eq("exam_session_id", exam_session_id);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data: data || [] });
}
