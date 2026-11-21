"use client";

import { useState } from "react";
import { REG_PREFIX, NOC_PREFIX, parseCertSuffix } from "@/lib/cert-number";

/**
 * Admin control: decides whether THIS student can download the Registration Certificate and NOC.
 * The admin types only the part after "BAYAPCP/REG/"; the NOC number follows automatically.
 */
export default function CertificateIssueCard({ registrationId, status, suffix, issuedAt, onChanged }) {
  const [value, setValue] = useState(suffix ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState(null);

  const isIssued = !!suffix;
  const isApproved = status === "approved";
  const cleaned = parseCertSuffix(value);

  const save = async () => {
    setMessage(null);
    if (!cleaned) {
      setMessage({ type: "err", text: "1–30 अक्षर लिखें: letters, digits और / _ . - ही मान्य हैं।" });
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/registration-certificates/${registrationId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ suffix: cleaned }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not save the number." });
        return;
      }
      setMessage({ type: "ok", text: "सेव हो गया। अब विद्यार्थी पंजीयन प्रमाण-पत्र और NOC डाउनलोड कर सकता है।" });
      onChanged(data.suffix ?? cleaned, data.issued_at ?? issuedAt ?? new Date().toISOString());
    } catch {
      setMessage({ type: "err", text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  const revoke = async () => {
    if (!confirm("इस विद्यार्थी का पंजीयन प्रमाण-पत्र और NOC वापस लें? वह इन्हें डाउनलोड नहीं कर पाएगा।")) return;
    setMessage(null);
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/registration-certificates/${registrationId}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setMessage({ type: "err", text: data.error || "Could not withdraw." });
        return;
      }
      setValue("");
      setMessage({ type: "ok", text: "वापस ले लिया गया। अब विद्यार्थी इन्हें डाउनलोड नहीं कर सकता।" });
      onChanged(null, null);
    } catch {
      setMessage({ type: "err", text: "Network error. Please try again." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="mb-6 bg-white border border-[#E8DDD0] rounded-xl shadow-xs overflow-hidden">
      <div className="px-5 py-3 bg-[#0E3320] border-b-2 border-[#C59B3F] flex items-center justify-between gap-3 flex-wrap">
        <h2 className="text-xs font-bold uppercase tracking-wider text-white">
          Registration Certificate &amp; NOC / पंजीयन प्रमाण-पत्र एवं NOC
        </h2>
        <span
          className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
            isIssued ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-slate-100 text-slate-500 border-slate-200"
          }`}
        >
          {isIssued ? "Issued / जारी" : "Not issued / जारी नहीं"}
        </span>
      </div>

      <div className="p-5 space-y-3">
        {!isApproved ? (
          <p className="text-xs text-slate-500">
            आवेदन approve होने के बाद ही यह उपलब्ध होगा। तब तक विद्यार्थी कुछ भी डाउनलोड नहीं कर सकता।
          </p>
        ) : (
          <>
            <p className="text-xs text-slate-500">
              विद्यार्थी पंजीयन प्रमाण-पत्र और NOC <strong>तभी</strong> डाउनलोड कर सकेगा जब आप यहाँ नंबर डालेंगे। सिर्फ़{" "}
              <span className="font-mono">{REG_PREFIX}</span> के बाद वाला हिस्सा लिखें।
            </p>

            <div className="flex flex-col sm:flex-row gap-2 sm:items-center">
              <div className="flex items-stretch flex-1 max-w-md">
                <span className="inline-flex items-center px-3 bg-slate-100 border border-r-0 border-slate-300 rounded-l-lg text-xs font-mono font-bold text-slate-600">
                  {REG_PREFIX}
                </span>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  maxLength={30}
                  placeholder="e.g. 2404"
                  aria-label={`Registration number after ${REG_PREFIX}`}
                  className="flex-1 min-w-0 px-3 py-2 bg-white border border-slate-300 rounded-r-lg text-sm font-mono font-bold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={save}
                  disabled={busy || !cleaned || cleaned === suffix}
                  className="px-4 py-2 bg-[#0E3320] hover:bg-[#15482D] text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isIssued ? "Update Number" : "Issue to Student"}
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
            </div>

            {(cleaned || isIssued) && (
              <div className="text-[11px] text-slate-600 space-y-0.5">
                <div>
                  प्रमाण-पत्र क्र.: <span className="font-mono font-bold text-slate-800">{REG_PREFIX}{cleaned ?? suffix}</span>
                </div>
                <div>
                  NOC क्र. (अपने आप): <span className="font-mono font-bold text-slate-800">{NOC_PREFIX}{cleaned ?? suffix}</span>
                </div>
                {isIssued && issuedAt && (
                  <div>
                    जारी तिथि:{" "}
                    <strong className="text-slate-800">
                      {new Date(issuedAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}
                    </strong>
                  </div>
                )}
              </div>
            )}
          </>
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
