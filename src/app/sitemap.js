const BASE = "https://www.bayapcp.com";

export default function sitemap() {
  const now = new Date().toISOString();

  const staticRoutes = [
    { url: "/", priority: 1.0, changeFrequency: "weekly" },
    { url: "/about", priority: 0.8, changeFrequency: "monthly" },
    { url: "/courses", priority: 0.9, changeFrequency: "weekly" },
    { url: "/academics", priority: 0.8, changeFrequency: "monthly" },
    { url: "/admissions/registration-form", priority: 0.9, changeFrequency: "weekly" },
    { url: "/affiliated-institutes", priority: 0.7, changeFrequency: "monthly" },
    { url: "/gallery", priority: 0.6, changeFrequency: "monthly" },
    { url: "/contact", priority: 0.7, changeFrequency: "yearly" },
    { url: "/certificate-verification", priority: 0.8, changeFrequency: "monthly" },
    { url: "/students/login", priority: 0.5, changeFrequency: "yearly" },
    { url: "/announcements", priority: 0.8, changeFrequency: "daily" },
    { url: "/students/results", priority: 0.8, changeFrequency: "weekly" },
    { url: "/students/admit-card", priority: 0.8, changeFrequency: "weekly" },
  ];

  return staticRoutes.map(({ url, priority, changeFrequency }) => ({
    url: `${BASE}${url}`,
    lastModified: now,
    changeFrequency,
    priority,
  }));
}
