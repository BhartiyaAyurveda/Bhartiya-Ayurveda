"use client";

import A4Fit from "@/components/print/A4Fit";
import { CERT_PLACE } from "@/lib/cert-number";

const GREEN = "#0E3320";
const GOLD = "#C59B3F";
const GOLD_DARK = "#8C671D";
const HINDI = { fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif" };

function formatDisplayDate(dateStr) {
  if (!dateStr) return "—";
  const parts = String(dateStr).trim().split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }
  return dateStr;
}

/** Small gold diamond used on the four corners of the frame. */
function Corner({ style }) {
  return (
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        width: 14,
        height: 14,
        background: GOLD,
        transform: "rotate(45deg)",
        border: `2px solid ${GREEN}`,
        ...style,
      }}
    />
  );
}

/** One line of the details table: Hindi label with the English label underneath. */
function Row({ hi, en, children, alt, mono }) {
  return (
    <tr style={{ background: alt ? "rgba(197,155,63,0.06)" : "transparent" }}>
      <td style={{ width: 232, padding: "3px 12px", borderBottom: "1px solid #E8DFCC", borderRight: "1px solid #E8DFCC", verticalAlign: "top" }}>
        <div style={{ ...HINDI, fontWeight: 700, color: GREEN, fontSize: 12.5, lineHeight: 1.35 }}>{hi}</div>
        <div style={{ fontSize: 8.5, color: GOLD_DARK, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{en}</div>
      </td>
      <td
        style={{
          padding: "3px 12px",
          borderBottom: "1px solid #E8DFCC",
          verticalAlign: "middle",
          fontWeight: 700,
          color: "#0B1E36",
          fontSize: 12.5,
          fontFamily: mono ? "monospace" : undefined,
          letterSpacing: mono ? "0.04em" : undefined,
          textTransform: mono ? undefined : "uppercase",
          overflowWrap: "anywhere",
        }}
      >
        {children}
      </td>
    </tr>
  );
}

export default function RegistrationCertificateLayout({ certificate: c, className = "" }) {
  const place = CERT_PLACE;
  const issued = formatDisplayDate(c.registration_date);

  return (
    <A4Fit>
      <div
        className={`reg-cert-wrapper w-[794px] max-w-full bg-white mx-auto p-3 print:p-0 relative ${className}`}
        style={{ boxSizing: "border-box", color: "#1e293b" }}
      >
        <style>{`
          @media print {
            @page { size: A4 portrait; margin: 8mm; }
            html, body { background-color: #ffffff !important; margin: 0 !important; padding: 0 !important; }
            .reg-cert-wrapper { width: 100% !important; max-width: 100% !important; padding: 0 !important; margin: 0 auto !important; break-inside: avoid !important; page-break-inside: avoid !important; }
          }
        `}</style>

        {/* Double frame: deep green outside, gold inside */}
        <div style={{ border: `3px double ${GREEN}`, padding: 6 }}>
          <div style={{ border: `1.5px solid ${GOLD}`, position: "relative", overflow: "hidden", padding: "16px 32px 12px" }}>
            <Corner style={{ top: -8, left: -8 }} />
            <Corner style={{ top: -8, right: -8 }} />
            <Corner style={{ bottom: -8, left: -8 }} />
            <Corner style={{ bottom: -8, right: -8 }} />

            {/* Watermark */}
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", userSelect: "none", zIndex: 0 }}>
              <img src="/logo.png" alt="" style={{ width: 400, height: 400, maxWidth: "75%", objectFit: "contain", opacity: 0.09 }} />
            </div>

            {/* Letterhead */}
            <div style={{ position: "relative", zIndex: 1, textAlign: "center" }}>
              <img src="/logo.png" alt="भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद् का प्रतीक" style={{ width: 68, height: 68, objectFit: "contain", margin: "0 auto" }} />
              <div style={{ ...HINDI, fontSize: 23, fontWeight: 800, color: GREEN, lineHeight: 1.3, marginTop: 2 }}>
                भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: GOLD_DARK, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 2 }}>
                Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
              </div>
              <div style={{ ...HINDI, fontSize: 10.5, color: "#475569", marginTop: 3, fontWeight: 600 }}>
                (भारतीय न्यास अधिनियम 2013 के अंतर्गत पंजीकृत • ISO 9001:2015 प्रमाणित संस्था)
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "6px 0 0" }}>
                <span style={{ flex: 1, height: 1.5, background: `linear-gradient(90deg, #FFFFFF, ${GOLD})` }} />
                <span style={{ width: 8, height: 8, background: GOLD, transform: "rotate(45deg)" }} />
                <span style={{ flex: 1, height: 1.5, background: `linear-gradient(270deg, #FFFFFF, ${GOLD})` }} />
              </div>
            </div>

            {/* Title banner */}
            <div style={{ position: "relative", zIndex: 1, margin: "8px auto 0", width: "78%", textAlign: "center", background: `linear-gradient(90deg, #071F13, ${GREEN}, #071F13)`, borderTop: `2px solid ${GOLD}`, borderBottom: `2px solid ${GOLD}`, padding: "4px 10px" }}>
              <div style={{ ...HINDI, fontSize: 26, fontWeight: 800, color: "#E4BF64", lineHeight: 1.25 }}>पंजीयन प्रमाण-पत्र</div>
              <div style={{ fontSize: 10, color: "#F1E4C3", letterSpacing: "0.3em", fontWeight: 600 }}>CERTIFICATE OF REGISTRATION</div>
            </div>

            {/* Certificate number + date */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 8, ...HINDI, fontSize: 12.5 }}>
              <div>
                <span style={{ color: "#475569" }}>प्रमाण-पत्र क्रमांक : </span>
                <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#7a1f1f", fontSize: 13.5, letterSpacing: "0.04em" }}>{c.certificate_no}</span>
              </div>
              <div>
                <span style={{ color: "#475569" }}>जारी करने की तिथि : </span>
                <span style={{ fontWeight: 800, color: "#0B1E36" }}>{issued}</span>
              </div>
            </div>

            {/* Declaration paragraph + photo */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", gap: 16, alignItems: "flex-start", marginTop: 8 }}>
              <p style={{ ...HINDI, flex: 1, margin: 0, fontSize: 12.5, lineHeight: 1.8, textAlign: "left", color: "#1e293b" }}>
                प्रमाणित किया जाता है कि {c.salutation} <b style={{ color: GREEN }}>{c.candidate_name}</b>, {c.relation}{" "}
                <b style={{ color: GREEN }}>{c.father_name}</b>, ने <b style={{ color: GREEN }}>{c.institution_name}</b> में{" "}
                <b style={{ color: GREEN }}>{c.course}</b> पाठ्यक्रम (शैक्षणिक सत्र <b style={{ color: GREEN }}>{c.academic_session || "—"}</b>) हेतु
                नामांकन क्रमांक <b style={{ color: GREEN, fontFamily: "monospace" }}>{c.enrollment_no}</b> के अंतर्गत प्रवेश लिया है। उनका नाम
                परिषद् के अभ्यर्थी पंजीयन रजिस्टर में दिनांक <b style={{ color: GREEN }}>{issued}</b> को उपरोक्त क्रमांक पर दर्ज किया गया है।
              </p>
              <div style={{ width: 98, height: 120, flexShrink: 0, border: `2px solid ${GREEN}`, outline: `1px solid ${GOLD}`, outlineOffset: 2, background: "#F8FAFC", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {c.photo_url ? (
                  <img src={c.photo_url} alt={c.candidate_name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                ) : (
                  <span style={{ ...HINDI, fontSize: 10, fontWeight: 700, color: "#64748b", textAlign: "center", padding: 4 }}>अभ्यर्थी का<br />फोटो</span>
                )}
              </div>
            </div>

            {/* Details table */}
            <table style={{ position: "relative", zIndex: 1, width: "100%", borderCollapse: "collapse", marginTop: 8, border: "1px solid #E8DFCC", fontSize: 12.5 }}>
              <tbody>
                <Row hi="अभ्यर्थी का नाम" en="Name of Candidate">{c.candidate_name}</Row>
                <Row alt hi="पिता / अभिभावक का नाम" en="Father's / Guardian's Name">{c.father_name}</Row>
                <Row hi="जन्म तिथि" en="Date of Birth" mono>{formatDisplayDate(c.dob)}</Row>
                <Row alt hi="स्थायी पता" en="Permanent Address">{c.address}</Row>
                <Row hi="पाठ्यक्रम" en="Course Enrolled">{c.course}</Row>
                <Row alt hi="नामांकन क्रमांक" en="Enrollment Number" mono>{c.enrollment_no}</Row>
                <Row hi="संस्था का नाम" en="Name of Institution">{c.institution_name}</Row>
                <Row alt hi="शैक्षणिक सत्र" en="Academic Session" mono>{c.academic_session || "—"}</Row>
                <Row hi="पंजीयन की तिथि" en="Date of Registration" mono>{formatDisplayDate(c.registration_date)}</Row>
                <Row alt hi="पंजीयन की वैधता (तक)" en="Valid Upto" mono>{formatDisplayDate(c.valid_upto)}</Row>
              </tbody>
            </table>

            {/* Certification */}
            <div style={{ position: "relative", zIndex: 1, marginTop: 8, textAlign: "center" }}>
              <p style={{ ...HINDI, margin: 0, fontSize: 12, lineHeight: 1.8, color: "#1e293b" }}>
                &ldquo;प्रमाणित किया जाता है कि उपरोक्त विवरण, भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद् द्वारा संधारित
                अभ्यर्थी पंजीयन रजिस्टर में दर्ज प्रविष्टि की सत्य प्रतिलिपि है।&rdquo;
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 9.5, color: "#64748b", fontStyle: "italic" }}>
                Certified that the above is a true copy of the entry in the Register of Candidates maintained by the Parishad.
              </p>
            </div>

            {/* Place / date + signature */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8, breakInside: "avoid" }}>
              <div style={{ ...HINDI, fontSize: 12, lineHeight: 1.8, color: "#1e293b" }}>
                <div>स्थान : <b>{place}</b></div>
                <div>दिनांक : <b>{issued}</b></div>
              </div>
              <div style={{ textAlign: "center", minWidth: 210 }}>
                <div style={{ height: 46, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 3 }}>
                  <img src="/Signature.png" alt="सचिव के हस्ताक्षर" style={{ height: 42, maxWidth: 150, objectFit: "contain" }} />
                </div>
                <div style={{ borderTop: `1.5px solid ${GREEN}`, paddingTop: 3 }}>
                  <span style={{ ...HINDI, fontSize: 12, fontWeight: 800, color: GREEN, display: "block" }}>सचिव / Secretary</span>
                  <span style={{ ...HINDI, fontSize: 9, color: "#64748b", display: "block" }}>भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्</span>
                </div>
              </div>
            </div>

            <p style={{ ...HINDI, position: "relative", zIndex: 1, margin: "8px 0 0", textAlign: "center", fontSize: 9, color: "#64748b" }}>
              यह कंप्यूटर द्वारा निर्मित प्रमाण-पत्र है, जो परिषद् के पंजीयन अभिलेखों पर आधारित है। (This is a computer-generated certificate.)
            </p>
          </div>
        </div>
      </div>
    </A4Fit>
  );
}
