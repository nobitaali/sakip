-- ========================================
-- 1️⃣ Tabel Master Struktur Pemerintahan
-- ========================================
CREATE TABLE visi (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE misi (
    id SERIAL PRIMARY KEY,
    visi_id INTEGER NOT NULL REFERENCES visi(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE tujuan (
    id SERIAL PRIMARY KEY,
    misi_id INTEGER NOT NULL REFERENCES misi(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE sasaran (
    id SERIAL PRIMARY KEY,
    tujuan_id INTEGER NOT NULL REFERENCES tujuan(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE program (
    id SERIAL PRIMARY KEY,
    sasaran_id INTEGER NOT NULL REFERENCES sasaran(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE kegiatan (
    id SERIAL PRIMARY KEY,
    program_id INTEGER NOT NULL REFERENCES program(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE sub_kegiatan (
    id SERIAL PRIMARY KEY,
    kegiatan_id INTEGER NOT NULL REFERENCES kegiatan(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT
);

CREATE TABLE opd (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    head_name VARCHAR(255),
    head_nip VARCHAR(20),
    level INTEGER DEFAULT 1
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255),
    role VARCHAR(50),
    opd_id INTEGER REFERENCES opd(id)
);

-- ========================================
-- 2️⃣ Tabel Indikator & Cascading
-- ========================================
CREATE TABLE indikator (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50), -- IKU, IKK, Output
    parent_type VARCHAR(50), -- tujuan, sasaran, program, kegiatan
    parent_id INTEGER NOT NULL,
    opd_id INTEGER REFERENCES opd(id)
);

CREATE TABLE indikator_cascading (
    id SERIAL PRIMARY KEY,
    parent_indicator_id INTEGER NOT NULL REFERENCES indikator(id),
    child_indicator_id INTEGER NOT NULL REFERENCES indikator(id),
    unit_id INTEGER NOT NULL REFERENCES opd(id),
    contribution_percent DECIMAL(5,2) DEFAULT 100
);

CREATE TABLE indikator_target (
    id SERIAL PRIMARY KEY,
    indikator_id INTEGER NOT NULL REFERENCES indikator(id),
    year INTEGER NOT NULL,
    target_value DECIMAL(10,2)
);

CREATE TABLE indikator_achievement (
    id SERIAL PRIMARY KEY,
    indikator_id INTEGER NOT NULL REFERENCES indikator(id),
    year INTEGER NOT NULL,
    achievement_value DECIMAL(10,2)
);

-- ========================================
-- 3️⃣ Tabel Anggaran
-- ========================================
CREATE TABLE budget_allocation (
    id SERIAL PRIMARY KEY,
    opd_id INTEGER NOT NULL REFERENCES opd(id),
    year INTEGER NOT NULL,
    category VARCHAR(50),
    allocation_amount DECIMAL(15,2)
);

CREATE TABLE budget_realization (
    id SERIAL PRIMARY KEY,
    allocation_id INTEGER NOT NULL REFERENCES budget_allocation(id),
    month INTEGER,
    realization_amount DECIMAL(15,2)
);

-- ========================================
-- 4️⃣ Tabel Dokumen
-- ========================================
CREATE TABLE dokumen (
    id SERIAL PRIMARY KEY,
    opd_id INTEGER REFERENCES opd(id),
    name VARCHAR(255),
    type VARCHAR(50),
    version VARCHAR(20)
);

CREATE TABLE dokumen_version (
    id SERIAL PRIMARY KEY,
    dokumen_id INTEGER NOT NULL REFERENCES dokumen(id),
    version VARCHAR(20),
    filename VARCHAR(255)
);

-- ========================================
-- 5️⃣ Evaluasi
-- ========================================
CREATE TABLE evaluasi (
    id SERIAL PRIMARY KEY,
    opd_id INTEGER REFERENCES opd(id),
    year INTEGER,
    type VARCHAR(50),
    score DECIMAL(5,2),
    grade VARCHAR(5)
);

-- ========================================
-- 6️⃣ LKE Template
-- ========================================
CREATE TABLE lke_template (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    version VARCHAR(20),
    components JSONB
);

-- ========================================
-- 7️⃣ Insert Data OPD
-- ========================================
INSERT INTO opd(id, name) VALUES 
(1,'Dinas Pendidikan'), 
(2,'Dinas Kesehatan'), 
(3,'Dinas PU');

-- ========================================
-- 8️⃣ Insert Data Visi & Misi
-- ========================================
INSERT INTO visi(id,name,description) VALUES 
(1,'Visi Kepala Daerah','Terwujudnya Daerah yang Maju, Sejahtera, dan Berkelanjutan');

INSERT INTO misi(id,visi_id,name,description) VALUES 
(1,1,'Meningkatkan Kualitas SDM','Meningkatkan kualitas manusia'),
(2,1,'Meningkatkan Infrastruktur','Membangun infrastruktur yang berkualitas');

-- ========================================
-- 9️⃣ Insert Data Tujuan & Sasaran
-- ========================================
INSERT INTO tujuan(id,misi_id,name,description) VALUES 
(1,1,'Peningkatan Pembangunan Manusia','...'),
(2,2,'Peningkatan Infrastruktur Daerah','...');

INSERT INTO sasaran(id,tujuan_id,name,description) VALUES 
(1,1,'Peningkatan Kualitas Pendidikan','Meningkatkan kualitas pendidikan'),
(2,2,'Peningkatan Kualitas Jalan','Meningkatkan kondisi jalan');

-- ========================================
-- 10️⃣ Insert Program, Kegiatan & Sub-Kegiatan
-- ========================================
INSERT INTO program(id,sasaran_id,name,description) VALUES 
(1,1,'Program Peningkatan Sarana Prasarana','...'),
(2,2,'Program Pembangunan Jalan','...');

INSERT INTO kegiatan(id,program_id,name,description) VALUES 
(1,1,'Pengadaan alat penunjang pendidikan','...'),
(2,2,'Pembangunan jalan utama','...');

INSERT INTO sub_kegiatan(id,kegiatan_id,name,description) VALUES 
(1,1,'Pengadaan laptop','...'),
(2,2,'Pengaspalan jalan','...');

-- ========================================
-- 11️⃣ Insert Indikator (Ultimate, Intermediate, Immediate, Output)
-- ========================================
-- Ultimate Outcome
INSERT INTO indikator(id,name,type,parent_type,parent_id,opd_id) VALUES
(1,'Penurunan Kemiskinan','IKU','tujuan',1,NULL);

-- Intermediate Outcome
INSERT INTO indikator(id,name,type,parent_type,parent_id,opd_id) VALUES
(2,'Pembangunan SDM Berkualitas','IKU','tujuan',1,1);

-- Immediate Outcome
INSERT INTO indikator(id,name,type,parent_type,parent_id,opd_id) VALUES
(3,'Peningkatan kualitas pendidikan','IKK','sasaran',1,1),
(4,'Kualitas kesehatan','IKK','sasaran',1,2),
(5,'Angka Partisipasi Sekolah','IKK','sasaran',1,1);

-- Output
INSERT INTO indikator(id,name,type,parent_type,parent_id,opd_id) VALUES
(6,'Jumlah Sekolah','Output','kegiatan',1,1),
(7,'Jumlah Rumah Sakit','Output','kegiatan',2,2),
(8,'Jumlah Tenaga Medis','Output','kegiatan',2,2);

-- ========================================
-- 12️⃣ Insert Cascading Indikator
-- ========================================
INSERT INTO indikator_cascading(parent_indicator_id,child_indicator_id,unit_id,contribution_percent) VALUES 
-- Ultimate → Intermediate
(1,2,1,50),
(1,4,2,50),

-- Intermediate → Immediate
(2,3,1,100),
(2,5,1,100),
(4,8,2,100),

-- Immediate → Output
(3,6,1,100),
(4,7,2,50),
(4,8,2,50);

-- ========================================
-- 13️⃣ Insert Target & Achievement
-- ========================================
INSERT INTO indikator_target(indikator_id,year,target_value) VALUES 
(1,2025,90), (2,2025,85), (3,2025,85), (4,2025,85), (5,2025,85), (6,2025,85), (7,2025,85), (8,2025,85);

INSERT INTO indikator_achievement(indikator_id,year,achievement_value) VALUES
(1,2025,85.2), (2,2025,78.5), (3,2025,78.3), (4,2025,78.3), (5,2025,78.3), (6,2025,78.3), (7,2025,78.3), (8,2025,78.3);

-- ========================================
-- 14️⃣ Insert Budget Allocation & Realization
-- ========================================
INSERT INTO budget_allocation(id,opd_id,year,category,allocation_amount) VALUES 
(1,1,2025,'belanja_barang',100000000),
(2,2,2025,'belanja_modal',50000000);

INSERT INTO budget_realization(id,allocation_id,month,realization_amount) VALUES
(1,1,1,8000000),
(2,2,1,4500000);

-- ========================================
-- 15️⃣ Insert Dokumen & Version
-- ========================================
INSERT INTO dokumen(id,opd_id,name,type,version) VALUES
(1,1,'Renstra Dinas Pendidikan','renstra','1.0');

INSERT INTO dokumen_version(dokumen_id,version,filename) VALUES
(1,'1.0','renstra_diknas_v1.pdf');

-- ========================================
-- 16️⃣ Insert Evaluasi
-- ========================================
INSERT INTO evaluasi(id,opd_id,year,type,score,grade) VALUES
(1,1,2025,'internal',85,'B'),
(2,2,2025,'internal',80,'B');

-- ========================================
-- 17️⃣ Insert LKE Template
-- ========================================
INSERT INTO lke_template(id,name,version,components) VALUES
(1,'Template LKE Pendidikan','1.0','{"sections":[{"name":"Perencanaan","weight":20}]}');
