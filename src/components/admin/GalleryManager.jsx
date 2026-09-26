"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Search,
  Filter,
  CheckCircle2,
  X,
  ExternalLink,
  Sparkles,
  Eye,
  RefreshCw,
  AlertCircle
} from "lucide-react";

// Default gallery assets matching the public gallery
const DEFAULT_GALLERY = [
  {
    id: 1,
    src: "/images/hero/hero-meditation.jpg",
    titleHi: "हिमालय गंगा तट पर योग साधना",
    titleEn: "Meditation by Sacred Himalayan Waters",
    category: "Yoga & Meditation",
    desc: "Daily sunrise Dhyana and Ashtanga practice along the serene banks of Mother Ganga in Rishikesh.",
    featured: true,
  },
  {
    id: 2,
    src: "/images/ayurveda/herbs-mortar.jpg",
    titleHi: "प्राचीन जड़ी-बूटियाँ एवं खरल",
    titleEn: "Authentic Ayurvedic Herbs & Mortar",
    category: "Ayurveda",
    desc: "Traditional preparation of fresh medicinal herbs using classical stone mortar and pestle.",
    featured: true,
  },
  {
    id: 3,
    src: "/images/naturopathy/air-waterfall.jpg",
    titleHi: "शुद्ध वायु एवं जलप्रपात चिकित्सा",
    titleEn: "Fresh Air & Waterfall Hydrotherapy",
    category: "Naturopathy",
    desc: "Recharging the body's pranic vitality through natural waterfall mist and negative ion immersion.",
    featured: false,
  },
  {
    id: 4,
    src: "/images/naturopathy/sun-therapy.jpg",
    titleHi: "सूर्य किरण चिकित्सा (Heliotherapy)",
    titleEn: "Sun Bath & Solar Rays Healing",
    category: "Naturopathy",
    desc: "Harnessing the therapeutic spectrum of morning sunlight to stimulate metabolism and vitamin synthesis.",
    featured: true,
  },
  {
    id: 5,
    src: "/images/naturopathy/water-therapy.jpg",
    titleHi: "पावन जल स्नान एवं हाइड्रोथेरेपी",
    titleEn: "Hydrotherapy & Pure Water Cure",
    category: "Naturopathy",
    desc: "Controlled thermal water baths that enhance lymphatic drainage and systemic circulation.",
    featured: false,
  },
  {
    id: 6,
    src: "/images/decor/leaves-dark.jpg",
    titleHi: "औषधीय वनस्पति संपदा",
    titleEn: "Medicinal Flora & Herbal Sanctuary",
    category: "Herbology",
    desc: "Rare organic herbs and botanical species cultivated under natural Vedic agricultural cycles.",
    featured: false,
  },
];

const CATEGORIES = [
  "All",
  "Yoga & Meditation",
  "Ayurveda",
  "Naturopathy",
  "Herbology",
  "Campus & Retreats",
];

