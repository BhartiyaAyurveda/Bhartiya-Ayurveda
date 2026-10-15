import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json().catch(() => ({}));
  const reason = body.reason || "";

  const { data, error } = await supabaseAdmin
    .from("student_registrations")
    .update({ status: "rejected" })
    .eq("id", params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (reason) {
    await supabaseAdmin.from("registration_queries").insert({
      registration_id: params.id,
      field_name: "general",
      message: `Rejection reason: ${reason}`,
      status: "open",
    });
  }

  return NextResponse.json({ ok: true, data });
}
