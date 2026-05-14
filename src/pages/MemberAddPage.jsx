import { useState, useEffect } from "react";
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

const emptyForm = () => ({
  husbandName: "",
  age: "",
  phone: "",
  homeAddress: "",
  district: "",
  state: "",
  wives: [],
  marriedChildren: 0,
  unmarriedChildren: 0,
  currentJob: "",
  companyName: "",
  status: "active",
});

const MALAYSIA_STATE_OPTIONS = [
  "PERLIS",
  "KEDAH",
  "P. PINANG",
  "PERAK",
  "SELANGOR",
  "WP KL / PJ",
  "WP LABUAN",
  "NEGERI SEMBILAN",
  "MELAKA",
  "JOHOR",
  "PAHANG",
  "TERENGGANU",
  "KELANTAN",
  "SABAH",
  "SARAWAK",
];

function MemberAddPage() {
  const { isMobile } = useResponsive();
  const navigate = useNavigate();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const grid2 = { display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px", marginBottom: "16px" };

  const handleSubmit = async () => {
    if (!form.husbandName.trim() || !form.phone.trim()) {
      setError("Nama suami dan no. telefon wajib diisi.");
      return;
    }
    setError(null);
    setSaving(true);
    try {
      const wivesNormalized = (form.wives ?? [])
        .map((s) => String(s).trim())
        .filter(Boolean);
      const memberData = {
        ...form,
        age: parseInt(form.age, 10) || 0,
        marriedChildren: parseInt(form.marriedChildren, 10) || 0,
        unmarriedChildren: parseInt(form.unmarriedChildren, 10) || 0,
        wives: wivesNormalized,
        struggleUnderstanding: "",
        familySituation: "",
        welfareStatus: "",
        fivePActivities: [],
        complianceLevel: "",
        struggleAssessment: 3,
        familyManagementAssessment: 3,
        welfareAssessment: 3,
        fivePAssessment: 3,
        complianceAssessment: 3,
        summary: "",
      };

      const token = localStorage.getItem("token");
      const response = await memberAPI.createMember(token, memberData);

      if (response.success) {
        const newId = response.memberId ?? response.data?.id;
        if (newId != null) {
          navigate(`/member-detail/${newId}`);
        } else {
          navigate("/members");
        }
      } else {
        setError(response.error || "Gagal mendaftar ahli");
      }
    } catch (err) {
      console.error("Error adding member:", err);
      setError("Gagal mendaftar ahli");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'DM Sans', sans-serif" }}>
      <div
        style={{
          backgroundColor: "white",
          padding: isMobile ? "16px" : "24px",
          borderBottom: "1px solid #e0e0e0",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            maxWidth: "720px",
            margin: "0 auto",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              type="button"
              onClick={() => navigate("/members")}
              style={{
                backgroundColor: "transparent",
                color: "#666",
                border: "1px solid #ddd",
                padding: "8px 16px",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              ← Kembali
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: isMobile ? "22px" : "28px", fontWeight: 600, color: "#333" }}>
                Daftar ahli baharu
              </h1>
              <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#666" }}>Isi maklumat asas profil ahli</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ padding: isMobile ? "16px" : "24px", maxWidth: "720px", margin: "0 auto" }}>
        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              border: "1px solid #ffcdd2",
              borderRadius: "8px",
              padding: "12px 16px",
              marginBottom: "16px",
              color: "#c62828",
              fontSize: "14px",
            }}
          >
            {error}
          </div>
        )}

        <div
          style={{
            backgroundColor: "white",
            borderRadius: "12px",
            padding: isMobile ? "20px" : "28px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
          }}
        >
          <div style={grid2}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Nama suami *
              </label>
              <input
                type="text"
                value={form.husbandName}
                onChange={(e) => setForm({ ...form, husbandName: e.target.value })}
                placeholder="Masukkan nama penuh"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Umur
              </label>
              <input
                type="number"
                value={form.age}
                onChange={(e) => setForm({ ...form, age: e.target.value })}
                placeholder="Umur (tahun)"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={grid2}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                No. telefon *
              </label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Contoh: +60123456789"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Daerah
              </label>
              <input
                type="text"
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                placeholder="Masukkan daerah"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
              Alamat rumah
            </label>
            <input
              type="text"
              value={form.homeAddress}
              onChange={(e) => setForm({ ...form, homeAddress: e.target.value })}
              placeholder="Alamat penuh"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={grid2}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Negeri
              </label>
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              >
                <option value="">— Pilih negeri —</option>
                {MALAYSIA_STATE_OPTIONS.map((negeri) => (
                  <option key={negeri} value={negeri}>{negeri}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Pekerjaan sekarang
              </label>
              <input
                type="text"
                value={form.currentJob}
                onChange={(e) => setForm({ ...form, currentJob: e.target.value })}
                placeholder="Jawatan atau pekerjaan"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
              Nama syarikat perniagaan / enterprise
            </label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              placeholder="Nama syarikat atau perniagaan"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          <div style={grid2}>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Bil. anak (sudah berkahwin)
              </label>
              <input
                type="number"
                value={form.marriedChildren}
                onChange={(e) => setForm({ ...form, marriedChildren: e.target.value })}
                placeholder="0"
                min="0"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Bil. anak (belum berkahwin)
              </label>
              <input
                type="number"
                value={form.unmarriedChildren}
                onChange={(e) => setForm({ ...form, unmarriedChildren: e.target.value })}
                placeholder="0"
                min="0"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  boxSizing: "border-box",
                }}
              />
            </div>
          </div>

          <div style={{ marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>Nama isteri</label>
              <button
                type="button"
                onClick={() => {
                  const wives = form.wives ?? [];
                  setForm({ ...form, wives: [...wives, ""] });
                }}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: "pointer",
                }}
              >
                + Tambah isteri
              </button>
            </div>

            {form.wives && form.wives.length > 0 ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {form.wives.map((wife, index) => (
                  <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                    <input
                      type="text"
                      value={wife}
                      onChange={(e) => {
                        const wives = [...(form.wives ?? [])];
                        wives[index] = e.target.value;
                        setForm({ ...form, wives });
                      }}
                      placeholder={`Nama isteri ${index + 1}`}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        fontSize: "13px",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const wives = (form.wives ?? []).filter((_, i) => i !== index);
                        setForm({ ...form, wives });
                      }}
                      style={{
                        backgroundColor: "#f44336",
                        color: "white",
                        border: "none",
                        padding: "8px 12px",
                        borderRadius: "6px",
                        fontSize: "12px",
                        cursor: "pointer",
                      }}
                    >
                      Buang
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div
                style={{
                  padding: "16px",
                  backgroundColor: "#f8f9fa",
                  borderRadius: "8px",
                  border: "1px dashed #ccc",
                  textAlign: "center",
                  color: "#999",
                  fontSize: "13px",
                }}
              >
                Tiada rekod isteri. Klik &quot;+ Tambah isteri&quot; untuk mengisi.
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={() => navigate("/members")}
              style={{
                backgroundColor: "transparent",
                color: "#666",
                border: "1px solid #ddd",
                padding: "12px 24px",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Batal
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={saving}
              style={{
                backgroundColor: saving ? "#90caf9" : "#1976d2",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: saving ? "not-allowed" : "pointer",
              }}
            >
              {saving ? "Menyimpan…" : "Daftar ahli"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberAddPage;
