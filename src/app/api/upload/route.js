import { NextResponse } from "next/server";
import { getImageKit } from "@/lib/imagekit";

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = formData.get("folder") || "registrations";

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const maxBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxBytes) {
      return NextResponse.json({ error: "File too large (max 5MB)" }, { status: 400 });
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imagekit = getImageKit();
    const result = await imagekit.upload({
      file: buffer,
      fileName: `${Date.now()}-${file.name}`,
      folder: `/bhartiya-ayurveda/${folder}`,
    });

    return NextResponse.json({ url: result.url, fileId: result.fileId });
  } catch (err) {
    console.error("Upload error:", err.message);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
