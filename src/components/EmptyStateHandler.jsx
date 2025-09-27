import React, { useState } from 'react';
import { Plus, FileText, Target, Lightbulb, Download, Upload, Database, Wand2 } from 'lucide-react';

const EmptyStateHandler = ({ 
  type = 'performance-tree', // 'performance-tree' or 'cascading'
  onCreateSample, 
  onImportData, 
  onCreateManual,
  onLoadTemplate 
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const getEmptyStateContent = () => {
    if (type === 'performance-tree') {
      return {
        title: 'Pohon Kinerja Belum Ada',
        description: 'Belum ada data pohon kinerja. Mulai dengan membuat struktur kinerja organisasi Anda.',
        icon: <Target className="h-16 w-16 text-gray-400" />,
        suggestions: [
          'Buat dari template SAKIP standar',
          'Import dari file Excel/JSON',
          'Mulai dari kosong dengan Visi',
          'Generate sample data untuk testing'
        ]
      };
    } else {
      return {
        title: 'Struktur Cascading Kosong',
        description: 'Belum ada struktur cascading kinerja. Buat hierarki dari Visi hingga Sub Kegiatan.',
        icon: <FileText className="h-16 w-16 text-gray-400" />,
        suggestions: [
          'Buat dari template cascading standar',
          'Import struktur organisasi',
          'Mulai dengan Visi dan Misi',
          'Generate contoh struktur'
        ]
      };
    }
  };

  const content = getEmptyStateContent();

  return (
    <div className="w-full bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 overflow-hidden">
      <div className="p-12 text-center">
        {/* Icon */}
        <div className="flex justify-center mb-6">
          {content.icon}
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-semibold text-gray-900 mb-3">
          {content.title}
        </h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          {content.description}
        </p>

        {/* Quick Actions */}
        <div className="space-y-4 mb-8">
          <button
            onClick={() => setShowOptions(!showOptions)}
            className="inline-flex items-center px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium"
          >
            <Plus className="h-5 w-5 mr-2" />
            Mulai Membuat {type === 'performance-tree' ? 'Pohon Kinerja' : 'Cascading'}
          </button>

          {showOptions && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 max-w-2xl mx-auto">
              {/* Create from Template */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={onLoadTemplate}>
                <div className="flex items-center mb-3">
                  <div className="bg-blue-100 p-2 rounded-lg mr-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Gunakan Template</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Mulai dengan template SAKIP standar yang sudah disesuaikan dengan peraturan terbaru
                </p>
              </div>

              {/* Generate Sample Data */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={onCreateSample}>
                <div className="flex items-center mb-3">
                  <div className="bg-green-100 p-2 rounded-lg mr-3">
                    <Wand2 className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Generate Sample</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Buat data contoh untuk testing dan pembelajaran sistem
                </p>
              </div>

              {/* Import Data */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={onImportData}>
                <div className="flex items-center mb-3">
                  <div className="bg-purple-100 p-2 rounded-lg mr-3">
                    <Upload className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Import Data</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Upload file Excel, JSON, atau CSV yang sudah ada
                </p>
              </div>

              {/* Start from Scratch */}
              <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                   onClick={onCreateManual}>
                <div className="flex items-center mb-3">
                  <div className="bg-orange-100 p-2 rounded-lg mr-3">
                    <Plus className="h-5 w-5 text-orange-600" />
                  </div>
                  <h4 className="font-medium text-gray-900">Mulai dari Kosong</h4>
                </div>
                <p className="text-sm text-gray-600">
                  Buat struktur sendiri mulai dari Visi organisasi
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Tips */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-lg mx-auto">
          <div className="flex items-start">
            <Lightbulb className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div className="text-left">
              <h4 className="font-medium text-blue-900 mb-1">Tips</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                {content.suggestions.map((suggestion, index) => (
                  <li key={index}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmptyStateHandler;