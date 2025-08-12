# SAKIP Deployment Guide

## Overview

Panduan ini menjelaskan cara deploy aplikasi SAKIP ke berbagai environment mulai dari development, staging, hingga production. Aplikasi SAKIP terdiri dari frontend (React) dan backend (Node.js) yang dapat di-deploy secara terpisah atau bersamaan.

## Prerequisites

### System Requirements

#### Minimum Requirements
- **CPU**: 2 cores
- **RAM**: 4GB
- **Storage**: 50GB SSD
- **OS**: Ubuntu 20.04 LTS atau CentOS 8

#### Recommended Requirements
- **CPU**: 4 cores
- **RAM**: 8GB
- **Storage**: 100GB SSD
- **OS**: Ubuntu 22.04 LTS

#### Software Dependencies
- **Node.js**: 18.x atau lebih baru
- **PostgreSQL**: 14.x atau lebih baru
- **Redis**: 6.x atau lebih baru
- **Nginx**: 1.18 atau lebih baru
- **PM2**: Latest version
- **Docker**: 20.x (opsional)

## Environment Setup

### 1. Development Environment

#### Setup Local Development

```bash
# Clone repository
git clone https://github.com/your-org/sakip-app.git
cd sakip-app

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env file sesuai konfigurasi lokal

# Install PostgreSQL (Ubuntu)
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createuser --interactive --pwprompt sakip_user
sudo -u postgres createdb -O sakip_user sakip_dev

# Install Redis
sudo apt install redis-server

# Start development server
npm run dev
```

#### Environment Variables (.env.development)

```env
# Application
NODE_ENV=development
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=SAKIP Development

# Database (Backend)
DATABASE_URL=postgresql://sakip_user:password@localhost:5432/sakip_dev
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=24h

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# External APIs (Development)
SIPD_API_URL=https://sipd-dev.kemendagri.go.id/api
SIPD_API_KEY=dev-api-key
```

### 2. Staging Environment

#### Server Setup (Ubuntu 22.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL 14
sudo apt install postgresql-14 postgresql-contrib-14

# Install Redis
sudo apt install redis-server

# Install Nginx
sudo apt install nginx

# Install PM2 globally
sudo npm install -g pm2

# Create application user
sudo adduser --system --group --home /opt/sakip sakip
sudo mkdir -p /opt/sakip/app
sudo chown -R sakip:sakip /opt/sakip
```

#### Database Setup

```bash
# Switch to postgres user
sudo -u postgres psql

-- Create database and user
CREATE USER sakip_staging WITH PASSWORD 'secure_staging_password';
CREATE DATABASE sakip_staging OWNER sakip_staging;
GRANT ALL PRIVILEGES ON DATABASE sakip_staging TO sakip_staging;
\q

# Test connection
psql -h localhost -U sakip_staging -d sakip_staging
```

#### Application Deployment

```bash
# Switch to sakip user
sudo -u sakip -i

# Clone repository
cd /opt/sakip
git clone https://github.com/your-org/sakip-app.git app
cd app

# Install dependencies
npm ci --only=production

# Setup environment
cp .env.staging .env
# Edit .env with staging configurations

# Build frontend
npm run build

# Setup database (if using Prisma)
npx prisma migrate deploy
npx prisma db seed

