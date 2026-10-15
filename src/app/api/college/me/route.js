import { NextResponse } from "next/server";
import { requireCollege } from "@/lib/auth";

export async function GET(request) {
  const session = await requireCollege(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ ok: true, college: session });
}
