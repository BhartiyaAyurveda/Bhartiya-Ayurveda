"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  AlertTriangle, CheckCircle2, RefreshCw, Send, FileText,
  MessageSquare, User, Phone, GraduationCap, ChevronLeft,
  IdCard, FileBadge, BookOpen, Calendar, Hash,
  Shield, ExternalLink, Printer, Clock,
} from "lucide-react";

/* ─── constants ──────────────────────────────────────────────── */
const STATUS = {
  pending:      { label: "Pending",      dot: "bg-gray-400",    pill: "bg-gray-100 text-gray-700 border-gray-300" },
  submitted:    { label: "Submitted",    dot: "bg-blue-500",    pill: "bg-blue-50 text-blue-700 border-blue-200" },
  under_review: { label: "Under Review", dot: "bg-amber-500",   pill: "bg-amber-50 text-amber-800 border-amber-200" },
  query_raised: { label: "Query Raised", dot: "bg-orange-500",  pill: "bg-orange-50 text-orange-800 border-orange-200" },
  approved:     { label: "Approved",     dot: "bg-emerald-500", pill: "bg-emerald-50 text-emerald-800 border-emerald-200" },
  rejected:     { label: "Rejected",     dot: "bg-red-500",     pill: "bg-red-50 text-red-700 border-red-200" },
};


const EDIT_SECTIONS = [
  {
    title: "Personal Details",
    fields: [
      { key: "candidate_name", label: "Candidate Full Name", type: "text", span: 2 },
      { key: "father_name",    label: "Father's Name",       type: "text" },
      { key: "mother_name",    label: "Mother's Name",       type: "text" },
      { key: "dob",            label: "Date of Birth",       type: "date" },
      { key: "aadhar_no",      label: "Aadhaar Number",      type: "text" },
      { key: "gender",         label: "Gender",   type: "select", options: ["Male","Female","Other"] },
      { key: "category",       label: "Category", type: "select", options: ["General","OBC","SC","ST"] },
    ],
  },
  {
    title: "Contact Details",
    fields: [
      { key: "phone",    label: "Mobile",   type: "tel" },
      { key: "email",    label: "Email",    type: "email" },
      { key: "address",  label: "Address",  type: "text", span: 2 },
      { key: "city",     label: "City",     type: "text" },
      { key: "district", label: "District", type: "text" },
      { key: "state",    label: "State",    type: "text" },
      { key: "pincode",  label: "PIN Code", type: "text" },
    ],
  },
  {
    title: "Academic Session",
    fields: [
      { key: "academic_session", label: "Academic Year", type: "text" },
    ],
  },
];

/* ─── sub-components ─────────────────────────────────────────── */
function Field({ label, value, mono }) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8AAB92] mb-0.5">{label}</p>
      <p className={`text-sm font-semibold text-[#0E3320] break-words leading-snug ${mono ? "font-mono" : ""}`}>
        {value || <span className="text-[#C8B79E] font-normal italic text-xs">Not provided</span>}
      </p>
    </div>
  );
}

