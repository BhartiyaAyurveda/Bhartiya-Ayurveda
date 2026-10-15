"use client";

import { createContext, useContext, useEffect, useState } from "react";

const FALLBACK_CONTACT = {
  primaryPhone:        "+91 98765 43210",
  secondaryPhone:      "",
  whatsappNumber:      "+91 98765 43210",
  primaryEmail:        "contact@bhartiyaayurveda.org",
  admissionsEmail:     "admissions@bhartiyaayurveda.org",
  verificationEmail:   "verify@bhartiyaayurveda.org",
  addressLine1:        "",
  city:                "Rishikesh",
  state:               "Uttarakhand",
  pincode:             "",
  country:             "India",
  workingHoursWeekday: "Monday – Saturday: 10:00 AM – 5:00 PM",
  workingHoursSunday:  "Closed on Sundays and public holidays",
};

const SiteSettingsContext = createContext({
  contact:  FALLBACK_CONTACT,
  socials:  [],
  homepage: null,
  loading:  true,
});

export function SiteSettingsProvider({ children }) {
  const [contact,  setContact]  = useState(FALLBACK_CONTACT);
  const [socials,  setSocials]  = useState([]);
  const [homepage, setHomepage] = useState(null);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    fetch("/api/public/site-settings")
      .then(r => r.json())
      .then(data => {
        if (data.ok) {
          if (data.contact)  setContact({ ...FALLBACK_CONTACT, ...data.contact });
          if (Array.isArray(data.socials)) setSocials(data.socials);
          if (data.homepage) setHomepage(data.homepage);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ contact, socials, homepage, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}
