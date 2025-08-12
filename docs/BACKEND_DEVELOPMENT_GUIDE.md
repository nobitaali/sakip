# SAKIP Backend Development Guide

## Overview

Panduan ini menjelaskan arsitektur, teknologi, dan implementasi backend untuk aplikasi SAKIP. Backend dirancang untuk mendukung skalabilitas, keamanan, dan integrasi dengan berbagai sistem eksternal.

## Architecture Overview

### System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Gateway   │    │   Load Balancer │
│   (React)       │◄──►│   (Nginx)       │◄──►│   (HAProxy)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
┌───────────────────────────��─────────────────────────────────────┐
│                        Backend Services                         │
├─────────────────┬─────────────────┬─────────────────┬───────────┤
│   Auth Service  │  Core API       │  Integration    │  Report   │
│   (JWT/OAuth)   │  (Express.js)   │  Service        │  Service  │
└─────────────────┴─────────────────┴─────────────────┴───────────┘
                                │
                                ▼
┌─────────────────┬─────────────────┬─────────────────┬───────────┐
│   PostgreSQL    │     Redis       │   File Storage  │  Message  │
│   (Primary DB)  │   (Cache/Queue) │   (MinIO/S3)    │  Queue    │
└─────────────────┴─────────────────┴─────────────────┴───────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    External Integrations                        │
├─────────────────┬─────────────────┬─────────────────┬───────────┤
│      SIPD       │      BKN        │      BKD        │  Sector   │
│   (Planning)    │   (HR Data)     │  (Local HR)     │  Systems  │
└─────────────────┴─────────────────┴─────────────────┴───────────┘
```

### Microservices Architecture

1. **Authentication Service** - JWT, user management, RBAC
2. **Core API Service** - Main business logic
3. **Integration Service** - External system connections
4. **Report Service** - Document generation
5. **Notification Service** - Alerts and notifications
6. **File Service** - Document management

## Technology Stack

### Core Technologies

#### Backend Framework
- **Node.js 18+** - Runtime environment
- **Express.js** atau **Fastify** - Web framework
- **TypeScript** - Type safety dan developer experience

#### Database
- **PostgreSQL 14+** - Primary database
- **Redis 6+** - Caching dan session storage
- **MongoDB** (Optional) - Document storage untuk logs

#### ORM/Database Tools
- **Prisma** - Modern ORM dengan type safety
- **TypeORM** - Alternative ORM
- **Knex.js** - Query builder

#### Authentication & Security
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing
- **helmet** - Security headers
- **cors** - Cross-origin resource sharing
- **rate-limiter-flexible** - Rate limiting

#### File Storage
- **MinIO** - Self-hosted S3-compatible storage
- **AWS S3** - Cloud storage
- **Multer** - File upload handling

#### Message Queue & Background Jobs
- **Bull** - Redis-based job queue
- **Agenda** - MongoDB-based job scheduling
- **node-cron** - Cron job scheduling

#### Monitoring & Logging
- **Winston** - Logging library
- **Morgan** - HTTP request logger
- **Prometheus** - Metrics collection
- **Grafana** - Monitoring dashboard

## Database Design

### Core Tables

#### Users & Authentication
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    opd_id INTEGER REFERENCES opd(id),
    permissions JSONB,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- OPD (Organisasi Perangkat Daerah)
CREATE TABLE opd (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    head_name VARCHAR(255),
    contact JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User roles enum
CREATE TYPE user_role AS ENUM ('super_admin', 'admin_opd', 'evaluator', 'viewer');
```

