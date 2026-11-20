import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { parseYear, rollFieldForYear } from "@/lib/student-year-utils";

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { registration_id, target_year } = await request.json();
  if (!registration_id) return NextResponse.json({ error: "registration_id required" }, { status: 400 });

  const year = parseYear(target_year);
  const rollField = rollFieldForYear(year);

  // Delete existing marks for this student
  await supabaseAdmin.from("student_subject_marks").delete().eq("registration_id", registration_id);

  const updateData = { [rollField]: null };
  if (year === 1) {
    updateData.admit_card_generated_at = null;
    updateData.result_published_at = null;
  }

  // Clear roll number and admit card
  const { error } = await supabaseAdmin
    .from("student_registrations")
    .update(updateData)
    .eq("id", registration_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
