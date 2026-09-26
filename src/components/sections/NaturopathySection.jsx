"use client";

import Reveal from "@/components/ui/Reveal";

export default function NaturopathySection() {
  const circles = [
    {
      hi: "शुद्ध वायु",
      en: "Clean Air",
      img: "/images/naturopathy/air-waterfall.jpg",
    },
    {
      hi: "सूर्य चिकित्सा",
      en: "Sun Therapy",
      img: "/images/naturopathy/sun-therapy.jpg",
    },
    {
      hi: "जल चिकित्सा",
      en: "Water Therapy",
      img: "/images/naturopathy/water-therapy.jpg",
    },
    {
      hi: "सात्विक आहार",
      en: "Pure Food",
      img: "/images/naturopathy/pure-food.jpg",
    },
    {
      hi: "औषधीय पौधे",
      en: "Herbal Care",
      img: "/images/naturopathy/herbal-care.jpg",
    },
    {
      hi: "मिट्टी चिकित्सा",
      en: "Mud Therapy",
      img: "/images/naturopathy/mud-therapy.jpg",
    },
  ];

  return (
    <section id="naturopathy" className="relative py-16 px-4 md:px-8 border-b border-[#EBE2D4] font-sans overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/naturopathy/Naturopathybg.png"
          alt="Naturopathy background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#FAF8F5]/45"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Column: Heading + 6 Circular Elements (9 cols) */}
          <div className="lg:col-span-9 space-y-6">
            <Reveal direction="up" delay={100}>
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-devanagari font-bold text-[#0E3320]">
                  प्राकृतिक चिकित्सा — प्रकृति की गोद में स्वास्थ्य
                </h2>
                <div className="text-base sm:text-lg font-sans font-bold text-[#16462C] mt-1">
                  Naturopathy – Healing with Nature
                </div>
              </div>
            </Reveal>

            {/* 6 Circles Row */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-5 text-center pt-2">
              {circles.map((c, idx) => (
                <Reveal key={idx} direction="up" delay={150 + idx * 70}>
                  <div className="flex flex-col items-center group cursor-pointer">
                    <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-[#D5C7B7] shadow-sm mb-2 group-hover:scale-110 group-hover:border-[#C59B3F] group-hover:shadow-lg transition-all duration-300 relative">
                      <img
                        src={c.img}
                        alt={c.en}
                        className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-500"
                      />
                    </div>
                    <div className="font-devanagari font-bold text-xs sm:text-base text-[#0E3320] group-hover:text-[#1E603D] transition-colors">
                      {c.hi}
                    </div>
                    <div className="text-[11px] sm:text-sm text-[#466551] font-semibold font-sans mt-0.5">
                      {c.en}
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right Column: Dark Green Quote Card with Leaf & Stone accents (3 cols) */}
          <div className="lg:col-span-3 relative pt-6 pr-4">
            <Reveal direction="left" delay={300}>
              <div className="relative">
                {/* Decorative leaf branch peeking from top-right */}
                <div className="absolute -top-8 -right-2 w-20 h-20 pointer-events-none z-20 opacity-90 animate-sway-slow">
                  <svg viewBox="0 0 100 100" className="w-full h-full text-[#2E7A4A] fill-current">
                    <path d="M100,0 Q70,10 60,40 Q80,30 100,0 M90,0 Q60,20 50,60 Q70,40 90,0 M100,20 Q70,40 65,80 Q85,50 100,20" opacity="0.75" />
                  </svg>
                </div>

                <div className="card-hover-lift bg-[#0E3320]/80 backdrop-blur-sm text-white rounded-3xl p-6 text-center shadow-xl border border-[#C59B3F]/40 relative overflow-visible group">
                  <div className="space-y-2.5 py-4">
                    <blockquote className="font-devanagari font-bold text-lg sm:text-xl text-white leading-snug group-hover:text-[#FAF8F5] transition-colors">
                      "प्रकृति ही सबसे बड़ी चिकित्सक है।"
                    </blockquote>
                    <div className="font-sans font-semibold italic text-sm sm:text-base text-[#C59B3F] leading-tight">
                      Nature itself is the greatest healer.
                    </div>
                  </div>

                  {/* Stacked river stone photos, overlapping bottom-right corner */}
                  <div className="absolute -bottom-6 -right-5 flex items-end pointer-events-none z-20">
                    <img
                      src="/images/naturopathy/mud-therapy.jpg"
                      alt="River stones"
                      className="w-14 h-14 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#FAF8F5] shadow-lg -mr-4 rotate-6"
                    />
                    <img
                      src="/images/naturopathy/mud-therapy.jpg"
                      alt="River stones"
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover border-2 border-[#FAF8F5] shadow-lg -rotate-6"
                    />
                  </div>
                </div>
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
