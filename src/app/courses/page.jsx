"use client";

import { useState, useEffect, useMemo, Fragment } from "react";
import Link from "next/link";
import {
  GraduationCap, Clock, BookOpen, Search,
  Leaf, RefreshCw, FlaskConical, Flower2,
  Stethoscope, Crosshair, ChevronLeft, ChevronRight as ChevronRightIcon,
  SlidersHorizontal, X, LayoutGrid, List, Briefcase
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";

const DURATION_ORDER = ["3 Months","6 Months","1 Year","2 Years","3 Years","3.5 Years","4 Years","5 Years"];

const CATEGORIES = [
  { key: "all",              label: "All Courses",       labelHi: "सभी पाठ्यक्रम",             icon: GraduationCap, accent: "#0E3320", light: "#EEF6EF", badge: "bg-[#0E3320] text-[#E4BF64]" },
  { key: "ayurveda",        label: "Ayurveda",           labelHi: "आयुर्वेद",                   icon: Leaf,          accent: "#166534", light: "#dcfce7", badge: "bg-emerald-700 text-white" },
  { key: "yoga_naturopathy",label: "Yoga & Naturopathy", labelHi: "योग एवं प्राकृतिक चिकित्सा", icon: Flower2,       accent: "#0f766e", light: "#ccfbf1", badge: "bg-teal-700 text-white" },
  { key: "unani",           label: "Unani",              labelHi: "यूनानी",                      icon: FlaskConical,  accent: "#92400e", light: "#fef3c7", badge: "bg-amber-700 text-white" },
  { key: "acupuncture",     label: "Acupuncture",        labelHi: "एक्यूपंक्चर",                 icon: Crosshair,     accent: "#9f1239", light: "#ffe4e6", badge: "bg-rose-700 text-white" },
  { key: "allied_health",   label: "Allied Health",      labelHi: "पैरामेडिकल",                  icon: Stethoscope,   accent: "#1e40af", light: "#dbeafe", badge: "bg-blue-700 text-white" },
];

const ITEMS_PER_PAGE = 20;

function getCourseType(name) {
  const n = name.toUpperCase();
  if (n.startsWith("ADVANCED DIPLOMA") || n.startsWith("POST GRADUATE DIPLOMA") || n.startsWith("POST DIPLOMA")) return "Adv. Diploma";
  if (n.startsWith("DIPLOMA")) return "Diploma";
  if (n.startsWith("CERTIFICATE")) return "Certificate";
  if (n.startsWith("MASTER")) return "Master";
  return "Program";
}

function getDurColor(dur) {
  const map = {
    "3 Months":  ["#fef2f2","#b91c1c"],
    "6 Months":  ["#fff7ed","#c2410c"],
    "1 Year":    ["#f0fdf4","#166534"],
    "2 Years":   ["#f0fdf4","#0E3320"],
    "3 Years":   ["#f0fdfa","#0f766e"],
    "3.5 Years": ["#f0fdfa","#0f766e"],
    "4 Years":   ["#eff6ff","#1e40af"],
    "5 Years":   ["#faf5ff","#7e22ce"],
  };
  return map[dur] || ["#f5f0e8","#5c4033"];
}


export default function CoursesPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [courses, setCourses]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [apiError, setApiError]     = useState(null);
  const [searchQuery, setSearchQuery]     = useState("");
  const [selectedDuration, setSelectedDuration] = useState("All");
  const [activeCategory, setActiveCategory]     = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode]       = useState("grid"); // "grid" | "table"
  const [expandedRow, setExpandedRow] = useState(null);

  useEffect(() => {
    fetch(`/api/public/courses?t=${Date.now()}`, { cache: "no-store" })
      .then(r => r.json())
      .then(d => {
        if (d.ok) setCourses(d.data || []);
        else setApiError(d.error || "Failed to load courses");
      })
      .catch(e => setApiError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const catCounts = useMemo(() => {
    const m = { all: courses.length };
    courses.forEach(c => { m[c.category] = (m[c.category] || 0) + 1; });
    return m;
  }, [courses]);

  const availableDurations = useMemo(() => {
    const base = activeCategory === "all" ? courses : courses.filter(c => c.category === activeCategory);
    const set = new Set(base.map(c => c.duration_label));
    return ["All", ...DURATION_ORDER.filter(d => set.has(d))];
  }, [courses, activeCategory]);

  const filtered = useMemo(() => {
    return courses.filter(c => {
      const matchesCat    = activeCategory === "all" || c.category === activeCategory;
      const matchesDur    = selectedDuration === "All" || c.duration_label === selectedDuration;
      const matchesSearch = !searchQuery || c.course_name.toLowerCase().includes(searchQuery.toLowerCase()) || (c.course_name_hindi || "").includes(searchQuery);
      return matchesCat && matchesDur && matchesSearch;
    });
  }, [courses, activeCategory, selectedDuration, searchQuery]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated  = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleCategoryChange = (key) => {
    setActiveCategory(key);
    setSelectedDuration("All");
    setSearchQuery("");
    setCurrentPage(1);
  };

  const currentCat = CATEGORIES.find(c => c.key === activeCategory);
  const hasFilters  = searchQuery || selectedDuration !== "All";

  const pageNumbers = useMemo(() => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || Math.abs(i - currentPage) <= 1) {
        pages.push({ type: "page", num: i });
      } else if (Math.abs(i - currentPage) === 2) {
        const last = pages[pages.length - 1];
        if (!last || last.type !== "dots") pages.push({ type: "dots", key: `dots-${i}` });
      }
    }
    return pages;
  }, [totalPages, currentPage]);

  return (
    <main className="min-h-screen bg-[#F0EDE7] text-[#0E3320]">
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* ══════════════ HERO ══════════════ */}
      <section className="relative bg-[#071F13] overflow-hidden">
        {/* BG image */}
        <div className="absolute inset-0">
          <img src="/images/hero/hero-meditation.jpg" alt="" className="w-full h-full object-cover opacity-30 object-center" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#071F13]/80 via-[#0E3320]/70 to-[#071F13]" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-14 md:py-20">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-[#C59B3F] font-semibold uppercase tracking-wider mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-[#C59B3F]/50">/</span>
            <span className="text-white/70">Courses</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#C59B3F]/15 border border-[#C59B3F]/30 text-[#E4BF64] text-xs font-semibold tracking-wider">
                <GraduationCap className="w-3.5 h-3.5" />
                Session 2026–27 · Admissions Open
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                Explore Our<br />
                <span className="text-[#C59B3F]">Courses & Programs</span>
              </h1>
              <p className="text-[#A8C5B0] text-sm sm:text-base leading-relaxed">
                Authentic Ayurveda, Yoga, Unani, Acupuncture & Allied Health programs — government-recognised, industry-ready qualifications.
              </p>
              {/* Stats row */}
              {!loading && (
                <div className="flex flex-wrap gap-3 pt-1">
                  {[
                    { label: "Total Courses", val: courses.length },
                    { label: "Disciplines",   val: 5 },
                    { label: "Min Duration",  val: "3 Mo." },
                    { label: "Max Duration",  val: "5 Yrs" },
                  ].map(s => (
                    <div key={s.label} className="px-4 py-2 rounded-xl bg-white/8 border border-white/10 text-center backdrop-blur-sm">
                      <div className="text-white font-extrabold text-lg leading-none">{s.val}</div>
                      <div className="text-[#A8C5B0] text-[10px] font-medium mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link href="/admissions/registration-form"
              className="self-start lg:self-end inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#C59B3F] hover:bg-[#D4AF37] text-[#071F13] font-extrabold text-sm shadow-lg transition-all hover:scale-105">
              Apply Now
            </Link>
          </div>
        </div>

        {/* Fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#F0EDE7] to-transparent" />
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 space-y-6">

        {/* ══════════════ CATEGORY TABS ══════════════ */}
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => {
            const Icon = cat.icon;
            const isActive = activeCategory === cat.key;
            const count = catCounts[cat.key] || 0;
            return (
              <button key={cat.key} onClick={() => handleCategoryChange(cat.key)}
                style={isActive ? { backgroundColor: cat.accent, borderColor: cat.accent } : {}}
                className={`group flex items-center gap-2 px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl border-2 text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "text-white shadow-lg scale-[1.02]"
                    : "bg-white border-[#DDD6CB] text-[#3D2B1A] hover:border-[#C59B3F] hover:bg-[#FFFBF5] hover:shadow-sm"
                }`}>
                <span className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  isActive ? "bg-white/20" : "bg-[#F0EDE7] group-hover:bg-[#FDF8EE]"
                }`}>
                  <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isActive ? "text-white" : "text-[#C59B3F]"}`} />
                </span>
                <span>{cat.label}</span>
                <span className={`text-[10px] sm:text-[11px] px-1.5 sm:px-2 py-0.5 rounded-full font-bold leading-none min-w-[22px] text-center ${
                  isActive ? "bg-white/25 text-white" : "bg-[#EDE7DE] text-[#5C4033]"
                }`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ══════════════ FILTER BAR ══════════════ */}
        <div className="bg-white rounded-2xl border border-[#E0D6C8] shadow-sm overflow-hidden">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-0 sm:divide-x divide-[#EDE7DE]">
            {/* Search */}
            <div className="relative flex-1 min-w-0">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#B8A898]" />
              <input type="text"
                placeholder={`Search in ${currentCat?.label || 'courses'}…`}
                value={searchQuery}
                onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-11 pr-4 py-3.5 text-sm bg-transparent focus:outline-none placeholder:text-[#B8A898] text-[#0E3320]" />
            </div>
            {/* Duration */}
            <div className="flex items-center gap-2.5 px-4 py-3">
              <SlidersHorizontal className="w-4 h-4 text-[#C59B3F] shrink-0" />
              <select value={selectedDuration}
                onChange={e => { setSelectedDuration(e.target.value); setCurrentPage(1); }}
                className="bg-transparent text-sm font-semibold focus:outline-none text-[#3D2B1A] cursor-pointer pr-2">
                {availableDurations.map(d => (
                  <option key={d} value={d}>{d === "All" ? "All Durations" : d}</option>
                ))}
              </select>
            </div>
            {/* Clear */}
            {hasFilters && (
              <button onClick={() => { setSearchQuery(""); setSelectedDuration("All"); setCurrentPage(1); }}
                className="flex items-center gap-1.5 px-4 py-3.5 text-sm font-bold text-[#c05454] hover:bg-red-50 transition-colors cursor-pointer shrink-0">
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
          {/* Active filter pills */}
          {hasFilters && (
            <div className="px-4 pb-3 flex flex-wrap gap-1.5 border-t border-[#F0EDE7] pt-2.5">
              {searchQuery && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#0E3320]/8 text-[#0E3320]">
                  "{searchQuery}"
                  <button onClick={() => { setSearchQuery(""); setCurrentPage(1); }} className="hover:text-red-600 ml-0.5">×</button>
                </span>
              )}
              {selectedDuration !== "All" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full bg-[#0E3320]/8 text-[#0E3320]">
                  <Clock className="w-3 h-3" />{selectedDuration}
                  <button onClick={() => { setSelectedDuration("All"); setCurrentPage(1); }} className="hover:text-red-600 ml-0.5">×</button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* ══════════════ RESULTS INFO + VIEW TOGGLE ══════════════ */}
        {!loading && filtered.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-semibold text-[#9B8265] px-0.5">
            <span className="shrink-0">
              <span className="text-[#0E3320] font-extrabold text-sm">{filtered.length}</span> course{filtered.length !== 1 ? "s" : ""} found
              {activeCategory !== "all" && <span className="ml-1 hidden sm:inline">in <span className="text-[#C59B3F] font-bold">{currentCat?.label}</span></span>}
            </span>
            <div className="flex items-center gap-2 ml-auto">
              {totalPages > 1 && viewMode === "grid" && (
                <span className="px-2.5 py-1 rounded-full bg-white border border-[#E0D6C8] text-[#7A6550] font-bold text-[11px] whitespace-nowrap">
                  Pg {currentPage}/{totalPages}
                </span>
              )}
              {/* View toggle */}
              <div className="flex items-center bg-white border border-[#E0D6C8] rounded-xl overflow-hidden shadow-sm shrink-0">
                <button onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1 px-2.5 py-2 text-xs font-bold transition-colors cursor-pointer ${viewMode === "grid" ? "bg-[#0E3320] text-[#E4BF64]" : "text-[#9B8265] hover:bg-[#F5F0E8]"}`}>
                  <LayoutGrid className="w-3.5 h-3.5" /><span className="hidden sm:inline">Cards</span>
                </button>
                <button onClick={() => setViewMode("table")}
                  className={`flex items-center gap-1 px-2.5 py-2 text-xs font-bold transition-colors cursor-pointer border-l border-[#E0D6C8] ${viewMode === "table" ? "bg-[#0E3320] text-[#E4BF64]" : "text-[#9B8265] hover:bg-[#F5F0E8]"}`}>
                  <List className="w-3.5 h-3.5" /><span className="hidden sm:inline">Table</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════ COURSE GRID / TABLE ══════════════ */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-28 gap-4">
            <RefreshCw className="w-8 h-8 text-[#C59B3F] animate-spin" />
            <p className="text-sm text-[#9B8265] font-medium">Loading courses…</p>
          </div>
        ) : apiError ? (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">
            <p className="text-red-700 font-bold text-sm">API Error: {apiError}</p>
            <p className="text-red-500 text-xs mt-1">Check the server console for details.</p>
          </div>

        ) : paginated.length === 0 ? (
          <div className="bg-white rounded-3xl p-16 text-center border border-[#E0D6C8] space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-[#F0EDE7] flex items-center justify-center mx-auto">
              <BookOpen className="w-8 h-8 text-[#C59B3F]" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-[#0E3320]">No Courses Found</h3>
              <p className="text-sm text-[#9B8265] mt-1">Try a different search term or filter.</p>
            </div>
            <button onClick={() => { setSearchQuery(""); setSelectedDuration("All"); setCurrentPage(1); }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0E3320] text-[#E4BF64] text-sm font-bold cursor-pointer hover:bg-[#1A5C38] transition-colors shadow-md">
              Reset Filters
            </button>
          </div>

        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginated.map((course, idx) => {
              const dur     = course.duration_label || "";
              const [durBg, durText] = getDurColor(dur);
              const type    = getCourseType(course.course_name);
              const catObj  = CATEGORIES.find(c => c.key === course.category) || CATEGORIES[0];
              const globalN = (currentPage - 1) * ITEMS_PER_PAGE + idx + 1;

              return (
                <div key={course.id}
                  className="group relative bg-white border border-[#E0D6C8] rounded-2xl overflow-hidden flex flex-col hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200">
                  {/* Top accent stripe */}
                  <div className="h-[4px] w-full" style={{ backgroundColor: catObj.accent }} />

                  {/* Card header: code + duration */}
                  <div className="flex items-center justify-between gap-2 px-4 pt-3.5 pb-0">
                    {course.course_code ? (
                      <span className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg bg-[#0E3320] text-[#E4BF64] tracking-widest font-mono">
                        {course.course_code}
                      </span>
                    ) : (
                      <span className="text-[11px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg"
                        style={{ backgroundColor: catObj.light, color: catObj.accent }}>
                        {type}
                      </span>
                    )}
                    {dur && (
                      <span className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-lg shrink-0"
                        style={{ backgroundColor: durBg, color: durText }}>
                        <Clock className="w-3 h-3" />{dur}
                      </span>
                    )}
                  </div>

                  <div className="px-4 pt-2.5 pb-4 flex flex-col flex-1 gap-3">
                    {/* Course names */}
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-[#0E3320] leading-snug line-clamp-2 group-hover:text-[#1A5C38] transition-colors">
                        {course.course_name}
                      </h3>
                      {course.course_name_hindi && (
                        <p className="text-xs text-[#9B7A50] leading-snug line-clamp-1"
                          style={{ fontFamily: "'Noto Sans Devanagari', serif" }}>
                          {course.course_name_hindi}
                        </p>
                      )}
                    </div>

                    {/* Divider */}
                    <div className="h-px bg-[#F0EDE7]" />

                    {/* Eligibility */}
                    <div className="space-y-1">
                      <p className="text-[10px] font-extrabold text-[#9B8265] uppercase tracking-widest">Eligibility</p>
                      <p className="text-xs text-[#3D2B1A] leading-snug line-clamp-2">
                        {course.eligibility || <span className="text-[#C5BDB5]">—</span>}
                      </p>
                    </div>

                    {/* Career Scope */}
                    {course.career_scope && (
                      <div className="space-y-1">
                        <p className="text-[10px] font-extrabold text-[#9B8265] uppercase tracking-widest flex items-center gap-1">
                          <Briefcase className="w-3 h-3 text-[#C59B3F]" /> Work Areas
                        </p>
                        <p className="text-xs text-[#3D2B1A] leading-snug line-clamp-2">
                          {course.career_scope}
                        </p>
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto pt-2 border-t border-[#F0EDE7] flex items-center justify-between">
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full tracking-wider"
                        style={{ backgroundColor: catObj.light, color: catObj.accent }}>
                        {catObj.label}
                      </span>
                      <span className="text-[10px] font-bold text-[#C59B3F] opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-0.5">
                        Details
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        ) : (
          /* ══ TABLE VIEW ══ */
          <div className="bg-white rounded-2xl border border-[#E0D6C8] overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#0E3320] text-white">
                    <th className="px-3 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider w-10">#</th>
                    <th className="px-3 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider w-20">Code</th>
                    <th className="px-3 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider min-w-[200px]">Course Name</th>
                    <th className="px-3 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider w-24">Duration</th>
                    <th className="px-3 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider w-28">Discipline</th>
                    <th className="px-3 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider min-w-[160px]">Eligibility</th>
                    <th className="px-3 py-3 text-left text-[11px] font-extrabold uppercase tracking-wider w-8" />
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((course, idx) => {
                    const catObj  = CATEGORIES.find(c => c.key === course.category) || CATEGORIES[0];
                    const dur     = course.duration_label || "";
                    const [durBg, durText] = getDurColor(dur);
                    const isExpanded = expandedRow === course.id;
                    const globalN = idx + 1;
                    return (
                      <Fragment key={course.id}>
                        <tr
                          onClick={() => setExpandedRow(isExpanded ? null : course.id)}
                          className={`border-t border-[#F0EDE7] cursor-pointer transition-colors ${isExpanded ? "bg-[#F5F2EE]" : "hover:bg-[#FAFAF8]"}`}>
                          <td className="px-3 py-3 text-[#9B8265] text-xs font-bold">{globalN}</td>
                          <td className="px-3 py-3">
                            {course.course_code
                              ? <span className="text-[11px] font-extrabold px-2 py-0.5 rounded bg-[#0E3320] text-[#E4BF64] font-mono">{course.course_code}</span>
                              : <span className="text-[#C5BDB5] text-xs">—</span>}
                          </td>
                          <td className="px-3 py-3">
                            <div className="font-bold text-[#0E3320] text-sm leading-snug">{course.course_name}</div>
                            {course.course_name_hindi && (
                              <div className="text-xs text-[#9B7A50] mt-0.5" style={{ fontFamily: "'Noto Sans Devanagari', serif" }}>
                                {course.course_name_hindi}
                              </div>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            {dur && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-lg"
                                style={{ backgroundColor: durBg, color: durText }}>
                                <Clock className="w-3 h-3" />{dur}
                              </span>
                            )}
                          </td>
                          <td className="px-3 py-3">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full"
                              style={{ backgroundColor: catObj.light, color: catObj.accent }}>
                              {catObj.label}
                            </span>
                          </td>
                          <td className="px-3 py-3 text-xs text-[#5C4033]">
                            {course.eligibility || <span className="text-[#C5BDB5]">—</span>}
                          </td>
                          <td className="px-3 py-3 text-center">
                            <ChevronRightIcon className={`w-4 h-4 text-[#C59B3F] transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          </td>
                        </tr>
                        {isExpanded && course.career_scope && (
                          <tr className="bg-[#F5F2EE] border-t border-[#EDE7DE]">
                            <td colSpan={7} className="px-5 py-3">
                              <div className="flex items-start gap-2.5">
                                <Briefcase className="w-4 h-4 text-[#C59B3F] shrink-0 mt-0.5" />
                                <div>
                                  <span className="text-[11px] font-extrabold text-[#0E3320] uppercase tracking-wider">Work Areas / Career Scope:</span>
                                  <p className="text-xs text-[#5C4033] mt-0.5 leading-relaxed">{course.career_scope}</p>
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div className="px-4 py-3 bg-[#FAF8F5] border-t border-[#EDE7DE] flex items-center justify-between text-xs text-[#9B8265]">
              <span>Showing all <strong className="text-[#0E3320]">{filtered.length}</strong> courses · Click a row to see Career Scope</span>
            </div>
          </div>
        )}

        {/* ══════════════ PAGINATION (grid only) ══════════════ */}
        {viewMode === "grid" && totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-4">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-white text-sm font-bold text-[#3D2B1A] disabled:opacity-30 hover:border-[#C59B3F] hover:bg-[#FFFBF5] transition-colors cursor-pointer disabled:cursor-default shadow-sm">
              <ChevronLeft className="w-4 h-4" /> Prev
            </button>

            <div className="flex items-center gap-1.5">
              {pageNumbers.map((item, idx) =>
                item.type === "dots"
                  ? <span key={item.key} className="w-9 text-center text-[#9B8265] text-sm font-bold">…</span>
                  : (
                    <button key={item.num} onClick={() => setCurrentPage(item.num)}
                      className={`w-10 h-10 rounded-xl text-sm font-bold transition-all cursor-pointer shadow-sm ${
                        item.num === currentPage
                          ? "bg-[#0E3320] text-[#E4BF64] shadow-md scale-105"
                          : "bg-white border border-[#D5C7B5] text-[#3D2B1A] hover:border-[#C59B3F] hover:bg-[#FFFBF5]"
                      }`}>
                      {item.num}
                    </button>
                  )
              )}
            </div>

            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-white text-sm font-bold text-[#3D2B1A] disabled:opacity-30 hover:border-[#C59B3F] hover:bg-[#FFFBF5] transition-colors cursor-pointer disabled:cursor-default shadow-sm">
              Next <ChevronRightIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* ══════════════ CTA BANNER ══════════════ */}
        {!loading && filtered.length > 0 && (
          <div className="mt-4 rounded-3xl overflow-hidden relative bg-[#071F13] text-white">
            <div className="absolute inset-0 opacity-20 bg-[url('/images/yoga/yoga-banner.jpg')] bg-cover bg-center" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#071F13] via-[#0E3320]/90 to-[#071F13]/70" />
            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 px-6 sm:px-10 py-8">
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-white">Ready to Enroll?</h3>
                <p className="text-[#A8C5B0] text-sm mt-1">Session 2026-27 admissions are open. Apply before seats fill up.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link href="/admissions/registration-form"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-[#C59B3F] hover:bg-[#D4AF37] text-[#071F13] font-extrabold text-sm shadow-lg transition-all hover:scale-105">
                  Apply Now
                </Link>
                <Link href="/contact"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full border-2 border-white/30 text-white hover:bg-white/10 font-bold text-sm transition-all">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        )}

      </div>

      <Footer />
      <ConsultationModal isOpen={isConsultationOpen} onClose={() => setIsConsultationOpen(false)} />
    </main>
  );
}
