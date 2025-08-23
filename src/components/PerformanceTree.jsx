import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Target, Building2, ChevronDown, ChevronUp, Plus, Edit, Trash2, Save, X } from 'lucide-react';

const PerformanceNode = ({ node, level = 0, isRoot = false, onAddChild, onEditNode, onDeleteNode }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newChild, setNewChild] = useState({
    label: '',
    type: 'IKU',
    achievement: '',
    target: '',
    status: 'at_risk',
    trend: 'up',
    opd: ''
  });
  const [editData, setEditData] = useState({
    label: node.label,
    achievement: node.achievement || '',
    target: node.target || '',
    status: node.status,
    trend: node.trend || 'up',
    opd: node.opd || ''
  });

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
      case 'VISI':
        return 'bg-purple-500 text-white';
      case 'MISI':
        return 'bg-blue-500 text-white';
      case 'PROGRAM':
        return 'bg-green-500 text-white';
      case 'IKU':
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

  const handleAddChild = () => {
    if (newChild.label.trim()) {
      const childData = {
        ...newChild,
        id: Date.now().toString(),
        achievement: parseFloat(newChild.achievement) || 0,
        target: parseFloat(newChild.target) || 100,
        children: []
      };
      onAddChild(node.id, childData);
      setNewChild({
        label: '',
        type: 'IKU',
        achievement: '',
        target: '',
        status: 'at_risk',
        trend: 'up',
        opd: ''
      });
      setShowAddForm(false);
    }
  };

  const handleEditNode = () => {
    if (editData.label.trim()) {
      const updatedData = {
        ...editData,
        achievement: parseFloat(editData.achievement) || node.achievement,
        target: parseFloat(editData.target) || node.target
      };
      onEditNode(node.id, updatedData);
      setShowEditForm(false);
    }
  };

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <div className={getNodeStyle(node.status, node.type)}>
        {/* Action Buttons */}
        <div className="absolute -top-2 -right-2 flex space-x-1">
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-primary-500 text-white rounded-full p-1 hover:bg-primary-600 transition-colors shadow-md"
            title="Tambah Child"
          >
            <Plus className="h-3 w-3" />
          </button>
          <button
            onClick={() => setShowEditForm(true)}
            className="bg-blue-500 text-white rounded-full p-1 hover:bg-blue-600 transition-colors shadow-md"
            title="Edit Node"
          >
            <Edit className="h-3 w-3" />
          </button>
          {!isRoot && (
            <button
              onClick={() => onDeleteNode(node.id)}
              className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
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
                  <option value="MISI">MISI</option>
                  <option value="PROGRAM">PROGRAM</option>
                  <option value="IKU">IKU</option>
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
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600"
              >
                <Save className="h-4 w-4 inline mr-2" />
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
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                <Save className="h-4 w-4 inline mr-2" />
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
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const PerformanceTree = ({ period = '2024' }) => {
  const [treeData, setTreeData] = useState({
    id: '1',
    label: 'Kinerja Keseluruhan Daerah',
    type: 'VISI',
    achievement: 85.2,
    target: 90,
    status: 'at_risk',
    trend: 'up',
    children: [
      {
        id: '2',
        label: 'Pembangunan SDM Berkualitas',
        type: 'MISI',
        achievement: 78.5,
        target: 85,
        status: 'at_risk',
        trend: 'up',
        children: [
          {
            id: '5',
            label: 'Program Pendidikan',
            type: 'PROGRAM',
            achievement: 78.3,
            target: 85,
            status: 'at_risk',
            trend: 'up',
            opd: 'Dinas Pendidikan',
            children: [
              {
                id: '11',
                label: 'Angka Partisipasi Sekolah',
                type: 'IKU',
                achievement: 78.3,
                target: 85,
                status: 'at_risk',
                trend: 'up',
                opd: 'Dinas Pendidikan',
                children: []
              }
            ]
          }
        ]
      }
    ]
  });

  const findNodeById = (node, id) => {
    if (node.id === id) return node;
    if (node.children) {
      for (let child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  };

  const handleAddChild = (parentId, childData) => {
    setTreeData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const parent = findNodeById(newData, parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(childData);
      }
      return newData;
    });
  };

  const handleEditNode = (nodeId, updatedData) => {
    setTreeData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const node = findNodeById(newData, nodeId);
      if (node) {
        Object.assign(node, updatedData);
      }
      return newData;
    });
  };

  const handleDeleteNode = (nodeId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus node ini?')) {
      setTreeData(prevData => {
        const newData = JSON.parse(JSON.stringify(prevData));
        
        const deleteFromParent = (parent) => {
          if (parent.children) {
            parent.children = parent.children.filter(child => {
              if (child.id === nodeId) return false;
              deleteFromParent(child);
              return true;
            });
          }
        };
        
        deleteFromParent(newData);
        return newData;
      });
    }
  };

  return (
    <div className="w-full bg-gray-50 rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Pohon Kinerja Organisasi</h3>
            <p className="text-sm text-gray-600">Struktur hirarki kinerja daerah periode {period}</p>
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
          />
        </div>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-gray-100 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-600">
          Klik tombol <Plus className="h-3 w-3 inline mx-1" /> untuk menambah child, 
          <Edit className="h-3 w-3 inline mx-1" /> untuk edit, 
          <Trash2 className="h-3 w-3 inline mx-1" /> untuk hapus node
        </p>
      </div>
    </div>
  );
};

export default PerformanceTree;