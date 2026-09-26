"use client";

import { siteContent } from "@/data/content";
import { BookOpen, Clock, Calendar, ArrowRight } from "lucide-react";

export default function ArticlesSection() {
  const { articles } = siteContent;

  return (
    <section id="articles" className="py-20 md:py-28 bg-[#fdfbf7] relative">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5 text-forest-700" />
              <span className="font-hindi">स्वास्थ्य लेख एवं ज्ञान</span>
              <span>• Vedic Wisdom Journal</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-serif font-bold text-forest-950 tracking-tight">
              Insights for Mindful Living
            </h2>
          </div>

          <a
            href="#faq"
            className="inline-flex items-center gap-2 text-xs font-semibold text-forest-800 hover:text-gold-600 transition-colors"
          >
            <span>Have Questions? Read FAQs</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

        {/* 3 Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {articles.map((art, idx) => (
            <article
              key={idx}
              className="bg-white rounded-3xl overflow-hidden border border-sand-200 shadow-sm hover:shadow-vedic hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Thumbnail */}
                <div className="aspect-[16/10] overflow-hidden bg-sand-200 relative img-hover-zoom">
                  <img
                    src={art.image}
                    alt={art.titleEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 bg-forest-900/90 text-gold-300 text-[10px] font-semibold uppercase tracking-wider py-1 px-3 rounded-full backdrop-blur">
                    {art.category}
                  </div>
                </div>

                {/* Article Info */}
                <div className="p-6">
                  <div className="flex items-center gap-4 text-[11px] text-forest-600 mb-3">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {art.readTime}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {art.date}
                    </span>
                  </div>

                  <h3 className="font-hindi text-base font-bold text-forest-950 group-hover:text-forest-700 transition-colors leading-snug mb-1">
                    {art.titleHi}
                  </h3>
                  <h4 className="text-xs font-serif font-semibold text-gold-700 mb-2">
                    {art.titleEn}
                  </h4>

                  <p className="text-xs text-forest-700/80 leading-relaxed">
                    {art.desc}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-4 border-t border-sand-100 flex items-center justify-between text-xs font-semibold text-forest-800 group-hover:text-gold-600 transition-colors">
                  <span>Read Full Article</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
