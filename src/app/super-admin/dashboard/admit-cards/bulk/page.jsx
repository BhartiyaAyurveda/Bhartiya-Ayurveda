"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Printer, RefreshCw, AlertTriangle, CheckCircle2,
  Hash, Users, XCircle, Eye,
} from "lucide-react";
import AdmitCardTemplate from "@/components/admin/AdmitCardTemplate";

function BulkAdmitCardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const exam_session_id = searchParams.get("exam_session_id");

  const [sessions, setSessions]   = useState([]);
  const [selSession, setSelSession] = useState(exam_session_id || "");
  const [loading, setLoading]     = useState(false);
  const [admitCards, setAdmitCards] = useState([]);
  const [skipped, setSkipped]     = useState([]);
  const [error, setError]         = useState("");
  const [printMode, setPrintMode] = useState(false);

  useEffect(() => {
    fetch("/api/admin/exam-sessions").then(r => r.json()).then(j => setSessions(j.data || []));
  }, []);

  useEffect(() => {
    if (exam_session_id && exam_session_id !== selSession) setSelSession(exam_session_id);
  }, [exam_session_id]);

  const load = async (sessionId) => {
    if (!sessionId) return;
    setLoading(true); setError(""); setAdmitCards([]); setSkipped([]);
    try {
      const res = await fetch(`/api/admin/admit-cards/bulk?exam_session_id=${sessionId}`);
      const json = await res.json();
      if (!res.ok) setError(json.error || "Failed to load");
      else { setAdmitCards(json.admitCards || []); setSkipped(json.skipped || []); }
    } catch { setError("Network error"); }
    setLoading(false);
  };

  useEffect(() => { if (selSession) load(selSession); }, [selSession]);

  const sessionLabel = sessions.find(s => s.id === selSession)?.session_label || sessions.find(s => s.id === selSession)?.session_name || selSession;

  if (printMode) return (
    <>
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 6mm 8mm; }
          html,body { background:#fff!important; -webkit-print-color-adjust:exact!important; print-color-adjust:exact!important; }
          .no-print { display:none!important; }
        }
      `}</style>
      <div className="no-print flex items-center gap-3 mb-4 p-4">
        <button onClick={() => setPrintMode(false)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C8261] hover:text-[#0E3320]">
          Back to Preview
        </button>
        <div className="flex-1" />
        <button onClick={() => window.print()}
          className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0E3320] text-white text-sm font-bold">
          <Printer className="w-4 h-4" /> Print All ({admitCards.length})
        </button>
      </div>
      <div className="space-y-6 max-w-[900px] mx-auto px-4">
        {admitCards.map((card, i) => (
          <AdmitCardTemplate key={card.id || i} data={card} showPageBreak={i < admitCards.length - 1} />
        ))}
      </div>
    </>
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => router.push("/super-admin/dashboard/exam-management")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C8261] hover:text-[#0E3320]">
          Exam Management
        </button>
        <div className="flex-1" />
        {admitCards.length > 0 && (
          <button onClick={() => setPrintMode(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-sm font-bold">
            <Printer className="w-4 h-4" /> Print All ({admitCards.length})
          </button>
        )}
      </div>

      <div>
        <h2 className="text-lg font-bold text-[#0E3320]">Bulk Admit Cards</h2>
        <p className="text-xs text-[#5C8261] mt-0.5">Generate and print admit cards for all eligible students in a session</p>
      </div>

      {/* Session selector */}
      <div className="bg-white rounded-2xl border border-[#DDD1BE] p-4 flex flex-wrap items-end gap-3">
        <div>
          <label className="block text-[10px] font-bold text-[#5C8261] uppercase mb-1">Select Exam Session</label>
          <select value={selSession} onChange={e => setSelSession(e.target.value)}
            className="px-3 py-2 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] min-w-[260px]">
            <option value="">— Select Session —</option>
            {sessions.map(s => (
              <option key={s.id} value={s.id}>{s.session_label || s.session_name}</option>
            ))}
          </select>
        </div>
        <button onClick={() => load(selSession)} disabled={!selSession || loading}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#F2EDE4] text-[#0E3320] text-sm font-bold hover:bg-[#DDD1BE] disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-16">
          <RefreshCw className="w-6 h-6 animate-spin text-[#C59B3F]" />
        </div>
      )}

      {!loading && selSession && (
        <>
          {/* Summary */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-white rounded-xl border border-[#DDD1BE] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center shrink-0"><CheckCircle2 className="w-5 h-5 text-emerald-600" /></div>
              <div><p className="text-xs text-[#5C8261]">Ready</p><p className="font-bold text-[#0E3320] text-lg">{admitCards.length}</p></div>
            </div>
            <div className="bg-white rounded-xl border border-[#DDD1BE] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-red-100 flex items-center justify-center shrink-0"><XCircle className="w-5 h-5 text-red-500" /></div>
              <div><p className="text-xs text-[#5C8261]">Skipped</p><p className="font-bold text-[#0E3320] text-lg">{skipped.length}</p></div>
            </div>
            <div className="bg-white rounded-xl border border-[#DDD1BE] p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F2EDE4] flex items-center justify-center shrink-0"><Users className="w-5 h-5 text-[#C59B3F]" /></div>
              <div><p className="text-xs text-[#5C8261]">Total</p><p className="font-bold text-[#0E3320] text-lg">{admitCards.length + skipped.length}</p></div>
            </div>
          </div>

          {/* Ready list */}
          {admitCards.length > 0 && (
            <div className="bg-white rounded-2xl border border-[#DDD1BE] overflow-hidden">
              <div className="bg-[#F2EDE4] px-4 py-2.5 border-b border-[#DDD1BE] flex items-center justify-between">
                <p className="text-xs font-bold text-[#0E3320] uppercase">Ready to Print — {admitCards.length} Students</p>
                <button onClick={() => setPrintMode(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#0E3320] text-white text-xs font-bold hover:bg-[#15482D]">
                  <Printer className="w-3.5 h-3.5" /> Print All
                </button>
              </div>
              <table className="w-full text-xs">
                <thead className="border-b border-[#DDD1BE] bg-[#FAF8F5]">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Roll No.</th>
                    <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Name</th>
                    <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Course</th>
                    <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Centre</th>
                    <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">Subjects</th>
                    <th className="px-4 py-2.5 text-right font-bold text-[#0E3320] uppercase">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EDE4]">
                  {admitCards.map((card, i) => (
                    <tr key={card.id || i} className="hover:bg-[#FAF8F5]">
                      <td className="px-4 py-2.5 font-bold text-[#C59B3F]">{card.roll_no}</td>
                      <td className="px-4 py-2.5 font-semibold text-[#0E3320]">{card.candidate_name}</td>
                      <td className="px-4 py-2.5 text-[#5C8261]">{card.course}</td>
                      <td className="px-4 py-2.5 text-[#5C8261]">{card.center_name}</td>
                      <td className="px-4 py-2.5 text-center text-[#0E3320]">{card.subjects?.length || 0}</td>
                      <td className="px-4 py-2.5 text-right">
                        <a href={`/super-admin/dashboard/admit-cards/${card.id}`} target="_blank" rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#F2EDE4] text-[#0E3320] text-[10px] font-bold hover:bg-[#DDD1BE]">
                          <Eye className="w-3 h-3" /> View
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Skipped list */}
          {skipped.length > 0 && (
            <div className="bg-white rounded-2xl border border-red-200 overflow-hidden">
              <div className="bg-red-50 px-4 py-2.5 border-b border-red-200">
                <p className="text-xs font-bold text-red-700 uppercase">Skipped — {skipped.length} Students (Incomplete Setup)</p>
              </div>
              <table className="w-full text-xs">
                <thead className="border-b border-red-100 bg-red-50/50">
                  <tr>
                    <th className="px-4 py-2 text-left font-bold text-red-700 uppercase">Roll No.</th>
                    <th className="px-4 py-2 text-left font-bold text-red-700 uppercase">Name</th>
                    <th className="px-4 py-2 text-left font-bold text-red-700 uppercase">Reason</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-red-100">
                  {skipped.map((s, i) => (
                    <tr key={s.id || i}>
                      <td className="px-4 py-2.5 font-bold text-[#9B8265]">{s.roll_no || "—"}</td>
                      <td className="px-4 py-2.5 text-[#0E3320]">{s.candidate_name}</td>
                      <td className="px-4 py-2.5 text-red-600">{s.reason}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {admitCards.length === 0 && skipped.length === 0 && (
            <div className="text-center py-16 bg-white rounded-2xl border border-[#DDD1BE]">
              <Hash className="w-10 h-10 mx-auto text-[#DDD1BE] mb-2" />
              <p className="font-semibold text-[#5C8261] text-sm">No eligible students found</p>
              <p className="text-xs text-[#9B8265] mt-1">Approve students and allot roll numbers first.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function BulkAdmitCardPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#C59B3F]" /></div>}>
      <BulkAdmitCardContent />
    </Suspense>
  );
}
