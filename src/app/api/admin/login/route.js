import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";
import { requestOtp } from "@/lib/otp";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required." }, { status: 400 });
    }

    const { data: admin } = await supabaseAdmin
      .from("admins")
      .select("id, username, password_hash, full_name, is_active, email")
      .eq("username", username.trim().toLowerCase())
      .maybeSingle();

    if (!admin || !admin.is_active) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, admin.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // If admin has an email, use OTP 2FA
    if (admin.email) {
      const otpResult = await requestOtp(admin.email, "admin_login");
      if (!otpResult.success) {
        return NextResponse.json({ error: otpResult.error }, { status: 500 });
      }
      return NextResponse.json({
        ok: true,
        requireOtp: true,
        email: admin.email,
        maskedEmail: maskEmail(admin.email),
      });
    }

    // No email on admin — skip OTP, issue session directly (legacy fallback)
    const token = signAdminToken({ admin_id: admin.id, username: admin.username });
    const res = NextResponse.json({
      ok: true,
      requireOtp: false,
      admin: { id: admin.id, username: admin.username, full_name: admin.full_name },
    });
    res.cookies.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (err) {
    console.error("Admin login error:", err.message);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

function maskEmail(email) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.length > 3 ? local.slice(0, 3) : local.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(0, local.length - visible.length))}@${domain}`;
}
