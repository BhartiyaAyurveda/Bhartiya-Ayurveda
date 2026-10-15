import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { supabaseAdmin } from "@/lib/supabase";
import { verifyOtp } from "@/lib/otp";
import { signAdminToken, ADMIN_COOKIE_NAME } from "@/lib/auth";

// Called after credentials are verified — completes the OTP 2FA step and issues the session cookie
export async function POST(request) {
  try {
    const { email, otp } = await request.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const result = await verifyOtp(email.trim().toLowerCase(), "admin_login", otp.trim());
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Fetch the admin record by email to issue the session
    const { data: admin } = await supabaseAdmin
      .from("admins")
      .select("id, username, full_name, is_active, email")
      .eq("email", email.trim().toLowerCase())
      .maybeSingle();

    if (!admin || !admin.is_active) {
      return NextResponse.json({ error: "Admin account not found or inactive" }, { status: 403 });
    }

    const token = signAdminToken({ admin_id: admin.id, username: admin.username });

    const cookieStore = await cookies();
    cookieStore.set(ADMIN_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return NextResponse.json({
      ok: true,
      admin: { id: admin.id, username: admin.username, full_name: admin.full_name },
    });
  } catch (err) {
    console.error("Admin OTP verify error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
