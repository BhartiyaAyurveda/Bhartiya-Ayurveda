"use client";

import Reveal from "@/components/ui/Reveal";
import { acharyas } from "@/data/content";

export default function AcharyasSection({ onOpenConsultation }) {
  return (
    <section id="acharyas" className="py-20 bg-forest-950 text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <Reveal direction="up">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-gold-400 text-xs uppercase tracking-widest font-semibold">
              Our Lineage
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-serif font-bold text-sand-100 mt-2">
              Guided by Revered Acharyas
            </h2>
            <p className="text-xs sm:text-sm text-sand-300 mt-2">
              Our teachers carry decades of traditional knowledge passed down through sacred guru-shishya parampara.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {acharyas.map((acharya, i) => (
            <div
              key={acharya.id}
              className="bg-forest-900/60 rounded-2xl border border-forest-800/80 overflow-hidden flex flex-col justify-between hover:border-gold-500/50 transition-all hover:scale-102"
            >
              <div>
                <div className="aspect-square relative overflow-hidden bg-forest-800">
                  <img
                    src={acharya.photo}
                    alt={acharya.name}
                    className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest-950/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="text-xs text-gold-400 font-semibold">{acharya.specialty}</div>
                    <div className="text-sm font-serif font-bold text-sand-100">{acharya.name}</div>
                  </div>
                </div>

                <div className="p-5 space-y-2">
                  <div className="font-devanagari text-xs text-sand-300 font-medium">
                    {acharya.titleHi}
                  </div>
                  <div className="text-[11px] text-gold-500/90 font-semibold">
                    {acharya.experience} Experience
                  </div>
                  <p className="text-xs text-sand-300/80 leading-relaxed line-clamp-3">
                    {acharya.bio}
                  </p>
                </div>
              </div>

              {/* Consultation Link */}
              <div className="p-5 pt-0">
                <a
                  href="/contact"
                  className="w-full py-2.5 rounded-xl border border-forest-800 text-sand-100 hover:bg-forest-800 hover:text-white font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Contact Expert</span>
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
