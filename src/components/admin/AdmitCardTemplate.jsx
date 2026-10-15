"use client";

function fmtDate(d) {
  if (!d) return "—";
  const p = d.split("-");
  if (p.length === 3 && p[0].length === 4)
    return `${p[2].padStart(2,"0")}-${p[1].padStart(2,"0")}-${p[0]}`;
  return d;
}

function fmtExamDate(d) {
  if (!d) return "—";
  try { return new Date(d).toLocaleDateString("en-IN", { day:"2-digit", month:"short", year:"numeric" }); }
  catch { return d; }
}

export default function AdmitCardTemplate({ data, showPageBreak = false }) {
  if (!data) return null;

  return (
    <div style={{ fontFamily:"sans-serif", pageBreakAfter: showPageBreak ? "always" : "auto" }}>
      <div style={{ background:"linear-gradient(135deg,#0E3320,#1A5C38,#0E3320)", padding:"4px", borderRadius:2, marginBottom:showPageBreak?"0":"0" }}>
      <div style={{ border:"1.5px solid #C59B3F" }}>
      <div style={{ background:"white", position:"relative", overflow:"hidden" }}>

        {/* Corner ornaments */}
        {[0,1,2,3].map(i => (
          <div key={i} style={{ position:"absolute", zIndex:30, top:i<2?0:undefined, bottom:i>=2?0:undefined, left:i%2===0?0:undefined, right:i%2===1?0:undefined, width:32, height:32, pointerEvents:"none" }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              {i===0 && <><path d="M2 16 L2 2 L16 2" stroke="#C59B3F" strokeWidth="1.5" fill="none"/><circle cx="2" cy="2" r="2.5" fill="#C59B3F"/></>}
              {i===1 && <><path d="M16 2 L30 2 L30 16" stroke="#C59B3F" strokeWidth="1.5" fill="none"/><circle cx="30" cy="2" r="2.5" fill="#C59B3F"/></>}
              {i===2 && <><path d="M2 16 L2 30 L16 30" stroke="#C59B3F" strokeWidth="1.5" fill="none"/><circle cx="2" cy="30" r="2.5" fill="#C59B3F"/></>}
              {i===3 && <><path d="M16 30 L30 30 L30 16" stroke="#C59B3F" strokeWidth="1.5" fill="none"/><circle cx="30" cy="30" r="2.5" fill="#C59B3F"/></>}
            </svg>
          </div>
        ))}

        {/* Watermark */}
        <div style={{ pointerEvents:"none", position:"absolute", inset:0, display:"flex", alignItems:"center", justifyContent:"center", zIndex:20, overflow:"hidden" }} aria-hidden>
          <img src="/logo.png" alt="" style={{ width:320, height:320, objectFit:"contain", opacity:0.08 }} />
        </div>

        <div style={{ position:"relative", zIndex:10 }}>
          {/* Header */}
          <div style={{ background:"linear-gradient(135deg,#071F13 0%,#0E3320 40%,#1A5C38 100%)", padding:"14px 18px", display:"flex", alignItems:"center", gap:14 }}>
            <div style={{ flexShrink:0, width:76, height:76, borderRadius:"50%", background:"white", display:"flex", alignItems:"center", justifyContent:"center", border:"2.5px solid #C59B3F", boxShadow:"0 0 0 3px #C59B3F30" }}>
              <img src="/logo.png" alt="Logo" style={{ width:62, height:62, objectFit:"contain" }} />
            </div>
            <div style={{ flex:1, textAlign:"center" }}>
              <div style={{ color:"#E4BF64", fontSize:12.5, fontWeight:700, fontFamily:"'Noto Sans Devanagari',sans-serif" }}>भारतीय आयुर्वेदा योग एवं प्राकृतिक चिकित्सा परिषद्</div>
              <div style={{ color:"white", fontSize:14.5, fontWeight:900, textTransform:"uppercase", letterSpacing:"0.04em", marginTop:2 }}>Bhartiya Ayurveda Yoga Evam Prakritik Chikitsa Parishad</div>
              <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:6, marginTop:5 }}>
                <div style={{ height:1, flex:1, maxWidth:70, background:"linear-gradient(90deg,transparent,#C59B3F)" }}></div>
                <span style={{ color:"#A8C5B0", fontSize:8, fontWeight:500, letterSpacing:"0.07em", whiteSpace:"nowrap" }}>Regd. Under Indian Trust Act 2013 ✦ ISO 9001:2015 Certified ✦ Examination Division</span>
                <div style={{ height:1, flex:1, maxWidth:70, background:"linear-gradient(90deg,#C59B3F,transparent)" }}></div>
              </div>
            </div>
          </div>

          {/* Gold stripe */}
          <div style={{ height:4, background:"linear-gradient(90deg,#8C671D,#C59B3F,#E4BF64,#C59B3F,#8C671D)" }}></div>

          {/* Title */}
          <div style={{ background:"linear-gradient(180deg,#F5F0E8,#EDE5D5)", padding:"7px 20px", textAlign:"center", borderBottom:"2px solid #D4C5A9" }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"center", gap:10 }}>
              <div style={{ height:1, flex:1, background:"linear-gradient(90deg,transparent,#C59B3F)" }}></div>
              <div>
                <div style={{ fontSize:12, fontWeight:900, color:"#0E3320", textTransform:"uppercase", letterSpacing:"0.18em" }}>Examination Hall Ticket / प्रवेश पत्र</div>
                <div style={{ fontSize:9.5, fontWeight:700, color:"#8C671D", marginTop:1.5 }}>{data.session_label || "Annual Examination"}</div>
              </div>
              <div style={{ height:1, flex:1, background:"linear-gradient(90deg,#C59B3F,transparent)" }}></div>
            </div>
          </div>

          {/* Body */}
          <div style={{ padding:"14px 18px", display:"flex", flexDirection:"column", gap:10 }}>

            {/* Candidate details */}
            <div style={{ border:"1px solid #C59B3F", borderRadius:4, overflow:"hidden" }}>
              <div style={{ background:"linear-gradient(90deg,#0E3320,#1A5C38)", padding:"5px 12px", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:3, height:12, background:"#C59B3F", borderRadius:2, flexShrink:0, display:"inline-block" }}></span>
                <span style={{ fontSize:9, fontWeight:800, color:"white", textTransform:"uppercase", letterSpacing:"0.14em" }}>Candidate &amp; Examination Details / अभ्यर्थी विवरण</span>
              </div>
              <div style={{ display:"flex", alignItems:"stretch", background:"white" }}>
                <div style={{ flex:1, display:"grid", gridTemplateColumns:"1fr 1fr", borderRight:"1px dashed #E2D5C0" }}>
                  {[
                    ["Candidate Name", (data.candidate_name||"—").toUpperCase(), false],
                    ["Roll Number",    data.roll_no||"—", true],
                    ["Father's Name",  (data.father_name||"—").toUpperCase(), false],
                    ["Date of Birth",  fmtDate(data.dob), false],
                    ["Enrollment No.", data.enrollment_no||"—", true],
                    ["Exam Year",      data.exam_year_label||"1st Year", false],
                  ].map(([lbl, val, mono]) => (
                    <div key={lbl} style={{ display:"flex", alignItems:"center", gap:5, padding:"4px 12px", borderBottom:"1px dashed #E2D5C0" }}>
                      <span style={{ color:"#64748b", fontSize:9, fontWeight:600, minWidth:88, flexShrink:0 }}>{lbl}</span>
                      <span style={{ color:"#94a3b8", fontSize:9 }}>:</span>
                      <span style={{ color:"#0E3320", fontSize:10, fontWeight:700, fontFamily:mono?"monospace":undefined }}>{val}</span>
                    </div>
                  ))}
                  <div style={{ display:"flex", alignItems:"start", gap:5, padding:"4px 12px", gridColumn:"1 / -1", borderBottom:"1px dashed #E2D5C0" }}>
                    <span style={{ color:"#64748b", fontSize:9, fontWeight:600, minWidth:88, flexShrink:0, marginTop:1 }}>Programme</span>
                    <span style={{ color:"#94a3b8", fontSize:9, marginTop:1 }}>:</span>
                    <span style={{ color:"#0E3320", fontSize:10, fontWeight:700, textTransform:"uppercase" }}>{data.course||"—"}</span>
                  </div>
                  <div style={{ display:"flex", alignItems:"start", gap:5, padding:"5px 12px", gridColumn:"1 / -1" }}>
                    <span style={{ color:"#64748b", fontSize:9, fontWeight:600, minWidth:88, flexShrink:0, marginTop:1 }}>Exam Centre</span>
                    <span style={{ color:"#94a3b8", fontSize:9, marginTop:1 }}>:</span>
                    <span style={{ color:"#0E3320", fontSize:10, fontWeight:700, textTransform:"uppercase" }}>{data.center_name||"Central Examination Centre"}</span>
                  </div>
                </div>
                {/* Photo */}
                <div style={{ flexShrink:0, width:90, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:8, background:"#FAFAF8" }}>
                  <div style={{ border:"2px solid #0E3320", width:72, height:90, overflow:"hidden", background:"#F5F0E8", boxShadow:"2px 2px 6px #0003", display:"flex", alignItems:"center", justifyContent:"center" }}>
                    {data.photo_url
                      ? <img src={data.photo_url} alt="Photo" style={{ width:"100%", height:"100%", objectFit:"cover", objectPosition:"top" }} />
                      : <div style={{ fontSize:9, color:"#9B8265", textAlign:"center", padding:4 }}>Paste<br/>Photo</div>
                    }
                  </div>
                  <div style={{ marginTop:4, fontSize:7.5, color:"#64748b", textAlign:"center" }}>Candidate Photo</div>
                </div>
              </div>
            </div>

            {/* Exam schedule */}
            <div style={{ border:"1px solid #C59B3F", borderRadius:4, overflow:"hidden" }}>
              <div style={{ background:"linear-gradient(90deg,#0E3320,#1A5C38)", padding:"5px 12px", display:"flex", alignItems:"center", gap:6 }}>
                <span style={{ width:3, height:12, background:"#C59B3F", borderRadius:2, flexShrink:0, display:"inline-block" }}></span>
                <span style={{ fontSize:9, fontWeight:800, color:"white", textTransform:"uppercase", letterSpacing:"0.14em" }}>Examination Schedule / परीक्षा कार्यक्रम</span>
              </div>
              <table style={{ width:"100%", borderCollapse:"collapse", background:"white" }}>
                <thead>
                  <tr style={{ background:"#F5F0E8" }}>
                    {["S.No.", "Subject Code", "Subject Name", "Exam Date", "Timing"].map(h => (
                      <th key={h} style={{ padding:"5px 10px", fontSize:8.5, fontWeight:800, color:"#0E3320", textTransform:"uppercase", textAlign:"left", borderBottom:"1px solid #E2D5C0", letterSpacing:"0.04em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {(data.subjects||[]).map((s, i) => (
                    <tr key={i} style={{ borderBottom:"1px dashed #E8DCC8", background:i%2===0?"white":"#FAFAF8" }}>
                      <td style={{ padding:"4px 10px", fontSize:9, fontWeight:700, color:"#0E3320" }}>{i+1}</td>
                      <td style={{ padding:"4px 10px", fontSize:9, fontWeight:600, color:"#8C671D", fontFamily:"monospace" }}>{s.subject_code||"—"}</td>
                      <td style={{ padding:"4px 10px", fontSize:9.5, fontWeight:700, color:"#0E3320" }}>{s.subject_name}</td>
                      <td style={{ padding:"4px 10px", fontSize:9, fontWeight:600, color:"#0E3320" }}>{fmtExamDate(s.exam_date)}</td>
                      <td style={{ padding:"4px 10px", fontSize:9, fontWeight:600, color:"#0E3320" }}>{s.exam_time||"—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Instructions */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              {[
                { title:"Instructions / निर्देश", items:["This admit card must be produced at the exam centre.","Report 30 minutes before exam time.","No electronic devices allowed inside.","Carry a valid Govt. Photo ID."] },
                { title:"Important Notes / महत्वपूर्ण सूचना", items:["Write Roll Number on answer sheet clearly.","Blue/Black ballpoint pen only.","No rough work on question paper.","Any malpractice will lead to cancellation."] },
              ].map(({ title, items }) => (
                <div key={title} style={{ border:"1px solid #D4C5A9", borderRadius:3, overflow:"hidden" }}>
                  <div style={{ background:"#F5F0E8", padding:"4px 10px", borderBottom:"1px solid #D4C5A9" }}>
                    <span style={{ fontSize:8.5, fontWeight:800, color:"#0E3320", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</span>
                  </div>
                  <ul style={{ margin:0, padding:"6px 10px 6px 20px", listStyleType:"disc", background:"white" }}>
                    {items.map((item, i) => <li key={i} style={{ fontSize:8.5, color:"#1A3020", marginBottom:3, lineHeight:1.4 }}>{item}</li>)}
                  </ul>
                </div>
              ))}
            </div>

            {/* Signatures */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:10, paddingTop:6 }}>
              {["Candidate's Signature", "Centre Superintendent", "Controller of Examinations"].map(label => (
                <div key={label} style={{ textAlign:"center" }}>
                  <div style={{ height:28, borderBottom:"1px solid #0E3320", marginBottom:4 }}></div>
                  <div style={{ fontSize:8, color:"#64748b", fontWeight:600 }}>{label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
      </div>
      </div>
    </div>
  );
}
