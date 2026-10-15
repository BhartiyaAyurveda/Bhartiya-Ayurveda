import { NextResponse } from "next/server";
import { requireCollege } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";

function extractSessionDigits(academicSession) {
  if (!academicSession) return "2627";
  const matches = academicSession.match(/\d{4}/g);
  if (matches && matches.length >= 2) {
    return matches[0].slice(-2) + matches[1].slice(-2);
  } else if (matches && matches.length === 1) {
    const y1 = parseInt(matches[0].slice(-2), 10);
    const y2 = String((y1 + 1) % 100).padStart(2, "0");
    return `${matches[0].slice(-2)}${y2}`;
  }
  return "2627";
}

async function generateEnrollmentNo(college_id, academic_session) {
  const { data: college } = await supabaseAdmin
    .from("colleges")
    .select("college_code")
    .eq("id", college_id)
    .maybeSingle();

  const rawCode = college?.college_code ? String(college.college_code).trim() : "01";
  const collegeCode = rawCode.padStart(2, "0").slice(-2);
  const sessDigits = extractSessionDigits(academic_session);
  const prefix = `BAI${collegeCode}${sessDigits}`;

  const { data: latest } = await supabaseAdmin
    .from("student_registrations")
    .select("enrollment_no")
    .like("enrollment_no", `${prefix}%`)
    .order("enrollment_no", { ascending: false })
    .limit(1);

  let nextSeq = 1;
  if (latest && latest.length > 0 && latest[0].enrollment_no) {
    const lastSeqStr = latest[0].enrollment_no.slice(prefix.length);
    const parsed = parseInt(lastSeqStr, 10);
    if (!isNaN(parsed)) nextSeq = parsed + 1;
  }

  return `${prefix}${String(nextSeq).padStart(3, "0")}`;
}

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

    const enrollment_no = await generateEnrollmentNo(session.college_id, body.academic_session);

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
