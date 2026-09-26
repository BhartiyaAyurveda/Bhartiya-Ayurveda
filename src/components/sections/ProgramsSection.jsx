"use client";

import { useState } from "react";
import { Check, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import ProgramDetailsModal from "@/components/ui/ProgramDetailsModal";

export default function ProgramsSection({ onOpenConsultation }) {
  const [selectedProgram, setSelectedProgram] = useState(null);

  const programs = [
    {
      hi: "7 दिन आयुर्वेद रिट्रीट",
      en: "7 Days Ayurveda Retreat",
      image: "/images/programs/retreat-7days.jpg",
      price: "₹ 24,999",
      duration: "7 Days",
      description: "A gentle introduction to Ayurvedic living — daily detox rituals, sattvic meals, and guided nature walks designed to reset your body and calm your mind in a week.",
      features: [
        "Detox & Rejuvenation",
        "Beginner-friendly",
        "Sattvic Food",
        "Nature Walks",
      ],
    },
    {
      hi: "14 दिन योग ध्यान बंधन",
      en: "14 Days Yoga & Meditation",
      image: "/images/programs/yoga-14days.jpg",
      price: "₹ 42,999",
      duration: "14 Days",
      description: "Deepen your practice with two weeks of daily Asana, Pranayama and guided meditation, paired with a sattvic lifestyle and one-on-one guidance from our resident yogacharyas.",
      features: [
        "Inner Peace & Balance",
        "Pranayama & Mindfulness",
        "Sattvic Lifestyle",
        "Personal Guidance",
      ],
    },
    {
      hi: "21 दिन प्राकृतिक चिकित्सा",
      en: "21 Days Naturopathy Program",
      image: "/images/programs/naturopathy-21days.jpg",
      price: "₹ 64,999",
      duration: "21 Days",
      description: "A comprehensive naturopathy journey combining deep cleansing therapies, personalized diet and lifestyle guidance, and continuous support from our expert naturopaths.",
      features: [
        "Deep Cleansing",
        "Natural Therapies",
        "Diet & Lifestyle Guidance",
        "Expert Support",
      ],
    },
    {
      hi: "30 दिन समग्र स्वास्थ्य",
      en: "30 Days Holistic Wellness",
      image: "/images/programs/wellness-30days.jpg",
      price: "₹ 84,999",
      duration: "30 Days",
      description: "Our most complete transformation program — a full month resetting body and mind through Yoga, Ayurveda and nature therapy, with a personalized plan and lifetime guidance beyond your stay.",
      features: [
        "Complete Mind-Body Reset",
        "Yoga, Ayurveda & Nature",
        "Personalized Plan",
        "Lifetime Guidance",
      ],
    },
  ];

  return (
    <section id="programs" className="py-16 px-4 md:px-8 text-white relative font-sans overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/programs/programsbg.png"
          alt="Programs background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#0A2315]/88"></div>
        <div className="absolute inset-0 bg-black/45"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Top Header Row */}
        <Reveal direction="up" delay={100}>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div>
              <div className="flex flex-wrap items-baseline gap-3">
                <h2 className="text-xl sm:text-2xl font-devanagari font-bold text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                  हमारे प्रमुख कार्यक्रम
                </h2>
                <span className="text-lg sm:text-xl font-sans font-bold text-[#E4BF64] drop-shadow-[0_2px_6px_rgba(0,0,0,0.7)]">
                  Our Popular Programs
                </span>
              </div>
              <p className="text-sm sm:text-base text-[#D8E8DA] mt-1.5 font-medium drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
                Transformative experiences designed for your well-being.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <button
                onClick={onOpenConsultation}
                className="btn-shimmer px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#0A2315] text-xs sm:text-sm font-semibold shadow hover:shadow-lg transition-all font-sans cursor-pointer hover:scale-103"
              >
                View All Programs
              </button>
              <button
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#133A25] hover:bg-[#1A4B31] text-white flex items-center justify-center transition-all hover:scale-105"
                aria-label="Previous"
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#133A25] hover:bg-[#1A4B31] text-white flex items-center justify-center transition-all hover:scale-105"
                aria-label="Next"
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </div>
        </Reveal>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
          {programs.map((p, idx) => (
            <Reveal key={idx} direction="up" delay={150 + idx * 100}>
              <div
                className="card-hover-lift bg-[#FAF8F5] text-[#0E3320] rounded-2xl overflow-hidden shadow-xl border border-[#E8DFCFA] hover:border-[#C59B3F]/70 flex flex-col justify-between group transition-all duration-300 font-sans h-full"
              >
                <div>
                  {/* Photo */}
                  <div className="h-24 sm:h-auto sm:aspect-[16/10] overflow-hidden bg-[#EAE2D3] relative img-hover-zoom">
                    <img
                      src={p.image}
                      alt={p.en}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                    />
                  </div>

                  {/* Details */}
                  <div className="p-2.5 sm:p-5">
                    <h3 className="font-devanagari font-bold text-xs sm:text-base text-[#0E3320] group-hover:text-[#1E603D] transition-colors leading-snug">
                      {p.hi}
                    </h3>
                    <div className="text-[10px] sm:text-sm font-sans font-semibold text-[#4B6B55] sm:mb-3 mt-0.5 leading-snug">
                      {p.en}
                    </div>

                    <ul className="hidden sm:block space-y-1.5 sm:space-y-2 text-[#2E543C]">
                      {p.features.map((feat, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-2 text-xs sm:text-sm font-medium">
                          <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#2E7A4A] shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Bottom Price & Button */}
                <div className="p-2.5 sm:p-5 pt-2 sm:pt-3.5 border-t border-[#EAE2D3] flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 font-sans">
                  <span className="font-bold text-sm sm:text-2xl text-[#0E3320] whitespace-nowrap">
                    {p.price}
                  </span>

                  <button
                    onClick={() => setSelectedProgram(p)}
                    className="btn-shimmer w-full sm:w-auto px-3 sm:px-5 py-1.5 sm:py-2.5 rounded-xl bg-[#B96647] hover:bg-[#A35438] text-white text-[11px] sm:text-sm font-semibold transition-all shadow hover:shadow-md hover:scale-105 active:scale-95 text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </button>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

      </div>

      <ProgramDetailsModal
        program={selectedProgram}
        onClose={() => setSelectedProgram(null)}
        onOpenConsultation={onOpenConsultation}
      />
    </section>
  );
}
