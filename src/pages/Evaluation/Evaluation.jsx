import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { CheckSquare, Plus, Eye, Edit, Star, AlertTriangle } from 'lucide-react'

const EvaluationOverview = () => {
  const [activeTab, setActiveTab] = useState('internal')

  const evaluationData = {
    internal: [
      {
        id: 1,
        opd: 'Dinas Pendidikan',
        date: '2024-12-15',
        evaluator: 'Tim Evaluasi Internal',
        score: 82.6,
        grade: 'B',
        status: 'completed',
        components: {
          perencanaan: 85,
          pengukuran: 82,
          pelaporan: 88,
          evaluasi: 80,
          perbaikan: 78
        }
      },
      {
        id: 2,
        opd: 'Dinas Kesehatan',
        date: '2024-12-10',
        evaluator: 'Tim Evaluasi Internal',
        score: 85.8,
        grade: 'A-',
        status: 'completed',
        components: {
          perencanaan: 88,
          pengukuran: 85,
          pelaporan: 90,
          evaluasi: 84,
          perbaikan: 82
        }
      },
      {
        id: 3,
        opd: 'Dinas PU',
        date: '2024-12-20',
        evaluator: 'Tim Evaluasi Internal',
        score: 0,
        grade: '-',
        status: 'scheduled',
        components: {}
      }
    ],
    external: {
      kemenpan_rb: {
        date: '2024-11-20',
        evaluator: 'Tim Evaluasi KemenPANRB',
        score: 78.5,
        grade: 'B+',
        status: 'completed',
        components: {
          akuntabilitas_kinerja: 80,
          akuntabilitas_keuangan: 78,
          akuntabilitas_manfaat: 76
        }
      }
    }
  }

  const getGradeColor = (grade) => {
    if (grade.startsWith('A')) return 'text-success-600 bg-success-100'
    if (grade.startsWith('B')) return 'text-primary-600 bg-primary-100'
    if (grade.startsWith('C')) return 'text-warning-600 bg-warning-100'
    if (grade.startsWith('D')) return 'text-danger-600 bg-danger-100'
    return 'text-gray-600 bg-gray-100'
  }

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-success-100 text-success-700',
      in_progress: 'bg-warning-100 text-warning-700',
      scheduled: 'bg-primary-100 text-primary-700',
      pending: 'bg-gray-100 text-gray-700'
    }
    return colors[status] || colors.pending
  }

  const getStatusText = (status) => {
    const texts = {
      completed: 'Selesai',
      in_progress: 'Berlangsung',
      scheduled: 'Terjadwal',
      pending: 'Menunggu'
    }
    return texts[status] || 'Menunggu'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modul Evaluasi</h1>
          <p className="text-gray-600">Evaluasi internal digital dan eksternal SAKIP</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <Eye className="h-4 w-4 mr-2" />
            Lihat LKE
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Mulai Evaluasi
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-success-100">
              <CheckSquare className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Evaluasi Selesai</p>
              <p className="text-2xl font-semibold text-success-600">2</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-warning-100">
              <AlertTriangle className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Terjadwal</p>
              <p className="text-2xl font-semibold text-warning-600">1</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-100">
              <Star className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Rata-rata Nilai</p>
              <p className="text-2xl font-semibold text-primary-600">84.2</p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-100">
              <CheckSquare className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total OPD</p>
              <p className="text-2xl font-semibold text-gray-900">35</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'internal', name: 'Evaluasi Internal' },
            { id: 'external', name: 'Evaluasi Eksternal' },
            { id: 'lke', name: 'LKE Digital' },
            { id: 'recommendations', name: 'Rekomendasi' }
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
      {activeTab === 'internal' && (
        <div className="space-y-6">
          {evaluationData.internal.map((evaluation) => (
            <div key={evaluation.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{evaluation.opd}</h3>
                  <p className="text-sm text-gray-500">
                    Evaluator: {evaluation.evaluator} • {evaluation.date}
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(evaluation.status)}`}>
                    {getStatusText(evaluation.status)}
                  </span>
                  {evaluation.grade !== '-' && (
                    <span className={`text-sm px-3 py-1 rounded-full font-medium ${getGradeColor(evaluation.grade)}`}>
                      {evaluation.grade}
                    </span>
                  )}
                  {evaluation.score > 0 && (
                    <span className="text-lg font-bold text-gray-900">
                      {evaluation.score}
                    </span>
                  )}
                </div>
              </div>

              {evaluation.status === 'completed' && (
                <div className="grid grid-cols-5 gap-4 mb-4">
                  {Object.entries(evaluation.components).map(([component, score]) => (
                    <div key={component} className="text-center">
                      <p className="text-2xl font-bold text-primary-600">{score}</p>
                      <p className="text-xs text-gray-500 capitalize">
                        {component.replace('_', ' ')}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex space-x-3">
                {evaluation.status === 'completed' ? (
                  <>
                    <button className="btn-primary text-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat Detail
                    </button>
                    <button className="btn-secondary text-sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Edit Evaluasi
                    </button>
                  </>
                ) : (
                  <button className="btn-primary text-sm">
                    <Plus className="h-4 w-4 mr-1" />
                    Mulai Evaluasi
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'external' && (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Evaluasi SAKIP Nasional - KemenPANRB
                </h3>
                <p className="text-sm text-gray-500">
                  Evaluator: {evaluationData.external.kemenpan_rb.evaluator} • {evaluationData.external.kemenpan_rb.date}
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor('completed')}`}>
                  Selesai
                </span>
                <span className={`text-sm px-3 py-1 rounded-full font-medium ${getGradeColor(evaluationData.external.kemenpan_rb.grade)}`}>
                  {evaluationData.external.kemenpan_rb.grade}
                </span>
                <span className="text-lg font-bold text-gray-900">
                  {evaluationData.external.kemenpan_rb.score}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-4">
              {Object.entries(evaluationData.external.kemenpan_rb.components).map(([component, score]) => (
                <div key={component} className="text-center p-4 bg-gray-50 rounded-lg">
                  <p className="text-2xl font-bold text-primary-600">{score}</p>
                  <p className="text-sm text-gray-600 capitalize">
                    {component.replace(/_/g, ' ')}
                  </p>
                </div>
              ))}
            </div>

            <div className="bg-warning-50 border border-warning-200 rounded-lg p-4">
              <h4 className="font-medium text-warning-800 mb-2">Rekomendasi KemenPANRB:</h4>
              <ul className="text-sm text-warning-700 space-y-1">
                <li>• Perkuat sistem monitoring dan evaluasi</li>
                <li>• Tingkatkan kualitas pelaporan kinerja</li>
                <li>• Perbaiki analisis efektivitas program</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'lke' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Lembar Kerja Evaluasi (LKE) Digital</h3>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Komponen Evaluasi</h4>
              <div className="space-y-3">
                {[
                  { section: 'A', name: 'Perencanaan Kinerja', weight: 20, max_score: 20 },
                  { section: 'B', name: 'Pengukuran Kinerja', weight: 25, max_score: 25 },
                  { section: 'C', name: 'Pelaporan Kinerja', weight: 25, max_score: 25 },
                  { section: 'D', name: 'Evaluasi Internal', weight: 15, max_score: 15 },
                  { section: 'E', name: 'Perbaikan Kinerja', weight: 15, max_score: 15 }
                ].map((component) => (
                  <div key={component.section} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {component.section}. {component.name}
                      </p>
                      <p className="text-sm text-gray-500">Bobot: {component.weight}%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Max: {component.max_score}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-3">Template LKE</h4>
              <div className="space-y-3">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">LKE 2024 - Versi 1.0</h5>
                  <p className="text-sm text-gray-500 mb-3">
                    Template resmi sesuai pedoman KemenPANRB
                  </p>
                  <div className="flex space-x-2">
                    <button className="btn-primary text-sm">
                      <Eye className="h-4 w-4 mr-1" />
                      Lihat Template
                    </button>
                    <button className="btn-secondary text-sm">
                      <Plus className="h-4 w-4 mr-1" />
                      Mulai LKE
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'recommendations' && (
        <div className="space-y-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rekomendasi Perbaikan</h3>
            
            <div className="space-y-4">
              <div className="border-l-4 border-danger-400 pl-4 py-2">
                <h4 className="font-medium text-danger-800">Prioritas Tinggi</h4>
                <p className="text-sm text-danger-700 mt-1">
                  Perbaiki sistem pengukuran kinerja untuk indikator yang masih manual
                </p>
                <p className="text-xs text-gray-500 mt-2">Target: Q1 2025 • PIC: Tim IT</p>
              </div>
              
              <div className="border-l-4 border-warning-400 pl-4 py-2">
                <h4 className="font-medium text-warning-800">Prioritas Sedang</h4>
                <p className="text-sm text-warning-700 mt-1">
                  Tingkatkan kualitas analisis capaian dalam pelaporan LKJIP
                </p>
                <p className="text-xs text-gray-500 mt-2">Target: Q2 2025 • PIC: Tim Pelaporan</p>
              </div>
              
              <div className="border-l-4 border-primary-400 pl-4 py-2">
                <h4 className="font-medium text-primary-800">Prioritas Rendah</h4>
                <p className="text-sm text-primary-700 mt-1">
                  Implementasi dashboard real-time untuk monitoring kinerja
                </p>
                <p className="text-xs text-gray-500 mt-2">Target: Q3 2025 • PIC: Tim Monitoring</p>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Tracking Tindak Lanjut</h3>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Perbaikan Sistem Monitoring</p>
                  <p className="text-sm text-gray-500">Rekomendasi evaluasi Q3 2024</p>
                </div>
                <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full">
                  Selesai
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">Pelatihan Tim Evaluasi</p>
                  <p className="text-sm text-gray-500">Rekomendasi evaluasi Q2 2024</p>
                </div>
                <span className="text-xs px-2 py-1 bg-warning-100 text-warning-700 rounded-full">
                  Berlangsung
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Evaluation = () => {
  return (
    <Routes>
      <Route path="/" element={<EvaluationOverview />} />
      <Route path="/*" element={<EvaluationOverview />} />
    </Routes>
  )
}

export default Evaluation