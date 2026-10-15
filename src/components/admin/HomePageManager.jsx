"use client";

import { useState, useEffect, useRef } from "react";
import {
  Save, RefreshCw, Plus, Trash2, ChevronDown, ChevronUp,
  Megaphone, Star, LayoutTemplate, Zap, HelpCircle, Eye, EyeOff,
  Check, AlertTriangle, ToggleLeft, ToggleRight, Upload, Image as ImgIcon,
  Users, BookOpen, Palette, X, ExternalLink,
} from "lucide-react";

/* ─── Default homepage content ─────────────────────────────── */
const DEFAULT = {
  announcement: {
    enabled: false,
    text: "New admissions open for 2026–27 session! Apply now via your college.",
    link: "/admissions",
    bgColor: "#C59B3F",
    textColor: "#071F13",
  },
  hero: {
    autoPlay: true,
    interval: 5,
    slides: [
      {
        id: "s1",
        badgeText:    "Rooted in India, For a Better Tomorrow",
        headlineHi:   "प्रकृति से जुड़ें\nबेहतर जीवन जिएं",
        headlineEn:   "Ancient Ayurveda. Authentic Yoga. Natural Healing.",
        descHi:       "आयुर्वेद, योग और प्राकृतिक चिकित्सा के माध्यम से शरीर, मन और आत्मा में संपूर्ण संतुलन पाएं।",
        descEn:       "Discover the power of nature-based healing and Vedic wisdom with India's trusted board.",
        cta1Text:     "Explore Courses",
        cta1Link:     "/courses",
        cta2Text:     "Affiliated Institutes",
        cta2Link:     "/affiliated-institutes",
        imageMobile:  "/images/hero/hero-warrior-pose-mobile.jpg",
        imageDesktop: "/images/hero/hero-meditation-sunrise-desktop.jpg",
      },
      {
        id: "s2",
        badgeText:    "Vedic Wellness & Holistic Living",
        headlineHi:   "शरीर को साधें\nप्राण ऊर्जा जगाएं",
        headlineEn:   "Harmonize Body, Breath and Pranic Energy",
        descHi:       "पारंपरिक योगासनों और प्राणायाम के नियमित अभ्यास से तनाव मुक्त एवं ऊर्जावान जीवन शैली अपनाएं।",
        descEn:       "Master classical Asanas and Pranayama techniques designed to awaken inner vitality and longevity.",
        cta1Text:     "Our Courses",
        cta1Link:     "/courses",
        cta2Text:     "About Parishad",
        cta2Link:     "/about",
        imageMobile:  "/images/hero/hero-warrior-pose-mobile.jpg",
        imageDesktop: "/images/hero/hero-warrior-pose-desktop.jpg",
      },
      {
        id: "s3",
        badgeText:    "Sacred Himalayan Traditions",
        headlineHi:   "हिमालयी चेतना\nगहन ध्यान एवं आत्मज्ञान",
        headlineEn:   "Transcendental Meditation in the Lap of Himalayas",
        descHi:       "प्राचीन ऋषि परंपरा और हिमालयी वातावरण में गहन ध्यान द्वारा मानसिक शांति और आत्म-साक्षात्कार।",
        descEn:       "Experience deep meditative bliss guided by classical Vedic masters amid sacred mountain peaks.",
        cta1Text:     "View Gallery",
        cta1Link:     "/gallery",
        cta2Text:     "About Us",
        cta2Link:     "/about",
        imageMobile:  "/images/hero/hero-himalayan-peak-mobile.jpg",
        imageDesktop: "/images/hero/hero-himalayan-peak-desktop.jpg",
      },
      {
        id: "s4",
        badgeText:    "Healthy Family, Prosperous Nation",
        headlineHi:   "पूरे परिवार के लिए\nसमग्र स्वास्थ्य और संस्कार",
        headlineEn:   "Nurturing Health & Values for Every Generation",
        descHi:       "बच्चों से लेकर बुजुर्गों तक, प्राकृतिक चिकित्सा और योग हर उम्र में स्वास्थ्य और दीर्घायु प्रदान करता है।",
        descEn:       "Holistic wellness therapies and lifestyle guidance curated for every member of the family.",
        cta1Text:     "Student Registration",
        cta1Link:     "/students/registration",
        cta2Text:     "Affiliated Institutes",
        cta2Link:     "/affiliated-institutes",
        imageMobile:  "/images/hero/hero-family-yoga-mobile.jpg",
        imageDesktop: "/images/hero/hero-family-yoga-desktop.jpg",
      },
      {
        id: "s5",
        badgeText:    "Community & Collective Healing",
        headlineHi:   "सामूहिक साधना\nएकता और आत्मिक शांति",
        headlineEn:   "Collective Practice for Greater Inner Peace",
        descHi:       "अनुभवी आचार्यों के सान्निध्य में एक साथ बैठकर ध्यान और नाद योग का दिव्य अनुभव।",
        descEn:       "Connect with like-minded seekers and elevate your consciousness through group dhyana sessions.",
        cta1Text:     "Latest Notices",
        cta1Link:     "/announcements",
        cta2Text:     "Explore Courses",
        cta2Link:     "/courses",
        imageMobile:  "/images/hero/hero-group-guru-mobile.jpg",
        imageDesktop: "/images/hero/hero-group-guru-desktop.jpg",
      },
      {
        id: "s6",
        badgeText:    "Strength, Balance & Discipline",
        headlineHi:   "अनुशासन और शौर्य\nप्राचीन कला एवं शक्ति संवर्धन",
        headlineEn:   "Strength, Mindfulness and Martial Discipline",
        descHi:       "शारीरिक सामर्थ्य, एकाग्रता और आत्मरक्षा का ऐसा संगम जो मन और शरीर को अजेय बनाता है।",
        descEn:       "Empowering youth and seekers with foundational discipline, focus and physical resilience.",
        cta1Text:     "Verify Certificate",
        cta1Link:     "/certificate-verification",
        cta2Text:     "Contact Us",
        cta2Link:     "/contact",
        imageMobile:  "/images/hero/hero-martial-discipline-mobile.jpg",
        imageDesktop: "/images/hero/hero-martial-discipline-desktop.jpg",
      },
      {
        id: "s7",
        badgeText:    "Purity, Nature & Rejuvenation",
        headlineHi:   "प्राकृतिक वातावरण में\nपूर्ण मानसिक पुनर्जीवन",
        headlineEn:   "Complete Mind-Body Rejuvenation by Nature",
        descHi:       "शुद्ध जल, शीतल वायु और पवित्र नदी तट की प्राकृतिक ऊर्जा से शरीर की आंतरिक शुद्धि करें।",
        descEn:       "Recharge your life force in natural serene retreats free from urban noise and stress.",
        cta1Text:     "Online Registration",
        cta1Link:     "/students/registration",
        cta2Text:     "Our Institutes",
        cta2Link:     "/affiliated-institutes",
        imageMobile:  "/images/hero/hero-river-silence-mobile.jpg",
        imageDesktop: "/images/hero/hero-river-silence-desktop.jpg",
      },
    ],
  },
  stats: [
    { id: "s1", value: "500+", label: "Registered Students" },
    { id: "s2", value: "14",   label: "Affiliated Colleges" },
    { id: "s3", value: "25+",  label: "Courses Offered" },
    { id: "s4", value: "10+",  label: "Years of Excellence" },
  ],
  programs: [
    { id: "p1", hi: "7 दिन आयुर्वेद रिट्रीट",    en: "7 Days Ayurveda Retreat",     price: "₹ 24,999", duration: "7 Days",  image: "/images/programs/retreat-7days.jpg",     description: "A gentle introduction to Ayurvedic living — daily detox rituals, sattvic meals, and guided nature walks.", features: ["Detox & Rejuvenation","Beginner-friendly","Sattvic Food","Nature Walks"] },
    { id: "p2", hi: "14 दिन योग ध्यान बंधन",     en: "14 Days Yoga & Meditation",   price: "₹ 42,999", duration: "14 Days", image: "/images/programs/yoga-14days.jpg",       description: "Deepen your practice with two weeks of daily Asana, Pranayama and guided meditation.", features: ["Inner Peace & Balance","Pranayama & Mindfulness","Sattvic Lifestyle","Personal Guidance"] },
    { id: "p3", hi: "21 दिन प्राकृतिक चिकित्सा", en: "21 Days Naturopathy Program", price: "₹ 64,999", duration: "21 Days", image: "/images/programs/naturopathy-21days.jpg", description: "A comprehensive naturopathy journey combining deep cleansing therapies and personalized diet guidance.", features: ["Deep Cleansing","Natural Therapies","Diet & Lifestyle Guidance","Expert Support"] },
    { id: "p4", hi: "30 दिन समग्र स्वास्थ्य",    en: "30 Days Holistic Wellness",   price: "₹ 84,999", duration: "30 Days", image: "/images/programs/wellness-30days.jpg",    description: "Our most complete transformation — a full month resetting body and mind through Yoga, Ayurveda and nature therapy.", features: ["Complete Mind-Body Reset","Yoga, Ayurveda & Nature","Personalized Plan","Lifetime Guidance"] },
  ],
  backgrounds: {
    heroOverlayOpacity: "60",
    yogaBg:         "/images/yoga/yoga-banner.png",
    programsBg:     "/images/programs/programsbg.png",
    ctaBg:          "/images/cta/cta-landscape.jpg",
    naturopathyBg:  "/images/naturopathy/Naturopathybg.png",
    threesDoshasBg: "/images/ThreeDoshasbg.png",
  },
  naturopathy: [
    { id: "n1", titleHi: "जल चिकित्सा",         titleEn: "Water Therapy",       image: "/images/naturopathy/water-therapy.jpg" },
    { id: "n2", titleHi: "शुद्ध भोजन",           titleEn: "Pure Sattvic Food",   image: "/images/naturopathy/pure-food.jpg" },
    { id: "n3", titleHi: "जड़ी-बूटी चिकित्सा",   titleEn: "Herbal Care",         image: "/images/naturopathy/herbal-care.jpg" },
    { id: "n4", titleHi: "मिट्टी चिकित्सा",      titleEn: "Mud Therapy",         image: "/images/naturopathy/mud-therapy.jpg" },
    { id: "n5", titleHi: "वायु जलप्रपात",        titleEn: "Air & Waterfall",     image: "/images/naturopathy/air-waterfall.jpg" },
    { id: "n6", titleHi: "सूर्य किरण चिकित्सा",  titleEn: "Sun Therapy",         image: "/images/naturopathy/sun-therapy.jpg" },
  ],
  acharyas: [
    { id: "a1", name: "Dr. Anjali Sharma",      titleHi: "वैद्य आचार्या अंजलि शर्मा",    specialty: "Classical Ayurveda & Panchakarma", photo: "/images/acharyas/dr-anjali.jpg",       bio: "25 years of clinical Ayurvedic practice." },
    { id: "a2", name: "Yogi Rahul Mishra",      titleHi: "योगाचार्य राहुल मिश्र",          specialty: "Ashtanga Yoga & Pranayama",        photo: "/images/acharyas/yogi-rahul.jpg",      bio: "Certified Ashtanga Yoga master from Mysuru." },
    { id: "a3", name: "Dr. Meera Deshpande",    titleHi: "वैद्य डॉ. मीरा देशपांडे",        specialty: "Naturopathy & Nutritional Medicine", photo: "/images/acharyas/dr-meera.jpg",       bio: "Specialist in holistic nutritional healing." },
    { id: "a4", name: "Acharya Devendra Nath",  titleHi: "आचार्य देवेन्द्र नाथ त्रिपाठी", specialty: "Vedic Philosophy & Meditation",     photo: "/images/acharyas/acharya-devendra.jpg", bio: "Vedic scholar and meditation guide." },
  ],
  testimonials: [
    { id: "t1", name: "Priya Patel",    photo: "/images/testimonials/priya-patel.jpg", rating: 5, location: "Mumbai, Maharashtra", quote: "The 21-day Naturopathy program completely transformed my health. I came with chronic fatigue and left feeling reborn. The Vaidyas here truly listen." },
  ],
  articles: [
    { id: "ar1", titleEn: "Rediscovering Ritucharya: Ayurveda's Ancient Seasonal Wisdom",    date: "12 Sep 2026", readTime: "6 min", image: "/images/articles/article-1.jpg", link: "#" },
    { id: "ar2", titleEn: "The Three Doshas Explained: Vata, Pitta & Kapha in Daily Life",   date: "04 Sep 2026", readTime: "8 min", image: "/images/articles/article-2.jpg", link: "#" },
    { id: "ar3", titleEn: "Pranayama for Modern Stress: Ancient Breathing, Modern Science",  date: "28 Aug 2026", readTime: "5 min", image: "/images/articles/article-3.jpg", link: "#" },
  ],
  cta: {
    headlineHi: "एक स्वस्थ और संतुलित जीवन की ओर पहला कदम",
    headlineEn: "Take the First Step Towards a Healthier, Happier You",
    btn1Text: "Book a Consultation",
    btn2Text: "Get in Touch",
  },
  faq: [
    { id: "f1", q: "What is Ayurveda and how does it work?",         a: "Ayurveda is a 5,000-year-old Indian system of medicine based on the balance of bodily humors (doshas). It uses diet, herbs, lifestyle and therapies to restore natural balance." },
    { id: "f2", q: "Who can enroll in your programs?",               a: "Anyone aged 18 and above interested in Ayurveda, Yoga or natural healing can enroll. Prior medical knowledge is not required for most courses." },
    { id: "f3", q: "Are certificates recognized?",                   a: "Yes. Certificates issued by Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad are recognized by affiliated educational bodies and are verifiable online." },
    { id: "f4", q: "How do I register my college for affiliation?",  a: "Colleges can apply for affiliation through our official application portal. The process involves document submission, inspection and approval by the board." },
    { id: "f5", q: "Can I access results and admit cards online?",   a: "Yes. Students can download admit cards and check examination results through the student portal on our website using their roll number." },
  ],
  sections: {
    announcement: false, hero: true, pillars: true, about: true,
    yoga: true, naturopathy: true, programs: true, doshas: true,
    whyChoose: true, acharyas: true, faq: true, cta: true,
  },
};

