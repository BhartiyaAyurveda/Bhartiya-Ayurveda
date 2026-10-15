import Image from "next/image";

export const metadata = { title: "Maintenance — Bhartiya Ayurveda" };

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-[#0E3320] flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Gold shimmer top bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C59B3F] to-transparent" />

      <div className="relative w-24 h-24 mb-8 mx-auto">
        <Image src="/logo.png" alt="Bhartiya Ayurveda" fill sizes="96px" className="object-contain drop-shadow-lg" />
      </div>

      <p className="text-[#C59B3F] text-xs font-bold tracking-[0.25em] uppercase mb-3">
        Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
      </p>

      <h1 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-4 leading-tight">
        Site Under Maintenance
      </h1>

      <div className="w-16 h-px bg-[#C59B3F] mx-auto mb-6" />

      <p className="text-white/60 max-w-md leading-relaxed text-sm mb-10" id="maintenance-msg">
        We are currently undergoing scheduled maintenance to improve your experience.
        Please check back shortly. We apologize for the inconvenience.
      </p>

      {/* Animated dots */}
      <div className="flex gap-2 mb-10">
        <span className="w-2.5 h-2.5 rounded-full bg-[#C59B3F] animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2.5 h-2.5 rounded-full bg-[#C59B3F] animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2.5 h-2.5 rounded-full bg-[#C59B3F] animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>

      <div className="text-white/30 text-xs space-y-1">
        <p>For urgent inquiries, contact us:</p>
        <p className="text-white/50 font-medium">+91-XXXXXXXXXX</p>
      </div>

      <a href="/super-admin/login" className="mt-12 text-[10px] text-white/15 hover:text-white/30 transition-colors">
        Admin Access
      </a>
    </div>
  );
}
