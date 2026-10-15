import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { exam_session_id, prefix } = await request.json();
  if (!exam_session_id) return NextResponse.json({ error: "exam_session_id required" }, { status: 400 });

  // Fetch all approved students for this session without a roll number
  const { data: students, error: fetchErr } = await supabaseAdmin
    .from("student_registrations")
    .select("id, candidate_name, college_id")
    .eq("status", "approved")
    .eq("exam_session_id", exam_session_id)
    .is("roll_no", null)
    .order("created_at", { ascending: true });

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  if (!students || students.length === 0) return NextResponse.json({ ok: true, allotted: 0, message: "No eligible students found" });

  // Get session info for roll number prefix
  const { data: examSession } = await supabaseAdmin
    .from("exam_sessions")
    .select("session_label, academic_session")
    .eq("id", exam_session_id)
    .single();

  const year = new Date().getFullYear().toString().slice(-2);
  const rollPrefix = prefix || examSession?.academic_session?.replace(/[^0-9]/g, "").slice(-4) || year;

  // Get current max sequence for this session
  const { data: existing } = await supabaseAdmin
    .from("student_registrations")
    .select("roll_no")
    .eq("exam_session_id", exam_session_id)
    .not("roll_no", "is", null);

  let maxSeq = 0;
  (existing || []).forEach(r => {
    const num = parseInt(r.roll_no?.slice(-4) || "0");
    if (num > maxSeq) maxSeq = num;
  });

  const updates = students.map((s, i) => {
    const seq = String(maxSeq + i + 1).padStart(4, "0");
    return { id: s.id, roll_no: `${rollPrefix}${seq}` };
  });

  // Update each student
  const results = await Promise.all(
    updates.map(u =>
      supabaseAdmin.from("student_registrations").update({ roll_no: u.roll_no }).eq("id", u.id)
    )
  );

  const errors = results.filter(r => r.error);
  if (errors.length > 0) return NextResponse.json({ error: "Some roll numbers failed to save", details: errors.map(e => e.error?.message) }, { status: 500 });

  return NextResponse.json({ ok: true, allotted: updates.length, roll_numbers: updates });
}
