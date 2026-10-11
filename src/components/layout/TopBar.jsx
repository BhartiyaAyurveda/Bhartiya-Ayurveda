"use client";

export default function TopBar() {
  return (
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
  );
}
