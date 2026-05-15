import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { memberAPI } from "../api/member";

const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return { isMobile };
};

const SAMPLE_MEMBERS = [
  {
    id: 1,
    husbandName: "Ahmad bin Ismail",
    age: 45,
    phone: "+60123456789",
    homeAddress: "No. 123, Jalan Merdeka, Taman Perdana",
    district: "Klang",
    state: "Selangor",
    wives: ["Aishah binti Omar", "Fatimah binti Ali"],
    marriedChildren: 3,
    unmarriedChildren: 2,
    currentJob: "Business Owner",
    companyName: "Ahmad Enterprise Sdn Bhd",
    struggleUnderstanding: "Still searching for truth, believes struggle continues. Actively seeking knowledge.",
    familySituation: "Children in local schools, working on self-improvement.",
    welfareStatus: "House in good condition, some debts from previous operations.",
    fivePActivities: ["Business", "Agriculture"],
    complianceLevel: "Good understanding of fatwa compliance, working on implementing better practices.",
    struggleAssessment: 4,
    familyManagementAssessment: 3,
    welfareAssessment: 3,
    fivePAssessment: 4,
    complianceAssessment: 3,
    summary: "Active member with good business background, working on family welfare improvement.",
    status: "active",
    joinDate: "2020-01-15",
    lastUpdated: "2024-05-10",
  },
  {
    id: 2,
    husbandName: "Mohammad bin Hassan",
    age: 38,
    phone: "+60123456790",
    homeAddress: "No. 456, Jalan Raya, Kampung Baru",
    district: "Kuala Lumpur",
    state: "Wilayah Persekutuan",
    wives: ["Norhayati binti Ahmad"],
    marriedChildren: 1,
    unmarriedChildren: 3,
    currentJob: "Farmer",
    companyName: "Kampung Farm Enterprise",
    struggleUnderstanding: "Strong belief in continuing the struggle. Fully committed.",
    familySituation: "Children in primary and secondary school, family-oriented.",
    welfareStatus: "Moderate living conditions, minimal debt.",
    fivePActivities: ["Agriculture", "Livestock"],
    complianceLevel: "High compliance with religious guidelines.",
    struggleAssessment: 5,
    familyManagementAssessment: 4,
    welfareAssessment: 3,
    fivePAssessment: 5,
    complianceAssessment: 5,
    summary: "Dedicated farmer with strong religious commitment, good family management.",
    status: "active",
    joinDate: "2019-06-20",
    lastUpdated: "2024-05-08",
  },
];

const MALAYSIA_STATE_OPTIONS = [
  "PERLIS","KEDAH","P. PINANG","PERAK","SELANGOR","WP KL / PJ","WP LABUAN",
  "NEGERI SEMBILAN","MELAKA","JOHOR","PAHANG","TERENGGANU","KELANTAN","SABAH","SARAWAK",
];

/* ─── Design Tokens ─────────────────────────────────────── */
const T = {
  bg:        "#F7F8FA",
  surface:   "#FFFFFF",
  border:    "#EAEDF2",
  text:      "#0F1117",
  muted:     "#6B7280",
  accent:    "#2563EB",
  accentSoft:"#EFF4FF",
  success:   "#16A34A",
  successBg: "#F0FDF4",
  warn:      "#D97706",
  warnBg:    "#FFFBEB",
  danger:    "#DC2626",
  dangerBg:  "#FEF2F2",
  radius:    "12px",
  radiusSm:  "8px",
  shadow:    "0 1px 3px rgba(0,0,0,.06), 0 1px 2px rgba(0,0,0,.04)",
  shadowMd:  "0 4px 12px rgba(0,0,0,.08)",
};

/* ─── Helpers ────────────────────────────────────────────── */
const scoreColor = (s) => s >= 4 ? T.success : s >= 3 ? T.warn : T.danger;
const scoreBg    = (s) => s >= 4 ? T.successBg : s >= 3 ? T.warnBg : T.dangerBg;
const scoreLabel = (s) => ["","Lemah","Kurang","Sederhana","Baik","Terbaik"][s] ?? "—";
const fmtDate    = (d) => d ? new Date(d).toLocaleDateString("ms-MY", { day:"numeric", month:"short", year:"numeric" }) : "—";
const statusMs   = (s) => ({ active:"Aktif", inactive:"Tidak aktif", pending:"Menunggu" }[s] ?? s ?? "—");

