"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Pencil, Save, X as XIcon } from "lucide-react";

const QUERY_FIELD_OPTIONS = [
  { value: "candidate_name", label: "Candidate Name / अभ्यर्थी का नाम" },
  { value: "father_name", label: "Father's Name / पिता का नाम" },
  { value: "mother_name", label: "Mother's Name / माता का नाम" },
  { value: "dob", label: "Date of Birth / जन्म तिथि" },
  { value: "category", label: "Category / श्रेणी" },
  { value: "gender", label: "Gender / लिंग" },
  { value: "phone", label: "Mobile Number / मोबाइल नंबर" },
  { value: "email", label: "Email Address / ईमेल" },
  { value: "session_label", label: "Academic Session / शैक्षणिक सत्र" },
  { value: "address", label: "Address / पता" },
  { value: "course", label: "Course / पाठ्यक्रम" },
  { value: "photo_url", label: "Passport Photo / पासपोर्ट फोटो" },
  { value: "signature_url", label: "Signature / हस्ताक्षर" },
  { value: "aadhaar_url", label: "Aadhaar Card / आधार कार्ड" },
  { value: "tenth_marksheet_url", label: "10th Marksheet / 10वीं अंकतालिका" },
  { value: "twelfth_marksheet_url", label: "12th Marksheet / 12वीं अंकतालिका" },
];

const STATUS_COLORS = {
  pending:      "bg-yellow-100 text-yellow-800 border-yellow-300",
  submitted:    "bg-blue-100 text-blue-800 border-blue-300",
  under_review: "bg-purple-100 text-purple-800 border-purple-300",
  query_raised: "bg-orange-100 text-orange-800 border-orange-300",
  approved:     "bg-emerald-100 text-emerald-800 border-emerald-300",
  rejected:     "bg-red-100 text-red-800 border-red-300",
};

