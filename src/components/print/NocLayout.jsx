"use client";

import A4Fit from "@/components/print/A4Fit";
import { useSiteSettings } from "@/context/SiteSettingsContext";

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

/** A filled-in value on a dotted line, like the handwritten blanks on a printed form. */
function Fill({ children, mono }) {
  return (
    <span
      style={{
        display: "inline-block",
        borderBottom: "1.5px dotted #475569",
        padding: "0 6px",
        fontWeight: 800,
        color: "#0B1E36",
        fontSize: 15,
        lineHeight: 1.5,
        fontFamily: mono ? "monospace" : undefined,
        overflowWrap: "anywhere",
      }}
    >
      {children}
    </span>
  );
}

/** Adds a full stop only when the text does not already end with one (e.g. "Jaunpur U.P."). */
const endDot = (s) => (/[.]$/.test(String(s)) ? s : `${s}.`);

export default function NocLayout({ noc: n, className = "" }) {
  const { contact } = useSiteSettings();
  const place = contact?.city || "भारत";
  const address = [contact?.addressLine1, contact?.city, contact?.state, contact?.pincode].filter(Boolean).join(", ");

  return (
    <A4Fit>
      <div
        className={`noc-wrapper w-[794px] max-w-full bg-white mx-auto p-3 print:p-0 relative ${className}`}
        style={{ boxSizing: "border-box", color: "#1e293b" }}
      >
        <style>{`
          @media print {
            @page { size: A4 portrait; margin: 8mm; }
            html, body { background-color: #ffffff !important; margin: 0 !important; padding: 0 !important; }
            .noc-wrapper { width: 100% !important; max-width: 100% !important; padding: 0 !important; margin: 0 auto !important; break-inside: avoid !important; page-break-inside: avoid !important; }
            .noc-frame { min-height: 0 !important; padding-top: 16px !important; padding-bottom: 12px !important; }
            .noc-title { margin-top: 14px !important; }
            .noc-body { margin-top: 12px !important; line-height: 2.1 !important; }
            .noc-trans { margin-top: 8px !important; }
            .noc-sign { margin-top: 28px !important; }
            .noc-foot { margin-top: 10px !important; }
          }
        `}</style>

        <div style={{ border: `4px solid ${GREEN}`, padding: 5 }}>
          <div className="noc-frame" style={{ border: `1.5px solid ${GOLD}`, position: "relative", overflow: "hidden", padding: "22px 36px 20px", minHeight: 1020 }}>
            {/* Watermark */}
            <div aria-hidden="true" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", userSelect: "none", zIndex: 0 }}>
              <img src="/logo.png" alt="" style={{ width: 430, height: 430, maxWidth: "75%", objectFit: "contain", opacity: 0.07 }} />
            </div>

            {/* Serial number | logo | photo */}
            <div style={{ position: "relative", zIndex: 1, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ width: 190, paddingTop: 4, ...HINDI }}>
                <div style={{ fontSize: 12.5, fontWeight: 700, color: GREEN }}>क्रमांक / S.NO.</div>
                <div style={{ fontFamily: "monospace", fontWeight: 800, fontSize: 12.5, color: "#7a1f1f", letterSpacing: "0.03em", overflowWrap: "anywhere", lineHeight: 1.3 }}>{n.serial_no}</div>
              </div>

              <img src="/logo.png" alt="भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद् का प्रतीक" style={{ width: 96, height: 96, objectFit: "contain" }} />

              <div style={{ width: 190, display: "flex", justifyContent: "flex-end" }}>
                <div style={{ width: 92, height: 114, border: `2px solid ${GREEN}`, outline: `1px solid ${GOLD}`, outlineOffset: 2, background: "#F8FAFC", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {n.photo_url ? (
                    <img src={n.photo_url} alt={n.candidate_name} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top" }} />
                  ) : (
                    <span style={{ ...HINDI, fontSize: 10, fontWeight: 700, color: "#64748b", textAlign: "center", padding: 4 }}>अभ्यर्थी का<br />फोटो</span>
                  )}
                </div>
              </div>
            </div>

            {/* Parishad name */}
            <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginTop: 8 }}>
              <div style={{ ...HINDI, fontSize: 25, fontWeight: 800, color: GREEN, lineHeight: 1.3 }}>
                भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्
              </div>
              <div style={{ fontSize: 10.5, fontWeight: 700, color: GOLD_DARK, letterSpacing: "0.16em", textTransform: "uppercase", marginTop: 2 }}>
                Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad
              </div>
              <div style={{ ...HINDI, fontSize: 10.5, color: "#475569", marginTop: 3, fontWeight: 600 }}>
                (भारतीय न्यास अधिनियम 2013 के अंतर्गत पंजीकृत • ISO 9001:2015 प्रमाणित संस्था)
              </div>
            </div>

            {/* Office + contact */}
            <div style={{ position: "relative", zIndex: 1, textAlign: "center", marginTop: 14, borderTop: `1.5px solid ${GOLD}`, borderBottom: `1.5px solid ${GOLD}`, padding: "8px 0" }}>
              <div style={{ ...HINDI, fontSize: 17, fontWeight: 800, color: "#0B1E36" }}>कार्यालय : सचिव, भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्</div>
              {address && <div style={{ ...HINDI, fontSize: 12, color: "#475569", marginTop: 2 }}>{address}</div>}
              <div style={{ fontSize: 11.5, color: "#1d4e89", marginTop: 3, display: "flex", justifyContent: "center", gap: 18, flexWrap: "wrap" }}>
                <span>www.bayapcp.com</span>
                {contact?.primaryEmail && <span>{contact.primaryEmail}</span>}
                {contact?.primaryPhone && <span style={{ color: "#1e293b", fontWeight: 600 }}>फोन : {contact.primaryPhone}</span>}
              </div>
            </div>

            {/* Title */}
            <div className="noc-title" style={{ position: "relative", zIndex: 1, textAlign: "center", marginTop: 26 }}>
              <div style={{ ...HINDI, display: "inline-block", fontSize: 30, fontWeight: 800, color: GREEN, borderBottom: `2.5px solid ${GOLD}`, paddingBottom: 2, lineHeight: 1.3 }}>
                अनापत्ति प्रमाण-पत्र
              </div>
              <div style={{ fontSize: 11, color: "#475569", letterSpacing: "0.3em", fontWeight: 700, marginTop: 4 }}>NO OBJECTION CERTIFICATE</div>
            </div>

            {/* Body (Hindi first, English translation below) */}
            <div className="noc-body" style={{ position: "relative", zIndex: 1, marginTop: 24, ...HINDI, fontSize: 16.5, lineHeight: 2.55, color: "#0f172a", textAlign: "left" }}>
              <p style={{ margin: 0 }}>
                भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद् द्वारा {n.salutation} <Fill>{n.candidate_name}</Fill> {n.relation}{" "}
                <Fill>{n.father_name}</Fill> को, जिन्होंने <Fill>{n.institution_name}</Fill> से <Fill>{n.course}</Fill> पाठ्यक्रम की परीक्षा
                उत्तीर्ण की है, यह <Fill>अनापत्ति</Fill> प्रमाण-पत्र प्रदान किया जाता है।
              </p>
              <p style={{ margin: "6px 0 0" }}>
                अभ्यर्थी परिषद् में पंजीयन क्रमांक <Fill mono>{n.registration_no}</Fill> दिनांक <Fill>{formatDisplayDate(n.registration_date)}</Fill>{" "}
                पर पंजीकृत है। अभ्यर्थी द्वारा किसी अन्य परिषद् / बोर्ड / राज्य से पंजीयन प्राप्त करने में परिषद् को कोई आपत्ति नहीं है।
              </p>
            </div>

            <div className="noc-trans" style={{ position: "relative", zIndex: 1, marginTop: 14, padding: "8px 12px", background: "#FAF8F5", borderLeft: `3px solid ${GOLD}`, fontSize: 11.5, lineHeight: 1.7, color: "#475569", fontStyle: "italic" }}>
              English: The Parishad hereby grants a No Objection Certificate to {n.salutation === "सुश्री" ? "Ms." : n.salutation === "श्री" ? "Mr." : "Mr./Ms."} {n.candidate_name}{" "}
              ({n.relation === "पुत्री" ? "D/O" : n.relation === "पुत्र" ? "S/O" : "S/O, D/O"} {n.father_name}), who passed the examination for the {n.course} course from {endDot(n.institution_name)}
              The applicant is registered with the Parishad vide registration no. {n.registration_no} dated {formatDisplayDate(n.registration_date)}, and the Parishad has
              no objection to the applicant obtaining registration from any other Council/Board or State.
            </div>

            {/* Place / date + signature */}
            <div className="noc-sign" style={{ position: "relative", zIndex: 1, marginTop: 60, display: "flex", justifyContent: "space-between", alignItems: "flex-end", breakInside: "avoid" }}>
              <div style={{ ...HINDI, fontSize: 14, lineHeight: 1.9 }}>
                <div>स्थान : <b>{place}</b></div>
                <div>दिनांक : <b style={{ color: "#0B1E36" }}>{formatDisplayDate(n.issue_date)}</b></div>
              </div>
              <div style={{ textAlign: "center", minWidth: 220 }}>
                <div style={{ height: 50, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 3 }}>
                  <img src="/Signature.png" alt="सचिव के हस्ताक्षर" style={{ height: 46, maxWidth: 160, objectFit: "contain" }} />
                </div>
                <div style={{ borderTop: `1.5px solid ${GREEN}`, paddingTop: 3 }}>
                  <span style={{ ...HINDI, fontSize: 12.5, fontWeight: 800, color: GREEN, display: "block" }}>सचिव / Secretary</span>
                  <span style={{ ...HINDI, fontSize: 9, color: "#64748b", display: "block" }}>भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्</span>
                </div>
              </div>
            </div>

            <p className="noc-foot" style={{ ...HINDI, position: "relative", zIndex: 1, margin: "26px 0 0", textAlign: "center", fontSize: 9, color: "#64748b" }}>
              यह कंप्यूटर द्वारा निर्मित प्रमाण-पत्र है, जो परिषद् के अभिलेखों पर आधारित है और इसे रंगीन प्रिंट में लिया जाना चाहिए।
            </p>
          </div>
        </div>
      </div>
    </A4Fit>
  );
}
