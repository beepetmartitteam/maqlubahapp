-- =============================================
-- Ahli Database Schema Export
-- Generated from Sequelize models
-- =============================================

-- Drop existing table (for clean import)
DROP TABLE IF EXISTS ahlis;

-- =============================================
-- Table: ahlis
-- =============================================
CREATE TABLE ahlis (
  id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  folder_id VARCHAR(50) NOT NULL,
  folder_label VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_folder_id (folder_id),
  INDEX idx_name (name),
  INDEX idx_is_active (is_active),
  CONSTRAINT fk_ahlis_folder_id FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Sample Data (Optional)
-- =============================================

-- Insert sample ahli data for each folder
INSERT INTO ahlis (name, folder_id, folder_label, is_active) VALUES
-- S13 Members
('AM KAMIL', 'S13', '📁 S13', TRUE),
('EN ABE THAI', 'S13', '📁 S13', TRUE),
('USTAZAH', 'S13', '📁 S13', TRUE),
('HJH ROHANI', 'S13', '📁 S13', TRUE),
('HAJI', 'S13', '📁 S13', TRUE),

-- MKN Members
('ABANG LONG', 'MKN', '📁 MKN ++', TRUE),
('ADIB', 'MKN', '📁 MKN ++', TRUE),
('AIMAN', 'MKN', '📁 MKN ++', TRUE),
('AKMAL', 'MKN', '📁 MKN ++', TRUE),
('ALIF', 'MKN', '📁 MKN ++', TRUE),

-- MUSLIMAH Members
('UJAIRAH', 'MUSLIMAH', '📁 MUSLIMAH', TRUE),
('UMMU AIMAN', 'MUSLIMAH', '📁 MUSLIMAH', TRUE),
('UMMU KHALID', 'MUSLIMAH', '📁 MUSLIMAH', TRUE),
('UJAIRAH 2', 'MUSLIMAH', '📁 MUSLIMAH', TRUE),
('UMMU SULAIMAN', 'MUSLIMAH', '📁 MUSLIMAH', TRUE),

-- LAIN² LELAKI Members
('PAK CIK', 'L_LELAKI', '📁 LAIN² LELAKI', TRUE),
('ABANG DIN', 'L_LELAKI', '📁 LAIN² LELAKI', TRUE),
('ENCik KAMAL', 'L_LELAKI', '📁 LAIN² LELAKI', TRUE),
('HAJI BAKAR', 'L_LELAKI', '📁 LAIN² LELAKI', TRUE),
('TOK KIA', 'L_LELAKI', '📁 LAIN² LELAKI', TRUE),

-- LAIN2 MUSLIMAH Members
('MAK CIK', 'L_MUSLIMAH', '📁 LAIN2 MUSLIMAH', TRUE),
('KAKAK', 'L_MUSLIMAH', '📁 LAIN2 MUSLIMAH', TRUE),
('MAK LONG', 'L_MUSLIMAH', '📁 LAIN2 MUSLIMAH', TRUE),
('IBU ANI', 'L_MUSLIMAH', '📁 LAIN2 MUSLIMAH', TRUE),
('MAK ENON', 'L_MUSLIMAH', '📁 LAIN2 MUSLIMAH', TRUE),

-- KOMUNITI Members
('CIKGU AHMAD', 'KOMUNITI', '📁 KOMUNITI', TRUE),
('USTAZ KHALID', 'KOMUNITI', '📁 KOMUNITI', TRUE),
('ENCIK RAZAK', 'KOMUNITI', '📁 KOMUNITI', TRUE),
('HAJAH SALMAH', 'KOMUNITI', '📁 KOMUNITI', TRUE),
('PUAN SITI', 'KOMUNITI', '📁 KOMUNITI', TRUE);

-- =============================================
-- Common Queries for Ahli Management
-- =============================================

-- Get all active ahli by folder
SELECT * FROM ahlis 
WHERE is_active = TRUE AND folder_id = 'S13'
ORDER BY name;

-- Get ahli count by folder
SELECT 
  folder_id,
  folder_label,
  COUNT(*) as total_members,
  SUM(CASE WHEN is_active = TRUE THEN 1 ELSE 0 END) as active_members
FROM ahlis
GROUP BY folder_id, folder_label
ORDER BY folder_id;

-- Search ahli by name
SELECT * FROM ahlis 
WHERE name LIKE '%kamil%' AND is_active = TRUE
ORDER BY name;

-- Get ahli with payment records
SELECT 
  a.*,
  COUNT(jd.id) as payment_count,
  SUM(jd.amount) as total_paid
FROM ahlis a
LEFT JOIN jualan_sabun_details jd ON a.id = jd.ahli_id
WHERE a.is_active = TRUE
GROUP BY a.id, a.name, a.folder_id
ORDER BY a.name;

-- =============================================
-- Additional Notes
-- =============================================

-- Foreign Key Dependencies:
-- - ahlis.folder_id references folders.id (folders table must exist first)

-- Indexes for Performance:
-- - idx_folder_id: For filtering by folder
-- - idx_name: For searching by name
-- - idx_is_active: For filtering active/inactive members

-- Data Integrity:
-- - RESTRICT delete: Cannot delete a folder if it has existing ahli records
-- - ON UPDATE CASCADE: Foreign keys are updated when referenced keys change

-- Timestamps:
-- - created_at: Record when ahli was added
-- - updated_at: Automatically updates on record changes
-- - is_active: Soft delete flag instead of hard delete

-- Associations:
-- - One-to-many: Ahli has many JualanSabunDetail records
-- - Many-to-one: Ahli belongs to one Folder