function StatusBadge({ status }) {
  return (
    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border uppercase tracking-wide ${STATUS_COLORS[status] || "bg-gray-100 text-gray-700 border-gray-300"}`}>
      {status?.replace(/_/g, " ")}
    </span>
  );
}

function DocLink({ url, label }) {
  if (!url) return <span className="text-xs text-red-500 italic">Not uploaded</span>;
  return (
    <a href={url} target="_blank" rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-[#0E3320] text-white text-xs font-semibold rounded hover:bg-[#071A0E] transition-colors">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
      </svg>
      {label}
    </a>
  );
}

export default function RegistrationDetailPage({ params }) {
  const { id } = params;
  const [reg, setReg] = useState(null);
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedField, setSelectedField] = useState(QUERY_FIELD_OPTIONS[0].value);
  const [queryMessage, setQueryMessage] = useState("");
  const [submittingQuery, setSubmittingQuery] = useState(false);
  const [querySuccess, setQuerySuccess] = useState(null);
  const [queryError, setQueryError] = useState(null);

  const [actionLoading, setActionLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);
  const [actionErr, setActionErr] = useState(null);

  const [previewImg, setPreviewImg] = useState(null);

  // Edit state
  const [editOpen, setEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editSaving, setEditSaving] = useState(false);
  const [editMsg, setEditMsg] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/api/admin/registrations/${id}`);
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Not found"); return; }
      setReg(data.data);
      setQueries(data.queries || []);
    } catch { setError("Failed to load registration details."); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, [id]);

  const handleRaiseQuery = async (e) => {
    e.preventDefault();
    if (!queryMessage.trim()) { setQueryError("Please write a query message."); return; }
    setSubmittingQuery(true);
    setQueryError(null);
    setQuerySuccess(null);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field_name: selectedField, message: queryMessage.trim() }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setQueryError(data.error || "Failed to raise query."); return; }
      setQuerySuccess("Query raised and notified to college.");
      setQueryMessage("");
      fetchData();
    } catch { setQueryError("Network error."); }
    finally { setSubmittingQuery(false); }
  };

  const openEdit = () => {
    setEditForm({
      candidate_name: reg.candidate_name || "",
      father_name: reg.father_name || "",
      mother_name: reg.mother_name || "",
      dob: reg.dob || "",
      gender: reg.gender || "",
      category: reg.category || "",
      phone: reg.phone || "",
      email: reg.email || "",
      address: reg.address || "",
      session_label: reg.session_label || reg.academic_session || "",
      enrollment_no: reg.enrollment_no || "",
      roll_no: reg.roll_no || "",
    });
    setEditOpen(true);
    setEditMsg(null);
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    setEditSaving(true);
    setEditMsg(null);
    try {
      const res = await fetch(`/api/admin/registrations/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editForm,
          academic_session: editForm.session_label,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) { setEditMsg({ type: "error", text: data.error || "Failed to save." }); return; }
      setEditMsg({ type: "success", text: "Changes saved successfully!" });
      fetchData();
      setTimeout(() => { setEditOpen(false); setEditMsg(null); }, 1500);
    } catch { setEditMsg({ type: "error", text: "Network error." }); }
    finally { setEditSaving(false); }
  };

  const handleAction = async (action) => {
    const label = action === "approve" ? "APPROVE" : "REJECT";
    if (!confirm(`Are you sure you want to ${label} this registration?`)) return;
    setActionLoading(true);
    setActionErr(null);
    setActionMsg(null);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/${action}`, { method: "POST" });
      const data = await res.json();
      if (!res.ok || !data.ok) { setActionErr(data.error || `Failed to ${action}.`); return; }
      setActionMsg(`Registration ${action}d successfully!`);
      fetchData();
    } catch { setActionErr("Network error."); }
    finally { setActionLoading(false); }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5]">
      <div className="text-center text-[#0E3320]">
        <div className="w-10 h-10 border-3 border-[#0E3320] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm font-semibold">Loading registration details...</p>
      </div>
    </div>
  );

  if (error || !reg) return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] p-4">
      <div className="bg-red-50 border border-red-200 p-6 rounded-xl text-center max-w-md">
        <p className="text-red-700 font-bold mb-3">{error || "Registration not found"}</p>
        <Link href="/super-admin/dashboard"
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0E3320] text-white text-xs font-bold rounded">
          Back to Dashboard
        </Link>
      </div>
    </div>
  );

  const isTerminal = reg.status === "approved" || reg.status === "rejected";
  const edu = reg.education || {};

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs text-[#6B7280] mb-2">
              <Link href="/super-admin/dashboard" className="hover:text-[#0E3320] font-medium">Dashboard</Link>
              <span>/</span>
              <span className="font-mono font-bold text-[#0E3320]">{reg.enrollment_no || reg.roll_no || id.slice(0, 8)}</span>
            </nav>
            <div className="flex items-center gap-3 flex-wrap mb-1">
              <h1 className="text-xl sm:text-2xl font-black text-[#0E3320] tracking-tight">{reg.candidate_name}</h1>
              <StatusBadge status={reg.status} />
              {reg.status === "approved" && (
                <Link href={`/super-admin/dashboard/admit-cards/${reg.id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0E3320] text-white text-xs font-bold rounded shadow-xs">
                  🎓 Admit Card
                </Link>
              )}
            </div>
            <p className="text-xs text-[#6B7280]">
              College: <strong className="text-[#374151]">{reg.colleges?.college_name || "—"}</strong> •
              Applied: {reg.created_at ? new Date(reg.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link href="/super-admin/dashboard"
              className="px-3 py-2 bg-[#F5F0E8] hover:bg-[#EDE4D6] text-[#374151] text-xs font-bold rounded border border-[#E8DDD0] transition-colors">
              Back
            </Link>
            <button onClick={openEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#C59B3F] hover:bg-[#A97F30] text-white text-xs font-bold rounded shadow-md transition-all cursor-pointer">
              <Pencil className="w-3.5 h-3.5" /> Edit Data
            </button>
            <button onClick={() => handleAction("approve")} disabled={actionLoading || isTerminal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded shadow-md transition-all disabled:opacity-40 cursor-pointer">
              ✓ Approve
            </button>
            <button onClick={() => handleAction("reject")} disabled={actionLoading || isTerminal}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded shadow-md transition-all disabled:opacity-40 cursor-pointer">
              ✕ Reject
            </button>
          </div>
        </div>

        {actionMsg && <div className="mb-5 p-4 bg-emerald-50 border-l-4 border-emerald-500 rounded-r text-emerald-800 text-sm font-semibold">{actionMsg}</div>}
        {actionErr && <div className="mb-5 p-4 bg-red-50 border-l-4 border-red-500 rounded-r text-red-800 text-sm font-semibold">{actionErr}</div>}

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Info */}
            <div className="bg-white rounded-xl shadow-xs border border-[#E8DDD0] overflow-hidden">
              <div className="bg-[#0E3320] px-5 py-3 text-white border-b-2 border-[#C59B3F] flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider">1. Personal & Contact Information</h3>
                <span className="text-[11px] font-mono text-[#C59B3F] font-bold">{reg.session_label || reg.academic_session || "—"}</span>
              </div>
              <div className="p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                {[
                  ["Candidate Name / नाम", reg.candidate_name],
                  ["Father's Name / पिता का नाम", reg.father_name],
                  ["Mother's Name / माता का नाम", reg.mother_name],
                  ["Date of Birth / जन्म तिथि", reg.dob],
                  ["Gender / लिंग", reg.gender?.toUpperCase()],
                  ["Category / श्रेणी", reg.category?.toUpperCase()],
                  ["Mobile / मोबाइल", reg.phone],
                  ["Email / ईमेल", reg.email],
                ].map(([label, val]) => (
                  <div key={label}>
                    <span className="text-[#9CA3AF] block font-medium">{label}</span>
                    <span className="font-bold text-[#1F2937] text-sm">{val || "—"}</span>
                  </div>
                ))}
                {reg.address && (
                  <div className="sm:col-span-3 pt-2 border-t border-[#F0E8DC]">
                    <span className="text-[#9CA3AF] block font-medium">Full Address / स्थायी पता</span>
                    <span className="font-semibold text-[#1F2937]">{reg.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Course */}
            <div className="bg-white rounded-xl shadow-xs border border-[#E8DDD0] overflow-hidden">
              <div className="bg-[#0E3320] px-5 py-3 text-white border-b-2 border-[#C59B3F]">
                <h3 className="text-xs font-bold uppercase tracking-wider">2. Enrolled Course / पाठ्यक्रम</h3>
              </div>
              <div className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs text-[#9CA3AF] block font-medium">Course Name</span>
                  <span className="text-base font-black text-[#0E3320]">{reg.courses?.course_name || reg.course_name || "—"}</span>
                </div>
                <div className="bg-[#F5F0E8] border border-[#E8DDD0] px-3 py-2 rounded-lg text-xs">
                  <span className="text-[#9CA3AF] block">Academic Session</span>
                  <span className="font-bold text-[#C59B3F]">{reg.session_label || reg.academic_session || "—"}</span>
                </div>
              </div>
            </div>

            {/* Education */}
            <div className="bg-white rounded-xl shadow-xs border border-[#E8DDD0] overflow-hidden">
              <div className="bg-[#0E3320] px-5 py-3 text-white border-b-2 border-[#C59B3F]">
                <h3 className="text-xs font-bold uppercase tracking-wider">3. Educational Qualifications / शैक्षणिक योग्यता</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-[#F5F0E8] text-[#374151] font-bold border-b border-[#E8DDD0] uppercase">
                      {["Examination", "Board / University", "Passing Year", "Max Marks", "Obtained", "Percentage"].map((h) => (
                        <th key={h} className="py-2.5 px-4">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0E8DC] text-[#1F2937]">
                    {[
                      ["10th / High School", edu.high_school],
                      ["12th / Intermediate", edu.intermediate],
                      ["Graduation", edu.graduation],
                      ["Other", edu.other],
                    ].filter(([, d]) => d?.board).map(([label, d]) => (
                      <tr key={label}>
                        <td className="py-2.5 px-4 font-bold">{label}</td>
                        <td className="py-2.5 px-4">{d.board || "—"}</td>
                        <td className="py-2.5 px-4">{d.year || "—"}</td>
                        <td className="py-2.5 px-4">{d.total || "—"}</td>
                        <td className="py-2.5 px-4">{d.obtained || "—"}</td>
                        <td className="py-2.5 px-4 font-bold text-[#0E3320]">{d.percentage ? `${d.percentage}%` : "—"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Documents */}
            <div className="bg-white rounded-xl shadow-xs border border-[#E8DDD0] overflow-hidden">
              <div className="bg-[#0E3320] px-5 py-3 text-white border-b-2 border-[#C59B3F]">
                <h3 className="text-xs font-bold uppercase tracking-wider">4. Uploaded Documents / दस्तावेज़</h3>
              </div>
              <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {/* Photo */}
                <div className="p-3 bg-[#F5F0E8] border border-[#E8DDD0] rounded-lg text-center">
                  <span className="text-xs font-bold text-[#374151] block mb-2">Passport Photo</span>
                  {reg.photo_url ? (
                    <div onClick={() => setPreviewImg({ src: reg.photo_url, title: "Passport Photo" })}
                      className="w-24 h-28 mx-auto bg-[#E8DDD0] rounded overflow-hidden cursor-pointer hover:opacity-90 border border-[#D5C7B7] shadow-xs">
                      <img src={reg.photo_url} alt="Photo" className="w-full h-full object-cover" />
                    </div>
                  ) : <span className="text-xs text-red-500 italic">Not uploaded</span>}
                </div>

                {/* Signature */}
                <div className="p-3 bg-[#F5F0E8] border border-[#E8DDD0] rounded-lg text-center">
                  <span className="text-xs font-bold text-[#374151] block mb-2">Signature</span>
                  {reg.signature_url ? (
                    <div onClick={() => setPreviewImg({ src: reg.signature_url, title: "Signature" })}
                      className="w-28 h-14 mx-auto bg-white rounded overflow-hidden cursor-pointer hover:opacity-90 border border-[#D5C7B7] shadow-xs my-2">
                      <img src={reg.signature_url} alt="Signature" className="w-full h-full object-contain p-1" />
                    </div>
                  ) : <span className="text-xs text-red-500 italic">Not uploaded</span>}
                </div>

                {[
                  { label: "Aadhaar Card", url: reg.aadhaar_url },
                  { label: "10th Marksheet", url: reg.tenth_marksheet_url || reg.marksheet_10th_url },
                  { label: "12th Marksheet", url: reg.twelfth_marksheet_url || reg.marksheet_12th_url },
                  { label: "Other Document", url: reg.affidavit_url || reg.other_doc_url },
                ].map(({ label, url }) => (
                  <div key={label} className="p-3 bg-[#F5F0E8] border border-[#E8DDD0] rounded-lg text-center flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#374151]">{label}</span>
                    <DocLink url={url} label={`View`} />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Query panel */}
          <div className="space-y-6">
            {/* Raise Query */}
            <div className="bg-white rounded-xl shadow-xs border border-[#E8DDD0] overflow-hidden">
              <div className="bg-amber-500 px-5 py-3 text-white flex items-center gap-2">
                <span>⚠</span>
                <h3 className="text-xs font-bold uppercase tracking-wider">Raise Query / आपत्ति दर्ज करें</h3>
              </div>
              <form onSubmit={handleRaiseQuery} className="p-5 space-y-4">
                {querySuccess && <div className="p-3 bg-emerald-50 border border-emerald-300 rounded text-xs text-emerald-800 font-medium">{querySuccess}</div>}
                {queryError && <div className="p-3 bg-red-50 border border-red-300 rounded text-xs text-red-800 font-medium">{queryError}</div>}

                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1">
                    Target Field <span className="text-red-500">*</span>
                  </label>
                  <select value={selectedField} onChange={(e) => setSelectedField(e.target.value)} disabled={isTerminal}
                    className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D5C7B7] rounded text-xs font-medium text-[#1F2937] focus:ring-2 focus:ring-[#C59B3F] focus:outline-none disabled:opacity-50">
                    {QUERY_FIELD_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#374151] uppercase tracking-wider mb-1">
                    Query Message <span className="text-red-500">*</span>
                  </label>
                  <textarea rows={4} value={queryMessage} onChange={(e) => setQueryMessage(e.target.value)} disabled={isTerminal}
                    placeholder="Explain clearly what needs to be corrected..."
                    className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D5C7B7] rounded text-xs text-[#1F2937] placeholder:text-[#9CA3AF] focus:ring-2 focus:ring-[#C59B3F] focus:outline-none disabled:opacity-50" />
                </div>

                <button type="submit" disabled={submittingQuery || isTerminal}
                  className="w-full py-2.5 px-4 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer">
                  {submittingQuery ? "Submitting..." : "Submit Query to College"}
                </button>
                {isTerminal && <p className="text-[11px] text-[#9CA3AF] italic text-center">Queries cannot be raised on approved/rejected applications.</p>}
              </form>
            </div>

            {/* Query History */}
            <div className="bg-white rounded-xl shadow-xs border border-[#E8DDD0] overflow-hidden">
              <div className="bg-[#0E3320] px-5 py-3 text-white border-b border-[#C59B3F]/40">
                <h3 className="text-xs font-bold uppercase tracking-wider">Query History ({queries.length})</h3>
              </div>
              <div className="p-4 divide-y divide-[#F0E8DC] max-h-96 overflow-y-auto">
                {queries.length === 0 ? (
                  <p className="text-xs text-[#9CA3AF] text-center py-4 italic">No queries raised yet.</p>
                ) : queries.map((q) => (
                  <div key={q.id} className="py-3 first:pt-0 last:pb-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-mono text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">{q.field_name}</span>
                      <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${q.status === "resolved" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                        {q.status}
                      </span>
                    </div>
                    <p className="text-xs text-[#374151] font-medium my-1">{q.message}</p>
                    <span className="text-[10px] text-[#9CA3AF] block">
                      {q.created_at ? new Date(q.created_at).toLocaleString("en-IN") : "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Data Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 p-4 overflow-y-auto" onClick={() => setEditOpen(false)}>
          <div className="bg-white rounded-xl max-w-2xl w-full my-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8DDD0] bg-[#0E3320] rounded-t-xl">
              <h4 className="text-sm font-bold text-white flex items-center gap-2"><Pencil className="w-4 h-4 text-[#C59B3F]" /> Edit Registration Data</h4>
              <button onClick={() => setEditOpen(false)} className="text-white/60 hover:text-white"><XIcon className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSaveEdit} className="p-6 space-y-5">
              {editMsg && (
                <div className={`p-3 rounded text-xs font-semibold ${editMsg.type === "success" ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-red-50 text-red-800 border border-red-200"}`}>
                  {editMsg.text}
                </div>
              )}
              <p className="text-xs text-[#9B8265]">Changes are saved directly to the database. Use carefully.</p>

              {/* Personal */}
              <div>
                <h5 className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-3 pb-1 border-b border-[#F0E8DC]">Personal Information</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: "candidate_name", label: "Candidate Name", type: "text" },
                    { key: "father_name", label: "Father's Name", type: "text" },
                    { key: "mother_name", label: "Mother's Name", type: "text" },
                    { key: "dob", label: "Date of Birth", type: "date" },
                  ].map(({ key, label, type }) => (
                    <div key={key}>
                      <label className="block text-[11px] font-bold text-[#374151] mb-1">{label}</label>
                      <input type={type} value={editForm[key] || ""} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D5C7B7] rounded text-xs text-[#1F2937] focus:ring-2 focus:ring-[#C59B3F] focus:outline-none" />
                    </div>
                  ))}
                  <div>
                    <label className="block text-[11px] font-bold text-[#374151] mb-1">Gender</label>
                    <select value={editForm.gender || ""} onChange={e => setEditForm(p => ({ ...p, gender: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D5C7B7] rounded text-xs text-[#1F2937] focus:ring-2 focus:ring-[#C59B3F] focus:outline-none">
                      <option value="">—</option>
                      {["Male","Female","Other"].map(o => <option key={o} value={o.toLowerCase()}>{o}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#374151] mb-1">Category</label>
                    <select value={editForm.category || ""} onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D5C7B7] rounded text-xs text-[#1F2937] focus:ring-2 focus:ring-[#C59B3F] focus:outline-none">
                      <option value="">—</option>
                      {["General","OBC","SC","ST"].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div>
                <h5 className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-3 pb-1 border-b border-[#F0E8DC]">Contact Details</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { key: "phone", label: "Mobile Number", type: "text" },
                    { key: "email", label: "Email Address", type: "email" },
                  ].map(({ key, label, type }) => (
                    <div key={key}>
                      <label className="block text-[11px] font-bold text-[#374151] mb-1">{label}</label>
                      <input type={type} value={editForm[key] || ""} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D5C7B7] rounded text-xs text-[#1F2937] focus:ring-2 focus:ring-[#C59B3F] focus:outline-none" />
                    </div>
                  ))}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-[#374151] mb-1">Address</label>
                    <textarea rows={2} value={editForm.address || ""} onChange={e => setEditForm(p => ({ ...p, address: e.target.value }))}
                      className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D5C7B7] rounded text-xs text-[#1F2937] focus:ring-2 focus:ring-[#C59B3F] focus:outline-none resize-none" />
                  </div>
                </div>
              </div>

              {/* Enrollment */}
              <div>
                <h5 className="text-xs font-bold text-[#374151] uppercase tracking-wider mb-3 pb-1 border-b border-[#F0E8DC]">Enrollment & Roll</h5>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { key: "enrollment_no", label: "Enrollment No." },
                    { key: "roll_no", label: "Roll Number" },
                    { key: "session_label", label: "Academic Session" },
                  ].map(({ key, label }) => (
                    <div key={key}>
                      <label className="block text-[11px] font-bold text-[#374151] mb-1">{label}</label>
                      <input type="text" value={editForm[key] || ""} onChange={e => setEditForm(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full px-3 py-2 bg-[#F5F0E8] border border-[#D5C7B7] rounded text-xs text-[#1F2937] focus:ring-2 focus:ring-[#C59B3F] focus:outline-none" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={editSaving}
                  className="flex-1 py-2.5 bg-[#0E3320] hover:bg-[#071A0E] text-white text-xs font-bold rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2">
                  {editSaving ? "Saving..." : <><Save className="w-3.5 h-3.5" /> Save Changes</>}
                </button>
                <button type="button" onClick={() => setEditOpen(false)}
                  className="px-6 py-2.5 bg-[#F5F0E8] hover:bg-[#EDE4D6] text-[#374151] text-xs font-bold rounded-lg border border-[#E8DDD0] transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setPreviewImg(null)}>
          <div className="bg-white rounded-xl max-w-lg w-full p-4 relative shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between pb-3 border-b border-[#E8DDD0] mb-3">
              <h4 className="text-sm font-bold text-[#1F2937]">{previewImg.title}</h4>
              <button onClick={() => setPreviewImg(null)} className="text-[#9CA3AF] hover:text-[#374151] text-lg font-bold">✕</button>
            </div>
            <div className="relative w-full h-80 bg-[#F5F0E8] rounded flex items-center justify-center overflow-hidden">
              <img src={previewImg.src} alt={previewImg.title} className="max-w-full max-h-full object-contain" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
