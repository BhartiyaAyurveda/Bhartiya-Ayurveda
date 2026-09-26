"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  ExternalLink,
  Sparkles,
  HelpCircle,
  X
} from "lucide-react";

export default function SuperAdminLoginPage() {
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [capsLockActive, setCapsLockActive] = useState(false);

  // Interaction & validation states
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Monitor Caps Lock key
  const handleKeyDown = (e) => {
    if (e.getModifierState && e.getModifierState("CapsLock")) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  const handleKeyUp = (e) => {
    if (e.getModifierState && e.getModifierState("CapsLock")) {
      setCapsLockActive(true);
    } else {
      setCapsLockActive(false);
    }
  };

  // Quick fill demo credentials
  const handleQuickFill = () => {
    setEmail("superadmin@bhartiyaayurveda.org");
    setPassword("Ayurveda@Admin2026");
    setErrorMessage("");
  };

  // Form submission handler
  const handleLogin = (e) => {
    e.preventDefault();
    setErrorMessage("");

    // Basic validation
    if (!email.trim()) {
      setErrorMessage("Please enter your Super Admin email address.");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid official email address format.");
      return;
    }
    if (!password) {
      setErrorMessage("Please enter your master security password.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    // Authentication handshake simulation
    setIsLoading(true);
    setStatusMessage("Verifying institutional credentials...");

    setTimeout(() => {
      setStatusMessage("Authorizing Super Admin cryptographic handshake...");
    }, 600);

    setTimeout(() => {
      setIsLoading(false);
      setIsSuccess(true);
      setStatusMessage("Authentication successful! Loading console...");

      // Save session in localStorage/sessionStorage
      const authSession = {
        email: email.trim(),
        role: "Super Administrator",
        authenticatedAt: new Date().toISOString(),
        terminalId: "SEC-TER-9824",
      };

      if (typeof window !== "undefined") {
        if (rememberMe) {
          localStorage.setItem("bhartiya_admin_session", JSON.stringify(authSession));
        } else {
          sessionStorage.setItem("bhartiya_admin_session", JSON.stringify(authSession));
        }
      }

      // Navigate to dashboard
      setTimeout(() => {
        router.push("/super-admin/dashboard");
      }, 1000);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-[#071F13] flex flex-col justify-between text-[#FAF8F5] relative overflow-hidden selection:bg-[#C59B3F] selection:text-white">
      {/* Background Ambience & Vedic Foliage Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-[#C59B3F] blur-[120px]" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full bg-[#15482D] blur-[140px]" />
      </div>

      {/* Top Banner Bar */}
      <header className="relative z-10 w-full px-3 sm:px-6 py-3 sm:py-4 flex items-center justify-between border-b border-white/10 bg-[#0B2618]/70 backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group">
          <div className="relative w-28 h-9 sm:w-32 sm:h-10 shrink-0 bg-white/95 rounded-lg px-1.5 py-1">
            <Image src="/logo.png" alt="Bhartiya Ayurveda" fill sizes="128px" className="object-contain" />
          </div>
          <span className="hidden sm:block text-[10px] sm:text-[11px] font-medium tracking-wider text-[#C59B3F] uppercase">
            Central Institutional Portal
          </span>
        </Link>

        <Link
          href="/"
          className="flex items-center gap-1.5 sm:gap-2 text-xs font-semibold text-sand-300 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-3 sm:px-3.5 py-1.5 rounded-full border border-white/10 shrink-0"
        >
          <span className="hidden xs:inline">Public Website</span>
          <span className="xs:hidden">Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#C59B3F]" />
        </Link>
      </header>

      {/* Main Login Workspace (Responsive Split Layout) */}
      <div className="relative z-10 flex-1 flex items-center justify-center px-3 sm:px-4 py-6 md:py-12">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-[#C59B3F]/25 bg-[#0E3320]/90 backdrop-blur-xl">
          
          {/* Left Panel: Institutional Showcase & Security Badges (5 cols on lg) */}
          <div className="lg:col-span-5 p-5 sm:p-8 lg:p-10 flex flex-col justify-between relative bg-gradient-to-br from-[#0B2618] via-[#071F13] to-[#0E3320] border-b lg:border-b-0 lg:border-r border-white/10">
            {/* Subtle background image overlay */}
            <div className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none">
              <Image
                src="/images/decor/leaves-dark.jpg"
                alt="Ayurvedic Botanical Motif"
                fill
                className="object-cover"
                priority
              />
            </div>

            <div className="relative z-10 space-y-4 sm:space-y-6">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59B3F]/15 border border-[#C59B3F]/40 text-[#F3D68B] text-xs font-semibold tracking-wide">
                <ShieldCheck className="w-4 h-4 text-[#C59B3F]" />
                <span>Super Admin Tier Access</span>
              </div>

              {/* Title & Description */}
              <div className="space-y-2">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white leading-tight">
                  भारतीय आयुर्वेद <br />
                  <span className="text-[#C59B3F]">Command Console</span>
                </h1>
                <p className="text-xs sm:text-sm text-[#DDD1BE] leading-relaxed">
                  Centralized administrative dashboard for governing academic curriculums, student certifications, affiliated institutes, and institutional compliance.
                </p>
              </div>

              {/* Security Feature Highlights */}
              <div className="space-y-2.5 sm:space-y-3 pt-1 sm:pt-2">
                <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="p-1.5 rounded-lg bg-[#C59B3F]/20 text-[#F3D68B] shrink-0">
                    <Lock className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-xs">256-Bit SSL Encryption</h2>
                    <p className="text-[#C8B79E] text-[11px] mt-0.5">
                      All administrative communications and database queries are cryptographically encrypted.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="p-1.5 rounded-lg bg-[#2A7A50]/30 text-emerald-300 shrink-0">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-xs">Role-Based Access Control (RBAC)</h2>
                    <p className="text-[#C8B79E] text-[11px] mt-0.5">
                      Enforces privileged verification for student registries and certificate issuance.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-2.5 sm:p-3 rounded-xl bg-white/5 border border-white/10 text-xs">
                  <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-300 shrink-0">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-xs">Instant Certificate Validation</h2>
                    <p className="text-[#C8B79E] text-[11px] mt-0.5">
                      Real-time ledger access for nationwide Ayurvedic diploma authentications.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terminal Notice */}
            <div className="relative z-10 pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-white/10 flex items-center justify-between text-[11px] text-[#DDD1BE]/70">
              <span>Terminal Node: IND-DEL-01</span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Network Secure
              </span>
            </div>
          </div>

          {/* Right Panel: Authentication Form (7 cols on lg) */}
          <div className="lg:col-span-7 p-5 sm:p-8 lg:p-12 bg-[#FAF8F5] text-[#0E3320] flex flex-col justify-between">
            <div>
              {/* Form Heading */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold font-serif text-[#0E3320] tracking-tight">
                    Super Admin Sign In
                  </h2>
                  <p className="text-xs text-[#5C8261] mt-1">
                    Enter your authorized administrative email and password.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-[#0E3320] text-[#C59B3F] flex items-center justify-center shadow-md">
                  <Lock className="w-6 h-6 stroke-[1.8]" />
                </div>
              </div>

              {/* Quick Demo Fill Helper Banner */}
              <div className="mb-6 p-3.5 rounded-xl bg-[#E6EFE9] border border-[#2A7A50]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#1E603D] shrink-0" />
                  <span className="text-xs font-semibold text-[#15482D]">
                    Testing login? Use pre-configured Super Admin credentials:
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleQuickFill}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E3320] hover:bg-[#15482D] text-white text-xs font-medium transition-all shadow-sm shrink-0"
                >
                  <span>Auto-Fill Demo</span>
                </button>
              </div>

              {/* Error Message Banner */}
              {errorMessage && (
                <div className="mb-6 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span className="font-medium">{errorMessage}</span>
                </div>
              )}

              {/* Success Message Banner */}
              {isSuccess && (
                <div className="mb-6 p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center gap-2.5 animate-fadeIn">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span className="font-medium">{statusMessage}</span>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleLogin} className="space-y-5" noValidate>
                {/* Email Field */}
                <div>
                  <label
                    htmlFor="admin-email"
                    className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1.5"
                  >
                    Institutional Email Address <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C8261]">
                      <Mail className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="superadmin@bhartiyaayurveda.org"
                      disabled={isLoading || isSuccess}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#DDD1BE] bg-white text-sm text-[#0E3320] placeholder-[#C8B79E] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] focus:border-transparent transition-all disabled:opacity-50"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="admin-password"
                      className="block text-xs font-bold uppercase tracking-wider text-[#0E3320]"
                    >
                      Master Password <span className="text-red-500">*</span>
                    </label>
                    {capsLockActive && (
                      <span className="text-[11px] font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md">
                        Caps Lock is ON
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#5C8261]">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      id="admin-password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={handleKeyDown}
                      onKeyUp={handleKeyUp}
                      placeholder="Enter master password"
                      disabled={isLoading || isSuccess}
                      className="w-full pl-10 pr-11 py-3 rounded-xl border border-[#DDD1BE] bg-white text-sm text-[#0E3320] placeholder-[#C8B79E] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] focus:border-transparent transition-all disabled:opacity-50"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex={-1}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-[#5C8261] hover:text-[#0E3320] transition-colors"
                      title={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me & Forgot Password */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="w-4 h-4 rounded border-[#DDD1BE] text-[#1E603D] focus:ring-[#C59B3F] accent-[#1E603D]"
                    />
                    <span className="text-[#15482D] font-medium">
                      Keep this session authenticated
                    </span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setShowForgotModal(true)}
                    className="font-semibold text-[#8C671D] hover:text-[#0E3320] underline transition-colors"
                  >
                    Forgot Password?
                  </button>
                </div>

                {/* Submit Action Button */}
                <button
                  type="submit"
                  disabled={isLoading || isSuccess}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-[#0E3320] to-[#15482D] hover:from-[#15482D] hover:to-[#1E603D] text-[#FAF8F5] font-semibold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 group disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>{statusMessage || "Authenticating..."}</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      <span>Redirecting to Super Admin Console...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign In to Super Admin Console</span>
                      <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1 text-[#C59B3F]" />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Footer Trust Note */}
            <div className="mt-8 pt-4 border-t border-[#DDD1BE]/60 flex items-center justify-between text-[11px] text-[#5C8261]">
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C59B3F]" />
                Security Gateway v2.4 (Encrypted)
              </span>
              <span className="text-[#8C671D]">
                IP Logged &amp; Verified
              </span>
            </div>
          </div>

        </div>
      </div>

      {/* Forgot Password Modal Dialog */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF8F5] text-[#0E3320] max-w-md w-full rounded-2xl p-6 shadow-2xl border border-[#DDD1BE] relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 transition-colors p-1 rounded-full hover:bg-neutral-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-full bg-[#E6EFE9] text-[#1E603D] flex items-center justify-center mb-4">
              <HelpCircle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold font-serif text-[#0E3320] mb-2">
              Super Admin Credential Recovery
            </h3>
            <p className="text-xs text-[#5C8261] mb-4 leading-relaxed">
              For supreme institutional security, master credentials cannot be reset via automated emails without clearance from the Central Directorate.
            </p>

            <div className="bg-[#EBE2D4]/60 p-3.5 rounded-xl border border-[#DDD1BE] text-xs space-y-1.5 mb-5">
              <p className="font-semibold text-[#0E3320]">Emergency IT Helpdesk:</p>
              <p className="text-[#5C8261]">Email: <span className="font-mono font-medium text-[#0E3320]">security@bhartiyaayurveda.org</span></p>
              <p className="text-[#5C8261]">Emergency Master Hotline: <span className="font-medium text-[#0E3320]">+91 98765 43210</span></p>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForgotModal(false);
                  handleQuickFill();
                }}
                className="px-4 py-2 rounded-lg bg-[#C59B3F] hover:bg-[#AC822D] text-white text-xs font-semibold shadow-sm transition-all"
              >
                Use Demo Login
              </button>
              <button
                type="button"
                onClick={() => setShowForgotModal(false)}
                className="px-4 py-2 rounded-lg bg-[#E6EFE9] hover:bg-[#DDD1BE] text-[#0E3320] text-xs font-medium transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Bottom Footer Note */}
      <footer className="relative z-10 w-full py-3 px-6 text-center text-[11px] text-white/50 border-t border-white/5 bg-[#071F13]">
        © {new Date().getFullYear()} Bhartiya Ayurveda Sansthan (भारतीय आयुर्वेद संस्थान). All Rights Reserved. Restricted to authorized administrators.
      </footer>
    </main>
  );
}
