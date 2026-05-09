import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = `${import.meta.env.VITE_API_BASE_URL}/jualan`;

const MONTHS = [
  { value: 1, label: "Januari" },
  { value: 2, label: "Februari" },
  { value: 3, label: "Mac" },
  { value: 4, label: "April" },
  { value: 5, label: "Mei" },
  { value: 6, label: "Jun" },
  { value: 7, label: "Julai" },
  { value: 8, label: "Ogos" },
  { value: 9, label: "September" },
  { value: 10, label: "Oktober" },
  { value: 11, label: "November" },
  { value: 12, label: "Disember" }
];

const WEEKS = [
  { value: 1, label: "Minggu 1" },
  { value: 2, label: "Minggu 2" },
  { value: 3, label: "Minggu 3" },
  { value: 4, label: "Minggu 4" }
];

// Mock data - dalam real app ini akan diambil dari database
const MOCK_RECORDS = [
  {
    id: 1,
    month: 5,
    week: 1,
    year: 2026,
    totalAmount: 1250,
    totalMembers: 45,
    paidMembers: 12,
    date: "2026-05-01",
    status: "active"
  },
  {
    id: 2,
    month: 5,
    week: 2,
    year: 2026,
    totalAmount: 2100,
    totalMembers: 45,
    paidMembers: 18,
    date: "2026-05-08",
    status: "active"
  },
  {
    id: 3,
    month: 5,
    week: 3,
    year: 2026,
    totalAmount: 1850,
    totalMembers: 45,
    paidMembers: 15,
    date: "2026-05-15",
    status: "active"
  },
  {
    id: 4,
    month: 4,
    week: 4,
    year: 2026,
    totalAmount: 3200,
    totalMembers: 45,
    paidMembers: 22,
    date: "2026-04-22",
    status: "completed"
  },
  {
    id: 5,
    month: 4,
    week: 3,
    year: 2026,
    totalAmount: 2800,
    totalMembers: 45,
    paidMembers: 19,
    date: "2026-04-15",
    status: "completed"
  },
  {
    id: 6,
    month: 3,
    week: 2,
    year: 2026,
    totalAmount: 1500,
    totalMembers: 45,
    paidMembers: 10,
    date: "2026-03-08",
    status: "completed"
  }
];

