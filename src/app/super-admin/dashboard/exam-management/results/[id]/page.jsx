"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  RefreshCw, Save, CheckCircle2, AlertTriangle,
  XCircle, Award, BookOpen,
} from "lucide-react";

const RESULT_COLORS = { PASS: "bg-emerald-100 text-emerald-700", FAIL: "bg-red-100 text-red-700", INCOMPLETE: "bg-amber-100 text-amber-700" };

export default function ResultEntryPage() {
  const { id } = useParams();
  const router = useRouter();

  const [result, setResult]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [marks, setMarks]     = useState({});
  const [saving, setSaving]   = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [msg, setMsg]         = useState({ text: "", type: "success" });

  const showMsg = (text, type = "success") => { setMsg({ text, type }); setTimeout(() => setMsg({ text: "", type: "success" }), 3500); };

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(`/api/admin/results/${id}`);
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Not found"); }
      else {
        setResult(json.data);
        // Init marks from existing data
        const m = {};
        (json.data.subjects || []).forEach(s => {
          m[s.subject_id] = { theory_marks: s.theory_marks ?? "", practical_marks: s.practical_marks ?? "", ca_marks: s.ca_marks ?? "" };
        });
        setMarks(m);
      }
    } catch { setError("Network error."); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [id]);

  const updateMark = (subjectId, field, val) => {
    setMarks(m => ({ ...m, [subjectId]: { ...m[subjectId], [field]: val === "" ? "" : Number(val) } }));
  };

  const handleSave = async () => {
    setSaving(true);
    const marksArr = Object.entries(marks).map(([subject_id, m]) => ({
      subject_id,
      theory_marks: Number(m.theory_marks) || 0,
      practical_marks: Number(m.practical_marks) || 0,
      ca_marks: Number(m.ca_marks) || 0,
    }));
    const res = await fetch(`/api/admin/results/${id}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ marks: marksArr }) });
    const json = await res.json();
    if (!res.ok) showMsg(json.error || "Failed to save", "error");
    else { showMsg("Marks saved!"); if (json.data) setResult(json.data); }
    setSaving(false);
  };

  const handlePublish = async (publish) => {
    setPublishing(true);
    const res = await fetch(`/api/admin/results/${id}/publish`, { method: publish ? "POST" : "DELETE" });
    const json = await res.json();
    if (!res.ok) showMsg(json.error || "Failed", "error");
    else { showMsg(publish ? "Result published!" : "Result unpublished"); load(); }
    setPublishing(false);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><RefreshCw className="w-6 h-6 animate-spin text-[#C59B3F]" /></div>;
  if (error) return (
    <div className="space-y-4 max-w-3xl">
      <button onClick={() => router.back()} className="flex items-center gap-1.5 text-xs font-semibold text-[#5C8261] hover:text-[#0E3320]">Back</button>
      <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
    </div>
  );

  const finalColor = RESULT_COLORS[result.final_result] || "bg-gray-100 text-gray-600";

  return (
    <div className="space-y-5 max-w-3xl">
      {/* Header */}
      <div className="flex items-center gap-3 flex-wrap">
        <button onClick={() => router.push("/super-admin/dashboard/exam-management?tab=results")}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C8261] hover:text-[#0E3320]">
          Back to Results
        </button>
        <div className="flex-1" />
        <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wide ${finalColor}`}>
          {result.final_result}
        </span>
        {result.result_published_at && (
          <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-700"><CheckCircle2 className="w-3.5 h-3.5" />Published</span>
        )}
      </div>

      {/* Student info */}
      <div className="bg-white rounded-2xl border border-[#DDD1BE] p-5">
        <div className="flex items-start gap-4">
          {result.photo_url && <img src={result.photo_url} alt="Photo" className="w-14 h-16 object-cover rounded-lg border-2 border-[#DDD1BE] shrink-0" />}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 flex-1 text-xs">
            {[["Name", result.candidate_name], ["Roll No.", result.roll_no], ["Course", result.course], ["Father", result.father_name], ["Session", result.session_label], ["Center", result.center_name]].map(([k, v]) => (
              <div key={k}><p className="text-[10px] font-bold uppercase text-[#5C8261]">{k}</p><p className="font-semibold text-[#0E3320]">{v || "—"}</p></div>
            ))}
          </div>
        </div>
      </div>

      {/* Inline msg */}
      {msg.text && (
        <div className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-medium ${msg.type === "success" ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {msg.type === "success" ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
          {msg.text}
        </div>
      )}

      {/* Marks entry table */}
      <div className="bg-white rounded-2xl border border-[#DDD1BE] overflow-hidden">
        <div className="bg-[#F2EDE4] px-5 py-3 border-b border-[#DDD1BE] flex items-center justify-between">
          <p className="text-xs font-bold text-[#0E3320] uppercase flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" />Subject-wise Marks</p>
          <button onClick={handleSave} disabled={saving}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0E3320] text-white text-xs font-bold hover:bg-[#15482D] disabled:opacity-60">
            <Save className="w-3.5 h-3.5" />{saving ? "Saving..." : "Save Marks"}
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="border-b border-[#DDD1BE] bg-[#FAF8F5]">
              <tr>
                <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Subject</th>
                <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">Theory<br/><span className="font-normal text-[#9B8265]">Max</span></th>
                <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">Practical<br/><span className="font-normal text-[#9B8265]">Max</span></th>
                <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">CA<br/><span className="font-normal text-[#9B8265]">Max</span></th>
                <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">Total</th>
                <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F2EDE4]">
              {result.subjects.map(s => {
                const m = marks[s.subject_id] || {};
                const theory = Number(m.theory_marks) || 0;
                const practical = Number(m.practical_marks) || 0;
                const ca = Number(m.ca_marks) || 0;
                const total = theory + practical + ca;
                const totalMax = s.theory_max + s.practical_max + s.ca_max;
                const pct = totalMax > 0 ? (total / totalMax) * 100 : 0;
                const hasMarks = m.theory_marks !== "" || m.practical_marks !== "" || m.ca_marks !== "";
                const pass = pct >= 40;

                const inp = "w-14 text-center px-1.5 py-1 rounded-lg border border-[#DDD1BE] bg-[#FAF8F5] text-xs text-[#0E3320] focus:outline-none focus:ring-1 focus:ring-[#C59B3F]";
                return (
                  <tr key={s.subject_id} className="hover:bg-[#FAF8F5]">
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-[#0E3320]">{s.subject_name}</p>
                      <p className="text-[10px] text-[#9B8265]">{s.subject_code}</p>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <input type="number" min="0" max={s.theory_max} value={m.theory_marks ?? ""} onChange={e => updateMark(s.subject_id, "theory_marks", e.target.value)} className={inp} />
                      <p className="text-[10px] text-[#9B8265] mt-0.5">/{s.theory_max}</p>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <input type="number" min="0" max={s.practical_max} value={m.practical_marks ?? ""} onChange={e => updateMark(s.subject_id, "practical_marks", e.target.value)} className={inp} />
                      <p className="text-[10px] text-[#9B8265] mt-0.5">/{s.practical_max}</p>
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      <input type="number" min="0" max={s.ca_max} value={m.ca_marks ?? ""} onChange={e => updateMark(s.subject_id, "ca_marks", e.target.value)} className={inp} />
                      <p className="text-[10px] text-[#9B8265] mt-0.5">/{s.ca_max}</p>
                    </td>
                    <td className="px-4 py-2.5 text-center font-bold text-[#0E3320]">
                      {hasMarks ? `${total}/${totalMax}` : "—"}
                    </td>
                    <td className="px-4 py-2.5 text-center">
                      {hasMarks
                        ? <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pass ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"}`}>{pass ? "PASS" : "FAIL"}</span>
                        : <span className="text-[#9B8265]">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot className="bg-[#F2EDE4] border-t-2 border-[#DDD1BE]">
              <tr>
                <td colSpan={4} className="px-4 py-2.5 font-bold text-[#0E3320] text-xs uppercase">Grand Total</td>
                <td className="px-4 py-2.5 text-center font-bold text-[#0E3320]">
                  {result.final_result !== "INCOMPLETE" ? `${result.grand_total_obtained}/${result.grand_total_max}` : `—/${result.grand_total_max}`}
                </td>
                <td className="px-4 py-2.5 text-center">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${finalColor}`}>{result.final_result}</span>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Publish / Unpublish */}
      <div className="bg-white rounded-2xl border border-[#DDD1BE] p-5 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <p className="text-sm font-bold text-[#0E3320]">Publish Result</p>
          <p className="text-xs text-[#5C8261] mt-0.5">
            {result.result_published_at
              ? `Published on ${new Date(result.result_published_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`
              : result.final_result === "INCOMPLETE" ? "Save all marks before publishing" : "Ready to publish"}
          </p>
        </div>
        {result.result_published_at ? (
          <button onClick={() => handlePublish(false)} disabled={publishing}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-sm font-bold disabled:opacity-60">
            <XCircle className="w-4 h-4" />{publishing ? "..." : "Unpublish"}
          </button>
        ) : (
          <button onClick={() => handlePublish(true)} disabled={publishing || result.final_result === "INCOMPLETE"}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-sm font-bold disabled:opacity-60">
            <Award className="w-4 h-4" />{publishing ? "Publishing..." : "Publish Result"}
          </button>
        )}
      </div>
    </div>
  );
}
