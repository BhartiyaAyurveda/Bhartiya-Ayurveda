import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase";
import { signCollegeToken, COLLEGE_COOKIE_NAME } from "@/lib/auth";

export async function POST(request) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password required." }, { status: 400 });
    }

    const { data: college } = await supabaseAdmin
      .from("colleges")
      .select("id, college_name, username, password_hash, is_active")
      .eq("username", username.trim().toLowerCase())
      .maybeSingle();

    if (!college || !college.is_active) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, college.password_hash);
    if (!valid) {
      return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
    }

    // Credentials valid — issue session directly (no OTP)
    const token = signCollegeToken({ college_id: college.id, username: college.username });
    const res = NextResponse.json({
      ok: true,
      college: { id: college.id, college_name: college.college_name, username: college.username },
    });
    res.cookies.set(COLLEGE_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
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
