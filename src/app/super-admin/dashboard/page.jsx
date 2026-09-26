"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  Users,
  Award,
  Building2,
  Activity,
  LogOut,
  Bell,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  ExternalLink,
  BookOpen,
  FileCheck,
  ChevronRight,
  RefreshCw,
  AlertTriangle,
  Image as ImageIcon,
  Phone,
  Share2,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  Info
} from "lucide-react";

import GalleryManager from "@/components/admin/GalleryManager";
import ContactManager from "@/components/admin/ContactManager";
import SocialLinksManager from "@/components/admin/SocialLinksManager";
import InstituteManager from "@/components/admin/InstituteManager";

export default function SuperAdminDashboardPage() {
  const router = useRouter();

  // Navigation tab state
  const [activeTab, setActiveTab] = useState("overview"); // overview | gallery | contact | social | institutes | certificates
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // User & System states
  const [adminUser, setAdminUser] = useState({
    email: "superadmin@bhartiyaayurveda.org",
    role: "Super Administrator",
  });
  const [currentTime, setCurrentTime] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Dynamic counts for overview cards
  const [instituteCount, setInstituteCount] = useState(14);
  const [galleryCount, setGalleryCount] = useState(6);

  // Toast Notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  useEffect(() => {
    // Check if session exists in storage
    if (typeof window !== "undefined") {
      const stored =
        localStorage.getItem("bhartiya_admin_session") ||
        sessionStorage.getItem("bhartiya_admin_session");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          setAdminUser(parsed);
        } catch (e) {
          // ignore
        }
      }

      // Check current institute count
      const instData = localStorage.getItem("bhartiya_admin_institutes");
      if (instData) {
        try {
          setInstituteCount(JSON.parse(instData).length);
        } catch (e) {}
      }

      // Check current gallery count
      const galData = localStorage.getItem("bhartiya_admin_gallery");
      if (galData) {
        try {
          setGalleryCount(JSON.parse(galData).length);
        } catch (e) {}
      }
    }

    // Set real-time clock
    const updateClock = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleDateString("en-IN", {
          weekday: "short",
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("bhartiya_admin_session");
      sessionStorage.removeItem("bhartiya_admin_session");
    }
    router.push("/super-admin/login");
  };

  // Mock verification records
  const recentRecords = [
    {
      id: "CERT-2026-8812",
      studentName: "Dr. Rajeshwar Sharma",
      course: "Post Graduate Diploma in Panchakarma (PGDP)",
      institute: "Haridwar Ayurvedic Mahavidyalaya",
      date: "23 Sep 2026",
      status: "Approved",
    },
    {
      id: "CERT-2026-8811",
      studentName: "Priyanka Mishra",
      course: "Diploma in Naturopathy & Yoga Sciences (DNYS)",
      institute: "Rishikesh Vedic Health Academy",
      date: "23 Sep 2026",
      status: "Approved",
    },
    {
      id: "CERT-2026-8810",
      studentName: "Amit Kumar Verma",
      course: "Certificate in Ayurvedic Dietetics (CAD)",
      institute: "Kashi Institute of Traditional Medicine",
      date: "22 Sep 2026",
      status: "Pending Review",
    },
    {
      id: "CERT-2026-8809",
      studentName: "Sunita Deshmukh",
      course: "Ayurvedic Spa & Herbal Therapy (ASHT)",
      institute: "Pune Ayurveda Research Center",
      date: "22 Sep 2026",
      status: "Approved",
    },
    {
      id: "CERT-2026-8808",
      studentName: "Vikramaditya Rao",
      course: "Advanced Yoga & Marma Chikitsa (AYMC)",
      institute: "Kerala Ayurvedic College & Hospital",
      date: "21 Sep 2026",
      status: "Flagged",
    },
  ];

  const filteredRecords = recentRecords.filter((rec) => {
    const matchesSearch =
      rec.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.course.toLowerCase().includes(searchQuery.toLowerCase());
    if (selectedFilter === "all") return matchesSearch;
    if (selectedFilter === "approved") return matchesSearch && rec.status === "Approved";
    if (selectedFilter === "pending") return matchesSearch && rec.status === "Pending Review";
    if (selectedFilter === "flagged") return matchesSearch && rec.status === "Flagged";
    return matchesSearch;
  });

  const navigationItems = [
    { id: "overview", label: "Overview & Metrics", icon: LayoutDashboard },
    { id: "gallery", label: "Gallery Management", icon: ImageIcon, badge: galleryCount },
    { id: "contact", label: "Contact Info Management", icon: Phone },
    { id: "social", label: "Social Media Links", icon: Share2 },
    { id: "institutes", label: "Affiliated Institutes", icon: Building2, badge: instituteCount },
    { id: "certificates", label: "Certificate Ledger", icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#0E3320] flex flex-col selection:bg-[#C59B3F] selection:text-white">
      
      {/* Toast Notification Notification Banner */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0E3320] text-white shadow-2xl border border-[#C59B3F]/40 animate-fadeIn">
          {toast.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : toast.type === "error" ? (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          ) : (
            <Info className="w-5 h-5 text-[#C59B3F] shrink-0" />
          )}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button
            onClick={() => setToast({ show: false, message: "", type: "success" })}
            className="text-white/60 hover:text-white ml-2 p-0.5"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Super Admin Header */}
      <header className="sticky top-0 z-40 bg-[#0E3320] text-white border-b border-[#C59B3F]/30 shadow-md">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
          
          {/* Logo & Mobile Menu Toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
              className="lg:hidden p-2 rounded-xl bg-white/10 text-white hover:bg-white/20 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-28 h-10 shrink-0 bg-white/95 rounded-lg px-1.5 py-1 transition-transform group-hover:scale-105">
                <Image src="/logo.png" alt="Bhartiya Ayurveda" fill sizes="128px" className="object-contain" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#C59B3F]/20 text-[#F3D68B] text-[10px] font-bold tracking-wider uppercase border border-[#C59B3F]/40">
                    <ShieldCheck className="w-3 h-3 text-[#C59B3F]" />
                    Super Admin Console
                  </span>
                </div>
                <span className="text-[11px] text-[#DDD1BE] block sm:hidden">
                  Super Admin Management
                </span>
              </div>
            </Link>
          </div>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Real-time Clock */}
            <div className="hidden md:flex flex-col text-right text-[11px] text-[#DDD1BE]">
              <span className="font-mono text-emerald-400 font-semibold">{currentTime || "Connected"}</span>
              <span className="text-[10px] text-white/60">Server Time (IST)</span>
            </div>

            {/* Notification Bell */}
            <div className="relative p-2 rounded-xl bg-white/5 border border-white/10 text-[#DDD1BE] hover:text-white cursor-pointer transition-colors">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#C59B3F]" />
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
              <div className="w-8 h-8 rounded-full bg-[#C59B3F] text-[#071F13] font-bold text-xs flex items-center justify-center shadow-inner">
                SA
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-white leading-tight">
                  {adminUser.email?.split("@")[0] || "Super Admin"}
                </div>
                <div className="text-[10px] text-[#C59B3F] font-medium">Master Access</div>
              </div>
            </div>

            {/* Logout Action */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 text-red-200 text-xs font-semibold transition-all"
              title="Logout from Super Admin Console"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace with Sidebar */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 gap-4 sm:gap-6 relative">
        
        {/* Sidebar Navigation (Desktop Persistent + Mobile Drawer) */}
        <aside
          className={`fixed lg:static top-[65px] left-0 bottom-0 z-30 w-64 max-h-[calc(100vh-65px)] overflow-y-auto bg-[#0E3320] lg:bg-transparent text-white lg:text-[#0E3320] p-4 lg:p-0 transition-transform duration-300 lg:translate-x-0 ${
            mobileSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:block"
          }`}
        >
          <div className="sticky top-24 space-y-1 bg-white lg:p-3 lg:rounded-2xl lg:border lg:border-[#DDD1BE] lg:shadow-sm">
            <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#5C8261]">
              Management Navigation
            </div>

            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all text-left ${
                    isActive
                      ? "bg-[#0E3320] text-white shadow-sm"
                      : "text-[#5C8261] hover:text-[#0E3320] hover:bg-[#FAF8F5]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? "text-[#C59B3F]" : "text-[#5C8261]"}`} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? "bg-[#C59B3F] text-[#071F13]"
                          : "bg-[#E6EFE9] text-[#1E603D]"
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}

            {/* Quick Links divider */}
            <div className="pt-4 mt-3 border-t border-[#DDD1BE]/60 px-3 space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#5C8261] block">
                Public Shortcuts
              </span>
              <Link
                href="/gallery"
                target="_blank"
                className="flex items-center justify-between text-xs text-[#5C8261] hover:text-[#0E3320] py-1"
              >
                <span>Live Gallery</span>
                <ExternalLink className="w-3 h-3 text-[#C59B3F]" />
              </Link>
              <Link
                href="/contact"
                target="_blank"
                className="flex items-center justify-between text-xs text-[#5C8261] hover:text-[#0E3320] py-1"
              >
                <span>Live Contact Page</span>
                <ExternalLink className="w-3 h-3 text-[#C59B3F]" />
              </Link>
              <Link
                href="/affiliated-institutes"
                target="_blank"
                className="flex items-center justify-between text-xs text-[#5C8261] hover:text-[#0E3320] py-1"
              >
                <span>Live Colleges List</span>
                <ExternalLink className="w-3 h-3 text-[#C59B3F]" />
              </Link>
            </div>
          </div>
        </aside>

        {/* Backdrop for mobile drawer */}
        {mobileSidebarOpen && (
          <div
            onClick={() => setMobileSidebarOpen(false)}
            className="fixed inset-0 z-20 bg-black/50 lg:hidden"
          />
        )}

        {/* Main Content Area */}
        <main className="flex-1 min-w-0">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-8">
              {/* Welcome Banner */}
              <div className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-r from-[#0E3320] via-[#15482D] to-[#071F13] text-white border border-[#C59B3F]/30 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 relative overflow-hidden">
                <div className="relative z-10 space-y-2">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-medium border border-emerald-500/30">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    Master System Active &amp; Synchronized
                  </div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-white">
                    Super Admin Operations Hub
                  </h1>
                  <p className="text-xs sm:text-sm text-[#DDD1BE] max-w-2xl leading-relaxed">
                    Centrally govern photo galleries, official contact channels, verified social media handles, affiliated colleges, and student diploma certifications.
                  </p>
                </div>

                <div className="relative z-10 flex flex-wrap items-center gap-2.5 sm:gap-3">
                  <button
                    onClick={() => setActiveTab("gallery")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C59B3F] hover:bg-[#AC822D] text-[#071F13] font-bold text-xs transition-all shadow-md"
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Manage Gallery</span>
                  </button>
                  <button
                    onClick={() => setActiveTab("institutes")}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/20 transition-all"
                  >
                    <Building2 className="w-4 h-4 text-[#C59B3F]" />
                    <span>Manage Colleges</span>
                  </button>
                </div>
              </div>

              {/* 4 Key Stat Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div
                  onClick={() => setActiveTab("institutes")}
                  className="p-5 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm hover:shadow-md hover:border-[#C59B3F] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C8261]">
                      Affiliated Centers
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#F3F6F3] text-[#15482D] flex items-center justify-center">
                      <Building2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-serif text-[#0E3320]">{instituteCount}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8C671D] font-medium mt-1">
                    <span>Across 18 Indian States</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("gallery")}
                  className="p-5 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm hover:shadow-md hover:border-[#C59B3F] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C8261]">
                      Gallery Photos
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#E6EFE9] text-[#1E603D] flex items-center justify-center">
                      <ImageIcon className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-serif text-[#0E3320]">{galleryCount}</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-700 font-medium mt-1">
                    <span>Published to Website</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("contact")}
                  className="p-5 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm hover:shadow-md hover:border-[#C59B3F] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C8261]">
                      Helplines &amp; Desks
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-[#F5F0E8] text-[#8C671D] flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-serif text-[#0E3320]">4 Lines</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#8C671D] font-medium mt-1">
                    <span>Phone, WhatsApp &amp; Inboxes</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                <div
                  onClick={() => setActiveTab("social")}
                  className="p-5 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm hover:shadow-md hover:border-[#C59B3F] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#5C8261]">
                      Social Channels
                    </span>
                    <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                      <Share2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-2xl font-bold font-serif text-[#0E3320]">7 Profiles</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-purple-700 font-medium mt-1">
                    <span>Active Community Reach</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="space-y-3">
                <h2 className="text-lg font-serif font-bold text-[#0E3320]">
                  Immediate Management Modules
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Card 1 */}
                  <div
                    onClick={() => setActiveTab("gallery")}
                    className="p-4 rounded-2xl bg-white border border-[#DDD1BE] hover:border-[#C59B3F] hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#E6EFE9] text-[#1E603D] flex items-center justify-center mb-3 group-hover:bg-[#0E3320] group-hover:text-[#C59B3F] transition-colors">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0E3320]">Photo Gallery</h3>
                    <p className="text-xs text-[#5C8261] mt-0.5">Upload photos, edit titles, and select categories</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C671D] mt-3 group-hover:translate-x-1 transition-transform">
                      <span>Manage Photos</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Card 2 */}
                  <div
                    onClick={() => setActiveTab("contact")}
                    className="p-4 rounded-2xl bg-white border border-[#DDD1BE] hover:border-[#C59B3F] hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F5F0E8] text-[#8C671D] flex items-center justify-center mb-3 group-hover:bg-[#0E3320] group-hover:text-[#C59B3F] transition-colors">
                      <Phone className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0E3320]">Contact &amp; Location</h3>
                    <p className="text-xs text-[#5C8261] mt-0.5">Edit phone numbers, email desks, and address details</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C671D] mt-3 group-hover:translate-x-1 transition-transform">
                      <span>Update Contacts</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Card 3 */}
                  <div
                    onClick={() => setActiveTab("social")}
                    className="p-4 rounded-2xl bg-white border border-[#DDD1BE] hover:border-[#C59B3F] hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center mb-3 group-hover:bg-[#0E3320] group-hover:text-[#C59B3F] transition-colors">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0E3320]">Social Links</h3>
                    <p className="text-xs text-[#5C8261] mt-0.5">Toggle and update handles for YouTube, Instagram, X</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C671D] mt-3 group-hover:translate-x-1 transition-transform">
                      <span>Edit Profiles</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                  {/* Card 4 */}
                  <div
                    onClick={() => setActiveTab("institutes")}
                    className="p-4 rounded-2xl bg-white border border-[#DDD1BE] hover:border-[#C59B3F] hover:shadow-md transition-all cursor-pointer group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#F3F6F3] text-[#15482D] flex items-center justify-center mb-3 group-hover:bg-[#0E3320] group-hover:text-[#C59B3F] transition-colors">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-sm font-bold text-[#0E3320]">Affiliated Centers</h3>
                    <p className="text-xs text-[#5C8261] mt-0.5">Register new institutes, verify dean details and code</p>
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C671D] mt-3 group-hover:translate-x-1 transition-transform">
                      <span>Manage Colleges</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>

              {/* Master Registry & Recent Certification Ledger */}
              <div className="rounded-3xl bg-white border border-[#DDD1BE] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#DDD1BE] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-base font-serif font-bold text-[#0E3320]">
                      Recent Certificate &amp; Credential Ledger
                    </h2>
                    <p className="text-xs text-[#5C8261] mt-0.5">
                      Live chronological audit trail of certified Ayurvedic practitioners
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setActiveTab("certificates")}
                      className="text-xs font-bold text-[#8C671D] hover:text-[#0E3320] underline transition-colors"
                    >
                      View Full Registry →
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[#0E3320] uppercase font-bold tracking-wider border-b border-[#DDD1BE]">
                      <tr>
                        <th className="py-3 px-6">ID</th>
                        <th className="py-3 px-6">Candidate</th>
                        <th className="py-3 px-6">Course</th>
                        <th className="py-3 px-6">Affiliated Center</th>
                        <th className="py-3 px-6">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DDD1BE]/60 text-[#0E3320]">
                      {recentRecords.slice(0, 3).map((item) => (
                        <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="py-3.5 px-6 font-mono font-bold text-[#15482D]">
                            {item.id}
                          </td>
                          <td className="py-3.5 px-6 font-semibold">
                            {item.studentName}
                          </td>
                          <td className="py-3.5 px-6 text-[#5C8261]">
                            {item.course}
                          </td>
                          <td className="py-3.5 px-6 text-[#5C8261]">
                            {item.institute}
                          </td>
                          <td className="py-3.5 px-6">
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              Approved
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: GALLERY MANAGEMENT */}
          {activeTab === "gallery" && (
            <GalleryManager onShowToast={showToast} />
          )}

          {/* TAB 3: CONTACT INFO MANAGEMENT */}
          {activeTab === "contact" && (
            <ContactManager onShowToast={showToast} />
          )}

          {/* TAB 4: SOCIAL LINKS MANAGEMENT */}
          {activeTab === "social" && (
            <SocialLinksManager onShowToast={showToast} />
          )}

          {/* TAB 5: AFFILIATED INSTITUTES MANAGEMENT */}
          {activeTab === "institutes" && (
            <InstituteManager onShowToast={showToast} />
          )}

          {/* TAB 6: CERTIFICATE LEDGER */}
          {activeTab === "certificates" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DDD1BE] shadow-sm">
                <div>
                  <h2 className="text-xl font-bold font-serif text-[#0E3320] flex items-center gap-2">
                    <FileCheck className="w-5 h-5 text-[#C59B3F]" />
                    Central Certificate Verification &amp; Registry
                  </h2>
                  <p className="text-xs text-[#5C8261] mt-0.5">
                    Real-time verification log for student degrees, diplomas, and state authorizations.
                  </p>
                </div>
                <Link
                  href="/certificate-verification"
                  target="_blank"
                  className="px-4 py-2 text-xs font-bold text-white bg-[#0E3320] hover:bg-[#15482D] rounded-xl shadow-sm transition-all flex items-center gap-1.5 self-start sm:self-auto"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#C59B3F]" />
                  <span>Public Verification Portal</span>
                </Link>
              </div>

              {/* Table search & filter */}
              <div className="rounded-3xl bg-white border border-[#DDD1BE] shadow-sm overflow-hidden">
                <div className="p-5 border-b border-[#DDD1BE] flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C8261]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search student or certificate ID..."
                      className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                    />
                  </div>

                  <div className="flex items-center bg-[#FAF8F5] p-1 rounded-xl border border-[#DDD1BE] text-xs">
                    <button
                      onClick={() => setSelectedFilter("all")}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        selectedFilter === "all"
                          ? "bg-[#0E3320] text-white"
                          : "text-[#5C8261] hover:text-[#0E3320]"
                      }`}
                    >
                      All
                    </button>
                    <button
                      onClick={() => setSelectedFilter("approved")}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        selectedFilter === "approved"
                          ? "bg-[#0E3320] text-white"
                          : "text-[#5C8261] hover:text-[#0E3320]"
                      }`}
                    >
                      Approved
                    </button>
                    <button
                      onClick={() => setSelectedFilter("pending")}
                      className={`px-3 py-1 rounded-lg font-medium transition-all ${
                        selectedFilter === "pending"
                          ? "bg-[#0E3320] text-white"
                          : "text-[#5C8261] hover:text-[#0E3320]"
                      }`}
                    >
                      Pending
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px] text-left text-xs">
                    <thead className="bg-[#FAF8F5] text-[#0E3320] uppercase font-bold tracking-wider border-b border-[#DDD1BE]">
                      <tr>
                        <th className="py-3.5 px-6">Certificate ID</th>
                        <th className="py-3.5 px-6">Candidate Name</th>
                        <th className="py-3.5 px-6">Ayurvedic Course</th>
                        <th className="py-3.5 px-6">Affiliated Center</th>
                        <th className="py-3.5 px-6">Status</th>
                        <th className="py-3.5 px-6 text-right">Audit Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#DDD1BE]/60 text-[#0E3320]">
                      {filteredRecords.map((item) => (
                        <tr key={item.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                          <td className="py-4 px-6 font-mono font-bold text-[#15482D]">
                            {item.id}
                          </td>
                          <td className="py-4 px-6 font-semibold">
                            {item.studentName}
                          </td>
                          <td className="py-4 px-6 text-[#5C8261]">
                            {item.course}
                          </td>
                          <td className="py-4 px-6 text-[#5C8261]">
                            {item.institute}
                          </td>
                          <td className="py-4 px-6">
                            {item.status === "Approved" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                Approved
                              </span>
                            ) : item.status === "Pending Review" ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[11px] font-bold">
                                <Clock className="w-3.5 h-3.5 text-amber-600" />
                                Pending Review
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-800 text-[11px] font-bold">
                                <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
                                Flagged
                              </span>
                            )}
                          </td>
                          <td className="py-4 px-6 text-right">
                            <Link
                              href={`/certificate-verification?id=${item.id}`}
                              className="text-[11px] font-bold text-[#8C671D] hover:text-[#0E3320] underline transition-colors"
                            >
                              Audit Record
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* Global Dashboard Footer */}
      <footer className="py-4 px-6 text-center text-xs text-[#5C8261] border-t border-[#DDD1BE] bg-white mt-12">
        Bhartiya Ayurveda Central Directorate • Super Admin Governance Console v2.4 • Confidential &amp; Protected
      </footer>
    </div>
  );
}
