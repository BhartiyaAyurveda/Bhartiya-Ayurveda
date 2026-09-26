"use client";

import Image from "next/image";
import { MapPin, Phone, Mail, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export default function Footer() {
  return (
    <footer id="contact" className="relative bg-[#071F13] text-[#CBD8CB] pt-14 pb-8 px-4 md:px-8 border-t border-[#143B27] font-sans overflow-hidden print:hidden">
      {/* Decorative leaves accent behind slogan */}
      <div className="block absolute bottom-4 right-3 md:right-6 w-24 sm:w-36 md:w-48 lg:w-56 pointer-events-none select-none z-0 opacity-40">
        <img src="/images/leaves.png" alt="" className="w-full h-auto object-contain" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-[#143B27]">
          
          {/* Brand Info (Full on mobile, 2 cols on tablet/desktop) */}
          <div className="col-span-1 sm:col-span-2 space-y-4">
            <div className="relative w-40 h-14 bg-white/95 rounded-lg px-2 py-1.5">
              <Image src="/logo.png" alt="Bhartiya Ayurveda" fill sizes="160px" className="object-contain" style={{ padding: "0.375rem" }} />
            </div>

            <div className="p-4 bg-[#0E3320]/70 rounded-2xl border border-[#143B27] max-w-sm">
              <p className="font-devanagari text-sm sm:text-base text-[#E4BF64] font-bold">
                स्वस्थ शरीर • समृद्ध समाज • समृद्ध भारत
              </p>
              <p className="text-xs sm:text-sm text-[#A8C2AF] mt-1.5 font-normal font-sans">
                Healthy People • Harmonious Society • Diverse Tomorrow
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <h4 className="text-[15px] font-sans font-bold text-white uppercase tracking-wider">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-[14.5px] text-[#A8C2AF] font-normal">
              <li><a href="/" className="hover:text-white transition-colors">Home</a></li>
              <li><a href="/affiliated-institutes" className="hover:text-white transition-colors">Affiliated Institutes</a></li>
              <li><a href="/gallery" className="hover:text-white transition-colors">Photo Gallery</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
              <li><a href="/courses" className="hover:text-white transition-colors">Our Courses</a></li>
            </ul>
          </div>

          {/* Admissions & Students */}
          <div className="space-y-3.5">
            <h4 className="text-[15px] font-sans font-bold text-white uppercase tracking-wider">
              Students & Admissions
            </h4>
            <ul className="space-y-2.5 text-sm sm:text-[14.5px] text-[#A8C2AF] font-normal">
              <li><a href="/admissions/registration-form" className="hover:text-[#E4BF64] transition-colors">Registration Form</a></li>
              <li><a href="/students/registration" className="hover:text-[#E4BF64] transition-colors">Student Registration</a></li>
              <li><a href="/students/login" className="hover:text-[#E4BF64] transition-colors">Student Login</a></li>
              <li><a href="/students/results" className="hover:text-[#E4BF64] transition-colors">Examination Results</a></li>
              <li><a href="/certificate-verification" className="hover:text-[#E4BF64] transition-colors">Certificate Verification</a></li>
              <li><a href="/affiliated-institutes" className="hover:text-[#E4BF64] transition-colors">Approved Colleges</a></li>
              <li><a href="/super-admin/login" className="hover:text-[#E4BF64] transition-colors text-[#E4BF64]/90 font-medium">Super Admin Login</a></li>
            </ul>
          </div>

          {/* Our Programs */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-sans font-bold text-white uppercase tracking-wider">
              Programs & Retreats
            </h4>
            <ul className="space-y-2 text-[13px] text-[#A8C2AF] font-normal">
              <li><a href="/#programs" className="hover:text-white transition-colors">Ayurveda Retreats</a></li>
              <li><a href="/#programs" className="hover:text-white transition-colors">Yoga Programs</a></li>
              <li><a href="/#programs" className="hover:text-white transition-colors">Naturopathy Courses</a></li>
              <li><a href="/#programs" className="hover:text-white transition-colors">Wellness Retreats</a></li>
              <li><a href="/#faq" className="hover:text-white transition-colors">FAQs & Guidance</a></li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-sans font-bold text-white uppercase tracking-wider">
              Contact Us
            </h4>
            <ul className="space-y-2.5 text-[13px] text-[#A8C2AF] font-normal">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C59B3F] shrink-0 mt-0.5" />
                <span>Rishikesh, Uttarakhand, India</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C59B3F] shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C59B3F] shrink-0" />
                <a href="mailto:hello@bhartiyaayurveda.in" className="hover:text-white">hello@bhartiyaayurveda.in</a>
              </li>
            </ul>

            {/* Social Icons */}
            <div className="flex items-center gap-2.5 pt-2">
              <a href="#" className="w-7 h-7 rounded-full bg-[#0E3320] flex items-center justify-center text-[#CBD8CB] hover:text-[#C59B3F] transition-colors" aria-label="Twitter">
                <Twitter className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-[#0E3320] flex items-center justify-center text-[#CBD8CB] hover:text-[#C59B3F] transition-colors" aria-label="Instagram">
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-[#0E3320] flex items-center justify-center text-[#CBD8CB] hover:text-[#C59B3F] transition-colors" aria-label="YouTube">
                <Youtube className="w-3.5 h-3.5" />
              </a>
              <a href="#" className="w-7 h-7 rounded-full bg-[#0E3320] flex items-center justify-center text-[#CBD8CB] hover:text-[#C59B3F] transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Slogan on Right */}
            <div className="pt-3 font-calligraphy text-lg relative z-10">
              <div className="text-white">
                Good Health
              </div>
              <div className="text-[#C59B3F] mt-0.5">
                Brighter Tomorrow
              </div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#7A9983] font-normal text-center sm:text-left">
          <div>
            © 2026 Bhartiya Ayurveda. All rights reserved.
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a href="#" className="hover:text-[#CBD8CB] transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-[#CBD8CB] transition-colors">Terms & Conditions</a>
            <span>|</span>
            <a href="#" className="hover:text-[#CBD8CB] transition-colors">Sitemap</a>
          </div>

          <div>
            Made with <span className="text-red-500">❤️</span> for a healthier India
          </div>
        </div>

      </div>
    </footer>
  );
}
