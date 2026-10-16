"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Pencil, Trash2, RefreshCw, X, CheckCircle2, AlertTriangle, Building2 } from "lucide-react";

const EMPTY_FORM = { course_id: "", exam_center: "", exam_date: "", exam_time: "", session_label: "", max_students: 100 };

export default function ExamConfigPage() {
  const [configs, setConfigs]   = useState([]);
  const [courses, setCourses]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId]     = useState(null);
  const [form, setForm]         = useState(EMPTY_FORM);
  const [saving, setSaving]     = useState(false);
  const [saveMsg, setSaveMsg]   = useState("");
  const [saveErr, setSaveErr]   = useState("");
  const [deleting, setDeleting] = useState(null);

  const load = useCallback(async () => {
    setLoading(true); setError("");
    try {
      const [cfgRes, crsRes] = await Promise.all([
        fetch("/api/admin/course-exam-config"),
        fetch("/api/admin/courses"),
      ]);
      const [cfgJson, crsJson] = await Promise.all([cfgRes.json(), crsRes.json()]);
      setConfigs(cfgJson.data || []);
      setCourses(crsJson.data || []);
    } catch { setError("Failed to load data."); }
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { setForm(EMPTY_FORM); setEditId(null); setSaveMsg(""); setSaveErr(""); setShowForm(true); };
  const openEdit   = (cfg) => {
    setForm({ course_id: cfg.course_id, exam_center: cfg.exam_center, exam_date: cfg.exam_date || "", exam_time: cfg.exam_time || "", session_label: cfg.session_label || "", max_students: cfg.max_students ?? 100 });
    setEditId(cfg.id); setSaveMsg(""); setSaveErr(""); setShowForm(true);
  };

  const handleSave = async () => {
    if (!form.course_id || !form.exam_center.trim()) { setSaveErr("Course and exam center are required."); return; }
    setSaving(true); setSaveErr(""); setSaveMsg("");
    try {
      const url   = editId ? `/api/admin/course-exam-config/${editId}` : "/api/admin/course-exam-config";
      const method = editId ? "PATCH" : "POST";
      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) { setSaveErr(json.error || "Save failed."); }
      else { setSaveMsg(editId ? "Updated successfully." : "Created successfully."); setShowForm(false); load(); }
    } catch { setSaveErr("Network error."); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this exam configuration?")) return;
    setDeleting(id);
    try {
      const res = await fetch(`/api/admin/course-exam-config/${id}`, { method: "DELETE" });
      if (res.ok) { setConfigs((c) => c.filter((x) => x.id !== id)); }
      else { const j = await res.json(); alert(j.error || "Delete failed."); }
    } catch { alert("Network error."); }
    setDeleting(null);
  };

  const fmtDate = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-[#0E3320]">Exam Configuration</h1>
          <p className="text-sm text-[#5C8261] mt-0.5">Configure exam centers, dates and sessions per course</p>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-sm font-bold transition-colors">
          <Plus className="w-4 h-4" /> Add Config
        </button>
      </div>

      {/* Inline form */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-[#DDD1BE] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-bold text-[#0E3320] text-sm">{editId ? "Edit Configuration" : "New Exam Configuration"}</p>
            <button onClick={() => setShowForm(false)}><X className="w-4 h-4 text-[#8C9E90]" /></button>
          </div>

          {saveErr && <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs"><AlertTriangle className="w-4 h-4" />{saveErr}</div>}
          {saveMsg && <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs"><CheckCircle2 className="w-4 h-4" />{saveMsg}</div>}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            <div className="sm:col-span-2 lg:col-span-1">
              <label className="block text-[10px] font-bold uppercase text-[#5C8261] mb-1">Course *</label>
              <select value={form.course_id} onChange={e => setForm(f => ({ ...f, course_id: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]">
                <option value="">— Select course —</option>
                {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
              </select>
            </div>
            <div className="sm:col-span-2 lg:col-span-2">
              <label className="block text-[10px] font-bold uppercase text-[#5C8261] mb-1">Exam Center *</label>
              <input type="text" value={form.exam_center} onChange={e => setForm(f => ({ ...f, exam_center: e.target.value }))}
                placeholder="e.g. Lucknow Examination Hall"
                className="w-full px-3 py-2 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#5C8261] mb-1">Exam Date</label>
              <input type="date" value={form.exam_date} onChange={e => setForm(f => ({ ...f, exam_date: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#5C8261] mb-1">Exam Time</label>
              <select
                value={form.exam_time || ""}
                onChange={e => setForm(f => ({ ...f, exam_time: e.target.value }))}
                className="w-full px-3 py-2 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
              >
                <option value="">— Select Timing —</option>
                <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                <option value="Evening (2:00 PM - 5:00 PM)">Evening (2:00 PM - 5:00 PM)</option>
                {form.exam_time && !["Morning (10:00 AM - 1:00 PM)", "Evening (2:00 PM - 5:00 PM)"].includes(form.exam_time) && (
                  <option value={form.exam_time}>{form.exam_time}</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#5C8261] mb-1">Session Label</label>
              <input type="text" value={form.session_label} onChange={e => setForm(f => ({ ...f, session_label: e.target.value }))}
                placeholder="e.g. 2025-26"
                className="w-full px-3 py-2 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#5C8261] mb-1">Max Students</label>
              <input type="number" min={1} value={form.max_students} onChange={e => setForm(f => ({ ...f, max_students: parseInt(e.target.value) || 100 }))}
                className="w-full px-3 py-2 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2 border-t border-[#EAE2D3]">
            <button onClick={() => setShowForm(false)} className="px-5 py-2 rounded-xl border border-[#DDD1BE] text-sm font-semibold text-[#0E3320] hover:bg-[#FAF8F5]">Cancel</button>
            <button onClick={handleSave} disabled={saving}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-xl bg-[#C59B3F] hover:bg-[#A8832F] text-white text-sm font-bold disabled:opacity-60 transition-colors">
              {saving ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Saving…</> : <><CheckCircle2 className="w-3.5 h-3.5" />Save</>}
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-16"><RefreshCw className="w-6 h-6 animate-spin text-[#C59B3F]" /></div>
      ) : error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
      ) : configs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-[#DDD1BE]">
          <Building2 className="w-10 h-10 mx-auto text-[#DDD1BE] mb-3" />
          <p className="text-[#5C8261] text-sm font-semibold">No exam configurations yet</p>
          <p className="text-[#8C9E90] text-xs mt-1">Click "Add Config" to create the first one</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#DDD1BE] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead>
                <tr className="bg-[#FAF8F5] border-b border-[#EAE2D3]">
                  <th className="text-left px-4 py-3 font-bold text-[#5C8261] uppercase text-[10px] tracking-wide">Course</th>
                  <th className="text-left px-4 py-3 font-bold text-[#5C8261] uppercase text-[10px] tracking-wide">Exam Center</th>
                  <th className="text-left px-4 py-3 font-bold text-[#5C8261] uppercase text-[10px] tracking-wide">Date</th>
                  <th className="text-left px-4 py-3 font-bold text-[#5C8261] uppercase text-[10px] tracking-wide">Time</th>
                  <th className="text-left px-4 py-3 font-bold text-[#5C8261] uppercase text-[10px] tracking-wide">Session</th>
                  <th className="text-left px-4 py-3 font-bold text-[#5C8261] uppercase text-[10px] tracking-wide">Max</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EAE2D3]">
                {configs.map((cfg) => (
                  <tr key={cfg.id} className="hover:bg-[#FAF8F5] transition-colors">
                    <td className="px-4 py-3 font-semibold text-[#0E3320]">{cfg.courses?.course_name || "—"}</td>
                    <td className="px-4 py-3 text-[#466551]">{cfg.exam_center}</td>
                    <td className="px-4 py-3 text-[#466551]">{fmtDate(cfg.exam_date)}</td>
                    <td className="px-4 py-3 text-[#466551]">{cfg.exam_time || "—"}</td>
                    <td className="px-4 py-3 text-[#466551]">{cfg.session_label || "—"}</td>
                    <td className="px-4 py-3 text-[#466551]">{cfg.max_students}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 justify-end">
                        <button onClick={() => openEdit(cfg)} className="p-1.5 rounded-lg hover:bg-[#EAE2D3] text-[#5C8261] transition-colors" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => handleDelete(cfg.id)} disabled={deleting === cfg.id}
                          className="p-1.5 rounded-lg hover:bg-red-100 text-[#9A3B2A] transition-colors disabled:opacity-50" title="Delete">
                          {deleting === cfg.id ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
