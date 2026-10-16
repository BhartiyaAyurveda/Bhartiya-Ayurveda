import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("student_registrations")
    .select(`
      *,
      courses(id, course_name, duration_label),
      colleges(id, college_name, city, state)
    `)
    .eq("id", params.id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  // Auto-mark as under_review when admin opens a pending/submitted application
  if (data.status === "pending" || data.status === "submitted") {
    await supabaseAdmin
      .from("student_registrations")
      .update({ status: "under_review" })
      .eq("id", params.id);
    data.status = "under_review";
  }

  // Fetch queries
  const { data: queries } = await supabaseAdmin
    .from("registration_queries")
    .select("*")
    .eq("registration_id", params.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ ok: true, data, queries: queries || [] });
}

export async function PATCH(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const allowed = [
    "status", "roll_no", "enrollment_no", "session_label", "academic_session",
    "candidate_name", "father_name", "mother_name", "dob", "gender", "category",
    "phone", "email", "address", "education",
    "high_school_board", "high_school_year", "high_school_percent",
    "inter_board", "inter_year", "inter_percent",
  ];
  const updates = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("student_registrations")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
