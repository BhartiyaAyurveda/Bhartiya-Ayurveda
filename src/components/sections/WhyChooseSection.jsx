"use client";

import { BookOpen, UserCheck, Trees, HeartHandshake, ShieldCheck, Play } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function WhyChooseSection({ onOpenVideo }) {
  const points = [
    {
      icon: BookOpen,
      hi: "प्रामाणिक ज्ञान",
      en: "Authentic Knowledge",
      color: "text-[#2E7A4A]",
    },
    {
      icon: UserCheck,
      hi: "अनुभवी विशेषज्ञ",
      en: "Experienced Experts",
      color: "text-[#B9662E]",
    },
    {
      icon: Trees,
      hi: "प्राकृतिक वातावरण",
      en: "Natural Environment",
      color: "text-[#2E7A4A]",
    },
    {
      icon: HeartHandshake,
      hi: "व्यक्तिगत मार्गदर्शन",
      en: "Personalized Care",
      color: "text-[#2E7A4A]",
    },
    {
      icon: ShieldCheck,
      hi: "सतत सहयोग",
      en: "Lifelong Support",
      color: "text-[#B9662E]",
    },
  ];

  return (
    <section id="why-choose" className="bg-[#FAF8F5] py-16 px-4 md:px-8 border-b border-[#EBE2D4] font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left: Heading + 5 Circular Badges (8 cols) */}
          <div className="lg:col-span-8 space-y-6">
            <Reveal direction="up" delay={100}>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-devanagari font-bold text-[#0E3320]">
                  क्यों चुनें भारतीय आयुर्वेद ?
                </h2>
                <div className="text-base sm:text-lg font-sans font-bold text-[#16462C] mt-1">
                  Why Choose Bhartiya Ayurveda ?
                </div>
              </div>
            </Reveal>

            {/* 5 Circular Items in a Row */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4 text-center pt-2">
              {points.map((p, idx) => {
                const Icon = p.icon;
                return (
                  <Reveal
                    key={idx}
                    direction="up"
                    delay={150 + idx * 70}
                    className={idx === 4 ? "col-span-2 sm:col-span-1" : ""}
                  >
                    <div className="flex flex-col items-center group cursor-pointer">
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-white border-2 border-[#E4DAC9] ${p.color} flex items-center justify-center mb-2 group-hover:scale-115 group-hover:border-[#C59B3F] transition-all duration-300 shadow-sm`}>
                        <Icon className="w-6 h-6 sm:w-7 sm:h-7 stroke-[1.5]" />
                      </div>
                      <div className="font-devanagari font-bold text-xs sm:text-base text-[#0E3320] group-hover:text-[#1E603D] transition-colors">
                        {p.hi}
                      </div>
                      <div className="text-[11px] sm:text-sm text-[#466551] font-semibold leading-tight mt-0.5 font-sans">
                        {p.en}
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

          {/* Right: Video Card with Lush Leaves Background (4 cols) */}
          <div className="lg:col-span-4">
            <Reveal direction="left" delay={250}>
              <div className="card-hover-lift relative rounded-2xl overflow-hidden shadow-xl aspect-[16/10] bg-[#0E3320] text-white flex flex-col items-center justify-center p-6 text-center group font-sans cursor-pointer" onClick={onOpenVideo}>
                <img
                  src="/images/decor/leaves-dark.jpg"
                  alt="Lush green leaves"
                  className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/60 to-[#071F13]/80"></div>

                <div className="relative z-10 space-y-2.5">
                  <div className="relative inline-block">
                    <span className="absolute inset-0 rounded-full bg-[#C59B3F]/40 animate-ping-soft"></span>
                    <button
                      onClick={onOpenVideo}
                      className="w-13 h-13 rounded-full bg-white/20 backdrop-blur border border-white/40 text-white flex items-center justify-center mx-auto group-hover:bg-[#C59B3F] group-hover:border-[#C59B3F] group-hover:scale-110 transition-all shadow-lg p-3 relative z-10"
                      aria-label="Play video"
                    >
                      <Play className="w-6 h-6 fill-current ml-0.5" />
                    </button>
                  </div>

                  <div className="space-y-1 pt-1 font-sans font-bold">
                    <div className="text-base text-[#F5EDE1] group-hover:text-white transition-colors">
                      A Tradition of Healing
                    </div>
                    <div className="text-base text-[#C59B3F]">
                      A Future of Wellness
                    </div>
                  </div>

                  <button
                    onClick={onOpenVideo}
                    className="inline-flex items-center gap-1.5 text-xs text-[#CBD8CB] hover:text-white pt-1 font-sans cursor-pointer"
                  >
                    <span>▷</span>
                    <span className="underline decoration-[#C59B3F]">Watch Video</span>
                  </button>
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
