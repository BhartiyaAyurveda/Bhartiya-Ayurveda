import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Check student registration to find session and link exam_session_id if available
  const { data: currentReg } = await supabaseAdmin
    .from("student_registrations")
    .select("academic_session, session_label, exam_session_id")
    .eq("id", params.id)
    .single();

  const updateFields = { status: "approved" };

  if (currentReg && !currentReg.exam_session_id) {
    const rawDigits = (currentReg.academic_session || currentReg.session_label || "").replace(/\D/g, "");
    if (rawDigits) {
      const { data: allSessions } = await supabaseAdmin
        .from("exam_sessions")
        .select("id, session_name");

      const match = (allSessions || []).find((es) => {
        const esDigits = (es.session_name || "").replace(/\D/g, "");
        return esDigits && (esDigits.includes(rawDigits) || rawDigits.includes(esDigits));
      });

      if (match) {
        updateFields.exam_session_id = match.id;
      }
    }
  }

  const { data, error } = await supabaseAdmin
    .from("student_registrations")
    .update(updateFields)
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Resolve all open queries
  await supabaseAdmin
    .from("registration_queries")
    .update({ status: "resolved", resolved_at: new Date().toISOString() })
    .eq("registration_id", params.id)
    .eq("status", "open");

  return NextResponse.json({ ok: true, data });
}
