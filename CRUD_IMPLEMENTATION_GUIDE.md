# CRUD Implementation Guide - Performance Tree

## Overview

Implementasi CRUD baru untuk Performance Tree menggunakan struktur database relasional dengan fitur **auto-save** untuk user experience yang optimal.

## Architecture

### 1. **Service Layer**
```
src/utils/
├── performanceTreeCRUD.js    # CRUD operations untuk relational DB
├── performanceTreeService.js # Read operations (existing)
└── supabase.js              # API wrapper (updated)
```

### 2. **Component Layer**
```
src/components/
├── PerformanceTreeNew.jsx   # New component with auto-save
└── PerformanceTree.jsx      # Original component (legacy)
```

## CRUD Operations

### ✅ **CREATE (Add Child)**

**Flow:**
1. User clicks "+" button pada node
2. Form modal muncul dengan tipe child yang sesuai
3. User mengisi data dan klik "Simpan"
4. Data disimpan ke tabel relasional yang sesuai
5. Auto-refresh tree structure
6. Auto-save status ditampilkan

**Database Operations:**
```javascript
// Menentukan tabel target berdasarkan parent type
const tableMapping = {
  'ULTIMATE OUTCOME': 'misi',        // Child akan masuk ke tabel misi
  'INTERMEDIATE OUTCOME': 'tujuan',   // Child akan masuk ke tabel tujuan
  'IMMEDIATE OUTCOME LEVEL 1': 'sasaran',
  'IMMEDIATE OUTCOME LEVEL 2': 'program',
  'OUTPUT': 'kegiatan' // atau sub_kegiatan
}

// Insert ke tabel yang sesuai dengan foreign key
await supabase.from(targetTable).insert({
  id: nextId,
  [parentTable + '_id']: parentId,
  name: childData.label,
  description: childData.description || '...'
})
```

### ✅ **READ (Load Tree)**

**Flow:**
1. Component mount → load tree data
2. Menggunakan `performanceTreeService.getPerformanceTree()`
3. Build hierarchical structure dari relational data
4. Display tree dengan visual components

### ✅ **UPDATE (Edit Node)**

**Flow:**
1. User clicks "Edit" button pada node
2. Form modal muncul dengan data existing
3. User mengubah data dan klik "Update"
4. Data diupdate di tabel relasional yang sesuai
5. Auto-refresh tree structure
6. Auto-save status ditampilkan

**Database Operations:**
```javascript
// Update main record
await supabase.from(tableName).update({
  name: updateData.label,
  description: updateData.description
}).eq('id', nodeId)

// Update indicators (delete + recreate)
await supabase.from('indikator')
  .delete()
  .eq('parent_type', tableName)
  .eq('parent_id', nodeId)

// Create new indicators
await supabase.from('indikator').insert(newIndicators)
```

### ✅ **DELETE (Remove Node)**

**Flow:**
1. User clicks "Delete" button pada node
2. Confirmation dialog muncul
3. User konfirmasi penghapusan
4. Node dan semua children dihapus dari database
5. Auto-refresh tree structure

**Database Operations:**
```javascript
// Delete indicators first
await supabase.from('indikator')
  .delete()
  .eq('parent_type', tableName)
  .eq('parent_id', nodeId)

// Delete main record (cascade will handle children)
await supabase.from(tableName)
  .delete()
  .eq('id', nodeId)
```

## Auto-Save Implementation

### 🚀 **Why Auto-Save?**

**Keuntungan Auto-Save:**
- ✅ **Better UX**: User tidak perlu ingat untuk save
- ✅ **No Data Loss**: Perubahan tersimpan otomatis
- ✅ **Real-time**: Perubahan langsung terlihat
- ✅ **Less Clicks**: Mengurangi friction dalam workflow

**vs Manual Save:**
- ❌ User harus ingat untuk save
- ❌ Risk kehilangan data jika lupa save
- ❌ Extra clicks required

### 🔧 **Auto-Save Features**

#### **1. Debounced Auto-Save**
```javascript
const debouncedRefresh = useCallback(
  performanceTreeCRUD.createAutoSave(async () => {
    setAutoSaveStatus('Menyimpan...');
    // Refresh tree data
    const result = await performanceTreeCRUD.refreshTreeData();
    if (result.success) {
      setTreeData(result.data);
      setAutoSaveStatus('Tersimpan');
    }
  }, 1500), // 1.5 second delay
  []
);
```

#### **2. Visual Feedback**
- **Status Indicator**: "Menyimpan...", "Tersimpan", "Error"
- **Loading States**: Spinner pada buttons dan nodes
- **Timestamp**: "Terakhir disimpan: ..."
- **Color Coding**: Green (success), Blue (saving), Red (error)

