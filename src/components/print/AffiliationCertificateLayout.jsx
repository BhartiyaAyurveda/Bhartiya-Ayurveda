"use client";

import A4Fit from "@/components/print/A4Fit";
import { istDate, CERT_PLACE } from "@/lib/cert-number";

const GREEN = "#0E3320";
const GOLD = "#C59B3F";
const GOLD_DARK = "#8C671D";
const HINDI = { fontFamily: "'Noto Sans Devanagari', 'Mangal', sans-serif" };

function formatDisplayDate(dateStr) {
  if (!dateStr) return "—";
  const parts = String(dateStr).trim().slice(0, 10).split("-");
  if (parts.length === 3 && parts[0].length === 4) {
    const [year, month, day] = parts;
    return `${day.padStart(2, "0")}/${month.padStart(2, "0")}/${year}`;
  }
  return dateStr;
}

/** Joins address parts, dropping blanks and repeats. */
function joinAddress(parts) {
  const seen = new Set();
  const out = [];
  for (const p of parts) {
    const v = typeof p === "string" ? p.trim() : "";
    if (!v || seen.has(v.toLowerCase())) continue;
    seen.add(v.toLowerCase());
    out.push(v);
  }
  return out.join(", ");
}

/** "BAMS. AM,   BEMS, ALL YOGA COURSES " -> "BAMS. AM, BEMS, ALL YOGA COURSES" */
function cleanCourses(value) {
  return String(value || "")
    .split(",")
    .map((c) => c.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(", ");
}

/** One numbered line: Hindi label (English underneath), dotted leader, value. */
function Row({ no, hi, en, children, mono }) {
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 8, padding: "3px 0", borderBottom: "1px dotted #cbbf9f" }}>
      <span style={{ width: 22, flexShrink: 0, fontWeight: 800, color: GOLD_DARK, fontSize: 12.5 }}>{no}.</span>
      <div style={{ width: 218, flexShrink: 0 }}>
        <div style={{ ...HINDI, fontWeight: 700, color: GREEN, fontSize: 12.5, lineHeight: 1.35 }}>{hi}</div>
        <div style={{ fontSize: 8.5, color: GOLD_DARK, letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>{en}</div>
      </div>
      <span style={{ color: "#64748b", fontWeight: 700 }}>:</span>
      <div style={{ flex: 1, minWidth: 0, fontWeight: 700, color: "#0B1E36", fontSize: 12.5, lineHeight: 1.5, overflowWrap: "anywhere", fontFamily: mono ? "monospace" : undefined, letterSpacing: mono ? "0.04em" : undefined }}>
        {children}
      </div>
    </div>
  );
}

/**
 * Affiliation Certificate of an institute. `institution` is a row of affiliated_institutes with the
 * affiliation_cert_no set by the admin.
 */
