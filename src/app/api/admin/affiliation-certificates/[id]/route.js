import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { supabaseAdmin } from "@/lib/supabase";
import {
  parseAffilCertNo,
  parsePersonName,
  parseDateOnly,
  AFFIL_PREFIX,
  AFFIL_SUFFIX_MAX,
  PERSON_NAME_MAX,
} from "@/lib/cert-number";

const MIGRATION_HINT =
  "Database migration pending: run migrations/add_affiliation_certificate_columns.sql in the Supabase SQL Editor.";

// affiliated_institutes.id is an integer
const validId = (id) => /^\d{1,10}$/.test(String(id));

/**
 * Issue (or change the number of) the Affiliation Certificate for one institute.
 * Optionally also sets the Director / Principal name (stored in contact_person) and the affiliation
 * date; omit a field to leave it unchanged, send "" to clear it.
 */
export async function PUT(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;
    if (!validId(id)) return NextResponse.json({ error: "Invalid institute id" }, { status: 400 });

    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const fields = body ?? {};
    // cert_no is the part after the fixed prefix; the server always adds the prefix itself.
    const certNo = parseAffilCertNo(fields.cert_no);
    if (!certNo) {
      return NextResponse.json(
        { error: `Enter 1–${AFFIL_SUFFIX_MAX} characters after ${AFFIL_PREFIX} using letters, digits, spaces and / _ . - only.` },
        { status: 400 }
      );
    }

    const hasDirector = "director_name" in fields;
    const directorName = hasDirector ? parsePersonName(fields.director_name) : null;
    if (hasDirector && directorName === null) {
      return NextResponse.json(
        { error: `Director / Principal name must start with a letter and be up to ${PERSON_NAME_MAX} characters (letters, spaces and . , ' ( ) / - only).` },
        { status: 400 }
      );
    }

    const hasSince = "affiliated_since" in fields;
    const since = hasSince ? parseDateOnly(fields.affiliated_since) : null;
    if (hasSince && since === null) {
      return NextResponse.json({ error: "Affiliation date is not a valid date." }, { status: 400 });
    }

    const { data: inst, error: fetchError } = await supabaseAdmin
      .from("affiliated_institutes")
      .select("affiliation_cert_issued_at")
      .eq("id", id)
      .maybeSingle();

    if (fetchError) {
      console.error("Affiliation certificate lookup error:", fetchError.message);
      const missing = /affiliation_cert|contact_person|affiliated_since/i.test(fetchError.message);
      return NextResponse.json({ error: missing ? MIGRATION_HINT : "Failed to load institute" }, { status: 500 });
    }
    if (!inst) return NextResponse.json({ error: "Institute not found" }, { status: 404 });

    // Keep the original issue date if the number is edited later.
    const issuedAt = inst.affiliation_cert_issued_at ?? new Date().toISOString();

    const updates = { affiliation_cert_no: certNo, affiliation_cert_issued_at: issuedAt };
    if (hasDirector) updates.contact_person = directorName || null;
    if (hasSince) updates.affiliated_since = since || null;

    const { error: updateError } = await supabaseAdmin.from("affiliated_institutes").update(updates).eq("id", id);

    if (updateError) {
      if (updateError.code === "23505") {
        const { data: owner } = await supabaseAdmin
          .from("affiliated_institutes")
          .select("name")
          .ilike("affiliation_cert_no", certNo)
          .neq("id", id)
          .maybeSingle();

        const who = owner ? ` It belongs to ${owner.name}.` : "";
        return NextResponse.json({ error: `This number is already used for another institute.${who}` }, { status: 409 });
      }
      console.error("Affiliation certificate update error:", updateError.message);
      return NextResponse.json({ error: "Failed to save the number" }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      cert_no: certNo,
      issued_at: issuedAt,
      ...(hasDirector ? { director_name: directorName || null } : {}),
      ...(hasSince ? { affiliated_since: since || null } : {}),
    });
  } catch (err) {
    console.error("Affiliation certificate PUT error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

/** Withdraw the certificate: it can no longer be printed until re-issued. */
export async function DELETE(request, { params }) {
  const session = await requireAdmin(request);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id } = params;
    if (!validId(id)) return NextResponse.json({ error: "Invalid institute id" }, { status: 400 });

    const { error } = await supabaseAdmin
      .from("affiliated_institutes")
      .update({ affiliation_cert_no: null, affiliation_cert_issued_at: null })
      .eq("id", id);

    if (error) {
      console.error("Affiliation certificate revoke error:", error.message);
      const missing = /affiliation_cert/i.test(error.message);
      return NextResponse.json({ error: missing ? MIGRATION_HINT : "Failed to withdraw" }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Affiliation certificate DELETE error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
