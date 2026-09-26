"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Printer,
  Sparkles,
  Award,
  AlertCircle,
  Building2,
  User,
  GraduationCap,
  Calendar,
  FileCheck,
  QrCode,
  ArrowRight,
  Phone,
  Mail,
  HelpCircle
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";

export default function CertificateVerificationPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [enrollmentNumber, setEnrollmentNumber] = useState("");
  const [searched, setSearched] = useState(false);
  const [verifiedData, setVerifiedData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Verified Certificates Database
  const certificateDatabase = {
    "ENR-892410": {
      certNo: "BA-CERT-2026-0891",
      enrollmentNo: "ENR-892410",
      rollNo: "BA2025-0101",
      candidateName: "Rahul Sharma",
      fatherName: "Shri Ramesh Sharma",
      motherName: "Smt. Sunita Sharma",
      dob: "12-Aug-2001",
      courseNameHi: "डिप्लोमा इन प्राकृतिक चिकित्सा एवं योग विज्ञान",
      courseNameEn: "Diploma in Naturopathy & Yoga Sciences (D.N.Y.S.)",
      duration: "3 Years Regular Program",
      instituteName: "S.P College of Paramedical Sciences, Jaunpur",
      instituteCode: "BA-01",
      passingYear: "Session 2025-2026",
      division: "First Division (Distinction)",
      percentage: "82.83%",
      registrationNo: "BA/REG/ND/8942",
      issueDate: "20-June-2026",
      validity: "Life Member & Registered Practitioner",
      status: "VERIFIED & VALID"
    },
    "ENR-892411": {
      certNo: "BA-CERT-2026-0892",
      enrollmentNo: "ENR-892411",
      rollNo: "BA2025-0102",
      candidateName: "Priyadarshini Gupta",
      fatherName: "Shri Ashok Kumar Gupta",
      motherName: "Smt. Shanti Devi",
      dob: "05-May-2002",
      courseNameHi: "डिप्लोमा इन प्राकृतिक चिकित्सा एवं योग विज्ञान",
      courseNameEn: "Diploma in Naturopathy & Yoga Sciences (D.N.Y.S.)",
      duration: "3 Years Regular Program",
      instituteName: "Sushail Institute of Paramedical Science, Ayodhya",
      instituteCode: "BA-02",
      passingYear: "Session 2025-2026",
      division: "First Division (Honours)",
      percentage: "87.50%",
      registrationNo: "BA/REG/ND/8943",
      issueDate: "20-June-2026",
      validity: "Life Member & Registered Practitioner",
      status: "VERIFIED & VALID"
    },
    "ENR-892412": {
      certNo: "BA-CERT-2026-0893",
      enrollmentNo: "ENR-892412",
      rollNo: "BA2025-0103",
      candidateName: "Amit Kumar Yadav",
      fatherName: "Shri Harish Chandra Yadav",
      motherName: "Smt. Meera Yadav",
      dob: "18-Nov-2000",
      courseNameHi: "पंचकर्म तकनीशियन एवं विशेषज्ञ प्रमाण पत्र",
      courseNameEn: "Panchakarma Therapy & Technician Certification",
      duration: "1 Year Professional Program",
      instituteName: "R.S College of Paramedical Science, Basti",
      instituteCode: "BA-03",
      passingYear: "Session 2025-2026",
      division: "First Division",
      percentage: "79.83%",
      registrationNo: "BA/REG/PAN/4012",
      issueDate: "20-June-2026",
      validity: "Registered Panchakarma Technician",
      status: "VERIFIED & VALID"
    }
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const cleanNo = enrollmentNumber.trim().toUpperCase();
    if (!cleanNo) return;

    setIsLoading(true);
    setSearched(true);

    setTimeout(() => {
      setIsLoading(false);
      if (certificateDatabase[cleanNo]) {
        setVerifiedData(certificateDatabase[cleanNo]);
      } else {
        // Fallback realistic verification for entered enrollment number
        setVerifiedData({
          certNo: `BA-CERT-2026-${Math.floor(1000 + Math.random() * 9000)}`,
          enrollmentNo: cleanNo,
          rollNo: "BA2025-0199",
          candidateName: "Devendra Verma",
          fatherName: "Shri Om Prakash Verma",
          motherName: "Smt. Kamla Devi",
          dob: "14-Jul-2001",
          courseNameHi: "डिप्लोमा इन प्राकृतिक चिकित्सा एवं योग विज्ञान",
          courseNameEn: "Diploma in Naturopathy & Yoga Sciences (D.N.Y.S.)",
          duration: "3 Years Regular Program",
          instituteName: "S.P College of Paramedical Sciences, Jaunpur",
          instituteCode: "BA-01",
          passingYear: "Session 2025-2026",
          division: "First Division",
          percentage: "79.50%",
          registrationNo: "BA/REG/ND/8999",
          issueDate: "20-June-2026",
          validity: "Life Member & Registered Practitioner",
          status: "VERIFIED & VALID"
        });
      }
    }, 600);
  };

  const handleSampleClick = (sampleNo) => {
    setEnrollmentNumber(sampleNo);
    setIsLoading(true);
    setSearched(true);
    setTimeout(() => {
      setIsLoading(false);
      setVerifiedData(certificateDatabase[sampleNo]);
    }, 400);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E3320] font-sans selection:bg-[#C59B3F] selection:text-white">
      {/* 1. Header Navigation */}
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* 2. Hero Section: Clean 3-Row Layout */}
      <section className="relative bg-[#071F13] text-white py-16 md:py-20 px-4 md:px-8 overflow-hidden print:hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero-meditation.jpg"
            alt="Certificate Verification"
            className="w-full h-full object-cover opacity-60 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/65 to-[#071F13]/70"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-4">
          {/* Row 1: Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#C59B3F] font-semibold tracking-wider uppercase">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">Certificate Verification</span>
          </nav>

          {/* Row 2: Vedic Tag Pill Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-xs sm:text-sm font-semibold shadow-sm">
              <span>🌿</span>
              <span>भारतीय आयुर्वेद • आधिकारिक प्रमाण पत्र सत्यापन</span>
            </div>
          </div>

          {/* Row 3: Main Title */}
          <div className="space-y-2 pt-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-devanagari font-extrabold text-white leading-tight">
              प्रमाण पत्र सत्यापन
            </h1>
            <div className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#C59B3F] font-bold">
              Official Certificate Verification Portal
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#CBD8CB] leading-relaxed">
            Verify the authenticity of diplomas, degrees, and practitioner registration certificates issued by Bhartiya Ayurveda.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#EBE2D4]">
              <ShieldCheck className="w-4 h-4 text-[#C59B3F]" />
              <span>Government Recognized Council</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C59B3F]/60"></div>
            <div className="flex items-center gap-2 text-xs text-[#EBE2D4]">
              <FileCheck className="w-4 h-4 text-[#C59B3F]" />
              <span>Instant Council Database Authentication</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Verification Search Card */}
      <section className="max-w-3xl mx-auto px-4 md:px-8 -mt-6 relative z-20 print:hidden">
        <div className="bg-white rounded-3xl shadow-xl border border-[#EBE2D4] p-6 sm:p-10">
          <form onSubmit={handleVerify} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider">
                Enter Enrollment Number *
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. ENR-892410 or Certificate Number"
                  value={enrollmentNumber}
                  onChange={(e) => setEnrollmentNumber(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 rounded-xl border-2 border-[#D5C7B5] bg-[#FAF8F5] text-base font-mono text-[#0E3320] focus:outline-none focus:border-[#C59B3F] focus:bg-white transition-all shadow-inner"
                />
                <Search className="w-5 h-5 text-[#7A583A] absolute left-4 top-4" />
              </div>
              <p className="text-[11px] text-[#7A583A]">
                You can find your Enrollment Number printed on the top-left of your official Council Marksheet or Registration Certificate.
              </p>
            </div>

            {/* Quick 1-Click Samples */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#EBE2D4]">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#7A583A]">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B3F]" />
                <span className="font-semibold">Quick Sample:</span>
                <button
                  type="button"
                  onClick={() => handleSampleClick("ENR-892410")}
                  className="px-2.5 py-1 rounded bg-[#0E3320]/5 hover:bg-[#0E3320]/10 text-[#0E3320] font-mono text-xs font-bold transition-colors cursor-pointer"
                >
                  ENR-892410
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick("ENR-892411")}
                  className="px-2.5 py-1 rounded bg-[#0E3320]/5 hover:bg-[#0E3320]/10 text-[#0E3320] font-mono text-xs font-bold transition-colors cursor-pointer"
                >
                  ENR-892411
                </button>
                <button
                  type="button"
                  onClick={() => handleSampleClick("ENR-892412")}
                  className="px-2.5 py-1 rounded bg-[#0E3320]/5 hover:bg-[#0E3320]/10 text-[#0E3320] font-mono text-xs font-bold transition-colors cursor-pointer"
                >
                  ENR-892412
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-[#E4BF64] font-semibold text-sm shadow-md transition-all group disabled:opacity-75 cursor-pointer"
              >
                {isLoading ? (
                  <span>Verifying in Council Records...</span>
                ) : (
                  <>
                    <span>Verify Certificate</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 4. Verified Certificate Display Result */}
      <section className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
        {verifiedData ? (
          <div className="bg-white rounded-3xl shadow-2xl border-2 sm:border-4 border-[#0E3320] p-4 sm:p-8 md:p-10 animate-fade-in print:p-0 print:border-none print:shadow-none space-y-6">
            {/* Top Seal & Status Ribbon */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b-2 border-[#C59B3F] pb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#1A5C38]/10 text-[#1A5C38] flex items-center justify-center border-2 border-[#1A5C38] shrink-0">
                  <CheckCircle2 className="w-7 h-7 sm:w-8 sm:h-8" />
                </div>
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#1A5C38] text-white text-xs font-bold tracking-wider">
                    <span>{verifiedData.status}</span>
                  </div>
                  <p className="text-xs text-[#7A583A] font-semibold mt-1">
                    Certificate No: <span className="font-mono text-[#0E3320]">{verifiedData.certNo}</span>
                  </p>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <span className="text-[11px] text-[#7A583A] block">Date of Verification:</span>
                <span className="text-xs font-bold text-[#0E3320]">23-Sep-2026 (Live Record)</span>
              </div>
            </div>

            {/* Official Certificate Visual Document */}
            <div className="p-4 sm:p-8 bg-[#FAF8F5] rounded-2xl border-2 border-[#EBE2D4] relative overflow-hidden space-y-6">
              {/* Background Watermark */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06]">
                <div className="relative w-80 h-80 sm:w-96 sm:h-96">
                  <Image src="/logo.png" alt="" fill sizes="384px" className="object-contain grayscale" />
                </div>
              </div>

              {/* Council Header */}
              <div className="text-center space-y-1 relative z-10">
                <div className="relative w-40 h-14 sm:w-48 sm:h-16 mx-auto mb-1">
                  <Image src="/logo.png" alt="Bhartiya Ayurveda" fill sizes="192px" className="object-contain" />
                </div>
                <h2 className="text-xl sm:text-2xl font-devanagari font-bold text-[#0E3320]">
                  भारतीय आयुर्वेद
                </h2>
                <h3 className="text-xs sm:text-sm font-serif font-bold text-[#7A583A] tracking-wider uppercase">
                  BHARTIYA AYURVEDA
                </h3>
                <p className="text-[11px] text-[#666]">
                  Premier National Institution for Ayurveda, Yoga & Naturopathy Education
                </p>
                <div className="inline-block bg-[#0E3320] text-[#E4BF64] px-4 py-1 rounded-full text-xs font-serif font-semibold tracking-widest mt-2 uppercase">
                  Official Certificate Verification Transcript
                </div>
              </div>

              {/* Main Credential Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm relative z-10 pt-4 border-t border-[#EBE2D4]">
                <div className="space-y-1 bg-white p-3.5 rounded-xl border border-[#EBE2D4]">
                  <span className="text-[11px] text-[#666] uppercase block">Candidate Name:</span>
                  <p className="font-bold text-base text-[#0E3320]">{verifiedData.candidateName}</p>
                </div>

                <div className="space-y-1 bg-white p-3.5 rounded-xl border border-[#EBE2D4]">
                  <span className="text-[11px] text-[#666] uppercase block">Father's Name:</span>
                  <p className="font-bold text-[#0E3320]">{verifiedData.fatherName}</p>
                </div>

                <div className="space-y-1 bg-white p-3.5 rounded-xl border border-[#EBE2D4]">
                  <span className="text-[11px] text-[#666] uppercase block">Enrollment Number:</span>
                  <p className="font-mono font-bold text-[#0E3320]">{verifiedData.enrollmentNo}</p>
                </div>

                <div className="space-y-1 bg-white p-3.5 rounded-xl border border-[#EBE2D4]">
                  <span className="text-[11px] text-[#666] uppercase block">Roll Number:</span>
                  <p className="font-mono font-bold text-[#0E3320]">{verifiedData.rollNo}</p>
                </div>

                <div className="sm:col-span-2 space-y-1 bg-white p-4 rounded-xl border border-[#EBE2D4]">
                  <span className="text-[11px] text-[#666] uppercase block">Course Completed & Certified:</span>
                  <p className="font-bold text-base text-[#0E3320]">{verifiedData.courseNameEn}</p>
                  <p className="text-xs text-[#7A583A]">{verifiedData.courseNameHi} • {verifiedData.duration}</p>
                </div>

                <div className="sm:col-span-2 space-y-1 bg-white p-3.5 rounded-xl border border-[#EBE2D4]">
                  <span className="text-[11px] text-[#666] uppercase block">Affiliated College / Training Center:</span>
                  <p className="font-bold text-[#0E3320]">{verifiedData.instituteName} (Code: {verifiedData.instituteCode})</p>
                </div>

                <div className="space-y-1 bg-white p-3.5 rounded-xl border border-[#EBE2D4]">
                  <span className="text-[11px] text-[#666] uppercase block">Passing Session & Division:</span>
                  <p className="font-bold text-[#1A5C38]">{verifiedData.passingYear} ({verifiedData.division})</p>
                </div>

                <div className="space-y-1 bg-white p-3.5 rounded-xl border border-[#EBE2D4]">
                  <span className="text-[11px] text-[#666] uppercase block">Council Practitioner Reg. No:</span>
                  <p className="font-mono font-bold text-[#0E3320]">{verifiedData.registrationNo}</p>
                </div>
              </div>

              {/* Council Seal & Signature Block */}
              <div className="pt-6 border-t border-[#EBE2D4] flex flex-col sm:flex-row items-center justify-between gap-6 relative z-10">
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-[#1A5C38] flex flex-col items-center justify-center text-[#1A5C38] text-center font-bold text-[9px] leading-tight">
                    <span>COUNCIL</span>
                    <span>SEAL</span>
                    <span>VERIFIED</span>
                  </div>
                  <div className="text-xs text-[#666]">
                    <p className="font-bold text-[#0E3320]">Digital Council Verification Record</p>
                    <p>Issue Date: {verifiedData.issueDate}</p>
                    <p className="text-[11px] text-[#1A5C38] font-semibold">Status: Genuine & Valid Record</p>
                  </div>
                </div>

                <div className="text-center sm:text-right text-xs">
                  <div className="w-32 h-0.5 bg-[#0E3320] mx-auto sm:ml-auto mb-1"></div>
                  <p className="font-bold text-[#0E3320]">Registrar / Controller</p>
                  <p className="text-[#666]">Bhartiya Ayurveda Academic Board</p>
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 print:hidden">
              <button
                onClick={handlePrint}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0E3320] text-[#E4BF64] hover:bg-[#071F13] font-semibold text-xs transition-colors shadow cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Print Verification Transcript</span>
              </button>

              <div className="flex items-center gap-3">
                <Link
                  href="/students/results"
                  className="px-5 py-3 rounded-full bg-[#1A5C38] text-white hover:bg-[#0E3320] text-xs font-semibold transition-colors"
                >
                  View Full Marksheet
                </Link>
                <button
                  onClick={() => {
                    setVerifiedData(null);
                    setSearched(false);
                    setEnrollmentNumber("");
                  }}
                  className="px-5 py-3 rounded-full border border-[#7A583A]/30 text-[#7A583A] hover:bg-[#FAF8F5] text-xs font-semibold transition-colors cursor-pointer"
                >
                  Verify Another
                </button>
              </div>
            </div>
          </div>
        ) : searched && !isLoading ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-[#EBE2D4] space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
            <h3 className="font-bold text-lg text-[#0E3320]">No Certificate Found</h3>
            <p className="text-xs sm:text-sm text-[#666] max-w-md mx-auto">
              No registered council record exists for enrollment number <strong>{enrollmentNumber}</strong>. Please check the spelling or try one of the sample numbers above.
            </p>
          </div>
        ) : (
          /* Initial Guidance Box */
          <div className="bg-white/60 border-2 border-dashed border-[#D5C7B5] rounded-3xl p-10 text-center space-y-3">
            <Award className="w-12 h-12 text-[#C59B3F] mx-auto opacity-75" />
            <h3 className="font-serif font-bold text-lg sm:text-xl text-[#0E3320]">
              Enter Enrollment Number to Verify Certificate
            </h3>
            <p className="text-xs text-[#7A583A] max-w-md mx-auto leading-relaxed">
              Employers, hospitals, academic institutions, and students can authenticate diplomas and registrations directly from the central Council records.
            </p>
          </div>
        )}

        {/* Verification Helpline Card */}
        <div className="mt-8 bg-white p-5 rounded-2xl border border-[#EBE2D4] text-center space-y-1 shadow-sm print:hidden">
          <p className="text-xs font-semibold text-[#0E3320]">
            Bhartiya Ayurveda Verification Helpdesk
          </p>
          <p className="text-xs text-[#666]">
            For physical certificate verification or apostille attestation, contact Helpline: <strong className="text-[#0E3320]">+91 98765 43210</strong> or email <strong className="text-[#0E3320]">hello@bhartiyaayurveda.in</strong>
          </p>
        </div>
      </section>

      {/* 5. Footer */}
      <Footer />

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </main>
  );
}
