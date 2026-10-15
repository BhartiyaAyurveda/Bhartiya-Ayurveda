import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getAdmitCardData } from "@/lib/admit-card-data";

export async function GET(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data, error } = await getAdmitCardData(params.id);
  if (error) return NextResponse.json({ error }, { status: 400 });
  return NextResponse.json({ ok: true, data });
}
