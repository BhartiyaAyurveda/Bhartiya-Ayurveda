"use client";

import { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Send,
  CheckCircle2,
  Upload,
  User,
  Phone,
  Building2,
  GraduationCap,
  Printer,
  ArrowRight,
  ArrowLeft,
  Check,
  ClipboardList,
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";

const initialFormData = {
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
  course: "D.N.Y.S. (Diploma in Naturopathy & Yoga)",
  institute: "S.P College of Paramedical Sciences, Jaunpur",
  highSchoolBoard: "",
  highSchoolYear: "",
  highSchoolPercent: "",
  interBoard: "",
  interYear: "",
  interPercent: "",
  tenthMarksheetFile: null,
  twelfthMarksheetFile: null,
};

const steps = [
  { id: 1, label: "Personal", hi: "व्यक्तिगत" },
  { id: 2, label: "Contact", hi: "संपर्क" },
  { id: 3, label: "Course", hi: "पाठ्यक्रम" },
  { id: 4, label: "Academic & Docs", hi: "शैक्षणिक" },
  { id: 5, label: "Review", hi: "समीक्षा" },
];

const requiredFieldsByStep = {
  1: ["candidateName", "fatherName", "motherName", "dob", "aadharNo"],
  2: ["phone", "email", "city", "address", "pincode"],
  3: ["course", "institute"],
  4: [
    "highSchoolBoard",
    "highSchoolYear",
    "highSchoolPercent",
    "interBoard",
    "interYear",
    "interPercent",
    "tenthMarksheetFile",
    "twelfthMarksheetFile",
  ],
  5: [],
};

export default function AdmissionRegistrationFormPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [applicationNo, setApplicationNo] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [stepError, setStepError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const [formData, setFormData] = useState(initialFormData);

  const institutesList = [
    "S.P College of Paramedical Sciences, Jaunpur",
    "Sushail Institute of Paramedical Science, Ayodhya",
    "R.S College of Paramedical Science, Basti",
    "Gyan Prabhat Institute of Paramedical Science, Jaunpur",
    "MHD Paramedical College, Gorakhpur",
    "Sreenidhi Marabashettar Medical Institute, Hubli",
    "Aarvi Paramedical Institute, Bhadohi",
    "S.S. Nursing and Paramedical College, Gorakhpur",
    "Anjana Nursing Home & Paramedical College, Ambedkar Nagar",
    "Ram Avatar Memorial Paramedical College, Deoria",
    "Maa Saraswati Paramedical College, Jaunpur",
    "J.P. Institute of Paramedical Science, Jaunpur",
    "Institute of Naturopathy and Yogic Sciences, Lucknow",
    "Ayurveda and Yoga Training Center, New Delhi",
  ];

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
    if (!termsAccepted) {
      setStepError("Please confirm the declaration before submitting.");
      return;
    }
    const randomAppNo = "BA-ADM-" + Math.floor(100000 + Math.random() * 900000);
    setApplicationNo(randomAppNo);
    setIsSubmitted(true);
    window.scrollTo({ top: 300, behavior: "smooth" });
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    setTermsAccepted(false);
    setStepError("");
    setFormData(initialFormData);
  };

  const inputClass =
    "w-full px-4 py-2.5 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0E3320] text-sm text-[#0E3320]";
  const labelClass = "block text-xs sm:text-sm font-bold text-[#0E3320]";

  const FileUploadField = ({ label, fieldKey }) => {
    const file = formData[fieldKey];
    return (
      <div className="space-y-1.5">
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
                : "border-dashed border-[#D5C7B7] bg-[#FAF8F5]"
            }`}
          >
            <Upload className={`w-4 h-4 shrink-0 ${file ? "text-[#2A7A50]" : "text-[#8C671D]"}`} />
            <span
              className={`truncate ${
                file ? "text-[#2A7A50] font-semibold" : "text-[#7A8C7D]"
              }`}
            >
              {file ? file.name : "Tap to upload (PDF/JPG/PNG, max 2MB)"}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E3320] font-sans selection:bg-[#C59B3F] selection:text-white">
      {/* 1. Top Bar & Navbar */}
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* 2. Hero Section */}
      <section className="relative bg-[#071F13] text-white py-14 sm:py-20 md:py-24 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero-meditation.jpg"
            alt="Admissions Banner"
            className="w-full h-full object-cover opacity-60 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/65 to-[#071F13]/70"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-4 sm:space-y-5">
          {/* Breadcrumb Row */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-[11px] sm:text-sm text-[#C59B3F] font-semibold tracking-wider uppercase flex-wrap">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">Admissions</span>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">Registration Form</span>
          </nav>

          {/* Vedic Tag Pill Row */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-[11px] sm:text-sm font-semibold shadow-sm text-center">
              <span>🌿</span>
              <span>शैक्षणिक सत्र 2026-27 • ऑनलाइन प्रवेश पंजीकरण फॉर्म</span>
            </div>
          </div>

          {/* Main Title Row */}
          <div className="space-y-1.5 sm:space-y-2 pt-1">
            <h1 className="text-3xl xs:text-4xl sm:text-5xl lg:text-6xl font-devanagari font-extrabold text-white leading-tight">
              प्रवेश पंजीकरण फॉर्म
            </h1>
            <div className="font-sans text-xl xs:text-2xl sm:text-3xl lg:text-4xl text-[#C59B3F] font-bold">
              Admission Registration Form
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-lg text-[#CBD8CB] leading-relaxed pt-1">
            Fill in the online admission form for diploma and certification programs across all recognized affiliated institutes.
          </p>
        </div>
      </section>

      {/* 3. Main Form Section */}
      <section className="py-10 sm:py-16 md:py-20 px-3.5 sm:px-4 md:px-8 border-b border-[#EBE2D4]">
        <div className="max-w-5xl mx-auto">

          {isSubmitted ? (
            <div className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-12 border-2 border-[#A5D4B2] shadow-xl text-center space-y-6">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-[#EAF5ED] text-[#2A7A50] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 sm:w-12 sm:h-12 stroke-[2.2]" />
              </div>

              <div className="space-y-2">
                <span className="px-3 py-1 rounded-full bg-[#EAF5ED] text-[#2A7A50] text-xs font-bold uppercase tracking-wider">
                  Registration Successful
                </span>
                <h2 className="text-xl sm:text-4xl font-devanagari font-bold text-[#0E3320]">
                  आपका प्रवेश पंजीकरण सफलतापूर्वक प्राप्त हो गया है!
                </h2>
                <p className="text-sm sm:text-base text-[#466551]">
                  Your application has been registered with Bhartiya Ayurveda.
                </p>
              </div>

              {/* Application Summary Card */}
              <div className="max-w-xl mx-auto p-4 sm:p-6 rounded-2xl bg-[#FAF8F5] border border-[#E4DAC9] text-left space-y-3 font-sans text-xs sm:text-sm">
                <div className="flex justify-between items-center border-b border-[#EAE2D3] pb-3">
                  <span className="text-[11px] sm:text-xs text-[#52725D] font-bold uppercase">Application Number</span>
                  <span className="text-base sm:text-lg font-black text-[#0E3320]">{applicationNo}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                  <span className="text-[#52725D] shrink-0">Candidate Name:</span>
                  <span className="font-bold text-[#0E3320] text-right">{formData.candidateName}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                  <span className="text-[#52725D] shrink-0">Course Selected:</span>
                  <span className="font-bold text-[#0E3320] text-right">{formData.course}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                  <span className="text-[#52725D] shrink-0">Allotted Institute:</span>
                  <span className="font-bold text-[#0E3320] text-right">{formData.institute}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                  <span className="text-[#52725D] shrink-0">Mobile Contact:</span>
                  <span className="font-bold text-[#0E3320] text-right">{formData.phone}</span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                  <span className="text-[#52725D] shrink-0">10th Marksheet:</span>
                  <span className="font-bold text-[#2A7A50] text-right truncate max-w-[60%]">
                    {formData.tenthMarksheetFile?.name || "—"}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs sm:text-sm gap-2">
                  <span className="text-[#52725D] shrink-0">12th Marksheet:</span>
                  <span className="font-bold text-[#2A7A50] text-right truncate max-w-[60%]">
                    {formData.twelfthMarksheetFile?.name || "—"}
                  </span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4 pt-2">
                <button
                  onClick={() => window.print()}
                  className="px-6 py-3 rounded-full bg-[#0E3320] text-white text-sm font-semibold flex items-center justify-center gap-2 hover:bg-[#071F13] transition-colors"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print Acknowledgement Slip</span>
                </button>
                <button
                  onClick={resetForm}
                  className="px-6 py-3 rounded-full bg-white text-[#0E3320] border border-[#D5C7B7] text-sm font-semibold hover:border-[#0E3320] transition-colors"
                >
                  New Registration
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 md:p-12 border border-[#E4D9C7] shadow-lg space-y-6 sm:space-y-8">

              {/* Form Header */}
              <div className="border-b border-[#EAE2D3] pb-5 sm:pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-[#EAE2D3] text-[#0E3320] flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 sm:w-6 sm:h-6 stroke-[1.75]" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-3xl font-devanagari font-bold text-[#0E3320]">
                      छात्र प्रवेश आवेदन पत्र
                    </h2>
                    <p className="text-[11px] sm:text-sm text-[#52725D] mt-0.5">
                      Please enter accurate personal, contact, and educational information.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step Indicator */}
              <div>
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

              {stepError && (
                <div className="px-4 py-2.5 rounded-xl bg-[#FCEAE7] border border-[#E8B4A8] text-[#9A3B2A] text-xs sm:text-sm font-semibold">
                  {stepError}
                </div>
              )}

              {/* STEP 1: Personal Details */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <h3 className="text-base sm:text-xl font-devanagari font-bold text-[#0E3320] flex items-center gap-2 pb-2 border-b border-[#F2ECE1]">
                    <User className="w-5 h-5 text-[#C59B3F]" />
                    <span>1. व्यक्तिगत विवरण (Personal Details)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Candidate Full Name (पूरा नाम) *</label>
                      <input
                        type="text"
                        required
                        value={formData.candidateName}
                        onChange={(e) => updateField("candidateName", e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Father's Name (पिता का नाम) *</label>
                      <input
                        type="text"
                        required
                        value={formData.fatherName}
                        onChange={(e) => updateField("fatherName", e.target.value)}
                        placeholder="e.g. Shri Suresh Sharma"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Mother's Name (माता का नाम) *</label>
                      <input
                        type="text"
                        required
                        value={formData.motherName}
                        onChange={(e) => updateField("motherName", e.target.value)}
                        placeholder="e.g. Smt. Sunita Sharma"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Date of Birth (जन्म तिथि) *</label>
                      <input
                        type="date"
                        required
                        value={formData.dob}
                        onChange={(e) => updateField("dob", e.target.value)}
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Gender (लिंग) *</label>
                      <select
                        value={formData.gender}
                        onChange={(e) => updateField("gender", e.target.value)}
                        className={inputClass}
                      >
                        <option value="Male">Male (पुरुष)</option>
                        <option value="Female">Female (महिला)</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Category (श्रेणी) *</label>
                      <select
                        value={formData.category}
                        onChange={(e) => updateField("category", e.target.value)}
                        className={inputClass}
                      >
                        <option value="General">General</option>
                        <option value="OBC">OBC</option>
                        <option value="SC">SC</option>
                        <option value="ST">ST</option>
                        <option value="EWS">EWS</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 sm:col-span-2 lg:col-span-1">
                      <label className={labelClass}>Aadhar Card Number (आधार नंबर) *</label>
                      <input
                        type="text"
                        required
                        maxLength={12}
                        value={formData.aadharNo}
                        onChange={(e) => updateField("aadharNo", e.target.value)}
                        placeholder="12 Digit Aadhar Number"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 2: Contact Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <h3 className="text-base sm:text-xl font-devanagari font-bold text-[#0E3320] flex items-center gap-2 pb-2 border-b border-[#F2ECE1]">
                    <Phone className="w-5 h-5 text-[#C59B3F]" />
                    <span>2. संपर्क विवरण (Contact Details)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Mobile / WhatsApp Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => updateField("phone", e.target.value)}
                        placeholder="+91 98765 43210"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Email Address *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => updateField("email", e.target.value)}
                        placeholder="student@example.com"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>City / District (शहर / जिला) *</label>
                      <input
                        type="text"
                        required
                        value={formData.city}
                        onChange={(e) => updateField("city", e.target.value)}
                        placeholder="e.g. Jaunpur"
                        className={inputClass}
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1.5">
                      <label className={labelClass}>Full Permanent Address (स्थायी पता) *</label>
                      <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        placeholder="House No, Village/Colony, Post Office"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>State (राज्य) *</label>
                      <input
                        type="text"
                        required
                        value={formData.state}
                        onChange={(e) => updateField("state", e.target.value)}
                        placeholder="e.g. Uttar Pradesh"
                        className={inputClass}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Pincode *</label>
                      <input
                        type="text"
                        required
                        value={formData.pincode}
                        onChange={(e) => updateField("pincode", e.target.value)}
                        placeholder="e.g. 222001"
                        className={inputClass}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 3: Course & Institute Choice */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <h3 className="text-base sm:text-xl font-devanagari font-bold text-[#0E3320] flex items-center gap-2 pb-2 border-b border-[#F2ECE1]">
                    <GraduationCap className="w-5 h-5 text-[#C59B3F]" />
                    <span>3. पाठ्यक्रम एवं संस्थान चयन (Course & Institute)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className={labelClass}>Course Applying For (इच्छित पाठ्यक्रम) *</label>
                      <select
                        value={formData.course}
                        onChange={(e) => updateField("course", e.target.value)}
                        className={inputClass}
                      >
                        <option value="D.N.Y.S. (Diploma in Naturopathy & Yoga)">D.N.Y.S. (Diploma in Naturopathy & Yogic Sciences - 3 Years)</option>
                        <option value="Certified Yoga Therapist">Certified Yoga Therapist Program (1 Year)</option>
                        <option value="Panchakarma & Ayurvedic Massage Therapy">Panchakarma & Ayurvedic Massage Therapy (1 Year)</option>
                        <option value="Acupressure & Marma Therapy Expert">Acupressure & Marma Therapy Expert (6 Months)</option>
                        <option value="D.I.M.S. (Indigenous Medical Systems)">D.I.M.S. (Diploma in Indigenous Medical Systems - 2 Years)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className={labelClass}>Preferred Affiliated Institute (संबद्ध संस्थान) *</label>
                      <select
                        value={formData.institute}
                        onChange={(e) => updateField("institute", e.target.value)}
                        className={inputClass}
                      >
                        {institutesList.map((inst, i) => (
                          <option key={i} value={inst}>{inst}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Academic Background & Documents */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-xl font-devanagari font-bold text-[#0E3320] flex items-center gap-2 pb-2 border-b border-[#F2ECE1]">
                      <Building2 className="w-5 h-5 text-[#C59B3F]" />
                      <span>4. शैक्षणिक योग्यता (Educational Background)</span>
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <label className={labelClass}>10th (High School) Board *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. UP Board / CBSE"
                          value={formData.highSchoolBoard}
                          onChange={(e) => updateField("highSchoolBoard", e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className={labelClass}>Passing Year *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 2021"
                          value={formData.highSchoolYear}
                          onChange={(e) => updateField("highSchoolYear", e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className={labelClass}>Percentage / Grade *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 78%"
                          value={formData.highSchoolPercent}
                          onChange={(e) => updateField("highSchoolPercent", e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className={labelClass}>12th (Intermediate) Board *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. UP Board / CBSE"
                          value={formData.interBoard}
                          onChange={(e) => updateField("interBoard", e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className={labelClass}>Passing Year *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 2023"
                          value={formData.interYear}
                          onChange={(e) => updateField("interYear", e.target.value)}
                          className={inputClass}
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className={labelClass}>Percentage / Grade *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. 82%"
                          value={formData.interPercent}
                          onChange={(e) => updateField("interPercent", e.target.value)}
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-base sm:text-xl font-devanagari font-bold text-[#0E3320] flex items-center gap-2 pb-2 border-b border-[#F2ECE1]">
                      <Upload className="w-5 h-5 text-[#C59B3F]" />
                      <span>दस्तावेज़ अपलोड (Document Upload)</span>
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FileUploadField label="10th Marksheet (हाई स्कूल अंकपत्र)" fieldKey="tenthMarksheetFile" />
                      <FileUploadField label="12th Marksheet (इंटरमीडिएट अंकपत्र)" fieldKey="twelfthMarksheetFile" />
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 5: Review & Submit */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <h3 className="text-base sm:text-xl font-devanagari font-bold text-[#0E3320] flex items-center gap-2 pb-2 border-b border-[#F2ECE1]">
                    <ClipboardList className="w-5 h-5 text-[#C59B3F]" />
                    <span>5. समीक्षा एवं पुष्टि (Review & Confirm)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                    {[
                      ["Candidate Name", formData.candidateName],
                      ["Father's Name", formData.fatherName],
                      ["Date of Birth", formData.dob],
                      ["Gender / Category", `${formData.gender} / ${formData.category}`],
                      ["Mobile", formData.phone],
                      ["Email", formData.email],
                      ["City / State", `${formData.city}, ${formData.state}`],
                      ["Pincode", formData.pincode],
                      ["Course", formData.course],
                      ["Institute", formData.institute],
                      ["10th Board / Year / %", `${formData.highSchoolBoard} / ${formData.highSchoolYear} / ${formData.highSchoolPercent}`],
                      ["12th Board / Year / %", `${formData.interBoard} / ${formData.interYear} / ${formData.interPercent}`],
                      ["10th Marksheet", formData.tenthMarksheetFile?.name || "Not uploaded"],
                      ["12th Marksheet", formData.twelfthMarksheetFile?.name || "Not uploaded"],
                    ].map(([label, value]) => (
                      <div key={label} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE2D3]">
                        <span className="block text-[10px] sm:text-[11px] text-[#8C9E90] uppercase font-bold tracking-wide">{label}</span>
                        <span className="block font-semibold text-[#0E3320] mt-0.5 break-words">{value}</span>
                      </div>
                    ))}
                  </div>

                  <label className="flex items-start gap-2.5 pt-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={termsAccepted}
                      onChange={(e) => setTermsAccepted(e.target.checked)}
                      className="mt-0.5 w-4 h-4 accent-[#0E3320] shrink-0"
                    />
                    <span className="text-xs sm:text-sm text-[#52725D]">
                      I confirm that all details and documents provided are true and accurate to the best of my knowledge.
                    </span>
                  </label>
                </div>
              )}

              {/* Step Navigation */}
              <div className="pt-4 border-t border-[#EAE2D3] flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3">
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
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-sm sm:text-base font-bold shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    <span>Next Step</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-sm sm:text-base font-bold shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <span>Submit Admission Form (आवेदन जमा करें)</span>
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>

            </form>
          )}

        </div>
      </section>

      {/* 4. Modals & Footer */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
      <Footer />
    </main>
  );
}
