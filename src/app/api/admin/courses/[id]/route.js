import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

export async function PATCH(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const allowed = ["course_name", "course_name_hindi", "course_code", "duration_label", "sort_order", "category", "eligibility", "career_scope"];
  const updates = {};
  for (const key of allowed) { if (key in body) updates[key] = body[key]; }

  const { data: current, error: curErr } = await supabaseAdmin
    .from("courses").select("course_name").eq("id", params.id).maybeSingle();
  if (curErr) return NextResponse.json({ error: curErr.message }, { status: 500 });
  if (!current) return NextResponse.json({ error: "Course not found" }, { status: 404 });

  // tidy the name (no leading / trailing / doubled spaces) and refuse an empty one
  if ("course_name" in updates) {
    updates.course_name = String(updates.course_name ?? "").replace(/\s+/g, " ").trim();
    if (!updates.course_name) return NextResponse.json({ error: "Course name cannot be empty." }, { status: 400 });
  }
  const renamed = "course_name" in updates && updates.course_name !== current.course_name;

  if (renamed) {
    const { data: clash } = await supabaseAdmin
      .from("courses").select("id").ilike("course_name", updates.course_name.replace(/[%_]/g, (c) => "\\" + c)).neq("id", params.id).limit(1);
    if (clash && clash.length > 0) {
      return NextResponse.json({ error: "Is naam ka course pehle se maujood hai. Doosra naam chuno." }, { status: 409 });
    }
  }

  const { data, error } = await supabaseAdmin
    .from("courses").update(updates).eq("id", params.id).select().single();

  if (error) {
    if (error.code === "23505") return NextResponse.json({ error: "Is naam ya code ka course pehle se maujood hai." }, { status: 409 });
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // subjects (and so admit cards / results / datesheets) find the course by its name: move them along
  let subjectsUpdated = 0;
  if (renamed) {
    const { data: moved, error: subjErr } = await supabaseAdmin
      .from("course_subjects").update({ course_name: updates.course_name }).eq("course_name", current.course_name).select("id");
    if (subjErr) {
      // undo the rename so the course and its subjects never get out of step
      await supabaseAdmin.from("courses").update({ course_name: current.course_name }).eq("id", params.id);
      return NextResponse.json({ error: "Naam nahi badla: subjects update nahi ho paye (" + subjErr.message + ")." }, { status: 500 });
    }
    subjectsUpdated = moved?.length || 0;
  }

  return NextResponse.json({ ok: true, data, renamed, subjects_updated: subjectsUpdated });
}

export async function DELETE(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { error } = await supabaseAdmin.from("courses").delete().eq("id", params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
