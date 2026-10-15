import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { signCollegeToken, COLLEGE_COOKIE_NAME } from "@/lib/auth";
import { requestOtp } from "@/lib/otp";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required." }, { status: 400 });
    }

    const { data: college } = await supabaseAdmin
      .from("colleges")
      .select("id, college_name, username, password_hash, is_active, email")
      .eq("username", username.trim().toLowerCase())
      .maybeSingle();

    if (!college || !college.is_active) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, college.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // If college has an email, use OTP 2FA
    if (college.email) {
      const otpResult = await requestOtp(college.email, "college_login");
      if (!otpResult.success) {
        return NextResponse.json({ error: otpResult.error }, { status: 500 });
      }
      return NextResponse.json({
        ok: true,
        requireOtp: true,
        email: college.email,
        maskedEmail: maskEmail(college.email),
      });
    }

    // No email — skip OTP, issue session directly
    const token = signCollegeToken({ college_id: college.id, username: college.username });
    const res = NextResponse.json({
      ok: true,
      requireOtp: false,
      college: { id: college.id, college_name: college.college_name, username: college.username },
    });
    res.cookies.set(COLLEGE_COOKIE_NAME, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
    return res;
  } catch (err) {
    console.error("College login error:", err.message);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}

function maskEmail(email) {
  const [local, domain] = email.split("@");
  if (!local || !domain) return email;
  const visible = local.length > 3 ? local.slice(0, 3) : local.slice(0, 1);
  return `${visible}${"*".repeat(Math.max(0, local.length - visible.length))}@${domain}`;
}
