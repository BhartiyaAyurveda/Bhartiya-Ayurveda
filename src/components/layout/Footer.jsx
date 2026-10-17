"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Twitter, Instagram, Youtube, Linkedin, Facebook, MessageCircle, Send, Share2 } from "lucide-react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

const SOCIAL_ICONS = {
  twitter:   <Twitter   className="w-3.5 h-3.5" />,
  instagram: <Instagram className="w-3.5 h-3.5" />,
  youtube:   <Youtube   className="w-3.5 h-3.5" />,
  linkedin:  <Linkedin  className="w-3.5 h-3.5" />,
  facebook:  <Facebook  className="w-3.5 h-3.5" />,
  whatsapp:  <MessageCircle className="w-3.5 h-3.5" />,
  telegram:  <Send      className="w-3.5 h-3.5" />,
};

export default function Footer() {
  const { contact, socials: allSocials } = useSiteSettings();
  const socials = allSocials.filter(s => s.enabled);
  const address = [contact.addressLine1, contact.city, contact.state, "India"].filter(Boolean).join(", ");

  return (
    <footer id="contact" className="relative bg-[#F5F0E8] text-[#152118] pt-14 pb-20 sm:pb-8 px-4 md:px-8 border-t border-[#E6DDCE] font-sans overflow-hidden print:hidden">
      <div className="block absolute bottom-4 right-3 md:right-6 w-24 sm:w-36 md:w-48 lg:w-56 pointer-events-none select-none z-0 opacity-50">
        <img src="/images/leaves.png" alt="" className="w-full h-auto object-contain" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 pb-12 border-b border-[#E6DDCE]">

          {/* Brand */}
          <div className="col-span-1 sm:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden bg-white shadow-md shrink-0 border border-[#E4DAC9]">
                <Image src="/logo.png" alt="Bhartiya Ayurveda" fill sizes="96px" className="object-cover" />
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
              <p className="text-xs sm:text-sm text-[#152118] mt-1.5 font-normal font-sans">
                Healthy People • Harmonious Society • Diverse Tomorrow
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3.5">
            <h4 className="text-[15px] font-sans font-bold text-[#0E3320] uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-base sm:text-lg text-[#152118] font-semibold">
              <li><Link href="/" className="hover:text-[#0E3320] transition-colors">Home</Link></li>
              <li><Link href="/affiliated-institutes" className="hover:text-[#0E3320] transition-colors">Affiliated Institutes</Link></li>
              <li><Link href="/gallery" className="hover:text-[#0E3320] transition-colors">Photo Gallery</Link></li>
              <li><Link href="/about" className="hover:text-[#0E3320] transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-[#0E3320] transition-colors">Contact</Link></li>
              <li><Link href="/courses" className="hover:text-[#0E3320] transition-colors">Our Courses</Link></li>
            </ul>
          </div>

          {/* Students */}
          <div className="space-y-3.5">
            <h4 className="text-[15px] font-sans font-bold text-[#0E3320] uppercase tracking-wider">Students &amp; Admissions</h4>
            <ul className="space-y-2.5 text-base sm:text-lg text-[#152118] font-semibold">
              <li><Link href="/admissions/registration-form" className="hover:text-[#8C671D] transition-colors">Registration Form</Link></li>
              <li><Link href="/students/registration" className="hover:text-[#8C671D] transition-colors">Student Registration</Link></li>
              <li><Link href="/students/login" className="hover:text-[#8C671D] transition-colors">Student Login</Link></li>
              <li><Link href="/students/results" className="hover:text-[#8C671D] transition-colors">Examination Results</Link></li>
              <li><Link href="/certificate-verification" className="hover:text-[#8C671D] transition-colors">Certificate Verification</Link></li>
              <li><Link href="/affiliated-institutes" className="hover:text-[#8C671D] transition-colors">Approved Colleges</Link></li>
              <li><Link href="/super-admin/login" className="text-[#8C671D] hover:text-[#0E3320] transition-colors font-medium">Super Admin Login</Link></li>
            </ul>
          </div>

          {/* Programs */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-sans font-bold text-[#0E3320] uppercase tracking-wider">Programs &amp; Retreats</h4>
            <ul className="space-y-2 text-sm text-[#152118] font-semibold">
              <li><Link href="/courses" className="hover:text-[#0E3320] transition-colors">Ayurveda Retreats</Link></li>
              <li><Link href="/courses" className="hover:text-[#0E3320] transition-colors">Yoga Programs</Link></li>
              <li><Link href="/courses" className="hover:text-[#0E3320] transition-colors">Naturopathy Courses</Link></li>
              <li><Link href="/courses" className="hover:text-[#0E3320] transition-colors">Wellness Retreats</Link></li>
              <li><Link href="/courses" className="hover:text-[#0E3320] transition-colors">Electro-Homeopathy Courses</Link></li>
              <li><Link href="/courses" className="hover:text-[#0E3320] transition-colors">Alternative Medicine</Link></li>
              <li><Link href="/courses" className="hover:text-[#0E3320] transition-colors">FAQs &amp; Guidance</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3.5">
            <h4 className="text-sm font-sans font-bold text-[#0E3320] uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-2.5 text-sm text-[#152118] font-semibold">
              {address && (
                <li className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-[#C59B3F] shrink-0 mt-0.5" />
                  <span>{address}</span>
                </li>
              )}
              {contact.primaryPhone && (
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-[#C59B3F] shrink-0" />
                  <a href={`tel:${contact.primaryPhone.replace(/\s/g, "")}`} className="hover:text-[#0E3320]">{contact.primaryPhone}</a>
                </li>
              )}
              {contact.primaryEmail && (
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-[#C59B3F] shrink-0" />
                  <a href={`mailto:${contact.primaryEmail}`} className="hover:text-[#0E3320] break-all">{contact.primaryEmail}</a>
                </li>
              )}
            </ul>

            {/* Social Icons from DB */}
            {socials.length > 0 && (
              <div className="flex items-center gap-2.5 pt-2 flex-wrap">
                {socials.map(s => (
                  <a key={s.id} href={s.url || "#"} target="_blank" rel="noopener noreferrer"
                    className="w-7 h-7 rounded-full bg-[#EAE2D3] flex items-center justify-center text-[#0E3320] hover:bg-[#C59B3F]/20 hover:text-[#8C671D] transition-colors"
                    aria-label={s.name}>
                    {SOCIAL_ICONS[s.id] || <Share2 className="w-3.5 h-3.5" />}
                  </a>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[#152118] font-semibold text-center sm:text-left">
          <div>
            © 2023 Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad / <span className="font-devanagari">भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्</span>. All rights reserved.
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <a href="#" className="hover:text-[#0E3320] transition-colors">Privacy Policy</a>
            <span>|</span>
            <a href="#" className="hover:text-[#0E3320] transition-colors">Terms &amp; Conditions</a>
            <span>|</span>
            <a href="#" className="hover:text-[#0E3320] transition-colors">Sitemap</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
