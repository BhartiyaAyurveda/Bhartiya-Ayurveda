"use client";

import { ArrowRight } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function CtaBannerSection({ onOpenConsultation }) {
  return (
    <section className="relative bg-[#071F13] text-white py-14 px-4 md:px-8 overflow-hidden font-sans">
      {/* Background Landscape Photo with Dark Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/images/cta/cta-landscape.jpg"
          alt="Himalayan mountain landscape"
          className="w-full h-full object-cover opacity-65 scale-105 hover:scale-100 transition-transform duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071F13]/90 via-[#0E3320]/60 to-[#071F13]/40"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Main Content (9 cols) */}
          <div className="lg:col-span-9 space-y-5 text-center lg:text-left">
            <Reveal direction="up" delay={100}>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-devanagari font-bold text-white leading-tight">
                एक स्वस्थ और संतुलित जीवन की ओर पहला कदम
              </h2>
              <div className="text-lg sm:text-xl md:text-2xl font-sans font-bold text-[#E4BF64] mt-2">
                Take the First Step Towards a Healthier, Happier You
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-4">
                <button
                  onClick={onOpenConsultation}
                  className="btn-shimmer px-8 py-3.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#0E3320] text-sm sm:text-base font-bold shadow-lg hover:shadow-2xl hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 transition-all group font-sans cursor-pointer"
                >
                  <span>Book a Consultation</span>
                  <ArrowRight className="w-4 h-4 text-[#8C671D] group-hover:translate-x-1 transition-transform" />
                </button>

                <a
                  href="#contact"
                  className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base font-semibold border border-white/40 backdrop-blur hover:scale-105 active:scale-95 transition-all font-sans text-center"
                >
                  Get in Touch
                </a>
              </div>
            </Reveal>
          </div>

          {/* Right Slogan (3 cols) */}
          <div className="lg:col-span-3 text-center lg:text-right select-none space-y-1 font-sans mt-4 lg:mt-0">
            <Reveal direction="left" delay={250}>
              <div className="text-lg sm:text-xl lg:text-2xl font-medium italic text-white drop-shadow leading-snug hover:scale-103 transition-transform cursor-default">
                Good Health
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-medium italic text-[#E4BF64] drop-shadow leading-snug hover:scale-103 transition-transform cursor-default">
                Happy People
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-medium italic text-white drop-shadow leading-snug hover:scale-103 transition-transform cursor-default">
                Brighter Tomorrow
              </div>
            </Reveal>
          </div>

        </div>
      </div>
    </section>
  );
}
