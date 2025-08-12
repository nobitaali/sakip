import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { DollarSign, TrendingUp, Upload, Download, AlertCircle } from 'lucide-react'

const BudgetOverview = () => {
  const [selectedYear, setSelectedYear] = useState('2024')
  const [selectedView, setSelectedView] = useState('overview')

  const budgetData = {
    summary: {
      total_pagu: 2800000000000,
      total_realisasi: 2598400000000,
      absorption_rate: 92.8,
      efficiency_score: 87.5
    },
    by_category: [
      { name: 'Belanja Pegawai', pagu: 1400000000000, realisasi: 1379000000000, percentage: 98.5 },
      { name: 'Belanja Barang', pagu: 700000000000, realisasi: 625100000000, percentage: 89.3 },
      { name: 'Belanja Modal', pagu: 500000000000, realisasi: 428500000000, percentage: 85.7 },
      { name: 'Belanja Bantuan', pagu: 200000000000, realisasi: 188400000000, percentage: 94.2 }
    ],
    top_opd: [
      { name: 'Dinas Pendidikan', pagu: 450000000000, realisasi: 428000000000, percentage: 95.1 },
      { name: 'Dinas Kesehatan', pagu: 380000000000, realisasi: 349000000000, percentage: 91.8 },
      { name: 'Dinas PU', pagu: 320000000000, realisasi: 281000000000, percentage: 87.8 }
    ]
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
      notation: 'compact'
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Modul Anggaran</h1>
          <p className="text-gray-600">Kelola pagu dan realisasi anggaran dengan integrasi SIPD</p>
        </div>
        <div className="flex space-x-3">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="input w-auto"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <button className="btn-secondary">
            <Upload className="h-4 w-4 mr-2" />
            Sync SIPD
          </button>
          <button className="btn-primary">
            <Download className="h-4 w-4 mr-2" />
            Export Laporan
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-100">
              <DollarSign className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Pagu</p>
              <p className="text-xl font-semibold text-gray-900">
                {formatCurrency(budgetData.summary.total_pagu)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-success-100">
              <TrendingUp className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Realisasi</p>
              <p className="text-xl font-semibold text-success-600">
                {formatCurrency(budgetData.summary.total_realisasi)}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-warning-100">
              <TrendingUp className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Serapan</p>
              <p className="text-xl font-semibold text-warning-600">
                {budgetData.summary.absorption_rate}%
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-100">
              <AlertCircle className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Efisiensi</p>
              <p className="text-xl font-semibold text-gray-900">
                {budgetData.summary.efficiency_score}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', name: 'Overview' },
            { id: 'by-category', name: 'Per Kategori' },
            { id: 'by-opd', name: 'Per OPD' },
            { id: 'analysis', name: 'Analisis' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedView(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                selectedView === tab.id
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
      {selectedView === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Absorption Progress */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Progress Serapan Anggaran</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Target Serapan (95%)</span>
                <span className="text-sm font-medium text-gray-900">
                  {formatCurrency(budgetData.summary.total_pagu * 0.95)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Realisasi Saat Ini</span>
                <span className="text-sm font-medium text-success-600">
                  {formatCurrency(budgetData.summary.total_realisasi)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Sisa Anggaran</span>
                <span className="text-sm font-medium text-warning-600">
                  {formatCurrency(budgetData.summary.total_pagu - budgetData.summary.total_realisasi)}
                </span>
              </div>
              
              <div className="mt-4">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>{budgetData.summary.absorption_rate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div 
                    className="bg-success-500 h-3 rounded-full" 
                    style={{ width: `${budgetData.summary.absorption_rate}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Top OPD */}
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Top OPD - Serapan Anggaran</h3>
            <div className="space-y-4">
              {budgetData.top_opd.map((opd, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-900">{opd.name}</span>
                      <span className="text-sm text-gray-600">{opd.percentage}%</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
                      <span>{formatCurrency(opd.realisasi)}</span>
                      <span>dari {formatCurrency(opd.pagu)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          opd.percentage >= 95 ? 'bg-success-500' :
                          opd.percentage >= 85 ? 'bg-warning-500' : 'bg-danger-500'
                        }`}
                        style={{ width: `${opd.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {selectedView === 'by-category' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Anggaran Per Kategori Belanja</h3>
          <div className="space-y-4">
            {budgetData.by_category.map((category, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-medium text-gray-900">{category.name}</h4>
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    category.percentage >= 95 ? 'bg-success-100 text-success-700' :
                    category.percentage >= 85 ? 'bg-warning-100 text-warning-700' :
                    'bg-danger-100 text-danger-700'
                  }`}>
                    {category.percentage}%
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                  <div>
                    <p className="text-gray-500">Pagu</p>
                    <p className="font-medium">{formatCurrency(category.pagu)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Realisasi</p>
                    <p className="font-medium text-success-600">{formatCurrency(category.realisasi)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Sisa</p>
                    <p className="font-medium text-warning-600">{formatCurrency(category.pagu - category.realisasi)}</p>
                  </div>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      category.percentage >= 95 ? 'bg-success-500' :
                      category.percentage >= 85 ? 'bg-warning-500' : 'bg-danger-500'
                    }`}
                    style={{ width: `${category.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedView === 'analysis' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analisis Efisiensi</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Efisiensi Belanja Pegawai</span>
                <span className="text-sm font-medium text-success-600">98.5%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Efisiensi Belanja Barang</span>
                <span className="text-sm font-medium text-warning-600">89.3%</span>
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm text-gray-600">Efisiensi Belanja Modal</span>
                <span className="text-sm font-medium text-danger-600">85.7%</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Rekomendasi</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-warning-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Percepat Belanja Modal</p>
                  <p className="text-xs text-gray-500">Serapan belanja modal masih di bawah target</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <AlertCircle className="h-5 w-5 text-primary-500 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Optimalisasi Pengadaan</p>
                  <p className="text-xs text-gray-500">Perbaiki proses pengadaan untuk efisiensi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const Budget = () => {
  return (
    <Routes>
      <Route path="/" element={<BudgetOverview />} />
      <Route path="/*" element={<BudgetOverview />} />
    </Routes>
  )
}

export default Budget