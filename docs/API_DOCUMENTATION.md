# SAKIP API Documentation

## Overview

SAKIP API menyediakan RESTful endpoints untuk integrasi dengan sistem eksternal dan manajemen data internal. API ini menggunakan JSON untuk pertukaran data dan JWT untuk autentikasi.

## Base URL

```
Production: https://api.sakip.pemda.go.id/v1
Development: http://localhost:8000/api/v1
```

## Authentication

### JWT Token Authentication

Semua endpoint yang memerlukan autentikasi harus menyertakan JWT token dalam header:

```http
Authorization: Bearer <jwt_token>
```

### Login Endpoint

```http
POST /auth/login
```

**Request Body:**
```json
{
  "username": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "name": "Administrator",
      "role": "super_admin",
      "opd": "Sekretariat Daerah",
      "permissions": ["all"]
    }
  }
}
```

## Core Endpoints

### 1. Dashboard API

#### Get Dashboard Summary
```http
GET /dashboard/summary?year=2024&quarter=Q4
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overall_performance": 85.2,
    "budget_absorption": 92.8,
    "indicators_on_track": 28,
    "indicators_at_risk": 12,
    "opd_ranking": [
      {
        "rank": 1,
        "opd": "Dinas Pendidikan",
        "score": 89.5,
        "change": "+2.1"
      }
    ]
  }
}
```

#### Get Performance Trend
```http
GET /dashboard/performance-trend?year=2024
```

### 2. Planning API

#### Get Planning Hierarchy
```http
GET /planning/hierarchy?opd_id=1
```

#### Create/Update Planning Data
```http
POST /planning/renstra
PUT /planning/renstra/:id
```

**Request Body:**
```json
{
  "opd_id": 1,
  "period": "2021-2026",
  "vision": "Visi organisasi",
  "mission": ["Misi 1", "Misi 2"],
  "tujuan": [
    {
      "name": "Tujuan 1",
      "sasaran": [
        {
          "name": "Sasaran 1.1",
          "indicators": [
            {
              "name": "Indikator 1.1.1",
              "target": 85,
              "unit": "Persen",
              "formula": "realisasi/target*100"
            }
          ]
        }
      ]
    }
  ]
}
```

#### Upload Planning Documents
```http
POST /planning/documents/upload
Content-Type: multipart/form-data
```

### 3. Performance API

#### Get Performance Data
```http
GET /performance/data?opd_id=1&year=2024&quarter=Q4
```

#### Submit Performance Achievement
```http
POST /performance/achievement
```

**Request Body:**
```json
{
  "indicator_id": 123,
  "period": "2024-12",
  "target": 85,
  "achievement": 78.3,
  "notes": "Faktor penghambat: cuaca buruk",
  "supporting_data": [
    {
      "type": "document",
      "url": "/uploads/evidence.pdf"
    }
  ]
}
```

#### Bulk Import Performance Data
```http
POST /performance/bulk-import
Content-Type: multipart/form-data
```

### 4. Budget API

#### Get Budget Summary
```http
GET /budget/summary?year=2024&opd_id=1
```

#### Sync with SIPD
```http
POST /budget/sync-sipd
```

**Request Body:**
```json
{
  "opd_id": 1,
  "year": 2024,
  "sync_type": "full" // or "incremental"
}
```

#### Get Budget Analysis
```http
GET /budget/analysis?year=2024&type=efficiency
```

### 5. Reporting API

#### Generate LKJIP
```http
POST /reporting/lkjip/generate
```

**Request Body:**
```json
{
  "opd_id": 1,
  "year": 2024,
  "format": "pdf", // pdf, word, excel
  "template": "standard",
  "include_attachments": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "report_id": "lkjip_2024_001",
    "download_url": "/reports/download/lkjip_2024_001.pdf",
    "expires_at": "2024-12-31T23:59:59Z"
  }
}
```

#### Get Report Status
```http
GET /reporting/status/:report_id
```

#### Custom Report Builder
```http
POST /reporting/custom
```

### 6. Evaluation API

#### Get Evaluation Results
```http
GET /evaluation/results?opd_id=1&year=2024&type=internal
```

#### Submit LKE (Lembar Kerja Evaluasi)
```http
POST /evaluation/lke
```

**Request Body:**
```json
{
  "opd_id": 1,
  "year": 2024,
  "evaluator": "Tim Evaluasi Internal",
  "components": {
    "perencanaan": {
      "score": 85,
      "findings": ["Finding 1", "Finding 2"],
      "recommendations": ["Recommendation 1"]
    },
    "pengukuran": {
      "score": 82,
      "findings": [],
      "recommendations": []
    }
  }
}
```