# Start with PM2
pm2 start ecosystem.config.js --env staging
pm2 save
pm2 startup
```

#### Nginx Configuration

```nginx
# /etc/nginx/sites-available/sakip-staging
server {
    listen 80;
    server_name staging.sakip.pemda.go.id;
    
    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name staging.sakip.pemda.go.id;
    
    # SSL Configuration
    ssl_certificate /etc/ssl/certs/sakip-staging.crt;
    ssl_certificate_key /etc/ssl/private/sakip-staging.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
    
    # Frontend (React build)
    location / {
        root /opt/sakip/app/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://localhost:8000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeout settings
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
    
    # File uploads
    location /uploads/ {
        alias /opt/sakip/app/uploads/;
        expires 1d;
        add_header Cache-Control "public";
    }
    
    # Health check
    location /health {
        proxy_pass http://localhost:8000/health;
        access_log off;
    }
}
```

#### Enable Nginx Site

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/sakip-staging /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx

# Enable auto-start
sudo systemctl enable nginx
```

### 3. Production Environment

#### High Availability Setup

```
┌─────────────────┐    ┌─────────��───────┐
│   Load Balancer │    │   Load Balancer │
│   (HAProxy)     │    │   (HAProxy)     │
│   Primary       │    │   Backup        │
└─────────────────┘    └─────────────────┘
         │                       │
         └───────────┬───────────┘
                     │
    ┌────────────────┼────────────────┐
    │                │                │
┌───▼───┐       ┌────▼───┐       ┌───▼───┐
│ Web 1 │       │ Web 2  │       │ Web 3 │
│Nginx  │       │Nginx   │       │Nginx  │
│Node.js│       │Node.js │       │Node.js│
└───────┘       └────────┘       └───────┘
    │                │                │
    └���───────────────┼────────────────┘
                     │
┌────────────────────▼────────────────────┐
│           Database Cluster              │
│  ┌─────────────┐    ┌─────────────┐    │
│  │PostgreSQL   │    │PostgreSQL   │    │
│  │Primary      │◄──►│Replica      │    │
│  └─────────────┘    └─────────────┘    │
└─────────────────────────────────────────┘
```

#### Production Server Setup

```bash
# Setup multiple servers (repeat for each server)
# Server 1: 10.0.1.10 (Primary)
# Server 2: 10.0.1.11 (Secondary)
# Server 3: 10.0.1.12 (Tertiary)

# On each server, run basic setup
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs nginx redis-server
sudo npm install -g pm2

# Create sakip user
sudo adduser --system --group --home /opt/sakip sakip
```

#### Database Cluster Setup

##### Primary Database Server

```bash
# Install PostgreSQL 14
sudo apt install postgresql-14 postgresql-contrib-14

# Configure PostgreSQL for replication
sudo -u postgres psql
```

```sql
-- Create replication user
CREATE USER replicator WITH REPLICATION ENCRYPTED PASSWORD 'replication_password';

-- Create application database
CREATE USER sakip_prod WITH PASSWORD 'production_password';
CREATE DATABASE sakip_prod OWNER sakip_prod;
GRANT ALL PRIVILEGES ON DATABASE sakip_prod TO sakip_prod;
```

##### PostgreSQL Configuration (Primary)

```bash
# Edit postgresql.conf
sudo nano /etc/postgresql/14/main/postgresql.conf
```

```conf
# Connection settings
listen_addresses = '*'
port = 5432
max_connections = 200

# Memory settings
shared_buffers = 2GB
effective_cache_size = 6GB
work_mem = 16MB
maintenance_work_mem = 512MB

# WAL settings for replication
wal_level = replica
max_wal_senders = 3
max_replication_slots = 3
wal_keep_size = 1GB

# Logging
log_destination = 'stderr'
logging_collector = on
log_directory = 'log'
log_filename = 'postgresql-%Y-%m-%d_%H%M%S.log'
log_min_duration_statement = 1000
```

```bash
# Edit pg_hba.conf
sudo nano /etc/postgresql/14/main/pg_hba.conf
```

```conf
# Add replication access
host replication replicator 10.0.1.0/24 md5

# Application access
host sakip_prod sakip_prod 10.0.1.0/24 md5
```

##### Replica Database Server

```bash
# Stop PostgreSQL
sudo systemctl stop postgresql

# Remove existing data
sudo rm -rf /var/lib/postgresql/14/main/*

# Create base backup from primary
sudo -u postgres pg_basebackup -h 10.0.1.10 -D /var/lib/postgresql/14/main -U replicator -P -v -R -W

# Start PostgreSQL
sudo systemctl start postgresql
```

#### Application Deployment (Production)

```bash
# On each application server
sudo -u sakip -i
cd /opt/sakip

# Clone and setup
git clone https://github.com/your-org/sakip-app.git app
cd app

# Install dependencies
npm ci --only=production

# Setup production environment
cp .env.production .env
```

#### Production Environment Variables

```env
# Application
NODE_ENV=production
PORT=8000
VITE_API_URL=https://api.sakip.pemda.go.id/v1
VITE_APP_NAME=SAKIP Production

# Database (Primary)
DATABASE_URL=postgresql://sakip_prod:production_password@10.0.1.10:5432/sakip_prod
DATABASE_REPLICA_URL=postgresql://sakip_prod:production_password@10.0.1.11:5432/sakip_prod

# Redis Cluster
REDIS_URL=redis://10.0.1.10:6379
REDIS_CLUSTER_NODES=10.0.1.10:6379,10.0.1.11:6379,10.0.1.12:6379

# Security
JWT_SECRET=super-secure-production-jwt-secret-key-256-bit
JWT_EXPIRES_IN=8h
BCRYPT_ROUNDS=12

# File Storage
UPLOAD_PATH=/opt/sakip/uploads
MAX_FILE_SIZE=10485760
FILE_STORAGE_TYPE=s3
AWS_S3_BUCKET=sakip-prod-files
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key

# External APIs (Production)
SIPD_API_URL=https://sipd.kemendagri.go.id/api
SIPD_API_KEY=production-api-key
BKN_API_URL=https://api.bkn.go.id
BKN_API_KEY=production-bkn-key

# Monitoring
LOG_LEVEL=warn
SENTRY_DSN=https://your-sentry-dsn
ENABLE_METRICS=true

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=noreply@sakip.pemda.go.id
SMTP_PASS=app-specific-password

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### PM2 Ecosystem Configuration

```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'sakip-backend',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_staging: {
      NODE_ENV: 'staging',
      PORT: 8000
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8000
    },
    // Logging
    error_file: '/opt/sakip/logs/err.log',
    out_file: '/opt/sakip/logs/out.log',
    log_file: '/opt/sakip/logs/combined.log',
    time: true,
    
    // Process management
    max_memory_restart: '1G',
    restart_delay: 4000,
    max_restarts: 10,
    min_uptime: '10s',
    
    // Health monitoring
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true
  }],
  
  deploy: {
    production: {
      user: 'sakip',
      host: ['10.0.1.10', '10.0.1.11', '10.0.1.12'],
      ref: 'origin/main',
      repo: 'git@github.com:your-org/sakip-app.git',
      path: '/opt/sakip/app',
      'pre-deploy-local': '',
      'post-deploy': 'npm ci --only=production && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': ''
    }
  }
};
```

#### Load Balancer Configuration (HAProxy)

```bash
# Install HAProxy
sudo apt install haproxy

