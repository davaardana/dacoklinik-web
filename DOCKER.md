# Docker Deployment Guide

## 🐳 Quick Start

### Prerequisites
- Docker Desktop installed and running
- Git (for cloning repository)

### 1. Clone Repository
```bash
git clone https://github.com/YOUR_USERNAME/dacoklinik-web.git
cd dacoklinik-web
```

### 2. Configure Environment
```bash
# Copy example env file
cp .env.example .env

# Edit .env and set your passwords
# POSTGRES_PASSWORD=your_secure_password
# JWT_SECRET=your_secret_key
```

### 3. Start Application
```bash
docker-compose up -d
```

### 4. Access Application
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Database**: localhost:5433

### 5. Login
Check `backend/database/init.sql` for default credentials

## 📊 Container Management

### View Running Containers
```bash
docker-compose ps
```

### View Logs
```bash
# All containers
docker-compose logs -f

# Specific container
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f postgres
```

### Stop Containers
```bash
docker-compose stop
```

### Restart Containers
```bash
docker-compose restart
```

### Stop and Remove Containers
```bash
docker-compose down
```

### Stop and Remove Everything (including data)
```bash
docker-compose down -v
```

## 🔧 Troubleshooting

### Port Already in Use
If port 3000, 5000, or 5433 is already in use, edit `docker-compose.yml`:
```yaml
ports:
  - "YOUR_PORT:80"  # Frontend
  - "YOUR_PORT:5000"  # Backend
  - "YOUR_PORT:5432"  # Database
```

### Database Connection Issues
1. Check if PostgreSQL container is healthy:
```bash
docker-compose ps
```

2. View database logs:
```bash
docker-compose logs postgres
```

### Rebuild After Code Changes
```bash
docker-compose down
docker-compose up --build -d
```

## 📦 Production Deployment

### Build Production Images
```bash
docker-compose build --no-cache
```

### Run in Production Mode
1. Update `.env` with production values
2. Change JWT_SECRET to a strong random key
3. Update DATABASE_URL with production credentials
4. Run:
```bash
docker-compose up -d
```

### Backup Database
```bash
docker exec daco-postgres pg_dump -U postgres daco_clinic > backup.sql
```

### Restore Database
```bash
docker exec -i daco-postgres psql -U postgres daco_clinic < backup.sql
```

## 🔒 Security Notes

- Never commit `.env` files
- Change default credentials in production
- Use strong passwords for database
- Use HTTPS in production
- Keep Docker images updated

## 📝 Architecture

```
┌─────────────────────────────────────────┐
│          Nginx (Frontend)               │
│         Port 3000 → 80                  │
└──────────────┬──────────────────────────┘
               │
               │ /api proxy
               ▼
┌─────────────────────────────────────────┐
│      Express Backend (Node.js)          │
│            Port 5000                     │
└──────────────┬──────────────────────────┘
               │
               │ PostgreSQL connection
               ▼
┌─────────────────────────────────────────┐
│      PostgreSQL Database                │
│         Port 5433 → 5432                │
│       Volume: postgres_data             │
└─────────────────────────────────────────┘
```

## 🔄 Update Application

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose up --build -d
```

## 📊 Monitoring

### Check Resource Usage
```bash
docker stats
```

### Check Container Health
```bash
docker-compose ps
```

### Access Container Shell
```bash
# Backend
docker exec -it daco-backend sh

# Frontend  
docker exec -it daco-frontend sh

# Database
docker exec -it daco-postgres psql -U postgres -d daco_clinic
```
