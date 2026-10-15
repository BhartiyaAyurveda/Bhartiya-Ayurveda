"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building2,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  X,
  MapPin,
  ShieldCheck,
  ExternalLink,
  RefreshCw,
} from "lucide-react";

const STATES = [
  "All",
  "Uttar Pradesh", "Karnataka", "Uttarakhand", "Maharashtra",
  "Delhi", "Rajasthan", "Bihar", "Madhya Pradesh", "Gujarat",
];

const EMPTY_FORM = {
  code: "", name: "", name_hindi: "", address: "",
  city: "", state: "Uttar Pradesh", type: "", phone: "", email: "", website: "",
  sort_order: 0,
};

export default function InstituteManager({ onShowToast }) {
  const [institutes, setInstitutes]     = useState([]);
  const [loading, setLoading]           = useState(false);
  const [searchQuery, setSearchQuery]   = useState("");
  const [selectedState, setSelectedState] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const [isModalOpen, setIsModalOpen]       = useState(false);
  const [editingItem, setEditingItem]       = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [submitting, setSubmitting]         = useState(false);

  const [formData, setFormData] = useState(EMPTY_FORM);

  const loadInstitutes = async () => {
    setLoading(true);
    try {
      const res  = await fetch("/api/admin/affiliated-institutes");
      const data = await res.json();
      if (data.ok) setInstitutes(data.data || []);
      else if (onShowToast) onShowToast(data.error || "Failed to load institutes", "error");
    } catch {
      if (onShowToast) onShowToast("Network error loading institutes", "error");
    }
    setLoading(false);
  };

  useEffect(() => { loadInstitutes(); }, []);

  useEffect(() => {
    document.body.style.overflow = (isModalOpen || deleteConfirmId) ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isModalOpen, deleteConfirmId]);

  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        code:       item.code       || "",
        name:       item.name       || "",
        name_hindi: item.name_hindi || "",
        address:    item.address    || "",
        city:       item.city       || "",
        state:      item.state      || "Uttar Pradesh",
        type:       item.type       || "",
        phone:      item.phone      || "",
        email:      item.email      || "",
        website:    item.website    || "",
        sort_order: item.sort_order ?? 0,
      });
    } else {
      setEditingItem(null);
      const nextNum = institutes.length + 1;
      setFormData({ ...EMPTY_FORM, code: `BA-AFF-${String(nextNum).padStart(2, "0")}`, sort_order: nextNum });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => { setIsModalOpen(false); setEditingItem(null); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.city.trim()) {
      if (onShowToast) onShowToast("Institute name and city are required", "error");
      return;
    }
    setSubmitting(true);
    try {
      const url    = editingItem ? `/api/admin/affiliated-institutes/${editingItem.id}` : "/api/admin/affiliated-institutes";
      const method = editingItem ? "PATCH" : "POST";
      const res    = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.ok) {
        if (onShowToast) onShowToast(editingItem ? "Institute updated!" : "Institute added!", "success");
        closeModal();
        loadInstitutes();
      } else {
        if (onShowToast) onShowToast(data.error || "Save failed", "error");
      }
    } catch {
      if (onShowToast) onShowToast("Network error", "error");
    }
    setSubmitting(false);
  };

  const handleDelete = async (id) => {
    try {
      const res  = await fetch(`/api/admin/affiliated-institutes/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.ok) {
        setInstitutes((p) => p.filter((i) => i.id !== id));
        if (onShowToast) onShowToast("Institute removed.", "info");
      } else {
        if (onShowToast) onShowToast(data.error || "Delete failed", "error");
      }
    } catch {
      if (onShowToast) onShowToast("Network error", "error");
    }
    setDeleteConfirmId(null);
  };

  const handleToggleActive = async (inst) => {
    try {
      const res  = await fetch(`/api/admin/affiliated-institutes/${inst.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: !inst.is_active }),
      });
      const data = await res.json();
      if (data.ok) {
        setInstitutes((p) => p.map((i) => i.id === inst.id ? data.data : i));
        if (onShowToast) onShowToast("Status updated.", "info");
      }
    } catch {
      if (onShowToast) onShowToast("Network error", "error");
    }
  };

  const filteredInstitutes = institutes.filter((item) => {
    const matchesState  = selectedState === "All" || item.state === selectedState;
    const matchesStatus = selectedStatus === "All"
      || (selectedStatus === "Active"   && item.is_active)
      || (selectedStatus === "Inactive" && !item.is_active);
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q
      || (item.name  || "").toLowerCase().includes(q)
      || (item.code  || "").toLowerCase().includes(q)
      || (item.city  || "").toLowerCase().includes(q)
      || (item.name_hindi || "").includes(searchQuery);
    return matchesState && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DDD1BE] shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#0E3320] flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[#C59B3F]" />
            Affiliated Institutes Management
          </h2>
          <p className="text-xs text-[#5C8261] mt-0.5">
            {institutes.length} institutes in DB — add, edit, or toggle active status
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <button
            onClick={loadInstitutes}
            disabled={loading}
            className="px-3 py-2 text-xs font-semibold text-[#8C671D] hover:text-[#0E3320] hover:bg-[#FAF8F5] rounded-xl border border-[#DDD1BE] transition-all flex items-center gap-1.5"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
          <button
            onClick={() => openModal()}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0E3320] hover:bg-[#15482D] rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#C59B3F]" />
            Add New Institute
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DDD1BE]">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C8261]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by code, name, city..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
          >
            {STATES.map((st) => (
              <option key={st} value={st}>{st === "All" ? "All States" : st}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl bg-white border border-[#DDD1BE] shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-[#5C8261] text-sm">Loading institutes…</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] text-[#0E3320] uppercase font-bold tracking-wider border-b border-[#DDD1BE]">
                <tr>
                  <th className="py-3.5 px-6">Code</th>
                  <th className="py-3.5 px-6">Institute Name</th>
                  <th className="py-3.5 px-6">City / State</th>
                  <th className="py-3.5 px-6">Program Focus</th>
                  <th className="py-3.5 px-6">Status</th>
                  <th className="py-3.5 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#DDD1BE]/60 text-[#0E3320]">
                {filteredInstitutes.length > 0 ? filteredInstitutes.map((inst) => (
                  <tr key={inst.id} className="hover:bg-[#FAF8F5]/80 transition-colors">
                    <td className="py-4 px-6 font-mono font-bold text-[#15482D]">{inst.code}</td>
                    <td className="py-4 px-6">
                      <div className="font-bold text-[#0E3320]">{inst.name}</div>
                      {inst.name_hindi && (
                        <div className="text-[11px] text-[#8C671D]" style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}>
                          {inst.name_hindi}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 font-semibold text-[#0E3320]">
                        <MapPin className="w-3.5 h-3.5 text-[#C59B3F] shrink-0" />
                        {inst.city}
                      </div>
                      <div className="text-[11px] text-[#5C8261]">{inst.state}</div>
                    </td>
                    <td className="py-4 px-6">
                      {inst.type && (
                        <span className="px-2.5 py-1 rounded-lg bg-[#E6EFE9] text-[#15482D] text-[11px] font-semibold">
                          {inst.type}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <button
                        onClick={() => handleToggleActive(inst)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                          inst.is_active
                            ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                            : "bg-red-100 text-red-800 hover:bg-red-200"
                        }`}
                        title="Click to toggle"
                      >
                        <ShieldCheck className="w-3.5 h-3.5" />
                        {inst.is_active ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => openModal(inst)}
                          className="p-1.5 rounded-lg text-[#1E603D] hover:bg-[#E6EFE9] transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(inst.id)}
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-neutral-500">
                      No institutes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
        <div className="p-4 bg-[#FAF8F5] border-t border-[#DDD1BE] flex items-center justify-between text-xs text-[#5C8261]">
          <span>Showing {filteredInstitutes.length} of {institutes.length}</span>
          <Link
            href="/affiliated-institutes"
            target="_blank"
            className="flex items-center gap-1 text-[#8C671D] hover:text-[#0E3320] font-semibold transition-colors"
          >
            View Public Directory <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-[#FAF8F5] text-[#0E3320] max-w-2xl w-full rounded-3xl shadow-2xl border border-[#DDD1BE] flex flex-col" style={{ maxHeight:"calc(100vh - 48px)" }}>

            {/* Sticky header */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-4 border-b border-[#DDD1BE] shrink-0">
              <div className="w-10 h-10 rounded-xl bg-[#0E3320] text-[#C59B3F] flex items-center justify-center shrink-0">
                <Building2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold font-serif text-[#0E3320]">
                  {editingItem ? "Edit Institute" : "Add New Institute"}
                </h3>
                <p className="text-xs text-[#5C8261]">Saved to database — reflects on public site</p>
              </div>
              <button onClick={closeModal} className="shrink-0 text-neutral-400 hover:text-neutral-700 p-1.5 rounded-full hover:bg-neutral-100 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 px-6 py-5">
            <form id="institute-form" onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    Code <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    placeholder="BA-AFF-01" required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white font-mono font-bold focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    Name (English) <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. S.P College of Paramedical Sciences" required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">Name (Hindi)</label>
                <input type="text" value={formData.name_hindi}
                  onChange={(e) => setFormData({ ...formData, name_hindi: e.target.value })}
                  placeholder="उदा. एस.पी. कॉलेज ऑफ पैरामेडिकल साइंसेज"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  style={{ fontFamily: "'Noto Sans Devanagari', sans-serif" }}
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">Address</label>
                <input type="text" value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Full street address, pin code…"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input type="text" value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="e.g. Jaunpur" required
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">State</label>
                  <select value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  >
                    {STATES.filter((s) => s !== "All").map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">Program Focus</label>
                  <input type="text" value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    placeholder="e.g. Paramedical & Yoga Sciences"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">Phone</label>
                  <input type="text" value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+91 98391 12345"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">Email</label>
                  <input type="email" value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@institute.org"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">Website</label>
                  <input type="url" value={formData.website}
                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                    placeholder="https://institute.org"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">Sort Order</label>
                <input type="number" value={formData.sort_order}
                  onChange={(e) => setFormData({ ...formData, sort_order: Number(e.target.value) })}
                  placeholder="1"
                  className="w-32 px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                />
              </div>

            </form>
            </div>

            <div className="px-6 py-4 border-t border-[#DDD1BE] flex items-center justify-end gap-2.5 shrink-0 bg-[#FAF8F5] rounded-b-3xl">
              <button type="button" onClick={closeModal}
                className="px-4 py-2 rounded-xl bg-[#E6EFE9] hover:bg-[#DDD1BE] text-[#0E3320] text-xs font-semibold transition-all">
                Cancel
              </button>
              <button type="submit" form="institute-form" disabled={submitting}
                className="px-5 py-2 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 disabled:opacity-60">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C59B3F]" />
                {submitting ? "Saving…" : editingItem ? "Save Changes" : "Add Institute"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FAF8F5] text-[#0E3320] max-w-sm w-full rounded-2xl p-6 shadow-2xl border border-[#DDD1BE] text-center">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-serif text-[#0E3320]">Delete Institute?</h4>
            <p className="text-xs text-[#5C8261] mt-1 mb-5">This will permanently remove the institute from the database.</p>
            <div className="flex items-center justify-center gap-2.5">
              <button onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-[#E6EFE9] hover:bg-[#DDD1BE] text-[#0E3320] text-xs font-semibold transition-all">
                Cancel
              </button>
              <button onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold transition-all">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
