"use client";

import Link from "next/link";
import {
  Users,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ClipboardList,
  Eye,
  GraduationCap,
  UserPlus,
  ShieldCheck,
} from "lucide-react";
import { useDashboard, STATUS_LABELS } from "./DashboardContext";

export default function CollegeDashboardOverviewPage() {
  const { college, students, loading, counts, openDetail } = useDashboard();

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Hero Executive Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0B2618] via-[#0E3320] to-[#16462C] text-white border border-[#C59B3F]/35 p-6 sm:p-8 shadow-md relative overflow-hidden">
        {/* Subtle Ambient Background Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#C59B3F]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-xs sm:text-sm font-semibold border border-emerald-400/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Portal Active • Academic Session 2026–27
          </div>

          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
            Welcome, <span className="text-[#E4BF64]">{college?.college_name}</span>
          </h1>
          <p className="text-sm sm:text-base text-[#DDD1BE] max-w-xl leading-relaxed">
            Manage student admissions, verify candidates, assign roll numbers, and coordinate with the Central Parishad Directorate.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-2.5">
            <Link
              href="/college/dashboard/registrations"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#C59B3F] hover:bg-[#D4AF37] active:scale-95 text-[#071F13] font-bold text-sm shadow-sm transition-all"
            >
              <ClipboardList className="w-4 h-4" />
              <span>Manage Registrations</span>
            </Link>

            <Link
              href="/college/dashboard/pending"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 active:scale-95 text-white font-semibold text-sm border border-white/20 transition-all"
            >
              <Clock className="w-4 h-4 text-[#E4BF64]" />
              <span>Pending Review ({counts.pending})</span>
            </Link>

            <Link
              href="/college/dashboard/register"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600/30 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-400/30 font-semibold text-sm transition-all"
            >
              <UserPlus className="w-4 h-4" />
              <span>New Admission</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 4 Executive Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          {
            key: "all",
            label: "Total Students",
            desc: "Total registered",
            Icon: Users,
            bg: "bg-[#0E3320]/10 text-[#0E3320]",
            href: "/college/dashboard/registrations",
          },
          {
            key: "pending",
            label: "Pending Review",
            desc: "Awaiting review",
            Icon: Clock,
            bg: "bg-amber-100 text-amber-700",
            href: "/college/dashboard/pending",
          },
          {
            key: "approved",
            label: "Approved",
            desc: "Verified & active",
            Icon: CheckCircle2,
            bg: "bg-emerald-100 text-emerald-700",
            href: "/college/dashboard/enrolled",
          },
          {
            key: "rejected",
            label: "Rejected",
            desc: "Needs revision",
            Icon: AlertTriangle,
            bg: "bg-red-100 text-red-700",
            href: "/college/dashboard/registrations",
          },
        ].map(({ key, label, desc, Icon, bg, href }) => (
          <Link
            key={key}
            href={href}
            className="p-4 sm:p-5 rounded-2xl bg-white border border-[#E8DFD1] shadow-xs hover:shadow-md hover:border-[#C59B3F] hover:-translate-y-0.5 transition-all group flex flex-col justify-between"
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#5C8261]">
                {label}
              </span>
              <div className={`w-9 h-9 rounded-xl ${bg} flex items-center justify-center shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-[#0E3320] tracking-tight">
              {counts[key]}
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-[#5C8261] mt-2 pt-2 border-t border-[#F2EDE4]">
              <span>{desc}</span>
              <ChevronRight className="w-3.5 h-3.5 text-[#C59B3F] group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        ))}
      </div>

      {/* Recent Registrations Table Card */}
      <div className="rounded-3xl bg-white border border-[#E8DFD1] shadow-xs overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-[#E8DFD1] flex items-center justify-between bg-[#FCFAF7]">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-[#C59B3F]" />
            <h2 className="text-sm sm:text-base font-bold text-[#0E3320]">
              Recent Registrations
            </h2>
          </div>
          <Link
            href="/college/dashboard/registrations"
            className="text-xs sm:text-sm font-semibold text-[#8C671D] hover:text-[#0E3320] flex items-center gap-1 hover:underline transition-colors"
          >
            <span>View All ({counts.all})</span>
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-3 border-[#0E3320]/20 border-t-[#0E3320] rounded-full animate-spin" />
          </div>
        ) : students.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-[#5C8261] space-y-2">
            <Users className="w-9 h-9 opacity-30" />
            <p className="text-sm font-semibold">No candidate registrations yet.</p>
            <Link
              href="/college/dashboard/register"
              className="text-xs sm:text-sm text-[#0E3320] font-bold underline"
            >
              Register the first student
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[620px] text-left text-xs sm:text-sm">
              <thead className="bg-[#FAF7F2] text-[#0E3320] uppercase font-bold tracking-wider border-b border-[#E8DFD1] text-xs">
                <tr>
                  <th className="py-3.5 px-5">Candidate</th>
                  <th className="py-3.5 px-5">Course</th>
                  <th className="py-3.5 px-5">Roll No</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8DFD1]/60">
                {students.slice(0, 5).map((s) => {
                  const st = STATUS_LABELS[s.status] || STATUS_LABELS.pending;
                  const Icon = st.icon;
                  return (
                    <tr key={s.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      <td className="py-3.5 px-5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-[#EAE3D6] text-[#0E3320] font-bold text-xs flex items-center justify-center shrink-0">
                            {s.candidate_name?.charAt(0) || "S"}
                          </div>
                          <span className="font-bold text-[#0E3320] text-sm">{s.candidate_name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-5 text-[#5C8261] font-semibold text-xs sm:text-sm">
                        {s.courses?.course_name || "—"}
                      </td>
                      <td className="py-3.5 px-5 font-mono font-bold text-[#15482D] text-xs sm:text-sm">
                        {s.roll_no || <span className="text-[#C8B79E] font-normal">—</span>}
                      </td>
                      <td className="py-3.5 px-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${st.color}`}>
                          <Icon className="w-3.5 h-3.5" />
                          {st.label}
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-right">
                        <button
                          onClick={() => openDetail(s)}
                          className="p-1.5 rounded-lg text-[#5C8261] hover:text-[#0E3320] hover:bg-[#EAE3D6] transition-colors"
                          title="View & Manage"
                        >
                          <Eye className="w-4 h-4" />
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

      {/* Statutory Regulatory Notice */}
      <div className="flex items-start gap-3 p-4 rounded-2xl bg-[#EAF2ED] border border-[#2A7A50]/20 text-xs sm:text-sm text-[#1E603D]">
        <ShieldCheck className="w-4 h-4 shrink-0 text-[#2A7A50] mt-0.5" />
        <span className="leading-relaxed">
          Student roll numbers and marksheet records are issued under institutional authority and ratified by the Central Examination Directorate. For compliance and verification updates, contact the council IT cell.
        </span>
      </div>
    </div>
  );
}
