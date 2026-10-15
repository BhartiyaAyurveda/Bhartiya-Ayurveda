"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Flower2, ShieldCheck, Heart, Sun, Leaf, Award, BookOpen, MapPin, Clock, Compass, CheckCircle2 } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";
import { DEFAULT_ABOUT } from "@/lib/about-defaults";

const ICON_MAP = { ShieldCheck, BookOpen, Compass, Heart, Leaf, Sun, Award, Flower2 };

export default function AboutPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [c, setC] = useState(DEFAULT_ABOUT);

  useEffect(() => {
    fetch("/api/public/about-content")
      .then(r => r.json())
      .then(d => { if (d.ok) setC(d.content); })
      .catch(() => {});
  }, []);

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E3320] font-sans selection:bg-[#C59B3F] selection:text-white">
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* 1. Hero */}
      <section className="relative bg-[#071F13] text-white py-20 md:py-24 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/hero/hero-meditation.jpg" alt="Bhartiya Ayurveda" className="w-full h-full object-cover opacity-60 object-center" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/65 to-[#071F13]/70" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-5">
          <nav className="flex items-center justify-center gap-2 text-sm text-[#C59B3F] font-semibold tracking-wider uppercase">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">About Us</span>
          </nav>
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-sm font-semibold shadow-sm">
              <span>🌿</span><span>{c.hero.tagline}</span>
            </div>
          </div>
          <div className="space-y-2 pt-1">
            <h1 className="text-3xl sm:text-4xl lg:text-4xl font-devanagari font-bold text-white leading-tight">{c.hero.titleHi}</h1>
            <div className="font-sans text-2xl sm:text-3xl lg:text-4xl text-[#C59B3F] font-bold">{c.hero.titleEn}</div>
          </div>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-[#CBD8CB] leading-relaxed pt-1">{c.hero.subtitle}</p>
        </div>
      </section>

      {/* 2. Story */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b border-[#EBE2D4]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 text-sm font-bold text-[#8C671D] uppercase tracking-wider">
                <Flower2 className="w-4 h-4 text-[#2E7A4A]" /><span>Our Heritage & Origin</span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-devanagari font-bold text-[#0E3320] leading-tight">{c.story.headingHi}</h2>
              <p className="font-devanagari text-base sm:text-lg text-[#2E543C] leading-relaxed">{c.story.paraHi}</p>
              <p className="font-sans text-base sm:text-lg text-[#466551] leading-relaxed">{c.story.paraEn}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                {c.story.bullets.map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5 text-base sm:text-lg text-[#0E3320] font-semibold">
                    <CheckCircle2 className="w-5 h-5 text-[#2E7A4A] shrink-0" /><span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="pt-3">
                <button onClick={() => setIsConsultationOpen(true)}
                  className="px-7 py-3.5 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-base sm:text-lg font-semibold shadow-md flex items-center gap-2.5 transition-all">
                  Schedule Consultation with Our Vaidyas
                </button>
              </div>
            </div>
            <div className="lg:col-span-5">
              <div className="relative">
                <div className="bg-[#F5EFE3] rounded-3xl p-6 sm:p-8 border border-[#E5DAC9] shadow-lg relative overflow-hidden space-y-6">
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-sm border border-[#E0D3BE] bg-[#EAE2D3]">
                    <img src="/images/ayurveda/herbs-mortar.jpg" alt="Ayurvedic herbs" className="w-full h-full object-cover" />
                  </div>
                  <div className="space-y-2 border-t border-[#E5DAC9] pt-4">
                    <blockquote className="font-devanagari font-bold text-lg sm:text-xl text-[#0E3320] leading-snug">"{c.story.quote}"</blockquote>
                    <p className="font-sans text-sm sm:text-base text-[#8C671D] font-semibold">— {c.story.quoteEn}</p>
                  </div>
                </div>
                <div className="absolute -bottom-5 right-2 sm:-bottom-6 sm:right-6 bg-[#0E3320] text-white px-4 sm:px-5 py-2.5 sm:py-3.5 rounded-2xl shadow-xl border border-[#C59B3F]/40 flex items-center gap-2.5 sm:gap-3">
                  <Award className="w-6 h-6 sm:w-8 sm:h-8 text-[#C59B3F] shrink-0" />
                  <div>
                    <div className="text-xl sm:text-3xl font-extrabold text-white leading-none">{c.story.yearsLabel}</div>
                    <div className="text-[11px] sm:text-sm text-[#CBD8CB] font-medium mt-0.5">{c.story.yearsSubLabel}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Objectives */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-[#F5F0E8] border-b border-[#E6DDCE]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-devanagari font-bold text-[#0E3320]">न्यास के उद्देश्य</h2>
            <div className="text-xl sm:text-2xl font-sans font-bold text-[#15482D]">Our Trust's Objectives</div>
            <p className="text-base sm:text-lg text-[#466551]">As registered in our founding Trust Deed, guiding every institute, retreat and outreach we build.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {c.objectives.map((item, i) => (
              <div key={i} className="bg-white rounded-3xl p-6 border border-[#E8DFCFA] shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#C59B3F]/50 transition-all duration-300 flex flex-col gap-3">
                <span className="w-10 h-10 rounded-full bg-[#EAE2D3] text-[#0E3320] text-lg font-bold flex items-center justify-center shrink-0">{i + 1}</span>
                <p className="font-devanagari text-lg sm:text-xl text-[#0E3320] font-semibold leading-relaxed">{item.hi}</p>
                <p className="text-base sm:text-lg text-[#52725D] leading-relaxed">{item.en}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Milestones */}
      <section className="relative bg-[#0A2315] py-12 sm:py-16 px-4 md:px-8 border-b border-[#1A452D] overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 text-center relative z-10">
          {c.milestones.map((m, idx) => (
            <div key={idx} className="p-4 sm:p-6 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 hover:border-[#C59B3F]/50 shadow-sm transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-black text-white font-sans">{m.num}</div>
              <div className="w-8 h-0.5 bg-[#C59B3F] mx-auto my-2 rounded-full" />
              <div className="font-devanagari font-bold text-sm sm:text-lg text-[#E4BF64] mt-1">{m.labelHi}</div>
              <div className="text-[11px] sm:text-base text-[#B3CEBA] font-semibold mt-0.5">{m.labelEn}</div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Vision & Mission */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b border-[#EBE2D4]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-devanagari font-bold text-[#0E3320]">दृष्टि एवं उद्देश्य</h2>
            <div className="text-xl sm:text-2xl font-sans font-bold text-[#15482D]">Our Vision & Mission</div>
            <p className="text-base sm:text-lg text-[#466551]">Guided by the timeless ethics of the Vedas, committed to global well-being.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#FAF8F5] rounded-3xl p-8 border-2 border-[#D9CABE] shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#EAE2D3] flex items-center justify-center shadow-inner"><Sun className="w-7 h-7 stroke-[1.75] text-[#C59B3F]" /></div>
                <div>
                  <span className="text-sm font-bold text-[#8C671D] uppercase tracking-wider">Vision</span>
                  <h3 className="text-xl sm:text-2xl font-devanagari font-bold text-[#0E3320] mt-1">हमारी दृष्टि (Our Vision)</h3>
                </div>
                <p className="font-devanagari text-base sm:text-lg text-[#2E543C] leading-relaxed">{c.vision.textHi}</p>
                <p className="font-sans text-base sm:text-lg text-[#466551] leading-relaxed">{c.vision.textEn}</p>
              </div>
            </div>
            <div className="bg-[#0E3320] text-white rounded-3xl p-8 border-2 border-[#16482D] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <div className="space-y-4">
                <div className="w-14 h-14 rounded-2xl bg-[#16482D] text-[#C59B3F] flex items-center justify-center shadow-inner"><Leaf className="w-7 h-7 stroke-[1.75]" /></div>
                <div>
                  <span className="text-sm font-bold text-[#C59B3F] uppercase tracking-wider">Mission</span>
                  <h3 className="text-xl sm:text-2xl font-devanagari font-bold text-white mt-1">हमारा उद्देश्य (Our Mission)</h3>
                </div>
                <p className="font-devanagari text-base sm:text-lg text-[#D4E2D4] leading-relaxed">{c.mission.textHi}</p>
                <p className="font-sans text-base sm:text-lg text-[#CBD8CB] leading-relaxed">{c.mission.textEn}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Three Pillars (static) */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-[#F5F0E8] border-b border-[#E6DDCE]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-devanagari font-bold text-[#0E3320]">हमारे तीन पावन आधार</h2>
            <div className="text-xl sm:text-2xl font-sans font-bold text-[#15482D]">The Three Pillars of Our Healing Philosophy</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { num: "01", img: "/images/ayurveda/herbs-mortar.jpg", alt: "Ayurveda Herbs", hi: "आयुर्वेद (Ayurveda)", desc: "The 5,000-year-old medical science that diagnoses imbalances in Vata, Pitta, and Kapha, prescribing tailor-made herbs, detox therapies, and sattvic dietetics.", href: "/#ayurveda" },
              { num: "02", img: "/images/yoga/yoga-banner.png", alt: "Yoga in Rishikesh", hi: "शास्त्रीय योग (Classical Yoga)", desc: "Beyond physical postures, our Yogic practices incorporate conscious Asana alignment, Pranayama life-force regulation, and Dhyana for profound mental stillness.", href: "/#yoga" },
              { num: "03", img: "/images/naturopathy/air-waterfall.jpg", alt: "Naturopathy waterfall", hi: "प्राकृतिक चिकित्सा (Naturopathy)", desc: "Harnessing the innate self-healing powers of the Five Great Elements: Earth, Water, Sun, Air, and Ether through therapeutic fasting.", href: "/#naturopathy" },
            ].map((pillar) => (
              <div key={pillar.num} className="bg-white rounded-3xl overflow-hidden border border-[#E0D5C3] shadow-sm hover:shadow-2xl hover:-translate-y-1.5 hover:border-[#C59B3F]/60 transition-all duration-300 flex flex-col group">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-[#EAE2D3]">
                    <img src={pillar.img} alt={pillar.alt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                    <div className="absolute top-4 left-4 text-4xl sm:text-6xl font-black text-white/90 drop-shadow-lg font-sans">{pillar.num}</div>
                  </div>
                  <div className="p-6 space-y-2.5">
                    <h3 className="text-xl sm:text-2xl font-devanagari font-bold text-[#0E3320] group-hover:text-[#1E603D] transition-colors">{pillar.hi}</h3>
                    <p className="text-base sm:text-lg text-[#466551] leading-relaxed font-sans">{pillar.desc}</p>
                  </div>
                </div>
                <div className="p-6 pt-0">
                  <Link href={pillar.href} className="text-base font-bold text-[#B96647] hover:underline flex items-center gap-1 group/link">
                    <span>Learn more</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Core Values */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b border-[#EBE2D4]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-devanagari font-bold text-[#0E3320]">हमारे मूल सिद्धांत</h2>
            <div className="text-xl sm:text-2xl font-sans font-bold text-[#15482D]">Our Guiding Values & Principles</div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.values.map((val, idx) => {
              const Icon = ICON_MAP[val.icon] || ShieldCheck;
              const colors = ["bg-[#EAF3EC] text-[#1E5C3B]", "bg-[#FEF4E5] text-[#B87D24]", "bg-[#F3EFF8] text-[#5C3E8A]", "bg-[#FCE9E6] text-[#B34D3A]"];
              return (
                <div key={idx} className="bg-white rounded-3xl p-6 border border-[#E8DFCFA] shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#C59B3F]/50 transition-all duration-300 flex flex-col">
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${colors[idx % 4]}`}><Icon className="w-6 h-6 stroke-[1.75]" /></div>
                    <div>
                      <h4 className="text-lg sm:text-xl font-devanagari font-bold text-[#0E3320]">{val.hi}</h4>
                      <div className="text-base font-sans font-bold text-[#8C671D]">{val.en}</div>
                    </div>
                    <p className="text-sm sm:text-base text-[#466551] leading-relaxed">{val.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 8. Acharyas */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-[#FAF8F5] border-b border-[#EBE2D4]">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-devanagari font-bold text-[#0E3320]">हमारे पूज्य आचार्य एवं वैद्य</h2>
              <div className="text-xl sm:text-2xl font-sans font-bold text-[#15482D] mt-1">Meet Our Experienced Teachers & Physicians</div>
            </div>
            <button onClick={() => setIsConsultationOpen(true)}
              className="px-6 py-2.5 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-base font-semibold shadow-sm transition-colors self-start sm:self-auto">
              Book an Appointment
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {c.acharyas.map((a, idx) => (
              <div key={idx} className="group bg-white rounded-3xl p-5 border border-[#E8DFCFA] shadow-sm hover:shadow-xl hover:-translate-y-1.5 hover:border-[#C59B3F]/50 transition-all duration-300 flex flex-col">
                <div>
                  <div className="w-28 h-28 mx-auto rounded-full overflow-hidden border-2 border-[#D5C7B7] group-hover:border-[#C59B3F] mb-4 shadow-sm transition-colors duration-300">
                    <img src={a.img} alt={a.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  <div className="text-center space-y-1">
                    <h3 className="font-sans font-bold text-xl text-[#0E3320] group-hover:text-[#1E603D] transition-colors">{a.name}</h3>
                    <p className="text-sm text-[#8C671D] font-bold">{a.role}</p>
                    <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-[#FAF8F5] border border-[#E0D5C3] text-[11px] text-[#466551] font-semibold">{a.exp}</span>
                    <p className="text-sm sm:text-[13px] text-[#52725D] pt-3 leading-relaxed text-left">{a.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 9. CTA */}
      <section className="relative bg-[#071F13] text-white py-16 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img src="/images/cta/cta-landscape.jpg" alt="Himalayan Mountains" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071F13]/90 via-[#0E3320]/60 to-[#071F13]/40" />
        </div>
        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-devanagari font-bold text-white leading-tight">{c.cta.headingHi}</h2>
          <p className="text-lg sm:text-xl text-[#E4BF64] font-medium max-w-2xl mx-auto">{c.cta.subtitle}</p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button onClick={() => setIsConsultationOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#0E3320] text-base sm:text-lg font-bold shadow-lg flex items-center gap-2 transition-all">
              Book Your Consultation
            </button>
            <Link href="/contact" className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-base sm:text-lg font-semibold border border-white/40 backdrop-blur transition-all">
              Contact Our Ashram
            </Link>
          </div>
        </div>
      </section>

      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
      <Footer />
    </main>
  );
}
