"use client";

import { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Clock, Save, RotateCcw, CheckCircle2, Sparkles, RefreshCw } from "lucide-react";

const DEFAULT_CONTACT = {
  primaryPhone:        "+91 98765 43210",
  secondaryPhone:      "+91 91234 56789",
  whatsappNumber:      "+91 98765 43210",
  primaryEmail:        "contact@bhartiyaayurveda.org",
  admissionsEmail:     "admissions@bhartiyaayurveda.org",
  verificationEmail:   "verify@bhartiyaayurveda.org",
  addressLine1:        "",
  city:                "",
  state:               "",
  pincode:             "",
  country:             "India",
  workingHoursWeekday: "Monday – Saturday: 10:00 AM – 5:00 PM",
  workingHoursSunday:  "Closed on Sundays and public holidays",
};

export default function ContactManager({ onShowToast }) {
  const [contactData, setContactData] = useState(DEFAULT_CONTACT);
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [saved, setSaved]             = useState(false);

  useEffect(() => {
    setLoading(true);
    fetch("/api/public/site-settings")
      .then(r => r.json())
      .then(data => { if (data.ok && data.contact) setContactData({ ...DEFAULT_CONTACT, ...data.contact }); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field, value) => {
    setContactData(p => ({ ...p, [field]: value }));
    setSaved(false);
  };

  const handleSave = async (e) => {
    e?.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "contact_info", value: JSON.stringify(contactData) }),
      });
      const data = await res.json();
      if (data.ok) {
        setSaved(true);
        onShowToast?.("Contact information saved to database!", "success");
        setTimeout(() => setSaved(false), 3000);
      } else {
        onShowToast?.(data.error || "Save failed", "error");
      }
    } catch {
      onShowToast?.("Network error", "error");
    }
    setSaving(false);
  };

  const handleReset = async () => {
    if (!confirm("Reset to default contact information?")) return;
    setContactData(DEFAULT_CONTACT);
    setSaved(false);
  };

  const field = (label, key, type = "text", span = false) => (
    <div className={span ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-bold uppercase tracking-wider text-[#0E3320] mb-1">{label}</label>
      <input type={type} value={contactData[key] || ""} onChange={e => handleChange(key, e.target.value)}
        className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]" />
    </div>
  );

  if (loading) return <div className="p-10 text-center"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#C59B3F]" /></div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DDD1BE] shadow-sm">
        <div>
          <h2 className="text-lg font-bold text-[#0E3320] flex items-center gap-2">
            <Phone className="w-5 h-5 text-[#C59B3F]" /> Contact &amp; Location Management
          </h2>
          <p className="text-xs text-[#5C8261] mt-0.5">Changes save to database and reflect on the public website immediately.</p>
        </div>
        <div className="flex items-center gap-2.5">
          <button type="button" onClick={handleReset}
            className="px-3 py-2 text-xs font-semibold text-[#8C671D] hover:bg-[#FAF8F5] rounded-xl border border-[#DDD1BE] transition-all flex items-center gap-1.5">
            <RotateCcw className="w-3.5 h-3.5" /> Reset
          </button>
          <button type="button" onClick={handleSave} disabled={saving}
            className="px-5 py-2 text-xs font-bold text-white bg-[#0E3320] hover:bg-[#15482D] rounded-xl shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-60">
            {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#C59B3F]" />}
            {saved ? "Saved!" : saving ? "Saving…" : "Save to DB"}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Phone */}
        <div className="p-6 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#DDD1BE]">
            <div className="w-8 h-8 rounded-lg bg-[#E6EFE9] flex items-center justify-center"><Phone className="w-4 h-4 text-[#0E3320]" /></div>
            <h3 className="text-sm font-bold text-[#0E3320]">Phone &amp; WhatsApp</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Primary Phone *",    "primaryPhone")}
            {field("Secondary Phone",    "secondaryPhone")}
            {field("WhatsApp Number",    "whatsappNumber")}
          </div>
        </div>

        {/* Email */}
        <div className="p-6 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#DDD1BE]">
            <div className="w-8 h-8 rounded-lg bg-[#F5F0E8] flex items-center justify-center"><Mail className="w-4 h-4 text-[#8C671D]" /></div>
            <h3 className="text-sm font-bold text-[#0E3320]">Email Addresses</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("General / Contact Email *",    "primaryEmail",      "email")}
            {field("Admissions Email",             "admissionsEmail",   "email")}
            {field("Verification / Certificate",   "verificationEmail", "email", true)}
          </div>
        </div>

        {/* Address */}
        <div className="p-6 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#DDD1BE]">
            <div className="w-8 h-8 rounded-lg bg-[#F3F6F3] flex items-center justify-center"><MapPin className="w-4 h-4 text-[#15482D]" /></div>
            <h3 className="text-sm font-bold text-[#0E3320]">Address</h3>
          </div>
          <div className="space-y-3">
            {field("Street Address / Area", "addressLine1", "text", true)}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {field("City",    "city")}
              {field("State",   "state")}
              {field("Pincode", "pincode")}
              {field("Country", "country")}
            </div>
          </div>
        </div>

        {/* Hours */}
        <div className="p-6 rounded-2xl bg-white border border-[#DDD1BE] shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-[#DDD1BE]">
            <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center"><Clock className="w-4 h-4 text-amber-700" /></div>
            <h3 className="text-sm font-bold text-[#0E3320]">Office Hours</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {field("Weekdays (Mon–Sat)", "workingHoursWeekday")}
            {field("Sunday / Holidays",  "workingHoursSunday")}
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={saving}
            className="px-6 py-3 text-xs font-bold text-white bg-[#0E3320] hover:bg-[#15482D] rounded-xl shadow-md transition-all flex items-center gap-2 disabled:opacity-60">
            <CheckCircle2 className="w-4 h-4 text-[#C59B3F]" />
            {saved ? "Saved to Database!" : "Save Contact Information"}
          </button>
        </div>
      </form>
    </div>
  );
}
