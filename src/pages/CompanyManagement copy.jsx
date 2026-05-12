import { useState, useEffect } from "react";

// Responsive hook for detecting mobile screens
const useResponsive = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setScreenWidth(width);
      setIsMobile(width < 768);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { isMobile, screenWidth };
};

const INITIAL_COMPANIES = [
  {
    id: 1,
    name: "Insafora Ventures Sdn Bhd",
    industry: "Restoran (Retail F&B)",
    employees: 50,
    revenue: 3500000,
    growth: 12,
    status: "active",
    color: "#1976d2",
    ceo: "Tn Mohd Shukri",
    staff: ["Tn Fadhil Yasin", "Tn Mohd Shukri"],
    plans: [
      { id: 1, title: "Restoran Luar Negara Expansion", status: "planning", deadline: "2024-12-31" },
      { id: 2, title: "Foodtruck Operations", status: "in-progress", deadline: "2024-11-30" }
    ]
  },
  {
    id: 2,
    name: "Manufacturing Syarikat",
    industry: "Perkilangan (Manufacturing)",
    employees: 35,
    revenue: 2800000,
    growth: 8,
    status: "active",
    color: "#2e7d32",
    ceo: "Tn Nik Hazani",
    staff: ["Tn Nik Hazani", "Tn Amin", "En Ridwan"],
    plans: [
      { id: 1, title: "Kilang Roti & Mi Setup", status: "completed", deadline: "2024-10-15" },
      { id: 2, title: "Produk Retort Development", status: "in-progress", deadline: "2024-11-20" }
    ]
  },
  {
    id: 3,
    name: "Fateh Livestock",
    industry: "Penternakan (Livestock)",
    employees: 25,
    revenue: 1800000,
    growth: 15,
    status: "active",
    color: "#9c27b0",
    ceo: "Tn Anuar",
    staff: ["Tn Anuar", "En Kamil Abdullah"],
    plans: [
      { id: 1, title: "Ternakan Lembu Expansion", status: "planning", deadline: "2024-12-01" },
      { id: 2, title: "Produk Fateh Development", status: "in-progress", deadline: "2024-10-30" }
    ]
  },
  {
    id: 4,
    name: "Agrotech Solutions",
    industry: "Pertanian (Agrotech)",
    employees: 30,
    revenue: 2200000,
    growth: 18,
    status: "active",
    color: "#ff9800",
    ceo: "Tn Hamdi",
    staff: ["Tn Hamdi", "Cik Kak Ngah", "En Arobi"],
    plans: [
      { id: 1, title: "Pertanian Fertigasi Moden", status: "planning", deadline: "2024-12-15" },
      { id: 2, title: "Greenhouse Setup", status: "in-progress", deadline: "2024-11-15" }
    ]
  },
  {
    id: 5,
    name: "Import Export Supply Chain",
    industry: "Import Eksport (Supply Chain)",
    employees: 40,
    revenue: 4500000,
    growth: 10,
    status: "active",
    color: "#4caf50",
    ceo: "Tn Nik Fateh",
    staff: ["Tn Nik Fateh", "En Nik Hishamuddin"],
    plans: [
      { id: 1, title: "Import Bahan Mentah", status: "completed", deadline: "2024-10-01" },
      { id: 2, title: "Export Market Expansion", status: "planning", deadline: "2024-12-20" }
    ]
  },
  {
    id: 6,
    name: "Equine Excellence",
    industry: "Equine",
    employees: 20,
    revenue: 1500000,
    growth: 5,
    status: "active",
    color: "#795548",
    ceo: "Tn Adib",
    staff: ["Tn Adib", "Tn Hamdi"],
    plans: [
      { id: 1, title: "Pemeliharaan Kuda", status: "in-progress", deadline: "2024-11-10" },
      { id: 2, title: "Latihan Kuda Program", status: "planning", deadline: "2024-12-10" }
    ]
  },
  {
    id: 7,
    name: "Resolvia Training & Consultancy Sdn Bhd",
    industry: "Latihan dan Motivasi",
    employees: 15,
    revenue: 1200000,
    growth: 8,
    status: "active",
    color: "#e91e63",
    ceo: "Tn Syarif",
    staff: ["Tn Syarif", "Puan Mubarokah", "Puan Azura"],
    plans: [
      { id: 1, title: "Training Programs", status: "completed", deadline: "2024-09-30" },
      { id: 2, title: "Motivasi Workshops", status: "in-progress", deadline: "2024-11-25" }
    ]
  },
  {
    id: 8,
    name: "Construction & Renovation Pro",
    industry: "Construction / Renovation",
    employees: 45,
    revenue: 3800000,
    growth: 12,
    status: "active",
    color: "#607d8b",
    ceo: "Tn Afdhal Latif",
    staff: ["Tn Afdhal Latif", "Tn Nik Ashaari"],
    plans: [
      { id: 1, title: "Construction Projects", status: "in-progress", deadline: "2024-12-05" },
      { id: 2, title: "Interior Design Services", status: "planning", deadline: "2024-11-30" }
    ]
  },
  {
    id: 9,
    name: "Safina Worldwide Sdn Bhd",
    industry: "Pemasaran",
    employees: 25,
    revenue: 2000000,
    growth: 15,
    status: "active",
    color: "#ff5722",
    ceo: "Tn Fida",
    staff: ["Tn Syurahbil", "Tn Fida", "En Fajrul"],
    plans: [
      { id: 1, title: "Marketing Campaign", status: "in-progress", deadline: "2024-11-15" },
      { id: 2, title: "Brand Expansion", status: "planning", deadline: "2024-12-20" }
    ]
  },
  {
    id: 10,
    name: "Education & Human Development",
    industry: "Pendidikan & Bina Insan",
    employees: 35,
    revenue: 2500000,
    growth: 10,
    status: "active",
    color: "#3f51b5",
    ceo: "En Zar Nukman",
    staff: ["Tn Nik Hazani", "En Zar Nukman", "En Zahid", "Cik Norshitah", "En Abu Ubaidah"],
    plans: [
      { id: 1, title: "Tuition Programs", status: "completed", deadline: "2024-09-30" },
      { id: 2, title: "Taska Tadika Setup", status: "planning", deadline: "2024-12-10" }
    ]
  },
  {
    id: 11,
    name: "Logistics & Transport Solutions",
    industry: "Logistik & Transport",
    employees: 30,
    revenue: 2800000,
    growth: 8,
    status: "active",
    color: "#009688",
    ceo: "Tn Waji",
    staff: ["Tn Waji"],
    plans: [
      { id: 1, title: "Transportation Services", status: "in-progress", deadline: "2024-11-20" },
      { id: 2, title: "Vehicle Rental", status: "planning", deadline: "2024-12-15" }
    ]
  },
  {
    id: 12,
    name: "IT & Multimedia Solutions",
    industry: "IT & Multimedia",
    employees: 20,
    revenue: 1800000,
    growth: 20,
    status: "active",
    color: "#9c27b0",
    ceo: "Tn Hanzalah",
    staff: ["Tn Hanzalah", "En Jaafar", "Cik Fathiyyah"],
    plans: [
      { id: 1, title: "IT Services Development", status: "in-progress", deadline: "2024-11-25" },
      { id: 2, title: "Nasyid & Lagu Production", status: "planning", deadline: "2024-12-20" }
    ]
  },
  {
    id: 13,
    name: "Medical Services Group",
    industry: "Medical",
    employees: 40,
    revenue: 3200000,
    growth: 12,
    status: "active",
    color: "#f44336",
    ceo: "Tn Hasnan",
    staff: ["Tn Hasnan", "Cik Asilah"],
    plans: [
      { id: 1, title: "Klinik Setup", status: "completed", deadline: "2024-09-30" },
      { id: 2, title: "Confinement Centre", status: "planning", deadline: "2024-12-10" }
    ]
  },
  {
    id: 14,
    name: "Wholesale & Retail Group",
    industry: "Borong & Runcit",
    employees: 50,
    revenue: 4000000,
    growth: 6,
    status: "active",
    color: "#ff9800",
    ceo: "Tn Fadhil",
    staff: ["Tn Fadhil", "En Ali Hassan", "En Ridwan"],
    plans: [
      { id: 1, title: "Pasar Malam Operations", status: "in-progress", deadline: "2024-11-15" },
      { id: 2, title: "Gudang Borong Setup", status: "planning", deadline: "2024-12-20" }
    ]
  },
  {
    id: 15,
    name: "Hotel & Homestay Management",
    industry: "Hotel dan Homestay",
    employees: 35,
    revenue: 3000000,
    growth: 10,
    status: "active",
    color: "#2196f3",
    ceo: "Tn Syurahbil",
    staff: ["Tn Syurahbil", "En Fateh"],
    plans: [
      { id: 1, title: "Hotel Operations", status: "completed", deadline: "2024-09-30" },
      { id: 2, title: "Homestay Services", status: "in-progress", deadline: "2024-11-30" }
    ]
  },
  {
    id: 16,
    name: "Travel & Tourism Services",
    industry: "Travel & Tourism",
    employees: 25,
    revenue: 2200000,
    growth: 15,
    status: "active",
    color: "#4caf50",
    ceo: "Tn Abbad",
    staff: ["Tn Abbad", "En Ikrimah", "Pn Roqaiyah", "Cik Hafizah"],
    plans: [
      { id: 1, title: "Travel Packages", status: "in-progress", deadline: "2024-11-20" },
      { id: 2, title: "Tour Services", status: "planning", deadline: "2024-12-15" }
    ]
  },
  {
    id: 17,
    name: "Housing Development Corp",
    industry: "Housing Development",
    employees: 45,
    revenue: 5000000,
    growth: 8,
    status: "active",
    color: "#795548",
    ceo: "Tn Amin",
    staff: ["Tn Amin", "En Khalid"],
    plans: [
      { id: 1, title: "Projek Perumahan", status: "in-progress", deadline: "2024-12-25" },
      { id: 2, title: "Design Services", status: "planning", deadline: "2024-11-30" }
    ]
  },
  {
    id: 18,
    name: "Bakery & Confectioneries",
    industry: "Bakery & Confectionaries",
    employees: 30,
    revenue: 2400000,
    growth: 12,
    status: "active",
    color: "#e91e63",
    ceo: "Tn Quddamah",
    staff: ["Tn Quddamah", "Cik Yati Salim"],
    plans: [
      { id: 1, title: "Bakeri Operations", status: "completed", deadline: "2024-09-30" },
      { id: 2, title: "One Stop Centre", status: "planning", deadline: "2024-12-10" }
    ]
  },
  {
    id: 19,
    name: "Engineering Solutions",
    industry: "Engineering",
    employees: 35,
    revenue: 3500000,
    growth: 10,
    status: "active",
    color: "#607d8b",
    ceo: "En Khairi Syafie",
    staff: ["En Abu Yusniza", "En Attirillah", "En Khairi Syafie"],
    plans: [
      { id: 1, title: "Oil & Gas Maintenance", status: "in-progress", deadline: "2024-11-25" },
      { id: 2, title: "Engineering Support", status: "planning", deadline: "2024-12-20" }
    ]
  },
  {
    id: 20,
    name: "Event Management Pro",
    industry: "Event Management",
    employees: 20,
    revenue: 1800000,
    growth: 18,
    status: "active",
    color: "#9c27b0",
    ceo: "Cik Khaulah",
    staff: ["Cik Khaulah", "En Sayuti"],
    plans: [
      { id: 1, title: "Event Management", status: "completed", deadline: "2024-09-30" },
      { id: 2, title: "Konsert dan Persembahan", status: "planning", deadline: "2024-12-15" }
    ]
  },
  {
    id: 21,
    name: "Fishery & Aquaculture",
    industry: "Fishery",
    employees: 25,
    revenue: 2000000,
    growth: 14,
    status: "active",
    color: "#009688",
    ceo: "En Hisham Hashim",
    staff: ["En Hisham Hashim", "Tn Nik Ashaari"],
    plans: [
      { id: 1, title: "Freshmart Operations", status: "in-progress", deadline: "2024-11-20" },
      { id: 2, title: "Aquaculture Development", status: "planning", deadline: "2024-12-15" }
    ]
  },
  {
    id: 22,
    name: "Mart Retail Solutions",
    industry: "Mart",
    employees: 40,
    revenue: 3000000,
    growth: 8,
    status: "active",
    color: "#ff5722",
    ceo: "En Nik Hishamuddin",
    staff: ["En Nik Hishamuddin", "Cik Sofwah"],
    plans: [
      { id: 1, title: "Kedai Runcit Operations", status: "completed", deadline: "2024-09-30" },
      { id: 2, title: "Mart Expansion", status: "planning", deadline: "2024-12-10" }
    ]
  },
  {
    id: 23,
    name: "Fashion & Lifestyle",
    industry: "Fesyen & Lifestyle",
    employees: 18,
    revenue: 1500000,
    growth: 20,
    status: "active",
    color: "#e91e63",
    ceo: "Pn Mubarokah",
    staff: ["Pn Mubarokah", "Cik Khaulah"],
    plans: [
      { id: 1, title: "Jahitan Services", status: "in-progress", deadline: "2024-11-25" },
      { id: 2, title: "Butik Operations", status: "planning", deadline: "2024-12-20" }
    ]
  },
  {
    id: 24,
    name: "Management Services Group",
    industry: "Management Service",
    employees: 30,
    revenue: 2800000,
    growth: 10,
    status: "active",
    color: "#3f51b5",
    ceo: "En Khushairi",
    staff: ["En Khushairi", "En Kamil", "Cik Sakinah"],
    plans: [
      { id: 1, title: "Pengurusan Tenaga Kerja", status: "in-progress", deadline: "2024-11-20" },
      { id: 2, title: "Perkhidmatan Luar Negara", status: "planning", deadline: "2024-12-15" }
    ]
  },
  {
    id: 25,
    name: "Pertubuhan Kebajikan",
    industry: "Pertubuhan",
    employees: 15,
    revenue: 1000000,
    growth: 5,
    status: "active",
    color: "#ff9800",
    ceo: "Pn Roqaiyah",
    staff: ["Pn Roqaiyah", "Cik Aziah", "Cik Nusaibah", "Hj Kuddus"],
    plans: [
      { id: 1, title: "Kebajikan Programs", status: "completed", deadline: "2024-09-30" },
      { id: 2, title: "Bantuan Kemanusiaan", status: "planning", deadline: "2024-12-10" }
    ]
  }
];