function Section({ n, title, icon: Icon, children }) {
  return (
    <div className="bg-white rounded-2xl border border-[#E8DFD1] overflow-hidden shadow-xs">
      <div className="flex items-center gap-3 px-5 py-3.5 bg-gradient-to-r from-[#F7F3EC] to-[#F0E9DC] border-b border-[#E8DFD1]">
        <span className="w-6 h-6 rounded-full bg-[#0E3320] text-[#C59B3F] text-[10px] font-black flex items-center justify-center shrink-0">
          {n}
        </span>
        {Icon && <Icon className="w-4 h-4 text-[#8C671D] shrink-0" />}
        <p className="text-xs font-black uppercase tracking-widest text-[#0E3320]">{title}</p>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function DocItem({ icon: Icon = FileText, label, url }) {
  return (
    <div className={`flex items-center justify-between gap-3 p-3 rounded-xl border transition-colors ${url ? "border-[#E8DFD1] bg-[#FAF8F5] hover:border-[#C59B3F] hover:bg-[#FDF9F3]" : "border-dashed border-[#E0D8CC] bg-[#F9F6F1] opacity-60"}`}>
      <div className="flex items-center gap-2.5 min-w-0">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${url ? "bg-[#0E3320]/10" : "bg-[#E8DFD1]"}`}>
          <Icon className={`w-4 h-4 ${url ? "text-[#0E3320]" : "text-[#B8A88A]"}`} />
        </div>
        <span className={`text-xs font-semibold truncate ${url ? "text-[#0E3320]" : "text-[#B8A88A]"}`}>{label}</span>
      </div>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer"
          className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-[#8C671D] bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full hover:bg-[#C59B3F] hover:text-white hover:border-[#C59B3F] transition-all">
          <ExternalLink className="w-2.5 h-2.5" /> View
        </a>
      ) : (
        <span className="shrink-0 text-[10px] text-[#C8B79E] font-medium">Not uploaded</span>
      )}
    </div>
  );
}

function EduTable({ education }) {
  const rows = [
    { key: "high_school",  label: "Class X (10th)",   sub: "High School" },
    { key: "intermediate", label: "Class XII (12th)",  sub: "Intermediate" },
    { key: "graduation",   label: "Graduation",        sub: "Bachelor's" },
    { key: "other",        label: "Other / Diploma",   sub: "Additional" },
  ].filter(r => { const e = education?.[r.key]; return e && (e.board || e.year || e.obtained || e.cgpa); });

  if (!rows.length) return (
    <div className="text-center py-6 text-[#B8A88A] text-xs italic">No education records provided.</div>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-[#E8DFD1]">
      <table className="w-full text-xs border-collapse min-w-[520px]">
        <thead>
          <tr className="bg-[#0E3320] text-white text-[10px] uppercase tracking-wider">
            <th className="text-left py-2.5 px-4 font-bold rounded-tl-xl">Qualification</th>
            <th className="text-left py-2.5 px-4 font-bold">Board / University</th>
            <th className="text-center py-2.5 px-3 font-bold">Year</th>
            <th className="text-center py-2.5 px-3 font-bold">Marks / CGPA</th>
            <th className="text-center py-2.5 px-3 font-bold rounded-tr-xl">Result</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(({ key, label, sub }, i) => {
            const e = education[key] || {};
            const isCgpa = e.system === "cgpa";
            return (
              <tr key={key} className={`border-t border-[#F2EDE4] ${i % 2 === 0 ? "bg-white" : "bg-[#FAF8F5]"}`}>
                <td className="py-3 px-4">
                  <p className="font-bold text-[#0E3320]">{label}</p>
                  <p className="text-[10px] text-[#8AAB92]">{sub}</p>
                </td>
                <td className="py-3 px-4 text-[#374151]">{e.board || <span className="text-[#C8B79E]">—</span>}</td>
                <td className="py-3 px-3 text-center text-[#374151]">{e.year || e.passing_year || <span className="text-[#C8B79E]">—</span>}</td>
                <td className="py-3 px-3 text-center">
                  {isCgpa
                    ? (e.cgpa ? <span className="font-bold text-[#0E3320]">{e.cgpa}<span className="text-[#8AAB92] font-normal">/{e.cgpa_scale||10}</span></span> : <span className="text-[#C8B79E]">—</span>)
                    : (e.obtained && e.total ? <span className="font-bold text-[#0E3320]">{e.obtained}<span className="text-[#8AAB92] font-normal">/{e.total}</span></span> : <span className="text-[#C8B79E]">—</span>)
                  }
                </td>
                <td className="py-3 px-3 text-center">
                  {isCgpa
                    ? <span className="inline-block px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-200">CGPA</span>
                    : (e.percentage
                        ? <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold border ${parseFloat(e.percentage) >= 50 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-600 border-red-200"}`}>{e.percentage}%</span>
                        : <span className="text-[#C8B79E]">—</span>)
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

/* ─── main page ──────────────────────────────────────────────── */
export default function RegistrationDetailPage() {
  const { id }  = useParams();
  const router  = useRouter();

  const [data,       setData]       = useState(null);
  const [queries,    setQueries]    = useState([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState("");
  const [tab,        setTab]        = useState("details");
  const [editForm,   setEditForm]   = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg,  setSubmitMsg]  = useState("");
  const [submitErr,  setSubmitErr]  = useState("");

  useEffect(() => { load(); }, [id]);

  const load = async () => {
    setLoading(true); setError("");
    try {
      const res  = await fetch(`/api/college/students/${id}`);
      const json = await res.json();
      if (!res.ok) { setError(json.error || "Not found."); }
      else {
        setData(json.data);
        setQueries(json.queries || []);
        const f = {};
        EDIT_SECTIONS.forEach(({ fields }) => fields.forEach(({ key }) => { f[key] = json.data[key] || ""; }));
        setEditForm(f);
      }
    } catch { setError("Network error."); }
    setLoading(false);
  };

  const handleResubmit = async () => {
    setSubmitErr(""); setSubmitMsg(""); setSubmitting(true);
    try {
      const res  = await fetch(`/api/college/students/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, resubmit: true }),
      });
      const json = await res.json();
      if (!res.ok) setSubmitErr(json.error || "Resubmit failed.");
      else { setSubmitMsg("Application resubmitted successfully."); setData(json.data); setTab("details"); }
    } catch { setSubmitErr("Network error."); }
    setSubmitting(false);
  };

  const fmt = (d) => d ? new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }) : "—";

  /* loading */
  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className="w-12 h-12 rounded-2xl bg-[#0E3320]/10 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-[#C59B3F]" />
      </div>
      <p className="text-sm font-semibold text-[#5C8261]">Loading application details…</p>
    </div>
  );

  /* error */
  if (error) return (
    <div className="space-y-4 max-w-2xl">
      <button onClick={() => router.back()} className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C8261] hover:text-[#0E3320]">
        <ChevronLeft className="w-4 h-4" /> Back
      </button>
      <div className="p-5 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
        <div><p className="font-bold">Could not load application</p><p className="mt-0.5 font-normal">{error}</p></div>
      </div>
    </div>
  );

  const ss        = STATUS[data.status] || STATUS.pending;
  const canEdit   = data.status === "query_raised";
  const openQuery = queries.find(q => q.status === "open");

  return (
    <div className="space-y-5 max-w-4xl pb-12">

      {/* ── top nav ── */}
      <div className="no-print flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-xs text-[#5C8261]">
          <button onClick={() => router.push("/college/dashboard/registrations")}
            className="inline-flex items-center gap-1 font-semibold hover:text-[#0E3320] transition-colors">
            <ChevronLeft className="w-4 h-4" /> All Registrations
          </button>
          <span className="text-[#C8B79E]">/</span>
          <span className="font-bold text-[#0E3320] truncate max-w-[180px]">{data.candidate_name}</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#5C8261] bg-white border border-[#E8DFD1] rounded-xl hover:border-[#0E3320] hover:text-[#0E3320] transition-all">
            <Printer className="w-3.5 h-3.5" /> Print
          </button>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wide border ${ss.pill}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />
            {ss.label}
          </span>
        </div>
      </div>

      {/* ── hero card ── */}
      <div className="bg-white rounded-2xl border border-[#E8DFD1] shadow-sm overflow-hidden">
        {/* dark header */}
        <div className="bg-gradient-to-br from-[#0E3320] via-[#143D28] to-[#0A2818] px-6 py-5">
          <div className="flex items-start gap-5">
            {/* photo */}
            <div className="shrink-0">
              {data.photo_url ? (
                <img src={data.photo_url} alt="Photo"
                  className="w-20 h-24 object-cover rounded-xl border-2 border-[#C59B3F]/70 shadow-lg" />
              ) : (
                <div className="w-20 h-24 rounded-xl border-2 border-[#C59B3F]/30 bg-[#1A5C38]/60 flex flex-col items-center justify-center gap-1">
                  <User className="w-8 h-8 text-[#C59B3F]/50" />
                  <span className="text-[9px] text-[#C59B3F]/40 font-bold uppercase">No Photo</span>
                </div>
              )}
            </div>

            {/* info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[#C59B3F] text-[9px] font-black uppercase tracking-[3px]">Candidate Application</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border ${ss.pill}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${ss.dot}`} />{ss.label}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white leading-tight">{data.candidate_name}</h1>
              <p className="text-[#8FBFA8] text-xs mt-0.5">
                {data.gender ? `${data.gender} · ` : ""}Son / Daughter of {data.father_name || "—"}
              </p>

              {/* badges row */}
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {data.enrollment_no && (
                  <div className="inline-flex items-center gap-1.5 bg-[#C59B3F]/15 border border-[#C59B3F]/35 text-[#E4BF64] px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold">
                    <IdCard className="w-3 h-3" />
                    {data.enrollment_no}
                  </div>
                )}
                {data.roll_no && (
                  <div className="inline-flex items-center gap-1.5 bg-white/10 border border-white/15 text-[#D4F0E0] px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold">
                    <Hash className="w-3 h-3" />
                    Roll: {data.roll_no}
                  </div>
                )}
                <div className="inline-flex items-center gap-1.5 bg-white/8 border border-white/12 text-[#A8D4B8] px-2.5 py-1 rounded-lg text-[10px] font-bold">
                  <Calendar className="w-3 h-3" />
                  {fmt(data.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* info strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-[#F0EAE0] border-t border-[#E8DFD1] bg-[#FDFAF6]">
          {[
            { label: "Course",   value: data.courses?.course_name || "—", icon: BookOpen },
            { label: "Session",  value: data.academic_session || "—",      icon: Calendar },
            { label: "Category", value: data.category || "—",              icon: Shield },
            { label: "College",  value: data.colleges?.college_name || "—", icon: GraduationCap },
          ].map(({ label, value, icon: Ic }) => (
            <div key={label} className="px-4 py-3 flex items-center gap-2.5">
              <Ic className="w-4 h-4 text-[#C59B3F] shrink-0" />
              <div className="min-w-0">
                <p className="text-[9px] font-bold uppercase tracking-wider text-[#8AAB92]">{label}</p>
                <p className="text-xs font-bold text-[#0E3320] truncate leading-tight mt-0.5">{value}</p>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* ── query alert ── */}
      {openQuery && tab === "details" && (
        <div className="flex items-start gap-3 p-4 rounded-2xl bg-orange-50 border border-orange-200">
          <div className="w-8 h-8 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-4 h-4 text-orange-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-orange-900">Action Required — Query Raised by Admin</p>
            <p className="text-xs text-orange-800 mt-0.5 font-normal leading-relaxed">{openQuery.message}</p>
          </div>
        </div>
      )}

      {/* ── tabs ── */}
      <div className="no-print flex gap-1 bg-[#F2EDE4] rounded-2xl p-1">
        {[
          { id: "details", label: "Application",       icon: FileText },
          ...(canEdit ? [{ id: "edit", label: "Edit & Resubmit", icon: Send }] : []),
          { id: "queries", label: `Queries (${queries.length})`, icon: MessageSquare },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              tab === t.id
                ? "bg-white text-[#0E3320] shadow-sm border border-[#E8DFD1]"
                : "text-[#5C8261] hover:text-[#0E3320] hover:bg-white/50"
            }`}>
            <t.icon className="w-3.5 h-3.5" /> {t.label}
          </button>
        ))}
      </div>

      {/* ── DETAILS ── */}
      {tab === "details" && (
        <div className="space-y-4">

          {/* 1. Personal */}
          <Section n="1" title="Personal Information" icon={User}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
              <Field label="Full Name"      value={data.candidate_name} />
              <Field label="Father's Name"  value={data.father_name} />
              <Field label="Mother's Name"  value={data.mother_name} />
              <Field label="Date of Birth"  value={fmt(data.dob)} />
              <Field label="Gender"         value={data.gender} />
              <Field label="Category"       value={data.category} />
              <Field label="Aadhaar No."    value={data.aadhar_no} mono />
            </div>
          </Section>

          {/* 2. Contact */}
          <Section n="2" title="Contact Details" icon={Phone}>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-6 gap-y-4">
              <Field label="Mobile Number" value={data.phone} />
              <Field label="Email Address" value={data.email} />
              <Field label="PIN Code"      value={data.pincode} />
              <div className="col-span-2 sm:col-span-3">
                <Field label="Full Address" value={[data.address, data.city, data.district, data.state].filter(Boolean).join(", ")} />
              </div>
            </div>
          </Section>

          {/* 3. Education */}
          <Section n="3" title="Educational Qualifications" icon={GraduationCap}>
            <EduTable education={data.education} />
          </Section>

          {/* 4. Course & Enrollment */}
          <Section n="4" title="Course & Enrollment" icon={BookOpen}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
              <div className="sm:col-span-2">
                <Field label="Course Name" value={data.courses?.course_name} />
              </div>
              <Field label="Academic Session" value={data.academic_session} />
              <Field label="Course Duration"  value={data.courses?.duration_label} />
              <Field label="Enrollment No."   value={data.enrollment_no} mono />
              <Field label="Roll No."         value={data.roll_no || "Not allotted yet"} mono />
            </div>
          </Section>

          {/* 5. Documents */}
          <Section n="5" title="Uploaded Documents" icon={FileBadge}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <DocItem icon={User}     label="Passport Photo"          url={data.photo_url} />
              <DocItem icon={FileText} label="Candidate Signature"     url={data.signature_url} />
              <DocItem icon={IdCard}   label="Aadhaar Card"            url={data.aadhaar_url} />
              <DocItem icon={FileText} label="10th Marksheet"          url={data.tenth_marksheet_url} />
              <DocItem icon={FileText} label="12th Marksheet"          url={data.twelfth_marksheet_url} />
              <DocItem icon={Shield}   label="Affidavit / Declaration" url={data.affidavit_url} />
            </div>
          </Section>
        </div>
      )}

      {/* ── EDIT & RESUBMIT ── */}
      {tab === "edit" && canEdit && (
        <div className="bg-white rounded-2xl border border-orange-200 overflow-hidden shadow-xs">
          <div className="bg-orange-50 border-b border-orange-200 px-5 py-3.5 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-orange-600 shrink-0" />
            <p className="text-xs font-bold text-orange-800 uppercase tracking-wide">
              Edit & Resubmit — Correct the details and click Resubmit
            </p>
          </div>
          <div className="p-5 space-y-6">
            {submitErr && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">
                <AlertTriangle className="w-4 h-4 shrink-0" /> {submitErr}
              </div>
            )}
            {submitMsg && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs">
                <CheckCircle2 className="w-4 h-4 shrink-0" /> {submitMsg}
              </div>
            )}

            {EDIT_SECTIONS.map(({ title, fields }) => (
              <div key={title}>
                <p className="text-[10px] font-black uppercase text-[#8AAB92] tracking-widest mb-3 pb-1.5 border-b border-[#EAE2D3]">{title}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fields.map(({ key, label, type, span, options }) => (
                    <div key={key} className={span === 2 ? "sm:col-span-2" : ""}>
                      <label className="block text-[10px] font-bold uppercase text-[#5C8261] mb-1.5">{label}</label>
                      {type === "select" ? (
                        <select value={editForm[key] || ""} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]/30 focus:border-[#C59B3F] transition-all">
                          <option value="">— Select —</option>
                          {options.map(o => <option key={o} value={o}>{o}</option>)}
                        </select>
                      ) : (
                        <input type={type} value={editForm[key] || ""} onChange={e => setEditForm(f => ({ ...f, [key]: e.target.value }))}
                          className="w-full px-3.5 py-2.5 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]/30 focus:border-[#C59B3F] transition-all"
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <div className="pt-4 border-t border-[#E8DFD1] flex items-center justify-end gap-3">
              <button onClick={() => setTab("details")} className="px-5 py-2.5 rounded-xl border border-[#DDD1BE] text-sm font-bold text-[#5C8261] hover:text-[#0E3320] hover:border-[#0E3320] transition-all">
                Cancel
              </button>
              <button onClick={handleResubmit} disabled={submitting}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-sm font-bold disabled:opacity-60 transition-all shadow-sm active:scale-95">
                {submitting
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Resubmitting…</>
                  : <><Send className="w-4 h-4" /> Resubmit Application</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── QUERIES ── */}
      {tab === "queries" && (
        <div className="space-y-3">
          {queries.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#E8DFD1]">
              <div className="w-14 h-14 rounded-2xl bg-[#F5F0E8] border border-[#E8DFD1] flex items-center justify-center mx-auto mb-3">
                <MessageSquare className="w-7 h-7 text-[#DDD1BE]" />
              </div>
              <p className="text-sm font-bold text-[#0E3320]">No queries raised</p>
              <p className="text-xs text-[#9B8265] mt-1">Admin has not raised any query on this application.</p>
            </div>
          ) : (
            queries.map(q => (
              <div key={q.id} className={`bg-white rounded-2xl border p-5 ${q.status === "open" ? "border-orange-200 bg-orange-50/40" : "border-[#E8DFD1]"}`}>
                <div className="flex items-start justify-between gap-3 mb-3">
                  <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2.5 py-1 rounded-full border ${q.status === "open" ? "bg-orange-100 text-orange-800 border-orange-200" : "bg-emerald-50 text-emerald-700 border-emerald-200"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${q.status === "open" ? "bg-orange-500" : "bg-emerald-500"}`} />
                    {q.status === "open" ? "Open" : "Resolved"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] text-[#9B8265]">
                    <Clock className="w-3 h-3" /> {fmt(q.created_at)}
                  </span>
                </div>
                <p className="text-sm text-[#0E3320] font-medium leading-relaxed">{q.message}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
