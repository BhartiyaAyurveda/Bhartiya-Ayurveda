"use client";

import { useState } from "react";
import { siteContent } from "@/data/content";
import { ChevronDown, HelpCircle, MessageCircle, ArrowRight } from "lucide-react";

export default function FaqSection({ onOpenConsultation }) {
  const { faqs } = siteContent;
  const [openIndex, setOpenIndex] = useState(0);

  const toggleFaq = (index) => {
    setOpenIndex(openIndex === index ? -1 : index);
  };

  return (
    <section id="faq" className="py-20 md:py-28 bg-[#f8f5ee] relative">
      <div className="max-w-4xl mx-auto px-4 md:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-100 text-forest-800 text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5 text-forest-700" />
            <span className="font-hindi">अक्सर पूछे जाने वाले प्रश्न</span>
            <span>• FAQ</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-serif font-bold text-forest-950 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-base text-forest-700/80 leading-relaxed max-w-xl mx-auto">
            Everything you need to know about our authentic Ayurvedic retreats, dietary protocols, and natural therapies.
          </p>
        </div>

        {/* Accordion List */}
        <div className="space-y-4 mb-12">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-sand-300 overflow-hidden transition-all duration-300 shadow-sm"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 hover:bg-sand-50 transition-colors"
                  aria-expanded={isOpen}
                >
                  <div className="space-y-1">
                    <p className="font-hindi text-base sm:text-lg font-bold text-forest-950 leading-snug">
                      {faq.questionHi}
                    </p>
                    <p className="text-xs sm:text-sm font-serif font-medium text-forest-700">
                      {faq.questionEn}
                    </p>
                  </div>
                  <div
                    className={`w-8 h-8 rounded-full bg-sand-100 text-forest-800 flex items-center justify-center shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 bg-forest-800 text-white" : ""
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-6 sm:px-6 pt-1 text-xs sm:text-sm text-forest-800 space-y-3 border-t border-sand-100 animate-fadeIn">
                    <div className="p-3.5 bg-sand-50 rounded-xl border border-sand-200">
                      <p className="font-hindi leading-relaxed font-medium text-forest-900">
                        {faq.answerHi}
                      </p>
                    </div>
                    <p className="text-forest-700 leading-relaxed italic">
                      {faq.answerEn}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still Have Questions Box */}
        <div className="bg-forest-900 text-sand-100 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl border border-gold-500/20">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-lg font-serif font-bold text-white flex items-center justify-center sm:justify-start gap-2">
              <MessageCircle className="w-5 h-5 text-gold-400" />
              <span>Have a specific health condition or question?</span>
            </h4>
            <p className="text-xs text-sand-300">
              Speak directly with our Chief Vaidya for a complimentary 15-minute phone consultation.
            </p>
          </div>

          <button
            onClick={onOpenConsultation}
            className="px-6 py-3 rounded-full bg-gold-500 hover:bg-gold-600 text-forest-950 font-semibold text-xs sm:text-sm shadow whitespace-nowrap shrink-0 flex items-center gap-2"
          >
            <span>Ask a Vaidya</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
