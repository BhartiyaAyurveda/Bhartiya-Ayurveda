"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { Lock, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!token) setError("Invalid or missing reset token. Please request a new reset link.");
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password.length < 8) { setError("Password must be at least 8 characters."); return; }
    if (password !== confirm) { setError("Passwords do not match."); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to reset password."); }
      else { setDone(true); setTimeout(() => router.push("/super-admin/login"), 2500); }
    } catch {
      setError("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl p-7 shadow-lg border border-[#DDD1BE] space-y-5">
      {done ? (
        <div className="text-center space-y-4 py-2">
          <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-7 h-7 text-emerald-600" />
          </div>
          <div>
            <p className="font-bold text-[#0E3320] text-sm">Password Reset Successful!</p>
            <p className="text-xs text-[#5C8261] mt-1">Redirecting to login...</p>
          </div>
        </div>
      ) : (
        <>
          <div>
            <p className="text-sm font-bold text-[#0E3320]">Set New Password</p>
            <p className="text-xs text-[#5C8261] mt-1">Enter a strong new password for your admin account.</p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1.5">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C8261]" />
                <input type={showPwd ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Min 8 characters" disabled={isLoading || !token}
                  className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] disabled:opacity-50"
                />
                <button type="button" tabIndex={-1} onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#5C8261] hover:text-[#0E3320]">
                  {showPwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1.5">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C8261]" />
                <input type={showPwd ? "text" : "password"} value={confirm} onChange={e => setConfirm(e.target.value)}
                  placeholder="Repeat password" disabled={isLoading || !token}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] disabled:opacity-50"
                />
              </div>
            </div>

            <button type="submit" disabled={isLoading || !token}
              className="w-full py-3 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer">
              {isLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Updating...</span></> : <span>Reset Password</span>}
            </button>
          </form>

          <div className="text-center">
            <Link href="/super-admin/login" className="text-xs text-[#5C8261] hover:text-[#0E3320] transition-colors">
              Back to Login
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-[#F2EDE4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#C59B3F]/40 shadow-lg">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#C59B3F]">भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्</p>
            <p className="text-xs text-[#5C8261]">Admin Password Reset</p>
          </div>
        </div>
        <Suspense fallback={<div className="bg-white rounded-2xl p-7 text-center text-sm text-[#5C8261]">Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
      </div>
    </main>
  );
}
