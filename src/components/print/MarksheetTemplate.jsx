"use client";

import Image from "next/image";

function Cell({ children, className = "" }) {
  return (
    <td className={`border border-[#0E3320] px-2 py-1.5 text-[11px] ${className}`}>{children}</td>
  );
}

export default function MarksheetTemplate({ data, showPageBreak = false }) {
  if (!data) return null;

  const { student, subjects = [], summary, issueDate, certificateNo } = data;

  const grade = (pct) => {
    const p = parseFloat(pct);
    if (p >= 90) return "O";
    if (p >= 80) return "A+";
    if (p >= 70) return "A";
    if (p >= 60) return "B+";
    if (p >= 50) return "B";
    if (p >= 40) return "C";
    return "F";
  };

  const pct = parseFloat(summary?.percentage || 0);

  return (
    <div className={`bg-white font-serif text-[#0E3320] ${showPageBreak ? "page-break-after-always" : ""}`}
      style={{ width: "210mm", minHeight: "297mm", margin: "0 auto", padding: "12mm 14mm", boxSizing: "border-box", position: "relative" }}>

      {/* Watermark */}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%) rotate(-30deg)", opacity: 0.04, fontSize: "72px", fontWeight: "bold", whiteSpace: "nowrap", userSelect: "none", pointerEvents: "none", zIndex: 0 }}>
        BHARTIYA AYURVEDA
      </div>

      {/* Border */}
      <div style={{ position: "absolute", inset: "6mm", border: "3px double #C59B3F", pointerEvents: "none" }} />
      <div style={{ position: "absolute", inset: "8mm", border: "1px solid #0E3320", pointerEvents: "none" }} />

      <div style={{ position: "relative", zIndex: 1 }}>
        {/* Header */}
        <div className="flex items-center gap-4 pb-3 mb-3 border-b-2 border-[#C59B3F]">
          <div className="relative w-16 h-16 shrink-0">
            <Image src="/logo.png" alt="Logo" fill sizes="64px" className="object-contain" />
          </div>
          <div className="flex-1 text-center">
            <p className="text-[9px] font-bold tracking-[0.2em] uppercase text-[#C59B3F]">Government Recognized Body</p>
            <h1 className="text-base font-bold text-[#0E3320] leading-tight mt-0.5">
              Bhartiya Ayurveda Yoga Evam<br />Prakritik Chikitsa Parishad
            </h1>
            <p className="text-[10px] text-[#5C8261] font-medium">भारतीय आयुर्वेद योग एवं प्राकृतिक चिकित्सा परिषद</p>
          </div>
          <div className="w-16 shrink-0 text-right">
            {certificateNo && (
              <p className="text-[9px] text-[#9B8265]">No.<br /><strong className="text-[#0E3320] font-mono">{certificateNo}</strong></p>
            )}
          </div>
        </div>

        {/* Title */}
        <div className="text-center mb-4">
          <div className="inline-block bg-[#0E3320] text-[#C59B3F] px-8 py-1.5 rounded">
            <h2 className="text-sm font-bold tracking-widest uppercase">Statement of Marks</h2>
          </div>
          <p className="text-[11px] text-[#5C8261] mt-1 font-medium">अंकतालिका</p>
        </div>

        {/* Student Info Grid */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 mb-4 text-[11px]">
          {[
            ["Student Name / नाम", student?.candidate_name],
            ["Roll Number / रोल नंबर", student?.roll_no],
            ["Father's Name / पिता का नाम", student?.father_name],
            ["Enrollment No. / नामांकन सं.", student?.enrollment_no],
            ["Mother's Name / माता का नाम", student?.mother_name],
            ["Date of Birth / जन्म तिथि", student?.dob],
            ["Course / पाठ्यक्रम", student?.course],
            ["Session / सत्र", student?.session_label],
            ["College / महाविद्यालय", student?.college],
            ["Category / श्रेणी", student?.category],
          ].map(([label, val]) => (
            <div key={label} className="flex gap-1.5">
              <span className="text-[#5C8261] shrink-0 w-[42%]">{label}:</span>
              <span className="font-semibold text-[#0E3320]">{val || "—"}</span>
            </div>
          ))}
        </div>

        {/* Marks Table */}
        <table className="w-full border-collapse border border-[#0E3320] mb-4 text-[11px]">
          <thead>
            <tr className="bg-[#0E3320] text-white">
              <Cell className="text-white border-white/30 font-bold">S.No.</Cell>
              <Cell className="text-white border-white/30 font-bold w-1/3">Subject / विषय</Cell>
              <Cell className="text-white border-white/30 font-bold text-center">Max<br />(Theory)</Cell>
              <Cell className="text-white border-white/30 font-bold text-center">Obt.<br />(Theory)</Cell>
              <Cell className="text-white border-white/30 font-bold text-center">Max<br />(Pract.)</Cell>
              <Cell className="text-white border-white/30 font-bold text-center">Obt.<br />(Pract.)</Cell>
              <Cell className="text-white border-white/30 font-bold text-center">Total</Cell>
              <Cell className="text-white border-white/30 font-bold text-center">Grade</Cell>
              <Cell className="text-white border-white/30 font-bold text-center">Status</Cell>
            </tr>
          </thead>
          <tbody>
            {subjects.map((s, i) => {
              const subPct = s.max_total > 0 ? (s.total / s.max_total) * 100 : 0;
              return (
                <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-[#FAF8F5]"}>
                  <Cell className="text-center">{i + 1}</Cell>
                  <Cell>
                    <span className="font-semibold">{s.subject_name}</span>
                    {s.subject_code && <span className="text-[9px] text-[#9B8265] ml-1">({s.subject_code})</span>}
                  </Cell>
                  <Cell className="text-center">{s.theory_max ?? 80}</Cell>
                  <Cell className="text-center font-semibold">{s.theory_marks ?? 0}</Cell>
                  <Cell className="text-center">{s.practical_max ?? 20}</Cell>
                  <Cell className="text-center font-semibold">{s.practical_marks ?? 0}</Cell>
                  <Cell className="text-center font-bold">{s.total}</Cell>
                  <Cell className="text-center font-bold text-[#0E3320]">{grade(subPct)}</Cell>
                  <Cell className={`text-center font-bold text-xs ${s.pass ? "text-emerald-700" : "text-red-700"}`}>
                    {s.pass ? "PASS" : "FAIL"}
                  </Cell>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-[#F5F0E8] font-bold">
              <Cell colSpan={6} className="text-right font-bold">Grand Total / कुल अंक</Cell>
              <Cell className="text-center font-bold text-[#0E3320] text-sm">{summary?.grand_total} / {summary?.grand_max}</Cell>
              <Cell className="text-center font-bold">{grade(pct)}</Cell>
              <Cell className={`text-center font-bold ${summary?.result === "PASS" ? "text-emerald-700" : "text-red-700"}`}>
                {summary?.result || "—"}
              </Cell>
            </tr>
          </tfoot>
        </table>

        {/* Summary Row */}
        <div className="flex justify-between items-center text-[11px] mb-6 px-1">
          <div className="space-y-0.5">
            <p><span className="text-[#5C8261]">Percentage / प्रतिशत:</span> <strong>{summary?.percentage}%</strong></p>
            <p><span className="text-[#5C8261]">Grade / श्रेणी:</span> <strong>{grade(pct)}</strong></p>
          </div>
          <div className={`px-6 py-2 rounded border-2 font-bold text-base ${summary?.result === "PASS" ? "border-emerald-600 text-emerald-700 bg-emerald-50" : "border-red-600 text-red-700 bg-red-50"}`}>
            {summary?.result || "AWAITED"}
          </div>
        </div>

        {/* Signatures */}
        <div className="flex justify-between items-end mt-8 pt-4 border-t border-[#DDD1BE]">
          <div className="text-center text-[10px] text-[#5C8261]">
            <div className="w-28 border-t border-[#0E3320] pt-1 mx-auto">Controller of Examinations</div>
          </div>
          <div className="text-center text-[10px] text-[#5C8261]">
            <p className="mb-6">{issueDate || new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}</p>
            <div className="w-28 border-t border-[#0E3320] pt-1 mx-auto">Date of Issue</div>
          </div>
          <div className="text-center text-[10px] text-[#5C8261]">
            <div className="w-28 border-t border-[#0E3320] pt-1 mx-auto">Registrar</div>
          </div>
        </div>

        {/* Footer note */}
        <p className="text-[9px] text-[#9B8265] text-center mt-4">
          This is a computer-generated marksheet. For verification, visit the official portal or contact the examination cell.
        </p>
      </div>
    </div>
  );
}
