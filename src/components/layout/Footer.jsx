"use client";

import Image from "next/image";
import { MapPin, Phone, Mail, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-[#F5F0E8] text-[#2E4A38] pt-14 pb-8 px-4 md:px-8 border-t border-[#E6DDCE] font-sans overflow-hidden print:hidden">
      {/* Decorative leaves accent behind slogan */}
      <div className="block absolute bottom-4 right-3 md:right-6 w-24 sm:w-36 md:w-48 lg:w-56 pointer-events-none select-none z-0 opacity-50">
        <img src="/images/leaves.png" alt="" className="w-full h-auto object-contain" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">

        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-[#E6DDCE]">

          {/* Brand Info (Full on mobile, 2 cols on tablet/desktop) */}
          <div className="col-span-1 sm:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white shadow-md shrink-0 border border-[#E4DAC9]">
                <Image src="/logo.png" alt="Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad" fill sizes="96px" className="object-cover" />
              </div>
              <div className="min-w-0">
                <span className="block font-devanagari text-base sm:text-lg font-bold text-[#0E3320] tracking-tight leading-tight">
                  भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्
                </span>
                <span className="block text-xs sm:text-sm text-[#8C671D] font-semibold tracking-wide mt-0.5">
                  Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
                </span>
              </div>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-[#E4DAC9] max-w-sm shadow-sm">
              <p className="font-devanagari text-sm sm:text-base text-[#0E3320] font-bold">
                स्वस्थ शरीर • समृद्ध समाज • समृद्ध भारत
              </p>
              <p className="text-xs sm:text-sm text-[#2E4A38] mt-1.5 font-normal font-sans">
                Healthy People • Harmonious Society • Diverse Tomorrow
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <h4 className="text-[15px] font-sans font-bold text-[#0E3320] uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-[14.5px] text-[#2E4A38] font-normal">
              <li><a href="/" className="hover:text-[#0E3320] transition-colors">Home</a></li>
              <li><a href="/affiliated-institutes" className="hover:text-[#0E3320] transition-colors">Affiliated Institutes</a></li>
              <li><a href="/gallery" className="hover:text-[#0E3320] transition-colors">Photo Gallery</a></li>
              <li><a href="/about" className="hover:text-[#0E3320] transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-[#0E3320] transition-colors">Contact</a></li>
              <li><a href="/courses" className="hover:text-[#0E3320] transition-colors">Our Courses</a></li>
            </ul>
          </div>

          {/* Admissions & Students */}
          <div className="space-y-3.5">
            <h4 className="text-[15px] font-sans font-bold text-[#0E3320] uppercase tracking-wider">
              Students & Admissions
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-[14.5px] text-[#2E4A38] font-normal">
              <li><a href="/admissions/registration-form" className="hover:text-[#8C671D] transition-colors">Registration Form</a></li>
              <li><a href="/students/registration" className="hover:text-[#8C671D] transition-colors">Student Registration</a></li>
              <li><a href="/students/login" className="hover:text-[#8C671D] transition-colors">Student Login</a></li>
              <li><a href="/students/results" className="hover:text-[#8C671D] transition-colors">Examination Results</a></li>
              <li><a href="/certificate-verification" className="hover:text-[#8C671D] transition-colors">Certificate Verification</a></li>
              <li><a href="/affiliated-institutes" className="hover:text-[#8C671D] transition-colors">Approved Colleges</a></li>
              <li><a href="/super-admin/login" className="hover:text-[#8C671D] transition-colors text-[#8C671D] font-medium">Super Admin Login</a></li>
            </ul>
          </div>

          {/* Our Programs */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-sans font-bold text-[#0E3320] uppercase tracking-wider">
              Programs & Retreats
            </h4>
            <ul className="space-y-2 text-[13px] text-[#2E4A38] font-normal">
              <li><a href="/#programs" className="hover:text-[#0E3320] transition-colors">Ayurveda Retreats</a></li>
              <li><a href="/#programs" className="hover:text-[#0E3320] transition-colors">Yoga Programs</a></li>
              <li><a href="/#programs" className="hover:text-[#0E3320] transition-colors">Naturopathy Courses</a></li>
              <li><a href="/#programs" className="hover:text-[#0E3320] transition-colors">Wellness Retreats</a></li>
              <li><a href="/#programs" className="hover:text-[#0E3320] transition-colors">Electro-Homeopathy Courses</a></li>
              <li><a href="/#faq" className="hover:text-[#0E3320] transition-colors">FAQs & Guidance</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-sans font-bold text-[#0E3320] uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#2E4A38] font-normal">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C59B3F] shrink-0 mt-0.5" />
                <span>Rishikesh, Uttarakhand, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C59B3F] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-[#0E3320]">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C59B3F] shrink-0" />
                <a href="mailto:hello@bhartiyaayurveda.in" className="hover:text-[#0E3320]">hello@bhartiyaayurveda.in</a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a href="#" className="w-7 h-7 rounded-full bg-[#EAE2D3] flex items-center justify-center text-[#0E3320] hover:bg-[#C59B3F]/20 hover:text-[#8C671D] transition-colors" aria-label="Twitter">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-[#EAE2D3] flex items-center justify-center text-[#0E3320] hover:bg-[#C59B3F]/20 hover:text-[#8C671D] transition-colors" aria-label="Instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-[#EAE2D3] flex items-center justify-center text-[#0E3320] hover:bg-[#C59B3F]/20 hover:text-[#8C671D] transition-colors" aria-label="YouTube">
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-[#EAE2D3] flex items-center justify-center text-[#0E3320] hover:bg-[#C59B3F]/20 hover:text-[#8C671D] transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Slogan on Right */}
            <div className="pt-3 font-calligraphy text-lg relative z-10">
              <div className="text-[#0E3320]">
                Good Health
              </div>
              <div className="text-[#8C671D] mt-0.5">
                Brighter Tomorrow
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#5C6B60] font-normal text-center sm:text-left">
          <div>
            © 2026 Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a href="#" className="hover:text-[#0E3320] transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-[#0E3320] transition-colors">Terms & Conditions</a>
            <span>|</span>
            <a href="#" className="hover:text-[#0E3320] transition-colors">Sitemap</a>
          </div>

          <div>
            Made with <span className="text-red-500">❤️</span> for a healthier India
          </div>
        </div>

      </div>
    </footer>
  );
}
