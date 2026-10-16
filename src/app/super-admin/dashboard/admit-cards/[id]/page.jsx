"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Printer, RefreshCw, AlertTriangle } from "lucide-react";
import AdmitCardTemplate from "@/components/admin/AdmitCardTemplate";

export default function AdminAdmitCardPage() {
  const { id } = useParams();
  const router = useRouter();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]   = useState("");

  useEffect(() => {
    fetch(`/api/admin/admit-cards/${id}`)
      .then(r => r.json())
      .then(j => { if (j.ok) setData(j.data); else setError(j.error || "Failed to load"); })
      .catch(() => setError("Network error"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <RefreshCw className="w-6 h-6 animate-spin text-[#C59B3F]" />
    </div>
  );

  return (
    <div className="space-y-4 print:space-y-0">
      <style>{`
        @media print {
          @page { size: A4 portrait; margin: 0; }
          html, body {
            background: #fff !important;
            margin: 0 !important;
            padding: 0 !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>

      {/* Toolbar — hidden on print */}
      <div className="no-print flex items-center gap-3 flex-wrap">
        <button onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5C8261] hover:text-[#0E3320]">
          Back
        </button>
        <div className="flex-1" />
        {!error && (
          <button onClick={() => window.print()}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-sm font-bold">
            <Printer className="w-4 h-4" /> Print / Save PDF
          </button>
        )}
      </div>

      {error ? (
        <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />{error}
        </div>
      ) : (
        <div className="max-w-[860px] mx-auto print:max-w-none print:w-full print:m-0 print:p-0">
          <AdmitCardTemplate data={data} />
        </div>
      )}
    </div>
  );
}
