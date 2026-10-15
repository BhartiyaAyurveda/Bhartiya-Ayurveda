import { NextResponse } from "next/server";
import { requestOtp, verifyOtp } from "@/lib/otp";

export async function POST(request) {
  try {
    const { action, email, otp } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    if (action === "send") {
      const result = await requestOtp(email.trim().toLowerCase(), "student_verification");
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 429 });
      }
      return NextResponse.json({ ok: true, message: "OTP sent to your email." });
    }

    if (action === "verify") {
      if (!otp) return NextResponse.json({ error: "OTP is required." }, { status: 400 });
      const result = await verifyOtp(email.trim().toLowerCase(), "student_verification", otp.trim());
      if (!result.success) {
        return NextResponse.json({ error: result.error }, { status: 400 });
      }
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json({ error: "Invalid action." }, { status: 400 });
  } catch (err) {
    console.error("OTP route error:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
