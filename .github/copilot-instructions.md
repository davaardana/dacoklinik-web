<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Inhouse Clinic Daco Jaya Medika - Project Documentation

## Project Overview
Fullstack web application untuk manajemen pencatatan medis karyawan dengan fitur CRUD lengkap, analytics, dan reporting.

## Tech Stack
- **Frontend**: React 19.2 + Vite 7.2, React Router v7, Axios, Recharts, jsPDF
- **Backend**: Node.js 20+ + Express 5, JWT Auth, bcrypt
- **Database**: PostgreSQL 17

## Completed Features
✅ Sidebar navigation dengan 6 menu items
✅ Authentication (login, register, change password)
✅ Dashboard dengan analytics charts
✅ Medical Records CRUD dengan search semua field
✅ Medicine Management CRUD dengan search
✅ PDF Report generation dengan date filters
✅ Account management page
✅ Logo PNG integration
✅ Responsive design dengan medical theme

## Database Schema
- `users`: id, username, password (bcrypt), role, created_at
- `medical_records`: 14 columns (patient info, vital signs, diagnosis, therapy, examiner)
- `medicines`: id, name, price, stock, unit, description, created_at

## API Endpoints
### Auth
- POST /api/auth/login
- POST /api/auth/register  
- PUT /api/auth/change-password

### Medical Records
- GET /api/medical (with search query param)
- POST /api/medical
- PUT /api/medical/:id
- DELETE /api/medical/:id

### Medicine
- GET /api/medicine (with search)
- POST /api/medicine
- PUT /api/medicine/:id
- DELETE /api/medicine/:id

### Dashboard
- GET /api/dashboard/summary

## Running the Application
1. Backend: `cd backend && npm run dev` (port 5000)
2. Frontend: `cd frontend && npm run dev` (port 5173)
3. Login: admin / admin123

## Key Files
- Frontend routes: `frontend/src/App.jsx`
- Sidebar: `frontend/src/components/Sidebar.jsx`
- Backend server: `backend/src/server.js`
- Database init: `backend/database/init.sql`

## Development Guidelines
- Backend uses CommonJS (require)
- Frontend uses ES Modules (import)
- Medical form: only patient_name and department are required
- All search features: search across all relevant fields
- Logo: use `/logo_daco.png` for PNG format
