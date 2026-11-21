"use client";

import { useEffect, useState } from "react";
import { Calendar } from "lucide-react";

const MONTHS = [
  ["01", "जनवरी / Jan"], ["02", "फ़रवरी / Feb"], ["03", "मार्च / Mar"], ["04", "अप्रैल / Apr"],
  ["05", "मई / May"], ["06", "जून / Jun"], ["07", "जुलाई / Jul"], ["08", "अगस्त / Aug"],
  ["09", "सितंबर / Sep"], ["10", "अक्टूबर / Oct"], ["11", "नवंबर / Nov"], ["12", "दिसंबर / Dec"],
];

const CUR_YEAR = new Date().getFullYear();
// Wide enough for older candidates too (the admit-card picker only goes back 40 years)
const YEARS = Array.from({ length: CUR_YEAR - 10 - 1940 + 1 }, (_, i) => String(CUR_YEAR - 10 - i));

const selectCls =
  "w-full py-3 rounded-xl border border-[#D5C7B5] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] focus:border-[#C59B3F] transition-all cursor-pointer";

function daysInMonth(year, month) {
  // month is "01".."12"; without a year assume a leap year so 29 Feb stays selectable
  const y = Number(year) || 2000;
  return new Date(y, Number(month), 0).getDate();
}

function split(value) {
  const m = String(value || "").match(/^(\d{4})-(\d{2})-(\d{2})$/);
  return m ? { y: m[1], m: m[2], d: m[3] } : { y: "", m: "", d: "" };
}

/**
 * Date of birth as three theme-styled dropdowns (day / month / year).
 * `value` and `onChange` use YYYY-MM-DD; onChange gets "" until all three parts are chosen.
 */
export default function DobSelect({ value, onChange, idPrefix = "dob", required = false, disabled = false }) {
  const [parts, setParts] = useState(() => split(value));

  // keep in sync when the parent resets / changes the value
  useEffect(() => {
    setParts((prev) => {
      const next = split(value);
      // a complete value from the parent wins; an empty one only clears when we were complete before
      if (value) return next;
      return prev.y && prev.m && prev.d ? next : prev;
    });
  }, [value]);

  const update = (patch) => {
    const next = { ...parts, ...patch };
    // never keep a day that does not exist in the chosen month (e.g. 31 Feb)
    if (next.m && next.d) {
      const max = daysInMonth(next.y, next.m);
      if (Number(next.d) > max) next.d = String(max).padStart(2, "0");
    }
    setParts(next);
    const complete = next.y && next.m && next.d;
    onChange(complete ? `${next.y}-${next.m}-${next.d}` : "");
  };

  const dayCount = parts.m ? daysInMonth(parts.y, parts.m) : 31;
  const days = Array.from({ length: dayCount }, (_, i) => String(i + 1).padStart(2, "0"));

  return (
    <div className="grid grid-cols-[1fr_1.5fr_1.1fr] gap-2">
      <div className="relative">
        <Calendar className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#7A583A] pointer-events-none" />
        <select
          id={`${idPrefix}_day`}
          aria-label="Day / दिन"
          value={parts.d}
          onChange={(e) => update({ d: e.target.value })}
          required={required}
          disabled={disabled}
          className={`${selectCls} pl-7 pr-1`}
        >
          <option value="">दिन</option>
          {days.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
      </div>
      <select
        id={`${idPrefix}_month`}
        aria-label="Month / माह"
        value={parts.m}
        onChange={(e) => update({ m: e.target.value })}
        required={required}
        disabled={disabled}
        className={`${selectCls} px-2`}
      >
        <option value="">माह</option>
        {MONTHS.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
      </select>
      <select
        id={`${idPrefix}_year`}
        aria-label="Year / वर्ष"
        value={parts.y}
        onChange={(e) => update({ y: e.target.value })}
        required={required}
        disabled={disabled}
        className={`${selectCls} px-2`}
      >
        <option value="">वर्ष</option>
        {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
      </select>
    </div>
  );
}
