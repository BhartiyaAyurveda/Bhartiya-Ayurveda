"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, Calendar, Hash, BarChart2, Plus, Trash2, Pencil,
  RefreshCw, CheckCircle2, AlertTriangle, Save,
  FileText, UserCheck, XCircle, Eye, ChevronDown, Printer, MapPin,
  Clock, Users, Sparkles, CheckSquare, Square, Search, GraduationCap,
} from "lucide-react";
import { getNextSession, getPrevSession, get6DigitSession } from "@/lib/enrollment-roll-utils";

const TABS = [
  { id: "subjects",   label: "Subjects",     icon: BookOpen },
  { id: "datesheet",  label: "Datesheet",    icon: Calendar },
  { id: "rollnos",    label: "Roll Numbers", icon: Hash },
  { id: "results",    label: "Results",      icon: BarChart2 },
  { id: "centers",    label: "Centers",      icon: MapPin },
];

// ── Shared filter bar ──────────────────────────────────────
function FilterBar({ courses, sessions, selectedCourse, selectedSession, onCourseChange, onSessionChange, showSession = true }) {
  return (
    <div className="flex flex-wrap gap-3">
      <select value={selectedCourse} onChange={e => onCourseChange(e.target.value)}
        className="px-3 py-2 rounded-xl border border-[#DDD1BE] bg-white text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] min-w-[200px]">
        <option value="">— All Courses —</option>
        {courses.map(c => <option key={c.id} value={c.course_name}>{c.course_name}</option>)}
      </select>
      {showSession && (
        <select value={selectedSession} onChange={e => onSessionChange(e.target.value)}
          className="px-3 py-2 rounded-xl border border-[#DDD1BE] bg-white text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] min-w-[200px]">
          <option value="">— Select Session —</option>
          {sessions.map(s => <option key={s.id} value={s.id}>{s.session_label || s.session_name || s.id}</option>)}
        </select>
      )}
    </div>
  );
}

// ── Toast ────────────────────────────────────────────────
function Toast({ toast }) {
  if (!toast.show) return null;
  return (
    <div className={`fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold ${toast.type === "success" ? "bg-emerald-600 text-white" : "bg-red-600 text-white"}`}>
      {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
      {toast.message}
    </div>
  );
}

// ── Shared Year-to-Session Transition Helper ───────────────
async function advanceOrRecedeSession({
  currentYear,
  newYear,
  currentSessionId,
  sessions = [],
  setSessions,
  setSelectedSession,
  showToast,
}) {
  if (!setSelectedSession || newYear === currentYear) return;

  const currSess =
    sessions.find((s) => s.id === currentSessionId) ||
    sessions.find((s) => s.is_active) ||
    sessions[0];
  const currName = currSess?.session_name || currSess?.academic_session || currSess?.session_label || "";

  const oldY = parseInt(currentYear, 10) || 1;
  const newY = parseInt(newYear, 10) || 1;
  const diff = newY - oldY;

  if (diff > 0 && currName) {
    let targetName = currName;
    for (let i = 0; i < diff; i++) {
      targetName = getNextSession(targetName);
    }

    if (targetName) {
      const existing = sessions.find((s) => {
        const sName = s.session_name || s.academic_session || s.session_label || "";
        return sName === targetName || get6DigitSession(sName) === get6DigitSession(targetName);
      });

      if (existing) {
        setSelectedSession(existing.id);
        if (showToast) {
          showToast(`Switched session to ${existing.session_name || targetName} for ${newYear === "3" ? "3rd" : "2nd"} Year`);
        }
        return;
      }

      try {
        const res = await fetch("/api/admin/exam-sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ session_name: targetName }),
        });
        const json = await res.json();
        if (res.ok && json.data) {
          const newSess = json.data;
          if (typeof setSessions === "function") {
            setSessions((prev) => [newSess, ...prev]);
          }
          setSelectedSession(newSess.id);
          if (showToast) {
            showToast(`Created & switched session to ${targetName} for ${newYear === "3" ? "3rd" : "2nd"} Year`);
          }
          return;
        }
      } catch (err) {
        console.error("Failed to auto-create next session:", err);
      }
    }
  } else if (diff < 0 && currName) {
    const steps = Math.abs(diff);
    let targetName = currName;
    for (let i = 0; i < steps; i++) {
      targetName = getPrevSession(targetName);
    }

    if (targetName) {
      const existing = sessions.find((s) => {
        const sName = s.session_name || s.academic_session || s.session_label || "";
        return sName === targetName || get6DigitSession(sName) === get6DigitSession(targetName);
      });

      if (existing) {
        setSelectedSession(existing.id);
        if (showToast) {
          showToast(`Switched back to session ${existing.session_name || targetName} for ${newYear === "1" ? "1st" : "2nd"} Year`);
        }
        return;
      }
    }
  }
}

