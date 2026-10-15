import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await supabaseAdmin
    .from("colleges")
    .select("id, college_name, username, email, phone, city, state, address, is_active, created_at")
    .order("college_name");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true, data });
}

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { college_name, username, password, email, phone, city, state, address } = body;

  if (!college_name || !username || !password) {
    return NextResponse.json({ error: "college_name, username, and password are required." }, { status: 400 });
  }

  const password_hash = await bcrypt.hash(password, 10);

  // Auto-assign college_code: next sequential 2-digit code
  const { count } = await supabaseAdmin.from("colleges").select("*", { count: "exact", head: true });
  const college_code = String((count || 0) + 1).padStart(2, "0");

  const { data, error } = await supabaseAdmin
    .from("colleges")
    .insert({ college_name, username: username.trim().toLowerCase(), password_hash, email, phone, city, state, address, college_code })
    .select("id, college_name, username, email, phone, city, state, college_code, is_active, created_at")
    .single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Username already taken." }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ ok: true, data }, { status: 201 });
}
