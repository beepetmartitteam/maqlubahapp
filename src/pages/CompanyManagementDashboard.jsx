import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { companyManagementAPI } from "../api/company-management";

const CompanyManagementDashboard = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalCompanies: 0,
    totalStaff: 0,
    totalPlans: 0,
    totalRevenue: 0,
    averageGrowth: 0,
    activeCompanies: 0,
    plansByStatus: { planning: 0, 'in-progress': 0, completed: 0 },
    companiesByIndustry: {},
    recentActivity: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await companyManagementAPI.getDashboardData();
      
      if (response && response.success) {
        const dashboardData = response.data;
        
        try {
          setCompanies(dashboardData.companies || []);
          
          // Set stats directly from backend
          setStats({
            totalCompanies: dashboardData.overview?.totalCompanies || 0,
            totalStaff: dashboardData.overview?.totalStaff || 0,
            totalPlans: dashboardData.overview?.totalPlans || 0,
            totalRevenue: dashboardData.overview?.totalRevenue || 0,
            averageGrowth: dashboardData.overview?.averageGrowth || 0,
            activeCompanies: dashboardData.overview?.activeCompanies || 0,
            plansByStatus: dashboardData.charts?.plansByStatus || {},
            companiesByIndustry: dashboardData.charts?.companiesByIndustry || {},
            recentActivity: dashboardData.recentActivity || []
          });
        } catch (statsError) {
          console.error('Error setting stats:', statsError);
          setError('Error processing dashboard data');
        }
      } else {
        setError('Failed to load dashboard data');
      }
    } catch (err) {
      console.error('Dashboard error:', err);
      setError('Error loading dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'active': '#4caf50',
      'inactive': '#f44336',
      'pending': '#ff9800',
      'planning': '#2196f3',
      'in-progress': '#ff9800',
      'completed': '#4caf50'
    };
    return colors[status] || '#666';
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-MY', {
      style: 'currency',
      currency: 'MYR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-MY', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
            Loading Dashboard...
          </h3>
          <p style={{ margin: 0, fontSize: "14px", color: "#666" }}>
            Please wait while we fetch dashboard data
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ 
        minHeight: "100vh", 
        backgroundColor: "#f8f9fa", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        fontFamily: "'DM Sans', sans-serif"
      }}>
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#ffebee", borderRadius: "8px" }}>
          <div style={{ fontSize: "18px", color: "#f44336", marginBottom: "16px" }}>{error}</div>
          <button 
            onClick={fetchDashboardData}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f8f9fa", fontFamily: "'DM Sans', sans-serif" }}>
      
      {/* Header */}
      <header style={{ 
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", 
        padding: "52px 24px", 
        borderBottom: "none",
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        position: "relative",
        overflow: "hidden"
      }}>
        <div style={{ 
          position: "absolute",
          top: 0,
          right: 0,
          width: "300px",
          height: "100%",
          background: "linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
          clipPath: "polygon(100% 0, 0 0, 100% 100%)"
        }}></div>
        
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 1
        }}>
          <div style={{ maxWidth: "600px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              <div style={{
                width: "48px",
                height: "48px",
                backgroundColor: "rgba(255,255,255,0.2)",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "24px"
              }}>
                📊
              </div>
              <h1 style={{ 
                margin: 0, 
                fontSize: "28px", 
                fontWeight: 700, 
                color: "white",
                letterSpacing: "-0.5px"
              }}>
                Company Management Dashboard
              </h1>
            </div>
            <p style={{ 
              margin: 0, 
              fontSize: "16px", 
              color: "rgba(255,255,255,0.9)",
              lineHeight: 1.5,
              maxWidth: "500px"
            }}>
              Real-time overview of all companies, strategic plans, and comprehensive performance metrics
            </p>
            <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                 <button
            onClick={() => navigate('/home')}
            style={{
              backgroundColor: "transparent",
              color: "white",
              border: "1px solid rgba(255,255,255,0.3)",
              padding: "12px 30px",
              borderRadius: "8px",
              fontSize: "14px",
              fontWeight: 500,
              cursor: "pointer"
            }}
          >
            ← 
          </button>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{
                  width: "8px",
                  height: "8px",
                  backgroundColor: "#4caf50",
                  borderRadius: "50%"
                }}></div>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  Live Data
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "14px", color: "rgba(255,255,255,0.8)" }}>
                  Last updated: {new Date().toLocaleTimeString()}
                </span>
              </div>
            </div>
          </div>
       
        </div>
      </header>
      
      <style jsx>{`
        @keyframes pulse {
          0% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>

      {/* Stats Cards */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", 
        gap: "20px", 
        marginBottom: "32px", 
        padding: "40px 24px"
      }}>
        <div style={{ 
          backgroundColor: "white", 
          padding: "24px", 
          borderRadius: "12px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          cursor: "pointer",
          transition: "all 0.3s ease"
        }} onClick={() => navigate('/company-management')}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#e3f2fd",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px"
            }}>
              🏢
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Total Companies</div>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#2196f3" }}>{stats.totalCompanies}</div>
          <div style={{ fontSize: "12px", color: "#4caf50", marginTop: "4px" }}>
            {stats.activeCompanies} active
          </div>
        </div>

        <div style={{ 
          backgroundColor: "white", 
          padding: "24px", 
          borderRadius: "12px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          cursor: "pointer",
          transition: "all 0.3s ease"
        }} onClick={() => navigate('/company-management-staff')}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#e8f5e8",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px"
            }}>
              👥
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Total Staff</div>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#4caf50" }}>{stats.totalStaff}</div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Across all companies
          </div>
        </div>

        <div style={{ 
          backgroundColor: "white", 
          padding: "24px", 
          borderRadius: "12px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          cursor: "pointer",
          transition: "all 0.3s ease"
        }} onClick={() => navigate('/company-management-plans')}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#fff3e0",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px"
            }}>
              📋
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Total Plans</div>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#ff9800" }}>{stats.totalPlans}</div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Active business plans
          </div>
        </div>

        <div style={{ 
          backgroundColor: "white", 
          padding: "24px", 
          borderRadius: "12px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#f3e5f5",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px"
            }}>
              💰
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Total Revenue</div>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#9c27b0" }}>{formatCurrency(stats.totalRevenue)}</div>
          <div style={{ fontSize: "12px", color: "#4caf50", marginTop: "4px" }}>
            Avg Growth: {stats.averageGrowth}%
          </div>
        </div>

        <div style={{ 
          backgroundColor: "white", 
          padding: "24px", 
          borderRadius: "12px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
            <div style={{
              width: "32px",
              height: "32px",
              backgroundColor: "#e8f5e8",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px"
            }}>
              ✅
            </div>
            <div style={{ fontSize: "14px", color: "#666" }}>Active Companies</div>
          </div>
          <div style={{ fontSize: "32px", fontWeight: "bold", color: "#4caf50" }}>{stats.activeCompanies}</div>
          <div style={{ fontSize: "12px", color: "#666", marginTop: "4px" }}>
            Currently operating
          </div>
        </div>
      </div>
  
    {/* Charts and Tables */}
    <div style={{ 
      display: "grid", 
      gridTemplateColumns: "1fr 1fr", 
      gap: "24px", 
      marginBottom: "32px", 
      padding: "0 24px"
    }}>
        {/* Plans by Status */}
        <div style={{ 
          backgroundColor: "white", 
          padding: "24px", 
          borderRadius: "12px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>📊</span>
            Plans by Status
          </h3>
          {Object.entries(stats.plansByStatus).map(([status, count]) => (
            <div key={status} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div style={{ 
                  width: "12px", 
                  height: "12px", 
                  backgroundColor: getStatusColor(status), 
                  borderRadius: "50%" 
                }}></div>
                <span style={{ fontSize: "14px", color: "#333", textTransform: "capitalize" }}>
                  {status.replace('-', ' ')}
                </span>
              </div>
              <span style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Companies by Industry */}
        <div style={{ 
          backgroundColor: "white", 
          padding: "24px", 
          borderRadius: "12px", 
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
          <h3 style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>🏭</span>
            Companies by Industry
          </h3>
          {Object.entries(stats.companiesByIndustry).slice(0, 6).map(([industry, count]) => (
            <div key={industry} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <span style={{ fontSize: "14px", color: "#333" }}>{industry}</span>
              <span style={{ fontSize: "14px", fontWeight: "bold", color: "#333" }}>{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={{ 
        backgroundColor: "white", 
        padding: "24px", 
        borderRadius: "12px", 
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
        }}>
        <h3 onClick={() => navigate('/company-management-plans')} style={{ fontSize: "18px", fontWeight: "bold", color: "#333", margin: "0 0 16px 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <span>📈</span>
            Recent Activity
        </h3>
        {stats.recentActivity.length > 0 ? (
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {stats.recentActivity.map((activity, index) => (
              <div key={index} style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                padding: "12px",
                backgroundColor: "#f8f9fa",
                borderRadius: "6px",
                borderLeft: `4px solid ${activity.color || '#2196f3'}`
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{
                    width: "24px",
                    height: "24px",
                    backgroundColor: "#e3f2fd",
                    borderRadius: "6px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "14px"
                  }}>
                    {activity.type === 'plan' ? '📋' : activity.type === 'staff' ? '👥' : '🏢'}
                  </div>
                  <div>
                    <div style={{ fontSize: "14px", fontWeight: 500, color: "#333" }}>
                      {activity.title}
                    </div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {activity.company} • {activity.type}
                    </div>
                  </div>
                </div>
                <div style={{ textAlign: "right", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ 
                    fontSize: "12px", 
                    color: getStatusColor(activity.status),
                    fontWeight: 500,
                    textTransform: "capitalize",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}>
                    <span style={{
                      width: "8px",
                      height: "8px",
                      borderRadius: "50%",
                      backgroundColor: getStatusColor(activity.status)
                    }}></span>
                    {activity.status}
                  </div>
                  <div style={{ fontSize: "11px", color: "#999", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span>🕐</span>
                    {formatDate(activity.date)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "40px", color: "#666" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>📈</div>
            <div style={{ fontSize: "18px", fontWeight: 500, color: "#666", marginBottom: "8px" }}>
              No Recent Activity
            </div>
            <div style={{ fontSize: "14px", color: "#999" }}>
              Activities will appear here as companies and plans are updated
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyManagementDashboard;