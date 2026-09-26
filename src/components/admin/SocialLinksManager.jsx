"use client";

import { useState, useEffect } from "react";
import {
  Share2,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  MessageCircle,
  Send,
  Save,
  RotateCcw,
  CheckCircle2,
  ExternalLink,
  Sparkles,
  Eye,
  Check
} from "lucide-react";

const DEFAULT_SOCIALS = [
  {
    id: "twitter",
    name: "Twitter / X",
    handle: "@BhartiyaAyur",
    url: "https://twitter.com/BhartiyaAyurveda",
    enabled: true,
    followers: "24.5K Followers",
    color: "bg-neutral-900 text-white",
  },
  {
    id: "instagram",
    name: "Instagram",
    handle: "@bhartiya.ayurveda",
    url: "https://instagram.com/bhartiya.ayurveda",
    enabled: true,
    followers: "89.2K Followers",
    color: "bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white",
  },
  {
    id: "youtube",
    name: "YouTube Channel",
    handle: "Bhartiya Ayurveda Official",
    url: "https://youtube.com/@bhartiyaayurveda",
    enabled: true,
    followers: "145K Subscribers",
    color: "bg-red-600 text-white",
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    handle: "bhartiya-ayurveda-sansthan",
    url: "https://linkedin.com/company/bhartiya-ayurveda-sansthan",
    enabled: true,
    followers: "18.1K Connections",
    color: "bg-blue-700 text-white",
  },
  {
    id: "facebook",
    name: "Facebook Page",
    handle: "BhartiyaAyurvedaSansthan",
    url: "https://facebook.com/BhartiyaAyurvedaSansthan",
    enabled: true,
    followers: "62K Page Likes",
    color: "bg-blue-600 text-white",
  },
  {
    id: "whatsapp",
    name: "WhatsApp Official Channel",
    handle: "Bhartiya Ayurveda Community",
    url: "https://whatsapp.com/channel/bhartiya-ayurveda",
    enabled: true,
    followers: "35K Members",
    color: "bg-emerald-600 text-white",
  },
  {
    id: "telegram",
    name: "Telegram Broadcast",
    handle: "t.me/bhartiya_ayurveda",
    url: "https://t.me/bhartiya_ayurveda",
    enabled: false,
    followers: "8.4K Members",
    color: "bg-sky-500 text-white",
  },
];

export default function SocialLinksManager({ onShowToast }) {
  const [socials, setSocials] = useState(DEFAULT_SOCIALS);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bhartiya_admin_social");
      if (stored) {
        try {
          setSocials(JSON.parse(stored));
          return;
        } catch (e) {
          // ignore
        }
      }
      setSocials(DEFAULT_SOCIALS);
    }
  }, []);

  const handleToggle = (id) => {
    setSocials((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, enabled: !item.enabled } : item
      )
    );
    setIsSaved(false);
  };

  const handleUrlChange = (id, newUrl) => {
    setSocials((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, url: newUrl } : item
      )
    );
    setIsSaved(false);
  };

  const handleHandleChange = (id, newHandle) => {
    setSocials((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, handle: newHandle } : item
      )
    );
    setIsSaved(false);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      localStorage.setItem("bhartiya_admin_social", JSON.stringify(socials));
    }
    setIsSaved(true);
    if (onShowToast) {
      onShowToast("Social media links & channels saved successfully!", "success");
    }
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    if (confirm("Reset social links to default configurations?")) {
      setSocials(DEFAULT_SOCIALS);
      if (typeof window !== "undefined") {
        localStorage.setItem("bhartiya_admin_social", JSON.stringify(DEFAULT_SOCIALS));
      }
      if (onShowToast) {
        onShowToast("Social links restored to defaults.", "info");
      }
    }
  };

  // Render proper icon based on id
  const getIcon = (id) => {
    switch (id) {
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "youtube":
        return <Youtube className="w-4 h-4" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4" />;
      case "facebook":
        return <Facebook className="w-4 h-4" />;
      case "whatsapp":
        return <MessageCircle className="w-4 h-4" />;
      case "telegram":
        return <Send className="w-4 h-4" />;
      default:
        return <Share2 className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DDD1BE] shadow-sm">
        <div>
          <h2 className="text-xl font-bold font-serif text-[#0E3320] flex items-center gap-2">
            <Share2 className="w-5 h-5 text-[#C59B3F]" />
            Social Media Links &amp; Channels
          </h2>
          <p className="text-xs text-[#5C8261] mt-0.5">
            Configure official social profiles, public handles, and active visibility across header and footer.
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
            <span>{isSaved ? "Saved!" : "Save Social Links"}</span>
          </button>
        </div>
      </div>

      {/* Social Platforms List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {socials.map((item) => (
          <div
            key={item.id}
            className={`p-5 rounded-2xl bg-white border transition-all ${
              item.enabled
                ? "border-[#DDD1BE] shadow-sm hover:shadow-md"
                : "border-neutral-200 opacity-60 bg-neutral-50/70"
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-sm ${item.color}`}
                >
                  {getIcon(item.id)}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#0E3320] flex items-center gap-2">
                    <span>{item.name}</span>
                    {item.enabled ? (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        Live
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full bg-neutral-200 text-neutral-600 text-[10px] font-medium">
                        Hidden
                      </span>
                    )}
                  </h3>
                  <span className="text-[11px] text-[#5C8261]">{item.followers}</span>
                </div>
              </div>

              {/* Enable / Disable Toggle Switch */}
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={item.enabled}
                  onChange={() => handleToggle(item.id)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-neutral-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-neutral-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#0E3320]"></div>
              </label>
            </div>

            {/* Inputs */}
            <div className="space-y-2.5">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C8261] mb-1">
                  Public Handle / ID
                </label>
                <input
                  type="text"
                  value={item.handle}
                  onChange={(e) => handleHandleChange(item.id, e.target.value)}
                  placeholder="@handle"
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-[#5C8261] mb-1">
                  Destination Profile URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="url"
                    value={item.url}
                    onChange={(e) => handleUrlChange(item.id, e.target.value)}
                    placeholder="https://"
                    className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] text-[#0E3320]"
                  />
                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-xl bg-[#E6EFE9] hover:bg-[#DDD1BE] text-[#0E3320] transition-colors"
                      title="Test link in new tab"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Guidance */}
      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DDD1BE] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-[#5C8261]">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#C59B3F] shrink-0" />
          <span>Active channels appear in the top website bar and footer social cluster.</span>
        </div>
        <button
          type="button"
          onClick={handleSave}
          className="px-4 py-2 bg-[#0E3320] hover:bg-[#15482D] text-white text-xs font-bold rounded-xl shadow-sm self-start sm:self-auto transition-all"
        >
          {isSaved ? "Saved!" : "Save All Changes"}
        </button>
      </div>
    </div>
  );
}
