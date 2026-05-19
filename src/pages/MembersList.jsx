import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
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

const MALAYSIA_STATE_OPTIONS = [
  "PERLIS","KEDAH","P. PINANG","PERAK","SELANGOR","WP KL / PJ","WP LABUAN",
  "NEGERI SEMBILAN","MELAKA","JOHOR","PAHANG","TERENGGANU","KELANTAN","SABAH","SARAWAK",
];

const INITIAL_MEMBERS = [
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
    
    // Section B - Life Information
    struggleUnderstanding: "Still searching for truth, believes struggle continues",
    familySituation: "Children in local schools, working on self-improvement",
    welfareStatus: "House in good condition, some debts from previous operations",
    fivePActivities: ["Business", "Agriculture"],
    complianceLevel: "Good understanding of fatwa compliance",
    
    // Section C - Assessment
    struggleAssessment: 4,
    familyManagementAssessment: 3,
    welfareAssessment: 3,
    fivePAssessment: 4,
    complianceAssessment: 3,
    summary: "Active member with good business background, working on family welfare improvement",
    
    status: "active",
    joinDate: "2020-01-15",
    lastUpdated: "2024-05-10"
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
    
    // Section B - Life Information
    struggleUnderstanding: "Strong belief in continuing the struggle",
    familySituation: "Children in primary and secondary school, family-oriented",
    welfareStatus: "Moderate living conditions, minimal debt",
    fivePActivities: ["Agriculture", "Livestock"],
    complianceLevel: "High compliance with religious guidelines",
    
    // Section C - Assessment
    struggleAssessment: 5,
    familyManagementAssessment: 4,
    welfareAssessment: 3,
    fivePAssessment: 5,
    complianceAssessment: 5,
    summary: "Dedicated farmer with strong religious commitment, good family management",
    
    status: "active",
    joinDate: "2019-06-20",
    lastUpdated: "2024-05-08"
  },
  {
    id: 3,
    husbandName: "Rashid bin Rahman",
    age: 52,
    phone: "+60123456791",
    homeAddress: "No. 789, Jalan Industri, Bandar Baru",
    district: "Shah Alam",
    state: "Selangor",
    wives: ["Siti Aishah binti Abdul", "Khadijah binti Mohammad", "Zainab binti Hassan"],
    marriedChildren: 4,
    unmarriedChildren: 1,
    currentJob: "Contractor",
    companyName: "Rashid Construction & Trading",
    
    // Section B - Life Information
    struggleUnderstanding: "Uncertain about current direction, seeking clarity",
    familySituation: "Mixed family situation, some children married and working",
    welfareStatus: "Good housing condition, significant debts from business",
    fivePActivities: ["Business", "Construction"],
    complianceLevel: "Moderate compliance, needs improvement",
    
    // Section C - Assessment
    struggleAssessment: 2,
    familyManagementAssessment: 3,
    welfareAssessment: 2,
    fivePAssessment: 3,
    complianceAssessment: 2,
    summary: "Experienced contractor facing financial challenges, needs guidance and support",
    
    status: "inactive",
    joinDate: "2018-03-10",
    lastUpdated: "2024-04-15"
  },
  {
    id: 4,
    husbandName: "Zainal bin Karim",
    age: 41,
    phone: "+60123456792",
    homeAddress: "No. 321, Jalan Permai, Taman Sentosa",
    district: "Petaling Jaya",
    state: "Selangor",
    wives: ["Mariam binti Sulaiman"],
    marriedChildren: 2,
    unmarriedChildren: 2,
    currentJob: "Fisherman",
    companyName: "Zainal Fishing Enterprise",
    
    // Section B - Life Information
    struggleUnderstanding: "Committed to the cause, active participant",
    familySituation: "Stable family, children doing well in education",
    welfareStatus: "Basic living conditions, no significant debt",
    fivePActivities: ["Fishing", "Agriculture"],
    complianceLevel: "High level of compliance",
    
    // Section C - Assessment
    struggleAssessment: 4,
    familyManagementAssessment: 4,
    welfareAssessment: 3,
    fivePAssessment: 4,
    complianceAssessment: 4,
    summary: "Dedicated fisherman with strong family values and good compliance",
    
    status: "active",
    joinDate: "2021-02-28",
    lastUpdated: "2024-05-12"
  },
  {
    id: 5,
    husbandName: "Ismail bin Bakar",
    age: 48,
    phone: "+60123456793",
    homeAddress: "No. 654, Jalan Utama, Bandar Baru",
    district: "Klang",
    state: "Selangor",
    wives: ["Aminah binti Rahman", "Salwah binti Ismail", "Nurul binti Hassan", "Siti binti Mohammad"],
    marriedChildren: 5,
    unmarriedChildren: 3,
    currentJob: "Business Owner",
    companyName: "Ismail Trading Group",
    
    // Section B - Life Information
    struggleUnderstanding: "Very committed, strong leadership qualities",
    familySituation: "Large family, managing well despite challenges",
    welfareStatus: "Good living standards, some business-related debt",
    fivePActivities: ["Business", "Agriculture", "Livestock"],
    complianceLevel: "Excellent compliance and understanding",
    
    // Section C - Assessment
    struggleAssessment: 5,
    familyManagementAssessment: 4,
    welfareAssessment: 4,
    fivePAssessment: 5,
    complianceAssessment: 5,
    summary: "Strong leader with large family, excellent business acumen and high compliance",
    
    status: "active",
    joinDate: "2017-11-15",
    lastUpdated: "2024-05-11"
  }
];