const SECTION_LABELS = {
  announcement: "Announcement Bar", hero: "Hero Section", pillars: "Four Pillars",
  about: "About Ayurveda", yoga: "Yoga Section", naturopathy: "Naturopathy",
  programs: "Programs", doshas: "Three Doshas", whyChoose: "Why Choose Us",
  acharyas: "Acharyas & Testimonials", faq: "Articles & FAQ", cta: "CTA Banner",
};

const TABS = [
  { id: "announcement", label: "Announcement",  icon: Megaphone },
  { id: "hero",         label: "Hero",           icon: Star },
  { id: "stats",        label: "Stats",          icon: Zap },
  { id: "programs",     label: "Programs",       icon: LayoutTemplate },
  { id: "backgrounds",  label: "Backgrounds",    icon: Palette },
  { id: "naturopathy",  label: "Naturopathy",    icon: ImgIcon },
  { id: "acharyas",     label: "Acharyas",       icon: Users },
  { id: "testimonials", label: "Testimonials",   icon: Users },
  { id: "articles",     label: "Articles",       icon: BookOpen },
  { id: "cta",          label: "CTA Banner",     icon: Megaphone },
  { id: "faq",          label: "FAQ",            icon: HelpCircle },
  { id: "visibility",   label: "Visibility",     icon: Eye },
];

