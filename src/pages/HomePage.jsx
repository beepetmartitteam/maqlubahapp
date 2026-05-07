import { useNavigate } from "react-router-dom";

function HomePage() {
  const navigate = useNavigate();

  const menuItems = [
    {
      id: "jualan-sabun",
      title: "Jualan Sabun",
      description: "Rekod kemasukan bulanan sabun", 
      icon: "🧼",
      color: "#0F6E56",
      route: "/jualan-sabun"
    },
    {
      id: "customer",
      title: "Customer",
      description: "Pengurusan data pelanggan",
      icon: "👥",
      color: "#185FA5",
      route: "/customer"
    },
    {
      id: "downline-tree",
      title: "Downline",
      description: "downline perniagaan",
      icon: "🌳",
      color: "#993556",
      route: "/downline-tree"
    }
  ];

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F7FAF9",
      padding: "16px",
      fontFamily: "'DM Sans', sans-serif"
    }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
       
        {/* Menu Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
          marginBottom: "48px"
        }}>
          {menuItems.map((item) => (
            <div
              key={item.id}
              onClick={() => navigate(item.route)}
              style={{
                backgroundColor: "white",
                borderRadius: "16px",
                padding: "32px 24px",
                border: "1px solid #E8F0ED",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
                textAlign: "center"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)";
                e.currentTarget.style.borderColor = item.color;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.04)";
                e.currentTarget.style.borderColor = "#E8F0ED";
              }}
            >
              {/* Icon */}
              <div style={{
                fontSize: "64px",
                marginBottom: "16px",
                display: "inline-block"
              }}>
                {item.icon}
              </div>

              {/* Title */}
              <h2 style={{
                color: item.color,
                margin: "0 0 8px 0",
                fontSize: "24px",
                fontWeight: 600
              }}>
                {item.title}
              </h2>

              {/* Description */}
              <p style={{
                color: "#666",
                margin: 0,
                fontSize: "14px",
                lineHeight: "1.5"
              }}>
                {item.description}
              </p>

              {/* Arrow indicator */}
              <div style={{
                marginTop: "20px",
                fontSize: "20px",
                color: item.color,
                opacity: 0.7
              }}>
                →
              </div>
            </div>
          ))}
        </div>

       
        {/* Footer */}
        <div style={{
          textAlign: "center",
          marginTop: "48px",
          padding: "24px",
          borderTop: "1px solid #E8F0ED"
        }}>
          <p style={{
            color: "#999",
            margin: 0,
            fontSize: "12px"
          }}>
            © 2026 Sistem Pengurusan Maqlubah
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
