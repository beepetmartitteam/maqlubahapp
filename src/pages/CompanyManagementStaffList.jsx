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

const INITIAL_STAFF = [
  {
    id: 1,
    name: "Tn Mohd Shukri",
    position: "CEO",
    department: "Management",
    email: "mohd.shukri@insafora.com",
    phone: "+60123456789",
    companyId: 1,
    companyName: "Insafora Ventures Sdn Bhd",
    status: "active",
    joinDate: "2020-01-15",
    salary: 15000,
    performance: 95,
    skills: ["Leadership", "Strategic Planning", "Business Development"]
  },
  {
    id: 2,
    name: "Tn Fadhil Yasin",
    position: "Operations Manager",
    department: "Operations",
    email: "fadhil.yasin@insafora.com",
    phone: "+60123456790",
    companyId: 1,
    companyName: "Insafora Ventures Sdn Bhd",
    status: "active",
    joinDate: "2020-03-20",
    salary: 8000,
    performance: 88,
    skills: ["Operations", "Team Management", "Process Optimization"]
  },
  {
    id: 3,
    name: "Tn Nik Hazani",
    position: "CEO",
    department: "Management",
    email: "nik.hazani@manufacturing.com",
    phone: "+60123456791",
    companyId: 2,
    companyName: "Manufacturing Syarikat",
    status: "active",
    joinDate: "2019-06-10",
    salary: 12000,
    performance: 92,
    skills: ["Manufacturing", "Quality Control", "Supply Chain"]
  },
  {
    id: 4,
    name: "Tn Amin",
    position: "Production Manager",
    department: "Production",
    email: "amin@manufacturing.com",
    phone: "+60123456792",
    companyId: 2,
    companyName: "Manufacturing Syarikat",
    status: "active",
    joinDate: "2019-08-15",
    salary: 7000,
    performance: 85,
    skills: ["Production Planning", "Quality Assurance", "Team Leadership"]
  },
  {
    id: 5,
    name: "Tn Anuar",
    position: "CEO",
    department: "Management",
    email: "anuar@fatehlivestock.com",
    phone: "+60123456793",
    companyId: 3,
    companyName: "Fateh Livestock",
    status: "active",
    joinDate: "2021-02-01",
    salary: 10000,
    performance: 90,
    skills: ["Livestock Management", "Agriculture", "Business Strategy"]
  }
];