const uid = () => Math.random().toString(36).slice(2, 9);

/* ─── Image Upload Helper ───────────────────────────────────── */
function ImageUpload({ value, onChange, label, folder = "homepage", hint }) {
  const inputRef = useRef();
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");

  const upload = async (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { setErr("Max 5 MB"); return; }
    setUploading(true); setErr("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res  = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) onChange(data.url);
      else setErr(data.error || "Upload failed");
    } catch { setErr("Network error"); }
    setUploading(false);
  };

  return (
    <div>
      {label && <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-1">{label}</label>}
      <div className="flex gap-2">
        {/* Preview */}
        <div className="w-20 h-16 rounded-xl overflow-hidden border border-[#DDD1BE] bg-[#F5F0E8] shrink-0 flex items-center justify-center">
          {value ? (
            <img src={value} alt="" className="w-full h-full object-cover" onError={e => e.target.style.display="none"} />
          ) : (
            <ImgIcon className="w-6 h-6 text-[#C59B3F]/50" />
          )}
        </div>
        <div className="flex-1 space-y-1.5">
          <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} placeholder="/images/... or https://..."
            className="w-full px-3 py-1.5 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#C59B3F]" />
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
              className="flex items-center gap-1.5 px-3 py-1 bg-[#0E3320] text-white text-[11px] font-bold rounded-lg hover:bg-[#15482D] transition-all disabled:opacity-60">
              {uploading ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
              {uploading ? "Uploading…" : "Upload Image"}
            </button>
            {value && (
              <a href={value} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1 text-[11px] text-[#8C671D] hover:text-[#0E3320] font-medium">
                <ExternalLink className="w-3 h-3" /> Preview
              </a>
            )}
            {err && <span className="text-[11px] text-red-500">{err}</span>}
          </div>
        </div>
      </div>
      {hint && <p className="text-[10px] text-[#9B8265] mt-1">{hint}</p>}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={e => upload(e.target.files?.[0])} />
    </div>
  );
}

/* ─── Text Field ────────────────────────────────────────────── */
function Field({ label, value, onChange, type = "text", rows, hint, span }) {
  return (
    <div className={span ? "sm:col-span-2" : ""}>
      {label && <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-1">{label}</label>}
      {rows ? (
        <textarea rows={rows} value={value || ""} onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F] resize-none" />
      ) : (
        <input type={type} value={value || ""} onChange={e => onChange(e.target.value)}
          className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
      )}
      {hint && <p className="text-[10px] text-[#9B8265] mt-0.5">{hint}</p>}
    </div>
  );
}

/* ─── Section Card ──────────────────────────────────────────── */
function SectionCard({ title, subtitle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-[#DDD1BE] shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-[#DDD1BE] bg-[#FAF8F5]">
        <h3 className="text-sm font-bold text-[#0E3320]">{title}</h3>
        {subtitle && <p className="text-xs text-[#5C8261] mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────────── */
export default function HomePageManager({ onShowToast }) {
  const [data, setData]       = useState(DEFAULT);
  const [tab, setTab]         = useState("announcement");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(false);
  const [expanded, setExpanded] = useState({});
  const [scrollToId, setScrollToId] = useState(null);

  useEffect(() => {
    if (!scrollToId) return;
    const el = document.getElementById(`item-${scrollToId}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    setScrollToId(null);
  }, [scrollToId, data]);

  useEffect(() => {
    // Fetch both homepage_content and hero_images in parallel
    Promise.all([
      fetch("/api/public/site-settings?key=homepage_content").then(r => r.json()).catch(() => null),
      fetch("/api/public/site-settings?key=hero_images").then(r => r.json()).catch(() => null),
    ]).then(([hpRes, imgRes]) => {
      setData(prev => {
        let merged = prev;

        // Apply saved homepage_content if it exists
        if (hpRes?.ok && hpRes.homepage) {
          merged = deepMerge(merged, hpRes.homepage);
        }

        // If hero.slides still only has the 1 default slide AND hero_images exist in DB,
        // build slides from those images so admin can see/manage them
        const heroImgs = imgRes?.ok && Array.isArray(imgRes.homepage?._heroImages)
          ? imgRes.homepage._heroImages
          : null;

        const hasCustomSlides =
          Array.isArray(merged.hero?.slides) &&
          merged.hero.slides.length > 0 &&
          merged.hero.slides.some(s => s.imageMobile && !s.imageMobile.startsWith("/images/hero/hero-phone"));

        if (!hasCustomSlides && heroImgs && heroImgs.length > 0) {
          const builtSlides = heroImgs.map((url, i) => ({
            id: `db-${i}`,
            badgeText:    DEFAULT.hero.slides[0].badgeText,
            headlineHi:   DEFAULT.hero.slides[0].headlineHi,
            headlineEn:   DEFAULT.hero.slides[0].headlineEn,
            descHi:       DEFAULT.hero.slides[0].descHi,
            descEn:       DEFAULT.hero.slides[0].descEn,
            cta1Text:     DEFAULT.hero.slides[0].cta1Text,
            cta1Link:     DEFAULT.hero.slides[0].cta1Link,
            cta2Text:     DEFAULT.hero.slides[0].cta2Text,
            cta2Link:     DEFAULT.hero.slides[0].cta2Link,
            imageMobile:  url,
            imageDesktop: url,
          }));
          merged = { ...merged, hero: { ...merged.hero, slides: builtSlides } };
        }

        return merged;
      });
    }).finally(() => setLoading(false));
  }, []);

  // Deep merge keeping DEFAULT structure for missing keys
  function deepMerge(def, override) {
    if (!override) return def;
    const result = { ...def };
    for (const key of Object.keys(override)) {
      if (override[key] !== null && typeof override[key] === "object" && !Array.isArray(override[key]) && typeof def[key] === "object" && !Array.isArray(def[key])) {
        result[key] = deepMerge(def[key], override[key]);
      } else {
        result[key] = override[key];
      }
    }
    return result;
  }

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "homepage_content", value: JSON.stringify(data) }),
      });
      const d = await res.json();
      if (d.ok) onShowToast?.("Home page saved!", "success");
      else onShowToast?.(d.error || "Save failed", "error");
    } catch { onShowToast?.("Network error", "error"); }
    setSaving(false);
  };

  // Generic deep setter: "hero.badgeText" → sets data.hero.badgeText
  const set = (path, value) => {
    setData(prev => {
      const clone = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = clone;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return clone;
    });
  };

  const toggle = (id) => setExpanded(p => ({ ...p, [id]: !p[id] }));

  if (loading) return <div className="p-10 text-center"><RefreshCw className="w-6 h-6 animate-spin mx-auto text-[#C59B3F]" /></div>;

  return (
    <div className="space-y-5">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#DDD1BE] shadow-sm">
        <div>
          <h2 className="text-base font-bold text-[#0E3320] flex items-center gap-2">
            <LayoutTemplate className="w-5 h-5 text-[#C59B3F]" /> Home Page — Full Customization
          </h2>
          <p className="text-xs text-[#5C8261] mt-0.5">Text, images, programs, FAQ, acharyas — A to Z. Changes go live after Save.</p>
        </div>
        <button onClick={save} disabled={saving}
          className="px-5 py-2.5 text-xs font-bold text-white bg-[#0E3320] hover:bg-[#15482D] rounded-xl shadow-sm flex items-center gap-2 disabled:opacity-60 transition-all shrink-0">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#C59B3F]" />}
          {saving ? "Saving…" : "Save All to Database"}
        </button>
      </div>

      {/* ── Sub-tab strip ── */}
      <div className="flex flex-wrap gap-1.5">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                tab === t.id ? "bg-[#0E3320] text-white shadow-sm" : "bg-white border border-[#DDD1BE] text-[#5C8261] hover:border-[#C59B3F] hover:text-[#0E3320]"
              }`}>
              <Icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ══════════════════════════════════════════════ */}
      {tab === "announcement" && (
        <SectionCard title="Announcement Bar" subtitle="Full-width banner at the very top of the website.">
          <div className="flex items-center justify-between">
            <p className="text-xs text-[#5C8261]">Enable or disable the announcement bar</p>
            <button onClick={() => set("announcement.enabled", !data.announcement.enabled)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
                data.announcement.enabled ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-[#FAF8F5] border-[#DDD1BE] text-[#9B8265]"
              }`}>
              {data.announcement.enabled ? <ToggleRight className="w-4 h-4" /> : <ToggleLeft className="w-4 h-4" />}
              {data.announcement.enabled ? "Enabled — showing on site" : "Disabled"}
            </button>
          </div>

          {data.announcement.enabled && (
            <div className="p-3 rounded-xl text-xs font-semibold text-center border" style={{ background: data.announcement.bgColor, color: data.announcement.textColor }}>
              {data.announcement.text || "Preview…"}{data.announcement.link ? ` → ${data.announcement.link}` : ""}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Announcement Text" value={data.announcement.text} onChange={v => set("announcement.text", v)} span hint="Short one-liner" />
            <Field label="Link URL" value={data.announcement.link} onChange={v => set("announcement.link", v)} hint="e.g. /admissions" />
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-2">Background Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={data.announcement.bgColor} onChange={e => set("announcement.bgColor", e.target.value)} className="w-9 h-9 rounded-lg border border-[#DDD1BE] cursor-pointer" />
                <span className="font-mono text-xs text-[#5C8261]">{data.announcement.bgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-2">Text Color</label>
              <div className="flex items-center gap-3">
                <input type="color" value={data.announcement.textColor} onChange={e => set("announcement.textColor", e.target.value)} className="w-9 h-9 rounded-lg border border-[#DDD1BE] cursor-pointer" />
                <span className="font-mono text-xs text-[#5C8261]">{data.announcement.textColor}</span>
              </div>
            </div>
          </div>
        </SectionCard>
      )}

      {/* ══════════════════════════════════════════════ */}
      {tab === "hero" && (() => {
        const slides = Array.isArray(data.hero?.slides) && data.hero.slides.length
          ? data.hero.slides
          : [{ id: uid(), badgeText: data.hero?.badgeText || "", headlineHi: data.hero?.headlineHi || "", headlineEn: data.hero?.headlineEn || "", descHi: data.hero?.descHi || "", descEn: data.hero?.descEn || "", cta1Text: data.hero?.cta1Text || "", cta2Text: data.hero?.cta2Text || "", imageMobile: data.hero?.imageMobile || "", imageDesktop: data.hero?.imageDesktop || "" }];

        const setSlides = (next) => setData(p => ({ ...p, hero: { ...p.hero, slides: typeof next === "function" ? next(Array.isArray(p.hero?.slides) ? p.hero.slides : slides) : next } }));
        const updateSlide = (i, field, val) => setSlides(prev => { const a = [...prev]; a[i] = { ...a[i], [field]: val }; return a; });

        return (
          <div className="space-y-4">
            {/* Carousel settings */}
            <SectionCard title="Carousel Settings" subtitle="Auto-play and timing for hero slider.">
              <div className="flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <button onClick={() => set("hero.autoPlay", !data.hero?.autoPlay !== false)}
                    style={{ width: 44, height: 24, minWidth: 44, flexShrink: 0 }}
                    className={`relative rounded-full transition-colors duration-200 focus:outline-none ${data.hero?.autoPlay !== false ? "bg-[#0E3320]" : "bg-[#D5C9B5]"}`}>
                    <span style={{ position:"absolute", top:3, left: data.hero?.autoPlay !== false ? 23 : 3, width:18, height:18, borderRadius:"50%", background:"white", boxShadow:"0 1px 3px rgba(0,0,0,0.25)", transition:"left 0.2s" }} />
                  </button>
                  <span className="text-xs font-semibold text-[#0E3320]">Auto-play slides</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-xs font-bold text-[#0E3320]">Interval (seconds)</label>
                  <input type="number" min="2" max="15" value={data.hero?.interval || 5}
                    onChange={e => set("hero.interval", Number(e.target.value))}
                    className="w-16 px-2 py-1.5 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                </div>
              </div>
            </SectionCard>

            {/* Slides header */}
            <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-[#DDD1BE] shadow-sm">
              <div>
                <h3 className="text-sm font-bold text-[#0E3320]">Hero Slides ({slides.length})</h3>
                <p className="text-xs text-[#5C8261] mt-0.5">Each slide has its own image + text. They auto-swipe on the website.</p>
              </div>
              <button onClick={() => {
                const ns = { id: uid(), badgeText: "", headlineHi: "नया स्लाइड", headlineEn: "New Slide", descHi: "", descEn: "", cta1Text: "Book a Consultation", cta2Text: "Watch Our Story", imageMobile: "", imageDesktop: "" };
                setSlides(prev => [...prev, ns]);
                setExpanded(e => ({ ...e, [ns.id]: true }));
                setScrollToId(ns.id);
              }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E3320] text-white text-xs font-bold rounded-xl hover:bg-[#15482D] transition-all shrink-0">
                <Plus className="w-3.5 h-3.5" /> Add Slide
              </button>
            </div>

            {/* Slide cards */}
            {slides.map((slide, si) => (
              <div key={slide.id} id={`item-${slide.id}`} className="bg-white rounded-2xl border border-[#DDD1BE] shadow-sm overflow-hidden">
                {/* Slide header row */}
                <div className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-[#FAF8F5] transition-colors" onClick={() => toggle(slide.id)}>
                  <div className="w-12 h-9 rounded-lg overflow-hidden border border-[#DDD1BE] shrink-0">
                    {slide.imageDesktop || slide.imageMobile
                      ? <img src={slide.imageDesktop || slide.imageMobile} alt="" className="w-full h-full object-cover" />
                      : <div className="w-full h-full bg-[#E6EFE9] flex items-center justify-center"><ImgIcon className="w-4 h-4 text-[#C59B3F]/50" /></div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-[#0E3320] truncate">Slide {si + 1} — {slide.headlineEn || slide.headlineHi || "Untitled"}</p>
                    <p className="text-[11px] text-[#5C8261] truncate">{slide.badgeText || "No badge text"}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {slides.length > 1 && (
                      <button onClick={e => { e.stopPropagation(); setSlides(prev => prev.filter((_, j) => j !== si)); }}
                        className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                    )}
                    {expanded[slide.id] ? <ChevronUp className="w-4 h-4 text-[#9B8265]" /> : <ChevronDown className="w-4 h-4 text-[#9B8265]" />}
                  </div>
                </div>

                {/* Slide editor */}
                {expanded[slide.id] && (
                  <div className="px-5 pb-5 pt-2 border-t border-[#DDD1BE] space-y-4">
                    {/* Images */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ImageUpload label="Mobile Image" value={slide.imageMobile} onChange={v => updateSlide(si, "imageMobile", v)} folder="homepage/hero" hint="Portrait — shown on phones" />
                      <ImageUpload label="Desktop Image" value={slide.imageDesktop} onChange={v => updateSlide(si, "imageDesktop", v)} folder="homepage/hero" hint="Landscape — shown on tablets & desktop" />
                    </div>
                    {/* Text fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="sm:col-span-2">
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-1">Badge Text</label>
                        <input value={slide.badgeText} onChange={e => updateSlide(si, "badgeText", e.target.value)} placeholder="Short tagline in green pill"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-1">Hindi Headline</label>
                        <textarea rows={3} value={slide.headlineHi} onChange={e => updateSlide(si, "headlineHi", e.target.value)} placeholder='Use \n for line break'
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] resize-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-1">English Headline</label>
                        <textarea rows={3} value={slide.headlineEn} onChange={e => updateSlide(si, "headlineEn", e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] resize-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-1">Hindi Description</label>
                        <textarea rows={2} value={slide.descHi} onChange={e => updateSlide(si, "descHi", e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] resize-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-1">English Description</label>
                        <textarea rows={2} value={slide.descEn} onChange={e => updateSlide(si, "descEn", e.target.value)}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] resize-none" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-1">Button 1 — Text</label>
                        <input value={slide.cta1Text} onChange={e => updateSlide(si, "cta1Text", e.target.value)} placeholder="Apply for Admission"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-1">Button 1 — Link URL</label>
                        <input value={slide.cta1Link || ""} onChange={e => updateSlide(si, "cta1Link", e.target.value)} placeholder="/students/registration"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-1">Button 2 — Text <span className="text-[#9B8265] font-normal normal-case">(optional)</span></label>
                        <input value={slide.cta2Text} onChange={e => updateSlide(si, "cta2Text", e.target.value)} placeholder="Affiliated Colleges"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-1">Button 2 — Link URL</label>
                        <input value={slide.cta2Link || ""} onChange={e => updateSlide(si, "cta2Link", e.target.value)} placeholder="/affiliated-institutes"
                          className="w-full px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      })()}

      {/* ══════════════════════════════════════════════ */}
      {tab === "stats" && (
        <SectionCard title="Stats Counter" subtitle="Numbers shown in the hero area.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {data.stats.map((s, i) => (
              <div key={s.id} className="flex items-center gap-3 p-3 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5]">
                <div className="flex-1 grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#9B8265] mb-0.5">Value</label>
                    <input value={s.value} onChange={e => { const a = [...data.stats]; a[i] = { ...a[i], value: e.target.value }; setData(p => ({ ...p, stats: a })); }}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-[#DDD1BE] bg-white focus:outline-none focus:ring-1 focus:ring-[#C59B3F]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#9B8265] mb-0.5">Label</label>
                    <input value={s.label} onChange={e => { const a = [...data.stats]; a[i] = { ...a[i], label: e.target.value }; setData(p => ({ ...p, stats: a })); }}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-[#DDD1BE] bg-white focus:outline-none focus:ring-1 focus:ring-[#C59B3F]" />
                  </div>
                </div>
                <button onClick={() => setData(p => ({ ...p, stats: p.stats.filter((_, j) => j !== i) }))} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
              </div>
            ))}
          </div>
          <button onClick={() => setData(p => ({ ...p, stats: [...p.stats, { id: uid(), value: "100+", label: "New Stat" }] }))}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E3320] text-white text-xs font-bold rounded-xl hover:bg-[#15482D] transition-all">
            <Plus className="w-3.5 h-3.5" /> Add Stat
          </button>
        </SectionCard>
      )}

      {/* ══════════════════════════════════════════════ */}
      {tab === "programs" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-[#DDD1BE] shadow-sm">
            <h3 className="text-sm font-bold text-[#0E3320]">Programs / Courses ({data.programs.length})</h3>
            <button onClick={() => {
              const np = { id: uid(), hi: "नया प्रोग्राम", en: "New Program", price: "₹ 0", duration: "7 Days", image: "", description: "", features: ["Feature 1"] };
              setData(p => ({ ...p, programs: [...p.programs, np] }));
              setExpanded(e => ({ ...e, [np.id]: true }));
              setScrollToId(np.id);
            }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E3320] text-white text-xs font-bold rounded-xl hover:bg-[#15482D] transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Program
            </button>
          </div>

          {data.programs.map((prog, pi) => (
            <div key={prog.id} id={`item-${prog.id}`} className="bg-white rounded-2xl border border-[#DDD1BE] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-[#FAF8F5] transition-colors" onClick={() => toggle(prog.id)}>
                <div className="w-10 h-8 rounded-lg overflow-hidden border border-[#DDD1BE] shrink-0">
                  {prog.image ? <img src={prog.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#F5F0E8] flex items-center justify-center"><ImgIcon className="w-3 h-3 text-[#C59B3F]/50" /></div>}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-[#0E3320] truncate">{prog.en}</p>
                  <p className="text-xs text-[#5C8261]">{prog.duration} · {prog.price}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={e => { e.stopPropagation(); setData(p => ({ ...p, programs: p.programs.filter(x => x.id !== prog.id) })); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                  {expanded[prog.id] ? <ChevronUp className="w-4 h-4 text-[#9B8265]" /> : <ChevronDown className="w-4 h-4 text-[#9B8265]" />}
                </div>
              </div>

              {expanded[prog.id] && (
                <div className="px-5 pb-5 pt-2 border-t border-[#DDD1BE] space-y-4">
                  <ImageUpload label="Program Card Image" value={prog.image} onChange={v => { const a = [...data.programs]; a[pi] = { ...a[pi], image: v }; setData(p => ({ ...p, programs: a })); }} folder="homepage/programs" hint="Landscape photo shown on program card" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Hindi Title" value={prog.hi} onChange={v => { const a = [...data.programs]; a[pi] = { ...a[pi], hi: v }; setData(p => ({ ...p, programs: a })); }} />
                    <Field label="English Title" value={prog.en} onChange={v => { const a = [...data.programs]; a[pi] = { ...a[pi], en: v }; setData(p => ({ ...p, programs: a })); }} />
                    <Field label="Price" value={prog.price} onChange={v => { const a = [...data.programs]; a[pi] = { ...a[pi], price: v }; setData(p => ({ ...p, programs: a })); }} />
                    <Field label="Duration" value={prog.duration} onChange={v => { const a = [...data.programs]; a[pi] = { ...a[pi], duration: v }; setData(p => ({ ...p, programs: a })); }} />
                    <Field label="Description" value={prog.description} onChange={v => { const a = [...data.programs]; a[pi] = { ...a[pi], description: v }; setData(p => ({ ...p, programs: a })); }} rows={3} span />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-[11px] font-bold uppercase tracking-wider text-[#0E3320]">Features</label>
                      <button onClick={() => { const a = [...data.programs]; a[pi] = { ...a[pi], features: [...a[pi].features, "New Feature"] }; setData(p => ({ ...p, programs: a })); }}
                        className="text-[11px] font-bold text-[#8C671D] flex items-center gap-1"><Plus className="w-3 h-3" /> Add</button>
                    </div>
                    <div className="space-y-1.5">
                      {prog.features.map((feat, fi) => (
                        <div key={fi} className="flex items-center gap-2">
                          <input value={feat} onChange={e => { const a = [...data.programs]; const f = [...a[pi].features]; f[fi] = e.target.value; a[pi] = { ...a[pi], features: f }; setData(p => ({ ...p, programs: a })); }}
                            className="flex-1 px-3 py-1.5 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-1 focus:ring-[#C59B3F]" />
                          <button onClick={() => { const a = [...data.programs]; const f = a[pi].features.filter((_, j) => j !== fi); a[pi] = { ...a[pi], features: f }; setData(p => ({ ...p, programs: a })); }}
                            className="p-1 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {tab === "backgrounds" && (
        <div className="space-y-4">
          <SectionCard title="Section Background Images" subtitle="Upload or paste URLs for section backgrounds across the home page.">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <ImageUpload label="Yoga Section Background" value={data.backgrounds.yogaBg} onChange={v => set("backgrounds.yogaBg", v)} folder="homepage/backgrounds" />
              <ImageUpload label="Programs Section Background" value={data.backgrounds.programsBg} onChange={v => set("backgrounds.programsBg", v)} folder="homepage/backgrounds" />
              <ImageUpload label="CTA Banner Background" value={data.backgrounds.ctaBg} onChange={v => set("backgrounds.ctaBg", v)} folder="homepage/backgrounds" />
              <ImageUpload label="Naturopathy Section Background" value={data.backgrounds.naturopathyBg} onChange={v => set("backgrounds.naturopathyBg", v)} folder="homepage/backgrounds" />
              <ImageUpload label="Three Doshas Background" value={data.backgrounds.threesDoshasBg} onChange={v => set("backgrounds.threesDoshasBg", v)} folder="homepage/backgrounds" />
            </div>
          </SectionCard>
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {tab === "naturopathy" && (
        <SectionCard title="Naturopathy Therapy Images" subtitle="6 therapy cards shown in the Naturopathy section.">
          <div className="space-y-3">
            {data.naturopathy.map((item, i) => (
              <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5]">
                <div className="w-16 h-12 rounded-lg overflow-hidden border border-[#DDD1BE] shrink-0">
                  {item.image ? <img src={item.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#E6EFE9] flex items-center justify-center"><ImgIcon className="w-4 h-4 text-[#C59B3F]/50" /></div>}
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#9B8265] mb-0.5">Hindi Title</label>
                    <input value={item.titleHi} onChange={e => { const a = [...data.naturopathy]; a[i] = { ...a[i], titleHi: e.target.value }; setData(p => ({ ...p, naturopathy: a })); }}
                      className="w-full px-2 py-1 text-xs rounded-lg border border-[#DDD1BE] bg-white focus:outline-none focus:ring-1 focus:ring-[#C59B3F]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#9B8265] mb-0.5">English Title</label>
                    <input value={item.titleEn} onChange={e => { const a = [...data.naturopathy]; a[i] = { ...a[i], titleEn: e.target.value }; setData(p => ({ ...p, naturopathy: a })); }}
                      className="w-full px-2 py-1 text-xs rounded-lg border border-[#DDD1BE] bg-white focus:outline-none focus:ring-1 focus:ring-[#C59B3F]" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold uppercase text-[#9B8265] mb-0.5">Image URL / Upload</label>
                    <div className="flex items-center gap-1">
                      <input value={item.image} onChange={e => { const a = [...data.naturopathy]; a[i] = { ...a[i], image: e.target.value }; setData(p => ({ ...p, naturopathy: a })); }}
                        placeholder="/images/..." className="flex-1 px-2 py-1 text-xs rounded-lg border border-[#DDD1BE] bg-white focus:outline-none focus:ring-1 focus:ring-[#C59B3F]" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}

      {/* ══════════════════════════════════════════════ */}
      {tab === "acharyas" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-[#DDD1BE] shadow-sm">
            <h3 className="text-sm font-bold text-[#0E3320]">Meet Our Acharyas ({data.acharyas.length})</h3>
            <button onClick={() => {
              const na = { id: uid(), name: "New Acharya", titleHi: "आचार्य", specialty: "Ayurveda", photo: "", bio: "" };
              setData(p => ({ ...p, acharyas: [...p.acharyas, na] }));
              setExpanded(e => ({ ...e, [na.id]: true }));
              setScrollToId(na.id);
            }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E3320] text-white text-xs font-bold rounded-xl hover:bg-[#15482D] transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Acharya
            </button>
          </div>

          {data.acharyas.map((a, ai) => (
            <div key={a.id} id={`item-${a.id}`} className="bg-white rounded-2xl border border-[#DDD1BE] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-[#FAF8F5] transition-colors" onClick={() => toggle(a.id)}>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C59B3F]/30 shrink-0">
                  {a.photo ? <img src={a.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#E6EFE9] flex items-center justify-center"><Users className="w-4 h-4 text-[#5C8261]" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0E3320] truncate">{a.name}</p>
                  <p className="text-xs text-[#5C8261] truncate">{a.specialty}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={e => { e.stopPropagation(); setData(p => ({ ...p, acharyas: p.acharyas.filter(x => x.id !== a.id) })); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                  {expanded[a.id] ? <ChevronUp className="w-4 h-4 text-[#9B8265]" /> : <ChevronDown className="w-4 h-4 text-[#9B8265]" />}
                </div>
              </div>
              {expanded[a.id] && (
                <div className="px-5 pb-5 pt-2 border-t border-[#DDD1BE] space-y-4">
                  <ImageUpload label="Profile Photo" value={a.photo} onChange={v => { const arr = [...data.acharyas]; arr[ai] = { ...arr[ai], photo: v }; setData(p => ({ ...p, acharyas: arr })); }} folder="homepage/acharyas" hint="Square photo recommended (1:1 ratio)" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Full Name (English)" value={a.name} onChange={v => { const arr = [...data.acharyas]; arr[ai] = { ...arr[ai], name: v }; setData(p => ({ ...p, acharyas: arr })); }} />
                    <Field label="Title (Hindi)" value={a.titleHi} onChange={v => { const arr = [...data.acharyas]; arr[ai] = { ...arr[ai], titleHi: v }; setData(p => ({ ...p, acharyas: arr })); }} />
                    <Field label="Specialty" value={a.specialty} onChange={v => { const arr = [...data.acharyas]; arr[ai] = { ...arr[ai], specialty: v }; setData(p => ({ ...p, acharyas: arr })); }} span />
                    <Field label="Short Bio" value={a.bio} onChange={v => { const arr = [...data.acharyas]; arr[ai] = { ...arr[ai], bio: v }; setData(p => ({ ...p, acharyas: arr })); }} rows={2} span />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {tab === "testimonials" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-[#DDD1BE] shadow-sm">
            <h3 className="text-sm font-bold text-[#0E3320]">Testimonials ({data.testimonials.length})</h3>
            <button onClick={() => {
              const nt = { id: uid(), name: "Student Name", photo: "", rating: 5, location: "City, State", quote: "Share their experience here." };
              setData(p => ({ ...p, testimonials: [...p.testimonials, nt] }));
              setExpanded(e => ({ ...e, [nt.id]: true }));
              setScrollToId(nt.id);
            }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E3320] text-white text-xs font-bold rounded-xl hover:bg-[#15482D] transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Testimonial
            </button>
          </div>
          {data.testimonials.map((t, ti) => (
            <div key={t.id} id={`item-${t.id}`} className="bg-white rounded-2xl border border-[#DDD1BE] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-[#FAF8F5] transition-colors" onClick={() => toggle(t.id)}>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C59B3F]/30 shrink-0">
                  {t.photo ? <img src={t.photo} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#F5F0E8] flex items-center justify-center"><Users className="w-4 h-4 text-[#8C671D]" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-[#0E3320]">{t.name}</p>
                  <p className="text-xs text-[#5C8261] truncate">{t.location} · {"★".repeat(t.rating)}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={e => { e.stopPropagation(); setData(p => ({ ...p, testimonials: p.testimonials.filter(x => x.id !== t.id) })); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                  {expanded[t.id] ? <ChevronUp className="w-4 h-4 text-[#9B8265]" /> : <ChevronDown className="w-4 h-4 text-[#9B8265]" />}
                </div>
              </div>
              {expanded[t.id] && (
                <div className="px-5 pb-5 pt-2 border-t border-[#DDD1BE] space-y-4">
                  <ImageUpload label="Profile Photo" value={t.photo} onChange={v => { const arr = [...data.testimonials]; arr[ti] = { ...arr[ti], photo: v }; setData(p => ({ ...p, testimonials: arr })); }} folder="homepage/testimonials" hint="Square photo (1:1 ratio)" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Name" value={t.name} onChange={v => { const arr = [...data.testimonials]; arr[ti] = { ...arr[ti], name: v }; setData(p => ({ ...p, testimonials: arr })); }} />
                    <Field label="Location" value={t.location} onChange={v => { const arr = [...data.testimonials]; arr[ti] = { ...arr[ti], location: v }; setData(p => ({ ...p, testimonials: arr })); }} />
                    <div>
                      <label className="block text-[11px] font-bold uppercase tracking-wider text-[#0E3320] mb-1">Rating (1–5)</label>
                      <input type="number" min="1" max="5" value={t.rating} onChange={e => { const arr = [...data.testimonials]; arr[ti] = { ...arr[ti], rating: Number(e.target.value) }; setData(p => ({ ...p, testimonials: arr })); }}
                        className="w-20 px-3 py-2 text-xs rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
                    </div>
                    <Field label="Quote / Review" value={t.quote} onChange={v => { const arr = [...data.testimonials]; arr[ti] = { ...arr[ti], quote: v }; setData(p => ({ ...p, testimonials: arr })); }} rows={3} span />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {tab === "articles" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-[#DDD1BE] shadow-sm">
            <h3 className="text-sm font-bold text-[#0E3320]">Latest Articles ({data.articles.length})</h3>
            <button onClick={() => {
              const na = { id: uid(), titleEn: "New Article Title", date: new Date().toLocaleDateString("en-IN"), readTime: "5 min", image: "", link: "#" };
              setData(p => ({ ...p, articles: [...p.articles, na] }));
              setExpanded(e => ({ ...e, [na.id]: true }));
              setScrollToId(na.id);
            }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E3320] text-white text-xs font-bold rounded-xl hover:bg-[#15482D] transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Article
            </button>
          </div>
          {data.articles.map((art, ari) => (
            <div key={art.id} id={`item-${art.id}`} className="bg-white rounded-2xl border border-[#DDD1BE] shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 px-5 py-3.5 cursor-pointer hover:bg-[#FAF8F5] transition-colors" onClick={() => toggle(art.id)}>
                <div className="w-14 h-10 rounded-lg overflow-hidden border border-[#DDD1BE] shrink-0">
                  {art.image ? <img src={art.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-[#E6EFE9] flex items-center justify-center"><BookOpen className="w-4 h-4 text-[#5C8261]" /></div>}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[#0E3320] truncate">{art.titleEn}</p>
                  <p className="text-[11px] text-[#5C8261]">{art.date} · {art.readTime} read</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={e => { e.stopPropagation(); setData(p => ({ ...p, articles: p.articles.filter(x => x.id !== art.id) })); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                  {expanded[art.id] ? <ChevronUp className="w-4 h-4 text-[#9B8265]" /> : <ChevronDown className="w-4 h-4 text-[#9B8265]" />}
                </div>
              </div>
              {expanded[art.id] && (
                <div className="px-5 pb-5 pt-2 border-t border-[#DDD1BE] space-y-4">
                  <ImageUpload label="Cover Image" value={art.image} onChange={v => { const arr = [...data.articles]; arr[ari] = { ...arr[ari], image: v }; setData(p => ({ ...p, articles: arr })); }} folder="homepage/articles" hint="Landscape cover photo" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Title" value={art.titleEn} onChange={v => { const arr = [...data.articles]; arr[ari] = { ...arr[ari], titleEn: v }; setData(p => ({ ...p, articles: arr })); }} span />
                    <Field label="Date" value={art.date} onChange={v => { const arr = [...data.articles]; arr[ari] = { ...arr[ari], date: v }; setData(p => ({ ...p, articles: arr })); }} />
                    <Field label="Read Time" value={art.readTime} onChange={v => { const arr = [...data.articles]; arr[ari] = { ...arr[ari], readTime: v }; setData(p => ({ ...p, articles: arr })); }} hint='e.g. "5 min"' />
                    <Field label="Link URL" value={art.link} onChange={v => { const arr = [...data.articles]; arr[ari] = { ...arr[ari], link: v }; setData(p => ({ ...p, articles: arr })); }} hint="Article page URL or #" span />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {tab === "cta" && (
        <SectionCard title="CTA Banner" subtitle="The full-width call-to-action section near the bottom of the home page.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Hindi Headline" value={data.cta.headlineHi} onChange={v => set("cta.headlineHi", v)} span />
            <Field label="English Headline" value={data.cta.headlineEn} onChange={v => set("cta.headlineEn", v)} span />
            <Field label="Primary Button Text" value={data.cta.btn1Text} onChange={v => set("cta.btn1Text", v)} />
            <Field label="Secondary Button Text" value={data.cta.btn2Text} onChange={v => set("cta.btn2Text", v)} />
          </div>
        </SectionCard>
      )}

      {/* ══════════════════════════════════════════════ */}
      {tab === "faq" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-white px-5 py-3.5 rounded-2xl border border-[#DDD1BE] shadow-sm">
            <h3 className="text-sm font-bold text-[#0E3320]">FAQ ({data.faq.length} questions)</h3>
            <button onClick={() => {
              const nf = { id: uid(), q: "New Question?", a: "Answer goes here." };
              setData(p => ({ ...p, faq: [...p.faq, nf] }));
              setExpanded(e => ({ ...e, [nf.id]: true }));
              setScrollToId(nf.id);
            }} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0E3320] text-white text-xs font-bold rounded-xl hover:bg-[#15482D] transition-all">
              <Plus className="w-3.5 h-3.5" /> Add Question
            </button>
          </div>
          {data.faq.map((item, fi) => (
            <div key={item.id} id={`item-${item.id}`} className="bg-white rounded-2xl border border-[#DDD1BE] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3.5 cursor-pointer hover:bg-[#FAF8F5] transition-colors" onClick={() => toggle(item.id)}>
                <p className="text-xs font-semibold text-[#0E3320] truncate flex-1 mr-4">{item.q}</p>
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={e => { e.stopPropagation(); setData(p => ({ ...p, faq: p.faq.filter(x => x.id !== item.id) })); }} className="p-1.5 text-red-400 hover:bg-red-50 rounded-lg"><Trash2 className="w-3.5 h-3.5" /></button>
                  {expanded[item.id] ? <ChevronUp className="w-4 h-4 text-[#9B8265]" /> : <ChevronDown className="w-4 h-4 text-[#9B8265]" />}
                </div>
              </div>
              {expanded[item.id] && (
                <div className="px-5 pb-5 pt-2 border-t border-[#DDD1BE] space-y-3">
                  <Field label="Question" value={item.q} onChange={v => { const a = [...data.faq]; a[fi] = { ...a[fi], q: v }; setData(p => ({ ...p, faq: a })); }} />
                  <Field label="Answer" value={item.a} onChange={v => { const a = [...data.faq]; a[fi] = { ...a[fi], a: v }; setData(p => ({ ...p, faq: a })); }} rows={4} />
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════ */}
      {tab === "visibility" && (
        <SectionCard title="Section Visibility" subtitle="Toggle which sections appear on the public home page.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {Object.entries(data.sections).map(([key, enabled]) => (
              <div key={key} className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${enabled ? "border-emerald-200 bg-emerald-50/50" : "border-[#DDD1BE] bg-[#FAF8F5]"}`}>
                <div className="flex items-center gap-2.5 min-w-0 flex-1 mr-3">
                  {enabled ? <Eye className="w-4 h-4 text-emerald-600 shrink-0" /> : <EyeOff className="w-4 h-4 text-[#9B8265] shrink-0" />}
                  <span className="text-xs font-semibold text-[#0E3320] truncate">{SECTION_LABELS[key] || key}</span>
                </div>
                {/* Toggle switch — fixed 44×24px so it never stretches */}
                <button
                  onClick={() => set(`sections.${key}`, !enabled)}
                  style={{ width: 44, height: 24, minWidth: 44, flexShrink: 0 }}
                  className={`relative rounded-full transition-colors duration-200 focus:outline-none ${enabled ? "bg-[#0E3320]" : "bg-[#D5C9B5]"}`}
                >
                  <span
                    style={{
                      position: "absolute",
                      top: 3,
                      left: enabled ? 23 : 3,
                      width: 18,
                      height: 18,
                      borderRadius: "50%",
                      background: "white",
                      boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
                      transition: "left 0.2s",
                    }}
                  />
                </button>
              </div>
            ))}
          </div>
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex gap-2.5 text-xs text-amber-800">
            <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
            Hidden sections are removed from the page entirely. Hero section should always stay visible.
          </div>
        </SectionCard>
      )}

      {/* ── Bottom Save ── */}
      <div className="flex justify-end pt-2 pb-4">
        <button onClick={save} disabled={saving}
          className="px-6 py-2.5 text-xs font-bold text-white bg-[#0E3320] hover:bg-[#15482D] rounded-xl shadow-md flex items-center gap-2 disabled:opacity-60 transition-all">
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 text-[#C59B3F]" />}
          Save All Changes
        </button>
      </div>
    </div>
  );
}
