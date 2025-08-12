import { useState, useEffect } from 'react'
import { useAuthStore } from '../../stores/authStore'
import StatsCards from './components/StatsCards'
import OPDRanking from './components/OPDRanking'
import PerformanceChart from './components/PerformanceChart'
import BudgetChart from './components/BudgetChart'
import AlertsPanel from './components/AlertsPanel'
import PerformanceTree from './components/PerformanceTree'
import ZoningMap from './components/ZoningMap'
import { RefreshCw, Download, Filter } from 'lucide-react'

const Dashboard = () => {
  const { user, hasRole } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('2024')
  const [selectedQuarter, setSelectedQuarter] = useState('Q4')

  const refreshData = async () => {
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
    }, 1000)
  }

  const exportDashboard = () => {
    // Implement export functionality
    alert('Export dashboard functionality will be implemented')
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard Utama
          </h1>
          <p className="text-gray-600">
            Selamat datang, {user?.name} - {user?.opd}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* Period Filter */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="input w-auto"
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
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

          <button
            onClick={refreshData}
            disabled={loading}
            className="btn-secondary p-2"
            title="Refresh Data"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={exportDashboard}
            className="btn-primary p-2"
            title="Export Dashboard"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <StatsCards period={selectedPeriod} quarter={selectedQuarter} />

      {/* Alerts Panel */}
      <AlertsPanel />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* OPD Ranking */}
        {(hasRole('super_admin') || hasRole('evaluator')) && (
          <OPDRanking period={selectedPeriod} />
        )}

        {/* Performance Chart */}
        <PerformanceChart period={selectedPeriod} quarter={selectedQuarter} />
      </div>

      {/* Budget Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetChart period={selectedPeriod} quarter={selectedQuarter} />
        
        {/* Zoning Map */}
        {hasRole('super_admin') && (
          <ZoningMap />
        )}
      </div>

      {/* Performance Tree */}
      <PerformanceTree period={selectedPeriod} />
    </div>
  )
}

export default Dashboard