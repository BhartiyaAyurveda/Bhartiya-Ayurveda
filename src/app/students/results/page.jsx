"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  Search,
  Printer,
  CheckCircle2,
  Calendar,
  Building2,
  User,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  FileCheck,
  AlertCircle,
  Mail,
  KeyRound,
  Send,
  RefreshCw,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";

function getGrade(pct) {
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}
function fmtDate(d) {
  if (!d) return "—";
  const p = d.split("-");
  if (p.length === 3 && p[0].length === 4) return `${p[2]}-${p[1]}-${p[0]}`;
  return d;
}

const DEMO_RESULT = {
  name: "Priya Sharma",
  fatherName: "Ramesh Kumar Sharma",
  motherName: "Sunita Devi Sharma",
  dob: "15-08-2001",
  rollNo: "BA2025-DEMO-01",
  enrolmentNo: "BAYP-ENR-2023-0042",
  institute: "Gyan Prabhat Institute of Paramedical Science",
  instituteCode: "BA-AFF-04",
  city: "Jaunpur, Uttar Pradesh",
  course: "Diploma in Naturopathy & Yogic Sciences (D.N.Y.S.)",
  session: "Annual Examination 2024–25",
  photoUrl: "/images/testimonials/priya-patel.jpg",
  subjects: [
    { code: "DNYS-101", name: "Anatomy & Physiology", thMax: 80, thObt: 67, prMax: 20, prObt: 17, caObt: 5, totalMax: 100, totalObt: 84, grade: "A", pass: true },
    { code: "DNYS-102", name: "Naturopathy Principles & Theory", thMax: 80, thObt: 72, prMax: 20, prObt: 18, caObt: 8, totalMax: 100, totalObt: 90, grade: "A", pass: true },
    { code: "DNYS-103", name: "Yoga Therapy & Practice", thMax: 70, thObt: 61, prMax: 30, prObt: 26, caObt: 9, totalMax: 100, totalObt: 87, grade: "B+", pass: true },
    { code: "DNYS-104", name: "Hydrotherapy & Mud Therapy", thMax: 80, thObt: 58, prMax: 20, prObt: 16, caObt: 7, totalMax: 100, totalObt: 74, grade: "B+", pass: true },
    { code: "DNYS-105", name: "Diet & Nutrition Science", thMax: 80, thObt: 70, prMax: 20, prObt: 19, caObt: 8, totalMax: 100, totalObt: 89, grade: "A", pass: true },
    { code: "DNYS-106", name: "Panchakarma & Detox Therapy", thMax: 60, thObt: 50, prMax: 40, prObt: 34, caObt: 10, totalMax: 100, totalObt: 84, grade: "A", pass: true },
  ],
  grandTotalMax: 600,
  grandTotalObt: 508,
  percentage: "84.67",
  division: "FIRST DIVISION",
  status: "PASS",
};

