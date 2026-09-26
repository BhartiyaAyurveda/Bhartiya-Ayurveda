"use client";

import { Wind, Sun, Leaf } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function DoshasSection() {
  const doshas = [
    {
      icon: Wind,
      name: "वात | Vata",
      line1: "Movement • Creativity",
      line2: "Flexibility",
      bg: "bg-[#EAF2F8] border-[#CFDFEC] text-[#1B4B6E] hover:border-[#1B4B6E]/40",
      iconBg: "bg-[#D8E8F5] text-[#1B4B6E]",
    },
    {
      icon: Sun,
      name: "पित्त | Pitta",
      line1: "Transformation • Focus",
      line2: "Determination",
      bg: "bg-[#FCF5E5] border-[#F2E3C2] text-[#7A5416] hover:border-[#C59B3F]/70",
      iconBg: "bg-[#F7EBCE] text-[#7A5416]",
    },
    {
      icon: Leaf,
      name: "कफ | Kapha",
      line1: "Stability • Calmness",
      line2: "Nourishment",
      bg: "bg-[#EDF5EE] border-[#D4E6D6] text-[#24542E] hover:border-[#2E7A4A]/50",
      iconBg: "bg-[#DEECE0] text-[#24542E]",
    },
  ];

  return (
    <section id="doshas" className="py-16 px-4 md:px-8 border-b border-[#EBE2D4] relative overflow-hidden font-sans">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/ThreeDoshasbg.png"
          alt="Three Doshas background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#FAF8F5]/45"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Section Heading */}
        <Reveal direction="up" delay={100}>
          <div className="mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-devanagari font-bold text-[#0E3320]">
              जीवन के तीन दोष — संतुलन ही स्वास्थ्य
            </h2>
            <div className="text-base sm:text-lg font-sans font-bold text-[#16462C] mt-1">
              The Three Doshas – Balance is Life
            </div>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

          {/* 3 Pastel Cards (8.5 cols) */}
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {doshas.map((d, idx) => {
              const Icon = d.icon;
              return (
                <Reveal key={idx} direction="up" delay={150 + idx * 120}>
                  <div
                    className={`card-hover-lift rounded-2xl p-6 border text-center shadow-sm flex flex-col items-center justify-center ${d.bg} group font-sans h-full`}
                  >
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3.5 shadow-inner ${d.iconBg} group-hover:scale-115 group-hover:rotate-12 transition-transform duration-300`}>
                      <Icon className="w-6 h-6 stroke-[1.75]" />
                    </div>
                    <h3 className="font-devanagari font-bold text-base sm:text-lg mb-1 group-hover:scale-103 transition-transform">
                      {d.name}
                    </h3>
                    <div className="text-xs sm:text-sm font-semibold leading-tight font-sans">
                      {d.line1}
                    </div>
                    <div className="text-xs sm:text-sm font-semibold leading-tight mt-1 font-sans opacity-85">
                      {d.line2}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* Right Quote: Charaka Samhita (3.5 cols) */}
          <div className="lg:col-span-4 text-center lg:text-right border-t lg:border-t-0 lg:border-l border-[#DFD4C2] pt-4 lg:pt-0 lg:pl-8">
            <Reveal direction="left" delay={300}>
              <blockquote className="font-devanagari font-bold text-base sm:text-lg md:text-xl text-[#0E3320] leading-relaxed">
                "जब मनुष्य प्रकृति के नियमों के अनुसार जीता है, तभी वह स्वस्थ और प्रसन्न रहता है।"
              </blockquote>
              <p className="font-devanagari text-xs sm:text-sm text-[#8C671D] font-bold mt-2">
                — चरक संहिता
              </p>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
