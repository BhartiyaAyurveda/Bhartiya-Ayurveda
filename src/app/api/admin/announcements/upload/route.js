import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { getImageKit } from "@/lib/imagekit";

export const dynamic = "force-dynamic";

const MAX_BYTES = 5 * 1024 * 1024; // 5 MB

function safeFileName(original) {
  const ext = original.match(/\.(pdf|jpg|jpeg|png|webp)$/i)?.[1]?.toLowerCase() || "pdf";
  const base = original
    .replace(/\.[^.]+$/, "")
    .replace(/[^A-Za-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
  return `${base || "notice"}.${ext}`;
}

const ALLOWED_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png", "image/webp"];

export async function POST(request) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let formData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  if (!ALLOWED_TYPES.includes(file.type)) return NextResponse.json({ error: "Only PDF or image files allowed" }, { status: 400 });
  if (file.size > MAX_BYTES) return NextResponse.json({ error: "File must be 5 MB or smaller" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());

  // Validate PDF signature
  if (file.type === "application/pdf" && buffer.subarray(0, 5).toString("latin1") !== "%PDF-") {
    return NextResponse.json({ error: "File is not a valid PDF" }, { status: 400 });
  }

  try {
    const ik = getImageKit();
    const res = await ik.upload({
      file: buffer,
      fileName: safeFileName(file.name),
      folder: "/announcements",
      useUniqueFileName: true,
    });
    return NextResponse.json({ ok: true, url: res.url, fileId: res.fileId, originalName: file.name }, { status: 201 });
  } catch (err) {
    console.error("Announcement upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
