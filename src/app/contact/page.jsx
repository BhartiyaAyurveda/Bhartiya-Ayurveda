"use client";

import { useState } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Flower2,
  FileText,
  GraduationCap,
  Building2,
  Award,
  AlertCircle,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";

const QUERY_TYPES = [
  "Course & Program Inquiry / पाठ्यक्रम जानकारी",
  "Admission Process / प्रवेश प्रक्रिया",
  "Examination / Admit Card / परीक्षा संबंधी",
  "Result & Marksheet / परिणाम एवं अंकतालिका",
  "Certificate & Verification / प्रमाण पत्र",
  "College Affiliation / महाविद्यालय संबद्धता",
  "Registration Query / पंजीकरण संबंधी",
  "General Inquiry / सामान्य जानकारी",
];

const STATIC_CONTACT_CARDS = [
  {
    icon: MapPin,
    titleHi: "मुख्यालय पता",
    titleEn: "Head Office Address",
    desc: "Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad, India",
    sub: "Central board office for all academic, examination and affiliation matters.",
    field: "address",
  },
  {
    icon: Phone,
    titleHi: "फोन एवं व्हाट्सएप",
    titleEn: "Phone & WhatsApp",
    desc: "+91 98765 43210",
    sub: "Mon to Sat: 10:00 AM – 5:00 PM IST",
    field: "phone",
  },
  {
    icon: Mail,
    titleHi: "ईमेल संपर्क",
    titleEn: "Email",
    desc: "contact@bhartiyaayurveda.org",
    sub: "We respond to all queries within 24–48 working hours.",
    field: "email",
  },
  {
    icon: Clock,
    titleHi: "कार्यालय समय",
    titleEn: "Office Hours",
    desc: "Monday – Saturday: 10:00 AM – 5:00 PM",
    sub: "Closed on Sundays and gazetted public holidays.",
    field: "hours",
  },
];

const quickLinks = [
  { icon: GraduationCap, label: "Courses & Programs", sub: "View all affiliated Ayurveda & Yoga courses", href: "/courses" },
  { icon: FileText,      label: "Admit Card",         sub: "Download your examination hall ticket",        href: "/students/admit-card" },
  { icon: Award,         label: "Results",             sub: "Check your examination result & marksheet",   href: "/students/results" },
  { icon: Building2,     label: "Affiliated Institutes",sub: "Find colleges affiliated with our board",    href: "/institutes" },
];


