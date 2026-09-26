"use client";

import { Flower2, Sun, Leaf, HeartHandshake } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function PillarsSection() {
  const pillars = [
    {
      icon: Flower2,
      hi: "आयुर्वेद",
      en: "Ayurveda",
      sub: "Natural Healing",
      href: "#ayurveda",
      badgeBg: "bg-[#EAF4EC] text-[#1E5C3B] border-[#CFE5D3]",
      accentHover: "group-hover:bg-[#1E5C3B] group-hover:text-white group-hover:border-[#1E5C3B]",
      dotColor: "bg-[#1E5C3B]",
    },
    {
      icon: Sun,
      hi: "योग",
      en: "Yoga",
      sub: "Mind-Body Balance",
      href: "#yoga",
      badgeBg: "bg-[#FEF5E7] text-[#B87D24] border-[#F4E1C2]",
      accentHover: "group-hover:bg-[#B87D24] group-hover:text-white group-hover:border-[#B87D24]",
      dotColor: "bg-[#B87D24]",
    },
    {
      icon: Leaf,
      hi: "प्राकृतिक चिकित्सा",
      en: "Naturopathy",
      sub: "Heal with Nature",
      href: "#naturopathy",
      badgeBg: "bg-[#ECF6EE] text-[#23703E] border-[#D0E8D4]",
      accentHover: "group-hover:bg-[#23703E] group-hover:text-white group-hover:border-[#23703E]",
      dotColor: "bg-[#23703E]",
    },
    {
      icon: HeartHandshake,
      hi: "सहज जीवनशैली",
      en: "Natural Living",
      sub: "Live Sustainably",
      href: "#programs",
      badgeBg: "bg-[#E9F4EF] text-[#1A674D] border-[#CCE5D9]",
      accentHover: "group-hover:bg-[#1A674D] group-hover:text-white group-hover:border-[#1A674D]",
      dotColor: "bg-[#1A674D]",
    },
  ];

  return (
    <section className="bg-[#F5F0E8] py-7 sm:py-10 md:py-12 px-3 xs:px-4 sm:px-6 md:px-8 border-b border-[#E6DDCE] relative overflow-hidden font-sans">
      {/* Decorative leaf branch — left edge (desktop only) */}
      <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-24 h-24 pointer-events-none opacity-70 animate-sway-slow">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#2E7A4A] fill-current">
          <path
            d="M0,50 Q25,20 55,30 Q30,35 15,55 Q35,45 55,55 Q30,55 20,75 Q40,65 60,60 Q40,80 25,90"
            opacity="0.55"
          />
        </svg>
      </div>

      {/* Decorative leaf branch — right edge (desktop only) */}
      <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-28 h-28 pointer-events-none opacity-70 animate-float-gentle">
        <svg viewBox="0 0 100 100" className="w-full h-full text-[#1E5C3B] fill-current">
          <path
            d="M100,50 Q75,20 45,30 Q70,35 85,55 Q65,45 45,55 Q70,55 80,75 Q60,65 40,60 Q60,80 75,90"
            opacity="0.55"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto relative">
        <Reveal direction="up" delay={100}>
          {/* Main Card Container */}
          <div className="bg-[#FAF8F5]/95 backdrop-blur-md rounded-2xl xs:rounded-3xl border border-[#E4DAC9] shadow-[0_12px_36px_-6px_rgba(14,51,32,0.07)] p-2 xs:p-2.5 sm:p-4 md:p-5">
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-2 xs:gap-2.5 sm:gap-3.5">
              {pillars.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <a
                    key={idx}
                    href={item.href}
                    className="group relative flex flex-col items-center justify-center text-center p-3 xs:p-3.5 sm:p-5 rounded-xl xs:rounded-2xl bg-white/80 hover:bg-white active:bg-white border border-[#EAE1D2] hover:border-[#D0E2D3] shadow-2xs hover:shadow-md active:scale-[0.97] transition-all duration-300"
                  >
                    {/* Top ambient dot */}
                    <span
                      className={`absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full ${item.dotColor} opacity-40 group-hover:opacity-100 group-hover:scale-125 transition-all`}
                    />

                    {/* Icon Squircle Badge */}
                    <div
                      className={`w-11 h-11 xs:w-12 xs:h-12 sm:w-14 sm:h-14 rounded-2xl ${item.badgeBg} ${item.accentHover} border flex items-center justify-center mb-2 xs:mb-2.5 shadow-2xs transition-all duration-300 group-hover:scale-108 group-hover:shadow-sm`}
                    >
                      <Icon className="w-5 h-5 xs:w-5.5 xs:h-5.5 sm:w-6 sm:h-6 stroke-[1.9] transition-transform duration-300 group-hover:rotate-6" />
                    </div>

                    {/* Hindi Title */}
                    <div className="font-devanagari font-bold text-[14.5px] xs:text-[16px] sm:text-base md:text-lg text-[#0E3320] group-hover:text-[#1E603D] transition-colors leading-tight">
                      {item.hi}
                    </div>

                    {/* English Subtitle */}
                    <div className="font-sans font-extrabold text-[13px] xs:text-[14px] sm:text-sm md:text-base text-[#113822] mt-0.5 tracking-tight">
                      {item.en}
                    </div>

                    {/* Tagline Pill */}
                    <div className="inline-flex items-center gap-1 mt-1.5 px-2.5 py-0.5 rounded-full bg-[#F4EFE6]/80 group-hover:bg-[#EAF3EB] text-[10.5px] xs:text-[11.5px] sm:text-xs text-[#4E7158] font-semibold transition-colors whitespace-nowrap">
                      {item.sub}
                    </div>
                  </a>
                );
              })}

              {/* Quote Card (Spans full width on mobile 2-col, 1-col on desktop) */}
              <div className="col-span-2 lg:col-span-1 flex flex-col items-center justify-center text-center p-3.5 xs:p-4 sm:p-5 rounded-xl xs:rounded-2xl bg-gradient-to-br from-[#F5EFE4] via-[#EDF5ED] to-[#F5EFE4] border border-[#DCE7DC] shadow-2xs relative overflow-hidden group">
                {/* Subtle top decoration */}
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <span className="w-5 xs:w-6 h-[1.5px] bg-[#2E7A4A]/30 rounded-full" />
                  <span className="text-base sm:text-lg animate-breathe inline-block">🌿</span>
                  <span className="w-5 xs:w-6 h-[1.5px] bg-[#2E7A4A]/30 rounded-full" />
                </div>

                {/* Hindi Quote */}
                <div className="font-devanagari font-extrabold text-[15px] xs:text-[17px] sm:text-lg text-[#0E3320] leading-snug tracking-tight">
                  "स्वस्थ शरीर, शांत मन, संतुलित जीवन"
                </div>

                {/* English Quote */}
                <div className="font-sans font-bold text-[12px] xs:text-[13px] sm:text-sm text-[#8C671D] leading-tight mt-1 tracking-tight">
                  Healthy body, peaceful mind, balanced life.
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
