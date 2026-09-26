"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Award,
  Search,
  Printer,
  CheckCircle2,
  Calendar,
  Building2,
  User,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  AlertCircle
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";

export default function StudentResultsPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [rollNo, setRollNo] = useState("");
  const [course, setCourse] = useState("D.N.Y.S. (Diploma in Naturopathy & Yoga)");
  const [examSession, setExamSession] = useState("Annual Examination 2025-26");
  const [resultData, setResultData] = useState(null);
  const [searched, setSearched] = useState(false);

  // Mock Database for Council Results
  const studentResultsDatabase = {
    "BA2025-0101": {
      name: "Rahul Sharma",
      fatherName: "Shri Ramesh Sharma",
      motherName: "Smt. Sunita Sharma",
      rollNo: "BA2025-0101",
      enrolmentNo: "ENR-892410",
      institute: "S.P College of Paramedical Sciences, Jaunpur",
      instituteCode: "BA-01",
      course: "Diploma in Naturopathy & Yoga Sciences (D.N.Y.S.) - 2nd Year",
      session: "Annual Examination 2025-26",
      subjects: [
        { code: "DNYS-201", name: "Sharir Rachna & Kriya Vigyan (Anatomy & Physiology)", thMax: 80, thMin: 32, thObt: 64, prMax: 20, prMin: 8, prObt: 18, totalMax: 100, totalObt: 82 },
        { code: "DNYS-202", name: "Prakritik Chikitsa Siddhant (Philosophy of Naturopathy)", thMax: 80, thMin: 32, thObt: 68, prMax: 20, prMin: 8, prObt: 17, totalMax: 100, totalObt: 85 },
        { code: "DNYS-203", name: "Swasthavritta & Yoga Vigyan (Yoga Therapy & Hygiene)", thMax: 80, thMin: 32, thObt: 62, prMax: 20, prMin: 8, prObt: 19, totalMax: 100, totalObt: 81 },
        { code: "DNYS-204", name: "Dravyaguna, Herbology & Dietary Science", thMax: 80, thMin: 32, thObt: 59, prMax: 20, prMin: 8, prObt: 18, totalMax: 100, totalObt: 77 },
        { code: "DNYS-205", name: "Hydrotherapy, Mud Therapy & Massage Techniques", thMax: 80, thMin: 32, thObt: 65, prMax: 20, prMin: 8, prObt: 19, totalMax: 100, totalObt: 84 },
        { code: "DNYS-206", name: "Hospital Clinical Practice & Viva Voce", thMax: 40, thMin: 16, thObt: 34, prMax: 60, prMin: 24, prObt: 54, totalMax: 100, totalObt: 88 },
      ],
      grandTotalMax: 600,
      grandTotalObt: 497,
      percentage: "82.83%",
      division: "FIRST DIVISION (WITH DISTINCTION)",
      status: "PASSED",
    },
    "BA2025-0102": {
      name: "Priyadarshini Gupta",
      fatherName: "Shri Ashok Kumar Gupta",
      motherName: "Smt. Shanti Devi",
      rollNo: "BA2025-0102",
      enrolmentNo: "ENR-892411",
      institute: "Sushail Institute of Paramedical Science, Ayodhya",
      instituteCode: "BA-02",
      course: "Diploma in Naturopathy & Yoga Sciences (D.N.Y.S.) - 2nd Year",
      session: "Annual Examination 2025-26",
      subjects: [
        { code: "DNYS-201", name: "Sharir Rachna & Kriya Vigyan (Anatomy & Physiology)", thMax: 80, thMin: 32, thObt: 70, prMax: 20, prMin: 8, prObt: 19, totalMax: 100, totalObt: 89 },
        { code: "DNYS-202", name: "Prakritik Chikitsa Siddhant (Philosophy of Naturopathy)", thMax: 80, thMin: 32, thObt: 72, prMax: 20, prMin: 8, prObt: 18, totalMax: 100, totalObt: 90 },
        { code: "DNYS-203", name: "Swasthavritta & Yoga Vigyan (Yoga Therapy & Hygiene)", thMax: 80, thMin: 32, thObt: 66, prMax: 20, prMin: 8, prObt: 19, totalMax: 100, totalObt: 85 },
        { code: "DNYS-204", name: "Dravyaguna, Herbology & Dietary Science", thMax: 80, thMin: 32, thObt: 64, prMax: 20, prMin: 8, prObt: 18, totalMax: 100, totalObt: 82 },
        { code: "DNYS-205", name: "Hydrotherapy, Mud Therapy & Massage Techniques", thMax: 80, thMin: 32, thObt: 68, prMax: 20, prMin: 8, prObt: 19, totalMax: 100, totalObt: 87 },
        { code: "DNYS-206", name: "Hospital Clinical Practice & Viva Voce", thMax: 40, thMin: 16, thObt: 36, prMax: 60, prMin: 24, prObt: 56, totalMax: 100, totalObt: 92 },
      ],
      grandTotalMax: 600,
      grandTotalObt: 525,
      percentage: "87.50%",
      division: "FIRST DIVISION (WITH HONOURS)",
      status: "PASSED",
    },
    "BA2025-0103": {
      name: "Amit Kumar Yadav",
      fatherName: "Shri Harish Chandra Yadav",
      motherName: "Smt. Meera Yadav",
      rollNo: "BA2025-0103",
      enrolmentNo: "ENR-892412",
      institute: "R.S College of Paramedical Science, Basti",
      instituteCode: "BA-03",
      course: "Diploma in Naturopathy & Yoga Sciences (D.N.Y.S.) - 1st Year",
      session: "Annual Examination 2025-26",
      subjects: [
        { code: "DNYS-101", name: "Fundamentals of Ayurveda & Dosha Vigyan", thMax: 80, thMin: 32, thObt: 61, prMax: 20, prMin: 8, prObt: 17, totalMax: 100, totalObt: 78 },
        { code: "DNYS-102", name: "Principles of Yoga Asanas & Pranayama", thMax: 80, thMin: 32, thObt: 67, prMax: 20, prMin: 8, prObt: 18, totalMax: 100, totalObt: 85 },
        { code: "DNYS-103", name: "Five Elements (Panchamahabhuta) Therapy", thMax: 80, thMin: 32, thObt: 60, prMax: 20, prMin: 8, prObt: 17, totalMax: 100, totalObt: 77 },
        { code: "DNYS-104", name: "Human Anatomy & Cell Biology", thMax: 80, thMin: 32, thObt: 58, prMax: 20, prMin: 8, prObt: 16, totalMax: 100, totalObt: 74 },
        { code: "DNYS-105", name: "Hygiene, Fasting & Nutrition", thMax: 80, thMin: 32, thObt: 63, prMax: 20, prMin: 8, prObt: 18, totalMax: 100, totalObt: 81 },
        { code: "DNYS-106", name: "Practical Shatkarma & Clinical Demo", thMax: 40, thMin: 16, thObt: 33, prMax: 60, prMin: 24, prObt: 51, totalMax: 100, totalObt: 84 },
      ],
      grandTotalMax: 600,
      grandTotalObt: 479,
      percentage: "79.83%",
      division: "FIRST DIVISION",
      status: "PASSED",
    },
  };

  const handleSearch = (e) => {
    e.preventDefault();
    const cleanRoll = rollNo.trim().toUpperCase();
    setSearched(true);

    if (studentResultsDatabase[cleanRoll]) {
      setResultData(studentResultsDatabase[cleanRoll]);
    } else {
      // Dynamic fallback for any entered roll number
      setResultData({
        name: "Devendra Verma",
        fatherName: "Shri Om Prakash Verma",
        motherName: "Smt. Kamla Devi",
        rollNo: cleanRoll || "BA2025-0104",
        enrolmentNo: "ENR-892499",
        institute: "S.P College of Paramedical Sciences, Jaunpur",
        instituteCode: "BA-01",
        course: course,
        session: examSession,
        subjects: [
          { code: "DNYS-201", name: "Sharir Rachna & Kriya Vigyan (Anatomy)", thMax: 80, thMin: 32, thObt: 60, prMax: 20, prMin: 8, prObt: 17, totalMax: 100, totalObt: 77 },
          { code: "DNYS-202", name: "Prakritik Chikitsa Siddhant", thMax: 80, thMin: 32, thObt: 65, prMax: 20, prMin: 8, prObt: 18, totalMax: 100, totalObt: 83 },
          { code: "DNYS-203", name: "Swasthavritta & Yoga Therapy", thMax: 80, thMin: 32, thObt: 62, prMax: 20, prMin: 8, prObt: 18, totalMax: 100, totalObt: 80 },
          { code: "DNYS-204", name: "Dravyaguna & Herbology", thMax: 80, thMin: 32, thObt: 58, prMax: 20, prMin: 8, prObt: 16, totalMax: 100, totalObt: 74 },
          { code: "DNYS-205", name: "Hydrotherapy & Massage Techniques", thMax: 80, thMin: 32, thObt: 63, prMax: 20, prMin: 8, prObt: 18, totalMax: 100, totalObt: 81 },
          { code: "DNYS-206", name: "Hospital Practice & Clinical Viva", thMax: 40, thMin: 16, thObt: 32, prMax: 60, prMin: 24, prObt: 50, totalMax: 100, totalObt: 82 },
        ],
        grandTotalMax: 600,
        grandTotalObt: 477,
        percentage: "79.50%",
        division: "FIRST DIVISION",
        status: "PASSED",
      });
    }
  };

  const handleFillSample = (sampleRoll) => {
    setRollNo(sampleRoll);
    setSearched(true);
    setResultData(studentResultsDatabase[sampleRoll]);
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
            alt="Examination Results"
            className="w-full h-full object-cover opacity-60 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/65 to-[#071F13]/70"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          {/* Row 1: Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#C59B3F] font-semibold tracking-wider uppercase">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C671D]">/</span>
            <span className="text-[#C59B3F]">Students</span>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">Results</span>
          </nav>

          {/* Row 2: Vedic Tag Pill Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-xs sm:text-sm font-semibold shadow-sm">
              <span>🌿</span>
              <span>भारतीय आयुर्वेद • वार्षिक एवं सत्रीय परीक्षा परिणाम</span>
            </div>
          </div>

          {/* Row 3: Main Title */}
          <div className="space-y-2 pt-1">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-devanagari font-extrabold text-white leading-tight">
              परीक्षा परिणाम एवं अंकतालिका
            </h1>
            <div className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#C59B3F] font-bold">
              Annual & Semester Examination Results
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#CBD8CB] leading-relaxed">
            Enter your Roll Number to instantly search, view, and print your verified Bhartiya Ayurveda Marksheet.
          </p>
        </div>
      </section>

      {/* 3. Search Bar Form */}
      <section className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 -mt-6 relative z-20 print:hidden">
        <div className="bg-white rounded-2xl shadow-xl border border-[#EBE2D4] p-4 sm:p-8">
          <form onSubmit={handleSearch} className="space-y-4 sm:space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
              <div>
                <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-2">
                  Select Course *
                </label>
                <select
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                >
                  <option value="D.N.Y.S. (Diploma in Naturopathy & Yoga)">D.N.Y.S. (Diploma in Naturopathy & Yoga)</option>
                  <option value="N.D. (Doctor of Naturopathy)">N.D. (Doctor of Naturopathy)</option>
                  <option value="C.Y.A. (Certificate in Yoga & Ayurveda)">C.Y.A. (Certificate in Yoga & Ayurveda)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-2">
                  Exam Session *
                </label>
                <select
                  value={examSession}
                  onChange={(e) => setExamSession(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                >
                  <option value="Annual Examination 2025-26">Annual Examination 2025-26</option>
                  <option value="Semester Examination Dec 2025">Semester Examination Dec 2025</option>
                  <option value="Annual Examination 2024-25">Annual Examination 2024-25</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-2">
                  Roll Number *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    placeholder="e.g. BA2025-0101"
                    value={rollNo}
                    onChange={(e) => setRollNo(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                  <Search className="w-4 h-4 text-[#7A583A] absolute left-3.5 top-3.5" />
                </div>
              </div>
            </div>

            {/* Quick Sample Roll Numbers */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-[#EBE2D4]">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs text-[#7A583A]">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B3F] shrink-0" />
                <span className="font-semibold">Quick Sample Results:</span>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleFillSample("BA2025-0101")}
                    className="px-2.5 py-1 rounded bg-[#0E3320]/5 hover:bg-[#0E3320]/10 text-[#0E3320] font-mono text-xs font-bold transition-colors"
                  >
                    BA2025-0101
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillSample("BA2025-0102")}
                    className="px-2.5 py-1 rounded bg-[#0E3320]/5 hover:bg-[#0E3320]/10 text-[#0E3320] font-mono text-xs font-bold transition-colors"
                  >
                    BA2025-0102
                  </button>
                  <button
                    type="button"
                    onClick={() => handleFillSample("BA2025-0103")}
                    className="px-2.5 py-1 rounded bg-[#0E3320]/5 hover:bg-[#0E3320]/10 text-[#0E3320] font-mono text-xs font-bold transition-colors"
                  >
                    BA2025-0103
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-[#E4BF64] font-semibold text-sm shadow-md transition-all group"
              >
                <span>Search Result</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* 4. Result Marksheet Display */}
      <section className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16 print:py-0 print:px-3">
        {resultData ? (
          <div className="relative isolate bg-white rounded-2xl sm:rounded-3xl shadow-xl sm:shadow-2xl border-2 sm:border-4 border-[#0E3320] overflow-hidden p-3.5 sm:p-8 md:p-10 animate-fade-in print:p-2 print:border-none print:shadow-none print:rounded-none print:break-inside-avoid">
            {/* Background Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] z-0">
              <div className="relative w-72 h-72 sm:w-96 sm:h-96">
                <Image src="/logo.png" alt="" fill sizes="384px" className="object-contain grayscale" />
              </div>
            </div>

            <div className="relative z-10">
            {/* Marksheet Official Header */}
            <div className="border-b-2 sm:border-b-4 border-[#C59B3F] pb-4 sm:pb-6 text-center space-y-1.5 sm:space-y-2 print:pb-2 print:space-y-0.5">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="relative w-40 h-14 sm:w-48 sm:h-16">
                  <Image src="/logo.png" alt="Bhartiya Ayurveda" fill sizes="192px" className="object-contain" priority />
                </div>
              </div>
              <h2 className="text-lg sm:text-2xl lg:text-3xl font-devanagari font-bold text-[#0E3320] tracking-wide">
                भारतीय आयुर्वेद
              </h2>
              <p className="text-xs sm:text-base font-serif font-bold text-[#7A583A] tracking-wider uppercase">
                BHARTIYA AYURVEDA
              </p>
              <p className="text-[11px] sm:text-xs text-[#666]">
                Premier Institution for Authentic Ayurveda, Yoga & Naturopathy Education
              </p>
              <div className="inline-block bg-[#0E3320] text-[#E4BF64] px-4 sm:px-5 py-1 rounded-full text-[10px] sm:text-xs font-semibold tracking-wider uppercase mt-1">
                Statement of Marks • {resultData.session}
              </div>
            </div>

            {/* Candidate Credentials Grid */}
            <div className="py-4 sm:py-6 border-b border-[#EBE2D4] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-xs sm:text-sm print:py-2 print:gap-1.5">
              <div className="space-y-0.5 sm:space-y-1">
                <span className="text-[#666]">Candidate's Name:</span>
                <p className="font-bold text-[#0E3320] text-sm sm:text-base">{resultData.name}</p>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <span className="text-[#666]">Father's Name:</span>
                <p className="font-bold text-[#0E3320]">{resultData.fatherName}</p>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <span className="text-[#666]">Mother's Name:</span>
                <p className="font-bold text-[#0E3320]">{resultData.motherName}</p>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <span className="text-[#666]">Roll Number:</span>
                <p className="font-mono font-bold text-[#0E3320]">{resultData.rollNo}</p>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <span className="text-[#666]">Enrolment Number:</span>
                <p className="font-mono font-bold text-[#0E3320]">{resultData.enrolmentNo}</p>
              </div>
              <div className="space-y-0.5 sm:space-y-1">
                <span className="text-[#666]">Course:</span>
                <p className="font-bold text-[#0E3320]">{resultData.course}</p>
              </div>
              <div className="sm:col-span-2 lg:col-span-3 space-y-0.5 sm:space-y-1 bg-[#FAF8F5] p-2.5 sm:p-3 rounded-lg border border-[#EBE2D4]">
                <span className="text-[#666]">Affiliated Institute / Examination Center:</span>
                <p className="font-bold text-[#0E3320]">{resultData.institute} (Center Code: {resultData.instituteCode})</p>
              </div>
            </div>

            {/* Subject-Wise Marks Table */}
            <div className="py-4 sm:py-6 overflow-x-auto print:py-2 print:overflow-visible">
              <table className="w-full min-w-[620px] print:min-w-0 text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0E3320] text-white">
                    <th className="p-2.5 sm:p-3 print:p-1.5 border border-[#0E3320]">Code</th>
                    <th className="p-2.5 sm:p-3 print:p-1.5 border border-[#0E3320]">Subject Name</th>
                    <th className="p-2.5 sm:p-3 print:p-1.5 border border-[#0E3320] text-center">Theory (Max/Min)</th>
                    <th className="p-2.5 sm:p-3 print:p-1.5 border border-[#0E3320] text-center">Th. Obt.</th>
                    <th className="p-2.5 sm:p-3 print:p-1.5 border border-[#0E3320] text-center">Practical (Max/Min)</th>
                    <th className="p-2.5 sm:p-3 print:p-1.5 border border-[#0E3320] text-center">Pr. Obt.</th>
                    <th className="p-2.5 sm:p-3 print:p-1.5 border border-[#0E3320] text-center">Total (100)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EBE2D4]">
                  {resultData.subjects.map((sub, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#FAF8F5]"}>
                      <td className="p-2 sm:p-3 print:p-1.5 font-mono font-bold text-[#0E3320] border border-[#EBE2D4]">{sub.code}</td>
                      <td className="p-2 sm:p-3 print:p-1.5 text-[#0E3320] font-medium border border-[#EBE2D4]">{sub.name}</td>
                      <td className="p-2 sm:p-3 print:p-1.5 text-center text-[#666] border border-[#EBE2D4]">{sub.thMax} / {sub.thMin}</td>
                      <td className="p-2 sm:p-3 print:p-1.5 text-center font-bold text-[#0E3320] border border-[#EBE2D4]">{sub.thObt}</td>
                      <td className="p-2 sm:p-3 print:p-1.5 text-center text-[#666] border border-[#EBE2D4]">{sub.prMax} / {sub.prMin}</td>
                      <td className="p-2 sm:p-3 print:p-1.5 text-center font-bold text-[#0E3320] border border-[#EBE2D4]">{sub.prObt}</td>
                      <td className="p-2 sm:p-3 print:p-1.5 text-center font-bold text-[#1A5C38] border border-[#EBE2D4]">{sub.totalObt}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-[#FAF8F5] font-bold text-[#0E3320] border-t-2 border-[#0E3320]">
                    <td colSpan={6} className="p-2.5 sm:p-3 print:p-1.5 text-right uppercase tracking-wider text-[11px] sm:text-xs">Grand Total (Maximum Marks: {resultData.grandTotalMax})</td>
                    <td className="p-2.5 sm:p-3 print:p-1.5 text-center text-sm sm:text-base text-[#1A5C38] bg-[#1A5C38]/10 border border-[#1A5C38]/20">{resultData.grandTotalObt}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Performance Summary Callout */}
            <div className="bg-[#FAF8F5] p-3.5 sm:p-5 print:p-2 rounded-xl border border-[#EBE2D4] grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 print:gap-1.5 text-center">
              <div>
                <span className="text-[11px] sm:text-xs text-[#666] uppercase">Overall Percentage</span>
                <p className="text-lg sm:text-2xl font-bold text-[#0E3320] mt-0.5 sm:mt-1">{resultData.percentage}</p>
              </div>
              <div>
                <span className="text-[11px] sm:text-xs text-[#666] uppercase">Division Awarded</span>
                <p className="text-sm sm:text-lg font-bold text-[#8C671D] mt-0.5 sm:mt-1">{resultData.division}</p>
              </div>
              <div>
                <span className="text-[11px] sm:text-xs text-[#666] uppercase">Final Result</span>
                <p className="text-lg sm:text-2xl font-bold text-[#1A5C38] mt-0.5 sm:mt-1 flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>{resultData.status}</span>
                </p>
              </div>
            </div>

            {/* Seal & Verification */}
            <div className="pt-6 sm:pt-8 print:pt-2 border-t border-[#EBE2D4] mt-4 sm:mt-6 print:mt-2 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 print:gap-2 text-xs text-[#666]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-dashed border-[#1A5C38] flex items-center justify-center text-[#1A5C38] font-bold text-center leading-none text-[9px] sm:text-[10px] shrink-0">
                  COUNCIL<br />SEAL
                </div>
                <div>
                  <p className="font-bold text-[#0E3320]">Digitally Verified Marksheet</p>
                  <p className="text-[11px] sm:text-xs">System Generated • Valid for verification</p>
                </div>
              </div>

              <div className="text-center sm:text-right">
                <div className="w-28 sm:w-32 h-0.5 bg-[#0E3320] mx-auto sm:ml-auto mb-1"></div>
                <p className="font-bold text-[#0E3320]">Controller of Examinations</p>
                <p>Bhartiya Ayurveda</p>
              </div>
            </div>

            {/* Action Bar */}
            <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-[#EBE2D4] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 print:hidden">
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0E3320] text-[#E4BF64] hover:bg-[#071F13] font-semibold text-sm transition-colors shadow text-center"
              >
                <Printer className="w-4 h-4" />
                <span>Print Official Marksheet</span>
              </button>

              <div className="flex flex-col xs:flex-row items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
                <Link
                  href="/students/login"
                  className="w-full sm:w-auto text-center px-5 py-2.5 sm:py-3 rounded-full bg-[#1A5C38] text-white hover:bg-[#0E3320] text-xs sm:text-sm font-semibold transition-colors"
                >
                  Student Dashboard Login
                </Link>
                <button
                  onClick={() => {
                    setResultData(null);
                    setSearched(false);
                    setRollNo("");
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 sm:py-3 rounded-full border border-[#7A583A]/30 text-[#7A583A] hover:bg-[#FAF8F5] text-xs sm:text-sm font-semibold transition-colors text-center"
                >
                  Search Another Result
                </button>
              </div>
            </div>
            </div>
          </div>
        ) : searched ? (
          <div className="bg-white rounded-2xl p-10 text-center border border-[#EBE2D4] space-y-3">
            <AlertCircle className="w-10 h-10 text-amber-600 mx-auto" />
            <h3 className="font-bold text-lg text-[#0E3320]">No Result Record Found</h3>
            <p className="text-sm text-[#666]">
              Please double check the entered Roll Number or try one of the sample roll numbers above.
            </p>
          </div>
        ) : (
          <div className="bg-white/60 border-2 border-dashed border-[#D5C7B5] rounded-2xl p-12 text-center space-y-3">
            <GraduationCap className="w-12 h-12 text-[#C59B3F] mx-auto opacity-75" />
            <h3 className="font-serif font-bold text-xl text-[#0E3320]">
              Enter Your Roll Number Above to View Marksheet
            </h3>
            <p className="text-xs sm:text-sm text-[#7A583A] max-w-md mx-auto">
              Council results for the Annual 2025-26 Session are officially published. Select your roll number or use quick sample buttons.
            </p>
          </div>
        )}
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
