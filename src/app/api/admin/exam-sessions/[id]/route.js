import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const allowed = ["session_name", "start_date", "end_date", "is_active"];
  const updates = {};
  for (const key of allowed) { if (key in body) updates[key] = body[key]; }

  // If activating, deactivate all others first
  if (updates.is_active === true) {
    await supabaseAdmin.from("exam_sessions").update({ is_active: false }).neq("id", params.id);
  }

  const { data, error } = await supabaseAdmin
    .from("exam_sessions").update(updates).eq("id", params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin.from("exam_sessions").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
