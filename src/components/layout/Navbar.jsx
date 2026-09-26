"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Search, ArrowRight, Menu, X, ChevronDown } from "lucide-react";

export default function Navbar({ onOpenConsultation }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [admissionsDropdown, setAdmissionsDropdown] = useState(false);
  const [studentsDropdown, setStudentsDropdown] = useState(false);
  const [mobileAdmissionsOpen, setMobileAdmissionsOpen] = useState(false);
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

  const isAdmissionsActive = pathname?.startsWith("/admissions");
  const isStudentsActive = pathname?.startsWith("/students");
  const isCoursesActive = pathname === "/courses" || pathname === "/academics";
  const isInstitutesActive = pathname === "/affiliated-institutes";
  const isCertActive = pathname === "/certificate-verification";
  const isGalleryActive = pathname === "/gallery";
  const isAboutActive = pathname === "/about";
  const isContactActive = pathname === "/contact";
  const isHomeActive = pathname === "/";

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 bg-white print:hidden ${
        isScrolled
          ? "shadow-md border-b border-[#DFD3C0] py-2.5 sm:py-3"
          : "border-b border-[#EBE2D4] py-3.5"
      } px-4 md:px-8`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group min-w-0 shrink-0">
          <div className="relative w-36 h-12 sm:w-44 sm:h-14 shrink-0">
            <Image src="/logo.png" alt="Bhartiya Ayurveda" fill sizes="176px" className="object-contain object-left" priority />
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-7 text-[16px] font-semibold">
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

          {/* Admissions Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setAdmissionsDropdown(true)}
            onMouseLeave={() => setAdmissionsDropdown(false)}
          >
            <button
              onClick={() => setAdmissionsDropdown(!admissionsDropdown)}
              className={`flex items-center gap-1.5 py-1 font-semibold transition-all relative ${
                isAdmissionsActive
                  ? "text-[#1A5C38] border-b-2 border-[#1A5C38]"
                  : "text-[#882424] hover:text-[#1A5C38]"
              }`}
            >
              <span>Admissions</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  admissionsDropdown ? "rotate-180" : ""
                } ${isAdmissionsActive ? "text-[#1A5C38]" : "text-[#7A9983]"}`}
              />
            </button>

            {/* Dropdown Menu Box */}
            {admissionsDropdown && (
              <div className="absolute top-full left-0 pt-2 z-50 animate-in fade-in-50 slide-in-from-top-1">
                <div className="w-56 bg-white rounded-md shadow-xl border border-[#EBE2D4] py-3 px-1">
                  <Link
                    href="/admissions/registration-form"
                    onClick={() => setAdmissionsDropdown(false)}
                    className="block px-5 py-2 text-[15px] font-semibold text-[#882424] hover:text-[#1A5C38] hover:bg-[#FAF8F5] transition-colors rounded"
                  >
                    Registration Form
                  </Link>
                </div>
              </div>
            )}
          </div>

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
                    href="/students/registration"
                    onClick={() => setStudentsDropdown(false)}
                    className="block px-5 py-2 text-[15px] font-semibold text-[#882424] hover:text-[#1A5C38] hover:bg-[#FAF8F5] transition-colors rounded"
                  >
                    Registration
                  </Link>
                  <Link
                    href="/students/login"
                    onClick={() => setStudentsDropdown(false)}
                    className="block px-5 py-2 text-[15px] font-semibold text-[#882424] hover:text-[#1A5C38] hover:bg-[#FAF8F5] transition-colors rounded"
                  >
                    Login
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
            Institutes
          </Link>

          {/* Certificate Verification */}
          <Link
            href="/certificate-verification"
            className={`py-1 transition-colors relative whitespace-nowrap ${
              isCertActive
                ? "text-[#1A5C38] border-b-2 border-[#1A5C38]"
                : "text-[#882424] hover:text-[#1A5C38]"
            }`}
          >
            Verification
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

        {/* Right CTA & Search */}
        <div className="flex items-center gap-1.5 sm:gap-4 shrink-0">
          <button
            className="hidden sm:flex p-2 sm:p-2.5 text-[#1A452E] hover:text-[#B96647] transition-colors rounded-full hover:bg-black/5"
            aria-label="Search"
          >
            <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
          </button>

          <button
            onClick={onOpenConsultation}
            className="btn-shimmer hidden sm:inline-flex items-center gap-2 px-5 lg:px-6 py-2.5 lg:py-3 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-xs lg:text-[14px] font-semibold shadow hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-[#E4BF64] animate-ping-soft"></span>
            <span>Book a Consultation</span>
          </button>

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

          {/* Mobile Admissions Accordion */}
          <div>
            <button
              onClick={() => setMobileAdmissionsOpen(!mobileAdmissionsOpen)}
              className="w-full flex items-center justify-between px-4 py-3 text-base text-[#882424] font-semibold hover:bg-[#EBE2D4]/50 rounded-lg"
            >
              <span>Admissions</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform duration-200 ${
                  mobileAdmissionsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {mobileAdmissionsOpen && (
              <div className="pl-6 pr-2 py-1 space-y-1 bg-white/70 rounded-xl mx-3 my-1 border border-[#EBE2D4]">
                <Link
                  href="/admissions/registration-form"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-[#882424] hover:text-[#0E3320] font-semibold"
                >
                  Registration Form
                </Link>
              </div>
            )}
          </div>

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
                  href="/students/registration"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-[#882424] hover:text-[#0E3320] font-semibold"
                >
                  Student Registration
                </Link>
                <Link
                  href="/students/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2.5 text-sm text-[#882424] hover:text-[#0E3320] font-semibold"
                >
                  Student Login
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
            href="/certificate-verification"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-4 py-3 text-base font-semibold rounded-lg transition-colors ${
              isCertActive
                ? "bg-[#1A5C38]/10 text-[#1A5C38]"
                : "text-[#882424] hover:bg-[#EBE2D4]/50"
            }`}
          >
            Certificate Verification
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
                onOpenConsultation();
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
