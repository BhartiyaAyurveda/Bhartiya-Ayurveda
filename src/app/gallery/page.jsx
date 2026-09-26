"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  X, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  Filter, 
  Sparkles, 
  Flower2, 
  Image as ImageIcon,
  ArrowRight,
  Download,
  Share2
} from "lucide-react";
import TopBar from "@/components/layout/TopBar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ConsultationModal from "@/components/ui/ConsultationModal";

export default function GalleryPage() {
  const [isConsultationOpen, setIsConsultationOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const galleryItems = [
    {
      id: 1,
      src: "/images/hero/hero-meditation.jpg",
      titleHi: "हिमालय गंगा तट पर योग साधना",
      titleEn: "Meditation by Sacred Himalayan Waters",
      category: "Yoga & Meditation",
      desc: "Daily sunrise Dhyana and Ashtanga practice along the serene banks of Mother Ganga in Rishikesh.",
    },
    {
      id: 2,
      src: "/images/ayurveda/herbs-mortar.jpg",
      titleHi: "प्राचीन जड़ी-बूटियाँ एवं खरल",
      titleEn: "Authentic Ayurvedic Herbs & Mortar",
      category: "Ayurveda",
      desc: "Traditional preparation of fresh medicinal herbs using classical stone mortar and pestle.",
    },
    {
      id: 4,
      src: "/images/naturopathy/air-waterfall.jpg",
      titleHi: "शुद्ध वायु एवं जलप्रपात चिकित्सा",
      titleEn: "Fresh Air & Waterfall Hydrotherapy",
      category: "Naturopathy",
      desc: "Recharging the body's pranic vitality through natural waterfall mist and negative ion immersion.",
    },
    {
      id: 5,
      src: "/images/naturopathy/sun-therapy.jpg",
      titleHi: "सूर्य किरण चिकित्सा (Heliotherapy)",
      titleEn: "Sun Bath & Solar Rays Healing",
      category: "Naturopathy",
      desc: "Harnessing the therapeutic spectrum of morning sunlight to stimulate metabolism and vitamin synthesis.",
    },
    {
      id: 6,
      src: "/images/naturopathy/water-therapy.jpg",
      titleHi: "पावन जल स्नान एवं हाइड्रोथेरेपी",
      titleEn: "Hydrotherapy & Pure Water Cure",
      category: "Naturopathy",
      desc: "Controlled thermal water baths that enhance lymphatic drainage and systemic circulation.",
    },
    {
      id: 7,
      src: "/images/naturopathy/pure-food.jpg",
      titleHi: "सात्विक आहार एवं पोषण",
      titleEn: "Sattvic Nutrition & Organic Feast",
      category: "Naturopathy",
      desc: "Fresh, farm-harvested vegetarian cuisine cooked with gentle spices according to Ayurvedic principles.",
    },
    {
      id: 8,
      src: "/images/naturopathy/mud-therapy.jpg",
      titleHi: "प्राकृतिक मिट्टी लेप चिकित्सा",
      titleEn: "Healing Earth & Mineral Mud Therapy",
      category: "Naturopathy",
      desc: "Antitoxic mud packs rich in natural minerals that cool the abdomen, soothe skin, and extract deep heat.",
    },
    {
      id: 9,
      src: "/images/naturopathy/herbal-care.jpg",
      titleHi: "औषधीय वाटिका एवं देखभाल",
      titleEn: "Botanical Nursery & Herbal Care",
      category: "Ayurveda",
      desc: "Over 100 indigenous medicinal plant species nurtured without chemical fertilizers.",
    },
    {
      id: 10,
      src: "/images/programs/retreat-7days.jpg",
      titleHi: "7-दिवसीय कायाकल्प रिट्रीट",
      titleEn: "7-Day Rejuvenation & Detox Retreat",
      category: "Retreats & Ashram",
      desc: "Intensive Panchakarma detox, herbal steam baths, and revitalizing Abhyanga massages.",
    },
    {
      id: 11,
      src: "/images/programs/yoga-14days.jpg",
      titleHi: "14-दिवसीय योग एवं ध्यान बंधन",
      titleEn: "14-Day Yoga & Inner Peace Immersion",
      category: "Retreats & Ashram",
      desc: "Deepening your spiritual consciousness with daily Satsangs, sacred chanting, and Pranayama.",
    },
    {
      id: 12,
      src: "/images/programs/naturopathy-21days.jpg",
      titleHi: "21-दिवसीय संपूर्ण प्राकृतिक चिकित्सा",
      titleEn: "21-Day Naturopathy Detox Program",
      category: "Retreats & Ashram",
      desc: "Transformative 5-element cleansing regimen restoring complete balance to chronic ailments.",
    },
    {
      id: 13,
      src: "/images/programs/wellness-30days.jpg",
      titleHi: "30-दिवसीय समग्र स्वास्थ्य साधना",
      titleEn: "30-Day Holistic Wellness Experience",
      category: "Retreats & Ashram",
      desc: "Comprehensive mind-body reset combining Ayurveda consultations, daily yoga, and lifestyle coaching.",
    },
    {
      id: 14,
      src: "/images/ayurveda/sage-meditation.jpg",
      titleHi: "ऋषि मुनि ध्यान एवं वैदिक कला",
      titleEn: "Vedic Sage Wisdom & Contemplation",
      category: "Ayurveda",
      desc: "Preserving the lineage of ancient Ayurvedic seers who first codified the secrets of healing.",
    },
    {
      id: 15,
      src: "/images/cta/cta-landscape.jpg",
      titleHi: "ऋषिकेश हिमालय मनोरम दृश्य",
      titleEn: "Majestic Himalayan Foothills Tapovan",
      category: "Retreats & Ashram",
      desc: "The pristine mountain atmosphere providing natural tranquility and unpolluted air.",
    },
    {
      id: 16,
      src: "/images/acharyas/dr-anjali.jpg",
      titleHi: "डॉ. अंजलि शर्मा — नाड़ी परीक्षण",
      titleEn: "Dr. Anjali Sharma — Pulse Diagnosis",
      category: "Acharyas",
      desc: "Head Ayurveda Physician analyzing subtle doshic rhythms through classical Nadi Pariksha.",
    },
    {
      id: 17,
      src: "/images/acharyas/yogi-rahul.jpg",
      titleHi: "योगी राहुल देव — योग गुरु",
      titleEn: "Yogi Rahul Dev — Yoga Master",
      category: "Acharyas",
      desc: "Guiding students through sacred bandhas, kriyas, and mindful breath awareness.",
    },
    {
      id: 18,
      src: "/images/acharyas/dr-meera.jpg",
      titleHi: "डॉ. मीरा अय्यर — प्राकृतिक चिकित्सक",
      titleEn: "Dr. Meera Iyer — Naturopathy Specialist",
      category: "Acharyas",
      desc: "Designing personalized fasting, therapeutic diets, and hydrotherapy cycles.",
    },
    {
      id: 19,
      src: "/images/acharyas/acharya-devendra.jpg",
      titleHi: "आचार्य देवेंद्र — वैदिक दर्शन",
      titleEn: "Acharya Devendra — Vedic Philosophy",
      category: "Acharyas",
      desc: "Lecturing on the Charaka Samhita and philosophical foundations of holistic health.",
    },
    {
      id: 20,
      src: "/images/articles/article-1.jpg",
      titleHi: "दैनिक आयुर्वेदिक दिनचर्या (Dinacharya)",
      titleEn: "Daily Ayurvedic Dinacharya Rituals",
      category: "Ayurveda",
      desc: "Morning tongue scraping, oil pulling, and warm herbal water to balance digestive fire (Agni).",
    },
    {
      id: 21,
      src: "/images/articles/article-2.jpg",
      titleHi: "मानसिक शांति एवं योग साधना",
      titleEn: "Mental Calm & Yogic Mindfulness",
      category: "Yoga & Meditation",
      desc: "Overcoming modern stress, insomnia, and anxiety through restorative yoga asanas.",
    },
    {
      id: 22,
      src: "/images/decor/leaves-dark.jpg",
      titleHi: "औषधीय वनस्पति धरोहर",
      titleEn: "Botanical Canopy & Sacred Flora",
      category: "Ayurveda",
      desc: "Pure biodiversity thriving in the lush gardens of Bhartiya Ayurveda sanctuary.",
    },
  ];

  const categories = [
    "All",
    "Ayurveda",
    "Yoga & Meditation",
    "Naturopathy",
    "Retreats & Ashram",
    "Acharyas",
  ];

  // Filter images based on category
  const filteredImages = useMemo(() => {
    if (activeCategory === "All") return galleryItems;
    return galleryItems.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // Open modal for clicked image
  const openModal = (index) => {
    setSelectedImageIndex(index);
  };

  const closeModal = () => {
    setSelectedImageIndex(null);
  };

  const showNext = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev + 1) % filteredImages.length);
  };

  const showPrev = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedImageIndex === null) return;
      if (e.key === "Escape") closeModal();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedImageIndex, filteredImages]);

  // Current active modal image
  const currentImage = selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null;

  return (
    <main className="min-h-screen bg-[#FAF8F5] text-[#0E3320] font-sans selection:bg-[#C59B3F] selection:text-white">
      {/* 1. Top Bar & Navbar */}
      <TopBar />
      <Navbar onOpenConsultation={() => setIsConsultationOpen(true)} />

      {/* 2. Hero Section: Clean 3-Row Layout */}
      <section className="relative bg-[#071F13] text-white py-20 md:py-24 px-4 md:px-8 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero/hero-meditation.jpg"
            alt="Gallery Sanctuary Banner"
            className="w-full h-full object-cover opacity-60 object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#071F13] via-[#0E3320]/65 to-[#071F13]/70"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-10 text-center space-y-5">
          {/* Row 1: Breadcrumb */}
          <nav aria-label="Breadcrumb" className="flex items-center justify-center gap-2 text-xs sm:text-sm text-[#C59B3F] font-semibold tracking-wider uppercase">
            <Link href="/" className="hover:underline hover:text-white transition-colors">Home</Link>
            <span className="text-[#8C671D]">/</span>
            <span className="text-white">Gallery</span>
          </nav>

          {/* Row 2: Vedic Tag Pill Badge */}
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-[#C59B3F]/40 text-[#E4BF64] text-xs sm:text-sm font-semibold shadow-sm">
              <span>🌿</span>
              <span>आश्रम जीवन • प्राकृतिक चिकित्सा • पावन स्मृतियाँ</span>
            </div>
          </div>

          {/* Row 3: Main Title */}
          <div className="space-y-2 pt-1">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-devanagari font-bold text-white leading-tight">
              चित्र दीर्घा
            </h1>
            <div className="font-sans text-xl sm:text-2xl lg:text-3xl text-[#C59B3F] font-bold">
              Photo Gallery & Visual Sanctuary
            </div>
          </div>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-[#CBD8CB] leading-relaxed pt-1">
            A visual glimpse into classical Ayurvedic treatments, sunrise yoga on the Ganga, Five-Element naturopathy, and blissful ashram retreats.
          </p>

          {/* Stats Row */}
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-5 pt-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <ImageIcon className="w-4 h-4 text-[#C59B3F]" />
              <span className="text-xs sm:text-sm font-semibold text-[#EBE2D4]">{galleryItems.length}+ Curated Moments</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Sparkles className="w-4 h-4 text-[#C59B3F]" />
              <span className="text-xs sm:text-sm font-semibold text-[#EBE2D4]">{categories.length - 1} Living Traditions</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
              <Flower2 className="w-4 h-4 text-[#C59B3F]" />
              <span className="text-xs sm:text-sm font-semibold text-[#EBE2D4]">Rishikesh, Himalayas</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Filter Categories Tabs */}
      <section className="py-3 sm:py-5 px-3 sm:px-6 md:px-8 bg-[#F5F0E8] border-b border-[#E6DDCE] relative md:sticky md:top-[73px] z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center">
          <div className="flex items-center justify-start md:justify-center gap-2 overflow-x-auto no-scrollbar w-full py-1">
            <span className="text-xs font-bold text-[#8C671D] uppercase flex items-center gap-1 mr-1 hidden sm:inline-flex shrink-0">
              <Filter className="w-3.5 h-3.5" /> Category:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  setSelectedImageIndex(null);
                }}
                className={`px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  activeCategory === cat
                    ? "bg-gradient-to-r from-[#0E3320] to-[#1A5C38] text-white shadow-md shadow-[#0E3320]/20 scale-105"
                    : "bg-white text-[#0E3320] border border-[#D5C7B7] hover:border-[#C59B3F] hover:text-[#8C671D]"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Gallery Grid */}
      <section className="py-10 sm:py-16 md:py-20 px-3 sm:px-6 md:px-8 border-b border-[#EBE2D4]">
        <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
          
          <div className="flex items-center justify-between">
            <p className="text-xs sm:text-sm font-semibold text-[#52725D]">
              Showing <strong>{filteredImages.length}</strong> photos in <strong>{activeCategory}</strong>
            </p>
            <p className="text-[11px] sm:text-xs text-[#8C671D] font-bold hidden sm:block">
              Click any photo to open full-screen view
            </p>
          </div>

          {/* Gallery Grid Layout */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
            {filteredImages.map((img, idx) => {
              return (
                <div
                  key={img.id}
                  onClick={() => openModal(idx)}
                  className="group relative bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-[#E8DFCFA] shadow-sm hover:shadow-2xl hover:-translate-y-1 hover:border-[#C59B3F]/60 transition-all duration-300 cursor-pointer"
                >
                  {/* Image Container with Hover Zoom & Icon Overlay */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-[#EAE2D3]">
                    <img
                      src={img.src}
                      alt={img.titleEn}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                    />

                    {/* Dark Gradient Overlay, always present at base for caption legibility, deepens on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-70 group-hover:opacity-95 transition-opacity duration-300" />

                    {/* Zoom Icon on Hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/95 text-[#0E3320] flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                        <ZoomIn className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2]" />
                      </div>
                    </div>

                    {/* Category Pill Tag in Top Left */}
                    <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3">
                      <span className="px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/15 backdrop-blur-md border border-white/25 text-white text-[10px] sm:text-[11px] font-bold tracking-wide uppercase">
                        {img.category}
                      </span>
                    </div>

                    {/* Caption overlaid on image bottom */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5 sm:p-4 space-y-0.5">
                      <h3 className="font-devanagari font-bold text-sm sm:text-base text-white leading-snug drop-shadow-md">
                        {img.titleHi}
                      </h3>
                      <div className="font-sans text-[11px] sm:text-xs font-semibold text-[#E4BF64] leading-tight drop-shadow-md">
                        {img.titleEn}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 5. Interactive Full-Screen Lightbox Modal */}
      {currentImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-6 animate-in fade-in duration-200"
          onClick={closeModal}
        >
          {/* Modal Container (Stops propagation so clicking image doesn't close) */}
          <div 
            className="relative max-w-5xl w-full bg-[#0A2315] border border-white/20 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[94vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header: Title, Category & Close */}
            <div className="p-3 sm:p-5 bg-[#071F13] border-b border-white/10 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 sm:gap-3 min-w-0">
                <span className="px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full bg-[#C59B3F] text-[#071F13] text-[10px] sm:text-xs font-bold uppercase tracking-wider shrink-0">
                  {currentImage.category}
                </span>
                <span className="text-xs sm:text-sm text-[#CBD8CB] font-semibold truncate">
                  Photo {selectedImageIndex + 1} of {filteredImages.length}
                </span>
              </div>

              {/* Close Button */}
              <button
                onClick={closeModal}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors shrink-0"
                aria-label="Close modal"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Middle: Full Image with Navigation Arrows */}
            <div className="relative flex-grow flex items-center justify-center bg-black/40 overflow-hidden min-h-[220px] sm:min-h-[440px] max-h-[55vh] sm:max-h-[65vh]">
              <img
                src={currentImage.src}
                alt={currentImage.titleEn}
                className="w-full h-full object-contain max-h-[55vh] sm:max-h-[65vh] select-none"
              />

              {/* Prev Button */}
              <button
                onClick={showPrev}
                className="absolute left-2 sm:left-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#0E3320] text-white flex items-center justify-center transition-all border border-white/20 shadow-lg group"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 sm:w-7 sm:h-7 group-hover:-translate-x-0.5 transition-transform" />
              </button>

              {/* Next Button */}
              <button
                onClick={showNext}
                className="absolute right-2 sm:right-5 top-1/2 -translate-y-1/2 w-9 h-9 sm:w-12 sm:h-12 rounded-full bg-black/60 hover:bg-[#0E3320] text-white flex items-center justify-center transition-all border border-white/20 shadow-lg group"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 sm:w-7 sm:h-7 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>

            {/* Bottom Caption & Action Details */}
            <div className="p-3.5 sm:p-6 bg-[#071F13] border-t border-white/10 text-white space-y-1.5 sm:space-y-2 overflow-y-auto max-h-[35vh]">
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-2">
                <h3 className="font-devanagari font-bold text-sm sm:text-lg text-white">
                  {currentImage.titleHi}
                </h3>
                <span className="font-sans font-bold text-xs sm:text-base text-[#C59B3F]">
                  {currentImage.titleEn}
                </span>
              </div>

              <p className="text-[11px] sm:text-sm text-[#CBD8CB] leading-relaxed max-w-3xl">
                {currentImage.desc}
              </p>

              <div className="pt-2 flex flex-wrap items-center justify-between gap-2 sm:gap-3 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <a
                    href={currentImage.src}
                    download
                    onClick={(e) => e.stopPropagation()}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    aria-label="Download photo"
                  >
                    <Download className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </a>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (navigator.share) {
                        navigator.share({ title: currentImage.titleEn, url: window.location.href }).catch(() => {});
                      }
                    }}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
                    aria-label="Share photo"
                  >
                    <Share2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>
                </div>

                <button
                  onClick={() => {
                    closeModal();
                    setIsConsultationOpen(true);
                  }}
                  className="w-full sm:w-auto px-5 sm:px-6 py-2 sm:py-2.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#0E3320] text-xs sm:text-sm font-bold shadow transition-colors text-center"
                >
                  Book Experience
                </button>
              </div>
            </div>

          </div>
        </div>
      )}


      {/* 6. Bottom Banner */}
      <section className="relative bg-[#071F13] text-white py-16 px-4 md:px-8 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-devanagari font-bold text-white">
            प्राकृतिक चिकित्सा का साक्षात अनुभव करें
          </h2>
          <p className="text-sm sm:text-base text-[#CBD8CB] max-w-2xl mx-auto">
            Visit our Rishikesh ashram or schedule a personalized virtual consultation with our experienced Vaidyas.
          </p>
          <div className="pt-2">
            <button
              onClick={() => setIsConsultationOpen(true)}
              className="px-8 py-3.5 rounded-full bg-[#FAF8F5] hover:bg-white text-[#0E3320] text-sm sm:text-base font-bold shadow-lg transition-all"
            >
              Book a Consultation
            </button>
          </div>
        </div>
      </section>

      {/* 7. Modals & Footer */}
      <ConsultationModal
        isOpen={isConsultationOpen}
        onClose={() => setIsConsultationOpen(false)}
      />
      <Footer />
    </main>
  );
}
