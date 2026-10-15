import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { subject_name, subject_code, theory_max, practical_max, ca_max } = body;

  const { data, error } = await supabaseAdmin
    .from("course_subjects")
    .update({ subject_name, subject_code, theory_max, practical_max, ca_max })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Block delete if marks exist
  const { data: marks } = await supabaseAdmin
    .from("student_subject_marks")
    .select("id")
    .eq("subject_id", params.id)
    .limit(1);

  if (marks && marks.length > 0) return NextResponse.json({ error: "Cannot delete subject with existing student marks" }, { status: 400 });

  const { error } = await supabaseAdmin.from("course_subjects").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
