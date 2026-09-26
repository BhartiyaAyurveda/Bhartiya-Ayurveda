"use client";

import { useState } from "react";
import { Clock, ArrowUpRight, ChevronRight, Leaf } from "lucide-react";
import Reveal from "@/components/ui/Reveal";

export default function ArticlesAndFaqSection({ onOpenConsultation }) {
  const articles = [
    {
      hi: "आयुर्वेदिक दिनचर्या के 5 सरल नियम",
      en: "5 Simple Rules for an Ayurvedic Lifestyle",
      readTime: "5 min read",
      img: "/images/articles/article-1.jpg",
    },
    {
      hi: "योग से मानसिक शांति कैसे पाएं",
      en: "How Yoga Brings Mental Peace",
      readTime: "6 min read",
      img: "/images/articles/article-2.jpg",
    },
    {
      hi: "सात्विक आहार का महत्व",
      en: "The Power of Sattvic Food",
      readTime: "4 min read",
      img: "/images/articles/article-3.jpg",
    },
  ];

  const faqs = [
    {
      q: "आयुर्वेद क्या है और यह कैसे काम करता है ?",
      a: "आयुर्वेद त्रिदोष (वात, पित्त, कफ) के संतुलन द्वारा शरीर की प्राकृतिक रोग प्रतिरोधक क्षमता को जागृत करता है।",
    },
    {
      q: "योग और आयुर्वेद में क्या अंतर है ?",
      a: "आयुर्वेद शारीरिक और मानसिक स्वास्थ्य का विज्ञान है, जबकि योग मन और चेतना की साधना है। दोनों एक-दूसरे के पूरक हैं।",
    },
    {
      q: "क्या ऑनलाइन परामर्श उपलब्ध है ?",
      a: "हाँ, हमारे अनुभवी वैद्य वीडियो कॉल के माध्यम से नाड़ी, लक्षण एवं जीवनशैली पर आधारित ऑनलाइन परामर्श प्रदान करते हैं।",
    },
    {
      q: "प्राकृतिक चिकित्सा में कौन-सी विधियाँ शामिल हैं ?",
      a: "इसमें जल चिकित्सा, मिट्टी लेप, सूर्य स्नान, उपवास चिकित्सा और मालिश जैसे प्राकृतिक उपचार शामिल हैं।",
    },
    {
      q: "क्या कोई व्यक्तिगत परामर्श करवा सकता है ?",
      a: "हाँ, आप अपनी सुविधा के अनुसार व्यक्तिगत 1-on-1 परामर्श के लिए अपॉइंटमेंट बुक कर सकते हैं।",
    },
  ];

  const [openFaq, setOpenFaq] = useState(0);

  return (
    <section id="articles" className="bg-[#FAF8F5] py-16 px-4 md:px-8 border-b border-[#EBE2D4] font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Latest Articles (7 cols) */}
          <div className="lg:col-span-7 space-y-5">
            <Reveal direction="up" delay={100}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-devanagari font-bold text-base sm:text-lg text-[#0E3320]">
                    ज्ञान और प्रेरणा <span className="font-sans font-semibold text-sm sm:text-base text-[#466551]">| Latest Articles</span>
                  </h3>
                </div>

                <button
                  className="btn-shimmer px-4 py-2 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all font-sans cursor-pointer hover:scale-103"
                >
                  <span>View All Articles</span>
                </button>
              </div>
            </Reveal>

            {/* 3 Articles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {articles.map((art, idx) => (
                <Reveal key={idx} direction="up" delay={150 + idx * 80}>
                  <article
                    className="card-hover-lift bg-white rounded-2xl overflow-hidden border border-[#E8DFCFA] shadow-sm hover:border-[#C59B3F]/70 transition-all flex flex-col justify-between group font-sans h-full cursor-pointer"
                  >
                    <div>
                      <div className="aspect-[16/10] overflow-hidden bg-[#EAE2D3] img-hover-zoom">
                        <img
                          src={art.img}
                          alt={art.en}
                          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700"
                        />
                      </div>

                      <div className="p-4 space-y-1.5">
                        <h4 className="font-devanagari font-bold text-sm sm:text-base text-[#0E3320] leading-snug group-hover:text-[#B96647] transition-colors">
                          {art.hi}
                        </h4>
                        <p className="font-sans text-xs sm:text-sm text-[#466551] font-medium leading-tight">
                          {art.en}
                        </p>
                      </div>
                    </div>

                    <div className="p-4 pt-0 flex items-center gap-1.5 text-xs sm:text-sm text-[#63856D] font-medium font-sans">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{art.readTime}</span>
                    </div>
                  </article>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Right Column: FAQ Accordion (5 cols) */}
          <div id="faq" className="lg:col-span-5 space-y-5">
            <Reveal direction="left" delay={150}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-devanagari font-bold text-base sm:text-lg text-[#0E3320] leading-tight">
                    अक्सर पूछे जाने वाले प्रश्न
                  </h3>
                  <span className="font-sans text-sm sm:text-base text-[#466551] font-semibold">
                    Frequently Asked Questions
                  </span>
                </div>

                <button
                  onClick={onOpenConsultation}
                  className="btn-shimmer px-4 py-2 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 shadow-sm hover:shadow-md transition-all font-sans cursor-pointer hover:scale-103"
                >
                  <span>View All FAQ</span>
                </button>
              </div>
            </Reveal>

            {/* 5 FAQ items */}
            <div className="space-y-2.5">
              {faqs.map((f, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <Reveal key={idx} direction="up" delay={200 + idx * 60}>
                    <div
                      className={`bg-white rounded-2xl border transition-all duration-300 overflow-hidden font-sans ${
                        isOpen ? "border-[#C59B3F]/70 shadow-md" : "border-[#E8DFCFA] shadow-sm hover:border-[#D5C7B7]"
                      }`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? -1 : idx)}
                        className="w-full px-4 py-3.5 text-left flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors cursor-pointer group"
                      >
                        <div className="flex items-start sm:items-center gap-2.5 min-w-0 pr-2">
                          <Leaf className={`w-4 h-4 text-[#2E7A4A] shrink-0 mt-0.5 sm:mt-0 transition-transform ${isOpen ? "rotate-45 text-[#C59B3F]" : "group-hover:rotate-12"}`} />
                          <span className="font-devanagari text-xs sm:text-base font-bold text-[#0E3320] leading-snug group-hover:text-[#1E603D] transition-colors">
                            {f.q}
                          </span>
                        </div>
                        <ChevronRight
                          className={`w-4 h-4 text-[#466551] shrink-0 transition-transform duration-300 ${
                            isOpen ? "rotate-90 text-[#C59B3F]" : "group-hover:translate-x-0.5"
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="px-4 pb-4 pt-1.5 text-sm sm:text-base font-devanagari text-[#2E543C] leading-relaxed border-t border-[#F2ECE1] bg-[#FAF8F5]/80 animate-breathe">
                          {f.a}
                        </div>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
