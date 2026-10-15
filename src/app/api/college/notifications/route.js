import { NextResponse } from "next/server";
import { requireCollege } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const session = await requireCollege(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("registration_queries")
    .select(`
      id, field_name, message, status, created_at, resolved_at,
      student_registrations!inner(id, candidate_name, enrollment_no, college_id)
    `)
    .eq("student_registrations.college_id", session.college_id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ ok: true, notifications: data || [] });
}