#### Planning Module
```sql
-- Renstra (Strategic Plan)
CREATE TABLE renstra (
    id SERIAL PRIMARY KEY,
    opd_id INTEGER REFERENCES opd(id),
    period VARCHAR(20) NOT NULL, -- e.g., "2021-2026"
    vision TEXT,
    mission JSONB, -- Array of mission statements
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tujuan (Objectives)
CREATE TABLE tujuan (
    id SERIAL PRIMARY KEY,
    renstra_id INTEGER REFERENCES renstra(id),
    code VARCHAR(20),
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sasaran (Targets)
CREATE TABLE sasaran (
    id SERIAL PRIMARY KEY,
    tujuan_id INTEGER REFERENCES tujuan(id),
    code VARCHAR(20),
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Program
CREATE TABLE program (
    id SERIAL PRIMARY KEY,
    sasaran_id INTEGER REFERENCES sasaran(id),
    code VARCHAR(20),
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Kegiatan (Activities)
CREATE TABLE kegiatan (
    id SERIAL PRIMARY KEY,
    program_id INTEGER REFERENCES program(id),
    code VARCHAR(20),
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indikator Kinerja
CREATE TABLE indicators (
    id SERIAL PRIMARY KEY,
    parent_type indicator_parent_type NOT NULL,
    parent_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    definition TEXT,
    formula TEXT,
    unit VARCHAR(50),
    data_source TEXT,
    frequency indicator_frequency,
    polarity indicator_polarity DEFAULT 'higher_better',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE indicator_parent_type AS ENUM ('tujuan', 'sasaran', 'program', 'kegiatan');
CREATE TYPE indicator_frequency AS ENUM ('monthly', 'quarterly', 'annually');
CREATE TYPE indicator_polarity AS ENUM ('higher_better', 'lower_better', 'target_based');
```

