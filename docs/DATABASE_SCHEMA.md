# SAKIP Database Schema Documentation

## Overview

Database schema untuk aplikasi SAKIP (Sistem Akuntabilitas Kinerja Instansi Pemerintah) menggunakan PostgreSQL sebagai database utama. Schema dirancang untuk mendukung hierarki perencanaan yang kompleks, tracking kinerja multi-level, dan integrasi dengan sistem eksternal.

## Database Design Principles

### 1. **Normalization**
- Database dinormalisasi hingga 3NF untuk menghindari redundansi
- Referential integrity dijaga dengan foreign key constraints
- Lookup tables digunakan untuk data yang sering berulang

### 2. **Scalability**
- Partitioning untuk tabel besar berdasarkan tahun
- Indexing strategy untuk query performance
- Soft delete untuk audit trail

### 3. **Audit Trail**
- Semua tabel memiliki created_at dan updated_at
- User tracking untuk perubahan data
- Version control untuk dokumen penting

### 4. **Flexibility**
- JSONB fields untuk data semi-structured
- Extensible design untuk custom fields
- Support untuk multi-tenancy (OPD-based)

## Core Tables

### 1. User Management

#### users
Tabel utama untuk manajemen pengguna sistem.

```sql
CREATE TYPE user_role AS ENUM (
    'super_admin', 
    'admin_opd', 
    'evaluator', 
    'viewer'
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL,
    opd_id INTEGER REFERENCES opd(id),
    permissions JSONB DEFAULT '[]'::jsonb,
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP,
    two_factor_secret VARCHAR(32),
    two_factor_enabled BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id)
);

-- Indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_opd ON users(opd_id);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = true;

-- Triggers
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

#### user_sessions
Tracking session pengguna untuk keamanan.

```sql
CREATE TABLE user_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    is_active BOOLEAN DEFAULT true,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX idx_user_sessions_user ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_active ON user_sessions(is_active, expires_at);
```

#### activity_logs
Log aktivitas pengguna untuk audit.

```sql
CREATE TYPE activity_type AS ENUM (
    'login', 'logout', 'create', 'update', 'delete', 
    'view', 'export', 'import', 'sync'
);

CREATE TABLE activity_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    activity_type activity_type NOT NULL,
    table_name VARCHAR(100),
    record_id INTEGER,
    description TEXT,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partitioning by month for performance
CREATE TABLE activity_logs_y2024m01 PARTITION OF activity_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE INDEX idx_activity_logs_user_date ON activity_logs(user_id, created_at);
CREATE INDEX idx_activity_logs_type ON activity_logs(activity_type);
```

### 2. Organization Structure

#### opd
Organisasi Perangkat Daerah - unit organisasi utama.

```sql
CREATE TABLE opd (
    id SERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100),
    head_name VARCHAR(255),
    head_nip VARCHAR(20),
    contact JSONB DEFAULT '{}'::jsonb, -- {phone, email, address, website}
    parent_id INTEGER REFERENCES opd(id), -- For hierarchical structure
    level INTEGER DEFAULT 1, -- 1=Dinas, 2=Bidang, 3=Seksi
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample contact JSONB structure:
-- {
--   "phone": "0274-123456",
--   "email": "diknas@pemda.go.id", 
--   "address": "Jl. Pendidikan No. 1",
--   "website": "https://diknas.pemda.go.id",
--   "fax": "0274-123457"
-- }

CREATE INDEX idx_opd_code ON opd(code);
CREATE INDEX idx_opd_parent ON opd(parent_id);
CREATE INDEX idx_opd_active ON opd(is_active) WHERE is_active = true;
```

### 3. Planning Module

#### renstra
Rencana Strategis - dokumen perencanaan utama.

```sql
CREATE TABLE renstra (
    id SERIAL PRIMARY KEY,
    opd_id INTEGER NOT NULL REFERENCES opd(id),
    period VARCHAR(20) NOT NULL, -- e.g., "2021-2026"
    title VARCHAR(500) NOT NULL,
    vision TEXT,
    mission JSONB DEFAULT '[]'::jsonb, -- Array of mission statements
    legal_basis JSONB DEFAULT '[]'::jsonb, -- Array of legal references
    is_active BOOLEAN DEFAULT true,
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    version VARCHAR(10) DEFAULT '1.0',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    updated_by INTEGER REFERENCES users(id),
    
    UNIQUE(opd_id, period, version)
);