# Configure HAProxy
sudo nano /etc/haproxy/haproxy.cfg
```

```conf
global
    daemon
    chroot /var/lib/haproxy
    stats socket /run/haproxy/admin.sock mode 660 level admin
    stats timeout 30s
    user haproxy
    group haproxy

defaults
    mode http
    timeout connect 5000ms
    timeout client 50000ms
    timeout server 50000ms
    option httplog
    option dontlognull
    option redispatch
    retries 3

# Frontend configuration
frontend sakip_frontend
    bind *:80
    bind *:443 ssl crt /etc/ssl/certs/sakip.pem
    redirect scheme https if !{ ssl_fc }
    
    # Security headers
    http-response set-header X-Frame-Options SAMEORIGIN
    http-response set-header X-Content-Type-Options nosniff
    http-response set-header X-XSS-Protection "1; mode=block"
    
    # Route to backend
    default_backend sakip_backend

# Backend configuration
backend sakip_backend
    balance roundrobin
    option httpchk GET /health
    http-check expect status 200
    
    # Application servers
    server web1 10.0.1.10:8000 check inter 5s fall 3 rise 2
    server web2 10.0.1.11:8000 check inter 5s fall 3 rise 2
    server web3 10.0.1.12:8000 check inter 5s fall 3 rise 2

# Statistics page
listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 30s
    stats admin if TRUE
```

## Docker Deployment

### Docker Compose Setup

#### docker-compose.production.yml

```yaml
version: '3.8'

