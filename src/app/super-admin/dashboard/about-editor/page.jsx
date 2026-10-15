"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, ChevronDown, ChevronUp, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import { DEFAULT_ABOUT } from "@/lib/about-defaults";

function Section({ title, open, onToggle, children }) {
  return (
    <div className="bg-white rounded-2xl border border-[#DDD1BE] overflow-hidden">
      <button onClick={onToggle} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[#FAF8F5] transition-colors">
        <span className="font-bold text-[#0E3320] text-sm">{title}</span>
        {open ? <ChevronUp className="w-4 h-4 text-[#5C8261]" /> : <ChevronDown className="w-4 h-4 text-[#5C8261]" />}
      </button>
      {open && <div className="px-5 pb-5 border-t border-[#EBE2D4] pt-4 space-y-4">{children}</div>}
    </div>
  );
}

function Field({ label, value, onChange, multiline = false, rows = 3, placeholder = "" }) {
  return (
    <div>
      <label className="block text-[10px] font-bold text-[#5C8261] uppercase tracking-wider mb-1">{label}</label>
      {multiline
        ? <textarea rows={rows} value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full px-3 py-2 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F] resize-y" />
        : <input type="text" value={value || ""} onChange={e => onChange(e.target.value)} placeholder={placeholder}
            className="w-full px-3 py-2 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />}
    </div>
  );
}

export default function AboutEditorPage() {
  const router = useRouter();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState({ show: false, msg: "", type: "success" });
  const [open, setOpen] = useState({ hero: true, story: false, milestones: false, vision: false, mission: false, objectives: false, values: false, acharyas: false, cta: false });

  const showToast = (msg, type = "success") => {
    setToast({ show: true, msg, type });
    setTimeout(() => setToast(t => ({ ...t, show: false })), 3000);
  };

  useEffect(() => {
    fetch("/api/admin/about-content")
      .then(r => r.json())
      .then(d => { if (d.ok) setContent(d.content); })
      .finally(() => setLoading(false));
  }, []);

  const set = (path, value) => {
    setContent(prev => {
      const next = structuredClone(prev);
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) obj = obj[keys[i]];
      obj[keys[keys.length - 1]] = value;
      return next;
    });
  };

  const setArr = (key, idx, field, value) => {
    setContent(prev => {
      const next = structuredClone(prev);
      next[key][idx][field] = value;
      return next;
    });
  };

  const addRow = (key, template) => setContent(prev => ({ ...prev, [key]: [...prev[key], { ...template }] }));
  const removeRow = (key, idx) => setContent(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== idx) }));

  const setBullet = (idx, value) => setContent(prev => {
    const next = structuredClone(prev);
    next.story.bullets[idx] = value;
    return next;
  });

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/about-content", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(content) });
      const d = await res.json();
      if (d.ok) showToast("About page saved successfully!");
      else showToast(d.error || "Save failed", "error");
    } catch {
      showToast("Network error", "error");
    }
    setSaving(false);
  };

  const handleReset = () => {
    if (!confirm("Reset all content to defaults? This cannot be undone.")) return;
    setContent(structuredClone(DEFAULT_ABOUT));
    showToast("Reset to defaults. Click Save to apply.");
  };

  if (loading) return (
    <div className="min-h-screen bg-[#F4EFE6] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-[#0E3320]/20 border-t-[#0E3320] rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F4EFE6] pb-20">
      {/* Toast */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-2xl shadow-xl text-sm font-semibold border animate-in fade-in slide-in-from-top-2 ${toast.type === "success" ? "bg-emerald-50 text-emerald-800 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
          {toast.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-40 bg-[#0E3320] text-white px-4 sm:px-6 py-3 flex items-center justify-between shadow-lg">
        <div className="flex items-center gap-3">
          <button onClick={() => router.push("/super-admin/dashboard")} className="px-2.5 py-1.5 rounded-lg hover:bg-white/10 transition-colors text-xs font-semibold">
            Back
          </button>
          <div>
            <p className="text-xs text-[#A8C5B0]">Super Admin</p>
            <h1 className="text-sm font-bold">About Page Editor</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-bold transition-colors flex items-center gap-1.5">
            <RefreshCw className="w-3.5 h-3.5" /> Reset
          </button>
          <button onClick={handleSave} disabled={saving} className="px-4 py-1.5 rounded-xl bg-[#C59B3F] hover:bg-[#A8832E] text-white text-xs font-bold transition-colors flex items-center gap-1.5 disabled:opacity-60">
            <Save className="w-3.5 h-3.5" /> {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pt-6 space-y-4">

        {/* HERO */}
        <Section title="1. Hero Section" open={open.hero} onToggle={() => setOpen(p => ({ ...p, hero: !p.hero }))}>
          <Field label="Tagline Pill (Hindi)" value={content.hero.tagline} onChange={v => set("hero.tagline", v)} />
          <Field label="Title Hindi" value={content.hero.titleHi} onChange={v => set("hero.titleHi", v)} />
          <Field label="Title English" value={content.hero.titleEn} onChange={v => set("hero.titleEn", v)} />
          <Field label="Subtitle" value={content.hero.subtitle} onChange={v => set("hero.subtitle", v)} multiline rows={2} />
        </Section>

        {/* STORY */}
        <Section title="2. Story / Heritage Section" open={open.story} onToggle={() => setOpen(p => ({ ...p, story: !p.story }))}>
          <Field label="Heading Hindi" value={content.story.headingHi} onChange={v => set("story.headingHi", v)} />
          <Field label="Paragraph Hindi" value={content.story.paraHi} onChange={v => set("story.paraHi", v)} multiline rows={4} />
          <Field label="Paragraph English" value={content.story.paraEn} onChange={v => set("story.paraEn", v)} multiline rows={4} />
          <div>
            <label className="block text-[10px] font-bold text-[#5C8261] uppercase tracking-wider mb-2">Bullet Points (4)</label>
            <div className="space-y-2">
              {content.story.bullets.map((b, i) => (
                <input key={i} type="text" value={b} onChange={e => setBullet(i, e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-[#DDD1BE] bg-[#FAF8F5] text-sm text-[#0E3320] focus:outline-none focus:ring-2 focus:ring-[#C59B3F]" />
              ))}
            </div>
          </div>
          <Field label="Sanskrit Quote" value={content.story.quote} onChange={v => set("story.quote", v)} />
          <Field label="Quote Translation" value={content.story.quoteEn} onChange={v => set("story.quoteEn", v)} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Experience Badge (e.g. 25+ Years)" value={content.story.yearsLabel} onChange={v => set("story.yearsLabel", v)} />
            <Field label="Badge Sub-label" value={content.story.yearsSubLabel} onChange={v => set("story.yearsSubLabel", v)} />
          </div>
        </Section>

        {/* MILESTONES */}
        <Section title="3. Milestones / Stats (4 numbers)" open={open.milestones} onToggle={() => setOpen(p => ({ ...p, milestones: !p.milestones }))}>
          {content.milestones.map((m, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#DDD1BE] space-y-2">
              <p className="text-xs font-bold text-[#0E3320]">Stat {i + 1}</p>
              <div className="grid grid-cols-3 gap-2">
                <Field label="Number" value={m.num} onChange={v => setArr("milestones", i, "num", v)} />
                <Field label="Label Hindi" value={m.labelHi} onChange={v => setArr("milestones", i, "labelHi", v)} />
                <Field label="Label English" value={m.labelEn} onChange={v => setArr("milestones", i, "labelEn", v)} />
              </div>
            </div>
          ))}
        </Section>

        {/* VISION */}
        <Section title="4. Vision (दृष्टि)" open={open.vision} onToggle={() => setOpen(p => ({ ...p, vision: !p.vision }))}>
          <Field label="Vision Text Hindi" value={content.vision.textHi} onChange={v => set("vision.textHi", v)} multiline rows={5} />
          <Field label="Vision Text English" value={content.vision.textEn} onChange={v => set("vision.textEn", v)} multiline rows={5} />
        </Section>

        {/* MISSION */}
        <Section title="5. Mission (उद्देश्य)" open={open.mission} onToggle={() => setOpen(p => ({ ...p, mission: !p.mission }))}>
          <Field label="Mission Text Hindi" value={content.mission.textHi} onChange={v => set("mission.textHi", v)} multiline rows={5} />
          <Field label="Mission Text English" value={content.mission.textEn} onChange={v => set("mission.textEn", v)} multiline rows={5} />
        </Section>

        {/* OBJECTIVES */}
        <Section title="6. Trust Objectives (न्यास के उद्देश्य)" open={open.objectives} onToggle={() => setOpen(p => ({ ...p, objectives: !p.objectives }))}>
          {content.objectives.map((obj, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#DDD1BE] space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#0E3320]">Objective {i + 1}</p>
                {content.objectives.length > 1 && (
                  <button onClick={() => removeRow("objectives", i)} className="p-1 rounded-lg hover:bg-red-50 text-[#5C8261] hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
              <Field label="Hindi Text" value={obj.hi} onChange={v => setArr("objectives", i, "hi", v)} multiline rows={3} />
              <Field label="English Text" value={obj.en} onChange={v => setArr("objectives", i, "en", v)} multiline rows={3} />
            </div>
          ))}
          <button onClick={() => addRow("objectives", { hi: "", en: "" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-[#C59B3F] text-[#C59B3F] text-xs font-bold hover:bg-[#FAF8F5]">
            <Plus className="w-3.5 h-3.5" /> Add Objective
          </button>
        </Section>

        {/* VALUES */}
        <Section title="7. Core Values (4 cards)" open={open.values} onToggle={() => setOpen(p => ({ ...p, values: !p.values }))}>
          {content.values.map((val, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#DDD1BE] space-y-2">
              <p className="text-xs font-bold text-[#0E3320]">Value {i + 1}</p>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Title Hindi" value={val.hi} onChange={v => setArr("values", i, "hi", v)} />
                <Field label="Title English" value={val.en} onChange={v => setArr("values", i, "en", v)} />
              </div>
              <Field label="Description" value={val.desc} onChange={v => setArr("values", i, "desc", v)} multiline rows={2} />
            </div>
          ))}
        </Section>

        {/* ACHARYAS */}
        <Section title="8. Faculty / Acharyas" open={open.acharyas} onToggle={() => setOpen(p => ({ ...p, acharyas: !p.acharyas }))}>
          {content.acharyas.map((a, i) => (
            <div key={i} className="p-3 rounded-xl bg-[#FAF8F5] border border-[#DDD1BE] space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-[#0E3320]">Acharya {i + 1}</p>
                {content.acharyas.length > 1 && (
                  <button onClick={() => removeRow("acharyas", i)} className="p-1 rounded-lg hover:bg-red-50 text-[#5C8261] hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                <Field label="Name" value={a.name} onChange={v => setArr("acharyas", i, "name", v)} />
                <Field label="Experience" value={a.exp} onChange={v => setArr("acharyas", i, "exp", v)} />
              </div>
              <Field label="Role / Qualification" value={a.role} onChange={v => setArr("acharyas", i, "role", v)} />
              <Field label="Description" value={a.desc} onChange={v => setArr("acharyas", i, "desc", v)} multiline rows={2} />
              <Field label="Photo URL (from ImageKit or /images/...)" value={a.img} onChange={v => setArr("acharyas", i, "img", v)} placeholder="/images/acharyas/photo.jpg" />
            </div>
          ))}
          <button onClick={() => addRow("acharyas", { name: "", role: "", exp: "", desc: "", img: "" })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-dashed border-[#C59B3F] text-[#C59B3F] text-xs font-bold hover:bg-[#FAF8F5]">
            <Plus className="w-3.5 h-3.5" /> Add Acharya
          </button>
        </Section>

        {/* CTA */}
        <Section title="9. Bottom CTA Banner" open={open.cta} onToggle={() => setOpen(p => ({ ...p, cta: !p.cta }))}>
          <Field label="Heading Hindi" value={content.cta.headingHi} onChange={v => set("cta.headingHi", v)} />
          <Field label="Subtitle English" value={content.cta.subtitle} onChange={v => set("cta.subtitle", v)} multiline rows={2} />
        </Section>

        {/* Save button at bottom */}
        <div className="pt-2 flex justify-end gap-3">
          <button onClick={handleSave} disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#0E3320] hover:bg-[#15482D] text-white text-sm font-bold transition-all disabled:opacity-60 flex items-center gap-2">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save All Changes"}
          </button>
        </div>
      </div>
    </div>
  );
}
