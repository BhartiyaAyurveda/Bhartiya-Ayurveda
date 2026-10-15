import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getAdmitCardData } from "@/lib/admit-card-data";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const exam_session_id = searchParams.get("exam_session_id");
  if (!exam_session_id) return NextResponse.json({ error: "exam_session_id required" }, { status: 400 });

  // Fetch eligible students: approved + roll number allotted
  const { data: students, error: fetchErr } = await supabaseAdmin
    .from("student_registrations")
    .select("id, candidate_name, roll_no")
    .eq("status", "approved")
    .eq("exam_session_id", exam_session_id)
    .not("roll_no", "is", null)
    .order("roll_no", { ascending: true });

  if (fetchErr) return NextResponse.json({ error: fetchErr.message }, { status: 500 });
  if (!students || students.length === 0) return NextResponse.json({ ok: true, admitCards: [], skipped: [] });

  const admitCards = [];
  const skipped = [];

  for (const student of students) {
    const { data, error } = await getAdmitCardData(student.id);
    if (error) {
      skipped.push({ id: student.id, candidate_name: student.candidate_name, roll_no: student.roll_no, reason: error });
    } else {
      admitCards.push({ id: student.id, ...data });
    }
  }

  return NextResponse.json({ ok: true, admitCards, skipped });
}
