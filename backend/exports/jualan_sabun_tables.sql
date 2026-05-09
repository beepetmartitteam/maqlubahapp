-- =============================================
-- Jualan Sabun Database Schema Export
-- Generated from Sequelize models
-- =============================================

-- Drop existing tables (for clean import)
DROP TABLE IF EXISTS jualan_sabun_details;
DROP TABLE IF EXISTS jualan_sabun_records;
DROP TABLE IF EXISTS folders;

-- =============================================
-- Table: folders
-- =============================================
CREATE TABLE folders (
  id VARCHAR(20) NOT NULL,
  label VARCHAR(100) NOT NULL COMMENT 'Folder display name with emoji',
  color VARCHAR(7) NOT NULL COMMENT 'Folder color code',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: jualan_sabun_records
-- =============================================
CREATE TABLE jualan_sabun_records (
  id INT NOT NULL AUTO_INCREMENT,
  month INT NOT NULL COMMENT 'Month (1-12)',
  week INT NOT NULL COMMENT 'Week (1-4)',
  year INT NOT NULL COMMENT 'Year (e.g., 2026)',
  total_amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Total sales amount',
  total_members INT NOT NULL DEFAULT 0 COMMENT 'Total number of members',
  paid_members INT NOT NULL DEFAULT 0 COMMENT 'Number of paid members',
  record_date DATE NOT NULL COMMENT 'Record date',
  status ENUM('active', 'completed') NOT NULL DEFAULT 'active' COMMENT 'Record status',
  folder_id VARCHAR(20) NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_month_week_year (month, week, year),
  INDEX idx_status (status),
  INDEX idx_record_date (record_date),
  INDEX idx_folder_id (folder_id),
  CONSTRAINT fk_jualan_sabun_records_folder_id FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Table: jualan_sabun_details
-- =============================================
CREATE TABLE jualan_sabun_details (
  id INT NOT NULL AUTO_INCREMENT,
  record_id INT NOT NULL COMMENT 'Reference to main record',
  folder_id VARCHAR(20) NOT NULL COMMENT 'Folder reference',
  folder_label VARCHAR(100) NOT NULL COMMENT 'Folder name at time of record',
  ahli_id INT NOT NULL COMMENT 'Reference to ahli table',
  amount DECIMAL(10,2) NOT NULL DEFAULT 0.00 COMMENT 'Payment amount',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  INDEX idx_record_id (record_id),
  INDEX idx_folder_id (folder_id),
  INDEX idx_ahli_id (ahli_id),
  CONSTRAINT fk_jualan_sabun_details_record_id FOREIGN KEY (record_id) REFERENCES jualan_sabun_records(id) ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT fk_jualan_sabun_details_ahli_id FOREIGN KEY (ahli_id) REFERENCES ahlis(id) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =============================================
-- Sample Data (Optional)
-- =============================================

-- Insert sample folders
INSERT INTO folders (id, label, color) VALUES
('S13', '📁 S13', '#0F6E56'),
('MKN', '📁 MKN ++', '#185FA5'),
('MUSLIMAH', '📁 MUSLIMAH', '#993556'),
('L_LELAKI', '📁 LAIN² LELAKI', '#854F0B'),
('L_MUSLIMAH', '📁 LAIN2 MUSLIMAH', '#72243E'),
('KOMUNITI', '📁 KOMUNITI', '#534AB7');

-- =============================================
-- Additional Notes
-- =============================================

-- Foreign Key Dependencies:
-- - jualan_sabun_records.ahli_id references ahlis.id (should be created separately)
-- - jualan_sabun_details.ahli_id references ahlis.id (should be created separately)

-- Indexes for Performance:
-- - Composite index on month, week, year for efficient date-based queries
-- - Index on status for filtering by record status
-- - Index on record_date for date range queries
-- - Index on ahli_id for joining with ahlis table

-- Data Integrity:
-- - CASCADE delete: When a record is deleted, all its details are also deleted
-- - RESTRICT delete: Cannot delete an ahli if they have existing payment records
-- - ON UPDATE CASCADE: Foreign keys are updated when referenced keys change

-- Timestamps:
-- - Both tables include created_at and updated_at for audit trail
-- - updated_at automatically updates on record changes
