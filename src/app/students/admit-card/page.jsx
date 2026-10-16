"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Search, Printer, AlertCircle, User,
  RefreshCw, FileText, CheckCircle2, ShieldCheck,
  BookOpen, Calendar, Download, ChevronRight,
  Mail, KeyRound, Shield, Send,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";
import AdmitCardTemplate from "@/components/admin/AdmitCardTemplate";

function fmtDate(d) {
  if (!d) return "—";
  const p = d.split("-");
  if (p.length === 3 && p[0].length === 4)
    return `${p[2].padStart(2,"0")}-${p[1].padStart(2,"0")}-${p[0]}`;
  return d;
}

const DAYS   = Array.from({ length: 31 }, (_, i) => String(i + 1).padStart(2, "0"));
const MONTHS = [
  ["01","January"],["02","February"],["03","March"],["04","April"],
  ["05","May"],["06","June"],["07","July"],["08","August"],
  ["09","September"],["10","October"],["11","November"],["12","December"],
];
const CUR_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 40 }, (_, i) => String(CUR_YEAR - i));

const STEPS = [
  { n:1, icon: FileText,     title:"Enter Details",   desc:"Provide your Roll/Enrollment number and Date of Birth." },
  { n:2, icon: Search,       title:"Fetch Admit Card", desc:"Our system verifies your approved registration record." },
  { n:3, icon: Download,     title:"Download & Print", desc:"Save as PDF or print your official exam hall ticket." },
];

const BRING = [
  "Printed copy of this Admit Card",
  "Valid Govt. Photo ID (Aadhaar / PAN / Voter ID)",
  "Blue or Black ballpoint pen only",
  "Report at exam centre 30 min before start",
];

const DEMO_CARD = {
  student: {
    candidate_name: "Priya Sharma",
    father_name:    "Ramesh Kumar Sharma",
    dob:            "2001-08-15",
    gender:         "Female",
    roll_no:        "BA2025-DEMO-01",
    enrollment_no:  "BAYP-ENR-2023-0042",
    course:         "Diploma in Naturopathy & Yogic Sciences (D.N.Y.S.)",
    college:        "Gyan Prabhat Institute of Paramedical Science",
    college_city:   "Jaunpur, Uttar Pradesh",
    session_label:  "Annual Examination 2025–26",
    photo_url:      "/images/testimonials/priya-patel.jpg",
  },
  subjects: [
    { subject_code:"DNYS-101", subject_name:"Anatomy & Physiology",            exam_date:"2025-11-10", exam_time:"10:00 AM – 01:00 PM" },
    { subject_code:"DNYS-102", subject_name:"Naturopathy Principles & Theory", exam_date:"2025-11-12", exam_time:"10:00 AM – 01:00 PM" },
    { subject_code:"DNYS-103", subject_name:"Yoga Therapy & Practice",         exam_date:"2025-11-14", exam_time:"02:00 PM – 05:00 PM" },
    { subject_code:"DNYS-104", subject_name:"Hydrotherapy & Mud Therapy",      exam_date:"2025-11-17", exam_time:"10:00 AM – 01:00 PM" },
    { subject_code:"DNYS-105", subject_name:"Diet & Nutrition Science",        exam_date:"2025-11-19", exam_time:"10:00 AM – 01:00 PM" },
    { subject_code:"DNYS-106", subject_name:"Panchakarma & Detox Therapy",     exam_date:"2025-11-21", exam_time:"02:00 PM – 05:00 PM" },
  ],
};

