import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request, { params }) {
  const { data, error } = await supabaseAdmin
    .from("announcements")
    .select("id, title, content, attachment_url, attachment_name, created_at")
    .eq("id", params.id)
    .eq("is_published", true)
    .maybeSingle();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true, data });
}
