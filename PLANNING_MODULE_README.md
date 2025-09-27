# SAKIP Planning Module - Pohon Kinerja & Cascading Performance

## Overview
This module implements the Planning page for the SAKIP (Sistem Akuntabilitas Kinerja Pemerintah) application with two main components:
1. **Pohon Kinerja (Performance Tree)** - Hierarchical performance structure
2. **Cascading Performance** - Vision to program cascading structure

## Features Implemented

### 1. Pohon Kinerja (Performance Tree)
- **Interactive Tree Structure**: Hierarchical display of outcomes with indicators
- **Outcome Types**: 
  - Ultimate Outcome
  - Intermediate Outcome  
  - Immediate Outcome Level 1 & 2
  - Output
- **Data Structure**: Each outcome contains:
  - Name (nama outcome)
  - Indicators (indikator) - can have multiple indicators per outcome
  - Achievement percentage
  - Target percentage
  - Status (On Track, Perlu Perhatian, Kritis)
  - Trend (Naik, Turun, Stabil)
  - OPD (Organisasi Perangkat Daerah)

### 2. Cascading Performance
- **Flow Diagram**: Visual representation from Vision to Programs
- **Hierarchy Levels**:
  - Visi (Vision)
  - Misi (Mission)
  - Tujuan (Objectives)
  - Sasaran (Targets)
  - OPD (Regional Government Organizations)
  - Program
  - Kegiatan (Activities)
  - Sub Kegiatan (Sub Activities)
- **Interactive Nodes**: Add, edit, delete functionality for each level
- **OPD Integration**: Shows responsible organizations at appropriate levels

### 3. Supabase Integration
- **Real-time Data Storage**: All data is saved to Supabase database
- **Auto-sync**: Changes are automatically saved to the cloud
- **Export Functionality**: JSON export for backup purposes

## Database Schema

### Tables Created:
1. **performance_trees** - Stores hierarchical performance tree data
2. **cascading_performance** - Stores cascading performance flow data  
3. **outcomes** - Stores individual outcome records with indicators

### Key Features:
- JSONB storage for flexible hierarchical data
- Row Level Security (RLS) enabled
- Automatic timestamp updates
- Indexed for performance
- Proper foreign key relationships

## File Structure

```
src/
├── components/
│   ├── PerformanceTree.jsx      # Pohon Kinerja component
│   └── CascadingPerformance.jsx # Cascading Performance component
├── utils/
│   └── supabase.js             # Supabase client and API functions
└── pages/
    └── Planning/
        └── Planning.jsx        # Main planning page with tabs

supabase-schema.sql             # Database schema for Supabase
```

## Usage Instructions

### Setting up Supabase:
1. Create a new Supabase project
2. Run the SQL schema from `supabase-schema.sql`
3. Update the Supabase URL and API key in `src/utils/supabase.js`

### Using the Components:

#### Pohon Kinerja:
1. Click the "Pohon Kinerja" tab in Planning page
2. Use the "+" button to add child outcomes
3. Use the "Edit" button to modify existing outcomes
4. Use the "Simpan ke Supabase" button to save changes
5. Use "Export JSON" to download data

#### Cascading Performance:
1. Click the "Cascading" tab in Planning page
2. Start with the Vision node and add children hierarchically
3. Each level automatically suggests the next appropriate type
4. OPD fields appear for relevant node types
5. Use drag and zoom controls to navigate the diagram

## Technical Implementation

### Key Technologies:
- **React**: Component-based UI
- **ReactFlow**: Interactive flow diagrams for cascading
- **Supabase**: Backend database and real-time sync
- **Tailwind CSS**: Styling and responsive design
- **Lucide React**: Icons

### Data Flow:
1. Components load initial data from Supabase on mount
2. User interactions update local state
3. Save button triggers Supabase sync
4. Real-time updates reflect across sessions

### Performance Optimizations:
- Lazy loading of tree nodes
- Efficient re-rendering with React hooks
- Indexed database queries
- JSONB storage for flexible schema

## Customization Notes

### Adding New Outcome Types:
Update the `getTypeColor` function in PerformanceTree.jsx to add new outcome types with appropriate colors.

### Modifying Cascading Hierarchy:
Update the `typeHierarchy` array in CascadingPerformance.jsx to change the cascading flow structure.

### Styling Customization:
All styling uses Tailwind CSS classes and can be customized through the component files.

## Data Requirements Met

✅ **Pohon Kinerja**: 
- Outcome names and multiple indicators per outcome
- Hierarchical structure with proper nesting
- Performance metrics (achievement, target, status, trend)

✅ **Cascading Performance**:
- Complete hierarchy from Vision to Sub-Activities
- OPD assignment at appropriate levels
- Visual flow representation

✅ **Supabase Integration**:
- Persistent data storage
- Real-time synchronization
- Export capabilities

## Future Enhancements

1. **User Role Management**: Different views for PEMDA vs OPD users
2. **Bulk Import**: Excel/CSV import functionality
3. **Reporting**: Automated report generation
4. **Notifications**: Real-time alerts for performance issues
5. **Mobile Responsiveness**: Enhanced mobile experience

## Support

For technical support or feature requests, refer to the main SAKIP application documentation or contact the development team.