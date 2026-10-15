"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  BookOpen, Calendar, Hash, BarChart2, Plus, Trash2, Pencil,
  RefreshCw, CheckCircle2, AlertTriangle, Save,
  FileText, UserCheck, XCircle, Eye, ChevronDown, Printer, MapPin,
} from "lucide-react";

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
        <option value="">— Select Course —</option>
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

// ══════════════════════════════════════════════════════════
// TAB 1 — SUBJECTS
// ══════════════════════════════════════════════════════════
function SubjectsTab({ courses, showToast }) {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [addForm, setAddForm] = useState({ subject_name: "", subject_code: "", theory_max: 100, practical_max: 0, ca_max: 0 });
  const [saving, setSaving] = useState(false);

  const load = useCallback(async (course) => {
    if (!course) return;
    setLoading(true);
    const res = await fetch(`/api/admin/subjects?course_name=${encodeURIComponent(course)}`);
    const json = await res.json();
    setSubjects(json.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { load(selectedCourse); }, [selectedCourse]);

  const handleAdd = async () => {
    if (!selectedCourse || !addForm.subject_name) return showToast("Select a course and enter subject name", "error");
    setSaving(true);
    const res = await fetch("/api/admin/subjects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...addForm, course_name: selectedCourse }) });
    const json = await res.json();
    if (!res.ok) { showToast(json.error || "Failed", "error"); }
    else { showToast("Subject added!"); setAddForm({ subject_name: "", subject_code: "", theory_max: 100, practical_max: 0, ca_max: 0 }); load(selectedCourse); }
    setSaving(false);
  };

  const handleEdit = async (id) => {
    setSaving(true);
    const res = await fetch(`/api/admin/subjects/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(editForm) });
    const json = await res.json();
    if (!res.ok) { showToast(json.error || "Failed", "error"); }
    else { showToast("Subject updated!"); setEditingId(null); load(selectedCourse); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this subject? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/subjects/${id}`, { method: "DELETE" });
    const json = await res.json();
    if (!res.ok) showToast(json.error || "Failed to delete", "error");
    else { showToast("Subject deleted!"); load(selectedCourse); }
  };

  const inputCls = "px-2 py-1.5 rounded-lg border border-[#DDD1BE] bg-[#FAF8F5] text-xs text-[#0E3320] focus:outline-none focus:ring-1 focus:ring-[#C59B3F] w-full";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <FilterBar courses={courses} sessions={[]} selectedCourse={selectedCourse} selectedSession="" onCourseChange={setSelectedCourse} onSessionChange={() => {}} showSession={false} />
      </div>

      {selectedCourse && (
        <>
          {/* Add subject */}
          <div className="bg-white rounded-xl border border-[#DDD1BE] p-4">
            <p className="text-xs font-bold text-[#0E3320] uppercase mb-3">Add New Subject</p>
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
              <p className="text-xs font-bold text-[#0E3320] uppercase">Subjects for {selectedCourse}</p>
            </div>
            {loading ? (
              <div className="flex items-center justify-center py-10"><RefreshCw className="w-5 h-5 animate-spin text-[#C59B3F]" /></div>
            ) : subjects.length === 0 ? (
              <div className="text-center py-10 text-[#5C8261] text-sm">No subjects defined yet.</div>
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
function DatesheetTab({ courses, sessions, showToast }) {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    if (!selectedCourse || !selectedSession) return;
    setLoading(true);
    const res = await fetch(`/api/admin/datesheets?exam_session_id=${selectedSession}&course_name=${encodeURIComponent(selectedCourse)}`);
    const json = await res.json();
    setRows(json.data || []);
    setLoading(false);
  }, [selectedCourse, selectedSession]);

  useEffect(() => { load(); }, [selectedCourse, selectedSession]);

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
      <FilterBar courses={courses} sessions={sessions} selectedCourse={selectedCourse} selectedSession={selectedSession} onCourseChange={setSelectedCourse} onSessionChange={setSelectedSession} />

      {selectedCourse && selectedSession && (
        <>
          {loading ? (
            <div className="flex items-center justify-center py-10"><RefreshCw className="w-5 h-5 animate-spin text-[#C59B3F]" /></div>
          ) : rows.length === 0 ? (
            <div className="text-center py-10 text-[#5C8261] text-sm">No subjects found for this course. Add subjects first.</div>
          ) : (
            <div className="bg-white rounded-xl border border-[#DDD1BE] overflow-hidden">
              <div className="bg-[#F2EDE4] px-4 py-2.5 border-b border-[#DDD1BE] flex items-center justify-between">
                <p className="text-xs font-bold text-[#0E3320] uppercase">Exam Schedule</p>
                <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0E3320] text-white text-xs font-bold hover:bg-[#15482D] disabled:opacity-60"><Save className="w-3.5 h-3.5" />{saving ? "Saving..." : "Save Datesheet"}</button>
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
                      <td className="px-4 py-2.5"><input type="time" value={row.exam_time || ""} onChange={e => update(i, "exam_time", e.target.value)} className={inputCls} /></td>
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
// TAB 3 — ROLL NUMBERS
// ══════════════════════════════════════════════════════════
function RollNumbersTab({ courses, sessions, showToast }) {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allotting, setAllotting] = useState(false);
  const [prefix, setPrefix] = useState("");

  const load = useCallback(async () => {
    if (!selectedSession) return;
    setLoading(true);
    const res = await fetch(`/api/admin/roll-numbers?exam_session_id=${selectedSession}`);
    const json = await res.json();
    setStudents(json.data || []);
    setLoading(false);
  }, [selectedSession]);

  useEffect(() => { load(); }, [selectedSession]);

  const handleAllot = async () => {
    if (!selectedSession) return showToast("Select a session first", "error");
    setAllotting(true);
    const res = await fetch("/api/admin/roll-numbers/allot-bulk", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ exam_session_id: selectedSession, prefix: prefix || undefined }) });
    const json = await res.json();
    if (!res.ok) showToast(json.error || "Failed to allot", "error");
    else { showToast(`Allotted ${json.allotted} roll numbers!`); load(); }
    setAllotting(false);
  };

  const handleUnallot = async (id) => {
    if (!confirm("Remove roll number for this student? Their marks and admit card will also be cleared.")) return;
    const res = await fetch("/api/admin/roll-numbers/unallot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ registration_id: id }) });
    const json = await res.json();
    if (!res.ok) showToast(json.error || "Failed", "error");
    else { showToast("Roll number removed"); load(); }
  };

  return (
    <div className="space-y-5">
      <FilterBar courses={courses} sessions={sessions} selectedCourse={selectedCourse} selectedSession={selectedSession} onCourseChange={setSelectedCourse} onSessionChange={setSelectedSession} />

      {selectedSession && (
        <div className="bg-white rounded-xl border border-[#DDD1BE] p-4 flex flex-wrap items-end gap-3">
          <div>
            <label className="block text-[10px] font-bold text-[#5C8261] uppercase mb-1">Roll No. Prefix (optional)</label>
            <input value={prefix} onChange={e => setPrefix(e.target.value)} placeholder="e.g. BA2526" className="px-3 py-2 rounded-lg border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] w-44" />
          </div>
          <button onClick={handleAllot} disabled={allotting} className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#C59B3F] hover:bg-[#A8852E] text-white text-sm font-bold disabled:opacity-60">
            <Hash className="w-4 h-4" />{allotting ? "Allotting..." : "Allot Roll Numbers"}
          </button>
          <a href={`/super-admin/dashboard/admit-cards/bulk?exam_session_id=${selectedSession}`} target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-sm font-bold">
            <Printer className="w-4 h-4" /> Generate Admit Cards
          </a>
          <a href="/super-admin/dashboard/roll-numbers/audit" target="_blank" rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-sm font-bold">
            <AlertTriangle className="w-4 h-4" /> Audit Mismatches
          </a>
          <p className="text-xs text-[#5C8261]">Only approved students without a roll number will be allotted.</p>
        </div>
      )}

      {selectedSession && (
        <div className="bg-white rounded-xl border border-[#DDD1BE] overflow-hidden">
          <div className="bg-[#F2EDE4] px-4 py-2.5 border-b border-[#DDD1BE] flex items-center justify-between">
            <p className="text-xs font-bold text-[#0E3320] uppercase">Allotted Students ({students.length})</p>
            <button onClick={load} className="p-1.5 rounded-lg hover:bg-[#DDD1BE]"><RefreshCw className={`w-3.5 h-3.5 text-[#5C8261] ${loading ? "animate-spin" : ""}`} /></button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10"><RefreshCw className="w-5 h-5 animate-spin text-[#C59B3F]" /></div>
          ) : students.length === 0 ? (
            <div className="text-center py-10 text-[#5C8261] text-sm">No students with roll numbers in this session.</div>
          ) : (
            <table className="w-full text-xs">
              <thead className="border-b border-[#DDD1BE] bg-[#FAF8F5]">
                <tr>
                  <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Roll No.</th>
                  <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">Name</th>
                  <th className="px-4 py-2.5 text-left font-bold text-[#0E3320] uppercase">College</th>
                  <th className="px-4 py-2.5 text-center font-bold text-[#0E3320] uppercase">Admit Card</th>
                  <th className="px-4 py-2.5 text-right font-bold text-[#0E3320] uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F2EDE4]">
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-[#FAF8F5]">
                    <td className="px-4 py-2.5 font-bold text-[#C59B3F]">{s.roll_no}</td>
                    <td className="px-4 py-2.5 font-semibold text-[#0E3320]">{s.candidate_name}</td>
                    <td className="px-4 py-2.5 text-[#5C8261]">{s.colleges?.college_name || "—"}</td>
                    <td className="px-4 py-2.5 text-center">
                      {s.admit_card_generated_at
                        ? <span className="text-emerald-600 font-bold flex items-center justify-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" />Generated</span>
                        : <span className="text-[#9B8265]">Pending</span>}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button onClick={() => handleUnallot(s.id)} className="p-1.5 rounded-lg hover:bg-red-50 text-[#9B8265] hover:text-red-600"><XCircle className="w-3.5 h-3.5" /></button>
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
// TAB 4 — RESULTS
// ══════════════════════════════════════════════════════════
function ResultsTab({ courses, sessions, showToast }) {
  const router = useRouter();
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedSession, setSelectedSession] = useState("");
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [publishing, setPublishing] = useState(null);

  const load = useCallback(async () => {
    if (!selectedSession) return;
    setLoading(true);
    const res = await fetch(`/api/admin/results?exam_session_id=${selectedSession}`);
    const json = await res.json();
    setStudents(json.data || []);
    setLoading(false);
  }, [selectedSession]);

  useEffect(() => { load(); }, [selectedSession]);

  const handlePublish = async (id, publish) => {
    setPublishing(id);
    const res = await fetch(`/api/admin/results/${id}/publish`, { method: publish ? "POST" : "DELETE" });
    const json = await res.json();
    if (!res.ok) showToast(json.error || "Failed", "error");
    else { showToast(publish ? "Result published!" : "Result unpublished"); load(); }
    setPublishing(null);
  };

  const statusBadge = (s) => {
    if (s.result_published_at) return <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full"><CheckCircle2 className="w-3 h-3" />Published</span>;
    return <span className="text-[10px] font-bold bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">Draft</span>;
  };

  return (
    <div className="space-y-5">
      <FilterBar courses={courses} sessions={sessions} selectedCourse={selectedCourse} selectedSession={selectedSession} onCourseChange={setSelectedCourse} onSessionChange={setSelectedSession} />

      {selectedSession && (
        <div className="bg-white rounded-xl border border-[#DDD1BE] overflow-hidden">
          <div className="bg-[#F2EDE4] px-4 py-2.5 border-b border-[#DDD1BE] flex items-center justify-between">
            <p className="text-xs font-bold text-[#0E3320] uppercase">Students with Admit Cards ({students.length})</p>
            <button onClick={load} className="p-1.5 rounded-lg hover:bg-[#DDD1BE]"><RefreshCw className={`w-3.5 h-3.5 text-[#5C8261] ${loading ? "animate-spin" : ""}`} /></button>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-10"><RefreshCw className="w-5 h-5 animate-spin text-[#C59B3F]" /></div>
          ) : students.length === 0 ? (
            <div className="text-center py-10 text-[#5C8261] text-sm">No students with admit cards yet.</div>
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
                {students.map(s => (
                  <tr key={s.id} className="hover:bg-[#FAF8F5]">
                    <td className="px-4 py-2.5 font-bold text-[#C59B3F]">{s.roll_no}</td>
                    <td className="px-4 py-2.5 font-semibold text-[#0E3320]">{s.candidate_name}</td>
                    <td className="px-4 py-2.5 text-[#5C8261]">{s.course}</td>
                    <td className="px-4 py-2.5 text-center">{statusBadge(s)}</td>
                    <td className="px-4 py-2.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => router.push(`/super-admin/dashboard/exam-management/results/${s.id}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#0E3320] text-white text-[10px] font-bold hover:bg-[#15482D]">
                          <Pencil className="w-3 h-3" />Enter Marks
                        </button>
                        {s.result_published_at ? (
                          <button onClick={() => handlePublish(s.id, false)} disabled={publishing === s.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-50 text-red-700 text-[10px] font-bold hover:bg-red-100 disabled:opacity-60">
                            Unpublish
                          </button>
                        ) : (
                          <button onClick={() => handlePublish(s.id, true)} disabled={publishing === s.id} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 text-[10px] font-bold hover:bg-emerald-100 disabled:opacity-60">
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
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3500);
  };

  useEffect(() => {
    fetch("/api/admin/courses").then(r => r.json()).then(j => setCourses(j.data || []));
    fetch("/api/admin/exam-sessions").then(r => r.json()).then(j => setSessions(j.data || []));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-[#0E3320]">Exam Management</h2>
        <p className="text-xs text-[#5C8261] mt-0.5">Manage subjects, datesheet, roll numbers, and results</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-[#F2EDE4] rounded-xl p-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === t.id ? "bg-white text-[#0E3320] shadow-sm" : "text-[#5C8261] hover:text-[#0E3320]"}`}>
            <t.icon className="w-3.5 h-3.5 hidden sm:block" /> {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "subjects"  && <SubjectsTab  courses={courses} showToast={showToast} />}
      {activeTab === "datesheet" && <DatesheetTab courses={courses} sessions={sessions} showToast={showToast} />}
      {activeTab === "rollnos"   && <RollNumbersTab courses={courses} sessions={sessions} showToast={showToast} />}
      {activeTab === "results"   && <ResultsTab   courses={courses} sessions={sessions} showToast={showToast} />}
      {activeTab === "centers"   && <CentersTab   showToast={showToast} />}

      <Toast toast={toast} />
    </div>
  );
}
