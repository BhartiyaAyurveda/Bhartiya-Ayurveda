"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminIndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/super-admin/login");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#071F13] flex items-center justify-center text-white p-4">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#C59B3F] border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-medium text-[#DDD1BE]">Redirecting to Super Admin Console...</p>
      </div>
    </div>
  );
}
