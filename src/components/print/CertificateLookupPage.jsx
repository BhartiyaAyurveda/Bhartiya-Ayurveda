"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, Printer, Search } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import RegistrationCertificateLayout from "@/components/print/RegistrationCertificateLayout";
import NocLayout from "@/components/print/NocLayout";
import DobSelect from "@/components/ui/DobSelect";

const KINDS = {
  registration: {
    api: "/api/public/registration-certificate",
    key: "certificate",
    titleHi: "पंजीयन प्रमाण-पत्र",
    titleEn: "Registration Certificate",
    subtitle: "अपना पंजीयन प्रमाण-पत्र डाउनलोड करें",
    submit: "मेरा प्रमाण-पत्र खोजें",
    loading: "प्रमाण-पत्र खोजा जा रहा है...",
    another: "दूसरा प्रमाण-पत्र खोजें",
    render: (data) => <RegistrationCertificateLayout certificate={data} />,
  },
  noc: {
    api: "/api/public/noc",
    key: "noc",
    titleHi: "अनापत्ति प्रमाण-पत्र",
    titleEn: "No Objection Certificate (NOC)",
    subtitle: "अपना अनापत्ति प्रमाण-पत्र (NOC) डाउनलोड करें",
    submit: "मेरा NOC खोजें",
    loading: "NOC खोजा जा रहा है...",
    another: "दूसरा NOC खोजें",
    render: (data) => <NocLayout noc={data} />,
  },
};

export default function CertificateLookupPage({ kind }) {
  const cfg = KINDS[kind];
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [dob, setDob] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [doc, setDoc] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const enrollment = enrollmentNo.trim();
    if (!enrollment || !dob) {
      setError("कृपया नामांकन क्रमांक और जन्म तिथि दोनों दर्ज करें। (Enter both Enrollment Number and Date of Birth.)");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(cfg.api, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollment_no: enrollment, date_of_birth: dob }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error || "Certificate could not be found. Please check your details.");
        return;
      }
      if (data[cfg.key]) setDoc(data[cfg.key]);
      else setError("Unexpected response received. Please try again.");
    } catch {
      setError("Network connection issue. Please check your internet and try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setDoc(null);
    setError(null);
    setEnrollmentNo("");
    setDob("");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5]">
      <div className="no-print print:hidden">
        <Navbar />
      </div>

      <main className="flex-1 flex flex-col justify-center py-8 sm:py-12 px-4 sm:px-6 lg:px-8 print:p-0 print:m-0 print:bg-white print:justify-start">
        {doc ? (
          <div className="w-full max-w-[794px] mx-auto">
            <div className="no-print print:hidden mb-4 grid grid-cols-2 gap-2.5 sm:flex sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={reset}
                className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-white hover:bg-[#F2EDE4] text-[#0E3320] border border-[#DDD1BE] text-sm font-bold font-devanagari transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4 shrink-0" />
                <span className="sm:hidden">दूसरा खोजें</span>
                <span className="hidden sm:inline">{cfg.another}</span>
              </button>
              <button
                type="button"
                onClick={() => window.print()}
                className="inline-flex items-center justify-center gap-2 h-11 px-4 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-[#E4BF64] text-sm font-bold font-devanagari shadow-md transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 shrink-0" />
                <span className="sm:hidden">प्रिंट / PDF</span>
                <span className="hidden sm:inline">प्रिंट / PDF डाउनलोड करें</span>
              </button>
            </div>

            {cfg.render(doc)}
          </div>
        ) : (
          <div className="w-full max-w-md mx-auto no-print">
            <div className="bg-white rounded-2xl border border-[#DDD1BE] shadow-sm overflow-hidden">
              <div className="bg-[#0E3320] text-white px-6 py-6 border-b-4 border-[#C59B3F] text-center">
                <h1 className="text-2xl font-extrabold text-[#E4BF64] font-devanagari leading-snug">{cfg.titleHi}</h1>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#F1E4C3] mt-0.5">{cfg.titleEn}</p>
                <p className="text-xs text-slate-200 mt-2 font-devanagari">{cfg.subtitle}</p>
              </div>

              <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-5">
                {error && (
                  <div role="alert" className="p-3.5 bg-red-50 border-l-4 border-red-500 rounded-r text-xs text-red-800 font-medium flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <span className="leading-snug">{error}</span>
                  </div>
                )}

                <div>
                  <label htmlFor="enrollment_no" className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-1.5 font-devanagari">
                    नामांकन क्रमांक / Enrollment No. <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-[#7A583A] absolute left-3.5 top-3.5" />
                    <input
                      id="enrollment_no"
                      type="text"
                      required
                      maxLength={40}
                      value={enrollmentNo}
                      onChange={(e) => setEnrollmentNo(e.target.value)}
                      placeholder="e.g. BAI04181901"
                      autoComplete="off"
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm font-medium text-[#0E3320] uppercase placeholder:normal-case focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="dob_day" className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-1.5 font-devanagari">
                    जन्म तिथि / Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <DobSelect idPrefix="dob" value={dob} onChange={setDob} required />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 px-4 bg-[#0E3320] hover:bg-[#15482D] text-[#E4BF64] text-sm font-bold rounded-xl shadow-md transition-all disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer font-devanagari"
                >
                  {loading ? cfg.loading : cfg.submit}
                </button>
              </form>

              <div className="bg-[#FAF8F5] px-6 py-4 border-t border-[#EBE2D4] text-center text-xs text-[#5C8261] font-devanagari leading-relaxed">
                यह प्रमाण-पत्र तभी उपलब्ध होगा जब परिषद् द्वारा आपका पंजीयन क्रमांक जारी कर दिया गया हो। समस्या होने पर अपने संबद्ध महाविद्यालय से संपर्क करें।
              </div>
            </div>

            <div className="mt-4 text-center">
              <Link href="/" className="text-xs text-[#5C8261] hover:text-[#0E3320] font-medium transition-colors">
                मुख्य पृष्ठ पर जाएँ / Back to Home
              </Link>
            </div>
          </div>
        )}
      </main>

      <div className="no-print print:hidden">
        <Footer />
      </div>
    </div>
  );
}
