"use client";

import { useState } from "react";
import DobSelect from "@/components/ui/DobSelect";
import {
  parseAffilCertNo,
  affilSuffixOf,
  parsePersonName,
  AFFIL_PREFIX,
  AFFIL_SUFFIX_MAX,
  PERSON_NAME_MAX,
} from "@/lib/cert-number";

const CUR_YEAR = new Date().getFullYear();

/**
 * Admin control: decides the Affiliation No. printed on this institute's certificate, and whether the
 * certificate can be previewed / printed at all. Kept separate from the institute's public listing
 * code (e.g. BA-AFF-05): this number is typed by the admin specifically for the certificate.
 */
export default function AffiliationCertIssueCard({ instituteId, certNo, issuedAt, directorName, affiliatedSince, onChanged }) {
  // Only the part after the fixed prefix is editable.
  const [value, setValue] = useState(affilSuffixOf(certNo));
  const [name, setName] = useState(directorName ?? "");
  const [since, setSince] = useState(affiliatedSince ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const isIssued = !!certNo;
  const cleaned = parseAffilCertNo(value);
  const cleanedName = parsePersonName(name);
  const isDirty = cleaned !== certNo || cleanedName !== (directorName ?? "") || since !== (affiliatedSince ?? "");

  const save = async () => {
    setMessage(null);
    if (!cleaned) {
      setMessage({ type: "err", text: `${AFFIL_PREFIX} के बाद 1–${AFFIL_SUFFIX_MAX} अक्षर लिखें: letters, digits, spaces और / _ . - ही मान्य हैं।` });
      return;
    }
    if (cleanedName === null) {
      setMessage({ type: "err", text: `निदेशक / प्राचार्य का नाम किसी अक्षर से शुरू हो और ${PERSON_NAME_MAX} अक्षर तक हो (letters, spaces और . , ' ( ) / - ही मान्य)।` });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/affiliation-certificates/${instituteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cert_no: affilSuffixOf(cleaned), director_name: cleanedName, affiliated_since: since }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not save." });
        return;
      }
      const savedName = data.director_name ?? (cleanedName || null);
      const savedSince = data.affiliated_since ?? (since || null);
      setValue(affilSuffixOf(data.cert_no ?? cleaned));
      setName(savedName ?? "");
      setSince(savedSince ?? "");
      setMessage({ type: "ok", text: "सेव हो गया। अब संबद्धता प्रमाण-पत्र प्रिंट किया जा सकता है।" });
      onChanged(data.cert_no ?? cleaned, data.issued_at ?? issuedAt ?? new Date().toISOString(), savedName, savedSince);
    } catch {
      setMessage({ type: "err", text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const revoke = async () => {
    if (!confirm("इस संस्थान का संबद्धता प्रमाण-पत्र वापस लें? दोबारा जारी करने तक यह प्रिंट नहीं हो सकेगा।")) return;
    setMessage(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/affiliation-certificates/${instituteId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not withdraw." });
        return;
      }
      setValue("");
      setMessage({ type: "ok", text: "वापस ले लिया गया। अब प्रमाण-पत्र प्रिंट नहीं हो सकता।" });
      onChanged(null, null, directorName, affiliatedSince);
    } catch {
      setMessage({ type: "err", text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-6 bg-white border border-[#E8DDD0] rounded-xl shadow-xs overflow-hidden no-print">
      <div className="px-4 sm:px-5 py-3 bg-[#0E3320] border-b-2 border-[#C59B3F] flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white">Affiliation Certificate / संबद्धता प्रमाण-पत्र</h2>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            isIssued ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
          }`}
        >
          {isIssued ? "Issued / जारी" : "Not issued / जारी नहीं"}
        </span>
      </div>

      <div className="p-4 sm:p-5 space-y-3">
        <p className="text-xs text-slate-500">
          नीचे का प्रमाण-पत्र <strong>तभी</strong> प्रिंट हो सकेगा जब आप यहाँ संबद्धता क्रमांक डालेंगे। यह संस्थान के सार्वजनिक कोड (जैसे BA-AFF-05) से अलग है।
        </p>

        <div className="grid gap-3 sm:grid-cols-2 max-w-3xl">
          <label className="block">
            <span className="block text-[11px] font-bold text-slate-700 mb-1">
              Affiliation No. / संबद्धता क्र. <span className="text-red-600">*</span>
            </span>
            <div className="flex w-full min-w-0 rounded-lg border border-slate-300 bg-white overflow-hidden focus-within:ring-2 focus-within:ring-[#C59B3F]">
              <span className="px-3 py-2 bg-slate-100 border-r border-slate-300 text-sm font-mono font-bold text-slate-600 select-none" aria-hidden="true">
                {AFFIL_PREFIX}
              </span>
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value.toUpperCase())}
                maxLength={AFFIL_SUFFIX_MAX + AFFIL_PREFIX.length}
                placeholder="UP-2044"
                aria-label={`Affiliation No. after ${AFFIL_PREFIX}`}
                className="flex-1 min-w-0 px-3 py-2 bg-transparent text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none"
              />
            </div>
          </label>

          <label className="block">
            <span className="block text-[11px] font-bold text-slate-700 mb-1">Director / Principal / निदेशक / प्राचार्य</span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={PERSON_NAME_MAX}
              placeholder="e.g. Dr. Ramesh Kumar"
              className="w-full min-w-0 px-3 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
            />
          </label>

          <div className="sm:col-span-2">
            <span className="block text-[11px] font-bold text-slate-700 mb-1">Affiliation Date / संबद्धता दिनांक</span>
            <div className="max-w-md">
              <DobSelect idPrefix="affil_since" value={since} onChange={setSince} minYear={2000} maxYear={CUR_YEAR + 1} />
            </div>
            <p className="mt-1 text-[11px] text-slate-500">खाली छोड़ने पर प्रमाण-पत्र पर जारी करने की तारीख छपेगी।</p>
          </div>
        </div>

        <p className="text-[11px] text-slate-500">
          निदेशक का नाम संस्थान के Contact Person के रूप में सेव होता है और प्रमाण-पत्र पर छपता है। खाली छोड़ने पर &ldquo;—&rdquo; छपेगा।
        </p>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={save}
            disabled={busy || !cleaned || cleanedName === null || !isDirty}
            className="px-4 py-2 bg-[#0E3320] hover:bg-[#15482D] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isIssued ? "Save Changes" : "Issue Certificate"}
          </button>
          {isIssued && (
            <button
              type="button"
              onClick={revoke}
              disabled={busy}
              className="px-4 py-2 bg-white hover:bg-red-50 text-red-600 border border-red-300 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors disabled:opacity-40 cursor-pointer"
            >
              Withdraw
            </button>
          )}
        </div>

        {isIssued && issuedAt && (
          <div className="text-[11px] text-slate-600">
            जारी तिथि:{" "}
            <strong className="text-slate-800">
              {new Date(issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
            </strong>
          </div>
        )}

        {message && (
          <div
            role="status"
            className={`p-2.5 rounded text-xs font-semibold border-l-4 ${
              message.type === "ok" ? "bg-emerald-50 border-emerald-500 text-emerald-800" : "bg-red-50 border-red-500 text-red-800"
            }`}
          >
            {message.text}
          </div>
        )}
      </div>
    </div>
  );
}
