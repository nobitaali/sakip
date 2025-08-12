import { Trophy, Medal, Award } from 'lucide-react'

const OPDRanking = ({ period }) => {
  const rankings = [
    {
      rank: 1,
      opd: 'Dinas Pendidikan',
      score: 89.5,
      change: '+2.1',
      status: 'excellent'
    },
    {
      rank: 2,
      opd: 'Dinas Kesehatan',
      score: 87.3,
      change: '+1.8',
      status: 'excellent'
    },
    {
      rank: 3,
      opd: 'Dinas Pekerjaan Umum',
      score: 85.7,
      change: '+0.5',
      status: 'good'
    },
    {
      rank: 4,
      opd: 'Dinas Sosial',
      score: 83.2,
      change: '-0.3',
      status: 'good'
    },
    {
      rank: 5,
      opd: 'Dinas Pertanian',
      score: 81.9,
      change: '+1.2',
      status: 'good'
    },
    {
      rank: 6,
      opd: 'Dinas Pariwisata',
      score: 79.4,
      change: '-1.1',
      status: 'fair'
    },
    {
      rank: 7,
      opd: 'Dinas Perdagangan',
      score: 77.8,
      change: '+0.8',
      status: 'fair'
    },
    {
      rank: 8,
      opd: 'Dinas Lingkungan Hidup',
      score: 75.6,
      change: '-0.5',
      status: 'fair'
    }
  ]

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />
    if (rank === 3) return <Award className="h-5 w-5 text-orange-500" />
    return <span className="text-sm font-medium text-gray-500">#{rank}</span>
  }

  const getStatusColor = (status) => {
    const colors = {
      excellent: 'bg-success-100 text-success-800',
      good: 'bg-primary-100 text-primary-800',
      fair: 'bg-warning-100 text-warning-800',
      poor: 'bg-danger-100 text-danger-800'
    }
    return colors[status] || colors.fair
  }

  const getStatusText = (status) => {
    const texts = {
      excellent: 'Sangat Baik',
      good: 'Baik',
      fair: 'Cukup',
      poor: 'Kurang'
    }
    return texts[status] || 'Cukup'
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">
          Ranking OPD - Nilai SAKIP {period}
        </h3>
        <p className="text-sm text-gray-500">
          Berdasarkan evaluasi kinerja terkini
        </p>
      </div>
      
      <div className="p-6">
        <div className="space-y-4">
          {rankings.map((item) => (
            <div key={item.rank} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-8 flex justify-center">
                  {getRankIcon(item.rank)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {item.opd}
                  </p>
                  <div className="flex items-center space-x-2">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                      {getStatusText(item.status)}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="text-right">
                <p className="text-lg font-semibold text-gray-900">
                  {item.score}
                </p>
                <p className={`text-sm ${
                  item.change.startsWith('+') 
                    ? 'text-success-600' 
                    : 'text-danger-600'
                }`}>
                  {item.change}
                </p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button className="w-full text-center text-sm text-primary-600 hover:text-primary-500 font-medium">
            Lihat Semua OPD →
          </button>
        </div>
      </div>
    </div>
  )
}

export default OPDRanking