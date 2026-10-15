"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MessageSquarePlus, RefreshCw, Eye, CheckCircle2, Clock, XCircle, Trash2 } from "lucide-react";

const STATUS_OPTIONS = ["new", "in_progress", "resolved", "spam"];
const STATUS_COLORS = {
  new:         "bg-blue-100 text-blue-800 border-blue-300",
  in_progress: "bg-amber-100 text-amber-800 border-amber-300",
  resolved:    "bg-emerald-100 text-emerald-800 border-emerald-300",
  spam:        "bg-gray-100 text-gray-600 border-gray-300",
};

function StatusBadge({ status }) {
  return (
    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide ${STATUS_COLORS[status] || "bg-gray-100 text-gray-600 border-gray-300"}`}>
      {status?.replace(/_/g, " ") || "new"}
    </span>
  );
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("new");
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const url = filter === "all" ? "/api/admin/inquiries" : `/api/admin/inquiries?status=${filter}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.ok) setInquiries(data.data || []);
    } catch {}
    setLoading(false);
  };

  useEffect(() => { load(); }, [filter]);

  const open = async (inquiry) => {
    setSelected(inquiry);
    setNotes(inquiry.admin_notes || "");
    setStatus(inquiry.status || "new");
    // Mark as read
    if (!inquiry.is_read) {
      await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_read: true }),
      });
      setInquiries(p => p.map(i => i.id === inquiry.id ? { ...i, is_read: true } : i));
    }
  };

  const save = async () => {
    if (!selected) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${selected.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, admin_notes: notes, is_read: true }),
      });
      const data = await res.json();
      if (data.ok) {
        setInquiries(p => p.map(i => i.id === selected.id ? data.data : i));
        setSelected(null);
        setMsg({ type: "success", text: "Inquiry updated!" });
        setTimeout(() => setMsg(null), 3000);
      }
    } catch {}
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this inquiry?")) return;
    await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
    setInquiries(p => p.filter(i => i.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const filtered = inquiries.filter(i => filter === "all" || i.status === filter);
  const unread = inquiries.filter(i => !i.is_read).length;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs text-[#9B8265] mb-2">
              <Link href="/super-admin/dashboard" className="hover:text-[#0E3320] font-medium flex items-center gap-1">
                Dashboard
              </Link>
              <span>/</span>
              <span className="font-bold text-[#0E3320]">Contact Inquiries</span>
            </nav>
            <div className="flex items-center gap-3">
              <MessageSquarePlus className="w-6 h-6 text-[#0E3320]" />
              <h1 className="text-xl font-black text-[#0E3320]">Contact Inquiries</h1>
              {unread > 0 && (
                <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{unread} new</span>
              )}
            </div>
          </div>
          <button onClick={load} disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E3320] text-white text-xs font-bold rounded-lg hover:bg-[#071A0E]">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
          </button>
        </div>

        {msg && (
          <div className={`mb-4 p-3 rounded-lg text-sm font-semibold ${msg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
            {msg.text}
          </div>
        )}

        {/* Filter tabs */}
        <div className="flex gap-2 flex-wrap mb-5">
          {["all", ...STATUS_OPTIONS].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${filter === f ? "bg-[#0E3320] text-white" : "bg-white border border-[#E8DDD0] text-[#374151] hover:border-[#C59B3F]"}`}>
              {f.replace(/_/g, " ")}
              {f !== "all" && (
                <span className="ml-1.5 text-[9px] opacity-70">({inquiries.filter(i => i.status === f || (!i.status && f === "new")).length})</span>
              )}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* List */}
          <div className="space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <RefreshCw className="w-6 h-6 animate-spin text-[#C59B3F]" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-[#E8DDD0]">
                <MessageSquarePlus className="w-10 h-10 mx-auto text-[#DDD1BE] mb-2" />
                <p className="text-sm font-semibold text-[#5C8261]">No inquiries found</p>
              </div>
            ) : filtered.map(inquiry => (
              <div key={inquiry.id}
                onClick={() => open(inquiry)}
                className={`bg-white rounded-xl border p-4 cursor-pointer transition-all hover:shadow-md ${selected?.id === inquiry.id ? "border-[#C59B3F] shadow-md" : "border-[#E8DDD0]"} ${!inquiry.is_read ? "border-l-4 border-l-blue-500" : ""}`}>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    {!inquiry.is_read && <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />}
                    <span className="font-bold text-sm text-[#0E3320] truncate">{inquiry.name || "Anonymous"}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={inquiry.status || "new"} />
                    <button onClick={(e) => { e.stopPropagation(); remove(inquiry.id); }}
                      className="p-1 text-[#9B8265] hover:text-red-600 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-[#5C8261] mb-1">{inquiry.email} {inquiry.phone ? `· ${inquiry.phone}` : ""}</p>
                <p className="text-xs text-[#374151] line-clamp-2">{inquiry.message || inquiry.subject || "—"}</p>
                <p className="text-[10px] text-[#9B8265] mt-2">
                  {inquiry.created_at ? new Date(inquiry.created_at).toLocaleString("en-IN") : "—"}
                </p>
              </div>
            ))}
          </div>

          {/* Detail panel */}
          {selected ? (
            <div className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden sticky top-6 self-start">
              <div className="bg-[#0E3320] px-5 py-3 text-white flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider">Inquiry Detail</h3>
                <button onClick={() => setSelected(null)} className="text-white/60 hover:text-white text-lg">✕</button>
              </div>
              <div className="p-5 space-y-4">
                {/* Sender info */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {[
                    ["Name", selected.name],
                    ["Email", selected.email],
                    ["Phone", selected.phone],
                    ["Subject", selected.subject],
                  ].map(([label, val]) => val ? (
                    <div key={label}>
                      <span className="text-[#9B8265] block font-medium">{label}</span>
                      <span className="font-semibold text-[#0E3320]">{val}</span>
                    </div>
                  ) : null)}
                </div>

                {/* Message */}
                <div>
                  <span className="text-[10px] text-[#9B8265] font-bold uppercase tracking-wider block mb-1.5">Message</span>
                  <div className="bg-[#FAF8F5] border border-[#E8DDD0] rounded-lg p-3 text-xs text-[#374151] leading-relaxed whitespace-pre-wrap">
                    {selected.message || "—"}
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="text-[10px] text-[#9B8265] font-bold uppercase tracking-wider block mb-1.5">Update Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)}
                    className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D5C7B7] rounded text-xs font-medium text-[#1F2937] focus:ring-2 focus:ring-[#C59B3F] focus:outline-none">
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</option>)}
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="text-[10px] text-[#9B8265] font-bold uppercase tracking-wider block mb-1.5">Admin Notes</label>
                  <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                    placeholder="Internal notes (not visible to visitor)..."
                    className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D5C7B7] rounded text-xs text-[#1F2937] placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#C59B3F] focus:outline-none resize-none" />
                </div>

                <button onClick={save} disabled={saving}
                  className="w-full py-2.5 bg-[#0E3320] hover:bg-[#071A0E] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {saving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          ) : (
            <div className="hidden lg:flex items-center justify-center py-20 bg-white rounded-xl border border-dashed border-[#E8DDD0]">
              <div className="text-center text-[#9B8265]">
                <Eye className="w-8 h-8 mx-auto mb-2 opacity-40" />
                <p className="text-xs font-medium">Select an inquiry to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
