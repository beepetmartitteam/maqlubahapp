import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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

function CompanyManagementList() {
  const { isMobile } = useResponsive();
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    industry: "",
    employees: 0,
    revenue: 0,
    growth: 0,
    status: "active",
    color: "#1976d2",
    ceo: "",
    staff: [],
    plans: []
  });
  const [mobileCompanyList, setMobileCompanyList] = useState(false);
  const navigate = useNavigate();

  // Fetch companies from API
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyManagementAPI.getCompanies('dummy-token'); // Replace with actual auth token
      if (response.success) {
        setCompanies(response.data);
      } else {
        setError(response.error || 'Failed to fetch companies');
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      setError('Failed to connect to server');
      // Fallback to initial data for demo
      setCompanies(INITIAL_COMPANIES);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = (company) => {
    navigate(`/company-management/${company.id}`);
  };

  const handleAddCompany = async () => {
    if (newCompany.name.trim()) {
      try {
        const companyData = {
          ...newCompany,
          employees: parseInt(newCompany.employees) || 0,
          revenue: parseFloat(newCompany.revenue) || 0,
          growth: parseFloat(newCompany.growth) || 0
        };
        
        const response = await companyManagementAPI.createCompany('dummy-token', companyData); // Replace with actual auth token
        
        if (response.success) {
          setCompanies([...companies, response.data]);
          setNewCompany({
            name: "",
            industry: "",
            employees: 0,
            revenue: 0,
            growth: 0,
            status: "active",
            color: "#1976d2",
            ceo: "",
            staff: [],
            plans: []
          });
          setShowAddCompany(false);
        } else {
          setError(response.error || 'Failed to create company');
        }
      } catch (err) {
        console.error('Error adding company:', err);
        setError('Failed to add company');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active": return "#4caf50";
      case "inactive": return "#f44336";
      case "pending": return "#ff9800";
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
          <div>
            <h1 style={{ margin: 0, fontSize: isMobile ? "24px" : "32px", fontWeight: 600, color: "#333" }}>
              Company Management
            </h1>
            <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#666" }}>
              Manage your companies and track their performance
            </p>
          </div>
          <button
            onClick={() => setShowAddCompany(true)}
            style={{
              backgroundColor: "#1976d2",
              color: "white",
              border: "none",
              padding: "12px 24px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            + Add Company
          </button>
        </div>
      </div>

      {/* Mobile Company List Overlay */}
      {isMobile && mobileCompanyList && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          zIndex: 1000,
          display: "flex",
          justifyContent: "flex-end"
        }}>
          <div style={{
            width: "80%",
            height: "100vh",
            backgroundColor: "white",
            boxShadow: "-2px 0 8px rgba(0,0,0,0.1)",
            overflowY: "auto"
          }}>
            <div style={{ 
              padding: "16px", 
              borderBottom: "1px solid #e0e0e0",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}>
              <h3 style={{ margin: 0, fontSize: "18px", fontWeight: 600 }}>Companies</h3>
              <button
                onClick={() => setMobileCompanyList(false)}
                style={{
                  backgroundColor: "transparent",
                  border: "none",
                  fontSize: "20px",
                  cursor: "pointer",
                  color: "#666"
                }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "16px" }}>
              {companies.map(company => (
                <div
                  key={company.id}
                  onClick={() => handleCompanyClick(company)}
                  style={{
                    padding: "16px",
                    border: "1px solid #e0e0e0",
                    borderRadius: "8px",
                    marginBottom: "12px",
                    cursor: "pointer",
                    backgroundColor: "white",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                    <h4 style={{ margin: 0, fontSize: "16px", fontWeight: 600, color: "#333" }}>
                      {company.name}
                    </h4>
                    <span style={{
                      backgroundColor: getStatusColor(company.status),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: 500
                    }}>
                      {company.status}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
                    {company.industry}
                  </p>
                  <div style={{ display: "flex", gap: "16px", marginTop: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {company.employees} employees
                    </span>
                    <span style={{ fontSize: "12px", color: "#666" }}>
                      {formatCurrency(company.revenue)}
                    </span>
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
        <div style={{ padding: isMobile ? "16px" : "24px" }}>
          
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
                  onClick={fetchCompanies}
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
              color: "#333" 
            }}>
              Company Dashboard
            </h2>
            <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
              Overview of all companies and their performance metrics
            </p>
          </div>

          {/* Company Cards Grid */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(350px, 1fr))", 
            gap: isMobile ? "16px" : "24px" 
          }}>
            {loading ? (
              // Loading skeleton
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={`skeleton-${index}`}
                  style={{
                    backgroundColor: "white",
                    borderRadius: isMobile ? "8px" : "12px",
                    padding: isMobile ? "16px" : "24px",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                    border: "1px solid #e0e0e0"
                  }}
                >
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{
                      height: "20px",
                      backgroundColor: "#e0e0e0",
                      borderRadius: "4px",
                      marginBottom: "8px"
                    }}></div>
                    <div style={{
                      height: "14px",
                      backgroundColor: "#e0e0e0",
                      borderRadius: "4px",
                      width: "60%"
                    }}></div>
                  </div>
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(2, 1fr)", 
                    gap: "12px", 
                    marginBottom: "16px" 
                  }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i}>
                        <div style={{
                          height: "12px",
                          backgroundColor: "#e0e0e0",
                          borderRadius: "4px",
                          marginBottom: "4px"
                        }}></div>
                        <div style={{
                          height: "20px",
                          backgroundColor: "#e0e0e0",
                          borderRadius: "4px"
                        }}></div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              companies.map(company => (
              <div
                key={company.id}
                onClick={() => handleCompanyClick(company)}
                style={{
                  backgroundColor: "white",
                  borderRadius: isMobile ? "8px" : "12px",
                  padding: isMobile ? "16px" : "24px",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  border: "1px solid #e0e0e0",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                {/* Company Header */}
                <div style={{ marginBottom: "16px" }}>
                  <h3 style={{ 
                    margin: "0 0 8px 0", 
                    fontSize: "18px", 
                    fontWeight: 600, 
                    color: "#333",
                    wordBreak: "break-word"
                  }}>
                    {company.name}
                  </h3>
                  <p style={{ 
                    margin: 0, 
                    fontSize: "14px", 
                    color: "#666",
                    wordBreak: "break-word"
                  }}>
                    {company.industry}
                  </p>
                </div>

                {/* Company Stats */}
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(2, 1fr)", 
                  gap: "12px", 
                  marginBottom: "16px" 
                }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Employees</div>
                    <div style={{ fontSize: "20px", fontWeight: 600, color: company.color }}>
                      {company.employees}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Revenue</div>
                    <div style={{ fontSize: "20px", fontWeight: 600, color: company.color }}>
                      {formatCurrency(company.revenue)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Growth</div>
                    <div style={{ fontSize: "20px", fontWeight: 600, color: company.growth > 0 ? "#4caf50" : "#f44336" }}>
                      {company.growth > 0 ? "+" : ""}{company.growth}%
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Status</div>
                    <span style={{
                      backgroundColor: getStatusColor(company.status),
                      color: "white",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: 500
                    }}>
                      {company.status}
                    </span>
                  </div>
                </div>

                {/* CEO Info */}
                <div style={{ 
                  padding: "12px", 
                  backgroundColor: "#f8f9fa", 
                  borderRadius: "8px",
                  marginBottom: "16px"
                }}>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>CEO</div>
                  <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                    {company.ceo}
                  </div>
                </div>

                {/* Hover Overlay */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: "rgba(25, 118, 210, 0.1)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: 0,
                  transition: "opacity 0.3s ease"
                }}>
                  <div style={{
                    backgroundColor: company.color,
                    color: "white",
                    padding: "12px 24px",
                    borderRadius: "8px",
                    fontSize: "16px",
                    fontWeight: 600
                  }}>
                    View Details
                  </div>
                </div>
              </div>
            ))
            )}
          </div>

          {/* Empty State */}
          {companies.length === 0 && !loading && (
            <div style={{
              textAlign: "center",
              padding: "48px 24px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🏢</div>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: 600, color: "#333" }}>
                No Companies Yet
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#666", marginBottom: "24px" }}>
                Start by adding your first company to manage
              </p>
              <button
                onClick={() => setShowAddCompany(true)}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  fontWeight: 500,
                  cursor: "pointer"
                }}
              >
                Add Your First Company
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Company Dialog */}
      {showAddCompany && (
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
            maxWidth: "500px",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            <h3 style={{ margin: "0 0 24px 0", fontSize: "20px", fontWeight: 600, color: "#333" }}>
              Add New Company
            </h3>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Company Name
              </label>
              <input
                type="text"
                value={newCompany.name}
                onChange={(e) => setNewCompany({...newCompany, name: e.target.value})}
                placeholder="Enter company name"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px"
                }}
              />
            </div>

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Industry
              </label>
              <input
                type="text"
                value={newCompany.industry}
                onChange={(e) => setNewCompany({...newCompany, industry: e.target.value})}
                placeholder="Enter industry"
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
                  Employees
                </label>
                <input
                  type="number"
                  value={newCompany.employees}
                  onChange={(e) => setNewCompany({...newCompany, employees: e.target.value})}
                  placeholder="0"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Revenue (RM)
                </label>
                <input
                  type="number"
                  value={newCompany.revenue}
                  onChange={(e) => setNewCompany({...newCompany, revenue: e.target.value})}
                  placeholder="0"
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Growth (%)
                </label>
                <input
                  type="number"
                  value={newCompany.growth}
                  onChange={(e) => setNewCompany({...newCompany, growth: e.target.value})}
                  placeholder="0"
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  CEO
                </label>
                <input
                  type="text"
                  value={newCompany.ceo}
                  onChange={(e) => setNewCompany({...newCompany, ceo: e.target.value})}
                  placeholder="Enter CEO name"
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
                onClick={() => setShowAddCompany(false)}
                style={{
                  backgroundColor: "transparent",
                  color: "#666",
                  border: "1px solid #ddd",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleAddCompany}
                style={{
                  backgroundColor: "#1976d2",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Add Company
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyManagementList;
