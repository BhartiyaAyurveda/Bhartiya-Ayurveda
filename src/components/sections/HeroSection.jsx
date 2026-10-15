"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Flower2, Sprout, GraduationCap, BookOpen, Building2, Award,
  ChevronLeft, ChevronRight,
} from "lucide-react";
import Reveal from "@/components/ui/Reveal";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const DEFAULT_SLIDES = [
  {
    id: "s1",
    badgeText:    "Rooted in India, For a Better Tomorrow",
    headlineHi:   "प्रकृति से जुड़ें\nबेहतर जीवन जिएं",
    headlineEn:   "Ancient Ayurveda. Authentic Yoga. Natural Healing.",
    cta1Text:     "Explore Courses",
    cta1Link:     "/courses",
    cta2Text:     "Affiliated Institutes",
    cta2Link:     "/affiliated-institutes",
    imageMobile:  "/images/hero/hero-warrior-pose-mobile.jpg",
    imageDesktop: "/images/hero/hero-meditation-sunrise-desktop.jpg",
  },
  {
    id: "s2",
    badgeText:    "Vedic Wellness & Holistic Living",
    headlineHi:   "शरीर को साधें\nप्राण ऊर्जा जगाएं",
    headlineEn:   "Harmonize Body, Breath and Pranic Energy",
    cta1Text:     "Our Courses",
    cta1Link:     "/courses",
    cta2Text:     "About Parishad",
    cta2Link:     "/about",
    imageMobile:  "/images/hero/hero-warrior-pose-mobile.jpg",
    imageDesktop: "/images/hero/hero-warrior-pose-desktop.jpg",
  },
  {
    id: "s3",
    badgeText:    "Sacred Himalayan Traditions",
    headlineHi:   "हिमालयी चेतना\nगहन ध्यान एवं आत्मज्ञान",
    headlineEn:   "Transcendental Meditation in the Lap of Himalayas",
    cta1Text:     "View Gallery",
    cta1Link:     "/gallery",
    cta2Text:     "About Us",
    cta2Link:     "/about",
    imageMobile:  "/images/hero/hero-himalayan-peak-mobile.jpg",
    imageDesktop: "/images/hero/hero-himalayan-peak-desktop.jpg",
  },
  {
    id: "s4",
    badgeText:    "Healthy Family, Prosperous Nation",
    headlineHi:   "पूरे परिवार के लिए\nसमग्र स्वास्थ्य और संस्कार",
    headlineEn:   "Nurturing Health & Values for Every Generation",
    cta1Text:     "Student Registration",
    cta1Link:     "/students/registration",
    cta2Text:     "Affiliated Institutes",
    cta2Link:     "/affiliated-institutes",
    imageMobile:  "/images/hero/hero-family-yoga-mobile.jpg",
    imageDesktop: "/images/hero/hero-family-yoga-desktop.jpg",
  },
  {
    id: "s5",
    badgeText:    "Community & Collective Healing",
    headlineHi:   "सामूहिक साधना\nएकता और आत्मिक शांति",
    headlineEn:   "Collective Practice for Greater Inner Peace",
    cta1Text:     "Latest Notices",
    cta1Link:     "/announcements",
    cta2Text:     "Explore Courses",
    cta2Link:     "/courses",
    imageMobile:  "/images/hero/hero-group-guru-mobile.jpg",
    imageDesktop: "/images/hero/hero-group-guru-desktop.jpg",
  },
  {
    id: "s6",
    badgeText:    "Strength, Balance & Discipline",
    headlineHi:   "अनुशासन और शौर्य\nप्राचीन कला एवं शक्ति संवर्धन",
    headlineEn:   "Strength, Mindfulness and Martial Discipline",
    cta1Text:     "Verify Certificate",
    cta1Link:     "/certificate-verification",
    cta2Text:     "Contact Us",
    cta2Link:     "/contact",
    imageMobile:  "/images/hero/hero-martial-discipline-mobile.jpg",
    imageDesktop: "/images/hero/hero-martial-discipline-desktop.jpg",
  },
  {
    id: "s7",
    badgeText:    "Purity, Nature & Rejuvenation",
    headlineHi:   "प्राकृतिक वातावरण में\nपूर्ण मानसिक पुनर्जीवन",
    headlineEn:   "Complete Mind-Body Rejuvenation by Nature",
    cta1Text:     "Online Registration",
    cta1Link:     "/students/registration",
    cta2Text:     "Our Institutes",
    cta2Link:     "/affiliated-institutes",
    imageMobile:  "/images/hero/hero-river-silence-mobile.jpg",
    imageDesktop: "/images/hero/hero-river-silence-desktop.jpg",
  },
];

