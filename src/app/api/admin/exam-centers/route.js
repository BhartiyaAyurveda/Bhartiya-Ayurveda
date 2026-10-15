import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("exam_centers")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, centers: data || [] });
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { center_name, center_code, address, city } = await request.json();
  if (!center_name || !center_code) {
    return NextResponse.json({ error: "center_name and center_code are required." }, { status: 400 });
  }

  const { data, error } = await supabaseAdmin
    .from("exam_centers")
    .insert({ center_name, center_code: center_code.trim().toUpperCase(), address: address || null, city: city || null })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, center: data }, { status: 201 });
}
