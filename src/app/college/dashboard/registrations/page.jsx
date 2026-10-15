"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  ClipboardList,
  Search,
  RefreshCw,
  Eye,
  Users,
  UserPlus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  X,
} from "lucide-react";
import { useDashboard, STATUS_LABELS } from "../DashboardContext";

export default function AllRegistrationsPage() {
  const {
    students,
    loading,
    loadStudents,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    counts,
    courses,
    openDetail,
  } = useDashboard();

  const [selectedCourse, setSelectedCourse] = useState("all");

  const filtered = useMemo(() => {
    return students.filter((s) => {
      // Search query
      if (search) {
        const q = search.toLowerCase();
        const matchesQuery =
          s.candidate_name?.toLowerCase().includes(q) ||
          s.roll_no?.toLowerCase().includes(q) ||
          s.enrollment_no?.toLowerCase().includes(q) ||
          s.phone?.includes(q);
        if (!matchesQuery) return false;
      }
      // Course filter
      if (selectedCourse !== "all") {
        if (s.course_id !== selectedCourse && s.courses?.id !== selectedCourse) {
          return false;
        }
      }
      return true;
    });
  }, [students, search, selectedCourse]);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0E3320] text-[#E4BF64]">
              <ClipboardList className="w-3.5 h-3.5 text-[#C59B3F]" />
              Candidates Directory
            </span>
            <span className="text-xs sm:text-sm text-[#5C8261] font-semibold">
              Total Records: {counts.all}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0E3320] tracking-tight">
            All Student Registrations
          </h1>
          <p className="text-xs sm:text-sm text-[#5C8261]">
            Track candidate admission forms, assign roll numbers, and review central approval statuses.
          </p>
        </div>

        <Link
          href="/college/dashboard/register"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E3320] hover:bg-[#15482D] active:scale-95 text-white font-bold text-sm transition-all shadow-sm shrink-0"
        >
          <UserPlus className="w-4 h-4 text-[#C59B3F]" />
          <span>New Registration</span>
        </Link>
      </div>

      {/* ── Status Filter Cards / Chips ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
        {[
          { key: "all",      label: "All Applications", Icon: Users,         count: counts.all,      accent: "text-[#0E3320]" },
          { key: "pending",  label: "Pending Review",   Icon: Clock,         count: counts.pending,  accent: "text-amber-700" },
          { key: "approved", label: "Approved Records", Icon: CheckCircle2,  count: counts.approved, accent: "text-emerald-700" },
          { key: "rejected", label: "Rejected / Query", Icon: AlertTriangle, count: counts.rejected, accent: "text-red-700" },
        ].map(({ key, label, Icon, count, accent }) => {
          const isActive = statusFilter === key;
          return (
            <button
              key={key}
              onClick={() => {
                setStatusFilter(key);
                loadStudents(key, search);
              }}
              className={`p-3.5 sm:p-4 rounded-2xl border text-left transition-all flex items-center justify-between group ${
                isActive
                  ? "bg-[#0E3320] text-white border-[#0E3320] shadow-sm"
                  : "bg-white text-[#0E3320] border-[#E8DFD1] hover:border-[#C59B3F] hover:shadow-xs"
              }`}
            >
              <div className="space-y-0.5">
                <p
                  className={`text-xs font-bold uppercase tracking-wider ${
                    isActive ? "text-[#E4BF64]" : "text-[#5C8261]"
                  }`}
                >
                  {label}
                </p>
                <p className="text-xl sm:text-2xl font-extrabold tracking-tight">
                  {count}
                </p>
              </div>
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? "bg-white/10 text-[#E4BF64]" : `bg-[#FAF7F2] ${accent}`
                }`}
              >
                <Icon className="w-4 h-4" />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className="bg-white rounded-2xl border border-[#E8DFD1] p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2.5 w-full">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C8261]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && loadStudents()}
              placeholder="Search by candidate name, roll no, enrollment no, phone…"
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-[#0E3320] placeholder-[#B5A186] focus:outline-none focus:ring-4 focus:ring-[#C59B3F]/15 focus:border-[#C59B3F] focus:bg-white transition-all font-medium"
            />
            {search && (
              <button
                onClick={() => {
                  setSearch("");
                  loadStudents(statusFilter, "");
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Course Filter Dropdown */}
          {courses.length > 0 && (
            <div className="relative hidden md:block w-52 shrink-0">
              <select
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full py-2.5 px-3 text-sm rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] font-medium"
              >
                <option value="all">All Courses</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.course_name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Toolbar Right */}
        <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto text-xs sm:text-sm text-[#5C8261]">
          <span className="font-semibold text-[#0E3320]">
            {filtered.length} {filtered.length === 1 ? "record" : "records"} found
          </span>
          <button
            onClick={() => loadStudents()}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] hover:border-[#0E3320] text-[#0E3320] transition-all shadow-xs"
            title="Refresh List"
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
            <p className="text-sm font-semibold text-[#5C8261]">Loading candidate records…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#5C8261] space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] flex items-center justify-center text-[#8C671D]">
              <Users className="w-7 h-7 opacity-40" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-[#0E3320]">No candidate records found</p>
              <p className="text-xs sm:text-sm text-[#5C8261] max-w-xs">
                {search || selectedCourse !== "all" || statusFilter !== "all"
                  ? "Try adjusting your search criteria or clearing active filters."
                  : "No students have registered under your college yet."}
              </p>
            </div>
            {(search || selectedCourse !== "all" || statusFilter !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCourse("all");
                  setStatusFilter("all");
                  loadStudents("all", "");
                }}
                className="text-xs sm:text-sm font-bold text-[#0E3320] underline hover:text-[#C59B3F] transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[960px] text-left text-sm">
              <colgroup>
                <col className="w-[220px]" />
                <col className="w-[200px]" />
                <col className="w-[110px]" />
                <col className="w-[130px]" />
                <col className="w-[120px]" />
                <col className="w-[110px]" />
                <col className="w-[110px]" />
              </colgroup>
              <thead className="bg-[#FAF7F2] text-[#5C8261] uppercase font-bold tracking-widest border-b border-[#E8DFD1] text-[11px]">
                <tr>
                  <th className="py-3 px-5 whitespace-nowrap">Candidate Details</th>
                  <th className="py-3 px-4 whitespace-nowrap">Course Program</th>
                  <th className="py-3 px-4 whitespace-nowrap">Roll No.</th>
                  <th className="py-3 px-4 whitespace-nowrap">Enrollment No.</th>
                  <th className="py-3 px-4 whitespace-nowrap">Status</th>
                  <th className="py-3 px-4 whitespace-nowrap">Applied</th>
                  <th className="py-3 px-5 text-right whitespace-nowrap">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD1]/70">
                {filtered.map((s) => {
                  const st = STATUS_LABELS[s.status] || STATUS_LABELS.pending;
                  const Icon = st.icon;
                  return (
                    <tr
                      key={s.id}
                      className="hover:bg-[#FAF7F2]/60 transition-colors group"
                    >
                      {/* Candidate Column */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#EAE3D6] text-[#0E3320] font-extrabold text-sm flex items-center justify-center shrink-0 border border-[#DDD1BE] group-hover:border-[#C59B3F] transition-colors">
                            {s.candidate_name?.charAt(0) || "S"}
                          </div>
                          <div className="min-w-0">
                            <p className="font-bold text-[#0E3320] text-sm leading-snug whitespace-nowrap">
                              {s.candidate_name}
                            </p>
                            <p className="text-xs text-[#5C8261] mt-0.5 whitespace-nowrap">
                              {s.father_name && <span>F: {s.father_name}</span>}
                              {s.phone && (
                                <>
                                  <span className="mx-1">•</span>
                                  <span className="font-mono">{s.phone}</span>
                                </>
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Course */}
                      <td className="py-3.5 px-4">
                        <p className="text-sm text-[#0E3320] font-semibold leading-snug">
                          {s.courses?.course_name || "—"}
                        </p>
                        {s.courses?.duration_label && (
                          <p className="text-xs text-[#5C8261] mt-0.5">
                            {s.courses.duration_label}
                          </p>
                        )}
                      </td>

                      {/* Roll No */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#15482D] text-sm whitespace-nowrap">
                        {s.roll_no ? (
                          <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E8DFD1]">
                            {s.roll_no}
                          </span>
                        ) : (
                          <span className="text-[#C8B79E] font-normal">—</span>
                        )}
                      </td>

                      {/* Enrollment No */}
                      <td className="py-3.5 px-4 font-mono text-[#0E3320] text-sm whitespace-nowrap">
                        {s.enrollment_no ? (
                          <span className="bg-[#FAF7F2] px-2.5 py-1 rounded-md border border-[#E8DFD1] font-semibold">
                            {s.enrollment_no}
                          </span>
                        ) : (
                          <span className="text-[#C8B79E] font-normal">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${st.color}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{st.label}</span>
                        </span>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 px-4 text-[#5C8261] text-sm whitespace-nowrap">
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
                      <td className="py-3.5 px-5 text-right whitespace-nowrap">
                        <Link
                          href={`/college/dashboard/registrations/${s.id}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#0E3320] text-[#0E3320] hover:text-white border border-[#E8DFD1] hover:border-[#0E3320] text-sm font-bold transition-all shadow-xs active:scale-95"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </Link>
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
