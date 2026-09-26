"use client";

import { X, Check, ArrowRight } from "lucide-react";

export default function ProgramDetailsModal({ program, onClose, onOpenConsultation }) {
  if (!program) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#FAF8F5] rounded-2xl shadow-2xl border border-[#E8DFCF] overflow-hidden text-[#0E3320]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Image */}
        <div className="relative h-48 sm:h-56 shrink-0">
          <img
            src={program.image}
            alt={program.en}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E3320] via-[#0E3320]/10 to-transparent"></div>

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white hover:text-[#E4BF64] p-1.5 rounded-full bg-black/30 hover:bg-black/50 transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-3 left-4 right-4">
            <h3 className="font-devanagari font-bold text-lg sm:text-xl text-white drop-shadow-md leading-snug">
              {program.hi}
            </h3>
            <div className="text-sm sm:text-base font-sans font-semibold text-[#E4BF64] drop-shadow-md">
              {program.en}
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          <div className="flex items-center justify-between border-b border-[#EAE2D3] pb-4">
            <div>
              <div className="text-xs text-[#4B6B55] font-semibold uppercase tracking-wide">Program Fee</div>
              <div className="font-bold text-2xl sm:text-3xl text-[#0E3320] mt-0.5">{program.price}</div>
            </div>
            {program.duration && (
              <div className="text-right">
                <div className="text-xs text-[#4B6B55] font-semibold uppercase tracking-wide">Duration</div>
                <div className="font-bold text-lg text-[#0E3320] mt-0.5">{program.duration}</div>
              </div>
            )}
          </div>

          {program.description && (
            <p className="text-sm text-[#33563F] leading-relaxed">
              {program.description}
            </p>
          )}

          <div>
            <div className="text-xs font-semibold text-[#0E3320] uppercase tracking-wider mb-2.5">
              What's Included
            </div>
            <ul className="space-y-2">
              {program.features.map((feat, idx) => (
                <li key={idx} className="flex items-center gap-2.5 text-sm font-medium text-[#2E543C]">
                  <span className="w-5 h-5 rounded-full bg-[#EAF2E4] flex items-center justify-center shrink-0">
                    <Check className="w-3 h-3 text-[#2E7A4A]" />
                  </span>
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-4 sm:p-5 border-t border-[#EAE2D3] shrink-0">
          <button
            onClick={() => {
              onClose();
              onOpenConsultation();
            }}
            className="btn-shimmer w-full py-3.5 rounded-xl bg-[#0E3320] hover:bg-[#071F13] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Book This Program</span>
            <ArrowRight className="w-4 h-4 text-[#E4BF64]" />
          </button>
        </div>
      </div>
    </div>
  );
}