// ══════════════════════════════════════════════════════════
// TAB 1 — SUBJECTS
// ══════════════════════════════════════════════════════════
function SubjectsTab({
  courses = [],
  sessions = [],
  setSessions,
  selectedCourse: propCourse,
  setSelectedCourse: propSetCourse,
  selectedSession: propSession,
  setSelectedSession: propSetSession,
  selectedYear: propYear,
  setSelectedYear: propSetYear,
  showToast,
}) {
  const [localCourse, setLocalCourse] = useState("");
  const [localSession, setLocalSession] = useState("");
  const [localYear, setLocalYear] = useState("1");

  const selectedCourse = propCourse !== undefined ? propCourse : localCourse;
  const setSelectedCourse = propSetCourse || setLocalCourse;
  const selectedSession = propSession !== undefined ? propSession : localSession;
  const setSelectedSession = propSetSession || setLocalSession;
  const selectedYear = propYear !== undefined ? propYear : localYear;
  const setSelectedYear = propSetYear || setLocalYear;

  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({ subject_name: "", subject_code: "", theory_max: 100, practical_max: 0, ca_max: 0 });
  const [saving, setSaving] = useState(false);

  const handleYearChange = async (newYear) => {
    if (newYear === selectedYear) return;
    await advanceOrRecedeSession({
      currentYear: selectedYear,
      newYear,
      currentSessionId: selectedSession,
      sessions,
      setSessions,
      setSelectedSession,
      showToast,
    });
    setSelectedYear(newYear);
  };

  const load = useCallback(async (course, year) => {
    if (!course) return;
    setLoading(true);
    const yrParam = year ? `&year_number=${year}` : "";
    const res = await fetch(`/api/admin/subjects?course_name=${encodeURIComponent(course)}${yrParam}`);
    const json = await res.json();
    setSubjects(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(selectedCourse, selectedYear); }, [selectedCourse, selectedYear, load]);

  const handleAdd = async () => {
    if (!selectedCourse || !addForm.subject_name) return showToast("Select a course and enter subject name", "error");
    setSaving(true);
    const res = await fetch("/api/admin/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...addForm, course_name: selectedCourse, year_number: Number(selectedYear) || 1 })
    });
    const json = await res.json();
    if (!res.ok) { showToast(json.error || "Failed", "error"); }
    else {
      showToast(`Subject added to Year ${selectedYear}!`);
      setAddForm({ subject_name: "", subject_code: "", theory_max: 100, practical_max: 0, ca_max: 0 });
      load(selectedCourse, selectedYear);
    }
    setSaving(false);
  };

  const handleEdit = async (id) => {
    setSaving(true);
    const res = await fetch(`/api/admin/subjects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editForm) });
    const json = await res.json();
    if (!res.ok) { showToast(json.error || "Failed", "error"); }
    else { showToast("Subject updated!"); setEditingId(null); load(selectedCourse, selectedYear); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this subject? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/subjects/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) showToast(json.error || "Failed to delete", "error");
    else { showToast("Subject deleted!"); load(selectedCourse, selectedYear); }
  };

  const inputCls = "px-2 py-1.5 rounded-lg border border-[#DDD1BE] bg-[#FAF8F5] text-xs text-[#0E3320] focus:outline-none focus:ring-1 focus:ring-[#C59B3F] w-full";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar courses={courses} sessions={[]} selectedCourse={selectedCourse} selectedSession="" onCourseChange={setSelectedCourse} onSessionChange={() => {}} showSession={false} />

        {selectedCourse && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C8261]">Year:</span>
            <div className="inline-flex rounded-xl bg-[#FAF8F5] p-1 border border-[#DDD1BE]">
              {[
                { yr: "1", label: "1st Year", icon: GraduationCap },
                { yr: "2", label: "2nd Year", icon: Sparkles },
                { yr: "3", label: "3rd Year", icon: Sparkles },
              ].map(({ yr, label, icon: Icon }) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => handleYearChange(yr)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedYear === yr
                      ? "bg-[#0E3320] text-white shadow-sm"
                      : "text-[#5C8261] hover:text-[#0E3320] hover:bg-white/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedCourse && (
        <>
          {/* Add subject */}
          <div className="bg-white rounded-xl border border-[#DDD1BE] p-4">
            <p className="text-xs font-bold text-[#0E3320] uppercase mb-3">Add New Subject ({selectedYear === "1" ? "1st Year" : selectedYear === "2" ? "2nd Year" : "3rd Year"})</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              <div className="sm:col-span-2"><label className="text-[10px] font-bold text-[#5C8261] uppercase">Subject Name *</label><input value={addForm.subject_name} onChange={e => setAddForm(f => ({ ...f, subject_name: e.target.value }))} className={inputCls} placeholder="e.g. Anatomy" /></div>
              <div><label className="text-[10px] font-bold text-[#5C8261] uppercase">Code</label><input value={addForm.subject_code} onChange={e => setAddForm(f => ({ ...f, subject_code: e.target.value }))} className={inputCls} placeholder="e.g. ANAT101" /></div>
              <div><label className="text-[10px] font-bold text-[#5C8261] uppercase">Theory Max</label><input type="number" value={addForm.theory_max} onChange={e => setAddForm(f => ({ ...f, theory_max: +e.target.value }))} className={inputCls} /></div>
              <div><label className="text-[10px] font-bold text-[#5C8261] uppercase">Practical Max</label><input type="number" value={addForm.practical_max} onChange={e => setAddForm(f => ({ ...f, practical_max: +e.target.value }))} className={inputCls} /></div>
            </div>
            <div className="mt-3 flex justify-end">
              <button onClick={handleAdd} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#0E3320] text-white text-xs font-bold hover:bg-[#15482D] disabled:opacity-60"><Plus className="w-3.5 h-3.5" />{saving ? "Saving..." : "Add Subject"}</button>
            </div>
          </div>

          {/* Subjects list */}
          <div className="bg-white rounded-xl border border-[#DDD1BE] overflow-hidden">
            <div className="bg-[#F2EDE4] px-4 py-2.5 border-b border-[#DDD1BE]">
              <p className="text-xs font-bold text-[#0E3320] uppercase">Subjects for {selectedCourse} • {selectedYear === "1" ? "1st Year" : selectedYear === "2" ? "2nd Year" : "3rd Year"} ({subjects.length})</p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-10"><RefreshCw className="w-5 h-5 animate-spin text-[#C59B3F]" /></div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-10 text-[#5C8261] text-sm">No subjects defined yet for {selectedYear === "1" ? "1st Year" : selectedYear === "2" ? "2nd Year" : "3rd Year"}.</div>
            ) : (
              <table className="w-full text-xs">
                <thead className="border-b border-[#DDD1BE] bg-[#FAF8F5]">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Subject</th>
                    <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Code</th>
                    <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">Theory</th>
                    <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">Practical</th>
                    <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">CA</th>
                    <th className="px-4 py-2.5 text-right font-bold text-[#0E3320] uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EDE4]">
                  {subjects.map(s => (
                    <tr key={s.id} className="hover:bg-[#FAF8F5]">
                      {editingId === s.id ? (
                        <>
                          <td className="px-4 py-2"><input value={editForm.subject_name || ""} onChange={e => setEditForm(f => ({ ...f, subject_name: e.target.value }))} className={inputCls} /></td>
                          <td className="px-4 py-2"><input value={editForm.subject_code || ""} onChange={e => setEditForm(f => ({ ...f, subject_code: e.target.value }))} className={inputCls} /></td>
                          <td className="px-4 py-2"><input type="number" value={editForm.theory_max ?? ""} onChange={e => setEditForm(f => ({ ...f, theory_max: +e.target.value }))} className={inputCls} /></td>
                          <td className="px-4 py-2"><input type="number" value={editForm.practical_max ?? ""} onChange={e => setEditForm(f => ({ ...f, practical_max: +e.target.value }))} className={inputCls} /></td>
                          <td className="px-4 py-2"><input type="number" value={editForm.ca_max ?? ""} onChange={e => setEditForm(f => ({ ...f, ca_max: +e.target.value }))} className={inputCls} /></td>
                          <td className="px-4 py-2 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => handleEdit(s.id)} disabled={saving} className="px-2 py-1 rounded-lg bg-[#0E3320] text-white text-[10px] font-bold"><Save className="w-3 h-3" /></button>
                              <button onClick={() => setEditingId(null)} className="px-2 py-1 rounded-lg bg-[#F2EDE4] text-[#0E3320] text-[10px] font-bold">Cancel</button>
                            </div>
                          </td>
                        </>
                      ) : (
                        <>
                          <td className="px-4 py-2.5 font-semibold text-[#0E3320]">{s.subject_name}</td>
                          <td className="px-4 py-2.5 text-[#5C8261]">{s.subject_code || "—"}</td>
                          <td className="px-4 py-2.5 text-center text-[#0E3320]">{s.theory_max}</td>
                          <td className="px-4 py-2.5 text-center text-[#0E3320]">{s.practical_max}</td>
                          <td className="px-4 py-2.5 text-center text-[#0E3320]">{s.ca_max}</td>
                          <td className="px-4 py-2.5 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button onClick={() => { setEditingId(s.id); setEditForm({ subject_name: s.subject_name, subject_code: s.subject_code, theory_max: s.theory_max, practical_max: s.practical_max, ca_max: s.ca_max }); }} className="p-1.5 rounded-lg hover:bg-[#F2EDE4] text-[#5C8261] hover:text-[#0E3320]"><Pencil className="w-3.5 h-3.5" /></button>
                              <button onClick={() => handleDelete(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#5C8261] hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                            </div>
                          </td>
                        </>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// TAB 2 — DATESHEET
// ══════════════════════════════════════════════════════════
function DatesheetTab({
  courses = [],
  sessions = [],
  setSessions,
  selectedCourse: propCourse,
  setSelectedCourse: propSetCourse,
  selectedSession: propSession,
  setSelectedSession: propSetSession,
  selectedYear: propYear,
  setSelectedYear: propSetYear,
  showToast,
}) {
  const [localCourse, setLocalCourse] = useState("");
  const [localSession, setLocalSession] = useState("");
  const [localYear, setLocalYear] = useState("1");

  const selectedCourse = propCourse !== undefined ? propCourse : localCourse;
  const setSelectedCourse = propSetCourse || setLocalCourse;
  const selectedSession = propSession !== undefined ? propSession : localSession;
  const setSelectedSession = propSetSession || setLocalSession;
  const selectedYear = propYear !== undefined ? propYear : localYear;
  const setSelectedYear = propSetYear || setLocalYear;

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Auto-select session on first load if none selected
  useEffect(() => {
    if (!selectedSession && sessions.length > 0) {
      const active = sessions.find((s) => s.is_active) || sessions[0];
      if (active) setSelectedSession(active.id);
    }
  }, [sessions, selectedSession, setSelectedSession]);

  const handleYearChange = async (newYear) => {
    if (newYear === selectedYear) return;
    await advanceOrRecedeSession({
      currentYear: selectedYear,
      newYear,
      currentSessionId: selectedSession,
      sessions,
      setSessions,
      setSelectedSession,
      showToast,
    });
    setSelectedYear(newYear);
  };

  const load = useCallback(async () => {
    if (!selectedCourse || !selectedSession) return;
    setLoading(true);
    const yrParam = selectedYear ? `&year_number=${selectedYear}` : "";
    const res = await fetch(`/api/admin/datesheets?exam_session_id=${selectedSession}&course_name=${encodeURIComponent(selectedCourse)}${yrParam}`);
    const json = await res.json();
    setRows(json.data || []);
    setLoading(false);
  }, [selectedCourse, selectedSession, selectedYear]);

  useEffect(() => { load(); }, [load]);

  const update = (idx, field, val) => setRows(r => r.map((row, i) => i === idx ? { ...row, [field]: val } : row));

  const handleSave = async () => {
    if (!selectedSession) return;
    setSaving(true);
    const entries = rows.map(r => ({ subject_id: r.id, exam_date: r.exam_date || null, exam_time: r.exam_time || null }));
    const res = await fetch("/api/admin/datesheets", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ exam_session_id: selectedSession, entries }) });
    const json = await res.json();
    if (!res.ok) showToast(json.error || "Failed to save", "error");
    else { showToast("Datesheet saved!"); load(); }
    setSaving(false);
  };

  const inputCls = "px-2 py-1 rounded-lg border border-[#DDD1BE] bg-[#FAF8F5] text-xs text-[#0E3320] focus:outline-none focus:ring-1 focus:ring-[#C59B3F]";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar courses={courses} sessions={sessions} selectedCourse={selectedCourse} selectedSession={selectedSession} onCourseChange={setSelectedCourse} onSessionChange={setSelectedSession} />

        {selectedCourse && selectedSession && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#5C8261]">Year:</span>
            <div className="inline-flex rounded-xl bg-[#FAF8F5] p-1 border border-[#DDD1BE]">
              {[
                { yr: "1", label: "1st Year", icon: GraduationCap },
                { yr: "2", label: "2nd Year", icon: Sparkles },
                { yr: "3", label: "3rd Year", icon: Sparkles },
              ].map(({ yr, label, icon: Icon }) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => handleYearChange(yr)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    selectedYear === yr
                      ? "bg-[#0E3320] text-white shadow-sm"
                      : "text-[#5C8261] hover:text-[#0E3320] hover:bg-white/60"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedCourse && selectedSession && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-10"><RefreshCw className="w-5 h-5 animate-spin text-[#C59B3F]" /></div>
          ) : rows.length === 0 ? (
            <div className="text-center py-10 text-[#5C8261] text-sm">No subjects found for {selectedYear === "1" ? "1st Year" : selectedYear === "2" ? "2nd Year" : "3rd Year"}. Add subjects in Subjects tab first.</div>
          ) : (
            <div className="bg-white rounded-xl border border-[#DDD1BE] overflow-hidden">
              <div className="bg-[#F2EDE4] px-4 py-2.5 border-b border-[#DDD1BE] flex items-center justify-between gap-3 flex-wrap">
                <p className="text-xs font-bold text-[#0E3320] uppercase">Exam Schedule • {selectedYear === "1" ? "1st Year" : selectedYear === "2" ? "2nd Year" : "3rd Year"}</p>
                <div className="flex items-center gap-2">
                  <select
                    defaultValue=""
                    onChange={e => {
                      if (e.target.value) {
                        setRows(r => r.map(row => ({ ...row, exam_time: e.target.value })));
                        e.target.value = "";
                      }
                    }}
                    className="px-2.5 py-1.5 rounded-lg border border-[#DDD1BE] bg-white text-xs font-semibold text-[#0E3320] focus:outline-none focus:ring-1 focus:ring-[#C59B3F]"
                  >
                    <option value="" disabled>Set time for all...</option>
                    <option value="Morning (10:00 AM - 1:00 PM)">All Morning (10:00 AM - 1:00 PM)</option>
                    <option value="Evening (2:00 PM - 5:00 PM)">All Evening (2:00 PM - 5:00 PM)</option>
                  </select>
                  <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0E3320] text-white text-xs font-bold hover:bg-[#15482D] disabled:opacity-60"><Save className="w-3.5 h-3.5" />{saving ? "Saving..." : "Save Datesheet"}</button>
                </div>
              </div>
              <table className="w-full text-xs">
                <thead className="border-b border-[#DDD1BE] bg-[#FAF8F5]">
                  <tr>
                    <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Subject</th>
                    <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Code</th>
                    <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Exam Date</th>
                    <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Exam Time</th>
                    <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EDE4]">
                  {rows.map((row, i) => (
                    <tr key={row.id} className="hover:bg-[#FAF8F5]">
                      <td className="px-4 py-2.5 font-semibold text-[#0E3320]">{row.subject_name}</td>
                      <td className="px-4 py-2.5 text-[#5C8261]">{row.subject_code || "—"}</td>
                      <td className="px-4 py-2.5"><input type="date" value={row.exam_date || ""} onChange={e => update(i, "exam_date", e.target.value)} className={inputCls} /></td>
                      <td className="px-4 py-2.5">
                        <select
                          value={row.exam_time || ""}
                          onChange={e => update(i, "exam_time", e.target.value)}
                          className={inputCls}
                        >
                          <option value="">— Select Timing —</option>
                          <option value="Morning (10:00 AM - 1:00 PM)">Morning (10:00 AM - 1:00 PM)</option>
                          <option value="Evening (2:00 PM - 5:00 PM)">Evening (2:00 PM - 5:00 PM)</option>
                          {row.exam_time && !["Morning (10:00 AM - 1:00 PM)", "Evening (2:00 PM - 5:00 PM)"].includes(row.exam_time) && (
                            <option value={row.exam_time}>{row.exam_time}</option>
                          )}
                        </select>
                      </td>
                      <td className="px-4 py-2.5 text-center">
                        {row.exam_date && row.exam_time
                          ? <span className="inline-flex items-center gap-1 text-emerald-600 font-bold"><CheckCircle2 className="w-3.5 h-3.5" />Set</span>
                          : <span className="text-[#9B8265]">Pending</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// TAB 3 — ROLL NUMBERS (PROCESS-DRIVEN WORKFLOW)
// ══════════════════════════════════════════════════════════
function RollNumbersTab({
  courses = [],
  sessions = [],
  setSessions,
  selectedCourse: propCourse,
  setSelectedCourse: propSetCourse,
  selectedSession: propSession,
  setSelectedSession: propSetSession,
  targetYear: propYear,
  setTargetYear: propSetYear,
  showToast,
}) {
  const [localCourse, setLocalCourse] = useState("");
  const [localSession, setLocalSession] = useState("");
  const [localTargetYear, setLocalTargetYear] = useState("1");

  const selectedCourse = propCourse !== undefined ? propCourse : localCourse;
  const setSelectedCourse = propSetCourse || setLocalCourse;
  const selectedSession = propSession !== undefined ? propSession : localSession;
  const setSelectedSession = propSetSession || setLocalSession;
  const targetYear = propYear !== undefined ? propYear : localTargetYear;
  const setTargetYear = propSetYear || setLocalTargetYear;

  const [allottedStudents, setAllottedStudents] = useState([]);
  const [pendingStudents, setPendingStudents] = useState([]);
  const [stats, setStats] = useState({ totalApproved: 0, allottedCount: 0, pendingCount: 0 });
  const [patternInfo, setPatternInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const [allotting, setAllotting] = useState(false);
  const [prefix, setPrefix] = useState("");
  const [activeSubTab, setActiveSubTab] = useState("pending"); // "pending" | "allotted"
  const [selectedStudentIds, setSelectedStudentIds] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState("");

  // Auto-select session on first load if none selected
  useEffect(() => {
    if (!selectedSession && sessions.length > 0) {
      const active = sessions.find((s) => s.is_active) || sessions[0];
      if (active) setSelectedSession(active.id);
    }
  }, [sessions, selectedSession, setSelectedSession]);

  const handleTargetYearChange = async (newYear) => {
    if (newYear === targetYear) return;
    await advanceOrRecedeSession({
      currentYear: targetYear,
      newYear,
      currentSessionId: selectedSession,
      sessions,
      setSessions,
      setSelectedSession,
      showToast,
    });
    setTargetYear(newYear);
  };

  const load = useCallback(async () => {
    if (!selectedSession) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/roll-numbers?exam_session_id=${selectedSession}&target_year=${targetYear}`);
      const json = await res.json();
      if (res.ok) {
        const allotted = json.allotted || json.data || [];
        const pending = json.pending || [];
        setAllottedStudents(allotted);
        setPendingStudents(pending);
        setStats(
          json.stats || {
            totalApproved: allotted.length + pending.length,
            allottedCount: allotted.length,
            pendingCount: pending.length,
          }
        );
        setPatternInfo(json.pattern_info || {});

        // Auto switch tab if pending is 0 and allotted has students
        if (pending.length === 0 && allotted.length > 0) {
          setActiveSubTab("allotted");
        } else if (pending.length > 0) {
          setActiveSubTab("pending");
        }
      }
    } catch (err) {
      console.error("Failed to load roll numbers:", err);
    } finally {
      setLoading(false);
      setSelectedStudentIds(new Set());
    }
  }, [selectedSession, targetYear]);

  useEffect(() => {
    load();
  }, [selectedSession, targetYear]);

  // Bulk / Selective / Single Allotment
  const handleAllot = async (specificIds = null) => {
    if (!selectedSession) return showToast("Select a session first", "error");
    setAllotting(true);
    try {
      const payload = {
        exam_session_id: selectedSession,
        prefix: prefix.trim() || undefined,
        target_year: parseInt(targetYear, 10),
      };
      if (Array.isArray(specificIds) && specificIds.length > 0) {
        payload.student_ids = specificIds;
      } else if (selectedStudentIds.size > 0 && specificIds === "selected") {
        payload.student_ids = Array.from(selectedStudentIds);
      }

      const res = await fetch("/api/admin/roll-numbers/allot-bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (!res.ok) {
        showToast(json.error || "Failed to allot roll numbers", "error");
      } else {
        const yearLabel = targetYear === "3" ? "3rd Year" : targetYear === "2" ? "2nd Year" : "1st Year";
        showToast(`Allotted ${json.allotted} roll numbers for ${yearLabel}!`);
        setSelectedStudentIds(new Set());
        load();
      }
    } catch (err) {
      showToast("Error occurred during allotment", "error");
    } finally {
      setAllotting(false);
    }
  };

  const handleUnallot = async (id) => {
    const yrLabel = targetYear === "3" ? "3rd Year " : targetYear === "2" ? "2nd Year " : "";
    if (!confirm(`Remove ${yrLabel}roll number for this student? Their marks and admit card may also be cleared.`)) return;
    try {
      const res = await fetch("/api/admin/roll-numbers/unallot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ registration_id: id, target_year: parseInt(targetYear, 10) }),
      });
      const json = await res.json();
      if (!res.ok) showToast(json.error || "Failed", "error");
      else {
        showToast("Roll number removed");
        load();
      }
    } catch (err) {
      showToast("Error unalloting student", "error");
    }
  };

  // Toggle selection
  const toggleSelectStudent = (id) => {
    setSelectedStudentIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = (filteredPending) => {
    if (selectedStudentIds.size === filteredPending.length) {
      setSelectedStudentIds(new Set());
    } else {
      setSelectedStudentIds(new Set(filteredPending.map((s) => s.id)));
    }
  };

  // Filter by selectedCourse if specified, otherwise show all
  const coursePending = selectedCourse
    ? pendingStudents.filter((s) => s.courses?.course_name === selectedCourse)
    : pendingStudents;

  const courseAllotted = selectedCourse
    ? allottedStudents.filter((s) => s.courses?.course_name === selectedCourse)
    : allottedStudents;

  const currentTotalApproved = coursePending.length + courseAllotted.length;
  const currentPendingCount = coursePending.length;
  const currentAllottedCount = courseAllotted.length;

  // Filtered lists based on search
  const filteredPending = coursePending.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      s.candidate_name?.toLowerCase().includes(q) ||
      s.enrollment_no?.toLowerCase().includes(q) ||
      s.colleges?.college_name?.toLowerCase().includes(q) ||
      s.courses?.course_name?.toLowerCase().includes(q) ||
      s.projected_roll_no?.toLowerCase().includes(q)
    );
  });

  const filteredAllotted = courseAllotted.filter((s) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    const roll = targetYear === "3" ? (s.roll_no_3rd_year || s.roll_no_2nd_year || s.roll_no) : targetYear === "2" ? (s.roll_no_2nd_year || s.roll_no) : s.roll_no;
    return (
      roll?.toLowerCase().includes(q) ||
      s.candidate_name?.toLowerCase().includes(q) ||
      s.enrollment_no?.toLowerCase().includes(q) ||
      s.courses?.course_name?.toLowerCase().includes(q) ||
      s.colleges?.college_name?.toLowerCase().includes(q)
    );
  });

  // Calculate live preview example
  const sampleInitials = pendingStudents[0]?.college_initials || "NPC";
  const sessionDigits = patternInfo?.session_digits || "202324";
  const previewRollNo = prefix.trim() ? `${prefix.trim()}01` : `${sampleInitials}${sessionDigits}01`;

  // List of other courses that have students in this session
  const otherCourseNames = Array.from(
    new Set([...pendingStudents, ...allottedStudents].map((s) => s.courses?.course_name).filter(Boolean))
  );

  return (
    <div className="space-y-6">
      {/* ── 1. Filter Bar ── */}
      <FilterBar
        courses={courses}
        sessions={sessions}
        selectedCourse={selectedCourse}
        selectedSession={selectedSession}
        onCourseChange={setSelectedCourse}
        onSessionChange={setSelectedSession}
      />

      {selectedSession ? (
        <div className="space-y-5">
          {/* Mismatch Course Hint Banner */}
          {selectedCourse && currentTotalApproved === 0 && (pendingStudents.length > 0 || allottedStudents.length > 0) && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs shadow-xs">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>
                  No students registered under <strong>&quot;{selectedCourse}&quot;</strong> for this session, but{" "}
                  <strong>{pendingStudents.length + allottedStudents.length} student(s)</strong> exist under other course(s) ({otherCourseNames.join(", ")}).
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCourse("")}
                className="px-3 py-1.5 rounded-xl bg-amber-200/90 hover:bg-amber-300 font-bold text-amber-950 text-xs transition-colors shrink-0"
              >
                Clear Course Filter (Show All)
              </button>
            </div>
          )}

          {/* ── 2. Target Year Toggle & Top Actions ── */}
          <div className="bg-white rounded-2xl border border-[#DDD1BE] p-4 flex flex-wrap items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5C8261]">Target Year:</span>
              <div className="inline-flex rounded-xl bg-[#FAF8F5] p-1 border border-[#DDD1BE]">
                <button
                  type="button"
                  onClick={() => handleTargetYearChange("1")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    targetYear === "1"
                      ? "bg-[#0E3320] text-white shadow-sm"
                      : "text-[#5C8261] hover:text-[#0E3320] hover:bg-white/60"
                  }`}
                >
                  <GraduationCap className="w-4 h-4" />
                  1st Year (roll_no)
                </button>
                <button
                  type="button"
                  onClick={() => handleTargetYearChange("2")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    targetYear === "2"
                      ? "bg-[#0E3320] text-white shadow-sm"
                      : "text-[#5C8261] hover:text-[#0E3320] hover:bg-white/60"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-[#C59B3F]" />
                  2nd Year (roll_no_2nd_year)
                </button>
                <button
                  type="button"
                  onClick={() => handleTargetYearChange("3")}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                    targetYear === "3"
                      ? "bg-[#0E3320] text-white shadow-sm"
                      : "text-[#5C8261] hover:text-[#0E3320] hover:bg-white/60"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  3rd Year (roll_no_3rd_year)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <a
                href={`/super-admin/dashboard/admit-cards/bulk?exam_session_id=${selectedSession}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-xs font-bold transition-colors"
              >
                <Printer className="w-3.5 h-3.5" /> Generate Admit Cards
              </a>
              <a
                href="/super-admin/dashboard/roll-numbers/audit"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-colors"
              >
                <AlertTriangle className="w-3.5 h-3.5" /> Audit Mismatches
              </a>
              <button
                type="button"
                onClick={load}
                title="Refresh Data"
                className="p-2 rounded-xl border border-[#DDD1BE] bg-white hover:bg-[#FAF8F5] text-[#5C8261] transition-colors"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin text-[#C59B3F]" : ""}`} />
              </button>
            </div>
          </div>

          {/* ── 3. KPI Stats Summary Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Total Approved */}
            <div className="bg-white rounded-2xl border border-[#DDD1BE] p-4 flex items-center gap-3.5 shadow-sm">
              <div className="w-11 h-11 rounded-xl bg-[#F2EDE4] text-[#0E3320] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-[#5C8261] uppercase tracking-wide">Total Approved</p>
                <p className="text-2xl font-black text-[#0E3320]">{currentTotalApproved}</p>
                <p className="text-[11px] text-[#9B8265]">Eligible students in session</p>
              </div>
            </div>

            {/* Pending Allotment */}
            <div
              onClick={() => setActiveSubTab("pending")}
              className={`rounded-2xl border p-4 flex items-center gap-3.5 shadow-sm cursor-pointer transition-all ${
                activeSubTab === "pending"
                  ? "bg-amber-50/80 border-amber-300 ring-2 ring-amber-400/40"
                  : "bg-white border-[#DDD1BE] hover:border-amber-300"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-amber-700 uppercase tracking-wide">Pending Allotment</p>
                <p className="text-2xl font-black text-amber-900">{currentPendingCount}</p>
                <p className="text-[11px] text-amber-700">Needs roll number assigned</p>
              </div>
            </div>

            {/* Allotted */}
            <div
              onClick={() => setActiveSubTab("allotted")}
              className={`rounded-2xl border p-4 flex items-center gap-3.5 shadow-sm cursor-pointer transition-all ${
                activeSubTab === "allotted"
                  ? "bg-emerald-50/80 border-emerald-300 ring-2 ring-emerald-400/40"
                  : "bg-white border-[#DDD1BE] hover:border-emerald-300"
              }`}
            >
              <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[11px] font-bold text-emerald-700 uppercase tracking-wide">Allotted Students</p>
                <p className="text-2xl font-black text-emerald-900">{currentAllottedCount}</p>
                <p className="text-[11px] text-emerald-700">Active roll numbers allotted</p>
              </div>
            </div>
          </div>

          {/* ── 4. Main Two-Tab Workspace ── */}
          <div className="bg-white rounded-2xl border border-[#DDD1BE] overflow-hidden shadow-sm">
            {/* Sub-Tabs Header */}
            <div className="bg-[#FAF8F5] px-5 py-3 border-b border-[#DDD1BE] flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubTab("pending");
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSubTab === "pending"
                      ? "bg-amber-600 text-white shadow-sm"
                      : "bg-white border border-[#DDD1BE] text-[#5C8261] hover:text-[#0E3320]"
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  ⏳ Pending Allotment ({currentPendingCount})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubTab("allotted");
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    activeSubTab === "allotted"
                      ? "bg-[#0E3320] text-white shadow-sm"
                      : "bg-white border border-[#DDD1BE] text-[#5C8261] hover:text-[#0E3320]"
                  }`}
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  ✅ Allotted Students ({currentAllottedCount})
                </button>
              </div>

              {/* Search box */}
              <div className="relative w-64">
                <Search className="w-3.5 h-3.5 text-[#9B8265] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`Search ${activeSubTab === "pending" ? "pending..." : "allotted..."}`}
                  className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-[#DDD1BE] bg-white text-xs text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                />
              </div>
            </div>

            {/* Sub-Tab 1: PENDING ALLOTMENT */}
            {activeSubTab === "pending" && (
              <div className="p-5 space-y-5">
                {stats.pendingCount > 0 && (
                  <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50/70 to-[#FAF8F5] p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-amber-600" />
                          <h4 className="text-xs font-bold text-[#0E3320] uppercase tracking-wide">
                            Live Roll Number Formation Pattern
                          </h4>
                        </div>
                        <p className="text-[11px] text-[#5C8261] mt-0.5">
                          Formula: [College Initials] + [6-digit Session] + [Sequence 01..]
                        </p>
                      </div>

                      {/* Live preview badge */}
                      <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-xl border border-amber-200 shadow-xs">
                        <span className="text-[11px] font-medium text-[#5C8261]">Next Allotted Preview:</span>
                        <span className="font-mono font-bold text-sm text-[#0E3320] bg-amber-100/70 px-2 py-0.5 rounded-md">
                          {previewRollNo}
                        </span>
                      </div>
                    </div>

                    {/* Breakdown chips & override input */}
                    <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-amber-100">
                      <div className="flex items-center gap-1.5 text-xs">
                        <span className="px-2 py-1 bg-white rounded-lg border border-amber-200 font-mono font-semibold text-[#0E3320]">
                          🏛️ Initials: {sampleInitials}
                        </span>
                        <span className="text-amber-500 font-bold">+</span>
                        <span className="px-2 py-1 bg-white rounded-lg border border-amber-200 font-mono font-semibold text-[#0E3320]">
                          🗓️ Session: {sessionDigits}
                        </span>
                        <span className="text-amber-500 font-bold">+</span>
                        <span className="px-2 py-1 bg-white rounded-lg border border-amber-200 font-mono font-semibold text-[#0E3320]">
                          🔢 Seq: 01, 02..
                        </span>
                      </div>

                      <div className="ml-auto flex items-center gap-2">
                        <label className="text-[11px] font-bold text-[#5C8261] whitespace-nowrap">
                          Custom Prefix Override:
                        </label>
                        <input
                          value={prefix}
                          onChange={(e) => setPrefix(e.target.value)}
                          placeholder={`Auto (${sampleInitials}${sessionDigits})`}
                          className="px-2.5 py-1 rounded-lg border border-[#DDD1BE] bg-white text-xs font-mono text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] w-48"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Batch Action Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FAF8F5] p-3 rounded-xl border border-[#DDD1BE]">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => toggleSelectAll(filteredPending)}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#0E3320] hover:text-[#C59B3F]"
                    >
                      {selectedStudentIds.size > 0 && selectedStudentIds.size === filteredPending.length ? (
                        <CheckSquare className="w-4 h-4 text-[#C59B3F]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#9B8265]" />
                      )}
                      <span>
                        {selectedStudentIds.size > 0
                          ? `Selected (${selectedStudentIds.size}/${filteredPending.length})`
                          : "Select All"}
                      </span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedStudentIds.size > 0 && (
                      <button
                        type="button"
                        onClick={() => handleAllot("selected")}
                        disabled={allotting}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold disabled:opacity-60 transition-colors shadow-xs"
                      >
                        <Hash className="w-3.5 h-3.5" />
                        {allotting ? "Allotting..." : `Allot Selected (${selectedStudentIds.size})`}
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() => handleAllot(null)}
                      disabled={allotting || stats.pendingCount === 0}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C59B3F] hover:bg-[#A8852E] text-white text-xs font-bold disabled:opacity-50 transition-colors shadow-xs"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {allotting
                        ? "Allotting..."
                        : `Allot All ${stats.pendingCount} Pending Students`}
                    </button>
                  </div>
                </div>

                {/* Table */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#C59B3F]" />
                  </div>
                ) : filteredPending.length === 0 ? (
                  <div className="text-center py-12 bg-[#FAF8F5] rounded-xl border border-dashed border-[#DDD1BE]">
                    <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                      <CheckCircle2 className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-bold text-[#0E3320]">
                      {searchQuery ? "No matching pending students found" : "All Approved Students Have Roll Numbers!"}
                    </p>
                    <p className="text-xs text-[#5C8261] mt-1 max-w-md mx-auto">
                      {searchQuery
                        ? "Try adjusting your search query."
                        : `All eligible students in this session have already been allotted ${
                            targetYear === "2" ? "2nd Year" : "1st Year"
                          } roll numbers.`}
                    </p>
                    {stats.allottedCount > 0 && !searchQuery && (
                      <button
                        type="button"
                        onClick={() => setActiveSubTab("allotted")}
                        className="mt-3.5 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E3320] text-white text-xs font-bold hover:bg-[#15482D]"
                      >
                        View Allotted Students ({stats.allottedCount})
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-[#DDD1BE] rounded-xl">
                    <table className="w-full text-xs">
                      <thead className="bg-[#FAF8F5] border-b border-[#DDD1BE]">
                        <tr>
                          <th className="w-10 px-3 py-2.5 text-center">
                            <span className="sr-only">Select</span>
                          </th>
                          <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Candidate</th>
                          <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">College</th>
                          <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Enrollment No.</th>
                          <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">
                            Projected Roll No.
                          </th>
                          <th className="px-4 py-2.5 text-right font-bold text-[#0E3320] uppercase">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2EDE4]">
                        {filteredPending.map((s) => {
                          const isSelected = selectedStudentIds.has(s.id);
                          return (
                            <tr key={s.id} className={isSelected ? "bg-amber-50/50" : "hover:bg-[#FAF8F5]"}>
                              <td className="px-3 py-2.5 text-center">
                                <input
                                  type="checkbox"
                                  checked={isSelected}
                                  onChange={() => toggleSelectStudent(s.id)}
                                  className="w-4 h-4 rounded text-[#C59B3F] focus:ring-[#C59B3F] border-[#DDD1BE]"
                                />
                              </td>
                              <td className="px-4 py-2.5">
                                <p className="font-bold text-[#0E3320]">{s.candidate_name}</p>
                                {s.courses?.course_name && (
                                  <p className="text-[10px] font-semibold text-[#8C671D]">{s.courses.course_name}</p>
                                )}
                                {s.father_name && (
                                  <p className="text-[10px] text-[#9B8265]">S/D/W of {s.father_name}</p>
                                )}
                              </td>
                              <td className="px-4 py-2.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-mono text-[10px] font-bold">
                                    {s.college_initials || "COL"}
                                  </span>
                                  <span className="text-[#5C8261] truncate max-w-[220px]">
                                    {s.colleges?.college_name || "—"}
                                  </span>
                                </div>
                              </td>
                              <td className="px-4 py-2.5 font-mono text-[#5C8261]">{s.enrollment_no || "—"}</td>
                              <td className="px-4 py-2.5">
                                <span className="font-mono font-bold text-[#C59B3F] bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                                  {prefix.trim() ? `${prefix.trim()}..` : s.projected_roll_no}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleAllot([s.id])}
                                  disabled={allotting}
                                  className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100/70 border border-amber-300 text-amber-800 text-[11px] font-bold transition-colors"
                                >
                                  Allot Now
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
            )}

            {/* Sub-Tab 2: ALLOTTED STUDENTS */}
            {activeSubTab === "allotted" && (
              <div className="p-5 space-y-4">
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <RefreshCw className="w-6 h-6 animate-spin text-[#C59B3F]" />
                  </div>
                ) : filteredAllotted.length === 0 ? (
                  <div className="text-center py-12 bg-[#FAF8F5] rounded-xl border border-dashed border-[#DDD1BE]">
                    <p className="text-sm font-bold text-[#0E3320]">
                      {searchQuery ? "No matching students found" : "No Roll Numbers Allotted Yet"}
                    </p>
                    <p className="text-xs text-[#5C8261] mt-1">
                      {searchQuery
                        ? "Try searching with a different keyword."
                        : `There are currently no students with ${
                            targetYear === "2" ? "2nd Year" : "1st Year"
                          } roll numbers in this session.`}
                    </p>
                    {stats.pendingCount > 0 && !searchQuery && (
                      <button
                        type="button"
                        onClick={() => setActiveSubTab("pending")}
                        className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C59B3F] text-white text-xs font-bold hover:bg-[#A8852E]"
                      >
                        Go to Pending Allotment ({stats.pendingCount})
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-[#DDD1BE] rounded-xl">
                    <table className="w-full text-xs">
                      <thead className="bg-[#FAF8F5] border-b border-[#DDD1BE]">
                        <tr>
                          <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">
                            {targetYear === "3" ? "3rd Year Roll No." : targetYear === "2" ? "2nd Year Roll No." : "Roll No."}
                          </th>
                          <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Candidate</th>
                          <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Enrollment No.</th>
                          <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">College</th>
                          <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">Admit Card</th>
                          <th className="px-4 py-2.5 text-right font-bold text-[#0E3320] uppercase">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2EDE4]">
                        {filteredAllotted.map((s) => {
                          const displayRollNo = targetYear === "3" ? (s.roll_no_3rd_year || s.roll_no_2nd_year || s.roll_no) : targetYear === "2" ? (s.roll_no_2nd_year || s.roll_no) : s.roll_no;
                          return (
                            <tr key={s.id} className="hover:bg-[#FAF8F5]">
                              <td className="px-4 py-2.5 font-mono font-bold text-[#0E3320]">
                                <span className="bg-[#F2EDE4] px-2 py-0.5 rounded text-[#0E3320]">
                                  {displayRollNo}
                                </span>
                              </td>
                              <td className="px-4 py-2.5">
                                <p className="font-semibold text-[#0E3320]">{s.candidate_name}</p>
                                {s.courses?.course_name && (
                                  <p className="text-[10px] font-semibold text-[#8C671D]">{s.courses.course_name}</p>
                                )}
                              </td>
                              <td className="px-4 py-2.5 font-mono text-[#5C8261]">{s.enrollment_no || "—"}</td>
                              <td className="px-4 py-2.5 text-[#5C8261]">{s.colleges?.college_name || "—"}</td>
                              <td className="px-4 py-2.5 text-center">
                                {s.admit_card_generated_at ? (
                                  <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded text-[10px] font-bold inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Generated
                                  </span>
                                ) : (
                                  <span className="text-[#9B8265] bg-[#FAF8F5] px-2 py-0.5 rounded text-[10px]">
                                    Pending
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-2.5 text-right">
                                <button
                                  type="button"
                                  onClick={() => handleUnallot(s.id)}
                                  title="Remove Roll Number"
                                  className="p-1.5 rounded-lg hover:bg-red-50 text-[#9B8265] hover:text-red-600 transition-colors"
                                >
                                  <XCircle className="w-4 h-4" />
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
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#DDD1BE] p-10 text-center text-[#5C8261]">
          <Hash className="w-8 h-8 text-[#DDD1BE] mx-auto mb-2" />
          <p className="text-sm font-semibold">Please select a Course and Exam Session to manage roll numbers.</p>
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// TAB 4 — RESULTS
// ══════════════════════════════════════════════════════════
function ResultsTab({
  courses = [],
  sessions = [],
  selectedCourse: propCourse,
  setSelectedCourse: propSetCourse,
  selectedSession: propSession,
  setSelectedSession: propSetSession,
  showToast,
}) {
  const router = useRouter();
  const [localCourse, setLocalCourse] = useState("");
  const [localSession, setLocalSession] = useState("");

  const selectedCourse = propCourse !== undefined ? propCourse : localCourse;
  const setSelectedCourse = propSetCourse || setLocalCourse;
  const selectedSession = propSession !== undefined ? propSession : localSession;
  const setSelectedSession = propSetSession || setLocalSession;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(null);

  // Auto-select session on first load if none selected
  useEffect(() => {
    if (!selectedSession && sessions.length > 0) {
      const active = sessions.find((s) => s.is_active) || sessions[0];
      if (active) setSelectedSession(active.id);
    }
  }, [sessions, selectedSession, setSelectedSession]);

  const load = useCallback(async () => {
    if (!selectedSession) return;
    setLoading(true);
    const res = await fetch(`/api/admin/results?exam_session_id=${selectedSession}`);
    const json = await res.json();
    setStudents(json.data || []);
    setLoading(false);
  }, [selectedSession]);

  useEffect(() => { load(); }, [selectedSession]);

  const handlePublish = async (s, publish) => {
    setPublishing(s.id);
    const yrParam = s.target_year ? `?target_year=${s.target_year}` : "";
    const res = await fetch(`/api/admin/results/${s.id}/publish${yrParam}`, { method: publish ? "POST" : "DELETE" });
    const json = await res.json();
    if (!res.ok) showToast(json.error || "Failed", "error");
    else { showToast(publish ? `${s.year_label || ""} Result published!` : `${s.year_label || ""} Result unpublished`); load(); }
    setPublishing(null);
  };

  const statusBadge = (s) => {
    if (s.result_published_at) return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" />Published</span>;
    return <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Draft</span>;
  };

  const filteredStudents = selectedCourse
    ? students.filter(s => s.course === selectedCourse)
    : students;

  return (
    <div className="space-y-5">
      <FilterBar courses={courses} sessions={sessions} selectedCourse={selectedCourse} selectedSession={selectedSession} onCourseChange={setSelectedCourse} onSessionChange={setSelectedSession} />

      {selectedSession && (
        <div className="bg-white rounded-xl border border-[#DDD1BE] overflow-hidden">
          <div className="bg-[#F2EDE4] px-4 py-2.5 border-b border-[#DDD1BE] flex items-center justify-between">
            <p className="text-xs font-bold text-[#0E3320] uppercase">Students with Admit Cards ({filteredStudents.length})</p>
            <button onClick={load} className="p-1.5 rounded-lg hover:bg-[#DDD1BE]"><RefreshCw className={`w-3.5 h-3.5 text-[#5C8261] ${loading ? "animate-spin" : ""}`} /></button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10"><RefreshCw className="w-5 h-5 animate-spin text-[#C59B3F]" /></div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-10 text-[#5C8261] text-sm">No students found.</div>
          ) : (
            <table className="w-full text-xs">
              <thead className="border-b border-[#DDD1BE] bg-[#FAF8F5]">
                <tr>
                  <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Roll No.</th>
                  <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Name</th>
                  <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Course</th>
                  <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">Status</th>
                  <th className="px-4 py-2.5 text-right font-bold text-[#0E3320] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EDE4]">
                {filteredStudents.map(s => (
                  <tr key={s.id} className="hover:bg-[#FAF8F5]">
                    <td className="px-4 py-2.5 font-bold text-[#C59B3F]">
                      {s.roll_no}
                      {s.year_label && (
                        <span className="ml-1.5 px-1.5 py-0.5 rounded text-[9px] font-semibold bg-[#F2EDE4] text-[#5C8261]">
                          {s.year_label}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-semibold text-[#0E3320]">{s.candidate_name}</td>
                    <td className="px-4 py-2.5 text-[#5C8261]">{s.course}</td>
                    <td className="px-4 py-2.5 text-center">{statusBadge(s)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => router.push(`/super-admin/dashboard/exam-management/results/${s.id}${s.target_year ? `?year=${s.target_year}` : ""}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0E3320] text-white text-[10px] font-bold hover:bg-[#15482D]">
                          <Pencil className="w-3 h-3" />Enter Marks
                        </button>
                        {s.result_published_at ? (
                          <button onClick={() => handlePublish(s, false)} disabled={publishing === s.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[10px] font-bold hover:bg-red-100 disabled:opacity-60">
                            Unpublish
                          </button>
                        ) : (
                          <button onClick={() => handlePublish(s, true)} disabled={publishing === s.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold hover:bg-emerald-100 disabled:opacity-60">
                            <CheckCircle2 className="w-3 h-3" />Publish
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

// ══════════════════════════════════════════════════════════
// ══════════════════════════════════════════════════════════
// CENTERS TAB
// ══════════════════════════════════════════════════════════
function CentersTab({ showToast }) {
  const [centers, setCenters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [newForm, setNewForm] = useState({ center_name: "", center_code: "", address: "", city: "" });
  const [adding, setAdding] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/exam-centers");
    const d = await res.json();
    if (d.ok) setCenters(d.centers || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (c) => { setEditingId(c.id); setEditForm({ center_name: c.center_name, center_code: c.center_code, address: c.address || "", city: c.city || "" }); };

  const saveEdit = async () => {
    setSaving(true);
    const res = await fetch(`/api/admin/exam-centers/${editingId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editForm) });
    const d = await res.json();
    if (d.ok) { showToast("Center updated!"); setEditingId(null); load(); }
    else showToast(d.error || "Failed", "error");
    setSaving(false);
  };

  const deleteCenter = async (id) => {
    if (!confirm("Delete this exam center?")) return;
    const res = await fetch(`/api/admin/exam-centers/${id}`, { method: "DELETE" });
    const d = await res.json();
    if (d.ok) { showToast("Center deleted."); load(); }
    else showToast(d.error || "Failed", "error");
  };

  const addCenter = async (e) => {
    e.preventDefault();
    if (!newForm.center_name.trim() || !newForm.center_code.trim()) { showToast("Name and code required.", "error"); return; }
    setAdding(true);
    const res = await fetch("/api/admin/exam-centers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newForm) });
    const d = await res.json();
    if (d.ok) { showToast("Center added!"); setNewForm({ center_name: "", center_code: "", address: "", city: "" }); load(); }
    else showToast(d.error || "Failed", "error");
    setAdding(false);
  };

  if (loading) return <div className="flex justify-center py-16"><div className="w-8 h-8 border-2 border-[#0E3320]/20 border-t-[#0E3320] rounded-full animate-spin" /></div>;

  return (
    <div className="space-y-6">
      {/* Add Form */}
      <div className="bg-white rounded-2xl border border-[#DDD1BE] p-5">
        <h3 className="text-sm font-bold text-[#0E3320] mb-4 flex items-center gap-2"><Plus className="w-4 h-4" /> Add Exam Center</h3>
        <form onSubmit={addCenter} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { key: "center_name", label: "Center Name *", placeholder: "e.g. Delhi Centre" },
            { key: "center_code", label: "Center Code *", placeholder: "e.g. DEL01" },
            { key: "city", label: "City", placeholder: "e.g. New Delhi" },
            { key: "address", label: "Address", placeholder: "Full address" },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-[10px] font-bold text-[#5C8261] uppercase mb-1">{f.label}</label>
              <input value={newForm[f.key]} onChange={e => setNewForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder}
                className="w-full px-3 py-2 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
            </div>
          ))}
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end">
            <button type="submit" disabled={adding} className="px-5 py-2 rounded-xl bg-[#0E3320] text-white text-xs font-bold hover:bg-[#15482D] transition-all disabled:opacity-60 flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> {adding ? "Adding..." : "Add Center"}
            </button>
          </div>
        </form>
      </div>

      {/* Centers list */}
      <div className="bg-white rounded-2xl border border-[#DDD1BE] overflow-hidden">
        <div className="px-5 py-4 border-b border-[#EBE2D4]">
          <p className="text-sm font-bold text-[#0E3320]">Exam Centers ({centers.length})</p>
        </div>
        {centers.length === 0 && (
          <div className="p-10 text-center text-sm text-[#5C8261]">No exam centers added yet.</div>
        )}
        <div className="divide-y divide-[#EBE2D4]">
          {centers.map(c => (
            <div key={c.id} className="p-4">
              {editingId === c.id ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { key: "center_name", label: "Name" },
                    { key: "center_code", label: "Code" },
                    { key: "city", label: "City" },
                    { key: "address", label: "Address" },
                  ].map(f => (
                    <div key={f.key}>
                      <label className="block text-[10px] font-bold text-[#5C8261] uppercase mb-1">{f.label}</label>
                      <input value={editForm[f.key]} onChange={e => setEditForm(p => ({ ...p, [f.key]: e.target.value }))}
                        className="w-full px-3 py-2 rounded-xl border border-[#C59B3F] bg-white text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                    </div>
                  ))}
                  <div className="sm:col-span-2 lg:col-span-4 flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="px-4 py-1.5 rounded-xl border border-[#DDD1BE] text-xs font-bold text-[#5C8261] hover:bg-[#F2EDE4]">Cancel</button>
                    <button onClick={saveEdit} disabled={saving} className="px-4 py-1.5 rounded-xl bg-[#C59B3F] text-white text-xs font-bold hover:bg-[#A8832E] disabled:opacity-60 flex items-center gap-1.5">
                      <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save"}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#0E3320]">{c.center_name}</p>
                    <p className="text-xs text-[#5C8261] mt-0.5">Code: <span className="font-mono font-semibold text-[#0E3320]">{c.center_code}</span>{c.city ? ` • ${c.city}` : ""}{c.address ? ` • ${c.address}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <button onClick={() => startEdit(c)} className="p-1.5 rounded-lg hover:bg-[#F2EDE4] text-[#5C8261] hover:text-[#0E3320] transition-colors"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteCenter(c.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#5C8261] hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// MAIN PAGE
// ══════════════════════════════════════════════════════════
export default function ExamManagementPage() {
  const [activeTab, setActiveTab] = useState("subjects");
  const [courses, setCourses] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [selectedYear, setSelectedYear] = useState("1");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  useEffect(() => {
    fetch("/api/admin/courses")
      .then((r) => r.json())
      .then((j) => {
        const list = j.data || [];
        setCourses(list);
        if (list.length > 0) {
          setSelectedCourse((prev) => prev || list[0].course_name);
        }
      });
    fetch("/api/admin/exam-sessions")
      .then((r) => r.json())
      .then((j) => {
        const list = j.data || [];
        setSessions(list);
        if (list.length > 0) {
          const active = list.find((s) => s.is_active) || list[0];
          if (active) setSelectedSession((prev) => prev || active.id);
        }
      });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0E3320]">Exam Management</h2>
        <p className="text-xs text-[#5C8261] mt-0.5">Manage subjects, datesheet, roll numbers, and results</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#F2EDE4] rounded-xl p-1">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${
              activeTab === t.id ? "bg-white text-[#0E3320] shadow-sm" : "text-[#5C8261] hover:text-[#0E3320]"
            }`}
          >
            <t.icon className="w-3.5 h-3.5 hidden sm:block" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "subjects" && (
        <SubjectsTab
          courses={courses}
          sessions={sessions}
          setSessions={setSessions}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          showToast={showToast}
        />
      )}
      {activeTab === "datesheet" && (
        <DatesheetTab
          courses={courses}
          sessions={sessions}
          setSessions={setSessions}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          selectedYear={selectedYear}
          setSelectedYear={setSelectedYear}
          showToast={showToast}
        />
      )}
      {activeTab === "rollnos" && (
        <RollNumbersTab
          courses={courses}
          sessions={sessions}
          setSessions={setSessions}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          targetYear={selectedYear}
          setTargetYear={setSelectedYear}
          showToast={showToast}
        />
      )}
      {activeTab === "results" && (
        <ResultsTab
          courses={courses}
          sessions={sessions}
          selectedCourse={selectedCourse}
          setSelectedCourse={setSelectedCourse}
          selectedSession={selectedSession}
          setSelectedSession={setSelectedSession}
          showToast={showToast}
        />
      )}
      {activeTab === "centers" && <CentersTab showToast={showToast} />}

      <Toast toast={toast} />
    </div>
  );
}
