"use client";

import { siteContent } from "@/data/content";
import { Sparkles, Award, ArrowRight } from "lucide-react";

export default function AcharyasSection({ onOpenConsultation }) {
  const { acharyas } = siteContent;

  return (
    <section id="acharyas" className="py-20 md:py-28 bg-[#fdfbf7] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-forest-700" />
            <span className="font-hindi">हमारे पूज्य आचार्य</span>
            <span>• Meet Our Healers</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-forest-950 tracking-tight">
            Guided by Masters of Ancient Wisdom
          </h2>
          <p className="text-xs sm:text-base text-forest-700/80 leading-relaxed max-w-2xl mx-auto">
            Our revered vaidyas, yogacharyas, and naturopaths bring generations of authentic lineage and clinical excellence to your healing journey.
          </p>
        </div>

        {/* 4 Acharya Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {acharyas.map((acharya, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-sm hover:shadow-vedic hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo */}
                <div className="aspect-[4/5] overflow-hidden bg-sand-200 relative img-hover-zoom">
                  <img
                    src={acharya.image}
                    alt={acharya.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent"></div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[10px] text-gold-400 font-semibold uppercase tracking-wider block">
                      {acharya.experience}
                    </span>
                    <h3 className="text-lg font-serif font-bold leading-tight">
                      {acharya.name}
                    </h3>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5">
                  <div className="inline-block text-[11px] font-semibold text-forest-700 bg-sand-100 px-2.5 py-1 rounded-md mb-3">
                    {acharya.title}
                  </div>
                  <p className="text-xs text-forest-700/80 leading-relaxed">
                    {acharya.bio}
                  </p>
                </div>
              </div>

              {/* Consultation Link */}
              <div className="p-5 pt-0">
                <button
                  onClick={onOpenConsultation}
                  className="w-full py-2.5 rounded-xl border border-forest-800 text-forest-800 hover:bg-forest-800 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Book Consultation</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
