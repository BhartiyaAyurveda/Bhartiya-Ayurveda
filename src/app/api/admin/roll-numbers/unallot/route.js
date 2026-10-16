import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { registration_id, target_year } = await request.json();
  if (!registration_id) return NextResponse.json({ error: "registration_id required" }, { status: 400 });

  const isThirdYear = target_year === 3 || target_year === "3" || target_year === "3rd";
  const isSecondYear = target_year === 2 || target_year === "2" || target_year === "2nd";
  const rollField = isThirdYear ? "roll_no_3rd_year" : isSecondYear ? "roll_no_2nd_year" : "roll_no";

  // Delete existing marks for this student
  await supabaseAdmin.from("student_subject_marks").delete().eq("registration_id", registration_id);

  const updateData = { [rollField]: null };
  if (!isSecondYear && !isThirdYear) {
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