services:
  # Frontend (Nginx + React build)
  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
      - ./ssl:/etc/nginx/ssl:ro
      - uploads:/app/uploads
    depends_on:
      - backend
    restart: unless-stopped

  # Backend (Node.js API)
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://sakip_prod:${DB_PASSWORD}@postgres:5432/sakip_prod
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    volumes:
      - uploads:/app/uploads
    depends_on:
      - postgres
      - redis
    restart: unless-stopped
    deploy:
      replicas: 3

  # Database
  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=sakip_prod
      - POSTGRES_USER=sakip_prod
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql:ro
    restart: unless-stopped
    deploy:
      resources:
        limits:
          memory: 2G
        reservations:
          memory: 1G

  # Redis
  redis:
    image: redis:6-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    restart: unless-stopped

  # File Storage (MinIO)
  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=${MINIO_ACCESS_KEY}
      - MINIO_ROOT_PASSWORD=${MINIO_SECRET_KEY}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    restart: unless-stopped

  # Monitoring (Prometheus)
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./prometheus.yml:/etc/prometheus/prometheus.yml:ro
      - prometheus_data:/prometheus
    restart: unless-stopped

  # Monitoring (Grafana)
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=${GRAFANA_PASSWORD}
    volumes:
      - grafana_data:/var/lib/grafana
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
  minio_data:
  prometheus_data:
  grafana_data:
  uploads:

networks:
  default:
    driver: bridge
```

#### Dockerfile.frontend

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/health || exit 1

EXPOSE 80 443

CMD ["nginx", "-g", "daemon off;"]
```

#### Dockerfile.backend

```dockerfile
FROM node:18-alpine

# Install system dependencies
RUN apk add --no-cache curl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build application
RUN npm run build

# Create uploads directory
RUN mkdir -p uploads

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

EXPOSE 8000

# Start application
CMD ["npm", "start"]
```

### Deploy with Docker

```bash
# Create environment file
cp .env.production .env

# Build and start services
docker-compose -f docker-compose.production.yml up -d

# Check status
docker-compose -f docker-compose.production.yml ps

# View logs
docker-compose -f docker-compose.production.yml logs -f backend

# Scale backend services
docker-compose -f docker-compose.production.yml up -d --scale backend=3
```

## Kubernetes Deployment

### Kubernetes Manifests

#### namespace.yaml

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: sakip-production
```

#### configmap.yaml

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: sakip-config
  namespace: sakip-production
data:
  NODE_ENV: "production"
  PORT: "8000"
  LOG_LEVEL: "info"
  REDIS_URL: "redis://redis-service:6379"
```

#### secret.yaml

```yaml
apiVersion: v1
kind: Secret
metadata:
  name: sakip-secrets
  namespace: sakip-production
type: Opaque
data:
  DATABASE_URL: <base64-encoded-database-url>
  JWT_SECRET: <base64-encoded-jwt-secret>
  SIPD_API_KEY: <base64-encoded-api-key>
```

#### deployment.yaml

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: sakip-backend
  namespace: sakip-production
spec:
  replicas: 3
  selector:
    matchLabels:
      app: sakip-backend
  template:
    metadata:
      labels:
        app: sakip-backend
    spec:
      containers:
      - name: backend
        image: sakip/backend:latest
        ports:
        - containerPort: 8000
        envFrom:
        - configMapRef:
            name: sakip-config
        - secretRef:
            name: sakip-secrets
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### service.yaml

```yaml
apiVersion: v1
kind: Service
metadata:
  name: sakip-backend-service
  namespace: sakip-production
spec:
  selector:
    app: sakip-backend
  ports:
  - protocol: TCP
    port: 80
    targetPort: 8000
  type: ClusterIP
```

#### ingress.yaml

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: sakip-ingress
  namespace: sakip-production
  annotations:
    kubernetes.io/ingress.class: nginx
    cert-manager.io/cluster-issuer: letsencrypt-prod
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
spec:
  tls:
  - hosts:
    - sakip.pemda.go.id
    secretName: sakip-tls
  rules:
  - host: sakip.pemda.go.id
    http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: sakip-backend-service
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: sakip-frontend-service
            port:
              number: 80
```

### Deploy to Kubernetes

```bash
# Apply manifests
kubectl apply -f k8s/

# Check deployment status
kubectl get pods -n sakip-production

# Check logs
kubectl logs -f deployment/sakip-backend -n sakip-production

