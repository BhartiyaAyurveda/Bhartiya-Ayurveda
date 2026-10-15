import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { consumePasswordResetToken } from "@/lib/password-reset";

export async function POST(request) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password are required" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const result = await consumePasswordResetToken(token);
    if (!result.valid) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const { error } = await supabaseAdmin
      .from("admins")
      .update({ password_hash: passwordHash })
      .eq("id", result.adminId);

    if (error) {
      console.error("Password update error:", error);
      return NextResponse.json({ error: "Failed to update password" }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Password updated successfully." });
  } catch (err) {
    console.error("Reset password error:", err);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
