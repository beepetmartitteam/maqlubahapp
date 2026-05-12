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

const INITIAL_PLANS = [
  {
    id: 1,
    title: "Restoran Luar Negara Expansion",
    description: "Expand restaurant operations to international markets including Singapore and Thailand",
    status: "planning",
    priority: "high",
    companyId: 1,
    companyName: "Insafora Ventures Sdn Bhd",
    startDate: "2024-01-01",
    deadline: "2024-12-31",
    budget: 500000,
    progress: 25,
    assignedTeam: ["Tn Mohd Shukri", "Tn Fadhil Yasin"],
    category: "Expansion",
    milestones: [
      { title: "Market Research", completed: true, dueDate: "2024-03-31" },
      { title: "Legal Setup", completed: false, dueDate: "2024-06-30" },
      { title: "Location Selection", completed: false, dueDate: "2024-09-30" }
    ]
  },
  {
    id: 2,
    title: "Foodtruck Operations",
    description: "Launch mobile food truck business for urban areas and events",
    status: "in-progress",
    priority: "medium",
    companyId: 1,
    companyName: "Insafora Ventures Sdn Bhd",
    startDate: "2024-02-01",
    deadline: "2024-11-30",
    budget: 150000,
    progress: 60,
    assignedTeam: ["Tn Fadhil Yasin"],
    category: "New Business",
    milestones: [
      { title: "Vehicle Purchase", completed: true, dueDate: "2024-03-15" },
      { title: "Equipment Setup", completed: true, dueDate: "2024-05-01" },
      { title: "Launch Operations", completed: false, dueDate: "2024-07-01" }
    ]
  },
  {
    id: 3,
    title: "Kilang Roti & Mi Setup",
    description: "Establish modern bakery and noodle manufacturing facility",
    status: "completed",
    priority: "high",
    companyId: 2,
    companyName: "Manufacturing Syarikat",
    startDate: "2024-01-15",
    deadline: "2024-10-15",
    budget: 800000,
    progress: 100,
    assignedTeam: ["Tn Nik Hazani", "Tn Amin"],
    category: "Infrastructure",
    milestones: [
      { title: "Factory Setup", completed: true, dueDate: "2024-05-01" },
      { title: "Equipment Installation", completed: true, dueDate: "2024-07-01" },
      { title: "Production Start", completed: true, dueDate: "2024-10-15" }
    ]
  },
  {
    id: 4,
    title: "Produk Retort Development",
    description: "Research and develop new retort packaging products",
    status: "in-progress",
    priority: "medium",
    companyId: 2,
    companyName: "Manufacturing Syarikat",
    startDate: "2024-06-01",
    deadline: "2024-11-20",
    budget: 200000,
    progress: 45,
    assignedTeam: ["Tn Amin"],
    category: "R&D",
    milestones: [
      { title: "Research Phase", completed: true, dueDate: "2024-07-31" },
      { title: "Prototype Development", completed: false, dueDate: "2024-09-30" },
      { title: "Testing & Validation", completed: false, dueDate: "2024-11-20" }
    ]
  },
  {
    id: 5,
    title: "Ternakan Lembu Expansion",
    description: "Expand cattle farming operations and increase herd capacity",
    status: "planning",
    priority: "high",
    companyId: 3,
    companyName: "Fateh Livestock",
    startDate: "2024-03-01",
    deadline: "2024-12-01",
    budget: 600000,
    progress: 15,
    assignedTeam: ["Tn Anuar"],
    category: "Expansion",
    milestones: [
      { title: "Land Acquisition", completed: true, dueDate: "2024-05-31" },
      { title: "Facility Construction", completed: false, dueDate: "2024-09-30" },
      { title: "Livestock Purchase", completed: false, dueDate: "2024-12-01" }
    ]
  }
];