function JualanSabunList() {
  const navigate = useNavigate();
  const [selectedMonth, setSelectedMonth] = useState(5);
  const [selectedWeek, setSelectedWeek] = useState(0); // 0 = semua minggu
  const [searchTerm, setSearchTerm] = useState("");
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch records from API
  useEffect(() => {
    const fetchRecords = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE_URL}/records`);
        const result = await response.json();
        const recordsData = result.data || result; // Handle both response formats
        setRecords(recordsData);
      } catch (error) {
        console.error('Failed to fetch records:', error);
        // Fallback to mock data if API fails
        setRecords(MOCK_RECORDS);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  const filteredRecords = useMemo(() => {
    let filtered = records;

    // Filter by month
    if (selectedMonth !== 0) {
      filtered = filtered.filter(record => record.month === selectedMonth);
    }

    // Filter by week
    if (selectedWeek !== 0) {
      filtered = filtered.filter(record => record.week === selectedWeek);
    }

    // Filter by search
    if (searchTerm) {
      filtered = filtered.filter(record => 
        record.totalAmount.toString().includes(searchTerm) ||
        record.paidMembers.toString().includes(searchTerm) ||
        record.status.includes(searchTerm.toLowerCase())
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [selectedMonth, selectedWeek, searchTerm]);

  const totalRecords = filteredRecords.length;
  const grandTotal = useMemo(() => 
    filteredRecords.reduce((sum, record) => sum + record.totalAmount, 0), 
    [filteredRecords]
  );
  const totalPaid = useMemo(() => 
    filteredRecords.reduce((sum, record) => sum + record.paidMembers, 0), 
    [filteredRecords]
  );

  const getStatusColor = (status) => {
    switch(status) {
      case "active": return "#0F6E56";
      case "completed": return "#185FA5";
      default: return "#666";
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case "active": return "Aktif";
      case "completed": return "Selesai";
      default: return status;
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const exportToWhatsApp = () => {
    const monthName = selectedMonth === 0 ? "Semua Bulan" : MONTHS.find(m => m.value === selectedMonth)?.label;
    const weekName = selectedWeek === 0 ? "Semua Minggu" : WEEKS.find(w => w.value === selectedWeek)?.label;
    
    let text = `📊 *REKAP JUALAN SABUN*\n\n`;
    text += `📅 Periode: ${monthName} ${selectedWeek === 0 ? "" : weekName}\n`;
    text += `📈 Jumlah Rekod: ${totalRecords}\n`;
    text += `💰 Jumlah Total: RM ${grandTotal.toLocaleString()}\n`;
    text += `👥 Jumlah Bayar: ${totalPaid} orang\n\n`;
    
    text += `*Detail Rekod:*\n`;
    filteredRecords.forEach((record, index) => {
      text += `${index + 1}. ${formatDate(record.date)}\n`;
      text += `   Minggu ${record.week} • RM ${record.totalAmount.toLocaleString()}\n`;
      text += `   ${record.paidMembers}/${record.totalMembers} bayar • ${getStatusText(record.status)}\n\n`;
    });
    
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F7FAF9",
      padding: "16px",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>

        {/* Header */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "16px"
        }}>
          <div>
            <h1 style={{
              color: "#0F6E56",
              margin: "0 0 8px 0",
              fontSize: "24px",
              fontWeight: 600
            }}>
              📊 Rekod Jualan Sabun
            </h1>
            <p style={{
              color: "#666",
              margin: 0,
              fontSize: "14px"
            }}>
              Sejarah rekod kemasukan jualan sabun
            </p>
          </div>

          <button
            onClick={() => navigate('/jualan-sabun')}
            style={{
              backgroundColor: "#0F6E56",
              color: "white",
              border: "none",
              padding: "10px 20px",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            🧼 Input Jualan
          </button>
        </div>

        {/* Filters */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "20px",
          border: "1px solid #E8F0ED",
          marginBottom: "24px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px"
          }}>
            <div>
              <label style={{
                display: "block",
                fontSize: "12px",
                color: "#666",
                marginBottom: "6px",
                fontWeight: 500
              }}>
                📅 Bulan
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #E8F0ED",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer"
                }}
              >
                <option value={0}>Semua Bulan</option>
                {MONTHS.map(month => (
                  <option key={month.value} value={month.value}>
                    {month.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "12px",
                color: "#666",
                marginBottom: "6px",
                fontWeight: 500
              }}>
                📆 Minggu
              </label>
              <select
                value={selectedWeek}
                onChange={(e) => setSelectedWeek(parseInt(e.target.value))}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #E8F0ED",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: "white",
                  cursor: "pointer"
                }}
              >
                <option value={0}>Semua Minggu</option>
                {WEEKS.map(week => (
                  <option key={week.value} value={week.value}>
                    {week.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "12px",
                color: "#666",
                marginBottom: "6px",
                fontWeight: 500
              }}>
                🔍 Cari
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari jumlah, status..."
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  border: "1px solid #E8F0ED",
                  borderRadius: "6px",
                  fontSize: "14px",
                  backgroundColor: "white"
                }}
              />
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "16px",
          marginBottom: "24px"
        }}>
          <div style={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E8F0ED",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Jumlah Rekod</div>
            <div style={{ fontSize: "24px", color: "#0F6E56", fontWeight: 600 }}>
              {totalRecords}
            </div>
          </div>

          <div style={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E8F0ED",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Jumlah Total (RM)</div>
            <div style={{ fontSize: "24px", color: "#0F6E56", fontWeight: 600 }}>
              {grandTotal.toLocaleString()}
            </div>
          </div>

          <div style={{
            backgroundColor: "white",
            padding: "16px",
            borderRadius: "12px",
            border: "1px solid #E8F0ED",
            boxShadow: "0 2px 8px rgba(0,0,0,0.04)"
          }}>
            <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Total Bayar</div>
            <div style={{ fontSize: "24px", color: "#0F6E56", fontWeight: 600 }}>
              {totalPaid}
            </div>
          </div>
        </div>

        {/* Records Table */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          border: "1px solid #E8F0ED",
          boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
          overflow: "hidden"
        }}>
          <div style={{
            backgroundColor: "#0F6E56",
            color: "white",
            padding: "16px 20px",
            fontSize: "16px",
            fontWeight: 600
          }}>
            📋 Daftar Rekod Jualan
          </div>

          {filteredRecords.length === 0 ? (
            <div style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "#666",
              fontSize: "16px"
            }}>
              📭 Tiada rekod dijumpai untuk kriteria yang dipilih
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px"
              }}>
                <thead>
                  <tr style={{ backgroundColor: "#F7FAF9" }}>
                    <th style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#333",
                      borderBottom: "2px solid #E8F0ED"
                    }}>Tarikh</th>
                    <th style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#333",
                      borderBottom: "2px solid #E8F0ED"
                    }}>Bulan</th>
                    <th style={{
                      padding: "12px 16px",
                      textAlign: "left",
                      fontWeight: 600,
                      color: "#333",
                      borderBottom: "2px solid #E8F0ED"
                    }}>Minggu</th>
                    <th style={{
                      padding: "12px 16px",
                      textAlign: "right",
                      fontWeight: 600,
                      color: "#333",
                      borderBottom: "2px solid #E8F0ED"
                    }}>Jumlah (RM)</th>
                    <th style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontWeight: 600,
                      color: "#333",
                      borderBottom: "2px solid #E8F0ED"
                    }}>Bayar</th>
                    <th style={{
                      padding: "12px 16px",
                      textAlign: "center",
                      fontWeight: 600,
                      color: "#333",
                      borderBottom: "2px solid #E8F0ED"
                    }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRecords.map((record, index) => (
                    <tr key={record.id} style={{
                      borderBottom: "1px solid #E8F0ED",
                      backgroundColor: index % 2 === 0 ? "#FAFAFA" : "white"
                    }}>
                      <td style={{
                        padding: "12px 16px",
                        color: "#333"
                      }}>
                        {formatDate(record.date)}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        color: "#333"
                      }}>
                        {MONTHS.find(m => m.value === record.month)?.label}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        color: "#333"
                      }}>
                        Minggu {record.week}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        textAlign: "right",
                        fontWeight: 600,
                        color: "#0F6E56"
                      }}>
                        {record.totalAmount.toLocaleString()}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        textAlign: "center",
                        color: "#333"
                      }}>
                        {record.paidMembers}/{record.totalMembers}
                      </td>
                      <td style={{
                        padding: "12px 16px",
                        textAlign: "center"
                      }}>
                        <span style={{
                          backgroundColor: getStatusColor(record.status) + "20",
                          color: getStatusColor(record.status),
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 500
                        }}>
                          {getStatusText(record.status)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div style={{
          display: "flex",
          gap: "12px",
          marginTop: "24px",
          justifyContent: "center"
        }}>
          <button
            onClick={exportToWhatsApp}
            style={{
              backgroundColor: "#25D366",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            📱 Export ke WhatsApp
          </button>
          
          <button
            onClick={() => navigate('/home')}
            style={{
              backgroundColor: "transparent",
              color: "#666",
              border: "1px solid #E8F0ED",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer",
              fontWeight: 500
            }}
          >
            🏠 Kembali ke Home
          </button>
        </div>

      </div>
    </div>
  );
}

export default JualanSabunList;
