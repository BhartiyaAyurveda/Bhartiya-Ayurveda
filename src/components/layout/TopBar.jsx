"use client";

import { X } from "lucide-react";
import { useState } from "react";
import { useSiteSettings } from "@/context/SiteSettingsContext";

export default function TopBar() {
  const { homepage } = useSiteSettings();
  const ann = homepage?.announcement;
  const [dismissed, setDismissed] = useState(false);

  return (
    <>
      {/* Announcement Bar — shown when admin enables it */}
      {ann?.enabled && !dismissed && (
        <div
          className="relative w-full flex items-center justify-center px-8 py-2 text-xs font-semibold z-[70] print:hidden"
          style={{ background: ann.bgColor || "#C59B3F", color: ann.textColor || "#071F13" }}
        >
          {ann.link ? (
            <a href={ann.link} className="hover:underline">{ann.text}</a>
          ) : (
            <span>{ann.text}</span>
          )}
          <button onClick={() => setDismissed(true)}
            className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 transition-opacity">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Board name bar */}
      <div className="hidden lg:flex lg:items-center lg:justify-center lg:h-9 sticky top-0 z-[60] bg-[#0E3320] text-center px-4 print:hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-0 sm:gap-2">
          <span className="text-[10px] xs:text-[11px] sm:text-xs font-semibold text-[#E4BF64] tracking-wide">
            Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
          </span>
          <span className="hidden sm:inline text-[#8C9E90]">•</span>
          <span className="font-devanagari text-[10px] xs:text-[11px] sm:text-xs text-[#CBD8CB] tracking-wide">
            भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्
          </span>
        </div>
      </div>
    </>
  );
}
