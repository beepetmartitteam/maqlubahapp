import { useState, useMemo } from "react";

const INITIAL_FOLDERS = [
  {
    id: "S13",
    label: "📁 S13",
    color: "#0F6E56",
    members: ["TC","TFY","TAA","THAH","MSMN","AL","E ZAHID","E SAYUTI","E ABU","E FAJRUL","P AZURA"],
    amounts: Array(11).fill(0),
  },
  {
    id: "MKN",
    label: "📁 MKN ++",
    color: "#185FA5",
    members: ["T ABIL","T FATEH","TN SYARIF","TN WAJI","E KHUSAIRI","T NHAZANI","TN ANUAR","TN HAMDI","TN FIDA"],
    amounts: [100,0,0,0,0,100,0,0],
  },
  {
    id: "MUSLIMAH",
    label: "📁 MUSLIMAH",
    color: "#993556",
    members: ["PN KAKAK","P KHAULAH","PN QAYAH","C YAH"],
    amounts: Array(4).fill(0),
  },
  {
    id: "L_LELAKI",
    label: "📁 LAIN² LELAKI",
    color: "#854F0B",
    members: ["T ABBAD","PAK NANANG","EN NIK H","EN ABE THAI","TN MAAROF","EN P WAHAB","EN IKRIMAH","AM KAMIL","T AMIN","HJ KUDUS","EN YUSNIZA","EN ALI HASAN","EN AROBI","EN KHALID","EN JAFAR","TN RIDWAN"],
    amounts: [0,0,0,0,0,0,100,0,0,0,0,0,0,100,200],
  },
  {
    id: "L_MUSLIMAH",
    label: "📁 LAIN2 MUSLIMAH",
    color: "#72243E",
    members: ["C AZIE","C K NGAH","C SAKINAH","C ASILAH","C Ita","C YATI","C (OM)","C HAFIZAH","C SAL","C FAH","I GINA"],
    amounts: [0,0,0,0,0,100,0,0,0,0],
  },
  {
    id: "KOMUNITI",
    label: "📁 KOMUNITI",
    color: "#534AB7",
    members: ["APS","AMCA","DUNGUN","LB","PERAK"],
    amounts: Array(5).fill(0),
  },
];

//const QUICK_AMOUNTS = [50, 100, 200];

