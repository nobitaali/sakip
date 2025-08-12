import { AlertTriangle, Clock, CheckCircle, X, Bell } from 'lucide-react'
import { useState } from 'react'

const AlertsPanel = () => {
  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: 'critical',
      title: 'Deadline LKJIP Mendekat',
      message: 'Batas waktu pengumpulan LKJIP tinggal 3 hari (31 Desember 2024)',
      opd: 'Dinas Pariwisata',
      time: '2 jam yang lalu',
      action: 'Upload LKJIP'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Capaian Kinerja Rendah',
      message: 'Indikator "Angka Partisipasi Sekolah" hanya mencapai 68% dari target 85%',
      opd: 'Dinas Pendidikan',
      time: '4 jam yang lalu',
      action: 'Review Kinerja'
    },
    {
      id: 3,
      type: 'info',
      title: 'Data SIPD Terupdate',
      message: 'Sinkronisasi data anggaran dari SIPD berhasil dilakukan',
      opd: 'Sistem',
      time: '6 jam yang lalu',
      action: 'Lihat Data'
    },
    {
      id: 4,
      type: 'success',
      title: 'Evaluasi Selesai',
      message: 'Evaluasi internal SAKIP Q4 telah diselesaikan dengan nilai 87.5',
      opd: 'Dinas Kesehatan',
      time: '1 hari yang lalu',
      action: 'Lihat Hasil'
    }
  ])

  const getAlertIcon = (type) => {
    const icons = {
      critical: <AlertTriangle className="h-5 w-5 text-danger-500" />,
      warning: <Clock className="h-5 w-5 text-warning-500" />,
      info: <Bell className="h-5 w-5 text-primary-500" />,
      success: <CheckCircle className="h-5 w-5 text-success-500" />
    }
    return icons[type]
  }

  const getAlertBg = (type) => {
    const backgrounds = {
      critical: 'bg-danger-50 border-danger-200',
      warning: 'bg-warning-50 border-warning-200',
      info: 'bg-primary-50 border-primary-200',
      success: 'bg-success-50 border-success-200'
    }
    return backgrounds[type]
  }

  const dismissAlert = (id) => {
    setAlerts(alerts.filter(alert => alert.id !== id))
  }

  const criticalCount = alerts.filter(alert => alert.type === 'critical').length
  const warningCount = alerts.filter(alert => alert.type === 'warning').length

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Alert & Reminder Sistem
            </h3>
            <p className="text-sm text-gray-500">
              Notifikasi penting dan pengingat deadline
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {criticalCount > 0 && (
              <div className="flex items-center space-x-1">
                <AlertTriangle className="h-4 w-4 text-danger-500" />
                <span className="text-sm font-medium text-danger-600">
                  {criticalCount} Kritis
                </span>
              </div>
            )}
            {warningCount > 0 && (
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-warning-500" />
                <span className="text-sm font-medium text-warning-600">
                  {warningCount} Perhatian
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="p-6">
        {alerts.length === 0 ? (
          <div className="text-center py-8">
            <CheckCircle className="mx-auto h-12 w-12 text-success-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Tidak ada alert</h3>
            <p className="mt-1 text-sm text-gray-500">
              Semua sistem berjalan normal
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-4 rounded-lg border ${getAlertBg(alert.type)}`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    {getAlertIcon(alert.type)}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-900">
                        {alert.title}
                      </h4>
                      <button
                        onClick={() => dismissAlert(alert.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <p className="mt-1 text-sm text-gray-700">
                      {alert.message}
                    </p>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{alert.opd}</span>
                        <span>•</span>
                        <span>{alert.time}</span>
                      </div>
                      <button className="text-xs font-medium text-primary-600 hover:text-primary-500">
                        {alert.action}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {alerts.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full text-center text-sm text-primary-600 hover:text-primary-500 font-medium">
              Lihat Semua Notifikasi →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default AlertsPanel