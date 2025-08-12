import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { FileText, Download, Upload, Eye, Edit, Plus } from 'lucide-react'

const ReportingOverview = () => {
  const [activeTab, setActiveTab] = useState('lkjip')

  const reportData = {
    lkjip: {
      status: 'completed',
      last_generated: '2024-12-15',
      version: '2.1',
      pages: 125,
      completeness: 95
    },
    documents: [
      {
        id: 1,
        name: 'LKJIP 2024 - Dinas Pendidikan',
        type: 'LKJIP',
        status: 'completed',
        date: '2024-12-15',
        size: '2.5 MB',
        format: 'PDF'
      },
      {
        id: 2,
        name: 'Laporan Kinerja Q4 2024',
        type: 'Quarterly',
        status: 'draft',
        date: '2024-12-10',
        size: '1.8 MB',
        format: 'Word'
      },
      {
        id: 3,
        name: 'Evaluasi Internal 2024',
        type: 'Evaluation',
        status: 'completed',
        date: '2024-11-30',
        size: '3.2 MB',
        format: 'PDF'
      }
    ],
    templates: [
      {
        name: 'Template LKJIP 2024',
        description: 'Template resmi sesuai PermenPANRB',
        version: '1.0',
        format: 'Word'
      },
      {
        name: 'Template Laporan Triwulanan',
        description: 'Format laporan kinerja triwulanan',
        version: '2.1',
        format: 'Excel'
      }
    ]
  }

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-success-100 text-success-700',
      draft: 'bg-warning-100 text-warning-700',
      pending: 'bg-gray-100 text-gray-700',
      review: 'bg-primary-100 text-primary-700'
    }
    return colors[status] || colors.pending
  }

  const getStatusText = (status) => {
    const texts = {
      completed: 'Selesai',
      draft: 'Draft',
      pending: 'Menunggu',
      review: 'Review'
    }
    return texts[status] || 'Menunggu'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modul Pelaporan</h1>
          <p className="text-gray-600">Generate LKJIP otomatis dan kelola dokumen pelaporan</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Upload Dokumen
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Buat Laporan Baru
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'lkjip', name: 'LKJIP Generator' },
            { id: 'documents', name: 'Dokumen' },
            { id: 'templates', name: 'Template' },
            { id: 'reports', name: 'Custom Reports' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'lkjip' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LKJIP Generator */}
          <div className="lg:col-span-2 space-y-6">
            <div className="card p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">LKJIP Generator 2024</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(reportData.lkjip.status)}`}>
                  {getStatusText(reportData.lkjip.status)}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">{reportData.lkjip.version}</p>
                  <p className="text-sm text-gray-500">Versi</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary-600">{reportData.lkjip.pages}</p>
                  <p className="text-sm text-gray-500">Halaman</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-success-600">{reportData.lkjip.completeness}%</p>
                  <p className="text-sm text-gray-500">Kelengkapan</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-600">15 Des</p>
                  <p className="text-sm text-gray-500">Terakhir Update</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Bab I - Pendahuluan</p>
                    <p className="text-sm text-gray-500">Visi, misi, dan tujuan organisasi</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full">
                    Lengkap
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Bab II - Perencanaan Kinerja</p>
                    <p className="text-sm text-gray-500">Rencana strategis dan indikator kinerja</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full">
                    Lengkap
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Bab III - Akuntabilitas Kinerja</p>
                    <p className="text-sm text-gray-500">Capaian kinerja dan analisis</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-warning-100 text-warning-700 rounded-full">
                    90%
                  </span>
                </div>
                
                <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">Bab IV - Penutup</p>
                    <p className="text-sm text-gray-500">Kesimpulan dan rekomendasi</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full">
                    Lengkap
                  </span>
                </div>
              </div>

              <div className="mt-6 flex space-x-3">
                <button className="btn-primary flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Generate LKJIP PDF
                </button>
                <button className="btn-secondary">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </button>
                <button className="btn-secondary">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </button>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Aksi Cepat</h3>
              <div className="space-y-3">
                <button className="w-full btn-primary text-left">
                  <Plus className="h-4 w-4 mr-2" />
                  Generate LKJIP Baru
                </button>
                <button className="w-full btn-secondary text-left">
                  <FileText className="h-4 w-4 mr-2" />
                  Laporan Triwulanan
                </button>
                <button className="w-full btn-secondary text-left">
                  <Download className="h-4 w-4 mr-2" />
                  Export Data Kinerja
                </button>
              </div>
            </div>

            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Panduan</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• LKJIP harus diselesaikan sebelum 31 Januari</p>
                <p>• Pastikan semua data kinerja sudah terinput</p>
                <p>• Review kelengkapan dokumen pendukung</p>
                <p>• Koordinasi dengan tim evaluasi internal</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900">Manajemen Dokumen</h3>
            <div className="flex space-x-2">
              <button className="btn-secondary text-sm">
                <Upload className="h-4 w-4 mr-1" />
                Upload
              </button>
              <button className="btn-primary text-sm">
                <Plus className="h-4 w-4 mr-1" />
                Buat Baru
              </button>
            </div>
          </div>
          
          <div className="space-y-4">
            {reportData.documents.map((doc) => (
              <div key={doc.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-primary-100 rounded-lg">
                    <FileText className="h-6 w-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{doc.name}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{doc.type}</span>
                      <span>•</span>
                      <span>{doc.date}</span>
                      <span>•</span>
                      <span>{doc.size}</span>
                      <span>•</span>
                      <span>{doc.format}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(doc.status)}`}>
                    {getStatusText(doc.status)}
                  </span>
                  <div className="flex space-x-1">
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Eye className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-gray-600">
                      <Edit className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reportData.templates.map((template, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <FileText className="h-8 w-8 text-primary-500" />
                <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                  {template.format}
                </span>
              </div>
              <h4 className="font-medium text-gray-900 mb-2">{template.name}</h4>
              <p className="text-sm text-gray-500 mb-4">{template.description}</p>
              <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                <span>Versi {template.version}</span>
              </div>
              <div className="flex space-x-2">
                <button className="flex-1 btn-primary text-sm">
                  <Download className="h-3 w-3 mr-1" />
                  Download
                </button>
                <button className="btn-secondary text-sm">
                  <Eye className="h-3 w-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'reports' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Custom Report Builder</h3>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Pilih Data</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                  <span className="ml-2 text-sm text-gray-700">Data Kinerja</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                  <span className="ml-2 text-sm text-gray-700">Data Anggaran</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600" />
                  <span className="ml-2 text-sm text-gray-700">Evaluasi Internal</span>
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Format Output</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="format" className="border-gray-300 text-primary-600" />
                  <span className="ml-2 text-sm text-gray-700">PDF</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" className="border-gray-300 text-primary-600" />
                  <span className="ml-2 text-sm text-gray-700">Excel</span>
                </label>
                <label className="flex items-center">
                  <input type="radio" name="format" className="border-gray-300 text-primary-600" />
                  <span className="ml-2 text-sm text-gray-700">Word</span>
                </label>
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <button className="btn-primary">
              <Download className="h-4 w-4 mr-2" />
              Generate Report
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const Reporting = () => {
  return (
    <Routes>
      <Route path="/" element={<ReportingOverview />} />
      <Route path="/*" element={<ReportingOverview />} />
    </Routes>
  )
}

export default Reporting