"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, AlertCircle, CheckCircle2, Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!username.trim()) { setError("Please enter your admin username."); return; }
    setIsLoading(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); }
      else { setDone(true); }
    } catch {
      setError("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  return (
    <main className="min-h-screen bg-[#F2EDE4] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8 gap-3">
          <div className="relative w-20 h-20 rounded-full overflow-hidden ring-4 ring-[#C59B3F]/40 shadow-lg">
            <Image src="/logo.png" alt="Logo" fill className="object-cover" />
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-[#C59B3F]">भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्</p>
            <p className="text-xs text-[#5C8261]">Admin Password Recovery</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-7 shadow-lg border border-[#DDD1BE] space-y-5">
          {done ? (
            <div className="text-center space-y-4 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-50 border-2 border-emerald-400 flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7 text-emerald-600" />
              </div>
              <div>
                <p className="font-bold text-[#0E3320] text-sm">Check your email</p>
                <p className="text-xs text-[#5C8261] mt-1 leading-relaxed">
                  If that username exists and has an email associated, a password reset link has been sent. The link expires in 30 minutes.
                </p>
              </div>
              <Link href="/super-admin/login"
                className="block w-full py-2.5 rounded-xl bg-[#0E3320] text-white text-sm font-semibold text-center hover:bg-[#15482D] transition-colors">
                Back to Login
              </Link>
            </div>
          ) : (
            <>
              <div>
                <p className="text-sm font-bold text-[#0E3320]">Forgot Password</p>
                <p className="text-xs text-[#5C8261] mt-1">Enter your admin username and we'll send a reset link to the associated email address.</p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0" /><span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1.5">Admin Username</label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C8261]" />
                    <input type="text" value={username} onChange={e => setUsername(e.target.value)}
                      placeholder="superadmin" autoComplete="username" disabled={isLoading}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] placeholder-[#C8B79E] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] disabled:opacity-50"
                    />
                  </div>
                </div>

                <button type="submit" disabled={isLoading}
                  className="w-full py-3 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70 cursor-pointer">
                  {isLoading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Sending...</span></> : <span>Send Reset Link</span>}
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
      </div>
    </main>
  );
}
