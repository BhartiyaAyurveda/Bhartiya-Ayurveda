import { NextResponse } from "next/server";

const ADMIN_COOKIE = "admin_session";

// Paths that always bypass maintenance mode
const BYPASS_PATTERNS = [
  /^\/super-admin/,
  /^\/college/,
  /^\/api\/admin/,
  /^\/api\/college/,
  /^\/api\/public\/maintenance-status/,
  /^\/maintenance/,
  /^\/_next/,
  /^\/favicon/,
  /^\/logo/,
  /^\/images/,
];

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Always allow bypass paths
  if (BYPASS_PATTERNS.some((p) => p.test(pathname))) {
    return NextResponse.next();
  }

  // If user has a valid admin cookie, always let them through
  const adminCookie = request.cookies.get(ADMIN_COOKIE)?.value;
  if (adminCookie) return NextResponse.next();

  // Check maintenance mode directly via Supabase REST API (no self-fetch loop)
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    const res = await fetch(
      `${supabaseUrl}/rest/v1/system_settings?key=eq.maintenance_mode&select=value`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
        },
        // Cache for 30s to avoid hitting Supabase on every request
        next: { revalidate: 30 },
      }
    );

    if (res.ok) {
      const data = await res.json();
      const on = data?.[0]?.value === "true";
      if (on) {
        return NextResponse.redirect(new URL("/maintenance", request.url));
      }
    }
  } catch {
    // If Supabase check fails, let traffic through rather than blocking everyone
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
