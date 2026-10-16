import { NextResponse } from "next/server";
import { requireCollege } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import { generateEnrollmentNumber } from "@/lib/enrollment-roll-utils";

export async function POST(request) {
  try {
    // Must be called from a logged-in college
    const session = await requireCollege(request);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    const required = ["candidate_name", "father_name", "dob", "course_id"];
    for (const field of required) {
      if (!body[field]) return NextResponse.json({ error: `${field} is required.` }, { status: 400 });
    }

    // Verify course exists
    const { data: course } = await supabaseAdmin
      .from("courses").select("id").eq("id", body.course_id).maybeSingle();
    if (!course) return NextResponse.json({ error: "Invalid course." }, { status: 400 });

    const { data: college } = await supabaseAdmin
      .from("colleges")
      .select("college_code")
      .eq("id", session.college_id)
      .maybeSingle();

    const enrollment_no = await generateEnrollmentNumber(
      supabaseAdmin,
      college?.college_code,
      body.academic_session,
      process.env.ORG_PREFIX || "BAI"
    );

    const insertData = {
      enrollment_no,
      // Personal
      candidate_name:      body.candidate_name,
      father_name:         body.father_name,
      mother_name:         body.mother_name    || null,
      dob:                 body.dob,
      gender:              body.gender         || null,
      category:            body.category       || null,
      aadhar_no:           body.aadhar_no      || null,
      // Contact
      phone:               body.phone          || null,
      email:               body.email          || null,
      address:             body.address        || null,
      district:            body.district       || null,
      city:                body.city           || null,
      state:               body.state          || null,
      pincode:             body.pincode        || null,
      academic_session:    body.academic_session || null,
      // Course
      course_id:           body.course_id,
      college_id:          session.college_id,
      session_label:       body.session_label  || null,
      // Education (jsonb)
      education:           body.education      || null,
      // Documents
      photo_url:           body.photo_url          || null,
      signature_url:       body.signature_url       || null,
      aadhaar_url:         body.aadhaar_url         || null,
      tenth_marksheet_url: body.tenth_marksheet_url || null,
      twelfth_marksheet_url: body.twelfth_marksheet_url || null,
      affidavit_url:       body.affidavit_url       || null,
      // Status
      status: "pending",
    };

    const { data, error } = await supabaseAdmin
      .from("student_registrations")
      .insert(insertData)
      .select("id, candidate_name, enrollment_no, created_at")
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ ok: true, data }, { status: 201 });
  } catch (err) {
    console.error("Registration error:", err.message);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
