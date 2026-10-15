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
      const cardRes = await fetch(`/api/public/admit-card?${new URLSearchParams({ email: otpEmail.trim() })}`);
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
      const res  = await fetch(`/api/public/admit-card?${new URLSearchParams({ roll_no: rollNo.trim(), dob })}`);
      const data = await res.json();
      if (!res.ok) setError(data.error || "No admit card found.");
      else         setCardData(data);
    } catch { setError("Network error. Please try again."); }
    setLoading(false);
  };

  const handleReset = () => {
    setCardData(null); setError(""); setRollNo("");
    setDobDay(""); setDobMonth(""); setDobYear(""); setIsDemo(false);
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

      {/* ══ ADMIT CARD PREMIUM TEMPLATE ══ */}
      <div className="max-w-[860px] mx-auto px-4 pb-12 print:p-0 print:max-w-none">
        <div id="admit-card" style={{ fontFamily:"sans-serif" }}>

          <style>{`
            @media print {
              @page { size: A4 portrait; margin: 6mm 8mm; }
              html,body { background:#fff!important; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; margin:0!important; padding:0!important; }
              .no-print,.print\\:hidden { display:none!important; }
            }
          `}</style>

          {/* Outer premium frame */}
          <div style={{ background:"linear-gradient(135deg,#0E3320,#1A5C38,#0E3320)", padding:"5px", borderRadius:2 }}>
          <div style={{ border:"1.5px solid #C59B3F" }}>
          <div style={{ background:"white", position:"relative", overflow:"hidden" }}>

            {/* Corner ornaments */}
            {[0,1,2,3].map(i => (
              <div key={i} style={{ position:"absolute", zIndex:30, top: i<2?0:undefined, bottom: i>=2?0:undefined, left: i%2===0?0:undefined, right: i%2===1?0:undefined, width:32, height:32, pointerEvents:"none" }}>
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  {i===0 && <><path d="M2 16 L2 2 L16 2" stroke="#C59B3F" strokeWidth="1.5" fill="none"/><circle cx="2" cy="2" r="2.5" fill="#C59B3F"/></>}
                  {i===1 && <><path d="M16 2 L30 2 L30 16" stroke="#C59B3F" strokeWidth="1.5" fill="none"/><circle cx="30" cy="2" r="2.5" fill="#C59B3F"/></>}
                  {i===2 && <><path d="M2 16 L2 30 L16 30" stroke="#C59B3F" strokeWidth="1.5" fill="none"/><circle cx="2" cy="30" r="2.5" fill="#C59B3F"/></>}
                  {i===3 && <><path d="M16 30 L30 30 L30 16" stroke="#C59B3F" strokeWidth="1.5" fill="none"/><circle cx="30" cy="30" r="2.5" fill="#C59B3F"/></>}
                </svg>
              </div>
            ))}

            {/* Watermark */}
            <div style={{ pointerEvents:"none", position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:20, overflow:"hidden" }} aria-hidden>
              <img src="/logo.png" alt="" style={{ width:360, height:360, objectFit:"contain", opacity:0.1 }} />
            </div>

            <div style={{ position:"relative", zIndex:10 }}>

              {/* ── HEADER ── */}
              <div style={{ background:"linear-gradient(135deg,#071F13 0%,#0E3320 40%,#1A5C38 100%)", padding:"16px 20px", display:"flex", alignItems:"center", gap:16 }}>
                <div style={{ flexShrink:0, width:86, height:86, borderRadius:"50%", background:"white", display:"flex", alignItems:"center", justifyContent:"center", border:"2.5px solid #C59B3F", boxShadow:"0 0 0 4px #C59B3F30, 0 4px 16px #00000060" }}>
                  <img src="/logo.png" alt="Logo" style={{ width:72, height:72, objectFit:"contain" }} />
                </div>
                <div style={{ flex:1, textAlign:"center" }}>
                  <div style={{ color:"#E4BF64", fontSize:13.5, fontWeight:700, fontFamily:"'Noto Sans Devanagari',sans-serif" }}>
                    भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्
                  </div>
                  <div style={{ color:"white", fontSize:16, fontWeight:900, textTransform:"uppercase", letterSpacing:"0.05em", marginTop:2 }}>
                    Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
                  </div>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:8, marginTop:6 }}>
                    <div style={{ height:1, flex:1, maxWidth:80, background:"linear-gradient(90deg,transparent,#C59B3F)" }}></div>
                    <span style={{ color:"#A8C5B0", fontSize:8.5, fontWeight:500, letterSpacing:"0.08em", whiteSpace:"nowrap" }}>Regd. Under Indian Trust Act 2013 ✦ ISO 9001:2015 Certified ✦ Examination Division</span>
                    <div style={{ height:1, flex:1, maxWidth:80, background:"linear-gradient(90deg,#C59B3F,transparent)" }}></div>
                  </div>
                </div>
                <div style={{ flexShrink:0, width:86, display:"none" }}></div>
              </div>

              {/* Gold stripe */}
              <div style={{ height:4, background:"linear-gradient(90deg,#8C671D,#C59B3F,#E4BF64,#C59B3F,#8C671D)" }}></div>

              {/* Hall ticket title */}
              <div style={{ background:"linear-gradient(180deg,#F5F0E8,#EDE5D5)", padding:"8px 24px", textAlign:"center", borderBottom:"2px solid #D4C5A9" }}>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:12 }}>
                  <div style={{ height:1, flex:1, background:"linear-gradient(90deg,transparent,#C59B3F)" }}></div>
                  <div>
                    <div style={{ fontSize:13, fontWeight:900, color:"#0E3320", textTransform:"uppercase", letterSpacing:"0.2em" }}>Examination Hall Ticket / प्रवेश पत्र</div>
                    <div style={{ fontSize:10, fontWeight:700, color:"#8C671D", marginTop:2, letterSpacing:"0.05em" }}>{cardData.student.session_label || "Annual Examination 2025–26"}</div>
                  </div>
                  <div style={{ height:1, flex:1, background:"linear-gradient(90deg,#C59B3F,transparent)" }}></div>
                </div>
              </div>

              {/* ── BODY ── */}
              <div style={{ padding:"16px 20px", display:"flex", flexDirection:"column", gap:12 }}>

                {/* Candidate Details */}
                <div style={{ border:"1px solid #C59B3F", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ background:"linear-gradient(90deg,#0E3320,#1A5C38)", padding:"6px 14px", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:3, height:14, background:"#C59B3F", borderRadius:2, flexShrink:0, display:"inline-block" }}></span>
                    <span style={{ fontSize:9.5, fontWeight:800, color:"white", textTransform:"uppercase", letterSpacing:"0.15em" }}>Candidate &amp; Examination Details / अभ्यर्थी विवरण</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"stretch", background:"white" }}>
                    <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", borderRight:"1px dashed #E2D5C0" }}>
                      {[
                        ["Candidate Name", (cardData.student.candidate_name||"—").toUpperCase(), false],
                        ["Roll Number",    cardData.student.roll_no||"—", true],
                        ["Father's Name",  (cardData.student.father_name||"—").toUpperCase(), false],
                        ["Date of Birth",  fmtDate(cardData.student.dob), false],
                        ["Gender",         cardData.student.gender||"—", false],
                        ["Enrollment No.", cardData.student.enrollment_no||"—", true],
                      ].map(([lbl, val, mono]) => (
                        <div key={lbl} style={{ display:"flex", alignItems:"center", gap:6, padding:"5px 14px", borderBottom:"1px dashed #E2D5C0" }}>
                          <span style={{ color:"#64748b", fontSize:9.5, fontWeight:600, minWidth:96, flexShrink:0 }}>{lbl}</span>
                          <span style={{ color:"#94a3b8", fontSize:10 }}>:</span>
                          <span style={{ color:"#0E3320", fontSize:11, fontWeight:700, fontFamily:mono?"monospace":undefined, letterSpacing:mono?"0.05em":undefined }}>{val}</span>
                        </div>
                      ))}
                      <div style={{ display:"flex", alignItems:"start", gap:6, padding:"5px 14px", gridColumn:"1 / -1", borderBottom:"1px dashed #E2D5C0" }}>
                        <span style={{ color:"#64748b", fontSize:9.5, fontWeight:600, minWidth:96, flexShrink:0, marginTop:1 }}>Programme</span>
                        <span style={{ color:"#94a3b8", fontSize:10, marginTop:1 }}>:</span>
                        <span style={{ color:"#0E3320", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>{cardData.student.course||"—"}</span>
                      </div>
                      <div style={{ display:"flex", alignItems:"start", gap:6, padding:"6px 14px", gridColumn:"1 / -1" }}>
                        <span style={{ color:"#64748b", fontSize:9.5, fontWeight:600, minWidth:96, flexShrink:0, marginTop:1 }}>Exam Centre</span>
                        <span style={{ color:"#94a3b8", fontSize:10, marginTop:1 }}>:</span>
                        <span style={{ color:"#0E3320", fontSize:11, fontWeight:700, textTransform:"uppercase" }}>
                          {cardData.student.college||"Central Examination Centre"}{cardData.student.college_city?`, ${cardData.student.college_city}`:""}
                        </span>
                      </div>
                    </div>
                    {/* Photo */}
                    <div style={{ flexShrink:0, width:96, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:10, background:"#FAFAF8" }}>
                      <div style={{ border:"2px solid #0E3320", width:78, height:100, overflow:"hidden", background:"#F5F0E8", position:"relative", boxShadow:"2px 2px 6px #0003" }}>
                        {cardData.student.photo_url ? (
                          <img src={cardData.student.photo_url} alt="Photo" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }} />
                        ) : (
                          <div style={{ width:"100%", height:"100%", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:4 }}>
                            <User style={{ width:24, height:24, color:"#0E332040" }} />
                            <span style={{ fontSize:7, fontWeight:700, color:"#0E332050", textAlign:"center", textTransform:"uppercase", lineHeight:1.3 }}>Affix<br/>Photo</span>
                          </div>
                        )}
                      </div>
                      <div style={{ fontSize:7.5, color:"#94a3b8", marginTop:3 }}>Passport Size</div>
                    </div>
                  </div>
                </div>

                {/* Exam Schedule */}
                <div style={{ border:"1px solid #C59B3F", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ background:"linear-gradient(90deg,#0E3320,#1A5C38)", padding:"6px 14px", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:3, height:14, background:"#C59B3F", borderRadius:2, flexShrink:0, display:"inline-block" }}></span>
                    <span style={{ fontSize:9.5, fontWeight:800, color:"white", textTransform:"uppercase", letterSpacing:"0.15em" }}>Examination Schedule / परीक्षा कार्यक्रम</span>
                  </div>
                  <table style={{ width:"100%", borderCollapse:"collapse" }}>
                    <thead>
                      <tr style={{ background:"#163D27", color:"white" }}>
                        <th style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textTransform:"uppercase", textAlign:"center", borderRight:"1px solid rgba(255,255,255,0.1)", width:"6%" }}>S.No.</th>
                        <th style={{ padding:"8px 12px", fontSize:10, fontWeight:700, textTransform:"uppercase", textAlign:"left", borderRight:"1px solid rgba(255,255,255,0.1)", width:"44%" }}>Subject Name</th>
                        <th style={{ padding:"8px 12px", fontSize:10, fontWeight:700, textTransform:"uppercase", textAlign:"center", borderRight:"1px solid rgba(255,255,255,0.1)", width:"25%" }}>Date of Exam</th>
                        <th style={{ padding:"8px 12px", fontSize:10, fontWeight:700, textTransform:"uppercase", textAlign:"center", width:"25%" }}>Shift / Timing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {cardData.subjects?.length > 0 ? cardData.subjects.map((sub, i) => (
                        <tr key={sub.subject_code||i} style={{ background: i%2===0?"#ffffff":"#F7F3ED", borderBottom:"1px solid #E8E0D4" }}>
                          <td style={{ padding:"7px 10px", textAlign:"center", fontWeight:700, color:"#8C671D", fontSize:11, borderRight:"1px solid #E8E0D4" }}>{i+1}</td>
                          <td style={{ padding:"7px 12px", fontWeight:700, color:"#0E3320", textTransform:"uppercase", fontSize:11, borderRight:"1px solid #E8E0D4" }}>
                            {sub.subject_name}
                            {sub.subject_code && <span style={{ color:"#8C671D", fontFamily:"monospace", fontSize:9.5, fontWeight:600, marginLeft:6 }}>({sub.subject_code})</span>}
                          </td>
                          <td style={{ padding:"7px 12px", textAlign:"center", fontWeight:700, color:"#1e293b", fontSize:11, borderRight:"1px solid #E8E0D4", whiteSpace:"nowrap" }}>
                            {sub.exam_date ? fmtDate(sub.exam_date) : <span style={{ color:"#C59B3F", fontWeight:800 }}>TBA</span>}
                          </td>
                          <td style={{ padding:"7px 12px", textAlign:"center", fontWeight:600, color:"#334155", fontSize:10.5 }}>{sub.exam_time||"—"}</td>
                        </tr>
                      )) : (
                        <tr><td colSpan={4} style={{ padding:"16px", textAlign:"center", color:"#94a3b8", fontStyle:"italic", fontSize:11 }}>Exam schedule will be updated shortly.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Instructions */}
                <div style={{ border:"1px solid #C59B3F", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ background:"linear-gradient(90deg,#0E3320,#1A5C38)", padding:"6px 14px", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:3, height:14, background:"#C59B3F", borderRadius:2, flexShrink:0, display:"inline-block" }}></span>
                    <span style={{ fontSize:9.5, fontWeight:800, color:"white", textTransform:"uppercase", letterSpacing:"0.15em" }}>Important Instructions / महत्वपूर्ण निर्देश</span>
                  </div>
                  <div style={{ background:"#FFFDF8", display:"grid", gridTemplateColumns:"1fr 1fr", gap:0 }}>
                    <div style={{ padding:"10px 16px", borderRight:"1px dashed #E2D5C0" }}>
                      {["Only BLACK or BLUE ballpoint pens are permitted. Mobile phones and electronic devices are strictly prohibited.","Admission is purely provisional. Candidature may be cancelled for misconduct or incorrect information.","Carry this Admit Card along with a valid Govt. Photo ID (Aadhaar, PAN, Voter ID, Driving License).","No candidate will be admitted after 15 minutes from the start of examination."].map((t,i) => (
                        <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                          <span style={{ flexShrink:0, fontWeight:800, color:"#C59B3F", fontSize:10, marginTop:1 }}>{i+1}.</span>
                          <span style={{ fontSize:9.5, color:"#475569", lineHeight:1.6 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                    <div style={{ padding:"10px 16px", fontFamily:"'Noto Sans Devanagari',sans-serif" }}>
                      {["परीक्षा हॉल में केवल काले या नीले बॉल पेन की अनुमति है। मोबाइल फोन सख्त मना है।","परीक्षा में प्रवेश अनंतिम है। गलत जानकारी पर अभ्यर्थिता रद्द हो सकती है।","वैध सरकारी फोटो पहचान पत्र (आधार / पैन / वोटर आईडी) साथ लाना अनिवार्य है।","परीक्षा शुरू होने के 15 मिनट बाद प्रवेश की अनुमति नहीं दी जाएगी।"].map((t,i) => (
                        <div key={i} style={{ display:"flex", gap:8, marginBottom:5 }}>
                          <span style={{ flexShrink:0, fontWeight:800, color:"#C59B3F", fontSize:10, marginTop:1 }}>{i+1}.</span>
                          <span style={{ fontSize:9.5, color:"#475569", lineHeight:1.6 }}>{t}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Signatures */}
                <div style={{ border:"1px solid #C59B3F", borderRadius:4, overflow:"hidden" }}>
                  <div style={{ background:"linear-gradient(90deg,#0E3320,#1A5C38)", padding:"5px 14px", display:"flex", alignItems:"center", gap:8 }}>
                    <span style={{ width:3, height:12, background:"#C59B3F", borderRadius:2, flexShrink:0, display:"inline-block" }}></span>
                    <span style={{ fontSize:9.5, fontWeight:800, color:"white", textTransform:"uppercase", letterSpacing:"0.15em" }}>Authorisation &amp; Verification</span>
                  </div>
                  <div style={{ background:"linear-gradient(180deg,#fff,#F9F5EE)", padding:"16px 24px", display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:12 }}>
                    {/* Candidate sig */}
                    <div style={{ flex:1, textAlign:"center" }}>
                      <div style={{ height:40, borderBottom:"1.5px solid #94a3b8", marginBottom:8, marginLeft:8, marginRight:8, position:"relative" }}>
                        <div style={{ position:"absolute", bottom:-3, left:"50%", transform:"translateX(-50%)", width:6, height:6, borderRadius:"50%", background:"#C59B3F" }}></div>
                      </div>
                      <div style={{ fontSize:10, fontWeight:800, color:"#0E3320" }}>Signature of Candidate</div>
                      <div style={{ fontSize:8.5, color:"#94a3b8", marginTop:2 }}>(In presence of Invigilator)</div>
                    </div>

                    {/* Center seal */}
                    <div style={{ flexShrink:0, display:"flex", flexDirection:"column", alignItems:"center", gap:6 }}>
                      <div style={{ width:88, height:88, borderRadius:"50%", border:"3px solid #0E3320", background:"radial-gradient(circle at 40% 35%,#fff 60%,#F5F0E8)", boxShadow:"0 0 0 2px #C59B3F, 0 0 0 5px #C59B3F25, 0 4px 16px #0E332025", display:"flex", alignItems:"center", justifyContent:"center", position:"relative" }}>
                        <div style={{ position:"absolute", inset:7, borderRadius:"50%", border:"1.5px dashed #0E332050" }}></div>
                        <div style={{ position:"absolute", inset:14, borderRadius:"50%", border:"0.5px dotted #C59B3F70" }}></div>
                        <img src="/logo.png" alt="" style={{ width:44, height:44, objectFit:"contain", position:"relative", zIndex:1 }} />
                      </div>
                      <div style={{ textAlign:"center" }}>
                        <div style={{ fontSize:8.5, fontWeight:800, color:"#0E3320", textTransform:"uppercase", letterSpacing:"0.08em" }}>Official Seal</div>
                        <div style={{ fontSize:7.5, color:"#94a3b8" }}>B.A.Y.E.P.C.P.</div>
                      </div>
                    </div>

                    {/* Controller sig */}
                    <div style={{ flex:1, textAlign:"center" }}>
                      <div style={{ height:40, borderBottom:"1.5px solid #94a3b8", marginBottom:8, marginLeft:8, marginRight:8, position:"relative" }}>
                        <div style={{ position:"absolute", bottom:-3, left:"50%", transform:"translateX(-50%)", width:6, height:6, borderRadius:"50%", background:"#C59B3F" }}></div>
                      </div>
                      <div style={{ fontSize:10, fontWeight:800, color:"#0E3320" }}>Controller of Examinations</div>
                      <div style={{ fontSize:8.5, color:"#8C671D", fontWeight:600, marginTop:2 }}>B.A.Y.E.P.C.P.</div>
                    </div>
                  </div>
                </div>

                {/* Footer note */}
                <div style={{ height:3, background:"linear-gradient(90deg,#8C671D,#C59B3F,#E4BF64,#C59B3F,#8C671D)", margin:"0 -20px" }}></div>
                <div style={{ textAlign:"center", paddingTop:4, paddingBottom:8 }}>
                  <span style={{ fontSize:8.5, color:"#94a3b8" }}>Computer-generated Admit Card — No manual signature required &nbsp;|&nbsp; यह कंप्यूटर जनित प्रवेश पत्र है — हस्ताक्षर की आवश्यकता नहीं</span>
                </div>

              </div>{/* /body */}
            </div>{/* /z-10 */}
          </div>{/* /white bg */}
          </div>{/* /gold border */}
          </div>{/* /gradient frame */}
        </div>
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
