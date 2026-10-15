import { NextResponse } from "next/server";
import { verifyOtp } from "@/lib/otp";

export async function POST(request) {
  try {
    const { email, otp } = await request.json();
    if (!email?.trim() || !otp?.trim()) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    const result = await verifyOtp(email.trim(), "student_verification", otp.trim());
    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    return NextResponse.json({ ok: true, verified: true });
  } catch (err) {
    console.error("Verify OTP error:", err);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
