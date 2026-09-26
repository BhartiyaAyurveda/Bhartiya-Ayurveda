"use client";

import {
  Flower2,
  ArrowRight,
  Play,
  Sprout,
  Leaf,
  Users,
  GraduationCap,
  Star,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function HeroSection({ onOpenConsultation, onOpenVideo }) {
  return (
    <section
      id="home"
      className="relative font-sans border-b border-[#EBE2D4] bg-[#FAF8F5] overflow-hidden"
    >
      {/* ======================================================== */}
      {/* 1. MOBILE HERO SECTION (100% Faithful to Provided Mockup) */}
      {/* ======================================================== */}
      <div className="lg:hidden relative w-full overflow-hidden bg-[#FAF8F5]">
        <div className="relative w-full aspect-[941/1672] min-h-[calc(100svh-64px)] max-h-[920px] flex flex-col justify-between overflow-hidden">
          {/* Full-bleed high-res background image */}
          <img
            src="/images/hero/hero-phone.png"
            alt="Ancient Ayurveda and Yoga Meditation by Himalayan Lake"
            className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none"
          />

          {/* Soft Top-Left Mist Overlay for crisp text legibility, blended smoothly with no hard edge */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(250,248,245,0.92)_0%,rgba(250,248,245,0.75)_22%,rgba(250,248,245,0.4)_38%,rgba(250,248,245,0)_58%)] pointer-events-none" />

          {/* Foreground content wrapper */}
          <div className="relative z-10 flex flex-col justify-between h-full pt-4 xs:pt-5 pb-3 xs:pb-4 px-4 xs:px-5">
            {/* Top Text & CTAs Block */}
            <div>
              {/* Green Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF2EB]/95 backdrop-blur-md border border-[#CFE0D2] text-[#1B432E] text-[11px] font-semibold shadow-2xs">
                <Sprout className="w-3.5 h-3.5 text-[#2E7A4A] stroke-[2.2]" />
                <span className="tracking-wide">Rooted in India, For a Better Tomorrow</span>
              </div>

              {/* Main Headline (Devanagari + English Subtitle + Descriptions) */}
              <div className="mt-3.5 space-y-2">
                <h1 className="text-[28px] xs:text-[32px] sm:text-4xl font-devanagari font-bold text-[#0E3824] leading-[1.18] tracking-tight">
                  प्रकृति से जुड़ें <br />
                  बेहतर जीवन जिएं
                </h1>

                <div className="text-[15px] xs:text-[17px] sm:text-xl font-sans font-bold text-[#143B27] leading-[1.28]">
                  Ancient Ayurveda. Authentic Yoga. <br className="hidden xs:inline" />
                  Natural Healing. A Healthier, Happier You.
                </div>

                <div className="space-y-1 pt-0.5">
                  <p className="text-[12.5px] xs:text-[13.5px] text-[#2F543E] font-devanagari font-medium leading-snug">
                    आयुर्वेद, योग और प्राकृतिक चिकित्सा के माध्यम से शरीर, मन और आत्मा में संतुलन पाएं।
                  </p>
                  <p className="text-[11.5px] xs:text-[12.5px] text-[#486C54] font-sans font-medium leading-snug">
                    Experience the timeless wisdom of India for modern living.
                  </p>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-3.5 mt-4 pt-0.5">
                {/* Explore Programs Pill Button */}
                <a
                  href="#programs"
                  className="btn-shimmer px-5 xs:px-6 py-3 rounded-full bg-[#103823] hover:bg-[#092215] text-white text-[12.5px] xs:text-[13px] font-semibold shadow-md shadow-[#103823]/25 flex items-center justify-center gap-2 active:scale-95 transition-all group font-sans whitespace-nowrap cursor-pointer"
                >
                  <span>Explore Programs</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#DEB655] group-hover:translate-x-0.5 transition-transform" />
                </a>

                {/* Watch Our Story Play Button */}
                <button
                  onClick={onOpenVideo}
                  className="flex items-center gap-2.5 cursor-pointer group active:scale-95 transition-transform shrink-0"
                  aria-label="Watch Our Story"
                >
                  <div className="w-10 h-10 rounded-full bg-white border border-[#16432B]/25 shadow-sm flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    <Play className="w-3.5 h-3.5 text-[#103823] fill-[#103823] ml-0.5" />
                  </div>
                  <div className="text-left font-sans">
                    <div className="text-[12px] xs:text-[12.5px] font-bold text-[#103823] leading-tight">
                      Watch
                    </div>
                    <div className="text-[12px] xs:text-[12.5px] font-bold text-[#103823] leading-tight">
                      Our Story
                    </div>
                  </div>
                </button>
              </div>
            </div>

            {/* Middle Calligraphic Script ("Heal Balance Transform") */}
            <div className="my-auto py-8 xs:py-10 pl-1 select-none">
              <div className="font-calligraphy italic font-bold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] text-[30px] xs:text-[34px] sm:text-[38px] leading-[1.08]">
                <div className="pl-4">Heal</div>
                <div className="pl-2">Balance</div>
                <div>Transform</div>
              </div>
            </div>

            {/* Bottom Floating Sage Stats Card */}
            <div className="rounded-2xl xs:rounded-3xl bg-[#EDF3EB]/95 backdrop-blur-md border border-[#D8E4D5] py-3.5 px-2 xs:px-3 shadow-sm">
              <div className="grid grid-cols-4 items-center font-sans">
                {/* 1. Healthy Lives */}
                <div className="text-center border-r border-[#D3DFD1] px-1">
                  <Leaf className="w-5 h-5 text-[#1B4B2E] mx-auto stroke-[1.8]" />
                  <div className="text-[15px] xs:text-[17px] font-extrabold text-[#0E3320] leading-none mt-1">
                    10K+
                  </div>
                  <div className="text-[9.5px] xs:text-[10.5px] text-[#476B53] font-medium leading-tight mt-0.5">
                    Healthy Lives
                  </div>
                </div>

                {/* 2. Programs */}
                <div className="text-center border-r border-[#D3DFD1] px-1">
                  <Users className="w-5 h-5 text-[#1B4B2E] mx-auto stroke-[1.8]" />
                  <div className="text-[15px] xs:text-[17px] font-extrabold text-[#0E3320] leading-none mt-1">
                    25+
                  </div>
                  <div className="text-[9.5px] xs:text-[10.5px] text-[#476B53] font-medium leading-tight mt-0.5">
                    Programs
                  </div>
                </div>

                {/* 3. Expert Teachers */}
                <div className="text-center border-r border-[#D3DFD1] px-1">
                  <GraduationCap className="w-5 h-5 text-[#1B4B2E] mx-auto stroke-[1.8]" />
                  <div className="text-[15px] xs:text-[17px] font-extrabold text-[#0E3320] leading-none mt-1">
                    100+
                  </div>
                  <div className="text-[9.5px] xs:text-[10.5px] text-[#476B53] font-medium leading-tight mt-0.5">
                    Expert Teachers
                  </div>
                </div>

                {/* 4. Community Rating */}
                <div className="text-center px-1">
                  <Star className="w-5 h-5 text-[#1B4B2E] mx-auto stroke-[1.8]" />
                  <div className="text-[15px] xs:text-[17px] font-extrabold text-[#0E3320] leading-none mt-1">
                    4.9/5
                  </div>
                  <div className="text-[9.5px] xs:text-[10.5px] text-[#476B53] font-medium leading-tight mt-0.5">
                    Community Rating
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. DESKTOP HERO SECTION (Wide 12-col Layout)             */}
      {/* ======================================================== */}
      <div className="hidden lg:flex min-h-[640px] lg:min-h-[720px] items-center relative overflow-hidden">
        {/* Full-Bleed Desktop Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero-meditation.jpg"
            alt="Ancient Ayurveda and Yoga Meditation by Himalayan Lake"
            className="w-full h-full object-cover object-[78%_center] transform scale-105 transition-transform duration-1000 ease-out"
          />
          {/* Soft Left Mist Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/85 md:via-[#FAF8F5]/60 to-transparent w-[58%]"></div>
          {/* Atmospheric tone */}
          <div className="absolute inset-0 bg-[#0E3320]/5 pointer-events-none"></div>
        </div>

        {/* Decorative Corner Leaf Accents (Desktop only) */}
        <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none z-10 opacity-70 animate-sway-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#1E5C3B] fill-current">
            <path
              d="M0,0 Q30,10 40,40 Q20,30 0,0 M10,0 Q40,20 50,60 Q30,40 10,0 M0,20 Q30,40 35,80 Q15,50 0,20"
              opacity="0.65"
            />
          </svg>
        </div>

        <div className="absolute bottom-0 left-0 w-44 h-44 pointer-events-none z-10 opacity-60 animate-float-gentle">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#15462D] fill-current">
            <path
              d="M0,100 Q20,70 50,60 Q30,85 0,100 M0,80 Q35,60 70,50 Q40,80 0,80"
              opacity="0.55"
            />
          </svg>
        </div>

        {/* Foreground Content Container */}
        <div className="max-w-7xl mx-auto px-8 py-12 xl:py-16 relative z-20 w-full">
          <div className="grid grid-cols-12 gap-8 items-center">
            {/* Left Content Area (6-7 cols) */}
            <div className="col-span-7 xl:col-span-6 space-y-6 max-w-xl">
              {/* Pill Tag */}
              <Reveal direction="down" delay={100}>
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-[#D8CABE] text-[#1B432E] text-xs sm:text-sm font-semibold shadow-sm font-sans hover:shadow-md transition-shadow">
                  <Flower2
                    className="w-4 h-4 text-[#2E7A4A] stroke-[2] animate-spin"
                    style={{ animationDuration: "12s" }}
                  />
                  <span className="tracking-wide">
                    Rooted in India, For a Better Tomorrow
                  </span>
                </div>
              </Reveal>

              {/* Main Headline */}
              <Reveal direction="up" delay={200}>
                <div className="space-y-3.5">
                  <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-devanagari font-bold text-[#0E3320] leading-[1.2] tracking-tight">
                    प्रकृति से जुड़ें <br />
                    बेहतर जीवन जिएं
                  </h1>

                  <div className="text-xl sm:text-2xl lg:text-[26px] font-sans font-bold text-[#143B27] leading-snug">
                    Ancient Ayurveda. Authentic Yoga. <br />
                    Natural Healing. A Healthier, Happier You.
                  </div>

                  <div className="text-sm sm:text-base text-[#33563F] font-devanagari leading-relaxed space-y-1.5 font-semibold">
                    <p>
                      आयुर्वेद, योग और प्राकृतिक चिकित्सा के माध्यम से शरीर, मन और आत्मा में संतुलन पाएं।
                    </p>
                    <p className="font-sans text-[#4D6E59] text-xs sm:text-sm font-semibold">
                      Experience the timeless wisdom of India for modern living.
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Desktop CTAs */}
              <Reveal direction="up" delay={350}>
                <div className="flex items-center gap-4 pt-1">
                  <button
                    onClick={onOpenConsultation}
                    className="btn-shimmer px-7 py-3.5 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-base font-semibold shadow-md hover:shadow-xl hover:shadow-[#0E3320]/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2.5 transition-all group font-sans whitespace-nowrap cursor-pointer"
                  >
                    <span>Book a Consultation</span>
                    <ArrowRight className="w-4 h-4 text-[#E4BF64] group-hover:translate-x-1 transition-transform" />
                  </button>

                  <button
                    onClick={onOpenVideo}
                    className="btn-shimmer px-7 py-3.5 rounded-full bg-white/95 hover:bg-[#FAF8F5] text-[#0E3320] text-base font-semibold border border-[#D5C7B7] shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-3 transition-all group font-sans cursor-pointer whitespace-nowrap"
                  >
                    <span>Watch Our Story</span>
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-5 h-5 rounded-full bg-[#0E3320]/20 animate-ping-soft"></span>
                      <div className="w-5 h-5 rounded-full border border-[#0E3320] flex items-center justify-center text-[10px] pl-0.5 group-hover:bg-[#0E3320] group-hover:text-white transition-colors relative z-10">
                        ▶
                      </div>
                    </div>
                  </button>
                </div>
              </Reveal>

              {/* Desktop Stats Bar */}
              <Reveal direction="up" delay={450}>
                <div className="pt-6 grid grid-cols-4 gap-5 max-w-xl font-sans">
                  <div className="border-r border-[#D9CDBF] pr-2 hover:-translate-y-1 transition-transform cursor-default">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0E3320]">10K+</div>
                    <div className="text-xs sm:text-sm text-[#52725D] font-medium leading-tight">
                      Healthy Lives
                    </div>
                  </div>

                  <div className="border-r border-[#D9CDBF] pr-2 hover:-translate-y-1 transition-transform cursor-default">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0E3320]">25+</div>
                    <div className="text-xs sm:text-sm text-[#52725D] font-medium leading-tight">
                      Programs
                    </div>
                  </div>

                  <div className="border-r border-[#D9CDBF] pr-2 hover:-translate-y-1 transition-transform cursor-default">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0E3320]">100+</div>
                    <div className="text-xs sm:text-sm text-[#52725D] font-medium leading-tight">
                      Expert Teachers
                    </div>
                  </div>

                  <div className="hover:-translate-y-1 transition-transform cursor-default">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0E3320]">4.9/5</div>
                    <div className="text-xs sm:text-sm text-[#52725D] font-medium leading-tight">
                      Community Rating
                    </div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right Side Elements (Callout & Video Card) */}
            <div className="col-span-5 xl:col-span-6 relative h-[480px] pointer-events-none">
              {/* Callout: HEAL BALANCE TRANSFORM */}
              <Reveal
                direction="left"
                delay={300}
                className="absolute top-8 right-0 lg:right-2 text-right select-none font-calligraphy"
              >
                <div>
                  <div className="text-5xl lg:text-[68px] font-bold tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] leading-[1.05]">
                    Heal
                  </div>
                  <div className="text-5xl lg:text-[68px] font-bold tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] leading-[1.05]">
                    Balance
                  </div>
                  <div className="text-5xl lg:text-[68px] font-bold tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] leading-[1.05]">
                    Transform
                  </div>
                </div>
              </Reveal>

              {/* Floating Frosted Video Card */}
              <div className="absolute bottom-12 right-6 lg:right-8 pointer-events-auto animate-float-slow">
                <div
                  className="bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-white/70 flex items-center gap-3.5 max-w-[260px] hover:scale-105 hover:shadow-2xl transition-all duration-300 font-sans cursor-pointer group"
                  onClick={onOpenVideo}
                >
                  <button
                    onClick={onOpenVideo}
                    className="w-10 h-10 rounded-full bg-[#0E3320] text-[#C59B3F] flex items-center justify-center shrink-0 group-hover:bg-[#071F13] group-hover:scale-110 transition-all shadow"
                    aria-label="Play video"
                  >
                    <Play className="w-4 h-4 fill-current ml-0.5" />
                  </button>
                  <div className="text-sm font-bold text-[#0E3320] leading-tight group-hover:text-[#1E603D] transition-colors">
                    A Healthier You, A Wilder World
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
