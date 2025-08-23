import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { TrendingUp, Plus, Upload, Download, AlertTriangle, CheckCircle, GitBranch, BarChart3, Workflow } from 'lucide-react'
import PerformanceTree from '../../components/PerformanceTree'
import CascadingPerformance from '../../components/CascadingPerformance'

const PerformanceOverview = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('2024')
  const [selectedQuarter, setSelectedQuarter] = useState('Q4')
  const [activeTab, setActiveTab] = useState('overview')

  const performanceData = {
    summary: {
      total_indicators: 40,
      on_track: 28,
      at_risk: 8,
      critical: 4,
      overall_achievement: 85.2
    },
    recent_updates: [
      {
        indicator: 'Angka Partisipasi Sekolah',
        opd: 'Dinas Pendidikan',
        previous: 75.2,
        current: 78.3,
        target: 85,
        status: 'improved',
        date: '2024-12-15'
      },
      {
        indicator: 'Cakupan Imunisasi',
        opd: 'Dinas Kesehatan',
        previous: 90.1,
        current: 92.8,
        target: 95,
        status: 'improved',
        date: '2024-12-14'
      },
      {
        indicator: 'Panjang Jalan Kondisi Baik',
        opd: 'Dinas PU',
        previous: 78.5,
        current: 75.2,
        target: 80,
        status: 'declined',
        date: '2024-12-13'
      }
    ]
  }

  const getStatusColor = (status) => {
    const colors = {
      improved: 'text-success-600 bg-success-50',
      declined: 'text-danger-600 bg-danger-50',
      stable: 'text-warning-600 bg-warning-50'
    }
    return colors[status] || colors.stable
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pengukuran Kinerja</h1>
          <p className="text-gray-600">Monitor dan input capaian kinerja real-time</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input w-auto"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <select
            value={selectedQuarter}
            onChange={(e) => setSelectedQuarter(e.target.value)}
            className="input w-auto"
          >
            <option value="Q1">Triwulan I</option>
            <option value="Q2">Triwulan II</option>
            <option value="Q3">Triwulan III</option>
            <option value="Q4">Triwulan IV</option>
          </select>
          <button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Import Data
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Input Capaian
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'overview'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <BarChart3 className="h-4 w-4 inline mr-2" />
            Overview
          </button>
          <button
            onClick={() => setActiveTab('tree')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'tree'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <GitBranch className="h-4 w-4 inline mr-2" />
            Pohon Kinerja
          </button>
          <button
            onClick={() => setActiveTab('cascading')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'cascading'
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Workflow className="h-4 w-4 inline mr-2" />
            Cascading Performance
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'tree' ? (
        <div className="space-y-6">
          <div className="card p-6">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Pohon Kinerja Hirarki</h3>
                <p className="text-sm text-gray-600">Visualisasi struktur kinerja dari visi hingga indikator kunci</p>
              </div>
              <div className="flex items-center space-x-4 text-sm">
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
            <PerformanceTree />
          </div>
        </div>
      ) : activeTab === 'cascading' ? (
        <div className="space-y-6">
          <CascadingPerformance period={selectedPeriod} />
        </div>
      ) : (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-primary-100">
                  <TrendingUp className="h-6 w-6 text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Capaian Keseluruhan</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {performanceData.summary.overall_achievement}%
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-gray-100">
                  <CheckCircle className="h-6 w-6 text-gray-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Indikator</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {performanceData.summary.total_indicators}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-success-100">
                  <CheckCircle className="h-6 w-6 text-success-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">On Track</p>
                  <p className="text-2xl font-semibold text-success-600">
                    {performanceData.summary.on_track}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-warning-100">
                  <AlertTriangle className="h-6 w-6 text-warning-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Perlu Perhatian</p>
                  <p className="text-2xl font-semibold text-warning-600">
                    {performanceData.summary.at_risk}
                  </p>
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-danger-100">
                  <AlertTriangle className="h-6 w-6 text-danger-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Kritis</p>
                  <p className="text-2xl font-semibold text-danger-600">
                    {performanceData.summary.critical}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Recent Updates */}
            <div className="lg:col-span-2">
              <div className="card">
                <div className="p-6 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">
                      Update Terbaru - {selectedQuarter} {selectedPeriod}
                    </h3>
                    <button className="text-sm text-primary-600 hover:text-primary-500">
                      Lihat Semua
                    </button>
                  </div>
                </div>
                <div className="p-6">
                  <div className="space-y-4">
                    {performanceData.recent_updates.map((update, index) => (
                      <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{update.indicator}</h4>
                            <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(update.status)}`}>
                              {update.status === 'improved' ? 'Meningkat' : 
                               update.status === 'declined' ? 'Menurun' : 'Stabil'}
                            </span>
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{update.opd}</p>
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-gray-600">
                              Sebelumnya: <span className="font-medium">{update.previous}%</span>
                            </span>
                            <span className="text-gray-600">
                              Saat ini: <span className="font-medium">{update.current}%</span>
                            </span>
                            <span className="text-gray-600">
                              Target: <span className="font-medium">{update.target}%</span>
                            </span>
                          </div>
                          <div className="mt-2">
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  update.current >= update.target ? 'bg-success-500' :
                                  update.current >= update.target * 0.8 ? 'bg-warning-500' : 'bg-danger-500'
                                }`}
                                style={{ width: `${Math.min((update.current / update.target) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions & Tools */}
            <div className="space-y-6">
              {/* Input Form */}
              <div className="card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Input Capaian Cepat</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Pilih Indikator
                    </label>
                    <select className="input">
                      <option>Angka Partisipasi Sekolah</option>
                      <option>Cakupan Imunisasi</option>
                      <option>Panjang Jalan Kondisi Baik</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Capaian
                    </label>
                    <input type="number" className="input" placeholder="Masukkan nilai capaian" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Keterangan
                    </label>
                    <textarea className="input" rows="3" placeholder="Faktor pendukung/penghambat"></textarea>
                  </div>
                  <button className="w-full btn-primary">
                    Simpan Capaian
                  </button>
                </div>
              </div>

              {/* Tools */}
              <div className="card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Tools & Utilitas</h3>
                <div className="space-y-3">
                  <button className="w-full btn-secondary text-left">
                    <Upload className="h-4 w-4 mr-2" />
                    Bulk Import Excel
                  </button>
                  <button className="w-full btn-secondary text-left">
                    <Download className="h-4 w-4 mr-2" />
                    Export Laporan
                  </button>
                  <button className="w-full btn-secondary text-left">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analisis Trend
                  </button>
                </div>
              </div>

              {/* Integration Status */}
              <div className="card p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Status Integrasi</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">SIPD</span>
                    <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full">
                      Terhubung
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">BKN/BKD</span>
                    <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full">
                      Terhubung
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Sistem Sektor</span>
                    <span className="text-xs px-2 py-1 bg-warning-100 text-warning-700 rounded-full">
                      Parsial
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Performance = () => {
  return (
    <Routes>
      <Route path="/" element={<PerformanceOverview />} />
      <Route path="/*" element={<PerformanceOverview />} />
    </Routes>
  )
}

export default Performance