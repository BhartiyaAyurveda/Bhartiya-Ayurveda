import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("announcements")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data: data || [] });
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { title, title_hi, content, content_hi, is_published, attachment_url, attachment_name } = body;
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("announcements")
    .insert({ title, title_hi: title_hi || null, content: content || null, content_hi: content_hi || null, is_published: is_published || false, attachment_url: attachment_url || null, attachment_name: attachment_name || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data }, { status: 201 });
}
