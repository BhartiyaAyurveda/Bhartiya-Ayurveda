"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  Building2, 
  MapPin, 
  Search, 
  Phone, 
  Mail, 
  GraduationCap, 
  BookOpen, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  Award, 
  ShieldCheck, 
  Filter,
  Sparkles,
  Users,
  Calendar
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";
import VideoModal from "@/components/ui/VideoModal";

export default function AffiliatedInstitutesPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");

  const [callBackForm, setCallBackForm] = useState({
    name: "",
    phone: "",
    email: "",
    course: "D.N.Y.S.",
    institute: "",
    message: ""
  });

  // The 14 exact affiliated institutions of Bhartiya Ayurveda
  const institutes = [
    {
      id: 1,
      name: "S.P College of Paramedical Sciences",
      nameHi: "एस.पी. कॉलेज ऑफ पैरामेडिकल साइंसेज",
      address: "TIYARI ARA, Jaunpur, Uttar Pradesh - 222001",
      city: "Jaunpur",
      state: "Uttar Pradesh",
      type: "Paramedical & Yoga Sciences",
      code: "BA-AFF-01",
      status: "Active & Verified",
    },
    {
      id: 2,
      name: "Sushail Institute of Paramedical Science",
      nameHi: "सुशैल इंस्टीट्यूट ऑफ पैरामेडिकल साइंस",
      address: "THARA RUDAULI, Ayodhya, Uttar Pradesh - 224001",
      city: "Ayodhya",
      state: "Uttar Pradesh",
      type: "Paramedical & Naturopathy",
      code: "BA-AFF-02",
      status: "Active & Verified",
    },
    {
      id: 3,
      name: "R.S College of Paramedical Science",
      nameHi: "आर.एस. कॉलेज ऑफ पैरामेडिकल साइंस",
      address: "Munderwa Lalganj Road, Mahadeva Bankati, Basti, Uttar Pradesh - 272123",
      city: "Basti",
      state: "Uttar Pradesh",
      type: "Paramedical & Integrative Medicine",
      code: "BA-AFF-03",
      status: "Active & Verified",
    },
    {
      id: 4,
      name: "Gyan Prabhat Institute of Paramedical Science",
      nameHi: "ज्ञान प्रभात इंस्टीट्यूट ऑफ पैरामेडिकल साइंस",
      address: "Van Vihar Road, Bhupatpatti, Jaunpur, Uttar Pradesh - 222002",
      city: "Jaunpur",
      state: "Uttar Pradesh",
      type: "Paramedical & Yoga Sciences",
      code: "BA-AFF-04",
      status: "Active & Verified",
    },
    {
      id: 5,
      name: "MHD Paramedical College",
      nameHi: "एम.एच.डी. पैरामेडिकल कॉलेज",
      address: "Ganga Nagar, Basharatpur, Near Shahpur Thana, Gorakhpur, Uttar Pradesh - 273004",
      city: "Gorakhpur",
      state: "Uttar Pradesh",
      type: "Paramedical & Clinical Training",
      code: "BA-AFF-05",
      status: "Active & Verified",
    },
    {
      id: 6,
      name: "Sreenidhi Marabashettar Medical Institute",
      nameHi: "श्रीनिधि मारबशेट्टार मेडिकल इंस्टीट्यूट",
      address: "Hubli, Karnataka - 580030",
      city: "Hubli",
      state: "Karnataka",
      type: "Medical & Holistic Sciences",
      code: "BA-AFF-06",
      status: "Active & Verified",
    },
    {
      id: 7,
      name: "Aarvi Paramedical Institute",
      nameHi: "आरवी पैरामेडिकल इंस्टीट्यूट",
      address: "Tilokpur Nahar, Aurai, Bhadohi, Uttar Pradesh - 220011",
      city: "Bhadohi",
      state: "Uttar Pradesh",
      type: "Paramedical & Naturopathy Care",
      code: "BA-AFF-07",
      status: "Active & Verified",
    },
    {
      id: 8,
      name: "S.S. Nursing and Paramedical College",
      nameHi: "एस.एस. नर्सिंग एंड पैरामेडिकल कॉलेज",
      address: "Kalyanpur, Gorakhpur, Uttar Pradesh - 273412",
      city: "Gorakhpur",
      state: "Uttar Pradesh",
      type: "Nursing & Paramedical Education",
      code: "BA-AFF-08",
      status: "Active & Verified",
    },
    {
      id: 9,
      name: "Anjana Nursing Home & Paramedical College",
      nameHi: "अंजना नर्सिंग होम एवं पैरामेडिकल कॉलेज",
      address: "Ramnagar, Ambedkar Nagar, Uttar Pradesh - 224149",
      city: "Ambedkar Nagar",
      state: "Uttar Pradesh",
      type: "Clinical Hospital & Education",
      code: "BA-AFF-09",
      status: "Active & Verified",
    },
    {
      id: 10,
      name: "Ram Avatar Memorial Paramedical College",
      nameHi: "राम अवतार मेमोरियल पैरामेडिकल कॉलेज",
      address: "Village Udarauli, Post Ahirauli, Salempur, Deoria, Uttar Pradesh - 274505",
      city: "Deoria",
      state: "Uttar Pradesh",
      type: "Paramedical & Rural Healthcare",
      code: "BA-AFF-10",
      status: "Active & Verified",
    },
    {
      id: 11,
      name: "Maa Saraswati Paramedical College",
      nameHi: "माँ सरस्वती पैरामेडिकल कॉलेज",
      address: "Kuwaripur, Jaunpur, Uttar Pradesh - 222202",
      city: "Jaunpur",
      state: "Uttar Pradesh",
      type: "Paramedical & Yoga Education",
      code: "BA-AFF-11",
      status: "Active & Verified",
    },
    {
      id: 12,
      name: "J.P. Institute of Paramedical Science",
      nameHi: "जे.पी. इंस्टीट्यूट ऑफ पैरामेडिकल साइंस",
      address: "Kaboolpur, Zafrabad, Jaunpur, Uttar Pradesh - 222180",
      city: "Jaunpur",
      state: "Uttar Pradesh",
      type: "Paramedical & Health Sciences",
      code: "BA-AFF-12",
      status: "Active & Verified",
    },
    {
      id: 13,
      name: "Institute of Naturopathy and Yogic Sciences",
      nameHi: "इंस्टीट्यूट ऑफ नेचुरोपैथी एंड योगिक साइंसेज",
      address: "Patrakar Puram, Gomti Nagar, Lucknow, Uttar Pradesh - 226010",
      city: "Lucknow",
      state: "Uttar Pradesh",
      type: "Naturopathy & Yoga Research",
      code: "BA-AFF-13",
      status: "Active & Verified",
    },
    {
      id: 14,
      name: "Ayurveda and Yoga Training Center",
      nameHi: "आयुर्वेद एंड योग ट्रेनिंग सेंटर",
      address: "Okhla, New Delhi - 110025",
      city: "New Delhi",
      state: "Delhi",
      type: "Ayurveda, Yoga & Training",
      code: "BA-AFF-14",
      status: "Active & Verified",
    },
  ];

  // Filtered institutes based on search and selected region
  const filteredInstitutes = useMemo(() => {
    return institutes.filter((inst) => {
      const matchesSearch =
        inst.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.nameHi.includes(searchQuery) ||
        inst.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
        inst.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRegion =
        selectedRegion === "All" ||
        inst.state === selectedRegion ||
        inst.city === selectedRegion;

      return matchesSearch && matchesRegion;
    });
  }, [searchQuery, selectedRegion]);

  const handleCallBackSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  const courses = [
    {
      code: "D.N.Y.S.",
      titleHi: "डिप्लोमा इन नेचुरोपैथी एवं योगिक साइंसेज",
      titleEn: "Diploma in Naturopathy & Yogic Sciences",
      dur: "3 Years",
      desc: "Complete grounding in 5-element natural therapeutics, clinical fasting, hydrotherapy, and therapeutic yoga.",
    },
    {
      code: "YOGA THERAPIST",
      titleHi: "प्रमाणित योग चिकित्सक प्रशिक्षण",
      titleEn: "Certified Yoga Therapist Program",
      dur: "1 Year",
      desc: "Specialized clinical training in using Asanas, Pranayama, and Shatkarmas to manage lifestyle disorders.",
    },
    {
      code: "PANCHKARMA",
      titleHi: "पंचकर्म थेरेपिस्ट एवं मसाज विशेषज्ञ",
      titleEn: "Panchakarma & Ayurvedic Massage Expert",
      dur: "1 Year / 6 Months",
      desc: "Practical hands-on training in Abhyanga, Shirodhara, Swedana, Basti, and detoxification procedures.",
    },
    {
      code: "ACUPRESSURE",
      titleHi: "एक्यूप्रेशर एवं मर्म चिकित्सा विशेषज्ञ",
      titleEn: "Acupressure & Marma Therapy Expert",
      dur: "6 Months",
      desc: "Mastering the vital energy channels (Nadis) and pressure points to activate the body's natural healing mechanisms.",
    },
    {
      code: "D.I.M.S.",
      titleHi: "डिप्लोमा इन इंडिजिनस मेडिकल सिस्टम्स",
      titleEn: "Diploma in Indigenous Medical Systems",
      dur: "2 Years",
      desc: "Comprehensive study of traditional Indian healing, herbal pharmacognosy, and community wellness.",
    },
  ];

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E3320] font-sans selection:bg-[#C59B3F] selection:text-white">
      {/* 1. Top Bar & Navbar */}
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* 2. Hero Section: Vedic Header Banner */}
      <section className="relative bg-[#071F13] text-white py-20 md:py-24 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero-meditation.jpg"
            alt="Affiliated Institutes Banner"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/65 to-[#071F13]/70"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-5">
          {/* Breadcrumb Row */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#C59B3F] font-semibold tracking-wider uppercase">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">Affiliated Institutes</span>
          </nav>

          {/* Vedic Tag Pill Row (Distinct separate line) */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-xs sm:text-sm font-semibold shadow-sm">
              <span>🌿</span>
              <span>भारतीय आयुर्वेद — संबद्ध शिक्षण संस्थान</span>
            </div>
          </div>

          {/* Main Title Row */}
          <div className="space-y-2 pt-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-devanagari font-bold text-white leading-tight">
              संबद्ध शिक्षण संस्थान
            </h1>
            <div className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#C59B3F] font-bold">
              Affiliated Institutes Directory
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#CBD8CB] leading-relaxed pt-1">
            Recognized paramedical, yoga, and naturopathy colleges officially affiliated with Bhartiya Ayurveda across India.
          </p>

          {/* Quick stats row */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4 max-w-3xl mx-auto text-center font-sans">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15">
              <div className="text-xl sm:text-3xl font-extrabold text-[#C59B3F]">14+</div>
              <div className="text-[11px] sm:text-xs text-[#CBD8CB] mt-0.5">Affiliated Colleges</div>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15">
              <div className="text-xl sm:text-3xl font-extrabold text-[#C59B3F]">100%</div>
              <div className="text-[11px] sm:text-xs text-[#CBD8CB] mt-0.5">Govt Recognized Certs</div>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15">
              <div className="text-xl sm:text-3xl font-extrabold text-[#C59B3F]">5+</div>
              <div className="text-[11px] sm:text-xs text-[#CBD8CB] mt-0.5">Diploma Programs</div>
            </div>
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/15">
              <div className="text-xl sm:text-3xl font-extrabold text-[#C59B3F]">3 States</div>
              <div className="text-[11px] sm:text-xs text-[#CBD8CB] mt-0.5">UP, Delhi, Karnataka</div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Search & Interactive Filter Section */}
      <section className="py-4 sm:py-6 px-4 md:px-8 bg-[#F5F0E8] border-b border-[#E6DDCE] relative md:sticky md:top-[73px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
          
          {/* Search Box */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 sm:w-5 sm:h-5 text-[#52725D] absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by institute name or city..."
              className="w-full pl-11 sm:pl-12 pr-4 py-2.5 sm:py-3 rounded-full border border-[#D5C7B7] bg-white text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#0E3320] shadow-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-[#8C671D] hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          {/* Region Quick Filters */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full -mx-1 px-1">
            <span className="text-xs font-bold text-[#8C671D] uppercase flex items-center gap-1 shrink-0 mr-1">
              <Filter className="w-3.5 h-3.5" /> Filter:
            </span>
            {["All", "Uttar Pradesh", "Karnataka", "Delhi", "Jaunpur", "Gorakhpur", "Lucknow"].map((region) => (
              <button
                key={region}
                onClick={() => setSelectedRegion(region)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all shrink-0 cursor-pointer ${
                  selectedRegion === region
                    ? "bg-[#0E3320] text-white shadow"
                    : "bg-white text-[#0E3320] border border-[#D5C7B7] hover:border-[#0E3320]"
                }`}
              >
                {region}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* 4. Affiliated Institutes Cards Grid */}
      <section className="py-16 md:py-20 px-4 md:px-8 border-b border-[#EBE2D4]">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-devanagari font-bold text-[#0E3320]">
                संबद्ध संस्थानों की सूची ({filteredInstitutes.length})
              </h2>
              <p className="text-xs sm:text-sm text-[#52725D] mt-0.5">
                Showing official recognized examination & training centers
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#2E7A4A] bg-[#EAF5ED] px-3.5 py-1.5 rounded-full border border-[#BCE1C7]">
              <ShieldCheck className="w-4 h-4" />
              <span>All 14 Institutes Officially Affiliated</span>
            </div>
          </div>

          {filteredInstitutes.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-[#E8DFCFA] space-y-3">
              <Building2 className="w-12 h-12 text-[#8C671D] mx-auto opacity-50" />
              <h3 className="text-xl font-bold text-[#0E3320]">कोई संस्थान नहीं मिला (No Institute Found)</h3>
              <p className="text-sm text-[#52725D]">
                Please clear your search query or select another region filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedRegion("All");
                }}
                className="px-5 py-2 rounded-full bg-[#0E3320] text-white text-xs font-semibold mt-2"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInstitutes.map((inst) => (
                <div
                  key={inst.id}
                  className="bg-white rounded-3xl overflow-hidden border border-[#E8DFCFA] shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
                >
                  {/* Decorative top accent strip */}
                  <div className="h-2.5 bg-gradient-to-r from-[#B96647] via-[#C59B3F] to-[#0E3320]"></div>

                  <div className="p-6 space-y-4">
                    {/* Header with Icon and Code */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-[#EAE2D3] text-[#0E3320] flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                        <Building2 className="w-6 h-6 stroke-[1.75]" />
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-[#FAF8F5] border border-[#E0D5C3] text-[11px] font-bold text-[#8C671D] font-sans">
                        {inst.code}
                      </span>
                    </div>

                    {/* Institute Name */}
                    <div className="space-y-1">
                      <h3 className="font-sans font-bold text-lg sm:text-xl text-[#0E3320] leading-snug group-hover:text-[#B96647] transition-colors">
                        {inst.name}
                      </h3>
                      <div className="font-devanagari text-xs sm:text-sm text-[#52725D] font-medium">
                        {inst.nameHi}
                      </div>
                    </div>

                    {/* Address & City */}
                    <div className="pt-2 border-t border-[#F2ECE1] space-y-2">
                      <div className="flex items-start gap-2.5 text-xs sm:text-sm text-[#466551]">
                        <MapPin className="w-4 h-4 text-[#B96647] shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{inst.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 pt-1">
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#EAF5ED] text-[#2A7A50] text-[11px] font-semibold">
                          📍 {inst.city}, {inst.state}
                        </span>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#FAF8F5] text-[#8C671D] text-[11px] font-semibold border border-[#E0D5C3]">
                          {inst.type}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer with Inquire Button */}
                  <div className="p-6 pt-0 border-t border-[#F5EFE3] mt-2 flex items-center justify-between">
                    <span className="text-xs text-[#2E7A4A] font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{inst.status}</span>
                    </span>

                    <button
                      onClick={() => {
                        setCallBackForm(prev => ({ ...prev, institute: inst.name }));
                        // Smooth scroll to call back section
                        document.getElementById('call-back-section')?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="px-4 py-2 rounded-xl bg-[#0E3320] hover:bg-[#071F13] text-white text-xs sm:text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
                    >
                      <span>Inquire / संपर्क करें</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>
      </section>

      {/* 5. Courses Offered Across Affiliated Institutes */}
      <section className="py-16 md:py-20 px-4 md:px-8 bg-[#F5F0E8] border-b border-[#E6DDCE]">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8C671D] uppercase tracking-wider">
              <GraduationCap className="w-4 h-4 text-[#2E7A4A]" />
              <span>Curriculum & Diplomas</span>
            </div>
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-devanagari font-bold text-[#0E3320]">
              मान्यता प्राप्त पाठ्यक्रम
            </h2>
            <div className="text-lg sm:text-xl font-sans font-bold text-[#15482D]">
              Programs Offered at Affiliated Colleges
            </div>
            <p className="text-sm sm:text-base text-[#466551]">
              Industry-aligned vocational diplomas in Yoga, Naturopathy, and Ayurvedic Therapies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 border border-[#E0D5C3] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-[#0E3320] text-white text-xs font-bold tracking-wide">
                      {c.code}
                    </span>
                    <span className="text-xs font-semibold text-[#8C671D] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{c.dur}</span>
                    </span>
                  </div>

                  <div>
                    <h3 className="font-devanagari font-bold text-base sm:text-lg text-[#0E3320]">
                      {c.titleHi}
                    </h3>
                    <div className="font-sans font-bold text-xs sm:text-sm text-[#466551] mt-0.5">
                      {c.titleEn}
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-[#52725D] leading-relaxed pt-2 border-t border-[#F2ECE1]">
                    {c.desc}
                  </p>
                </div>

                <div className="pt-4">
                  <button
                    onClick={() => {
                      setCallBackForm(prev => ({ ...prev, course: c.code }));
                      document.getElementById('call-back-section')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="text-xs sm:text-sm font-bold text-[#B96647] hover:underline flex items-center gap-1"
                  >
                    <span>Apply for {c.code}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. Call Back Request Form (कॉल बैक का अनुरोध करें) */}
      <section id="call-back-section" className="py-16 md:py-20 px-4 md:px-8 border-b border-[#EBE2D4] bg-[#FAF8F5]">
        <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 sm:p-12 border border-[#E4D9C7] shadow-xl space-y-6">
          
          <div className="text-center space-y-2 max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#8C671D] uppercase tracking-wider">
              <Phone className="w-4 h-4 text-[#2E7A4A]" />
              <span>Direct Support & Inquiries</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-devanagari font-bold text-[#0E3320]">
              कॉल बैक का अनुरोध करें
            </h2>
            <p className="text-sm sm:text-base text-[#466551] leading-relaxed">
              नीचे दिए गए फॉर्म को भरें, और हमारी टीम आपके संपर्क में जल्द ही आएगी आपकी सहायता के लिए।
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 rounded-2xl bg-[#EAF5ED] border border-[#A5D4B2] text-center space-y-3">
              <CheckCircle2 className="w-14 h-14 text-[#2A7A50] mx-auto stroke-[2]" />
              <h3 className="text-lg sm:text-xl font-devanagari font-bold text-[#0E3320]">
                धन्यवाद! आपका कॉल बैक अनुरोध प्राप्त हो गया है।
              </h3>
              <p className="text-sm sm:text-base text-[#2E543C] max-w-md mx-auto leading-relaxed">
                Our academic counseling cell will call you shortly on <strong>{callBackForm.phone || "your phone"}</strong> regarding admissions & institute details.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setCallBackForm({
                    name: "",
                    phone: "",
                    email: "",
                    course: "D.N.Y.S.",
                    institute: "",
                    message: ""
                  });
                }}
                className="mt-2 px-6 py-2.5 rounded-full bg-[#0E3320] text-white text-xs sm:text-sm font-semibold hover:bg-[#071F13] transition-colors"
              >
                Submit Another Request
              </button>
            </div>
          ) : (
            <form onSubmit={handleCallBackSubmit} className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-[#0E3320]">
                    Full Name (पूरा नाम) *
                  </label>
                  <input
                    type="text"
                    required
                    value={callBackForm.name}
                    onChange={(e) => setCallBackForm({ ...callBackForm, name: e.target.value })}
                    placeholder="e.g. Amit Kumar"
                    className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0E3320] text-sm text-[#0E3320]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-[#0E3320]">
                    Mobile / Phone Number (फोन नंबर) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={callBackForm.phone}
                    onChange={(e) => setCallBackForm({ ...callBackForm, phone: e.target.value })}
                    placeholder="+91 89265 89000"
                    className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0E3320] text-sm text-[#0E3320]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-[#0E3320]">
                    Select Course (पाठ्यक्रम का चयन करें)
                  </label>
                  <select
                    value={callBackForm.course}
                    onChange={(e) => setCallBackForm({ ...callBackForm, course: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0E3320] text-sm text-[#0E3320]"
                  >
                    <option value="D.N.Y.S.">D.N.Y.S. (Diploma in Naturopathy & Yoga)</option>
                    <option value="Yoga Therapist">Yoga Therapist Certification</option>
                    <option value="Panchkarma Expert">Panchkarma & Massage Expert</option>
                    <option value="Acupressure Expert">Acupressure & Marma Expert</option>
                    <option value="D.I.M.S.">D.I.M.S. (Indigenous Medical Systems)</option>
                    <option value="New Institute Affiliation">New Institute Affiliation Inquiry</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-[#0E3320]">
                    Preferred Institute (संस्थान का नाम)
                  </label>
                  <input
                    type="text"
                    value={callBackForm.institute}
                    onChange={(e) => setCallBackForm({ ...callBackForm, institute: e.target.value })}
                    placeholder="e.g. S.P College / Open to any"
                    className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0E3320] text-sm text-[#0E3320]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-[#0E3320]">
                  Any Question or Remark (कोई संदेश या प्रश्न)
                </label>
                <textarea
                  rows={3}
                  value={callBackForm.message}
                  onChange={(e) => setCallBackForm({ ...callBackForm, message: e.target.value })}
                  placeholder="Ask about fee structure, eligibility, examination centers, or syllabus..."
                  className="w-full px-4 py-3 rounded-xl border border-[#D5C7B7] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#0E3320] text-sm text-[#0E3320] resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-4 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-white text-base font-bold shadow-md flex items-center justify-center gap-2 transition-all"
              >
                <span>कॉल बैक अनुरोध भेजें (Request Call Back)</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          )}

        </div>
      </section>

      {/* 7. Career & Alumni Network Banner */}
      <section className="relative bg-[#071F13] text-white py-16 md:py-20 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/cta/cta-landscape.jpg"
            alt="Career & Alumni Network"
            className="w-full h-full object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#071F13] via-[#0E3320]/80 to-[#071F13]"></div>
        </div>

        <div className="max-w-5xl mx-auto relative z-10 text-center space-y-6">
          <div className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-xs sm:text-sm font-semibold">
            🎓 Career & Global Alumni Network
          </div>

          <h2 className="text-xl sm:text-2xl md:text-3xl font-devanagari font-bold text-white leading-tight">
            क्या आप अपने करियर को निर्माण करने के लिए तैयार हैं?
          </h2>

          <p className="text-base sm:text-lg text-[#CBD8CB] max-w-3xl mx-auto leading-relaxed">
            हमारे एलुमनाई नेटवर्क पर हमें गर्व है, जो उद्योगों और महाद्वीपों में फैला हुआ है। हमारे स्नातक अपने चुने हुए क्षेत्रों में उत्कृष्टता प्राप्त करने और समाज पर सकारात्मक प्रभाव डालने के लिए आवश्यक कौशल, ज्ञान और मूल्यों से सुसज्जित हैं।
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => {
                document.getElementById('call-back-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-8 py-3.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#0E3320] text-sm sm:text-base font-bold shadow-lg flex items-center gap-2 transition-all group"
            >
              <span>आवेदन फॉर्म भरें (Apply Now)</span>
            </button>

            <Link
              href="/contact"
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm sm:text-base font-semibold border border-white/40 backdrop-blur transition-all"
            >
              Helpline: +91 98765 43210
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Modals & Footer */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
      <VideoModal
        isOpen={isVideoOpen}
        onClose={() => setIsVideoOpen(false)}
      />
      <Footer />
    </main>
  );
}
