"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  User,
  Lock,
  ArrowRight,
  ShieldCheck,
  Eye,
  EyeOff,
  CheckCircle2,
  FileText,
  Calendar,
  Download,
  Award,
  AlertCircle,
  HelpCircle,
  Sparkles,
  LogOut,
  Building2,
  BookOpen
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";

export default function StudentLoginPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rollNumber, setRollNumber] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    setTimeout(() => {
      setIsLoading(false);
      // Allow demo login
      setIsLoggedIn(true);
    }, 700);
  };

  const handleDemoLogin = () => {
    setRollNumber("BA2025-0101");
    setPassword("password123");
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
    }, 500);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setRollNumber("");
    setPassword("");
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E3320] font-sans selection:bg-[#C59B3F] selection:text-white">
      {/* 1. Header Navigation */}
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* 2. Hero Section: Clean 3-Row Layout */}
      <section className="relative bg-[#071F13] text-white py-16 md:py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero-meditation.jpg"
            alt="Student Portal"
            className="w-full h-full object-cover opacity-60 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/65 to-[#071F13]/70"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          {/* Row 1: Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#C59B3F] font-semibold tracking-wider uppercase">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C671D]">/</span>
            <span className="text-[#C59B3F]">Students</span>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">Login</span>
          </nav>

          {/* Row 2: Vedic Tag Pill Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-xs sm:text-sm font-semibold shadow-sm">
              <span>🌿</span>
              <span>भारतीय आयुर्वेद • छात्र पोर्टल</span>
            </div>
          </div>

          {/* Row 3: Main Title */}
          <div className="space-y-2 pt-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-devanagari font-extrabold text-white leading-tight">
              विद्यार्थी लॉगिन पोर्टल
            </h1>
            <div className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#C59B3F] font-bold">
              Bhartiya Ayurveda Student Portal Access
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#CBD8CB] leading-relaxed">
            Access your examination admit cards, view annual results, submit assignments, and track your D.N.Y.S. / Naturopathy academic journey.
          </p>
        </div>
      </section>

      {/* 3. Main Login or Dashboard Section */}
      <section className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {isLoggedIn ? (
          /* SIMULATED LOGGED-IN STUDENT DASHBOARD */
          <div className="space-y-6 sm:space-y-8 animate-fade-in">
            {/* Top Student Welcome Bar */}
            <div className="bg-[#0E3320] text-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 sm:gap-6 shadow-xl border border-[#C59B3F]/30">
              <div className="flex items-center gap-3.5 sm:gap-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#FAF8F5] text-[#0E3320] flex items-center justify-center font-bold text-xl sm:text-2xl border-2 border-[#C59B3F] shrink-0">
                  AS
                </div>
                <div>
                  <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-[#1A5C38] text-[#E4BF64] text-[10px] sm:text-xs font-semibold">
                    <span>Active Student</span>
                  </div>
                  <h2 className="text-lg sm:text-2xl font-serif font-bold text-white mt-1">
                    Ananya Sharma
                  </h2>
                  <p className="text-[11px] sm:text-xs text-[#CBD8CB] flex flex-wrap gap-x-2">
                    <span>Roll: <strong className="font-mono text-[#E4BF64]">{rollNumber || "BA2025-0101"}</strong></span>
                    <span>•</span>
                    <span>ID: ENR-892410</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 sm:gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-white/10">
                <Link
                  href="/students/results"
                  className="flex-1 md:flex-initial text-center px-4 py-2.5 rounded-full bg-[#C59B3F] hover:bg-[#8C671D] text-[#0E3320] hover:text-white font-semibold text-xs transition-colors shadow"
                >
                  View Marksheet
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-medium text-xs transition-colors border border-white/20"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>

            {/* Dashboard Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EBE2D4] shadow-sm">
                <span className="text-[11px] sm:text-xs text-[#7A583A] font-semibold uppercase">Course Enrolled</span>
                <p className="text-base sm:text-lg font-bold text-[#0E3320] mt-1">D.N.Y.S. (2nd Year)</p>
                <span className="text-xs text-[#666]">Diploma in Naturopathy</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EBE2D4] shadow-sm">
                <span className="text-[11px] sm:text-xs text-[#7A583A] font-semibold uppercase">Affiliated Institute</span>
                <p className="text-base sm:text-lg font-bold text-[#0E3320] mt-1">S.P College</p>
                <span className="text-xs text-[#666]">Jaunpur, Uttar Pradesh</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EBE2D4] shadow-sm">
                <span className="text-[11px] sm:text-xs text-[#7A583A] font-semibold uppercase">Attendance Status</span>
                <p className="text-base sm:text-lg font-bold text-[#1A5C38] mt-1">88.5% (Eligible)</p>
                <span className="text-xs text-[#666]">Minimum 75% required</span>
              </div>

              <div className="bg-white p-4 sm:p-5 rounded-2xl border border-[#EBE2D4] shadow-sm">
                <span className="text-[11px] sm:text-xs text-[#7A583A] font-semibold uppercase">Upcoming Examination</span>
                <p className="text-base sm:text-lg font-bold text-[#B96647] mt-1">May 15, 2026</p>
                <span className="text-xs text-[#666]">Annual Theory & Practical</span>
              </div>
            </div>

            {/* Dashboard Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              {/* Card 1: Admit Card */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EBE2D4] shadow-sm space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#0E3320]/10 text-[#0E3320] flex items-center justify-center">
                  <FileText className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#0E3320]">
                  Admit Card (Hall Ticket)
                </h3>
                <p className="text-xs text-[#666] leading-relaxed">
                  Download your verified examination hall ticket with exam venue, roll code, and authorized council seal.
                </p>
                <button
                  onClick={() => alert("Downloading official admit card PDF...")}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E3320] text-[#E4BF64] hover:bg-[#071F13] font-semibold text-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Admit Card (PDF)</span>
                </button>
              </div>

              {/* Card 2: Examination Results */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EBE2D4] shadow-sm space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#C59B3F]/15 text-[#8C671D] flex items-center justify-center">
                  <Award className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#0E3320]">
                  Marksheet & Results
                </h3>
                <p className="text-xs text-[#666] leading-relaxed">
                  Check semester grade breakdown, clinical viva evaluation, theory marks, and total cumulative percentage.
                </p>
                <Link
                  href="/students/results"
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#1A5C38] text-white hover:bg-[#0E3320] font-semibold text-xs transition-colors"
                >
                  <span>Go to Results Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Card 3: Syllabus & Study Material */}
              <div className="bg-white p-5 sm:p-6 rounded-2xl border border-[#EBE2D4] shadow-sm space-y-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-[#B96647]/15 text-[#B96647] flex items-center justify-center">
                  <BookOpen className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#0E3320]">
                  Syllabus & Courseware
                </h3>
                <p className="text-xs text-[#666] leading-relaxed">
                  Access official Bhartiya Ayurveda textbooks, Shatkarma guidelines, Herbarium handbook, and Anatomy notes.
                </p>
                <button
                  onClick={() => alert("Redirecting to Bhartiya Ayurveda E-Learning portal...")}
                  className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#0E3320] text-[#0E3320] hover:bg-[#0E3320] hover:text-white font-semibold text-xs transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Syllabus</span>
                </button>
              </div>
            </div>

            {/* Examination Notifications */}
            <div className="bg-[#FAF8F5] border border-[#EBE2D4] rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#0E3320] flex items-center gap-2">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-[#C59B3F]" />
                <span>Noticeboard & Practical Dates (May 2026 Session)</span>
              </h3>
              <ul className="space-y-2.5 sm:space-y-3 text-xs sm:text-sm text-[#0E3320]">
                <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#EBE2D4]">
                  <span className="w-2 h-2 rounded-full bg-[#1A5C38] mt-1.5 shrink-0"></span>
                  <span><strong>15 May 2026:</strong> Paper I - Sharir Rachna Vigyan (Anatomy & Physiology) - 10:00 AM to 01:00 PM</span>
                </li>
                <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#EBE2D4]">
                  <span className="w-2 h-2 rounded-full bg-[#1A5C38] mt-1.5 shrink-0"></span>
                  <span><strong>17 May 2026:</strong> Paper II - Swasthavritta & Yoga Vigyan - 10:00 AM to 01:00 PM</span>
                </li>
                <li className="flex items-start gap-2 bg-white p-3 rounded-xl border border-[#EBE2D4]">
                  <span className="w-2 h-2 rounded-full bg-[#C59B3F] mt-1.5 shrink-0"></span>
                  <span><strong>20 May 2026:</strong> Practical Examination & Viva Voce at Center Exam Hall</span>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          /* LOGIN FORM */
          <div className="max-w-lg mx-auto bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border border-[#EBE2D4] overflow-hidden">
            {/* Top Card Header */}
            <div className="bg-[#0E3320] text-white p-6 sm:p-8 text-center relative">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#FAF8F5]/10 border border-[#C59B3F]/40 flex items-center justify-center mx-auto mb-3 text-[#C59B3F]">
                <GraduationCap className="w-6 h-6 sm:w-8 sm:h-8" />
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                Student Sign In
              </h2>
              <p className="text-xs text-[#CBD8CB] mt-1">
                Enter your Roll Number or Enrolment ID to continue
              </p>
            </div>

            {/* Quick Demo Fill Button */}
            <div className="bg-[#FAF8F5] border-b border-[#EBE2D4] px-4 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between">
              <span className="text-xs text-[#7A583A] font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B3F]" />
                <span>Want to test quickly?</span>
              </span>
              <button
                type="button"
                onClick={handleDemoLogin}
                className="text-xs font-bold text-[#0E3320] hover:text-[#B96647] underline cursor-pointer"
              >
                1-Click Demo Login
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="p-4 sm:p-8 space-y-4 sm:space-y-5">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Roll Number Input */}
              <div>
                <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-2">
                  Roll Number / Enrolment ID *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. BA2025-0101 or STU-84920"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                  <User className="w-4 h-4 text-[#7A583A] absolute left-4 top-4" />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider">
                    Password / Date of Birth *
                  </label>
                  <button
                    type="button"
                    onClick={() => alert("Please contact Bhartiya Ayurveda student helpdesk at +91 98765 43210 or email hello@bhartiyaayurveda.in to reset your password.")}
                    className="text-xs text-[#7A583A] hover:text-[#0E3320] underline"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter password or DDMMYYYY"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-11 py-3.5 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                  <Lock className="w-4 h-4 text-[#7A583A] absolute left-4 top-4" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-4 text-[#7A583A] hover:text-[#0E3320]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-[#0E3320]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 accent-[#0E3320] rounded"
                  />
                  <span>Remember my login on this device</span>
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex items-center justify-center gap-2 py-4 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white font-semibold text-sm shadow-lg transition-all duration-200 group disabled:opacity-75"
                >
                  {isLoading ? (
                    <span>Verifying Credentials...</span>
                  ) : (
                    <>
                      <span>Sign In to Student Portal</span>
                      <ArrowRight className="w-4 h-4 text-[#E4BF64] group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </div>

              {/* Extra Links */}
              <div className="pt-4 border-t border-[#EBE2D4] text-center space-y-2">
                <p className="text-xs text-[#666]">
                  New student?{" "}
                  <Link href="/students/registration" className="font-bold text-[#0E3320] hover:text-[#B96647] underline">
                    Complete Student Registration
                  </Link>
                </p>
                <p className="text-xs text-[#666]">
                  Looking for results?{" "}
                  <Link href="/students/results" className="font-bold text-[#1A5C38] hover:underline">
                    Check Examination Results
                  </Link>
                </p>
              </div>
            </form>
          </div>
        )}

        {/* Support Helpdesk Bar */}
        <div className="max-w-lg mx-auto mt-8 bg-white p-5 rounded-2xl border border-[#EBE2D4] text-center space-y-1 shadow-sm">
          <p className="text-xs font-semibold text-[#0E3320]">
            Bhartiya Ayurveda Student Helpdesk & Support
          </p>
          <p className="text-xs text-[#666]">
            Facing trouble logging in? Call Helpline: <strong className="text-[#0E3320]">+91 98765 43210</strong> or email <strong className="text-[#0E3320]">hello@bhartiyaayurveda.in</strong>
          </p>
        </div>
      </section>

      {/* 4. Footer */}
      <Footer />

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </main>
  );
}
