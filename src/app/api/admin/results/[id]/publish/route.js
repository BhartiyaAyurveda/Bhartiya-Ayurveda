import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getResultData } from "@/lib/result-data";

export async function POST(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Verify result is complete before publishing
  const { data: result, error: resultErr } = await getResultData(params.id);
  if (resultErr) return NextResponse.json({ error: resultErr }, { status: 400 });
  if (result.final_result === "INCOMPLETE") return NextResponse.json({ error: "Cannot publish — marks are incomplete for some subjects" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("student_registrations")
    .update({ result_published_at: new Date().toISOString() })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin
    .from("student_registrations")
    .update({ result_published_at: null })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