const QUICK_AMOUNTS = [50, 100];
function JualanSabunMinimal() {
  const [folders, setFolders] = useState(INITIAL_FOLDERS);
  const [activeTab, setActiveTab] = useState(0);
  const [newMemberName, setNewMemberName] = useState("");
  const [previewOpen, setPreviewOpen] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);

  const updateAmount = (fi, mi, val) => {
    const v = Math.max(0, parseInt(val) || 0);
    setFolders(prev => {
      const next = prev.map((f, i) => {
        if (i !== fi) return f;
        const amounts = [...f.amounts];
        amounts[mi] = v;
        return { ...f, amounts };
      });
      return next;
    });
  };

  const addMember = (fi) => {
    const name = newMemberName.trim();
    if (!name) return;
    setFolders(prev =>
      prev.map((f, i) =>
        i !== fi
          ? f
          : { ...f, members: [...f.members, name], amounts: [...f.amounts, 0] }
      )
    );
    setNewMemberName("");
  };

  const resetAll = () => {
    setFolders(INITIAL_FOLDERS.map(f => ({ ...f, amounts: Array(f.members.length).fill(0) })));
    setResetDialog(false);
    alert("Data berjaya diset semula");
  };

  const folderTotal = (f) => f.amounts.reduce((a, b) => a + b, 0);
  const grandTotal = useMemo(() => folders.reduce((a, f) => a + folderTotal(f), 0), [folders]);
  const totalAhli = useMemo(() => folders.reduce((a, f) => a + f.members.length, 0), [folders]);
  const totalBayar = useMemo(() => folders.reduce((a, f) => a + f.amounts.filter(x => x > 0).length, 0), [folders]);

  const buildText = () => {
    const lines = ["🗓️ *JUALAN SABUN MEI 2026*", ""];
    folders.forEach(f => {
      lines.push(`*${f.label}*`);
      f.members.forEach((m, i) => {
        const amt = f.amounts[i];
        lines.push(`${i + 1}. ${m.padEnd(16)} ${amt > 0 ? "RM " + amt : "—"}`);
      });
      lines.push(`KEMASUKAN : RM ${folderTotal(f).toLocaleString()}`);
      lines.push("=================");
    });
    lines.push(`\n*JUMLAH : RM ${grandTotal.toLocaleString()}*`);
    return lines.join("\n");
  };

  const copyText = () => {
    navigator.clipboard.writeText(buildText());
    alert("Rekap disalin ke clipboard");
  };

  const shareWA = () => {
    window.open("https://wa.me/?text=" + encodeURIComponent(buildText()), "_blank");
  };

  const activeFolder = folders[activeTab];
  const activeFolderTotal = folderTotal(activeFolder);
  const activePaid = activeFolder.amounts.filter(x => x > 0).length;

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#F7FAF9", padding: "16px", fontFamily: "'DM Sans', sans-serif",fontSize: "20px" }}>
      <div style={{ maxWidth: "680px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ color: "#0F6E56", margin: "0 0 8px 0", fontSize: "24px", fontWeight: 600 }}>
            🧼 Jualan Sabun
          </h1>
          <p style={{ color: "#666", margin: 0, fontSize: "14px" }}>
            Mei 2026 · Rekod kemasukan bulanan
          </p>
        </div>

        {/* Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "12px", marginBottom: "24px" }}>
          <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", border: "1px solid #E8F0ED" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Jumlah Ahli</div>
            <div style={{ fontSize: "20px", color: "#0F6E56", fontWeight: 600 }}>{totalAhli}</div>
          </div>
          <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", border: "1px solid #E8F0ED" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Sudah Bayar</div>
            <div style={{ fontSize: "20px", color: "#0F6E56", fontWeight: 600 }}>{totalBayar}</div>
          </div>
          <div style={{ backgroundColor: "white", padding: "12px", borderRadius: "8px", border: "1px solid #E8F0ED" }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Kemasukan (RM)</div>
            <div style={{ fontSize: "20px", color: "#0F6E56", fontWeight: 600 }}>{grandTotal.toLocaleString()}</div>
          </div>
        </div>

        {/* Folder Tabs */}
        <div style={{ backgroundColor: "white", borderRadius: "8px", border: "1px solid #E8F0ED", marginBottom: "16px" }}>
          <div style={{ display: "flex", borderBottom: "1px solid #E8F0ED", overflowX: "auto" }}>
            {folders.map((f, i) => {
              const paid = f.amounts.filter(x => x > 0).length;
              return (
                <button
                  key={f.id}
                  onClick={() => setActiveTab(i)}
                  style={{
                    padding: "12px 18px",
                    border: "none",
                    backgroundColor: activeTab === i ? f.color + "20" : "transparent",
                    color: activeTab === i ? f.color : "#666",
                    fontSize: "12px",
                    fontWeight: 500,
                    cursor: "pointer",
                    borderBottom: activeTab === i ? `2px solid ${f.color}` : "none",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <span>{f.label.replace("📁 ", "")}</span>
                  {paid > 0 && (
                    <span style={{
                      backgroundColor: f.color + "22",
                      color: f.color,
                      padding: "2px 5px",
                      borderRadius: "4px",
                      fontSize: "10px",
                      fontWeight: 500
                    }}>
                      {paid}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Folder Header */}
          <div style={{
            padding: "16px",
            backgroundColor: activeFolder.color + "0D",
            borderBottom: "1px solid #E8F0ED",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between"
          }}>
            <div style={{ color: activeFolder.color, fontSize: "14px", fontWeight: 500 }}>
              {activeFolder.label}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{
                backgroundColor: activeFolder.color + "20",
                color: activeFolder.color,
                padding: "4px 8px",
                borderRadius: "4px",
                fontSize: "11px",
                fontWeight: 500
              }}>
                {activePaid}/{activeFolder.members.length} bayar
              </span>
              <span style={{ color: activeFolder.color, fontSize: "14px", fontWeight: 500 }}>
                RM {activeFolderTotal.toLocaleString()}
              </span>
            </div>
          </div>

          {/* Member Rows */}
          <div>
            {activeFolder.members.map((name, mi) => {
              const amt = activeFolder.amounts[mi];
              const paid = amt > 0;
              return (
                <div
                  key={mi}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    padding: "12px 16px",
                    borderBottom: "1px solid #E8F0ED",
                    backgroundColor: paid ? activeFolder.color + "06" : "transparent"
                  }}
                >
                  <span style={{ color: "#999", fontSize: "12px", minWidth: "20px", textAlign: "right" }}>
                    {mi + 1}.
                  </span>

                  <span style={{ fontSize: "16px", color: paid ? activeFolder.color : "#ccc" }}>
                    {paid ? "✓" : "○"}
                  </span>

                  <span style={{ flex: 1, fontSize: "14px", fontWeight: paid ? 500 : 400, color: paid ? "#333" : "#666" }}>
                    {name}
                  </span>

                  {/* Quick amount chips */}
                  <div style={{ display: "flex", gap: "4px" }}>
                    {QUICK_AMOUNTS.map(q => (
                      <button
                        key={q}
                        onClick={() => updateAmount(activeTab, mi, amt === q ? 0 : q)}
                        style={{
                          padding: "4px 8px",
                          border: "1px solid",
                          borderColor: amt === q ? activeFolder.color : "#E8F0ED",
                          backgroundColor: amt === q ? activeFolder.color : "transparent",
                          color: amt === q ? "#fff" : "#666",
                          borderRadius: "4px",
                          fontSize: "11px",
                          cursor: "pointer"
                        }}
                      >
                        {q}
                      </button>
                    ))}
                  </div>

                  <input
                    type="number"
                    value={amt === 0 ? "" : amt}
                    onChange={e => updateAmount(activeTab, mi, e.target.value)}
                    placeholder="0"
                    style={{
                      width: "80px",
                      padding: "4px 8px",
                      border: "1px solid",
                      borderColor: paid ? activeFolder.color : "#E8F0ED",
                      borderRadius: "4px",
                      fontSize: "13px",
                      textAlign: "right"
                    }}
                  />
                </div>
              );
            })}

            {/* Add Member Row */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "12px 16px", borderTop: "1px dashed #E8F0ED" }}>
              <span style={{ fontSize: "16px", color: "#ccc" }}>+</span>
              <input
                type="text"
                value={newMemberName}
                onChange={e => setNewMemberName(e.target.value)}
                placeholder="Nama ahli baru..."
                onKeyDown={e => e.key === "Enter" && addMember(activeTab)}
                style={{
                  flex: 1,
                  padding: "4px 8px",
                  border: "1px solid #E8F0ED",
                  borderRadius: "4px",
                  fontSize: "13px"
                }}
              />
              <button
                onClick={() => addMember(activeTab)}
                disabled={!newMemberName.trim()}
                style={{
                  padding: "4px 12px",
                  border: `1px solid ${activeFolder.color}`,
                  backgroundColor: "transparent",
                  color: activeFolder.color,
                  borderRadius: "4px",
                  fontSize: "12px",
                  cursor: newMemberName.trim() ? "pointer" : "not-allowed",
                  opacity: newMemberName.trim() ? 1 : 0.5
                }}
              >
                TAMBAH
              </button>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px",
            backgroundColor: "#F7FAF9",
            borderTop: "1px solid #E8F0ED"
          }}>
            <span style={{ fontSize: "12px", color: "#666" }}>Kemasukan {activeFolder.label}</span>
            <span style={{ color: activeFolder.color, fontSize: "14px", fontWeight: 500 }}>
              RM {activeFolderTotal.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Grand Total */}
        <div style={{
          backgroundColor: "#0F6E56" + "08",
          border: "1px solid #0F6E56" + "30",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between"
        }}>
          <span style={{ fontSize: "14px", color: "#666" }}>Jumlah Keseluruhan</span>
          <span style={{ fontSize: "20px", color: "#0F6E56", fontWeight: 600 }}>
            RM {grandTotal.toLocaleString()}
          </span>
        </div>

        {/* Action Buttons */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button
            onClick={shareWA}
            style={{
              backgroundColor: "#25D366",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
              flex: 1,
              minWidth: "140px"
            }}
          >
            📱 Share ke WhatsApp
          </button>
          <button
            onClick={() => setPreviewOpen(true)}
            style={{
              backgroundColor: "transparent",
              color: "#0F6E56",
              border: "1px solid #0F6E56",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer",
              flex: 1,
              minWidth: "120px"
            }}
          >
            👁️ Lihat Rekap
          </button>
          <button
            onClick={copyText}
            style={{
              backgroundColor: "transparent",
              color: "#666",
              border: "1px solid #E8F0ED",
              padding: "8px 16px",
              borderRadius: "6px",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            📋 Salin
          </button>
        </div>
      </div>

      {/* Preview Modal */}
      {previewOpen && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            maxWidth: "500px",
            width: "90%",
            maxHeight: "80vh",
            overflow: "auto"
          }}>
            <div style={{ padding: "16px", borderBottom: "1px solid #E8F0ED" }}>
              <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>👁️ Rekap Jualan Sabun</h3>
            </div>
            <div style={{ padding: "16px" }}>
              <pre style={{
                fontFamily: "monospace",
                fontSize: "12px",
                whiteSpace: "pre-wrap",
                backgroundColor: "#F7FAF9",
                padding: "12px",
                borderRadius: "4px",
                margin: 0
              }}>
                {buildText()}
              </pre>
            </div>
            <div style={{ padding: "16px", borderTop: "1px solid #E8F0ED", display: "flex", gap: "8px" }}>
              <button onClick={copyText} style={{ padding: "4px 12px", border: "1px solid #E8F0ED", borderRadius: "4px", fontSize: "12px" }}>
                📋 Salin
              </button>
              <button onClick={shareWA} style={{ padding: "4px 12px", backgroundColor: "#25D366", color: "white", border: "none", borderRadius: "4px", fontSize: "12px" }}>
                📱 Share WA
              </button>
              <button onClick={() => setPreviewOpen(false)} style={{ padding: "4px 12px", border: "1px solid #E8F0ED", borderRadius: "4px", fontSize: "12px" }}>
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Dialog */}
      {resetDialog && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: "white",
            borderRadius: "8px",
            maxWidth: "300px",
            width: "90%"
          }}>
            <div style={{ padding: "16px" }}>
              <h3 style={{ margin: "0 0 12px 0", fontSize: "15px", fontWeight: 500 }}>Set semula data?</h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                Semua kemasukan akan dipadam dan dikembalikan ke asal. Tindakan ini tidak boleh dibatalkan.
              </p>
            </div>
            <div style={{ padding: "16px", borderTop: "1px solid #E8F0ED", display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button onClick={() => setResetDialog(false)} style={{ padding: "4px 12px", border: "1px solid #E8F0ED", borderRadius: "4px", fontSize: "12px" }}>
                Batal
              </button>
              <button onClick={resetAll} style={{ padding: "4px 12px", backgroundColor: "#d32f2f", color: "white", border: "none", borderRadius: "4px", fontSize: "12px" }}>
                Set Semula
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default JualanSabunMinimal;