# Scale deployment
kubectl scale deployment sakip-backend --replicas=5 -n sakip-production
```

## Monitoring and Logging

### Application Monitoring

#### Prometheus Configuration

```yaml
# prometheus.yml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'sakip-backend'
    static_configs:
      - targets: ['localhost:8000']
    metrics_path: '/metrics'
    scrape_interval: 5s

  - job_name: 'postgres'
    static_configs:
      - targets: ['localhost:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['localhost:9121']

  - job_name: 'nginx'
    static_configs:
      - targets: ['localhost:9113']
```

#### Grafana Dashboard

```json
{
  "dashboard": {
    "title": "SAKIP Application Metrics",
    "panels": [
      {
        "title": "HTTP Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "rate(http_requests_total[5m])",
            "legendFormat": "{{method}} {{route}}"
          }
        ]
      },
      {
        "title": "Response Time",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.95, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "95th percentile"
          }
        ]
      },
      {
        "title": "Database Connections",
        "type": "singlestat",
        "targets": [
          {
            "expr": "pg_stat_database_numbackends{datname=\"sakip_prod\"}"
          }
        ]
      }
    ]
  }
}
```

### Centralized Logging

#### ELK Stack Configuration

```yaml
# docker-compose.logging.yml
version: '3.8'

services:
  elasticsearch:
    image: docker.elastic.co/elasticsearch/elasticsearch:7.15.0
    environment:
      - discovery.type=single-node
      - "ES_JAVA_OPTS=-Xms512m -Xmx512m"
    volumes:
      - elasticsearch_data:/usr/share/elasticsearch/data
    ports:
      - "9200:9200"

  logstash:
    image: docker.elastic.co/logstash/logstash:7.15.0
    volumes:
      - ./logstash.conf:/usr/share/logstash/pipeline/logstash.conf:ro
    ports:
      - "5044:5044"
    depends_on:
      - elasticsearch

  kibana:
    image: docker.elastic.co/kibana/kibana:7.15.0
    ports:
      - "5601:5601"
    environment:
      - ELASTICSEARCH_HOSTS=http://elasticsearch:9200
    depends_on:
      - elasticsearch

volumes:
  elasticsearch_data:
```

## Backup and Recovery

### Database Backup

#### Automated Backup Script

```bash
#!/bin/bash
# backup.sh

# Configuration
DB_HOST="localhost"
DB_NAME="sakip_prod"
DB_USER="sakip_prod"
BACKUP_DIR="/opt/backups/database"
RETENTION_DAYS=30

# Create backup directory
mkdir -p $BACKUP_DIR

# Generate backup filename
BACKUP_FILE="$BACKUP_DIR/sakip_backup_$(date +%Y%m%d_%H%M%S).sql"

# Create database backup
pg_dump -h $DB_HOST -U $DB_USER -d $DB_NAME > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Upload to cloud storage (optional)
aws s3 cp $BACKUP_FILE.gz s3://sakip-backups/database/

# Clean old backups
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete

echo "Backup completed: $BACKUP_FILE.gz"
```

#### Cron Job Setup

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * /opt/scripts/backup.sh >> /var/log/sakip-backup.log 2>&1

# Weekly full backup at Sunday 1 AM
0 1 * * 0 /opt/scripts/full-backup.sh >> /var/log/sakip-backup.log 2>&1
```

### Application Files Backup

```bash
#!/bin/bash
# file-backup.sh

UPLOAD_DIR="/opt/sakip/uploads"
BACKUP_DIR="/opt/backups/files"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup
tar -czf $BACKUP_DIR/files_backup_$DATE.tar.gz -C $UPLOAD_DIR .

# Upload to cloud
aws s3 cp $BACKUP_DIR/files_backup_$DATE.tar.gz s3://sakip-backups/files/

# Clean old backups
find $BACKUP_DIR -name "files_backup_*.tar.gz" -mtime +7 -delete
```

### Disaster Recovery

#### Recovery Procedures

```bash
# 1. Database Recovery
# Stop application
pm2 stop sakip-backend

# Restore database
gunzip -c backup_file.sql.gz | psql -h localhost -U sakip_prod -d sakip_prod

# 2. File Recovery
# Extract files
tar -xzf files_backup.tar.gz -C /opt/sakip/uploads/

# 3. Restart application
pm2 start sakip-backend

# 4. Verify recovery
curl -f http://localhost:8000/health
```

