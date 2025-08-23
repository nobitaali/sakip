import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle, Target, Building2, ChevronDown, ChevronUp } from 'lucide-react';

const PerformanceNode = ({ node, level = 0, isRoot = false }) => {
  const [isExpanded, setIsExpanded] = useState(level < 2); // Auto expand first 2 levels

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
    
    // Border color based on status
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

    // Special styling for root node
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

  const hasChildren = node.children && node.children.length > 0;

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <div className={getNodeStyle(node.status, node.type)}>
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

      {/* Connector Line */}
      {hasChildren && isExpanded && (
        <div className="w-px h-8 bg-gray-300 mt-3"></div>
      )}

      {/* Children */}
      {hasChildren && isExpanded && (
        <div className="relative mt-0">
          {/* Horizontal Line */}
          {node.children.length > 1 && (
            <div className="absolute top-0 left-0 right-0 h-px bg-gray-300 transform translate-y-0"></div>
          )}
          
          {/* Children Nodes */}
          <div className="flex items-start justify-center space-x-8 pt-8">
            {node.children.map((child, index) => (
              <div key={child.id} className="relative flex flex-col items-center">
                {/* Vertical connector to child */}
                <div className="w-px h-8 bg-gray-300 -mt-8"></div>
                
                {/* Child Node */}
                <PerformanceNode 
                  node={child} 
                  level={level + 1}
                  isRoot={false}
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
  // Hierarchical performance data structure
  const performanceTreeData = {
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
                opd: 'Dinas Pendidikan'
              },
              {
                id: '12',
                label: 'Tingkat Literasi',
                type: 'IKU',
                achievement: 82.1,
                target: 90,
                status: 'at_risk',
                trend: 'up',
                opd: 'Dinas Pendidikan'
              }
            ]
          },
          {
            id: '6',
            label: 'Program Kesehatan',
            type: 'PROGRAM',
            achievement: 92.8,
            target: 95,
            status: 'on_track',
            trend: 'up',
            opd: 'Dinas Kesehatan',
            children: [
              {
                id: '13',
                label: 'Cakupan Imunisasi',
                type: 'IKU',
                achievement: 92.8,
                target: 95,
                status: 'on_track',
                trend: 'up',
                opd: 'Dinas Kesehatan'
              },
              {
                id: '14',
                label: 'Angka Kematian Bayi',
                type: 'IKU',
                achievement: 88.5,
                target: 85,
                status: 'on_track',
                trend: 'up',
                opd: 'Dinas Kesehatan'
              }
            ]
          }
        ]
      },
      {
        id: '3',
        label: 'Infrastruktur & Konektivitas',
        type: 'MISI',
        achievement: 82.1,
        target: 80,
        status: 'on_track',
        trend: 'up',
        children: [
          {
            id: '7',
            label: 'Program Infrastruktur Jalan',
            type: 'PROGRAM',
            achievement: 75.2,
            target: 80,
            status: 'at_risk',
            trend: 'down',
            opd: 'Dinas PU',
            children: [
              {
                id: '15',
                label: 'Panjang Jalan Kondisi Baik',
                type: 'IKU',
                achievement: 75.2,
                target: 80,
                status: 'at_risk',
                trend: 'down',
                opd: 'Dinas PU'
              }
            ]
          },
          {
            id: '8',
            label: 'Program Digitalisasi',
            type: 'PROGRAM',
            achievement: 88.9,
            target: 85,
            status: 'on_track',
            trend: 'up',
            opd: 'Diskominfo',
            children: [
              {
                id: '16',
                label: 'Layanan Digital Terintegrasi',
                type: 'IKU',
                achievement: 88.9,
                target: 85,
                status: 'on_track',
                trend: 'up',
                opd: 'Diskominfo'
              }
            ]
          }
        ]
      },
      {
        id: '4',
        label: 'Ekonomi & Kesejahteraan',
        type: 'MISI',
        achievement: 75.3,
        target: 85,
        status: 'critical',
        trend: 'down',
        children: [
          {
            id: '9',
            label: 'Program UMKM',
            type: 'PROGRAM',
            achievement: 68.5,
            target: 80,
            status: 'critical',
            trend: 'down',
            opd: 'Dinas Koperasi',
            children: [
              {
                id: '17',
                label: 'Jumlah UMKM Naik Kelas',
                type: 'IKU',
                achievement: 68.5,
                target: 80,
                status: 'critical',
                trend: 'down',
                opd: 'Dinas Koperasi'
              }
            ]
          },
          {
            id: '10',
            label: 'Program Bantuan Sosial',
            type: 'PROGRAM',
            achievement: 82.1,
            target: 90,
            status: 'at_risk',
            trend: 'up',
            opd: 'Dinas Sosial',
            children: [
              {
                id: '18',
                label: 'Penerima Bantuan Tepat Sasaran',
                type: 'IKU',
                achievement: 82.1,
                target: 90,
                status: 'at_risk',
                trend: 'up',
                opd: 'Dinas Sosial'
              }
            ]
          }
        ]
      }
    ]
  };

  return (
    <div className="card">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Pohon Kinerja Interaktif</h3>
            <p className="text-sm text-gray-500">Hierarki kinerja dari RPJMD hingga kegiatan - {period}</p>
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
      <div className="p-8 overflow-x-auto bg-gray-50">
        <div className="min-w-max flex justify-center">
          <PerformanceNode 
            node={performanceTreeData} 
            level={0}
            isRoot={true}
          />
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="p-6 border-t border-gray-200">
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

      {/* Instructions */}
      <div className="p-4 bg-gray-100 border-t border-gray-200 text-center">
        <p className="text-xs text-gray-600">
          Klik tombol panah pada setiap node untuk expand/collapse sub-item
        </p>
      </div>
    </div>
  );
};

export default PerformanceTree;