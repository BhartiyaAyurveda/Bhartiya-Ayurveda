import "./globals.css";

export const metadata = {
  title: "Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad | भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद् — Ancient Wisdom for a Better Tomorrow",
  description: "Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad (भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्) — experience authentic classical Ayurveda, pure Ashtanga Yoga, and 5-element Naturopathy retreats nestled in Rishikesh, Uttarakhand.",
  keywords: [
    "Ayurveda",
    "Yoga",
    "Naturopathy",
    "Prakritik Chikitsa",
    "Rishikesh Retreat",
    "Panchakarma",
    "Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad",
    "भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्",
    "Bhartiya Ayurveda Trust",
  ],
  applicationName: "Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad",
  authors: [{ name: "Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad" }],
  icons: {
    icon: "/logo.png",
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad | भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्",
    description: "Experience authentic classical Ayurveda, pure Ashtanga Yoga, and 5-element Naturopathy retreats nestled in Rishikesh, Uttarakhand.",
    siteName: "Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad",
    locale: "hi_IN",
    type: "website",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="hi" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="bg-[#FAF8F5] text-[#0E3320] font-sans antialiased selection:bg-[#C59B3F] selection:text-white">
        {children}
      </body>
    </html>
  );
}
