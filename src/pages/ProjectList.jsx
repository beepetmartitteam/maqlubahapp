import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectAPI } from "../api/project";

function ProjectList() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Filter states
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCity, setFilterCity] = useState("");
  const [filterNegri, setFilterNegri] = useState("");
  const [filterSyarikat, setFilterSyarikat] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  
  // Modal states
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  
  // Form states
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    type: "pejabat",
    status: "active",
    address: "",
    city: "",
    negri: "",
    negara: "Malaysia",
    syarikat: "",
    latitude: "",
    longitude: "",
    description: "",
    image_urls: [],
    phone: "",
    manager: "",
    stock: 0,
    orders: 0
  });

  useEffect(() => {
    fetchProjects();
    fetchStats();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const data = await projectAPI.getProjects(token, {});
      
      if (data.success) {
        setProjects(data.data);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Client-side filtering
  const filteredProjects = projects.filter(project => {
    if (filterType && project.type !== filterType) return false;
    if (filterStatus && project.status !== filterStatus) return false;
    if (filterCity && project.city !== filterCity) return false;
    if (filterNegri && project.negri !== filterNegri) return false;
    if (filterSyarikat && project.syarikat !== filterSyarikat) return false;
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      return (
        project.name?.toLowerCase().includes(searchLower) ||
        project.address?.toLowerCase().includes(searchLower) ||
        project.city?.toLowerCase().includes(searchLower) ||
        project.negri?.toLowerCase().includes(searchLower) ||
        project.syarikat?.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await projectAPI.getProjectStats(token);
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleAddProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await projectAPI.createProject(token, formData);
      
      if (data.success) {
        setProjects([...projects, data.data]);
        setShowAddModal(false);
        resetForm();
        fetchStats();
      }
    } catch (err) {
      console.error('Error adding project:', err);
      alert('Failed to add project');
    }
  };

  const handleUpdateProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const data = await projectAPI.updateProject(selectedProject.id, formData, token);
      
      if (data.success) {
        setProjects(projects.map(p => p.id === selectedProject.id ? data.data : p));
        setShowEditModal(false);
        setSelectedProject(null);
        resetForm();
      }
    } catch (err) {
      console.error('Error updating project:', err);
      alert('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const data = await projectAPI.deleteProject(projectId, token);
      
      if (data.success) {
        setProjects(projects.filter(p => p.id !== projectId));
        fetchStats();
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Failed to delete project');
    }
  };

  const openEditModal = (project) => {
    setSelectedProject(project);
    setFormData({
      id: project.id,
      name: project.name,
      type: project.type,
      status: project.status,
      address: project.address || "",
      city: project.city || "",
      negri: project.negri || "",
      negara: project.negara || "Malaysia",
      syarikat: project.syarikat || "",
      latitude: project.latitude || "",
      longitude: project.longitude || "",
      description: project.description || "",
      image_urls: project.image_urls || [],
      phone: project.phone || "",
      manager: project.manager || "",
      stock: project.stock || 0,
      orders: project.orders || 0
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      id: "",
      name: "",
      type: "pejabat",
      status: "active",
      address: "",
      city: "",
      negri: "",
      negara: "Malaysia",
      syarikat: "",
      latitude: "",
      longitude: "",
      description: "",
      image_urls: [],
      phone: "",
      manager: "",
      stock: 0,
      orders: 0
    });
  };

  const getTypeLabel = (type) => {
    const labels = {
      pejabat: '🏢 Pejabat',
      tanah: '🌾 Tanah',
      premis: '🏗️ Premis',
      kilang: '🏭 Kilang',
      gudang: '📦 Gudang',
      kedai: '🏪 Kedai',
      'lain-lain': '📌 Lain-lain'
    };
    return labels[type] || type;
  };

  const getStatusColor = (status) => {
    const colors = {
      active: '#10B981',
      inactive: '#6B7280',
      pending: '#F59E0B',
      completed: '#3B82F6'
    };
    return colors[status] || '#6B7280';
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", color: "#666" }}>Loading...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", maxWidth: "1400px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0A1F17", marginBottom: "8px" }}>
          Projek
        </h1>
        <p style={{ fontSize: "14px", color: "#666", marginBottom: "16px" }}>
          Uruskan semua projek anda di satu tempat
        </p>
        
        {/* Stats */}
        {stats && (
          <div style={{ display: "flex", gap: "16px", marginBottom: "24px" }}>
            <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "12px", border: "1px solid #E4EDEA", flex: 1 }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#0A1F17" }}>{stats.total}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>Jumlah Projek</div>
            </div>
            <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "12px", border: "1px solid #E4EDEA", flex: 1 }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#10B981" }}>{stats.active}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>Aktif</div>
            </div>
            <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "12px", border: "1px solid #E4EDEA", flex: 1 }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#F59E0B" }}>{stats.pending}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>Pending</div>
            </div>
            <div style={{ backgroundColor: "white", padding: "16px", borderRadius: "12px", border: "1px solid #E4EDEA", flex: 1 }}>
              <div style={{ fontSize: "24px", fontWeight: 700, color: "#3B82F6" }}>{stats.completed}</div>
              <div style={{ fontSize: "12px", color: "#666" }}>Selesai</div>
            </div>
          </div>
        )}
      </div>

      {/* Filters */}
      <div style={{ backgroundColor: "white", padding: "20px", borderRadius: "12px", border: "1px solid #E4EDEA", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Cari projek..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              flex: 1,
              minWidth: "200px",
              padding: "10px 14px",
              borderRadius: "8px",
              border: "1px solid #E4EDEA",
              fontSize: "14px"
            }}
          />
         
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
          >
            <option value="">Semua Jenis</option>
            <option value="pejabat">Pejabat</option>
            <option value="tanah">Tanah</option>
            <option value="premis">Premis</option>
            <option value="kilang">Kilang</option>
            <option value="gudang">Gudang</option>
            <option value="kedai">Kedai</option>
            <option value="lain-lain">Lain-lain</option>
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
          >
            <option value="">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Tidak Aktif</option>
            <option value="pending">Pending</option>
            <option value="completed">Selesai</option>
          </select>
          <button
            onClick={() => {
              setFilterType("");
              setFilterStatus("");
              setFilterCity("");
              setFilterNegri("");
              setFilterSyarikat("");
              setSearchTerm("");
              fetchProjects();
            }}
            style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #E4EDEA", backgroundColor: "white", cursor: "pointer", fontSize: "14px" }}
          >
            Reset
          </button>
          <button
            onClick={() => {
              resetForm();
              setShowAddModal(true);
            }}
            style={{ padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#0A3D2E", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
          >
            + Tambah Projek
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))", gap: "20px" }}>
        {filteredProjects.map((project) => (
          <div
            key={project.id}
            style={{
              backgroundColor: "white",
              borderRadius: "12px",
              border: "1px solid #E4EDEA",
              overflow: "hidden",
              transition: "transform 0.2s, box-shadow 0.2s",
              cursor: "pointer"
            }}
            onClick={() => navigate(`/projects/${project.id}/edit`)}
          >
            {project.image_urls && project.image_urls.length > 0 && (
              <div style={{ height: "180px", backgroundColor: "#F5F5F5" }}>
                <img
                  src={project.image_urls[0]}
                  alt={project.name}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}
            <div style={{ padding: "16px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", fontWeight: 600, color: "#0A1F17", marginBottom: "4px" }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: "12px", color: "#666", marginBottom: "8px" }}>
                    {project.address && `${project.address}, `}
                    {project.city && `${project.city}, `}
                    {project.negri}
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: getStatusColor(project.status),
                    color: "white",
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "4px 8px",
                    borderRadius: "4px",
                    whiteSpace: "nowrap"
                  }}
                >
                  {project.status.toUpperCase()}
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
                <div style={{ backgroundColor: "#EBF7F3", color: "#0D7A5F", fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "4px" }}>
                  {getTypeLabel(project.type)}
                </div>
                {project.syarikat && (
                  <div style={{ backgroundColor: "#F3F4F6", color: "#374151", fontSize: "11px", fontWeight: 600, padding: "3px 8px", borderRadius: "4px" }}>
                    {project.syarikat}
                  </div>
                )}
              </div>
              
              {/*}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "12px", color: "#666" }}>
                <div>
                  {project.manager && `👤 ${project.manager}`}
                </div>
                <div style={{ display: "flex", gap: "16px" }}>
                  <span>📦 {project.stock}</span>
                  <span>📋 {project.orders}</span>
                </div>
              </div>
               {*/}
            </div>
          </div>
        ))}
      </div>

      {projects.length === 0 && !loading && (
        <div style={{ textAlign: "center", padding: "60px 20px", color: "#666" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>📁</div>
          <div style={{ fontSize: "16px", marginBottom: "8px" }}>Tiada projek dijumpai</div>
          <div style={{ fontSize: "14px" }}>Mula dengan menambah projek baru</div>
        </div>
      )}

      {/* Add Modal */}
      {showAddModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", maxWidth: "600px", width: "90%", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>Tambah Projek Baru</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>ID Projek *</label>
                <input
                  type="text"
                  value={formData.id}
                  onChange={(e) => setFormData({...formData, id: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  placeholder="contoh: proj-001"
                />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Nama Projek *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  placeholder="Nama projek"
                />
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Jenis</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  >
                    <option value="pejabat">Pejabat</option>
                    <option value="tanah">Tanah</option>
                    <option value="premis">Premis</option>
                    <option value="kilang">Kilang</option>
                    <option value="gudang">Gudang</option>
                    <option value="kedai">Kedai</option>
                    <option value="lain-lain">Lain-lain</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Alamat</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  placeholder="Alamat lengkap"
                />
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Bandar</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                    placeholder="Bandar"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Negeri</label>
                  <input
                    type="text"
                    value={formData.negri}
                    onChange={(e) => setFormData({...formData, negri: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                    placeholder="Negeri"
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Negara</label>
                <select
                  value={formData.negara}
                  onChange={(e) => setFormData({...formData, negara: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                >
                  <option value="Malaysia">Malaysia</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Mesir">Mesir</option>
                  <option value="Arab Saudi">Arab Saudi</option>
                  <option value="Eropa">Eropa</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Syarikat</label>
                <input
                  type="text"
                  value={formData.syarikat}
                  onChange={(e) => setFormData({...formData, syarikat: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  placeholder="Nama syarikat"
                />
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                    placeholder="Latitude"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                    placeholder="Longitude"
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Penerangan</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px", minHeight: "80px" }}
                  placeholder="Penerangan projek"
                />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>URL Gambar (pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={formData.image_urls.join(", ")}
                  onChange={(e) => setFormData({...formData, image_urls: e.target.value.split(",").map(url => url.trim())})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  placeholder="https://example.com/image1.jpg, https://example.com/image2.jpg"
                />
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Telefon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                    placeholder="+60 12-345 6789"
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Pengurus</label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                    placeholder="Nama pengurus"
                  />
                </div>
              </div>
              {/*}
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Stok</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Pesanan</label>
                  <input
                    type="number"
                    value={formData.orders}
                    onChange={(e) => setFormData({...formData, orders: parseInt(e.target.value) || 0})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  />
                </div>
              </div>
              {*/}
            </div>
            
            <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  resetForm();
                }}
                style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #E4EDEA", backgroundColor: "white", cursor: "pointer", fontSize: "14px" }}
              >
                Batal
              </button>
              <button
                onClick={handleAddProject}
                style={{ padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#0A3D2E", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedProject && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div style={{ backgroundColor: "white", borderRadius: "12px", padding: "24px", maxWidth: "600px", width: "90%", maxHeight: "90vh", overflowY: "auto" }}>
            <h2 style={{ fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>Edit Projek</h2>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>ID Projek</label>
                <input
                  type="text"
                  value={formData.id}
                  disabled
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px", backgroundColor: "#F5F5F5" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Nama Projek *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                />
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Jenis</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  >
                    <option value="pejabat">Pejabat</option>
                    <option value="tanah">Tanah</option>
                    <option value="premis">Premis</option>
                    <option value="kilang">Kilang</option>
                    <option value="gudang">Gudang</option>
                    <option value="kedai">Kedai</option>
                    <option value="lain-lain">Lain-lain</option>
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  >
                    <option value="active">Aktif</option>
                    <option value="inactive">Tidak Aktif</option>
                    <option value="pending">Pending</option>
                    <option value="completed">Selesai</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Alamat</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                />
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Bandar</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Negeri</label>
                  <input
                    type="text"
                    value={formData.negri}
                    onChange={(e) => setFormData({...formData, negri: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Negara</label>
                <select
                  value={formData.negara}
                  onChange={(e) => setFormData({...formData, negara: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                >
                  <option value="Malaysia">Malaysia</option>
                  <option value="Thailand">Thailand</option>
                  <option value="Indonesia">Indonesia</option>
                  <option value="Mesir">Mesir</option>
                  <option value="Arab Saudi">Arab Saudi</option>
                  <option value="Eropa">Eropa</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Syarikat</label>
                <input
                  type="text"
                  value={formData.syarikat}
                  onChange={(e) => setFormData({...formData, syarikat: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                />
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({...formData, latitude: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({...formData, longitude: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  />
                </div>
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Penerangan</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px", minHeight: "80px" }}
                />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>URL Gambar (pisahkan dengan koma)</label>
                <input
                  type="text"
                  value={formData.image_urls.join(", ")}
                  onChange={(e) => setFormData({...formData, image_urls: e.target.value.split(",").map(url => url.trim())})}
                  style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                />
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Telefon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Pengurus</label>
                  <input
                    type="text"
                    value={formData.manager}
                    onChange={(e) => setFormData({...formData, manager: e.target.value})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  />
                </div>
              </div>
              
              <div style={{ display: "flex", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Stok</label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: parseInt(e.target.value) || 0})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>Pesanan</label>
                  <input
                    type="number"
                    value={formData.orders}
                    onChange={(e) => setFormData({...formData, orders: parseInt(e.target.value) || 0})}
                    style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px" }}
                  />
                </div>
              </div>
            </div>
            
            <div style={{ display: "flex", gap: "12px", marginTop: "24px", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedProject(null);
                  resetForm();
                }}
                style={{ padding: "10px 20px", borderRadius: "8px", border: "1px solid #E4EDEA", backgroundColor: "white", cursor: "pointer", fontSize: "14px" }}
              >
                Batal
              </button>
              <button
                onClick={() => handleDeleteProject(selectedProject.id)}
                style={{ padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#EF4444", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
              >
                Padam
              </button>
              <button
                onClick={handleUpdateProject}
                style={{ padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#0A3D2E", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
              >
                Kemaskini
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectList;
