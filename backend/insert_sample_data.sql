-- Insert sample companies data into MySQL database

-- Clear existing data (optional - remove if you want to keep existing data)
DELETE FROM staff WHERE company_id IS NOT NULL;
DELETE FROM plans WHERE company_id IS NOT NULL;
DELETE FROM companies WHERE id >= 1;

-- Insert companies
INSERT INTO companies (id, name, industry, employees, revenue, growth, status, color, ceo, created_at, updated_at) VALUES
(1, 'Insafora Ventures Sdn Bhd', 'Restoran (Retail F&B)', 50, 3500000.00, 12.00, 'active', '#1976d2', 'Tn Mohd Shukri', NOW(), NOW()),
(2, 'Manufacturing Syarikat', 'Perkilangan (Manufacturing)', 35, 2800000.00, 8.00, 'active', '#2e7d32', 'Tn Nik Hazani', NOW(), NOW()),
(3, 'Fateh Livestock', 'Penternakan (Livestock)', 25, 1800000.00, 15.00, 'active', '#9c27b0', 'Tn Anuar', NOW(), NOW()),
(4, 'Agrotech Solutions', 'Pertanian (Agrotech)', 30, 2200000.00, 18.00, 'active', '#ff9800', 'Tn Hamdi', NOW(), NOW()),
(5, 'Import Export Supply Chain', 'Import Eksport (Supply Chain)', 40, 4500000.00, 10.00, 'active', '#4caf50', 'Tn Nik Fateh', NOW(), NOW()),
(6, 'Equine Excellence', 'Equine', 20, 1500000.00, 5.00, 'active', '#795548', 'Tn Adib', NOW(), NOW()),
(7, 'Resolvia Training & Consultancy Sdn Bhd', 'Latihan dan Motivasi', 15, 1200000.00, 8.00, 'active', '#e91e63', 'Tn Syarif', NOW(), NOW()),
(8, 'Construction & Renovation Pro', 'Construction / Renovation', 45, 3800000.00, 12.00, 'active', '#607d8b', 'Tn Afdhal Latif', NOW(), NOW()),
(9, 'Safina Worldwide Sdn Bhd', 'Pemasaran', 25, 2000000.00, 15.00, 'active', '#ff5722', 'Tn Fida', NOW(), NOW()),
(10, 'Education & Human Development', 'Pendidikan & Bina Insan', 35, 2500000.00, 10.00, 'active', '#3f51b5', 'En Zar Nukman', NOW(), NOW()),
(11, 'Logistics & Transport Solutions', 'Logistik & Transport', 30, 2800000.00, 8.00, 'active', '#009688', 'Tn Waji', NOW(), NOW()),
(12, 'IT & Multimedia Solutions', 'IT & Multimedia', 20, 1800000.00, 20.00, 'active', '#9c27b0', 'Tn Hanzalah', NOW(), NOW()),
(13, 'Medical Services Group', 'Medical', 40, 3200000.00, 12.00, 'active', '#f44336', 'Tn Hasnan', NOW(), NOW()),
(14, 'Wholesale & Retail Group', 'Borong & Runcit', 50, 4000000.00, 6.00, 'active', '#ff9800', 'Tn Fadhil', NOW(), NOW()),
(15, 'Hotel & Homestay Management', 'Hotel dan Homestay', 35, 3000000.00, 10.00, 'active', '#2196f3', 'Tn Syurahbil', NOW(), NOW()),
(16, 'Travel & Tourism Services', 'Travel & Tourism', 25, 2200000.00, 15.00, 'active', '#4caf50', 'Tn Abbad', NOW(), NOW()),
(17, 'Housing Development Corp', 'Housing Development', 45, 5000000.00, 8.00, 'active', '#795548', 'Tn Amin', NOW(), NOW()),
(18, 'Bakery & Confectioneries', 'Bakery & Confectionaries', 30, 2400000.00, 12.00, 'active', '#e91e63', 'Tn Quddamah', NOW(), NOW()),
(19, 'Engineering Solutions', 'Engineering', 35, 3500000.00, 10.00, 'active', '#607d8b', 'En Khairi Syafie', NOW(), NOW()),
(20, 'Event Management Pro', 'Event Management', 20, 1800000.00, 18.00, 'active', '#9c27b0', 'Cik Khaulah', NOW(), NOW()),
(21, 'Fishery & Aquaculture', 'Fishery', 25, 2000000.00, 14.00, 'active', '#009688', 'En Hisham Hashim', NOW(), NOW()),
(22, 'Mart Retail Solutions', 'Mart', 40, 3000000.00, 8.00, 'active', '#ff5722', 'En Nik Hishamuddin', NOW(), NOW()),
(23, 'Fashion & Lifestyle', 'Fesyen & Lifestyle', 18, 1500000.00, 20.00, 'active', '#e91e63', 'Pn Mubarokah', NOW(), NOW()),
(24, 'Management Services Group', 'Management Service', 30, 2800000.00, 10.00, 'active', '#3f51b5', 'En Khushairi', NOW(), NOW()),
(25, 'Pertubuhan Kebajikan', 'Pertubuhan', 15, 1000000.00, 5.00, 'active', '#ff9800', 'Pn Roqaiyah', NOW(), NOW());