#### **3. Error Handling**
```javascript
try {
  const result = await performanceTreeCRUD.addChild(parentId, parentType, childData);
  if (result.success) {
    debouncedRefresh(); // Trigger auto-save
  } else {
    setAutoSaveStatus('Error: ' + result.error);
  }
} catch (error) {
  setAutoSaveStatus('Error');
}
```

## Component Features

### 🎨 **Enhanced UI/UX**

#### **1. Loading States**
- Node-level loading indicators
- Button disabled states
- Spinner animations
- Overlay loading untuk forms

#### **2. Auto-Save Status**
- Real-time status updates
- Color-coded indicators
- Timestamp tracking
- Error notifications

#### **3. Form Improvements**
- Smart type selection (next child type)
- Validation feedback
- Loading states pada submit
- Auto-close on success

#### **4. Visual Enhancements**
- Better color coding untuk node types
- Status badges
- Progress bars
- Hover effects

### 🔄 **Data Flow**

```
User Action → CRUD Operation → Database Update → Auto-Refresh → UI Update
     ↓              ↓                ↓              ↓           ↓
  Add Child → performanceTreeCRUD → Supabase → refreshTreeData → setTreeData
```

## Usage Examples

### **1. Replace Existing Component**
```javascript
// In Planning.jsx
import PerformanceTreeNew from '../../components/PerformanceTreeNew'

// Replace old component
{activeTab === "pohon-kinerja" && <PerformanceTreeNew />}
```

### **2. CRUD Operations**
```javascript
// Add child
const result = await handleAddChild(parentId, parentType, {
  label: 'New Node',
  type: 'OUTPUT',
  achievement: 75,
  target: 90,
  status: 'at_risk',
  trend: 'up',
  opd: 'Dinas Pendidikan'
})

// Edit node
const result = await handleEditNode(nodeId, nodeType, {
  label: 'Updated Name',
  achievement: 80,
  target: 95
})

// Delete node
const result = await handleDeleteNode(nodeId, nodeType)
```

## Database Schema Requirements

### **Current Tables (✅ Available)**
- `visi`, `misi`, `tujuan`, `sasaran`, `program`, `kegiatan`, `sub_kegiatan`
- `indikator` (for indicators)
- `opd` (for organization units)

### **Recommended Addition**
```sql
-- Table for storing performance data
CREATE TABLE performance_data (
  id SERIAL PRIMARY KEY,
  parent_type TEXT NOT NULL,
  parent_id INTEGER NOT NULL,
  period TEXT DEFAULT '2024',
  achievement NUMERIC,
  target NUMERIC,
  status TEXT CHECK (status IN ('on_track', 'at_risk', 'critical')),
  trend TEXT CHECK (trend IN ('up', 'down', 'stable')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index for better performance
CREATE INDEX idx_performance_data_parent ON performance_data(parent_type, parent_id);
```

## Migration Strategy

### **Phase 1: Parallel Implementation**
- ✅ Keep existing PerformanceTree.jsx
- ✅ Add PerformanceTreeNew.jsx
- ✅ Test new implementation
- ✅ User feedback

### **Phase 2: Gradual Migration**
- 🔄 Update Planning.jsx to use new component
- 🔄 Monitor performance and user experience
- 🔄 Fix any issues

### **Phase 3: Full Migration**
- 🔄 Remove old PerformanceTree.jsx
- 🔄 Clean up legacy code
- 🔄 Update documentation

## Performance Considerations

### **Optimizations**
- ✅ Debounced auto-save (1.5s delay)
- ✅ Selective re-rendering
- ✅ Loading states untuk better perceived performance
- ✅ Error boundaries untuk graceful failures

### **Monitoring**
- Track auto-save success rate
- Monitor database query performance
- User experience metrics
- Error logging

## Testing Checklist

### **CRUD Operations**
- [ ] Add child node (all levels)
- [ ] Edit node data
- [ ] Delete node (with confirmation)
- [ ] Indicators management
- [ ] OPD assignment

### **Auto-Save**
- [ ] Auto-save after add
- [ ] Auto-save after edit
- [ ] Auto-save after delete
- [ ] Debouncing works correctly
- [ ] Error handling

### **UI/UX**
- [ ] Loading states
- [ ] Status indicators
- [ ] Form validation
- [ ] Responsive design
- [ ] Accessibility

## Conclusion

✅ **Implementation Complete**: CRUD operations dengan auto-save
✅ **Better UX**: Real-time saving dengan visual feedback
✅ **Robust Error Handling**: Graceful failure management
✅ **Performance Optimized**: Debounced operations
✅ **Future-Ready**: Extensible architecture

**Recommendation**: Gunakan auto-save untuk user experience yang optimal. Manual save button dapat ditambahkan sebagai fallback jika diperlukan.