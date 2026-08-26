import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectAPI } from "../api/project";
import { uploadMultipleToCloudinary } from "../utils/cloudinary";

function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  
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
  
  // Image upload states
  const [newImages, setNewImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProject();
    }
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const data = await projectAPI.getProjectById(id, token);
      
      if (data.success) {
        setProject(data.data);
        setFormData({
          id: data.data.id,
          name: data.data.name,
          type: data.data.type,
          status: data.data.status,
          address: data.data.address || "",
          city: data.data.city || "",
          negri: data.data.negri || "",
          negara: data.data.negara || "Malaysia",
          syarikat: data.data.syarikat || "",
          latitude: data.data.latitude || "",
          longitude: data.data.longitude || "",
          description: data.data.description || "",
          image_urls: data.data.image_urls || [],
          phone: data.data.phone || "",
          manager: data.data.manager || "",
          stock: data.data.stock || 0,
          orders: data.data.orders || 0
        });
      }
    } catch (err) {
      console.error('Error fetching project:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages([...newImages, ...files]);
    
    // Create previews
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
    setImagePreviews(imagePreviews.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    const updatedUrls = formData.image_urls.filter((_, i) => i !== index);
    setFormData({...formData, image_urls: updatedUrls});
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      let uploadedUrls = [];
      
      // Upload new images to Cloudinary if any
      if (newImages.length > 0) {
        try {
          const uploadResults = await uploadMultipleToCloudinary(newImages, 'projects', 'customer');
          uploadedUrls = uploadResults.map(result => result.url);
        } catch (uploadErr) {
          console.error('Error uploading images:', uploadErr);
          alert('Gagal memuat naik gambar. Sila cuba lagi.');
          return;
        }
      }
      
      const updatedFormData = {
        ...formData,
        image_urls: [...formData.image_urls, ...uploadedUrls]
      };
      
      const token = localStorage.getItem('token');
      const data = await projectAPI.updateProject(id, updatedFormData, token);
      
      if (data.success) {
        alert('Projek berjaya dikemaskini!');
        navigate('/projects');
      }
    } catch (err) {
      console.error('Error saving project:', err);
      alert('Gagal menyimpan projek');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Adakah anda pasti mahu memadam projek ini?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const data = await projectAPI.deleteProject(id, token);
      
      if (data.success) {
        alert('Projek berjaya dipadam!');
        navigate('/projects');
      }
    } catch (err) {
      console.error('Error deleting project:', err);
      alert('Gagal memadam projek');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", color: "#666" }}>Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <div style={{ fontSize: "18px", color: "#EF4444" }}>Error: {error}</div>
      </div>
    );
  }

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

  return (
    <div style={{ padding: "20px", maxWidth: "1200px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "24px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <button
            onClick={() => navigate('/projects')}
            style={{ padding: "8px 16px", borderRadius: "8px", border: "1px solid #E4EDEA", backgroundColor: "white", cursor: "pointer", fontSize: "14px", marginBottom: "12px" }}
          >
            ← Kembali
          </button>
          <h1 style={{ fontSize: "28px", fontWeight: 700, color: "#0A1F17", marginBottom: "8px" }}>
            Edit Projek
          </h1>
          <p style={{ fontSize: "14px", color: "#666" }}>
            {formData.name} - {getTypeLabel(formData.type)}
          </p>
        </div>
        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleDelete}
            style={{ padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#EF4444", color: "white", cursor: "pointer", fontSize: "14px", fontWeight: 600 }}
          >
            Padam
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{ padding: "10px 20px", borderRadius: "8px", border: "none", backgroundColor: "#0A3D2E", color: "white", cursor: saving ? "not-allowed" : "pointer", fontSize: "14px", fontWeight: 600, opacity: saving ? 0.6 : 1 }}
          >
            {saving ? 'Menyimpan...' : 'Simpan'}
          </button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
        {/* Left Column - Form */}
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid #E4EDEA" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", color: "#0A1F17" }}>
            Maklumat Projek
          </h2>
          
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
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #E4EDEA", fontSize: "14px", minHeight: "100px" }}
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
          </div>
        </div>

        {/* Right Column - Images */}
        <div style={{ backgroundColor: "white", padding: "24px", borderRadius: "12px", border: "1px solid #E4EDEA" }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px", color: "#0A1F17" }}>
            Gambar
          </h2>
          
          {/* Upload Button */}
          <div style={{ marginBottom: "20px" }}>
            <input
              type="file"
              id="image-upload"
              multiple
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
            <label
              htmlFor="image-upload"
              style={{
                display: "block",
                padding: "16px",
                borderRadius: "8px",
                border: "2px dashed #E4EDEA",
                backgroundColor: "#F9FAFB",
                textAlign: "center",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#F3F4F6"}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "#F9FAFB"}
            >
              <div style={{ fontSize: "32px", marginBottom: "8px" }}>📷</div>
              <div style={{ fontSize: "14px", fontWeight: 600, color: "#0A1F17", marginBottom: "4px" }}>
                Tambah Gambar
              </div>
              <div style={{ fontSize: "12px", color: "#666" }}>
                Klik atau drag gambar ke sini (Multi-upload)
              </div>
            </label>
          </div>

          {/* Existing Images */}
          {formData.image_urls.length > 0 && (
            <div style={{ marginBottom: "20px" }}>
              <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: "#0A1F17" }}>
                Gambar Sedia Ada ({formData.image_urls.length})
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                {formData.image_urls.map((url, index) => (
                  <div key={index} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "16/9" }}>
                    <img
                      src={url}
                      alt={`Project image ${index + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      onClick={() => removeExistingImage(index)}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(239, 68, 68, 0.9)",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* New Image Previews */}
          {imagePreviews.length > 0 && (
            <div>
              <h3 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "12px", color: "#0A1F17" }}>
                Gambar Baru ({imagePreviews.length})
              </h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px" }}>
                {imagePreviews.map((preview, index) => (
                  <div key={index} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", aspectRatio: "16/9" }}>
                    <img
                      src={preview}
                      alt={`New image ${index + 1}`}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <button
                      onClick={() => removeNewImage(index)}
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        width: "28px",
                        height: "28px",
                        borderRadius: "50%",
                        backgroundColor: "rgba(239, 68, 68, 0.9)",
                        color: "white",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "16px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {formData.image_urls.length === 0 && imagePreviews.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#666" }}>
              <div style={{ fontSize: "48px", marginBottom: "16px" }}>🖼️</div>
              <div style={{ fontSize: "14px" }}>Tiada gambar</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectEdit;