export default function StudentResultsPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [dob, setDob] = useState("");
  const [resultData, setResultData] = useState(null);
  const [searched, setSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState("");
  const [isDemo, setIsDemo] = useState(false);

  // OTP-based search
  const [searchMode, setSearchMode] = useState("roll_no");
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpStep, setOtpStep] = useState("email");
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [otpTimer, setOtpTimer] = useState(0);

  const handleSendOtp = async () => {
    if (!otpEmail.trim() || !/\S+@\S+\.\S+/.test(otpEmail)) { setOtpError("Please enter a valid email address."); return; }
    setOtpLoading(true); setOtpError("");
    try {
      const res = await fetch("/api/public/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "send", email: otpEmail.trim() }) });
      const json = await res.json();
      if (!res.ok) { setOtpError(json.error || "Failed to send OTP."); }
      else { setOtpStep("otp"); setOtpTimer(60); const iv = setInterval(() => setOtpTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; }), 1000); }
    } catch { setOtpError("Network error."); }
    setOtpLoading(false);
  };

  const handleVerifyOtp = async () => {
    if (!otpCode.trim()) { setOtpError("Please enter the OTP."); return; }
    setOtpLoading(true); setOtpError("");
    try {
      const res = await fetch("/api/public/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "verify", email: otpEmail.trim(), otp: otpCode.trim() }) });
      const json = await res.json();
      if (!res.ok) { setOtpError(json.error || "Incorrect OTP."); setOtpLoading(false); return; }
      // OTP verified — fetch result by email using the existing handleSearch shape
      setIsLoading(true); setApiError(""); setResultData(null); setSearched(true);
      const rRes = await fetch(`/api/public/result?${new URLSearchParams({ email: otpEmail.trim() })}`);
      const rJson = await rRes.json();
      if (!rRes.ok) { setApiError(rJson.error || "No result found."); setIsLoading(false); setOtpLoading(false); return; }
      // Map to display shape (same mapping as handleSearch)
      const s = rJson.student; const summary = rJson.summary;
      const pct = parseFloat(summary.percentage);
      let division = "—";
      if (summary.result === "PASS") {
        if (pct >= 75) division = "FIRST DIVISION (WITH DISTINCTION)";
        else if (pct >= 60) division = "FIRST DIVISION";
        else if (pct >= 48) division = "SECOND DIVISION";
        else division = "THIRD DIVISION";
      } else if (summary.result === "AWAITED") {
        division = "RESULT AWAITED";
      } else {
        division = "FAILED";
      }
      setResultData({
        name: s.candidate_name,
        fatherName: s.father_name,
        motherName: s.mother_name,
        dob: s.dob ? fmtDate(s.dob) : "—",
        rollNo: s.roll_no,
        enrolmentNo: s.enrollment_no,
        institute: s.college || "—",
        instituteCode: s.college_code || "",
        city: s.college_city || "",
        course: s.course || "—",
        session: s.session_label || "Annual Examination",
        photoUrl: s.photo_url,
        subjects: rJson.subjects.map(sub => {
          const tot = sub.total ?? sub.total_marks ?? 0;
          const max = sub.max_total ?? ((sub.theory_max || 0) + (sub.practical_max || 0) + (sub.ca_max || 0));
          return {
            code: sub.subject_code,
            name: sub.subject_name,
            thMax: sub.theory_max,
            thObt: sub.theory_marks,
            prMax: sub.practical_max,
            prObt: sub.practical_marks,
            caObt: sub.ca_marks ?? null,
            totalMax: max,
            totalObt: tot,
            grade: sub.grade || (max > 0 ? getGrade(Math.round((tot / max) * 100)) : "—"),
            pass: sub.pass,
          };
        }),
        grandTotalMax: summary.grand_max,
        grandTotalObt: summary.grand_total,
        percentage: summary.percentage,
        division,
        status: summary.result,
      });
      setIsLoading(false);
    } catch { setOtpError("Network error."); }
    setOtpLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    const cleanRoll = rollNo.trim();
    if (!cleanRoll || !dob) return;

    setIsLoading(true);
    setSearched(true);
    setResultData(null);
    setApiError("");

    try {
      const params = new URLSearchParams({ roll_no: cleanRoll, dob });
      const res = await fetch(`/api/public/result?${params}`);
      const data = await res.json();
      if (!res.ok) {
        setApiError(data.error || "No result found.");
      } else {
        // Map API response to the shape the marksheet UI expects
        const s = data.student;
        const summary = data.summary;
        const pct = parseFloat(summary.percentage);
        let division = "—";
        if (summary.result === "PASS") {
          if (pct >= 75) division = "FIRST DIVISION (WITH DISTINCTION)";
          else if (pct >= 60) division = "FIRST DIVISION";
          else if (pct >= 48) division = "SECOND DIVISION";
          else division = "THIRD DIVISION";
        } else if (summary.result === "AWAITED") {
          division = "RESULT AWAITED";
        } else {
          division = "FAILED";
        }
        setResultData({
          name: s.candidate_name,
          fatherName: s.father_name,
          motherName: s.mother_name,
          dob: s.dob ? fmtDate(s.dob) : "—",
          rollNo: s.roll_no,
          enrolmentNo: s.enrollment_no,
          institute: s.college || "—",
          instituteCode: s.college_code || "",
          city: s.college_city || "",
          course: s.course || "—",
          session: s.session_label || "Annual Examination",
          photoUrl: s.photo_url,
          subjects: data.subjects.map((sub) => {
            const tot = sub.total ?? sub.total_marks ?? 0;
            const max = sub.max_total ?? ((sub.theory_max || 0) + (sub.practical_max || 0) + (sub.ca_max || 0));
            return {
              code: sub.subject_code,
              name: sub.subject_name,
              thMax: sub.theory_max,
              thObt: sub.theory_marks,
              prMax: sub.practical_max,
              prObt: sub.practical_marks,
              caObt: sub.ca_marks ?? null,
              totalMax: max,
              totalObt: tot,
              grade: sub.grade || (max > 0 ? getGrade(Math.round((tot / max) * 100)) : "—"),
              pass: sub.pass,
            };
          }),
          grandTotalMax: summary.grand_max,
          grandTotalObt: summary.grand_total,
          percentage: summary.percentage,
          division,
          status: summary.result,
        });
      }
    } catch {
      setApiError("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  const handleLoadDemo = () => {
    setResultData(DEMO_RESULT);
    setSearched(true);
    setApiError("");
    setIsDemo(true);
  };

  const handleReset = () => {
    setResultData(null);
    setSearched(false);
    setRollNo("");
    setDob("");
    setIsDemo(false);
    setOtpStep("email"); setOtpCode(""); setOtpError("");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E3320] font-sans selection:bg-[#C59B3F] selection:text-white">
      {/* 1. Header Navigation */}
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* 2. Hero Section: Clean 3-Row Layout */}
      <section className="relative bg-[#071F13] text-white py-16 md:py-20 px-4 md:px-8 overflow-hidden print:hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero-meditation.jpg"
            alt="Examination Results"
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
            <span className="text-white">Results</span>
          </nav>

          {/* Row 2: Vedic Tag Pill Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-xs sm:text-sm font-semibold shadow-sm">
              <span>🌿</span>
              <span>भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद् • वार्षिक एवं सत्रीय परीक्षा परिणाम</span>
            </div>
          </div>

          {/* Row 3: Main Title */}
          <div className="space-y-2 pt-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-devanagari font-extrabold text-white leading-tight">
              परीक्षा परिणाम एवं अंकतालिका
            </h1>
            <div className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#C59B3F] font-bold">
              Annual & Semester Examination Results
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#CBD8CB] leading-relaxed">
            Enter your Roll Number to instantly search, view, and print your verified Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad Marksheet.
          </p>
        </div>
      </section>

      {/* 3. Search Bar Form */}
      <section className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 -mt-6 relative z-20 print:hidden">
        <div className="bg-white rounded-2xl shadow-xl border border-[#EBE2D4] p-4 sm:p-8">
          {/* Mode tabs */}
          <div className="flex rounded-xl overflow-hidden border border-[#DDD1BE] mb-5">
            <button type="button" onClick={() => { setSearchMode("roll_no"); setApiError(""); setOtpError(""); }}
              className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${searchMode === "roll_no" ? "bg-[#0E3320] text-white" : "bg-[#FAF8F5] text-[#5C8261] hover:bg-[#EAE2D3]"}`}>
              <Search className="w-3.5 h-3.5" /> Roll No. / DOB
            </button>
            <button type="button" onClick={() => { setSearchMode("email"); setApiError(""); }}
              className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${searchMode === "email" ? "bg-[#0E3320] text-white" : "bg-[#FAF8F5] text-[#5C8261] hover:bg-[#EAE2D3]"}`}>
              <Mail className="w-3.5 h-3.5" /> Email OTP
            </button>
          </div>

          {/* Email OTP mode */}
          {searchMode === "email" && (
            <div className="space-y-4">
              {otpStep === "email" ? (
                <>
                  <div>
                    <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-2">Registered Email Address <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A583A] pointer-events-none" />
                      <input type="email" value={otpEmail} onChange={e => { setOtpEmail(e.target.value); setOtpError(""); }}
                        onKeyDown={e => e.key === "Enter" && handleSendOtp()}
                        placeholder="your@email.com"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] focus:bg-white transition-all" />
                    </div>
                  </div>
                  {otpError && <p className="text-xs text-red-600 font-semibold">{otpError}</p>}
                  <button type="button" onClick={handleSendOtp} disabled={otpLoading}
                    className="w-full py-3 bg-[#0E3320] hover:bg-[#15482D] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                    {otpLoading ? <><RefreshCw className="w-4 h-4 animate-spin" />Sending…</> : <><Send className="w-4 h-4 text-[#C59B3F]" />Send OTP to Email</>}
                  </button>
                </>
              ) : (
                <>
                  <p className="text-xs text-[#5C8261] text-center">OTP sent to <span className="font-bold text-[#0E3320]">{otpEmail}</span></p>
                  <div>
                    <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-2">Enter 6-digit OTP <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A583A] pointer-events-none" />
                      <input type="text" inputMode="numeric" maxLength={6} value={otpCode} onChange={e => { setOtpCode(e.target.value.replace(/\D/g, "")); setOtpError(""); }}
                        onKeyDown={e => e.key === "Enter" && handleVerifyOtp()}
                        placeholder="_ _ _ _ _ _"
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] tracking-widest text-center font-bold transition-all" />
                    </div>
                  </div>
                  {apiError && <p className="text-xs text-red-600 font-semibold">{apiError}</p>}
                  {otpError && <p className="text-xs text-red-600 font-semibold">{otpError}</p>}
                  <button type="button" onClick={handleVerifyOtp} disabled={otpLoading || isLoading}
                    className="w-full py-3 bg-[#0E3320] hover:bg-[#15482D] text-white rounded-full font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                    {(otpLoading || isLoading) ? <><RefreshCw className="w-4 h-4 animate-spin" />Verifying…</> : <><CheckCircle2 className="w-4 h-4 text-[#C59B3F]" />Verify & Get Result</>}
                  </button>
                  <div className="text-center">
                    {otpTimer > 0 ? <p className="text-xs text-[#9B8265]">Resend in {otpTimer}s</p>
                      : <button type="button" onClick={() => { setOtpStep("email"); setOtpCode(""); setOtpError(""); }} className="text-xs text-[#0E3320] underline font-semibold">Change email / Resend OTP</button>}
                  </div>
                </>
              )}
            </div>
          )}

          {searchMode === "roll_no" && <form onSubmit={handleSearch} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-2">
                  Roll Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. BA2025-0101"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                  <Search className="w-4 h-4 text-[#7A583A] absolute left-3.5 top-3.5" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-2">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                />
              </div>
            </div>

            {apiError && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{apiError}</span>
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-[#EBE2D4]">
              <button
                type="button"
                onClick={handleLoadDemo}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full border-2 border-dashed border-[#C59B3F] text-[#8C671D] hover:bg-[#C59B3F]/10 font-semibold text-xs sm:text-sm transition-all"
              >
                <Sparkles className="w-4 h-4" />
                Try Demo Result (Preview Template)
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-[#E4BF64] font-semibold text-sm shadow-md transition-all group disabled:opacity-70"
              >
                {isLoading ? (
                  <><div className="w-4 h-4 border-2 border-[#E4BF64]/30 border-t-[#E4BF64] rounded-full animate-spin" /><span>Searching...</span></>
                ) : (
                  <><span>Search Result</span></>
                )}
              </button>
            </div>
          </form>}
        </div>
      </section>

      {/* 4. Result Marksheet Display */}
      <section className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 print:pt-4 print:pb-0 print:px-3">
        {resultData ? (
          <>
            {isDemo && (
              <div className="mb-4 flex items-center gap-3 px-4 py-3 rounded-2xl bg-amber-50 border-2 border-dashed border-[#C89324] text-[#8C5914] print:hidden">
                <Sparkles className="w-5 h-5 shrink-0 text-[#C89324]" />
                <div className="flex-1 text-xs sm:text-sm">
                  <span className="font-bold">Demo Preview Mode</span> — This is sample data to preview the marksheet template. Real student results require a valid Roll Number &amp; Date of Birth.
                </div>
                <button onClick={handleReset} className="shrink-0 px-3 py-1.5 rounded-full bg-[#7A4B0E] text-[#FFFDF5] text-xs font-semibold hover:bg-[#5C3608] transition-colors">
                  Close Demo
                </button>
              </div>
            )}
            {/* ── TOP ACTION BAR ── */}
            <div className="no-print mb-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 max-w-[860px] mx-auto">
              <button onClick={handlePrint}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-full bg-[#0B1E36] text-[#E4BF64] hover:bg-[#071527] font-semibold text-sm transition-colors shadow-lg">
                <Printer className="w-4 h-4" />
                Print / Download Marksheet
              </button>
              <button onClick={handleReset}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full border border-[#0B1E36]/30 text-[#0B1E36] hover:bg-[#F0F4F8] text-xs sm:text-sm font-semibold transition-colors">
                Search Another Result
              </button>
            </div>

            {/* ══════════════════════════════════════════
               OFFICIAL MARKSHEET — BA PARISHAD STYLE
          ══════════════════════════════════════════ */}
            <div className="result-marksheet-wrapper w-full max-w-[860px] mx-auto font-sans text-[#0F172A] shadow-2xl print:shadow-none">
              <style>{`
              @media print {
                @page { size: A4 portrait; margin: 8mm 8mm 6mm 8mm; }
                html,body { background:#fff!important; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; margin:0!important; padding:0!important; }
                .no-print { display:none!important; }
                .result-marksheet-wrapper { width:100%!important; max-width:100%!important; box-shadow:none!important; padding-top:6mm!important; }
              }
              .ms-detail-label { color:#64748b; font-size:10px; font-weight:600; min-width:96px; flex-shrink:0; }
              .ms-detail-value { color:#0B1E36; font-size:10.5px; font-weight:700; }
            `}</style>

              {/* ── CLEAN ACADEMIC SINGLE SOLID BORDER ── */}
              <div className="relative bg-white overflow-hidden" style={{ border: "2px solid #0B1E36" }}>

                {/* Watermark */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center select-none overflow-hidden" style={{ zIndex: 20 }} aria-hidden="true">
                  <img src="/logo.png" alt="" style={{ width: 360, height: 360, objectFit: "contain", opacity: 0.10 }} />
                </div>

                <div className="relative z-10">

                      {/* ── 1. HEADER BAND ── */}
                      <div style={{ background: "linear-gradient(135deg,#071527 0%,#0B1E36 40%,#132E52 100%)" }} className="px-5 py-4 flex items-center gap-4">
                        {/* Left logo */}
                        <div className="shrink-0 w-[90px] h-[90px] rounded-full bg-white flex items-center justify-center shadow-xl"
                          style={{ border: "2.5px solid #C59B3F", boxShadow: "0 0 0 4px #C59B3F30, 0 4px 16px #00000060" }}>
                          <img src="/logo.png" alt="BA Logo" style={{ width: 78, height: 78, objectFit: "contain" }} />
                        </div>
                        {/* Center text */}
                        <div className="flex-1 text-center">
                          <div className="text-[#E4BF64] text-[18px] sm:text-[20px] font-extrabold tracking-wide leading-tight" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                            भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्
                          </div>
                          <h1 className="text-white text-[12px] sm:text-[13px] font-bold tracking-[0.16em] uppercase leading-tight mt-1">
                            Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
                          </h1>
                          <div className="flex items-center justify-center gap-2 mt-1.5">
                            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(90deg,transparent,#C59B3F)" }}></div>
                            <span className="text-[#A2B7CF] text-[8.5px] font-medium tracking-wider whitespace-nowrap px-1">
                              Regd. Under Indian Trust Act 2013 &nbsp;✦&nbsp; ISO 9001:2015 Certified
                            </span>
                            <div className="h-px flex-1 max-w-[80px]" style={{ background: "linear-gradient(90deg,#C59B3F,transparent)" }}></div>
                          </div>
                        </div>
                        {/* Right spacer */}
                        <div className="shrink-0 w-[76px] hidden sm:block"></div>
                      </div>

                      {/* Gold stripe */}
                      <div style={{ height: 4, background: "linear-gradient(90deg,#8C671D,#C59B3F,#E4BF64,#C59B3F,#8C671D)" }}></div>

                      {/* ── 2. DOCUMENT TITLE ── */}
                      <div style={{ background: "linear-gradient(180deg,#F5F8FB,#EBF1F7)" }} className="py-2.5 px-6 text-center border-b border-[#D0DCE7]">
                        <div className="flex items-center justify-center gap-3">
                          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg,transparent,#C59B3F)" }}></div>
                          <div>
                            <div className="text-[#0B1E36] font-extrabold text-[13px] tracking-[0.2em] uppercase">Statement of Marks &nbsp;/&nbsp; अंक तालिका</div>
                            <div className="text-[#8C671D] text-[9.5px] font-semibold tracking-wider mt-0.5">{resultData.session}</div>
                          </div>
                          <div className="h-px flex-1" style={{ background: "linear-gradient(90deg,#C59B3F,transparent)" }}></div>
                        </div>
                      </div>

                      <div className="px-5 sm:px-6 pt-4 pb-8 print:px-4 print:pt-3 print:pb-8 space-y-3">

                        {/* ── 3. CANDIDATE DETAILS + PHOTO ── */}
                        <div className="overflow-hidden bg-white" style={{ border: "1px solid #C59B3F", borderRadius: 4 }}>
                          <div style={{ background: "linear-gradient(90deg,#0B1E36,#132E52)" }} className="px-4 py-1.5 flex items-center gap-2">
                            <span style={{ width: 3, height: 14, background: "#C59B3F", borderRadius: 2, flexShrink: 0, display: "inline-block" }}></span>
                            <span className="text-[9.5px] font-extrabold text-white uppercase tracking-[0.15em]">Candidate &amp; Examination Particulars</span>
                          </div>
                          <div className="flex items-stretch">
                            <div className="flex-1 divide-y divide-dashed" style={{ borderColor: "#E2E8F0" }}>
                              {[
                                [["Candidate Name", resultData.name?.toUpperCase(), true], ["Roll Number", resultData.rollNo, true, true]],
                                [["Father's Name", resultData.fatherName?.toUpperCase()], ["Enrollment No.", resultData.enrolmentNo, false, true]],
                                [["Mother's Name", resultData.motherName?.toUpperCase()], ["Date of Birth", resultData.dob || "—"]],
                              ].map((row, ri) => (
                                <div key={ri} className="grid grid-cols-2" style={{ borderBottom: "1px dashed #E2E8F0" }}>
                                  {row.map(([label, val, bold, mono]) => (
                                    <div key={label} className="flex items-center gap-2 px-4 py-[5px]" style={{ borderRight: row.indexOf(arguments) === 0 ? "1px dashed #E2E8F0" : undefined }}>
                                      <span style={{ color: "#64748b", fontSize: 9.5, fontWeight: 600, minWidth: 96, flexShrink: 0 }}>{label}</span>
                                      <span style={{ color: "#94a3b8", fontSize: 10 }}>:</span>
                                      <span style={{ color: "#0B1E36", fontSize: bold ? 11.5 : 10.5, fontWeight: 700, fontFamily: mono ? "monospace" : undefined, letterSpacing: mono ? "0.05em" : undefined }}>{val}</span>
                                    </div>
                                  ))}
                                </div>
                              ))}
                              <div className="flex items-start gap-2 px-4 py-[5px]" style={{ borderBottom: "1px dashed #E2E8F0" }}>
                                <span style={{ color: "#64748b", fontSize: 9.5, fontWeight: 600, minWidth: 96, flexShrink: 0, marginTop: 1 }}>Programme / Course</span>
                                <span style={{ color: "#94a3b8", fontSize: 10, marginTop: 1 }}>:</span>
                                <span style={{ color: "#0B1E36", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", lineHeight: 1.4 }}>{resultData.course}</span>
                              </div>
                              <div className="flex items-start gap-2 px-4 py-[6px]">
                                <span style={{ color: "#64748b", fontSize: 9.5, fontWeight: 600, minWidth: 96, flexShrink: 0, marginTop: 1 }}>Affiliated Institution</span>
                                <span style={{ color: "#94a3b8", fontSize: 10, marginTop: 1 }}>:</span>
                                <span style={{ color: "#0B1E36", fontSize: 10.5, fontWeight: 700, textTransform: "uppercase", lineHeight: 1.4 }}>
                                  {resultData.institute}{resultData.city ? `, ${resultData.city}` : ""}
                                  {resultData.instituteCode ? <span style={{ color: "#C59B3F", fontFamily: "monospace", fontWeight: 600, textTransform: "none", fontSize: 9, marginLeft: 4 }}>({resultData.instituteCode})</span> : ""}
                                </span>
                              </div>
                            </div>
                            {/* Photo */}
                            <div className="shrink-0 w-[96px] flex flex-col items-center justify-center gap-1 p-2" style={{ borderLeft: "1px dashed #E2E8F0", background: "#F8FAFC" }}>
                              <div style={{ border: "2px solid #0B1E36", width: 78, height: 100, overflow: "hidden", background: "#F1F5F9", position: "relative", boxShadow: "2px 2px 6px #0003" }}>
                                {resultData.photoUrl ? (
                                  <img src={resultData.photoUrl} alt={resultData.name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }}
                                    onError={(e) => { e.target.style.display = "none"; e.target.parentNode.querySelector(".photo-placeholder").style.display = "flex"; }} />
                                ) : null}
                                <div className="photo-placeholder absolute inset-0 flex-col items-center justify-center gap-1" style={{ display: resultData.photoUrl ? "none" : "flex" }}>
                                  <svg style={{ width: 24, height: 24, color: "#0B1E3640" }} fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                  </svg>
                                  <span style={{ fontSize: 7, fontWeight: 700, color: "#0B1E3650", textAlign: "center", lineHeight: 1.3, textTransform: "uppercase" }}>Candidate<br />Photo</span>
                                </div>
                              </div>
                              <div style={{ fontSize: 7.5, color: "#64748b", textAlign: "center" }}>Passport Size</div>
                            </div>
                          </div>
                        </div>

                        {/* ── 4. MARKS TABLE ── */}
                        <div className="overflow-hidden bg-white" style={{ border: "1px solid #C59B3F", borderRadius: 4 }}>
                          <div style={{ background: "linear-gradient(90deg,#0B1E36,#132E52)" }} className="px-4 py-1.5 flex items-center gap-2">
                            <span style={{ width: 3, height: 14, background: "#C59B3F", borderRadius: 2, flexShrink: 0, display: "inline-block" }}></span>
                            <span className="text-[9.5px] font-extrabold text-white uppercase tracking-[0.15em]">Subject-Wise Marks / विषयवार अंक</span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-left">
                              <thead>
                                <tr style={{ background: "#0B1E36" }} className="text-white">
                                  <th className="py-2.5 px-2 text-center font-bold uppercase tracking-wide border-r border-white/10" style={{ width: "12%", fontSize: 11 }}>Code</th>
                                  <th className="py-2.5 px-3 font-bold uppercase tracking-wide border-r border-white/10" style={{ width: "30%", fontSize: 11 }}>Subject Name</th>
                                  <th className="py-2.5 px-2 text-center font-bold uppercase tracking-wide border-r border-white/10" style={{ width: "8%", fontSize: 10.5 }}>Max<br /><span style={{ fontWeight: 400, fontSize: 8.5, color: "rgba(255,255,255,0.6)", textTransform: "none" }}>Marks</span></th>
                                  <th className="py-2.5 px-2 text-center font-bold uppercase tracking-wide border-r border-white/10" style={{ width: "9%", fontSize: 10.5 }}>Theory<br /><span style={{ fontWeight: 400, fontSize: 8.5, color: "rgba(255,255,255,0.6)", textTransform: "none" }}>Obtained</span></th>
                                  <th className="py-2.5 px-2 text-center font-bold uppercase tracking-wide border-r border-white/10" style={{ width: "9%", fontSize: 10.5 }}>Practical<br /><span style={{ fontWeight: 400, fontSize: 8.5, color: "rgba(255,255,255,0.6)", textTransform: "none" }}>Obtained</span></th>
                                  <th className="py-2.5 px-2 text-center font-bold uppercase tracking-wide border-r border-white/10" style={{ width: "7%", fontSize: 10.5 }}>CA<br /><span style={{ fontWeight: 400, fontSize: 8.5, color: "rgba(255,255,255,0.6)", textTransform: "none" }}>Marks</span></th>
                                  <th className="py-2.5 px-2 text-center font-bold uppercase tracking-wide border-r border-white/10" style={{ width: "8%", fontSize: 10.5 }}>Total<br /><span style={{ fontWeight: 400, fontSize: 8.5, color: "rgba(255,255,255,0.6)", textTransform: "none" }}>Obtained</span></th>
                                  <th className="py-2.5 px-2 text-center font-bold uppercase tracking-wide" style={{ width: "7%", fontSize: 11 }}>Grade</th>
                                </tr>
                              </thead>
                              <tbody>
                                {resultData.subjects.map((sub, idx) => (
                                  <tr key={idx} style={{ background: !sub.pass ? "#fff1f2" : idx % 2 === 0 ? "#ffffff" : "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                                    <td className="py-2.5 px-2 text-center font-mono font-extrabold border-r border-slate-200" style={{ color: "#8C671D", fontSize: 11 }}>{sub.code}</td>
                                    <td className="py-2.5 px-3 border-r border-slate-200" style={{ fontWeight: 700, color: "#0B1E36", fontSize: 12 }}>{sub.name}</td>
                                    <td className="py-2.5 px-2 text-center border-r border-slate-200" style={{ color: "#64748b", fontWeight: 600, fontSize: 11 }}>{sub.totalMax}</td>
                                    <td className="py-2.5 px-2 text-center font-mono border-r border-slate-200" style={{ fontWeight: 700, color: "#0B1E36", fontSize: 11.5 }}>{sub.thObt ?? "—"}</td>
                                    <td className="py-2.5 px-2 text-center font-mono border-r border-slate-200" style={{ fontWeight: 700, color: "#0B1E36", fontSize: 11.5 }}>{sub.prMax > 0 ? (sub.prObt ?? "—") : "—"}</td>
                                    <td className="py-2.5 px-2 text-center font-mono border-r border-slate-200" style={{ fontWeight: 600, color: "#64748b", fontSize: 11 }}>{sub.caObt !== null && sub.caObt !== undefined && sub.caObt !== "" ? sub.caObt : "—"}</td>
                                    <td className={`py-2.5 px-2 text-center font-mono font-extrabold border-r border-slate-200 ${!sub.pass ? "text-red-600" : "text-[#0B1E36]"}`} style={{ fontSize: 14 }}>{sub.totalObt}</td>
                                    <td className={`py-2.5 px-2 text-center font-extrabold ${!sub.pass ? "text-red-600" : "text-[#8C671D]"}`} style={{ fontSize: 13 }}>{sub.grade || "—"}</td>
                                  </tr>
                                ))}
                                <tr style={{ background: "linear-gradient(90deg,#071527,#0B1E36,#132E52)", borderTop: "2px solid #C59B3F" }}>
                                  <td colSpan={2} className="py-2.5 px-3 text-right border-r border-white/15" style={{ fontSize: 9.5, fontWeight: 800, color: "#E4BF64", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                                    Grand Total / कुल प्राप्तांक
                                  </td>
                                  <td className="py-2.5 px-2 text-center font-bold text-white border-r border-white/15">{resultData.grandTotalMax}</td>
                                  <td colSpan={3} className="py-2.5 text-center border-r border-white/15" style={{ fontSize: 9, color: "rgba(255,255,255,0.4)" }}>— combined —</td>
                                  <td className="py-2.5 px-2 text-center font-mono font-extrabold border-r border-white/15" style={{ fontSize: 16, color: "#E4BF64" }}>{resultData.grandTotalObt}</td>
                                  <td className={`py-2.5 px-2 text-center font-extrabold text-[12px] ${resultData.status === "PASS" ? "text-[#E4BF64]" : resultData.status === "AWAITED" ? "text-amber-300" : "text-red-300"}`}>{resultData.status}</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>

                        {/* ── 5. RESULT SUMMARY ── */}
                        <div className="grid grid-cols-3 gap-2.5">
                          {/* Total */}
                          <div style={{ border: "1.5px solid #C59B3F", borderRadius: 6, background: "linear-gradient(135deg,#FAF8F5,#F0E9DC)", padding: "10px 8px", textAlign: "center" }}>
                            <div style={{ fontSize: 8, color: "#8C671D", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Total Marks</div>
                            <div style={{ fontSize: 26, fontWeight: 900, color: "#0B1E36", fontFamily: "monospace", lineHeight: 1 }}>{resultData.grandTotalObt}</div>
                            <div style={{ fontSize: 9, color: "#64748b", marginTop: 3 }}>out of {resultData.grandTotalMax}</div>
                          </div>
                          {/* Percentage */}
                          <div style={{ border: "1.5px solid #C59B3F", borderRadius: 6, background: "linear-gradient(135deg,#FAF8F5,#F0E9DC)", padding: "10px 8px", textAlign: "center" }}>
                            <div style={{ fontSize: 8, color: "#8C671D", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Percentage</div>
                            <div style={{ fontSize: 26, fontWeight: 900, color: "#0B1E36", fontFamily: "monospace", lineHeight: 1 }}>{resultData.percentage}%</div>
                            <div style={{ fontSize: 9, color: "#8C671D", fontWeight: 700, marginTop: 3 }}>{resultData.division}</div>
                          </div>
                          {/* Result */}
                          <div style={{
                            border: `1.5px solid ${resultData.status === "PASS" ? "#C59B3F" : resultData.status === "AWAITED" ? "#f59e0b" : "#dc2626"}`,
                            borderRadius: 6,
                            background: resultData.status === "PASS" ? "linear-gradient(135deg,#FAF8F5,#F0E9DC)" : resultData.status === "AWAITED" ? "linear-gradient(135deg,#fffbeb,#fef3c7)" : "linear-gradient(135deg,#fef2f2,#fee2e2)",
                            padding: "10px 8px", textAlign: "center"
                          }}>
                            <div style={{ fontSize: 8, color: "#8C671D", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 4 }}>Final Result</div>
                            <div style={{ fontSize: 26, fontWeight: 900, lineHeight: 1, color: resultData.status === "PASS" ? "#0B1E36" : resultData.status === "AWAITED" ? "#b45309" : "#dc2626" }}>
                              {resultData.status === "PASS" ? "✓ PASS" : resultData.status === "AWAITED" ? "⏳ AWAITED" : "✗ FAIL"}
                            </div>
                            <div style={{ fontSize: 9, fontWeight: 700, marginTop: 3, color: resultData.status === "PASS" ? "#8C671D" : resultData.status === "AWAITED" ? "#b45309" : "#dc2626" }}>
                              {resultData.status === "PASS" ? "उत्तीर्ण" : resultData.status === "AWAITED" ? "प्रतीक्षित" : "अनुत्तीर्ण"}
                            </div>
                          </div>
                        </div>

                        {/* ── 6. GRADING SCALE ── */}
                        <div style={{ border: "1px solid #CBD5E1", borderRadius: 4, background: "#F8FAFC", padding: "7px 14px" }}>
                          <span style={{ fontSize: 8.5, fontWeight: 800, color: "#0B1E36", textTransform: "uppercase", letterSpacing: "0.12em", marginRight: 10 }}>Grading Scale:</span>
                          {[["A+", "90–100%"], ["A", "80–89%"], ["B+", "70–79%"], ["B", "60–69%"], ["C", "50–59%"], ["D", "40–49%"], ["F", "<40%"]].map(([g, r]) => (
                            <span key={g} style={{ marginRight: 10, fontSize: 10, color: "#475569" }}>
                              <strong style={{ color: g === "F" ? "#dc2626" : g === "D" ? "#b45309" : "#0B1E36", fontSize: 10.5 }}>{g}</strong> {r}
                            </span>
                          ))}
                          <span style={{ fontSize: 9, fontWeight: 700, color: "#0B1E36", marginLeft: 6, paddingLeft: 10, borderLeft: "1px solid #C59B3F" }}>✦ Min. Pass: 40%</span>
                        </div>

                        {/* ── 7. SIGNATURES + SEAL ── */}
                        <div style={{ border: "1px solid #C59B3F", borderRadius: 4, overflow: "hidden" }}>
                          {/* Top label bar */}
                          <div style={{ background: "linear-gradient(90deg,#0B1E36,#132E52)", padding: "5px 14px", display: "flex", alignItems: "center", gap: 8 }}>
                            <span style={{ width: 3, height: 12, background: "#C59B3F", borderRadius: 2, flexShrink: 0, display: "inline-block" }}></span>
                            <span style={{ fontSize: 9.5, fontWeight: 800, color: "white", textTransform: "uppercase", letterSpacing: "0.15em" }}>Authorisation &amp; Verification</span>
                          </div>

                          <div style={{ background: "linear-gradient(180deg,#ffffff,#F8FAFC)", padding: "12px 28px 12px", display: "flex", alignItems: "center", justifyContent: "space-around", gap: 24 }}>

                            {/* Seal (Left/Center-Left) */}
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, gap: 4 }}>
                              <div style={{
                                width: 74, height: 74, borderRadius: "50%",
                                border: "2.5px solid #0B1E36",
                                background: "radial-gradient(circle at 40% 35%,#ffffff 60%,#F1F5F9)",
                                boxShadow: "0 0 0 2px #C59B3F, 0 0 0 4px #C59B3F25, 0 3px 12px #0B1E3625",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                position: "relative"
                              }}>
                                <div style={{ position: "absolute", inset: 5, borderRadius: "50%", border: "1.2px dashed #0B1E3650" }}></div>
                                <div style={{ position: "absolute", inset: 10, borderRadius: "50%", border: "0.5px dotted #C59B3F70" }}></div>
                                <img src="/logo.png" alt="" style={{ width: 38, height: 38, objectFit: "contain", position: "relative", zIndex: 1 }} />
                              </div>
                              <div style={{ textAlign: "center" }}>
                                <div style={{ fontSize: 9, fontWeight: 800, color: "#0B1E36", textTransform: "uppercase", letterSpacing: "0.08em" }}>Digitally Verified</div>
                                <div style={{ fontSize: 7, color: "#64748b", marginTop: 1 }}>System Generated · Valid for Official Use</div>
                              </div>
                            </div>

                            {/* Secretary Sig (Right) */}
                            <div style={{ width: 280, maxWidth: "100%", textAlign: "center" }}>
                              <div style={{ height: 48, borderBottom: "1.5px solid #94a3b8", marginBottom: 6, marginLeft: 8, marginRight: 8, position: "relative", display: "flex", alignItems: "flex-end", justifyContent: "center" }}>
                                <img
                                  src="/Signature.png"
                                  alt="Secretary Signature"
                                  style={{ maxHeight: 40, maxWidth: 150, objectFit: "contain", marginBottom: 6, mixBlendMode: "multiply" }}
                                />
                                <div style={{ position: "absolute", bottom: -1, left: "50%", transform: "translateX(-50%)", width: 6, height: 6, borderRadius: "50%", background: "#C59B3F", marginBottom: -3 }}></div>
                              </div>
                              <div style={{ fontSize: 10, fontWeight: 800, color: "#0B1E36", letterSpacing: "0.03em" }}>Secretary / सचिव</div>
                              <div style={{ fontSize: 8.5, color: "#8C671D", fontWeight: 600, marginTop: 1, lineHeight: 1.3 }}>भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्</div>
                            </div>

                          </div>
                        </div>

                      </div>{/* /inner padding */}
                    </div>{/* /relative z-10 */}

                  </div>{/* /academic double border frame */}

            </div>{/* /marksheet wrapper */}
          </>
        ) : searched && !isLoading ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-[#EBE2D4] space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
            <h3 className="font-bold text-lg text-[#0E3320]">No Result Record Found</h3>
            <p className="text-sm text-[#666]">
              {apiError || "Please double-check your Roll Number and Date of Birth."}
            </p>
          </div>
        ) : isLoading ? (
          <div className="bg-white rounded-2xl p-16 text-center border border-[#EBE2D4]">
            <div className="w-10 h-10 border-4 border-[#0E3320]/20 border-t-[#0E3320] rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-[#5C8261]">Searching result records...</p>
          </div>
        ) : (
          <div className="bg-white/60 border-2 border-dashed border-[#D5C7B5] rounded-2xl p-12 text-center space-y-3">
            <GraduationCap className="w-12 h-12 text-[#C59B3F] mx-auto opacity-75" />
            <h3 className="font-serif font-bold text-xl text-[#0E3320]">
              Enter Your Roll Number &amp; Date of Birth to View Marksheet
            </h3>
            <p className="text-xs sm:text-sm text-[#7A583A] max-w-md mx-auto">
              Official results are published after result declaration. Both fields are required for security.
            </p>
          </div>
        )}
      </section>

      {/* 5. Footer */}
      <Footer />

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </main>
  );
}
