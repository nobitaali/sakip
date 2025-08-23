import React, { useCallback, useMemo, useState, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Plus, Edit, Trash2, Save, X, Building2 } from 'lucide-react';

// Custom Node Component for Cascading Performance
const CascadingNode = ({ data }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [newChild, setNewChild] = useState({
    name: '',
    type: getNextType(data.type),
    description: '',
    opd: ''
  });
  const [editData, setEditData] = useState({
    name: data.name,
    description: data.description || '',
    opd: data.opd || ''
  });

  function getNextType(currentType) {
    const typeHierarchy = ['visi', 'misi', 'tujuan', 'sasaran', 'opd', 'program'];
    const currentIndex = typeHierarchy.indexOf(currentType);
    return currentIndex < typeHierarchy.length - 1 ? typeHierarchy[currentIndex + 1] : 'program';
  }

  const getTypeColor = (type) => {
    const colors = {
      visi: 'bg-purple-500 text-white border-purple-500',
      misi: 'bg-blue-500 text-white border-blue-500',
      tujuan: 'bg-green-500 text-white border-green-500',
      sasaran: 'bg-yellow-500 text-white border-yellow-500',
      opd: 'bg-red-500 text-white border-red-500',
      program: 'bg-orange-500 text-white border-orange-500'
    };
    return colors[type] || 'bg-gray-500 text-white border-gray-500';
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'visi': return '🎯';
      case 'misi': return '🚀';
      case 'tujuan': return '📋';
      case 'sasaran': return '🎪';
      case 'opd': return '🏢';
      case 'program': return '⚡';
      default: return '📄';
    }
  };

  const getNodeStyle = (type) => {
    let baseStyle = "bg-white border-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-4 min-w-[280px] max-w-[320px]";
    
    switch (type) {
      case 'visi':
        baseStyle += " border-purple-500 bg-gradient-to-br from-purple-50 to-purple-100";
        break;
      case 'misi':
        baseStyle += " border-blue-500";
        break;
      case 'tujuan':
        baseStyle += " border-green-500";
        break;
      case 'sasaran':
        baseStyle += " border-yellow-500";
        break;
      case 'opd':
        baseStyle += " border-red-500";
        break;
      case 'program':
        baseStyle += " border-orange-500";
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
      };
      data.onAddChild(data.id, childData);
      setNewChild({
        name: '',
        type: getNextType(data.type),
        description: '',
        opd: ''
      });
      setShowAddForm(false);
    }
  };

  const handleEditNode = () => {
    if (editData.name.trim()) {
      data.onEditNode(data.id, editData);
      setShowEditForm(false);
    }
  };

  return (
    <div className={getNodeStyle(data.type)}>
      <Handle type="target" position={Position.Top} className="w-2 h-2" />
      
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
        {data.type !== 'visi' && (
          <button
            onClick={() => data.onDeleteNode(data.id)}
            className="bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-md"
            title="Hapus Node"
          >
            <Trash2 className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Type Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-3 py-1 rounded-full font-bold ${getTypeColor(data.type)}`}>
          {data.type.toUpperCase()}
        </span>
        <span className="text-lg">{getTypeIcon(data.type)}</span>
      </div>

      {/* Title */}
      <h3 className={`font-bold mb-2 leading-tight ${data.type === 'visi' ? 'text-lg text-purple-800' : 'text-sm text-gray-900'}`}>
        {data.name}
      </h3>

      {/* Description */}
      {data.description && (
        <p className="text-xs text-gray-600 mb-2">{data.description}</p>
      )}

      {/* OPD */}
      {data.opd && (
        <div className="flex items-center text-xs text-gray-600 mb-3">
          <Building2 className="h-3 w-3 mr-1" />
          {data.opd}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />

      {/* Add Child Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Tambah {getNextType(data.type).toUpperCase()}</h3>
              <button onClick={() => setShowAddForm(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={newChild.name}
                  onChange={(e) => setNewChild({...newChild, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  placeholder={`Masukkan nama ${newChild.type}`}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={newChild.description}
                  onChange={(e) => setNewChild({...newChild, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                  placeholder="Deskripsi (opsional)"
                />
              </div>
              
              {(newChild.type === 'opd' || newChild.type === 'program') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {newChild.type === 'opd' ? 'Nama OPD' : 'Penanggung Jawab OPD'}
                  </label>
                  <input
                    type="text"
                    value={newChild.opd}
                    onChange={(e) => setNewChild({...newChild, opd: e.target.value})}
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
              <h3 className="text-lg font-semibold">Edit {data.type.toUpperCase()}</h3>
              <button onClick={() => setShowEditForm(false)}>
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nama</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  rows="3"
                />
              </div>
              
              {(data.type === 'opd' || data.type === 'program') && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OPD</label>
                  <input
                    type="text"
                    value={editData.opd}
                    onChange={(e) => setEditData({...editData, opd: e.target.value})}
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
    </div>
  );
};

// Node types
const nodeTypes = {
  cascadingNode: CascadingNode,
};

const CascadingPerformance = ({ period = '2024' }) => {
  const [cascadingData, setCascadingData] = useState({
    id: '1',
    name: 'Visi Kepala Daerah',
    type: 'visi',
    description: 'Terwujudnya Daerah yang Maju, Sejahtera, dan Berkelanjutan',
    children: [
      {
        id: '2',
        name: 'Misi 1: Meningkatkan Kualitas SDM',
        type: 'misi',
        description: 'Meningkatkan kualitas sumber daya manusia',
        children: [
          {
            id: '3',
            name: 'Tujuan 1: Peningkatan Pembangunan Manusia',
            type: 'tujuan',
            description: 'Meningkatkan kualitas pendidikan dan kesehatan',
            children: [
              {
                id: '4',
                name: 'Sasaran 1: Peningkatan Kualitas Pendidikan',
                type: 'sasaran',
                description: 'Meningkatkan angka partisipasi sekolah',
                children: [
                  {
                    id: '5',
                    name: 'Dinas Pendidikan',
                    type: 'opd',
                    opd: 'Dinas Pendidikan',
                    children: [
                      {
                        id: '6',
                        name: 'Program Peningkatan Kualitas Guru',
                        type: 'program',
                        opd: 'Dinas Pendidikan',
                        children: []
                      },
                      {
                        id: '7',
                        name: 'Program Peningkatan Sarana Prasarana',
                        type: 'program',
                        opd: 'Dinas Pendidikan',
                        children: []
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
        id: '8',
        name: 'Misi 2: Meningkatkan Infrastruktur',
        type: 'misi',
        description: 'Membangun infrastruktur yang berkualitas',
        children: [
          {
            id: '9',
            name: 'Tujuan 2: Peningkatan Infrastruktur Daerah',
            type: 'tujuan',
            description: 'Meningkatkan kualitas infrastruktur',
            children: [
              {
                id: '10',
                name: 'Sasaran 2: Peningkatan Kualitas Jalan',
                type: 'sasaran',
                description: 'Meningkatkan kondisi jalan daerah',
                children: [
                  {
                    id: '11',
                    name: 'Dinas PU',
                    type: 'opd',
                    opd: 'Dinas Pekerjaan Umum',
                    children: [
                      {
                        id: '12',
                        name: 'Program Pembangunan Jalan',
                        type: 'program',
                        opd: 'Dinas PU',
                        children: []
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
  });

  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const findNodeById = useCallback((node, id) => {
    if (node.id === id) return node;
    if (node.children) {
      for (let child of node.children) {
        const found = findNodeById(child, id);
        if (found) return found;
      }
    }
    return null;
  }, []);

  const handleAddChild = useCallback((parentId, childData) => {
    setCascadingData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const parent = findNodeById(newData, parentId);
      if (parent) {
        if (!parent.children) parent.children = [];
        parent.children.push(childData);
      }
      return newData;
    });
  }, [findNodeById]);

  const handleEditNode = useCallback((nodeId, updatedData) => {
    setCascadingData(prevData => {
      const newData = JSON.parse(JSON.stringify(prevData));
      const node = findNodeById(newData, nodeId);
      if (node) {
        Object.assign(node, updatedData);
      }
      return newData;
    });
  }, [findNodeById]);

  const handleDeleteNode = useCallback((nodeId) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus node ini?')) {
      setCascadingData(prevData => {
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
  }, []);

  // Convert tree data to React Flow nodes and edges
  const generateNodesAndEdges = useCallback((data) => {
    const nodes = [];
    const edges = [];
    let nodeId = 0;

    const traverse = (node, parentId = null, level = 0, siblingIndex = 0, totalSiblings = 1) => {
      const currentNodeId = `node-${nodeId++}`;
      
      // Calculate position
      const levelSpacing = 200;
      const siblingSpacing = 350;
      const x = siblingIndex * siblingSpacing - ((totalSiblings - 1) * siblingSpacing) / 2;
      const y = level * levelSpacing;

      nodes.push({
        id: currentNodeId,
        type: 'cascadingNode',
        position: { x, y },
        data: {
          ...node,
          onAddChild: handleAddChild,
          onEditNode: handleEditNode,
          onDeleteNode: handleDeleteNode,
        },
      });

      if (parentId) {
        edges.push({
          id: `edge-${parentId}-${currentNodeId}`,
          source: parentId,
          target: currentNodeId,
          type: 'smoothstep',
          style: { stroke: '#94a3b8', strokeWidth: 2 },
        });
      }

      if (node.children && node.children.length > 0) {
        node.children.forEach((child, index) => {
          traverse(child, currentNodeId, level + 1, index, node.children.length);
        });
      }
    };

    traverse(data);
    return { nodes, edges };
  }, [handleAddChild, handleEditNode, handleDeleteNode]);

  // Update nodes and edges when data changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = generateNodesAndEdges(cascadingData);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [cascadingData, generateNodesAndEdges, setNodes, setEdges]);

  return (
    <div className="w-full bg-gray-50 rounded-lg border overflow-hidden">
      {/* Header */}
      <div className="p-6 bg-white border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Cascading Performance</h3>
            <p className="text-sm text-gray-600">Struktur cascading dari visi hingga program - {period}</p>
          </div>
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
          </div>
        </div>
      </div>

      {/* React Flow Content */}
      <div className="h-[600px] bg-gray-50">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{
            padding: 0.2,
          }}
        >
          <Controls />
          <MiniMap 
            nodeColor={(node) => {
              switch (node.data.type) {
                case 'visi': return '#8b5cf6';
                case 'misi': return '#3b82f6';
                case 'tujuan': return '#10b981';
                case 'sasaran': return '#f59e0b';
                case 'opd': return '#ef4444';
                case 'program': return '#f97316';
                default: return '#6b7280';
              }
            }}
            className="bg-white"
          />
          <Background variant="dots" gap={12} size={1} />
        </ReactFlow>
      </div>

      {/* Instructions */}
      <div className="p-4 bg-gray-100 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-600">
          Klik tombol <Plus className="h-3 w-3 inline mx-1" /> untuk menambah child, 
          <Edit className="h-3 w-3 inline mx-1" /> untuk edit, 
          <Trash2 className="h-3 w-3 inline mx-1" /> untuk hapus node. 
          Gunakan mouse untuk drag, zoom, dan pan.
        </p>
      </div>
    </div>
  );
};

export default CascadingPerformance;