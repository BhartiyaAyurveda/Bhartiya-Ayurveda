import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyOtp } from "@/lib/otp";
import { signCollegeToken, COLLEGE_COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required." }, { status: 400 });
    }

    const result = await verifyOtp(email.trim().toLowerCase(), "college_login", otp.trim());
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    const { data: college } = await supabaseAdmin
      .from("colleges")
      .select("id, college_name, username, is_active")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (!college || !college.is_active) {
      return NextResponse.json({ error: "College account not found or inactive." }, { status: 403 });
    }

    const token = signCollegeToken({ college_id: college.id, username: college.username });

    const cookieStore = await cookies();
    cookieStore.set(COLLEGE_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24,
      path: "/",
    });

    return NextResponse.json({
      ok: true,
      college: { id: college.id, college_name: college.college_name, username: college.username },
    });
  } catch (err) {
    console.error("College OTP verify error:", err);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