export default function AdmitCardPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [rollNo,   setRollNo]   = useState("");
  const [dobDay,   setDobDay]   = useState("");
  const [dobMonth, setDobMonth] = useState("");
  const [dobYear,  setDobYear]  = useState("");
  const [examYear, setExamYear] = useState("Annual Examination");
  const [cardData, setCardData] = useState(null);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [isDemo,   setIsDemo]   = useState(false);

  // OTP-based search
  const [searchMode, setSearchMode] = useState("roll_no"); // "roll_no" | "email"
  const [otpEmail,   setOtpEmail]   = useState("");
  const [otpCode,    setOtpCode]    = useState("");
  const [otpStep,    setOtpStep]    = useState("email"); // "email" | "otp"
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError,   setOtpError]   = useState("");
  const [otpTimer,   setOtpTimer]   = useState(0);

  const handleSendOtp = async () => {
    if (!otpEmail.trim() || !/\S+@\S+\.\S+/.test(otpEmail)) { setOtpError("Please enter a valid email address."); return; }
    setOtpLoading(true); setOtpError("");
    try {
      const res = await fetch("/api/public/otp", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action: "send", email: otpEmail.trim() }) });
      const json = await res.json();
      if (!res.ok) { setOtpError(json.error || "Failed to send OTP."); }
      else {
        setOtpStep("otp");
        setOtpTimer(60);
        const iv = setInterval(() => setOtpTimer(t => { if (t <= 1) { clearInterval(iv); return 0; } return t - 1; }), 1000);
      }
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
      // OTP verified — fetch admit card by email
      setError(""); setLoading(true); setCardData(null);
      const emailParams = { email: otpEmail.trim() };
      if (examYear && examYear !== "Annual Examination") {
        emailParams.year = examYear.includes("2") ? "2" : examYear.includes("3") ? "3" : "1";
      }
      const cardRes = await fetch(`/api/public/admit-card?${new URLSearchParams(emailParams)}`);
      const cardJson = await cardRes.json();
      if (!cardRes.ok) setError(cardJson.error || "No admit card found.");
      else setCardData(cardJson);
      setLoading(false);
    } catch { setOtpError("Network error."); }
    setOtpLoading(false);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!rollNo.trim() || !dobDay || !dobMonth || !dobYear) {
      setError("Please provide Enrollment Number and complete Date of Birth.");
      return;
    }
    const dob = `${dobYear}-${dobMonth}-${dobDay}`;
    setError(""); setLoading(true); setCardData(null);
    try {
      const params = { roll_no: rollNo.trim(), dob };
      if (examYear && examYear !== "Annual Examination") {
        params.year = examYear.includes("2") ? "2" : examYear.includes("3") ? "3" : "1";
      }
      const res  = await fetch(`/api/public/admit-card?${new URLSearchParams(params)}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || "No admit card found.");
      else         setCardData(data);
    } catch { setError("Network error. Please try again."); }
    setLoading(false);
  };

  const handleReset = () => {
    setCardData(null); setError(""); setRollNo("");
    setDobDay(""); setDobMonth(""); setDobYear(""); setIsDemo(false);
    setExamYear("Annual Examination");
    setOtpStep("email"); setOtpCode(""); setOtpError("");
  };

  const handleDemo = () => {
    setCardData(DEMO_CARD); setIsDemo(true); setError("");
  };

  const selCls = "w-full px-3 py-3 bg-[#FAF8F5] border border-[#D5C7B5] rounded-xl text-sm font-medium text-[#0E3320] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] focus:border-[#C59B3F] transition-all cursor-pointer";

  // ─── ADMIT CARD VIEW ────────────────────────────────────────────────────────
  if (cardData) return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="no-print print:hidden"><TopBar /><Navbar onOpenConsultation={() => setIsConsultationOpen(true)} /><ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} /></div>

      <div className="no-print print:hidden max-w-[860px] mx-auto px-4 pt-6 pb-4 flex items-center justify-between gap-3">
        {isDemo && (
          <div className="flex-1 flex items-center gap-3 px-4 py-2.5 rounded-2xl bg-amber-50 border-2 border-dashed border-[#C59B3F] text-[#8C671D]">
            <Download className="w-4 h-4 shrink-0 text-[#C59B3F]" />
            <span className="text-xs font-bold">Demo Preview Mode — Sample data only. Real admit card requires valid Roll Number &amp; DOB.</span>
            <button onClick={handleReset} className="ml-auto shrink-0 px-3 py-1 rounded-full bg-[#0E3320] text-white text-xs font-semibold">Close</button>
          </div>
        )}
        {!isDemo && (
          <button onClick={handleReset}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-white border border-[#DDD1BE] text-[#0E3320] text-xs font-bold rounded-xl shadow-sm hover:border-[#0E3320] transition-colors cursor-pointer">
            Search Another
          </button>
        )}
        <button onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-[#0E3320] hover:bg-[#071F13] text-[#E4BF64] text-sm font-extrabold rounded-full shadow-lg transition-all cursor-pointer">
          <Printer className="w-4 h-4" /> Print / Download Admit Card
        </button>
      </div>

      {/* ══ ADMIT CARD TEMPLATE (RESULT STYLE) ══ */}
      <div className="max-w-[860px] mx-auto px-4 pb-12 print:p-0 print:max-w-none">
        <AdmitCardTemplate
          data={{
            candidate_name: cardData.student?.candidate_name,
            roll_no: cardData.student?.roll_no,
            father_name: cardData.student?.father_name,
            mother_name: cardData.student?.mother_name,
            dob: cardData.student?.dob,
            gender: cardData.student?.gender,
            enrollment_no: cardData.student?.enrollment_no,
            course: cardData.student?.course,
            center_name: cardData.student?.college || cardData.student?.center_name,
            photo_url: cardData.student?.photo_url,
            session_label: cardData.student?.session_label,
            exam_year_label: cardData.student?.exam_year_label,
            subjects: cardData.subjects || [],
          }}
        />
      </div>
      <div className="no-print print:hidden"><Footer /></div>
    </div>
  );

  // ─── SEARCH PAGE VIEW ────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />
      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />

      {/* ══ FULL-WIDTH HERO ══ */}
      <section className="relative bg-[#071F13] text-white py-16 md:py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/hero/hero-meditation.jpg" alt="Admit Card"
            className="w-full h-full object-cover opacity-60 object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/65 to-[#071F13]/70" />
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          {/* Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#C59B3F] font-semibold tracking-wider uppercase">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C671D]">/</span>
            <span className="text-[#C59B3F]">Students</span>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">Admit Card</span>
          </nav>

          {/* Badge pill */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-xs sm:text-sm font-semibold shadow-sm">
              <span>🌿</span>
              <span>भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद् • परीक्षा प्रवेश पत्र</span>
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2 pt-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-devanagari font-extrabold text-white leading-tight">
              प्रवेश पत्र डाउनलोड
            </h1>
            <div className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#C59B3F] font-bold">
              Admit Card Download
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#CBD8CB] leading-relaxed">
            Enter your Roll Number and Date of Birth to instantly search, view, and print your official Bhartiya Ayurveda Examination Hall Ticket.
          </p>
        </div>
      </section>

      {/* ══ FORM CARD (overlapping hero) ══ */}
      <section className="max-w-[600px] mx-auto w-full px-3 sm:px-6 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-[#EBE2D4] p-5 sm:p-8">
          {/* Mode tabs */}
          <div className="flex rounded-xl overflow-hidden border border-[#DDD1BE] mb-5">
            <button type="button" onClick={() => { setSearchMode("roll_no"); setError(""); setOtpError(""); }}
              className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${searchMode === "roll_no" ? "bg-[#0E3320] text-white" : "bg-[#FAF8F5] text-[#5C8261] hover:bg-[#EAE2D3]"}`}>
              <Search className="w-3.5 h-3.5" /> Roll No. / DOB
            </button>
            <button type="button" onClick={() => { setSearchMode("email"); setError(""); }}
              className={`flex-1 py-2.5 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors ${searchMode === "email" ? "bg-[#0E3320] text-white" : "bg-[#FAF8F5] text-[#5C8261] hover:bg-[#EAE2D3]"}`}>
              <Mail className="w-3.5 h-3.5" /> Email OTP
            </button>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 font-medium flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span className="leading-snug">{error}</span>
            </div>
          )}

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
                    <p className="mt-1.5 text-[12px] text-[#9B8265]">Use the email you registered with during admission.</p>
                  </div>
                  {otpError && <p className="text-xs text-red-600 font-semibold">{otpError}</p>}
                  <button type="button" onClick={handleSendOtp} disabled={otpLoading}
                    className="w-full py-3.5 bg-[#0E3320] hover:bg-[#15482D] text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
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
                  {otpError && <p className="text-xs text-red-600 font-semibold">{otpError}</p>}
                  <button type="button" onClick={handleVerifyOtp} disabled={otpLoading || loading}
                    className="w-full py-3.5 bg-[#0E3320] hover:bg-[#15482D] text-white rounded-xl font-extrabold text-sm flex items-center justify-center gap-2 disabled:opacity-60 transition-colors">
                    {(otpLoading || loading) ? <><RefreshCw className="w-4 h-4 animate-spin" />Verifying…</> : <><CheckCircle2 className="w-4 h-4 text-[#C59B3F]" />Verify & Get Admit Card</>}
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
            {/* Roll / Enrollment */}
            <div>
              <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-2">
                Roll / Enrollment Number / नामांकन संख्या <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A583A] pointer-events-none" />
                <input type="text" required value={rollNo}
                  onChange={e => setRollNo(e.target.value)}
                  placeholder="e.g. BA2025-0101"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] focus:bg-white transition-all placeholder:text-[#BBA88A]" />
              </div>
              <p className="mt-1.5 text-[12px] text-[#9B8265]">Enter your roll number or enrollment number as provided by the council.</p>
            </div>

            {/* DOB */}
            <div>
              <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-2">
                Date of Birth / जन्म तिथि <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                <div className="relative">
                  <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A583A] pointer-events-none" />
                  <select value={dobDay} onChange={e => setDobDay(e.target.value)} required
                    className="w-full pl-7 pr-1 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] transition-all cursor-pointer">
                    <option value="">Day</option>
                    {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <select value={dobMonth} onChange={e => setDobMonth(e.target.value)} required
                  className="w-full px-2 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] transition-all cursor-pointer">
                  <option value="">Month</option>
                  {MONTHS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <select value={dobYear} onChange={e => setDobYear(e.target.value)} required
                  className="w-full px-2 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] transition-all cursor-pointer">
                  <option value="">Year</option>
                  {YEARS.map(y => <option key={y} value={y}>{y}</option>)}
                </select>
              </div>
              <p className="mt-1.5 text-[12px] text-[#9B8265]">Select exact Day, Month and Year as registered with the council.</p>
            </div>

            {/* Examination */}
            <div>
              <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-2">
                Examination / परीक्षा <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <BookOpen className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A583A] pointer-events-none" />
                <select value={examYear} onChange={e => setExamYear(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] transition-all cursor-pointer">
                  <option value="Annual Examination">Annual Examination / वार्षिक परीक्षा</option>
                  <option value="1st Year">1st Year / प्रथम वर्ष</option>
                  <option value="2nd Year">2nd Year / द्वितीय वर्ष</option>
                  <option value="3rd Year">3rd Year / तृतीय वर्ष</option>
                </select>
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 border-t border-[#EBE2D4] space-y-3">
              <button type="submit" disabled={loading}
                className="w-full py-3.5 px-5 bg-[#0E3320] hover:bg-[#15482D] text-white rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-sm font-extrabold uppercase tracking-wider cursor-pointer disabled:opacity-60 active:scale-[0.99]">
                {loading ? (
                  <><RefreshCw className="w-4 h-4 animate-spin" /> Searching…</>
                ) : (
                  <><Search className="w-4 h-4 text-[#C59B3F]" /> Find My Admit Card / प्रवेश पत्र खोजें</>
                )}
              </button>
              <button type="button" onClick={handleDemo}
                className="w-full py-2.5 px-5 rounded-xl border-2 border-dashed border-[#C59B3F] text-[#8C671D] hover:bg-[#C59B3F]/10 font-semibold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
                <Download className="w-4 h-4" />
                Try Demo Admit Card (Preview Template)
              </button>
            </div>
          </form>}
        </div>

        {/* Help note */}
        <p className="text-center text-[13px] text-[#9B8265] mt-3 mb-2">
          Facing issues? Contact your affiliated college or institute administration.
        </p>
      </section>

      {/* ══ HOW IT WORKS ══ */}
      <section className="max-w-[600px] mx-auto w-full px-3 sm:px-6 mt-8 space-y-3">
        <p className="text-center text-[13px] font-extrabold text-[#0E3320] uppercase tracking-widest">How It Works</p>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {STEPS.map(s => {
            const Icon = s.icon;
            return (
              <div key={s.n} className="bg-white rounded-2xl border border-[#E0D6C8] p-2.5 sm:p-4 text-center flex flex-col items-center gap-1.5 sm:gap-2 hover:shadow-md transition-shadow">
                <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0E3320] text-[#E4BF64] flex items-center justify-center text-xs font-extrabold">{s.n}</span>
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 text-[#C59B3F]" />
                <div>
                  <p className="font-bold text-[#0E3320] text-[11px] sm:text-[13px] leading-tight">{s.title}</p>
                  <p className="hidden sm:block text-[12px] text-[#9B8265] mt-0.5 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ══ WHAT TO BRING ══ */}
      <section className="max-w-[600px] mx-auto w-full px-3 sm:px-6 mt-4 mb-10">
        <div className="bg-[#0E3320] rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="w-5 h-5 text-[#C59B3F]" />
            <h2 className="text-white font-extrabold text-sm">What to Bring to Exam Centre</h2>
          </div>
          <div className="space-y-2">
            {BRING.map((item, i) => (
              <div key={i} className="flex items-center gap-3 bg-white/8 rounded-xl px-3 py-2.5 border border-white/10">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B3F] shrink-0" />
                <span className="text-[#D4E8D4] text-[13px] font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
