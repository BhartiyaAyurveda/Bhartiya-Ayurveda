"use client";

import { useState, useEffect } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Save,
  RotateCcw,
  CheckCircle2,
  Building,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Globe
} from "lucide-react";

const DEFAULT_CONTACT = {
  // Center Location
  mainCenterName: "Bhartiya Ayurveda Central Ashram & Institute",
  mainCenterNameHi: "भारतीय आयुर्वेद केंद्रीय संस्थान एवं आश्रम",
  addressLine1: "Near Lakshman Jhula, Tapovan, P.O. Shivananda Nagar",
  city: "Rishikesh",
  state: "Uttarakhand",
  pincode: "249192",
  country: "India",

  // Second branch / Clinic
  branchCenterName: "Western Regional Consultation Clinic",
  branchAddress: "Plot 14, Vedic Enclave, Bandra West, Mumbai, Maharashtra - 400050",

  // Contact Numbers
  primaryPhone: "+91 98765 43210",
  secondaryPhone: "+91 91234 56789",
  whatsappNumber: "+91 98765 43210",
  tollFreeHelpline: "1800-123-AYUR",

  // Emails
  primaryEmail: "hello@bhartiyaayurveda.in",
  admissionsEmail: "admissions@bhartiyaayurveda.in",
  verificationEmail: "verify@bhartiyaayurveda.in",

  // Hours
  workingHoursWeekday: "Monday – Saturday: 08:00 AM – 07:30 PM",
  workingHoursSunday: "Sunday: 09:00 AM – 01:30 PM (OPD & Emergencies Only)",
  counselingHours: "Daily: 10:00 AM – 05:00 PM",
};

