"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, CheckCircle2, RefreshCw, Hash, Users } from "lucide-react";

const TYPE_LABELS = {
  missing_roll_no:     { label: "Missing Roll No.", color: "bg-amber-100 text-amber-800 border-amber-300" },
  duplicate_roll_no:   { label: "Duplicate Roll No.", color: "bg-red-100 text-red-800 border-red-300" },
  missing_enrollment_no: { label: "Missing Enrollment No.", color: "bg-blue-100 text-blue-800 border-blue-300" },
};

export default function RollNumberAuditPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [typeFilter, setTypeFilter] = useState("all");

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/roll-numbers/audit-mismatches");
      const json = await res.json();
      if (!res.ok) setError(json.error || "Failed to load audit");
      else setData(json);
    } catch { setError("Network error"); }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = data?.mismatches?.filter(m => typeFilter === "all" || m.type === typeFilter) || [];

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs text-[#9B8265] mb-2">
              <Link href="/super-admin/dashboard" className="hover:text-[#0E3320] font-medium flex items-center gap-1">
                Dashboard
              </Link>
              <span>/</span>
              <span className="font-bold text-[#0E3320]">Roll Number Audit</span>
            </nav>
            <h1 className="text-xl font-black text-[#0E3320] flex items-center gap-2">
              <Hash className="w-5 h-5" /> Roll Number Audit
            </h1>
            <p className="text-xs text-[#9B8265] mt-1">Detect duplicate roll numbers, missing assignments, and enrollment gaps.</p>
          </div>
          <button onClick={load} disabled={loading}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E3320] text-white text-xs font-bold rounded-lg hover:bg-[#071A0E]">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Audit
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <RefreshCw className="w-6 h-6 animate-spin text-[#C59B3F]" />
          </div>
        ) : data && (
          <>
            {/* Summary cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              <div className="bg-white rounded-xl border border-[#E8DDD0] p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E6EFE9] flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-[#0E3320]" /></div>
                <div><p className="text-xs text-[#5C8261]">Total Approved</p><p className="font-bold text-[#0E3320] text-lg">{data.total_approved}</p></div>
              </div>
              <div className={`bg-white rounded-xl border p-4 flex items-center gap-3 ${data.mismatch_count > 0 ? "border-red-200" : "border-[#E8DDD0]"}`}>
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${data.mismatch_count > 0 ? "bg-red-100" : "bg-emerald-100"}`}>
                  {data.mismatch_count > 0 ? <AlertTriangle className="w-5 h-5 text-red-600" /> : <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                </div>
                <div>
                  <p className="text-xs text-[#5C8261]">Mismatches Found</p>
                  <p className={`font-bold text-lg ${data.mismatch_count > 0 ? "text-red-700" : "text-emerald-700"}`}>{data.mismatch_count}</p>
                </div>
              </div>
              <div className="bg-white rounded-xl border border-[#E8DDD0] p-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#E6EFE9] flex items-center justify-center shrink-0"><Hash className="w-5 h-5 text-[#C59B3F]" /></div>
                <div>
                  <p className="text-xs text-[#5C8261]">With Roll No.</p>
                  <p className="font-bold text-[#0E3320] text-lg">{data.total_approved - (data.mismatches?.filter(m => m.type === "missing_roll_no").length || 0)}</p>
                </div>
              </div>
            </div>

            {data.mismatch_count === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-[#E8DDD0]">
                <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-500 mb-3" />
                <p className="font-bold text-[#0E3320] text-lg">All Clear!</p>
                <p className="text-sm text-[#5C8261] mt-1">No roll number mismatches or issues found.</p>
              </div>
            ) : (
              <>
                {/* Type filter */}
                <div className="flex gap-2 flex-wrap mb-4">
                  <button onClick={() => setTypeFilter("all")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold ${typeFilter === "all" ? "bg-[#0E3320] text-white" : "bg-white border border-[#E8DDD0] text-[#374151]"}`}>
                    All ({data.mismatch_count})
                  </button>
                  {Object.keys(TYPE_LABELS).map(type => {
                    const count = data.mismatches?.filter(m => m.type === type).length || 0;
                    if (!count) return null;
                    return (
                      <button key={type} onClick={() => setTypeFilter(type)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold ${typeFilter === type ? "bg-[#0E3320] text-white" : "bg-white border border-[#E8DDD0] text-[#374151]"}`}>
                        {TYPE_LABELS[type].label} ({count})
                      </button>
                    );
                  })}
                </div>

                {/* Mismatch table */}
                <div className="bg-white rounded-xl border border-[#E8DDD0] overflow-hidden">
                  <table className="w-full text-xs">
                    <thead className="bg-[#F5F0E8] border-b border-[#E8DDD0]">
                      <tr>
                        <th className="px-4 py-3 text-left font-bold text-[#0E3320] uppercase">Type</th>
                        <th className="px-4 py-3 text-left font-bold text-[#0E3320] uppercase">Candidate</th>
                        <th className="px-4 py-3 text-left font-bold text-[#0E3320] uppercase">College</th>
                        <th className="px-4 py-3 text-left font-bold text-[#0E3320] uppercase">Issue</th>
                        <th className="px-4 py-3 text-right font-bold text-[#0E3320] uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#F0E8DC]">
                      {filtered.map((m, i) => (
                        <tr key={i} className="hover:bg-[#FAF8F5]">
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${TYPE_LABELS[m.type]?.color || "bg-gray-100 text-gray-700 border-gray-300"}`}>
                              {TYPE_LABELS[m.type]?.label || m.type}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-semibold text-[#0E3320]">{m.candidate_name}</td>
                          <td className="px-4 py-3 text-[#5C8261]">{m.college || "—"}</td>
                          <td className="px-4 py-3 text-[#374151]">{m.detail}</td>
                          <td className="px-4 py-3 text-right">
                            <Link href={`/super-admin/dashboard/registrations/${m.id}`}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F5F0E8] text-[#0E3320] text-[10px] font-bold hover:bg-[#EDE4D6] transition-colors">
                              Fix
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