export default function GalleryManager({ onShowToast }) {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    titleEn: "",
    titleHi: "",
    category: "Yoga & Meditation",
    src: "",
    desc: "",
    featured: false,
  });

  // Load from localStorage or defaults
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bhartiya_admin_gallery");
      if (stored) {
        try {
          setItems(JSON.parse(stored));
          return;
        } catch (e) {
          // ignore error
        }
      }
      setItems(DEFAULT_GALLERY);
    }
  }, []);

  // Save changes to localStorage
  const saveItems = (newItems) => {
    setItems(newItems);
    if (typeof window !== "undefined") {
      localStorage.setItem("bhartiya_admin_gallery", JSON.stringify(newItems));
    }
  };

  // Open modal for Create or Edit
  const openModal = (item = null) => {
    if (item) {
      setEditingItem(item);
      setFormData({
        titleEn: item.titleEn,
        titleHi: item.titleHi || "",
        category: item.category || "Yoga & Meditation",
        src: item.src,
        desc: item.desc || "",
        featured: item.featured || false,
      });
    } else {
      setEditingItem(null);
      setFormData({
        titleEn: "",
        titleHi: "",
        category: "Yoga & Meditation",
        src: "/images/ayurveda/herbs-mortar.jpg",
        desc: "",
        featured: false,
      });
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
  };

  // Form submit handler
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.titleEn.trim() || !formData.src.trim()) {
      if (onShowToast) onShowToast("Please enter photo title and image source URL", "error");
      return;
    }

    if (editingItem) {
      // Update existing
      const updated = items.map((it) =>
        it.id === editingItem.id ? { ...it, ...formData } : it
      );
      saveItems(updated);
      if (onShowToast) onShowToast("Gallery image updated successfully!", "success");
    } else {
      // Create new
      const newItem = {
        id: Date.now(),
        ...formData,
      };
      const updated = [newItem, ...items];
      saveItems(updated);
      if (onShowToast) onShowToast("New photo added to gallery!", "success");
    }
    closeModal();
  };

  // Delete item
  const handleDelete = (id) => {
    const updated = items.filter((it) => it.id !== id);
    saveItems(updated);
    setDeleteConfirmId(null);
    if (onShowToast) onShowToast("Image removed from gallery.", "info");
  };

  // Reset to initial defaults
  const handleResetDefaults = () => {
    if (confirm("Are you sure you want to reset the gallery to default photos?")) {
      saveItems(DEFAULT_GALLERY);
      if (onShowToast) onShowToast("Gallery restored to default assets.", "info");
    }
  };

  // Filtered gallery items
  const filteredItems = items.filter((item) => {
    const matchesCategory =
      activeCategory === "All" || item.category === activeCategory;
    const matchesSearch =
      item.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.titleHi && item.titleHi.includes(searchQuery)) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DDD1BE] shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#0E3320] flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[#C59B3F]" />
            Gallery Management
          </h2>
          <p className="text-xs text-[#5C8261] mt-0.5">
            Upload, update, or remove photos displayed in the public Photo Gallery ({items.length} items total)
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={handleResetDefaults}
            className="px-3 py-2 text-xs font-semibold text-[#8C671D] hover:text-[#0E3320] hover:bg-[#FAF8F5] rounded-xl border border-[#DDD1BE] transition-all flex items-center gap-1.5"
            title="Reset gallery to default records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            onClick={() => openModal()}
            className="px-4 py-2 text-xs font-bold text-white bg-[#0E3320] hover:bg-[#15482D] rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-[#C59B3F]" />
            <span>Add New Photo</span>
          </button>
        </div>
      </div>

      {/* Search & Category Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#DDD1BE]">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#5C8261]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title, Hindi keywords, or category..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
          />
        </div>

        {/* Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? "bg-[#0E3320] text-white shadow-sm"
                  : "bg-[#FAF8F5] text-[#5C8261] hover:text-[#0E3320] hover:bg-[#EBE2D4]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => (
          <div
            key={item.id}
            className="group rounded-2xl bg-white border border-[#DDD1BE] overflow-hidden shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
          >
            <div>
              {/* Image Preview Container */}
              <div className="relative h-48 w-full bg-[#0E3320] overflow-hidden">
                <Image
                  src={item.src}
                  alt={item.titleEn}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                {/* Category Badge */}
                <div className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-[#FAF8F5] text-[10px] font-semibold">
                  {item.category}
                </div>

                {item.featured && (
                  <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-[#C59B3F] text-[#071F13] text-[10px] font-bold shadow-sm">
                    Featured
                  </div>
                )}

                {/* Title overlay on bottom of image */}
                <div className="absolute bottom-2.5 left-3 right-3 text-white">
                  {item.titleHi && (
                    <p className="font-devanagari text-xs text-[#E4BF64] font-medium truncate">
                      {item.titleHi}
                    </p>
                  )}
                  <h3 className="font-semibold text-sm leading-snug truncate">
                    {item.titleEn}
                  </h3>
                </div>
              </div>

              {/* Details Body */}
              <div className="p-4 space-y-2">
                <p className="text-xs text-[#5C8261] line-clamp-2 leading-relaxed">
                  {item.desc || "No description provided."}
                </p>
                <div className="text-[11px] font-mono text-[#8C671D] truncate">
                  Path: {item.src}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="px-4 py-3 bg-[#FAF8F5] border-t border-[#DDD1BE] flex items-center justify-between">
              <Link
                href="/gallery"
                target="_blank"
                className="text-[11px] font-medium text-[#5C8261] hover:text-[#0E3320] flex items-center gap-1 transition-colors"
              >
                <span>Live View</span>
                <ExternalLink className="w-3 h-3" />
              </Link>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => openModal(item)}
                  className="p-1.5 rounded-lg text-[#1E603D] hover:bg-[#E6EFE9] transition-colors"
                  title="Edit photo details"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDeleteConfirmId(item.id)}
                  className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete photo"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredItems.length === 0 && (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-[#DDD1BE]">
            <ImageIcon className="w-10 h-10 text-[#C8B79E] mx-auto mb-3" />
            <h3 className="text-base font-bold text-[#0E3320]">No gallery photos found</h3>
            <p className="text-xs text-[#5C8261] mt-1">
              Try adjusting your search criteria or add a new photo to this category.
            </p>
          </div>
        )}
      </div>

      {/* Add / Edit Photo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-[#FAF8F5] text-[#0E3320] max-w-xl w-full rounded-3xl p-6 md:p-8 shadow-2xl border border-[#DDD1BE] relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-5 right-5 text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#0E3320] text-[#C59B3F] flex items-center justify-center shadow-sm">
                <ImageIcon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold font-serif text-[#0E3320]">
                  {editingItem ? "Edit Gallery Photo" : "Add New Gallery Photo"}
                </h3>
                <p className="text-xs text-[#5C8261]">
                  Configure photo details, title, and display category
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Source */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Image Path / URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.src}
                  onChange={(e) => setFormData({ ...formData, src: e.target.value })}
                  placeholder="/images/ayurveda/herbs-mortar.jpg"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                />
                <span className="text-[11px] text-[#8C671D] block mt-1">
                  Tip: Use paths like <code className="bg-[#EBE2D4] px-1 rounded">/images/ayurveda/herbs-mortar.jpg</code> or external image URLs.
                </span>
              </div>

              {/* Title (English) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Title (English) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  placeholder="e.g. Classical Ayurvedic Herbal Formulation"
                  required
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                />
              </div>

              {/* Title (Hindi) */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Title (Hindi - Optional)
                </label>
                <input
                  type="text"
                  value={formData.titleHi}
                  onChange={(e) => setFormData({ ...formData, titleHi: e.target.value })}
                  placeholder="उदा. पारंपरिक आयुर्वेदिक जड़ी-बूटी निर्माण"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] font-devanagari"
                />
              </div>

              {/* Category & Featured */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-[#0E3320] font-semibold">
                    <input
                      type="checkbox"
                      checked={formData.featured}
                      onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                      className="w-4 h-4 rounded text-[#1E603D] focus:ring-[#C59B3F] accent-[#1E603D]"
                    />
                    <span>Mark as Featured Photo</span>
                  </label>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  placeholder="Short educational or contextual note about this photograph..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-white text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]"
                />
              </div>

              {/* Action Buttons */}
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
                  <span>{editingItem ? "Save Changes" : "Publish Photo"}</span>
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
              Delete this photo?
            </h4>
            <p className="text-xs text-[#5C8261] mt-1 mb-5">
              This photo will be permanently removed from the public gallery view.
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
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
