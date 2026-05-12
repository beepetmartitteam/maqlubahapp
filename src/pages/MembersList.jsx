import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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

function MembersList() {
  const { isMobile } = useResponsive();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAddMember, setShowAddMember] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [newMember, setNewMember] = useState({
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
    status: "active"
  });
  const navigate = useNavigate();

  // Fetch members from API
  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      // For now, use initial data. In production, this would call API
      setMembers(INITIAL_MEMBERS);
    } catch (err) {
      console.error('Error fetching members:', err);
      setError('Failed to connect to server');
      setMembers(INITIAL_MEMBERS);
    } finally {
      setLoading(false);
    }
  };

  const handleMemberClick = (member) => {
    navigate(`/member-detail/${member.id}`);
  };

  const handleAddMember = async () => {
    if (newMember.husbandName.trim() && newMember.phone.trim()) {
      try {
        const memberData = {
          ...newMember,
          age: parseInt(newMember.age) || 0,
          marriedChildren: parseInt(newMember.marriedChildren) || 0,
          unmarriedChildren: parseInt(newMember.unmarriedChildren) || 0
        };
        
        // For now, just add to local state
        const newMemberWithId = {
          ...memberData,
          id: Date.now(),
          joinDate: new Date().toISOString().split('T')[0],
          lastUpdated: new Date().toISOString().split('T')[0],
          // Add default values for assessment fields
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
          summary: ""
        };
        
        setMembers([...members, newMemberWithId]);
        setNewMember({
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
          status: "active"
        });
        setShowAddMember(false);
      } catch (err) {
        console.error('Error adding member:', err);
        setError('Failed to add member');
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

  const getAssessmentColor = (score) => {
    if (score >= 4) return "#4caf50";
    if (score >= 3) return "#ff9800";
    return "#f44336";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Filter members based on search and filters
  const filteredMembers = members.filter(member => {
    const matchesSearch = member.husbandName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         member.phone.includes(searchTerm) ||
                         member.currentJob.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesState = !filterState || member.state === filterState;
    const matchesStatus = !filterStatus || member.status === filterStatus;
    
    return matchesSearch && matchesState && matchesStatus;
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
              Members Management
            </h1>
            <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#666" }}>
              Manage member profiles and membership information
            </p>
          </div>
          <button
            onClick={() => setShowAddMember(true)}
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
            + Add Member
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
                  onClick={fetchMembers}
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
                  Search Members
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name, phone, or job..."
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
                  State
                </label>
                <select
                  value={filterState}
                  onChange={(e) => setFilterState(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="">All States</option>
                  <option value="Selangor">Selangor</option>
                  <option value="Wilayah Persekutuan">Wilayah Persekutuan</option>
                  <option value="Kuala Lumpur">Kuala Lumpur</option>
                  <option value="Johor">Johor</option>
                  <option value="Perak">Perak</option>
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
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>

          {/* Members Stats */}
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
              Members Overview
            </h2>
            <div style={{ 
              display: "grid", 
              gridTemplateColumns: isMobile ? "repeat(2, 1fr)" : "repeat(4, 1fr)", 
              gap: "16px" 
            }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#1976d2" }}>
                  {members.length}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>Total Members</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#4caf50" }}>
                  {members.filter(m => m.status === 'active').length}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>Active Members</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#ff9800" }}>
                  {members.reduce((acc, m) => acc + (m.marriedChildren + m.unmarriedChildren), 0)}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>Total Children</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "24px", fontWeight: 700, color: "#9c27b0" }}>
                  {new Set(members.map(m => m.state)).size}
                </div>
                <div style={{ fontSize: "14px", color: "#666" }}>States Covered</div>
              </div>
            </div>
          </div>

          {/* Member Cards Grid */}
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
              filteredMembers.map(member => (
                <div
                  key={member.id}
                  onClick={() => handleMemberClick(member)}
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
                  {/* Member Header */}
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                      <h3 style={{ 
                        margin: 0, 
                        fontSize: "18px", 
                        fontWeight: 600, 
                        color: "#333",
                        wordBreak: "break-word",
                        flex: 1,
                        marginRight: "12px"
                      }}>
                        {member.husbandName}
                      </h3>
                      <span style={{
                        backgroundColor: getStatusColor(member.status),
                        color: "white",
                        padding: "4px 8px",
                        borderRadius: "4px",
                        fontSize: "11px",
                        fontWeight: 500,
                        textTransform: "capitalize"
                      }}>
                        {member.status}
                      </span>
                    </div>
                    <p style={{ 
                      margin: 0, 
                      fontSize: "14px", 
                      color: "#666",
                      lineHeight: 1.5
                    }}>
                      {member.currentJob} • {member.companyName}
                    </p>
                  </div>

                  {/* Member Stats */}
                  <div style={{ 
                    display: "grid", 
                    gridTemplateColumns: "repeat(2, 1fr)", 
                    gap: "12px", 
                    marginBottom: "16px" 
                  }}>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Age</div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                        {member.age} years
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Location</div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                        {member.district}, {member.state}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Family</div>
                      <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                        {member.wives.length} wives, {member.marriedChildren + member.unmarriedChildren} children
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: "12px", color: "#666", marginBottom: "4px" }}>Overall Assessment</div>
                      <div style={{ 
                        fontSize: "14px", 
                        fontWeight: 600, 
                        color: getAssessmentColor(
                          Math.round((member.struggleAssessment + member.familyManagementAssessment + member.welfareAssessment + member.fivePAssessment + member.complianceAssessment) / 5)
                        ) 
                      }}>
                        {Math.round((member.struggleAssessment + member.familyManagementAssessment + member.welfareAssessment + member.fivePAssessment + member.complianceAssessment) / 5)}/5
                      </div>
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
                      📱 {member.phone}
                    </div>
                    <div style={{ fontSize: "12px", color: "#333" }}>
                      📍 {member.homeAddress}
                    </div>
                  </div>

                  {/* Assessment Preview */}
                  <div style={{ marginBottom: "16px" }}>
                    <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>Key Assessments</div>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <span style={{
                        backgroundColor: "#e3f2fd",
                        color: "#1976d2",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 500
                      }}>
                        Struggle: {member.struggleAssessment}/5
                      </span>
                      <span style={{
                        backgroundColor: "#e8f5e8",
                        color: "#4caf50",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 500
                      }}>
                        Family: {member.familyManagementAssessment}/5
                      </span>
                      <span style={{
                        backgroundColor: "#fff3e0",
                        color: "#ff9800",
                        padding: "4px 8px",
                        borderRadius: "12px",
                        fontSize: "11px",
                        fontWeight: 500
                      }}>
                        5P: {member.fivePAssessment}/5
                      </span>
                    </div>
                  </div>

                  {/* Summary */}
                  <div style={{ 
                    fontSize: "12px", 
                    color: "#666", 
                    fontStyle: "italic",
                    lineHeight: 1.4,
                    marginBottom: "16px"
                  }}>
                    {member.summary}
                  </div>

                  {/* Dates */}
                  <div style={{ fontSize: "12px", color: "#999", display: "flex", justifyContent: "space-between" }}>
                    <span>Joined: {formatDate(member.joinDate)}</span>
                    <span>Updated: {formatDate(member.lastUpdated)}</span>
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
                      View Details
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Empty State */}
          {filteredMembers.length === 0 && !loading && (
            <div style={{
              textAlign: "center",
              padding: "48px 24px",
              backgroundColor: "white",
              borderRadius: "12px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
            }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>👥</div>
              <h3 style={{ margin: "0 0 8px 0", fontSize: "20px", fontWeight: 600, color: "#333" }}>
                No Members Found
              </h3>
              <p style={{ margin: 0, fontSize: "14px", color: "#666", marginBottom: "24px" }}>
                {searchTerm || filterState || filterStatus 
                  ? "Try adjusting your filters or search terms"
                  : "Start by adding your first member"}
              </p>
              <button
                onClick={() => setShowAddMember(true)}
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
                Add Member
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Member Dialog */}
      {showAddMember && (
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
              Add New Member
            </h3>
            
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Husband Name *
                </label>
                <input
                  type="text"
                  value={newMember.husbandName}
                  onChange={(e) => setNewMember({...newMember, husbandName: e.target.value})}
                  placeholder="Enter husband's name"
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
                  Age
                </label>
                <input
                  type="number"
                  value={newMember.age}
                  onChange={(e) => setNewMember({...newMember, age: e.target.value})}
                  placeholder="Enter age"
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
                  Phone *
                </label>
                <input
                  type="tel"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({...newMember, phone: e.target.value})}
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

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  District
                </label>
                <input
                  type="text"
                  value={newMember.district}
                  onChange={(e) => setNewMember({...newMember, district: e.target.value})}
                  placeholder="Enter district"
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
                Home Address
              </label>
              <input
                type="text"
                value={newMember.homeAddress}
                onChange={(e) => setNewMember({...newMember, homeAddress: e.target.value})}
                placeholder="Enter home address"
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
                  State
                </label>
                <select
                  value={newMember.state}
                  onChange={(e) => setNewMember({...newMember, state: e.target.value})}
                  style={{
                    width: "100%",
                    padding: "12px",
                    border: "1px solid #ddd",
                    borderRadius: "6px",
                    fontSize: "14px"
                  }}
                >
                  <option value="">Select State</option>
                  <option value="Selangor">Selangor</option>
                  <option value="Wilayah Persekutuan">Wilayah Persekutuan</option>
                  <option value="Kuala Lumpur">Kuala Lumpur</option>
                  <option value="Johor">Johor</option>
                  <option value="Perak">Perak</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 500, color: "#333", marginBottom: "8px" }}>
                  Current Job
                </label>
                <input
                  type="text"
                  value={newMember.currentJob}
                  onChange={(e) => setNewMember({...newMember, currentJob: e.target.value})}
                  placeholder="Enter current job"
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
                Company Name
              </label>
              <input
                type="text"
                value={newMember.companyName}
                onChange={(e) => setNewMember({...newMember, companyName: e.target.value})}
                placeholder="Enter company/business name"
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
                  Married Children
                </label>
                <input
                  type="number"
                  value={newMember.marriedChildren}
                  onChange={(e) => setNewMember({...newMember, marriedChildren: e.target.value})}
                  placeholder="0"
                  min="0"
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
                  Unmarried Children
                </label>
                <input
                  type="number"
                  value={newMember.unmarriedChildren}
                  onChange={(e) => setNewMember({...newMember, unmarriedChildren: e.target.value})}
                  placeholder="0"
                  min="0"
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
                onClick={() => setShowAddMember(false)}
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
                onClick={handleAddMember}
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
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MembersList;
