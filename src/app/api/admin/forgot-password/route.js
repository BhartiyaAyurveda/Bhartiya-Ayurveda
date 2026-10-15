import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { createPasswordResetToken } from "@/lib/password-reset";
import { sendPasswordResetEmail } from "@/lib/brevo";

export async function POST(request) {
  try {
    const { username } = await request.json();
    if (!username?.trim()) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    const { data: admin } = await supabaseAdmin
      .from("admins")
      .select("id, username, email, is_active")
      .eq("username", username.trim().toLowerCase())
      .maybeSingle();

    // Always return success to prevent username enumeration
    if (!admin || !admin.is_active || !admin.email) {
      return NextResponse.json({ ok: true, message: "If that username exists, a reset email has been sent." });
    }

    const token = await createPasswordResetToken(admin.id);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    const resetUrl = `${siteUrl}/super-admin/reset-password?token=${token}`;

    await sendPasswordResetEmail(admin.email, resetUrl);

    return NextResponse.json({ ok: true, message: "Password reset email sent." });
  } catch (err) {
    console.error("Forgot password error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
