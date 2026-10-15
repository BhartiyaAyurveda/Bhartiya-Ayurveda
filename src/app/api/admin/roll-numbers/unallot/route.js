import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { registration_id } = await request.json();
  if (!registration_id) return NextResponse.json({ error: "registration_id required" }, { status: 400 });

  // Delete existing marks for this student
  await supabaseAdmin.from("student_subject_marks").delete().eq("registration_id", registration_id);

  // Clear roll number and admit card
  const { error } = await supabaseAdmin
    .from("student_registrations")
    .update({ roll_no: null, admit_card_generated_at: null, result_published_at: null })
    .eq("id", registration_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
