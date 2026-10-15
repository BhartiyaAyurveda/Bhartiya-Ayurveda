import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET /api/admin/settings — fetch all system settings
export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin.from("system_settings").select("*");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const settings = {};
  for (const row of data) settings[row.key] = row.value;
  return NextResponse.json({ ok: true, settings });
}

// PATCH /api/admin/settings — update one or more settings
// Body: { key: "maintenance_mode", value: "true" }
export async function PATCH(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { key, value } = body;

  if (!key) return NextResponse.json({ error: "key required" }, { status: 400 });

  const { error } = await supabaseAdmin
    .from("system_settings")
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: "key" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, key, value });
}
