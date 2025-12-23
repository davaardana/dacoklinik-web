# Inhouse Clinic Daco Jaya Medika

Aplikasi web fullstack untuk manajemen pencatatan medis karyawan dengan fitur lengkap.

## 🎯 Fitur Utama

### Authentication & User Management
- ✅ Login dengan JWT authentication
- ✅ Register user baru
- ✅ Change password
- ✅ Role-based access (admin/staff)

### Medical Records
- ✅ Input rekam medis karyawan
- ✅ CRUD rekam medis lengkap
- ✅ Search multi-field (nama, departemen, diagnosa, dll)
- ✅ Field opsional (tidak semua wajib diisi)

### Medicine Management
- ✅ CRUD data obat (nama, harga, stok, satuan)
- ✅ Search obat
- ✅ Tracking stok

### Analytics & Reporting
- ✅ Dashboard dengan summary cards
- ✅ Grafik vital signs (bar chart)
- ✅ Export laporan ke PDF
- ✅ Filter laporan (hari ini, tanggal, bulan, tahun)

### UI/UX
- ✅ Sidebar navigasi modern
- ✅ Responsive design
- ✅ Logo Daco Jaya Medika
- ✅ Medical theme (teal/blue)

## 🛠 Stack Teknologi

**Frontend:**
- React 19.2 + Vite 7.2
- React Router v7
- Axios (HTTP client)
- Recharts (analytics charts)
- jsPDF + jsPDF-AutoTable (PDF generation)

**Backend:**
- Node.js 20+ + Express 5
- PostgreSQL 17
- JWT Authentication (jsonwebtoken)
- bcrypt (password hashing)

## 📋 Prerequisites

### Option 1: Docker (Recommended)
- Docker Desktop
- Docker Compose

### Option 2: Manual Setup
- Node.js 20+ dan npm
- PostgreSQL 17+ (atau 14+)

## 🐳 Quick Start dengan Docker

1. Clone repository dan masuk ke folder:
```bash
cd daco
```

2. Copy environment file:
```bash
cp .env.example .env
```

3. Edit `.env` dan set password Anda:
```env
POSTGRES_PASSWORD=your_secure_password
JWT_SECRET=your_secret_key
```

4. Build dan jalankan semua services:
```bash
docker-compose up --build
```

5. Akses aplikasi:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

6. Login dengan credentials dari `backend/database/init.sql`

**Stop services:**
```bash
docker-compose down
```

**Stop dan hapus data:**
```bash
docker-compose down -v
```

## 🗄 Setup Database (Manual)

1. Buat database PostgreSQL:
```bash
# Set password environment variable
$env:PGPASSWORD='your_postgres_password'

# Buat database
psql -U postgres -c "CREATE DATABASE daco_clinic;"

# Jalankan init script
psql -U postgres -d daco_clinic -f backend/database/init.sql
```

2. Script `backend/database/init.sql` akan membuat:
   - Tabel `users` (username, password, role)
   - Tabel `medical_records` (data rekam medis lengkap)
   - Tabel `medicines` (data obat dan harga)
   - User default (cek init.sql untuk credentials)
   - Sample data untuk testing

## ⚙️ Setup Backend

1. Masuk ke folder backend:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy dan edit file `.env`:
```bash
cp .env.example .env
```

Edit `.env` dengan konfigurasi database Anda:
```env
PORT=5000
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/daco_clinic
PG_SSL=false
JWT_SECRET=your-secret-key-here
CLIENT_URL=http://localhost:5173
```

4. Jalankan server development:
```bash
npm run dev
```

Server akan berjalan di `http://localhost:5000`

## 💻 Setup Frontend

1. Masuk ke folder frontend:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. File `.env` sudah dikonfigurasi (optional edit):
```env
VITE_API_URL=http://localhost:5000/api
```

4. Jalankan development server:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## 🔑 Login Credentials

**Default Admin:**
- Check `backend/database/init.sql` for default credentials

**Register User Baru:**
- Klik tombol "Belum punya akun? Daftar disini" di halaman login

## 📱 Menu Aplikasi

