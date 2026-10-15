"use client";

import { useState, useEffect, useRef } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Building2, Lock, Eye, EyeOff, CheckCircle2, AlertCircle,
  ShieldCheck, HelpCircle, X, Mail, Phone, RefreshCw,
} from "lucide-react";

export default function CollegeLoginPage() {
  const { contact } = useSiteSettings();
  const router = useRouter();

  // Step 1 state
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Step 2 state
  const [step, setStep] = useState("credentials"); // "credentials" | "otp"
  const [maskedEmail, setMaskedEmail] = useState("");
  const [pendingEmail, setPendingEmail] = useState("");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const digitRefs = useRef([]);
  const otp = digits.join("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");
  const [showHelpModal, setShowHelpModal] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("ba_college_saved_user");
      if (saved) { setUsername(saved); setRememberMe(true); }
    } catch { /* ignore */ }
  }, []);

  const startResendCooldown = () => {
    setResendCooldown(60);
    const t = setInterval(() => {
      setResendCooldown(c => { if (c <= 1) { clearInterval(t); return 0; } return c - 1; });
    }, 1000);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    const cleanUser = username.trim();
    if (!cleanUser || !password) { setError("Username and password are required."); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/college/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: cleanUser, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid username or password."); setIsLoading(false); return; }

      if (data.requireOtp) {
        setMaskedEmail(data.maskedEmail);
        setPendingEmail(data.email);
        setStep("otp");
        setDigits(["", "", "", "", "", ""]);
        setTimeout(() => digitRefs.current[0]?.focus(), 100);
        startResendCooldown();
        setIsLoading(false);
        return;
      }

      // No OTP required — direct login
      try {
        if (rememberMe) localStorage.setItem("ba_college_saved_user", cleanUser);
        else localStorage.removeItem("ba_college_saved_user");
      } catch { /* ignore */ }
      setIsSuccess(true);
      setTimeout(() => router.push("/college/dashboard"), 600);
    } catch {
      setError("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    if (!otp.trim()) { setError("Please enter the OTP."); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/college/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: pendingEmail, otp: otp.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Invalid OTP."); setIsLoading(false); return; }

      try {
        if (rememberMe) localStorage.setItem("ba_college_saved_user", username.trim());
        else localStorage.removeItem("ba_college_saved_user");
      } catch { /* ignore */ }
      setIsSuccess(true);
      setTimeout(() => router.push("/college/dashboard"), 600);
    } catch {
      setError("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError("");
    try {
      const res = await fetch("/api/college/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to resend OTP."); return; }
      if (data.requireOtp) startResendCooldown();
    } catch {
      setError("Network error.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F4EFE6] text-[#0E3320] flex flex-col justify-between relative overflow-hidden selection:bg-[#C59B3F] selection:text-white">
      <div className="absolute -top-40 -left-40 w-[480px] h-[480px] bg-[#0E3320]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-[480px] h-[480px] bg-[#C59B3F]/15 rounded-full blur-3xl pointer-events-none" />

      <header className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between relative z-10">
        <Link href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0E3320] hover:text-[#C59B3F] bg-white/80 hover:bg-white backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#E2D7C5] shadow-xs transition-all active:scale-95">
          <span>Website</span>
        </Link>
        <Link href="/affiliated-institutes"
          className="text-xs font-semibold text-[#0E3320] hover:text-[#C59B3F] bg-white/80 hover:bg-white backdrop-blur-sm px-3.5 py-1.5 rounded-full border border-[#E2D7C5] shadow-xs transition-all active:scale-95">
          Institutes Directory
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center px-4 py-6 relative z-10">
        <div className="w-full max-w-[420px] bg-white rounded-3xl border border-[#E2D7C5] shadow-[0_20px_50px_-12px_rgba(11,38,24,0.12)] p-7 sm:p-9 relative">
          <div className="w-12 h-1 bg-gradient-to-r from-[#0E3320] via-[#C59B3F] to-[#0E3320] rounded-full mx-auto mb-6" />

          <div className="flex flex-col items-center text-center space-y-2 mb-6">
            <div className="relative w-20 h-20 rounded-2xl bg-[#FAF8F5] p-2 ring-1 ring-[#C59B3F]/30 shadow-xs overflow-hidden mb-1">
              <Image src="/logo.png" alt="Bhartiya Ayurveda" fill sizes="80px" className="object-contain p-1" priority />
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-bold tracking-wide uppercase bg-[#0E3320] text-[#E4BF64] shadow-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Affiliated College Portal
            </span>
            <h1 className="text-base sm:text-lg font-bold font-devanagari text-[#0E3320] leading-snug">
              भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्
            </h1>
            <p className="text-[11px] font-semibold text-[#8C671D] tracking-wide leading-tight">
              Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
            </p>
            <p className="text-xs text-[#5C8261]">
              {step === "otp" ? "Two-factor verification" : "Enter credentials to access college dashboard"}
            </p>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" /><span>{error}</span>
            </div>
          )}
          {isSuccess && (
            <div className="mb-4 flex items-center gap-2.5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" /><span>Login successful! Opening dashboard...</span>
            </div>
          )}

          {/* ── STEP 1: Credentials ── */}
          {step === "credentials" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320]">Username / College Code</label>
                <div className="relative group">
                  <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C8261] group-focus-within:text-[#0E3320] transition-colors" />
                  <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                    placeholder="college_username" autoComplete="username" autoCapitalize="none" spellCheck="false"
                    disabled={isLoading || isSuccess}
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] placeholder-[#C8B79E] font-medium focus:outline-none focus:ring-4 focus:ring-[#C59B3F]/15 focus:border-[#C59B3F] focus:bg-white transition-all disabled:opacity-50" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320]">Password</label>
                <div className="relative group">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C8261] group-focus-within:text-[#0E3320] transition-colors" />
                  <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••••••" autoComplete="current-password" disabled={isLoading || isSuccess}
                    className="w-full pl-10 pr-11 py-2.5 sm:py-3 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] placeholder-[#C8B79E] font-medium focus:outline-none focus:ring-4 focus:ring-[#C59B3F]/15 focus:border-[#C59B3F] focus:bg-white transition-all disabled:opacity-50" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} tabIndex={-1}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#5C8261] hover:text-[#0E3320] p-1 transition-colors">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-0.5">
                <label className="flex items-center gap-2 cursor-pointer select-none text-[#5C8261] hover:text-[#0E3320] transition-colors">
                  <input type="checkbox" checked={rememberMe} onChange={e => setRememberMe(e.target.checked)}
                    disabled={isLoading || isSuccess}
                    className="w-3.5 h-3.5 rounded border-[#DDD1BE] text-[#0E3320] focus:ring-[#C59B3F] accent-[#0E3320]" />
                  <span>Remember ID</span>
                </label>
                <button type="button" onClick={() => setShowHelpModal(true)} className="text-xs text-[#8C671D] hover:text-[#0E3320] font-semibold transition-colors">
                  Need Help?
                </button>
              </div>

              <button type="submit" disabled={isLoading || isSuccess}
                className="w-full py-3 sm:py-3.5 px-4 rounded-xl bg-[#0E3320] hover:bg-[#15482D] active:scale-[0.98] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:pointer-events-none mt-2">
                {isLoading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Signing in...</span></>
                  : isSuccess
                  ? <><CheckCircle2 className="w-4 h-4 text-emerald-400" /><span>Redirecting...</span></>
                  : <><span>Sign In to Dashboard</span></>}
              </button>
            </form>
          )}

          {/* ── STEP 2: OTP ── */}
          {step === "otp" && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center space-y-1 mb-2">
                <div className="w-12 h-12 rounded-full bg-[#F0FDF4] border-2 border-[#0E3320] flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck className="w-6 h-6 text-[#0E3320]" />
                </div>
                <p className="text-sm font-bold text-[#0E3320]">Two-Factor Verification</p>
                <p className="text-xs text-[#5C8261]">
                  A 6-digit OTP has been sent to <strong className="text-[#0E3320]">{maskedEmail}</strong>
                </p>
              </div>

              <div className="space-y-2">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] text-center">Enter 6-Digit OTP</label>
                <div className="flex items-center justify-center gap-1.5 sm:gap-2 w-full">
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
                        e.preventDefault();
                        const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                        const next = ["", "", "", "", "", ""];
                        pasted.split("").forEach((ch, idx) => { next[idx] = ch; });
                        setDigits(next);
                        const focusIdx = Math.min(pasted.length, 5);
                        digitRefs.current[focusIdx]?.focus();
                      }}
                      className={`flex-1 min-w-0 max-w-[52px] aspect-square text-center text-lg sm:text-xl font-bold rounded-xl border-2 outline-none transition-all disabled:opacity-50
                        ${d
                          ? "border-[#0E3320] bg-[#0E3320] text-white"
                          : "border-[#DDD1BE] bg-[#FAF8F5] text-[#0E3320]"}
                        focus:ring-4 focus:ring-[#C59B3F]/25 focus:border-[#C59B3F]`}
                    />
                  ))}
                </div>
              </div>

              <button type="submit" disabled={isLoading || isSuccess || otp.length < 6 || digits.some(d => !d)}
                className="w-full py-3 sm:py-3.5 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70">
                {isLoading
                  ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Verifying...</span></>
                  : <span>Verify & Sign In</span>}
              </button>

              <div className="flex items-center justify-between text-xs pt-1">
                <button type="button" onClick={() => { setStep("credentials"); setDigits(["","","","","",""]); setError(""); }}
                  className="text-[#5C8261] hover:text-[#0E3320] transition-colors">
                  Back
                </button>
                <button type="button" onClick={handleResendOtp} disabled={resendCooldown > 0}
                  className="flex items-center gap-1 text-[#5C8261] hover:text-[#C59B3F] disabled:opacity-40 transition-colors">
                  <RefreshCw className="w-3 h-3" />
                  {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : "Resend OTP"}
                </button>
              </div>
            </form>
          )}

          <div className="pt-5 mt-5 border-t border-[#EBE2D4] flex items-center justify-center gap-1.5 text-[11px] text-[#5C8261]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C59B3F]" />
            <span>Authorized Nodal Portal • 256-Bit SSL</span>
          </div>
        </div>
      </main>

      <footer className="w-full max-w-5xl mx-auto px-4 py-4 text-center text-xs text-[#8C9E90] relative z-10">
        © {new Date().getFullYear()} Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
      </footer>

      {showHelpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full border border-[#DDD1BE] shadow-2xl p-6 space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#C59B3F]" />
                <h3 className="text-base font-bold text-[#0E3320]">Login Support</h3>
              </div>
              <button onClick={() => setShowHelpModal(false)} className="text-gray-400 hover:text-gray-700 p-1 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-[#5C8261] leading-relaxed">
              If you forgot your password or need your college username, please contact the Parishad IT Cell:
            </p>
            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#DDD1BE] space-y-2 text-xs text-[#0E3320]">
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#8C671D]" />
                <span className="font-medium">{contact.admissionsEmail || contact.primaryEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#8C671D]" />
                <span className="font-medium">{contact.primaryPhone} ({contact.workingHoursWeekday || "10 AM – 5 PM"})</span>
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <button type="button" onClick={() => setShowHelpModal(false)}
                className="px-4 py-2 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white font-semibold text-xs transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