## Security Hardening

### SSL/TLS Configuration

#### Let's Encrypt Setup

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Generate certificate
sudo certbot --nginx -d sakip.pemda.go.id -d api.sakip.pemda.go.id

# Auto-renewal
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

### Firewall Configuration

```bash
# UFW setup
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH
sudo ufw allow ssh

# Allow HTTP/HTTPS
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Allow database (only from app servers)
sudo ufw allow from 10.0.1.0/24 to any port 5432

# Enable firewall
sudo ufw enable
```

### Security Headers

```nginx
# Additional security headers in Nginx
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https:; media-src 'self'; object-src 'none'; child-src 'none'; worker-src 'none'; frame-ancestors 'none'; form-action 'self'; base-uri 'self';" always;
```

## Performance Optimization

### Database Optimization

```sql
-- Create indexes for better performance
CREATE INDEX CONCURRENTLY idx_performance_achievements_indicator_period 
ON performance_achievements(indicator_id, year, quarter, month);

CREATE INDEX CONCURRENTLY idx_budget_allocations_opd_year 
ON budget_allocations(opd_id, year);

CREATE INDEX CONCURRENTLY idx_users_active 
ON users(is_active) WHERE is_active = true;

-- Analyze tables
ANALYZE performance_achievements;
ANALYZE budget_allocations;
ANALYZE users;
```

### Application Caching

```javascript
// Redis caching strategy
const redis = require('redis');
const client = redis.createClient();

// Cache middleware
const cacheMiddleware = (duration = 300) => {
  return async (req, res, next) => {
    const key = `cache:${req.originalUrl}`;
    
    try {
      const cached = await client.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }
      
      // Store original send function
      const originalSend = res.json;
      
      // Override send function
      res.json = function(data) {
        // Cache the response
        client.setex(key, duration, JSON.stringify(data));
        
        // Call original send
        originalSend.call(this, data);
      };
      
      next();
    } catch (error) {
      next();
    }
  };
};
```

### CDN Configuration

```nginx
# CloudFlare or similar CDN configuration
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
    add_header Vary "Accept-Encoding";
    
    # Enable compression
    gzip_static on;
}
```

## Troubleshooting

### Common Issues

#### 1. Application Won't Start

```bash
# Check logs
pm2 logs sakip-backend

# Check port availability
sudo netstat -tlnp | grep :8000

# Check environment variables
pm2 env 0

# Restart application
pm2 restart sakip-backend
```

#### 2. Database Connection Issues

```bash
# Test database connection
psql -h localhost -U sakip_prod -d sakip_prod

# Check PostgreSQL status
sudo systemctl status postgresql

# Check connection limits
sudo -u postgres psql -c "SELECT count(*) FROM pg_stat_activity;"
```

#### 3. High Memory Usage

```bash
# Check memory usage
free -h
ps aux --sort=-%mem | head

# Restart PM2 processes
pm2 restart all

# Check for memory leaks
pm2 monit
```

#### 4. SSL Certificate Issues

```bash
# Check certificate validity
openssl x509 -in /etc/ssl/certs/sakip.crt -text -noout

# Renew Let's Encrypt certificate
sudo certbot renew

# Test SSL configuration
curl -I https://sakip.pemda.go.id
```

### Health Checks

```bash
#!/bin/bash
# health-check.sh

# Check application health
if ! curl -f http://localhost:8000/health > /dev/null 2>&1; then
    echo "Application health check failed"
    pm2 restart sakip-backend
fi

# Check database connectivity
if ! pg_isready -h localhost -U sakip_prod > /dev/null 2>&1; then
    echo "Database connectivity check failed"
    sudo systemctl restart postgresql
fi

# Check Redis connectivity
if ! redis-cli ping > /dev/null 2>&1; then
    echo "Redis connectivity check failed"
    sudo systemctl restart redis
fi

# Check disk space
DISK_USAGE=$(df / | tail -1 | awk '{print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "Disk usage is above 80%: $DISK_USAGE%"
    # Clean old logs
    find /opt/sakip/logs -name "*.log" -mtime +7 -delete
fi
```

---

**© 2024 SAKIP Deployment Guide**  
*Comprehensive deployment documentation for production environments*