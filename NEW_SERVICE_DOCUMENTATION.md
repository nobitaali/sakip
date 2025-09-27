# Dokumentasi Service Baru - SAKIP Performance Tree & Cascading

## Overview

Service baru telah dibuat untuk menggantikan struktur JSON lama dengan struktur database relasional yang lebih baik. Service ini mengambil data dari tabel-tabel terpisah dan membangun struktur hierarkis sesuai format yang diinginkan.

## File Structure

```
src/utils/
├── supabase.js                 # Updated API wrapper (backward compatible)
├── performanceTreeService.js   # Service untuk Performance Tree
└── cascadingService.js         # Service untuk Cascading Structure
```

## Performance Tree Service

### Output Format
Service menghasilkan struktur JSON seperti contoh yang Anda berikan:

```json
{
  "id": "1",
  "type": "ULTIMATE OUTCOME",
  "label": "Visi Kepala Daerah",
  "indicators": [],
  "achievement": 80.2,
  "target": 87,
  "status": "on_track",
  "trend": "up",
  "children": [...]
}
```

### Mapping Database ke Performance Tree

| Database Level | Performance Tree Type |
|---|---|
| `visi` | ULTIMATE OUTCOME |
| `misi` | INTERMEDIATE OUTCOME |
| `tujuan` | IMMEDIATE OUTCOME LEVEL 1 |
| `sasaran` | IMMEDIATE OUTCOME LEVEL 2 |
| `program` | OUTPUT |
| `kegiatan` | OUTPUT |
| `sub_kegiatan` | OUTPUT |

### API Functions

```javascript
import { performanceTreeService } from './src/utils/performanceTreeService.js'

// Get complete performance tree
const result = await performanceTreeService.getPerformanceTree()

// Get indicators by OPD
const indicators = await performanceTreeService.getIndicatorsByOPD(opdId)

// Get indicators by type (IKU/IKK)
const ikuIndicators = await performanceTreeService.getIndicatorsByType('IKU')

// Get all OPD
const opdList = await performanceTreeService.getAllOPD()
```

## Cascading Service

### Output Format
Service menghasilkan struktur cascading seperti contoh yang Anda berikan:

```json
{
  "id": "1",
  "name": "Visi Kepala Daerah",
  "type": "visi",
  "description": "Terwujudnya Daerah yang Maju Sejahtera dan Berkelanjutan",
  "children": [...]
}
```

### API Functions

```javascript
import { cascadingService } from './src/utils/cascadingService.js'

// Get complete cascading structure
const result = await cascadingService.getCascadingStructure()

// Get cascading for specific OPD
const opdCascading = await cascadingService.getCascadingByOPD(opdId)
```

## Updated Supabase.js (Backward Compatible)

File `supabase.js` telah diupdate untuk menggunakan service baru sambil mempertahankan kompatibilitas dengan komponen yang sudah ada:

```javascript
import { performanceTreeAPI, cascadingAPI, outcomesAPI } from './utils/supabase.js'

// Existing components can still use these APIs
const treeData = await performanceTreeAPI.loadPerformanceTree()
const cascadingData = await cascadingAPI.loadCascading()
const outcomes = await outcomesAPI.getAllOutcomes()
```

## Sample Data Generated

### Performance Tree
- **Total Nodes**: 13 nodes
- **Hierarchy**: 6 levels (ULTIMATE → INTERMEDIATE → IMMEDIATE L1 → IMMEDIATE L2 → OUTPUT → OUTPUT)
- **OPD Integration**: Dinas Pendidikan, Dinas Kesehatan
- **Indicators**: Mapped from `indikator` table
- **Performance Data**: Achievement, target, status, trend (sample data)

### Cascading Structure
- **Total Nodes**: 9 nodes
- **Hierarchy**: visi → misi → tujuan → sasaran → opd
- **OPD Integration**: Automatic mapping based on indicators
- **Complete Path**: From vision to operational level

## Key Features

### ✅ **Relational Data Integration**
- Data diambil dari tabel terpisah (visi, misi, tujuan, sasaran, program, kegiatan, sub_kegiatan)
- Indikator diambil dari tabel `indikator`
- OPD information dari tabel `opd`

### ✅ **Hierarchical Structure Building**
- Automatic tree building dari relational data
- Proper parent-child relationships
- Recursive structure generation

### ✅ **Performance Metrics**
- Achievement dan target values
- Status calculation (on_track, at_risk, critical)
- Trend indicators (up, down, stable)
- Sample data generation untuk testing

### ✅ **Backward Compatibility**
- Existing components tetap berfungsi
- Same API interface
- Gradual migration path

## Usage in Components

### PerformanceTree Component
```javascript
// Existing code will work without changes
const result = await performanceTreeAPI.loadPerformanceTree()
if (result.success) {
  setTreeData(result.data)
}
```

### CascadingPerformance Component
```javascript
// Existing code will work without changes
const result = await cascadingAPI.loadCascading()
if (result.success) {
  setCascadingData(result.data)
}
```

## Testing

Service telah ditest dan menghasilkan output yang sesuai:

```bash
# Run test
node test-performance-tree-service.js

# Generate JSON output
node output-performance-tree.js
```

## Current Limitations

### ⚠️ **Save Functionality**
- `savePerformanceTree()` dan `saveCascading()` belum diimplementasi
- Perlu parsing tree structure kembali ke tabel relasional
- Saat ini hanya read-only

### ⚠️ **Performance Data**
- Achievement, target, status, trend menggunakan sample data
- Perlu tabel terpisah untuk menyimpan actual performance data

## Next Steps

### 1. **Implement Save Functions**
```javascript
// TODO: Implement these functions
async savePerformanceTree(treeData) {
  // Parse tree and update individual tables
  // Update visi, misi, tujuan, sasaran, program, kegiatan, sub_kegiatan
  // Update indikator table
}

async saveCascading(cascadingData) {
  // Parse cascading and update individual tables
}
```

### 2. **Add Performance Data Tables**
```sql
-- Table for storing actual performance data
CREATE TABLE performance_data (
  id SERIAL PRIMARY KEY,
  indicator_id INTEGER REFERENCES indikator(id),
  period TEXT,
  achievement NUMERIC,
  target NUMERIC,
  status TEXT,
  trend TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### 3. **Update Components**
- Test dengan data real
- Add error handling
- Implement save functionality

## Conclusion

✅ **Service berfungsi dengan baik** dan menghasilkan output sesuai format yang diinginkan
✅ **Backward compatible** dengan komponen existing
✅ **Database structure** sudah optimal dengan relational design
⚠️ **Save functionality** perlu diimplementasi untuk full CRUD operations

Service ini siap digunakan untuk read operations dan dapat di-extend untuk write operations sesuai kebutuhan.