"use client";

import { X, Play, Volume2, Sparkles } from "lucide-react";

export default function VideoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-forest-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl max-h-[92vh] flex flex-col bg-forest-900 rounded-2xl shadow-2xl border border-gold-500/40 overflow-hidden text-sand-50">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-forest-800 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 text-gold-400 shrink-0" />
            <span className="font-serif font-semibold text-sand-100 text-xs sm:text-sm truncate">
              Bhartiya Ayurveda • Sacred Journey Film
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-sand-300 hover:text-white p-1 rounded-full hover:bg-forest-800 transition-colors shrink-0 ml-2"
            aria-label="Close video modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Frame Presentation */}
        <div className="relative aspect-video w-full bg-forest-950 flex flex-col items-center justify-center overflow-hidden flex-1">
          {/* Visual Backdrop */}
          <img
            src="/images/cta/cta-landscape.jpg"
            alt="Sacred Himalayan sanctuary"
            className="absolute inset-0 w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-forest-950 via-forest-950/60 to-transparent"></div>

          {/* Interactive Player Mock */}
          <div className="relative z-10 text-center px-4 sm:px-6 max-w-lg">
            <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gold-500/90 text-forest-950 flex items-center justify-center mx-auto mb-2 sm:mb-4 shadow-xl hover:scale-110 transition-transform cursor-pointer group">
              <Play className="w-6 h-6 sm:w-9 sm:h-9 fill-forest-950 ml-1 group-hover:scale-105 transition-transform" />
            </div>
            <h4 className="text-base sm:text-xl md:text-2xl font-serif font-bold text-white mb-1 sm:mb-2">
              "A Healthier You, A Wilder World"
            </h4>
            <p className="text-xs md:text-sm text-sand-200 leading-relaxed mb-4">
              Immerse yourself into the serene rhythms of our Himalayan sanctuary. Discover how authentic Ayurveda, Ashtanga Yoga, and 5-element Naturopathy harmonize life.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-forest-800/80 rounded-full text-xs text-gold-300 border border-gold-500/20">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Chanted with Vedic Mantras & Himalayan stream soundscapes</span>
            </div>
          </div>
        </div>

        {/* Footer Bar */}
        <div className="px-6 py-3 bg-forest-950/90 flex items-center justify-between text-xs text-sand-400">
          <span>Tapovan, Rishikesh, Uttarakhand</span>
          <button
            onClick={onClose}
            className="text-gold-400 hover:text-gold-300 font-medium"
          >
            Close Viewer
          </button>
        </div>
      </div>
    </div>
  );
}
