"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  CheckCircle2,
  X,
  MapPin,
  Phone,
  Mail,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  GraduationCap
} from "lucide-react";

// The official 14 institutions matching the public site
const INITIAL_INSTITUTES = [
  {
    id: 1,
    name: "S.P College of Paramedical Sciences",
    nameHi: "एस.पी. कॉलेज ऑफ पैरामेडिकल साइंसेज",
    address: "TIYARI ARA, Jaunpur, Uttar Pradesh - 222001",
    city: "Jaunpur",
    state: "Uttar Pradesh",
    type: "Paramedical & Yoga Sciences",
    code: "BA-AFF-01",
    dean: "Dr. R.K. Pandey",
    phone: "+91 98391 12345",
    email: "spcollege.jnp@bhartiyaayurveda.org",
    status: "Active & Verified",
    enrolledStudents: 142,
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
    dean: "Dr. Anand Swaroop",
    phone: "+91 94150 98765",
    email: "sushail.ayodhya@bhartiyaayurveda.org",
    status: "Active & Verified",
    enrolledStudents: 118,
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
    dean: "Dr. B.N. Shukla",
    phone: "+91 98380 44556",
    email: "rscollege.basti@bhartiyaayurveda.org",
    status: "Active & Verified",
    enrolledStudents: 96,
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
    dean: "Dr. Sudhir Yadav",
    phone: "+91 99182 33445",
    email: "gyanprabhat@bhartiyaayurveda.org",
    status: "Active & Verified",
    enrolledStudents: 125,
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
    dean: "Dr. Tariq Mahmood",
    phone: "+91 94500 12890",
    email: "mhd.gkp@bhartiyaayurveda.org",
    status: "Active & Verified",
    enrolledStudents: 160,
  },
  {
    id: 6,
    name: "Sreenidhi Marabashettar Medical Institute",
    nameHi: "श्रीनिधि मारबशेट्टार मेडिकल इंस्टीट्यूट",
    address: "Vidyanagar, Hubli, Karnataka - 580030",
    city: "Hubli",
    state: "Karnataka",
    type: "Medical & Holistic Sciences",
    code: "BA-AFF-06",
    dean: "Dr. Prakash Patil",
    phone: "+91 83622 45678",
    email: "sreenidhi.hubli@bhartiyaayurveda.org",
    status: "Active & Verified",
    enrolledStudents: 85,
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
    dean: "Dr. Vinay Mishra",
    phone: "+91 97920 11223",
    email: "aarvi.bhadohi@bhartiyaayurveda.org",
    status: "Under Review",
    enrolledStudents: 64,
  },
];

const STATES = ["All", "Uttar Pradesh", "Karnataka", "Uttarakhand", "Maharashtra", "Delhi NCR"];