#### Performance Module
```sql
-- Target Kinerja
CREATE TABLE performance_targets (
    id SERIAL PRIMARY KEY,
    indicator_id INTEGER REFERENCES indicators(id),
    year INTEGER NOT NULL,
    quarter INTEGER, -- NULL for annual targets
    month INTEGER,   -- NULL for quarterly/annual targets
    target_value DECIMAL(15,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(indicator_id, year, quarter, month)
);

-- Realisasi Kinerja
CREATE TABLE performance_achievements (
    id SERIAL PRIMARY KEY,
    indicator_id INTEGER REFERENCES indicators(id),
    year INTEGER NOT NULL,
    quarter INTEGER,
    month INTEGER,
    achievement_value DECIMAL(15,2) NOT NULL,
    percentage DECIMAL(5,2), -- Auto-calculated
    notes TEXT,
    supporting_documents JSONB,
    input_by INTEGER REFERENCES users(id),
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### Budget Module
```sql
-- Budget Allocation (Pagu)
CREATE TABLE budget_allocations (
    id SERIAL PRIMARY KEY,
    opd_id INTEGER REFERENCES opd(id),
    year INTEGER NOT NULL,
    category budget_category NOT NULL,
    program_id INTEGER REFERENCES program(id),
    kegiatan_id INTEGER REFERENCES kegiatan(id),
    allocation_amount DECIMAL(15,2) NOT NULL,
    sipd_code VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Budget Realization
CREATE TABLE budget_realizations (
    id SERIAL PRIMARY KEY,
    allocation_id INTEGER REFERENCES budget_allocations(id),
    month INTEGER NOT NULL,
    realization_amount DECIMAL(15,2) NOT NULL,
    cumulative_amount DECIMAL(15,2),
    percentage DECIMAL(5,2),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE budget_category AS ENUM ('belanja_pegawai', 'belanja_barang', 'belanja_modal', 'belanja_bantuan');
```

#### Evaluation Module
```sql
-- Evaluations
CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    opd_id INTEGER REFERENCES opd(id),
    year INTEGER NOT NULL,
    type evaluation_type NOT NULL,
    evaluator VARCHAR(255),
    evaluation_date DATE,
    overall_score DECIMAL(5,2),
    grade VARCHAR(5),
    status evaluation_status DEFAULT 'draft',
    components JSONB, -- Detailed component scores
    findings JSONB,   -- Array of findings
    recommendations JSONB, -- Array of recommendations
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE evaluation_type AS ENUM ('internal', 'external', 'self_assessment');
CREATE TYPE evaluation_status AS ENUM ('draft', 'in_progress', 'completed', 'reviewed');
```

#### Integration Module
```sql
-- External System Connections
CREATE TABLE integrations (
    id SERIAL PRIMARY KEY,
    system_name VARCHAR(100) NOT NULL,
    system_type VARCHAR(50),
    endpoint_url TEXT,
    api_key VARCHAR(255),
    credentials JSONB, -- Encrypted credentials
    status integration_status DEFAULT 'inactive',
    last_sync TIMESTAMP,
    sync_frequency VARCHAR(20),
    health_score INTEGER DEFAULT 0,
    config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sync Logs
CREATE TABLE sync_logs (
    id SERIAL PRIMARY KEY,
    integration_id INTEGER REFERENCES integrations(id),
    sync_type VARCHAR(50),
    status sync_status,
    records_processed INTEGER DEFAULT 0,
    records_success INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    error_message TEXT,
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TYPE integration_status AS ENUM ('active', 'inactive', 'error', 'maintenance');
CREATE TYPE sync_status AS ENUM ('pending', 'running', 'completed', 'failed');
```

### Database Indexes

```sql
-- Performance indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_opd ON users(opd_id);
CREATE INDEX idx_performance_indicator_period ON performance_achievements(indicator_id, year, quarter, month);
CREATE INDEX idx_budget_opd_year ON budget_allocations(opd_id, year);
CREATE INDEX idx_evaluations_opd_year ON evaluations(opd_id, year);

-- Composite indexes
CREATE INDEX idx_performance_lookup ON performance_achievements(indicator_id, year, quarter, month);
CREATE INDEX idx_budget_lookup ON budget_realizations(allocation_id, month);
```

## API Implementation

### Project Structure

```
backend/
├── src/
│   ├── controllers/        # Route handlers
│   ├── services/          # Business logic
│   ├── models/            # Database models
│   ├── middleware/        # Custom middleware
│   ├── routes/            # Route definitions
│   ├── utils/             # Utility functions
│   ├── config/            # Configuration files
│   ├── types/             # TypeScript type definitions
│   └── validators/        # Input validation schemas
├── tests/                 # Test files
├── migrations/            # Database migrations
├── seeds/                 # Database seeders
├── docs/                  # API documentation
└── scripts/               # Utility scripts
```

### Core Implementation Files

#### 1. Main Application Setup

```typescript
// src/app.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middleware/errorHandler';
import { authMiddleware } from './middleware/auth';
import routes from './routes';

const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Logging
app.use(morgan('combined'));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1', routes);

// Error handling
app.use(errorHandler);

export default app;
```

#### 2. Database Configuration

```typescript
// src/config/database.ts
import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';

export const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

export const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
});

// Database connection test
export async function connectDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Database connected successfully');
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    process.exit(1);
  }
}
```

#### 3. Authentication Middleware

```typescript
// src/middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';

interface AuthRequest extends Request {
  user?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        error: { message: 'Access denied. No token provided.' }
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await prisma.users.findUnique({
      where: { id: decoded.id },
      include: { opd: true }
    });

    if (!user || !user.is_active) {
      return res.status(401).json({
        success: false,
        error: { message: 'Invalid token.' }
      });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: { message: 'Invalid token.' }
    });
  }
};

export const requireRole = (roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: { message: 'Access denied. Insufficient permissions.' }
      });
    }
    next();
  };
};
```

#### 4. Performance Service

```typescript
// src/services/performanceService.ts
import { prisma } from '../config/database';
import { redis } from '../config/database';