-- Insert staff for each company
INSERT INTO staff (name, company_id, status, created_at, updated_at) VALUES
-- Company 1: Insafora Ventures Sdn Bhd
('Tn Fadhil Yasin', 1, 'active', NOW(), NOW()),
('Tn Mohd Shukri', 1, 'active', NOW(), NOW()),

-- Company 2: Manufacturing Syarikat
('Tn Nik Hazani', 2, 'active', NOW(), NOW()),
('Tn Amin', 2, 'active', NOW(), NOW()),
('En Ridwan', 2, 'active', NOW(), NOW()),

-- Company 3: Fateh Livestock
('Tn Anuar', 3, 'active', NOW(), NOW()),
('En Kamil Abdullah', 3, 'active', NOW(), NOW()),

-- Company 4: Agrotech Solutions
('Tn Hamdi', 4, 'active', NOW(), NOW()),
('Cik Kak Ngah', 4, 'active', NOW(), NOW()),
('En Arobi', 4, 'active', NOW(), NOW()),

-- Company 5: Import Export Supply Chain
('Tn Nik Fateh', 5, 'active', NOW(), NOW()),
('En Nik Hishamuddin', 5, 'active', NOW(), NOW()),

-- Company 6: Equine Excellence
('Tn Adib', 6, 'active', NOW(), NOW()),
('Tn Hamdi', 6, 'active', NOW(), NOW()),

-- Company 7: Resolvia Training & Consultancy Sdn Bhd
('Tn Syarif', 7, 'active', NOW(), NOW()),
('Puan Mubarokah', 7, 'active', NOW(), NOW()),
('Puan Azura', 7, 'active', NOW(), NOW()),

-- Company 8: Construction & Renovation Pro
('Tn Afdhal Latif', 8, 'active', NOW(), NOW()),
('Tn Nik Ashaari', 8, 'active', NOW(), NOW()),

-- Company 9: Safina Worldwide Sdn Bhd
('Tn Syurahbil', 9, 'active', NOW(), NOW()),
('Tn Fida', 9, 'active', NOW(), NOW()),
('En Fajrul', 9, 'active', NOW(), NOW()),

-- Company 10: Education & Human Development
('Tn Nik Hazani', 10, 'active', NOW(), NOW()),
('En Zar Nukman', 10, 'active', NOW(), NOW()),
('En Zahid', 10, 'active', NOW(), NOW()),
('Cik Norshitah', 10, 'active', NOW(), NOW()),
('En Abu Ubaidah', 10, 'active', NOW(), NOW()),

-- Company 11: Logistics & Transport Solutions
('Tn Waji', 11, 'active', NOW(), NOW()),

-- Company 12: IT & Multimedia Solutions
('Tn Hanzalah', 12, 'active', NOW(), NOW()),
('En Jaafar', 12, 'active', NOW(), NOW()),
('Cik Fathiyyah', 12, 'active', NOW(), NOW()),

-- Company 13: Medical Services Group
('Tn Hasnan', 13, 'active', NOW(), NOW()),
('Cik Asilah', 13, 'active', NOW(), NOW()),

-- Company 14: Wholesale & Retail Group
('Tn Fadhil', 14, 'active', NOW(), NOW()),
('En Ali Hassan', 14, 'active', NOW(), NOW()),
('En Ridwan', 14, 'active', NOW(), NOW()),

