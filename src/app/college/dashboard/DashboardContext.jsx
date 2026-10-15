"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Clock,
  Send,
  Eye,
  MessageSquare,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export const STATUS_LABELS = {
  pending:      { label: "Pending",      color: "bg-amber-50 text-amber-700 border-amber-200",      icon: Clock          },
  submitted:    { label: "Submitted",    color: "bg-blue-50 text-blue-700 border-blue-200",          icon: Send           },
  under_review: { label: "Under Review", color: "bg-violet-50 text-violet-700 border-violet-200",  icon: Eye            },
  query_raised: { label: "Query Raised", color: "bg-orange-50 text-orange-700 border-orange-200",  icon: MessageSquare  },
  approved:     { label: "Approved",     color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2  },
  rejected:     { label: "Rejected",     color: "bg-red-50 text-red-700 border-red-200",             icon: AlertTriangle },
};

const DashboardContext = createContext(null);

export function DashboardProvider({ children }) {
  const router = useRouter();
  const [college, setCollege]                   = useState(null);
  const [students, setStudents]                 = useState([]);
  const [loading, setLoading]                   = useState(true);
  const [search, setSearch]                     = useState("");
  const [statusFilter, setStatusFilter]         = useState("all");

  // Detail Modal
  const [selectedStudent, setSelectedStudent]   = useState(null);
  const [rollInput, setRollInput]               = useState("");
  const [enrollInput, setEnrollInput]           = useState("");
  const [sessionInput, setSessionInput]         = useState("");
  const [saving, setSaving]                     = useState(false);

  // Courses
  const [courses, setCourses]                   = useState([]);

  // Notifications
  const [notifications, setNotifications]       = useState([]);
  const [notifLoading, setNotifLoading]         = useState(false);

  // Queries & Edit
  const [studentQueries, setStudentQueries]     = useState([]);
  const [editForm, setEditForm]                 = useState(null);

  // Enrolled
  const [enrolled, setEnrolled]                 = useState([]);
  const [enrolledLoading, setEnrolledLoading]   = useState(false);
  const [enrolledSearch, setEnrolledSearch]     = useState("");

  // Toast
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  useEffect(() => {
    fetch("/api/college/me")
      .then((r) => r.json())
      .then((d) => {
        if (!d.ok) {
          router.push("/college/login");
          return;
        }
        setCollege(d.college);
      })
      .catch(() => router.push("/college/login"));
  }, [router]);

  useEffect(() => {
    if (!college) return;
    loadStudents();
    loadNotifications();
    loadEnrolled();
    fetch("/api/college/courses")
      .then((r) => r.json())
      .then((d) => { if (d.ok) setCourses(d.data || []); })
      .catch(() => {});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [college]);

  const loadNotifications = async () => {
    setNotifLoading(true);
    try {
      const res = await fetch("/api/college/notifications");
      const data = await res.json();
      if (data.ok) setNotifications(data.notifications || []);
    } catch {}
    setNotifLoading(false);
  };

  const loadEnrolled = async () => {
    setEnrolledLoading(true);
    try {
      const res = await fetch("/api/college/enrolled");
      const data = await res.json();
      if (data.ok) setEnrolled(data.data || []);
    } catch {}
    setEnrolledLoading(false);
  };

  const loadStudents = async (filterOverride, searchOverride) => {
    setLoading(true);
    try {
      const filter = filterOverride !== undefined ? filterOverride : statusFilter;
      const q = searchOverride !== undefined ? searchOverride : search;
      const params = new URLSearchParams();
      if (filter && filter !== "all") params.set("status", filter);
      if (q) params.set("search", q);
      const res = await fetch(`/api/college/students?${params}`);
      const data = await res.json();
      if (data.ok) setStudents(data.data || []);
    } catch {}
    setLoading(false);
  };

  const openDetail = async (student) => {
    setSelectedStudent(student);
    setRollInput(student.roll_no || "");
    setEnrollInput(student.enrollment_no || "");
    setSessionInput(student.session_label || "");
    setStudentQueries([]);
    setEditForm(null);
    try {
      const res = await fetch(`/api/college/students/${student.id}`);
      const data = await res.json();
      if (data.ok) {
        setSelectedStudent(data.data);
        setStudentQueries(data.queries || []);
      }
    } catch {}
  };

  const closeDetail = () => {
    setSelectedStudent(null);
    setEditForm(null);
  };

  const startEdit = () => {
    const s = selectedStudent;
    if (!s) return;
    setEditForm({
      candidate_name: s.candidate_name || "",
      father_name:    s.father_name || "",
      mother_name:    s.mother_name || "",
      dob:            s.dob || "",
      gender:         s.gender || "",
      category:       s.category || "",
      aadhar_no:      s.aadhar_no || "",
      phone:          s.phone || "",
      email:          s.email || "",
      address:        s.address || "",
      city:           s.city || "",
      state:          s.state || "",
      pincode:        s.pincode || "",
    });
  };

  const resubmit = async () => {
    if (!selectedStudent || !editForm) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/college/students/${selectedStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, resubmit: true }),
      });
      const data = await res.json();
      if (data.ok) {
        setStudents((prev) =>
          prev.map((s) => (s.id === selectedStudent.id ? { ...s, ...data.data } : s))
        );
        setSelectedStudent((prev) => ({ ...prev, ...data.data }));
        setStudentQueries((prev) => prev.map((q) => ({ ...q, status: "resolved" })));
        setEditForm(null);
        loadNotifications();
        showToast("Application resubmitted to admin.", "success");
      } else {
        showToast(data.error || "Resubmit failed.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    }
    setSaving(false);
  };

  const saveDetails = async () => {
    if (!selectedStudent) return;
    setSaving(true);
    try {
      const res = await fetch(`/api/college/students/${selectedStudent.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roll_no:       rollInput,
          enrollment_no: enrollInput,
          session_label: sessionInput,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setStudents((prev) =>
          prev.map((s) =>
            s.id === selectedStudent.id
              ? { ...s, roll_no: rollInput, enrollment_no: enrollInput, session_label: sessionInput }
              : s
          )
        );
        setSelectedStudent((prev) =>
          prev
            ? { ...prev, roll_no: rollInput, enrollment_no: enrollInput, session_label: sessionInput }
            : null
        );
        showToast("Academic details saved.", "success");
      } else {
        showToast(data.error || "Failed to save.", "error");
      }
    } catch {
      showToast("Network error.", "error");
    }
    setSaving(false);
  };

  const handleLogout = async () => {
    await fetch("/api/college/logout", { method: "POST" });
    router.push("/college/login");
  };

  const openNotifCount = notifications.filter((n) => n.status === "open").length;

  const counts = {
    all:          students.length,
    pending:      students.filter((s) => s.status === "pending").length,
    submitted:    students.filter((s) => s.status === "submitted").length,
    under_review: students.filter((s) => s.status === "under_review").length,
    query_raised: students.filter((s) => s.status === "query_raised").length,
    approved:     students.filter((s) => s.status === "approved").length,
    rejected:     students.filter((s) => s.status === "rejected").length,
  };

  return (
    <DashboardContext.Provider
      value={{
        college,
        students,
        setStudents,
        loading,
        loadStudents,
        search,
        setSearch,
        statusFilter,
        setStatusFilter,
        counts,
        notifications,
        notifLoading,
        loadNotifications,
        openNotifCount,
        enrolled,
        enrolledLoading,
        loadEnrolled,
        enrolledSearch,
        setEnrolledSearch,
        courses,
        toast,
        setToast,
        showToast,
        selectedStudent,
        openDetail,
        closeDetail,
        rollInput,
        setRollInput,
        enrollInput,
        setEnrollInput,
        sessionInput,
        setSessionInput,
        saving,
        saveDetails,
        studentQueries,
        editForm,
        setEditForm,
        startEdit,
        resubmit,
        handleLogout,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
}