export default function InstituteManager({ onShowToast }) {
  const [institutes, setInstitutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    nameHi: "",
    address: "",
    city: "",
    state: "Uttar Pradesh",
    type: "Paramedical & Yoga Sciences",
    dean: "",
    phone: "",
    email: "",
    status: "Active & Verified",
    enrolledStudents: 50,
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bhartiya_admin_institutes");
      if (stored) {
        try {
          setInstitutes(JSON.parse(stored));
          return;
        } catch (e) {
          // ignore
        }
      }
      setInstitutes(INITIAL_INSTITUTES);
    }
  }, []);

  const saveInstitutes = (newItems) => {
    setInstitutes(newItems);
    if (typeof window !== "undefined") {
      localStorage.setItem("bhartiya_admin_institutes", JSON.stringify(newItems));
    }
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({ ...item });
    } else {
      setEditingItem(null);
      const nextNum = institutes.length + 1;
      const autoCode = `BA-AFF-${nextNum < 10 ? "0" + nextNum : nextNum}`;
      setFormData({
        code: autoCode,
        name: "",
        nameHi: "",
        address: "",
        city: "",
        state: "Uttar Pradesh",
        type: "Paramedical & Yoga Sciences",
        dean: "",
        phone: "+91 ",
        email: "",
        status: "Active & Verified",
        enrolledStudents: 0,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.code.trim() || !formData.city.trim()) {
      if (onShowToast) onShowToast("Please enter institute name, code, and city", "error");
      return;
    }

    if (editingItem) {
      const updated = institutes.map((it) =>
        it.id === editingItem.id ? { ...it, ...formData } : it
      );
      saveInstitutes(updated);
      if (onShowToast) onShowToast("Institute details updated successfully!", "success");
    } else {
      const newItem = {
        id: Date.now(),
        ...formData,
      };
      const updated = [newItem, ...institutes];
      saveInstitutes(updated);
      if (onShowToast) onShowToast("New affiliated institute registered!", "success");
    }
    closeModal();
  };

  const handleDelete = (id) => {
    const updated = institutes.filter((it) => it.id !== id);
    saveInstitutes(updated);
    setDeleteConfirmId(null);
    if (onShowToast) onShowToast("Affiliated institute removed from registry.", "info");
  };

  const handleToggleStatus = (id) => {
    const updated = institutes.map((it) => {
      if (it.id === id) {
        const newStatus =
          it.status === "Active & Verified" ? "Under Review" : "Active & Verified";
        return { ...it, status: newStatus };
      }
      return it;
    });
    saveInstitutes(updated);
    if (onShowToast) onShowToast("Institute accreditation status updated.", "info");
  };

  const handleResetDefaults = () => {
    if (confirm("Reset institute registry to initial 14 institutions?")) {
      saveInstitutes(INITIAL_INSTITUTES);
      if (onShowToast) onShowToast("Institutes registry restored to defaults.", "info");
    }
  };

  // Filtered institutes
  const filteredInstitutes = institutes.filter((item) => {
    const matchesState =
      selectedState === "All" || item.state === selectedState;
    const matchesStatus =
      selectedStatus === "All" || item.status === selectedStatus;
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.nameHi && item.nameHi.includes(searchQuery));
    return matchesState && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DDD1BE] shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#0E3320] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C59B3F]" />
            Affiliated Institutes Management
          </h2>
          <p className="text-xs text-[#5C8261] mt-0.5">
            Add, edit, verify, or de-register accredited Ayurvedic colleges &amp; paramedical study centers ({institutes.length} centers total)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 text-xs font-semibold text-[#8C671D] hover:text-[#0E3320] hover:bg-[#FAF8F5] rounded-xl border border-[#DDD1BE] transition-all flex items-center gap-1.5"
            title="Reset to default institutes"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={() => openModal()}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0E3320] hover:bg-[#15482D] rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#C59B3F]" />
            <span>Add New Institute</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DDD1BE]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C8261]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code, college name, city..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* State Filter */}
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
          >
            {STATES.map((st) => (
              <option key={st} value={st}>
                {st === "All" ? "All States" : st}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
          >
            <option value="All">All Statuses</option>
            <option value="Active & Verified">Active &amp; Verified</option>
            <option value="Under Review">Under Review</option>
          </select>
        </div>
      </div>

      {/* Institutes Table View */}
      <div className="rounded-3xl bg-white border border-[#DDD1BE] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF8F5] text-[#0E3320] uppercase font-bold tracking-wider border-b border-[#DDD1BE]">
              <tr>
                <th className="py-3.5 px-6">Affiliation Code</th>
                <th className="py-3.5 px-6">Institute Name &amp; Dean</th>
                <th className="py-3.5 px-6">City / State</th>
                <th className="py-3.5 px-6">Program Focus</th>
                <th className="py-3.5 px-6">Accreditation Status</th>
                <th className="py-3.5 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDD1BE]/60 text-[#0E3320]">
              {filteredInstitutes.length > 0 ? (
                filteredInstitutes.map((inst) => (
                  <tr key={inst.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#15482D]">
                      {inst.code}
                    </td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#0E3320]">{inst.name}</div>
                      {inst.nameHi && (
                        <div className="font-devanagari text-[11px] text-[#8C671D]">
                          {inst.nameHi}
                        </div>
                      )}
                      {inst.dean && (
                        <div className="text-[11px] text-[#5C8261] mt-0.5">
                          Dean: {inst.dean}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 font-semibold text-[#0E3320]">
                        <MapPin className="w-3.5 h-3.5 text-[#C59B3F] shrink-0" />
                        <span>{inst.city}</span>
                      </div>
                      <div className="text-[11px] text-[#5C8261]">{inst.state}</div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-lg bg-[#E6EFE9] text-[#15482D] text-[11px] font-semibold">
                        {inst.type}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleStatus(inst.id)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          inst.status === "Active & Verified"
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                        }`}
                        title="Click to toggle status"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>{inst.status}</span>
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openModal(inst)}
                          className="p-1.5 rounded-lg text-[#1E603D] hover:bg-[#E6EFE9] transition-colors"
                          title="Edit institute details"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(inst.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete institute"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-neutral-500">
                    No affiliated institutes found matching your filter criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#DDD1BE] flex items-center justify-between text-xs text-[#5C8261]">
          <span>Showing {filteredInstitutes.length} of {institutes.length} affiliated centers</span>
          <Link
            href="/affiliated-institutes"
            target="_blank"
            className="flex items-center gap-1 text-[#8C671D] hover:text-[#0E3320] font-semibold transition-colors"
          >
            <span>View Public Directory</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Add / Edit Institute Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF8F5] text-[#0E3320] max-w-2xl w-full rounded-3xl p-6 md:p-8 shadow-2xl border border-[#DDD1BE] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#0E3320] text-[#C59B3F] flex items-center justify-center shadow-sm">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-[#0E3320]">
                  {editingItem ? "Edit Affiliated Institute" : "Register New Affiliated Center"}
                </h3>
                <p className="text-xs text-[#5C8261]">
                  Official accreditation, dean assignment, and center address records
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    Affiliation Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="BA-AFF-01"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    Institute Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. S.P College of Paramedical Sciences"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Institute Name (Hindi)
                </label>
                <input
                  type="text"
                  value={formData.nameHi}
                  onChange={(e) => setFormData({ ...formData, nameHi: e.target.value })}
                  placeholder="उदा. एस.पी. कॉलेज ऑफ पैरामेडिकल साइंसेज"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] font-devanagari"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Jaunpur"
                    required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    State
                  </label>
                  <select
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  >
                    {STATES.filter((s) => s !== "All").map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Full Campus Street Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full street location, pin code, district..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    Dean / Director Name
                  </label>
                  <input
                    type="text"
                    value={formData.dean}
                    onChange={(e) => setFormData({ ...formData, dean: e.target.value })}
                    placeholder="e.g. Dr. R.K. Pandey"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    Program Focus
                  </label>
                  <input
                    type="text"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g. Paramedical & Yoga Sciences"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    Accreditation Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  >
                    <option value="Active & Verified">Active &amp; Verified</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Renewal Pending">Renewal Pending</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    Contact Phone / WhatsApp
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98391 12345"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-[#DDD1BE] flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 rounded-xl bg-[#E6EFE9] hover:bg-[#DDD1BE] text-[#0E3320] text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B3F]" />
                  <span>{editingItem ? "Save Changes" : "Register Institute"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF8F5] text-[#0E3320] max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-[#DDD1BE] text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-serif text-[#0E3320]">
              De-register Institute?
            </h4>
            <p className="text-xs text-[#5C8261] mt-1 mb-5">
              This affiliated center will be removed from the active institutional network.
            </p>
            <div className="flex items-center justify-center gap-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-[#E6EFE9] hover:bg-[#DDD1BE] text-[#0E3320] text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all shadow-sm"
              >
                Yes, De-register
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