-- Company 15: Hotel & Homestay Management
('Tn Syurahbil', 15, 'active', NOW(), NOW()),
('En Fateh', 15, 'active', NOW(), NOW()),

-- Company 16: Travel & Tourism Services
('Tn Abbad', 16, 'active', NOW(), NOW()),
('En Ikrimah', 16, 'active', NOW(), NOW()),
('Pn Roqaiyah', 16, 'active', NOW(), NOW()),
('Cik Hafizah', 16, 'active', NOW(), NOW()),

-- Company 17: Housing Development Corp
('Tn Amin', 17, 'active', NOW(), NOW()),
('En Khalid', 17, 'active', NOW(), NOW()),

-- Company 18: Bakery & Confectioneries
('Tn Quddamah', 18, 'active', NOW(), NOW()),
('Cik Yati Salim', 18, 'active', NOW(), NOW()),

-- Company 19: Engineering Solutions
('En Abu Yusniza', 19, 'active', NOW(), NOW()),
('En Attirillah', 19, 'active', NOW(), NOW()),
('En Khairi Syafie', 19, 'active', NOW(), NOW()),

-- Company 20: Event Management Pro
('Cik Khaulah', 20, 'active', NOW(), NOW()),
('En Sayuti', 20, 'active', NOW(), NOW()),

-- Company 21: Fishery & Aquaculture
('En Hisham Hashim', 21, 'active', NOW(), NOW()),
('Tn Nik Ashaari', 21, 'active', NOW(), NOW()),

-- Company 22: Mart Retail Solutions
('En Nik Hishamuddin', 22, 'active', NOW(), NOW()),
('Cik Sofwah', 22, 'active', NOW(), NOW()),

-- Company 23: Fashion & Lifestyle
('Pn Mubarokah', 23, 'active', NOW(), NOW()),
('Cik Khaulah', 23, 'active', NOW(), NOW()),

-- Company 24: Management Services Group
('En Khushairi', 24, 'active', NOW(), NOW()),
('En Kamil', 24, 'active', NOW(), NOW()),
('Cik Sakinah', 24, 'active', NOW(), NOW()),

-- Company 25: Pertubuhan Kebajikan
('Pn Roqaiyah', 25, 'active', NOW(), NOW()),
('Cik Aziah', 25, 'active', NOW(), NOW()),
('Cik Nusaibah', 25, 'active', NOW(), NOW()),
('Hj Kuddus', 25, 'active', NOW(), NOW());

-- Insert plans for each company
INSERT INTO plans (title, status, deadline, company_id, created_at, updated_at) VALUES
-- Company 1: Insafora Ventures Sdn Bhd
('Restoran Luar Negara Expansion', 'planning', '2024-12-31', 1, NOW(), NOW()),
('Foodtruck Operations', 'in-progress', '2024-11-30', 1, NOW(), NOW()),

-- Company 2: Manufacturing Syarikat
('Kilang Roti & Mi Setup', 'completed', '2024-10-15', 2, NOW(), NOW()),
('Produk Retort Development', 'in-progress', '2024-11-20', 2, NOW(), NOW()),

-- Company 3: Fateh Livestock
('Ternakan Lembu Expansion', 'planning', '2024-12-01', 3, NOW(), NOW()),
('Produk Fateh Development', 'in-progress', '2024-10-30', 3, NOW(), NOW()),

-- Company 4: Agrotech Solutions
('Pertanian Fertigasi Moden', 'planning', '2024-12-15', 4, NOW(), NOW()),
('Greenhouse Setup', 'in-progress', '2024-11-15', 4, NOW(), NOW()),

-- Company 5: Import Export Supply Chain
('Import Bahan Mentah', 'completed', '2024-10-01', 5, NOW(), NOW()),
('Export Market Expansion', 'planning', '2024-12-20', 5, NOW(), NOW()),

-- Company 6: Equine Excellence
('Pemeliharaan Kuda', 'in-progress', '2024-11-10', 6, NOW(), NOW()),
('Latihan Kuda Program', 'planning', '2024-12-10', 6, NOW(), NOW()),

-- Company 7: Resolvia Training & Consultancy Sdn Bhd
('Training Programs', 'completed', '2024-09-30', 7, NOW(), NOW()),
('Motivasi Workshops', 'in-progress', '2024-11-25', 7, NOW(), NOW()),

