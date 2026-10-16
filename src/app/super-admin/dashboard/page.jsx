"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
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
  Info,
  PowerOff,
  Power,
  WifiOff,
  ClipboardList,
  MessageSquarePlus,
  Eye,
  CheckCircle,
  XCircle,
  ChevronDown,
  GraduationCap,
  KeyRound,
  Pencil,
  Trash2,
  Copy,
  ShieldOff,
  Plus,
  BookOpen as BookOpenIcon,
  Download,
} from "lucide-react";

import GalleryManager from "@/components/admin/GalleryManager";
import ContactManager from "@/components/admin/ContactManager";
import SocialLinksManager from "@/components/admin/SocialLinksManager";
import InstituteManager from "@/components/admin/InstituteManager";
import HomePageManager from "@/components/admin/HomePageManager";

export default function SuperAdminDashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Navigation tab state — synced with ?tab= URL param
  const [activeTab, setActiveTab] = useState(() => searchParams.get("tab") || "overview");
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Maintenance mode state
  const [maintenanceOn, setMaintenanceOn] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState("");
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [settingsLoaded, setSettingsLoaded] = useState(false);

  // User & System states
  const [adminUser, setAdminUser] = useState({ username: "superadmin", full_name: "Super Admin" });
  const [currentTime, setCurrentTime] = useState({ time: "", date: "" });
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

  // Dynamic counts for overview cards
  const [instituteCount, setInstituteCount] = useState(14);
  const [galleryCount, setGalleryCount] = useState(6);

  // Applications tab state
  const [applications, setApplications] = useState([]);
  const [appLoading, setAppLoading] = useState(false);
  const [appFilter, setAppFilter] = useState("all");
  const [appSearch, setAppSearch] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [appDetailLoading, setAppDetailLoading] = useState(false);
  const [appQueries, setAppQueries] = useState([]);
  const [queryModal, setQueryModal] = useState(false);
  const [queryField, setQueryField] = useState("general");
  const [queryMsg, setQueryMsg] = useState("");
  const [querySubmitting, setQuerySubmitting] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Toast Notification state
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 4000);
  };

  // Sync activeTab → URL so refresh restores the same tab
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (activeTab === "overview") params.delete("tab");
    else params.set("tab", activeTab);
    const newUrl = params.toString() ? `?${params}` : window.location.pathname;
    window.history.replaceState(null, "", newUrl);
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === "applications") loadApplications();
    if (activeTab === "colleges") loadColleges();
    if (activeTab === "courses") loadCourses();
    if (activeTab === "exam") { loadExamSessions(); loadExamCenters(); }
    if (activeTab === "inquiries") loadInquiries();
    if (activeTab === "announcements") loadAnnouncements();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, appFilter]);

  useEffect(() => {
    // Verify admin session via API
    fetch("/api/admin/me")
      .then((r) => r.json())
      .then((d) => { if (d.admin) setAdminUser(d.admin); })
      .catch(() => {});

    // Load maintenance settings
    fetch("/api/admin/settings", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (d.settings) {
          setMaintenanceOn(d.settings.maintenance_mode === "true");
          setMaintenanceMsg(d.settings.maintenance_message || "");
          setSettingsLoaded(true);
        }
      })
      .catch(() => {});

    // Set real-time clock
    const updateClock = () => {
      const now = new Date();
      const time = now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: true });
      const date = now.toLocaleDateString("en-IN", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
      setCurrentTime({ time, date });
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST" });
    } catch (err) {
      console.warn("Logout request error:", err);
    } finally {
      // Clear session cookie on client-side as fallback
      document.cookie = "admin_session=; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT";
      window.location.href = "/super-admin/login";
    }
  };

  const toggleMaintenance = async () => {
    const newVal = !maintenanceOn;
    setMaintenanceLoading(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "maintenance_mode", value: String(newVal) }),
      });
      if (res.ok) {
        setMaintenanceOn(newVal);
        showToast(
          newVal ? "Maintenance mode ENABLED — site is now offline for visitors." : "Maintenance mode DISABLED — site is live.",
          newVal ? "error" : "success"
        );
      } else {
        showToast("Failed to update maintenance mode.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    }
    setMaintenanceLoading(false);
  };

  const saveMaintenanceMessage = async () => {
    try {
      await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "maintenance_message", value: maintenanceMsg }),
      });
      showToast("Maintenance message saved.");
    } catch {
      showToast("Failed to save message.", "error");
    }
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

  // ── Colleges Management State ────────────────────────────
  const [colleges, setColleges] = useState([]);
  const [collegesLoading, setCollegesLoading] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  // Register form
  const [clgName, setClgName] = useState("");
  const [clgUsername, setClgUsername] = useState("");
  const [clgEmail, setClgEmail] = useState("");
  const [clgPhone, setClgPhone] = useState("");
  const [clgCity, setClgCity] = useState("");
  const [clgState, setClgState] = useState("");
  const [clgPassword, setClgPassword] = useState("");
  const [clgSubmitting, setClgSubmitting] = useState(false);
  const [clgFormError, setClgFormError] = useState("");
  const [newCredentials, setNewCredentials] = useState(null); // {college_name, username, password}
  const [copiedKey, setCopiedKey] = useState(null);
  // Edit modal
  const [editClg, setEditClg] = useState(null);
  const [editClgName, setEditClgName] = useState("");
  const [editClgCity, setEditClgCity] = useState("");
  const [editClgState, setEditClgState] = useState("");
  const [editClgEmail, setEditClgEmail] = useState("");
  const [editSaving, setEditSaving] = useState(false);
  // Reset password modal
  const [resetClg, setResetClg] = useState(null);
  const [resetPwd, setResetPwd] = useState("");
  const [resetSaving, setResetSaving] = useState(false);
  const [resetCredentials, setResetCredentials] = useState(null);
  const [togglingClgId, setTogglingClgId] = useState(null);

  // ── Courses Management State ─────────────────────────────
  const [courses, setCourses] = useState([]);
  const [coursesLoading, setCoursesLoading] = useState(false);
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseHindi, setNewCourseHindi] = useState("");
  const [newCourseDuration, setNewCourseDuration] = useState("");
  const [newCourseCategory, setNewCourseCategory] = useState("");
  const [courseSubmitting, setCourseSubmitting] = useState(false);
  const [editCourse, setEditCourse] = useState(null);
  const [editCourseName, setEditCourseName] = useState("");
  const [editCourseHindi, setEditCourseHindi] = useState("");
  const [editCourseDuration, setEditCourseDuration] = useState("");
  const [editCourseCategory, setEditCourseCategory] = useState("");
  const [courseEditSaving, setCourseEditSaving] = useState(false);

  // Exam Sessions & Centers state
  const [examSessions, setExamSessions] = useState([]);
  const [examCenters, setExamCenters] = useState([]);
  const [examLoading, setExamLoading] = useState(false);
  const [newSession, setNewSession] = useState({ session_name: "", start_date: "", end_date: "" });
  const [sessionSubmitting, setSessionSubmitting] = useState(false);
  const [newCenter, setNewCenter] = useState({ center_name: "", center_code: "", city: "", state: "", address: "" });
  const [centerSubmitting, setCenterSubmitting] = useState(false);
  const [examSubTab, setExamSubTab] = useState("sessions");

  // Inquiries state
  const [inquiries, setInquiries] = useState([]);
  const [inquiriesLoading, setInquiriesLoading] = useState(false);
  const [inquiryFilter, setInquiryFilter] = useState("all");
  const [selectedInquiry, setSelectedInquiry] = useState(null);
  const [inquiryNotes, setInquiryNotes] = useState("");
  const [inquiryStatus, setInquiryStatus] = useState("new");
  const [inquirySaving, setInquirySaving] = useState(false);

  // Announcements state
  const [announcements, setAnnouncements] = useState([]);
  const [annLoading, setAnnLoading] = useState(false);
  const [newAnn, setNewAnn] = useState({ title: "", content: "", is_published: false });
  const [annSubmitting, setAnnSubmitting] = useState(false);
  const [editAnn, setEditAnn] = useState(null);
  const [annFile, setAnnFile] = useState(null);
  const [annUploading, setAnnUploading] = useState(false);

  const generatePassword = () => {
    const chars = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789@#$";
    return Array.from({ length: 12 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  };

  const copyToClipboard = (text, key) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    });
  };

  const loadColleges = async () => {
    setCollegesLoading(true);
    try {
      const res = await fetch("/api/admin/colleges");
      const data = await res.json();
      if (data.ok) setColleges(data.data || []);
    } catch {}
    setCollegesLoading(false);
  };

  const loadExamSessions = async () => {
    setExamLoading(true);
    try {
      const [sr, cr] = await Promise.all([fetch("/api/admin/exam-sessions"), fetch("/api/admin/exam-centers")]);
      const [sd, cd] = await Promise.all([sr.json(), cr.json()]);
      if (sd.ok) setExamSessions(sd.data || []);
      if (cd.ok) setExamCenters(cd.data || []);
    } catch {}
    setExamLoading(false);
  };

  const loadExamCenters = async () => {}; // loaded together in loadExamSessions

  const addSession = async (e) => {
    e.preventDefault();
    if (!newSession.session_name) return;
    setSessionSubmitting(true);
    try {
      const res = await fetch("/api/admin/exam-sessions", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newSession) });
      const data = await res.json();
      if (data.ok) { setExamSessions(p => [data.data, ...p]); setNewSession({ session_name: "", start_date: "", end_date: "" }); showToast("Session added!"); }
      else showToast(data.error || "Failed", "error");
    } catch { showToast("Network error", "error"); }
    setSessionSubmitting(false);
  };

  const toggleSession = async (id, is_active) => {
    const res = await fetch(`/api/admin/exam-sessions/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_active }) });
    const data = await res.json();
    if (data.ok) setExamSessions(p => p.map(s => s.id === id ? { ...s, is_active } : is_active ? { ...s, is_active: false } : s));
  };

  const deleteSession = async (id) => {
    if (!confirm("Delete this exam session?")) return;
    const res = await fetch(`/api/admin/exam-sessions/${id}`, { method: "DELETE" });
    if ((await res.json()).ok) setExamSessions(p => p.filter(s => s.id !== id));
  };

  const addCenter = async (e) => {
    e.preventDefault();
    if (!newCenter.center_name) return;
    setCenterSubmitting(true);
    try {
      const res = await fetch("/api/admin/exam-centers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(newCenter) });
      const data = await res.json();
      if (data.ok) { setExamCenters(p => [...p, data.data]); setNewCenter({ center_name: "", center_code: "", city: "", state: "", address: "" }); showToast("Center added!"); }
      else showToast(data.error || "Failed", "error");
    } catch { showToast("Network error", "error"); }
    setCenterSubmitting(false);
  };

  const deleteCenter = async (id) => {
    if (!confirm("Delete this exam center?")) return;
    const res = await fetch(`/api/admin/exam-centers/${id}`, { method: "DELETE" });
    if ((await res.json()).ok) setExamCenters(p => p.filter(c => c.id !== id));
  };

  const loadInquiries = async () => {
    setInquiriesLoading(true);
    try {
      const res = await fetch("/api/admin/inquiries");
      const data = await res.json();
      if (data.ok) setInquiries(data.data || []);
    } catch {}
    setInquiriesLoading(false);
  };

  const saveInquiry = async () => {
    if (!selectedInquiry) return;
    setInquirySaving(true);
    try {
      const res = await fetch(`/api/admin/inquiries/${selectedInquiry.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: inquiryStatus, admin_notes: inquiryNotes, is_read: true }),
      });
      const data = await res.json();
      if (data.ok) {
        setInquiries(p => p.map(i => i.id === selectedInquiry.id ? data.data : i));
        setSelectedInquiry(null);
        showToast("Inquiry updated!");
      } else showToast(data.error || "Failed", "error");
    } catch { showToast("Network error", "error"); }
    setInquirySaving(false);
  };

  const loadAnnouncements = async () => {
    setAnnLoading(true);
    try {
      const res = await fetch("/api/admin/announcements");
      const data = await res.json();
      if (data.ok) setAnnouncements(data.data || []);
    } catch {}
    setAnnLoading(false);
  };

  const addAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnn.title) return;
    setAnnSubmitting(true);
    try {
      let attachment_url = null, attachment_name = null;
      if (annFile) {
        setAnnUploading(true);
        const fd = new FormData(); fd.append("file", annFile);
        const upRes = await fetch("/api/admin/announcements/upload", { method: "POST", body: fd });
        const upData = await upRes.json();
        setAnnUploading(false);
        if (!upRes.ok) { showToast(upData.error || "Upload failed", "error"); setAnnSubmitting(false); return; }
        attachment_url = upData.url;
        attachment_name = upData.originalName || annFile.name;
      }
      const res = await fetch("/api/admin/announcements", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...newAnn, attachment_url, attachment_name }) });
      const data = await res.json();
      if (data.ok) { setAnnouncements(p => [data.data, ...p]); setNewAnn({ title: "", content: "", is_published: false }); setAnnFile(null); showToast("Announcement added!"); }
      else showToast(data.error || "Failed", "error");
    } catch { showToast("Network error", "error"); }
    setAnnSubmitting(false);
  };

  const toggleAnnPublish = async (id, is_published) => {
    const res = await fetch(`/api/admin/announcements/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ is_published }) });
    const data = await res.json();
    if (data.ok) setAnnouncements(p => p.map(a => a.id === id ? data.data : a));
  };

  const deleteAnn = async (id) => {
    if (!confirm("Delete this announcement?")) return;
    const res = await fetch(`/api/admin/announcements/${id}`, { method: "DELETE" });
    if ((await res.json()).ok) setAnnouncements(p => p.filter(a => a.id !== id));
  };

  const handleRegisterCollege = async (e) => {
    e.preventDefault();
    setClgFormError("");
    if (!clgName || !clgUsername || !clgPassword) { setClgFormError("Name, username, and password are required."); return; }
    setClgSubmitting(true);
    try {
      const res = await fetch("/api/admin/colleges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college_name: clgName, username: clgUsername, password: clgPassword, email: clgEmail, phone: clgPhone, city: clgCity, state: clgState }),
      });
      const data = await res.json();
      if (!res.ok) { setClgFormError(data.error || "Failed to register college"); }
      else {
        setNewCredentials({ college_name: clgName, username: clgUsername, password: clgPassword });
        setClgName(""); setClgUsername(""); setClgPassword(""); setClgEmail(""); setClgPhone(""); setClgCity(""); setClgState("");
        setShowRegisterForm(false);
        loadColleges();
        showToast("College registered successfully!", "success");
      }
    } catch { setClgFormError("Network error"); }
    setClgSubmitting(false);
  };

  const toggleCollegeActive = async (college) => {
    setTogglingClgId(college.id);
    try {
      const res = await fetch(`/api/admin/colleges/${college.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !college.is_active }),
      });
      const data = await res.json();
      if (data.ok) {
        setColleges((prev) => prev.map((c) => c.id === college.id ? { ...c, is_active: !college.is_active } : c));
        showToast(`College ${!college.is_active ? "activated" : "deactivated"}`, "success");
      }
    } catch {}
    setTogglingClgId(null);
  };

  const saveEditCollege = async () => {
    if (!editClg) return;
    setEditSaving(true);
    try {
      const res = await fetch(`/api/admin/colleges/${editClg.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ college_name: editClgName, email: editClgEmail, city: editClgCity, state: editClgState }),
      });
      const data = await res.json();
      if (data.ok) {
        setColleges((prev) => prev.map((c) => c.id === editClg.id ? { ...c, ...data.data } : c));
        setEditClg(null);
        showToast("College updated!", "success");
      }
    } catch {}
    setEditSaving(false);
  };

  const saveResetPassword = async () => {
    if (!resetClg) return;
    const pwd = resetPwd || generatePassword();
    setResetSaving(true);
    try {
      const res = await fetch(`/api/admin/colleges/${resetClg.id}/regenerate-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      const data = await res.json();
      if (data.ok) {
        setResetCredentials({ college_name: resetClg.college_name, username: resetClg.username, password: data.password });
        setResetClg(null);
        setResetPwd("");
        showToast("Password reset successfully!", "success");
      }
    } catch {}
    setResetSaving(false);
  };

  const loadCourses = async () => {
    setCoursesLoading(true);
    try {
      const res = await fetch("/api/admin/courses");
      const data = await res.json();
      if (data.ok) setCourses(data.data || []);
    } catch {}
    setCoursesLoading(false);
  };

  const handleAddCourse = async (e) => {
    e.preventDefault();
    if (!newCourseName) return;
    setCourseSubmitting(true);
    try {
      const res = await fetch("/api/admin/courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_name: newCourseName, course_name_hindi: newCourseHindi, duration_label: newCourseDuration, category: newCourseCategory }),
      });
      const data = await res.json();
      if (data.ok) { setNewCourseName(""); setNewCourseHindi(""); setNewCourseDuration(""); setNewCourseCategory(""); loadCourses(); showToast("Course added!", "success"); }
      else showToast(data.error || "Failed", "error");
    } catch {}
    setCourseSubmitting(false);
  };

  const saveEditCourse = async () => {
    if (!editCourse) return;
    setCourseEditSaving(true);
    try {
      const res = await fetch(`/api/admin/courses/${editCourse.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_name: editCourseName, course_name_hindi: editCourseHindi, duration_label: editCourseDuration, category: editCourseCategory }),
      });
      const data = await res.json();
      if (data.ok) { setEditCourse(null); loadCourses(); showToast("Course updated!", "success"); }
    } catch {}
    setCourseEditSaving(false);
  };

  const deleteCourse = async (id) => {
    if (!confirm("Delete this course? This will also delete its subjects.")) return;
    try {
      await fetch(`/api/admin/courses/${id}`, { method: "DELETE" });
      setCourses((prev) => prev.filter((c) => c.id !== id));
      showToast("Course deleted.", "success");
    } catch {}
  };

  const loadApplications = async () => {
    setAppLoading(true);
    try {
      const params = new URLSearchParams();
      if (appFilter !== "all") params.set("status", appFilter);
      if (appSearch) params.set("search", appSearch);
      const res = await fetch(`/api/admin/registrations?${params}`);
      const data = await res.json();
      if (data.ok) setApplications(data.data || []);
    } catch {}
    setAppLoading(false);
  };

  const openAppDetail = async (app) => {
    setSelectedApp(app);
    setAppDetailLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations/${app.id}`);
      const data = await res.json();
      if (data.ok) {
        setSelectedApp(data.data);
        setAppQueries(data.queries || []);
      }
    } catch {}
    setAppDetailLoading(false);
  };

  const approveApp = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/approve`, { method: "POST" });
      const data = await res.json();
      if (data.ok) {
        setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: "approved" } : a));
        setSelectedApp((prev) => prev ? { ...prev, status: "approved" } : null);
        showToast("Application approved successfully!", "success");
      } else showToast(data.error || "Failed to approve", "error");
    } catch { showToast("Network error", "error"); }
    setActionLoading(false);
  };

  const rejectApp = async (id) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: rejectReason }),
      });
      const data = await res.json();
      if (data.ok) {
        setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: "rejected" } : a));
        setSelectedApp((prev) => prev ? { ...prev, status: "rejected" } : null);
        setRejectModal(false);
        setRejectReason("");
        showToast("Application rejected.", "error");
      } else showToast(data.error || "Failed to reject", "error");
    } catch { showToast("Network error", "error"); }
    setActionLoading(false);
  };

  const raiseQuery = async (id) => {
    if (!queryMsg.trim()) return;
    setQuerySubmitting(true);
    try {
      const res = await fetch(`/api/admin/registrations/${id}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ field_name: queryField, message: queryMsg }),
      });
      const data = await res.json();
      if (data.ok) {
        setApplications((prev) => prev.map((a) => a.id === id ? { ...a, status: "query_raised" } : a));
        setSelectedApp((prev) => prev ? { ...prev, status: "query_raised" } : null);
        setAppQueries((prev) => [data.query, ...prev]);
        setQueryModal(false);
        setQueryMsg("");
        setQueryField("general");
        showToast("Query raised — college notified!", "success");
      } else showToast(data.error || "Failed to raise query", "error");
    } catch { showToast("Network error", "error"); }
    setQuerySubmitting(false);
  };

  const APP_STATUS = {
    pending:      { label: "Pending",      color: "bg-amber-100 text-amber-800",    dot: "bg-amber-500" },
    submitted:    { label: "Submitted",    color: "bg-blue-100 text-blue-800",      dot: "bg-blue-500" },
    under_review: { label: "Under Review", color: "bg-violet-100 text-violet-800",  dot: "bg-violet-500" },
    query_raised: { label: "Query Raised", color: "bg-orange-100 text-orange-800",  dot: "bg-orange-500" },
    approved:     { label: "Approved",     color: "bg-emerald-100 text-emerald-800", dot: "bg-emerald-500" },
    rejected:     { label: "Rejected",     color: "bg-red-100 text-red-800",         dot: "bg-red-500" },
  };

  const navigationItems = [
    { id: "overview",       label: "Overview & Metrics",    icon: LayoutDashboard },
    { id: "applications",   label: "Student Applications",  icon: ClipboardList,  badge: applications.filter(a => a.status === "submitted" || a.status === "pending").length || null },
    { id: "colleges",       label: "College Management",    icon: Building2,      badge: colleges.length || null },
    { id: "courses",        label: "Courses & Subjects",    icon: GraduationCap,  badge: courses.length || null },
    { id: "exam",           label: "Exam Management",       icon: BookOpen,       badge: examSessions.filter(s => s.is_active).length > 0 ? "Active" : null, badgeColor: "green" },
    { id: "announcements",  label: "Announcements",         icon: Bell,           badge: announcements.filter(a => a.is_published).length || null },
    { id: "inquiries",      label: "Contact Inquiries",     icon: MessageSquarePlus, badge: inquiries.filter(i => !i.is_read).length || null, badgeColor: "red" },
    { id: "maintenance",    label: "Maintenance Mode",      icon: WifiOff,        badge: maintenanceOn ? "ON" : null, badgeColor: "red" },
    { id: "gallery",        label: "Gallery Management",    icon: ImageIcon,      badge: galleryCount },
    { id: "contact",        label: "Contact Info",          icon: Phone },
    { id: "social",         label: "Social Media Links",    icon: Share2 },
    { id: "homepage",       label: "Home Page",             icon: LayoutDashboard },
    { id: "institutes",     label: "Affiliated Institutes", icon: Building2,      badge: instituteCount },
    { id: "certificates",   label: "Certificate Ledger",    icon: FileCheck },
  ];

  return (
    <div className="min-h-screen bg-[#F2EDE4] text-[#0E3320] flex flex-col selection:bg-[#C59B3F] selection:text-white">

      {/* Toast */}
      {toast.show && (
        <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-[#0E3320] text-white shadow-2xl border border-[#C59B3F]/40">
          {toast.type === "success" ? <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            : toast.type === "error" ? <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            : <Info className="w-5 h-5 text-[#C59B3F] shrink-0" />}
          <span className="text-xs font-semibold">{toast.message}</span>
          <button onClick={() => setToast({ show: false, message: "", type: "success" })} className="text-white/60 hover:text-white ml-2">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      <div className="flex h-screen overflow-hidden">

        {/* ── SIDEBAR ── */}
        <aside className={`
          fixed lg:static inset-y-0 left-0 z-40
          w-64 flex flex-col
          bg-[#071F13] text-white
          transition-transform duration-300
          ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}>

          {/* Sidebar Header */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-white/10">
            <div className="relative w-10 h-10 shrink-0 rounded-full overflow-hidden ring-2 ring-[#C59B3F]/50">
              <Image src="/logo.png" alt="Logo" fill sizes="40px" className="object-cover" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate leading-tight">Bhartiya Ayurveda</p>
              <p className="text-[10px] text-[#C59B3F] font-semibold tracking-wide">Super Admin Console</p>
            </div>
          </div>

          {/* Nav Items */}
          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-0.5 scrollbar-thin">

            {/* ── Section: Management ── */}
            <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/25 px-2 pt-1 pb-2">Management</p>
            {navigationItems.slice(0, 7).map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button key={item.id}
                  onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left group ${
                    isActive ? "bg-[#C59B3F]/15 text-[#F3D68B] border border-[#C59B3F]/25" : "text-white/55 hover:text-white hover:bg-white/[0.07]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                      isActive ? "bg-[#C59B3F]/20" : "bg-white/5 group-hover:bg-white/10"
                    }`}>
                      <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C59B3F]" : "text-white/40 group-hover:text-white/70"}`} />
                    </div>
                    <span>{item.label}</span>
                  </div>
                  {item.badge !== undefined && item.badge !== null && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                      item.badgeColor === "red"   ? "bg-red-500/20 text-red-300 border border-red-500/30"
                      : item.badgeColor === "green" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : isActive                   ? "bg-[#C59B3F]/30 text-[#F3D68B]"
                      :                              "bg-white/10 text-white/50"
                    }`}>{item.badge}</span>
                  )}
                </button>
              );
            })}

            {/* ── Section: Settings ── */}
            <div className="pt-3 mt-1 border-t border-white/8">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/25 px-2 pb-2">Settings</p>
              {navigationItems.slice(7, 12).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left group ${
                      isActive ? "bg-[#C59B3F]/15 text-[#F3D68B] border border-[#C59B3F]/25" : "text-white/55 hover:text-white hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isActive ? "bg-[#C59B3F]/20" : "bg-white/5 group-hover:bg-white/10"
                      }`}>
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C59B3F]" : "text-white/40 group-hover:text-white/70"}`} />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge !== null && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                        item.badgeColor === "red"   ? "bg-red-500/20 text-red-300 border border-red-500/30"
                        : item.badgeColor === "green" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : isActive                   ? "bg-[#C59B3F]/30 text-[#F3D68B]"
                        :                              "bg-white/10 text-white/50"
                      }`}>{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Section: Data Records ── */}
            <div className="pt-3 mt-1 border-t border-white/8">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/25 px-2 pb-2">Data Records</p>
              {navigationItems.slice(12).map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button key={item.id}
                    onClick={() => { setActiveTab(item.id); setMobileSidebarOpen(false); }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all text-left group ${
                      isActive ? "bg-[#C59B3F]/15 text-[#F3D68B] border border-[#C59B3F]/25" : "text-white/55 hover:text-white hover:bg-white/[0.07]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 transition-all ${
                        isActive ? "bg-[#C59B3F]/20" : "bg-white/5 group-hover:bg-white/10"
                      }`}>
                        <Icon className={`w-3.5 h-3.5 ${isActive ? "text-[#C59B3F]" : "text-white/40 group-hover:text-white/70"}`} />
                      </div>
                      <span>{item.label}</span>
                    </div>
                    {item.badge !== undefined && item.badge !== null && (
                      <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-bold shrink-0 ${
                        isActive ? "bg-[#C59B3F]/30 text-[#F3D68B]" : "bg-white/10 text-white/50"
                      }`}>{item.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* ── Section: Public Pages ── */}
            <div className="pt-3 mt-1 border-t border-white/8">
              <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-white/25 px-2 pb-2">Public Pages</p>
              {[
                { href: "/gallery",              label: "Live Gallery" },
                { href: "/contact",              label: "Contact Page" },
                { href: "/affiliated-institutes",                       label: "Colleges List" },
                { href: "/students/results",                           label: "Results Portal" },
                { href: "/students/admit-card",                        label: "Admit Card" },
                { href: "/super-admin/dashboard/inquiries",            label: "Inquiries Page" },
                { href: "/super-admin/dashboard/roll-numbers/audit",   label: "Roll No. Audit" },
              ].map(({ href, label }) => (
                <Link key={href} href={href} target="_blank"
                  className="flex items-center justify-between px-3 py-2 rounded-xl text-xs text-white/45 hover:text-white hover:bg-white/[0.07] transition-all group"
                >
                  <span className="font-medium">{label}</span>
                  <ExternalLink className="w-3 h-3 text-[#C59B3F]/50 group-hover:text-[#C59B3F]" />
                </Link>
              ))}
            </div>
          </nav>

          {/* Sidebar Footer — user + logout */}
          <div className="border-t border-white/10 px-4 py-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-7 h-7 rounded-full bg-[#C59B3F] text-[#071F13] font-bold text-[10px] flex items-center justify-center shrink-0">
                SA
              </div>
              <div className="min-w-0">
                <p className="text-xs font-bold text-white truncate leading-tight">
                  {adminUser.full_name || adminUser.username || "Super Admin"}
                </p>
                <p className="text-[10px] text-[#C59B3F]">Master Access</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              title="Logout"
              className="p-1.5 rounded-lg text-white/40 hover:text-red-300 hover:bg-red-900/30 transition-all shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </aside>

        {/* Mobile overlay */}
        {mobileSidebarOpen && (
          <div onClick={() => setMobileSidebarOpen(false)} className="fixed inset-0 z-30 bg-black/60 lg:hidden" />
        )}

        {/* ── MAIN AREA ── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

          {/* Top bar */}
          <header className="bg-white border-b border-[#DDD1BE] px-5 sm:px-7 py-0 flex items-stretch justify-between shrink-0 min-h-[56px]">
            {/* Left */}
            <div className="flex items-center gap-3">
              <button onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="lg:hidden p-2 rounded-lg bg-[#F2EDE4] text-[#0E3320] hover:bg-[#DDD1BE] transition-colors">
                {mobileSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
              </button>
              {/* Active tab label with left border accent */}
              <div className="pl-1 py-3.5">
                <h1 className="text-sm font-extrabold text-[#0E3320] leading-tight">
                  {navigationItems.find(n => n.id === activeTab)?.label || "Dashboard"}
                </h1>
                <p className="text-[10px] text-[#9B8265] mt-0.5 font-medium">Bhartiya Ayurveda · Super Admin</p>
              </div>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2 sm:gap-3">
              {maintenanceOn && (
                <button onClick={() => setActiveTab("maintenance")}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs font-bold">
                  <WifiOff className="w-3 h-3" /> Site Offline
                </button>
              )}
              {/* Clock pill */}
              <div className="hidden sm:flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#F5F0E8] border border-[#E8DFD0]">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <div className="leading-tight">
                  <p className="font-mono font-bold text-[12px] text-[#0E3320] tracking-tight">{currentTime.time || "—"}</p>
                  <p className="text-[9px] text-[#9B8265] font-medium">{currentTime.date || "Loading…"}</p>
                </div>
              </div>
              {/* Bell */}
              <div className="relative p-2 rounded-xl bg-[#F2EDE4] hover:bg-[#EAE2D3] text-[#5C8261] cursor-pointer transition-colors">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#C59B3F]" />
              </div>
            </div>
          </header>

          {/* Scrollable content */}
          <main className="flex-1 overflow-y-auto p-5 sm:p-7">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <div className="space-y-6">

              {/* ── Welcome Banner ── */}
              <div className="rounded-2xl bg-gradient-to-br from-[#0E3320] via-[#0E3320] to-[#071F13] text-white border border-[#C59B3F]/20 shadow-lg overflow-hidden">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 p-6 md:p-8 relative">
                  {/* Gold shimmer strip */}
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#C59B3F]/60 to-transparent" />

                  <div className="space-y-2.5 relative z-10">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-semibold border border-emerald-500/25">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        System Active
                      </span>
                      {maintenanceOn && (
                        <button onClick={() => setActiveTab("maintenance")}
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-300 text-[11px] font-bold border border-red-500/30 hover:bg-red-500/30 transition-colors">
                          <WifiOff className="w-3 h-3" /> Site Offline
                        </button>
                      )}
                    </div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">Super Admin Hub</h1>
                    <p className="text-sm text-white/55 max-w-lg leading-relaxed">
                      Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad — central governance panel.
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 relative z-10 shrink-0">
                    <button onClick={() => setActiveTab("applications")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C59B3F] hover:bg-[#D4AB4F] text-[#071F13] font-bold text-xs transition-all shadow-md">
                      <ClipboardList className="w-4 h-4" /> Applications
                    </button>
                    <button onClick={() => setActiveTab("colleges")}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 transition-all">
                      <Building2 className="w-4 h-4 text-[#C59B3F]" /> Colleges
                    </button>
                  </div>
                </div>
              </div>

              {/* ── Stat Cards ── */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { tab: "institutes", label: "Affiliated Centers", value: instituteCount,    sub: "Registered colleges",    icon: Building2,  bg: "bg-[#E8F0EA]", ic: "text-[#15482D]", accent: "text-[#15482D]" },
                  { tab: "gallery",    label: "Gallery Photos",     value: galleryCount,      sub: "Published to site",      icon: ImageIcon,  bg: "bg-[#EAF2EC]", ic: "text-[#1E603D]", accent: "text-emerald-700" },
                  { tab: "contact",    label: "Contact Channels",   value: "4 Lines",         sub: "Phone, WhatsApp, Email", icon: Phone,      bg: "bg-[#F5F0E8]", ic: "text-[#8C671D]", accent: "text-[#8C671D]" },
                  { tab: "social",     label: "Social Profiles",    value: "7 Active",        sub: "Live on website",        icon: Share2,     bg: "bg-[#F3EFE8]", ic: "text-[#6B501A]", accent: "text-[#8C671D]" },
                ].map(({ tab, label, value, sub, icon: Icon, bg, ic, accent }) => (
                  <div key={tab} onClick={() => setActiveTab(tab)}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm hover:shadow-md hover:border-[#C59B3F]/60 transition-all cursor-pointer group">
                    <div className="flex items-start justify-between mb-3">
                      <div className={`w-9 h-9 rounded-xl ${bg} ${ic} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-[#C59B3F]/40 group-hover:text-[#C59B3F] group-hover:translate-x-0.5 transition-all" />
                    </div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#9B8265] mb-1">{label}</p>
                    <p className="text-xl sm:text-2xl font-bold text-[#0E3320] leading-none">{value}</p>
                    <p className={`text-[11px] font-medium mt-1.5 ${accent}`}>{sub}</p>
                  </div>
                ))}
              </div>

              {/* ── Quick Access Modules ── */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-[#0E3320] uppercase tracking-wider">Quick Access</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { tab: "gallery",      icon: ImageIcon,  bg: "bg-[#EAF2EC]", ic: "text-[#1E603D]", title: "Photo Gallery",       sub: "Upload & manage photos",          cta: "Manage Photos" },
                    { tab: "contact",      icon: Phone,      bg: "bg-[#F5F0E8]", ic: "text-[#8C671D]", title: "Contact & Location",  sub: "Edit phone, email & address",     cta: "Update Contacts" },
                    { tab: "social",       icon: Share2,     bg: "bg-[#F0EDE5]", ic: "text-[#6B501A]", title: "Social Media",        sub: "Manage all social handles",       cta: "Edit Profiles" },
                    { tab: "institutes",   icon: Building2,  bg: "bg-[#E8F0EA]", ic: "text-[#15482D]", title: "Affiliated Centers",  sub: "Register & verify colleges",      cta: "Manage Colleges" },
                  ].map(({ tab, icon: Icon, bg, ic, title, sub, cta }) => (
                    <div key={tab} onClick={() => setActiveTab(tab)}
                      className="p-4 rounded-2xl bg-white border border-[#DDD1BE] hover:border-[#C59B3F]/60 hover:shadow-md transition-all cursor-pointer group">
                      <div className={`w-9 h-9 rounded-xl ${bg} ${ic} flex items-center justify-center mb-3 group-hover:bg-[#0E3320] group-hover:text-[#C59B3F] transition-colors`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <h3 className="text-xs font-bold text-[#0E3320]">{title}</h3>
                      <p className="text-[11px] text-[#5C8261] mt-0.5 leading-snug">{sub}</p>
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold text-[#8C671D] mt-3 group-hover:translate-x-0.5 transition-transform">
                        {cta} <ChevronRight className="w-3 h-3" />
                      </span>
                    </div>
                  ))}
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
                      View Full Registry
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

          {/* TAB: MAINTENANCE MODE */}
          {activeTab === "maintenance" && (
            <div className="space-y-6">
              {/* Header */}
              <div className="p-6 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm">
                <div className="flex items-center gap-3 mb-1">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${maintenanceOn ? "bg-red-100 text-red-600" : "bg-[#E6EFE9] text-[#1E603D]"}`}>
                    <WifiOff className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-serif font-bold text-[#0E3320]">Maintenance Mode</h2>
                    <p className="text-xs text-[#5C8261]">Take the public website offline for maintenance or updates.</p>
                  </div>
                </div>
              </div>

              {/* Toggle Card */}
              <div className={`p-6 rounded-2xl border-2 shadow-sm transition-all ${maintenanceOn ? "bg-red-50 border-red-300" : "bg-white border-[#DDD1BE]"}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      {maintenanceOn ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-100 text-red-700 text-xs font-bold border border-red-200">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                          MAINTENANCE MODE: ON
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold border border-emerald-200">
                          <span className="w-2 h-2 rounded-full bg-emerald-500" />
                          SITE STATUS: LIVE
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-[#0E3320]">
                      {maintenanceOn ? "Website is currently offline for visitors." : "Website is live and accessible to everyone."}
                    </p>
                    <p className="text-xs text-[#5C8261]">
                      {maintenanceOn
                        ? "Only Super Admins (logged in) can access the site. All other visitors see the maintenance page."
                        : "Turning ON will redirect all public traffic to the maintenance page."}
                    </p>
                  </div>

                  <button
                    onClick={toggleMaintenance}
                    disabled={maintenanceLoading || !settingsLoaded}
                    className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm transition-all shadow-md disabled:opacity-60 disabled:cursor-not-allowed shrink-0 ${
                      maintenanceOn
                        ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                        : "bg-red-600 hover:bg-red-700 text-white"
                    }`}
                  >
                    {maintenanceLoading ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : maintenanceOn ? (
                      <Power className="w-4 h-4" />
                    ) : (
                      <PowerOff className="w-4 h-4" />
                    )}
                    {maintenanceLoading ? "Updating..." : maintenanceOn ? "Turn OFF — Go Live" : "Turn ON — Take Offline"}
                  </button>
                </div>
              </div>

              {/* Maintenance Message Editor */}
              <div className="p-6 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm space-y-4">
                <div>
                  <h3 className="text-sm font-bold text-[#0E3320] mb-1">Maintenance Message</h3>
                  <p className="text-xs text-[#5C8261]">This message is shown to visitors on the maintenance page.</p>
                </div>
                <textarea
                  value={maintenanceMsg}
                  onChange={(e) => setMaintenanceMsg(e.target.value)}
                  rows={3}
                  placeholder="We are performing scheduled maintenance. Please check back shortly."
                  className="w-full px-4 py-3 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] placeholder-[#C8B79E] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] resize-none"
                />
                <button
                  onClick={saveMaintenanceMessage}
                  className="px-5 py-2 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-xs font-bold transition-all"
                >
                  Save Message
                </button>
              </div>

              {/* Info Box */}
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 space-y-1">
                  <p className="font-bold">Important Notes:</p>
                  <ul className="list-disc list-inside space-y-0.5 text-amber-700">
                    <li>Super Admins with an active session can still access the site normally.</li>
                    <li>College portal and admin panel remain accessible.</li>
                    <li>API endpoints remain active during maintenance.</li>
                    <li>Changes take effect within ~30 seconds across all visitors.</li>
                  </ul>
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

          {/* TAB: HOME PAGE CUSTOMIZATION */}
          {activeTab === "homepage" && (
            <HomePageManager onShowToast={showToast} />
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

          {/* ═══ TAB: COLLEGE MANAGEMENT ═══ */}
          {activeTab === "colleges" && (
            <div className="space-y-6">

              {/* Credentials Success Modal */}
              {(newCredentials || resetCredentials) && (() => {
                const cred = newCredentials || resetCredentials;
                const isNew = !!newCredentials;
                return (
                  <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-[#C59B3F]/30 animate-in fade-in-0 zoom-in-95 duration-200">
                      {/* Header */}
                      <div className="bg-gradient-to-br from-[#0B2618] via-[#0E3320] to-[#16462C] px-6 pt-7 pb-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-[#C59B3F]/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="relative z-10">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <div className="w-11 h-11 rounded-2xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center shrink-0">
                                <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                              </div>
                              <div>
                                <p className="text-xs font-bold uppercase tracking-widest text-[#C59B3F] mb-0.5">
                                  {isNew ? "College Registered" : "Password Reset"}
                                </p>
                                <h3 className="text-xl font-bold text-white leading-tight">
                                  {isNew ? "Save these credentials now" : "New credentials ready"}
                                </h3>
                              </div>
                            </div>
                            <button
                              onClick={() => { setNewCredentials(null); setResetCredentials(null); }}
                              className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 transition-colors shrink-0"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <p className="text-sm text-white/60 mt-3 leading-relaxed">
                            These credentials will <span className="text-amber-300 font-semibold">not be shown again</span>. Copy and share them with the college securely.
                          </p>
                        </div>
                      </div>

                      {/* Credentials */}
                      <div className="bg-[#FAF8F5] px-6 py-5 space-y-3">
                        {[
                          ["College Name", cred.college_name, "name"],
                          ["Username", cred.username, "user"],
                          ["Password", cred.password, "pwd"],
                        ].map(([label, val, key]) => (
                          <div key={key} className="bg-white rounded-2xl border border-[#E8DFD1] px-4 py-3.5 flex items-center justify-between gap-3 shadow-xs">
                            <div className="min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-widest text-[#5C8261] mb-1">{label}</p>
                              <p className="text-sm font-mono font-bold text-[#0E3320] break-all">{val}</p>
                            </div>
                            <button
                              onClick={() => copyToClipboard(val, key)}
                              className={`shrink-0 p-2 rounded-xl border transition-all ${
                                copiedKey === key
                                  ? "bg-emerald-100 border-emerald-300 text-emerald-700"
                                  : "bg-[#FAF7F2] border-[#E8DFD1] text-[#5C8261] hover:border-[#C59B3F] hover:text-[#0E3320]"
                              }`}
                              title="Copy"
                            >
                              {copiedKey === key ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Footer */}
                      <div className="bg-[#FAF8F5] px-6 pb-6 space-y-3">
                        <button
                          onClick={() => {
                            const lines = [
                              "=======================================================",
                              "  BHARTIYA AYURVEDA YOGA EVAM PRAKRITIK CHIKITSA PARISHAD",
                              "              COLLEGE LOGIN CREDENTIALS",
                              "=======================================================",
                              "",
                              `College Name : ${cred.college_name}`,
                              `Username     : ${cred.username}`,
                              `Password     : ${cred.password}`,
                              "",
                              `Generated on : ${new Date().toLocaleString("en-IN")}`,
                              "",
                              "Keep this file confidential.",
                              "=======================================================",
                            ].join("\n");
                            const blob = new Blob([lines], { type: "text/plain" });
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement("a");
                            a.href = url;
                            a.download = `${cred.username}_credentials.txt`;
                            a.click();
                            URL.revokeObjectURL(url);
                          }}
                          className="w-full py-3 rounded-2xl bg-[#FAF7F2] hover:bg-[#F0E8D8] border border-[#E8DFD1] hover:border-[#C59B3F] text-[#0E3320] font-bold text-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4 text-[#C59B3F]" />
                          Download Credentials (.txt)
                        </button>
                        <button
                          onClick={() => { setNewCredentials(null); setResetCredentials(null); }}
                          className="w-full py-3 rounded-2xl bg-[#0E3320] hover:bg-[#15482D] text-white font-bold text-sm transition-all shadow-sm active:scale-[0.98]"
                        >
                          Done — I&apos;ve saved the credentials
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Colleges List — full width */}
              <div className="bg-white rounded-2xl border border-[#DDD1BE] shadow-sm overflow-hidden">
                {/* Header */}
                <div className="px-5 py-4 border-b border-[#DDD1BE] flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-[#F2EDE4] flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-[#C59B3F]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-[#0E3320] text-sm">Registered Colleges</h3>
                      <p className="text-[11px] text-[#5C8261]">{colleges.length} college{colleges.length !== 1 ? "s" : ""} registered</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={loadColleges} disabled={collegesLoading}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#F2EDE4] text-xs font-bold text-[#0E3320] hover:bg-[#DDD1BE] transition-colors">
                      <RefreshCw className={`w-3.5 h-3.5 ${collegesLoading ? "animate-spin" : ""}`} /> Refresh
                    </button>
                    <button onClick={() => { setShowRegisterForm(f => !f); setClgFormError(""); }}
                      className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-[#0E3320] hover:bg-[#15482D] text-white text-xs font-bold transition-colors">
                      <Plus className="w-3.5 h-3.5" /> Register New College
                    </button>
                  </div>
                </div>

                {/* Inline register form — collapsible */}
                {showRegisterForm && (
                  <div className="border-b border-[#DDD1BE] bg-[#FAF8F5] px-5 py-5">
                    <div className="max-w-4xl">
                      <p className="text-xs font-bold text-[#5C8261] uppercase tracking-wider mb-4">New College Details</p>
                      {clgFormError && (
                        <div className="mb-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs">{clgFormError}</div>
                      )}
                      <form onSubmit={handleRegisterCollege} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {[
                            { label: "College Name *", val: clgName, set: setClgName, ph: "Full college name" },
                            { label: "Username *", val: clgUsername, set: setClgUsername, ph: "Login username" },
                            { label: "Email", val: clgEmail, set: setClgEmail, ph: "college@email.com" },
                            { label: "Phone", val: clgPhone, set: setClgPhone, ph: "10-digit number" },
                            { label: "City", val: clgCity, set: setClgCity, ph: "City" },
                            { label: "State", val: clgState, set: setClgState, ph: "State" },
                          ].map(({ label, val, set, ph }) => (
                            <div key={label}>
                              <label className="block text-[10px] font-bold uppercase tracking-wide text-[#5C8261] mb-1">{label}</label>
                              <input value={val} onChange={(e) => set(e.target.value)} placeholder={ph}
                                className="w-full px-3 py-2 rounded-xl border border-[#DDD1BE] bg-white text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                              />
                            </div>
                          ))}
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wide text-[#5C8261] mb-1">Password *</label>
                            <div className="flex gap-2">
                              <input value={clgPassword} onChange={(e) => setClgPassword(e.target.value)} placeholder="Min 8 characters"
                                className="flex-1 px-3 py-2 rounded-xl border border-[#DDD1BE] bg-white text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                              />
                              <button type="button" onClick={() => setClgPassword(generatePassword())}
                                className="px-2.5 py-2 rounded-xl bg-[#F2EDE4] border border-[#DDD1BE] text-[#5C8261] hover:text-[#0E3320] hover:bg-[#DDD1BE] transition-colors text-xs font-bold">
                                Auto
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 pt-1">
                          <button type="submit" disabled={clgSubmitting}
                            className="px-6 py-2 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-sm font-bold transition-all disabled:opacity-60">
                            {clgSubmitting ? "Registering..." : "Register College"}
                          </button>
                          <button type="button" onClick={() => setShowRegisterForm(false)}
                            className="px-4 py-2 rounded-xl bg-white border border-[#DDD1BE] text-[#5C8261] hover:text-[#0E3320] text-sm font-semibold transition-colors">
                            Cancel
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}

                {/* Colleges Table */}
                {collegesLoading ? (
                  <div className="p-10 text-center"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#C59B3F]" /></div>
                ) : colleges.length === 0 ? (
                  <div className="p-12 text-center">
                    <Building2 className="w-10 h-10 mx-auto text-[#DDD1BE] mb-3" />
                    <p className="text-[#5C8261] text-sm font-medium">No colleges registered yet.</p>
                    <p className="text-[#9B8265] text-xs mt-1">Click "Register New College" above to add one.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-[#F2EDE4] border-b border-[#DDD1BE]">
                        <tr>
                          <th className="py-3 px-4 font-bold text-[#0E3320] uppercase tracking-wide">College</th>
                          <th className="py-3 px-4 font-bold text-[#0E3320] uppercase tracking-wide">Username</th>
                          <th className="py-3 px-4 font-bold text-[#0E3320] uppercase tracking-wide">Email / Phone</th>
                          <th className="py-3 px-4 font-bold text-[#0E3320] uppercase tracking-wide">Status</th>
                          <th className="py-3 px-4 font-bold text-[#0E3320] uppercase tracking-wide text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2EDE4]">
                        {colleges.map((clg) => (
                          <tr key={clg.id} className="hover:bg-[#FAF8F5] transition-colors">
                            <td className="py-3 px-4">
                              <p className="font-bold text-[#0E3320] leading-tight">{clg.college_name}</p>
                              {clg.city && <p className="text-[#5C8261] text-[10px] mt-0.5">{clg.city}{clg.state ? `, ${clg.state}` : ""}</p>}
                            </td>
                            <td className="py-3 px-4 font-mono text-[#5C8261] text-[11px]">{clg.username}</td>
                            <td className="py-3 px-4">
                              {clg.email && <p className="text-[#5C8261]">{clg.email}</p>}
                              {clg.phone && <p className="text-[#9B8265] text-[10px] mt-0.5">{clg.phone}</p>}
                              {!clg.email && !clg.phone && <span className="text-[#DDD1BE]">—</span>}
                            </td>
                            <td className="py-3 px-4">
                              <button onClick={() => toggleCollegeActive(clg)} disabled={togglingClgId === clg.id}
                                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${clg.is_active ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}>
                                {togglingClgId === clg.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : clg.is_active ? <CheckCircle2 className="w-3 h-3" /> : <ShieldOff className="w-3 h-3" />}
                                {clg.is_active ? "Active" : "Inactive"}
                              </button>
                            </td>
                            <td className="py-3 px-4 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                <button onClick={() => { setEditClg(clg); setEditClgName(clg.college_name); setEditClgEmail(clg.email || ""); setEditClgCity(clg.city || ""); setEditClgState(clg.state || ""); }}
                                  className="p-1.5 rounded-lg hover:bg-[#F2EDE4] text-[#5C8261] hover:text-[#0E3320] transition-colors" title="Edit">
                                  <Pencil className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => { setResetClg(clg); setResetPwd(""); }}
                                  className="p-1.5 rounded-lg hover:bg-amber-50 text-[#5C8261] hover:text-amber-700 transition-colors" title="Reset Password">
                                  <KeyRound className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Edit College Modal */}
          {editClg && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-[#C59B3F]/20 animate-in fade-in-0 zoom-in-95 duration-200">
                {/* Header */}
                <div className="bg-gradient-to-br from-[#0B2618] via-[#0E3320] to-[#16462C] px-6 pt-6 pb-5 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-40 h-40 bg-[#C59B3F]/10 rounded-full blur-3xl pointer-events-none" />
                  <div className="relative z-10 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-[#C59B3F]/20 border border-[#C59B3F]/30 flex items-center justify-center shrink-0">
                        <Pencil className="w-5 h-5 text-[#E4BF64]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#C59B3F]">College Management</p>
                        <h3 className="text-lg font-bold text-white leading-tight">Edit College</h3>
                      </div>
                    </div>
                    <button onClick={() => setEditClg(null)} className="p-2 rounded-xl text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <p className="relative z-10 text-xs text-white/50 mt-2 ml-[52px]">{editClg.college_name}</p>
                </div>

                {/* Fields */}
                <div className="bg-[#FAF8F5] px-6 py-5 space-y-4">
                  {[
                    { label: "College Name", val: editClgName, set: setEditClgName, placeholder: "Full college name" },
                    { label: "Email", val: editClgEmail, set: setEditClgEmail, placeholder: "college@example.com" },
                    { label: "City", val: editClgCity, set: setEditClgCity, placeholder: "City" },
                    { label: "State", val: editClgState, set: setEditClgState, placeholder: "State" },
                  ].map(({ label, val, set, placeholder }) => (
                    <div key={label}>
                      <label className="block text-[10px] font-bold uppercase tracking-widest text-[#5C8261] mb-1.5">{label}</label>
                      <input
                        value={val}
                        onChange={e => set(e.target.value)}
                        placeholder={placeholder}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#DDD1BE] bg-white text-sm text-[#0E3320] placeholder-[#C8B79E] font-medium focus:outline-none focus:ring-4 focus:ring-[#C59B3F]/15 focus:border-[#C59B3F] transition-all"
                      />
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="bg-[#FAF8F5] px-6 pb-6 flex gap-3">
                  <button onClick={() => setEditClg(null)}
                    className="flex-1 py-3 rounded-2xl border border-[#DDD1BE] bg-white hover:bg-[#F2EDE4] text-sm font-bold text-[#5C8261] transition-all">
                    Cancel
                  </button>
                  <button onClick={saveEditCollege} disabled={editSaving}
                    className="flex-1 py-3 rounded-2xl bg-[#0E3320] hover:bg-[#15482D] text-white text-sm font-bold disabled:opacity-60 transition-all shadow-sm active:scale-[0.98] flex items-center justify-center gap-2">
                    {editSaving
                      ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /><span>Saving...</span></>
                      : "Save Changes"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Reset Password Modal */}
          {resetClg && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60" onClick={() => setResetClg(null)} />
              <div className="relative w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                <h3 className="font-bold text-[#0E3320]">Reset Password — {resetClg.college_name}</h3>
                <div>
                  <label className="block text-[10px] font-bold uppercase text-[#5C8261] mb-1">New Password (leave blank to auto-generate)</label>
                  <div className="flex gap-2">
                    <input value={resetPwd} onChange={(e) => setResetPwd(e.target.value)} placeholder="Leave blank to auto-generate"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-[#DDD1BE] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                    />
                    <button type="button" onClick={() => setResetPwd(generatePassword())}
                      className="px-3 py-2.5 rounded-xl bg-[#F2EDE4] border border-[#DDD1BE] text-xs font-bold text-[#0E3320] hover:bg-[#DDD1BE]"
                    >Auto</button>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setResetClg(null)} className="flex-1 py-2.5 rounded-xl border border-[#DDD1BE] text-xs font-bold text-[#5C8261] hover:bg-[#F2EDE4]">Cancel</button>
                  <button onClick={saveResetPassword} disabled={resetSaving} className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold disabled:opacity-60">
                    {resetSaving ? "Resetting..." : "Reset Password"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB: COURSES & SUBJECTS ═══ */}
          {activeTab === "courses" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-[#0E3320]">Courses & Subjects</h2>
                  <p className="text-xs text-[#5C8261]">Manage courses offered by the parishad.</p>
                </div>
                <button onClick={loadCourses} disabled={coursesLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E3320] text-white text-xs font-bold hover:bg-[#15482D] transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${coursesLoading ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>

              {/* Add Course Form */}
              <div className="bg-white rounded-2xl border border-[#DDD1BE] shadow-sm p-5">
                <h3 className="font-bold text-[#0E3320] text-sm mb-4 flex items-center gap-2"><Plus className="w-4 h-4 text-[#C59B3F]" /> Add New Course</h3>
                <form onSubmit={handleAddCourse} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={newCourseName} onChange={(e) => setNewCourseName(e.target.value)} placeholder="Course name (English) *"
                    className="px-3 py-2.5 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                  <input value={newCourseHindi} onChange={(e) => setNewCourseHindi(e.target.value)} placeholder="Course name (Hindi)"
                    className="px-3 py-2.5 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                  <input value={newCourseDuration} onChange={(e) => setNewCourseDuration(e.target.value)} placeholder="Duration (e.g. 2 Years)"
                    className="px-3 py-2.5 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newCourseCategory}
                      onChange={(e) => setNewCourseCategory(e.target.value)}
                      placeholder="Category (e.g. Ayurveda, Electro-Homeopathy)"
                      className="flex-1 px-3 py-2.5 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                    />
                    <button type="submit" disabled={courseSubmitting || !newCourseName}
                      className="px-5 py-2.5 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-sm font-bold transition-all disabled:opacity-60 whitespace-nowrap">
                      {courseSubmitting ? "Adding…" : "+ Add"}
                    </button>
                  </div>
                </form>
              </div>

              {/* Courses List */}
              {coursesLoading ? (
                <div className="p-12 text-center"><RefreshCw className="w-7 h-7 animate-spin mx-auto text-[#C59B3F]" /></div>
              ) : (
                <div className="space-y-3">
                  {courses.map((course) => (
                    <div key={course.id} className="bg-white rounded-2xl border border-[#DDD1BE] shadow-sm p-4">
                      {editCourse?.id === course.id ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <input value={editCourseName} onChange={(e) => setEditCourseName(e.target.value)} placeholder="Course name (English)"
                            className="px-3 py-2 rounded-xl border border-[#DDD1BE] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                          />
                          <input value={editCourseHindi} onChange={(e) => setEditCourseHindi(e.target.value)} placeholder="Course name (Hindi)"
                            className="px-3 py-2 rounded-xl border border-[#DDD1BE] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                          />
                          <input value={editCourseDuration} onChange={(e) => setEditCourseDuration(e.target.value)} placeholder="Duration (e.g. 1 Year)"
                            className="px-3 py-2 rounded-xl border border-[#DDD1BE] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                          />
                          <input
                            type="text"
                            value={editCourseCategory}
                            onChange={(e) => setEditCourseCategory(e.target.value)}
                            placeholder="Category (e.g. Ayurveda)"
                            className="px-3 py-2 rounded-xl border border-[#DDD1BE] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                          />
                          <div className="flex gap-2">
                            <button onClick={() => setEditCourse(null)} className="px-3 py-2 rounded-xl border border-[#DDD1BE] text-xs font-bold text-[#5C8261] hover:bg-[#F2EDE4]">Cancel</button>
                            <button onClick={saveEditCourse} disabled={courseEditSaving} className="px-4 py-2 rounded-xl bg-[#0E3320] text-white text-xs font-bold disabled:opacity-60">
                              {courseEditSaving ? "Saving..." : "Save"}
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-bold text-[#0E3320] text-sm">{course.course_name}</p>
                            {course.course_name_hindi && <p className="text-xs text-[#7A583A] mt-0.5">{course.course_name_hindi}</p>}
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              {course.duration_label && <span className="text-xs text-[#5C8261]">⏱ {course.duration_label}</span>}
                              {course.category && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EDE7DE] text-[#5C4033] capitalize">{course.category.replace(/_/g, " ")}</span>}
                              {course.subjects?.length > 0 && <span className="text-xs text-[#8C671D]">{course.subjects.length} subject{course.subjects.length !== 1 ? "s" : ""}</span>}
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button onClick={() => { setEditCourse(course); setEditCourseName(course.course_name); setEditCourseHindi(course.course_name_hindi || ""); setEditCourseDuration(course.duration_label || ""); setEditCourseCategory(course.category || ""); }}
                              className="p-2 rounded-xl hover:bg-[#F2EDE4] text-[#5C8261] hover:text-[#0E3320] transition-colors"
                            ><Pencil className="w-4 h-4" /></button>
                            <button onClick={() => deleteCourse(course.id)}
                              className="p-2 rounded-xl hover:bg-red-50 text-[#5C8261] hover:text-red-600 transition-colors"
                            ><Trash2 className="w-4 h-4" /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                  {courses.length === 0 && !coursesLoading && (
                    <div className="p-10 text-center bg-white rounded-2xl border border-[#DDD1BE] text-[#5C8261] text-sm">No courses yet. Add one above.</div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── TAB: EXAM MANAGEMENT ── */}
          {activeTab === "exam" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0E3320]">Exam Management</h2>
                  <p className="text-xs text-[#5C8261]">Manage exam sessions and exam centers.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Link href="/super-admin/dashboard/exam-management"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C59B3F] hover:bg-[#A8852E] text-white text-xs font-bold transition-all">
                    <BookOpen className="w-3.5 h-3.5" /> Subjects, Datesheet &amp; Results
                  </Link>
                  <button onClick={loadExamSessions} disabled={examLoading} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E3320] text-white text-xs font-bold hover:bg-[#15482D] transition-all">
                    <RefreshCw className={`w-3.5 h-3.5 ${examLoading ? "animate-spin" : ""}`} /> Refresh
                  </button>
                </div>
              </div>

              {/* Quick-link card */}
              <div className="bg-gradient-to-r from-[#0E3320] to-[#15482D] rounded-2xl p-5 flex items-center justify-between gap-4 text-white">
                <div>
                  <p className="font-bold text-sm">Exam Hub — Subjects, Datesheet, Roll Numbers &amp; Results</p>
                  <p className="text-xs text-[#C59B3F] mt-0.5">Add subjects per course, set datesheet, allot roll numbers, enter marks and publish results.</p>
                </div>
                <Link href="/super-admin/dashboard/exam-management"
                  className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-[#C59B3F] hover:bg-[#A8852E] text-white text-sm font-bold transition-all">
                  Open Exam Hub <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              {/* Exam Config card */}
              <div className="bg-white rounded-2xl border border-[#DDD1BE] p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-sm text-[#0E3320]">Exam Configuration</p>
                  <p className="text-xs text-[#5C8261] mt-0.5">Set exam centers, dates, times and session labels per course — used for bulk admit card generation.</p>
                </div>
                <Link href="/super-admin/dashboard/exam-config"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-xs font-bold transition-all">
                  Manage Config <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* About Page Editor card */}
              <div className="bg-white rounded-2xl border border-[#DDD1BE] p-5 flex items-center justify-between gap-4">
                <div>
                  <p className="font-bold text-sm text-[#0E3320]">About Page Editor</p>
                  <p className="text-xs text-[#5C8261] mt-0.5">Edit hero text, milestones, vision, mission, objectives, values, faculty and CTA — all A to Z.</p>
                </div>
                <Link href="/super-admin/dashboard/about-editor"
                  className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-xs font-bold transition-all">
                  Edit About Page <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Sub-tabs */}
              <div className="flex gap-2">
                {["sessions", "centers"].map(t => (
                  <button key={t} onClick={() => setExamSubTab(t)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${examSubTab === t ? "bg-[#0E3320] text-white" : "bg-white border border-[#DDD1BE] text-[#5C8261] hover:bg-[#FAF8F5]"}`}>
                    {t === "sessions" ? "Exam Sessions" : "Exam Centers"}
                  </button>
                ))}
              </div>

              {examSubTab === "sessions" && (
                <div className="space-y-4">
                  {/* Add session form */}
                  <form onSubmit={addSession} className="bg-white rounded-2xl border border-[#DDD1BE] p-5 space-y-3">
                    <h3 className="text-sm font-bold text-[#0E3320]">Add New Session</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <input value={newSession.session_name} onChange={e => setNewSession(p => ({ ...p, session_name: e.target.value }))}
                        placeholder="Session name e.g. 2024-25 Annual" required
                        className="px-3 py-2 text-sm rounded-xl border border-[#DDD1BE] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] col-span-1 sm:col-span-1" />
                      <input type="date" value={newSession.start_date} onChange={e => setNewSession(p => ({ ...p, start_date: e.target.value }))}
                        className="px-3 py-2 text-sm rounded-xl border border-[#DDD1BE] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                      <input type="date" value={newSession.end_date} onChange={e => setNewSession(p => ({ ...p, end_date: e.target.value }))}
                        className="px-3 py-2 text-sm rounded-xl border border-[#DDD1BE] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                    </div>
                    <button type="submit" disabled={sessionSubmitting} className="px-5 py-2 rounded-xl bg-[#C59B3F] text-white text-xs font-bold hover:bg-[#A8832E] transition-all disabled:opacity-60 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> {sessionSubmitting ? "Adding..." : "Add Session"}
                    </button>
                  </form>

                  {/* Sessions list */}
                  <div className="space-y-2">
                    {examSessions.map(s => (
                      <div key={s.id} className={`bg-white rounded-2xl border p-4 flex items-center justify-between gap-3 ${s.is_active ? "border-emerald-300 bg-emerald-50" : "border-[#DDD1BE]"}`}>
                        <div>
                          <p className="font-bold text-[#0E3320] text-sm">{s.session_name}</p>
                          {(s.start_date || s.end_date) && (
                            <p className="text-xs text-[#5C8261]">{s.start_date || "—"} – {s.end_date || "—"}</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {s.is_active && <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">Active</span>}
                          <button onClick={() => toggleSession(s.id, !s.is_active)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${s.is_active ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>
                            {s.is_active ? "Deactivate" : "Set Active"}
                          </button>
                          <button onClick={() => deleteSession(s.id)} className="p-2 rounded-xl hover:bg-red-50 text-[#5C8261] hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                    {examSessions.length === 0 && !examLoading && (
                      <div className="p-10 text-center bg-white rounded-2xl border border-[#DDD1BE] text-[#5C8261] text-sm">No exam sessions yet.</div>
                    )}
                  </div>
                </div>
              )}

              {examSubTab === "centers" && (
                <div className="space-y-4">
                  {/* Add center form */}
                  <form onSubmit={addCenter} className="bg-white rounded-2xl border border-[#DDD1BE] p-5 space-y-3">
                    <h3 className="text-sm font-bold text-[#0E3320]">Add Exam Center</h3>
                    <div className="grid grid-cols-2 gap-3">
                      <input value={newCenter.center_name} onChange={e => setNewCenter(p => ({ ...p, center_name: e.target.value }))}
                        placeholder="Center name *" required
                        className="px-3 py-2 text-sm rounded-xl border border-[#DDD1BE] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                      <input value={newCenter.center_code} onChange={e => setNewCenter(p => ({ ...p, center_code: e.target.value }))}
                        placeholder="Center code"
                        className="px-3 py-2 text-sm rounded-xl border border-[#DDD1BE] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                      <input value={newCenter.city} onChange={e => setNewCenter(p => ({ ...p, city: e.target.value }))}
                        placeholder="City"
                        className="px-3 py-2 text-sm rounded-xl border border-[#DDD1BE] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                      <input value={newCenter.state} onChange={e => setNewCenter(p => ({ ...p, state: e.target.value }))}
                        placeholder="State"
                        className="px-3 py-2 text-sm rounded-xl border border-[#DDD1BE] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                      <input value={newCenter.address} onChange={e => setNewCenter(p => ({ ...p, address: e.target.value }))}
                        placeholder="Address" className="col-span-2 px-3 py-2 text-sm rounded-xl border border-[#DDD1BE] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                    </div>
                    <button type="submit" disabled={centerSubmitting} className="px-5 py-2 rounded-xl bg-[#C59B3F] text-white text-xs font-bold hover:bg-[#A8832E] transition-all disabled:opacity-60 flex items-center gap-1.5">
                      <Plus className="w-3.5 h-3.5" /> {centerSubmitting ? "Adding..." : "Add Center"}
                    </button>
                  </form>

                  {/* Centers list */}
                  <div className="space-y-2">
                    {examCenters.map(c => (
                      <div key={c.id} className="bg-white rounded-2xl border border-[#DDD1BE] p-4 flex items-center justify-between gap-3">
                        <div>
                          <p className="font-bold text-[#0E3320] text-sm">{c.center_name} {c.center_code && <span className="font-mono text-xs text-[#5C8261]">({c.center_code})</span>}</p>
                          {(c.city || c.state) && <p className="text-xs text-[#5C8261]">{[c.city, c.state].filter(Boolean).join(", ")}</p>}
                          {c.address && <p className="text-xs text-[#5C8261] truncate max-w-xs">{c.address}</p>}
                        </div>
                        <button onClick={() => deleteCenter(c.id)} className="p-2 rounded-xl hover:bg-red-50 text-[#5C8261] hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    ))}
                    {examCenters.length === 0 && !examLoading && (
                      <div className="p-10 text-center bg-white rounded-2xl border border-[#DDD1BE] text-[#5C8261] text-sm">No exam centers yet.</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── TAB: ANNOUNCEMENTS ── */}
          {activeTab === "announcements" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0E3320]">Announcements</h2>
                  <p className="text-xs text-[#5C8261]">Publish notices and updates for colleges and students.</p>
                </div>
                <button onClick={loadAnnouncements} disabled={annLoading} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E3320] text-white text-xs font-bold hover:bg-[#15482D] transition-all">
                  <RefreshCw className={`w-3.5 h-3.5 ${annLoading ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>

              {/* Add form */}
              <form onSubmit={addAnnouncement} className="bg-white rounded-2xl border border-[#DDD1BE] p-5 space-y-3">
                <h3 className="text-sm font-bold text-[#0E3320]">New Announcement</h3>
                <input value={newAnn.title} onChange={e => setNewAnn(p => ({ ...p, title: e.target.value }))}
                  placeholder="Title *" required
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#DDD1BE] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                <textarea value={newAnn.content} onChange={e => setNewAnn(p => ({ ...p, content: e.target.value }))}
                  placeholder="Content (optional)" rows={3}
                  className="w-full px-3 py-2 text-sm rounded-xl border border-[#DDD1BE] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] resize-none" />
                {/* File attachment */}
                <div>
                  <label className="block text-xs font-bold text-[#5C8261] mb-1">Attachment (PDF / Image — max 5 MB)</label>
                  <input type="file" accept=".pdf,image/*" onChange={e => setAnnFile(e.target.files?.[0] || null)}
                    className="block w-full text-xs text-[#5C8261] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-bold file:bg-[#F2EDE4] file:text-[#0E3320] hover:file:bg-[#DDD1BE] cursor-pointer" />
                  {annFile && <p className="mt-1 text-[10px] text-emerald-600 font-semibold">Selected: {annFile.name} ({(annFile.size/1024).toFixed(0)} KB)</p>}
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-xs font-semibold text-[#5C8261] cursor-pointer">
                    <input type="checkbox" checked={newAnn.is_published} onChange={e => setNewAnn(p => ({ ...p, is_published: e.target.checked }))} className="w-4 h-4 accent-[#0E3320]" />
                    Publish immediately
                  </label>
                  <button type="submit" disabled={annSubmitting || annUploading} className="px-5 py-2 rounded-xl bg-[#C59B3F] text-white text-xs font-bold hover:bg-[#A8832E] transition-all disabled:opacity-60 flex items-center gap-1.5 ml-auto">
                    <Plus className="w-3.5 h-3.5" /> {annUploading ? "Uploading..." : annSubmitting ? "Adding..." : "Add Announcement"}
                  </button>
                </div>
              </form>

              {/* List */}
              <div className="space-y-3">
                {annLoading && <div className="p-10 text-center"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#C59B3F]" /></div>}
                {!annLoading && announcements.map(a => (
                  <div key={a.id} className={`bg-white rounded-2xl border p-4 ${a.is_published ? "border-emerald-200" : "border-[#DDD1BE]"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-bold text-[#0E3320] text-sm">{a.title}</p>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${a.is_published ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                            {a.is_published ? "Published" : "Draft"}
                          </span>
                        </div>
                        {a.content && <p className="text-xs text-[#5C8261] line-clamp-2">{a.content}</p>}
                        {a.attachment_url && (
                          <a href={a.attachment_url} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-lg bg-[#F2EDE4] text-[#C59B3F] text-[10px] font-bold hover:bg-[#DDD1BE] transition-colors">
                            📎 {a.attachment_name || "Attachment"}
                          </a>
                        )}
                        <p className="text-[10px] text-[#5C8261] mt-1">{new Date(a.created_at).toLocaleDateString("en-IN")}</p>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button onClick={() => toggleAnnPublish(a.id, !a.is_published)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${a.is_published ? "bg-gray-100 text-gray-600 hover:bg-gray-200" : "bg-emerald-600 text-white hover:bg-emerald-700"}`}>
                          {a.is_published ? "Unpublish" : "Publish"}
                        </button>
                        <button onClick={() => deleteAnn(a.id)} className="p-2 rounded-xl hover:bg-red-50 text-[#5C8261] hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  </div>
                ))}
                {!annLoading && announcements.length === 0 && (
                  <div className="p-10 text-center bg-white rounded-2xl border border-[#DDD1BE] text-[#5C8261] text-sm">No announcements yet.</div>
                )}
              </div>
            </div>
          )}

          {/* ── TAB: CONTACT INQUIRIES ── */}
          {activeTab === "inquiries" && (
            <div className="space-y-6">
              {/* Inquiry Detail Modal */}
              {selectedInquiry && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                  <div className="bg-[#FAF8F5] max-w-lg w-full rounded-3xl shadow-2xl border border-[#DDD1BE] p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-[#0E3320]">Inquiry from {selectedInquiry.full_name || selectedInquiry.name}</h3>
                      <button onClick={() => setSelectedInquiry(null)} className="p-1.5 rounded-full hover:bg-[#F2EDE4] text-[#5C8261]"><X className="w-4 h-4" /></button>
                    </div>
                    <div className="text-xs space-y-1 text-[#5C8261]">
                      <p><span className="font-bold text-[#0E3320]">Email:</span> {selectedInquiry.email}</p>
                      {selectedInquiry.phone && <p><span className="font-bold text-[#0E3320]">Phone:</span> {selectedInquiry.phone}</p>}
                      {(selectedInquiry.subject || selectedInquiry.query_type) && <p><span className="font-bold text-[#0E3320]">Query Type:</span> {selectedInquiry.subject || selectedInquiry.query_type}</p>}
                      <p className="mt-2"><span className="font-bold text-[#0E3320]">Message:</span></p>
                      <p className="bg-white p-3 rounded-xl border border-[#DDD1BE]">{selectedInquiry.message}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-[#5C8261]">Status</label>
                      <select value={inquiryStatus} onChange={e => setInquiryStatus(e.target.value)}
                        className="w-full px-3 py-2 text-sm rounded-xl border border-[#DDD1BE] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]">
                        <option value="new">New</option>
                        <option value="in_progress">In Progress</option>
                        <option value="resolved">Resolved</option>
                      </select>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedInquiry(null)} className="flex-1 py-2 rounded-xl border border-[#DDD1BE] text-xs font-bold text-[#5C8261] hover:bg-[#FAF8F5]">Cancel</button>
                      <button onClick={saveInquiry} disabled={inquirySaving} className="flex-1 py-2 rounded-xl bg-[#0E3320] text-white text-xs font-bold disabled:opacity-60 flex items-center justify-center gap-1.5">
                        {inquirySaving ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />} Save
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between flex-wrap gap-3">
                <div>
                  <h2 className="text-lg font-bold text-[#0E3320]">Contact Inquiries</h2>
                  <p className="text-xs text-[#5C8261]">Messages from students and colleges via contact form.</p>
                </div>
                <button onClick={loadInquiries} disabled={inquiriesLoading} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E3320] text-white text-xs font-bold hover:bg-[#15482D] transition-all">
                  <RefreshCw className={`w-3.5 h-3.5 ${inquiriesLoading ? "animate-spin" : ""}`} /> Refresh
                </button>
              </div>

              {/* Filter */}
              <div className="flex gap-2 flex-wrap">
                {["all", "new", "in_progress", "resolved"].map(f => (
                  <button key={f} onClick={() => setInquiryFilter(f)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${inquiryFilter === f ? "bg-[#0E3320] text-white" : "bg-white border border-[#DDD1BE] text-[#5C8261] hover:bg-[#FAF8F5]"}`}>
                    {f === "all" ? "All" : f === "in_progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
                    {f !== "all" && <span className="ml-1.5">({inquiries.filter(i => i.status === f).length})</span>}
                  </button>
                ))}
              </div>

              {inquiriesLoading ? (
                <div className="p-10 text-center"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#C59B3F]" /></div>
              ) : (
                <div className="rounded-2xl border border-[#DDD1BE] overflow-hidden bg-white">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF8F5] border-b border-[#DDD1BE] text-[#0E3320] uppercase font-bold tracking-wider">
                        <tr>
                          <th className="px-4 py-3 w-6">#</th>
                          <th className="px-4 py-3">Name</th>
                          <th className="px-4 py-3">Email / Phone</th>
                          <th className="px-4 py-3">Query Type</th>
                          <th className="px-4 py-3">Message</th>
                          <th className="px-4 py-3 text-center">Status</th>
                          <th className="px-4 py-3 text-center">Date</th>
                          <th className="px-4 py-3 text-center">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F0EAE0]">
                        {inquiries.filter(i => inquiryFilter === "all" || i.status === inquiryFilter).map((i, idx) => (
                          <tr key={i.id} className={`hover:bg-[#FAF8F5] transition-colors ${!i.is_read ? "bg-amber-50/40" : ""}`}>
                            <td className="px-4 py-3 text-[#9B8265] font-mono">{idx + 1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-1.5">
                                {!i.is_read && <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />}
                                <span className="font-bold text-[#0E3320]">{i.full_name || i.name}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 text-[#5C8261]">
                              <div>{i.email}</div>
                              {i.phone && <div className="text-[#9B8265]">{i.phone}</div>}
                            </td>
                            <td className="px-4 py-3 text-[#0E3320] font-medium max-w-[160px]">
                              <span className="line-clamp-2">{i.subject || i.query_type || "—"}</span>
                            </td>
                            <td className="px-4 py-3 text-[#5C8261] max-w-[200px]">
                              <span className="line-clamp-2">{i.message}</span>
                            </td>
                            <td className="px-4 py-3 text-center">
                              <span className={`px-2 py-1 rounded-full text-[10px] font-bold whitespace-nowrap ${i.status === "new" ? "bg-blue-100 text-blue-700" : i.status === "in_progress" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                                {i.status === "in_progress" ? "In Progress" : i.status.charAt(0).toUpperCase() + i.status.slice(1)}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-center text-[#9B8265] whitespace-nowrap">
                              {new Date(i.created_at).toLocaleDateString("en-IN")}
                            </td>
                            <td className="px-4 py-3 text-center">
                              <button
                                onClick={() => { setSelectedInquiry(i); setInquiryNotes(i.admin_notes || ""); setInquiryStatus(i.status); }}
                                className="px-3 py-1.5 rounded-lg bg-[#0E3320] text-white text-[11px] font-bold hover:bg-[#15482D] transition-colors cursor-pointer">
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                        {inquiries.filter(i => inquiryFilter === "all" || i.status === inquiryFilter).length === 0 && (
                          <tr><td colSpan={8} className="py-10 text-center text-[#5C8261]">No inquiries found.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB: STUDENT APPLICATIONS */}
          {activeTab === "applications" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-bold text-[#0E3320]">Student Applications</h2>
                  <p className="text-xs text-[#5C8261]">Review, approve, reject or raise queries on submitted registrations.</p>
                </div>
                <button onClick={loadApplications} disabled={appLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#0E3320] text-white text-xs font-bold hover:bg-[#15482D] transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${appLoading ? "animate-spin" : ""}`} />
                  Refresh
                </button>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {Object.entries(APP_STATUS).map(([key, cfg]) => (
                  <button key={key} onClick={() => setAppFilter(key === appFilter ? "all" : key)}
                    className={`p-3 rounded-xl border text-left transition-all ${appFilter === key ? "border-[#C59B3F] bg-[#FAF3E0]" : "border-[#DDD1BE] bg-white hover:border-[#C59B3F]/50"}`}
                  >
                    <div className={`text-lg font-bold text-[#0E3320]`}>
                      {applications.filter(a => a.status === key).length}
                    </div>
                    <div className="text-[10px] font-semibold text-[#5C8261] mt-0.5">{cfg.label}</div>
                  </button>
                ))}
              </div>

              {/* Search + Filter */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5C8261]" />
                  <input type="text" placeholder="Search by name, enrollment no..." value={appSearch}
                    onChange={(e) => setAppSearch(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && loadApplications()}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[#DDD1BE] bg-white text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>
                <select value={appFilter} onChange={(e) => setAppFilter(e.target.value)}
                  className="px-3 py-2.5 rounded-xl border border-[#DDD1BE] bg-white text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                >
                  <option value="all">All Statuses</option>
                  {Object.entries(APP_STATUS).map(([key, cfg]) => (
                    <option key={key} value={key}>{cfg.label}</option>
                  ))}
                </select>
              </div>

              {/* Table */}
              <div className="bg-white rounded-2xl border border-[#DDD1BE] shadow-sm overflow-hidden">
                {appLoading ? (
                  <div className="p-12 text-center text-[#5C8261]">
                    <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3 text-[#C59B3F]" />
                    <p className="text-sm font-semibold">Loading applications...</p>
                  </div>
                ) : applications.filter(a => {
                  const matchStatus = appFilter === "all" || a.status === appFilter;
                  const q = appSearch.toLowerCase();
                  const matchSearch = !q || a.candidate_name?.toLowerCase().includes(q) || a.enrollment_no?.toLowerCase().includes(q);
                  return matchStatus && matchSearch;
                }).length === 0 ? (
                  <div className="p-12 text-center text-[#5C8261]">
                    <ClipboardList className="w-10 h-10 mx-auto mb-3 text-[#DDD1BE]" />
                    <p className="font-semibold text-[#0E3320]">No applications found</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#F2EDE4] border-b border-[#DDD1BE]">
                        <tr>
                          <th className="py-3 px-4 font-bold text-[#0E3320] uppercase tracking-wide">Enroll No</th>
                          <th className="py-3 px-4 font-bold text-[#0E3320] uppercase tracking-wide">Candidate</th>
                          <th className="py-3 px-4 font-bold text-[#0E3320] uppercase tracking-wide">Course</th>
                          <th className="py-3 px-4 font-bold text-[#0E3320] uppercase tracking-wide">College</th>
                          <th className="py-3 px-4 font-bold text-[#0E3320] uppercase tracking-wide">Status</th>
                          <th className="py-3 px-4 font-bold text-[#0E3320] uppercase tracking-wide text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#F2EDE4]">
                        {applications.filter(a => {
                          const matchStatus = appFilter === "all" || a.status === appFilter;
                          const q = appSearch.toLowerCase();
                          const matchSearch = !q || a.candidate_name?.toLowerCase().includes(q) || a.enrollment_no?.toLowerCase().includes(q);
                          return matchStatus && matchSearch;
                        }).map((app) => {
                          const cfg = APP_STATUS[app.status] || APP_STATUS.pending;
                          return (
                            <tr key={app.id} className="hover:bg-[#FAF8F5] transition-colors">
                              <td className="py-3 px-4 font-mono font-bold text-[#0E3320]">{app.enrollment_no || "—"}</td>
                              <td className="py-3 px-4 font-semibold text-[#0E3320]">{app.candidate_name}</td>
                              <td className="py-3 px-4 text-[#5C8261] max-w-[200px] truncate">{app.courses?.course_name || "—"}</td>
                              <td className="py-3 px-4 text-[#5C8261]">{app.colleges?.college_name || "—"}</td>
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold ${cfg.color}`}>
                                  <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
                                  {cfg.label}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center gap-2 justify-end">
                                  <button onClick={() => openAppDetail(app)}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0E3320] hover:bg-[#15482D] text-white text-[10px] font-bold transition-all"
                                  >
                                    <Eye className="w-3 h-3" /> Quick
                                  </button>
                                  <Link href={`/super-admin/dashboard/registrations/${app.id}`}
                                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#C59B3F] hover:bg-[#B88B35] text-[#0E3320] text-[10px] font-bold transition-all"
                                  >
                                    <ExternalLink className="w-3 h-3" /> Detail
                                  </Link>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* APPLICATION DETAIL SLIDE-OVER */}
          {selectedApp && (
            <div className="fixed inset-0 z-50 flex">
              <div className="flex-1 bg-black/50" onClick={() => setSelectedApp(null)} />
              <div className="w-full max-w-2xl bg-white flex flex-col overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="bg-[#0E3320] text-white px-6 py-4 flex items-center justify-between shrink-0">
                  <div>
                    <h3 className="font-bold text-base">{selectedApp.candidate_name}</h3>
                    <p className="text-xs text-[#DDD1BE]">{selectedApp.enrollment_no || "No enrollment no."}</p>
                  </div>
                  <button onClick={() => setSelectedApp(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Body */}
                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  {appDetailLoading ? (
                    <div className="text-center py-12">
                      <RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#C59B3F]" />
                    </div>
                  ) : (
                    <>
                      {/* Status badge */}
                      <div className="flex items-center justify-between">
                        {(() => { const cfg = APP_STATUS[selectedApp.status] || APP_STATUS.pending; return (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold ${cfg.color}`}>
                            <span className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                            {cfg.label}
                          </span>
                        ); })()}
                        <span className="text-xs text-[#5C8261]">{selectedApp.created_at ? new Date(selectedApp.created_at).toLocaleDateString("en-IN") : ""}</span>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        {[
                          ["Father's Name", selectedApp.father_name],
                          ["Mother's Name", selectedApp.mother_name],
                          ["Date of Birth", selectedApp.dob],
                          ["Gender", selectedApp.gender],
                          ["Category", selectedApp.category],
                          ["Phone", selectedApp.phone],
                          ["Email", selectedApp.email],
                          ["Course", selectedApp.courses?.course_name],
                          ["College", selectedApp.colleges?.college_name],
                          ["Session", selectedApp.session_label || selectedApp.academic_session],
                          ["State", selectedApp.state],
                          ["City", selectedApp.city],
                        ].map(([label, val]) => val ? (
                          <div key={label} className="bg-[#FAF8F5] rounded-xl p-3 border border-[#DDD1BE]">
                            <p className="text-[10px] font-bold uppercase text-[#5C8261] mb-0.5">{label}</p>
                            <p className="font-semibold text-[#0E3320] truncate">{val}</p>
                          </div>
                        ) : null)}
                      </div>

                      {/* Document Links */}
                      {(selectedApp.photo_url || selectedApp.tenth_marksheet_url || selectedApp.twelfth_marksheet_url) && (
                        <div>
                          <p className="text-xs font-bold text-[#0E3320] mb-2 uppercase tracking-wide">Documents</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedApp.photo_url && <a href={selectedApp.photo_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-[#F2EDE4] text-xs font-semibold text-[#0E3320] border border-[#DDD1BE] hover:border-[#C59B3F]">Photo</a>}
                            {selectedApp.tenth_marksheet_url && <a href={selectedApp.tenth_marksheet_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-[#F2EDE4] text-xs font-semibold text-[#0E3320] border border-[#DDD1BE] hover:border-[#C59B3F]">10th Marksheet</a>}
                            {selectedApp.twelfth_marksheet_url && <a href={selectedApp.twelfth_marksheet_url} target="_blank" rel="noreferrer" className="px-3 py-1.5 rounded-lg bg-[#F2EDE4] text-xs font-semibold text-[#0E3320] border border-[#DDD1BE] hover:border-[#C59B3F]">12th Marksheet</a>}
                          </div>
                        </div>
                      )}

                      {/* Existing Queries */}
                      {appQueries.length > 0 && (
                        <div>
                          <p className="text-xs font-bold text-[#0E3320] mb-2 uppercase tracking-wide">Queries Raised</p>
                          <div className="space-y-2">
                            {appQueries.map((q) => (
                              <div key={q.id} className={`p-3 rounded-xl border text-xs ${q.status === "resolved" ? "bg-emerald-50 border-emerald-200" : "bg-amber-50 border-amber-200"}`}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="font-bold text-[#0E3320] capitalize">{q.field_name}</span>
                                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${q.status === "resolved" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                                    {q.status}
                                  </span>
                                </div>
                                <p className="text-[#5C8261]">{q.message}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                {/* Actions Footer */}
                {!appDetailLoading && selectedApp.status !== "approved" && selectedApp.status !== "rejected" && (
                  <div className="border-t border-[#DDD1BE] px-6 py-4 flex flex-wrap gap-2 shrink-0 bg-[#FAF8F5]">
                    <button onClick={() => approveApp(selectedApp.id)} disabled={actionLoading}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-all disabled:opacity-60"
                    >
                      <CheckCircle className="w-4 h-4" /> Approve
                    </button>
                    <button onClick={() => setQueryModal(true)} disabled={actionLoading}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all disabled:opacity-60"
                    >
                      <MessageSquarePlus className="w-4 h-4" /> Raise Query
                    </button>
                    <button onClick={() => setRejectModal(true)} disabled={actionLoading}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all disabled:opacity-60"
                    >
                      <XCircle className="w-4 h-4" /> Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* QUERY MODAL */}
          {queryModal && selectedApp && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60" onClick={() => setQueryModal(false)} />
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                <h3 className="font-bold text-[#0E3320] text-base">Raise a Query</h3>
                <p className="text-xs text-[#5C8261]">College will see this in their notifications and can resubmit after fixing.</p>
                <div>
                  <label className="text-xs font-bold text-[#0E3320] uppercase mb-1 block">Field / Section</label>
                  <select value={queryField} onChange={(e) => setQueryField(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DDD1BE] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  >
                    <option value="general">General</option>
                    <option value="photo">Photograph</option>
                    <option value="aadhaar">Aadhaar Card</option>
                    <option value="marksheet_10th">10th Marksheet</option>
                    <option value="marksheet_12th">12th Marksheet</option>
                    <option value="personal_details">Personal Details</option>
                    <option value="course_details">Course Details</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-[#0E3320] uppercase mb-1 block">Query Message</label>
                  <textarea value={queryMsg} onChange={(e) => setQueryMsg(e.target.value)}
                    rows={3} placeholder="Describe the issue clearly so the college can fix it..."
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DDD1BE] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setQueryModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-[#DDD1BE] text-xs font-bold text-[#5C8261] hover:bg-[#F2EDE4] transition-all">Cancel</button>
                  <button onClick={() => raiseQuery(selectedApp.id)} disabled={querySubmitting || !queryMsg.trim()}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold transition-all disabled:opacity-60"
                  >
                    {querySubmitting ? "Sending..." : "Send Query"}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* REJECT MODAL */}
          {rejectModal && selectedApp && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <div className="absolute inset-0 bg-black/60" onClick={() => setRejectModal(false)} />
              <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 space-y-4">
                <h3 className="font-bold text-[#0E3320] text-base">Reject Application</h3>
                <div>
                  <label className="text-xs font-bold text-[#0E3320] uppercase mb-1 block">Reason (optional)</label>
                  <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}
                    rows={3} placeholder="Briefly state the rejection reason..."
                    className="w-full px-3 py-2.5 rounded-xl border border-[#DDD1BE] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] resize-none"
                  />
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setRejectModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-[#DDD1BE] text-xs font-bold text-[#5C8261] hover:bg-[#F2EDE4] transition-all">Cancel</button>
                  <button onClick={() => rejectApp(selectedApp.id)} disabled={actionLoading}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all disabled:opacity-60"
                  >
                    {actionLoading ? "Rejecting..." : "Confirm Reject"}
                  </button>
                </div>
              </div>
            </div>
          )}

          </main>
        </div>
      </div>
    </div>
  );
}
