import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

// GET — list all queries for a registration
export async function GET(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("registration_queries")
    .select("*")
    .eq("registration_id", params.id)
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, queries: data });
}

// POST — raise a new query (sets status to query_raised)
export async function POST(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { field_name, message } = body;

  if (!field_name || !message) {
    return NextResponse.json({ error: "field_name and message are required" }, { status: 400 });
  }

  const { data: query, error: qErr } = await supabaseAdmin
    .from("registration_queries")
    .insert({ registration_id: params.id, field_name, message, status: "open" })
    .select()
    .single();

  if (qErr) return NextResponse.json({ error: qErr.message }, { status: 500 });

  // Update registration status to query_raised
  await supabaseAdmin
    .from("student_registrations")
    .update({ status: "query_raised" })
    .eq("id", params.id);

  return NextResponse.json({ ok: true, query });
}
