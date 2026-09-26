"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  Flower2, 
  Plane, 
  Train, 
  Car, 
  Calendar,
  Sparkles,
  ArrowRight
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";
import VideoModal from "@/components/ui/VideoModal";

export default function ContactPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    program: "Ayurveda Consultation",
    mode: "In-Person (Mumbai)",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => {
      // Keep confirmation banner visible
    }, 500);
  };

  const contactCards = [
    {
      icon: MapPin,
      titleHi: "हमारा केंद्र / स्थान",
      titleEn: "Center Location (Mumbai)",
      desc: "Bhartiya Ayurveda Center, Mumbai, Maharashtra - 400050, India",
      sub: "Central Ayurvedic consultation center & holistic wellness clinic in Mumbai.",
    },
    {
      icon: Phone,
      titleHi: "फोन एवं व्हाट्सएप",
      titleEn: "Phone & WhatsApp",
      desc: "+91 98765 43210 / +91 91234 56789",
      sub: "Mon to Sat: 8:00 AM – 7:00 PM IST (Global video calls available)",
    },
    {
      icon: Mail,
      titleHi: "ईमेल संपर्क",
      titleEn: "Email Assistance",
      desc: "contact@bhartiyaayurveda.org",
      sub: "Our Ayurvedic physicians respond within 12–24 hours.",
    },
    {
      icon: Clock,
      titleHi: "परामर्श समय",
      titleEn: "Consultation Hours",
      desc: "Daily: 8:30 AM – 1:00 PM & 3:30 PM – 6:30 PM",
      sub: "Emergency holistic triage available for in-house retreat guests.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E3320] font-sans selection:bg-[#C59B3F] selection:text-white">
      {/* 1. Top Bar & Navbar */}
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* 2. Hero Section */}
      <section className="relative bg-[#071F13] text-white py-20 md:py-24 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/cta/cta-landscape.jpg"
            alt="Bhartiya Ayurveda Mumbai Wellness Center"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/65 to-[#071F13]/70"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-5">
          {/* Breadcrumb Row */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#C59B3F] font-semibold tracking-wider uppercase">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">Contact Us</span>
          </nav>

          {/* Vedic Tag Pill Row (Distinct separate line) */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-xs sm:text-sm font-semibold shadow-sm">
              <span>🌿</span>
              <span>सह नाववतु सह नौ भुनक्तु — साथ चलें, स्वस्थ रहें</span>
            </div>
          </div>

          {/* Main Title Row */}
          <div className="space-y-2 pt-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-devanagari font-bold text-white leading-tight">
              संपर्क करें
            </h1>
            <div className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#C59B3F] font-bold">
              Contact Bhartiya Ayurveda
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#CBD8CB] leading-relaxed pt-1">
            Whether you seek an in-person Panchakarma retreat, a virtual Nadi Pariksha consultation, or have queries about our programs, we are here for you.
          </p>
        </div>
      </section>

      {/* 3. Four Quick Contact Cards */}
      <section className="py-12 md:py-16 px-4 md:px-8 border-b border-[#EBE2D4]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map((c, idx) => {
            const Icon = c.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#E8DFCFA] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-[#EAE2D3] text-[#0E3320] flex items-center justify-center">
                    <Icon className="w-6 h-6 stroke-[1.75]" />
                  </div>
                  <div>
                    <h3 className="font-devanagari font-bold text-sm sm:text-base text-[#0E3320]">
                      {c.titleHi}
                    </h3>
                    <div className="font-sans font-bold text-xs text-[#8C671D] mt-0.5">
                      {c.titleEn}
                    </div>
                  </div>
                  <p className="font-sans font-bold text-sm sm:text-base text-[#0E3320] leading-snug">
                    {c.desc}
                  </p>
                </div>
                <p className="text-xs text-[#52725D] pt-3 border-t border-[#F2ECE1] mt-3 leading-relaxed">
                  {c.sub}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Main Contact Grid: Form (7 cols) + How to Reach & Ashram Details (5 cols) */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b border-[#EBE2D4]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Left Column: Inquiry Form */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-8 md:p-10 border border-[#E4D9C7] shadow-lg space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8C671D] uppercase tracking-wider">
                  <Flower2 className="w-4 h-4 text-[#2E7A4A]" />
                  <span>Send a Direct Inquiry</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-devanagari font-bold text-[#0E3320] mt-1">
                  हमसे सीधे संपर्क करें
                </h2>
                <p className="text-xs sm:text-sm text-[#52725D] mt-1">
                  Fill out the form below. Our dedicated wellness coordinators will get in touch with you promptly.
                </p>
              </div>

              {isSubmitted ? (
                <div className="p-8 rounded-2xl bg-[#EAF5ED] border border-[#A5D4B2] text-center space-y-3">
                  <CheckCircle2 className="w-14 h-14 text-[#2A7A50] mx-auto stroke-[2]" />
                  <h3 className="text-lg sm:text-xl font-devanagari font-bold text-[#0E3320]">
                    धन्यवाद! आपका संदेश प्राप्त हो गया है।
                  </h3>
                  <p className="text-sm sm:text-base text-[#2E543C] max-w-md mx-auto leading-relaxed">
                    Our chief Vaidya will review your details and reach out within 12–24 hours via Phone/WhatsApp.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        program: "Ayurveda Consultation",
                        mode: "In-Person (Mumbai)",
                        message: "",
                      });
                    }}
                    className="mt-2 px-6 py-2.5 rounded-full bg-[#0E3320] text-white text-xs sm:text-sm font-semibold hover:bg-[#071F13] transition-colors"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Full Name */}
                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm font-bold text-[#0E3320]">
                        Full Name (पूरा नाम) *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Ramesh Chandra"
                        className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0E3320] text-sm text-[#0E3320]"
                      />
                    </div>

                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm font-bold text-[#0E3320]">
                        Email Address (ईमेल) *
                      </label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="e.g. ramesh@example.com"
                        className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0E3320] text-sm text-[#0E3320]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Phone Number */}
                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm font-bold text-[#0E3320]">
                        Phone / WhatsApp (फोन नंबर) *
                      </label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0E3320] text-sm text-[#0E3320]"
                      />
                    </div>

                    {/* Program Interest */}
                    <div className="space-y-1.5">
                      <label className="block text-xs sm:text-sm font-bold text-[#0E3320]">
                        Program / Service (इच्छित कार्यक्रम)
                      </label>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0E3320] text-sm text-[#0E3320]"
                      >
                        <option value="Ayurveda Consultation">Ayurveda Consultation (नाड़ी परीक्षण)</option>
                        <option value="7 Days Retreat">7 Days Ayurveda Retreat</option>
                        <option value="14 Days Yoga">14 Days Yoga & Meditation</option>
                        <option value="21 Days Naturopathy">21 Days Naturopathy Detox</option>
                        <option value="30 Days Holistic">30 Days Holistic Wellness</option>
                        <option value="General Question">General Inquiry / Ashram Visit</option>
                      </select>
                    </div>
                  </div>

                  {/* Mode of Consultation */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[#0E3320]">
                      Preferred Consultation Mode (परामर्श का माध्यम)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
                      {["In-Person (Mumbai Center)", "Online Video Call (Globally)"].map((m) => (
                        <button
                          type="button"
                          key={m}
                          onClick={() => setFormData({ ...formData, mode: m })}
                          className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold border transition-all text-center cursor-pointer ${
                            formData.mode === m
                              ? "bg-[#0E3320] text-white border-[#0E3320] shadow-sm"
                              : "bg-[#FAF8F5] text-[#0E3320] border-[#D5C7B7] hover:border-[#0E3320]"
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Health Concern / Message */}
                  <div className="space-y-1.5">
                    <label className="block text-xs sm:text-sm font-bold text-[#0E3320]">
                      Health Concern or Message (आपकी समस्या या संदेश) *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please share any specific symptoms, health history, or your preferred dates..."
                      className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0E3320] text-sm text-[#0E3320] resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-base font-bold shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Send Inquiry / संदेश भेजें</span>
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>

            {/* Right Column: How to Reach & Ashram Travel Details */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* How to Reach Card */}
              <div className="bg-[#FAF8F5] rounded-3xl p-7 border border-[#E4D9C7] shadow-sm space-y-5">
                <div>
                  <h3 className="font-devanagari font-bold text-lg sm:text-xl text-[#0E3320]">
                    मुंबई केंद्र कैसे पहुँचें ?
                  </h3>
                  <div className="font-sans font-bold text-sm text-[#8C671D] mt-0.5">
                    How to Reach Our Center
                  </div>
                </div>

                <div className="space-y-4">
                  {/* By Air */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAE2D3] text-[#0E3320] flex items-center justify-center shrink-0">
                      <Plane className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#0E3320]">By Air (हवाई मार्ग)</h4>
                      <p className="text-xs sm:text-sm text-[#466551] leading-relaxed">
                        Nearest Airport: <strong>Chhatrapati Shivaji Maharaj International Airport (BOM)</strong> — approx 12 km (25–35 minutes taxi drive).
                      </p>
                    </div>
                  </div>

                  {/* By Train */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAE2D3] text-[#0E3320] flex items-center justify-center shrink-0">
                      <Train className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#0E3320]">By Train (रेल मार्ग)</h4>
                      <p className="text-xs sm:text-sm text-[#466551] leading-relaxed">
                        Nearest Stations: <strong>Bandra Terminus</strong> — 5 km, or <strong>Mumbai Central (BCT)</strong> — 8 km.
                      </p>
                    </div>
                  </div>

                  {/* By Road */}
                  <div className="flex items-start gap-3.5">
                    <div className="w-10 h-10 rounded-xl bg-[#EAE2D3] text-[#0E3320] flex items-center justify-center shrink-0">
                      <Car className="w-5 h-5 stroke-[1.75]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-sm sm:text-base text-[#0E3320]">By Road (सड़क मार्ग)</h4>
                      <p className="text-xs sm:text-sm text-[#466551] leading-relaxed">
                        Well connected via Western Express Highway and Linking Road. Ample parking and cab access available.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8DFCFA]">
                  <p className="text-xs text-[#52725D] leading-relaxed">
                    * Local pickup and drop assistance can be arranged upon prior consultation booking confirmation.
                  </p>
                </div>
              </div>

              {/* Serene Center Highlights Card */}
              <div className="bg-[#0E3320] text-white rounded-3xl p-7 shadow-lg relative overflow-hidden space-y-4">
                <div className="space-y-1">
                  <span className="text-xs text-[#C59B3F] font-bold uppercase tracking-wider">Atmosphere & Code</span>
                  <h4 className="text-lg sm:text-xl font-devanagari font-bold text-white">
                    केंद्र के नियम एवं सात्विक वातावरण
                  </h4>
                </div>

                <ul className="space-y-2.5 text-xs sm:text-sm text-[#CBD8CB]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#C59B3F]">🌿</span>
                    <span>100% Pure sattvic vegetarian cuisine (No onion, garlic, or stimulants)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#C59B3F]">🌿</span>
                    <span>Daily morning Pranayama & guided evening meditation sessions</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#C59B3F]">🌿</span>
                    <span>Digital detox hours to cultivate profound mental quietude</span>
                  </li>
                </ul>

                <button
                  onClick={() => setIsConsultationOpen(true)}
                  className="w-full mt-2 py-3 rounded-full bg-[#FAF8F5] hover:bg-white text-[#0E3320] text-sm font-bold shadow transition-all flex items-center justify-center gap-2"
                >
                  <span>Book In-Person Consultation</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 5. Interactive Google Map Section (Mumbai Location) */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b border-[#EBE2D4] bg-[#F5F0E8]">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8C671D] uppercase tracking-wider">
                <MapPin className="w-4 h-4 text-[#2E7A4A]" />
                <span>Google Maps Location</span>
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-devanagari font-bold text-[#0E3320] mt-1">
                मानचित्र पर हमारा केंद्र देखें
              </h2>
              <div className="text-base sm:text-lg font-sans font-bold text-[#15482D] mt-0.5">
                Find Bhartiya Ayurveda Center, Mumbai
              </div>
            </div>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Mumbai,+Maharashtra,+India"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-sm font-semibold shadow flex items-center gap-2 transition-all self-start sm:self-auto group"
            >
              <span>Open in Google Maps</span>
            </a>
          </div>

          {/* Map Card Container */}
          <div className="relative rounded-3xl overflow-hidden shadow-xl border-2 border-[#D9CABE] bg-white">
            {/* Map Frame */}
            <iframe
              title="Bhartiya Ayurveda Mumbai Location"
              src="https://maps.google.com/maps?q=Mumbai,%20Maharashtra,%20India&t=&z=13&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="480"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-[400px] sm:h-[480px] lg:h-[520px]"
            ></iframe>

            {/* Floating Info Overlay on Bottom Left */}
            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-6 max-w-sm bg-white/95 backdrop-blur-md p-5 rounded-2xl shadow-xl border border-[#D5C7B7] text-[#0E3320] space-y-2 pointer-events-auto">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7A4A] animate-pulse"></span>
                <span className="text-xs font-bold text-[#2E7A4A] uppercase tracking-wide">Open for Consultations</span>
              </div>
              <h4 className="font-sans font-bold text-base sm:text-lg text-[#0E3320] leading-tight">
                Bhartiya Ayurveda Center
              </h4>
              <p className="text-xs sm:text-sm text-[#466551] leading-relaxed">
                Mumbai, Maharashtra - 400050, India
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-[#8C671D] font-bold border-t border-[#EAE2D3]">
                <span>Mon – Sat: 8:00 AM – 7:00 PM</span>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Mumbai,+Maharashtra,+India"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B96647] hover:underline"
                >
                  Get Directions
                </a>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. Modals & Footer */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
      <Footer />
    </main>
  );
}
