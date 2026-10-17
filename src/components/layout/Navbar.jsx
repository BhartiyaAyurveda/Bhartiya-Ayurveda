"use client";

// Navigation bar component

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X, ChevronDown } from "lucide-react";

export default function Navbar({ onOpenConsultation }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [studentsDropdown, setStudentsDropdown] = useState(false);
  const [mobileStudentsOpen, setMobileStudentsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isStudentsActive = pathname?.startsWith("/students");
  const isCoursesActive = pathname === "/courses" || pathname === "/academics";
  const isInstitutesActive = pathname === "/affiliated-institutes";
  const isGalleryActive = pathname === "/gallery";
  const isAnnouncementsActive = pathname?.startsWith("/announcements");

  const isAboutActive = pathname === "/about";
  const isContactActive = pathname === "/contact";
  const isHomeActive = pathname === "/";

  return (
    <header
      className={`sticky top-0 lg:top-9 z-50 transition-all duration-300 bg-white print:hidden ${
        isScrolled
          ? "shadow-md border-b border-[#DFD3C0] py-1.5 sm:py-1.5 lg:py-1"
          : "border-b border-[#EBE2D4] py-2 sm:py-2 lg:py-1.5"
      } px-4 md:px-8`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-start lg:justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 sm:gap-3 group min-w-0 flex-1 lg:flex-initial lg:shrink-0 lg:ml-6 xl:ml-10 mr-1.5">
          <div className="relative w-9 h-9 xs:w-11 xs:h-11 sm:w-20 sm:h-20 shrink-0 rounded-full overflow-hidden">
            <Image src="/logo.png" alt="Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad" fill sizes="80px" className="object-cover" priority />
          </div>
          <div className="lg:hidden min-w-0 flex-1">
            <span className="block font-devanagari text-[11px] xs:text-[13px] font-bold text-[#0E3320] leading-tight">
              भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्
            </span>
            <span className="block font-sans text-[9px] xs:text-[11px] font-semibold text-[#8C671D] leading-tight">
              Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
            </span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-3.5 xl:gap-6 text-[15px] xl:text-[16px] font-semibold shrink min-w-0">
          {/* Home */}
          <Link
            href="/"
            className={`py-1 transition-colors relative ${
              isHomeActive
                ? "text-[#1A5C38] border-b-2 border-[#1A5C38]"
                : "text-[#882424] hover:text-[#1A5C38]"
            }`}
          >
            Home
          </Link>

          {/* Students Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setStudentsDropdown(true)}
            onMouseLeave={() => setStudentsDropdown(false)}
          >
            <button
              onClick={() => setStudentsDropdown(!studentsDropdown)}
              className={`flex items-center gap-1.5 py-1 font-semibold transition-all relative ${
                isStudentsActive
                  ? "text-[#1A5C38] border-b-2 border-[#1A5C38]"
                  : "text-[#882424] hover:text-[#1A5C38]"
              }`}
            >
              <span>Students</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  studentsDropdown ? "rotate-180" : ""
                } ${isStudentsActive ? "text-[#1A5C38]" : "text-[#7A9983]"}`}
              />
            </button>

            {/* Dropdown Menu Box */}
            {studentsDropdown && (
              <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in-50 slide-in-from-top-1">
                <div className="w-56 bg-white rounded-md shadow-xl border border-[#EBE2D4] py-3 px-1 space-y-1">
                  <Link
                    href="/students/admit-card"
                    onClick={() => setStudentsDropdown(false)}
                    className="block px-5 py-2 text-[15px] font-semibold text-[#882424] hover:text-[#1A5C38] hover:bg-[#FAF8F5] transition-colors rounded"
                  >
                    Admit Card
                  </Link>
                  <Link
                    href="/students/results"
                    onClick={() => setStudentsDropdown(false)}
                    className="block px-5 py-2 text-[15px] font-semibold text-[#882424] hover:text-[#1A5C38] hover:bg-[#FAF8F5] transition-colors rounded"
                  >
                    Results
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Courses */}
          <Link
            href="/courses"
            className={`py-1 transition-colors relative ${
              isCoursesActive
                ? "text-[#1A5C38] border-b-2 border-[#1A5C38]"
                : "text-[#882424] hover:text-[#1A5C38]"
            }`}
          >
            Courses
          </Link>

          {/* Institutes */}
          <Link
            href="/affiliated-institutes"
            className={`py-1 transition-colors relative ${
              isInstitutesActive
                ? "text-[#1A5C38] border-b-2 border-[#1A5C38]"
                : "text-[#882424] hover:text-[#1A5C38]"
            }`}
          >
            Affiliated Institutes
          </Link>

          {/* Gallery */}
          <Link
            href="/gallery"
            className={`py-1 transition-colors relative ${
              isGalleryActive
                ? "text-[#1A5C38] border-b-2 border-[#1A5C38]"
                : "text-[#882424] hover:text-[#1A5C38]"
            }`}
          >
            Gallery
          </Link>

          {/* Notices */}
          <Link
            href="/announcements"
            className={`py-1 transition-colors relative ${
              isAnnouncementsActive
                ? "text-[#1A5C38] border-b-2 border-[#1A5C38]"
                : "text-[#882424] hover:text-[#1A5C38]"
            }`}
          >
            Notices
          </Link>

          {/* About */}
          <Link
            href="/about"
            className={`py-1 transition-colors relative ${
              isAboutActive
                ? "text-[#1A5C38] border-b-2 border-[#1A5C38]"
                : "text-[#882424] hover:text-[#1A5C38]"
            }`}
          >
            About
          </Link>

          {/* Contact */}
          <Link
            href="/contact"
            className={`py-1 transition-colors relative ${
              isContactActive
                ? "text-[#1A5C38] border-b-2 border-[#1A5C38]"
                : "text-[#882424] hover:text-[#1A5C38]"
            }`}
          >
            Contact
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 lg:gap-4 shrink-0">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-full bg-[#FAF7F2] hover:bg-[#F0EAE1] border border-[#E5DDD1] flex items-center justify-center text-[#0E3320] shadow-xs active:scale-95 transition-all cursor-pointer"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X className="w-5 h-5 stroke-[2.2]" /> : <Menu className="w-5 h-5 stroke-[2.2]" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Backdrop */}
      <div
        onClick={() => setMobileMenuOpen(false)}
        className={`lg:hidden fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Mobile Sidebar Panel */}
      <div
        className={`lg:hidden fixed top-0 right-0 h-full w-[82%] max-w-xs bg-[#FAF8F5] z-50 shadow-2xl overflow-y-auto overscroll-contain transform transition-transform duration-300 ease-out ${
          mobileMenuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-[#EBE2D4] sticky top-0 bg-[#FAF8F5] z-10">
            <span className="font-bold text-[#0E3320] text-lg">Menu</span>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 rounded-lg text-[#0E3320] hover:bg-[#EBE2D4]/60 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-3 pb-6 px-1 space-y-1">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
              isHomeActive
                ? "bg-[#1A5C38]/10 text-[#1A5C38]"
                : "text-[#0E3320] hover:bg-[#EBE2D4]/50"
            }`}
          >
            Home
          </Link>

          {/* Mobile Students Accordion */}
          <div>
            <button
              onClick={() => setMobileStudentsOpen(!mobileStudentsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-base text-[#882424] font-semibold hover:bg-[#EBE2D4]/50 rounded-lg"
            >
              <span>Students</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileStudentsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobileStudentsOpen && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-white/70 rounded-xl mx-3 my-1 border border-[#EBE2D4]">
                <Link
                  href="/students/admit-card"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-[#882424] hover:text-[#0E3320] font-semibold"
                >
                  Admit Card
                </Link>
                <Link
                  href="/students/results"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-[#882424] hover:text-[#0E3320] font-semibold"
                >
                  Examination Results
                </Link>
              </div>
            )}
          </div>

          <Link
            href="/courses"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
              isCoursesActive
                ? "bg-[#1A5C38]/10 text-[#1A5C38]"
                : "text-[#882424] hover:bg-[#EBE2D4]/50"
            }`}
          >
            Academic Courses
          </Link>

          <Link
            href="/affiliated-institutes"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
              isInstitutesActive
                ? "bg-[#1A5C38]/10 text-[#1A5C38]"
                : "text-[#882424] hover:bg-[#EBE2D4]/50"
            }`}
          >
            Affiliated Institutes
          </Link>

          <Link
            href="/gallery"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
              isGalleryActive
                ? "bg-[#1A5C38]/10 text-[#1A5C38]"
                : "text-[#882424] hover:bg-[#EBE2D4]/50"
            }`}
          >
            Photo Gallery
          </Link>

          <Link
            href="/announcements"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
              isAnnouncementsActive
                ? "bg-[#1A5C38]/10 text-[#1A5C38]"
                : "text-[#882424] hover:bg-[#EBE2D4]/50"
            }`}
          >
            Notices &amp; Announcements
          </Link>

          <Link
            href="/about"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
              isAboutActive
                ? "bg-[#1A5C38]/10 text-[#1A5C38]"
                : "text-[#882424] hover:bg-[#EBE2D4]/50"
            }`}
          >
            About Us
          </Link>

          <Link
            href="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
              isContactActive
                ? "bg-[#1A5C38]/10 text-[#1A5C38]"
                : "text-[#882424] hover:bg-[#EBE2D4]/50"
            }`}
          >
            Contact
          </Link>

          <div className="pt-3 px-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenConsultation?.();
              }}
              className="w-full py-3.5 rounded-full bg-[#0E3320] text-white text-sm font-semibold shadow-md cursor-pointer hover:bg-[#071F13] transition-colors"
            >
              Book a Consultation
            </button>
          </div>
          </div>
      </div>
    </header>
  );
}