/* ─── Sub-components ─────────────────────────────────────── */
const Field = ({ label, children }) => (
  <div>
    <div style={{ fontSize:"11px", fontWeight:600, color:T.muted, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"6px" }}>
      {label}
    </div>
    <div style={{ fontSize:"14px", color:T.text, lineHeight:1.5 }}>{children || "—"}</div>
  </div>
);

const Input = ({ value, onChange, type="text", ...rest }) => (
  <input
    type={type}
    value={value ?? ""}
    onChange={onChange}
    style={{
      width:"100%", padding:"9px 12px",
      border:`1.5px solid ${T.border}`, borderRadius:T.radiusSm,
      fontSize:"14px", color:T.text, background:"#fff",
      outline:"none", boxSizing:"border-box",
      transition:"border-color .15s",
    }}
    onFocus={e  => e.target.style.borderColor = T.accent}
    onBlur={e   => e.target.style.borderColor = T.border}
    {...rest}
  />
);

const Textarea = ({ value, onChange, rows=4 }) => (
  <textarea
    value={value ?? ""}
    onChange={onChange}
    rows={rows}
    style={{
      width:"100%", padding:"10px 12px",
      border:`1.5px solid ${T.border}`, borderRadius:T.radiusSm,
      fontSize:"14px", color:T.text, background:"#fff",
      outline:"none", resize:"vertical", boxSizing:"border-box",
      fontFamily:"inherit", lineHeight:1.6,
      transition:"border-color .15s",
    }}
    onFocus={e => e.target.style.borderColor = T.accent}
    onBlur={e  => e.target.style.borderColor = T.border}
  />
);

const Select = ({ value, onChange, children }) => (
  <select
    value={value ?? ""}
    onChange={onChange}
    style={{
      width:"100%", padding:"9px 12px",
      border:`1.5px solid ${T.border}`, borderRadius:T.radiusSm,
      fontSize:"14px", color:T.text, background:"#fff",
      outline:"none", boxSizing:"border-box",
      appearance:"auto",
    }}
  >
    {children}
  </select>
);

const Btn = ({ children, onClick, variant="primary", size="md", style:extra={} }) => {
  const base = {
    display:"inline-flex", alignItems:"center", gap:"6px",
    border:"none", cursor:"pointer", fontFamily:"inherit", fontWeight:500,
    borderRadius:T.radiusSm, transition:"all .15s", ...extra,
  };
  const sizes = { sm:{ padding:"6px 12px", fontSize:"13px" }, md:{ padding:"9px 18px", fontSize:"14px" } };
  const variants = {
    primary:  { background:T.accent,   color:"#fff" },
    ghost:    { background:"transparent", color:T.muted, border:`1.5px solid ${T.border}` },
    danger:   { background:T.dangerBg, color:T.danger, border:`1.5px solid #FECACA` },
    success:  { background:T.successBg,color:T.success, border:`1.5px solid #BBF7D0` },
    orange:   { background:T.warnBg,   color:T.warn,   border:`1.5px solid #FDE68A` },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant] }}>
      {children}
    </button>
  );
};

