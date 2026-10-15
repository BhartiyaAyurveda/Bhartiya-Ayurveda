import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { DEFAULT_ABOUT } from "@/lib/about-defaults";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabaseAdmin
    .from("system_settings")
    .select("value")
    .eq("key", "about_content")
    .maybeSingle();

  const content = data?.value ? { ...DEFAULT_ABOUT, ...JSON.parse(data.value) } : DEFAULT_ABOUT;
  return NextResponse.json({ ok: true, content });
}

export async function PUT(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();

  const { error } = await supabaseAdmin
    .from("system_settings")
    .upsert({ key: "about_content", value: JSON.stringify(body), updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
