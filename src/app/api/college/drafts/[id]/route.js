import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { requireCollege } from "@/lib/auth";

// GET — fetch single draft
export async function GET(request, { params }) {
  const session = await requireCollege(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("registration_drafts")
    .select("*")
    .eq("id", params.id)
    .eq("college_id", session.college_id)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Draft not found" }, { status: 404 });
  return NextResponse.json({ ok: true, draft: data });
}

// PATCH — autosave draft (deep-merge form_data)
export async function PATCH(request, { params }) {
  const session = await requireCollege(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { form_data, current_step } = body;
  if (!form_data) return NextResponse.json({ error: "form_data required" }, { status: 400 });

  // Fetch existing to deep-merge education field
  const { data: existing } = await supabaseAdmin
    .from("registration_drafts")
    .select("form_data")
    .eq("id", params.id)
    .eq("college_id", session.college_id)
    .maybeSingle();

  const merged = {
    ...(existing?.form_data || {}),
    ...form_data,
    education: {
      ...((existing?.form_data?.education) || {}),
      ...(form_data.education || {}),
    },
  };

  const updates = {
    form_data: merged,
    status: "draft",
    updated_at: new Date().toISOString(),
    candidate_name: merged.candidate_name || "",
    father_name: merged.father_name || "",
    course_id: merged.course_id || null,
  };
  if (current_step != null) updates.current_step = current_step;

  const { data, error } = await supabaseAdmin
    .from("registration_drafts")
    .update(updates)
    .eq("id", params.id)
    .eq("college_id", session.college_id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, draft: data });
}

// POST — same as PATCH, used by sendBeacon on page unload (beacon only supports POST)
export async function POST(request, { params }) {
  return PATCH(request, { params });
}

// DELETE — discard draft
export async function DELETE(request, { params }) {
  const session = await requireCollege(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin
    .from("registration_drafts")
    .delete()
    .eq("id", params.id)
    .eq("college_id", session.college_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