function CompanyManagementPlanList() {
  const { isMobile } = useResponsive();
  const [plans, setPlans] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCompany, setFilterCompany] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [newPlan, setNewPlan] = useState({
    title: "",
    description: "",
    status: "planning",
    priority: "medium",
    companyId: "",
    startDate: "",
    deadline: "",
    budget: 0,
    category: "",
    assignedTeam: [],
    milestones: []
  });
  const navigate = useNavigate();

  // Fetch plans and companies from API
  useEffect(() => {
    fetchPlans();
    fetchCompanies();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      setError(null);
      // For now, use initial data. In production, this would call API
      setPlans(INITIAL_PLANS);
    } catch (err) {
      console.error('Error fetching plans:', err);
      setError('Failed to connect to server');
      setPlans(INITIAL_PLANS);
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

  const handlePlanClick = (plan) => {
    navigate(`/company-management/${plan.companyId}`);
  };

  const handleAddPlan = async () => {
    if (newPlan.title.trim() && newPlan.companyId) {
      try {
        const planData = {
          ...newPlan,
          budget: parseFloat(newPlan.budget) || 0,
          companyId: parseInt(newPlan.companyId)
        };
        
        // For now, just add to local state
        const newPlanWithId = {
          ...planData,
          id: Date.now(),
          companyName: companies.find(c => c.id === parseInt(planData.companyId))?.name || "Unknown Company",
          progress: 0,
          milestones: []
        };
        
        setPlans([...plans, newPlanWithId]);
        setNewPlan({
          title: "",
          description: "",
          status: "planning",
          priority: "medium",
          companyId: "",
          startDate: "",
          deadline: "",
          budget: 0,
          category: "",
          assignedTeam: [],
          milestones: []
        });
        setShowAddPlan(false);
      } catch (err) {
        console.error('Error adding plan:', err);
        setError('Failed to add business plan');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "planning": return "#2196f3";
      case "in-progress": return "#ff9800";
      case "completed": return "#4caf50";
      case "on-hold": return "#f44336";
      default: return "#9e9e9e";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#f44336";
      case "medium": return "#ff9800";
      case "low": return "#4caf50";
      default: return "#9e9e9e";
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 75) return "#4caf50";
    if (progress >= 50) return "#ff9800";
    if (progress >= 25) return "#ff5722";
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

  // Filter plans based on search and filters
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCompany = !filterCompany || plan.companyId === parseInt(filterCompany);
    const matchesStatus = !filterStatus || plan.status === filterStatus;
    const matchesCategory = !filterCategory || plan.category === filterCategory;
    
    return matchesSearch && matchesCompany && matchesStatus && matchesCategory;
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
              Business Plans
            </h1>
            <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#666" }}>
              Manage strategic plans and track progress across all companies
            </p>
          </div>
          <button
            onClick={() => setShowAddPlan(true)}
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
            + Add Plan
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
                  onClick={fetchPlans}
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
                  Search Plans
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by title or description..."
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
                  Status
                </label>
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="">All Status</option>
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Category
                </label>
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="">All Categories</option>
                  <option value="Expansion">Expansion</option>
                  <option value="New Business">New Business</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="R&D">R&D</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
            </div>
          </div>

          {/* Plans Stats */}
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
              Plans Overview
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
              gap: "16px" 
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#1976d2" }}>
                  {plans.length}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>Total Plans</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#ff9800" }}>
                  {plans.filter(p => p.status === 'in-progress').length}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>In Progress</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#4caf50" }}>
                  {plans.filter(p => p.status === 'completed').length}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>Completed</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#9c27b0" }}>
                  {formatCurrency(plans.reduce((acc, p) => acc + p.budget, 0))}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>Total Budget</div>
              </div>
            </div>
          </div>

          {/* Plan Cards Grid */}
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(400px, 1fr))", 
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
              filteredPlans.map(plan => (
                <div
                  key={plan.id}
                  onClick={() => handlePlanClick(plan)}
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
                  {/* Plan Header */}
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <h3 style={{ 
                        margin: "0", 
                        fontSize: "18px", 
                        fontWeight: 600, 
                        color: "#333",
                        wordBreak: "break-word",
                        flex: 1,
                        marginRight: "12px"
                      }}>
                        {plan.title}
                      </h3>
                      <div style={{ display: "flex", gap: "6px" }}>
                        <span style={{
                          backgroundColor: getStatusColor(plan.status),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 500,
                          textTransform: "capitalize"
                        }}>
                          {plan.status.replace('-', ' ')}
                        </span>
                        <span style={{
                          backgroundColor: getPriorityColor(plan.priority),
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "11px",
                          fontWeight: 500,
                          textTransform: "capitalize"
                        }}>
                          {plan.priority}
                        </span>
                      </div>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: "14px", 
                      color: "#666",
                      lineHeight: 1.5,
                      wordBreak: "break-word"
                    }}>
                      {plan.description}
                    </p>
                  </div>

                  {/* Plan Stats */}
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(2, 1fr)", 
                    gap: "12px", 
                    marginBottom: "16px" 
                  }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Company</div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                        {plan.companyName}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Category</div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                        {plan.category}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Budget</div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: "#1976d2" }}>
                        {formatCurrency(plan.budget)}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Deadline</div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                        {formatDate(plan.deadline)}
                      </div>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ 
                      display: "flex", 
                      justifyContent: "space-between", 
                      alignItems: "center", 
                      marginBottom: "8px" 
                    }}>
                      <div style={{ fontSize: "12px", color: "#666" }}>Progress</div>
                      <div style={{ fontSize: "14px", fontWeight: 600, color: getProgressColor(plan.progress) }}>
                        {plan.progress}%
                      </div>
                    </div>
                    <div style={{
                      height: "8px",
                      backgroundColor: "#e0e0e0",
                      borderRadius: "4px",
                      overflow: "hidden"
                    }}>
                      <div style={{
                        height: "100%",
                        width: `${plan.progress}%`,
                        backgroundColor: getProgressColor(plan.progress),
                        transition: "width 0.3s ease"
                      }}></div>
                    </div>
                  </div>

                  {/* Team Info */}
                  <div style={{ 
                    padding: "12px", 
                    backgroundColor: "#f8f9fa", 
                    borderRadius: "8px",
                    marginBottom: "16px"
                  }}>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Assigned Team</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                      {plan.assignedTeam.map((member, index) => (
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
                          {member}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Milestones */}
                  {plan.milestones && plan.milestones.length > 0 && (
                    <div style={{ marginBottom: "16px" }}>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Milestones</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                        {plan.milestones.slice(0, 3).map((milestone, index) => (
                          <div key={index} style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            gap: "8px",
                            fontSize: "12px",
                            color: milestone.completed ? "#4caf50" : "#666"
                          }}>
                            <div style={{
                              width: "12px",
                              height: "12px",
                              borderRadius: "50%",
                              backgroundColor: milestone.completed ? "#4caf50" : "#e0e0e0",
                              border: milestone.completed ? "none" : "2px solid #666"
                            }}></div>
                            <span>{milestone.title}</span>
                            <span style={{ marginLeft: "auto", fontSize: "11px", color: "#999" }}>
                              {formatDate(milestone.dueDate)}
                            </span>
                          </div>
                        ))}
                        {plan.milestones.length > 3 && (
                          <div style={{ fontSize: "11px", color: "#999", textAlign: "center" }}>
                            +{plan.milestones.length - 3} more milestones
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Date Range */}
                  <div style={{ fontSize: "12px", color: "#999", display: "flex", justifyContent: "space-between" }}>
                    <span>Start: {formatDate(plan.startDate)}</span>
                    <span>End: {formatDate(plan.deadline)}</span>
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
          {filteredPlans.length === 0 && !loading && (
            <div style={{
              textAlign: "center",
              padding: "48px 24px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>📋</div>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: 600, color: "#333" }}>
                No Plans Found
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#666", marginBottom: "24px" }}>
                {searchTerm || filterCompany || filterStatus || filterCategory 
                  ? "Try adjusting your filters or search terms"
                  : "Start by creating your first business plan"}
              </p>
              <button
                onClick={() => setShowAddPlan(true)}
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
                Create Plan
              </button>
            </div>
          )}
        </div>
      </div>

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
            maxWidth: "600px",
            maxHeight: "80vh",
            overflowY: "auto"
          }}>
            <h3 style={{ margin: "0 0 24px 0", fontSize: "20px", fontWeight: 600, color: "#333" }}>
              Create New Business Plan
            </h3>
            
            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Plan Title *
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

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Description
              </label>
              <textarea
                value={newPlan.description}
                onChange={(e) => setNewPlan({...newPlan, description: e.target.value})}
                placeholder="Describe the business plan..."
                rows={4}
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "1px solid #ddd",
                  borderRadius: "6px",
                  fontSize: "14px",
                  resize: "vertical"
                }}
              />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Company *
                </label>
                <select
                  value={newPlan.companyId}
                  onChange={(e) => setNewPlan({...newPlan, companyId: e.target.value})}
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

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Category
                </label>
                <select
                  value={newPlan.category}
                  onChange={(e) => setNewPlan({...newPlan, category: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="">Select Category</option>
                  <option value="Expansion">Expansion</option>
                  <option value="New Business">New Business</option>
                  <option value="Infrastructure">Infrastructure</option>
                  <option value="R&D">R&D</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Operations">Operations</option>
                </select>
              </div>
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
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Priority
                </label>
                <select
                  value={newPlan.priority}
                  onChange={(e) => setNewPlan({...newPlan, priority: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Start Date
                </label>
                <input
                  type="date"
                  value={newPlan.startDate}
                  onChange={(e) => setNewPlan({...newPlan, startDate: e.target.value})}
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

            <div style={{ marginBottom: "16px" }}>
              <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                Budget (RM)
              </label>
              <input
                type="number"
                value={newPlan.budget}
                onChange={(e) => setNewPlan({...newPlan, budget: e.target.value})}
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

            <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAddPlan(false)}
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
                onClick={handleAddPlan}
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
                Create Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default CompanyManagementPlanList;
