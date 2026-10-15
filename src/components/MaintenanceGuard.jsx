"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

const BYPASS_PREFIXES = ["/super-admin", "/maintenance", "/api"];

export default function MaintenanceGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Skip check for admin and maintenance pages
    if (BYPASS_PREFIXES.some(p => pathname.startsWith(p))) {
      setChecked(true);
      return;
    }

    fetch("/api/public/maintenance-status")
      .then(r => r.json())
      .then(data => {
        if (data.maintenance) {
          router.replace("/maintenance");
        } else {
          setChecked(true);
        }
      })
      .catch(() => setChecked(true)); // fail open
  }, [pathname, router]);

  if (!checked && !BYPASS_PREFIXES.some(p => pathname.startsWith(p))) {
    return null; // brief blank while checking
  }

  return children;
}
