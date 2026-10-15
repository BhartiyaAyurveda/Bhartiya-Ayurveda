import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("student_registrations")
    .update({ status: "approved" })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Resolve all open queries
  await supabaseAdmin
    .from("registration_queries")
    .update({ status: "resolved", resolved_at: new Date().toISOString() })
    .eq("registration_id", params.id)
    .eq("status", "open");

  return NextResponse.json({ ok: true, data });
}
