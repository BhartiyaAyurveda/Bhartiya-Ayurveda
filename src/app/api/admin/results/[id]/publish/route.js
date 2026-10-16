import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { getResultData } from "@/lib/result-data";
import { getStudentYearMeta, buildStudentYearMeta } from "@/lib/student-year-utils";

export async function POST(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  let targetYear = searchParams.get("target_year") || searchParams.get("year");

  // If not in query, check if JSON body has it
  if (!targetYear) {
    try {
      const body = await request.json();
      targetYear = body.target_year || body.year;
    } catch {}
  }

  // Fetch student to resolve year if still not specified
  const { data: reg, error: regErr } = await supabaseAdmin
    .from("student_registrations")
    .select("id, roll_no, roll_no_2nd_year, roll_no_3rd_year, session_label, result_published_at")
    .eq("id", params.id)
    .single();

  if (regErr || !reg) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const resolvedYear = targetYear ? Number(targetYear) : (reg.roll_no_3rd_year ? 3 : reg.roll_no_2nd_year ? 2 : 1);

  // Verify result is complete before publishing this year
  const { data: result, error: resultErr } = await getResultData(params.id, resolvedYear);
  if (resultErr) return NextResponse.json({ error: resultErr }, { status: 400 });
  if (result.final_result === "INCOMPLETE") {
    return NextResponse.json({ error: `Cannot publish — Year ${resolvedYear} marks are incomplete for some subjects` }, { status: 400 });
  }

  const nowIso = new Date().toISOString();
  const updatedMetaStr = buildStudentYearMeta(reg, {
    published: { [resolvedYear]: nowIso },
  });

  const { error } = await supabaseAdmin
    .from("student_registrations")
    .update({
      result_published_at: nowIso,
      session_label: updatedMetaStr,
    })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, published_year: resolvedYear });
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const targetYear = searchParams.get("target_year") || searchParams.get("year");

  const { data: reg, error: regErr } = await supabaseAdmin
    .from("student_registrations")
    .select("id, roll_no, roll_no_2nd_year, roll_no_3rd_year, session_label, result_published_at")
    .eq("id", params.id)
    .single();

  if (regErr || !reg) return NextResponse.json({ error: "Student not found" }, { status: 404 });

  const resolvedYear = targetYear ? Number(targetYear) : (reg.roll_no_3rd_year ? 3 : reg.roll_no_2nd_year ? 2 : 1);

  const updatedMetaStr = buildStudentYearMeta(reg, {
    published: { [resolvedYear]: null },
  });

  const parsedMeta = JSON.parse(updatedMetaStr);
  const remainingPublished = Object.values(parsedMeta.published || {}).filter(Boolean);
  const latestPublishedAt = remainingPublished.length > 0 ? remainingPublished[0] : null;

  const { error } = await supabaseAdmin
    .from("student_registrations")
    .update({
      result_published_at: latestPublishedAt,
      session_label: updatedMetaStr,
    })
    .eq("id", params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, unpublished_year: resolvedYear });
}