CREATE INDEX idx_renstra_opd_period ON renstra(opd_id, period);
CREATE INDEX idx_renstra_active ON renstra(is_active) WHERE is_active = true;
```

#### tujuan
Tujuan strategis dalam hierarki perencanaan.

```sql
CREATE TABLE tujuan (
    id SERIAL PRIMARY KEY,
    renstra_id INTEGER NOT NULL REFERENCES renstra(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(renstra_id, code)
);

CREATE INDEX idx_tujuan_renstra ON tujuan(renstra_id);
CREATE INDEX idx_tujuan_code ON tujuan(renstra_id, code);
```

#### sasaran
Sasaran strategis di bawah tujuan.

```sql
CREATE TABLE sasaran (
    id SERIAL PRIMARY KEY,
    tujuan_id INTEGER NOT NULL REFERENCES tujuan(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(tujuan_id, code)
);

CREATE INDEX idx_sasaran_tujuan ON sasaran(tujuan_id);
```

#### program
Program di bawah sasaran.

```sql
CREATE TABLE program (
    id SERIAL PRIMARY KEY,
    sasaran_id INTEGER NOT NULL REFERENCES sasaran(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    program_type VARCHAR(50), -- 'unggulan', 'prioritas', 'regular'
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(sasaran_id, code)
);

CREATE INDEX idx_program_sasaran ON program(sasaran_id);
CREATE INDEX idx_program_type ON program(program_type);
```

#### kegiatan
Kegiatan di bawah program.

```sql
CREATE TABLE kegiatan (
    id SERIAL PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES program(id) ON DELETE CASCADE,
    code VARCHAR(20) NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    kegiatan_type VARCHAR(50), -- 'rutin', 'pembangunan', 'pemberdayaan'
    location TEXT,
    pic_name VARCHAR(255), -- Person In Charge
    pic_phone VARCHAR(20),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(program_id, code)
);

CREATE INDEX idx_kegiatan_program ON kegiatan(program_id);
CREATE INDEX idx_kegiatan_type ON kegiatan(kegiatan_type);
```

### 4. Performance Indicators

#### indicators
Indikator kinerja yang dapat dilekatkan pada berbagai level hierarki.

```sql
CREATE TYPE indicator_parent_type AS ENUM (
    'tujuan', 'sasaran', 'program', 'kegiatan'
);

CREATE TYPE indicator_frequency AS ENUM (
    'monthly', 'quarterly', 'semester', 'annually'
);

CREATE TYPE indicator_polarity AS ENUM (
    'higher_better',    -- Semakin tinggi semakin baik
    'lower_better',     -- Semakin rendah semakin baik  
    'target_based'      -- Berdasarkan target spesifik
);

CREATE TYPE indicator_type AS ENUM (
    'input', 'output', 'outcome', 'impact'
);

CREATE TABLE indicators (
    id SERIAL PRIMARY KEY,
    parent_type indicator_parent_type NOT NULL,
    parent_id INTEGER NOT NULL,
    code VARCHAR(50),
    name TEXT NOT NULL,
    definition TEXT,
    formula TEXT, -- Rumus perhitungan
    unit VARCHAR(100), -- Satuan (%, unit, orang, rupiah, dll)
    data_source TEXT,
    collection_method TEXT,
    frequency indicator_frequency NOT NULL,
    polarity indicator_polarity DEFAULT 'higher_better',
    type indicator_type DEFAULT 'output',
    baseline_value DECIMAL(15,2),
    baseline_year INTEGER,
    is_iku BOOLEAN DEFAULT false, -- Indikator Kinerja Utama
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    
    -- Ensure parent exists based on type
    CONSTRAINT check_parent_type CHECK (
        (parent_type = 'tujuan' AND parent_id IN (SELECT id FROM tujuan)) OR
        (parent_type = 'sasaran' AND parent_id IN (SELECT id FROM sasaran)) OR
        (parent_type = 'program' AND parent_id IN (SELECT id FROM program)) OR
        (parent_type = 'kegiatan' AND parent_id IN (SELECT id FROM kegiatan))
    )
);

CREATE INDEX idx_indicators_parent ON indicators(parent_type, parent_id);
CREATE INDEX idx_indicators_frequency ON indicators(frequency);
CREATE INDEX idx_indicators_iku ON indicators(is_iku) WHERE is_iku = true;
CREATE INDEX idx_indicators_active ON indicators(is_active) WHERE is_active = true;
```

#### performance_targets
Target kinerja per periode.

```sql
CREATE TABLE performance_targets (
    id SERIAL PRIMARY KEY,
    indicator_id INTEGER NOT NULL REFERENCES indicators(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    quarter INTEGER CHECK (quarter BETWEEN 1 AND 4),
    month INTEGER CHECK (month BETWEEN 1 AND 12),
    target_value DECIMAL(15,2) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    
    -- Ensure period consistency
    CONSTRAINT check_period_consistency CHECK (
        (quarter IS NULL AND month IS NULL) OR -- Annual
        (quarter IS NOT NULL AND month IS NULL) OR -- Quarterly  
        (quarter IS NOT NULL AND month IS NOT NULL) -- Monthly
    ),
    
    UNIQUE(indicator_id, year, quarter, month)
);

-- Partitioning by year for better performance
CREATE TABLE performance_targets_2024 PARTITION OF performance_targets
    FOR VALUES FROM (2024) TO (2025);

CREATE INDEX idx_performance_targets_indicator ON performance_targets(indicator_id);
CREATE INDEX idx_performance_targets_period ON performance_targets(year, quarter, month);
```

#### performance_achievements
Realisasi/capaian kinerja.

```sql
CREATE TYPE achievement_status AS ENUM (
    'draft', 'submitted', 'verified', 'rejected'
);

CREATE TABLE performance_achievements (
    id SERIAL PRIMARY KEY,
    indicator_id INTEGER NOT NULL REFERENCES indicators(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    quarter INTEGER CHECK (quarter BETWEEN 1 AND 4),
    month INTEGER CHECK (month BETWEEN 1 AND 12),
    achievement_value DECIMAL(15,2) NOT NULL,
    percentage DECIMAL(5,2), -- Auto-calculated: (achievement/target)*100
    notes TEXT,
    supporting_documents JSONB DEFAULT '[]'::jsonb,
    constraints_factors TEXT, -- Faktor penghambat
    supporting_factors TEXT, -- Faktor pendukung
    follow_up_plan TEXT, -- Rencana tindak lanjut
    status achievement_status DEFAULT 'draft',
    input_by INTEGER NOT NULL REFERENCES users(id),
    input_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    verified_by INTEGER REFERENCES users(id),
    verified_at TIMESTAMP,
    verification_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT check_period_consistency CHECK (
        (quarter IS NULL AND month IS NULL) OR
        (quarter IS NOT NULL AND month IS NULL) OR  
        (quarter IS NOT NULL AND month IS NOT NULL)
    ),
    
    UNIQUE(indicator_id, year, quarter, month)
);

-- Partitioning by year
CREATE TABLE performance_achievements_2024 PARTITION OF performance_achievements
    FOR VALUES FROM (2024) TO (2025);

-- Indexes
CREATE INDEX idx_performance_achievements_indicator ON performance_achievements(indicator_id);
CREATE INDEX idx_performance_achievements_period ON performance_achievements(year, quarter, month);
CREATE INDEX idx_performance_achievements_status ON performance_achievements(status);
CREATE INDEX idx_performance_achievements_input_by ON performance_achievements(input_by);

-- Function to auto-calculate percentage
CREATE OR REPLACE FUNCTION calculate_achievement_percentage()
RETURNS TRIGGER AS $$
BEGIN
    -- Get target value
    SELECT target_value INTO NEW.percentage
    FROM performance_targets pt
    WHERE pt.indicator_id = NEW.indicator_id
      AND pt.year = NEW.year
      AND COALESCE(pt.quarter, 0) = COALESCE(NEW.quarter, 0)
      AND COALESCE(pt.month, 0) = COALESCE(NEW.month, 0);
    
    -- Calculate percentage
    IF NEW.percentage IS NOT NULL AND NEW.percentage > 0 THEN
        NEW.percentage := (NEW.achievement_value / NEW.percentage) * 100;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_percentage
    BEFORE INSERT OR UPDATE ON performance_achievements
    FOR EACH ROW
    EXECUTE FUNCTION calculate_achievement_percentage();
```

### 5. Budget Module

#### budget_allocations
Alokasi anggaran (pagu).

```sql
CREATE TYPE budget_category AS ENUM (
    'belanja_pegawai',
    'belanja_barang', 
    'belanja_modal',
    'belanja_bantuan'
);

CREATE TYPE budget_source AS ENUM (
    'apbd', 'apbn', 'hibah', 'pinjaman', 'lainnya'
);

CREATE TABLE budget_allocations (
    id SERIAL PRIMARY KEY,
    opd_id INTEGER NOT NULL REFERENCES opd(id),
    year INTEGER NOT NULL,
    category budget_category NOT NULL,
    source budget_source DEFAULT 'apbd',
    program_id INTEGER REFERENCES program(id),
    kegiatan_id INTEGER REFERENCES kegiatan(id),
    sub_kegiatan_code VARCHAR(50),
    sub_kegiatan_name TEXT,
    allocation_amount DECIMAL(15,2) NOT NULL,
    sipd_code VARCHAR(50), -- Kode dari SIPD
    sipd_sync_at TIMESTAMP,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    
    CONSTRAINT check_positive_amount CHECK (allocation_amount >= 0)
);

-- Partitioning by year
CREATE TABLE budget_allocations_2024 PARTITION OF budget_allocations
    FOR VALUES FROM (2024) TO (2025);

CREATE INDEX idx_budget_allocations_opd_year ON budget_allocations(opd_id, year);
CREATE INDEX idx_budget_allocations_category ON budget_allocations(category);
CREATE INDEX idx_budget_allocations_program ON budget_allocations(program_id);
CREATE INDEX idx_budget_allocations_sipd ON budget_allocations(sipd_code);
```

#### budget_realizations
Realisasi anggaran.

```sql
CREATE TABLE budget_realizations (
    id SERIAL PRIMARY KEY,
    allocation_id INTEGER NOT NULL REFERENCES budget_allocations(id) ON DELETE CASCADE,
    month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
    realization_amount DECIMAL(15,2) NOT NULL,
    cumulative_amount DECIMAL(15,2), -- Auto-calculated
    percentage DECIMAL(5,2), -- Auto-calculated
    sp2d_number VARCHAR(100), -- Nomor SP2D
    sp2d_date DATE,
    description TEXT,
    notes TEXT,
    sipd_sync_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id),
    
    CONSTRAINT check_positive_realization CHECK (realization_amount >= 0),
    UNIQUE(allocation_id, month)
);

CREATE INDEX idx_budget_realizations_allocation ON budget_realizations(allocation_id);
CREATE INDEX idx_budget_realizations_month ON budget_realizations(month);

-- Function to calculate cumulative and percentage
CREATE OR REPLACE FUNCTION calculate_budget_cumulative()
RETURNS TRIGGER AS $$
DECLARE
    total_allocation DECIMAL(15,2);
BEGIN
    -- Calculate cumulative amount
    SELECT COALESCE(SUM(realization_amount), 0) INTO NEW.cumulative_amount
    FROM budget_realizations br
    WHERE br.allocation_id = NEW.allocation_id
      AND br.month <= NEW.month
      AND br.id != COALESCE(NEW.id, 0);
    
    NEW.cumulative_amount := NEW.cumulative_amount + NEW.realization_amount;
    
    -- Get total allocation
    SELECT allocation_amount INTO total_allocation
    FROM budget_allocations
    WHERE id = NEW.allocation_id;
    
    -- Calculate percentage
    IF total_allocation > 0 THEN
        NEW.percentage := (NEW.cumulative_amount / total_allocation) * 100;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_calculate_budget_cumulative
    BEFORE INSERT OR UPDATE ON budget_realizations
    FOR EACH ROW
    EXECUTE FUNCTION calculate_budget_cumulative();
```

### 6. Document Management

#### documents
Manajemen dokumen sistem.

```sql
CREATE TYPE document_type AS ENUM (
    'rpjmd', 'rkpd', 'renstra', 'renja', 'pk', 'iku', 
    'renaksi', 'lkjip', 'evaluation', 'supporting'
);

CREATE TYPE document_status AS ENUM (
    'draft', 'review', 'approved', 'published', 'archived'
);

CREATE TABLE documents (
    id SERIAL PRIMARY KEY,
    opd_id INTEGER REFERENCES opd(id),
    type document_type NOT NULL,
    title VARCHAR(500) NOT NULL,
    description TEXT,
    filename VARCHAR(255) NOT NULL,
    original_filename VARCHAR(255),
    file_path TEXT NOT NULL,
    file_size BIGINT,
    mime_type VARCHAR(100),
    file_hash VARCHAR(64), -- SHA-256 hash for integrity
    version VARCHAR(20) DEFAULT '1.0',
    status document_status DEFAULT 'draft',
    year INTEGER,
    period VARCHAR(50),
    tags JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_public BOOLEAN DEFAULT false,
    download_count INTEGER DEFAULT 0,
    parent_id INTEGER REFERENCES documents(id), -- For versioning
    uploaded_by INTEGER NOT NULL REFERENCES users(id),
    approved_by INTEGER REFERENCES users(id),
    approved_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_documents_opd ON documents(opd_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_status ON documents(status);
CREATE INDEX idx_documents_year ON documents(year);
CREATE INDEX idx_documents_public ON documents(is_public) WHERE is_public = true;
CREATE INDEX idx_documents_hash ON documents(file_hash);

-- Full-text search index
CREATE INDEX idx_documents_search ON documents USING gin(to_tsvector('indonesian', title || ' ' || COALESCE(description, '')));
```

#### document_versions
Version control untuk dokumen.

```sql
CREATE TABLE document_versions (
    id SERIAL PRIMARY KEY,
    document_id INTEGER NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    version VARCHAR(20) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size BIGINT,
    changes_description TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(document_id, version)
);

CREATE INDEX idx_document_versions_document ON document_versions(document_id);
```

### 7. Evaluation Module

#### evaluations
Evaluasi SAKIP internal dan eksternal.

```sql
CREATE TYPE evaluation_type AS ENUM (
    'internal', 'external', 'self_assessment'
);

CREATE TYPE evaluation_status AS ENUM (
    'planned', 'in_progress', 'completed', 'reviewed', 'finalized'
);

CREATE TABLE evaluations (
    id SERIAL PRIMARY KEY,
    opd_id INTEGER NOT NULL REFERENCES opd(id),
    year INTEGER NOT NULL,
    type evaluation_type NOT NULL,
    title VARCHAR(500),
    evaluator VARCHAR(255),
    evaluation_team JSONB DEFAULT '[]'::jsonb, -- Array of evaluator names
    evaluation_date DATE,
    start_date DATE,
    end_date DATE,
    overall_score DECIMAL(5,2),
    grade VARCHAR(5), -- A, B+, B, C+, C, D
    status evaluation_status DEFAULT 'planned',
    components JSONB DEFAULT '{}'::jsonb, -- Detailed component scores
    findings JSONB DEFAULT '[]'::jsonb, -- Array of findings
    recommendations JSONB DEFAULT '[]'::jsonb, -- Array of recommendations
    follow_up_plan TEXT,
    notes TEXT,
    created_by INTEGER NOT NULL REFERENCES users(id),
    reviewed_by INTEGER REFERENCES users(id),
    reviewed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(opd_id, year, type)
);

-- Sample components JSONB structure:
-- {
--   "perencanaan": {"score": 85, "weight": 20, "findings": [...], "recommendations": [...]},
--   "pengukuran": {"score": 82, "weight": 25, "findings": [...], "recommendations": [...]},
--   "pelaporan": {"score": 88, "weight": 25, "findings": [...], "recommendations": [...]},
--   "evaluasi": {"score": 80, "weight": 15, "findings": [...], "recommendations": [...]},
--   "perbaikan": {"score": 78, "weight": 15, "findings": [...], "recommendations": [...]}
-- }

CREATE INDEX idx_evaluations_opd_year ON evaluations(opd_id, year);
CREATE INDEX idx_evaluations_type ON evaluations(type);
CREATE INDEX idx_evaluations_status ON evaluations(status);
```

#### lke_templates
Template Lembar Kerja Evaluasi.

```sql
CREATE TABLE lke_templates (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    version VARCHAR(20) NOT NULL,
    year INTEGER NOT NULL,
    description TEXT,
    components JSONB NOT NULL, -- Template structure
    is_active BOOLEAN DEFAULT true,
    created_by INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    UNIQUE(name, version, year)
);

-- Sample components structure:
-- {
--   "sections": [
--     {
--       "section": "A",
--       "name": "Perencanaan Kinerja", 
--       "weight": 20,
--       "criteria": [
--         {
--           "code": "A.1",
--           "description": "Rencana strategis disusun dengan baik",
--           "max_score": 5,
--           "guidance": "..."
--         }
--       ]
--     }
--   ]
-- }
```

### 8. Integration Module

#### integrations
Konfigurasi integrasi sistem eksternal.

```sql
CREATE TYPE integration_status AS ENUM (
    'active', 'inactive', 'error', 'maintenance'
);

CREATE TABLE integrations (
    id SERIAL PRIMARY KEY,
    system_name VARCHAR(100) NOT NULL,
    system_type VARCHAR(50), -- 'sipd', 'bkn', 'bkd', 'sector'
    display_name VARCHAR(255),
    description TEXT,
    endpoint_url TEXT,
    api_version VARCHAR(20),
    api_key VARCHAR(255),
    credentials JSONB, -- Encrypted credentials
    config JSONB DEFAULT '{}'::jsonb, -- System-specific configuration
    status integration_status DEFAULT 'inactive',
    last_sync TIMESTAMP,
    sync_frequency VARCHAR(20), -- 'daily', 'weekly', 'monthly', 'manual'
    next_sync TIMESTAMP,
    health_score INTEGER DEFAULT 0 CHECK (health_score BETWEEN 0 AND 100),
    error_count INTEGER DEFAULT 0,
    last_error TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_integrations_system ON integrations(system_name);
CREATE INDEX idx_integrations_status ON integrations(status);
CREATE INDEX idx_integrations_next_sync ON integrations(next_sync) WHERE status = 'active';
```

#### sync_logs
Log sinkronisasi data.

```sql
CREATE TYPE sync_status AS ENUM (
    'pending', 'running', 'completed', 'failed', 'cancelled'
);

CREATE TABLE sync_logs (
    id SERIAL PRIMARY KEY,
    integration_id INTEGER NOT NULL REFERENCES integrations(id) ON DELETE CASCADE,
    sync_type VARCHAR(50) NOT NULL, -- 'full', 'incremental', 'manual'
    status sync_status DEFAULT 'pending',
    records_processed INTEGER DEFAULT 0,
    records_success INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    records_skipped INTEGER DEFAULT 0,
    error_message TEXT,
    error_details JSONB,
    sync_data JSONB, -- Summary of synced data
    started_at TIMESTAMP,
    completed_at TIMESTAMP,
    duration_seconds INTEGER,
    triggered_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Partitioning by month
CREATE TABLE sync_logs_2024_01 PARTITION OF sync_logs
    FOR VALUES FROM ('2024-01-01') TO ('2024-02-01');

CREATE INDEX idx_sync_logs_integration ON sync_logs(integration_id);
CREATE INDEX idx_sync_logs_status ON sync_logs(status);
CREATE INDEX idx_sync_logs_date ON sync_logs(started_at);
```

### 9. Notification System

#### notifications
Sistem notifikasi internal.

```sql
CREATE TYPE notification_type AS ENUM (
    'info', 'warning', 'error', 'success', 'reminder'
);

CREATE TYPE notification_priority AS ENUM (
    'low', 'normal', 'high', 'urgent'
);

CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id), -- NULL for broadcast
    opd_id INTEGER REFERENCES opd(id), -- NULL for all OPD
    type notification_type DEFAULT 'info',
    priority notification_priority DEFAULT 'normal',
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    action_url TEXT,
    action_text VARCHAR(100),
    data JSONB, -- Additional data
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMP,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INTEGER REFERENCES users(id)
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_opd ON notifications(opd_id);
CREATE INDEX idx_notifications_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_expires ON notifications(expires_at);
```

## Views and Functions

### 1. Performance Summary View

```sql
CREATE VIEW v_performance_summary AS
SELECT 
    i.id as indicator_id,
    i.name as indicator_name,
    i.unit,
    i.parent_type,
    i.parent_id,
    CASE 
        WHEN i.parent_type = 'tujuan' THEN t.name
        WHEN i.parent_type = 'sasaran' THEN s.name  
        WHEN i.parent_type = 'program' THEN p.name
        WHEN i.parent_type = 'kegiatan' THEN k.name
    END as parent_name,
    o.name as opd_name,
    pa.year,
    pa.quarter,
    pa.month,
    pt.target_value,
    pa.achievement_value,
    pa.percentage,
    CASE 
        WHEN pa.percentage >= 90 THEN 'excellent'
        WHEN pa.percentage >= 75 THEN 'good'
        WHEN pa.percentage >= 60 THEN 'fair'
        ELSE 'poor'
    END as performance_status
FROM indicators i
LEFT JOIN tujuan t ON i.parent_type = 'tujuan' AND i.parent_id = t.id
LEFT JOIN sasaran s ON i.parent_type = 'sasaran' AND i.parent_id = s.id
LEFT JOIN program p ON i.parent_type = 'program' AND i.parent_id = p.id
LEFT JOIN kegiatan k ON i.parent_type = 'kegiatan' AND i.parent_id = k.id
LEFT JOIN renstra r ON (
    (i.parent_type = 'tujuan' AND t.renstra_id = r.id) OR
    (i.parent_type = 'sasaran' AND s.tujuan_id IN (SELECT id FROM tujuan WHERE renstra_id = r.id)) OR
    (i.parent_type = 'program' AND p.sasaran_id IN (SELECT id FROM sasaran WHERE tujuan_id IN (SELECT id FROM tujuan WHERE renstra_id = r.id))) OR
    (i.parent_type = 'kegiatan' AND k.program_id IN (SELECT id FROM program WHERE sasaran_id IN (SELECT id FROM sasaran WHERE tujuan_id IN (SELECT id FROM tujuan WHERE renstra_id = r.id))))
)
LEFT JOIN opd o ON r.opd_id = o.id
LEFT JOIN performance_targets pt ON i.id = pt.indicator_id
LEFT JOIN performance_achievements pa ON i.id = pa.indicator_id 
    AND pt.year = pa.year 
    AND COALESCE(pt.quarter, 0) = COALESCE(pa.quarter, 0)
    AND COALESCE(pt.month, 0) = COALESCE(pa.month, 0)
WHERE i.is_active = true;
```

### 2. Budget Summary View

```sql
CREATE VIEW v_budget_summary AS
SELECT 
    ba.opd_id,
    o.name as opd_name,
    ba.year,
    ba.category,
    SUM(ba.allocation_amount) as total_allocation,
    SUM(COALESCE(br.cumulative_amount, 0)) as total_realization,
    CASE 
        WHEN SUM(ba.allocation_amount) > 0 
        THEN ROUND((SUM(COALESCE(br.cumulative_amount, 0)) / SUM(ba.allocation_amount)) * 100, 2)
        ELSE 0 
    END as absorption_percentage
FROM budget_allocations ba
LEFT JOIN opd o ON ba.opd_id = o.id
LEFT JOIN (
    SELECT 
        allocation_id,
        MAX(cumulative_amount) as cumulative_amount
    FROM budget_realizations 
    GROUP BY allocation_id
) br ON ba.id = br.allocation_id
WHERE ba.is_active = true
GROUP BY ba.opd_id, o.name, ba.year, ba.category;
```

### 3. OPD Ranking Function

```sql
CREATE OR REPLACE FUNCTION calculate_opd_ranking(p_year INTEGER)
RETURNS TABLE (
    rank INTEGER,
    opd_id INTEGER,
    opd_name VARCHAR(255),
    performance_score DECIMAL(5,2),
    budget_score DECIMAL(5,2),
    overall_score DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    WITH performance_scores AS (
        SELECT 
            r.opd_id,
            AVG(pa.percentage) as avg_performance
        FROM renstra r
        JOIN tujuan t ON r.id = t.renstra_id
        JOIN sasaran s ON t.id = s.tujuan_id
        JOIN indicators i ON (i.parent_type = 'sasaran' AND i.parent_id = s.id)
        JOIN performance_achievements pa ON i.id = pa.indicator_id
        WHERE pa.year = p_year
        GROUP BY r.opd_id
    ),
    budget_scores AS (
        SELECT 
            ba.opd_id,
            AVG(
                CASE 
                    WHEN ba.allocation_amount > 0 
                    THEN (br.cumulative_amount / ba.allocation_amount) * 100
                    ELSE 0 
                END
            ) as avg_budget_absorption
        FROM budget_allocations ba
        LEFT JOIN (
            SELECT allocation_id, MAX(cumulative_amount) as cumulative_amount
            FROM budget_realizations 
            GROUP BY allocation_id
        ) br ON ba.id = br.allocation_id
        WHERE ba.year = p_year
        GROUP BY ba.opd_id
    )
    SELECT 
        ROW_NUMBER() OVER (ORDER BY 
            (COALESCE(ps.avg_performance, 0) * 0.7 + COALESCE(bs.avg_budget_absorption, 0) * 0.3) DESC
        )::INTEGER as rank,
        o.id as opd_id,
        o.name as opd_name,
        COALESCE(ps.avg_performance, 0) as performance_score,
        COALESCE(bs.avg_budget_absorption, 0) as budget_score,
        (COALESCE(ps.avg_performance, 0) * 0.7 + COALESCE(bs.avg_budget_absorption, 0) * 0.3) as overall_score
    FROM opd o
    LEFT JOIN performance_scores ps ON o.id = ps.opd_id
    LEFT JOIN budget_scores bs ON o.id = bs.opd_id
    WHERE o.is_active = true
    ORDER BY overall_score DESC;
END;
$$ LANGUAGE plpgsql;
```

## Indexes and Performance

### 1. Composite Indexes

```sql
-- Performance lookup optimization
CREATE INDEX idx_performance_lookup ON performance_achievements(indicator_id, year, quarter, month);
CREATE INDEX idx_performance_targets_lookup ON performance_targets(indicator_id, year, quarter, month);

-- Budget lookup optimization  
CREATE INDEX idx_budget_lookup ON budget_realizations(allocation_id, month);
CREATE INDEX idx_budget_allocation_lookup ON budget_allocations(opd_id, year, category);

-- Hierarchy navigation
CREATE INDEX idx_hierarchy_tujuan ON tujuan(renstra_id, sort_order);
CREATE INDEX idx_hierarchy_sasaran ON sasaran(tujuan_id, sort_order);
CREATE INDEX idx_hierarchy_program ON program(sasaran_id, sort_order);
CREATE INDEX idx_hierarchy_kegiatan ON kegiatan(program_id, sort_order);

-- Search optimization
CREATE INDEX idx_indicators_search ON indicators USING gin(to_tsvector('indonesian', name));
CREATE INDEX idx_documents_search ON documents USING gin(to_tsvector('indonesian', title || ' ' || COALESCE(description, '')));
```

### 2. Partial Indexes

```sql
-- Active records only
CREATE INDEX idx_users_active ON users(role, opd_id) WHERE is_active = true;
CREATE INDEX idx_opd_active ON opd(parent_id) WHERE is_active = true;
CREATE INDEX idx_indicators_active ON indicators(parent_type, parent_id) WHERE is_active = true;

-- Current year data
CREATE INDEX idx_performance_current_year ON performance_achievements(indicator_id, quarter, month) 
WHERE year = EXTRACT(YEAR FROM CURRENT_DATE);

-- Unread notifications
CREATE INDEX idx_notifications_unread ON notifications(user_id, created_at) WHERE is_read = false;
```

## Data Integrity and Constraints

### 1. Check Constraints

```sql
-- Ensure valid percentages
ALTER TABLE performance_achievements 
ADD CONSTRAINT check_valid_percentage 
CHECK (percentage >= 0 AND percentage <= 1000); -- Allow over 100% achievement

-- Ensure positive amounts
ALTER TABLE budget_allocations 
ADD CONSTRAINT check_positive_allocation 
CHECK (allocation_amount >= 0);

ALTER TABLE budget_realizations 
ADD CONSTRAINT check_positive_realization 
CHECK (realization_amount >= 0);

-- Ensure valid dates
ALTER TABLE evaluations 
ADD CONSTRAINT check_evaluation_dates 
CHECK (start_date <= end_date);

-- Ensure valid scores
ALTER TABLE evaluations 
ADD CONSTRAINT check_evaluation_score 
CHECK (overall_score >= 0 AND overall_score <= 100);
```

### 2. Triggers for Data Consistency

```sql
-- Update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to all tables with updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_opd_updated_at BEFORE UPDATE ON opd FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- ... (apply to other tables)

-- Soft delete function
CREATE OR REPLACE FUNCTION soft_delete_cascade()
RETURNS TRIGGER AS $$
BEGIN
    -- When parent is soft deleted, soft delete children
    IF TG_TABLE_NAME = 'renstra' THEN
        UPDATE tujuan SET is_active = false WHERE renstra_id = OLD.id;
    ELSIF TG_TABLE_NAME = 'tujuan' THEN
        UPDATE sasaran SET is_active = false WHERE tujuan_id = OLD.id;
    ELSIF TG_TABLE_NAME = 'sasaran' THEN
        UPDATE program SET is_active = false WHERE sasaran_id = OLD.id;
    ELSIF TG_TABLE_NAME = 'program' THEN
        UPDATE kegiatan SET is_active = false WHERE program_id = OLD.id;
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;
```

## Backup and Maintenance

### 1. Backup Strategy

```sql
-- Create backup schema for point-in-time recovery
CREATE SCHEMA backup;

-- Function to create table snapshots
CREATE OR REPLACE FUNCTION create_table_snapshot(table_name TEXT, snapshot_date DATE)
RETURNS VOID AS $$
BEGIN
    EXECUTE format('CREATE TABLE backup.%I_%s AS SELECT * FROM %I', 
                   table_name, to_char(snapshot_date, 'YYYY_MM_DD'), table_name);
END;
$$ LANGUAGE plpgsql;

-- Automated cleanup of old partitions
CREATE OR REPLACE FUNCTION cleanup_old_partitions()
RETURNS VOID AS $$
DECLARE
    partition_name TEXT;
BEGIN
    -- Drop partitions older than 3 years
    FOR partition_name IN 
        SELECT schemaname||'.'||tablename 
        FROM pg_tables 
        WHERE tablename LIKE '%_202%' 
        AND tablename < 'performance_achievements_' || (EXTRACT(YEAR FROM CURRENT_DATE) - 3)
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || partition_name;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
```

### 2. Data Archiving

```sql
-- Archive old performance data
CREATE TABLE archived_performance_achievements (
    LIKE performance_achievements INCLUDING ALL
);

-- Function to archive old data
CREATE OR REPLACE FUNCTION archive_old_performance_data(archive_before_year INTEGER)
RETURNS INTEGER AS $$
DECLARE
    archived_count INTEGER;
BEGIN
    -- Move old data to archive table
    WITH moved_data AS (
        DELETE FROM performance_achievements 
        WHERE year < archive_before_year
        RETURNING *
    )
    INSERT INTO archived_performance_achievements 
    SELECT * FROM moved_data;
    
    GET DIAGNOSTICS archived_count = ROW_COUNT;
    RETURN archived_count;
END;
$$ LANGUAGE plpgsql;
```

## Security Considerations

### 1. Row Level Security (RLS)

```sql
-- Enable RLS on sensitive tables
ALTER TABLE performance_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_allocations ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_realizations ENABLE ROW LEVEL SECURITY;

-- Policy for OPD-based access
CREATE POLICY opd_access_policy ON performance_achievements
    FOR ALL TO application_role
    USING (
        indicator_id IN (
            SELECT i.id FROM indicators i
            JOIN tujuan t ON (i.parent_type = 'tujuan' AND i.parent_id = t.id)
            JOIN renstra r ON t.renstra_id = r.id
            WHERE r.opd_id = current_setting('app.current_opd_id')::INTEGER
            
            UNION
            
            SELECT i.id FROM indicators i
            JOIN sasaran s ON (i.parent_type = 'sasaran' AND i.parent_id = s.id)
            JOIN tujuan t ON s.tujuan_id = t.id
            JOIN renstra r ON t.renstra_id = r.id
            WHERE r.opd_id = current_setting('app.current_opd_id')::INTEGER
        )
    );

-- Super admin bypass
CREATE POLICY super_admin_bypass ON performance_achievements
    FOR ALL TO application_role
    USING (current_setting('app.user_role') = 'super_admin');
```

### 2. Audit Trail

```sql
-- Audit table for tracking changes
CREATE TABLE audit_trail (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100) NOT NULL,
    record_id INTEGER NOT NULL,
    action VARCHAR(10) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by INTEGER REFERENCES users(id),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT
);

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'DELETE' THEN
        INSERT INTO audit_trail (table_name, record_id, action, old_values, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD), 
                COALESCE(current_setting('app.current_user_id', true)::INTEGER, 0));
        RETURN OLD;
    ELSIF TG_OP = 'UPDATE' THEN
        INSERT INTO audit_trail (table_name, record_id, action, old_values, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD), row_to_json(NEW),
                COALESCE(current_setting('app.current_user_id', true)::INTEGER, 0));
        RETURN NEW;
    ELSIF TG_OP = 'INSERT' THEN
        INSERT INTO audit_trail (table_name, record_id, action, new_values, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW),
                COALESCE(current_setting('app.current_user_id', true)::INTEGER, 0));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Apply audit triggers to important tables
CREATE TRIGGER audit_performance_achievements 
    AFTER INSERT OR UPDATE OR DELETE ON performance_achievements
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();

CREATE TRIGGER audit_budget_realizations 
    AFTER INSERT OR UPDATE OR DELETE ON budget_realizations
    FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
```

---

**© 2024 SAKIP Database Schema Documentation**  
*Comprehensive database design for government performance accountability system*