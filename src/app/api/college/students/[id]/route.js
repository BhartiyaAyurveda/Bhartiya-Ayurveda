import { NextResponse } from "next/server";
import { requireCollege } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request, { params }) {
  const session = await requireCollege(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("student_registrations")
    .select(`*, courses(id, course_name, duration_label), colleges(id, college_name, city, state)`)
    .eq("id", params.id)
    .eq("college_id", session.college_id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { data: queries } = await supabaseAdmin
    .from("registration_queries")
    .select("*")
    .eq("registration_id", params.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ ok: true, data, queries: queries || [] });
}

const RESUBMIT_FIELDS = [
  "candidate_name", "father_name", "mother_name", "dob", "gender", "category",
  "aadhar_no", "phone", "email", "address", "city", "state", "pincode",
  "photo_url", "tenth_marksheet_url", "twelfth_marksheet_url",
];

export async function PATCH(request, { params }) {
  const session = await requireCollege(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify student belongs to this college
  const { data: existing } = await supabaseAdmin
    .from("student_registrations")
    .select("id, college_id, status")
    .eq("id", params.id)
    .eq("college_id", session.college_id)
    .maybeSingle();

  if (!existing) return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });

  const body = await request.json();

  if (body.resubmit) {
    if (existing.status !== "query_raised") {
      return NextResponse.json({ error: "Only applications with a raised query can be resubmitted." }, { status: 400 });
    }
    const updates = { status: "submitted" };
    for (const key of RESUBMIT_FIELDS) {
      if (key in body) updates[key] = body[key] === "" ? null : body[key];
    }
    const { data, error } = await supabaseAdmin
      .from("student_registrations").update(updates).eq("id", params.id).select().single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });

    await supabaseAdmin
      .from("registration_queries")
      .update({ status: "resolved", resolved_at: new Date().toISOString() })
      .eq("registration_id", params.id)
      .eq("status", "open");

    return NextResponse.json({ ok: true, data });
  }

  const allowed = ["roll_no", "enrollment_no", "session_label"];
  const updates = {};
  for (const key of allowed) {
    if (key in body) updates[key] = body[key];
  }

  if (Object.keys(updates).length === 0)
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("student_registrations")
    .update(updates)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
