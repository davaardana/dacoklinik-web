-- Create database if it doesn't exist
-- This script is run by Docker's docker-entrypoint-initdb.d
-- Database is already created by POSTGRES_DB env var

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Medical records table
CREATE TABLE IF NOT EXISTS medical_records (
  id SERIAL PRIMARY KEY,
  patient_name VARCHAR(255) NOT NULL,
  birth_place VARCHAR(255),
  birth_date DATE,
  department VARCHAR(255) NOT NULL,
  pic VARCHAR(255),
  medical_history TEXT,
  subjective TEXT,
  blood_pressure VARCHAR(50),
  spo2 VARCHAR(50),
  pulse VARCHAR(50),
  respiration VARCHAR(50),
  therapy TEXT,
  examiner VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default user (password: admin123)
-- Generated using bcrypt with salt rounds 10
INSERT INTO users (username, password, role) 
VALUES ('admin', '$2b$10$rGfHXHZK8bVvLHcqV3yK3OYx.vxNW6rXZPyJZUqF3yC4Jz/iqGKDa', 'admin')
ON CONFLICT (username) DO NOTHING;

-- Insert sample medical records for testing
INSERT INTO medical_records (
  patient_name, birth_place, birth_date, department, pic, 
  medical_history, subjective, blood_pressure, spo2, pulse, 
  respiration, therapy, examiner
) VALUES 
  ('Budi Santoso', 'Jakarta', '1985-06-15', 'Produksi', 'Pak Hendra', 
   'Hipertensi', 'Pusing, lemas', '140/90', '97', '85', '20', 
   'Obat antihipertensi, istirahat', 'admin'),
  ('Siti Nurhaliza', 'Bandung', '1990-03-22', 'Marketing', 'Bu Rina', 
   'Tidak ada', 'Demam ringan', '120/80', '98', '78', '18', 
   'Paracetamol 500mg', 'admin'),
  ('Ahmad Fauzi', 'Surabaya', '1988-11-10', 'IT', 'Pak Joko', 
   'Asma', 'Sesak napas ringan', '130/85', '96', '88', '22', 
   'Inhaler, monitoring', 'admin');

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_medical_records_created_at ON medical_records(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_medical_records_patient_name ON medical_records(patient_name);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Medicines table
CREATE TABLE IF NOT EXISTS medicines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  stock INTEGER DEFAULT 0,
  unit VARCHAR(50) DEFAULT 'pcs',
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert sample medicines for testing
INSERT INTO medicines (name, price, stock, unit, description) VALUES 
  ('Paracetamol 500mg', 2000, 100, 'strip', 'Obat penurun panas dan pereda nyeri'),
  ('Amoxicillin 500mg', 5000, 50, 'strip', 'Antibiotik untuk infeksi bakteri'),
  ('Vitamin C 1000mg', 3000, 75, 'botol', 'Suplemen vitamin C'),
  ('Betadine Solution', 15000, 30, 'botol', 'Antiseptik untuk luka luar')
ON CONFLICT DO NOTHING;

CREATE INDEX IF NOT EXISTS idx_medicines_name ON medicines(name);