export default function ContactPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { contact: siteContact } = useSiteSettings();
  const c = siteContact || {};
  const addressParts = [c.addressLine1, c.city, c.state, "India"].filter(Boolean);
  const contactCards = STATIC_CONTACT_CARDS.map(card => {
    if (!siteContact) return card;
    if (card.field === "address" && addressParts.length > 1) return { ...card, desc: addressParts.join(", ") };
    if (card.field === "phone"   && c.primaryPhone)           return { ...card, desc: c.primaryPhone, sub: c.workingHoursWeekday ? `${c.workingHoursWeekday} IST` : card.sub };
    if (card.field === "email"   && c.primaryEmail)           return { ...card, desc: c.primaryEmail };
    if (card.field === "hours"   && c.workingHoursWeekday)    return { ...card, desc: c.workingHoursWeekday, sub: c.workingHoursSunday || card.sub };
    return card;
  });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    queryType: "",
    subject: "",
    message: "",
  });

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/public/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name:       formData.name,
          email:      formData.email,
          phone:      formData.phone,
          query_type: formData.queryType,
          message:    formData.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSubmitError(data.error || "Failed to send. Please try again."); }
      else { setIsSubmitted(true); }
    } catch {
      setSubmitError("Network error. Please try again.");
    }
    setIsLoading(false);
  };

  const handleReset = () => {
    setIsSubmitted(false);
    setFormData({ name: "", email: "", phone: "", queryType: "", subject: "", message: "" });
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E3320] font-sans selection:bg-[#C59B3F] selection:text-white">
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* ── Hero ── */}
      <section className="relative bg-[#071F13] text-white py-16 md:py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/cta/cta-landscape.jpg" alt="Contact"
            className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/65 to-[#071F13]/70" />
        </div>
        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          <nav className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#C59B3F] font-semibold tracking-wider uppercase">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">Contact Us</span>
          </nav>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-xs sm:text-sm font-semibold">
              <span>🌿</span>
              <span>भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद् • संपर्क केंद्र</span>
            </div>
          </div>
          <div className="space-y-2 pt-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-devanagari font-extrabold text-white leading-tight">
              संपर्क करें
            </h1>
            <div className="text-xl sm:text-2xl lg:text-3xl text-[#C59B3F] font-bold">
              Contact the Board
            </div>
          </div>
          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#CBD8CB] leading-relaxed">
            For admission inquiries, examination queries, affiliation requests, or any other assistance — our team is here to help.
          </p>
        </div>
      </section>

      {/* ── Contact Cards ── */}
      <section className="py-12 md:py-14 px-4 md:px-8 border-b border-[#EBE2D4]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {contactCards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div key={i} className="bg-white rounded-2xl p-6 border border-[#E8DFD0] shadow-sm hover:shadow-md transition-all flex flex-col gap-3">
                <div className="w-11 h-11 rounded-xl bg-[#EAE2D3] flex items-center justify-center">
                  <Icon className="w-5 h-5 text-[#0E3320]" />
                </div>
                <div>
                  <p className="font-bold text-[#0E3320] text-sm">{c.titleEn}</p>
                  <p className="text-[12px] text-[#8C671D] font-medium font-devanagari">{c.titleHi}</p>
                </div>
                <p className="font-bold text-[#0E3320] text-sm leading-snug">{c.desc}</p>
                <p className="text-xs text-[#52725D] leading-relaxed border-t border-[#F2ECE1] pt-2">{c.sub}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── Main Grid: Form + Quick Links ── */}
      <section className="py-14 md:py-18 px-4 md:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">

          {/* ── Inquiry Form ── */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-[#E4D9C7] shadow-lg space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-[#8C671D] uppercase tracking-wider mb-1">
                <Flower2 className="w-4 h-4 text-[#2E7A4A]" />
                Send a Direct Inquiry
              </div>
              <h2 className="text-xl sm:text-2xl font-devanagari font-bold text-[#0E3320]">हमसे सीधे संपर्क करें</h2>
              <p className="text-sm text-[#52725D] mt-1">Fill the form and our team will get back to you within 24–48 hours.</p>
            </div>

            {isSubmitted ? (
              <div className="py-10 rounded-2xl bg-[#EAF5ED] border border-[#A5D4B2] text-center space-y-3 px-6">
                <CheckCircle2 className="w-14 h-14 text-[#2A7A50] mx-auto" />
                <h3 className="text-lg font-devanagari font-bold text-[#0E3320]">धन्यवाद! आपका संदेश प्राप्त हो गया है।</h3>
                <p className="text-sm text-[#2E543C] max-w-md mx-auto leading-relaxed">
                  Our team will review your query and respond within 24–48 working hours.
                </p>
                <button onClick={handleReset}
                  className="mt-2 px-6 py-2.5 rounded-full bg-[#0E3320] text-white text-sm font-semibold hover:bg-[#071F13] transition-colors cursor-pointer">
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0E3320] uppercase tracking-wider">Full Name / पूरा नाम <span className="text-red-500">*</span></label>
                    <input type="text" required value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Ramesh Chandra"
                      className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-sm text-[#0E3320]" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-[#0E3320] uppercase tracking-wider">Phone / WhatsApp <span className="text-red-500">*</span></label>
                    <input type="tel" required value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-sm text-[#0E3320]" />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0E3320] uppercase tracking-wider">Email Address / ईमेल <span className="text-red-500">*</span></label>
                  <input type="email" required value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-sm text-[#0E3320]" />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0E3320] uppercase tracking-wider">Query Type / विषय <span className="text-red-500">*</span></label>
                  <select required value={formData.queryType}
                    onChange={e => setFormData({...formData, queryType: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-sm text-[#0E3320] cursor-pointer">
                    <option value="">— Select Query Type —</option>
                    {QUERY_TYPES.map(q => <option key={q} value={q}>{q}</option>)}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-[#0E3320] uppercase tracking-wider">Message / संदेश <span className="text-red-500">*</span></label>
                  <textarea rows={5} required value={formData.message}
                    onChange={e => setFormData({...formData, message: e.target.value})}
                    placeholder="Please describe your query in detail — include Roll Number, Enrollment Number, or Course Name if applicable..."
                    className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-sm text-[#0E3320] resize-none" />
                </div>

                {submitError && (
                  <div className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{submitError}</span>
                  </div>
                )}

                <button type="submit" disabled={isLoading}
                  className="w-full py-4 rounded-xl bg-[#0E3320] hover:bg-[#071F13] text-white text-sm font-extrabold shadow-md flex items-center justify-center gap-2 transition-all disabled:opacity-60 cursor-pointer">
                  {isLoading ? "Sending…" : <><Send className="w-4 h-4" /> Send Inquiry / संदेश भेजें</>}
                </button>
              </form>
            )}
          </div>

          {/* ── Right Column ── */}
          <div className="lg:col-span-5 space-y-5">

            {/* Quick Links */}
            <div className="bg-white rounded-2xl border border-[#E4D9C7] shadow-sm p-6 space-y-4">
              <div>
                <p className="text-xs font-bold text-[#8C671D] uppercase tracking-wider">Quick Access</p>
                <h3 className="text-lg font-bold text-[#0E3320] mt-0.5">What are you looking for?</h3>
              </div>
              <div className="space-y-2">
                {quickLinks.map((l) => {
                  const Icon = l.icon;
                  return (
                    <Link key={l.label} href={l.href}
                      className="flex items-center gap-3 p-3 rounded-xl border border-[#EDE7DE] hover:border-[#C59B3F] hover:bg-[#FDF9F2] transition-all group">
                      <div className="w-9 h-9 rounded-lg bg-[#EAE2D3] flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-[#0E3320]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#0E3320] group-hover:text-[#8C671D] transition-colors">{l.label}</p>
                        <p className="text-[11px] text-[#52725D]">{l.sub}</p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Board Info Card */}
            <div className="bg-[#0E3320] text-white rounded-2xl p-6 space-y-4">
              <div>
                <p className="text-[#C59B3F] text-xs font-bold uppercase tracking-wider mb-1">About the Board</p>
                <h4 className="text-base font-devanagari font-bold">भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्</h4>
              </div>
              <ul className="space-y-2.5 text-xs text-[#CBD8CB]">
                <li className="flex items-start gap-2">
                  <span className="text-[#C59B3F] mt-0.5">🌿</span>
                  <span>Registered examination board conducting annual & semester examinations for Ayurveda, Yoga, Naturopathy and allied health programs.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C59B3F] mt-0.5">🌿</span>
                  <span>Affiliated institutes across India may apply for course approval and examination registration through the board.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#C59B3F] mt-0.5">🌿</span>
                  <span>Certificates and marksheets issued by the board are verified and digitally accessible through the student portal.</span>
                </li>
              </ul>
              <div className="pt-3 border-t border-white/10 text-[11px] text-[#A8C5B0]">
                For affiliation or institute registration, please use the inquiry form with query type "College Affiliation".
              </div>
            </div>

          </div>
        </div>
      </section>

      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
      <Footer />
    </main>
  );
}
