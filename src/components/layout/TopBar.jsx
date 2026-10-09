"use client";

export default function TopBar() {
  return (
    <div className="bg-[#0E3320] text-center py-1.5 px-4 print:hidden">
      <span className="text-[11px] sm:text-xs font-semibold text-[#E4BF64] tracking-wide">
        Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
      </span>
      <span className="hidden sm:inline text-[#8C9E90] mx-2">•</span>
      <span className="hidden sm:inline font-devanagari text-xs text-[#CBD8CB] tracking-wide">
        भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्
      </span>
    </div>
  );
}