const CompanyManagement = () => {
  const { isMobile, screenWidth } = useResponsive();
  const [companies, setCompanies] = useState(INITIAL_COMPANIES);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showCompanyList, setShowCompanyList] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard"); // "dashboard" or "detail"
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    ceo: "",
    employees: 0,
    revenue: 0
  });
  const [newPlan, setNewPlan] = useState({
    title: "",
    deadline: "",
    status: "planning"
  });
  const [newStaff, setNewStaff] = useState({
    name: "",
    position: "",
    role: "staff"
  });

  const handleCompanyClick = (company) => {
    setSelectedCompany(company);
    setActiveTab("overview");
    setCurrentView("detail");
    if (isMobile) {
      setShowCompanyList(false);
    }
  };

  const handleBackToDashboard = () => {
    setCurrentView("dashboard");
    setSelectedCompany(null);
  };

  const handleAddCompany = () => {
    if (newCompany.name && newCompany.industry && newCompany.ceo) {
      const company = {
        id: Date.now(),
        ...newCompany,
        status: "active",
        color: "#1976d2",
        growth: 0,
        staff: [],
        plans: []
      };
      setCompanies([...companies, company]);
      setNewCompany({ name: "", industry: "", ceo: "", employees: 0, revenue: 0 });
      setShowAddCompany(false);
    }
  };

  const handleAddPlan = () => {
    if (selectedCompany && newPlan.title && newPlan.deadline) {
      const plan = {
        id: Date.now(),
        ...newPlan
      };
      const updatedCompanies = companies.map(comp => 
        comp.id === selectedCompany.id 
          ? { ...comp, plans: [...comp.plans, plan] }
          : comp
      );
      setCompanies(updatedCompanies);
      setSelectedCompany({ ...selectedCompany, plans: [...selectedCompany.plans, plan] });
      setNewPlan({ title: "", deadline: "", status: "planning" });
      setShowAddPlan(false);
    }
  };

  const handleAddStaff = () => {
    if (selectedCompany && newStaff.name && newStaff.position) {
      const staff = {
        id: Date.now(),
        ...newStaff
      };
      const updatedCompanies = companies.map(comp => 
        comp.id === selectedCompany.id 
          ? { ...comp, staff: [...comp.staff, staff] }
          : comp
      );
      setCompanies(updatedCompanies);
      setSelectedCompany({ ...selectedCompany, staff: [...selectedCompany.staff, staff] });
      setNewStaff({ name: "", position: "", role: "staff" });
      setShowAddStaff(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "#4caf50";
      case "in-progress": return "#ff9800";
      case "completed": return "#2196f3";
      case "planning": return "#9c27b0";
      default: return "#757575";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#f8f9fa",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: "white",
        borderBottom: "1px solid #e0e0e0",
        padding: isMobile ? "12px 16px" : "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        flexWrap: isMobile ? "wrap" : "nowrap"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "8px" : "12px", flex: 1 }}>
          {currentView === "detail" && (
            <button
              onClick={handleBackToDashboard}
              style={{
                padding: "6px",
                backgroundColor: "transparent",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "16px"
              }}
            >
              ←
            </button>
          )}
          <div style={{
            width: isMobile ? "32px" : "40px",
            height: isMobile ? "32px" : "40px",
            borderRadius: "8px",
            backgroundColor: "#1976d2",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontSize: isMobile ? "14px" : "18px",
            fontWeight: "bold"
          }}>
            🏢
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1 style={{ 
              margin: 0, 
              fontSize: isMobile ? "16px" : "20px", 
              fontWeight: 600, 
              color: "#2c3e50",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {currentView === "detail" && selectedCompany 
                ? selectedCompany.name 
                : "Company Management"
              }
            </h1>
            <p style={{ 
              margin: "2px 0 0 0", 
              fontSize: isMobile ? "12px" : "14px", 
              color: "#6c757d",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis"
            }}>
              {currentView === "detail" && selectedCompany 
                ? selectedCompany.industry 
                : "Multi-company team management system"
              }
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowAddCompany(true)}
          style={{
            padding: isMobile ? "6px 12px" : "8px 16px",
            backgroundColor: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: "6px",
            fontSize: isMobile ? "12px" : "14px",
            fontWeight: 500,
            cursor: "pointer",
            whiteSpace: "nowrap"
          }}
        >
          {isMobile ? "+" : "+ Add Company"}
        </button>
      </div>

      {/* Mobile Company List Overlay */}
      {isMobile && showCompanyList && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1000,
          display: "flex",
          flexDirection: "column"
        }}>
          <div style={{
            backgroundColor: "white",
            height: "100vh",
            width: "100%",
            maxWidth: "400px",
            overflow: "auto"
          }}>
            <div style={{
              padding: "16px",
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>
                Companies
              </h2>
              <button
                onClick={() => setShowCompanyList(false)}
                style={{
                  padding: "4px 8px",
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer"
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "16px" }}>
              {companies.map((company) => (
                <div
                  key={company.id}
                  onClick={() => handleCompanyClick(company)}
                  style={{
                    backgroundColor: selectedCompany?.id === company.id ? "#f3f4f6" : "white",
                    border: `1px solid ${selectedCompany?.id === company.id ? company.color : "#e0e0e0"}`,
                    borderRadius: "8px",
                    padding: "16px",
                    marginBottom: "12px",
                    cursor: "pointer",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <div>
                      <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600, color: "#2c3e50" }}>
                        {company.name}
                      </h3>
                      <p style={{ margin: 0, fontSize: "14px", color: "#6c757d" }}>
                        {company.industry}
                      </p>
                    </div>
                    <span style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                      backgroundColor: getStatusColor(company.status),
                      flexShrink: 0
                    }}></span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#6c757d" }}>
                    <span>{company.employees} employees</span>
                    <span>+{company.growth}%</span>
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 600, color: company.color, marginTop: "4px" }}>
                    {formatCurrency(company.revenue)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
        <div style={{ 
          height: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 73px)",
          overflowY: "auto", 
          backgroundColor: "#f8f9fa" 
        }}>
          {currentView === "dashboard" ? (
            // Dashboard View
            <div style={{ padding: isMobile ? "16px" : "24px" }}>
              {/* Dashboard Header */}
              <div style={{
                backgroundColor: "white",
                borderRadius: isMobile ? "8px" : "12px",
                padding: isMobile ? "16px" : "24px",
                marginBottom: isMobile ? "16px" : "24px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
              }}>
                <h2 style={{ 
                  margin: "0 0 8px 0", 
                  fontSize: isMobile ? "20px" : "24px", 
                  fontWeight: 600, 
                  color: "#2c3e50" 
                }}>
                  Company Dashboard
                </h2>
                <p style={{ 
                  margin: 0, 
                  fontSize: isMobile ? "14px" : "16px", 
                  color: "#6c757d" 
                }}>
                  Manage and monitor all your companies in one place
                </p>
              </div>

              {/* Company Cards Grid */}
              <div style={{
                display: "grid",
                gridTemplateColumns: isMobile 
                  ? "1fr" 
                  : screenWidth < 1024 
                    ? "repeat(2, 1fr)"
                    : "repeat(3, 1fr)",
                gap: isMobile ? "16px" : "24px"
              }}>
                {companies.map((company) => (
                  <div
                    key={company.id}
                    onClick={() => handleCompanyClick(company)}
                    style={{
                      backgroundColor: "white",
                      borderRadius: isMobile ? "8px" : "12px",
                      padding: isMobile ? "16px" : "20px",
                      border: `1px solid ${company.color}20`,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-4px)";
                      e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                    }}
                  >
                    {/* Company Header */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "12px"
                    }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <h3 style={{
                          margin: "0 0 4px 0",
                          fontSize: isMobile ? "16px" : "18px",
                          fontWeight: 600,
                          color: "#2c3e50",
                          wordBreak: "break-word"
                        }}>
                          {company.name}
                        </h3>
                        <p style={{
                          margin: 0,
                          fontSize: isMobile ? "13px" : "14px",
                          color: "#6c757d",
                          wordBreak: "break-word"
                        }}>
                          {company.industry}
                        </p>
                      </div>
                      <div style={{
                        width: "12px",
                        height: "12px",
                        borderRadius: "50%",
                        backgroundColor: getStatusColor(company.status),
                        flexShrink: 0,
                        marginTop: "4px"
                      }}></div>
                    </div>

                    {/* Company Stats */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "1fr 1fr",
                      gap: "8px",
                      marginBottom: "12px"
                    }}>
                      <div style={{
                        backgroundColor: "#f8f9fa",
                        padding: "8px",
                        borderRadius: "6px"
                      }}>
                        <div style={{
                          fontSize: isMobile ? "11px" : "12px",
                          color: "#6c757d",
                          marginBottom: "2px"
                        }}>
                          Employees
                        </div>
                        <div style={{
                          fontSize: isMobile ? "14px" : "16px",
                          fontWeight: 600,
                          color: company.color
                        }}>
                          {company.employees}
                        </div>
                      </div>
                      <div style={{
                        backgroundColor: "#f8f9fa",
                        padding: "8px",
                        borderRadius: "6px"
                      }}>
                        <div style={{
                          fontSize: isMobile ? "11px" : "12px",
                          color: "#6c757d",
                          marginBottom: "2px"
                        }}>
                          Growth
                        </div>
                        <div style={{
                          fontSize: isMobile ? "14px" : "16px",
                          fontWeight: 600,
                          color: "#4caf50"
                        }}>
                          +{company.growth}%
                        </div>
                      </div>
                    </div>

                    {/* Revenue */}
                    <div style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      paddingTop: "8px",
                      borderTop: "1px solid #e0e0e0"
                    }}>
                      <span style={{
                        fontSize: isMobile ? "12px" : "13px",
                        color: "#6c757d"
                      }}>
                        Revenue
                      </span>
                      <span style={{
                        fontSize: isMobile ? "14px" : "16px",
                        fontWeight: 600,
                        color: company.color
                      }}>
                        {formatCurrency(company.revenue)}
                      </span>
                    </div>

                    {/* Hover Overlay */}
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: company.color + "10",
                      opacity: 0,
                      transition: "opacity 0.3s ease",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: isMobile ? "8px" : "12px"
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "0";
                    }}>
                      <div style={{
                        backgroundColor: company.color,
                        color: "white",
                        padding: "8px 16px",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: 500
                      }}>
                        View Details
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Empty State */}
              {companies.length === 0 && (
                <div style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "60px 20px",
                  textAlign: "center"
                }}>
                  <div style={{
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#e0e0e0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "32px",
                    marginBottom: "16px"
                  }}>
                    🏢
                  </div>
                  <h3 style={{
                    margin: "0 0 8px 0",
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "#2c3e50"
                  }}>
                    No Companies Yet
                  </h3>
                  <p style={{
                    margin: 0,
                    fontSize: "14px",
                    color: "#6c757d",
                    marginBottom: "16px"
                  }}>
                    Start by adding your first company to manage your business
                  </p>
                  <button
                    onClick={() => setShowAddCompany(true)}
                    style={{
                      padding: "10px 20px",
                      backgroundColor: "#1976d2",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      fontSize: "14px",
                      fontWeight: 500,
                      cursor: "pointer"
                    }}
                  >
                    + Add First Company
                  </button>
                </div>
              )}
            </div>
          ) : (
            // Detail View
            <div style={{ padding: isMobile ? "16px" : "24px" }}>
              {/* Company Header */}
              <div style={{
                backgroundColor: "white",
                borderRadius: isMobile ? "8px" : "12px",
                padding: isMobile ? "16px" : "24px",
                marginBottom: isMobile ? "16px" : "24px",
                border: `2px solid ${selectedCompany.color}`
              }}>
                <div style={{ 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "flex-start", 
                  marginBottom: "16px",
                  flexDirection: isMobile ? "column" : "row",
                  gap: isMobile ? "12px" : "0"
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <h2 style={{ 
                      margin: "0 0 8px 0", 
                      fontSize: isMobile ? "20px" : "24px", 
                      fontWeight: 600, 
                      color: "#2c3e50",
                      wordBreak: "break-word"
                    }}>
                      {selectedCompany.name}
                    </h2>
                    <p style={{ 
                      margin: 0, 
                      fontSize: isMobile ? "14px" : "16px", 
                      color: "#6c757d",
                      wordBreak: "break-word"
                    }}>
                      {selectedCompany.industry} • {selectedCompany.employees} employees
                    </p>
                  </div>
                  <div style={{
                    backgroundColor: selectedCompany.color,
                    color: "white",
                    padding: isMobile ? "4px 8px" : "6px 12px",
                    borderRadius: "20px",
                    fontSize: isMobile ? "10px" : "12px",
                    fontWeight: 500,
                    whiteSpace: "nowrap",
                    flexShrink: 0
                  }}>
                    {selectedCompany.status.toUpperCase()}
                  </div>
                </div>
                <div style={{ 
                  display: "flex", 
                  gap: isMobile ? "16px" : "24px",
                  flexDirection: isMobile ? "column" : "row"
                }}>
                  <div>
                    <div style={{ fontSize: isMobile ? "12px" : "14px", color: "#6c757d", marginBottom: "4px" }}>Revenue</div>
                    <div style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: 600, color: selectedCompany.color }}>
                      {formatCurrency(selectedCompany.revenue)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: isMobile ? "12px" : "14px", color: "#6c757d", marginBottom: "4px" }}>Growth</div>
                    <div style={{ fontSize: isMobile ? "18px" : "20px", fontWeight: 600, color: "#4caf50" }}>
                      +{selectedCompany.growth}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{
                backgroundColor: "white",
                borderRadius: isMobile ? "8px" : "12px",
                marginBottom: isMobile ? "16px" : "24px",
                overflow: "hidden"
              }}>
                <div style={{ 
                  display: "flex", 
                  borderBottom: "1px solid #e0e0e0",
                  flexDirection: isMobile ? "row" : "row",
                  overflowX: isMobile ? "auto" : "visible",
                  scrollbarWidth: "none",
                  msOverflowStyle: "none"
                }}>
                  {["overview", "team", "plans", "reports"].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      style={{
                        flex: isMobile ? "0 0 auto" : 1,
                        padding: isMobile ? "12px 16px" : "16px",
                        border: "none",
                        backgroundColor: activeTab === tab ? selectedCompany.color : "transparent",
                        color: activeTab === tab ? "white" : "#6c757d",
                        fontSize: isMobile ? "13px" : "14px",
                        fontWeight: 500,
                        cursor: "pointer",
                        transition: "all 0.2s ease",
                        whiteSpace: "nowrap",
                        minWidth: isMobile ? "80px" : "auto"
                      }}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div style={{ padding: isMobile ? "16px" : "24px" }}>
                  {activeTab === "overview" && (
                    <div>
                      <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#2c3e50" }}>
                        Company Overview
                      </h3>
                      <div style={{ 
                        display: "grid", 
                        gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(200px, 1fr))", 
                        gap: isMobile ? "12px" : "16px" 
                      }}>
                        <div style={{ 
                          backgroundColor: "#f8f9fa", 
                          padding: isMobile ? "12px" : "16px", 
                          borderRadius: "8px" 
                        }}>
                          <div style={{ fontSize: isMobile ? "12px" : "14px", color: "#6c757d", marginBottom: "8px" }}>Total Employees</div>
                          <div style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: 600, color: selectedCompany.color }}>
                            {selectedCompany.employees}
                          </div>
                        </div>
                        <div style={{ 
                          backgroundColor: "#f8f9fa", 
                          padding: isMobile ? "12px" : "16px", 
                          borderRadius: "8px" 
                        }}>
                          <div style={{ fontSize: isMobile ? "12px" : "14px", color: "#6c757d", marginBottom: "8px" }}>Active Plans</div>
                          <div style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: 600, color: selectedCompany.color }}>
                            {selectedCompany.plans?.length || 0}
                          </div>
                        </div>
                        <div style={{ 
                          backgroundColor: "#f8f9fa", 
                          padding: isMobile ? "12px" : "16px", 
                          borderRadius: "8px" 
                        }}>
                          <div style={{ fontSize: isMobile ? "12px" : "14px", color: "#6c757d", marginBottom: "8px" }}>Team Members</div>
                          <div style={{ fontSize: isMobile ? "20px" : "24px", fontWeight: 600, color: selectedCompany.color }}>
                            {(selectedCompany.staff?.length || 0) + 1} {/* +1 for CEO */}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "team" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#2c3e50" }}>
                          Team Management
                        </h3>
                        <button
                          onClick={() => setShowAddStaff(true)}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: selectedCompany.color,
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: 500,
                            cursor: "pointer"
                          }}
                        >
                          + Add Staff
                        </button>
                      </div>
                      
                      {/* CEO */}
                      <div style={{
                        backgroundColor: "#e3f2fd",
                        border: "1px solid #bbdefb",
                        borderRadius: "8px",
                        padding: "16px",
                        marginBottom: "16px"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
                          <div style={{
                            width: "48px",
                            height: "48px",
                            borderRadius: "50%",
                            backgroundColor: selectedCompany.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "white",
                            fontSize: "20px",
                            fontWeight: "bold"
                          }}>
                            👔
                          </div>
                          <div>
                            <div style={{ fontSize: "16px", fontWeight: 600, color: "#2c3e50" }}>
                              {selectedCompany.ceo}
                            </div>
                            <div style={{ fontSize: "14px", color: "#1976d2" }}>
                              Chief Executive Officer
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Staff */}
                      <div>
                        <h4 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: 600, color: "#2c3e50" }}>
                          Staff Members ({selectedCompany.staff?.length || 0})
                        </h4>
                        {selectedCompany.staff?.map((staff, index) => (
                          <div
                            key={staff.id}
                            style={{
                              backgroundColor: "white",
                              border: "1px solid #e0e0e0",
                              borderRadius: "8px",
                              padding: "16px",
                              marginBottom: "12px",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px"
                            }}
                          >
                            <div style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              backgroundColor: "#6c757d",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontSize: "16px",
                              fontWeight: "bold"
                            }}>
                              {staff.name.charAt(0)}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: "15px", fontWeight: 600, color: "#2c3e50" }}>
                                {staff.name}
                              </div>
                              <div style={{ fontSize: "13px", color: "#6c757d" }}>
                                {staff.position || "Staff Member"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === "plans" && (
                    <div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                        <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#2c3e50" }}>
                          Plans & Projects
                        </h3>
                        <button
                          onClick={() => setShowAddPlan(true)}
                          style={{
                            padding: "8px 16px",
                            backgroundColor: selectedCompany.color,
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            fontSize: "14px",
                            fontWeight: 500,
                            cursor: "pointer"
                          }}
                        >
                          + Add Plan
                        </button>
                      </div>
                      
                      {selectedCompany.plans?.map((plan) => (
                        <div
                          key={plan.id}
                          style={{
                            backgroundColor: "white",
                            border: "1px solid #e0e0e0",
                            borderRadius: "8px",
                            padding: "16px",
                            marginBottom: "12px"
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                            <div>
                              <h4 style={{ margin: "0 0 4px 0", fontSize: "16px", fontWeight: 600, color: "#2c3e50" }}>
                                {plan.title}
                              </h4>
                              <p style={{ margin: 0, fontSize: "14px", color: "#6c757d" }}>
                                Deadline: {plan.deadline}
                              </p>
                            </div>
                            <div style={{
                              backgroundColor: getStatusColor(plan.status),
                              color: "white",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "12px",
                              fontWeight: 500
                            }}>
                              {plan.status.toUpperCase()}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === "reports" && (
                    <div>
                      <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#2c3e50" }}>
                        Reports & Analytics
                      </h3>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "16px" }}>
                        <div style={{
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          padding: "16px"
                        }}>
                          <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 600, color: "#2c3e50" }}>
                            Revenue Report
                          </h4>
                          <p style={{ margin: 0, fontSize: "14px", color: "#6c757d" }}>
                            Total revenue: {formatCurrency(selectedCompany.revenue)}
                          </p>
                          <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#6c757d" }}>
                            Growth rate: +{selectedCompany.growth}%
                          </p>
                        </div>
                        <div style={{
                          backgroundColor: "white",
                          border: "1px solid #e0e0e0",
                          borderRadius: "8px",
                          padding: "16px"
                        }}>
                          <h4 style={{ margin: "0 0 8px 0", fontSize: "15px", fontWeight: 600, color: "#2c3e50" }}>
                            Team Performance
                          </h4>
                          <p style={{ margin: 0, fontSize: "14px", color: "#6c757d" }}>
                            Total team: {(selectedCompany.staff?.length || 0) + 1} members
                          </p>
                          <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#6c757d" }}>
                            Active plans: {selectedCompany.plans?.length || 0}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
      {/* Add Plan Dialog */}
      {showAddPlan && (
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
            borderRadius: "12px",
            maxWidth: "400px",
            width: "90%"
          }}>
            <div style={{ padding: "24px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600 }}>
                Add New Plan
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Plan Title"
                  value={newPlan.title}
                  onChange={(e) => setNewPlan({ ...newPlan, title: e.target.value })}
                  style={{
                    padding: "12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
                <input
                  type="date"
                  placeholder="Deadline"
                  value={newPlan.deadline}
                  onChange={(e) => setNewPlan({ ...newPlan, deadline: e.target.value })}
                  style={{
                    padding: "12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "16px" }}>
                <button
                  onClick={() => setShowAddPlan(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddPlan}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: selectedCompany.color,
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Add Plan
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Staff Dialog */}
      {showAddStaff && (
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
            borderRadius: "12px",
            maxWidth: "400px",
            width: "90%"
          }}>
            <div style={{ padding: "24px" }}>
              <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600 }}>
                Add New Staff
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <input
                  type="text"
                  placeholder="Staff Name"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
                  style={{
                    padding: "12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
                <input
                  type="text"
                  placeholder="Position"
                  value={newStaff.position}
                  onChange={(e) => setNewStaff({ ...newStaff, position: e.target.value })}
                  style={{
                    padding: "12px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end", marginTop: "16px" }}>
                <button
                  onClick={() => setShowAddStaff(false)}
                  style={{
                    padding: "8px 16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: "white",
                    cursor: "pointer"
                  }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddStaff}
                  style={{
                    padding: "8px 16px",
                    border: "none",
                    borderRadius: "6px",
                    fontSize: "14px",
                    backgroundColor: selectedCompany.color,
                    color: "white",
                    cursor: "pointer"
                  }}
                >
                  Add Staff
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
        </div>
      </div>
  );
};

export default CompanyManagement;
