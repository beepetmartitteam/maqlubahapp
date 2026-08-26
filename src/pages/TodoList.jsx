import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { todoListAPI } from "../api/todo-list";

function TodoList() {
  const defaultCompanies = [
  { id: 1001, name: "Team M2" },
  { id: 1002, name: "Team M3" },
  { id: 1003, name: "Team Timur Tengah" },
  { id: 1004, name: "Team Eropah" },
  { id: 1005, name: "Team Australia" },
  { id: 1006, name: "Team Filipina" },
  { id: 1007, name: "Pers Perniagaan" },
  { id: 1008, name: "Pers Perkilangan" },
  { id: 1009, name: "Pers AgroTernak" },
  { id: 1010, name: "Pers Ammu2 (AMCA)" },
  { id: 1011, name: "Pers Ummi2" },
  { id: 1012, name: "Pers Payung Puteri" },
];

  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companies, setCompanies] = useState(defaultCompanies);
  const [selectedCompanyId, setSelectedCompanyId] = useState("");
  const [filterCompanyId, setFilterCompanyId] = useState("");

  // Fetch tasks from backend
  const fetchTasks = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await todoListAPI.getTodoItems(token);
      
      if (data.success) {
        setTasks(data.data);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError(err.message);
      // Fallback to localStorage if API fails
      const savedTasks = localStorage.getItem("todoTasks");
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch companies from backend
  const fetchCompanies = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5557/api'}/company-management`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
       if (data.success && data.data) {
          setCompanies([
            ...data.data,
            ...defaultCompanies
          ]);
        }
      }
    } catch (err) {
      console.error('Error fetching companies:', err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchCompanies();
  }, []);

 

  const addTask = async () => {
    if (newTask.trim()) {
      const assigneeMatch = newTask.match(/- (.+)$/);
      const assignee = assigneeMatch ? assigneeMatch[1].trim() : "";
      const textWithoutAssignee = assigneeMatch ? newTask.replace(/- .+$/, "").trim() : newTask.trim();
      
      try {
        const token = localStorage.getItem('token');
        const data = await todoListAPI.createTodoItem(token, {
          text: textWithoutAssignee + (assignee ? ` - ${assignee}` : ""),
          assignee: assignee,
          priority: 'medium',
          companyId: selectedCompanyId ? parseInt(selectedCompanyId) : null
        });
        
        if (data.success) {
          setTasks([...tasks, data.data]);
          setNewTask("");
          setSelectedCompanyId("");
        }
      } catch (err) {
        console.error('Error adding task:', err);
        // Fallback to local state if API fails
        const newTaskObj = {
          id: Date.now(),
          text: textWithoutAssignee + (assignee ? ` - ${assignee}` : ""),
          completed: false,
          assignee: assignee,
          companyId: selectedCompanyId ? parseInt(selectedCompanyId) : null
        };
        setTasks([...tasks, newTaskObj]);
        setNewTask("");
        setSelectedCompanyId("");
      }
    }
  };

  const toggleTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const data = await todoListAPI.toggleTodoItem(id, token);
      
      if (data.success) {
        setTasks(tasks.map(task => 
          task.id === id ? data.data : task
        ));
      }
    } catch (err) {
      console.error('Error toggling task:', err);
      // Fallback to local state if API fails
      setTasks(tasks.map(task => 
        task.id === id ? { ...task, completed: !task.completed } : task
      ));
    }
  };

  const deleteTask = async (id) => {
    try {
      const token = localStorage.getItem('token');
      await todoListAPI.deleteTodoItem(id, token);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (err) {
      console.error('Error deleting task:', err);
      // Fallback to local state if API fails
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const updateTaskCompany = async (taskId, companyId) => {
    try {
      const token = localStorage.getItem('token');
      const data = await todoListAPI.updateTodoItem(taskId, {
        companyId: companyId ? parseInt(companyId) : null
      }, token);
      
      if (data.success) {
        setTasks(tasks.map(task => 
          task.id === taskId ? { ...task, companyId: companyId ? parseInt(companyId) : null, company: data.data.company } : task
        ));
      }
    } catch (err) {
      console.error('Error updating task company:', err);
      // Fallback to local state if API fails
      setTasks(tasks.map(task => 
        task.id === taskId ? { ...task, companyId: companyId ? parseInt(companyId) : null } : task
      ));
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = 
      filter === "all" ||
      (filter === "completed" && task.completed) ||
      (filter === "pending" && !task.completed);
    
       const matchesSearch =
  (task.text || "").toLowerCase().includes((searchTerm || "").toLowerCase()) ||
  (task.assignee || "").toLowerCase().includes((searchTerm || "").toLowerCase());

    const matchesCompany = 
      !filterCompanyId ||
      (task.companyId === parseInt(filterCompanyId));
    
    return matchesFilter && matchesSearch && matchesCompany;
  });

  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    pending: tasks.filter(t => !t.completed).length
  };

  const uniqueAssignees = [...new Set(tasks.map(t => t.assignee).filter(a => a))].sort();

  if (loading) {
    return (
      <div style={{
        minHeight: "100vh",
        backgroundColor: "#F2F5F4",
        fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
        maxWidth: "480px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        gap: "20px",
      }}>
        <div style={{ fontSize: "48px" }}>⏳</div>
        <div style={{ fontSize: "16px", color: "#0A3D2E" }}>Memuat tugas...</div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: "100vh",
      backgroundColor: "#F2F5F4",
      fontFamily: "'Inter', 'DM Sans', system-ui, sans-serif",
      maxWidth: "480px",
      margin: "0 auto",
      paddingBottom: "80px",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #0A3D2E 0%, #0D5C42 100%)",
        padding: "52px 20px 28px",
        position: "relative",
      }}>
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "20px",
        }}>
          <div style={{
            color: "white",
            fontSize: "24px",
            fontWeight: 700,
            letterSpacing: "-0.5px",
          }}>
            Senarai Tugas
          </div>
          <div
            onClick={() => navigate("/home")}
            style={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "20px",
              cursor: "pointer",
            }}
          >
            ✕
          </div>
        </div>

        {/* Stats */}
        <div style={{
          display: "flex",
          gap: "10px",
        }}>
          {[
            { label: "Semua", value: stats.total, color: "#1DB87A" },
            { label: "Selesai", value: stats.completed, color: "#0D7A5F" },
            { label: "Belum", value: stats.pending, color: "#FFA726" },
          ].map((stat) => (
            <div key={stat.label} style={{
              flex: 1,
              backgroundColor: "rgba(255,255,255,0.1)",
              borderRadius: "10px",
              padding: "12px",
              border: "1px solid " + stat.color + "33",
            }}>
              <div style={{
                color: stat.color,
                fontSize: "22px",
                fontWeight: 700,
                lineHeight: 1,
              }}>{stat.value}</div>
              <div style={{
                color: "rgba(255,255,255,0.7)",
                fontSize: "11px",
                marginTop: "4px",
              }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: "20px 16px" }}>

        {/* Search */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "12px 16px",
          marginBottom: "16px",
          border: "1px solid #E4EDEA",
          display: "flex",
          alignItems: "center",
          gap: "10px",
        }}>
          <span style={{ fontSize: "18px", opacity: 0.5 }}>🔍</span>
          <input
            type="text"
            placeholder="Cari tugas atau orang..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              fontSize: "14px",
              background: "transparent",
            }}
          />
        </div>

        {/* Filter tabs */}
        <div style={{
          display: "flex",
          gap: "8px",
          marginBottom: "16px",
          overflowX: "auto",
          paddingBottom: "4px",
        }}>
          {[
            { label: "Semua", value: "all" },
            { label: "Selesai", value: "completed" },
            { label: "Belum", value: "pending" },
          ].map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              style={{
                padding: "8px 16px",
                borderRadius: "20px",
                border: "none",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                backgroundColor: filter === f.value ? "#0A3D2E" : "white",
                color: filter === f.value ? "white" : "#0A3D2E",
                border: "1px solid #E4EDEA",
                whiteSpace: "nowrap",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Company filter */}
        {companies.length > 0 && (
          <div style={{
            marginBottom: "16px",
          }}>
            <select
              value={filterCompanyId}
              onChange={(e) => setFilterCompanyId(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                borderRadius: "8px",
                border: "1px solid #E4EDEA",
                fontSize: "13px",
                backgroundColor: "white",
                cursor: "pointer",
              }}
            >
              <option value="">Semua Syarikat</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Add task */}
        <div style={{
          backgroundColor: "white",
          borderRadius: "12px",
          padding: "12px",
          marginBottom: "16px",
          border: "1px solid #E4EDEA",
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        }}>
          <input
            type="text"
            placeholder="Tambah tugas baru... (contoh: Tugas - Nama)"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && addTask()}
            style={{
              width: "100%",
              border: "none",
              outline: "none",
              fontSize: "14px",
              background: "transparent",
              padding: "8px 0",
            }}
          />
          
          {/* Company dropdown */}
          {companies.length > 0 && (
            <div style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}>
              <select
                value={selectedCompanyId}
                onChange={(e) => setSelectedCompanyId(e.target.value)}
                style={{
                  flex: 1,
                  padding: "8px 12px",
                  borderRadius: "8px",
                  border: "1px solid #E4EDEA",
                  fontSize: "13px",
                  backgroundColor: "#F9F9F9",
                  cursor: "pointer",
                }}
              >
                <option value="">Pilih Syarikat (Pilihan)</option>
                {companies.map((company) => (
                  <option key={company.id} value={company.id}>
                    {company.name}
                  </option>
                ))}
              </select>
              <button
                onClick={addTask}
                style={{
                  backgroundColor: "#0A3D2E",
                  color: "white",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 16px",
                  fontSize: "14px",
                  fontWeight: 600,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                }}
              >
                Tambah
              </button>
            </div>
          )}
          
          {companies.length === 0 && (
            <button
              onClick={addTask}
              style={{
                backgroundColor: "#0A3D2E",
                color: "white",
                border: "none",
                borderRadius: "8px",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: 600,
                cursor: "pointer",
                alignSelf: "flex-end",
              }}
            >
              Tambah
            </button>
          )}
        </div>

        {/* Task list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {filteredTasks.map((task) => (
            <div
              key={task.id}
              style={{
                backgroundColor: task.completed ? "#F5F5F5" : "white",
                borderRadius: "12px",
                padding: "14px",
                border: "1px solid #E4EDEA",
                display: "flex",
                alignItems: "flex-start",
                gap: "12px",
              }}
            >
              <button
                onClick={() => toggleTask(task.id)}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  border: `2px solid ${task.completed ? "#0D7A5F" : "#D0D9D6"}`,
                  backgroundColor: task.completed ? "#0D7A5F" : "white",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  marginTop: "2px",
                }}
              >
                {task.completed && (
                  <span style={{ color: "white", fontSize: "14px", lineHeight: 1 }}>✓</span>
                )}
              </button>
              
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: "14px",
                  fontWeight: 500,
                  color: task.completed ? "#9AA8A3" : "#0A1F17",
                  lineHeight: "1.4",
                  textDecoration: task.completed ? "line-through" : "none",
                  marginBottom: task.assignee ? "6px" : "0",
                }}>
                  {task.text}
                </div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                  {task.assignee && (
                    <div style={{
                      display: "inline-block",
                      backgroundColor: "#EBF7F3",
                      color: "#0D7A5F",
                      fontSize: "11px",
                      fontWeight: 600,
                      padding: "3px 8px",
                      borderRadius: "4px",
                    }}>
                      {task.assignee}
                    </div>
                  )}
                  <select
                    value={task.companyId || ""}
                    onChange={(e) => updateTaskCompany(task.id, e.target.value)}
                    style={{
                      padding: "3px 8px",
                      borderRadius: "4px",
                      border: "1px solid #E4EDEA",
                      fontSize: "11px",
                      backgroundColor: "white",
                      cursor: "pointer",
                      maxWidth: "150px",
                    }}
                  >
                    <option value="">Tiada Syarikat</option>
                    {companies.map((company) => (
                      <option key={company.id} value={company.id}>
                        {company.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                onClick={() => deleteTask(task.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#E57373",
                  fontSize: "18px",
                  cursor: "pointer",
                  padding: "4px",
                  lineHeight: 1,
                }}
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div style={{
            textAlign: "center",
            padding: "40px 20px",
            color: "#9AA8A3",
          }}>
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📝</div>
            <div style={{ fontSize: "14px" }}>Tiada tugas dijumpai</div>
          </div>
        )}
      </div>

      {/* Bottom Nav */}
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
          { icon: "🏠", label: "Utama", route: "/home" },
          { icon: "✓", label: "Tugas", route: "/todo-list", active: true },
          { icon: "⚙️", label: "Tetapan", route: "/home" },
        ].map((nav) => (
          <div
            key={nav.label}
            onClick={() => navigate(nav.route)}
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "3px",
              padding: "4px 0",
              cursor: "pointer",
              WebkitTapHighlightColor: "transparent",
            }}
          >
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

export default TodoList;
