"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Search,
  RefreshCw,
  UserPlus,
  Award,
  CheckCircle2,
  Hash,
  ExternalLink,
  Eye,
  X,
} from "lucide-react";
import { useDashboard } from "../DashboardContext";

export default function EnrolledStudentsPage() {
  const {
    enrolled,
    enrolledLoading,
    loadEnrolled,
    enrolledSearch,
    setEnrolledSearch,
    courses,
    openDetail
  } = useDashboard();

  const [selectedCourse, setSelectedCourse] = useState("all");
  const [rollFilter, setRollFilter]         = useState("all");

  const withRollCount    = useMemo(() => enrolled.filter((s) => Boolean(s.roll_no)).length, [enrolled]);
  const withoutRollCount = useMemo(() => enrolled.filter((s) => !s.roll_no).length, [enrolled]);

  const filtered = useMemo(() => {
    return enrolled.filter((s) => {
      // Search
      if (enrolledSearch) {
        const q = enrolledSearch.toLowerCase();
        const matchesQuery =
          s.candidate_name?.toLowerCase().includes(q) ||
          s.enrollment_no?.toLowerCase().includes(q) ||
          s.roll_no?.toLowerCase().includes(q) ||
          s.courses?.course_name?.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }
      // Course filter
      if (selectedCourse !== "all") {
        if (s.course_id !== selectedCourse && s.courses?.id !== selectedCourse) {
          return false;
        }
      }
      // Roll status filter
      if (rollFilter === "assigned" && !s.roll_no) return false;
      if (rollFilter === "unassigned" && Boolean(s.roll_no)) return false;

      return true;
    });
  }, [enrolled, enrolledSearch, selectedCourse, rollFilter]);

  return (
    <div className="space-y-6 max-w-6xl">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-800 border border-emerald-300">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              Verified Academic Records
            </span>
            <span className="text-xs sm:text-sm text-[#5C8261] font-semibold">
              Enrolled: {enrolled.length}
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0E3320] tracking-tight">
            Enrolled Students Register
          </h1>
          <p className="text-xs sm:text-sm text-[#5C8261]">
            Official council-ratified candidates eligible for examination hall tickets, admit cards, and certifications.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Link
            href="/students/admit-card"
            target="_blank"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs sm:text-sm text-[#0E3320] hover:text-[#C59B3F] font-semibold bg-white px-3.5 py-2 rounded-xl border border-[#E8DFD1] hover:border-[#C59B3F] shadow-xs transition-all"
          >
            <span>Admit Card Portal</span>
            <ExternalLink className="w-3.5 h-3.5 text-[#C59B3F]" />
          </Link>

          <Link
            href="/college/dashboard/register"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E3320] hover:bg-[#15482D] active:scale-95 text-white font-bold text-sm transition-all shadow-sm"
          >
            <UserPlus className="w-4 h-4 text-[#C59B3F]" />
            <span>New Admission</span>
          </Link>
        </div>
      </div>

      {/* ── 3 Metric Summary Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Total Enrolled */}
        <button
          onClick={() => setRollFilter("all")}
          className={`p-4 sm:p-4.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
            rollFilter === "all"
              ? "bg-[#0E3320] text-white border-[#0E3320] shadow-sm"
              : "bg-white text-[#0E3320] border-[#E8DFD1] hover:border-[#C59B3F] hover:shadow-xs"
          }`}
        >
          <div className="space-y-0.5">
            <p className={`text-xs font-bold uppercase tracking-wider ${rollFilter === "all" ? "text-[#E4BF64]" : "text-[#5C8261]"}`}>
              Total Enrolled Students
            </p>
            <p className="text-2xl font-extrabold tracking-tight">{enrolled.length}</p>
            <p className={`text-xs ${rollFilter === "all" ? "text-white/70" : "text-[#8C9E90]"}`}>
              Council ratified admissions
            </p>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${rollFilter === "all" ? "bg-white/10 text-[#E4BF64]" : "bg-emerald-50 text-emerald-700"}`}>
            <GraduationCap className="w-4 h-4" />
          </div>
        </button>

        {/* Roll Numbers Issued */}
        <button
          onClick={() => setRollFilter(rollFilter === "assigned" ? "all" : "assigned")}
          className={`p-4 sm:p-4.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
            rollFilter === "assigned"
              ? "bg-[#0E3320] text-white border-[#0E3320] shadow-sm"
              : "bg-white text-[#0E3320] border-[#E8DFD1] hover:border-emerald-400 hover:shadow-xs"
          }`}
        >
          <div className="space-y-0.5">
            <p className={`text-xs font-bold uppercase tracking-wider ${rollFilter === "assigned" ? "text-[#E4BF64]" : "text-emerald-700"}`}>
              Roll Numbers Issued
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-emerald-600">{withRollCount}</p>
            <p className={`text-xs ${rollFilter === "assigned" ? "text-white/70" : "text-[#8C9E90]"}`}>
              Assigned &amp; exam-ready
            </p>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${rollFilter === "assigned" ? "bg-white/10 text-[#E4BF64]" : "bg-emerald-50 text-emerald-700"}`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </button>

        {/* Roll No Pending */}
        <button
          onClick={() => setRollFilter(rollFilter === "unassigned" ? "all" : "unassigned")}
          className={`p-4 sm:p-4.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
            rollFilter === "unassigned"
              ? "bg-[#0E3320] text-white border-[#0E3320] shadow-sm"
              : "bg-white text-[#0E3320] border-[#E8DFD1] hover:border-amber-400 hover:shadow-xs"
          }`}
        >
          <div className="space-y-0.5">
            <p className={`text-xs font-bold uppercase tracking-wider ${rollFilter === "unassigned" ? "text-[#E4BF64]" : "text-amber-700"}`}>
              Awaiting Roll No
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-amber-600">{withoutRollCount}</p>
            <p className={`text-xs ${rollFilter === "unassigned" ? "text-white/70" : "text-[#8C9E90]"}`}>
              Requires college assignment
            </p>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${rollFilter === "unassigned" ? "bg-white/10 text-[#E4BF64]" : "bg-amber-50 text-amber-700"}`}>
            <Hash className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* ── Search & Filter Toolbar ── */}
      <div className="bg-white rounded-2xl border border-[#E8DFD1] p-3.5 sm:p-4 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-2.5 w-full">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C8261]" />
            <input
              value={enrolledSearch}
              onChange={(e) => setEnrolledSearch(e.target.value)}
              placeholder="Search by candidate name, enrollment no, roll no…"
              className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-[#0E3320] placeholder-[#B5A186] focus:outline-none focus:ring-4 focus:ring-[#C59B3F]/15 focus:border-[#C59B3F] focus:bg-white transition-all font-medium"
            />
            {enrolledSearch && (
              <button
                onClick={() => setEnrolledSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Course Filter Dropdown */}
          {courses?.length > 0 && (
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
            {filtered.length} {filtered.length === 1 ? "student" : "students"} listed
          </span>
          <button
            onClick={loadEnrolled}
            disabled={enrolledLoading}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#FAF7F2] border border-[#E8DFD1] hover:border-[#0E3320] text-[#0E3320] transition-all shadow-xs"
            title="Refresh Enrolled List"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${enrolledLoading ? "animate-spin" : ""}`} />
            <span className="font-bold text-xs sm:text-sm">Refresh</span>
          </button>
        </div>
      </div>

      {/* ── Enrolled Table Card ── */}
      <div className="rounded-3xl bg-white border border-[#E8DFD1] shadow-xs overflow-hidden">
        {enrolledLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-8 h-8 border-3 border-[#0E3320]/20 border-t-[#0E3320] rounded-full animate-spin" />
            <p className="text-sm font-semibold text-[#5C8261]">Loading verified enrolled records…</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-[#5C8261] space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] border border-[#E8DFD1] flex items-center justify-center text-[#8C671D]">
              <GraduationCap className="w-7 h-7 opacity-40" />
            </div>
            <div className="text-center space-y-1">
              <p className="text-base font-bold text-[#0E3320]">No enrolled students found</p>
              <p className="text-xs sm:text-sm text-[#5C8261] max-w-sm">
                {enrolledSearch || selectedCourse !== "all" || rollFilter !== "all"
                  ? "No matching records found. Try clearing your search or filter options."
                  : "Students will appear here once their admission applications have been approved by the council."}
              </p>
            </div>
            {(enrolledSearch || selectedCourse !== "all" || rollFilter !== "all") && (
              <button
                onClick={() => {
                  setEnrolledSearch("");
                  setSelectedCourse("all");
                  setRollFilter("all");
                }}
                className="text-xs sm:text-sm font-bold text-[#0E3320] underline hover:text-[#C59B3F] transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF7F2] text-[#0E3320] uppercase font-bold tracking-wider border-b border-[#E8DFD1] text-xs">
                <tr>
                  <th className="py-3.5 px-5">#</th>
                  <th className="py-3.5 px-6">Candidate Details</th>
                  <th className="py-3.5 px-4">Program Course</th>
                  <th className="py-3.5 px-4">Enrollment Number</th>
                  <th className="py-3.5 px-4">College Roll No</th>
                  <th className="py-3.5 px-4">Academic Session</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-6 text-right">Dossier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD1]/70">
                {filtered.map((s, i) => (
                  <tr
                    key={s.id}
                    className="hover:bg-[#FAF7F2]/60 transition-colors group"
                  >
                    <td className="py-4 px-5 font-mono text-[#5C8261] font-bold">
                      {i + 1}
                    </td>

                    {/* Candidate */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center shrink-0 border border-emerald-300">
                          {s.candidate_name?.charAt(0) || "S"}
                        </div>
                        <div>
                          <p className="font-bold text-[#0E3320] text-sm leading-snug">
                            {s.candidate_name}
                          </p>
                          <p className="text-xs text-[#5C8261] mt-0.5">
                            {s.father_name ? `F: ${s.father_name}` : ""}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Course */}
                    <td className="py-4 px-4 text-[#5C8261] font-semibold">
                      <p className="text-sm text-[#0E3320] font-semibold">
                        {s.courses?.course_name || "—"}
                      </p>
                      {s.courses?.duration_label && (
                        <p className="text-xs text-[#5C8261] mt-0.5">
                          {s.courses.duration_label}
                        </p>
                      )}
                    </td>

                    {/* Enrollment No */}
                    <td className="py-4 px-4 font-mono text-sm">
                      {s.enrollment_no ? (
                        <span className="bg-[#FAF7F2] text-[#0E3320] px-3 py-1 rounded-md border border-[#E8DFD1] font-bold tracking-wide">
                          {s.enrollment_no}
                        </span>
                      ) : (
                        <span className="text-[#C8B79E] font-normal text-xs">—</span>
                      )}
                    </td>

                    {/* Roll No */}
                    <td className="py-4 px-4 font-mono text-sm">
                      {s.roll_no ? (
                        <span className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-md border border-emerald-200 font-bold">
                          {s.roll_no}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">
                          Pending Assignment
                        </span>
                      )}
                    </td>

                    {/* Session */}
                    <td className="py-4 px-4 text-[#5C8261] font-semibold text-xs sm:text-sm">
                      {s.session_label || s.academic_session || "2026-27"}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Enrolled &amp; Verified</span>
                      </span>
                    </td>

                    {/* Action */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => openDetail(s)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#FAF7F2] hover:bg-[#0E3320] text-[#0E3320] hover:text-white border border-[#E8DFD1] hover:border-[#0E3320] text-xs sm:text-sm font-bold transition-all shadow-2xs active:scale-95"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View</span>
                      </button>
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
