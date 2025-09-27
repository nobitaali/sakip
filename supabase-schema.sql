-- Supabase Schema for SAKIP Performance Management System

-- Table for storing performance tree data
CREATE TABLE performance_trees (
    id TEXT PRIMARY KEY,
    tree_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing cascading performance data
CREATE TABLE cascading_performance (
    id TEXT PRIMARY KEY,
    cascading_data JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Table for storing individual outcomes
CREATE TABLE outcomes (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    indicators JSONB DEFAULT '[]'::jsonb,
    achievement NUMERIC,
    target NUMERIC,
    status TEXT,
    trend TEXT,
    opd TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_performance_trees_updated_at ON performance_trees(updated_at);
CREATE INDEX idx_cascading_performance_updated_at ON cascading_performance(updated_at);
CREATE INDEX idx_outcomes_type ON outcomes(type);
CREATE INDEX idx_outcomes_opd ON outcomes(opd);
CREATE INDEX idx_outcomes_status ON outcomes(status);

-- Enable Row Level Security (RLS)
ALTER TABLE performance_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE cascading_performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE outcomes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable read access for all users" ON performance_trees FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON performance_trees FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON performance_trees FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON performance_trees FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON cascading_performance FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON cascading_performance FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON cascading_performance FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON cascading_performance FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for all users" ON outcomes FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users only" ON outcomes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Enable update for authenticated users only" ON outcomes FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Enable delete for authenticated users only" ON outcomes FOR DELETE USING (auth.role() = 'authenticated');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_performance_trees_updated_at BEFORE UPDATE ON performance_trees FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cascading_performance_updated_at BEFORE UPDATE ON cascading_performance FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_outcomes_updated_at BEFORE UPDATE ON outcomes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data with complete dummy structure
-- Performance Tree Sample with full hierarchy
INSERT INTO performance_trees (id, tree_data) VALUES (
    '1',
    '{
        "id": "1",
        "label": "Penurunan kemiskinan",
        "type": "ULTIMATE OUTCOME",
        "indicators": ["Angka kemiskinan", "Persentase penduduk miskin"],
        "achievement": 85.2,
        "target": 90,
        "status": "at_risk",
        "trend": "up",
        "children": [
            {
                "id": "2",
                "label": "Pembangunan SDM Berkualitas",
                "type": "INTERMEDIATE OUTCOME",
                "indicators": ["Indeks Pembangunan Manusia", "Angka Partisipasi Sekolah"],
                "achievement": 78.5,
                "target": 85,
                "status": "at_risk",
                "trend": "up",
                "children": [
                    {
                        "id": "5",
                        "label": "Peningkatan kualitas pendidikan",
                        "type": "IMMEDIATE OUTCOME LEVEL 1",
                        "indicators": ["Angka Partisipasi Murni", "Nilai Ujian Nasional"],
                        "achievement": 78.3,
                        "target": 85,
                        "status": "at_risk",
                        "trend": "up",
                        "opd": "Dinas Pendidikan",
                        "children": [
                            {
                                "id": "11",
                                "label": "Peningkatan akses pendidikan",
                                "type": "IMMEDIATE OUTCOME LEVEL 2",
                                "indicators": ["Rasio siswa per sekolah", "Jarak rata-rata ke sekolah"],
                                "achievement": 78.3,
                                "target": 85,
                                "status": "at_risk",
                                "trend": "up",
                                "opd": "Dinas Pendidikan",
                                "children": [
                                    {
                                        "id": "3",
                                        "label": "Jumlah sekolah",
                                        "type": "OUTPUT",
                                        "indicators": ["Jumlah sekolah baru", "Jumlah ruang kelas"],
                                        "achievement": 78.3,
                                        "target": 85,
                                        "status": "at_risk",
                                        "trend": "up",
                                        "opd": "Dinas Pendidikan",
                                        "children": []
                                    }
                                ]
                            },
                            {
                                "id": "12",
                                "label": "Angka Partisipasi Sekolah",
                                "type": "IMMEDIATE OUTCOME LEVEL 2",
                                "indicators": ["APS SD", "APS SMP", "APS SMA"],
                                "achievement": 78.3,
                                "target": 85,
                                "status": "at_risk",
                                "trend": "up",
                                "opd": "Dinas Pendidikan",
                                "children": []
                            }
                        ]
                    },
                    {
                        "id": "6",
                        "label": "Kualitas kesehatan",
                        "type": "IMMEDIATE OUTCOME LEVEL 1",
                        "indicators": ["Angka Harapan Hidup", "Angka Kematian Bayi"],
                        "achievement": 78.3,
                        "target": 85,
                        "status": "at_risk",
                        "trend": "up",
                        "opd": "Dinas Kesehatan",
                        "children": [
                            {
                                "id": "13",
                                "label": "Jumlah Rumah Sakit",
                                "type": "OUTPUT",
                                "indicators": ["Jumlah RS", "Jumlah tempat tidur"],
                                "achievement": 78.3,
                                "target": 85,
                                "status": "at_risk",
                                "trend": "up",
                                "opd": "Dinas Kesehatan",
                                "children": []
                            },
                            {
                                "id": "14",
                                "label": "Jumlah Tenaga Medis",
                                "type": "OUTPUT",
                                "indicators": ["Jumlah dokter", "Jumlah perawat"],
                                "achievement": 78.3,
                                "target": 85,
                                "status": "at_risk",
                                "trend": "up",
                                "opd": "Dinas Kesehatan",
                                "children": []
                            }
                        ]
                    }
                ]
            }
        ]
    }'::jsonb
);

-- Cascading Performance Sample with full hierarchy
INSERT INTO cascading_performance (id, cascading_data) VALUES (
    '1',
    '{
        "id": "1",
        "name": "Visi Kepala Daerah",
        "type": "visi",
        "description": "Terwujudnya Daerah yang Maju, Sejahtera, dan Berkelanjutan",
        "children": [
            {
                "id": "2",
                "name": "Misi 1: Meningkatkan Kualitas SDM",
                "type": "misi",
                "description": "Meningkatkan kualitas sumber daya manusia",
                "children": [
                    {
                        "id": "3",
                        "name": "Tujuan 1: Peningkatan Pembangunan Manusia",
                        "type": "tujuan",
                        "description": "Meningkatkan kualitas pendidikan dan kesehatan",
                        "children": [
                            {
                                "id": "4",
                                "name": "Sasaran 1: Peningkatan Kualitas Pendidikan",
                                "type": "sasaran",
                                "description": "Meningkatkan angka partisipasi sekolah",
                                "children": [
                                    {
                                        "id": "5",
                                        "name": "Dinas Pendidikan",
                                        "type": "opd",
                                        "opd": "Dinas Pendidikan",
                                        "children": [
                                            {
                                                "id": "6",
                                                "name": "Peningkatan kualitas pendidikan",
                                                "type": "tujuan",
                                                "opd": "Dinas Pendidikan",
                                                "children": [
                                                    {
                                                        "id": "61",
                                                        "type": "sasaran",
                                                        "name": "Meningkatkan akses pendidikan",
                                                        "children": [
                                                            {
                                                                "id": "7",
                                                                "name": "Program Peningkatan Sarana Prasarana",
                                                                "type": "program",
                                                                "opd": "Dinas Pendidikan",
                                                                "children": [
                                                                    {
                                                                        "id": "71",
                                                                        "type": "kegiatan",
                                                                        "name": "Pengadaan alat penunjang pendidikan",
                                                                        "children": [
                                                                            {
                                                                                "id": "72",
                                                                                "opd": "Dinas Pendidikan",
                                                                                "type": "sub_kegiatan",
                                                                                "name": "Pengadaan laptop",
                                                                                "children": []
                                                                            }
                                                                        ]
                                                                    }
                                                                ]
                                                            }
                                                        ]
                                                    }
                                                ]
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            {
                "id": "8",
                "name": "Misi 2: Meningkatkan Infrastruktur",
                "type": "misi",
                "description": "Membangun infrastruktur yang berkualitas",
                "children": [
                    {
                        "id": "9",
                        "name": "Tujuan 2: Peningkatan Infrastruktur Daerah",
                        "type": "tujuan",
                        "description": "Meningkatkan kualitas infrastruktur",
                        "children": [
                            {
                                "id": "10",
                                "name": "Sasaran 2: Peningkatan Kualitas Jalan",
                                "type": "sasaran",
                                "description": "Meningkatkan kondisi jalan daerah",
                                "children": [
                                    {
                                        "id": "11",
                                        "name": "Dinas PU",
                                        "type": "opd",
                                        "opd": "Dinas Pekerjaan Umum",
                                        "children": [
                                            {
                                                "id": "12",
                                                "name": "Program Pembangunan Jalan",
                                                "type": "program",
                                                "opd": "Dinas PU",
                                                "children": []
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        ]
    }'::jsonb
);

-- Sample outcomes extracted from the performance tree
INSERT INTO outcomes (id, name, type, indicators, achievement, target, status, trend, opd) VALUES 
(
    '1',
    'Penurunan kemiskinan',
    'ULTIMATE OUTCOME',
    '["Angka kemiskinan", "Persentase penduduk miskin"]'::jsonb,
    85.2,
    90,
    'at_risk',
    'up',
    null
),
(
    '2',
    'Pembangunan SDM Berkualitas',
    'INTERMEDIATE OUTCOME',
    '["Indeks Pembangunan Manusia", "Angka Partisipasi Sekolah"]'::jsonb,
    78.5,
    85,
    'at_risk',
    'up',
    null
),
(
    '5',
    'Peningkatan kualitas pendidikan',
    'IMMEDIATE OUTCOME LEVEL 1',
    '["Angka Partisipasi Murni", "Nilai Ujian Nasional"]'::jsonb,
    78.3,
    85,
    'at_risk',
    'up',
    'Dinas Pendidikan'
),
(
    '6',
    'Kualitas kesehatan',
    'IMMEDIATE OUTCOME LEVEL 1',
    '["Angka Harapan Hidup", "Angka Kematian Bayi"]'::jsonb,
    78.3,
    85,
    'at_risk',
    'up',
    'Dinas Kesehatan'
);

COMMENT ON TABLE performance_trees IS 'Stores hierarchical performance tree data structure';
COMMENT ON TABLE cascading_performance IS 'Stores cascading performance data from vision to programs';
COMMENT ON TABLE outcomes IS 'Stores individual outcome data with indicators and performance metrics';