1. **Dashboard** - Analytics dan summary rekam medis
2. **Input Rekam Medis** - Form tambah rekam medis baru
3. **Data Rekam Medis** - Lihat, edit, delete, search semua rekam medis
4. **Medicine** - Kelola data obat (nama, harga, stok)
5. **Report** - Export laporan PDF dengan filter tanggal
6. **Account** - Lihat info akun dan ubah password

## 🏗 Build untuk Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
cd frontend
npm run build
npm run preview  # untuk preview production build
```

File hasil build ada di `frontend/dist/`

## 📚 API Endpoints

### Authentication
- `POST /api/auth/login` - Login dengan username/password
- `POST /api/auth/register` - Register user baru
- `PUT /api/auth/change-password` - Ubah password

### Dashboard
- `GET /api/dashboard/summary` - Summary dan data chart (protected)

### Medical Records
- `GET /api/medical` - List semua rekam medis dengan search (protected)
- `POST /api/medical` - Buat rekam medis baru (protected)
- `PUT /api/medical/:id` - Update rekam medis (protected)
- `DELETE /api/medical/:id` - Hapus rekam medis (protected)

### Medicine
- `GET /api/medicine` - List obat dengan search (protected)
- `POST /api/medicine` - Tambah obat baru (protected)
- `PUT /api/medicine/:id` - Update obat (protected)
- `DELETE /api/medicine/:id` - Hapus obat (protected)

### Health Check
- `GET /api/health` - Check database connection

## 📁 Struktur Folder

```
daco/
├── backend/
│   ├── src/
│   │   ├── middleware/
│   │   │   └── auth.js          # JWT middleware
│   │   ├── routes/
│   │   │   ├── auth.js          # Auth routes (login, register, change password)
│   │   │   ├── dashboard.js     # Dashboard API
│   │   │   ├── medical.js       # Medical records CRUD
│   │   │   └── medicine.js      # Medicine CRUD
│   │   ├── db.js                # PostgreSQL connection
│   │   └── server.js            # Express server
│   ├── database/
│   │   └── init.sql             # Database init script
│   ├── .env                     # Environment variables
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.jsx      # Sidebar navigation
    │   │   ├── Layout.jsx       # App layout wrapper
    │   │   ├── ProtectedRoute.jsx  # Auth guard
    │   │   └── SummaryCard.jsx  # Dashboard card
    │   ├── pages/
    │   │   ├── Login.jsx        # Login + Register page
    │   │   ├── Dashboard.jsx    # Dashboard analytics
    │   │   ├── MedicalForm.jsx  # Input rekam medis
    │   │   ├── MedicalRecordsList.jsx  # Data rekam medis (CRUD + search)
    │   │   ├── Medicine.jsx     # Medicine management
    │   │   ├── Report.jsx       # Export PDF laporan
    │   │   └── Account.jsx      # User profile & change password
    │   ├── services/
    │   │   └── api.js           # Axios config & endpoints
    │   ├── App.jsx              # Router config
    │   ├── main.jsx             # Entry point
    │   └── index.css            # Global styles
    ├── public/
    │   └── logo_daco.png        # Daco logo PNG
    ├── .env                     # Frontend env vars
    └── package.json
```

## 🔧 Troubleshooting

**Database connection error:**
- Pastikan PostgreSQL running
- Check credentials di `.env`
- Pastikan database `daco_clinic` sudah dibuat

**CORS error:**
- Pastikan `CLIENT_URL` di backend `.env` sesuai dengan frontend URL
- Check backend console untuk allowed origins

**JWT expired:**
- Token valid 1 hari, logout dan login ulang

**PDF tidak ter-generate:**
- Pastikan jspdf dan jspdf-autotable terinstall
- Check browser console untuk error

## 💡 Development Notes

- Backend menggunakan CommonJS (`require`)
- Frontend menggunakan ES Modules (`import`)
- Medical form fields: hanya `patient_name` dan `department` yang wajib
- Search di Medicine dan Medical Records: mencari di semua field
- PDF report: bisa filter by today, date, month, atau year

## 📄 License

Aplikasi internal untuk Daco Jaya Medika.
- Password di-hash dengan bcrypt (salt rounds: 10)
- Protected routes check JWT di header `Authorization: Bearer <token>`

## License

Internal use only - Daco Jaya Medika
