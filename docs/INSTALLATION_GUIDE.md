# SAKIP Installation Guide

## Overview

Panduan instalasi lengkap untuk aplikasi SAKIP (Sistem Akuntabilitas Kinerja Instansi Pemerintah). Dokumen ini mencakup instalasi untuk development, staging, dan production environment.

## Table of Contents

1. [System Requirements](#system-requirements)
2. [Quick Start (Development)](#quick-start-development)
3. [Detailed Installation](#detailed-installation)
4. [Database Setup](#database-setup)
5. [Configuration](#configuration)
6. [Running the Application](#running-the-application)
7. [Production Deployment](#production-deployment)
8. [Docker Installation](#docker-installation)
9. [Troubleshooting](#troubleshooting)

## System Requirements

### Minimum Requirements

| Component | Requirement |
|-----------|-------------|
| **Operating System** | Ubuntu 20.04 LTS, CentOS 8, Windows 10, macOS 10.15+ |
| **Node.js** | 18.x or higher |
| **npm** | 8.x or higher |
| **PostgreSQL** | 14.x or higher |
| **Redis** | 6.x or higher |
| **Memory** | 4GB RAM |
| **Storage** | 20GB free space |
| **CPU** | 2 cores |

### Recommended Requirements

| Component | Requirement |
|-----------|-------------|
| **Operating System** | Ubuntu 22.04 LTS |
| **Node.js** | 18.18.0 LTS |
| **npm** | 9.x |
| **PostgreSQL** | 15.x |
| **Redis** | 7.x |
| **Memory** | 8GB RAM |
| **Storage** | 50GB SSD |
| **CPU** | 4 cores |

## Quick Start (Development)

### 1. Clone Repository

```bash
git clone https://github.com/your-org/sakip-app.git
cd sakip-app
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Environment

```bash
cp .env.example .env
# Edit .env file with your configuration
```

### 4. Setup Database

```bash
# Install PostgreSQL (Ubuntu/Debian)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createuser --interactive --pwprompt sakip_user
sudo -u postgres createdb -O sakip_user sakip_dev
```

### 5. Install Redis

```bash
# Ubuntu/Debian
sudo apt install redis-server

# Start Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

### 6. Run Application

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Detailed Installation

### Step 1: Install Node.js

#### Ubuntu/Debian

```bash
# Install Node.js 18.x
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version
npm --version
```

#### CentOS/RHEL

```bash
# Install Node.js 18.x
curl -fsSL https://rpm.nodesource.com/setup_18.x | sudo bash -
sudo yum install -y nodejs

# Verify installation
node --version
npm --version
```

#### Windows

1. Download Node.js installer from [nodejs.org](https://nodejs.org/)
2. Run the installer and follow the setup wizard
3. Verify installation in Command Prompt:
   ```cmd
   node --version
   npm --version
   ```

#### macOS

```bash
# Using Homebrew
brew install node@18

# Or download from nodejs.org
# Verify installation
node --version
npm --version
```

### Step 2: Install PostgreSQL

#### Ubuntu/Debian

```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Start and enable PostgreSQL
sudo systemctl start postgresql
sudo systemctl enable postgresql

# Verify installation
sudo -u postgres psql -c "SELECT version();"
```

#### CentOS/RHEL

```bash
# Install PostgreSQL 14
sudo yum install -y postgresql14-server postgresql14

# Initialize database
sudo /usr/pgsql-14/bin/postgresql-14-setup initdb

# Start and enable PostgreSQL
sudo systemctl start postgresql-14
sudo systemctl enable postgresql-14
```

#### Windows

1. Download PostgreSQL installer from [postgresql.org](https://www.postgresql.org/download/windows/)
2. Run installer and follow setup wizard
3. Remember the password for postgres user
4. Add PostgreSQL bin directory to PATH

#### macOS

```bash
# Using Homebrew
brew install postgresql@14

# Start PostgreSQL
brew services start postgresql@14
```

### Step 3: Install Redis

#### Ubuntu/Debian

```bash
# Install Redis
sudo apt install redis-server

# Configure Redis to start on boot
sudo systemctl enable redis-server

# Start Redis
sudo systemctl start redis-server

# Test Redis
redis-cli ping
```

#### CentOS/RHEL

```bash
# Install EPEL repository
sudo yum install epel-release

# Install Redis
sudo yum install redis

# Start and enable Redis
sudo systemctl start redis
sudo systemctl enable redis

# Test Redis
redis-cli ping
```

#### Windows

1. Download Redis for Windows from [GitHub releases](https://github.com/microsoftarchive/redis/releases)
2. Extract and run redis-server.exe
3. Or use Docker: `docker run -d -p 6379:6379 redis:alpine`

#### macOS

```bash
# Using Homebrew
brew install redis

# Start Redis
brew services start redis

# Test Redis
redis-cli ping
```

## Database Setup

### 1. Create Database User

```bash
# Switch to postgres user
sudo -u postgres psql

# Create user and database
CREATE USER sakip_user WITH PASSWORD 'your_secure_password';
CREATE DATABASE sakip_dev OWNER sakip_user;
GRANT ALL PRIVILEGES ON DATABASE sakip_dev TO sakip_user;

# Exit psql
\q
```

### 2. Configure PostgreSQL

Edit PostgreSQL configuration file:

```bash
# Ubuntu/Debian
sudo nano /etc/postgresql/14/main/postgresql.conf

# CentOS/RHEL
sudo nano /var/lib/pgsql/14/data/postgresql.conf
```

Update the following settings:

```conf
# Connection settings
listen_addresses = 'localhost'
port = 5432
max_connections = 100

# Memory settings
shared_buffers = 256MB
effective_cache_size = 1GB
work_mem = 4MB
maintenance_work_mem = 64MB

# Logging
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_min_duration_statement = 1000
```

Edit pg_hba.conf for authentication:

```bash
# Ubuntu/Debian
sudo nano /etc/postgresql/14/main/pg_hba.conf

# CentOS/RHEL
sudo nano /var/lib/pgsql/14/data/pg_hba.conf
```

Add or modify the following line:

```conf
# Local connections
local   all             sakip_user                              md5
host    all             sakip_user      127.0.0.1/32            md5
host    all             sakip_user      ::1/128                 md5
```

Restart PostgreSQL:

```bash
sudo systemctl restart postgresql
```

### 3. Test Database Connection

```bash
# Test connection
psql -h localhost -U sakip_user -d sakip_dev

# If successful, you should see:
# sakip_dev=>
```

## Configuration

### 1. Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Application
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=postgresql://sakip_user:your_secure_password@localhost:5432/sakip_dev

# Redis
REDIS_URL=redis://localhost:6379

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# External APIs (optional for development)
SIPD_API_URL=https://sipd-dev.kemendagri.go.id/api
SIPD_API_KEY=your-sipd-api-key
```

### 2. Generate Secure Secrets

Generate secure JWT secret:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Using OpenSSL
openssl rand -hex 64
```

### 3. Create Upload Directory

```bash
mkdir -p uploads
chmod 755 uploads
```

## Running the Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database Schema

If using Prisma (for backend):

```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed database with initial data
npx prisma db seed
```

If using custom SQL scripts:

```bash
# Run database initialization scripts
psql -h localhost -U sakip_user -d sakip_dev -f database/init.sql
psql -h localhost -U sakip_user -d sakip_dev -f database/seed.sql
```

### 3. Start Development Server

```bash
# Start frontend development server
npm run dev

# The application will be available at:
# http://localhost:3000
```

### 4. Start Backend Server (if separate)

```bash
# Navigate to backend directory
cd backend

# Install backend dependencies
npm install

# Start backend server
npm run dev

# Backend API will be available at:
# http://localhost:8000
```

## Production Deployment

### 1. Server Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y curl wget gnupg2 software-properties-common

# Install Node.js, PostgreSQL, Redis, Nginx
# (Follow installation steps above)

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Application Setup

```bash
# Create application user
sudo adduser --system --group --home /opt/sakip sakip

# Create application directory
sudo mkdir -p /opt/sakip/app
sudo chown -R sakip:sakip /opt/sakip

# Switch to sakip user
sudo -u sakip -i

# Clone repository
cd /opt/sakip
git clone https://github.com/your-org/sakip-app.git app
cd app

# Install dependencies
npm ci --only=production

# Setup production environment
cp .env.example .env.production
# Edit .env.production with production settings

# Build application
npm run build
```

### 3. Database Setup (Production)

```bash
# Create production database
sudo -u postgres createuser --interactive --pwprompt sakip_prod
sudo -u postgres createdb -O sakip_prod sakip_prod

# Run migrations
NODE_ENV=production npx prisma migrate deploy

# Seed production data (if needed)
NODE_ENV=production npx prisma db seed
```

### 4. Process Management

Create PM2 ecosystem file:

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'sakip-app',
    script: 'npm',
    args: 'start',
    cwd: '/opt/sakip/app',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/opt/sakip/logs/err.log',
    out_file: '/opt/sakip/logs/out.log',
    log_file: '/opt/sakip/logs/combined.log',
    time: true
  }]
};
```

Start application with PM2:

```bash
# Create logs directory
mkdir -p /opt/sakip/logs

# Start application
pm2 start ecosystem.config.js --env production

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
pm2 startup
# Follow the instructions provided by PM2
```

### 5. Reverse Proxy (Nginx)

Install and configure Nginx:

```bash
# Install Nginx
sudo apt install nginx

# Create Nginx configuration
sudo nano /etc/nginx/sites-available/sakip
```

Nginx configuration:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    # SSL Configuration (use Let's Encrypt)
    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Static files
    location /uploads/ {
        alias /opt/sakip/app/uploads/;
        expires 1d;
        add_header Cache-Control "public";
    }
}
```

Enable the site:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sakip /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 6. SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run

# Setup auto-renewal cron job
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

## Docker Installation

### 1. Install Docker

```bash
# Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

### 2. Docker Compose Setup

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://sakip:password@postgres:5432/sakip
      - REDIS_URL=redis://redis:6379
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=sakip
      - POSTGRES_USER=sakip
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["npm", "start"]
```

### 3. Run with Docker

```bash
# Build and start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

## Troubleshooting

### Common Issues

#### 1. Node.js Version Issues

```bash
# Check Node.js version
node --version

# If version is incorrect, install correct version
# Using nvm (Node Version Manager)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18
```

#### 2. Database Connection Issues

```bash
# Check PostgreSQL status
sudo systemctl status postgresql

# Check if PostgreSQL is listening
sudo netstat -tlnp | grep :5432

# Test connection
psql -h localhost -U sakip_user -d sakip_dev

# Check PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log
```

#### 3. Redis Connection Issues

```bash
# Check Redis status
sudo systemctl status redis-server

# Test Redis connection
redis-cli ping

# Check Redis logs
sudo tail -f /var/log/redis/redis-server.log
```

#### 4. Permission Issues

```bash
# Fix file permissions
sudo chown -R sakip:sakip /opt/sakip
chmod -R 755 /opt/sakip/app
chmod -R 777 /opt/sakip/app/uploads
```

#### 5. Port Already in Use

```bash
# Check what's using port 3000
sudo netstat -tlnp | grep :3000

# Kill process using port
sudo kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

#### 6. Memory Issues

```bash
# Check memory usage
free -h

# Check swap
swapon --show

# Add swap if needed
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Log Files

Check these log files for troubleshooting:

```bash
# Application logs
tail -f /opt/sakip/logs/combined.log

# PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql-14-main.log

# Redis logs
sudo tail -f /var/log/redis/redis-server.log

# Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# System logs
sudo journalctl -u postgresql -f
sudo journalctl -u redis-server -f
sudo journalctl -u nginx -f
```

### Performance Tuning

#### PostgreSQL Optimization

```sql
-- Check current settings
SHOW shared_buffers;
SHOW effective_cache_size;
SHOW work_mem;

-- Optimize for your system
-- Edit postgresql.conf
shared_buffers = 256MB          # 25% of RAM
effective_cache_size = 1GB      # 75% of RAM
work_mem = 4MB                  # RAM / max_connections / 4
maintenance_work_mem = 64MB     # RAM / 16
```

#### Redis Optimization

```bash
# Edit redis.conf
sudo nano /etc/redis/redis.conf

# Optimize settings
maxmemory 256mb
maxmemory-policy allkeys-lru
save 900 1
save 300 10
save 60 10000
```

### Getting Help

If you encounter issues not covered in this guide:

1. **Check the logs** - Most issues are logged
2. **Search GitHub Issues** - Someone might have faced the same issue
3. **Check documentation** - Review the user manual and API docs
4. **Contact support** - Email: support@sakip-app.com
5. **Community forum** - Join our discussion forum

### Useful Commands

```bash
# Check application status
pm2 status
pm2 logs sakip-app

# Restart application
pm2 restart sakip-app

# Monitor resources
htop
iotop
nethogs

# Check disk space
df -h
du -sh /opt/sakip

# Database maintenance
sudo -u postgres vacuumdb --all --analyze

# Backup database
pg_dump -h localhost -U sakip_user sakip_dev > backup.sql

# Restore database
psql -h localhost -U sakip_user sakip_dev < backup.sql
```

---

**© 2024 SAKIP Installation Guide**  
*For technical support: support@sakip-app.com*