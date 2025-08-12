import { useState } from 'react'
import { ChevronDown, ChevronRight, Target, TrendingUp, Download, Expand } from 'lucide-react'

const PerformanceTree = ({ period }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set(['1', '1.1']))

  const treeData = {
    id: '1',
    name: 'RPJMD Kabupaten XYZ 2021-2026',
    type: 'rpjmd',
    target: 100,
    realisasi: 85.2,
    children: [
      {
        id: '1.1',
        name: 'Tujuan 1: Meningkatkan Kualitas Pendidikan',
        type: 'tujuan',
        target: 100,
        realisasi: 89.5,
        children: [
          {
            id: '1.1.1',
            name: 'Sasaran 1.1: Meningkatkan Angka Partisipasi Sekolah',
            type: 'sasaran',
            target: 85,
            realisasi: 78.3,
            children: [
              {
                id: '1.1.1.1',
                name: 'Program Pendidikan Dasar',
                type: 'program',
                target: 85,
                realisasi: 82.1,
                children: [
                  {
                    id: '1.1.1.1.1',
                    name: 'Kegiatan Pembangunan Sekolah Baru',
                    type: 'kegiatan',
                    target: 10,
                    realisasi: 8,
                    satuan: 'Unit',
                    anggaran: { pagu: 5000000000, realisasi: 4200000000 }
                  },
                  {
                    id: '1.1.1.1.2',
                    name: 'Kegiatan Rehabilitasi Sekolah',
                    type: 'kegiatan',
                    target: 25,
                    realisasi: 23,
                    satuan: 'Unit',
                    anggaran: { pagu: 3000000000, realisasi: 2800000000 }
                  }
                ]
              }
            ]
          },
          {
            id: '1.1.2',
            name: 'Sasaran 1.2: Meningkatkan Kualitas Guru',
            type: 'sasaran',
            target: 90,
            realisasi: 92.1,
            children: [
              {
                id: '1.1.2.1',
                name: 'Program Peningkatan Kapasitas Guru',
                type: 'program',
                target: 90,
                realisasi: 92.1,
                children: [
                  {
                    id: '1.1.2.1.1',
                    name: 'Kegiatan Pelatihan Guru',
                    type: 'kegiatan',
                    target: 500,
                    realisasi: 485,
                    satuan: 'Orang',
                    anggaran: { pagu: 1500000000, realisasi: 1450000000 }
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        id: '1.2',
        name: 'Tujuan 2: Meningkatkan Pelayanan Kesehatan',
        type: 'tujuan',
        target: 100,
        realisasi: 87.3,
        children: [
          {
            id: '1.2.1',
            name: 'Sasaran 2.1: Menurunkan Angka Kematian Bayi',
            type: 'sasaran',
            target: 15,
            realisasi: 12.5,
            children: []
          }
        ]
      }
    ]
  }

  const toggleNode = (nodeId) => {
    const newExpanded = new Set(expandedNodes)
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId)
    } else {
      newExpanded.add(nodeId)
    }
    setExpandedNodes(newExpanded)
  }

  const getStatusColor = (target, realisasi, type) => {
    let percentage
    if (type === 'sasaran' && target > realisasi) {
      // For targets where lower is better (like mortality rate)
      percentage = (target / realisasi) * 100
    } else {
      percentage = (realisasi / target) * 100
    }
    
    if (percentage >= 90) return 'text-success-600 bg-success-50'
    if (percentage >= 75) return 'text-warning-600 bg-warning-50'
    return 'text-danger-600 bg-danger-50'
  }

  const getTypeIcon = (type) => {
    const icons = {
      rpjmd: '🏛️',
      tujuan: '🎯',
      sasaran: '📊',
      program: '📋',
      kegiatan: '⚡'
    }
    return icons[type] || '📄'
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount)
  }

  const renderNode = (node, level = 0) => {
    const isExpanded = expandedNodes.has(node.id)
    const hasChildren = node.children && node.children.length > 0
    const indentClass = `ml-${level * 6}`

    return (
      <div key={node.id} className={level > 0 ? indentClass : ''}>
        <div className="flex items-center p-3 hover:bg-gray-50 rounded-lg group">
          <div className="flex items-center flex-1">
            {hasChildren ? (
              <button
                onClick={() => toggleNode(node.id)}
                className="mr-2 p-1 hover:bg-gray-200 rounded"
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4 text-gray-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-gray-500" />
                )}
              </button>
            ) : (
              <div className="w-6 mr-2"></div>
            )}
            
            <span className="mr-2 text-lg">{getTypeIcon(node.type)}</span>
            
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                  {node.name}
                </h4>
                
                <div className="flex items-center space-x-3">
                  {node.anggaran && (
                    <div className="text-xs text-gray-500">
                      <span className="font-medium">
                        {formatCurrency(node.anggaran.realisasi)}
                      </span>
                      <span className="text-gray-400">
                        /{formatCurrency(node.anggaran.pagu)}
                      </span>
                    </div>
                  )}
                  
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(node.target, node.realisasi, node.type)}`}>
                    {node.realisasi}{node.satuan ? ` ${node.satuan}` : '%'}
                    {node.target && (
                      <span className="text-gray-400 ml-1">
                        /{node.target}{node.satuan ? ` ${node.satuan}` : '%'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {node.target && (
                <div className="mt-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>Progress</span>
                    <span>
                      {Math.round((node.realisasi / node.target) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full ${
                        (node.realisasi / node.target) >= 0.9
                          ? 'bg-success-500'
                          : (node.realisasi / node.target) >= 0.75
                          ? 'bg-warning-500'
                          : 'bg-danger-500'
                      }`}
                      style={{
                        width: `${Math.min((node.realisasi / node.target) * 100, 100)}%`
                      }}
                    ></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {isExpanded && hasChildren && (
          <div className="ml-4 border-l border-gray-200">
            {node.children.map(child => renderNode(child, level + 1))}
          </div>
        )}
      </div>
    )
  }

  const expandAll = () => {
    const getAllNodeIds = (node) => {
      let ids = [node.id]
      if (node.children) {
        node.children.forEach(child => {
          ids = ids.concat(getAllNodeIds(child))
        })
      }
      return ids
    }
    setExpandedNodes(new Set(getAllNodeIds(treeData)))
  }

  const collapseAll = () => {
    setExpandedNodes(new Set())
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Pohon Kinerja Interaktif
            </h3>
            <p className="text-sm text-gray-500">
              Hierarki kinerja dari RPJMD hingga kegiatan - {period}
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={expandAll}
              className="btn-secondary text-xs px-3 py-1"
            >
              <Expand className="h-3 w-3 mr-1" />
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="btn-secondary text-xs px-3 py-1"
            >
              Collapse All
            </button>
            <button className="btn-primary text-xs px-3 py-1">
              <Download className="h-3 w-3 mr-1" />
              Export
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="max-h-96 overflow-y-auto">
          {renderNode(treeData)}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-success-600">28</p>
              <p className="text-xs text-gray-500">Target Tercapai</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-warning-600">8</p>
              <p className="text-xs text-gray-500">Perlu Perhatian</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-danger-600">4</p>
              <p className="text-xs text-gray-500">Di Bawah Target</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-600">40</p>
              <p className="text-xs text-gray-500">Total Indikator</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceTree