import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("courses")
    .select("id, course_name, course_name_hindi, course_code, duration_label, sort_order, category, eligibility, career_scope")
    .order("sort_order")
    .limit(1000);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}
