"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import {
  GraduationCap,
  Calendar,
  Clock,
  BookOpen,
  Award,
  CheckCircle2,
  Search,
  Filter,
  ArrowRight,
  ShieldCheck,
  Building2,
  FileText,
  UserCheck,
  Sparkles,
  Phone,
  Mail,
  X,
  Stethoscope,
  HeartPulse,
  Leaf
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";

export default function CoursesPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [selectedCourseModal, setSelectedCourseModal] = useState(null);

  // Call Back Form State
  const [callbackData, setCallbackData] = useState({
    name: "",
    phone: "",
    email: "",
    course: "D.N.Y.S. (Diploma in Naturopathy & Yoga Sciences)",
    message: "",
  });
  const [callbackSubmitted, setCallbackSubmitted] = useState(false);

  // All Academic Programs of Bhartiya Ayurveda
  const courses = [
    {
      id: "dnys",
      code: "DNYS-03",
      level: "Diploma",
      titleHi: "डिप्लोमा इन प्राकृतिक चिकित्सा एवं योग विज्ञान (D.N.Y.S.)",
      titleEn: "Diploma in Naturopathy & Yoga Sciences (D.N.Y.S.)",
      duration: "3 Years",
      durationYears: 3,
      eligibility: "10+2 (Any Stream / Science Preferred)",
      image: "/images/naturopathy/mud-therapy.jpg",
      tagline: "A 3-year premier government-recognized professional program in Naturopathy and Yoga science.",
      description: "D.N.Y.S. is the flagship diploma program certified by the Council. It equips students with deep clinical knowledge of the Five Elements (Panchamahabhuta) therapy, Hydrotherapy, Mud therapy, Fasting therapy, Chromotherapy, and classical Yoga asanas, enabling independent clinical practice and health consultancy.",
      highlights: [
        "Government Recognized Council Enrolment",
        "Clinical Hospital Internship Included",
        "Hydrotherapy & Mud Bath Practical Labs",
        "Authorized Independent Naturopathic Practice"
      ],
      syllabus: [
        {
          period: "1st Year",
          papers: [
            "Paper I: Sharir Rachna & Kriya Vigyan (Human Anatomy & Physiology)",
            "Paper II: Prakritik Chikitsa Darshan (Philosophy & Principles of Naturopathy)",
            "Paper III: Swasthavritta & Yoga Vigyan (Personal Hygiene & Yogic Kriyas)",
            "Practical: Shatkarma, Asanas & Pranayama Demonstrations"
          ]
        },
        {
          period: "2nd Year",
          papers: [
            "Paper IV: Jal Chikitsa & Mitti Chikitsa (Hydrotherapy & Mud Therapy)",
            "Paper V: Aahar & Upvaas Chikitsa (Dietetics, Nutrition & Fasting Therapy)",
            "Paper VI: Surya Kiran & Vayu Chikitsa (Chromotherapy & Heliotherapy)",
            "Practical: Clinical Naturopathy Treatments & Case Records"
          ]
        },
        {
          period: "3rd Year",
          papers: [
            "Paper VII: Rog Nidan & Dravyaguna (Diagnostic Methods & Herbology)",
            "Paper VIII: Chikitshak Dharam & Parikshan (Medical Ethics & Patient Examination)",
            "Paper IX: Massage & Manipulative Therapies (Mridu Chikitsa)",
            "Practical: 6 Months Mandatory Hospital Clinical Internship"
          ]
        }
      ],
      careerOpportunities: [
        "Registered Naturopathy Practitioner",
        "Wellness & Panchakarma Clinic Director",
        "Hospital Naturopath & Yoga Consultant",
        "Ayush Health & Wellness Centre Officer"
      ]
    },
    {
      id: "bnys",
      code: "BNYS-05",
      level: "Undergraduate Degree",
      titleHi: "बैचलर ऑफ नेचुरोपैथी एंड योगिक साइंसेज (B.N.Y.S.)",
      titleEn: "Bachelor of Naturopathy & Yoga Sciences (B.N.Y.S.)",
      duration: "5 Years",
      durationYears: 5,
      eligibility: "10+2 with Physics, Chemistry & Biology (PCB) Min. 50%",
      image: "/images/hero/hero-meditation.jpg",
      tagline: "A 5-year full medical bachelor's degree program focused on Naturopathy and Yoga Science.",
      description: "B.N.Y.S. is an extensive 5-year full-time medical graduation degree course (4.5 years academic + 6 months compulsory rotatory clinical internship). It bridges cutting-edge modern clinical diagnostics with drugless naturopathic healing, acupuncture, and therapeutic yogic medicine.",
      highlights: [
        "Comprehensive Medical Graduation Degree",
        "6 Months Rotatory Hospital Internship",
        "Clinical Diagnosis, Pathology & Biochemistry",
        "Acupuncture & Modern Physical Therapy"
      ],
      syllabus: [
        {
          period: "Phase 1 (Years 1-2)",
          papers: [
            "Human Anatomy, Embryology & Histology",
            "Human Physiology & Biochemistry",
            "Philosophy & Practice of Naturopathy",
            "Classical Yoga Philosophy & Patanjali Sutras"
          ]
        },
        {
          period: "Phase 2 (Years 3-4)",
          papers: [
            "Pathology, Microbiology & Forensic Medicine",
            "Hydrotherapy, Mud Therapy & Heliotherapy",
            "Acupuncture, Acupressure & Reflexology",
            "Clinical Nutrition, Herbology & Dietetics"
          ]
        },
        {
          period: "Phase 3 (Year 5)",
          papers: [
            "Obstetrics, Gynecology & Pediatrics in Naturopathy",
            "Hospital Management & Modern Diagnostics",
            "Emergency Medicine & First Aid",
            "Compulsory 6-Month Rotatory Hospital Internship"
          ]
        }
      ],
      careerOpportunities: [
        "Class-A Registered Naturopathic Medical Officer",
        "Chief Medical Officer at Nature Cure Sanatoriums",
        "Clinical Researcher & AYUSH Faculty",
        "International Holistic Health Director"
      ]
    },
    {
      id: "yoga-therapist",
      code: "PGD-YT",
      level: "Doctor Specialization",
      titleHi: "योग थेरेपिस्ट (चिकित्सकों हेतु)",
      titleEn: "Yoga Therapist (For Medical Doctors)",
      duration: "1 Year",
      durationYears: 1,
      eligibility: "MBBS / BAMS / BHMS / BDS / BUMS or Medical Graduation",
      image: "/images/programs/yoga-14days.jpg",
      tagline: "A comprehensive program in Yoga therapy designed specifically for medical professionals.",
      description: "Designed specifically for practicing modern and AYUSH doctors who want to integrate evidence-based yogic therapy into their clinical practice for chronic lifestyle diseases such as hypertension, diabetes, arthritis, and psychosomatic disorders.",
      highlights: [
        "Tailored for Medical Practitioners",
        "Evidence-Based Yogic Endocrinology",
        "Clinical Protocols for Lifestyle Diseases",
        "Certified Council Post-Graduate Diploma"
      ],
      syllabus: [
        {
          period: "Semester 1",
          papers: [
            "Neuro-Endocrine Foundations of Yoga Therapy",
            "Cardiovascular & Respiratory Yogic Rehabilitation",
            "Psychosomatic Disorders & Stress Biology"
          ]
        },
        {
          period: "Semester 2",
          papers: [
            "Musculoskeletal & Spine Therapy (Asanas & Bandhas)",
            "Pranayama & Autonomic Nervous System Regulation",
            "Clinical Case Documentation & Medical Dissertations"
          ]
        }
      ],
      careerOpportunities: [
        "Hospital Integrative Medicine Consultant",
        "Clinical Yoga Therapy Specialist",
        "Corporate Preventive Health Advisor"
      ]
    },
    {
      id: "yoga-teacher",
      code: "YTTC-01",
      level: "Diploma",
      titleHi: "योग शिक्षक प्रशिक्षण (शिक्षकों हेतु)",
      titleEn: "Yoga Teacher Training (For Teachers & Instructors)",
      duration: "1 Year",
      durationYears: 1,
      eligibility: "10+2 in any stream from recognized board",
      image: "/images/yoga/yoga-banner.png",
      tagline: "This program trains Yoga instructors with a focus on education and teaching methodology.",
      description: "A prestigious 1-year professional course preparing confident yoga instructors capable of teaching in schools, universities, fitness institutes, and international yoga centers with mastery over asanas, pranayama, and Vedic pedagogical methods.",
      highlights: [
        "Mastery of Classical Asanas & Adjustments",
        "Teaching Methodology & Curriculum Planning",
        "Shatkarma (Six Cleansing Kriyas) Training",
        "Global Yoga Council Teacher Certification"
      ],
      syllabus: [
        {
          period: "Semester 1",
          papers: [
            "History of Yoga, Vedic Lineages & Philosophy",
            "Hatha Yoga Pradipika & Gheranda Samhita",
            "Asana Biomechanics & Injury Prevention"
          ]
        },
        {
          period: "Semester 2",
          papers: [
            "Teaching Methodology, Voice Modulation & Sequencing",
            "Pranayama, Mudras, Bandhas & Meditation",
            "Practical Teaching Internship & Viva Voce"
          ]
        }
      ],
      careerOpportunities: [
        "Certified School & College Yoga Instructor",
        "Independent Studio & Ashram Teacher",
        "International Retreat Trainer"
      ]
    },
    {
      id: "panchkarma",
      code: "PAN-01",
      level: "Certification",
      titleHi: "पंचकर्म तकनीशियन एवं विशेषज्ञ",
      titleEn: "Panchakarma Therapy & Technician",
      duration: "1 Year",
      durationYears: 1,
      eligibility: "10th Pass or 10+2 from recognized board",
      image: "/images/ayurveda/herbs-mortar.jpg",
      tagline: "One-year program focused on traditional Ayurvedic detoxification therapies.",
      description: "An intensive practical training course in traditional Ayurvedic detox and rejuvenation therapies. Students gain hands-on experience in classical Abhyanga massage, Shirodhara, Vamana, Virechana, Nasya, and Basti preparation under expert Vaidyas.",
      highlights: [
        "Hands-On Clinical Oil Preparation",
        "Classical Shirodhara & Potli Massage Training",
        "Authentic 5 Cleansing Kriyas",
        "High Demand in Ayurvedic Hospitals & Spas"
      ],
      syllabus: [
        {
          period: "Module 1",
          papers: [
            "Fundamentals of Ayurveda: Tridosha, Dhatus & Agni",
            "Herbal Pharmacognosy & Medicated Oils Preparation",
            "Purvakarma: Snehana (Oleation) & Swedana (Sudation)"
          ]
        },
        {
          period: "Module 2",
          papers: [
            "Pradhan Karma: Vamana, Virechana, Basti & Nasya",
            "Paschat Karma: Samsarjana Krama & Diet Management",
            "Practical Internship in Ayurvedic Hospital Ward"
          ]
        }
      ],
      careerOpportunities: [
        "Chief Panchakarma Technician in Hospitals",
        "Ayurvedic Spa & Wellness Resort Specialist",
        "Ayush Therapy Assistant"
      ]
    },
    {
      id: "dims",
      code: "DIMS-02",
      level: "Diploma",
      titleHi: "डिप्लोमा इन इंटीग्रेटेड मेडिकल साइंसेज (D.I.M.S.)",
      titleEn: "Diploma in Integrated Medical Sciences (D.I.M.S.)",
      duration: "2 Years",
      durationYears: 2,
      eligibility: "10+2 in Science or equivalent diploma",
      image: "/images/naturopathy/herbal-care.jpg",
      tagline: "A 2-year program combining conventional and alternative healing methods.",
      description: "D.I.M.S. provides an integrated approach blending modern fundamental anatomy, medical diagnostics, and emergency first response with time-tested holistic sciences of Ayurveda, Naturopathy, and Botanical Pharmacopeia.",
      highlights: [
        "Synthesis of Modern Diagnostics & Naturopathy",
        "First Aid & Emergency Triage Skills",
        "Community & Preventive Health Focus",
        "Hospital Lab & Diagnostic Training"
      ],
      syllabus: [
        {
          period: "Year 1",
          papers: [
            "General Human Biology, Histology & Physiology",
            "Fundamentals of Complementary & Alternative Medicine",
            "Basic Pathology & Biochemical Diagnostics"
          ]
        },
        {
          period: "Year 2",
          papers: [
            "Preventive Community Medicine & Public Health",
            "Integrative Pharmacology & Herbology",
            "Emergency Care, First Aid & Clinical Hospital Posting"
          ]
        }
      ],
      careerOpportunities: [
        "Integrated Healthcare Coordinator",
        "Community Preventive Medicine Officer",
        "Wellness Diagnostic Technician"
      ]
    },
    {
      id: "yoga-science",
      code: "BSC-YS",
      level: "Undergraduate Degree",
      titleHi: "बी.एससी. योग विज्ञान (B.Sc. Yoga Science)",
      titleEn: "Bachelor of Science in Yoga Science (B.Sc.)",
      duration: "3 Years",
      durationYears: 3,
      eligibility: "10+2 in any stream from a recognized board",
      image: "/images/programs/wellness-30days.jpg",
      tagline: "Undergraduate program in Yoga Science with emphasis on holistic health and wellness.",
      description: "A comprehensive 3-year bachelor's degree program providing deep academic, scientific, and empirical grounding in yogic philosophy, human neurobiology, psychological equilibrium, and research methodologies in yogic healing.",
      highlights: [
        "Three-Year Academic University Degree",
        "Scientific Research & Case Studies",
        "Ancient Texts & Scriptural Mastery",
        "Corporate & Educational Career Eligibility"
      ],
      syllabus: [
        {
          period: "Year 1",
          papers: [
            "Foundations of Yoga Philosophy & Vedic Thought",
            "Human Anatomy & Kinesiology in Yoga",
            "Practical Asana Foundations & Breathing Techniques"
          ]
        },
        {
          period: "Year 2",
          papers: [
            "Patanjali Yoga Sutras & Hatha Yoga Pradipika",
            "Yoga Psychology, Mental Health & Stress Relief",
            "Therapeutic Applications for Chronic Disorders"
          ]
        },
        {
          period: "Year 3",
          papers: [
            "Research Methodology & Bio-statistical Analysis",
            "Advanced Pranayama, Bandhas, Mudras & Dhyana",
            "Degree Dissertation & Community Yoga Project"
          ]
        }
      ],
      careerOpportunities: [
        "University & College Yoga Lecturer",
        "Government Sports & AYUSH Department Coach",
        "Corporate Mindfulness & Ergonomics Trainer",
        "Higher Studies (M.Sc. / Ph.D. in Yoga)"
      ]
    },
    {
      id: "naturopathy-degree",
      code: "NAT-04",
      level: "Professional Degree",
      titleHi: "प्राकृतिक चिकित्सा स्नातक पाठ्यक्रम",
      titleEn: "Professional 4-Year Naturopathy Program",
      duration: "4 Years",
      durationYears: 4,
      eligibility: "10+2 with Science (PCB) or recognized equivalent",
      image: "/images/naturopathy/air-waterfall.jpg",
      tagline: "Four-year program in Naturopathy, focusing on natural healing methods.",
      description: "An intensive 4-year professional curriculum dedicated to natural curative methodologies without synthetic chemical pharmaceuticals. Focuses on cellular detox, hydro-magnetic healing, raw nutrition therapy, and clinical ward rounds.",
      highlights: [
        "Deep Immersion in Drugless Natural Medicine",
        "Raw Nutrition & Cellular Fasting Therapy",
        "Advanced Heliotherapy & Water Therapy Units",
        "Sanatorium Clinical Rotations"
      ],
      syllabus: [
        {
          period: "Year 1 & 2",
          papers: [
            "Cellular Biology, Anatomy & Physiology",
            "Five Elements Theory & Philosophy of Nature Cure",
            "Therapeutic Nutrition & Fasting Regimen"
          ]
        },
        {
          period: "Year 3 & 4",
          papers: [
            "Advanced Hydrotherapy, Mud & Sun Bath Techniques",
            "Acupressure, Reflexology & Spine Alignment",
            "Clinical Diagnosis, Case Taking & Hospital Internship"
          ]
        }
      ],
      careerOpportunities: [
        "Chief Medical Superintendent at Nature Cure Centers",
        "Independent Natural Health Practitioner",
        "Nutritional Counselor & Detox Specialist"
      ]
    },
    {
      id: "cya",
      code: "CYA-06",
      level: "Certification",
      titleHi: "योग एवं आयुर्वेद प्रमाण पत्र (C.Y.A.)",
      titleEn: "Certificate in Yoga & Ayurveda (C.Y.A.)",
      duration: "6 Months",
      durationYears: 0.5,
      eligibility: "10th Pass or Higher Secondary",
      image: "/images/programs/retreat-7days.jpg",
      tagline: "Short-term foundation program combining daily Yogic sadhana with Ayurvedic lifestyle wisdom.",
      description: "An accessible 6-month foundational certificate course designed for beginners, homemakers, and wellness enthusiasts wanting to master daily Dinacharya, Ayurvedic dietary principles, and essential daily yoga asanas.",
      highlights: [
        "Quick 6-Month Fast-Track Certification",
        "Practical Everyday Herbal Remedies",
        "Tridosha Assessment & Diet Planning",
        "Daily Breathwork & Asana Routine"
      ],
      syllabus: [
        {
          period: "Term 1",
          papers: [
            "Tridosha (Vata-Pitta-Kapha) Self-Assessment",
            "Dinacharya (Daily Routine) & Ritucharya (Seasonal Routine)",
            "Kitchen Herbs & Home Remedies for Common Ailments",
            "Daily Sun Salutations (Surya Namaskar) & Pranayama"
          ]
        }
      ],
      careerOpportunities: [
        "Ayurvedic Lifestyle Coach",
        "Community Yoga Instructor",
        "Personal Health & Wellness Advisor"
      ]
    }
  ];

  // Categories for filter tabs
  const categories = [
    "All",
    "Diploma",
    "Undergraduate Degree",
    "Doctor Specialization",
    "Certification",
    "Professional Degree"
  ];

  // Durations for dropdown
  const durations = ["All", "6 Months", "1 Year", "2 Years", "3 Years", "4 Years", "5 Years"];

  // Filtered courses logic
  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const matchesCategory =
        activeCategory === "All" || course.level === activeCategory;
      const matchesDuration =
        selectedDuration === "All" || course.duration === selectedDuration;
      const matchesSearch =
        searchQuery === "" ||
        course.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.titleHi.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.eligibility.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesCategory && matchesDuration && matchesSearch;
    });
  }, [activeCategory, selectedDuration, searchQuery]);

  const handleCallbackSubmit = (e) => {
    e.preventDefault();
    setCallbackSubmitted(true);
  };

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E3320] font-sans selection:bg-[#C59B3F] selection:text-white">
      {/* 1. Header Navigation */}
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* 2. Hero Section: Clean 3-Row Layout */}
      <section className="relative bg-[#071F13] text-white py-16 md:py-24 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero-meditation.jpg"
            alt="Academic Courses Banner"
            className="w-full h-full object-cover opacity-60 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/65 to-[#071F13]/70"></div>
        </div>

        <div className="max-w-6xl mx-auto relative z-10 text-center space-y-4">
          {/* Row 1: Breadcrumbs */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#C59B3F] font-semibold tracking-wider uppercase">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">Academic Courses</span>
          </nav>

          {/* Row 2: Vedic Tag Pill Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-xs sm:text-sm font-semibold shadow-sm">
              <span>🌿</span>
              <span>भारतीय आयुर्वेद • मान्यता प्राप्त शैक्षणिक पाठ्यक्रम 2026-27</span>
            </div>
          </div>

          {/* Row 3: Main Title */}
          <div className="space-y-2 pt-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-devanagari font-bold text-white leading-tight">
              हमारे पाठ्यक्रम
            </h1>
            <div className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#C59B3F] font-bold">
              Our Academic Courses & Degree Programs
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-[#CBD8CB] leading-relaxed">
            Government-recognized degrees, diplomas, and specialist certifications in Naturopathy, Yoga Science, and Classical Ayurveda across 14 affiliated colleges.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <div className="flex items-center gap-2 text-xs text-[#EBE2D4]">
              <ShieldCheck className="w-4 h-4 text-[#C59B3F]" />
              <span>Council Recognized Enrolment</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C59B3F]/60"></div>
            <div className="flex items-center gap-2 text-xs text-[#EBE2D4]">
              <Building2 className="w-4 h-4 text-[#C59B3F]" />
              <span>14+ Affiliated Institutions</span>
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-[#C59B3F]/60"></div>
            <div className="flex items-center gap-2 text-xs text-[#EBE2D4]">
              <GraduationCap className="w-4 h-4 text-[#C59B3F]" />
              <span>Practical Clinical Hospital Postings</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Search & Filter Bar */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 -mt-6 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-[#EBE2D4] p-4 sm:p-6 space-y-4">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 sm:gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder="Search by course name, code, or eligibility..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
              />
              <Search className="w-4 h-4 text-[#7A583A] absolute left-4 top-3.5" />
            </div>

            {/* Duration Filter Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-xs font-bold text-[#1A452E] uppercase tracking-wider shrink-0 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#C59B3F]" />
                <span>Duration:</span>
              </span>
              <select
                value={selectedDuration}
                onChange={(e) => setSelectedDuration(e.target.value)}
                className="w-full md:w-48 px-3.5 py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
              >
                {durations.map((dur) => (
                  <option key={dur} value={dur}>{dur === "All" ? "All Durations" : dur}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 pt-2 border-t border-[#EBE2D4] -mx-2 px-2 sm:mx-0 sm:px-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-3.5 sm:px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-[#0E3320] text-[#E4BF64] shadow-md"
                    : "bg-[#FAF8F5] text-[#1A452E] hover:bg-[#EBE2D4] border border-[#EBE2D4]"
                }`}
              >
                {cat === "All" ? "All Programs" : cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Course Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-lg sm:text-xl font-devanagari font-bold text-[#0E3320]">
              उपलब्ध पाठ्यक्रम ({filteredCourses.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#7A583A] mt-1">
              Select any program to view full syllabus, subject breakdown, and admission requirements.
            </p>
          </div>

          <Link
            href="/admissions/registration-form"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1A5C38] text-white hover:bg-[#0E3320] text-xs font-semibold transition-colors shadow"
          >
            <span>Direct Admission Form</span>
          </Link>
        </div>

        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                className="bg-white rounded-2xl border border-[#EBE2D4] shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col group"
              >
                {/* Image Banner */}
                <div className="relative h-48 sm:h-52 overflow-hidden bg-[#071F13]">
                  <img
                    src={course.image}
                    alt={course.titleEn}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0E3320] via-transparent to-transparent opacity-80"></div>

                  {/* Level Pill */}
                  <div className="absolute top-3 left-3 bg-[#0E3320]/90 backdrop-blur text-[#E4BF64] border border-[#C59B3F]/40 text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    {course.level}
                  </div>

                  {/* Code Badge */}
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-[#0E3320] text-xs font-mono font-bold px-2.5 py-1 rounded-md shadow-sm">
                    {course.code}
                  </div>

                  {/* Duration Bottom overlay */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs font-medium">
                    <span className="flex items-center gap-1.5 bg-[#0E3320]/80 backdrop-blur px-2.5 py-1 rounded-full">
                      <Clock className="w-3.5 h-3.5 text-[#C59B3F]" />
                      <span>{course.duration}</span>
                    </span>
                    <span className="bg-[#C59B3F] text-[#0E3320] font-bold px-2.5 py-1 rounded-full text-[11px]">
                      Session 2026-27
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <div className="space-y-1">
                      <h3 className="font-devanagari font-bold text-base sm:text-lg text-[#0E3320] leading-snug group-hover:text-[#1A5C38] transition-colors">
                        {course.titleHi}
                      </h3>
                      <h4 className="font-sans font-bold text-xs sm:text-sm text-[#7A583A]">
                        {course.titleEn}
                      </h4>
                    </div>

                    <p className="text-xs text-[#555] line-clamp-2 leading-relaxed">
                      {course.tagline}
                    </p>

                    {/* Eligibility Badge */}
                    <div className="pt-2">
                      <div className="bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EBE2D4] text-xs text-[#0E3320] space-y-1">
                        <span className="text-[10px] text-[#7A583A] font-bold uppercase tracking-wider block">
                          Eligibility Criteria:
                        </span>
                        <p className="font-semibold text-xs leading-tight">
                          {course.eligibility}
                        </p>
                      </div>
                    </div>

                    {/* Highlights */}
                    <div className="pt-2 space-y-1.5">
                      {course.highlights.slice(0, 2).map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-[#1A452E]">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#1A5C38] shrink-0" />
                          <span className="truncate">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#EBE2D4] flex items-center gap-2">
                    <button
                      onClick={() => setSelectedCourseModal(course)}
                      className="flex-1 py-2.5 px-3 rounded-xl border border-[#0E3320] text-[#0E3320] hover:bg-[#FAF8F5] text-xs font-bold transition-colors cursor-pointer text-center"
                    >
                      View Syllabus
                    </button>

                    <Link
                      href={`/admissions/registration-form?course=${encodeURIComponent(course.titleEn)}`}
                      className="flex-1 py-2.5 px-3 rounded-xl bg-[#0E3320] hover:bg-[#071F13] text-[#E4BF64] text-xs font-bold transition-colors text-center inline-flex items-center justify-center gap-1 shadow-sm"
                    >
                      <span>Apply Now</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#EBE2D4] space-y-3">
            <BookOpen className="w-12 h-12 text-[#C59B3F] mx-auto opacity-75" />
            <h3 className="font-serif font-bold text-xl text-[#0E3320]">
              No Courses Match Your Filter
            </h3>
            <p className="text-xs sm:text-sm text-[#7A583A]">
              Try changing the category or clearing the search query to see all programs.
            </p>
            <button
              onClick={() => {
                setActiveCategory("All");
                setSelectedDuration("All");
                setSearchQuery("");
              }}
              className="px-6 py-2.5 rounded-full bg-[#0E3320] text-white text-xs font-semibold"
            >
              Reset Filters
            </button>
          </div>
        )}
      </section>

      {/* 5. Why Study With Bhartiya Ayurveda & Council */}
      <section className="bg-[#0E3320] text-white py-16 px-4 md:px-8">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#E4BF64] text-xs font-semibold uppercase tracking-wider">
              <span>🌿</span>
              <span>Council Excellence & Standards</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white">
              Why Study Naturopathy & Yoga With Us?
            </h2>
            <p className="text-sm sm:text-base text-[#CBD8CB]">
              Our academic curriculum combines rigorous clinical medical science with timeless Vedic healing lineages, preparing graduates for lifelong impactful careers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C59B3F]/20 text-[#E4BF64] flex items-center justify-center">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Council Recognized</h3>
              <p className="text-xs text-[#CBD8CB] leading-relaxed">
                Legally approved diplomas and degree certifications empowering you for private clinical practice and registered medical officer positions.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C59B3F]/20 text-[#E4BF64] flex items-center justify-center">
                <Stethoscope className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">Clinical Hospital Postings</h3>
              <p className="text-xs text-[#CBD8CB] leading-relaxed">
                Mandatory rotations in natural cure hospitals, mud bath departments, hydrotherapy units, and diagnostic laboratories.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C59B3F]/20 text-[#E4BF64] flex items-center justify-center">
                <Building2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">14+ Affiliated Centers</h3>
              <p className="text-xs text-[#CBD8CB] leading-relaxed">
                Choose from verified campuses in Jaunpur, Ayodhya, Basti, Gorakhpur, Mau, Varanasi, and Prayagraj with full hostel facilities.
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
              <div className="w-12 h-12 rounded-xl bg-[#C59B3F]/20 text-[#E4BF64] flex items-center justify-center">
                <UserCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-white">100% Career Assistance</h3>
              <p className="text-xs text-[#CBD8CB] leading-relaxed">
                Dedicated placement cells connecting graduates to AYUSH centers, wellness resorts, corporate yoga contracts, and private clinics.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Request a Free Admission Counseling Call */}
      <section className="max-w-5xl mx-auto px-4 md:px-8 py-16">
        <div className="bg-white rounded-3xl shadow-xl border border-[#EBE2D4] overflow-hidden grid grid-cols-1 md:grid-cols-5">
          {/* Left Column: Info */}
          <div className="md:col-span-2 bg-[#0E3320] text-white p-8 sm:p-10 flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <span className="text-xs text-[#C59B3F] font-bold uppercase tracking-widest">
                कॉल बैक का अनुरोध करें
              </span>
              <h3 className="text-2xl font-serif font-bold text-white">
                Request an Academic Counseling Call
              </h3>
              <p className="text-xs text-[#CBD8CB] leading-relaxed">
                Unsure which course matches your qualifications? Speak directly with our senior educational advisors for step-by-step guidance.
              </p>
            </div>

            <div className="space-y-4 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C59B3F]" />
                <a href="tel:+919876543210" className="hover:underline font-semibold text-white">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C59B3F]" />
                <a href="mailto:hello@bhartiyaayurveda.in" className="hover:underline font-semibold text-white">
                  hello@bhartiyaayurveda.in
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-4 h-4 text-[#C59B3F]" />
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </div>
            </div>

            <div className="p-3 bg-white/10 rounded-xl text-[11px] text-[#E4BF64]">
              ✨ Direct Admissions for Session 2026-27 are currently open.
            </div>
          </div>

          {/* Right Column: Counseling Form */}
          <div className="md:col-span-3 p-8 sm:p-10">
            {callbackSubmitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-3 py-8">
                <div className="w-14 h-14 rounded-full bg-[#1A5C38]/10 text-[#1A5C38] flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="font-serif font-bold text-xl text-[#0E3320]">
                  Counseling Request Received!
                </h4>
                <p className="text-xs text-[#666] max-w-sm">
                  Our academic advisor will call you on <strong>{callbackData.phone}</strong> shortly to answer your questions regarding <strong>{callbackData.course}</strong>.
                </p>
                <button
                  onClick={() => setCallbackSubmitted(false)}
                  className="px-5 py-2 rounded-full border border-[#0E3320] text-[#0E3320] text-xs font-semibold mt-4"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleCallbackSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Ramesh Chandra"
                    value={callbackData.name}
                    onChange={(e) => setCallbackData({ ...callbackData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-1.5">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={callbackData.phone}
                      onChange={(e) => setCallbackData({ ...callbackData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="student@example.com"
                      value={callbackData.email}
                      onChange={(e) => setCallbackData({ ...callbackData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-1.5">
                    Interested Course *
                  </label>
                  <select
                    value={callbackData.course}
                    onChange={(e) => setCallbackData({ ...callbackData, course: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.titleEn}>{c.titleEn} ({c.duration})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#1A452E] uppercase tracking-wider mb-1.5">
                    Your Questions / Academic Background (Optional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Tell us about your highest qualification (10th/12th/Graduation)..."
                    value={callbackData.message}
                    onChange={(e) => setCallbackData({ ...callbackData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-[#E4BF64] font-semibold text-sm shadow-md transition-colors group cursor-pointer"
                >
                  <span>Request Free Counseling Call</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* 7. Detailed Course Modal */}
      {selectedCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[92vh] overflow-y-auto shadow-2xl border border-[#EBE2D4] p-4 sm:p-8 space-y-5 sm:space-y-6">
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#EBE2D4] pb-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-bold text-[#1A5C38] uppercase">
                  <span>{selectedCourseModal.level}</span>
                  <span>•</span>
                  <span>{selectedCourseModal.duration}</span>
                  <span>•</span>
                  <span className="font-mono text-[#0E3320]">{selectedCourseModal.code}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-devanagari font-bold text-[#0E3320] mt-1">
                  {selectedCourseModal.titleHi}
                </h3>
                <h4 className="text-sm font-sans font-semibold text-[#7A583A]">
                  {selectedCourseModal.titleEn}
                </h4>
              </div>
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="p-2 text-[#7A583A] hover:text-[#0E3320] hover:bg-[#FAF8F5] rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="space-y-5 text-sm">
              <div>
                <h5 className="font-bold text-[#0E3320] text-xs uppercase tracking-wider mb-1">
                  Course Synopsis
                </h5>
                <p className="text-[#555] leading-relaxed text-xs sm:text-sm">
                  {selectedCourseModal.description}
                </p>
              </div>

              {/* Eligibility & Highlights Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE2D4]">
                  <h6 className="font-bold text-[#0E3320] text-xs uppercase mb-1">Eligibility Criteria</h6>
                  <p className="text-xs text-[#555] font-semibold">{selectedCourseModal.eligibility}</p>
                </div>
                <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE2D4]">
                  <h6 className="font-bold text-[#0E3320] text-xs uppercase mb-1">Academic Session</h6>
                  <p className="text-xs text-[#555] font-semibold">2026-2027 (Annual System)</p>
                </div>
              </div>

              {/* Syllabus Breakdown */}
              <div className="space-y-3">
                <h5 className="font-bold text-[#0E3320] text-xs uppercase tracking-wider">
                  Curriculum & Paper Breakdown
                </h5>
                <div className="space-y-3">
                  {selectedCourseModal.syllabus.map((syl, idx) => (
                    <div key={idx} className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE2D4] space-y-2">
                      <span className="font-bold text-[#0E3320] text-xs block border-b border-[#EBE2D4] pb-1">
                        {syl.period}
                      </span>
                      <ul className="space-y-1 text-xs text-[#555]">
                        {syl.papers.map((paper, pIdx) => (
                          <li key={pIdx} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1A5C38] mt-1.5 shrink-0"></span>
                            <span>{paper}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Career Opportunities */}
              <div className="space-y-2">
                <h5 className="font-bold text-[#0E3320] text-xs uppercase tracking-wider">
                  Career Scope & Employment Prospects
                </h5>
                <div className="flex flex-wrap gap-2">
                  {selectedCourseModal.careerOpportunities.map((career, cIdx) => (
                    <span
                      key={cIdx}
                      className="px-3 py-1 rounded-full bg-[#1A5C38]/10 text-[#0E3320] text-xs font-medium border border-[#1A5C38]/20"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-[#EBE2D4]">
              <button
                onClick={() => setSelectedCourseModal(null)}
                className="px-5 py-2.5 rounded-full border border-[#D5C7B5] text-[#7A583A] text-xs font-semibold hover:bg-[#FAF8F5] text-center"
              >
                Close
              </button>

              <Link
                href={`/admissions/registration-form?course=${encodeURIComponent(selectedCourseModal.titleEn)}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0E3320] hover:bg-[#071F13] text-[#E4BF64] font-semibold text-xs transition-colors shadow text-center"
              >
                <span>Proceed to Admission Form</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 8. Footer */}
      <Footer />

      {/* Consultation Modal */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
    </main>
  );
}
