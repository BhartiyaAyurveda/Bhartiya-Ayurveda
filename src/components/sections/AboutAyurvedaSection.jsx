"use client";

import { ArrowRight, Leaf, ShieldCheck, Sparkles, CheckCircle2 } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function AboutAyurvedaSection({ onOpenConsultation }) {
  return (
    <section
      id="ayurveda"
      className="bg-[#FAF8F5] py-10 sm:py-14 md:py-16 px-3.5 xs:px-4 sm:px-6 md:px-8 border-b border-[#EBE2D4] font-sans relative overflow-hidden"
    >
      {/* Soft ambient background glow */}
      <div className="absolute top-1/3 -right-20 w-80 h-80 rounded-full bg-[#1E5C3B]/5 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-[#C59B3F]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">

          {/* 1. Left Column: Pure Mortar & Pestle Image Card */}
          <div className="lg:col-span-4 xl:col-span-4 flex items-center justify-center">
            <Reveal direction="right" delay={150} className="w-full">
              <div className="relative w-full rounded-2xl xs:rounded-3xl overflow-hidden shadow-[0_16px_36px_-8px_rgba(14,51,32,0.12)] border border-[#E4DAC8] bg-[#FAF6F0] aspect-[1.27/1] img-hover-zoom group">
                <img
                  src="/images/ayurveda/herbs-mortar.png"
                  alt="Ayurveda Herbs with Mortar and Pestle"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 select-none"
                />

                {/* Floating Vedic Authenticity Tag */}
                <div className="absolute top-3 right-3 z-10 px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-white/80 text-[#144229] text-xs xs:text-[13px] font-bold shadow-xs flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#2E7A4A] animate-ping-soft" />
                  <span>Shuddha Ayurveda</span>
                </div>
              </div>
            </Reveal>
          </div>

          {/* 2. Center Column: Headlines, Paragraphs, 4 Micro-Chips, and CTA */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-3.5 px-0.5 xs:px-1 lg:px-2">
            <Reveal direction="up" delay={250}>
              {/* Category Pill Tag */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#EBF3EC] border border-[#CFE2D2] text-[#194E31] text-xs xs:text-[13px] font-bold shadow-2xs">
                <span className="w-2 h-2 rounded-full bg-[#2E7A4A] animate-ping-soft" />
                <span className="tracking-wide">5000+ Years Of Vedic Healing</span>
              </div>

              {/* Headings */}
              <div className="mt-3">
                <h2 className="text-[28px] xs:text-[32px] sm:text-4xl lg:text-[40px] font-devanagari font-black text-[#0B2818] leading-[1.16] tracking-tight">
                  आयुर्वेद क्या है ?
                </h2>
                <div className="text-[20px] xs:text-[22px] sm:text-2xl lg:text-[26px] font-sans font-extrabold text-[#194E31] tracking-tight mt-1">
                  What is Ayurveda?
                </div>
              </div>

              {/* Vedic Golden-Emerald Divider */}
              <div className="flex items-center gap-2 my-3">
                <span className="w-12 h-[2.5px] bg-[#C59B3F] rounded-full" />
                <span className="w-2.5 h-2.5 rounded-full bg-[#2E7A4A]" />
                <span className="w-5 h-[1.5px] bg-[#C59B3F]/40 rounded-full" />
              </div>

              {/* Descriptions */}
              <p className="font-devanagari text-[15px] xs:text-[16px] sm:text-[17.5px] text-[#244A32] leading-relaxed font-medium">
                आयुर्वेद जीवन को संपूर्ण रूप से देखने की एक प्राचीन भारतीय पद्धति है जो{" "}
                <span className="font-bold text-[#0E3320] underline decoration-[#C59B3F]/40 underline-offset-2">
                  शरीर, मन और आत्मा के संतुलन
                </span>{" "}
                पर आधारित है। यह हमें प्रकृति के साथ सामंजस्य में रहकर स्वस्थ, दीर्घायु और सार्थक जीवन जीने की प्रेरणा देता है।
              </p>

              <p className="font-sans text-[14px] xs:text-[15px] sm:text-[16px] text-[#3D644B] leading-relaxed font-medium">
                Ayurveda is an ancient Indian system of holistic healing that focuses on balance of body, mind and spirit. It guides us to live in harmony with nature and our true self.
              </p>

              {/* 4 Interactive Feature Chips (Natural, Safe, Holistic, Effective) */}
              <div className="grid grid-cols-2 gap-2.5 xs:gap-3 pt-2.5 pb-1.5">
                {/* 1. Natural */}
                <div className="flex items-center gap-2.5 p-2.5 xs:p-3 rounded-xl bg-white/90 border border-[#E0EBE1] shadow-2xs hover:border-[#2E7A4A] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#E8F3EA] text-[#1E5C3B] flex items-center justify-center shrink-0">
                    <Leaf className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] xs:text-[14px] font-extrabold text-[#0E3320] leading-tight truncate">
                      100% Natural
                    </div>
                    <div className="text-[11px] xs:text-[11.5px] text-[#52755D] font-medium leading-tight truncate">
                      प्राकृतिक जड़ी-बूटियां
                    </div>
                  </div>
                </div>

                {/* 2. Safe */}
                <div className="flex items-center gap-2.5 p-2.5 xs:p-3 rounded-xl bg-white/90 border border-[#E0EBE1] shadow-2xs hover:border-[#B57A22] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#FEF4E5] text-[#B57A22] flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] xs:text-[14px] font-extrabold text-[#0E3320] leading-tight truncate">
                      Safe & Pure
                    </div>
                    <div className="text-[11px] xs:text-[11.5px] text-[#52755D] font-medium leading-tight truncate">
                      बिना साइड इफेक्ट
                    </div>
                  </div>
                </div>

                {/* 3. Holistic */}
                <div className="flex items-center gap-2.5 p-2.5 xs:p-3 rounded-xl bg-white/90 border border-[#E0EBE1] shadow-2xs hover:border-[#246B3E] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#EBF5EE] text-[#246B3E] flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] xs:text-[14px] font-extrabold text-[#0E3320] leading-tight truncate">
                      Holistic Care
                    </div>
                    <div className="text-[11px] xs:text-[11.5px] text-[#52755D] font-medium leading-tight truncate">
                      शरीर, मन व आत्मा
                    </div>
                  </div>
                </div>

                {/* 4. Effective */}
                <div className="flex items-center gap-2.5 p-2.5 xs:p-3 rounded-xl bg-white/90 border border-[#E0EBE1] shadow-2xs hover:border-[#1A674D] transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-[#E9F3EF] text-[#1A674D] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
                  </div>
                  <div className="min-w-0">
                    <div className="text-[13px] xs:text-[14px] font-extrabold text-[#0E3320] leading-tight truncate">
                      Deep Healing
                    </div>
                    <div className="text-[11px] xs:text-[11.5px] text-[#52755D] font-medium leading-tight truncate">
                      जड़ से संपूर्ण निदान
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA Button */}
              <div className="pt-2.5">
                <button
                  onClick={onOpenConsultation}
                  className="btn-shimmer w-full xs:w-auto px-8 py-4 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-[15px] xs:text-base sm:text-[17px] font-semibold shadow-md hover:shadow-xl hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3 transition-all group font-sans cursor-pointer"
                >
                  <span>Know More About Ayurveda</span>
                  <ArrowRight className="w-4.5 h-4.5 text-[#DEB655] group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </Reveal>
          </div>

          {/* 3. Right Column: Warm Cream Card with Sage Drawing and Quote */}
          <div className="lg:col-span-3 xl:col-span-3">
            <Reveal direction="left" delay={350}>
              <div className="card-hover-lift rounded-2xl xs:rounded-3xl border border-[#E5DAC9] shadow-[0_10px_30px_-6px_rgba(14,51,32,0.06)] relative overflow-hidden group min-h-[320px] xs:min-h-[350px] sm:min-h-[380px] flex flex-col justify-end bg-[#FAF7F0]">
                {/* Sage Line Drawing as background */}
                <img
                  src="/images/ayurveda/sage-meditation.jpg"
                  alt="Meditating Sage Illustration"
                  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 select-none"
                />

                {/* Subtle decorative leaf hint in top right */}
                <div className="absolute top-3 right-3 text-[#2E7A4A] opacity-60 text-xs pointer-events-none select-none animate-breathe">
                  🌿
                </div>

                {/* Frosted Quote Box overlay */}
                <div className="relative z-10 m-3 xs:m-3.5 p-4 xs:p-5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#E6DDCE] shadow-sm space-y-1.5">
                  <blockquote className="font-devanagari font-bold text-[16px] xs:text-[18px] sm:text-xl text-[#0E3320] leading-snug">
                    “आयुर्वेद केवल उपचार नहीं, जीवन जीने की कला है।”
                  </blockquote>
                  <p className="font-sans text-[12px] xs:text-[13.5px] sm:text-base text-[#5C7E67] font-medium leading-tight">
                    Ayurveda is not just treatment, it’s a way of life.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
