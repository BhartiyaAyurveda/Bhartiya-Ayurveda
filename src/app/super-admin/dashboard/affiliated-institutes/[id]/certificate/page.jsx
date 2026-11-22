"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import AffiliationCertIssueCard from "@/components/admin/AffiliationCertIssueCard";
import AffiliationCertificateLayout from "@/components/print/AffiliationCertificateLayout";

/** Admin page: set the Affiliation No. for one institute, then preview / print its certificate. */
export default function AffiliationCertificatePage({ params }) {
  const { id } = params;

  const [institute, setInstitute] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/affiliated-institutes");
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to load institute");
        return;
      }
      const match = (data.data || []).find((i) => String(i.id) === String(id));
      if (!match) {
        setError("Institute not found");
        return;
      }
      setInstitute(match);
      setError(null);
    } catch {
      setError("Network error while loading institute.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [id]);

  const backHref = "/super-admin/dashboard?tab=institutes";

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] text-sm text-[#5C8261]">Loading…</div>;
  }

  if (error || !institute) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FAF8F5] px-4">
        <div className="text-center max-w-md">
          <p className="text-sm text-red-700 font-semibold mb-4">{error || "Institute not found"}</p>
          <Link href={backHref} className="text-[#0E3320] text-sm font-bold hover:underline">Back to Affiliated Institutes</Link>
        </div>
      </div>
    );
  }

  const certNo = institute.affiliation_cert_no ?? null;

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <div className="max-w-[900px] w-full mx-auto px-4 sm:px-6 py-5 sm:py-8 print:p-0">
        <div className="mb-4 grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:justify-between no-print print:hidden">
          <Link
            href={backHref}
            className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-white hover:bg-[#F2EDE4] text-[#0E3320] border border-[#DDD1BE] text-sm font-bold transition-colors"
          >
            <ArrowLeft className="w-4 h-4 shrink-0" /> Back
          </Link>
          {certNo && (
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-[#E4BF64] text-sm font-bold shadow-md transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 shrink-0" /> Print / Download PDF
            </button>
          )}
        </div>

        <div className="mb-4 no-print print:hidden">
          <h1 className="text-lg font-bold text-[#0E3320] break-words">{institute.name}</h1>
          <p className="text-xs text-[#5C8261]">Public code: <span className="font-mono font-bold">{institute.code}</span></p>
        </div>

        <AffiliationCertIssueCard
          instituteId={institute.id}
          certNo={certNo}
          issuedAt={institute.affiliation_cert_issued_at ?? null}
          directorName={institute.contact_person ?? null}
          affiliatedSince={institute.affiliated_since ?? null}
          onChanged={(newCertNo, newIssuedAt, newDirector, newSince) =>
            setInstitute((prev) =>
              prev
                ? { ...prev, affiliation_cert_no: newCertNo, affiliation_cert_issued_at: newIssuedAt, contact_person: newDirector, affiliated_since: newSince }
                : prev
            )
          }
        />

        {certNo ? (
          <AffiliationCertificateLayout institution={institute} />
        ) : (
          <div className="bg-white border border-dashed border-[#DDD1BE] rounded-xl p-10 text-center text-sm text-[#5C8261] no-print print:hidden">
            प्रमाण-पत्र देखने और प्रिंट करने के लिए ऊपर संबद्धता क्रमांक डालें।
          </div>
        )}
      </div>
    </div>
  );
}
