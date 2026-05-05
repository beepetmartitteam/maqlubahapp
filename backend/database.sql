-- Maqlubah Customer Management Database Schema
-- Create database if not exists
CREATE DATABASE IF NOT EXISTS maqlubah_db;

-- Use the database
USE maqlubah_db;

-- Users table for authentication
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    location VARCHAR(255),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    email_verified BOOLEAN DEFAULT FALSE,
    oauth_provider VARCHAR(50), -- 'local', 'google', 'facebook'
    oauth_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_oauth (oauth_provider, oauth_id)
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    birth_date DATE,
    address TEXT,
    phone VARCHAR(20),
    email VARCHAR(255),
    age VARCHAR(10),
    kerjaya TEXT,
    kerjasama TEXT,
    kehidupan_keluarga TEXT,
    notes TEXT,
    avatar_url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_id (user_id)
);

-- Customer notes table
CREATE TABLE IF NOT EXISTS customer_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    caption VARCHAR(500),
    note TEXT,
    images JSON, -- Store multiple image URLs as JSON array
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    INDEX idx_customer_id (customer_id)
);

-- Note images table (alternative approach for individual image records)
CREATE TABLE IF NOT EXISTS note_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    note_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    image_name VARCHAR(255),
    file_size INT,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (note_id) REFERENCES customer_notes(id) ON DELETE CASCADE,
    INDEX idx_note_id (note_id)
);

-- Sessions table for express-session
CREATE TABLE IF NOT EXISTS sessions (
    session_id VARCHAR(255) PRIMARY KEY,
    data TEXT,
    expires_at TIMESTAMP,
    INDEX idx_expires_at (expires_at)
);

-- OAuth user mapping table
CREATE TABLE IF NOT EXISTS oauth_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    provider VARCHAR(50) NOT NULL, -- 'google', 'facebook'
    provider_id VARCHAR(255) NOT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE KEY unique_provider_user (provider, provider_id),
    INDEX idx_provider (provider),
    INDEX idx_user_id (user_id)
);

-- Insert sample data for testing
INSERT INTO users (email, password, first_name, last_name, location, oauth_provider) VALUES 
('admin@maqlubah.com', '$2a$10$rK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8Qq', 'Admin', 'User', 'Medan', 'local'),
('customer1@example.com', '$2a$10$rK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8QqK8Qq', 'Darwis', 'Nurhadi', 'Medan', 'local');

INSERT INTO customers (user_id, name, location, birth_date, address, phone, email, age, kerjaya, kerjasama, kehidupan_keluarga, notes) VALUES
(1, 'DARWIS NURHADI', 'Medan', '1997-02-14', 'No. 18, Jalan Anggerik 3/2, Seksyen 3, 40000 Shah Alam, Selangor', '+601234567890', 'darwis@example.com', '27 tahun', 'Usahawan', 'Telah bekerjasama dalam pelbagai projek perniagaan dan pembangunan komuniti. Sangat komited dan profesional dalam semua urusan.', 'Berkeluarga bahagia dengan 3 orang anak. Sangat mementingkan masa berkualiti bersama keluarga dan keseimbangan hidup.', 'Catitan Pertemuan'),
(2, 'Tn SHukri Md Nor', 'Kuala Lumpur', '1985-06-15', 'Jalan Raja Chulan 1/2, 50200 Kuala Lumpur', '+601234567891', 'shukri@example.com', '38 tahun', 'Pengurus Syarikat', 'Pengalaman lebih 15 tahun dalam pengurusan syarikat teknologi.', 'Berkeluarga dengan 4 orang anak, mengutamakan pendidikan anak-anak.', 'Pelanggan setia sejak 2020');

INSERT INTO customer_notes (customer_id, caption, note, images) VALUES
(1, 'Pertemuan pertama', 'pertemuan di lakukan tertutup, turut hadir 10 orang, masing-masing memperkenalkan diri', '["http://localhost:5000/uploads/meeting1.jpg", "http://localhost:5000/uploads/meeting2.jpg"]'),
(1, 'Perbincangan projek', 'Membincangkan projek kerjasama untuk tahun depan dengan fokus pada teknologi hijau.', '["http://localhost:5000/uploads/project1.jpg"]'),
(2, 'Ulangtahun syarikat', 'Merayakan ulangtahun syarikat ke-25 dengan acara sukan dan aktiviti keluarga.', '["http://localhost:5000/uploads/anniversary1.jpg", "http://localhost:5000/uploads/anniversary2.jpg", "http://localhost:5000/uploads/anniversary3.jpg"]');
