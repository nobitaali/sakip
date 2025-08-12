import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts'
import { useState } from 'react'

const BudgetChart = ({ period, quarter }) => {
  const [view, setView] = useState('absorption')

  const absorptionData = [
    { name: 'Terserap', value: 92.8, color: '#10b981' },
    { name: 'Belum Terserap', value: 7.2, color: '#e5e7eb' }
  ]

  const budgetByOPD = [
    { opd: 'Pendidikan', pagu: 450, realisasi: 428, persentase: 95.1 },
    { opd: 'Kesehatan', pagu: 380, realisasi: 349, persentase: 91.8 },
    { opd: 'PU', pagu: 320, realisasi: 281, persentase: 87.8 },
    { opd: 'Sosial', pagu: 180, realisasi: 162, persentase: 90.0 },
    { opd: 'Pertanian', pagu: 150, realisasi: 131, persentase: 87.3 }
  ]

  const efficiencyData = [
    { kategori: 'Belanja Pegawai', efisiensi: 98.5, efektivitas: 95.2 },
    { kategori: 'Belanja Barang', efisiensi: 89.3, efektivitas: 87.1 },
    { kategori: 'Belanja Modal', efisiensi: 85.7, efektivitas: 82.4 },
    { kategori: 'Belanja Bantuan', efisiensi: 94.2, efektivitas: 91.8 }
  ]

  const formatCurrency = (value) => {
    return `Rp ${value}M`
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Analisis Anggaran {period}
            </h3>
            <p className="text-sm text-gray-500">
              Realisasi vs Pagu Anggaran - {quarter}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setView('absorption')}
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'absorption'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Serapan
            </button>
            <button
              onClick={() => setView('opd')}
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'opd'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Per OPD
            </button>
            <button
              onClick={() => setView('efficiency')}
              className={`px-3 py-1 text-sm rounded-md ${
                view === 'efficiency'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Efisiensi
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {view === 'absorption' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={absorptionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {absorptionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value}%`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-3xl font-bold text-success-600">92.8%</p>
                <p className="text-sm text-gray-500">Serapan Anggaran</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Total Pagu</span>
                  <span className="font-medium">Rp 2.8 Triliun</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Realisasi</span>
                  <span className="font-medium text-success-600">Rp 2.6 Triliun</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Sisa Anggaran</span>
                  <span className="font-medium text-warning-600">Rp 200 Miliar</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Target Serapan</span>
                  <span className="text-sm font-medium">95%</span>
                </div>
                <div className="mt-2 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-success-500 h-2 rounded-full" 
                    style={{ width: '92.8%' }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'opd' && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={budgetByOPD}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="opd" />
                <YAxis />
                <Tooltip formatter={(value, name) => [
                  name === 'pagu' || name === 'realisasi' ? formatCurrency(value) : `${value}%`,
                  name === 'pagu' ? 'Pagu' : name === 'realisasi' ? 'Realisasi' : 'Persentase'
                ]} />
                <Legend />
                <Bar dataKey="pagu" fill="#e5e7eb" name="Pagu (Miliar)" />
                <Bar dataKey="realisasi" fill="#3b82f6" name="Realisasi (Miliar)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {view === 'efficiency' && (
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={efficiencyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="kategori" />
                <YAxis />
                <Tooltip formatter={(value) => `${value}%`} />
                <Legend />
                <Bar dataKey="efisiensi" fill="#10b981" name="Efisiensi (%)" />
                <Bar dataKey="efektivitas" fill="#f59e0b" name="Efektivitas (%)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}

export default BudgetChart