const scoreColor = (s) => (s >= 4 ? T.success : s >= 3 ? T.warn : T.danger);
const scoreBg = (s) => (s >= 4 ? T.successBg : s >= 3 ? T.warnBg : T.dangerBg);
const fmtDate = (d) =>
  d
    ? new Date(d).toLocaleDateString("ms-MY", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";
const statusMs = (s) => ({ active: "Aktif", inactive: "Tidak aktif", pending: "Menunggu" }[s] ?? s ?? "—");

const Input = ({ value, onChange, type = "text", ...rest }) => (
  <input
    type={type}
    value={value ?? ""}
    onChange={onChange}
    style={{
      width: "100%",
      padding: "9px 12px",
      border: `1.5px solid ${T.border}`,
      borderRadius: T.radiusSm,
      fontSize: "14px",
      color: T.text,
      background: "#fff",
      outline: "none",
      boxSizing: "border-box",
      transition: "border-color .15s",
    }}
    onFocus={(e) => (e.target.style.borderColor = T.accent)}
    onBlur={(e) => (e.target.style.borderColor = T.border)}
    {...rest}
  />
);

const Select = ({ value, onChange, children }) => (
  <select
    value={value ?? ""}
    onChange={onChange}
    style={{
      width: "100%",
      padding: "9px 12px",
      border: `1.5px solid ${T.border}`,
      borderRadius: T.radiusSm,
      fontSize: "14px",
      color: T.text,
      background: "#fff",
      outline: "none",
      boxSizing: "border-box",
      appearance: "auto",
    }}
  >
    {children}
  </select>
);

const Btn = ({ children, onClick, variant = "primary", size = "md", style: extra = {}, disabled }) => {
  const base = {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    border: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    fontFamily: "inherit",
    fontWeight: 500,
    borderRadius: T.radiusSm,
    transition: "all .15s",
    opacity: disabled ? 0.6 : 1,
    ...extra,
  };
  const sizes = {
    sm: { padding: "6px 12px", fontSize: "13px" },
    md: { padding: "9px 18px", fontSize: "14px" },
  };
  const variants = {
    primary: { background: T.accent, color: "#fff" },
    ghost: { background: "transparent", color: T.muted, border: `1.5px solid ${T.border}` },
    orange: { background: T.warnBg, color: T.warn, border: "1.5px solid #FDE68A" },
  };
  return (
    <button onClick={onClick} style={{ ...base, ...sizes[size], ...variants[variant] }} disabled={disabled}>
      {children}
    </button>
  );
};

const ScoreRing = ({ score }) => {
  const r = 18;
  const circ = 2 * Math.PI * r;
  const pct = (score / 5) * circ;
  const col = scoreColor(score);
  return (
    <svg width="52" height="52" style={{ flexShrink: 0 }}>
      <circle cx="26" cy="26" r={r} fill="none" stroke={T.border} strokeWidth="4" />
      <circle
        cx="26"
        cy="26"
        r={r}
        fill="none"
        stroke={col}
        strokeWidth="4"
        strokeDasharray={`${pct} ${circ}`}
        strokeLinecap="round"
        transform="rotate(-90 26 26)"
        style={{ transition: "stroke-dasharray .4s ease" }}
      />
      <text x="26" y="31" textAnchor="middle" fontSize="13" fontWeight="700" fill={col}>
        {score}
      </text>
    </svg>
  );
};

const EmptyState = ({ title, desc, actionLabel, onAction }) => (
  <div
    style={{
      textAlign: "center",
      padding: "40px 24px",
      background: T.surface,
      borderRadius: T.radius,
      border: `1px solid ${T.border}`,
      boxShadow: T.shadow,
    }}
  >
    <div style={{ width: 64, height: 64, background: T.bg, borderRadius: "50%", margin: "0 auto 14px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>
      👥
    </div>
    <div style={{ fontSize: "16px", color: T.text, fontWeight: 700, marginBottom: 8 }}>{title}</div>
    {desc ? <div style={{ fontSize: "14px", color: T.muted, marginBottom: 18 }}>{desc}</div> : null}
    {actionLabel ? <Btn onClick={onAction}>{actionLabel}</Btn> : null}
  </div>
);

const LoadingBlock = ({ text = "Memuatkan…" }) => (
  <div style={{ padding: 28, display: "flex", alignItems: "center", justifyContent: "center" }}>
    <div style={{ textAlign: "center" }}>
      <div
        style={{
          width: 42,
          height: 42,
          border: `3px solid ${T.border}`,
          borderTopColor: T.accent,
          borderRadius: "50%",
          margin: "0 auto 14px",
          animation: "spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <div style={{ color: T.muted, fontSize: "14px" }}>{text}</div>
    </div>
  </div>
);

function MembersList() {
  const { isMobile } = useResponsive();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [hoveredId, setHoveredId] = useState(null);
  const navigate = useNavigate();

  const fetchMembers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem("token");
      const response = await memberAPI.getMembers(token);
      
      if (response.success) {
        setMembers(response.data);
      } else {
        setError(response.error || "Gagal memuatkan senarai ahli");
        setMembers(INITIAL_MEMBERS);
      }
    } catch {
      setError("Gagal menyambung ke pelayan");
      setMembers(INITIAL_MEMBERS);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      fetchMembers();
    }, 0);
    return () => clearTimeout(t);
  }, [fetchMembers]);

  const handleMemberClick = (member) => {
    navigate(`/member-detail/${member.id}`);
  };

  // Filter members based on search and filters
  const filteredMembers = members.filter((member) => {
    const name = (member.husbandName || "").toLowerCase();
    const job = (member.currentJob || "").toLowerCase();
    const phone = member.phone || "";
    const matchesSearch =
      name.includes(searchTerm.toLowerCase()) ||
      phone.includes(searchTerm) ||
      job.includes(searchTerm.toLowerCase());
    const matchesState = !filterState || member.state === filterState;
    const matchesStatus = !filterStatus || member.status === filterStatus;
    
    return matchesSearch && matchesState && matchesStatus;
  });

  const stateOptions = useMemo(() => {
    const set = new Set((members ?? []).map((m) => m.state).filter(Boolean));
    return Array.from(set).sort((a, b) => String(a).localeCompare(String(b)));
  }, [members]);

  const stats = useMemo(() => {
    const total = members.length;
    const active = members.filter((m) => m.status === "active").length;
    const kids = members.reduce((acc, m) => acc + ((m.marriedChildren ?? 0) + (m.unmarriedChildren ?? 0)), 0);
    const states = new Set(members.map((m) => m.state).filter(Boolean)).size;
    return { total, active, kids, states };
  }, [members]);

  return (
    <div style={{ minHeight: "100vh", background: T.bg, fontFamily: "'Geist', 'Inter', sans-serif" }}>
      <div style={{ background: T.surface, borderBottom: `1px solid ${T.border}`, position: "sticky", top: 0, zIndex: 100 }}>
        <div
          style={{
            maxWidth: 1100,
            margin: "0 auto",
            padding: isMobile ? "0 16px" : "0 32px",
            height: 60,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: "15px", fontWeight: 700, color: T.text }}>Pengurusan Ahli</div>
            {!isMobile ? <div style={{ fontSize: "11px", color: T.muted, letterSpacing: "0.04em" }}>URUS PROFIL AHLI & MAKLUMAT KEAHLIAN</div> : null}
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <Btn variant="ghost" size="sm" onClick={() => navigate("/home")}>
              ← Kembali
            </Btn>
            <Btn size="sm" onClick={() => navigate("/members/add")}>
              + Daftar ahli
            </Btn>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: isMobile ? "24px 16px" : "32px 32px" }}>
        {error ? (
          <div
            style={{
              background: T.warnBg,
              border: "1px solid #FDE68A",
              borderRadius: T.radius,
              padding: "14px 16px",
              boxShadow: T.shadow,
              marginBottom: 16,
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <div style={{ color: T.warn, fontSize: "14px", fontWeight: 600 }}>{error}</div>
            <Btn variant="orange" size="sm" onClick={fetchMembers} disabled={loading}>
              {loading ? "Memuatkan…" : "Cuba lagi"}
            </Btn>
          </div>
        ) : null}

        <div
          style={{
            background: T.surface,
            borderRadius: T.radius,
            border: `1px solid ${T.border}`,
            boxShadow: T.shadow,
            padding: isMobile ? "18px" : "22px",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.2fr 0.9fr 0.9fr", gap: 14 }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: T.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                Carian
              </div>
              <Input value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Nama, telefon, pekerjaan…" />
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: T.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                Negeri
              </div>
              <Select value={filterState} onChange={(e) => setFilterState(e.target.value)}>
                <option value="">Semua negeri</option>
                {stateOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <div style={{ fontSize: "11px", fontWeight: 700, color: T.muted, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 6 }}>
                Status
              </div>
              <Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="">Semua status</option>
                <option value="active">Aktif</option>
                <option value="inactive">Tidak aktif</option>
                <option value="pending">Menunggu</option>
              </Select>
            </div>
          </div>
        </div>

        <div
          style={{
            background: T.surface,
            borderRadius: T.radius,
            border: `1px solid ${T.border}`,
            boxShadow: T.shadow,
            padding: isMobile ? "18px" : "22px",
            marginBottom: 18,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div style={{ fontSize: "14px", fontWeight: 700, color: T.muted, textTransform: "uppercase", letterSpacing: "0.07em" }}>Ringkasan</div>
            <div style={{ fontSize: "12px", color: T.muted }}>
              Dikemas kini: {members.length ? fmtDate(new Date().toISOString()) : "—"}
            </div>
          </div>
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", gap: 14 }}>
            {[
              { label: "Jumlah ahli", value: stats.total, color: T.accent },
              { label: "Ahli aktif", value: stats.active, color: T.success },
              { label: "Jumlah anak", value: stats.kids, color: T.warn },
              { label: "Bilangan negeri", value: stats.states, color: T.text },
            ].map((s) => (
              <div key={s.label} style={{ padding: "14px 12px", background: T.bg, borderRadius: T.radiusSm, border: `1px solid ${T.border}` }}>
                <div style={{ fontSize: "18px", fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: "12px", color: T.muted, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2, minmax(0, 1fr))", gap: 16 }}>
          {loading ? (
            <div style={{ gridColumn: "1 / -1" }}>
              <LoadingBlock text="Memuatkan senarai ahli…" />
            </div>
          ) : (
            filteredMembers.map((member) => {
              const avg = Math.round(
                ((member.struggleAssessment ?? 0) +
                  (member.familyManagementAssessment ?? 0) +
                  (member.welfareAssessment ?? 0) +
                  (member.fivePAssessment ?? 0) +
                  (member.complianceAssessment ?? 0)) /
                  5
              );
              const hovered = hoveredId === member.id;
              const statusVariant =
                member.status === "active"
                  ? { bg: T.successBg, color: T.success, border: "#BBF7D0" }
                  : member.status === "pending"
                    ? { bg: T.warnBg, color: T.warn, border: "#FDE68A" }
                    : { bg: T.dangerBg, color: T.danger, border: "#FECACA" };

              return (
                <div
                  key={member.id}
                  onClick={() => handleMemberClick(member)}
                  onMouseEnter={() => setHoveredId(member.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  style={{
                    background: T.surface,
                    borderRadius: T.radius,
                    border: `1px solid ${T.border}`,
                    boxShadow: hovered ? T.shadowMd : T.shadow,
                    padding: isMobile ? "18px" : "20px",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                    transition: "box-shadow .15s, transform .15s",
                    transform: hovered ? "translateY(-1px)" : "translateY(0)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 4 }}>
                        <div style={{ fontSize: "16px", fontWeight: 800, color: T.text, lineHeight: 1.2, wordBreak: "break-word" }}>
                          {member.husbandName || "—"}
                        </div>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 99,
                            fontSize: "12px",
                            fontWeight: 700,
                            background: statusVariant.bg,
                            color: statusVariant.color,
                            border: `1px solid ${statusVariant.border}`,
                          }}
                        >
                          {statusMs(member.status)}
                        </span>
                      </div>
                      <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                        {[member.currentJob, [member.district, member.state].filter(Boolean).join(", "), member.phone]
                          .filter(Boolean)
                          .map((v, i) => (
                            <span key={i} style={{ fontSize: "13px", color: T.muted }}>
                              {v}
                            </span>
                          ))}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                      <ScoreRing score={avg} />
                      {!isMobile ? (
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "12px", color: T.muted, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Purata</div>
                          <div style={{ fontSize: "16px", fontWeight: 800, color: scoreColor(avg) }}>{avg}/5</div>
                        </div>
                      ) : null}
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginTop: 16 }}>
                    {[
                      { label: "Umur", value: member.age != null ? `${member.age} thn` : "—" },
                      { label: "Isteri", value: (member.wives ?? []).filter(Boolean).length || "—" },
                      { label: "Anak", value: (member.marriedChildren ?? 0) + (member.unmarriedChildren ?? 0) },
                    ].map((it) => (
                      <div key={it.label} style={{ padding: "10px 12px", background: T.bg, borderRadius: T.radiusSm, border: `1px solid ${T.border}` }}>
                        <div style={{ fontSize: "11px", fontWeight: 700, color: T.muted, letterSpacing: "0.06em", textTransform: "uppercase" }}>{it.label}</div>
                        <div style={{ marginTop: 4, fontSize: "14px", fontWeight: 700, color: T.text }}>{it.value}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginTop: 12, display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {[
                      { label: "Perjuangan", v: member.struggleAssessment ?? 0 },
                      { label: "Keluarga", v: member.familyManagementAssessment ?? 0 },
                      { label: "Kebajikan", v: member.welfareAssessment ?? 0 },
                      { label: "5P", v: member.fivePAssessment ?? 0 },
                      { label: "Pematuhan", v: member.complianceAssessment ?? 0 },
                    ].map((s) => (
                      <span
                        key={s.label}
                        style={{
                          padding: "5px 10px",
                          borderRadius: 99,
                          fontSize: "12px",
                          fontWeight: 700,
                          background: scoreBg(s.v),
                          color: scoreColor(s.v),
                          border: `1px solid ${T.border}`,
                        }}
                      >
                        {s.label}: {s.v}/5
                      </span>
                    ))}
                  </div>

                  <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                    <span style={{ fontSize: "12px", color: T.muted }}>Sertai: {fmtDate(member.joinDate)}</span>
                    <span style={{ fontSize: "12px", color: T.muted }}>Kemaskini: {fmtDate(member.lastUpdated)}</span>
                  </div>

                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "rgba(37, 99, 235, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      opacity: hovered ? 1 : 0,
                      transition: "opacity .15s",
                      pointerEvents: "none",
                    }}
                  >
                    <div style={{ background: T.accent, color: "#fff", padding: "10px 18px", borderRadius: T.radiusSm, fontSize: "14px", fontWeight: 700 }}>
                      Lihat butiran
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {!loading && filteredMembers.length === 0 ? (
          <div style={{ marginTop: 16 }}>
            <EmptyState
              title="Tiada ahli dijumpai"
              desc={searchTerm || filterState || filterStatus ? "Cuba laraskan penapis atau kata carian." : "Mula dengan mendaftarkan ahli pertama."}
              actionLabel="Daftar ahli"
              onAction={() => navigate("/members/add")}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default MembersList;
