"use client";

import { useState } from "react";
import { X, CheckCircle2, Calendar, User, Phone, Mail, Sparkles, HeartPulse } from "lucide-react";

export default function ConsultationModal({ isOpen, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    concern: "General Wellness & Rejuvenation",
    program: "7-Day Ayurveda Retreat",
    date: "",
  });

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-forest-950/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg max-h-[92vh] flex flex-col bg-[#fdfbf7] rounded-2xl shadow-2xl border border-gold-500/30 overflow-hidden text-forest-950">
        {/* Header Ribbon */}
        <div className="bg-forest-900 text-sand-50 p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 sm:top-5 right-4 sm:right-5 text-sand-300 hover:text-white p-1 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
          <div className="flex items-center gap-2 text-gold-400 text-xs font-semibold tracking-wider uppercase mb-1">
            <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span className="truncate">वैदिक स्वास्थ्य परामर्श • Consultation</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
            Book Your Sacred Consultation
          </h3>
          <p className="text-xs text-sand-200 mt-1">
            Connect with our Senior Vaidyas & Yogacharyas for personalized guidance.
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 md:p-8 overflow-y-auto flex-1">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-emerald-100 text-forest-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-serif font-bold text-forest-900 mb-2">
                धन्यवाद! Consultation Requested
              </h4>
              <p className="text-sm text-forest-700/80 mb-6 max-w-sm mx-auto leading-relaxed">
                Our Vaidya care team will connect with you via WhatsApp & Phone at{" "}
                <span className="font-semibold text-forest-900">{formData.phone || "your provided number"}</span> within 2 hours.
              </p>
              <div className="bg-sand-100 p-4 rounded-xl border border-sand-200 text-xs text-forest-800 mb-6">
                <p className="font-medium italic">
                  "सर्वे भवन्तु सुखिनः सर्वे सन्तु निरामयाः"
                </p>
                <p className="text-[11px] text-forest-600 mt-1">
                  May all be prosperous and happy, may all be free from illness.
                </p>
              </div>
              <button
                onClick={handleReset}
                className="px-6 py-2.5 bg-forest-800 hover:bg-forest-900 text-white rounded-full text-sm font-semibold transition-all shadow-md"
              >
                Close & Return
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-forest-900 uppercase tracking-wider mb-1">
                  Full Name / पूरा नाम *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-forest-600" />
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Aditi Sharma"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 uppercase tracking-wider mb-1">
                    Phone / मोबाइल *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 absolute left-3 top-3 text-forest-600" />
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 uppercase tracking-wider mb-1">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-3 text-forest-600" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="aditi@example.com"
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-forest-900 uppercase tracking-wider mb-1">
                    Interested Program
                  </label>
                  <select
                    value={formData.program}
                    onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                    className="w-full px-3 py-2.5 text-sm bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600"
                  >
                    <option value="7-Day Ayurveda Retreat">7-Day Ayurveda Retreat</option>
                    <option value="14-Day Yoga & Meditation">14-Day Yoga Immersion</option>
                    <option value="21-Day Naturopathy">21-Day Naturopathy Detox</option>
                    <option value="30-Day Holistic Wellness">30-Day Total Wellness</option>
                    <option value="General Consultation">1-on-1 Pulse & Diet Consultation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-forest-900 uppercase tracking-wider mb-1">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 absolute left-3 top-3 text-forest-600" />
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-forest-900 uppercase tracking-wider mb-1">
                  Health Goal or Concern / स्वास्थ्य लक्ष्य
                </label>
                <div className="relative">
                  <HeartPulse className="w-4 h-4 absolute left-3 top-3 text-forest-600" />
                  <input
                    type="text"
                    value={formData.concern}
                    onChange={(e) => setFormData({ ...formData, concern: e.target.value })}
                    placeholder="e.g., Stress, Digestive issue, Joint pain, Detox"
                    className="w-full pl-10 pr-3 py-2.5 text-sm bg-white border border-sand-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-forest-600"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 bg-gradient-to-r from-forest-800 to-forest-700 hover:from-forest-900 hover:to-forest-800 text-white font-semibold rounded-xl text-sm transition-all duration-300 shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4 text-gold-400" />
                  <span>Confirm Consultation Request →</span>
                </button>
                <p className="text-[11px] text-center text-forest-700/60 mt-2">
                  🔒 100% confidential. No spam. Guided by licensed Ayurvedic doctors.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
