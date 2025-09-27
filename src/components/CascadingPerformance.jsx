import React, { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Save, X, Building2, Database, Download, ChevronDown, ChevronUp } from "lucide-react";
import { cascadingAPI } from '../utils/supabase';

// Cascading Node Component (similar to PerformanceNode)
const CascadingNode = ({ node, level = 0, isRoot = false, onAddChild, onEditNode, onDeleteNode }) => {
  const [isExpanded, setIsExpanded] = useState(level < 3);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newChild, setNewChild] = useState({
    name: "",
    type: getNextType(node.type),
    description: "",
    opd: "",
  });
  const [editData, setEditData] = useState({
    name: node.name,
    description: node.description || "",
    opd: node.opd || "",
  });

  function getNextType(currentType) {
    const typeHierarchy = [
      "visi",
      "misi",
      "tujuan",
      "sasaran",
      "opd",
      "program",
      "kegiatan",
      "sub_kegiatan",
    ];
    const currentIndex = typeHierarchy.indexOf(currentType);
    return currentIndex < typeHierarchy.length - 1
      ? typeHierarchy[currentIndex + 1]
      : "sub_kegiatan";
  }

  const getTypeColor = (type) => {
    const colors = {
      visi: "bg-purple-500 text-white",
      misi: "bg-blue-500 text-white",
      tujuan: "bg-green-500 text-white",
      sasaran: "bg-yellow-500 text-white",
      opd: "bg-red-500 text-white",
      program: "bg-orange-500 text-white",
      kegiatan: "bg-indigo-500 text-white",
      sub_kegiatan: "bg-pink-500 text-white",
    };
    return colors[type] || "bg-gray-500 text-white";
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "visi":
        return "🎯";
      case "misi":
        return "🚀";
      case "tujuan":
        return "📋";
      case "sasaran":
        return "🎪";
      case "opd":
        return "🏢";
      case "program":
        return "⚡";
      case "kegiatan":
        return "📝";
      case "sub_kegiatan":
        return "📌";
      default:
        return "📄";
    }
  };

  const getNodeStyle = (type) => {
    let baseStyle = "relative bg-white border-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 min-w-[280px] max-w-[320px]";
    
    switch (type) {
      case "visi":
        baseStyle += " border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100";
        break;
      case "misi":
        baseStyle += " border-blue-500";
        break;
      case "tujuan":
        baseStyle += " border-green-500";
        break;
      case "sasaran":
        baseStyle += " border-yellow-500";
        break;
      case "opd":
        baseStyle += " border-red-500";
        break;
      case "program":
        baseStyle += " border-orange-500";
        break;
      case "kegiatan":
        baseStyle += " border-indigo-500";
        break;
      case "sub_kegiatan":
        baseStyle += " border-pink-500";
        break;
      default:
        baseStyle += " border-gray-300";
    }

    return baseStyle;
  };

  const handleAddChild = () => {
    if (newChild.name.trim()) {
      const childData = {
        ...newChild,
        id: Date.now().toString(),
        children: []
      };
      onAddChild(node.id, childData);
      setNewChild({
        name: "",
        type: getNextType(node.type),
        description: "",
        opd: "",
      });
      setShowAddForm(false);
    }
  };

  const handleEditNode = () => {
    if (editData.name.trim()) {
      onEditNode(node.id, editData);
      setShowEditForm(false);
    }
  };

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <div className={getNodeStyle(node.type)}>
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
            {node.type.toUpperCase()}
          </span>
          <span className="text-lg">{getTypeIcon(node.type)}</span>
        </div>

        {/* Title */}
        <h3 className={`font-bold mb-2 leading-tight ${isRoot ? 'text-lg text-purple-800' : 'text-sm text-gray-900'}`}>
          {node.name}
        </h3>

        {/* Description */}
        {node.description && (
          <p className="text-xs text-gray-600 mb-2">{node.description}</p>
        )}

        {/* OPD */}
        {node.opd && (
          <div className="flex items-center text-xs text-gray-600 mb-3">
            <Building2 className="h-3 w-3 mr-1" />
            {node.opd}
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
              <h3 className="text-lg font-semibold">
                Tambah {getNextType(node.type).toUpperCase()}
              </h3>
              <button onClick={() => setShowAddForm(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  value={newChild.name}
                  onChange={(e) =>
                    setNewChild({ ...newChild, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={`Masukkan nama ${newChild.type}`}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={newChild.description}
                  onChange={(e) =>
                    setNewChild({ ...newChild, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Deskripsi (opsional)"
                />
              </div>

              {(newChild.type === "opd" || newChild.type === "program" || newChild.type === "kegiatan" || newChild.type === "sub_kegiatan") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newChild.type === "opd"
                      ? "Nama OPD"
                      : "Penanggung Jawab OPD"}
                  </label>
                  <input
                    type="text"
                    value={newChild.opd}
                    onChange={(e) =>
                      setNewChild({ ...newChild, opd: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    placeholder="Nama OPD"
                  />
                </div>
              )}
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
              <h3 className="text-lg font-semibold">
                Edit {node.type.toUpperCase()}
              </h3>
              <button onClick={() => setShowEditForm(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nama
                </label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) =>
                    setEditData({ ...editData, name: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Deskripsi
                </label>
                <textarea
                  value={editData.description}
                  onChange={(e) =>
                    setEditData({ ...editData, description: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                />
              </div>

              {(node.type === "opd" || node.type === "program" || node.type === "kegiatan" || node.type === "sub_kegiatan") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    OPD
                  </label>
                  <input
                    type="text"
                    value={editData.opd}
                    onChange={(e) =>
                      setEditData({ ...editData, opd: e.target.value })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                </div>
              )}
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
                <CascadingNode 
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

const CascadingPerformance = ({ period = "2024" }) => {
  // untuk level pemda {}
  // diagramnya sampai level opd / organisasi perangkat daerah contoh dinas pendidikan,kecamatan,
  // untuk level atau user opd
  //diagramnya

  const [cascadingData, setCascadingData] = useState({
    id: "1",
    name: "Visi Kepala Daerah",
    type: "visi",
    description: "Masukkan visi kepala daerah",
    children: []
  });

  const [loading, setLoading] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Load data from Supabase on component mount
  useEffect(() => {
    loadCascadingData();
  }, []);

  const loadCascadingData = async () => {
    setLoading(true);
    try {
      const result = await cascadingAPI.loadCascading('1');
      if (result.success && result.data) {
        setCascadingData(result.data);
      }
    } catch (error) {
      console.error('Error loading cascading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToSupabase = async () => {
    setLoading(true);
    setSaveStatus('Menyimpan...');
    
    try {
      const result = await cascadingAPI.saveCascading(cascadingData);
      
      if (result.success) {
        setSaveStatus('Data berhasil disimpan ke Supabase!');
        setTimeout(() => setSaveStatus(''), 3000);
      } else {
        setSaveStatus('Gagal menyimpan data');
        setTimeout(() => setSaveStatus(''), 3000);
      }
    } catch (error) {
      console.error('Error saving to Supabase:', error);
      setSaveStatus('Error: ' + error.message);
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(cascadingData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `cascading-performance-${period}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

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
    setCascadingData((prevData) => {
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
    setCascadingData((prevData) => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const node = findNodeById(newData, nodeId);
      if (node) {
        Object.assign(node, updatedData);
      }
      return newData;
    });
  };

  const handleDeleteNode = (nodeId) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus node ini?")) {
      setCascadingData((prevData) => {
        const newData = JSON.parse(JSON.stringify(prevData));

        const deleteFromParent = (parent) => {
          if (parent.children) {
            parent.children = parent.children.filter((child) => {
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
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Cascading Performance
            </h3>
            <p className="text-sm text-gray-600">
              Struktur cascading dari visi hingga program - {period}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={saveToSupabase}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Database className="h-4 w-4 mr-2" />
              {loading ? 'Menyimpan...' : 'Simpan ke Supabase'}
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
        
        {/* Save Status */}
        {saveStatus && (
          <div className={`mb-4 p-3 rounded-md text-sm ${
            saveStatus.includes('berhasil') 
              ? 'bg-green-100 text-green-700 border border-green-200' 
              : saveStatus.includes('Error') || saveStatus.includes('Gagal')
              ? 'bg-red-100 text-red-700 border border-red-200'
              : 'bg-blue-100 text-blue-700 border border-blue-200'
          }`}>
            {saveStatus}
          </div>
        )}
        
        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-purple-500 rounded-full"></span>
            <span className="text-gray-600">Visi</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
            <span className="text-gray-600">Misi</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            <span className="text-gray-600">Tujuan</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
            <span className="text-gray-600">Sasaran</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-red-500 rounded-full"></span>
            <span className="text-gray-600">OPD</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
            <span className="text-gray-600">Program</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-indigo-500 rounded-full"></span>
            <span className="text-gray-600">Kegiatan</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 bg-pink-500 rounded-full"></span>
            <span className="text-gray-600">Sub Kegiatan</span>
          </div>
        </div>
      </div>

      {/* Tree Content */}
      <div className="p-8 overflow-x-auto">
        <div className="min-w-max flex justify-center">
          <CascadingNode 
            node={cascadingData} 
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
          Klik tombol <Plus className="h-3 w-3 inline mx-1" /> untuk menambah
          child,
          <Edit className="h-3 w-3 inline mx-1" /> untuk edit,
          <Trash2 className="h-3 w-3 inline mx-1" /> untuk hapus node
        </p>
      </div>
    </div>
  );
};

export default CascadingPerformance;
