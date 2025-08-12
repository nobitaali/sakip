import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { Link as LinkIcon, Database, Wifi, Settings, RefreshCw, AlertCircle, CheckCircle } from 'lucide-react'

const IntegrationOverview = () => {
  const [activeTab, setActiveTab] = useState('connections')

  const integrationData = {
    connections: [
      {
        id: 1,
        name: 'SIPD (Sistem Informasi Pemerintahan Daerah)',
        type: 'Planning & Budget',
        status: 'connected',
        last_sync: '2024-12-20 10:30:00',
        data_types: ['Perencanaan', 'Anggaran', 'Realisasi'],
        health: 98,
        url: 'https://sipd.kemendagri.go.id'
      },
      {
        id: 2,
        name: 'BKN (Badan Kepegawaian Negara)',
        type: 'HR Management',
        status: 'connected',
        last_sync: '2024-12-20 09:15:00',
        data_types: ['Data Pegawai', 'Tunjangan Kinerja'],
        health: 95,
        url: 'https://bkn.go.id'
      },
      {
        id: 3,
        name: 'BKD (Badan Kepegawaian Daerah)',
        type: 'Local HR',
        status: 'connected',
        last_sync: '2024-12-20 08:45:00',
        data_types: ['Absensi', 'Kinerja Pegawai'],
        health: 92,
        url: 'https://bkd.pemda.go.id'
      },
      {
        id: 4,
        name: 'Sistem Sektor Pendidikan',
        type: 'Sector Specific',
        status: 'partial',
        last_sync: '2024-12-19 16:20:00',
        data_types: ['Data Siswa', 'Fasilitas Sekolah'],
        health: 75,
        url: 'https://dapodik.kemdikbud.go.id'
      },
      {
        id: 5,
        name: 'Sistem Sektor Kesehatan',
        type: 'Sector Specific',
        status: 'error',
        last_sync: '2024-12-18 14:30:00',
        data_types: ['Data Pasien', 'Fasilitas Kesehatan'],
        health: 45,
        url: 'https://satusehat.kemkes.go.id'
      }
    ],
    api_usage: {
      total_requests: 15420,
      successful: 14891,
      failed: 529,
      success_rate: 96.6,
      avg_response_time: 245
    },
    sync_schedule: [
      { system: 'SIPD', frequency: 'Daily', next_sync: '2024-12-21 02:00:00' },
      { system: 'BKN', frequency: 'Weekly', next_sync: '2024-12-23 01:00:00' },
      { system: 'BKD', frequency: 'Daily', next_sync: '2024-12-21 03:00:00' }
    ]
  }

  const getStatusColor = (status) => {
    const colors = {
      connected: 'text-success-600 bg-success-100',
      partial: 'text-warning-600 bg-warning-100',
      error: 'text-danger-600 bg-danger-100',
      disconnected: 'text-gray-600 bg-gray-100'
    }
    return colors[status] || colors.disconnected
  }

  const getStatusText = (status) => {
    const texts = {
      connected: 'Terhubung',
      partial: 'Parsial',
      error: 'Error',
      disconnected: 'Terputus'
    }
    return texts[status] || 'Tidak Diketahui'
  }

  const getStatusIcon = (status) => {
    const icons = {
      connected: <CheckCircle className="h-5 w-5 text-success-500" />,
      partial: <AlertCircle className="h-5 w-5 text-warning-500" />,
      error: <AlertCircle className="h-5 w-5 text-danger-500" />,
      disconnected: <AlertCircle className="h-5 w-5 text-gray-500" />
    }
    return icons[status] || icons.disconnected
  }

  const getHealthColor = (health) => {
    if (health >= 90) return 'text-success-600'
    if (health >= 70) return 'text-warning-600'
    return 'text-danger-600'
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integrasi & API</h1>
          <p className="text-gray-600">Kelola koneksi sistem eksternal dan API</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <RefreshCw className="h-4 w-4 mr-2" />
            Sync All
          </button>
          <button className="btn-primary">
            <LinkIcon className="h-4 w-4 mr-2" />
            Tambah Koneksi
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-100">
              <Database className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Koneksi</p>
              <p className="text-2xl font-semibold text-gray-900">
                {integrationData.connections.length}
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
              <p className="text-sm font-medium text-gray-500">Aktif</p>
              <p className="text-2xl font-semibold text-success-600">
                {integrationData.connections.filter(c => c.status === 'connected').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-warning-100">
              <AlertCircle className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Bermasalah</p>
              <p className="text-2xl font-semibold text-warning-600">
                {integrationData.connections.filter(c => c.status === 'partial' || c.status === 'error').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-100">
              <Wifi className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Success Rate</p>
              <p className="text-2xl font-semibold text-gray-900">
                {integrationData.api_usage.success_rate}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'connections', name: 'Koneksi Sistem' },
            { id: 'api', name: 'API Management' },
            { id: 'sync', name: 'Sinkronisasi' },
            { id: 'logs', name: 'Logs & Monitoring' }
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
      {activeTab === 'connections' && (
        <div className="space-y-4">
          {integrationData.connections.map((connection) => (
            <div key={connection.id} className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-4">
                  {getStatusIcon(connection.status)}
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{connection.name}</h3>
                    <p className="text-sm text-gray-500">{connection.type}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <div className="text-right">
                    <p className={`text-sm font-medium ${getHealthColor(connection.health)}`}>
                      Health: {connection.health}%
                    </p>
                    <p className="text-xs text-gray-500">
                      Last sync: {new Date(connection.last_sync).toLocaleString('id-ID')}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(connection.status)}`}>
                    {getStatusText(connection.status)}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Data Types:</p>
                  <div className="flex flex-wrap gap-1">
                    {connection.data_types.map((type, index) => (
                      <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                        {type}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Endpoint:</p>
                  <p className="text-xs text-gray-500 font-mono">{connection.url}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="btn-primary text-sm">
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Sync Now
                </button>
                <button className="btn-secondary text-sm">
                  <Settings className="h-4 w-4 mr-1" />
                  Configure
                </button>
                <button className="btn-secondary text-sm">
                  Test Connection
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'api' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">API Statistics</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Requests</span>
                <span className="font-medium">{integrationData.api_usage.total_requests.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Successful</span>
                <span className="font-medium text-success-600">{integrationData.api_usage.successful.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Failed</span>
                <span className="font-medium text-danger-600">{integrationData.api_usage.failed.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Success Rate</span>
                <span className="font-medium">{integrationData.api_usage.success_rate}%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Avg Response Time</span>
                <span className="font-medium">{integrationData.api_usage.avg_response_time}ms</span>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">API Endpoints</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">GET /api/performance</p>
                  <p className="text-sm text-gray-500">Retrieve performance data</p>
                </div>
                <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">POST /api/budget</p>
                  <p className="text-sm text-gray-500">Submit budget data</p>
                </div>
                <span className="text-xs px-2 py-1 bg-success-100 text-success-700 rounded-full">
                  Active
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">GET /api/reports</p>
                  <p className="text-sm text-gray-500">Generate reports</p>
                </div>
                <span className="text-xs px-2 py-1 bg-warning-100 text-warning-700 rounded-full">
                  Limited
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'sync' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Jadwal Sinkronisasi</h3>
          <div className="space-y-4">
            {integrationData.sync_schedule.map((schedule, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{schedule.system}</h4>
                  <p className="text-sm text-gray-500">Frequency: {schedule.frequency}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Next: {new Date(schedule.next_sync).toLocaleString('id-ID')}
                  </p>
                  <button className="text-xs text-primary-600 hover:text-primary-500">
                    Run Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="btn-primary">
              <Settings className="h-4 w-4 mr-2" />
              Configure Sync Settings
            </button>
          </div>
        </div>
      )}

      {activeTab === 'logs' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Integration Logs</h3>
          <div className="space-y-3">
            {[
              {
                timestamp: '2024-12-20 10:30:15',
                system: 'SIPD',
                action: 'Data Sync',
                status: 'success',
                message: 'Successfully synced 1,250 budget records'
              },
              {
                timestamp: '2024-12-20 09:15:22',
                system: 'BKN',
                action: 'API Call',
                status: 'success',
                message: 'Retrieved employee performance data'
              },
              {
                timestamp: '2024-12-20 08:45:10',
                system: 'Sistem Kesehatan',
                action: 'Connection Test',
                status: 'error',
                message: 'Connection timeout after 30 seconds'
              },
              {
                timestamp: '2024-12-19 16:20:05',
                system: 'Sistem Pendidikan',
                action: 'Data Sync',
                status: 'warning',
                message: 'Partial sync completed - 15 records failed'
              }
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  {log.status === 'success' && <CheckCircle className="h-4 w-4 text-success-500" />}
                  {log.status === 'error' && <AlertCircle className="h-4 w-4 text-danger-500" />}
                  {log.status === 'warning' && <AlertCircle className="h-4 w-4 text-warning-500" />}
                  <div>
                    <p className="font-medium text-gray-900">{log.system} - {log.action}</p>
                    <p className="text-sm text-gray-500">{log.message}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">{log.timestamp}</p>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    log.status === 'success' ? 'bg-success-100 text-success-700' :
                    log.status === 'error' ? 'bg-danger-100 text-danger-700' :
                    'bg-warning-100 text-warning-700'
                  }`}>
                    {log.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

const Integration = () => {
  return (
    <Routes>
      <Route path="/" element={<IntegrationOverview />} />
      <Route path="/*" element={<IntegrationOverview />} />
    </Routes>
  )
}

export default Integration