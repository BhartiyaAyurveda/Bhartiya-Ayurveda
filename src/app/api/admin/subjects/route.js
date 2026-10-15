import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const course_name = searchParams.get("course_name");

  let query = supabaseAdmin.from("course_subjects").select("*").order("created_at", { ascending: true });
  if (course_name) query = query.eq("course_name", course_name);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data: data || [] });
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { course_name, subject_name, subject_code, theory_max, practical_max, ca_max, year_number } = body;

  if (!course_name || !subject_name) return NextResponse.json({ error: "course_name and subject_name are required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("course_subjects")
    .insert({ course_name, subject_name, subject_code: subject_code || null, theory_max: theory_max ?? 100, practical_max: practical_max ?? 0, ca_max: ca_max ?? 0, year_number: year_number ?? 1 })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data }, { status: 201 });
}