-- Company 8: Construction & Renovation Pro
('Construction Projects', 'in-progress', '2024-12-05', 8, NOW(), NOW()),
('Interior Design Services', 'planning', '2024-11-30', 8, NOW(), NOW()),

-- Company 9: Safina Worldwide Sdn Bhd
('Marketing Campaign', 'in-progress', '2024-11-15', 9, NOW(), NOW()),
('Brand Expansion', 'planning', '2024-12-20', 9, NOW(), NOW()),

-- Company 10: Education & Human Development
('Tuition Programs', 'completed', '2024-09-30', 10, NOW(), NOW()),
('Taska Tadika Setup', 'planning', '2024-12-10', 10, NOW(), NOW()),

-- Company 11: Logistics & Transport Solutions
('Transportation Services', 'in-progress', '2024-11-20', 11, NOW(), NOW()),
('Vehicle Rental', 'planning', '2024-12-15', 11, NOW(), NOW()),

-- Company 12: IT & Multimedia Solutions
('IT Services Development', 'in-progress', '2024-11-25', 12, NOW(), NOW()),
('Nasyid & Lagu Production', 'planning', '2024-12-20', 12, NOW(), NOW()),

-- Company 13: Medical Services Group
('Klinik Setup', 'completed', '2024-09-30', 13, NOW(), NOW()),
('Confinement Centre', 'planning', '2024-12-10', 13, NOW(), NOW()),

-- Company 14: Wholesale & Retail Group
('Pasar Malam Operations', 'in-progress', '2024-11-15', 14, NOW(), NOW()),
('Gudang Borong Setup', 'planning', '2024-12-20', 14, NOW(), NOW()),

-- Company 15: Hotel & Homestay Management
('Hotel Operations', 'completed', '2024-09-30', 15, NOW(), NOW()),
('Homestay Services', 'in-progress', '2024-11-30', 15, NOW(), NOW()),

-- Company 16: Travel & Tourism Services
('Travel Packages', 'in-progress', '2024-11-20', 16, NOW(), NOW()),
('Tour Services', 'planning', '2024-12-15', 16, NOW(), NOW()),

-- Company 17: Housing Development Corp
('Projek Perumahan', 'in-progress', '2024-12-25', 17, NOW(), NOW()),
('Design Services', 'planning', '2024-11-30', 17, NOW(), NOW()),

-- Company 18: Bakery & Confectioneries
('Bakeri Operations', 'completed', '2024-09-30', 18, NOW(), NOW()),
('One Stop Centre', 'planning', '2024-12-10', 18, NOW(), NOW()),

-- Company 19: Engineering Solutions
('Oil & Gas Maintenance', 'in-progress', '2024-11-25', 19, NOW(), NOW()),
('Engineering Support', 'planning', '2024-12-20', 19, NOW(), NOW()),

-- Company 20: Event Management Pro
('Event Management', 'completed', '2024-09-30', 20, NOW(), NOW()),
('Konsert dan Persembahan', 'planning', '2024-12-15', 20, NOW(), NOW()),

-- Company 21: Fishery & Aquaculture
('Freshmart Operations', 'in-progress', '2024-11-20', 21, NOW(), NOW()),
('Aquaculture Development', 'planning', '2024-12-15', 21, NOW(), NOW()),

-- Company 22: Mart Retail Solutions
('Kedai Runcit Operations', 'completed', '2024-09-30', 22, NOW(), NOW()),
('Mart Expansion', 'planning', '2024-12-10', 22, NOW(), NOW()),

-- Company 23: Fashion & Lifestyle
('Jahitan Services', 'in-progress', '2024-11-25', 23, NOW(), NOW()),
('Butik Operations', 'planning', '2024-12-20', 23, NOW(), NOW()),

-- Company 24: Management Services Group
('Pengurusan Tenaga Kerja', 'in-progress', '2024-11-20', 24, NOW(), NOW()),
('Perkhidmatan Luar Negara', 'planning', '2024-12-15', 24, NOW(), NOW()),

-- Company 25: Pertubuhan Kebajikan
('Kebajikan Programs', 'completed', '2024-09-30', 25, NOW(), NOW()),
('Bantuan Kemanusiaan', 'planning', '2024-12-10', 25, NOW(), NOW());
