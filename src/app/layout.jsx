import "./globals.css";

export const metadata = {
  title: "Bhartiya Ayurveda | भारतीय आयुर्वेद संस्थान — Ancient Wisdom for a Better Tomorrow",
  description: "Experience authentic classical Ayurveda, pure Ashtanga Yoga, and 5-element Naturopathy retreats nestled in Rishikesh, Uttarakhand.",
  keywords: [
    "Ayurveda",
    "Yoga",
    "Naturopathy",
    "Prakritik Chikitsa",
    "Rishikesh Retreat",
    "Panchakarma",
    "Bhartiya Ayurveda",
  ],
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
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
