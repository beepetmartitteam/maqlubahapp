import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { memberAPI } from "../api/member";

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

// Sample member data - in production this would come from API
const SAMPLE_MEMBERS = [
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
    struggleUnderstanding: "Still searching for truth, believes struggle continues. Actively seeking knowledge and understanding about current situation and direction.",
    familySituation: "Children in local schools, working on self-improvement. Family oriented, trying to balance business demands with family responsibilities.",
    welfareStatus: "House in good condition, some debts from previous operations. Managing monthly expenses while trying to clear outstanding debts.",
    fivePActivities: ["Business", "Agriculture"],
    complianceLevel: "Good understanding of fatwa compliance, working on implementing better business practices according to religious guidelines.",
    
    // Section C - Assessment
    struggleAssessment: 4,
    familyManagementAssessment: 3,
    welfareAssessment: 3,
    fivePAssessment: 4,
    complianceAssessment: 3,
    summary: "Active member with good business background, working on family welfare improvement. Shows potential for growth with proper guidance and support.",
    
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
    struggleUnderstanding: "Strong belief in continuing the struggle. Fully committed to the cause and actively participates in community activities.",
    familySituation: "Children in primary and secondary school, family-oriented. Maintains strong family bonds and religious values at home.",
    welfareStatus: "Moderate living conditions, minimal debt. Self-sufficient through farming, basic needs are met comfortably.",
    fivePActivities: ["Agriculture", "Livestock"],
    complianceLevel: "High compliance with religious guidelines, strict adherence to fatwa and religious principles in all aspects of life.",
    
    // Section C - Assessment
    struggleAssessment: 5,
    familyManagementAssessment: 4,
    welfareAssessment: 3,
    fivePAssessment: 5,
    complianceAssessment: 5,
    summary: "Dedicated farmer with strong religious commitment, good family management. Exemplary member with high potential for leadership.",
    
    status: "active",
    joinDate: "2019-06-20",
    lastUpdated: "2024-05-08"
  }
];

