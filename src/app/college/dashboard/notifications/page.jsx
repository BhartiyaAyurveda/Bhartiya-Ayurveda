"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  Bell,
  RefreshCw,
  MessageSquare,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  ShieldAlert,
  User,
  Filter,
  Search,
  X,
  Sparkles
} from "lucide-react";
import { useDashboard } from "../DashboardContext";

export default function NotificationsPage() {
  const {
    notifications,
    notifLoading,
    loadNotifications,
    students,
    openDetail
  } = useDashboard();

  const [filterTab, setFilterTab] = useState("all"); // "all", "open", "resolved"
  const [search, setSearch]       = useState("");

  const openCount     = useMemo(() => notifications.filter((n) => n.status === "open").length, [notifications]);
  const resolvedCount = useMemo(() => notifications.filter((n) => n.status !== "open").length, [notifications]);

  const filtered = useMemo(() => {
    return notifications.filter((n) => {
      // Tab filter
      if (filterTab === "open" && n.status !== "open") return false;
      if (filterTab === "resolved" && n.status === "open") return false;

      // Search query
      if (search) {
        const q = search.toLowerCase();
        const matchesQuery =
          n.message?.toLowerCase().includes(q) ||
          n.field_name?.toLowerCase().includes(q) ||
          n.student_registrations?.candidate_name?.toLowerCase().includes(q) ||
          n.student_registrations?.enrollment_no?.toLowerCase().includes(q);
        if (!matchesQuery) return false;
      }

      return true;
    });
  }, [notifications, filterTab, search]);

  const handleResolve = (notif) => {
    const studentId = notif.student_registration_id || notif.student_registrations?.id;
    const student = students.find((s) => s.id === studentId);
    if (student) {
      openDetail(student);
    } else if (studentId) {
      openDetail({ id: studentId, candidate_name: notif.student_registrations?.candidate_name, status: "query_raised" });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl">
      {/* ── Page Header ── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0E3320] text-[#E4BF64]">
              <MessageSquare className="w-3.5 h-3.5 text-[#C59B3F]" />
              Council Directives &amp; Queries
            </span>
            <span className="text-xs sm:text-sm text-[#5C8261] font-semibold">
              Total Notices: {notifications.length}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0E3320] tracking-tight">
            Notifications &amp; Admin Queries
          </h1>
          <p className="text-xs sm:text-sm text-[#5C8261]">
            Official clarifications and document revision requests dispatched by the Central Examination Directorate.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={loadNotifications}
            disabled={notifLoading}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-[#E8DFD1] hover:border-[#C59B3F] text-sm font-bold text-[#0E3320] transition-all shadow-xs"
          >
            <RefreshCw className={`w-4 h-4 ${notifLoading ? "animate-spin" : ""}`} />
            <span>Refresh</span>
          </button>
          <Link
            href="/college/dashboard/pending"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-sm font-bold transition-all shadow-xs"
          >
            <Clock className="w-4 h-4 text-[#C59B3F]" />
            <span>Pending Desk</span>
          </Link>
        </div>
      </div>

      {/* ── 3 Status Metric Filter Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* All Notices */}
        <button
          onClick={() => setFilterTab("all")}
          className={`p-4 sm:p-4.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
            filterTab === "all"
              ? "bg-[#0E3320] text-white border-[#0E3320] shadow-sm"
              : "bg-white text-[#0E3320] border-[#E8DFD1] hover:border-[#C59B3F] hover:shadow-xs"
          }`}
        >
          <div className="space-y-0.5">
            <p className={`text-xs font-bold uppercase tracking-wider ${filterTab === "all" ? "text-[#E4BF64]" : "text-[#5C8261]"}`}>
              All Notifications
            </p>
            <p className="text-2xl font-extrabold tracking-tight">{notifications.length}</p>
            <p className={`text-xs ${filterTab === "all" ? "text-white/70" : "text-[#8C9E90]"}`}>
              Council communication log
            </p>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${filterTab === "all" ? "bg-white/10 text-[#E4BF64]" : "bg-[#FAF7F2] text-[#0E3320]"}`}>
            <Bell className="w-4 h-4" />
          </div>
        </button>

        {/* Action Required */}
        <button
          onClick={() => setFilterTab("open")}
          className={`p-4 sm:p-4.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
            filterTab === "open"
              ? "bg-[#0E3320] text-white border-[#0E3320] shadow-sm"
              : "bg-white text-[#0E3320] border-[#E8DFD1] hover:border-orange-400 hover:shadow-xs"
          }`}
        >
          <div className="space-y-0.5">
            <div className="flex items-center gap-1.5">
              <p className={`text-xs font-bold uppercase tracking-wider ${filterTab === "open" ? "text-[#E4BF64]" : "text-orange-700"}`}>
                Action Required
              </p>
              {openCount > 0 && <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />}
            </div>
            <p className="text-2xl font-extrabold tracking-tight text-orange-600">{openCount}</p>
            <p className={`text-xs ${filterTab === "open" ? "text-white/70" : "text-[#8C9E90]"}`}>
              Requires college revision
            </p>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${filterTab === "open" ? "bg-white/10 text-[#E4BF64]" : "bg-orange-50 text-orange-700"}`}>
            <AlertCircle className="w-4 h-4" />
          </div>
        </button>

        {/* Resolved */}
        <button
          onClick={() => setFilterTab("resolved")}
          className={`p-4 sm:p-4.5 rounded-2xl border text-left transition-all flex items-center justify-between ${
            filterTab === "resolved"
              ? "bg-[#0E3320] text-white border-[#0E3320] shadow-sm"
              : "bg-white text-[#0E3320] border-[#E8DFD1] hover:border-emerald-400 hover:shadow-xs"
          }`}
        >
          <div className="space-y-0.5">
            <p className={`text-xs font-bold uppercase tracking-wider ${filterTab === "resolved" ? "text-[#E4BF64]" : "text-emerald-700"}`}>
              Resolved &amp; Cleared
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-emerald-600">{resolvedCount}</p>
            <p className={`text-xs ${filterTab === "resolved" ? "text-white/70" : "text-[#8C9E90]"}`}>
              Ratified by admin
            </p>
          </div>
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${filterTab === "resolved" ? "bg-white/10 text-[#E4BF64]" : "bg-emerald-50 text-emerald-700"}`}>
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </button>
      </div>

      {/* ── Search Toolbar ── */}
      <div className="bg-white rounded-2xl border border-[#E8DFD1] p-3 sm:p-4 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#5C8261]" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search queries by candidate name, field, or directive details…"
            className="w-full pl-10 pr-9 py-2.5 text-sm rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-[#0E3320] placeholder-[#B5A186] focus:outline-none focus:ring-4 focus:ring-[#C59B3F]/15 focus:border-[#C59B3F] focus:bg-white transition-all font-medium"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <span className="text-xs sm:text-sm text-[#5C8261] font-semibold shrink-0 hidden sm:inline">
          {filtered.length} {filtered.length === 1 ? "notice" : "notices"}
        </span>
      </div>

      {/* ── Notification List ── */}
      {notifLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-8 h-8 border-3 border-[#0E3320]/20 border-t-[#0E3320] rounded-full animate-spin" />
          <p className="text-sm font-semibold text-[#5C8261]">Checking council directives…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-[#E8DFD1] shadow-xs space-y-3">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <div className="text-center space-y-1">
            <p className="text-base font-bold text-[#0E3320]">
              {search || filterTab !== "all"
                ? "No matching notifications found"
                : "No active queries or directives"}
            </p>
            <p className="text-xs sm:text-sm text-[#5C8261] max-w-sm">
              {search || filterTab !== "all"
                ? "Try clearing your search query or switching tabs."
                : "All candidate admissions under your college are verified and in full council compliance."}
            </p>
          </div>
          {(search || filterTab !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setFilterTab("all");
              }}
              className="text-sm font-bold text-[#0E3320] underline hover:text-[#C59B3F] transition-colors"
            >
              Show all notifications
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3.5">
          {filtered.map((notif) => {
            const isOpen = notif.status === "open";
            return (
              <div
                key={notif.id}
                className={`p-5 rounded-3xl border transition-all shadow-xs ${
                  isOpen
                    ? "bg-white border-amber-300 hover:border-amber-400 hover:shadow-sm ring-1 ring-amber-400/20"
                    : "bg-white border-[#E8DFD1] hover:border-emerald-300"
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1 space-y-2.5 min-w-0">
                    {/* Badge Row */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
                          isOpen
                            ? "bg-amber-100 text-amber-800 border-amber-300"
                            : "bg-emerald-100 text-emerald-800 border-emerald-300"
                        }`}
                      >
                        {isOpen ? (
                          <>
                            <span className="w-2 h-2 rounded-full bg-amber-600 animate-pulse" />
                            Action Required
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                            Resolved &amp; Approved
                          </>
                        )}
                      </span>

                      {notif.field_name && (
                        <span className="text-xs font-bold text-[#0E3320] bg-[#FAF7F2] border border-[#E8DFD1] px-2.5 py-0.5 rounded-md capitalize">
                          Field: {notif.field_name.replace(/_/g, " ")}
                        </span>
                      )}

                      <span className="text-xs text-[#8C9E90] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#A59580]" />
                        {new Date(notif.created_at).toLocaleDateString("en-IN", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    {/* Query Comment */}
                    <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD1] text-sm text-[#0E3320]">
                      <p className="font-semibold leading-relaxed">
                        "{notif.message}"
                      </p>
                    </div>

                    {/* Student Context Strip */}
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-[#5C8261] pt-0.5">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#EAE3D6] text-[#0E3320] font-bold text-xs flex items-center justify-center shrink-0">
                          {notif.student_registrations?.candidate_name?.charAt(0) || "S"}
                        </div>
                        <span className="font-bold text-[#0E3320] text-sm">
                          {notif.student_registrations?.candidate_name || "Applicant"}
                        </span>
                      </div>

                      {notif.student_registrations?.enrollment_no && (
                        <>
                          <span>•</span>
                          <span className="font-mono text-[#0E3320] font-semibold text-xs sm:text-sm">
                            Enr: {notif.student_registrations.enrollment_no}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 self-end sm:self-center">
                    <button
                      onClick={() => handleResolve(notif)}
                      className={`inline-flex items-center gap-2 px-4.5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-xs active:scale-95 ${
                        isOpen
                          ? "bg-amber-600 hover:bg-amber-700 text-white shadow-sm"
                          : "bg-[#FAF7F2] hover:bg-[#0E3320] text-[#0E3320] hover:text-white border border-[#E8DFD1]"
                      }`}
                    >
                      {isOpen ? (
                        <>
                          <span>Resolve &amp; Edit Dossier</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-4 h-4" />
                          <span>View Application</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
