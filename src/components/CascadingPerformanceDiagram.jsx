import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Save, X, RefreshCw, AlertCircle, CheckCircle, ChevronDown, ChevronUp, Building2, Target, FileText } from 'lucide-react';
import { cascadingAPI } from '../utils/supabase';
import { cascadingCRUD } from '../utils/cascadingCRUD';
import { sampleDataGenerator } from '../utils/sampleDataGenerator';
import EmptyStateHandler from './EmptyStateHandler';

const CascadingNode = ({ node, level = 0, onAddChild, onEditNode, onDeleteNode, autoSaveStatus }) => {
  const [isExpanded, setIsExpanded] = useState(level < 4);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const getNextChildType = (currentType) => {
    const typeMap = {
      'visi': 'misi',
      'misi': 'tujuan',
      'tujuan': 'sasaran',
      'sasaran': 'program',
      'opd': 'program',
      'program': 'kegiatan',
      'kegiatan': 'sub_kegiatan',
      'sub_kegiatan': 'sub_kegiatan'
    }
    return typeMap[currentType] || 'program'
  }

  const [newChild, setNewChild] = useState({
    name: '',
    type: getNextChildType(node.type),
    description: ''
  });

  const [editData, setEditData] = useState({
    name: node.name || '',
    description: node.description || ''
  });

  // Update editData when node changes
  useEffect(() => {
    setEditData({
      name: node.name || '',
      description: node.description || ''
    });
  }, [node]);

  const getTypeColor = (type) => {
    const colors = {
      'visi': 'bg-purple-500 text-white',
      'misi': 'bg-blue-500 text-white',
      'tujuan': 'bg-green-500 text-white',
      'sasaran': 'bg-yellow-500 text-white',
      'opd': 'bg-red-500 text-white',
      'program': 'bg-orange-500 text-white',
      'kegiatan': 'bg-indigo-500 text-white',
      'sub_kegiatan': 'bg-pink-500 text-white'
    }
    return colors[type] || 'bg-gray-500 text-white'
  }

  const getTypeIcon = (type) => {
    const icons = {
      'visi': <Target className="h-4 w-4" />,
      'misi': <FileText className="h-4 w-4" />,
      'tujuan': <CheckCircle className="h-4 w-4" />,
      'sasaran': <AlertCircle className="h-4 w-4" />,
      'opd': <Building2 className="h-4 w-4" />,
      'program': <Plus className="h-4 w-4" />,
      'kegiatan': <Edit className="h-4 w-4" />,
      'sub_kegiatan': <FileText className="h-4 w-4" />
    }
    return icons[type] || <FileText className="h-4 w-4" />
  }

  const getNodeStyle = (type, level) => {
    let baseStyle = "relative bg-white border-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 min-w-[250px] max-w-[300px]";
    
    if (type === 'visi') {
      baseStyle += " bg-gradient-to-br from-purple-50 to-purple-100 border-purple-500";
    } else if (type === 'opd') {
      baseStyle += " bg-gradient-to-br from-red-50 to-red-100 border-red-500";
    } else {
      baseStyle += " border-gray-300";
    }

    return baseStyle;
  };

  const handleAddChild = async () => {
    if (!newChild.name.trim()) return;
    
    setLoading(true);
    try {
      const result = await onAddChild(node.id, node.type, newChild);
      if (result.success) {
        setNewChild({
          name: '',
          type: getNextChildType(node.type),
          description: ''
        });
        setShowAddForm(false);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditNode = async () => {
    if (!editData.name.trim()) return;
    
    setLoading(true);
    try {
      const result = await onEditNode(node.id, node.type, editData);
      if (result.success) {
        setShowEditForm(false);
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNode = async () => {
    if (!window.confirm('Yakin ingin menghapus node ini dan semua child-nya?')) return;
    
    setLoading(true);
    try {
      const result = await onDeleteNode(node.id, node.type);
      if (!result.success) {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node Card */}
      <div className={getNodeStyle(node.type, level)}>
        {/* Loading Indicator */}
        {loading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <RefreshCw className="h-5 w-5 animate-spin text-primary-500" />
          </div>
        )}

        {/* Auto-save Status */}
        {autoSaveStatus && level === 0 && (
          <div className="absolute -top-1 left-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            {autoSaveStatus}
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute -top-2 -right-2 flex space-x-1">
          <button
            onClick={() => setShowAddForm(true)}
            disabled={loading}
            className="bg-primary-500 text-white rounded-full p-1 hover:bg-primary-600 transition-colors shadow-md disabled:opacity-50"
            title="Tambah Child"
          >
            <Plus className="h-3 w-3" />
          </button>
          <button
            onClick={() => setShowEditForm(true)}
            disabled={loading}
            className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50"
            title="Edit Node"
          >
            <Edit className="h-3 w-3" />
          </button>
          {node.type !== 'visi' && (
            <button
              onClick={handleDeleteNode}
              disabled={loading}
              className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md disabled:opacity-50"
              title="Hapus Node"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            {getTypeIcon(node.type)}
            <span className={`text-xs px-2 py-1 rounded ${getTypeColor(node.type)}`}>
              {node.type.toUpperCase()}
            </span>
          </div>
          {hasChildren && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1 text-gray-600 hover:bg-gray-50 rounded"
            >
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          )}
        </div>

        {/* Title */}
        <h3 className={`font-bold mb-2 leading-tight ${node.type === 'visi' ? 'text-lg text-purple-800' : 'text-sm text-gray-900'}`}>
          {node.name}
        </h3>

        {/* Description */}
        {node.description && (
          <p className="text-xs text-gray-600 mb-2 line-clamp-2">
            {node.description}
          </p>
        )}

        {/* OPD Info */}
        {node.opd && (
          <div className="flex items-center text-xs text-gray-600 mb-2">
            <Building2 className="h-3 w-3 mr-1" />
            {node.opd}
          </div>
        )}

        {/* Node Info */}
        <div className="text-xs text-gray-500">
          ID: {node.id}
          {hasChildren && (
            <span className="ml-2">
              • {node.children.length} child{node.children.length !== 1 ? 'ren' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Add Child Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">
              Tambah {getNextChildType(node.type).toUpperCase()} ke: {node.name}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input
                  type="text"
                  value={newChild.name}
                  onChange={(e) => setNewChild({...newChild, name: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Masukkan nama"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Tipe</label>
                <select
                  value={newChild.type}
                  onChange={(e) => setNewChild({...newChild, type: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="misi">Misi</option>
                  <option value="tujuan">Tujuan</option>
                  <option value="sasaran">Sasaran</option>
                  <option value="program">Program</option>
                  <option value="kegiatan">Kegiatan</option>
                  <option value="sub_kegiatan">Sub Kegiatan</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={newChild.description}
                  onChange={(e) => setNewChild({...newChild, description: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Masukkan deskripsi"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleAddChild}
                disabled={loading}
                className="px-4 py-2 bg-primary-500 text-white rounded hover:bg-primary-600 disabled:opacity-50"
              >
                {loading ? 'Menambah...' : 'Tambah'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit: {node.name}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Nama</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Deskripsi</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleEditNode}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Mengupdate...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Connector Line */}
      {hasChildren && isExpanded && (
        <div className="w-px h-8 bg-gray-300 mt-3"></div>
      )}

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative mt-0">
          {node.children.length > 1 && (
            <div className="absolute top-0 left-0 right-0 h-px bg-gray-300 transform translate-y-0"></div>
          )}
          
          <div className="flex items-start justify-center space-x-6 pt-8">
            {node.children.map((child) => (
              <div key={child.id} className="relative flex flex-col items-center">
                <div className="w-px h-8 bg-gray-300 -mt-8"></div>
                <CascadingNode
                  node={child}
                  level={level + 1}
                  onAddChild={onAddChild}
                  onEditNode={onEditNode}
                  onDeleteNode={onDeleteNode}
                  autoSaveStatus={autoSaveStatus}
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const CascadingPerformanceDiagram = ({ period = '2024' }) => {
  const [cascadingData, setCascadingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [lastSaved, setLastSaved] = useState(null);

  // Auto-save with debouncing
  const debouncedRefresh = useCallback(
    cascadingCRUD.createAutoSave(async () => {
      setAutoSaveStatus('Menyimpan...');
      try {
        const result = await cascadingCRUD.refreshCascadingData();
        if (result.success) {
          setCascadingData(result.data);
          setAutoSaveStatus('Tersimpan');
          setLastSaved(new Date());
          setTimeout(() => setAutoSaveStatus(''), 2000);
        }
      } catch (error) {
        setAutoSaveStatus('Error');
        setTimeout(() => setAutoSaveStatus(''), 3000);
      }
    }, 1500),
    []
  );

  useEffect(() => {
    loadCascadingData();
  }, []);

  const loadCascadingData = async () => {
    setLoading(true);
    try {
      const result = await cascadingAPI.loadCascading();
      if (result.success && result.data) {
        setCascadingData(result.data);
      }
    } catch (error) {
      console.error('Error loading cascading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (parentId, parentType, childData) => {
    try {
      const result = await cascadingCRUD.addChild(parentId, parentType, childData);
      if (result.success) {
        debouncedRefresh();
      }
      return result;
    } catch (error) {
      console.error('Error adding child:', error);
      return { success: false, error: error.message };
    }
  };

  const handleEditNode = async (nodeId, nodeType, updateData) => {
    try {
      const result = await cascadingCRUD.updateNode(nodeId, nodeType, updateData);
      if (result.success) {
        debouncedRefresh();
      }
      return result;
    } catch (error) {
      console.error('Error editing node:', error);
      return { success: false, error: error.message };
    }
  };

  const handleDeleteNode = async (nodeId, nodeType) => {
    try {
      const result = await cascadingCRUD.deleteNode(nodeId, nodeType);
      if (result.success) {
        debouncedRefresh();
      }
      return result;
    } catch (error) {
      console.error('Error deleting node:', error);
      return { success: false, error: error.message };
    }
  };

  const exportData = () => {
    if (!cascadingData) return;
    
    const dataStr = JSON.stringify(cascadingData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cascading-performance-${period}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const manualRefresh = async () => {
    setLoading(true);
    await loadCascadingData();
    setLoading(false);
  };

  if (loading && !cascadingData) {
    return (
      <div className="w-full bg-gray-50 rounded-lg border overflow-hidden">
        <div className="p-8 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-500" />
          <span className="ml-3 text-gray-600">Memuat struktur cascading...</span>
        </div>
      </div>
    );
  }

  // Empty state handlers
  const handleCreateSample = async () => {
    setLoading(true);
    try {
      const result = await sampleDataGenerator.generateSamplePerformanceTree();
      if (result.success) {
        alert('Sample data berhasil dibuat! Memuat ulang...');
        await loadCascadingData();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManual = async () => {
    setLoading(true);
    try {
      const result = await sampleDataGenerator.createStarterData();
      if (result.success) {
        alert('Data starter berhasil dibuat! Silakan tambahkan Misi dan struktur lainnya.');
        await loadCascadingData();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadTemplate = async () => {
    setLoading(true);
    try {
      const result = await sampleDataGenerator.loadTemplate('pemda');
      if (result.success) {
        alert('Template PEMDA berhasil dimuat!');
        await loadCascadingData();
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      alert('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImportData = () => {
    alert('Fitur import data akan segera tersedia. Untuk saat ini, gunakan template atau buat manual.');
  };

  if (!cascadingData) {
    return (
      <EmptyStateHandler
        type="cascading"
        onCreateSample={handleCreateSample}
        onCreateManual={handleCreateManual}
        onLoadTemplate={handleLoadTemplate}
        onImportData={handleImportData}
      />
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cascading Performance</h3>
            <p className="text-sm text-gray-600">Struktur cascading kinerja organisasi periode {period}</p>
            {lastSaved && (
              <p className="text-xs text-gray-500 mt-1">
                Terakhir disimpan: {lastSaved.toLocaleString('id-ID')}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              {autoSaveStatus && (
                <span className={`text-xs px-2 py-1 rounded-full ${
                  autoSaveStatus === 'Tersimpan' ? 'bg-green-100 text-green-700' :
                  autoSaveStatus === 'Menyimpan...' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {autoSaveStatus}
                </span>
              )}
              <span className="text-xs text-gray-500">Auto-save aktif</span>
            </div>
            <button
              onClick={manualRefresh}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <button
              onClick={exportData}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              <Save className="h-4 w-4 mr-2" />
              Export JSON
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">Visi</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">Misi</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">Tujuan</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">Sasaran</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span className="text-gray-600">OPD</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
            <span className="text-gray-600">Program</span>
          </div>
        </div>
      </div>

      {/* Cascading Content */}
      <div className="p-8 overflow-x-auto">
        <div className="min-w-max flex justify-center">
          <CascadingNode
            node={cascadingData}
            level={0}
            onAddChild={handleAddChild}
            onEditNode={handleEditNode}
            onDeleteNode={handleDeleteNode}
            autoSaveStatus={autoSaveStatus}
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-gray-100 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-600">
          <span className="font-medium">Auto-save aktif:</span> Perubahan akan tersimpan otomatis. 
          Klik <Plus className="h-3 w-3 inline mx-1" /> untuk menambah child, 
          <Edit className="h-3 w-3 inline mx-1" /> untuk edit, 
          <Trash2 className="h-3 w-3 inline mx-1" /> untuk hapus node
        </p>
      </div>
    </div>
  );
};

export default CascadingPerformanceDiagram;