function MemberDetail() {
  const { isMobile } = useResponsive();
  const { id } = useParams();
  const navigate = useNavigate();
  const [member, setMember] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');

  useEffect(() => {
    fetchMember();
  }, [id]);

  const fetchMember = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await memberAPI.getMemberById(id, token);
      
      if (response.success) {
        setMember(response.data);
      } else {
        setError(response.error || 'Member not found');
        // Fallback to sample data
        const foundMember = SAMPLE_MEMBERS.find(m => m.id === parseInt(id));
        if (foundMember) {
          setMember(foundMember);
        } else {
          setError('Member not found');
        }
      }
    } catch (err) {
      console.error('Error fetching member:', err);
      setError('Failed to fetch member details');
      // Fallback to sample data
      const foundMember = SAMPLE_MEMBERS.find(m => m.id === parseInt(id));
      if (foundMember) {
        setMember(foundMember);
      } else {
        setError('Member not found');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSaveMember = async () => {
    try {
      const token = localStorage.getItem('token');
      const wivesNormalized = (member.wives ?? [])
        .map((s) => String(s).trim())
        .filter(Boolean);
      const payload = { ...member, wives: wivesNormalized };
      const response = await memberAPI.updateMember(id, payload, token);
      
      if (response.success) {
        setEditMode(false);
        // Update with the returned data or update timestamp
        if (response.data) {
          setMember(response.data);
        } else {
          setMember({
            ...member,
            wives: wivesNormalized,
            lastUpdated: new Date().toISOString().split('T')[0]
          });
        }
      } else {
        setError(response.error || 'Failed to save member');
      }
    } catch (err) {
      console.error('Error saving member:', err);
      setError('Failed to save member');
    }
  };

  const getAssessmentColor = (score) => {
    if (score >= 4) return "#4caf50";
    if (score >= 3) return "#ff9800";
    return "#f44336";
  };

  const getAssessmentText = (score) => {
    if (score === 5) return "Excellent";
    if (score === 4) return "Good";
    if (score === 3) return "Average";
    if (score === 2) return "Below Average";
    return "Poor";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f8f9fa", 
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>⏳</div>
          <div style={{ fontSize: "18px", color: "#666" }}>Loading member details...</div>
        </div>
      </div>
    );
  }

  if (error || !member) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f8f9fa", 
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <div style={{ textAlign: "center", padding: "48px" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>❌</div>
          <div style={{ fontSize: "18px", color: "#666", marginBottom: "16px" }}>
            {error || 'Member not found'}
          </div>
          <button
            onClick={() => navigate('/members')}
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
            Back to Members
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
              onClick={() => navigate('/members')}
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
              ← Back
            </button>
            <div>
              <h1 style={{ margin: 0, fontSize: isMobile ? "24px" : "32px", fontWeight: 600, color: "#333" }}>
               Detail
              </h1>
              <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#666" }}>
                Member Profile & Assessment Details
              </p>
            </div>
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <button
              onClick={() => setEditMode(!editMode)}
              style={{
                backgroundColor: editMode ? "#ff9800" : "#1976d2",
                color: "white",
                border: "none",
                padding: "12px 24px",
                borderRadius: "8px",
                fontSize: "14px",
                cursor: "pointer"
              }}
            >
              {editMode ? "Cancel" : "Edit"}
            </button>
            {editMode && (
              <button
                onClick={handleSaveMember}
                style={{
                  backgroundColor: "#4caf50",
                  color: "white",
                  border: "none",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  fontSize: "14px",
                  cursor: "pointer"
                }}
              >
                Save
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ padding: isMobile ? "16px" : "24px" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          {/* Status Badge */}
          <div style={{ marginBottom: "24px" }}>
            <span style={{
              backgroundColor: member.status === 'active' ? "#4caf50" : "#f44336",
              color: "white",
              padding: "8px 16px",
              borderRadius: "20px",
              fontSize: "14px",
              fontWeight: 500,
              textTransform: "capitalize"
            }}>
              {member.status} Member
            </span>
          </div>

          {/* Tabs */}
          <div style={{ 
            backgroundColor: "white", 
            borderRadius: "12px", 
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            marginBottom: "24px"
          }}>
            <div style={{ display: "flex", borderBottom: "1px solid #e0e0e0" }}>
              {['profile', 'life', 'assessment'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1,
                    padding: "16px",
                    backgroundColor: activeTab === tab ? "#1976d2" : "transparent",
                    color: activeTab === tab ? "white" : "#666",
                    border: "none",
                    fontSize: "14px",
                    fontWeight: 500,
                    cursor: "pointer",
                    textTransform: "capitalize"
                  }}
                >
                  {tab === 'profile' ? '👤 Profile' : tab === 'life' ? '🏠 Life Info' : '📊 Assessment'}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: "24px" }}>
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <div style={{ display: "grid", gap: "24px" }}>
                  {/* Basic Info */}
                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
                      📋 Basic Information
                    </h3>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", 
                      gap: "16px" 
                    }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                          Husband Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={member.husbandName}
                            onChange={(e) => setMember({...member, husbandName: e.target.value})}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "14px"
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: "14px", color: "#333" }}>{member.husbandName}</div>
                        )}
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                          Age
                        </label>
                        {editMode ? (
                          <input
                            type="number"
                            value={member.age}
                            onChange={(e) => setMember({...member, age: e.target.value})}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "14px"
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: "14px", color: "#333" }}>{member.age} years</div>
                        )}
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                          Phone
                        </label>
                        {editMode ? (
                          <input
                            type="tel"
                            value={member.phone}
                            onChange={(e) => setMember({...member, phone: e.target.value})}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "14px"
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: "14px", color: "#333" }}>{member.phone}</div>
                        )}
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                          Current Job
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={member.currentJob}
                            onChange={(e) => setMember({...member, currentJob: e.target.value})}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "14px"
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: "14px", color: "#333" }}>{member.currentJob}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
                      📍 Address Information
                    </h3>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", 
                      gap: "16px" 
                    }}>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                          Home Address
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={member.homeAddress}
                            onChange={(e) => setMember({...member, homeAddress: e.target.value})}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "14px"
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: "14px", color: "#333" }}>{member.homeAddress}</div>
                        )}
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                          District
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={member.district}
                            onChange={(e) => setMember({...member, district: e.target.value})}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "14px"
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: "14px", color: "#333" }}>{member.district}</div>
                        )}
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                          State
                        </label>
                        {editMode ? (
                          <select
                            value={member.state}
                            onChange={(e) => setMember({...member, state: e.target.value})}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "14px"
                            }}
                          >
                            <option value="Selangor">Selangor</option>
                            <option value="Wilayah Persekutuan">Wilayah Persekutuan</option>
                            <option value="Kuala Lumpur">Kuala Lumpur</option>
                          </select>
                        ) : (
                          <div style={{ fontSize: "14px", color: "#333" }}>{member.state}</div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Family */}
                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
                      👨‍👩‍👧‍👦 Family Information
                    </h3>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", 
                      gap: "16px" 
                    }}>
                      <div style={{ marginBottom: editMode ? "16px" : "0" }}>
                        {editMode ? (
                          <>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                              <label style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                                Wives
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  const wives = member.wives ?? [];
                                  setMember({ ...member, wives: [...wives, ""] });
                                }}
                                style={{
                                  backgroundColor: "#1976d2",
                                  color: "white",
                                  border: "none",
                                  padding: "6px 12px",
                                  borderRadius: "4px",
                                  fontSize: "12px",
                                  cursor: "pointer"
                                }}
                              >
                                + Add Wife
                              </button>
                            </div>
                            {(member.wives ?? []).length > 0 ? (
                              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {member.wives.map((wife, index) => (
                                  <div key={index} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                    <input
                                      type="text"
                                      value={wife}
                                      onChange={(e) => {
                                        const wives = [...(member.wives ?? [])];
                                        wives[index] = e.target.value;
                                        setMember({ ...member, wives });
                                      }}
                                      placeholder={`Wife ${index + 1} name`}
                                      style={{
                                        flex: 1,
                                        padding: "8px 12px",
                                        border: "1px solid #ddd",
                                        borderRadius: "6px",
                                        fontSize: "13px"
                                      }}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const wives = (member.wives ?? []).filter((_, i) => i !== index);
                                        setMember({ ...member, wives });
                                      }}
                                      style={{
                                        backgroundColor: "#f44336",
                                        color: "white",
                                        border: "none",
                                        padding: "8px 12px",
                                        borderRadius: "6px",
                                        fontSize: "12px",
                                        cursor: "pointer"
                                      }}
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div style={{
                                padding: "16px",
                                backgroundColor: "#f8f9fa",
                                borderRadius: "8px",
                                border: "1px dashed #ccc",
                                textAlign: "center",
                                color: "#999",
                                fontSize: "13px"
                              }}>
                                No wives added yet. Click "+ Add Wife" to add wife information.
                              </div>
                            )}
                          </>
                        ) : (
                          <>
                            <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                              Wives
                            </label>
                            <div style={{ fontSize: "14px", color: "#333" }}>
                              {(member.wives ?? []).filter(Boolean).length > 0
                                ? (member.wives ?? []).filter(Boolean).join(', ')
                                : 'None'}
                            </div>
                          </>
                        )}
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                          Married Children
                        </label>
                        <div style={{ fontSize: "14px", color: "#333" }}>{member.marriedChildren}</div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                          Unmarried Children
                        </label>
                        <div style={{ fontSize: "14px", color: "#333" }}>{member.unmarriedChildren}</div>
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "12px", color: "#666", marginBottom: "4px" }}>
                          Company Name
                        </label>
                        {editMode ? (
                          <input
                            type="text"
                            value={member.companyName}
                            onChange={(e) => setMember({...member, companyName: e.target.value})}
                            style={{
                              width: "100%",
                              padding: "8px",
                              border: "1px solid #ddd",
                              borderRadius: "4px",
                              fontSize: "14px"
                            }}
                          />
                        ) : (
                          <div style={{ fontSize: "14px", color: "#333" }}>{member.companyName}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Life Info Tab */}
              {activeTab === 'life' && (
                <div style={{ display: "grid", gap: "24px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
                      🎯 Understanding of the Struggle 
                    </h3>
                    {editMode ? (
                      <textarea
                        value={member.struggleUnderstanding}
                        onChange={(e) => setMember({...member, struggleUnderstanding: e.target.value})}
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
                    ) : (
                      <p style={{ fontSize: "14px", color: "#333", lineHeight: 1.6 }}>
                        {member.struggleUnderstanding}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
                      👨‍👩‍👧‍👦 Family Situation
                    </h3>
                    {editMode ? (
                      <textarea
                        value={member.familySituation}
                        onChange={(e) => setMember({...member, familySituation: e.target.value})}
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
                    ) : (
                      <p style={{ fontSize: "14px", color: "#333", lineHeight: 1.6 }}>
                        {member.familySituation}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
                      🏠 Welfare Status
                    </h3>
                    {editMode ? (
                      <textarea
                        value={member.welfareStatus}
                        onChange={(e) => setMember({...member, welfareStatus: e.target.value})}
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
                    ) : (
                      <p style={{ fontSize: "14px", color: "#333", lineHeight: 1.6 }}>
                        {member.welfareStatus}
                      </p>
                    )}
                  </div>

                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
                      💼 5P Activities
                    </h3>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                      {member.fivePActivities.map((activity, index) => (
                        <span
                          key={index}
                          style={{
                            backgroundColor: "#e3f2fd",
                            color: "#1976d2",
                            padding: "6px 12px",
                            borderRadius: "16px",
                            fontSize: "12px",
                            fontWeight: 500
                          }}
                        >
                          {activity}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
                      📖 Compliance Level
                    </h3>
                    {editMode ? (
                      <textarea
                        value={member.complianceLevel}
                        onChange={(e) => setMember({...member, complianceLevel: e.target.value})}
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
                    ) : (
                      <p style={{ fontSize: "14px", color: "#333", lineHeight: 1.6 }}>
                        {member.complianceLevel}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Assessment Tab */}
              {activeTab === 'assessment' && (
                <div style={{ display: "grid", gap: "24px" }}>
                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
                      📊 Assessment Scores (1-5 Scale)
                    </h3>
                    <div style={{ 
                      display: "grid", 
                      gridTemplateColumns: isMobile ? "1fr" : "repeat(2, 1fr)", 
                      gap: "16px" 
                    }}>
                      {/* Understanding of the Struggle */}
                      <div style={{ 
                        padding: "20px", 
                        backgroundColor: editMode ? "#fff" : "#f8f9fa", 
                        borderRadius: "12px",
                        border: editMode ? "2px solid #1976d2" : "1px solid #e0e0e0",
                        transition: "all 0.3s ease"
                      }}>
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "12px", fontWeight: 500 }}>
                          Understanding of the Struggle
                        </div>
                        {editMode ? (
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={member.struggleAssessment}
                              onChange={(e) => setMember({...member, struggleAssessment: parseInt(e.target.value)})}
                              style={{
                                width: "100%",
                                height: "8px",
                                borderRadius: "4px",
                                background: `linear-gradient(to right, #f44336 0%, #f44336 20%, #ff9800 20%, #ff9800 40%, #ffeb3b 40%, #ffeb3b 60%, #4caf50 60%, #4caf50 80%, #2196f3 80%, #2196f3 100%)`,
                                outline: "none",
                                cursor: "pointer"
                              }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                              {[1, 2, 3, 4, 5].map(num => (
                                <span key={num} style={{ 
                                  fontSize: "12px", 
                                  color: member.struggleAssessment === num ? "#1976d2" : "#999",
                                  fontWeight: member.struggleAssessment === num ? 600 : 400
                                }}>{num}</span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ 
                              fontSize: "32px", 
                              fontWeight: 700, 
                              color: getAssessmentColor(member.struggleAssessment),
                              minWidth: "60px"
                            }}>
                              {member.struggleAssessment}
                            </div>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                              / 5 - <span style={{ fontWeight: 500 }}>{getAssessmentText(member.struggleAssessment)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Family Management */}
                      <div style={{ 
                        padding: "20px", 
                        backgroundColor: editMode ? "#fff" : "#f8f9fa", 
                        borderRadius: "12px",
                        border: editMode ? "2px solid #1976d2" : "1px solid #e0e0e0",
                        transition: "all 0.3s ease"
                      }}>
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "12px", fontWeight: 500 }}>
                          Family Management
                        </div>
                        {editMode ? (
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={member.familyManagementAssessment}
                              onChange={(e) => setMember({...member, familyManagementAssessment: parseInt(e.target.value)})}
                              style={{
                                width: "100%",
                                height: "8px",
                                borderRadius: "4px",
                                background: `linear-gradient(to right, #f44336 0%, #f44336 20%, #ff9800 20%, #ff9800 40%, #ffeb3b 40%, #ffeb3b 60%, #4caf50 60%, #4caf50 80%, #2196f3 80%, #2196f3 100%)`,
                                outline: "none",
                                cursor: "pointer"
                              }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                              {[1, 2, 3, 4, 5].map(num => (
                                <span key={num} style={{ 
                                  fontSize: "12px", 
                                  color: member.familyManagementAssessment === num ? "#1976d2" : "#999",
                                  fontWeight: member.familyManagementAssessment === num ? 600 : 400
                                }}>{num}</span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ 
                              fontSize: "32px", 
                              fontWeight: 700, 
                              color: getAssessmentColor(member.familyManagementAssessment),
                              minWidth: "60px"
                            }}>
                              {member.familyManagementAssessment}
                            </div>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                              / 5 - <span style={{ fontWeight: 500 }}>{getAssessmentText(member.familyManagementAssessment)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Welfare Status */}
                      <div style={{ 
                        padding: "20px", 
                        backgroundColor: editMode ? "#fff" : "#f8f9fa", 
                        borderRadius: "12px",
                        border: editMode ? "2px solid #1976d2" : "1px solid #e0e0e0",
                        transition: "all 0.3s ease"
                      }}>
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "12px", fontWeight: 500 }}>
                          Welfare Status
                        </div>
                        {editMode ? (
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={member.welfareAssessment}
                              onChange={(e) => setMember({...member, welfareAssessment: parseInt(e.target.value)})}
                              style={{
                                width: "100%",
                                height: "8px",
                                borderRadius: "4px",
                                background: `linear-gradient(to right, #f44336 0%, #f44336 20%, #ff9800 20%, #ff9800 40%, #ffeb3b 40%, #ffeb3b 60%, #4caf50 60%, #4caf50 80%, #2196f3 80%, #2196f3 100%)`,
                                outline: "none",
                                cursor: "pointer"
                              }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                              {[1, 2, 3, 4, 5].map(num => (
                                <span key={num} style={{ 
                                  fontSize: "12px", 
                                  color: member.welfareAssessment === num ? "#1976d2" : "#999",
                                  fontWeight: member.welfareAssessment === num ? 600 : 400
                                }}>{num}</span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ 
                              fontSize: "32px", 
                              fontWeight: 700, 
                              color: getAssessmentColor(member.welfareAssessment),
                              minWidth: "60px"
                            }}>
                              {member.welfareAssessment}
                            </div>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                              / 5 - <span style={{ fontWeight: 500 }}>{getAssessmentText(member.welfareAssessment)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* 5P Implementation */}
                      <div style={{ 
                        padding: "20px", 
                        backgroundColor: editMode ? "#fff" : "#f8f9fa", 
                        borderRadius: "12px",
                        border: editMode ? "2px solid #1976d2" : "1px solid #e0e0e0",
                        transition: "all 0.3s ease"
                      }}>
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "12px", fontWeight: 500 }}>
                          5P Implementation
                        </div>
                        {editMode ? (
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={member.fivePAssessment}
                              onChange={(e) => setMember({...member, fivePAssessment: parseInt(e.target.value)})}
                              style={{
                                width: "100%",
                                height: "8px",
                                borderRadius: "4px",
                                background: `linear-gradient(to right, #f44336 0%, #f44336 20%, #ff9800 20%, #ff9800 40%, #ffeb3b 40%, #ffeb3b 60%, #4caf50 60%, #4caf50 80%, #2196f3 80%, #2196f3 100%)`,
                                outline: "none",
                                cursor: "pointer"
                              }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                              {[1, 2, 3, 4, 5].map(num => (
                                <span key={num} style={{ 
                                  fontSize: "12px", 
                                  color: member.fivePAssessment === num ? "#1976d2" : "#999",
                                  fontWeight: member.fivePAssessment === num ? 600 : 400
                                }}>{num}</span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ 
                              fontSize: "32px", 
                              fontWeight: 700, 
                              color: getAssessmentColor(member.fivePAssessment),
                              minWidth: "60px"
                            }}>
                              {member.fivePAssessment}
                            </div>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                              / 5 - <span style={{ fontWeight: 500 }}>{getAssessmentText(member.fivePAssessment)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Compliance Level */}
                      <div style={{ 
                        padding: "20px", 
                        backgroundColor: editMode ? "#fff" : "#f8f9fa", 
                        borderRadius: "12px",
                        border: editMode ? "2px solid #1976d2" : "1px solid #e0e0e0",
                        transition: "all 0.3s ease"
                      }}>
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "12px", fontWeight: 500 }}>
                          Compliance Level
                        </div>
                        {editMode ? (
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="5"
                              value={member.complianceAssessment}
                              onChange={(e) => setMember({...member, complianceAssessment: parseInt(e.target.value)})}
                              style={{
                                width: "100%",
                                height: "8px",
                                borderRadius: "4px",
                                background: `linear-gradient(to right, #f44336 0%, #f44336 20%, #ff9800 20%, #ff9800 40%, #ffeb3b 40%, #ffeb3b 60%, #4caf50 60%, #4caf50 80%, #2196f3 80%, #2196f3 100%)`,
                                outline: "none",
                                cursor: "pointer"
                              }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
                              {[1, 2, 3, 4, 5].map(num => (
                                <span key={num} style={{ 
                                  fontSize: "12px", 
                                  color: member.complianceAssessment === num ? "#1976d2" : "#999",
                                  fontWeight: member.complianceAssessment === num ? 600 : 400
                                }}>{num}</span>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                            <div style={{ 
                              fontSize: "32px", 
                              fontWeight: 700, 
                              color: getAssessmentColor(member.complianceAssessment),
                              minWidth: "60px"
                            }}>
                              {member.complianceAssessment}
                            </div>
                            <div style={{ fontSize: "14px", color: "#666" }}>
                              / 5 - <span style={{ fontWeight: 500 }}>{getAssessmentText(member.complianceAssessment)}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Overall Score */}
                      <div style={{ 
                        padding: "20px", 
                        backgroundColor: editMode ? "#e3f2fd" : "#e3f2fd", 
                        borderRadius: "12px",
                        border: editMode ? "2px solid #2196f3" : "1px solid #2196f3",
                        transition: "all 0.3s ease"
                      }}>
                        <div style={{ fontSize: "14px", color: "#666", marginBottom: "12px", fontWeight: 500 }}>
                          Overall Score
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                          <div style={{ 
                            fontSize: "32px", 
                            fontWeight: 700, 
                            color: getAssessmentColor(
                              Math.round((member.struggleAssessment + member.familyManagementAssessment + member.welfareAssessment + member.fivePAssessment + member.complianceAssessment) / 5)
                            ),
                            minWidth: "60px"
                          }}>
                            {Math.round((member.struggleAssessment + member.familyManagementAssessment + member.welfareAssessment + member.fivePAssessment + member.complianceAssessment) / 5)}
                          </div>
                          <div style={{ fontSize: "14px", color: "#666" }}>
                            / 5 - <span style={{ fontWeight: 500 }}>{getAssessmentText(
                              Math.round((member.struggleAssessment + member.familyManagementAssessment + member.welfareAssessment + member.fivePAssessment + member.complianceAssessment) / 5)
                            )}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 style={{ margin: "0 0 16px 0", fontSize: "18px", fontWeight: 600, color: "#333" }}>
                      📝 Summary Assessment
                    </h3>
                    {editMode ? (
                      <textarea
                        value={member.summary}
                        onChange={(e) => setMember({...member, summary: e.target.value})}
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
                    ) : (
                      <p style={{ fontSize: "14px", color: "#333", lineHeight: 1.6 }}>
                        {member.summary}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer Info */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            padding: "16px",
            backgroundColor: "white",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#666"
          }}>
            <div>
              Member ID: {member.id}
            </div>
            <div>
              Joined: {formatDate(member.joinDate)} | Last Updated: {formatDate(member.lastUpdated)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MemberDetail;