export default function ContactManager({ onShowToast }) {
  const [contactData, setContactData] = useState(DEFAULT_CONTACT);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bhartiya_admin_contact");
      if (stored) {
        try {
          setContactData(JSON.parse(stored));
          return;
        } catch (e) {
          // ignore
        }
      }
      setContactData(DEFAULT_CONTACT);
    }
  }, []);

  const handleChange = (field, value) => {
    setContactData((prev) => ({ ...prev, [field]: value }));
    setIsSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("bhartiya_admin_contact", JSON.stringify(contactData));
    }
    setIsSaved(true);
    if (onShowToast) {
      onShowToast("Contact & Location information updated successfully!", "success");
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset all contact information to institutional default values?")) {
      setContactData(DEFAULT_CONTACT);
      if (typeof window !== "undefined") {
        localStorage.setItem("bhartiya_admin_contact", JSON.stringify(DEFAULT_CONTACT));
      }
      if (onShowToast) {
        onShowToast("Contact details restored to institutional default.", "info");
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DDD1BE] shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#0E3320] flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#C59B3F]" />
            Contact &amp; Location Information Management
          </h2>
          <p className="text-xs text-[#5C8261] mt-0.5">
            Modify official phone numbers, addresses, emails, and operating hours across the portal.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleReset}
            className="px-3 py-2 text-xs font-semibold text-[#8C671D] hover:text-[#0E3320] hover:bg-[#FAF8F5] rounded-xl border border-[#DDD1BE] transition-all flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2 text-xs font-bold text-white bg-[#0E3320] hover:bg-[#15482D] rounded-xl shadow-sm transition-all flex items-center gap-1.5"
          >
            <Save className="w-4 h-4 text-[#C59B3F]" />
            <span>{isSaved ? "Saved!" : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Form (2 cols on lg) + Live Preview (1 col on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Form Inputs (2 Columns) */}
        <form onSubmit={handleSave} className="lg:col-span-2 space-y-6">
          
          {/* Section 1: Phone & WhatsApp */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#DDD1BE]">
              <div className="w-8 h-8 rounded-lg bg-[#E6EFE9] text-[#1E603D] flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0E3320]">Phone &amp; WhatsApp Helplines</h3>
                <p className="text-[11px] text-[#5C8261]">Primary voice and messaging contact lines</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Primary Phone <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={contactData.primaryPhone}
                  onChange={(e) => handleChange("primaryPhone", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Admissions Hotline
                </label>
                <input
                  type="text"
                  value={contactData.secondaryPhone}
                  onChange={(e) => handleChange("secondaryPhone", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Official WhatsApp Desk
                </label>
                <input
                  type="text"
                  value={contactData.whatsappNumber}
                  onChange={(e) => handleChange("whatsappNumber", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  National Toll-Free Number
                </label>
                <input
                  type="text"
                  value={contactData.tollFreeHelpline}
                  onChange={(e) => handleChange("tollFreeHelpline", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Official Institutional Emails */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#DDD1BE]">
              <div className="w-8 h-8 rounded-lg bg-[#F5F0E8] text-[#8C671D] flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0E3320]">Institutional Email Inboxes</h3>
                <p className="text-[11px] text-[#5C8261]">Official correspondence and student grievance desks</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  General Inquiries Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={contactData.primaryEmail}
                  onChange={(e) => handleChange("primaryEmail", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Admissions Department
                </label>
                <input
                  type="email"
                  value={contactData.admissionsEmail}
                  onChange={(e) => handleChange("admissionsEmail", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Certificate Registry &amp; Verification Desk
                </label>
                <input
                  type="email"
                  value={contactData.verificationEmail}
                  onChange={(e) => handleChange("verificationEmail", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Campus Addresses */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#DDD1BE]">
              <div className="w-8 h-8 rounded-lg bg-[#F3F6F3] text-[#15482D] flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0E3320]">Headquarters &amp; Physical Centers</h3>
                <p className="text-[11px] text-[#5C8261]">Postal and visitor campus addresses</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Primary Campus Title (Rishikesh HQ)
                </label>
                <input
                  type="text"
                  value={contactData.mainCenterName}
                  onChange={(e) => handleChange("mainCenterName", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Street Address
                </label>
                <input
                  type="text"
                  value={contactData.addressLine1}
                  onChange={(e) => handleChange("addressLine1", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={contactData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    State
                  </label>
                  <input
                    type="text"
                    value={contactData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    PIN Code
                  </label>
                  <input
                    type="text"
                    value={contactData.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={contactData.country}
                    onChange={(e) => handleChange("country", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Secondary Regional Center (Mumbai Clinic)
                </label>
                <input
                  type="text"
                  value={contactData.branchAddress}
                  onChange={(e) => handleChange("branchAddress", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Operating Timings */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-3 border-b border-[#DDD1BE]">
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#0E3320]">Operating Hours &amp; OPD Sessions</h3>
                <p className="text-[11px] text-[#5C8261]">Opening schedules displayed to public visitors</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Weekday Hours (Mon – Sat)
                </label>
                <input
                  type="text"
                  value={contactData.workingHoursWeekday}
                  onChange={(e) => handleChange("workingHoursWeekday", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">
                  Sunday / Emergency Timings
                </label>
                <input
                  type="text"
                  value={contactData.workingHoursSunday}
                  onChange={(e) => handleChange("workingHoursSunday", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>
            </div>
          </div>

          {/* Bottom Save Action */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-6 py-3 text-xs font-bold text-white bg-gradient-to-r from-[#0E3320] to-[#15482D] hover:from-[#15482D] hover:to-[#1E603D] rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 text-[#C59B3F]" />
              <span>Save Contact Information</span>
            </button>
          </div>
        </form>

        {/* Live Preview Panel (Right Column) */}
        <div className="space-y-4">
          <div className="sticky top-20">
            <div className="p-4 rounded-2xl bg-[#0E3320] text-white border border-[#C59B3F]/30 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C59B3F] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Live Preview
                </span>
                <span className="text-[10px] text-white/60">Public Appearance</span>
              </div>

              {/* Card 1 */}
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#E4BF64] font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Main Campus</span>
                </div>
                <p className="text-white text-xs font-medium">
                  {contactData.mainCenterName}
                </p>
                <p className="text-[#DDD1BE] text-[11px] leading-relaxed">
                  {contactData.addressLine1}, {contactData.city}, {contactData.state} - {contactData.pincode}, {contactData.country}
                </p>
              </div>

              {/* Card 2 */}
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#E4BF64] font-bold">
                  <Phone className="w-4 h-4" />
                  <span>Telephone &amp; Desk</span>
                </div>
                <p className="font-mono text-white text-xs">{contactData.primaryPhone}</p>
                <p className="font-mono text-[#DDD1BE] text-[11px]">Admissions: {contactData.secondaryPhone}</p>
                <p className="font-mono text-emerald-300 text-[11px]">WhatsApp: {contactData.whatsappNumber}</p>
              </div>

              {/* Card 3 */}
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#E4BF64] font-bold">
                  <Mail className="w-4 h-4" />
                  <span>Email Inboxes</span>
                </div>
                <p className="font-mono text-white text-[11px] truncate">{contactData.primaryEmail}</p>
                <p className="font-mono text-[#DDD1BE] text-[11px] truncate">{contactData.admissionsEmail}</p>
              </div>

              {/* Card 4 */}
              <div className="p-3.5 rounded-xl bg-white/10 border border-white/10 space-y-1.5 text-xs">
                <div className="flex items-center gap-2 text-[#E4BF64] font-bold">
                  <Clock className="w-4 h-4" />
                  <span>Visiting Hours</span>
                </div>
                <p className="text-white text-[11px]">{contactData.workingHoursWeekday}</p>
                <p className="text-[#DDD1BE] text-[10px]">{contactData.workingHoursSunday}</p>
              </div>

              <div className="pt-2 text-center">
                <span className="text-[10px] text-white/50 block">
                  Changes made here dynamically reflect on the public Contact Us page.
                </span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
