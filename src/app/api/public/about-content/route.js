import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { DEFAULT_ABOUT } from "@/lib/about-defaults";

export const dynamic = "force-dynamic";

export async function GET() {
  const { data } = await supabaseAdmin
    .from("system_settings")
    .select("value")
    .eq("key", "about_content")
    .maybeSingle();

  const content = data?.value ? { ...DEFAULT_ABOUT, ...JSON.parse(data.value) } : DEFAULT_ABOUT;
  return NextResponse.json({ ok: true, content });
}
