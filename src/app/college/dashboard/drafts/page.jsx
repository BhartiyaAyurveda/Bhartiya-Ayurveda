"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { FileText, Trash2, RefreshCw, Plus, Search, Clock, CheckCircle2, AlertCircle } from "lucide-react";

export default function DraftsPage() {
  const [drafts, setDrafts]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch]         = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const fetchDrafts = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch("/api/college/drafts");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch drafts");
      setDrafts(data.drafts || []);
    } catch (err) { setError(err.message || "Network error"); }
    setLoading(false);
  };

  useEffect(() => { fetchDrafts(); }, []);

  const handleDiscard = async (id, name) => {
    if (!confirm(`Discard draft for "${name}"?\nयह ड्राफ्ट हमेशा के लिए हटा दिया जाएगा।`)) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/college/drafts/${id}`, { method: "DELETE" });
      if ((await res.json()).ok) setDrafts(prev => prev.filter(d => d.id !== id));
      else alert("Failed to discard draft.");
    } catch { alert("Network error."); }
    setDeletingId(null);
  };

  const stats = useMemo(() => ({
    total:      drafts.length,
    verified:   drafts.filter(d => d.status === "verified").length,
    inProgress: drafts.filter(d => d.status === "draft").length,
  }), [drafts]);

  const filtered = useMemo(() => drafts.filter(d => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    const q = search.toLowerCase().trim();
    return !q || d.candidate_name?.toLowerCase().includes(q) || d.email?.toLowerCase().includes(q) || d.father_name?.toLowerCase().includes(q);
  }), [drafts, search, statusFilter]);

  return (
    <div className="space-y-6 max-w-7xl">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-[#E8DFD1] shadow-xs p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[#F2EDE4]">
          <div className="space-y-1">
            <nav className="flex items-center gap-2 text-xs text-[#5C8261] mb-1">
              <Link href="/college/dashboard" className="hover:text-[#0E3320] transition-colors">Dashboard</Link>
              <span>/</span>
              <span className="font-semibold text-[#0E3320]">Incomplete Registrations</span>
            </nav>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0E3320] tracking-tight">
              OTP Verified &amp; Draft Registrations
            </h1>
            <p className="text-xs text-[#5C8261]">
              Students who completed OTP verification. Resume form to continue without repeating OTP.
              <br className="hidden sm:block" />
              जिन छात्रों का OTP सत्यापन हो चुका है — "Resume Form" से जारी रखें।
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link href="/college/dashboard/register"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-[#0E3320] hover:bg-[#15482D] rounded-xl shadow-xs transition-colors">
              <Plus className="w-3.5 h-3.5" />
              New Registration
            </Link>
            <button onClick={fetchDrafts} disabled={loading}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-[#5C8261] bg-[#F2EDE4] hover:bg-[#E8DFD1] rounded-xl border border-[#E8DFD1] transition-colors">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 pt-5">
          <div className="bg-[#FAF8F5] border border-[#E8DFD1] rounded-xl p-3 text-center">
            <span className="text-[10px] font-semibold text-[#5C8261] block mb-0.5 uppercase tracking-wide">Total / कुल</span>
            <span className="text-2xl font-black text-[#0E3320]">{stats.total}</span>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
            <span className="text-[10px] font-semibold text-amber-700 block mb-0.5 uppercase tracking-wide">Verified Only / सत्यापित</span>
            <span className="text-2xl font-black text-amber-700">{stats.verified}</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-center">
            <span className="text-[10px] font-semibold text-blue-700 block mb-0.5 uppercase tracking-wide">Draft / अपूर्ण</span>
            <span className="text-2xl font-black text-[#0E3320]">{stats.inProgress}</span>
          </div>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="bg-white rounded-2xl border border-[#E8DFD1] shadow-xs p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#A59580] pointer-events-none" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-[#FAF8F5] border border-[#E8DFD1] rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F]/20 focus:border-[#C59B3F] transition-all"
          />
        </div>
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {[
            { val: "all",      label: `All (${drafts.length})`,           cls: "bg-[#0E3320] text-white", inact: "bg-[#F2EDE4] text-[#5C8261] hover:bg-[#E8DFD1]" },
            { val: "verified", label: `OTP Verified (${stats.verified})`, cls: "bg-amber-600 text-white", inact: "bg-amber-50 text-amber-700 hover:bg-amber-100" },
            { val: "draft",    label: `In Progress (${stats.inProgress})`,cls: "bg-blue-600 text-white", inact: "bg-blue-50 text-blue-700 hover:bg-blue-100" },
          ].map(f => (
            <button key={f.val} onClick={() => setStatusFilter(f.val)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors whitespace-nowrap ${statusFilter === f.val ? f.cls : f.inact}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" /> {error}
          <button onClick={fetchDrafts} className="ml-auto px-3 py-1 bg-red-100 hover:bg-red-200 rounded-lg font-bold text-red-800">Retry</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-2xl border border-[#E8DFD1] shadow-xs overflow-hidden">
        {loading ? (
          <div className="py-16 flex flex-col items-center justify-center text-[#5C8261] gap-3">
            <RefreshCw className="w-7 h-7 animate-spin text-[#C59B3F]" />
            <p className="text-xs font-semibold">Loading draft registrations...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 flex flex-col items-center text-center text-[#5C8261] gap-2">
            <FileText className="w-12 h-12 text-[#DDD1BE]" />
            <p className="font-bold text-[#0E3320] text-sm">No incomplete registrations found</p>
            <p className="text-xs text-[#9B8265]">
              {search ? "Try adjusting your search." : "All verified registrations have been submitted."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-[#0E3320] to-[#1A5C38] text-white text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4 sm:px-5">Candidate / अभ्यर्थी</th>
                  <th className="py-3 px-4">Contact / संपर्क</th>
                  <th className="py-3 px-4">Status / स्थिति</th>
                  <th className="py-3 px-4">Updated / संशोधित</th>
                  <th className="py-3 px-4 sm:px-5 text-right">Actions / कार्रवाई</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EDE4] text-xs sm:text-sm">
                {filtered.map(d => (
                  <tr key={d.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-4 sm:px-5">
                      <div className="font-bold text-[#0E3320] text-sm">{d.candidate_name || <em className="font-normal text-[#9B8265]">Unnamed</em>}</div>
                      {d.father_name && <div className="text-xs text-[#5C8261] mt-0.5"><span className="text-[#A59580]">Father:</span> {d.father_name}</div>}
                      {d.form_data?.course_id && <div className="text-[11px] text-[#8C671D] font-semibold mt-0.5">Step {d.current_step} / 6</div>}
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-mono text-xs text-[#0E3320] font-medium">{d.email}</div>
                      {d.form_data?.phone && <div className="text-xs text-[#5C8261] mt-0.5">+91 {d.form_data.phone}</div>}
                    </td>
                    <td className="py-4 px-4">
                      {d.status === "draft" ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                          Draft / अपूर्ण
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                          OTP Verified
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-xs text-[#5C8261]">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 shrink-0" />
                        {new Date(d.updated_at || d.created_at).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" })}
                      </div>
                      <div className="text-[11px] text-[#A59580] mt-0.5">
                        {new Date(d.updated_at || d.created_at).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit" })}
                      </div>
                    </td>
                    <td className="py-4 px-4 sm:px-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link href={`/college/dashboard/register?draftId=${d.id}`}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0E3320] hover:bg-[#15482D] text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Resume Form
                        </Link>
                        <button type="button" onClick={() => handleDiscard(d.id, d.candidate_name || "this draft")}
                          disabled={deletingId === d.id}
                          className="p-1.5 text-[#A59580] hover:text-red-600 hover:bg-red-50 rounded-xl border border-transparent hover:border-red-200 transition-colors disabled:opacity-50">
                          {deletingId === d.id
                            ? <RefreshCw className="w-4 h-4 animate-spin" />
                            : <Trash2 className="w-4 h-4" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