export default function HeroSection() {
  const { homepage } = useSiteSettings();

  // Support both old flat shape and new slides array
  const slides = (() => {
    const h = homepage?.hero;
    if (h && Array.isArray(h.slides) && h.slides.length > 0) return h.slides;
    if (h && (h.headlineHi || h.imageMobile)) return [{ id: "legacy", ...h }];
    // Use DB hero images if available
    const imgs = homepage?._heroImages;
    if (Array.isArray(imgs) && imgs.length > 0) {
      return imgs.map((url, i) => ({
        id: `db-${i}`,
        badgeText:    DEFAULT_SLIDES[0].badgeText,
        headlineHi:   DEFAULT_SLIDES[0].headlineHi,
        headlineEn:   DEFAULT_SLIDES[0].headlineEn,
        cta1Text:     DEFAULT_SLIDES[0].cta1Text,
        cta1Link:     DEFAULT_SLIDES[0].cta1Link,
        cta2Text:     DEFAULT_SLIDES[0].cta2Text,
        cta2Link:     DEFAULT_SLIDES[0].cta2Link,
        imageMobile:  url,
        imageDesktop: url,
      }));
    }
    return DEFAULT_SLIDES;
  })();

  const autoPlay  = homepage?.hero?.autoPlay  !== false;
  const interval  = (homepage?.hero?.interval  || 5) * 1000;

  const [idx, setIdx]       = useState(0);
  const [fading, setFading] = useState(false);
  const timerRef            = useRef(null);
  const total               = slides.length;
  const slide               = slides[idx] || slides[0];

  const goTo = useCallback((next) => {
    if (total <= 1) return;
    setFading(true);
    setTimeout(() => {
      setIdx((next + total) % total);
      setFading(false);
    }, 350);
  }, [total]);

  const next = useCallback(() => goTo(idx + 1), [goTo, idx]);
  const prev = useCallback(() => goTo(idx - 1), [goTo, idx]);

  // Auto-play
  useEffect(() => {
    if (!autoPlay || total <= 1) return;
    timerRef.current = setInterval(next, interval);
    return () => clearInterval(timerRef.current);
  }, [autoPlay, interval, next, total]);

  // Touch swipe
  const touchStartX = useRef(null);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd   = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx > 50)  prev();
    if (dx < -50) next();
    touchStartX.current = null;
  };

  const contentStyle = { opacity: fading ? 0 : 1, transition: "opacity 0.35s ease" };
  const imgStyle     = { opacity: fading ? 0 : 1, transition: "opacity 0.35s ease" };

  return (
    <section id="home" className="relative font-sans border-b border-[#EBE2D4] bg-[#FAF8F5] overflow-hidden"
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

      {/* ═══════════════════════════════════════════════════ */}
      {/* MOBILE                                            */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="lg:hidden relative w-full overflow-hidden bg-[#FAF8F5]">
        <div className="relative w-full aspect-[941/1672] min-h-[calc(100svh-64px)] max-h-[920px] flex flex-col justify-between overflow-hidden">

          {/* Background image — fades on slide change */}
          <img
            src={slide.imageMobile || "/images/hero/hero-phone.png"}
            alt=""
            style={imgStyle}
            className="absolute inset-0 w-full h-full object-cover object-top select-none pointer-events-none"
          />
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(250,248,245,0.92)_0%,rgba(250,248,245,0.75)_22%,rgba(250,248,245,0.4)_38%,rgba(250,248,245,0)_58%)] pointer-events-none" />

          {/* Content */}
          <div className="relative z-10 flex flex-col justify-between h-full pt-4 xs:pt-5 pb-3 xs:pb-4 px-3.5 xs:px-4 sm:px-6 md:px-8">

            {/* Top text */}
            <div style={contentStyle}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#EBF2EB]/95 backdrop-blur-md border border-[#CFE0D2] text-[#1B432E] text-[11px] font-semibold shadow-2xs">
                <Sprout className="w-3.5 h-3.5 text-[#2E7A4A] stroke-[2.2]" />
                <span className="tracking-wide">{slide.badgeText || "Rooted in India, For a Better Tomorrow"}</span>
              </div>

              <div className="mt-3.5 space-y-2">
                <h1 className="text-[28px] xs:text-[32px] sm:text-4xl font-devanagari font-bold text-[#0E3824] leading-[1.18] tracking-tight">
                  {(slide.headlineHi || "प्रकृति से जुड़ें\nबेहतर जीवन जिएं").split("\\n").map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </h1>
                <div className="text-[15px] xs:text-[17px] sm:text-xl font-sans font-bold text-[#143B27] leading-[1.28]">
                  {slide.headlineEn || "Ancient Ayurveda. Authentic Yoga. Natural Healing."}
                </div>
                {slide.descHi && (
                  <p className="text-[12.5px] xs:text-[13.5px] text-[#2F543E] font-devanagari font-medium leading-snug">{slide.descHi}</p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-0.5">
                <a href={slide.cta1Link || "/courses"}
                  className="btn-shimmer px-5 xs:px-6 py-3 rounded-full bg-[#103823] hover:bg-[#092215] text-white text-[12.5px] xs:text-[13px] font-semibold shadow-md shadow-[#103823]/25 flex items-center justify-center active:scale-95 transition-all font-sans whitespace-nowrap cursor-pointer">
                  {slide.cta1Text || "Courses"}
                </a>
                {slide.cta2Text && (
                  <a href={slide.cta2Link || "/affiliated-institutes"}
                    className="px-5 xs:px-6 py-3 rounded-full bg-white/90 hover:bg-white text-[#103823] text-[12.5px] xs:text-[13px] font-semibold border border-[#16432B]/20 shadow-sm flex items-center justify-center active:scale-95 transition-all font-sans whitespace-nowrap cursor-pointer">
                    {slide.cta2Text}
                  </a>
                )}
              </div>
            </div>

            {/* Middle calligraphy */}
            <div className="my-auto py-8 xs:py-10 pl-1 select-none">
              <div className="font-calligraphy italic font-bold tracking-wide text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] text-[30px] xs:text-[34px] sm:text-[38px] leading-[1.08]">
                <div className="pl-4">Heal</div>
                <div className="pl-2">Balance</div>
                <div>Transform</div>
              </div>
            </div>

            {/* Bottom stats card + dots */}
            <div className="space-y-3">
              {/* Slide dots */}
              {total > 1 && (
                <div className="flex items-center justify-center gap-2">
                  {slides.map((_, i) => (
                    <button key={i} onClick={() => goTo(i)}
                      className={`rounded-full transition-all duration-300 ${i === idx ? "w-5 h-2 bg-[#0E3320]" : "w-2 h-2 bg-[#0E3320]/30"}`} />
                  ))}
                </div>
              )}

              <div className="rounded-2xl xs:rounded-3xl bg-[#EDF3EB]/95 backdrop-blur-md border border-[#D8E4D5] py-3.5 px-2 xs:px-3 shadow-sm">
                <div className="grid grid-cols-4 items-center font-sans">
                  <div className="text-center border-r border-[#D3DFD1] px-1">
                    <GraduationCap className="w-5 h-5 text-[#1B4B2E] mx-auto stroke-[1.8]" />
                    <div className="text-[15px] xs:text-[17px] font-extrabold text-[#0E3320] leading-none mt-1">500+</div>
                    <div className="text-[9.5px] xs:text-[10.5px] text-[#476B53] font-medium leading-tight mt-0.5">Students</div>
                  </div>
                  <div className="text-center border-r border-[#D3DFD1] px-1">
                    <Building2 className="w-5 h-5 text-[#1B4B2E] mx-auto stroke-[1.8]" />
                    <div className="text-[15px] xs:text-[17px] font-extrabold text-[#0E3320] leading-none mt-1">14+</div>
                    <div className="text-[9.5px] xs:text-[10.5px] text-[#476B53] font-medium leading-tight mt-0.5">Colleges</div>
                  </div>
                  <div className="text-center border-r border-[#D3DFD1] px-1">
                    <BookOpen className="w-5 h-5 text-[#1B4B2E] mx-auto stroke-[1.8]" />
                    <div className="text-[15px] xs:text-[17px] font-extrabold text-[#0E3320] leading-none mt-1">25+</div>
                    <div className="text-[9.5px] xs:text-[10.5px] text-[#476B53] font-medium leading-tight mt-0.5">Courses</div>
                  </div>
                  <div className="text-center px-1">
                    <Award className="w-5 h-5 text-[#1B4B2E] mx-auto stroke-[1.8]" />
                    <div className="text-[15px] xs:text-[17px] font-extrabold text-[#0E3320] leading-none mt-1">10+</div>
                    <div className="text-[9.5px] xs:text-[10.5px] text-[#476B53] font-medium leading-tight mt-0.5">Yrs Excellence</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════ */}
      {/* DESKTOP                                           */}
      {/* ═══════════════════════════════════════════════════ */}
      <div className="hidden lg:flex min-h-[640px] lg:min-h-[720px] items-center relative overflow-hidden">

        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <img
            src={slide.imageDesktop || "/images/hero/hero-meditation.jpg"}
            alt=""
            style={imgStyle}
            className="w-full h-full object-cover object-[78%_center] transform scale-105 transition-transform duration-1000 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/85 md:via-[#FAF8F5]/60 to-transparent w-[58%]" />
          <div className="absolute inset-0 bg-[#0E3320]/5 pointer-events-none" />
        </div>

        {/* Leaf accents */}
        <div className="absolute top-0 left-0 w-48 h-48 pointer-events-none z-10 opacity-70 animate-sway-slow">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#1E5C3B] fill-current">
            <path d="M0,0 Q30,10 40,40 Q20,30 0,0 M10,0 Q40,20 50,60 Q30,40 10,0 M0,20 Q30,40 35,80 Q15,50 0,20" opacity="0.65" />
          </svg>
        </div>
        <div className="absolute bottom-0 left-0 w-44 h-44 pointer-events-none z-10 opacity-60 animate-float-gentle">
          <svg viewBox="0 0 100 100" className="w-full h-full text-[#15462D] fill-current">
            <path d="M0,100 Q20,70 50,60 Q30,85 0,100 M0,80 Q35,60 70,50 Q40,80 0,80" opacity="0.55" />
          </svg>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto px-8 py-12 xl:py-16 relative z-20 w-full">
          <div className="grid grid-cols-12 gap-8 items-center">

            {/* Left text */}
            <div className="col-span-7 xl:col-span-6 space-y-6 max-w-xl" style={contentStyle}>
              <Reveal direction="down" delay={100}>
                <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/95 backdrop-blur-sm border border-[#D8CABE] text-[#1B432E] text-xs sm:text-sm font-semibold shadow-sm font-sans hover:shadow-md transition-shadow">
                  <Flower2 className="w-4 h-4 text-[#2E7A4A] stroke-[2] animate-spin" style={{ animationDuration: "12s" }} />
                  <span className="tracking-wide">{slide.badgeText || "Rooted in India, For a Better Tomorrow"}</span>
                </div>
              </Reveal>

              <Reveal direction="up" delay={200}>
                <div className="space-y-3.5">
                  <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-devanagari font-bold text-[#0E3320] leading-[1.2] tracking-tight">
                    {(slide.headlineHi || "प्रकृति से जुड़ें\nबेहतर जीवन जिएं").split("\\n").map((line, i, arr) => (
                      <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                    ))}
                  </h1>
                  <div className="text-xl sm:text-2xl lg:text-[26px] font-sans font-bold text-[#143B27] leading-snug">
                    {slide.headlineEn || "Ancient Ayurveda. Authentic Yoga. Natural Healing. A Healthier, Happier You."}
                  </div>
                  {slide.descHi && (
                    <div className="text-sm sm:text-base text-[#33563F] font-devanagari leading-relaxed font-semibold">
                      <p>{slide.descHi}</p>
                      {slide.descEn && <p className="font-sans text-[#4D6E59] text-xs sm:text-sm font-semibold mt-1">{slide.descEn}</p>}
                    </div>
                  )}
                </div>
              </Reveal>

              <Reveal direction="up" delay={350}>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <a href={slide.cta1Link || "/courses"}
                    className="btn-shimmer px-7 py-3.5 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-base font-semibold shadow-md hover:shadow-xl hover:shadow-[#0E3320]/20 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center transition-all font-sans whitespace-nowrap cursor-pointer">
                    {slide.cta1Text || "Courses"}
                  </a>
                  {slide.cta2Text && (
                    <a href={slide.cta2Link || "/affiliated-institutes"}
                      className="btn-shimmer px-7 py-3.5 rounded-full bg-white/95 hover:bg-[#FAF8F5] text-[#0E3320] text-base font-semibold border border-[#D5C7B7] shadow-sm hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center transition-all font-sans cursor-pointer whitespace-nowrap">
                      {slide.cta2Text}
                    </a>
                  )}
                </div>
              </Reveal>

              <Reveal direction="up" delay={450}>
                <div className="pt-6 grid grid-cols-4 gap-5 max-w-xl font-sans">
                  <div className="border-r border-[#D9CDBF] pr-2 hover:-translate-y-1 transition-transform cursor-default">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0E3320]">500+</div>
                    <div className="text-xs sm:text-sm text-[#52725D] font-medium leading-tight">Registered Students</div>
                  </div>
                  <div className="border-r border-[#D9CDBF] pr-2 hover:-translate-y-1 transition-transform cursor-default">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0E3320]">14+</div>
                    <div className="text-xs sm:text-sm text-[#52725D] font-medium leading-tight">Affiliated Colleges</div>
                  </div>
                  <div className="border-r border-[#D9CDBF] pr-2 hover:-translate-y-1 transition-transform cursor-default">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0E3320]">25+</div>
                    <div className="text-xs sm:text-sm text-[#52725D] font-medium leading-tight">Courses Offered</div>
                  </div>
                  <div className="hover:-translate-y-1 transition-transform cursor-default">
                    <div className="text-2xl sm:text-3xl font-extrabold text-[#0E3320]">10+</div>
                    <div className="text-xs sm:text-sm text-[#52725D] font-medium leading-tight">Years of Excellence</div>
                  </div>
                </div>
              </Reveal>
            </div>

            {/* Right: calligraphy */}
            <div className="col-span-5 xl:col-span-6 relative h-[480px] pointer-events-none select-none">
              <Reveal direction="left" delay={300}
                className="absolute top-8 right-0 lg:right-2 text-right font-calligraphy">
                <div>
                  <div className="text-5xl lg:text-[68px] font-bold tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] leading-[1.05]">Heal</div>
                  <div className="text-5xl lg:text-[68px] font-bold tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] leading-[1.05]">Balance</div>
                  <div className="text-5xl lg:text-[68px] font-bold tracking-wide text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.65)] leading-[1.05]">Transform</div>
                </div>
              </Reveal>
            </div>
          </div>
        </div>

        {/* Desktop: prev/next arrows + dots */}
        {total > 1 && (
          <>
            <button onClick={prev}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[#DDD1BE] shadow-md flex items-center justify-center text-[#0E3320] hover:scale-110 transition-all">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-10 h-10 rounded-full bg-white/80 hover:bg-white border border-[#DDD1BE] shadow-md flex items-center justify-center text-[#0E3320] hover:scale-110 transition-all">
              <ChevronRight className="w-5 h-5" />
            </button>
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
              {slides.map((_, i) => (
                <button key={i} onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${i === idx ? "w-6 h-2.5 bg-[#0E3320]" : "w-2.5 h-2.5 bg-[#0E3320]/30 hover:bg-[#0E3320]/60"}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
