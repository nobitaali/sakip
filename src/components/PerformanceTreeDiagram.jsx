import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Target, Building2, ChevronDown, ChevronUp, Plus, Edit, Trash2, Save, X, Database, Download, Loader } from 'lucide-react';
import { performanceTreeAPI } from '../utils/supabase';
import { performanceTreeCRUD } from '../utils/performanceTreeCRUDFixed';

const PerformanceNode = ({ node, level = 0, isRoot = false, onAddChild, onEditNode, onDeleteNode, autoSaveStatus }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Determine next child type based on current node type
  const getNextChildType = (currentType) => {
    const typeHierarchy = {
      'ULTIMATE OUTCOME': 'INTERMEDIATE OUTCOME',
      'INTERMEDIATE OUTCOME': 'IMMEDIATE OUTCOME LEVEL 1',
      'IMMEDIATE OUTCOME LEVEL 1': 'IMMEDIATE OUTCOME LEVEL 2',
      'IMMEDIATE OUTCOME LEVEL 2': 'OUTPUT',
      'OUTPUT': 'OUTPUT'
    }
    return typeHierarchy[currentType] || 'OUTPUT'
  }

  const [newChild, setNewChild] = useState({
    label: '',
    type: getNextChildType(node.type),
    achievement: '',
    target: '',
    status: 'at_risk',
    trend: 'up',
    opd: '',
    indicators: []
  });

  const [editData, setEditData] = useState({
    label: node.label,
    achievement: node.achievement || '',
    target: node.target || '',
    status: node.status,
    trend: node.trend || 'up',
    opd: node.opd || '',
    indicators: node.indicators || []
  });

  // Update editData when node changes
  useEffect(() => {
    setEditData({
      label: node.label,
      achievement: node.achievement || '',
      target: node.target || '',
      status: node.status,
      trend: node.trend || 'up',
      opd: node.opd || '',
      indicators: node.indicators || []
    });
  }, [node]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on_track':
        return <CheckCircle className="h-4 w-4 text-success-600" />;
      case 'at_risk':
        return <AlertTriangle className="h-4 w-4 text-warning-600" />;
      case 'critical':
        return <AlertTriangle className="h-4 w-4 text-danger-600" />;
      default:
        return <Target className="h-4 w-4 text-gray-400" />;
    }
  };

  const getTrendIcon = (trend) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="h-3 w-3 text-success-600" />;
      case 'down':
        return <TrendingDown className="h-3 w-3 text-danger-600" />;
      default:
        return <Minus className="h-3 w-3 text-gray-400" />;
    }
  };

  const getNodeStyle = (status, type) => {
    let baseStyle = "relative bg-white border-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 min-w-[280px] max-w-[320px]";
    
    switch (status) {
      case 'on_track':
        baseStyle += " border-success-500";
        break;
      case 'at_risk':
        baseStyle += " border-warning-500";
        break;
      case 'critical':
        baseStyle += " border-danger-500";
        break;
      default:
        baseStyle += " border-gray-300";
    }

    if (isRoot) {
      baseStyle += " bg-gradient-to-br from-primary-50 to-primary-100 border-primary-500";
    }

    return baseStyle;
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'ULTIMATE OUTCOME':
        return 'bg-purple-500 text-white';
      case 'INTERMEDIATE OUTCOME':
        return 'bg-blue-500 text-white';
      case 'IMMEDIATE OUTCOME LEVEL 1':
        return 'bg-green-500 text-white';
      case 'IMMEDIATE OUTCOME LEVEL 2':
        return 'bg-yellow-500 text-white';
      case 'OUTPUT':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  const getProgressColor = (achievement, target) => {
    const percentage = (achievement / target) * 100;
    if (percentage >= 90) return 'bg-success-500';
    if (percentage >= 70) return 'bg-warning-500';
    return 'bg-danger-500';
  };

  const handleAddChild = async () => {
    if (newChild.label.trim()) {
      setIsLoading(true);
      try {
        const result = await onAddChild(node.id, node.type, newChild);
        if (result.success) {
          setNewChild({
            label: '',
            type: getNextChildType(node.type),
            achievement: '',
            target: '',
            status: 'at_risk',
            trend: 'up',
            opd: '',
            indicators: []
          });
          setShowAddForm(false);
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        console.error('Error adding child:', error);
        alert('Error: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditNode = async () => {
    if (editData.label.trim()) {
      setIsLoading(true);
      try {
        const updatedData = {
          ...editData,
          achievement: parseFloat(editData.achievement) || node.achievement,
          target: parseFloat(editData.target) || node.target
        };
        const result = await onEditNode(node.id, node.type, updatedData);
        if (result.success) {
          setShowEditForm(false);
        } else {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        console.error('Error editing node:', error);
        alert('Error: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleDeleteNode = async () => {
    if (window.confirm('Apakah Anda yakin ingin menghapus node ini dan semua child-nya?')) {
      setIsLoading(true);
      try {
        const result = await onDeleteNode(node.id, node.type);
        if (!result.success) {
          alert('Error: ' + result.error);
        }
      } catch (error) {
        console.error('Error deleting node:', error);
        alert('Error: ' + error.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <div className={getNodeStyle(node.status, node.type)}>
        {/* Loading Indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center rounded-lg">
            <Loader className="h-5 w-5 animate-spin text-primary-500" />
          </div>
        )}

        {/* Auto-save Status */}
        {autoSaveStatus && (
          <div className="absolute -top-1 left-2 text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
            {autoSaveStatus}
          </div>
        )}

        {/* Action Buttons */}
        <div className="absolute -top-2 -right-2 flex space-x-1">
          <button
            onClick={() => setShowAddForm(true)}
            disabled={isLoading}
            className="bg-primary-500 text-white rounded-full p-1 hover:bg-primary-600 transition-colors shadow-md disabled:opacity-50"
            title="Tambah Child"
          >
            <Plus className="h-3 w-3" />
          </button>
          <button
            onClick={() => setShowEditForm(true)}
            disabled={isLoading}
            className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors shadow-md disabled:opacity-50"
            title="Edit Node"
          >
            <Edit className="h-3 w-3" />
          </button>
          {!isRoot && (
            <button
              onClick={handleDeleteNode}
              disabled={isLoading}
              className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md disabled:opacity-50"
              title="Hapus Node"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          )}
        </div>

        {/* Type Badge */}
        <div className="flex items-center justify-between mb-3">
          <span className={`text-xs px-3 py-1 rounded-full font-bold ${getTypeColor(node.type)}`}>
            {node.type}
          </span>
          <div className="flex items-center space-x-2">
            {node.trend && getTrendIcon(node.trend)}
            {getStatusIcon(node.status)}
          </div>
        </div>

        {/* Title */}
        <h3 className={`font-bold mb-2 leading-tight ${isRoot ? 'text-lg text-primary-800' : 'text-sm text-gray-900'}`}>
          {node.label}
        </h3>

        {/* Indicators */}
        {node.indicators && node.indicators.length > 0 && (
          <div className="mb-3">
            <p className="text-xs font-medium text-gray-700 mb-1">Indikator:</p>
            <ul className="text-xs text-gray-600 space-y-1">
              {node.indicators.map((indicator, index) => (
                <li key={index} className="flex items-start">
                  <span className="w-1 h-1 bg-gray-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                  {indicator}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* OPD */}
        {node.opd && (
          <div className="flex items-center text-xs text-gray-600 mb-3">
            <Building2 className="h-3 w-3 mr-1" />
            {node.opd}
          </div>
        )}

        {/* Progress */}
        {node.achievement !== undefined && node.target !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-600">
                <span className="font-semibold text-gray-900">{node.achievement}%</span>
              </span>
              <span className="text-gray-600">
                Target: <span className="font-semibold text-gray-900">{node.target}%</span>
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(node.achievement, node.target)}`}
                style={{ width: `${Math.min((node.achievement / node.target) * 100, 100)}%` }}
              ></div>
            </div>
            <div className="text-xs text-center text-gray-500">
              {Math.round((node.achievement / node.target) * 100)}% dari target
            </div>
          </div>
        )}

        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 bg-white border-2 border-gray-300 rounded-full p-1 hover:bg-gray-50 transition-colors"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-600" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-600" />
            )}
          </button>
        )}
      </div>

      {/* Add Child Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tambah Child ke: {node.label}</h3>
              <button onClick={() => setShowAddForm(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={newChild.label}
                  onChange={(e) => setNewChild({...newChild, label: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Masukkan nama node"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tipe</label>
                <select
                  value={newChild.type}
                  onChange={(e) => setNewChild({...newChild, type: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="INTERMEDIATE OUTCOME">INTERMEDIATE OUTCOME</option>
                  <option value="IMMEDIATE OUTCOME LEVEL 1">IMMEDIATE OUTCOME LEVEL 1</option>
                  <option value="IMMEDIATE OUTCOME LEVEL 2">IMMEDIATE OUTCOME LEVEL 2</option>
                  <option value="OUTPUT">OUTPUT</option>
                </select>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capaian (%)</label>
                  <input
                    type="number"
                    value={newChild.achievement}
                    onChange={(e) => setNewChild({...newChild, achievement: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target (%)</label>
                  <input
                    type="number"
                    value={newChild.target}
                    onChange={(e) => setNewChild({...newChild, target: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="100"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={newChild.status}
                  onChange={(e) => setNewChild({...newChild, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="on_track">On Track</option>
                  <option value="at_risk">Perlu Perhatian</option>
                  <option value="critical">Kritis</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trend</label>
                <select
                  value={newChild.trend}
                  onChange={(e) => setNewChild({...newChild, trend: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="up">Naik</option>
                  <option value="down">Turun</option>
                  <option value="stable">Stabil</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OPD</label>
                <input
                  type="text"
                  value={newChild.opd}
                  onChange={(e) => setNewChild({...newChild, opd: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder="Nama OPD (opsional)"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleAddChild}
                disabled={isLoading}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50"
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin inline mr-2" /> : <Save className="h-4 w-4 inline mr-2" />}
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Edit Node</h3>
              <button onClick={() => setShowEditForm(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={editData.label}
                  onChange={(e) => setEditData({...editData, label: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Capaian (%)</label>
                  <input
                    type="number"
                    value={editData.achievement}
                    onChange={(e) => setEditData({...editData, achievement: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Target (%)</label>
                  <input
                    type="number"
                    value={editData.target}
                    onChange={(e) => setEditData({...editData, target: e.target.value})}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({...editData, status: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="on_track">On Track</option>
                  <option value="at_risk">Perlu Perhatian</option>
                  <option value="critical">Kritis</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Trend</label>
                <select
                  value={editData.trend}
                  onChange={(e) => setEditData({...editData, trend: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="up">Naik</option>
                  <option value="down">Turun</option>
                  <option value="stable">Stabil</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">OPD</label>
                <input
                  type="text"
                  value={editData.opd}
                  onChange={(e) => setEditData({...editData, opd: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Batal
              </button>
              <button
                onClick={handleEditNode}
                disabled={isLoading}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {isLoading ? <Loader className="h-4 w-4 animate-spin inline mr-2" /> : <Save className="h-4 w-4 inline mr-2" />}
                Update
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
          
          <div className="flex items-start justify-center space-x-8 pt-8">
            {node.children.map((child, index) => (
              <div key={child.id} className="relative flex flex-col items-center">
                <div className="w-px h-8 bg-gray-300 -mt-8"></div>
                <PerformanceNode 
                  node={child} 
                  level={level + 1}
                  isRoot={false}
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

const PerformanceTreeDiagram = ({ period = '2024' }) => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  const [lastSaved, setLastSaved] = useState(null);

  // Auto-save with debouncing
  const debouncedRefresh = useCallback(
    performanceTreeCRUD.createAutoSave(async () => {
      setAutoSaveStatus('Menyimpan...');
      try {
        const result = await performanceTreeCRUD.refreshTreeData();
        if (result.success) {
          setTreeData(result.data);
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

  // Load initial data
  useEffect(() => {
    loadPerformanceTreeData();
  }, []);

  const loadPerformanceTreeData = async () => {
    setLoading(true);
    try {
      const result = await performanceTreeAPI.loadPerformanceTree();
      if (result.success && result.data) {
        setTreeData(result.data);
      }
    } catch (error) {
      console.error('Error loading performance tree:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddChild = async (parentId, parentType, childData) => {
    try {
      const result = await performanceTreeCRUD.addChild(parentId, parentType, childData);
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
      const result = await performanceTreeCRUD.updateNode(nodeId, nodeType, updateData);
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
      const result = await performanceTreeCRUD.deleteNode(nodeId, nodeType);
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
    if (!treeData) return;
    
    const dataStr = JSON.stringify(treeData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `pohon-kinerja-${period}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const manualRefresh = async () => {
    setLoading(true);
    await loadPerformanceTreeData();
    setLoading(false);
  };

  if (loading && !treeData) {
    return (
      <div className="w-full bg-gray-50 rounded-lg border overflow-hidden">
        <div className="p-8 flex items-center justify-center">
          <Loader className="h-8 w-8 animate-spin text-primary-500" />
          <span className="ml-3 text-gray-600">Memuat pohon kinerja...</span>
        </div>
      </div>
    );
  }

  if (!treeData) {
    return (
      <div className="w-full bg-gray-50 rounded-lg border overflow-hidden">
        <div className="p-8 text-center">
          <p className="text-gray-600">Tidak ada data pohon kinerja</p>
          <button 
            onClick={manualRefresh}
            className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            Muat Ulang
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full bg-gray-50 rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pohon Kinerja Organisasi</h3>
            <p className="text-sm text-gray-600">Struktur hirarki kinerja daerah periode {period}</p>
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
              {loading ? <Loader className="h-4 w-4 mr-2 animate-spin" /> : <Database className="h-4 w-4 mr-2" />}
              Refresh
            </button>
            <button
              onClick={exportData}
              className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-600"
            >
              <Download className="h-4 w-4 mr-2" />
              Export JSON
            </button>
          </div>
        </div>
        
        <div className="flex items-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-success-500 rounded-full"></div>
            <span className="text-gray-600">On Track</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-warning-500 rounded-full"></div>
            <span className="text-gray-600">Perlu Perhatian</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-danger-500 rounded-full"></div>
            <span className="text-gray-600">Kritis</span>
          </div>
        </div>
      </div>

      {/* Tree Content */}
      <div className="p-8 overflow-x-auto">
        <div className="min-w-max flex justify-center">
          <PerformanceNode 
            node={treeData} 
            level={0}
            isRoot={true}
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

export default PerformanceTreeDiagram;