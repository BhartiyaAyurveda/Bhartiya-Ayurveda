"use client";

import { useState } from "react";
import { siteContent } from "@/data/content";
import { Star, ChevronLeft, ChevronRight, Quote, Heart } from "lucide-react";

export default function TestimonialsSection() {
  const { testimonials } = siteContent;
  const [currentIdx, setCurrentIdx] = useState(0);

  const prevTestimonial = () => {
    setCurrentIdx((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setCurrentIdx((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const current = testimonials[currentIdx];

  return (
    <section className="py-20 md:py-28 bg-[#f8f5ee] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <Heart className="w-3.5 h-3.5 text-forest-700" />
            <span className="font-hindi">साधक अनुभव</span>
            <span>• Healing Stories</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-forest-950 tracking-tight">
            Transformed Lives, Lasting Health
          </h2>
          <p className="text-xs sm:text-base text-forest-700/80 leading-relaxed max-w-xl mx-auto">
            Read heartfelt reflections from seekers who found health, balance, and inner joy through our authentic retreats.
          </p>
        </div>

        {/* Highlighted Testimonial Showcase */}
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border border-sand-200 shadow-vedic relative overflow-hidden">
          <Quote className="absolute top-6 right-6 w-20 h-20 text-gold-500/10 pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Person Photo */}
            <div className="md:col-span-4 text-center md:text-left">
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full mx-auto md:mx-0 overflow-hidden border-4 border-gold-400/40 shadow-lg relative img-hover-zoom">
                <img
                  src={current.image}
                  alt={current.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg font-serif font-bold text-forest-950 mt-4">
                {current.name}
              </h4>
              <p className="text-xs text-forest-600 font-medium">
                {current.city}
              </p>
              <div className="inline-block mt-2 px-2.5 py-0.5 rounded-full bg-forest-50 text-[10px] font-semibold text-forest-800 border border-forest-100">
                {current.program}
              </div>
            </div>

            {/* Testimonial Quote */}
            <div className="md:col-span-8 space-y-4">
              {/* Star Rating */}
              <div className="flex items-center gap-1 text-gold-500">
                {[...Array(current.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-gold-400" />
                ))}
              </div>

              {/* Hindi Snippet */}
              <p className="font-hindi text-forest-900 font-semibold text-sm sm:text-base leading-relaxed">
                "{current.reviewHi}"
              </p>

              {/* English Detailed Review */}
              <p className="text-xs sm:text-sm text-forest-700/90 leading-relaxed italic">
                "{current.review}"
              </p>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-sand-100">
                <div className="flex items-center gap-2">
                  {testimonials.map((_, dotIdx) => (
                    <button
                      key={dotIdx}
                      onClick={() => setCurrentIdx(dotIdx)}
                      className={`h-2 rounded-full transition-all ${
                        currentIdx === dotIdx ? "w-6 bg-forest-800" : "w-2 bg-sand-300"
                      }`}
                      aria-label={`Go to slide ${dotIdx + 1}`}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevTestimonial}
                    className="p-2 rounded-full bg-sand-100 hover:bg-forest-800 hover:text-white text-forest-800 transition-colors border border-sand-200"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="p-2 rounded-full bg-sand-100 hover:bg-forest-800 hover:text-white text-forest-800 transition-colors border border-sand-200"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
