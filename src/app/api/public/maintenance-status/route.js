import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET() {
  const { data } = await supabaseAdmin
    .from("system_settings")
    .select("key, value")
    .in("key", ["maintenance_mode", "maintenance_message"]);

  const settings = {};
  for (const row of data || []) settings[row.key] = row.value;

  return NextResponse.json({
    maintenance: settings.maintenance_mode === "true",
    message: settings.maintenance_message || "We are currently undergoing scheduled maintenance. Please check back shortly.",
  });
}