#### Get LKE Template
```http
GET /evaluation/lke/template?version=2024
```

### 7. Integration API

#### Get Integration Status
```http
GET /integration/status
```

#### Test Connection
```http
POST /integration/test-connection
```

**Request Body:**
```json
{
  "system": "sipd",
  "endpoint": "https://sipd.kemendagri.go.id/api",
  "credentials": {
    "api_key": "xxx",
    "secret": "xxx"
  }
}
```

#### Sync External Data
```http
POST /integration/sync/:system
```

### 8. User Management API

#### Get Users
```http
GET /users?role=admin_opd&opd_id=1&page=1&limit=10
```

#### Create User
```http
POST /users
```

**Request Body:**
```json
{
  "username": "admin_diknas",
  "name": "Admin Dinas Pendidikan",
  "email": "admin@diknas.pemda.go.id",
  "password": "secure_password",
  "role": "admin_opd",
  "opd_id": 1,
  "permissions": ["planning", "performance", "budget", "reporting"]
}
```

#### Update User
```http
PUT /users/:id
```

#### Delete User
```http
DELETE /users/:id
```

## Webhook Endpoints

### Performance Data Update
```http
POST /webhooks/performance-update
```

### Budget Sync Completion
```http
POST /webhooks/budget-sync-complete
```

### Report Generation Complete
```http
POST /webhooks/report-complete
```

## Error Handling

### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "field": "email",
      "message": "Email format is invalid"
    }
  }
}
```

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 422 | Validation Error |
| 500 | Internal Server Error |

## Rate Limiting

API menggunakan rate limiting untuk mencegah abuse:

- **Standard endpoints**: 100 requests per minute
- **Upload endpoints**: 10 requests per minute
- **Report generation**: 5 requests per minute

Headers response:
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

## Pagination

Endpoints yang mengembalikan list data menggunakan pagination:

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20, max: 100)
- `sort`: Sort field
- `order`: Sort order (asc/desc)

**Response Format:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "current_page": 1,
    "per_page": 20,
    "total": 150,
    "total_pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

## Filtering and Search

### Query Parameters
- `search`: Global search across relevant fields
- `filter[field]`: Filter by specific field
- `date_from` & `date_to`: Date range filtering

**Example:**
```http
GET /performance/data?search=pendidikan&filter[status]=active&date_from=2024-01-01&date_to=2024-12-31
```

## File Upload

### Upload Endpoint
```http
POST /upload
Content-Type: multipart/form-data
```

**Supported formats:**
- Documents: PDF, DOC, DOCX, XLS, XLSX
- Images: JPG, PNG, GIF
- Max file size: 10MB

**Response:**
```json
{
  "success": true,
  "data": {
    "file_id": "file_123",
    "filename": "document.pdf",
    "url": "/uploads/document.pdf",
    "size": 1024000,
    "mime_type": "application/pdf"
  }
}
```

## Real-time Updates

### WebSocket Connection
```javascript
const ws = new WebSocket('wss://api.sakip.pemda.go.id/ws');

ws.onmessage = function(event) {
  const data = JSON.parse(event.data);
  console.log('Real-time update:', data);
};
```

### Event Types
- `performance_updated`: Performance data changed
- `budget_synced`: Budget data synchronized
- `report_generated`: Report generation completed
- `evaluation_submitted`: Evaluation submitted

## SDK and Libraries

### JavaScript/Node.js
```bash
npm install @sakip/api-client
```

```javascript
import { SakipClient } from '@sakip/api-client';

const client = new SakipClient({
  baseURL: 'https://api.sakip.pemda.go.id/v1',
  token: 'your-jwt-token'
});

const dashboard = await client.dashboard.getSummary({ year: 2024 });
```

### PHP
```bash
composer require sakip/api-client
```

### Python
```bash
pip install sakip-api-client
```

## Testing

### Postman Collection
Download Postman collection: [SAKIP API.postman_collection.json](./postman/SAKIP_API.postman_collection.json)

### API Testing Environment
```
Base URL: https://api-staging.sakip.pemda.go.id/v1
Test Token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## Changelog

### v1.2.0 (2024-12-20)
- Added bulk import endpoints
- Enhanced error handling
- Added webhook support

### v1.1.0 (2024-11-15)
- Added evaluation API
- Improved performance endpoints
- Added real-time updates

### v1.0.0 (2024-10-01)
- Initial API release
- Core CRUD operations
- Authentication system