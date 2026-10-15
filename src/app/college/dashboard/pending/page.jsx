"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Clock,
  Search,
  RefreshCw,
  Eye,
  CheckCircle2,
  Users,
  MessageSquare,
  ClipboardList,
  X,
  Send,
} from "lucide-react";
import { useDashboard, STATUS_LABELS } from "../DashboardContext";

export default function PendingApprovalsPage() {
  const { students, loading, loadStudents, openDetail } = useDashboard();
  const [searchTerm, setSearchTerm]                     = useState("");
  const [filterType, setFilterType]                     = useState("all");

  const pendingStudents = useMemo(() => {
    return students.filter(
      (s) =>
        s.status === "pending" ||
        s.status === "submitted" ||
        s.status === "under_review" ||
        s.status === "query_raised"
    );
  }, [students]);

  const queryCount = pendingStudents.filter((s) => s.status === "query_raised").length;
  const newSubmissionsCount = pendingStudents.filter(
    (s) => s.status === "pending" || s.status === "submitted"
  ).length;
  const underReviewCount = pendingStudents.filter((s) => s.status === "under_review").length;

  const filtered = useMemo(() => {
    return pendingStudents.filter((s) => {
      // Type filter
      if (filterType === "query" && s.status !== "query_raised") return false;
      if (filterType === "new" && s.status !== "pending" && s.status !== "submitted") return false;
      if (filterType === "review" && s.status !== "under_review") return false;

      // Search term
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        return (
          s.candidate_name?.toLowerCase().includes(q) ||
          s.courses?.course_name?.toLowerCase().includes(q) ||
          s.phone?.includes(q) ||
          s.father_name?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [pendingStudents, filterType, searchTerm]);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-500/15 text-amber-800 border border-amber-300">
              <Clock className="w-3.5 h-3.5 text-amber-700" />
              Admissions Review Desk
            </span>
            <span className="text-xs sm:text-sm text-[#5C8261] font-semibold">
              Pending Total: {pendingStudents.length}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0E3320] tracking-tight">
            Pending Approvals &amp; Queries
          </h1>
          <p className="text-xs sm:text-sm text-[#5C8261]">
            Candidate applications requiring document review, roll number allocation, or admin query resolution.
          </p>
        </div>

        <Link
          href="/college/dashboard/registrations"
          className="inline-flex items-center gap-2 text-xs sm:text-sm text-[#0E3320] hover:text-[#C59B3F] font-bold bg-white px-4 py-2.5 rounded-xl border border-[#E8DFD1] hover:border-[#C59B3F] shadow-xs transition-all shrink-0"
        >
          <ClipboardList className="w-4 h-4 text-[#8C671D]" />
          <span>All Applications</span>
        </Link>
      </div>

      {/* ── 3 Quick Action Metric Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Card 1: New Submissions */}
        <button
          onClick={() => setFilterType(filterType === "new" ? "all" : "new")}
          className={`p-4 sm:p-4.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
            filterType === "new"
              ? "bg-[#0E3320] text-white border-[#0E3320] shadow-sm"
              : "bg-white text-[#0E3320] border-[#E8DFD1] hover:border-[#C59B3F] hover:shadow-xs"
          }`}
        >
          <div className="space-y-0.5">
            <p className={`text-xs font-bold uppercase tracking-wider ${filterType === "new" ? "text-[#E4BF64]" : "text-[#5C8261]"}`}>
              New Submissions
            </p>
            <p className="text-xl sm:text-2xl font-extrabold tracking-tight">{newSubmissionsCount}</p>
            <p className={`text-xs ${filterType === "new" ? "text-white/70" : "text-[#8C9E90]"}`}>
              Awaiting nodal review
            </p>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${filterType === "new" ? "bg-white/10 text-[#E4BF64]" : "bg-blue-50 text-blue-700"}`}>
            <Send className="w-4 h-4" />
          </div>
        </button>

        {/* Card 2: Admin Queries Raised */}
        <button
          onClick={() => setFilterType(filterType === "query" ? "all" : "query")}
          className={`p-4 sm:p-4.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
            filterType === "query"
              ? "bg-[#0E3320] text-white border-[#0E3320] shadow-sm"
              : "bg-white text-[#0E3320] border-[#E8DFD1] hover:border-orange-400 hover:shadow-xs"
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <p className={`text-xs font-bold uppercase tracking-wider ${filterType === "query" ? "text-[#E4BF64]" : "text-orange-700"}`}>
                Admin Queries
              </p>
              {queryCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
              )}
            </div>
            <p className="text-xl sm:text-2xl font-extrabold tracking-tight text-orange-600">{queryCount}</p>
            <p className={`text-xs ${filterType === "query" ? "text-white/70" : "text-[#8C9E90]"}`}>
              Action required from college
            </p>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${filterType === "query" ? "bg-white/10 text-[#E4BF64]" : "bg-orange-50 text-orange-700"}`}>
            <MessageSquare className="w-4 h-4" />
          </div>
        </button>

        {/* Card 3: Under Central Review */}
        <button
          onClick={() => setFilterType(filterType === "review" ? "all" : "review")}
          className={`p-4 sm:p-4.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
            filterType === "review"
              ? "bg-[#0E3320] text-white border-[#0E3320] shadow-sm"
              : "bg-white text-[#0E3320] border-[#E8DFD1] hover:border-violet-400 hover:shadow-xs"
          }`}
        >
          <div className="space-y-0.5">
            <p className={`text-xs font-bold uppercase tracking-wider ${filterType === "review" ? "text-[#E4BF64]" : "text-[#5C8261]"}`}>
              Under Central Review
            </p>
            <p className="text-xl sm:text-2xl font-extrabold tracking-tight">{underReviewCount}</p>
            <p className={`text-xs ${filterType === "review" ? "text-white/70" : "text-[#8C9E90]"}`}>
              Directorate processing
            </p>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${filterType === "review" ? "bg-white/10 text-[#E4BF64]" : "bg-violet-50 text-violet-700"}`}>
            <Eye className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className="bg-white rounded-2xl border border-[#E8DFD1] p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C8261]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search pending candidate by name, phone, course…"
            className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-[#0E3320] placeholder-[#B5A186] focus:outline-none focus:ring-4 focus:ring-[#C59B3F]/15 focus:border-[#C59B3F] focus:bg-white transition-all font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs sm:text-sm text-[#5C8261]">
          <span className="font-semibold text-[#0E3320]">
            {filtered.length} {filtered.length === 1 ? "applicant" : "applicants"}
          </span>
          <button
            onClick={() => loadStudents()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] hover:border-[#0E3320] text-[#0E3320] transition-all shadow-xs"
            title="Refresh"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="font-bold text-xs sm:text-sm">Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Table Container ── */}
      <div className="rounded-3xl bg-white border border-[#E8DFD1] shadow-xs overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-[#0E3320]/20 border-t-[#0E3320] rounded-full animate-spin" />
            <p className="text-sm font-semibold text-[#5C8261]">Fetching pending records…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#5C8261] space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-[#0E3320]">
                {searchTerm || filterType !== "all"
                  ? "No matching pending applications"
                  : "All caught up! No pending applications"}
              </p>
              <p className="text-xs sm:text-sm text-[#5C8261] max-w-sm">
                {searchTerm || filterType !== "all"
                  ? "Try resetting your search query or switching the category filter."
                  : "Every student registration under your college has been verified and processed by the council."}
              </p>
            </div>
            {(searchTerm || filterType !== "all") && (
              <button
                onClick={() => {
                  setSearchTerm("");
                  setFilterType("all");
                }}
                className="text-xs sm:text-sm font-bold text-[#0E3320] underline hover:text-[#C59B3F] transition-colors"
              >
                Clear active filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF7F2] text-[#0E3320] uppercase font-bold tracking-wider border-b border-[#E8DFD1] text-xs">
                <tr>
                  <th className="py-3.5 px-6">Candidate Details</th>
                  <th className="py-3.5 px-4">Applied Course</th>
                  <th className="py-3.5 px-4">Contact Phone</th>
                  <th className="py-3.5 px-4">Application Status</th>
                  <th className="py-3.5 px-4">Submission Date</th>
                  <th className="py-3.5 px-6 text-right">Required Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD1]/70">
                {filtered.map((s) => {
                  const st = STATUS_LABELS[s.status] || STATUS_LABELS.pending;
                  const Icon = st.icon;
                  const isQuery = s.status === "query_raised";
                  return (
                    <tr
                      key={s.id}
                      className={`hover:bg-[#FAF7F2]/60 transition-colors group ${
                        isQuery ? "bg-orange-50/20" : ""
                      }`}
                    >
                      {/* Candidate Column */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-9 h-9 rounded-full font-extrabold text-sm flex items-center justify-center shrink-0 border ${
                              isQuery
                                ? "bg-orange-100 text-orange-800 border-orange-300"
                                : "bg-amber-100 text-amber-800 border-amber-300"
                            }`}
                          >
                            {s.candidate_name?.charAt(0) || "S"}
                          </div>
                          <div>
                            <p className="font-bold text-[#0E3320] text-sm leading-snug">
                              {s.candidate_name}
                            </p>
                            <p className="text-xs text-[#5C8261] mt-0.5">
                              {s.father_name ? `F: ${s.father_name}` : "—"}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-4 px-4 text-[#5C8261] font-semibold">
                        <p className="text-sm text-[#0E3320] font-semibold">
                          {s.courses?.course_name || "—"}
                        </p>
                        <p className="text-xs text-[#5C8261] mt-0.5">
                          {s.session_label || "Session 2026-27"}
                        </p>
                      </td>

                      {/* Phone */}
                      <td className="py-4 px-4 font-mono font-medium text-[#0E3320] text-sm">
                        {s.phone || "—"}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${st.color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{st.label}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-4 px-4 text-[#5C8261] text-xs sm:text-sm">
                        {s.created_at ? (
                          new Date(s.created_at).toLocaleDateString("en-IN", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })
                        ) : (
                          "—"
                        )}
                      </td>

                      {/* Action */}
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => openDetail(s)}
                          className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-xs active:scale-95 ${
                            isQuery
                              ? "bg-orange-600 hover:bg-orange-700 text-white"
                              : "bg-[#0E3320] hover:bg-[#15482D] text-white"
                          }`}
                        >
                          <Eye className="w-4 h-4" />
                          <span>{isQuery ? "Resolve Query" : "Review & Manage"}</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
