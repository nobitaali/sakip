import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { useState } from 'react'

const PerformanceChart = ({ period, quarter }) => {
  const [chartType, setChartType] = useState('trend')

  const trendData = [
    { month: 'Jan', target: 85, realisasi: 78, anggaran: 82 },
    { month: 'Feb', target: 85, realisasi: 81, anggaran: 85 },
    { month: 'Mar', target: 85, realisasi: 83, anggaran: 88 },
    { month: 'Apr', target: 85, realisasi: 85, anggaran: 90 },
    { month: 'Mei', target: 85, realisasi: 87, anggaran: 92 },
    { month: 'Jun', target: 85, realisasi: 89, anggaran: 94 },
    { month: 'Jul', target: 85, realisasi: 86, anggaran: 91 },
    { month: 'Ags', target: 85, realisasi: 88, anggaran: 93 },
    { month: 'Sep', target: 85, realisasi: 90, anggaran: 95 },
    { month: 'Okt', target: 85, realisasi: 89, anggaran: 94 },
    { month: 'Nov', target: 85, realisasi: 91, anggaran: 96 },
    { month: 'Des', target: 85, realisasi: 85, anggaran: 93 }
  ]

  const comparisonData = [
    { opd: 'Pendidikan', kinerja: 89, anggaran: 95 },
    { opd: 'Kesehatan', kinerja: 87, anggaran: 92 },
    { opd: 'PU', kinerja: 86, anggaran: 88 },
    { opd: 'Sosial', kinerja: 83, anggaran: 90 },
    { opd: 'Pertanian', kinerja: 82, anggaran: 87 }
  ]

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Progress Kinerja Real-time
            </h3>
            <p className="text-sm text-gray-500">
              Capaian vs Target {period} - {quarter}
            </p>
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => setChartType('trend')}
              className={`px-3 py-1 text-sm rounded-md ${
                chartType === 'trend'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Trend
            </button>
            <button
              onClick={() => setChartType('comparison')}
              className={`px-3 py-1 text-sm rounded-md ${
                chartType === 'comparison'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Perbandingan
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'trend' ? (
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="target" 
                  stroke="#6b7280" 
                  strokeDasharray="5 5"
                  name="Target"
                />
                <Line 
                  type="monotone" 
                  dataKey="realisasi" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Realisasi Kinerja"
                />
                <Line 
                  type="monotone" 
                  dataKey="anggaran" 
                  stroke="#10b981" 
                  strokeWidth={2}
                  name="Serapan Anggaran"
                />
              </LineChart>
            ) : (
              <BarChart data={comparisonData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="opd" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="kinerja" fill="#3b82f6" name="Capaian Kinerja (%)" />
                <Bar dataKey="anggaran" fill="#10b981" name="Serapan Anggaran (%)" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
        
        {/* Alert Indicators */}
        <div className="mt-4 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
              <div className="w-2 h-2 bg-success-400 rounded-full mr-1"></div>
              Normal (≥85%)
            </div>
            <p className="text-sm text-gray-600 mt-1">28 Indikator</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-warning-100 text-warning-800">
              <div className="w-2 h-2 bg-warning-400 rounded-full mr-1"></div>
              Perhatian (70-84%)
            </div>
            <p className="text-sm text-gray-600 mt-1">8 Indikator</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-danger-100 text-danger-800">
              <div className="w-2 h-2 bg-danger-400 rounded-full mr-1"></div>
              Kritis (&lt;70%)
            </div>
            <p className="text-sm text-gray-600 mt-1">4 Indikator</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceChart