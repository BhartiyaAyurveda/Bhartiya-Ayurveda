"use client";

import { useState, useEffect } from "react";
import { ArrowUp, Calendar } from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/sections/HeroSection";
import PillarsSection from "@/components/sections/PillarsSection";
import AboutAyurvedaSection from "@/components/sections/AboutAyurvedaSection";
import YogaSection from "@/components/sections/YogaSection";
import NaturopathySection from "@/components/sections/NaturopathySection";
import ProgramsSection from "@/components/sections/ProgramsSection";
import DoshasSection from "@/components/sections/DoshasSection";
import WhyChooseSection from "@/components/sections/WhyChooseSection";
import AcharyasAndTestimonialsSection from "@/components/sections/AcharyasAndTestimonialsSection";
import ArticlesAndFaqSection from "@/components/sections/ArticlesAndFaqSection";
import CtaBannerSection from "@/components/sections/CtaBannerSection";
import ConsultationModal from "@/components/ui/ConsultationModal";
import VideoModal from "@/components/ui/VideoModal";

export default function Home() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const openConsultation = () => setIsConsultationOpen(true);
  const openVideo = () => setIsVideoOpen(true);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E3320] selection:bg-[#C59B3F] selection:text-white relative">
      {/* 1. Top Bar */}
      <TopBar />

      {/* 2. Sticky Navbar */}
      <Navbar onOpenConsultation={openConsultation} />

      {/* 3. Hero Section */}
      <HeroSection
        onOpenConsultation={openConsultation}
        onOpenVideo={openVideo}
      />

      {/* 4. Four Pillars & Right Quote */}
      <PillarsSection />

      {/* 5. About Ayurveda (Mortar + Text + Sage) */}
      <AboutAyurvedaSection onOpenConsultation={openConsultation} />

      {/* 6. Yoga Section with Mountain Panorama */}
      <YogaSection onOpenConsultation={openConsultation} />

      {/* 7. Naturopathy Section (6 Circles + Quote) */}
      <NaturopathySection />

      {/* 8. Popular Programs (Deep Forest Green, 4 Cards) */}
      <ProgramsSection onOpenConsultation={openConsultation} />

      {/* 9. The Three Doshas (3 Pastel Cards + Charaka Samhita Quote) */}
      <DoshasSection />

      {/* 10. Why Choose Bhartiya Ayurveda (5 Circles + Leaves Video Card) */}
      <WhyChooseSection onOpenVideo={openVideo} />

      {/* 11. Side-by-Side: Meet Our Acharyas (4 cards) & What People Say (Priya Patel review) */}
      <AcharyasAndTestimonialsSection onOpenConsultation={openConsultation} />

      {/* 12. Side-by-Side: Latest Articles (3 cards) & Frequently Asked Questions (5 accordion items) */}
      <ArticlesAndFaqSection onOpenConsultation={openConsultation} />

      {/* 13. CTA Banner: Mountain Landscape + Slogan */}
      <CtaBannerSection onOpenConsultation={openConsultation} />

      {/* 14. Rich Emerald 6-Column Footer */}
      <Footer />

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-3 pointer-events-none">
        {/* Scroll To Top Button */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="pointer-events-auto w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white/95 hover:bg-white text-[#0E3320] border border-[#D5C7B7] shadow-lg flex items-center justify-center hover:scale-110 active:scale-90 transition-all duration-300 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5 text-[#0E3320]" />
          </button>
        )}
      </div>

      {/* Interactive Modals */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
    </main>
  );
}
