import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Save, X, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { performanceTreeAPI } from '../utils/supabase';
import { performanceTreeCRUD } from '../utils/performanceTreeCRUDFixed';

const SimpleNode = ({ node, level = 0, onAddChild, onEditNode, onDeleteNode }) => {
  const [isExpanded, setIsExpanded] = useState(level < 3);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const getNextChildType = (currentType) => {
    const typeMap = {
      'ULTIMATE OUTCOME': 'INTERMEDIATE OUTCOME',
      'INTERMEDIATE OUTCOME': 'IMMEDIATE OUTCOME LEVEL 1',
      'IMMEDIATE OUTCOME LEVEL 1': 'IMMEDIATE OUTCOME LEVEL 2',
      'IMMEDIATE OUTCOME LEVEL 2': 'OUTPUT',
      'OUTPUT': 'OUTPUT'
    }
    return typeMap[currentType] || 'OUTPUT'
  }

  const [newChild, setNewChild] = useState({
    label: '',
    type: getNextChildType(node.type),
    description: ''
  });

  const [editData, setEditData] = useState({
    label: node.label || '',
    description: node.description || ''
  });

  const getTypeColor = (type) => {
    const colors = {
      'ULTIMATE OUTCOME': 'bg-purple-500 text-white',
      'INTERMEDIATE OUTCOME': 'bg-blue-500 text-white',
      'IMMEDIATE OUTCOME LEVEL 1': 'bg-green-500 text-white',
      'IMMEDIATE OUTCOME LEVEL 2': 'bg-yellow-500 text-white',
      'OUTPUT': 'bg-orange-500 text-white'
    }
    return colors[type] || 'bg-gray-500 text-white'
  }

  const handleAddChild = async () => {
    if (!newChild.label.trim()) return;
    
    setLoading(true);
    try {
      const result = await onAddChild(node.id, node.type, newChild);
      if (result.success) {
        setNewChild({
          label: '',
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
    if (!editData.label.trim()) return;
    
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
    if (!window.confirm('Yakin ingin menghapus node ini?')) return;
    
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
    <div className="mb-4">
      {/* Node Card */}
      <div className="bg-white border rounded-lg p-4 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-3">
            <span className={`text-xs px-2 py-1 rounded ${getTypeColor(node.type)}`}>
              {node.type}
            </span>
            <h3 className="font-medium text-gray-900">{node.label}</h3>
          </div>
          
          <div className="flex items-center space-x-1">
            <button
              onClick={() => setShowAddForm(true)}
              disabled={loading}
              className="p-1 text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
              title="Add Child"
            >
              <Plus className="h-4 w-4" />
            </button>
            <button
              onClick={() => setShowEditForm(true)}
              disabled={loading}
              className="p-1 text-green-600 hover:bg-green-50 rounded disabled:opacity-50"
              title="Edit"
            >
              <Edit className="h-4 w-4" />
            </button>
            {node.type !== 'ULTIMATE OUTCOME' && (
              <button
                onClick={handleDeleteNode}
                disabled={loading}
                className="p-1 text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            {hasChildren && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 text-gray-600 hover:bg-gray-50 rounded"
              >
                {isExpanded ? '−' : '+'}
              </button>
            )}
          </div>
        </div>

        {/* Node Info */}
        <div className="text-sm text-gray-600">
          <p>ID: {node.id}</p>
          {node.achievement && <p>Achievement: {node.achievement}%</p>}
          {node.target && <p>Target: {node.target}%</p>}
          {node.opd && <p>OPD: {node.opd}</p>}
        </div>
      </div>

      {/* Add Child Form */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Add Child to: {node.label}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={newChild.label}
                  onChange={(e) => setNewChild({...newChild, label: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  placeholder="Enter name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Type</label>
                <select
                  value={newChild.type}
                  onChange={(e) => setNewChild({...newChild, type: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                >
                  <option value="INTERMEDIATE OUTCOME">INTERMEDIATE OUTCOME</option>
                  <option value="IMMEDIATE OUTCOME LEVEL 1">IMMEDIATE OUTCOME LEVEL 1</option>
                  <option value="IMMEDIATE OUTCOME LEVEL 2">IMMEDIATE OUTCOME LEVEL 2</option>
                  <option value="OUTPUT">OUTPUT</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={newChild.description}
                  onChange={(e) => setNewChild({...newChild, description: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                  placeholder="Enter description"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddChild}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Form */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96">
            <h3 className="text-lg font-semibold mb-4">Edit: {node.label}</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input
                  type="text"
                  value={editData.label}
                  onChange={(e) => setEditData({...editData, label: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                  value={editData.description}
                  onChange={(e) => setEditData({...editData, description: e.target.value})}
                  className="w-full border rounded px-3 py-2"
                  rows="3"
                />
              </div>
            </div>
            
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowEditForm(false)}
                className="px-4 py-2 text-gray-600 border rounded hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleEditNode}
                disabled={loading}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Updating...' : 'Update'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="ml-6 mt-4 border-l-2 border-gray-200 pl-4">
          {node.children.map((child) => (
            <SimpleNode
              key={child.id}
              node={child}
              level={level + 1}
              onAddChild={onAddChild}
              onEditNode={onEditNode}
              onDeleteNode={onDeleteNode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const PerformanceTreeSimple = () => {
  const [treeData, setTreeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadTreeData();
  }, []);

  const loadTreeData = async () => {
    setLoading(true);
    setStatus('Loading...');
    try {
      const result = await performanceTreeAPI.loadPerformanceTree();
      if (result.success && result.data) {
        setTreeData(result.data);
        setStatus('Data loaded successfully');
      } else {
        setStatus('Error loading data: ' + (result.error || 'Unknown error'));
      }
    } catch (error) {
      setStatus('Error: ' + error.message);
    } finally {
      setLoading(false);
      setTimeout(() => setStatus(''), 3000);
    }
  };

  const handleAddChild = async (parentId, parentType, childData) => {
    setStatus('Adding child...');
    try {
      const result = await performanceTreeCRUD.addChild(parentId, parentType, childData);
      if (result.success) {
        setStatus('Child added successfully');
        await refreshTree();
      } else {
        setStatus('Error adding child: ' + result.error);
      }
      return result;
    } catch (error) {
      setStatus('Error: ' + error.message);
      return { success: false, error: error.message };
    }
  };

  const handleEditNode = async (nodeId, nodeType, updateData) => {
    setStatus('Updating node...');
    try {
      const result = await performanceTreeCRUD.updateNode(nodeId, nodeType, updateData);
      if (result.success) {
        setStatus('Node updated successfully');
        await refreshTree();
      } else {
        setStatus('Error updating node: ' + result.error);
      }
      return result;
    } catch (error) {
      setStatus('Error: ' + error.message);
      return { success: false, error: error.message };
    }
  };

  const handleDeleteNode = async (nodeId, nodeType) => {
    setStatus('Deleting node...');
    try {
      const result = await performanceTreeCRUD.deleteNode(nodeId, nodeType);
      if (result.success) {
        setStatus('Node deleted successfully');
        await refreshTree();
      } else {
        setStatus('Error deleting node: ' + result.error);
      }
      return result;
    } catch (error) {
      setStatus('Error: ' + error.message);
      return { success: false, error: error.message };
    }
  };

  const refreshTree = async () => {
    const result = await performanceTreeCRUD.refreshTreeData();
    if (result.success) {
      setTreeData(result.data);
    }
  };

  const testCRUD = async () => {
    setStatus('Testing CRUD operations...');
    try {
      const result = await performanceTreeCRUD.testCRUD();
      setStatus(result.success ? 'CRUD test completed successfully' : 'CRUD test failed: ' + result.error);
      if (result.success) {
        await refreshTree();
      }
    } catch (error) {
      setStatus('CRUD test error: ' + error.message);
    }
  };

  if (loading && !treeData) {
    return (
      <div className="p-8 text-center">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p>Loading performance tree...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Performance Tree - Simple CRUD</h1>
          <div className="flex space-x-3">
            <button
              onClick={testCRUD}
              className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
            >
              Test CRUD
            </button>
            <button
              onClick={loadTreeData}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Status */}
        {status && (
          <div className={`p-3 rounded mb-4 ${
            status.includes('Error') || status.includes('failed') 
              ? 'bg-red-100 text-red-700' 
              : status.includes('successfully') || status.includes('completed')
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}>
            <div className="flex items-center">
              {status.includes('Error') || status.includes('failed') ? (
                <AlertCircle className="h-4 w-4 mr-2" />
              ) : status.includes('successfully') || status.includes('completed') ? (
                <CheckCircle className="h-4 w-4 mr-2" />
              ) : (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              )}
              {status}
            </div>
          </div>
        )}
      </div>

      {/* Tree */}
      {treeData ? (
        <SimpleNode
          node={treeData}
          level={0}
          onAddChild={handleAddChild}
          onEditNode={handleEditNode}
          onDeleteNode={handleDeleteNode}
        />
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No tree data available</p>
          <button
            onClick={loadTreeData}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Load Data
          </button>
        </div>
      )}
    </div>
  );
};

export default PerformanceTreeSimple;