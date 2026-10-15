"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Lock, User, Eye, EyeOff, CheckCircle2, AlertCircle, RefreshCw, ShieldCheck } from "lucide-react";

export default function SuperAdminLoginPage() {
  const router = useRouter();

  // Step 1: credentials
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Step 2: OTP
  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [maskedEmail, setMaskedEmail] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const digitRefs = useRef([]);
  const otp = digits.join("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!username.trim() || !password) { setErrorMessage("Username and password are required."); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMessage(data.error || "Invalid credentials."); setIsLoading(false); return; }

      if (data.requireOtp) {
        setMaskedEmail(data.maskedEmail);
        setPendingEmail(data.email);
        setStep("otp");
        setDigits(["", "", "", "", "", ""]);
        startResendCooldown();
        setTimeout(() => digitRefs.current[0]?.focus(), 100);
      } else {
        setIsSuccess(true);
        setTimeout(() => router.push("/super-admin/dashboard"), 800);
      }
    } catch {
      setErrorMessage("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (!otp.trim()) { setErrorMessage("Please enter the OTP."); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMessage(data.error || "Invalid OTP."); setIsLoading(false); return; }
      setIsSuccess(true);
      setTimeout(() => router.push("/super-admin/dashboard"), 800);
    } catch {
      setErrorMessage("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setErrorMessage("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setErrorMessage(data.error || "Failed to resend OTP."); return; }
      if (data.requireOtp) startResendCooldown();
    } catch {
      setErrorMessage("Network error.");
    }
  };

  const startResendCooldown = () => {
    setResendCooldown(60);
    const t = setInterval(() => {
      setResendCooldown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
    }, 1000);
  };

  return (
    <main className="min-h-screen bg-[#F2EDE4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-[#C59B3F]/40 shadow-lg">
            <Image src="/logo.png" alt="Bhartiya Ayurveda" fill className="object-cover" />
          </div>
          <div className="text-center space-y-0.5">
            <p className="text-sm font-bold text-[#C59B3F] tracking-wide">
              भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्
            </p>
            <p className="text-xs text-[#5C8261]">Super Admin Portal</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-7 shadow-lg border border-[#DDD1BE] space-y-5">
          {errorMessage && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{errorMessage}</span>
            </div>
          )}
          {isSuccess && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
              <CheckCircle2 className="w-4 h-4 shrink-0" /><span>Login successful! Redirecting...</span>
            </div>
          )}

          {/* ── STEP 1: Credentials ── */}
          {step === "credentials" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1.5">Username</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C8261]" />
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="superadmin" autoComplete="username" disabled={isLoading || isSuccess}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] placeholder-[#C8B79E] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] disabled:opacity-50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C8261]" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="Enter password" autoComplete="current-password" disabled={isLoading || isSuccess}
                    className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] placeholder-[#C8B79E] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] disabled:opacity-50"
                  />
                  <button type="button" tabIndex={-1} onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C8261] hover:text-[#0E3320]">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading || isSuccess}
                className="w-full py-3 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer">
                {isLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Verifying...</span></> : <span>Sign In</span>}
              </button>

              <div className="text-center pt-1">
                <Link href="/super-admin/forgot-password" className="text-xs text-[#5C8261] hover:text-[#C59B3F] transition-colors">
                  Forgot password?
                </Link>
              </div>
            </form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center space-y-1.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0E3320] to-[#15482D] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <ShieldCheck className="w-7 h-7 text-[#C59B3F]" />
                </div>
                <p className="text-base font-bold text-[#0E3320]">Two-Factor Verification</p>
                <p className="text-xs text-[#5C8261] leading-relaxed">
                  A 6-digit OTP has been sent to<br />
                  <strong className="text-[#0E3320]">{maskedEmail}</strong>
                </p>
              </div>

              {/* 6-digit boxes */}
              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5C8261] mb-3 text-center">Enter OTP</label>
                <div className="flex justify-center gap-1.5 sm:gap-2.5 w-full">
                  {digits.map((d, i) => (
                    <input
                      key={i}
                      ref={el => digitRefs.current[i] = el}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={d}
                      disabled={isLoading || isSuccess}
                      autoComplete="one-time-code"
                      onChange={e => {
                        const val = e.target.value.replace(/\D/g, "").slice(-1);
                        const next = [...digits];
                        next[i] = val;
                        setDigits(next);
                        if (val && i < 5) digitRefs.current[i + 1]?.focus();
                      }}
                      onKeyDown={e => {
                        if (e.key === "Backspace" && !digits[i] && i > 0) {
                          digitRefs.current[i - 1]?.focus();
                        }
                        if (e.key === "ArrowLeft" && i > 0) digitRefs.current[i - 1]?.focus();
                        if (e.key === "ArrowRight" && i < 5) digitRefs.current[i + 1]?.focus();
                      }}
                      onPaste={e => {
                        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                        if (pasted.length > 0) {
                          const next = [...digits];
                          for (let j = 0; j < 6; j++) next[j] = pasted[j] || "";
                          setDigits(next);
                          const focusIdx = Math.min(pasted.length, 5);
                          digitRefs.current[focusIdx]?.focus();
                        }
                        e.preventDefault();
                      }}
                      className={`flex-1 min-w-0 max-w-[52px] aspect-square text-center text-lg sm:text-xl font-bold rounded-xl border-2 bg-[#FAF8F5] text-[#0E3320] font-mono transition-all focus:outline-none disabled:opacity-50
                        ${d ? "border-[#0E3320] bg-[#F0F7F2] shadow-sm" : "border-[#DDD1BE] focus:border-[#C59B3F] focus:ring-2 focus:ring-[#C59B3F]/20 focus:bg-white"}`}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isLoading || isSuccess || otp.length < 6}
                className="w-full py-3 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer shadow-md">
                {isLoading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Verifying...</span></>
                  : <span>Verify OTP</span>}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button type="button" onClick={() => { setStep("credentials"); setDigits(["","","","","",""]); setErrorMessage(""); }}
                  className="text-[#5C8261] hover:text-[#0E3320] font-medium transition-colors">
                  Back
                </button>
                <button type="button" onClick={handleResendOtp} disabled={resendCooldown > 0}
                  className="flex items-center gap-1.5 text-[#5C8261] hover:text-[#C59B3F] disabled:opacity-40 transition-colors font-medium">
                  <RefreshCw className="w-3 h-3" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-xs text-[#5C8261] hover:text-[#0E3320] transition-colors">
            Back to Website
          </Link>
        </div>
      </div>
    </main>
  );
}
