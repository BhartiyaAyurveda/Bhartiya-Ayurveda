"use client";

import { Activity, Wind, Eye, Flame, ArrowRight, Sparkles } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function YogaSection({ onOpenConsultation }) {
  const yogaCards = [
    {
      icon: Activity,
      hi: "आसन",
      en: "Asana",
      sub: "Strength",
      badgeBg: "bg-[#EAF3EC] text-[#1E5C3B] border-[#CFE5D3]",
      accentHover: "group-hover:bg-[#1E5C3B] group-hover:text-white group-hover:border-[#1E5C3B]",
      dotColor: "bg-[#1E5C3B]",
    },
    {
      icon: Wind,
      hi: "प्राणायाम",
      en: "Pranayama",
      sub: "Breath",
      badgeBg: "bg-[#E8F4F0] text-[#1A674D] border-[#CCE5D9]",
      accentHover: "group-hover:bg-[#1A674D] group-hover:text-white group-hover:border-[#1A674D]",
      dotColor: "bg-[#1A674D]",
    },
    {
      icon: Eye,
      hi: "ध्यान",
      en: "Meditation",
      sub: "Awareness",
      badgeBg: "bg-[#F3EFF8] text-[#5C3E8A] border-[#DFD3F2]",
      accentHover: "group-hover:bg-[#5C3E8A] group-hover:text-white group-hover:border-[#5C3E8A]",
      dotColor: "bg-[#5C3E8A]",
    },
    {
      icon: Flame,
      hi: "सूर्य नमस्कार",
      en: "Surya Namaskar",
      sub: "Energy",
      badgeBg: "bg-[#FEF4E5] text-[#B87D24] border-[#F4E1C2]",
      accentHover: "group-hover:bg-[#B87D24] group-hover:text-white group-hover:border-[#B87D24]",
      dotColor: "bg-[#B87D24]",
    },
  ];

  return (
    <section
      id="yoga"
      className="relative bg-[#0E3320] text-white py-10 xs:py-12 sm:py-14 lg:py-16 px-3.5 xs:px-4 sm:px-6 md:px-8 overflow-hidden font-sans border-b border-[#1A452D]"
    >
      {/* Background Panorama Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/yoga/yoga-banner.png"
          alt="Yoga banner in nature"
          className="w-full h-full object-cover object-center opacity-18 transition-transform duration-1000 select-none pointer-events-none"
        />
        {/* Seamless desktop horizontal gradient (No harsh cutoffs or gaps) */}
        <div className="hidden lg:block absolute inset-0 bg-gradient-to-r from-[#071F13]/92 via-[#0E3320]/75 to-[#0E3320]/20 pointer-events-none" />
        {/* Mobile vertical gradient for high contrast */}
        <div className="lg:hidden absolute inset-0 bg-gradient-to-b from-[#071F13]/95 via-[#0A2617]/88 to-[#071F13]/95 pointer-events-none" />
        {/* Blackish overlay */}
        <div className="absolute inset-0 bg-black/65 pointer-events-none" />
      </div>

      {/* Subtle Ambient Glows */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-[#C59B3F]/12 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-[#2E7A4A]/20 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-6 xl:gap-8 items-center">

          {/* 1. Left Text Block (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-3 xs:space-y-3.5">
            <Reveal direction="up" delay={150}>
              {/* Category Pill Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-[#EADCB9] text-xs xs:text-[13px] font-bold shadow-xs">
                <Sparkles className="w-3.5 h-3.5 text-[#E4BF64] animate-spin" style={{ animationDuration: "14s" }} />
                <span>Ashtanga & Hatha Yoga • Rishikesh Tradition</span>
              </div>

              {/* Headings */}
              <div className="mt-2.5">
                <h2 className="text-[26px] xs:text-[30px] sm:text-3xl lg:text-[34px] xl:text-[38px] font-devanagari font-black text-white leading-[1.16] tracking-tight">
                  योग — एक बेहतर आप की ओर
                </h2>
                <div className="text-[18px] xs:text-[20px] sm:text-xl lg:text-[22px] xl:text-[24px] font-sans font-extrabold text-[#E4BF64] tracking-tight mt-1">
                  Yoga – A Path to a Better You
                </div>
              </div>

              {/* Vedic Golden Divider */}
              <div className="flex items-center gap-2 my-2.5">
                <span className="w-12 h-[2.5px] bg-[#E4BF64] rounded-full" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7A4A] border border-[#E4BF64]/60" />
                <span className="w-5 h-[1.5px] bg-[#E4BF64]/40 rounded-full" />
              </div>

              {/* Descriptions */}
              <p className="font-devanagari text-[14.5px] xs:text-[15.5px] sm:text-base text-[#E0ECE2] leading-relaxed font-medium">
                योग केवल व्यायाम नहीं, बल्कि एक जीवन शैली है। यह शरीर को मजबूत, मन को शांत और आत्मा को जागरूक बनाता है।
              </p>

              <p className="font-sans text-[13px] xs:text-[14px] sm:text-[15px] text-[#B8D5BF] leading-relaxed font-medium">
                Yoga is not just exercise, it's a way of life. It builds a stronger body, a calmer mind and a more awakened self.
              </p>

              {/* CTA Button */}
              <div className="pt-2">
                <button
                  onClick={onOpenConsultation}
                  className="btn-shimmer w-full xs:w-auto px-7 xs:px-8 py-3.5 xs:py-4 rounded-full bg-[#FAF8F5] hover:bg-white text-[#0E3320] text-[14.5px] xs:text-base font-extrabold shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2.5 transition-all group font-sans cursor-pointer"
                >
                  <span>Explore Yoga</span>
                  <ArrowRight className="w-4.5 h-4.5 text-[#B87D24] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>
          </div>

          {/* 2. Center 4 Cards: Mobile 2x2 grid, Desktop 4 in a single sleek row */}
          <div className="lg:col-span-5">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 xs:gap-3 lg:gap-2.5 xl:gap-3">
              {yogaCards.map((card, idx) => {
                const Icon = card.icon;
                return (
                  <Reveal key={idx} direction="up" delay={150 + idx * 70}>
                    <div
                      className="group relative flex flex-col items-center justify-center text-center p-3 xs:p-3.5 sm:p-4 lg:p-3 xl:p-4 rounded-2xl bg-[#FAF8F5]/95 hover:bg-white active:bg-white backdrop-blur-md text-[#0E3320] shadow-lg border border-[#E8DDCD] hover:border-[#D0E2D3] active:scale-[0.96] transition-all duration-300 h-full"
                    >
                      {/* Top subtle indicator dot */}
                      <span
                        className={`absolute top-2 right-2 w-1.5 h-1.5 rounded-full ${card.dotColor} opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all`}
                      />

                      {/* Squircle Icon Badge */}
                      <div
                        className={`w-10 h-10 xs:w-11 xs:h-11 sm:w-12 sm:h-12 lg:w-10 lg:h-10 xl:w-11 xl:h-11 rounded-2xl ${card.badgeBg} ${card.accentHover} border flex items-center justify-center mb-1.5 xs:mb-2 shadow-2xs transition-all duration-300 group-hover:scale-108 group-hover:shadow-sm`}
                      >
                        <Icon className="w-4.5 h-4.5 xs:w-5 xs:h-5 sm:w-5.5 sm:h-5.5 lg:w-4.5 lg:h-4.5 xl:w-5 xl:h-5 stroke-[1.9] transition-transform duration-300 group-hover:rotate-6" />
                      </div>

                      {/* Hindi Name */}
                      <div className="font-devanagari font-bold text-[13.5px] xs:text-[14.5px] sm:text-base lg:text-[13.5px] xl:text-[14.5px] text-[#0E3320] group-hover:text-[#1E603D] transition-colors leading-tight">
                        {card.hi}
                      </div>

                      {/* English Name */}
                      <div className="font-sans font-extrabold text-[12px] xs:text-[13px] sm:text-sm lg:text-[11.5px] xl:text-xs text-[#143E26] mt-0.5 tracking-tight">
                        {card.en}
                      </div>

                      {/* Subtitle Pill */}
                      <div className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[#EAF2EC] text-[9.5px] xs:text-[10.5px] lg:text-[9px] xl:text-[10px] text-[#3D694B] font-semibold transition-colors whitespace-nowrap">
                        {card.sub}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>

            {/* Mobile-only Trinity Mantra Ribbon */}
            <div className="lg:hidden mt-3 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 p-3 text-center">
              <div className="flex items-center justify-around text-[12px] xs:text-[13px] font-semibold italic text-white/90">
                <span className="hover:text-[#E4BF64] transition-colors">🌱 Stronger Body</span>
                <span className="text-[#E4BF64]">•</span>
                <span className="text-[#EADBB8] hover:text-white transition-colors">🧘 Calmer Mind</span>
                <span className="text-[#E4BF64]">•</span>
                <span className="hover:text-[#E4BF64] transition-colors">✨ Happier You</span>
              </div>
            </div>
          </div>

          {/* 3. Desktop-only Right Slogan Cascade (2 cols on lg) */}
          <div className="hidden lg:block lg:col-span-2 text-right select-none space-y-2 font-sans">
            <Reveal direction="left" delay={300}>
              <div className="text-xl xl:text-[26px] font-medium italic text-white drop-shadow leading-snug hover:scale-105 transition-transform cursor-default">
                Stronger Body
              </div>
              <div className="text-xl xl:text-[26px] font-medium italic text-[#E4BF64] drop-shadow leading-snug hover:scale-105 transition-transform cursor-default">
                Calmer Mind
              </div>
              <div className="text-xl xl:text-[26px] font-medium italic text-white drop-shadow leading-snug hover:scale-105 transition-transform cursor-default">
                Happier You
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
