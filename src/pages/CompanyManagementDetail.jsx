import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { companyManagementAPI } from "../api/company-management";

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
      { id: 2, title: "Export Market Expansion", status: "in-progress", deadline: "2024-12-01" }
    ]
  }
];

function CompanyManagementDetail() {
  const { isMobile } = useResponsive();
  const { id } = useParams();
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [newStaffName, setNewStaffName] = useState("");
  const [newPlan, setNewPlan] = useState({
    title: "",
    status: "planning",
    deadline: ""
  });

  useEffect(() => {
    fetchCompany();
  }, [id]);

  const fetchCompany = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyManagementAPI.getCompanyById(id, 'dummy-token'); // Replace with actual auth token
      
      if (response.success) {
        setCompany(response.data);
      } else {
        setError(response.error || 'Failed to fetch company');
        // Fallback to initial data for demo
        const foundCompany = INITIAL_COMPANIES.find(c => c.id === parseInt(id));
        if (foundCompany) {
          setCompany(foundCompany);
        } else {
          navigate('/company-management');
        }
      }
    } catch (err) {
      console.error('Error fetching company:', err);
      setError('Failed to connect to server');
      // Fallback to initial data for demo
      const foundCompany = INITIAL_COMPANIES.find(c => c.id === parseInt(id));
      if (foundCompany) {
        setCompany(foundCompany);
      } else {
        navigate('/company-management');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    navigate('/company-management');
  };

  const handleAddStaff = async () => {
    if (newStaffName.trim() && company) {
      try {
        const staffData = {
          name: newStaffName.trim()
        };
        
        const response = await companyManagementAPI.addStaff(company.id, staffData, 'dummy-token'); // Replace with actual auth token
        
                
        if (response.success) {
          setCompany({
            ...company,
            staff: [...(company.staff || []), response.data]
          });
          setNewStaffName("");
          setShowAddStaff(false);
        } else {
          setError(response.error || 'Failed to add staff');
        }
      } catch (err) {
        console.error('Error adding staff:', err);
        setError('Failed to add staff');
      }
    }
  };

  const handleAddPlan = async () => {
    if (newPlan.title.trim() && company) {
      try {
        const planData = {
          title: newPlan.title.trim(),
          status: newPlan.status,
          deadline: newPlan.deadline
        };
        
        const response = await companyManagementAPI.addPlan(company.id, planData, 'dummy-token'); // Replace with actual auth token
        
        if (response.success) {
          setCompany({
            ...company,
            plans: [
              ...company.plans,
              {
                id: company.plans.length + 1,
                title: newPlan.title.trim(),
                status: newPlan.status,
                deadline: newPlan.deadline
              }
            ]
          });
          setNewPlan({
            title: "",
            status: "planning",
            deadline: ""
          });
          setShowAddPlan(false);
        } else {
          setError(response.error || 'Failed to add plan');
        }
      } catch (err) {
        console.error('Error adding plan:', err);
        setError('Failed to add plan');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "#4caf50";
      case "inactive": return "#f44336";
      case "pending": return "#ff9800";
      case "completed": return "#4caf50";
      case "in-progress": return "#2196f3";
      case "planning": return "#ff9800";
      default: return "#9e9e9e";
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f8f9fa", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: 600, color: "#333" }}>
            Loading Company...
          </h3>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            Please wait while we fetch company details
          </p>
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f8f9fa", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>🔍</div>
          <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: 600, color: "#333" }}>
            Company Not Found
          </h3>
          <p style={{ margin: "0 0 24px 0", fontSize: "14px", color: "#666" }}>
            The company you're looking for doesn't exist
          </p>
          <button
            onClick={handleBackToDashboard}
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              cursor: "pointer"
            }}
          >
            Back to Companies
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Header */}
      <div style={{ 
        backgroundColor: "white", 
        padding: isMobile ? "16px" : "24px", 
        borderBottom: "1px solid #e0e0e0",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <button
              onClick={handleBackToDashboard}
              style={{
                backgroundColor: "transparent",
                border: "1px solid #ddd",
                padding: "8px 12px",
                borderRadius: "6px",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              ← Back
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: isMobile ? "20px" : "28px", fontWeight: 600, color: "#333" }}>
                {company.name}
              </h1>
              <p style={{ margin: "4px 0 0 0", fontSize: "14px", color: "#666" }}>
                {company.industry}
              </p>
            </div>
          </div>
          <span style={{
            backgroundColor: getStatusColor(company.status),
            color: "white",
            padding: "6px 12px",
            borderRadius: "6px",
            fontSize: "12px",
            fontWeight: 500
          }}>
            {company.status}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ 
        height: isMobile ? "calc(100vh - 120px)" : "calc(100vh - 73px)",
        overflowY: "auto", 
        backgroundColor: "#f8f9fa" 
      }}>
        <div style={{ padding: isMobile ? "16px" : "24px", maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Error Message */}
          {error && (
            <div style={{
              backgroundColor: "#fff3cd",
              border: "1px solid #ffeaa7",
              borderRadius: "8px",
              padding: "16px",
              marginBottom: "16px",
              color: "#856404"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span>{error}</span>
                <button
                  onClick={fetchCompany}
                  style={{
                    backgroundColor: "#856404",
                    color: "white",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    fontSize: "12px",
                    cursor: "pointer"
                  }}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Company Overview */}
          <div style={{
            backgroundColor: "white",
            borderRadius: isMobile ? "8px" : "12px",
            padding: isMobile ? "16px" : "24px",
            marginBottom: isMobile ? "16px" : "24px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ margin: "0 0 16px 0", fontSize: isMobile ? "18px" : "24px", fontWeight: 600, color: "#333" }}>
              Company Overview
            </h2>
            
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", 
              gap: "16px", 
              marginBottom: "16px" 
            }}>
              <div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>CEO</div>
                <div style={{ fontSize: "16px", fontWeight: 500, color: "#333" }}>
                  {company.ceo}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Employees</div>
                <div style={{ fontSize: "16px", fontWeight: 500, color: "#333" }}>
                  {company.employees}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Revenue</div>
                <div style={{ fontSize: "16px", fontWeight: 500, color: "#333" }}>
                  {formatCurrency(company.revenue)}
                </div>
              </div>
              <div>
                <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Growth</div>
                <div style={{ 
                  fontSize: "16px", 
                  fontWeight: 500, 
                  color: company.growth > 0 ? "#4caf50" : "#f44336" 
                }}>
                  {company.growth > 0 ? "+" : ""}{company.growth}%
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            backgroundColor: "white",
            borderRadius: isMobile ? "8px" : "12px",
            padding: isMobile ? "16px" : "24px",
            marginBottom: isMobile ? "16px" : "24px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <div style={{ 
              display: "flex", 
              borderBottom: "1px solid #e0e0e0", 
              marginBottom: "24px",
              overflowX: "auto"
            }}>
              {["overview", "team", "plans", "reports"].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    backgroundColor: "transparent",
                    border: "none",
                    padding: "12px 24px",
                    fontSize: "14px",
                    fontWeight: 500,
                    color: activeTab === tab ? company.color : "#666",
                    borderBottom: activeTab === tab ? `2px solid ${company.color}` : "none",
                    cursor: "pointer",
                    textTransform: "capitalize",
                    whiteSpace: "nowrap"
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === "overview" && (
              <div>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
                  Company Performance
                </h3>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", 
                  gap: "16px" 
                }}>
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "16px",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "24px", fontWeight: 600, color: company.color, marginBottom: "8px" }}>
                      {company.employees}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Total Employees</div>
                  </div>
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "16px",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "24px", fontWeight: 600, color: company.color, marginBottom: "8px" }}>
                      {formatCurrency(company.revenue)}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Annual Revenue</div>
                  </div>
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "16px",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "24px", fontWeight: 600, color: company.color, marginBottom: "8px" }}>
                      {company.growth > 0 ? "+" : ""}{company.growth}%
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>Growth Rate</div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "team" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#333" }}>
                    Team Members
                  </h3>
                  <button
                    onClick={() => setShowAddStaff(true)}
                    style={{
                      backgroundColor: company.color,
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}
                  >
                    + Add Staff
                  </button>
                </div>
                <div style={{ display: "grid", gap: "12px" }}>
                  {(company.staff || []).map((staff, index) => (
                    <div
                      key={index}
                      style={{
                        backgroundColor: "#f8f9fa",
                        padding: "16px",
                        borderRadius: "8px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div>
                        <div style={{ fontSize: "16px", fontWeight: 500, color: "#333" }}>
                          {staff.name || staff}
                        </div>
                        <div style={{ fontSize: "12px", color: "#666" }}>
                          {staff.position || 'Team Member'}
                        </div>
                      </div>
                      <div style={{
                        backgroundColor: company.color + "20",
                        color: company.color,
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 500
                      }}>
                        Active
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "plans" && (
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                  <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600, color: "#333" }}>
                    Projects & Plans
                  </h3>
                  <button
                    onClick={() => setShowAddPlan(true)}
                    style={{
                      backgroundColor: company.color,
                      color: "white",
                      border: "none",
                      padding: "8px 16px",
                      borderRadius: "6px",
                      fontSize: "14px",
                      cursor: "pointer"
                    }}
                  >
                    + Add Plan
                  </button>
                </div>
                <div style={{ display: "grid", gap: "16px" }}>
                  {(company.plans || []).map((plan, index) => (
                    <div
                      key={plan.id}
                      style={{
                        backgroundColor: "#f8f9fa",
                        padding: "16px",
                        borderRadius: "8px",
                        border: "1px solid #e0e0e0"
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                        <div>
                          <h4 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 600, color: "#333" }}>
                            {plan.title}
                          </h4>
                          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                            Deadline: {new Date(plan.deadline).toLocaleDateString('ms-MY')}
                          </p>
                        </div>
                        <span style={{
                          backgroundColor: getStatusColor(plan.status),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "12px",
                          fontWeight: 500
                        }}>
                          {plan.status}
                        </span>
                      </div>
                      <div style={{
                        backgroundColor: "#fff",
                        padding: "8px 12px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        color: "#666"
                      }}>
                        Status: {plan.status} • Due {new Date(plan.deadline).toLocaleDateString('ms-MY')}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div>
                <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
                  Reports & Analytics
                </h3>
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", 
                  gap: "16px" 
                }}>
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "16px",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "32px", fontWeight: 600, color: company.color, marginBottom: "8px" }}>
                      📊
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                      Financial Reports
                    </div>
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                      View detailed financial statements
                    </div>
                  </div>
                  <div style={{
                    backgroundColor: "#f8f9fa",
                    padding: "16px",
                    borderRadius: "8px",
                    textAlign: "center"
                  }}>
                    <div style={{ fontSize: "32px", fontWeight: 600, color: company.color, marginBottom: "8px" }}>
                      📈
                    </div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                      Performance Metrics
                    </div>
                    <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
                      Track KPIs and performance
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

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
            padding: "24px",
            width: "90%",
            maxWidth: "400px"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
              Add Team Member
            </h3>
            <input
              type="text"
              value={newStaffName}
              onChange={(e) => setNewStaffName(e.target.value)}
              placeholder="Enter staff name"
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                marginBottom: "16px"
              }}
            />
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAddStaff(false)}
                style={{
                  backgroundColor: "transparent",
                  color: "#666",
                  border: "1px solid #ddd",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                style={{
                  backgroundColor: company.color,
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Add Staff
              </button>
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
            padding: "24px",
            width: "90%",
            maxWidth: "500px"
          }}>
            <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
              Add New Plan
            </h3>
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Plan Title
              </label>
              <input
                type="text"
                value={newPlan.title}
                onChange={(e) => setNewPlan({...newPlan, title: e.target.value})}
                placeholder="Enter plan title"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Status
                </label>
                <select
                  value={newPlan.status}
                  onChange={(e) => setNewPlan({...newPlan, status: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Deadline
                </label>
                <input
                  type="date"
                  value={newPlan.deadline}
                  onChange={(e) => setNewPlan({...newPlan, deadline: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
            </div>
            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAddPlan(false)}
                style={{
                  backgroundColor: "transparent",
                  color: "#666",
                  border: "1px solid #ddd",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddPlan}
                style={{
                  backgroundColor: company.color,
                  color: "white",
                  border: "none",
                  padding: "8px 16px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Add Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyManagementDetail;
