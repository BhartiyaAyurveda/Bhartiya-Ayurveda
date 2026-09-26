"use client";

import { useState } from "react";
import Link from "next/link";
import {
  GraduationCap,
  User,
  Phone,
  CheckCircle2,
  Printer,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  Eye,
  EyeOff,
  Upload,
  Check,
  ClipboardList,
  Lock,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";

const initialFormData = {
  enrollmentNo: "",
  candidateName: "",
  fatherName: "",
  motherName: "",
  dob: "",
  gender: "Male",
  category: "General",
  aadharNo: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  state: "Uttar Pradesh",
  pincode: "",
  course: "D.N.Y.S. (Diploma in Naturopathy & Yoga Sciences) - 3 Years",
  institute: "S.P College of Paramedical Sciences, Jaunpur",
  session: "2026-2027",
  yearSem: "1st Year",
  password: "",
  confirmPassword: "",
  agreeTerms: true,
  tenthMarksheetFile: null,
  twelfthMarksheetFile: null,
};

const steps = [
  { id: 1, label: "Academic" },
  { id: 2, label: "Personal" },
  { id: 3, label: "Contact" },
  { id: 4, label: "Documents" },
  { id: 5, label: "Review" },
];

const requiredFieldsByStep = {
  1: ["course", "institute"],
  2: ["candidateName", "fatherName", "motherName", "dob", "aadharNo"],
  3: ["phone", "email", "address", "city", "pincode"],
  4: ["password", "confirmPassword", "tenthMarksheetFile", "twelfthMarksheetFile"],
  5: [],
};

export default function StudentRegistrationPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState("");

  const [formData, setFormData] = useState(initialFormData);

  const institutesList = [
    "S.P College of Paramedical Sciences, Jaunpur",
    "Sushail Institute of Paramedical Science, Ayodhya",
    "R.S College of Paramedical Science, Basti",
    "Gyan Prabhat Institute of Paramedical Science, Jaunpur",
    "MHD Paramedical College, Gorakhpur",
    "G.S. Paramedical Institute, Gorakhpur",
    "Annpurna Paramedical College, Jaunpur",
    "Swami Vivekanand Paramadical College, Ghazipur",
    "Mahadev Paramedical College, Chandauli",
    "B.S. Paramedical College, Jaunpur",
    "M.B. Paramedical College, Mau",
    "Siddhartha Paramedical College, Mau",
    "Vatsalya Institute of Paramedical Sciences, Prayagraj",
    "Asha Deep Paramedical College, Varanasi",
  ];

  const coursesList = [
    "D.N.Y.S. (Diploma in Naturopathy & Yoga Sciences) - 3 Years",
    "N.D. (Doctor of Naturopathy) - 2 Years",
    "C.Y.A. (Certificate in Yoga & Ayurveda) - 1 Year",
    "D.A.M.S. (AM) - Alternative Medicine Diploma",
    "Panchakarma Technician Certification - 1 Year",
    "Ayurvedic Herbology & Dietetics - 6 Months",
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const updateField = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const goNext = () => {
    const required = requiredFieldsByStep[currentStep] || [];
    const missing = required.filter((k) => !formData[k]);
    if (missing.length > 0) {
      setStepError("Please fill all required fields (marked *) before proceeding.");
      return;
    }
    if (currentStep === 4 && formData.password !== formData.confirmPassword) {
      setStepError("Passwords do not match! Please check your password fields.");
      return;
    }
    setStepError("");
    setCurrentStep((s) => Math.min(s + 1, steps.length));
    window.scrollTo({ top: 220, behavior: "smooth" });
  };

  const goBack = () => {
    setStepError("");
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 220, behavior: "smooth" });
  };

  const goToStep = (id) => {
    if (id < currentStep) {
      setStepError("");
      setCurrentStep(id);
      window.scrollTo({ top: 220, behavior: "smooth" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      setStepError("Passwords do not match! Please check your password fields.");
      return;
    }
    if (!formData.agreeTerms) {
      setStepError("Please agree to the declaration before submitting.");
      return;
    }
    const generatedId = "STU-" + Math.floor(100000 + Math.random() * 900000);
    setStudentId(generatedId);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setStepError("");
    setFormData(initialFormData);
  };

  const handlePrint = () => {
    window.print();
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]";
  const labelClass = "block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-2";

  const FileUploadField = ({ label, fieldKey }) => {
    const file = formData[fieldKey];
    return (
      <div>
        <label className={labelClass}>{label} *</label>
        <div className="relative">
          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={(e) => updateField(fieldKey, e.target.files[0] || null)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            aria-label={label}
          />
          <div
            className={`w-full px-4 py-3 rounded-xl border flex items-center gap-2.5 text-sm transition-colors ${
              file
                ? "border-[#2A7A50] bg-[#EAF5ED]"
                : "border-dashed border-[#D5C7B5] bg-[#FAF8F5]"
            }`}
          >
            <Upload className={`w-4 h-4 shrink-0 ${file ? "text-[#2A7A50]" : "text-[#8C671D]"}`} />
            <span className={`truncate ${file ? "text-[#2A7A50] font-semibold" : "text-[#7A8C7D]"}`}>
              {file ? file.name : "Tap to upload (PDF/JPG/PNG, max 2MB)"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E3320] font-sans selection:bg-[#C59B3F] selection:text-white">
      {/* 1. Header Navigation */}
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* 2. Hero Section: Clean 3-Row Layout */}
      <section className="relative bg-[#071F13] text-white py-12 sm:py-16 md:py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero-meditation.jpg"
            alt="Student Portal Background"
            className="w-full h-full object-cover opacity-60 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/65 to-[#071F13]/70"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          {/* Row 1: Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-[11px] sm:text-sm text-[#C59B3F] font-semibold tracking-wider uppercase flex-wrap">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C671D]">/</span>
            <span className="text-[#C59B3F]">Students</span>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">Registration</span>
          </nav>

          {/* Row 2: Vedic Tag Pill Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-[11px] sm:text-sm font-semibold shadow-sm text-center">
              <span>🌿</span>
              <span>भारतीय आयुर्वेद • छात्र पंजीकरण सत्र 2026-27</span>
            </div>
          </div>

          {/* Row 3: Main Title */}
          <div className="space-y-1.5 sm:space-y-2 pt-1">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl lg:text-5xl font-devanagari font-extrabold text-white leading-tight">
              छात्र पंजीकरण पोर्टल
            </h1>
            <div className="font-sans text-lg xs:text-xl sm:text-2xl lg:text-3xl text-[#C59B3F] font-bold">
              Student Registration & Academic Enrolment
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-xs sm:text-base text-[#CBD8CB] leading-relaxed">
            Create your official Bhartiya Ayurveda student profile to access exam schedules, download hall tickets, view semester results, and obtain digital marksheets.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4 pt-2">
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#EBE2D4]">
              <ShieldCheck className="w-4 h-4 text-[#C59B3F]" />
              <span>Government Recognized Council</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C59B3F]/60"></div>
            <div className="flex items-center gap-2 text-[11px] sm:text-xs text-[#EBE2D4]">
              <Sparkles className="w-4 h-4 text-[#C59B3F]" />
              <span>Instant Digital Student ID</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Main Form or Success Slip Container */}
      <section className="max-w-5xl mx-auto px-3 sm:px-6 md:px-8 py-8 sm:py-12 md:py-16">
        {isSubmitted ? (
          /* SUCCESS SLIP / RECEIPT */
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border-2 border-[#C59B3F]/50 overflow-hidden p-4 sm:p-8 md:p-10 animate-fade-in print:p-0 print:border-none">
            {/* Slip Header */}
            <div className="border-b-2 border-[#0E3320]/20 pb-5 sm:pb-6 text-center space-y-1.5 sm:space-y-2">
              <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-[#1A5C38]/10 text-[#1A5C38] mb-1 sm:mb-2">
                <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
              </div>
              <h2 className="text-lg sm:text-2xl md:text-3xl font-devanagari font-bold text-[#0E3320]">
                छात्र पंजीकरण पावती • Registration Receipt
              </h2>
              <p className="text-xs sm:text-sm text-[#7A583A] font-medium">
                भारतीय आयुर्वेद (Bhartiya Ayurveda)
              </p>
              <div className="inline-block bg-[#0E3320] text-[#E4BF64] px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-widest mt-2">
                STUDENT ID: {studentId}
              </div>
            </div>

            {/* Slip Body Grid */}
            <div className="py-6 sm:py-8 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 text-xs sm:text-sm">
              <div className="space-y-2.5 sm:space-y-3 bg-[#FAF8F5] p-4 sm:p-5 rounded-xl border border-[#EBE2D4]">
                <h3 className="font-bold text-[#0E3320] border-b border-[#EBE2D4] pb-2 flex items-center gap-2">
                  <User className="w-4 h-4 text-[#C59B3F]" />
                  <span>Personal Details</span>
                </h3>
                <p><span className="text-[#666]">Student Name:</span> <strong className="text-[#0E3320]">{formData.candidateName}</strong></p>
                <p><span className="text-[#666]">Father's Name:</span> <strong className="text-[#0E3320]">{formData.fatherName}</strong></p>
                <p><span className="text-[#666]">Mother's Name:</span> <strong className="text-[#0E3320]">{formData.motherName}</strong></p>
                <p><span className="text-[#666]">Date of Birth:</span> <strong className="text-[#0E3320]">{formData.dob}</strong></p>
                <p><span className="text-[#666]">Gender / Category:</span> <strong className="text-[#0E3320]">{formData.gender} ({formData.category})</strong></p>
                <p><span className="text-[#666]">Aadhar Number:</span> <strong className="text-[#0E3320]">{formData.aadharNo || "Verified"}</strong></p>
              </div>

              <div className="space-y-2.5 sm:space-y-3 bg-[#FAF8F5] p-4 sm:p-5 rounded-xl border border-[#EBE2D4]">
                <h3 className="font-bold text-[#0E3320] border-b border-[#EBE2D4] pb-2 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-[#C59B3F]" />
                  <span>Academic & Institute Information</span>
                </h3>
                <p><span className="text-[#666]">Course:</span> <strong className="text-[#0E3320]">{formData.course}</strong></p>
                <p><span className="text-[#666]">Session / Year:</span> <strong className="text-[#0E3320]">{formData.session} ({formData.yearSem})</strong></p>
                <p><span className="text-[#666]">Affiliated Institute:</span> <strong className="text-[#0E3320]">{formData.institute}</strong></p>
                <p><span className="text-[#666]">Mobile:</span> <strong className="text-[#0E3320]">{formData.phone}</strong></p>
                <p><span className="text-[#666]">Email ID:</span> <strong className="text-[#0E3320]">{formData.email}</strong></p>
                <p><span className="text-[#666]">Address:</span> <strong className="text-[#0E3320]">{formData.city}, {formData.state} - {formData.pincode}</strong></p>
                <p><span className="text-[#666]">10th Marksheet:</span> <strong className="text-[#2A7A50]">{formData.tenthMarksheetFile?.name || "—"}</strong></p>
                <p><span className="text-[#666]">12th Marksheet:</span> <strong className="text-[#2A7A50]">{formData.twelfthMarksheetFile?.name || "—"}</strong></p>
              </div>
            </div>

            {/* Note & Action buttons */}
            <div className="bg-[#1A5C38]/10 border border-[#1A5C38]/30 rounded-xl p-3.5 sm:p-4 text-xs text-[#0E3320] space-y-1 mb-5 sm:mb-6">
              <p className="font-bold">Important Instructions:</p>
              <p>1. Keep your Student ID <strong>({studentId})</strong> and Password safe for logging into the student portal.</p>
              <p>2. Please verify your identity at your affiliated institute with this slip and your original Aadhar card.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4 pt-4 border-t border-[#EBE2D4] print:hidden">
              <button
                onClick={handlePrint}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#0E3320] text-[#E4BF64] hover:bg-[#071F13] font-semibold text-sm transition-colors shadow"
              >
                <Printer className="w-4 h-4" />
                <span>Print Registration Slip</span>
              </button>

              <div className="flex flex-col xs:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
                <Link
                  href="/students/login"
                  className="w-full sm:w-auto text-center inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#1A5C38] text-white hover:bg-[#0E3320] font-semibold text-sm transition-colors shadow"
                >
                  <span>Go to Student Login</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <button
                  onClick={resetForm}
                  className="w-full sm:w-auto px-5 py-3 rounded-full border border-[#7A583A]/30 text-[#7A583A] hover:bg-[#FAF8F5] text-sm font-semibold transition-colors text-center"
                >
                  New Registration
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* REGISTRATION FORM */
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl border border-[#EBE2D4] overflow-hidden">
            {/* Form Top Banner */}
            <div className="bg-[#0E3320] text-white p-4 sm:p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C59B3F] font-bold">Official Council Enrolment</span>
                <h2 className="text-lg sm:text-2xl font-serif font-bold text-white mt-1">
                  New Student Registration Form
                </h2>
                <p className="text-xs text-[#CBD8CB] mt-1">
                  Please provide accurate academic & personal information as per your matriculation certificate.
                </p>
              </div>
              <Link
                href="/students/login"
                className="text-xs sm:text-sm font-semibold text-[#E4BF64] hover:text-white underline inline-flex items-center gap-1 shrink-0"
              >
                <span>Already registered? Student Login</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Step Indicator */}
            <div className="px-4 sm:px-8 md:px-10 pt-6">
              {/* Mobile compact indicator */}
              <div className="sm:hidden space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#0E3320]">
                  <span>Step {currentStep} of {steps.length}</span>
                  <span className="text-[#8C671D]">{steps[currentStep - 1].label}</span>
                </div>
                <div className="h-1.5 w-full bg-[#EAE2D3] rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#0E3320] transition-all duration-300"
                    style={{ width: `${(currentStep / steps.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Desktop full stepper */}
              <div className="hidden sm:flex items-center justify-between">
                {steps.map((step, idx) => (
                  <div key={step.id} className="flex items-center flex-1 last:flex-none">
                    <button
                      type="button"
                      onClick={() => goToStep(step.id)}
                      className="flex flex-col items-center gap-1.5 cursor-pointer disabled:cursor-default"
                      disabled={step.id >= currentStep}
                    >
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
                          currentStep === step.id
                            ? "bg-[#0E3320] text-white border-[#0E3320]"
                            : currentStep > step.id
                            ? "bg-[#EAF5ED] text-[#2A7A50] border-[#2A7A50]"
                            : "bg-white text-[#A8B8A8] border-[#D5C7B7]"
                        }`}
                      >
                        {currentStep > step.id ? <Check className="w-4 h-4" /> : step.id}
                      </div>
                      <span
                        className={`text-[11px] font-semibold whitespace-nowrap ${
                          currentStep === step.id ? "text-[#0E3320]" : "text-[#8C9E90]"
                        }`}
                      >
                        {step.label}
                      </span>
                    </button>
                    {idx < steps.length - 1 && (
                      <div
                        className={`flex-1 h-0.5 mx-2 mb-5 ${
                          currentStep > step.id ? "bg-[#2A7A50]" : "bg-[#E4DAC9]"
                        }`}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* The Form */}
            <form onSubmit={handleSubmit} className="p-4 sm:p-8 md:p-10 space-y-6 sm:space-y-8">
              {stepError && (
                <div className="px-4 py-2.5 rounded-xl bg-[#FCEAE7] border border-[#E8B4A8] text-[#9A3B2A] text-xs sm:text-sm font-semibold">
                  {stepError}
                </div>
              )}

              {/* STEP 1: Academic & Institute Enrollment */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#EBE2D4] pb-3">
                    <div className="w-8 h-8 rounded-full bg-[#0E3320]/10 text-[#0E3320] flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#0E3320]">
                      Academic & Institute Selection
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Course Enrolled In *</label>
                      <select
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      >
                        {coursesList.map((course, idx) => (
                          <option key={idx} value={course}>{course}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Affiliated Institute / College *</label>
                      <select
                        name="institute"
                        value={formData.institute}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      >
                        {institutesList.map((inst, idx) => (
                          <option key={idx} value={inst}>{inst}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Academic Session</label>
                      <input
                        type="text"
                        name="session"
                        value={formData.session}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Year / Semester *</label>
                      <select
                        name="yearSem"
                        value={formData.yearSem}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="Semester 1">Semester 1</option>
                        <option value="Semester 2">Semester 2</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Personal Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#EBE2D4] pb-3">
                    <div className="w-8 h-8 rounded-full bg-[#0E3320]/10 text-[#0E3320] flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#0E3320]">
                      Personal Information
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="md:col-span-1">
                      <label className={labelClass}>Candidate Full Name *</label>
                      <input
                        type="text"
                        name="candidateName"
                        placeholder="e.g. Ramesh Kumar Verma"
                        value={formData.candidateName}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Father's Name *</label>
                      <input
                        type="text"
                        name="fatherName"
                        placeholder="e.g. Shri Suresh Kumar"
                        value={formData.fatherName}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Mother's Name *</label>
                      <input
                        type="text"
                        name="motherName"
                        placeholder="e.g. Smt. Radha Devi"
                        value={formData.motherName}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Date of Birth *</label>
                      <input
                        type="date"
                        name="dob"
                        value={formData.dob}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Gender *</label>
                      <select
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label className={labelClass}>Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={inputClass}
                      >
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="EWS">EWS</option>
                      </select>
                    </div>

                    <div className="md:col-span-3">
                      <label className={labelClass}>Aadhar Card Number (12 Digits) *</label>
                      <input
                        type="text"
                        name="aadharNo"
                        maxLength={12}
                        placeholder="XXXX-XXXX-XXXX"
                        value={formData.aadharNo}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Contact & Address */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#EBE2D4] pb-3">
                    <div className="w-8 h-8 rounded-full bg-[#0E3320]/10 text-[#0E3320] flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#0E3320]">
                      Contact & Address
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Mobile Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        placeholder="student@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={labelClass}>Complete Permanent Address *</label>
                      <textarea
                        name="address"
                        rows={2}
                        placeholder="House No, Village/Colony, Post Office, Tehsil"
                        value={formData.address}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>City / District *</label>
                      <input
                        type="text"
                        name="city"
                        placeholder="e.g. Varanasi / Jaunpur"
                        value={formData.city}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>State</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </div>

                    <div>
                      <label className={labelClass}>Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        maxLength={6}
                        placeholder="e.g. 222001"
                        value={formData.pincode}
                        onChange={handleChange}
                        required
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Documents & Password */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#EBE2D4] pb-3">
                      <div className="w-8 h-8 rounded-full bg-[#0E3320]/10 text-[#0E3320] flex items-center justify-center font-bold text-sm">
                        4
                      </div>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#0E3320] flex items-center gap-2">
                        <Upload className="w-4 h-4 text-[#C59B3F]" />
                        <span>Document Upload</span>
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FileUploadField label="10th Marksheet (हाई स्कूल अंकपत्र)" fieldKey="tenthMarksheetFile" />
                      <FileUploadField label="12th Marksheet (इंटरमीडिएट अंकपत्र)" fieldKey="twelfthMarksheetFile" />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 border-b border-[#EBE2D4] pb-3">
                      <div className="w-8 h-8 rounded-full bg-[#0E3320]/10 text-[#0E3320] flex items-center justify-center font-bold text-sm">
                        <Lock className="w-3.5 h-3.5" />
                      </div>
                      <h3 className="text-base sm:text-lg font-serif font-bold text-[#0E3320]">
                        Create Student Portal Password
                      </h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <label className={labelClass}>Password *</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Create strong password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className={inputClass}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3.5 top-3.5 text-[#7A583A] hover:text-[#0E3320]"
                          >
                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className={labelClass}>Confirm Password *</label>
                        <input
                          type={showPassword ? "text" : "password"}
                          name="confirmPassword"
                          placeholder="Repeat your password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 border-b border-[#EBE2D4] pb-3">
                    <div className="w-8 h-8 rounded-full bg-[#0E3320]/10 text-[#0E3320] flex items-center justify-center font-bold text-sm">
                      <ClipboardList className="w-4 h-4" />
                    </div>
                    <h3 className="text-base sm:text-lg font-serif font-bold text-[#0E3320]">
                      Review & Confirm
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    {[
                      ["Course", formData.course],
                      ["Institute", formData.institute],
                      ["Session / Year", `${formData.session} (${formData.yearSem})`],
                      ["Candidate Name", formData.candidateName],
                      ["Father's Name", formData.fatherName],
                      ["Date of Birth", formData.dob],
                      ["Gender / Category", `${formData.gender} / ${formData.category}`],
                      ["Mobile", formData.phone],
                      ["Email", formData.email],
                      ["City / State", `${formData.city}, ${formData.state}`],
                      ["Pincode", formData.pincode],
                      ["10th Marksheet", formData.tenthMarksheetFile?.name || "Not uploaded"],
                      ["12th Marksheet", formData.twelfthMarksheetFile?.name || "Not uploaded"],
                    ].map(([label, value]) => (
                      <div key={label} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE2D3]">
                        <span className="block text-[10px] sm:text-[11px] text-[#8C9E90] uppercase font-bold tracking-wide">{label}</span>
                        <span className="block font-semibold text-[#0E3320] mt-0.5 break-words">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Declaration */}
                  <div className="pt-2">
                    <label className="flex items-start gap-3 cursor-pointer text-xs sm:text-sm text-[#0E3320]">
                      <input
                        type="checkbox"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 accent-[#0E3320] rounded shrink-0"
                      />
                      <span>
                        I hereby declare that all details and documents provided above are true and genuine according to my official academic records. I agree to abide by the rules and regulations of Bhartiya Ayurveda.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* Step Navigation */}
              <div className="pt-4 border-t border-[#EBE2D4] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={goBack}
                    className="w-full sm:w-auto px-6 py-3 rounded-full bg-white text-[#0E3320] border border-[#D5C7B7] text-sm font-semibold hover:border-[#0E3320] transition-colors flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>
                ) : (
                  <span />
                )}

                {currentStep < steps.length ? (
                  <button
                    type="button"
                    onClick={goNext}
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-sm sm:text-base font-semibold shadow-md transition-all flex items-center justify-center gap-2 group"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4 text-[#E4BF64] group-hover:translate-x-1 transition-transform" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white font-semibold text-sm sm:text-base shadow-lg transition-all duration-200 group"
                  >
                    <span>Complete Student Registration</span>
                    <ArrowRight className="w-5 h-5 text-[#E4BF64] group-hover:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>

              {currentStep === steps.length && (
                <p className="text-xs text-[#7A583A] text-center sm:text-right">
                  Having trouble? Contact Student Support: <br />
                  <span className="font-semibold text-[#0E3320]">+91 98765 43210 • hello@bhartiyaayurveda.in</span>
                </p>
              )}
            </form>
          </div>
        )}
      </section>

      {/* 4. Footer */}
      <Footer />

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </main>
  );
}
