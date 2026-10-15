import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";

export async function GET(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, admin: session });
}
