import { NextResponse } from "next/server";
import { requireCollege } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const session = await requireCollege(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search");

  let query = supabaseAdmin
    .from("student_registrations")
    .select(`
      id, enrollment_no, roll_no, candidate_name, father_name, dob,
      gender, phone, email, status, created_at, session_label,
      courses(course_name)
    `)
    .eq("college_id", session.college_id)
    .order("created_at", { ascending: false });

  if (status && status !== "all") query = query.eq("status", status);
  if (search) {
    query = query.or(`candidate_name.ilike.%${search}%,roll_no.ilike.%${search}%`);
  }

  const { data, error, count } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, data, total: count });
}
