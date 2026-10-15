import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireCollege } from "@/lib/auth";

// GET — list all non-submitted drafts for this college
export async function GET(request) {
  const session = await requireCollege(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("registration_drafts")
    .select("id, candidate_name, father_name, email, status, current_step, course_id, form_data, created_at, updated_at")
    .eq("college_id", session.college_id)
    .neq("status", "submitted")
    .order("updated_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, drafts: data || [] });
}

// POST — create a new draft after email OTP verification
export async function POST(request) {
  const session = await requireCollege(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { email, candidate_name, father_name, form_data } = body;

  if (!email) return NextResponse.json({ error: "email is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("registration_drafts")
    .insert({
      college_id: session.college_id,
      email: email.trim().toLowerCase(),
      candidate_name: candidate_name || "",
      father_name: father_name || "",
      status: "verified",
      current_step: 1,
      course_id: form_data?.course_id || null,
      form_data: form_data || {},
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, draft: data });
}
