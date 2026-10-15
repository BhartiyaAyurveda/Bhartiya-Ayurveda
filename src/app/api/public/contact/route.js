import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, phone, query_type, message } = body;

    if (!name?.trim() || !phone?.trim() || !email?.trim() || !message?.trim()) {
      return NextResponse.json({ error: "Name, email, phone and message are required." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("contact_inquiries")
      .insert({
        full_name: name.trim(),
        email:     email.trim().toLowerCase(),
        phone:     phone.trim(),
        subject:   query_type || "General Inquiry",
        message:   message.trim(),
        status:    "new",
        is_read:   false,
      })
      .select("id")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, id: data.id });
  } catch {
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
