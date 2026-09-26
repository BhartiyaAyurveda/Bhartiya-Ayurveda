"use client";

import { useState } from "react";
import { Star, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function AcharyasAndTestimonialsSection({ onOpenConsultation }) {
  const acharyas = [
    {
      name: "Dr. Anjali Sharma",
      role: "Ayurveda Expert",
      exp: "15+ years",
      img: "/images/acharyas/dr-anjali.jpg",
    },
    {
      name: "Yogi Rahul Dev",
      role: "Yoga & Meditation",
      exp: "12+ years",
      img: "/images/acharyas/yogi-rahul.jpg",
    },
    {
      name: "Dr. Meera Iyer",
      role: "Naturopathy Specialist",
      exp: "10+ years",
      img: "/images/acharyas/dr-meera.jpg",
    },
    {
      name: "Acharya Devendra",
      role: "Vedic Philosophy",
      exp: "20+ years",
      img: "/images/acharyas/acharya-devendra.jpg",
    },
  ];

  const testimonials = [
    {
      name: "Priya Patel",
      role: "14-Day Ayurveda Retreat Participant",
      text: "Bhartiya Ayurveda has truly transformed my life. The programs are authentic, well-structured and deeply enriching.",
      img: "/images/testimonials/priya-patel.jpg",
    },
    {
      name: "Rajesh Verma",
      role: "21-Day Naturopathy Detox Participant",
      text: "The Panchakarma and herbal therapies cured my chronic insomnia. The serene Himalayan atmosphere was truly healing.",
      img: "/images/acharyas/yogi-rahul.jpg",
    },
    {
      name: "Sunita Rao",
      role: "7-Day Holistic Retreat Participant",
      text: "The doctors take time to understand your unique Prakriti. The sattvic diet and daily yoga brought profound joy back.",
      img: "/images/acharyas/dr-anjali.jpg",
    },
  ];

  const [tIdx, setTIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  const prevT = () => {
    setTIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextT = () => {
    setTIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const swipeThreshold = 40;
    if (deltaX > swipeThreshold) {
      prevT();
    } else if (deltaX < -swipeThreshold) {
      nextT();
    }
    setTouchStartX(null);
  };

  const currentT = testimonials[tIdx];

  return (
    <section className="bg-[#FAF8F5] py-16 px-4 md:px-8 border-b border-[#EBE2D4] font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Meet Our Acharyas (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <Reveal direction="up" delay={100}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-devanagari font-bold text-base sm:text-lg text-[#0E3320]">
                    हमारे विशेषज्ञ <span className="font-sans font-semibold text-sm sm:text-base text-[#466551]">| Meet Our Acharyas</span>
                  </h3>
                </div>

                <button
                  onClick={onOpenConsultation}
                  className="btn-shimmer px-4 py-2 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all font-sans cursor-pointer hover:scale-103"
                >
                  <span>View All Experts</span>
                </button>
              </div>
            </Reveal>

            {/* 4 Acharya Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {acharyas.map((a, idx) => (
                <Reveal key={idx} direction="up" delay={150 + idx * 80}>
                  <div
                    className="card-hover-lift bg-white rounded-2xl p-3.5 text-center border border-[#E8DFCFA] shadow-sm hover:border-[#C59B3F]/70 transition-all flex flex-col items-center justify-between font-sans group h-full cursor-pointer"
                  >
                    <div className="w-20 h-20 sm:w-22 sm:h-22 rounded-full overflow-hidden mb-2.5 border-2 border-[#D5C7B7] group-hover:border-[#C59B3F] group-hover:shadow-md transition-all duration-300">
                      <img
                        src={a.img}
                        alt={a.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>

                    <div>
                      <h4 className="font-sans font-bold text-sm sm:text-base text-[#0E3320] leading-tight group-hover:text-[#1E603D] transition-colors">
                        {a.name}
                      </h4>
                      <p className="text-xs sm:text-[13px] text-[#466551] font-medium leading-tight mt-1 font-sans">
                        {a.role}
                      </p>
                    </div>

                    <span className="inline-block mt-2.5 px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#E0D5C3] text-[11px] sm:text-xs text-[#8C671D] font-bold font-sans group-hover:bg-[#C59B3F]/15 transition-colors">
                      {a.exp}
                    </span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right Column: What People Say (5 cols) */}
          <div className="lg:col-span-5 space-y-5">
            <Reveal direction="left" delay={150}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-devanagari font-bold text-base sm:text-lg text-[#0E3320]">
                    लोगों की राय <span className="font-sans font-semibold text-sm sm:text-base text-[#466551]">| What People Say</span>
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevT}
                    className="w-8 h-8 rounded-full bg-[#EAE2D3] hover:bg-[#D5C7B7] text-[#0E3320] flex items-center justify-center transition-all hover:scale-108 active:scale-95 cursor-pointer"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextT}
                    className="w-8 h-8 rounded-full bg-[#EAE2D3] hover:bg-[#D5C7B7] text-[#0E3320] flex items-center justify-center transition-all hover:scale-108 active:scale-95 cursor-pointer"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </Reveal>

            {/* Testimonial Card */}
            <Reveal direction="up" delay={250}>
              <div
                className="card-hover-lift bg-white rounded-3xl p-5 sm:p-6 border border-[#E8DFCFA] shadow-md flex flex-col justify-between min-h-[190px] font-sans group touch-pan-y"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
              >
                <div className="flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4 sm:gap-5">
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-[#D5C7B7] group-hover:border-[#C59B3F] shrink-0 transition-colors">
                    <img
                      src={currentT.img}
                      alt={currentT.name}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                    />
                  </div>

                  <div className="space-y-2.5 flex-grow">
                    <p className="text-sm sm:text-base md:text-[16px] text-[#2E543C] leading-relaxed font-normal italic">
                      "{currentT.text}"
                    </p>

                    <div className="flex items-center justify-center sm:justify-start gap-1 text-[#C59B3F] pt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current animate-pulse" style={{ animationDelay: `${i * 150}ms`, animationDuration: "2.5s" }} />
                      ))}
                    </div>

                    <div>
                      <h5 className="font-sans font-bold text-base sm:text-lg text-[#0E3320]">
                        {currentT.name}
                      </h5>
                      <p className="text-xs sm:text-sm text-[#52725D] mt-0.5 font-normal">
                        {currentT.role}
                      </p>
                    </div>
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
