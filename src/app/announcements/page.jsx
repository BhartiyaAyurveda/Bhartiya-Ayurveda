"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Megaphone, Paperclip, ChevronLeft, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" });
}

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/public/announcements")
      .then(r => r.json())
      .then(d => { if (d.ok) setAnnouncements(d.data || []); })
      .finally(() => setLoading(false));
  }, []);

  const filtered = announcements.filter(a =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    (a.content || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF8F5]">
        {/* Hero */}
        <section className="bg-[#0E3320] py-14 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #C59B3F 0%, transparent 50%), radial-gradient(circle at 80% 50%, #C59B3F 0%, transparent 50%)" }} />
          <div className="relative z-10 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#C59B3F]/20 border border-[#C59B3F]/30 text-[#E4BF64] text-xs font-bold uppercase tracking-widest mb-4">
              <Megaphone className="w-3.5 h-3.5" /> Official Notices
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-white mb-3 font-devanagari">
              सूचनाएँ एवं घोषणाएँ
            </h1>
            <p className="text-[#A8C5B0] text-sm">
              Important announcements, notices and circulars from Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
            </p>
          </div>
        </section>

        <section className="max-w-4xl mx-auto px-4 py-10">
          {/* Search */}
          <div className="relative mb-8">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-[#5C8261]" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-[#DDD1BE] bg-white text-sm text-[#0E3320] placeholder-[#C8B79E] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
          </div>

          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#0E3320]/20 border-t-[#0E3320] rounded-full animate-spin" />
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 text-[#5C8261]">
              <Megaphone className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">{search ? "No matching announcements found." : "No announcements yet."}</p>
            </div>
          )}

          <div className="space-y-4">
            {filtered.map((a, i) => (
              <Link key={a.id} href={`/announcements/${a.id}`}
                className="group flex items-start gap-4 bg-white rounded-2xl border border-[#E2D7C5] p-5 hover:border-[#C59B3F] hover:shadow-md transition-all">
                {/* Number badge */}
                <div className="shrink-0 w-10 h-10 rounded-xl bg-[#0E3320] text-[#E4BF64] flex items-center justify-center text-sm font-bold">
                  {filtered.length - i}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-[#0E3320] text-sm group-hover:text-[#C59B3F] transition-colors line-clamp-2">
                    {a.title}
                  </p>
                  {a.content && (
                    <p className="text-xs text-[#5C8261] mt-1 line-clamp-2">{a.content}</p>
                  )}
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] text-[#5C8261]">{formatDate(a.created_at)}</span>
                    {a.attachment_url && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#F2EDE4] text-[#C59B3F] text-[10px] font-bold">
                        <Paperclip className="w-2.5 h-2.5" /> Attachment
                      </span>
                    )}
                  </div>
                </div>
                              </Link>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
