import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getResultData, upsertSubjectMarks } from "@/lib/result-data";

export async function GET(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await getResultData(params.id);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}

export async function POST(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { marks } = body;
  // marks: [{subject_id, theory_marks, practical_marks, ca_marks}]

  if (!Array.isArray(marks)) return NextResponse.json({ error: "marks array required" }, { status: 400 });

  const { error } = await upsertSubjectMarks(params.id, marks);
  if (error) return NextResponse.json({ error }, { status: 500 });

  // Return updated result
  const { data, error: resultErr } = await getResultData(params.id);
  if (resultErr) return NextResponse.json({ ok: true });
  return NextResponse.json({ ok: true, data });
}