export class PerformanceService {
  async getPerformanceData(filters: {
    opd_id?: number;
    year: number;
    quarter?: number;
    month?: number;
  }) {
    const cacheKey = `performance:${JSON.stringify(filters)}`;
    
    // Try cache first
    const cached = await redis.get(cacheKey);
    if (cached) {
      return JSON.parse(cached);
    }

    const data = await prisma.performance_achievements.findMany({
      where: {
        year: filters.year,
        ...(filters.quarter && { quarter: filters.quarter }),
        ...(filters.month && { month: filters.month }),
        indicator: {
          ...(filters.opd_id && {
            OR: [
              { tujuan: { renstra: { opd_id: filters.opd_id } } },
              { sasaran: { tujuan: { renstra: { opd_id: filters.opd_id } } } },
              { program: { sasaran: { tujuan: { renstra: { opd_id: filters.opd_id } } } } },
              { kegiatan: { program: { sasaran: { tujuan: { renstra: { opd_id: filters.opd_id } } } } } }
            ]
          })
        }
      },
      include: {
        indicator: {
          include: {
            targets: {
              where: {
                year: filters.year,
                ...(filters.quarter && { quarter: filters.quarter }),
                ...(filters.month && { month: filters.month })
              }
            }
          }
        }
      }
    });

    // Cache for 5 minutes
    await redis.setex(cacheKey, 300, JSON.stringify(data));
    
    return data;
  }

  async submitAchievement(data: {
    indicator_id: number;
    year: number;
    quarter?: number;
    month?: number;
    achievement_value: number;
    notes?: string;
    supporting_documents?: any[];
    input_by: number;
  }) {
    // Calculate percentage against target
    const target = await prisma.performance_targets.findFirst({
      where: {
        indicator_id: data.indicator_id,
        year: data.year,
        quarter: data.quarter,
        month: data.month
      }
    });

    let percentage = 0;
    if (target) {
      percentage = (data.achievement_value / target.target_value) * 100;
    }

    const achievement = await prisma.performance_achievements.upsert({
      where: {
        indicator_id_year_quarter_month: {
          indicator_id: data.indicator_id,
          year: data.year,
          quarter: data.quarter || null,
          month: data.month || null
        }
      },
      update: {
        achievement_value: data.achievement_value,
        percentage,
        notes: data.notes,
        supporting_documents: data.supporting_documents,
        updated_at: new Date()
      },
      create: {
        ...data,
        percentage
      }
    });

    // Invalidate related cache
    await this.invalidatePerformanceCache(data.indicator_id, data.year);

    return achievement;
  }

  private async invalidatePerformanceCache(indicator_id: number, year: number) {
    const pattern = `performance:*${indicator_id}*${year}*`;
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
  }
}
```

#### 5. Integration Service

```typescript
// src/services/integrationService.ts
import axios from 'axios';
import { prisma } from '../config/database';
import { Queue } from 'bull';