export default function AffiliationCertificateLayout({ institution: c, className = "" }) {
  const place = CERT_PLACE;
  const address = joinAddress([c.address, c.city, c.state]);
  const courses = cleanCourses(c.type);
  const issued = c.affiliation_cert_issued_at ? istDate(c.affiliation_cert_issued_at) : istDate();
  const since = c.affiliated_since ? String(c.affiliated_since).slice(0, 10) : issued;

  return (
    <A4Fit>
      <div className={`affil-cert-wrapper w-[794px] max-w-full bg-white mx-auto p-3 print:p-0 relative ${className}`} style={{ boxSizing: "border-box", color: "#1e293b" }}>
        <style>{`
          @media print {
            @page { size: A4 portrait; margin: 8mm; }
            html, body { background-color: #ffffff !important; margin: 0 !important; padding: 0 !important; }
            .affil-cert-wrapper { width: 100% !important; max-width: 100% !important; padding: 0 !important; margin: 0 auto !important; break-inside: avoid !important; page-break-inside: avoid !important; }
            .affil-cert-frame { min-height: 0 !important; }
            .affil-cert-sign { margin-top: 18px !important; }
          }
        `}</style>

        <div style={{ border: `3px double ${GREEN}`, padding: 6 }}>
          <div className="affil-cert-frame" style={{ border: `1.5px solid ${GOLD}`, position: "relative", overflow: "hidden", padding: "16px 34px 12px", minHeight: 1010, display: "flex", flexDirection: "column" }}>
            {/* Watermark */}
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", userSelect: "none", zIndex: 0 }}>
              <img src="/logo.png" alt="" style={{ width: 430, height: 430, maxWidth: "75%", objectFit: "contain", opacity: 0.09 }} />
            </div>

            {/* Letterhead: logo left, name centred */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 14 }}>
              <img src="/logo.png" alt="भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद् का प्रतीक" style={{ width: 80, height: 80, objectFit: "contain", flexShrink: 0 }} />
              <div style={{ flex: 1, textAlign: "center" }}>
                <div style={{ ...HINDI, fontSize: 21.5, fontWeight: 800, color: GREEN, lineHeight: 1.3, whiteSpace: "nowrap" }}>भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: GOLD_DARK, letterSpacing: "0.15em", textTransform: "uppercase", marginTop: 2 }}>
                  Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
                </div>
                <div style={{ ...HINDI, fontSize: 10.5, color: "#475569", marginTop: 3, fontWeight: 600 }}>
                  (भारतीय न्यास अधिनियम 2013 के अंतर्गत पंजीकृत • ISO 9001:2015 प्रमाणित संस्था)
                </div>
              </div>
            </div>

            <div style={{ position: "relative", zIndex: 1, display: "flex", alignItems: "center", gap: 8, margin: "10px 0 0" }}>
              <span style={{ flex: 1, height: 2, background: `linear-gradient(90deg, #FFFFFF, ${GOLD})` }} />
              <span style={{ width: 9, height: 9, background: GOLD, transform: "rotate(45deg)" }} />
              <span style={{ flex: 1, height: 2, background: `linear-gradient(270deg, #FFFFFF, ${GOLD})` }} />
            </div>

            {/* Title */}
            <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginTop: 12 }}>
              <div style={{ ...HINDI, display: "inline-block", fontSize: 32, fontWeight: 800, color: GREEN, lineHeight: 1.3, borderBottom: `3px solid ${GOLD}`, paddingBottom: 1 }}>संबद्धता प्रमाण-पत्र</div>
              <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.32em", fontWeight: 700, marginTop: 5 }}>CERTIFICATE OF AFFILIATION</div>
            </div>

            {/* Number + date */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginTop: 14, ...HINDI, fontSize: 12.5 }}>
              <div>
                <span style={{ color: "#475569" }}>संबद्धता क्रमांक : </span>
                <span style={{ fontFamily: "monospace", fontWeight: 800, color: "#7a1f1f", fontSize: 13.5, letterSpacing: "0.04em" }}>{c.affiliation_cert_no}</span>
              </div>
              <div>
                <span style={{ color: "#475569" }}>जारी करने की तिथि : </span>
                <span style={{ fontWeight: 800, color: "#0B1E36" }}>{formatDisplayDate(issued)}</span>
              </div>
            </div>

            {/* Declaration */}
            <p style={{ ...HINDI, position: "relative", zIndex: 1, margin: "10px 0 0", fontSize: 13, lineHeight: 1.8, textAlign: "left", overflowWrap: "anywhere" }}>
              प्रमाणित किया जाता है कि <b style={{ color: GREEN }}>{c.name}</b>
              {c.name_hindi ? <> (<b style={{ color: GREEN }}>{c.name_hindi}</b>)</> : null}
              {address ? <>, पता : {address}</> : null}, को भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद् द्वारा
              {courses ? <> <b style={{ color: GREEN }}>{courses}</b> पाठ्यक्रमों</> : " उपरोक्त पाठ्यक्रमों"} के संचालन हेतु दिनांक{" "}
              <b style={{ color: GREEN }}>{formatDisplayDate(since)}</b> से संबद्धता प्रदान की गई है।
            </p>

            {/* Details */}
            <div style={{ position: "relative", zIndex: 1, marginTop: 10, borderTop: `1px solid ${GOLD}` }}>
              <Row no="1" hi="संस्थान का नाम" en="Name of Institute">
                <span style={{ textTransform: "uppercase" }}>{c.name}</span>
                {c.name_hindi && <div style={{ ...HINDI, fontWeight: 600, color: GREEN }}>{c.name_hindi}</div>}
              </Row>
              <Row no="2" hi="निदेशक / प्राचार्य" en="Director / Principal">{c.contact_person || "—"}</Row>
              <Row no="3" hi="पता" en="Address"><span style={{ textTransform: "uppercase" }}>{address || "—"}</span></Row>
              <Row no="4" hi="अनुमोदित पाठ्यक्रम" en="Approved Courses"><span style={{ textTransform: "uppercase" }}>{courses || "—"}</span></Row>
              <Row no="5" hi="संस्थान कोड" en="Institute Code" mono>{c.code || "—"}</Row>
              <Row no="6" hi="स्थिति" en="Status">{c.is_active ? "सक्रिय / Active" : "निष्क्रिय / Inactive"}</Row>
              <Row no="7" hi="संबद्धता दिनांक" en="Affiliated Since" mono>{formatDisplayDate(since)}</Row>
            </div>

            {/* Conditions */}
            <div style={{ position: "relative", zIndex: 1, marginTop: 14 }}>
              <div style={{ ...HINDI, fontSize: 12.5, fontWeight: 800, color: GREEN }}>शर्तें / Conditions</div>
              <ol style={{ ...HINDI, margin: "4px 0 0", paddingLeft: 20, fontSize: 12, lineHeight: 1.85, color: "#1e293b" }}>
                <li>यह संबद्धता केवल उपरोक्त अनुमोदित पाठ्यक्रमों के संचालन के लिए मान्य है।</li>
                <li>यह संबद्धता परिषद् के मानकों के निरंतर अनुपालन के अधीन है।</li>
                <li>परिषद् द्वारा समय-समय पर संस्थान का सत्यापन किया जा सकता है।</li>
              </ol>
              <p style={{ margin: "6px 0 0", fontSize: 9.5, color: "#64748b", fontStyle: "italic", lineHeight: 1.6 }}>
                This is to certify that the above-named institute has been granted affiliation by the Parishad to conduct the above-listed courses, subject to
                continued compliance with the Parishad&apos;s norms and periodic verification.
              </p>
            </div>

            {/* Place / date + signature */}
            <div className="affil-cert-sign" style={{ position: "relative", zIndex: 1, marginTop: "auto", paddingTop: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-end", breakInside: "avoid" }}>
              <div style={{ ...HINDI, fontSize: 12.5, lineHeight: 1.8 }}>
                <div>स्थान : <b>{place}</b></div>
                <div>दिनांक : <b>{formatDisplayDate(issued)}</b></div>
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

            <div className="affil-cert-bottom" style={{ position: "relative", zIndex: 1, marginTop: 8, display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 12, breakInside: "avoid" }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", lineHeight: 1.25, flexShrink: 0 }}>
                <img src="/national-emblem.png" alt="भारत का राज चिह्न" style={{ width: 36, height: 56, objectFit: "contain" }} />
                <span style={{ ...HINDI, marginTop: 2, fontSize: 9, fontWeight: 600, color: "#1e293b" }}>नीति आयोग</span>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: "#1e293b" }}>Recognized</span>
                <span style={{ fontSize: 9.5, fontWeight: 700, color: "#1e293b", whiteSpace: "nowrap" }}>MSME Trust - Education Act</span>
              </div>
              <p style={{ ...HINDI, margin: 0, alignSelf: "center", textAlign: "center", fontSize: 9, color: "#64748b", flex: 1 }}>
                यह कंप्यूटर द्वारा निर्मित प्रमाण-पत्र है, जो परिषद् के संबद्धता अभिलेखों पर आधारित है। (This is a computer-generated certificate.)
              </p>
              <img src="/azadi-ka-amrit-mahotsav.png" alt="आज़ादी का अमृत महोत्सव" style={{ width: 90, height: 60, objectFit: "contain", flexShrink: 0 }} />
            </div>
          </div>
        </div>
      </div>
    </A4Fit>
  );
}
