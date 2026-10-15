"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, ClipboardList, GraduationCap, UserPlus, Sparkles, RefreshCw } from "lucide-react";
import StudentRegistrationForm from "@/components/college/StudentRegistrationForm";
import { useDashboard } from "../DashboardContext";

export default function RegisterStudentPage() {
  const { college, courses, loadStudents, showToast } = useDashboard();
  const [regSuccess, setRegSuccess] = useState(null);
  const searchParams = useSearchParams();
  const draftId = searchParams.get("draftId");

  const [draftData, setDraftData] = useState(null);   // { form_data, current_step }
  const [draftLoading, setDraftLoading] = useState(!!draftId);
  const [draftError, setDraftError] = useState("");

  useEffect(() => {
    if (!draftId) return;
    setDraftLoading(true);
    fetch(`/api/college/drafts/${draftId}`)
      .then(r => r.json())
      .then(data => {
        if (data.ok && data.draft) setDraftData(data.draft);
        else setDraftError(data.error || "Draft not found");
      })
      .catch(() => setDraftError("Failed to load draft"))
      .finally(() => setDraftLoading(false));
  }, [draftId]);

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#0E3320] text-[#E4BF64] whitespace-nowrap">
              <Sparkles className="w-3 h-3 text-[#C59B3F] shrink-0" />
              <span className="hidden sm:inline">Institutional Admission Form</span>
              <span className="sm:hidden">Admission Form</span>
            </span>
            <span className="text-xs sm:text-sm text-[#5C8261] font-semibold whitespace-nowrap">
              Session 2026–27
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0E3320] tracking-tight">
            {draftId ? "Resume Registration" : "Register New Candidate"}
          </h1>
          <p className="text-xs sm:text-sm text-[#5C8261]">
            Lodge student admission application under <strong>{college?.college_name || "your institution"}</strong> for Central Parishad approval.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Link href="/college/dashboard/drafts"
            className="inline-flex items-center gap-2 text-xs text-[#0E3320] hover:text-[#C59B3F] font-bold bg-white px-3.5 py-2 rounded-xl border border-[#E8DFD1] hover:border-[#C59B3F] shadow-xs transition-all">
            <GraduationCap className="w-3.5 h-3.5 text-[#8C671D]" />
            <span>Saved Drafts</span>
          </Link>
          <Link href="/college/dashboard/registrations"
            className="inline-flex items-center gap-2 text-xs text-[#0E3320] hover:text-[#C59B3F] font-bold bg-white px-3.5 py-2 rounded-xl border border-[#E8DFD1] hover:border-[#C59B3F] shadow-xs transition-all">
            <ClipboardList className="w-3.5 h-3.5 text-[#8C671D]" />
            <span>All Registrations</span>
          </Link>
        </div>
      </div>

      {/* Draft loading / error state */}
      {draftId && draftLoading && (
        <div className="flex items-center justify-center py-16 gap-3 text-[#5C8261]">
          <RefreshCw className="w-5 h-5 animate-spin text-[#C59B3F]" />
          <span className="text-sm font-semibold">Loading saved draft…</span>
        </div>
      )}

      {draftId && draftError && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm font-semibold">
          {draftError} — <Link href="/college/dashboard/register" className="underline font-bold">Start a new registration instead</Link>
        </div>
      )}

      {/* Success Confirmation Card or Multi-step Form */}
      {!draftLoading && !draftError && (
        regSuccess ? (
          <div className="bg-white rounded-3xl border border-emerald-200 p-8 sm:p-12 shadow-sm text-center space-y-5">
            <div className="w-16 h-16 rounded-3xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs border border-emerald-200">
              <CheckCircle2 className="w-9 h-9" />
            </div>

            <div className="space-y-1.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs sm:text-sm font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Registration Submitted Successfully
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#0E3320]">
                {regSuccess.candidate_name}
              </h2>
              <p className="text-sm text-[#5C8261]">
                Student registration has been submitted for admin review.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FAF8F5] border border-[#E8DFD1] max-w-sm mx-auto text-left space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-[#5C8261]">Enrollment No:</span>
                <span className="font-mono font-bold text-[#0E3320] tracking-wide">
                  {regSuccess.enrollment_no || `#${regSuccess.id?.slice(0, 10).toUpperCase()}`}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C8261]">Status:</span>
                <span className="font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full text-xs">
                  Under Review
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#5C8261]">College:</span>
                <span className="font-semibold text-[#0E3320] text-right">
                  {college?.college_name}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-3">
              <button
                onClick={() => { setRegSuccess(null); loadStudents(); }}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0E3320] hover:bg-[#15482D] active:scale-95 text-white text-sm font-bold transition-all shadow-sm"
              >
                <UserPlus className="w-4 h-4 text-[#C59B3F]" />
                <span>Register Another Student</span>
              </button>
              <Link href="/college/dashboard/registrations"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border border-[#DDD1BE] hover:border-[#0E3320] active:scale-95 text-[#0E3320] text-sm font-bold transition-all shadow-xs">
                <span>View in All Registrations</span>
              </Link>
            </div>
          </div>
        ) : (
          <StudentRegistrationForm
            courses={courses}
            college={college}
            draftId={draftId || null}
            initialData={draftData ? { form: draftData.form_data, step: draftData.current_step } : null}
            onSuccess={(data) => {
              setRegSuccess(data);
              showToast(`${data.candidate_name} registered successfully!`, "success");
              loadStudents();
            }}
          />
        )
      )}
    </div>
  );
}