const ScoreRing = ({ score }) => {
  const r = 22, circ = 2 * Math.PI * r;
  const pct = (score / 5) * circ;
  const col = scoreColor(score);
  return (
    <svg width="64" height="64" style={{ flexShrink:0 }}>
      <circle cx="32" cy="32" r={r} fill="none" stroke={T.border} strokeWidth="4"/>
      <circle cx="32" cy="32" r={r} fill="none" stroke={col} strokeWidth="4"
        strokeDasharray={`${pct} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 32 32)" style={{ transition:"stroke-dasharray .4s ease" }}/>
      <text x="32" y="37" textAnchor="middle" fontSize="14" fontWeight="700" fill={col}>{score}</text>
    </svg>
  );
};

const ScoreCard = ({ label, score, editMode, onChange }) => (
  <div style={{
    padding:"20px", background:T.surface, borderRadius:T.radius,
    border:`1px solid ${T.border}`, boxShadow:T.shadow,
    display:"flex", flexDirection:"column", gap:"12px",
  }}>
    <div style={{ fontSize:"13px", color:T.muted, fontWeight:500, lineHeight:1.4 }}>{label}</div>
    {editMode ? (
      <div>
        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
          {[1,2,3,4,5].map(n => (
            <button key={n} onClick={() => onChange(n)} style={{
              width:36, height:36, borderRadius:"50%", border:"none", cursor:"pointer",
              background: score === n ? scoreColor(n) : T.border,
              color: score === n ? "#fff" : T.muted,
              fontWeight:600, fontSize:"13px", transition:"all .15s",
            }}>{n}</button>
          ))}
        </div>
        <div style={{ textAlign:"center", fontSize:"12px", color:scoreColor(score), fontWeight:600 }}>
          {scoreLabel(score)}
        </div>
      </div>
    ) : (
      <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
        <ScoreRing score={score} />
        <div>
          <div style={{ fontSize:"22px", fontWeight:700, color:scoreColor(score) }}>{score}<span style={{ fontSize:"14px", color:T.muted, fontWeight:400 }}>/5</span></div>
          <div style={{ fontSize:"12px", color:scoreColor(score), fontWeight:600, marginTop:"2px" }}>{scoreLabel(score)}</div>
        </div>
      </div>
    )}
  </div>
);

/* ─── Main Component ─────────────────────────────────────── */
function MemberDetail() {
  const { isMobile } = useResponsive();
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchMember(); }, [id]);

  const fetchMember = async () => {
    try {
      setLoading(true); setError(null);
      const token = localStorage.getItem("token");
      const response = await memberAPI.getMemberById(id, token);
      if (response.success) { setMember(response.data); }
      else {
        const found = SAMPLE_MEMBERS.find(m => m.id === parseInt(id));
        found ? setMember(found) : setError("Ahli tidak dijumpai");
      }
    } catch {
      const found = SAMPLE_MEMBERS.find(m => m.id === parseInt(id));
      found ? setMember(found) : setError("Ahli tidak dijumpai");
    } finally { setLoading(false); }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const payload = {
        ...member,
        wives: (member.wives ?? []).map(s => String(s).trim()).filter(Boolean),
        fivePActivities: (member.fivePActivities ?? []).map(s => String(s).trim()).filter(Boolean),
        age: parseInt(member.age, 10) || 0,
        marriedChildren: parseInt(member.marriedChildren, 10) || 0,
        unmarriedChildren: parseInt(member.unmarriedChildren, 10) || 0,
      };
      const response = await memberAPI.updateMember(id, payload, token);
      if (response.success) {
        setMember(response.data || { ...member, ...payload, lastUpdated: new Date().toISOString().split("T")[0] });
        setEditMode(false);
      } else { setError(response.error || "Gagal menyimpan"); }
    } catch { setError("Gagal menyimpan"); }
    finally { setSaving(false); }
  };

  const avgScore = member
    ? Math.round((member.struggleAssessment + member.familyManagementAssessment + member.welfareAssessment + member.fivePAssessment + member.complianceAssessment) / 5)
    : 0;

  /* ── Loading ── */
  if (loading) return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Geist', 'Inter', sans-serif" }}>
      <div style={{ textAlign:"center" }}>
        <div style={{ width:48, height:48, border:`3px solid ${T.border}`, borderTopColor:T.accent, borderRadius:"50%", margin:"0 auto 16px", animation:"spin 0.8s linear infinite" }}/>
        <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        <div style={{ color:T.muted, fontSize:"15px" }}>Memuatkan data ahli…</div>
      </div>
    </div>
  );

  /* ── Error ── */
  if (error || !member) return (
    <div style={{ minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Geist', 'Inter', sans-serif" }}>
      <div style={{ textAlign:"center", padding:48 }}>
        <div style={{ width:64, height:64, background:T.dangerBg, borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", margin:"0 auto 16px", fontSize:28 }}>⚠</div>
        <div style={{ fontSize:"16px", color:T.text, marginBottom:8, fontWeight:600 }}>Ralat</div>
        <div style={{ color:T.muted, marginBottom:24 }}>{error || "Ahli tidak dijumpai"}</div>
        <Btn onClick={() => navigate("/members")}>← Kembali ke senarai</Btn>
      </div>
    </div>
  );

  const tabs = [
    { id:"profile",    icon:"👤", label:"Profil" },
    { id:"life",       icon:"🏠", label:"Kehidupan" },
    { id:"assessment", icon:"📊", label:"Penilaian" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:T.bg, fontFamily:"'Geist', 'Inter', sans-serif" }}>

      {/* ── Top Nav Bar ── */}
      <div style={{ background:T.surface, borderBottom:`1px solid ${T.border}`, position:"sticky", top:0, zIndex:100 }}>
        <div style={{ maxWidth:1100, margin:"0 auto", padding: isMobile ? "0 16px" : "0 32px", height:60, display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div style={{ display:"flex", alignItems:"center", gap:12 }}>
            <Btn variant="ghost" size="sm" onClick={() => navigate("/members")}>← Kembali</Btn>
            <div style={{ width:1, height:24, background:T.border }}/>
            <div>
              <div style={{ fontSize:"15px", fontWeight:600, color:T.text }}>{member.husbandName}</div>
              <div style={{ fontSize:"11px", color:T.muted, letterSpacing:"0.04em" }}>MAKLUMAT BANCIAN</div>
            </div>
          </div>
          <div style={{ display:"flex", gap:8 }}>
            {editMode ? (
              <>
                <Btn variant="ghost" size="sm" onClick={() => { setEditMode(false); fetchMember(); }}>Batal</Btn>
                <Btn variant="primary" size="sm" onClick={handleSave}>
                  {saving ? "Menyimpan…" : "Simpan"}
                </Btn>
              </>
            ) : (
              <Btn variant="primary" size="sm" onClick={() => setEditMode(true)}>✏ Ubah</Btn>
            )}
          </div>
        </div>
      </div>

      <div style={{ maxWidth:1100, margin:"0 auto", padding: isMobile ? "24px 16px" : "32px 32px" }}>

        {/* ── Profile Hero Card ── */}
        <div style={{
          background:T.surface, borderRadius:T.radius, border:`1px solid ${T.border}`,
          boxShadow:T.shadow, padding: isMobile ? "24px" : "28px 32px",
          display:"flex", alignItems:"center", gap:24, marginBottom:24,
          flexWrap:"wrap",
        }}>
          {/* Avatar */}
          <div style={{
            width:64, height:64, borderRadius:"50%",
            background: `linear-gradient(135deg, ${T.accent}, #60A5FA)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:24, color:"#fff", fontWeight:700, flexShrink:0,
          }}>
            {member.husbandName.charAt(0)}
          </div>

          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:4 }}>
              <h1 style={{ margin:0, fontSize: isMobile?"20px":"24px", fontWeight:700, color:T.text }}>{member.husbandName}</h1>
              <span style={{
                padding:"3px 10px", borderRadius:99,
                fontSize:"12px", fontWeight:600,
                background: member.status === "active" ? T.successBg : T.dangerBg,
                color:       member.status === "active" ? T.success   : T.danger,
                border:`1px solid ${member.status === "active" ? "#BBF7D0" : "#FECACA"}`,
              }}>
                {statusMs(member.status)}
              </span>
            </div>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {[member.currentJob, member.district + (member.state ? ", " + member.state : ""), member.phone].filter(Boolean).map((v, i) => (
                <span key={i} style={{ fontSize:"13px", color:T.muted }}>{v}</span>
              ))}
            </div>
          </div>

          {/* Quick stats */}
          {!isMobile && (
            <div style={{ display:"flex", gap:24, flexShrink:0 }}>
              {[
                { label:"Umur", value: member.age ? `${member.age} thn` : "—" },
                { label:"Isteri", value: (member.wives ?? []).filter(Boolean).length || "—" },
                { label:"Anak", value: (member.marriedChildren ?? 0) + (member.unmarriedChildren ?? 0) },
                { label:"Skor purata", value: avgScore + "/5", color: scoreColor(avgScore) },
              ].map(({ label, value, color }) => (
                <div key={label} style={{ textAlign:"center" }}>
                  <div style={{ fontSize:"18px", fontWeight:700, color: color || T.text }}>{value}</div>
                  <div style={{ fontSize:"11px", color:T.muted, marginTop:2 }}>{label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Tabs ── */}
        <div style={{
          display:"flex", gap:4, marginBottom:20,
          background:T.surface, padding:4, borderRadius:T.radius,
          border:`1px solid ${T.border}`, boxShadow:T.shadow,
          width:"full-content",
        }}>
          {tabs.map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
              padding: isMobile ? "8px 14px" : "9px 20px",
              border:"none", borderRadius:"9px", cursor:"pointer",
              fontSize:"13px", fontWeight:500,
              display:"flex", alignItems:"center", gap:6,
              transition:"all .15s",
              background: activeTab === t.id ? T.accent : "transparent",
              color:       activeTab === t.id ? "#fff"   : T.muted,
            }}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── Tab Panel ── */}
        <div style={{ background:T.surface, borderRadius:T.radius, border:`1px solid ${T.border}`, boxShadow:T.shadow }}>

          {/* ────────── PROFIL ────────── */}
          {activeTab === "profile" && (
            <div style={{ padding: isMobile ? "24px" : "32px" }}>
              <SectionTitle>Maklumat Peribadi</SectionTitle>

              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap:20, marginBottom:28 }}>
                <Field label="1. Nama Suami">
                  {editMode ? <Input value={member.husbandName} onChange={e => setMember({...member, husbandName:e.target.value})}/> : member.husbandName}
                </Field>
                <Field label="2. Umur">
                  {editMode ? <Input type="number" value={member.age} onChange={e => setMember({...member, age:e.target.value})}/> : (member.age != null ? `${member.age} tahun` : "—")}
                </Field>
                <Field label="3. No. Telefon">
                  {editMode ? <Input type="tel" value={member.phone} onChange={e => setMember({...member, phone:e.target.value})}/> : member.phone}
                </Field>
                <Field label="9. Pekerjaan Sekarang">
                  {editMode ? <Input value={member.currentJob} onChange={e => setMember({...member, currentJob:e.target.value})}/> : member.currentJob}
                </Field>
                <Field label="4. Alamat Rumah">
                  {editMode ? <Input value={member.homeAddress} onChange={e => setMember({...member, homeAddress:e.target.value})}/> : member.homeAddress}
                </Field>
                <Field label="10. Nama Syarikat / Enterprise">
                  {editMode ? <Input value={member.companyName} onChange={e => setMember({...member, companyName:e.target.value})}/> : member.companyName}
                </Field>
                <Field label="5. Daerah">
                  {editMode ? <Input value={member.district} onChange={e => setMember({...member, district:e.target.value})}/> : member.district}
                </Field>
                <Field label="6. Negeri">
                  {editMode
                    ? <Select value={member.state} onChange={e => setMember({...member, state:e.target.value})}>
                        <option value="">— Pilih negeri —</option>
                        {MALAYSIA_STATE_OPTIONS.map(n => <option key={n} value={n}>{n}</option>)}
                      </Select>
                    : member.state
                  }
                </Field>
              </div>

              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap:20, marginBottom:28 }}>
                <Field label="7. Bilangan Anak (Sudah Berkahwin)">
                  {editMode ? <Input type="number" min="0" value={member.marriedChildren} onChange={e => setMember({...member, marriedChildren:e.target.value})}/> : member.marriedChildren ?? "—"}
                </Field>
                <Field label="8. Bilangan Anak (Belum Berkahwin)">
                  {editMode ? <Input type="number" min="0" value={member.unmarriedChildren} onChange={e => setMember({...member, unmarriedChildren:e.target.value})}/> : member.unmarriedChildren ?? "—"}
                </Field>
              </div>

              {/* Wives section */}
              <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:24 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <SectionTitle noMargin>Nama Isteri</SectionTitle>
                  {editMode && (
                    <Btn variant="ghost" size="sm" onClick={() => setMember({...member, wives:[...(member.wives??[]), ""]})}>
                      + Tambah isteri
                    </Btn>
                  )}
                </div>
                {editMode ? (
                  (member.wives ?? []).length > 0
                    ? <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {member.wives.map((w, i) => (
                          <div key={i} style={{ display:"flex", gap:8, alignItems:"center" }}>
                            <div style={{ fontSize:"12px", color:T.muted, minWidth:80 }}>Isteri {i+1}</div>
                            <Input value={w} onChange={e => { const ws=[...(member.wives??[])]; ws[i]=e.target.value; setMember({...member, wives:ws}); }} placeholder={`Nama isteri ${i+1}`}/>
                            <Btn variant="danger" size="sm" onClick={() => setMember({...member, wives:(member.wives??[]).filter((_,j)=>j!==i)})}>Buang</Btn>
                          </div>
                        ))}
                      </div>
                    : <EmptyState text="Tiada rekod isteri." />
                ) : (
                  (member.wives ?? []).filter(Boolean).length > 0
                    ? <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                        {(member.wives ?? []).filter(Boolean).map((w, i) => (
                          <div key={i} style={{ padding:"10px 14px", background:T.bg, borderRadius:T.radiusSm, fontSize:"14px", color:T.text }}>
                            <span style={{ color:T.muted, fontSize:"12px", marginRight:8 }}>Isteri {i+1}</span>{w}
                          </div>
                        ))}
                      </div>
                    : <div style={{ fontSize:"14px", color:T.muted }}>Tiada</div>
                )}
              </div>
            </div>
          )}

          {/* ────────── KEHIDUPAN ────────── */}
          {activeTab === "life" && (
            <div style={{ padding: isMobile ? "24px" : "32px", display:"flex", flexDirection:"column", gap:28 }}>
              <SectionTitle>Maklumat Kehidupan</SectionTitle>

              {[
                { key:"struggleUnderstanding",   num:1, title:"Kefahaman tentang Perjuangan", hint:"Adakah perjuangan masih ada / mencari kebenaran / masih hendakkan J atau tidak / RM." },
                { key:"familySituation",          num:2, title:"Kekeluargaan", hint:"Bagaimana proses baiki diri, keluarga / di mana anak-anak / pendidikan anak-anak bagaimana." },
                { key:"welfareStatus",            num:3, title:"Kebajikan", hint:"Bagaimana keadaan rumah / makan minum / sakit pening / hutang-hutang berkaitan GISBH." },
                { key:"complianceLevel",          num:5, title:"Pematuhan", hint:"Bagaimana kefahaman tentang pematuhan fatwa / pematuhan perniagaan." },
              ].map(({ key, num, title, hint }) => (
                <div key={key}>
                  <div style={{ marginBottom:10 }}>
                    <div style={{ fontSize:"15px", fontWeight:600, color:T.text, marginBottom:4 }}>{num}. {title}</div>
                    <div style={{ fontSize:"12px", color:T.muted, lineHeight:1.5 }}>{hint}</div>
                  </div>
                  {editMode
                    ? <Textarea value={member[key]} onChange={e => setMember({...member, [key]:e.target.value})}/>
                    : <div style={{ fontSize:"14px", color:T.text, lineHeight:1.7, background:T.bg, padding:"14px 16px", borderRadius:T.radiusSm }}>{member[key] || "—"}</div>
                  }
                </div>
              ))}

              {/* 5P */}
              <div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:10 }}>
                  <div>
                    <div style={{ fontSize:"15px", fontWeight:600, color:T.text, marginBottom:4 }}>4. 5P</div>
                    <div style={{ fontSize:"12px", color:T.muted }}>Perniagaan / pertanian / penternakan / perikanan / taugeh.</div>
                  </div>
                  {editMode && (
                    <Btn variant="ghost" size="sm" onClick={() => setMember({...member, fivePActivities:[...(member.fivePActivities??[]),""]})}>
                      + Tambah
                    </Btn>
                  )}
                </div>
                {editMode ? (
                  (member.fivePActivities ?? []).length > 0
                    ? <div style={{ display:"flex", flexDirection:"column", gap:8 }}>
                        {(member.fivePActivities ?? []).map((a, i) => (
                          <div key={i} style={{ display:"flex", gap:8, alignItems:"center" }}>
                            <Input value={a} onChange={e => { const arr=[...(member.fivePActivities??[])]; arr[i]=e.target.value; setMember({...member, fivePActivities:arr}); }} placeholder={`Aktiviti ${i+1}`}/>
                            <Btn variant="danger" size="sm" onClick={() => setMember({...member, fivePActivities:(member.fivePActivities??[]).filter((_,j)=>j!==i)})}>Buang</Btn>
                          </div>
                        ))}
                      </div>
                    : <EmptyState text="Tiada aktiviti. Klik &quot;+ Tambah&quot;." />
                ) : (
                  <div style={{ display:"flex", flexWrap:"wrap", gap:8 }}>
                    {(member.fivePActivities ?? []).filter(Boolean).length > 0
                      ? (member.fivePActivities ?? []).filter(Boolean).map((a, i) => (
                          <span key={i} style={{ padding:"6px 14px", background:T.accentSoft, color:T.accent, borderRadius:99, fontSize:"13px", fontWeight:500, border:`1px solid #BFDBFE` }}>{a}</span>
                        ))
                      : <span style={{ fontSize:"14px", color:T.muted }}>Tiada</span>
                    }
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ────────── PENILAIAN ────────── */}
          {activeTab === "assessment" && (
            <div style={{ padding: isMobile ? "24px" : "32px" }}>
              <SectionTitle>Bahagian C — Penilaian (Skor 1–5)</SectionTitle>
              <div style={{ fontSize:"13px", color:T.muted, marginBottom:24 }}>
                5 = Terbaik &nbsp;·&nbsp; 4 = Baik &nbsp;·&nbsp; 3 = Sederhana &nbsp;·&nbsp; 2 = Lemah &nbsp;·&nbsp; 1 = Paling tidak baik
              </div>

              <div style={{ display:"grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap:16, marginBottom:24 }}>
                {[
                  { key:"struggleAssessment",         label:"1. Kefahaman tentang perjuangan di era kini" },
                  { key:"familyManagementAssessment", label:"2. Menguruskan kekeluargaan mengikut Islam" },
                  { key:"welfareAssessment",          label:"3. Kebajikan, keperluan keluarga selesai" },
                  { key:"fivePAssessment",            label:"4. Kefahaman dan perlaksanaan 5P" },
                  { key:"complianceAssessment",       label:"5. Kefahaman tentang fatwa dan pematuhan undang-undang" },
                ].map(({ key, label }) => (
                  <ScoreCard
                    key={key}
                    label={label}
                    score={member[key]}
                    editMode={editMode}
                    onChange={v => setMember({...member, [key]:v})}
                  />
                ))}

                {/* Overall */}
                <div style={{
                  padding:20, borderRadius:T.radius,
                  background:`linear-gradient(135deg, ${T.accentSoft}, #EEF2FF)`,
                  border:`1px solid #BFDBFE`, boxShadow:T.shadow,
                  display:"flex", flexDirection:"column", gap:12,
                }}>
                  <div style={{ fontSize:"13px", fontWeight:600, color:T.accent }}>Purata Keseluruhan</div>
                  <div style={{ display:"flex", alignItems:"center", gap:14 }}>
                    <ScoreRing score={avgScore}/>
                    <div>
                      <div style={{ fontSize:"28px", fontWeight:700, color:scoreColor(avgScore) }}>
                        {avgScore}<span style={{ fontSize:"14px", color:T.muted, fontWeight:400 }}>/5</span>
                      </div>
                      <div style={{ fontSize:"13px", color:scoreColor(avgScore), fontWeight:600, marginTop:2 }}>{scoreLabel(avgScore)}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary */}
              <div style={{ borderTop:`1px solid ${T.border}`, paddingTop:24 }}>
                <div style={{ fontSize:"15px", fontWeight:600, color:T.text, marginBottom:12 }}>6. Rumusan</div>
                {editMode
                  ? <Textarea value={member.summary} onChange={e => setMember({...member, summary:e.target.value})} rows={5}/>
                  : <div style={{ fontSize:"14px", color:T.text, lineHeight:1.7, background:T.bg, padding:"14px 16px", borderRadius:T.radiusSm }}>{member.summary || "—"}</div>
                }
              </div>
            </div>
          )}
        </div>

        {/* ── Footer ── */}
        <div style={{ marginTop:16, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:8 }}>
          <span style={{ fontSize:"12px", color:T.muted }}>ID Ahli: #{member.id}</span>
          <span style={{ fontSize:"12px", color:T.muted }}>
            Sertai: {fmtDate(member.joinDate)} &nbsp;·&nbsp; Kemaskini: {fmtDate(member.lastUpdated)}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ─── Micro helpers ──────────────────────────────────────── */
const SectionTitle = ({ children, noMargin }) => (
  <h2 style={{
    margin: noMargin ? 0 : "0 0 20px 0",
    fontSize:"14px", fontWeight:700, color:T.muted,
    textTransform:"uppercase", letterSpacing:"0.07em",
  }}>{children}</h2>
);

const EmptyState = ({ text }) => (
  <div style={{
    padding:"20px", background:T.bg, borderRadius:T.radiusSm,
    border:`1.5px dashed ${T.border}`, textAlign:"center",
    fontSize:"13px", color:T.muted,
  }}>{text}</div>
);

export default MemberDetail;
