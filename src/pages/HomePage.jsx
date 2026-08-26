import { useNavigate } from "react-router-dom";
import { useState } from "react";

function HomePage() {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(null);

  const user = JSON.parse(
    localStorage.getItem("user") ||
    '{"name":"User","allowed_menu":"all","role":"Member"}'
  );

  console.log("user",user);

  const menuItems = [
    {
      id: "jualan-sabun",
      title: "Jualan Sabun",
      description: "Rekod & prestasi jualan bulanan",
      icon: "🧼",
      accent: "#0D7A5F",
      bg: "#EBF7F3",
      tag: "Jualan",
      route: "/jualan-sabun"
    },
    {
      id: "customer",
      title: "Customer",
      description: "Pantau dan urus data pelanggan, untuk perhubungan",
      icon: "👤",
      accent: "#1A6DB5",
      bg: "#EBF2FB",
      tag: "CRM",
      route: "/customer"
    },
    {
      id: "downline-tree",
      title: "Downline",
      description: "Visualisasi rangkaian downline",
      icon: "🌿",
      accent: "#7B3F72",
      bg: "#F5EDF4",
      tag: "Rangkaian",
      route: "/downline-tree"
    },
    {
      id: "company-management-simple",
      title: "Company Management",
      description: "Pengurusan pelbagai syarikat",
      icon: "🏢",
      accent: "#2C6E49",
      bg: "#EDF5F0",
      tag: "Syarikat",
      route: "/company-management-dashboard"
    },
    {
      id: "members",
      title: "Members",
      description: "Profil ahli dan maklumat keahlian",
      icon: "👥",
      accent: "#3D7EBF",
      bg: "#ECF3FB",
      tag: "Ahli",
      route: "/members"
    },
    {
      id: "todo-list",
      title: "Senarai Tugas",
      description: "Urus dan pantau tugas harian",
      icon: "✓",
      accent: "#E67E22",
      bg: "#FEF3E7",
      tag: "Tugas",
      route: "/todo-list"
    },
    {
      id: "projects",
      title: "Projek",
      description: "Urus dan pantau semua projek",
      icon: "📁",
      accent: "#8B5CF6",
      bg: "#F5F3FF",
      tag: "Projek",
      route: "/projects"
    }
  ];

  const allowedMenus =
    user?.allowed_menu === "all"
      ? menuItems.map((i) => i.id)
      : user?.allowed_menu?.split(",") || [];

  const filteredMenus = menuItems.filter((i) => allowedMenus.includes(i.id));

  const initials = (user?.name || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);


  const fullname  = user?.firstName+" "+user?.lastName;
  const email     = user?.email;

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F2F5F4",
      fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
      maxWidth: "480px",
      margin: "0 auto",
      position: "relative",
      paddingBottom: "80px",
    }}>

      {/* ── TOP HEADER ── */}
      <div style={{
        background: "linear-gradient(135deg, #0A3D2E 0%, #0D5C42 100%)",
        padding: "52px 20px 28px",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circle */}
        <div style={{
          position: "absolute",
          top: "-40px",
          right: "-40px",
          width: "160px",
          height: "160px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          bottom: "-20px",
          right: "60px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          backgroundColor: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }} />

        {/* User row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              width: "42px",
              height: "42px",
              borderRadius: "50%",
              backgroundColor: "#1DB87A",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
              fontWeight: 700,
              fontSize: "15px",
              border: "2px solid rgba(255,255,255,0.2)",
            }}>{initials}</div>
            <div>
              <div style={{
                color: "rgba(255,255,255,0.55)",
                fontSize: "11px",
                marginBottom: "2px",
              }}>{fullname}</div>
              <div style={{
                color: "white",
                fontSize: "16px",
                fontWeight: 700,
                letterSpacing: "-0.3px",
              }}>{email}</div>
            </div>
          </div>

          {/* Logo badge */}
          <div style={{
            backgroundColor: "rgba(255,255,255,0.1)",
            borderRadius: "10px",
            padding: "6px 12px",
            display: "flex",
            alignItems: "center",
            gap: "6px",
          }}>
            <div style={{
              width: "20px",
              height: "20px",
              backgroundColor: "#1DB87A",
              borderRadius: "5px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 700,
              color: "white",
            }}>M</div>
            <span style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "12px",
              fontWeight: 600,
            }}>Maqlubah</span>
          </div>
        </div>

        {/* Stats row
        <div style={{
          display: "flex",
          gap: "10px",
        }}>
          {[
            { label: "Modul Aktif", value: filteredMenus.length },
            { label: "Status", value: "Online" },
          ].map((s) => (
            <div key={s.label} style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.08)",
              borderRadius: "10px",
              padding: "10px 14px",
              border: "1px solid rgba(255,255,255,0.08)",
            }}>
              <div style={{
                color: "white",
                fontSize: "18px",
                fontWeight: 700,
                letterSpacing: "-0.5px",
                lineHeight: 1,
              }}>{s.value}</div>
              <div style={{
                color: "rgba(255,255,255,0.45)",
                fontSize: "11px",
                marginTop: "4px",
              }}>{s.label}</div>
            </div>
          ))}
        </div> */}
      </div>

      {/* ── CONTENT ── */}
      <div style={{ padding: "20px 16px" }}>

        {/* Section label */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          marginBottom: "14px",
        }}>
          <span style={{
            fontSize: "11px",
            fontWeight: 700,
            letterSpacing: "1px",
            textTransform: "uppercase",
            color: "#9AB0A8",
          }}>Menu</span>
          <div style={{ flex: 1, height: "1px", backgroundColor: "#DDE5E2" }} />
        </div>

        {/* Card list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredMenus.map((item) => {
            const isPressed = pressed === item.id;
            return (
              <div
                key={item.id}
                onClick={() => navigate(item.route)}
                onTouchStart={() => setPressed(item.id)}
                onTouchEnd={() => setPressed(null)}
                onMouseDown={() => setPressed(item.id)}
                onMouseUp={() => setPressed(null)}
                onMouseLeave={() => setPressed(null)}
                style={{
                  backgroundColor: isPressed ? "#F0F4F3" : "white",
                  borderRadius: "14px",
                  border: "1px solid #E4EDEA",
                  padding: "16px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "14px",
                  transition: "transform 0.1s ease, box-shadow 0.1s ease",
                  transform: isPressed ? "scale(0.985)" : "scale(1)",
                  boxShadow: isPressed
                    ? "none"
                    : "0 1px 4px rgba(0,0,0,0.05)",
                  WebkitTapHighlightColor: "transparent",
                  userSelect: "none",
                }}
              >
                {/* Icon */}
                <div style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "13px",
                  backgroundColor: item.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "26px",
                  flexShrink: 0,
                }}>
                  {item.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "7px",
                    marginBottom: "3px",
                  }}>
                    <span style={{
                      fontSize: "15px",
                      fontWeight: 700,
                      color: "#0A1F17",
                      letterSpacing: "-0.2px",
                    }}>{item.title}</span>
                    <span style={{
                      fontSize: "9px",
                      fontWeight: 700,
                      letterSpacing: "0.5px",
                      textTransform: "uppercase",
                      color: item.accent,
                      backgroundColor: item.bg,
                      padding: "2px 6px",
                      borderRadius: "99px",
                    }}>{item.tag}</span>
                  </div>
                  <p style={{
                    margin: 0,
                    fontSize: "12.5px",
                    color: "#7A9690",
                    lineHeight: "1.4",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}>{item.description}</p>
                </div>

                {/* Chevron */}
                <div style={{
                  color: item.accent,
                  fontSize: "18px",
                  opacity: 0.5,
                  flexShrink: 0,
                  lineHeight: 1,
                }}>›</div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div style={{
          textAlign: "center",
          marginTop: "32px",
          paddingTop: "16px",
          borderTop: "1px solid #E4EDEA",
        }}>
          <span style={{ fontSize: "11px", color: "#B0C4BE" }}>
            © 2026 Sistem Pengurusan Maqlubah
          </span>
        </div>
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{
        position: "fixed",
        bottom: 0,
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "480px",
        backgroundColor: "white",
        borderTop: "1px solid #E4EDEA",
        display: "flex",
        padding: "8px 0 calc(8px + env(safe-area-inset-bottom))",
        boxShadow: "0 -4px 16px rgba(0,0,0,0.06)",
        zIndex: 100,
      }}>
        {[
          { icon: "🏠", label: "Utama", active: true },
          { icon: "🔔", label: "Notifikasi", active: false },
          { icon: "⚙️", label: "Tetapan", active: false },
        ].map((nav) => (
          <div key={nav.label} style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "3px",
            padding: "4px 0",
            cursor: "pointer",
            WebkitTapHighlightColor: "transparent",
          }}>
            <span style={{ fontSize: "20px", lineHeight: 1 }}>{nav.icon}</span>
            <span style={{
              fontSize: "10px",
              fontWeight: nav.active ? 700 : 500,
              color: nav.active ? "#0A3D2E" : "#A0B5AE",
              letterSpacing: "0.2px",
            }}>{nav.label}</span>
            {nav.active && (
              <div style={{
                width: "4px",
                height: "4px",
                borderRadius: "50%",
                backgroundColor: "#1DB87A",
                marginTop: "1px",
              }} />
            )}
          </div>
        ))}
      </div>

    </div>
  );
}

export default HomePage;