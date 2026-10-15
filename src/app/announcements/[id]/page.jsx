"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Megaphone, Paperclip, ExternalLink, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function formatDate(iso) {
  return new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric", weekday: "long" });
}

export default function AnnouncementDetailPage() {
  const { id } = useParams();
  const [ann, setAnn] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/public/announcements/${id}`)
      .then(r => r.json())
      .then(d => {
        if (d.ok) setAnn(d.data);
        else setNotFound(true);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#FAF8F5]">
        <section className="bg-[#0E3320] py-10 px-4">
          <div className="max-w-3xl mx-auto">
            <Link href="/announcements"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#A8C5B0] hover:text-[#E4BF64] transition-colors mb-4">
              All Announcements
            </Link>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C59B3F]/20 border border-[#C59B3F]/30 text-[#E4BF64] text-[11px] font-bold uppercase tracking-wider">
              <Megaphone className="w-3 h-3" /> Official Notice
            </div>
          </div>
        </section>

        <section className="max-w-3xl mx-auto px-4 py-10">
          {loading && (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-[#0E3320]/20 border-t-[#0E3320] rounded-full animate-spin" />
            </div>
          )}

          {notFound && (
            <div className="text-center py-20">
              <AlertCircle className="w-12 h-12 mx-auto mb-3 text-red-300" />
              <p className="font-bold text-[#0E3320]">Announcement not found.</p>
              <Link href="/announcements" className="mt-4 inline-flex items-center gap-1.5 text-sm text-[#C59B3F] font-semibold hover:underline">
                Back to Announcements
              </Link>
            </div>
          )}

          {ann && (
            <div className="bg-white rounded-3xl border border-[#E2D7C5] shadow-sm overflow-hidden">
              {/* Header */}
              <div className="p-7 border-b border-[#EBE2D4]">
                <h1 className="text-xl sm:text-2xl font-bold text-[#0E3320] leading-snug mb-3">
                  {ann.title}
                </h1>
                <p className="text-xs text-[#5C8261]">
                  Issued on: <span className="font-semibold text-[#0E3320]">{formatDate(ann.created_at)}</span>
                </p>
              </div>

              {/* Content */}
              {ann.content && (
                <div className="p-7 border-b border-[#EBE2D4]">
                  <p className="text-sm text-[#0E3320] leading-relaxed whitespace-pre-wrap">{ann.content}</p>
                </div>
              )}

              {/* Attachment */}
              {ann.attachment_url && (
                <div className="p-7">
                  <p className="text-xs font-bold text-[#5C8261] uppercase tracking-wider mb-3">Attachment</p>
                  <a href={ann.attachment_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2.5 px-5 py-3 rounded-xl bg-[#F2EDE4] border border-[#DDD1BE] text-[#0E3320] text-sm font-semibold hover:bg-[#DDD1BE] transition-colors group">
                    <Paperclip className="w-4 h-4 text-[#C59B3F]" />
                    <span>{ann.attachment_name || "View Attachment"}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-[#5C8261] group-hover:text-[#C59B3F] transition-colors" />
                  </a>
                </div>
              )}

              {/* Footer */}
              <div className="px-7 py-4 bg-[#FAF8F5] border-t border-[#EBE2D4] text-xs text-[#5C8261]">
                Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad — Official Notice
              </div>
            </div>
          )}

          <div className="mt-8 text-center">
            <Link href="/announcements"
              className="inline-flex items-center gap-1.5 text-sm text-[#5C8261] hover:text-[#0E3320] font-semibold transition-colors">
              View All Announcements
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
