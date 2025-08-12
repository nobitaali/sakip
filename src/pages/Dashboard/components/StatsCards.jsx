import { TrendingUp, TrendingDown, DollarSign, Target, AlertTriangle, CheckCircle } from 'lucide-react'

const StatsCards = ({ period, quarter }) => {
  const stats = [
    {
      name: 'Rata-rata Nilai SAKIP',
      value: '78.5',
      change: '+2.3',
      changeType: 'increase',
      icon: Target,
      color: 'primary'
    },
    {
      name: 'Capaian Kinerja',
      value: '85.2%',
      change: '+5.1%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'success'
    },
    {
      name: 'Serapan Anggaran',
      value: '92.8%',
      change: '+8.3%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'warning'
    },
    {
      name: 'Indikator Bermasalah',
      value: '12',
      change: '-3',
      changeType: 'decrease',
      icon: AlertTriangle,
      color: 'danger'
    },
    {
      name: 'OPD Selesai Laporan',
      value: '28/35',
      change: '+5',
      changeType: 'increase',
      icon: CheckCircle,
      color: 'success'
    },
    {
      name: 'Total Anggaran',
      value: 'Rp 2.8T',
      change: '+12%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'primary'
    }
  ]

  const getColorClasses = (color) => {
    const colors = {
      primary: 'bg-primary-500 text-white',
      success: 'bg-success-500 text-white',
      warning: 'bg-warning-500 text-white',
      danger: 'bg-danger-500 text-white'
    }
    return colors[color] || colors.primary
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {stats.map((stat) => (
        <div key={stat.name} className="card p-6">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
            <div className="ml-4 flex-1">
              <p className="text-sm font-medium text-gray-500 truncate">
                {stat.name}
              </p>
              <div className="flex items-baseline">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
                <p className={`ml-2 flex items-baseline text-sm font-semibold ${
                  stat.changeType === 'increase' 
                    ? 'text-success-600' 
                    : 'text-danger-600'
                }`}>
                  {stat.changeType === 'increase' ? (
                    <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                  ) : (
                    <TrendingDown className="self-center flex-shrink-0 h-4 w-4" />
                  )}
                  <span className="ml-1">{stat.change}</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default StatsCards