const syncQueue = new Queue('sync queue', {
  redis: {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

export class IntegrationService {
  async syncSIPD(opd_id: number, year: number) {
    const integration = await prisma.integrations.findFirst({
      where: { system_name: 'SIPD', status: 'active' }
    });

    if (!integration) {
      throw new Error('SIPD integration not configured');
    }

    // Add sync job to queue
    const job = await syncQueue.add('sipd-sync', {
      integration_id: integration.id,
      opd_id,
      year
    });

    return { job_id: job.id, status: 'queued' };
  }

  async processSIPDSync(data: {
    integration_id: number;
    opd_id: number;
    year: number;
  }) {
    const log = await prisma.sync_logs.create({
      data: {
        integration_id: data.integration_id,
        sync_type: 'sipd_budget',
        status: 'running',
        started_at: new Date()
      }
    });

    try {
      const integration = await prisma.integrations.findUnique({
        where: { id: data.integration_id }
      });

      // Fetch data from SIPD API
      const response = await axios.get(`${integration.endpoint_url}/budget`, {
        headers: {
          'Authorization': `Bearer ${integration.api_key}`,
          'Content-Type': 'application/json'
        },
        params: {
          opd_id: data.opd_id,
          year: data.year
        }
      });

      const budgetData = response.data;
      let processed = 0;
      let success = 0;
      let failed = 0;

      // Process each budget item
      for (const item of budgetData) {
        try {
          await prisma.budget_allocations.upsert({
            where: {
              sipd_code: item.code
            },
            update: {
              allocation_amount: item.amount,
              updated_at: new Date()
            },
            create: {
              opd_id: data.opd_id,
              year: data.year,
              category: item.category,
              allocation_amount: item.amount,
              sipd_code: item.code
            }
          });
          success++;
        } catch (error) {
          failed++;
          console.error(`Failed to sync budget item ${item.code}:`, error);
        }
        processed++;
      }

      // Update sync log
      await prisma.sync_logs.update({
        where: { id: log.id },
        data: {
          status: 'completed',
          records_processed: processed,
          records_success: success,
          records_failed: failed,
          completed_at: new Date()
        }
      });

      // Update integration health
      await prisma.integrations.update({
        where: { id: data.integration_id },
        data: {
          last_sync: new Date(),
          health_score: Math.round((success / processed) * 100)
        }
      });

      return { processed, success, failed };
    } catch (error) {
      await prisma.sync_logs.update({
        where: { id: log.id },
        data: {
          status: 'failed',
          error_message: error.message,
          completed_at: new Date()
        }
      });
      throw error;
    }
  }
}

// Queue processor
syncQueue.process('sipd-sync', async (job) => {
  const integrationService = new IntegrationService();
  return await integrationService.processSIPDSync(job.data);
});
```

## Deployment Guide

### Docker Configuration

#### Dockerfile
```dockerfile
FROM node:18-alpine

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

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Start application
CMD ["npm", "start"]
```

#### docker-compose.yml
```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "8000:8000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://user:password@postgres:5432/sakip
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=your-secret-key
    depends_on:
      - postgres
      - redis
    volumes:
      - ./uploads:/app/uploads

  postgres:
    image: postgres:14-alpine
    environment:
      - POSTGRES_DB=sakip
      - POSTGRES_USER=user
      - POSTGRES_PASSWORD=password
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  redis:
    image: redis:6-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app

volumes:
  postgres_data:
  redis_data:
```

### Environment Configuration

#### .env.example
```env
# Application
NODE_ENV=development
PORT=8000
APP_NAME=SAKIP Backend
APP_VERSION=1.0.0

# Database
DATABASE_URL=postgresql://user:password@localhost:5432/sakip
REDIS_URL=redis://localhost:6379

# Authentication
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
BCRYPT_ROUNDS=12

# File Storage
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=pdf,doc,docx,xls,xlsx,jpg,png

# External APIs
SIPD_API_URL=https://sipd.kemendagri.go.id/api
SIPD_API_KEY=your-sipd-api-key
BKN_API_URL=https://api.bkn.go.id
BKN_API_KEY=your-bkn-api-key

# Email (for notifications)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Monitoring
LOG_LEVEL=info
ENABLE_METRICS=true
SENTRY_DSN=your-sentry-dsn
```

### Production Deployment

#### 1. Server Setup (Ubuntu 20.04)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PostgreSQL
sudo apt install postgresql postgresql-contrib -y

# Install Redis
sudo apt install redis-server -y

# Install Nginx
sudo apt install nginx -y

# Install PM2 for process management
sudo npm install -g pm2

# Install Docker (optional)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

#### 2. Database Setup

```bash
# Create database user
sudo -u postgres createuser --interactive --pwprompt sakip_user

# Create database
sudo -u postgres createdb -O sakip_user sakip_db

# Run migrations
npm run migrate:deploy
```

#### 3. Application Deployment

```bash
# Clone repository
git clone https://github.com/your-org/sakip-backend.git
cd sakip-backend

# Install dependencies
npm ci --only=production

# Build application
npm run build

# Start with PM2
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### ecosystem.config.js
```javascript
module.exports = {
  apps: [{
    name: 'sakip-backend',
    script: 'dist/server.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'development'
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 8000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
};
```

## Testing Strategy

### Unit Tests
```typescript
// tests/services/performanceService.test.ts
import { PerformanceService } from '../../src/services/performanceService';
import { prisma } from '../../src/config/database';

jest.mock('../../src/config/database');

describe('PerformanceService', () => {
  let service: PerformanceService;

  beforeEach(() => {
    service = new PerformanceService();
  });

  describe('getPerformanceData', () => {
    it('should return performance data for given filters', async () => {
      const mockData = [
        {
          id: 1,
          indicator_id: 1,
          year: 2024,
          achievement_value: 85.5
        }
      ];

      (prisma.performance_achievements.findMany as jest.Mock)
        .mockResolvedValue(mockData);

      const result = await service.getPerformanceData({
        opd_id: 1,
        year: 2024
      });

      expect(result).toEqual(mockData);
    });
  });
});
```

### Integration Tests
```typescript
// tests/integration/api.test.ts
import request from 'supertest';
import app from '../../src/app';

describe('API Integration Tests', () => {
  let authToken: string;

  beforeAll(async () => {
    // Login to get auth token
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        username: 'testuser',
        password: 'testpass'
      });
    
    authToken = response.body.data.token;
  });

  describe('GET /api/v1/performance/data', () => {
    it('should return performance data', async () => {
      const response = await request(app)
        .get('/api/v1/performance/data?year=2024')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });
  });
});
```

## Security Considerations

### 1. Authentication & Authorization
- JWT tokens with short expiration
- Role-based access control (RBAC)
- API key authentication for external integrations
- Multi-factor authentication for admin users

### 2. Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all communications
- Input validation and sanitization
- SQL injection prevention with parameterized queries

### 3. Rate Limiting & DDoS Protection
- Implement rate limiting per IP and user
- Use reverse proxy (Nginx) for load balancing
- Monitor for suspicious activities

### 4. Audit Logging
- Log all user activities
- Track data changes with timestamps
- Monitor API usage patterns
- Alert on security events

## Monitoring & Maintenance

### 1. Application Monitoring
```typescript
// src/middleware/metrics.ts
import prometheus from 'prom-client';

const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status']
});

export const metricsMiddleware = (req, res, next) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    httpRequestDuration
      .labels(req.method, req.route?.path || req.path, res.statusCode)
      .observe(duration);
  });
  
  next();
};
```

### 2. Health Checks
```typescript
// src/routes/health.ts
import { Router } from 'express';
import { prisma } from '../config/database';
import { redis } from '../config/database';

const router = Router();

router.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    services: {
      database: 'unknown',
      redis: 'unknown',
      external_apis: 'unknown'
    }
  };

  try {
    await prisma.$queryRaw`SELECT 1`;
    health.services.database = 'ok';
  } catch (error) {
    health.services.database = 'error';
    health.status = 'error';
  }

  try {
    await redis.ping();
    health.services.redis = 'ok';
  } catch (error) {
    health.services.redis = 'error';
    health.status = 'error';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});

export default router;
```

### 3. Backup Strategy
```bash
#!/bin/bash
# scripts/backup.sh

# Database backup
pg_dump -h localhost -U sakip_user -d sakip_db > backup_$(date +%Y%m%d_%H%M%S).sql

# File backup
tar -czf files_backup_$(date +%Y%m%d_%H%M%S).tar.gz uploads/

# Upload to cloud storage (optional)
aws s3 cp backup_*.sql s3://sakip-backups/database/
aws s3 cp files_backup_*.tar.gz s3://sakip-backups/files/
```

## Performance Optimization

### 1. Database Optimization
- Use appropriate indexes
- Implement query optimization
- Use connection pooling
- Regular VACUUM and ANALYZE

### 2. Caching Strategy
- Redis for session storage
- Cache frequently accessed data
- Implement cache invalidation
- Use CDN for static assets

### 3. API Optimization
- Implement pagination
- Use compression (gzip)
- Optimize JSON responses
- Implement API versioning

This comprehensive guide provides the foundation for developing a robust, scalable, and secure backend for the SAKIP application. The implementation should be adapted based on specific requirements and infrastructure constraints.