function CompanyManagementStaffList() {
  const { isMobile } = useResponsive();
  const [staff, setStaff] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddStaff, setShowAddStaff] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("");
  const [newStaff, setNewStaff] = useState({
    name: "",
    position: "",
    department: "",
    email: "",
    phone: "",
    companyId: "",
    status: "active",
    joinDate: "",
    salary: 0,
    performance: 0,
    skills: []
  });
  const navigate = useNavigate();

  // Fetch staff and companies from API
  useEffect(() => {
    fetchStaff();
    fetchCompanies();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      setError(null);
      // For now, use initial data. In production, this would call the API
      setStaff(INITIAL_STAFF);
    } catch (err) {
      console.error('Error fetching staff:', err);
      setError('Failed to connect to server');
      setStaff(INITIAL_STAFF);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await companyManagementAPI.getCompanies('dummy-token');
      if (response.success) {
        setCompanies(response.data);
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
      // Fallback to some default companies for dropdown
      setCompanies([
        { id: 1, name: "Insafora Ventures Sdn Bhd" },
        { id: 2, name: "Manufacturing Syarikat" },
        { id: 3, name: "Fateh Livestock" }
      ]);
    }
  };

  const handleStaffClick = (staffMember) => {
    navigate(`/company-management/${staffMember.companyId}`);
  };

  const handleAddStaff = async () => {
    if (newStaff.name.trim() && newStaff.companyId) {
      try {
        const staffData = {
          ...newStaff,
          salary: parseFloat(newStaff.salary) || 0,
          performance: parseInt(newStaff.performance) || 0,
          companyId: parseInt(newStaff.companyId)
        };
        
        // For now, just add to local state
        const newStaffWithId = {
          ...staffData,
          id: Date.now(),
          companyName: companies.find(c => c.id === parseInt(staffData.companyId))?.name || "Unknown Company"
        };
        
        setStaff([...staff, newStaffWithId]);
        setNewStaff({
          name: "",
          position: "",
          department: "",
          email: "",
          phone: "",
          companyId: "",
          status: "active",
          joinDate: "",
          salary: 0,
          performance: 0,
          skills: []
        });
        setShowAddStaff(false);
      } catch (err) {
        console.error('Error adding staff:', err);
        setError('Failed to add staff member');
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

  const getPerformanceColor = (performance) => {
    if (performance >= 90) return "#4caf50";
    if (performance >= 75) return "#ff9800";
    return "#f44336";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('ms-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter staff based on search and filters
  const filteredStaff = staff.filter(staffMember => {
    const matchesSearch = staffMember.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staffMember.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         staffMember.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = !filterCompany || staffMember.companyId === parseInt(filterCompany);
    const matchesDepartment = !filterDepartment || staffMember.department === filterDepartment;
    
    return matchesSearch && matchesCompany && matchesDepartment;
  });

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
              Staff Management
            </h1>
            <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#666" }}>
              Manage staff across all companies
            </p>
          </div>
          <button
            onClick={() => setShowAddStaff(true)}
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
            + Add Staff
          </button>
        </div>
      </div>

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
                  onClick={fetchStaff}
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

          {/* Filters and Search */}
          <div style={{
            backgroundColor: "white",
            borderRadius: isMobile ? "8px" : "12px",
            padding: isMobile ? "16px" : "24px",
            marginBottom: isMobile ? "16px" : "24px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(250px, 1fr))", 
              gap: "16px" 
            }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Search Staff
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, position, or email..."
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
                  Company
                </label>
                <select
                  value={filterCompany}
                  onChange={(e) => setFilterCompany(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="">All Companies</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Department
                </label>
                <select
                  value={filterDepartment}
                  onChange={(e) => setFilterDepartment(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="">All Departments</option>
                  <option value="Management">Management</option>
                  <option value="Operations">Operations</option>
                  <option value="Production">Production</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>
            </div>
          </div>

          {/* Staff Stats */}
          <div style={{
            backgroundColor: "white",
            borderRadius: isMobile ? "8px" : "12px",
            padding: isMobile ? "16px" : "24px",
            marginBottom: isMobile ? "16px" : "24px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }}>
            <h2 style={{ 
              margin: "0 0 16px 0", 
              fontSize: isMobile ? "18px" : "20px", 
              fontWeight: 600, 
              color: "#333" 
            }}>
              Staff Overview
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
              gap: "16px" 
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#1976d2" }}>
                  {staff.length}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>Total Staff</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#4caf50" }}>
                  {staff.filter(s => s.status === 'active').length}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>Active Staff</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#ff9800" }}>
                  {companies.length}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>Companies</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#9c27b0" }}>
                  {Math.round(staff.reduce((acc, s) => acc + s.performance, 0) / staff.length) || 0}%
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>Avg Performance</div>
              </div>
            </div>
          </div>

          {/* Staff Cards Grid */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(380px, 1fr))", 
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
              filteredStaff.map(staffMember => (
                <div
                  key={staffMember.id}
                  onClick={() => handleStaffClick(staffMember)}
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
                  {/* Staff Header */}
                  <div style={{ marginBottom: "16px" }}>
                    <h3 style={{ 
                      margin: "0 0 8px 0", 
                      fontSize: "18px", 
                      fontWeight: 600, 
                      color: "#333",
                      wordBreak: "break-word"
                    }}>
                      {staffMember.name}
                    </h3>
                    <p style={{ 
                      margin: 0, 
                      fontSize: "14px", 
                      color: "#666",
                      wordBreak: "break-word"
                    }}>
                      {staffMember.position} • {staffMember.companyName}
                    </p>
                  </div>

                  {/* Staff Stats */}
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(2, 1fr)", 
                    gap: "12px", 
                    marginBottom: "16px" 
                  }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Department</div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                        {staffMember.department}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Salary</div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#1976d2" }}>
                        {formatCurrency(staffMember.salary)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Performance</div>
                      <div style={{ 
                        fontSize: "14px", 
                        fontWeight: 600, 
                        color: getPerformanceColor(staffMember.performance) 
                      }}>
                        {staffMember.performance}%
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Status</div>
                      <span style={{
                        backgroundColor: getStatusColor(staffMember.status),
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "12px",
                        fontWeight: 500
                      }}>
                        {staffMember.status}
                      </span>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div style={{ 
                    padding: "12px", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "8px",
                    marginBottom: "16px"
                  }}>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Contact</div>
                    <div style={{ fontSize: "12px", color: "#333", marginBottom: "2px" }}>
                      📧 {staffMember.email}
                    </div>
                    <div style={{ fontSize: "12px", color: "#333" }}>
                      📱 {staffMember.phone}
                    </div>
                  </div>

                  {/* Skills */}
                  {staffMember.skills && staffMember.skills.length > 0 && (
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Skills</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {staffMember.skills.map((skill, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: "#e3f2fd",
                              color: "#1976d2",
                              padding: "4px 8px",
                              borderRadius: "12px",
                              fontSize: "11px",
                              fontWeight: 500
                            }}
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Join Date */}
                  <div style={{ fontSize: "12px", color: "#999" }}>
                    Joined: {formatDate(staffMember.joinDate)}
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
                      backgroundColor: "#1976d2",
                      color: "white",
                      padding: "12px 24px",
                      borderRadius: "8px",
                      fontSize: "16px",
                      fontWeight: 600
                    }}>
                      View Company
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Empty State */}
          {filteredStaff.length === 0 && !loading && (
            <div style={{
              textAlign: "center",
              padding: "48px 24px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: 600, color: "#333" }}>
                No Staff Found
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#666", marginBottom: "24px" }}>
                {searchTerm || filterCompany || filterDepartment 
                  ? "Try adjusting your filters or search terms"
                  : "Start by adding your first staff member"}
              </p>
              <button
                onClick={() => setShowAddStaff(true)}
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
                Add Staff Member
              </button>
            </div>
          )}
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
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            <h3 style={{ margin: "0 0 24px 0", fontSize: "20px", fontWeight: 600, color: "#333" }}>
              Add New Staff Member
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Name *
                </label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  placeholder="Enter staff name"
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
                  Position *
                </label>
                <input
                  type="text"
                  value={newStaff.position}
                  onChange={(e) => setNewStaff({...newStaff, position: e.target.value})}
                  placeholder="Enter position"
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
                  Department
                </label>
                <select
                  value={newStaff.department}
                  onChange={(e) => setNewStaff({...newStaff, department: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="">Select Department</option>
                  <option value="Management">Management</option>
                  <option value="Operations">Operations</option>
                  <option value="Production">Production</option>
                  <option value="Sales">Sales</option>
                  <option value="HR">HR</option>
                  <option value="Finance">Finance</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Company *
                </label>
                <select
                  value={newStaff.companyId}
                  onChange={(e) => setNewStaff({...newStaff, companyId: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="">Select Company</option>
                  {companies.map(company => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Email
                </label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  placeholder="Enter email"
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
                  Phone
                </label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) => setNewStaff({...newStaff, phone: e.target.value})}
                  placeholder="Enter phone number"
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
                  Salary (RM)
                </label>
                <input
                  type="number"
                  value={newStaff.salary}
                  onChange={(e) => setNewStaff({...newStaff, salary: e.target.value})}
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
                  Performance (%)
                </label>
                <input
                  type="number"
                  value={newStaff.performance}
                  onChange={(e) => setNewStaff({...newStaff, performance: e.target.value})}
                  placeholder="0-100"
                  min="0"
                  max="100"
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
                onClick={() => setShowAddStaff(false)}
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
                onClick={handleAddStaff}
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
                Add Staff
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyManagementStaffList;
