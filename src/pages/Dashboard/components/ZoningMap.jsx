import { useState } from 'react'
import { MapPin, Layers, Info } from 'lucide-react'

const ZoningMap = () => {
  const [selectedZone, setSelectedZone] = useState(null)
  const [mapView, setMapView] = useState('performance')

  const zones = [
    {
      id: 1,
      name: 'Zona Utara',
      districts: ['Kecamatan A', 'Kecamatan B', 'Kecamatan C'],
      performance: 87.5,
      budget: 450000000000,
      population: 125000,
      coordinates: { x: 45, y: 20 },
      color: 'success'
    },
    {
      id: 2,
      name: 'Zona Tengah',
      districts: ['Kecamatan D', 'Kecamatan E', 'Kecamatan F'],
      performance: 82.3,
      budget: 380000000000,
      population: 98000,
      coordinates: { x: 50, y: 45 },
      color: 'warning'
    },
    {
      id: 3,
      name: 'Zona Selatan',
      districts: ['Kecamatan G', 'Kecamatan H', 'Kecamatan I'],
      performance: 79.1,
      budget: 320000000000,
      population: 87000,
      coordinates: { x: 40, y: 70 },
      color: 'danger'
    },
    {
      id: 4,
      name: 'Zona Timur',
      districts: ['Kecamatan J', 'Kecamatan K'],
      performance: 85.7,
      budget: 280000000000,
      population: 65000,
      coordinates: { x: 75, y: 50 },
      color: 'success'
    },
    {
      id: 5,
      name: 'Zona Barat',
      districts: ['Kecamatan L', 'Kecamatan M'],
      performance: 76.4,
      budget: 250000000000,
      population: 72000,
      coordinates: { x: 25, y: 55 },
      color: 'warning'
    }
  ]

  const getZoneColor = (color, isSelected = false) => {
    const colors = {
      success: isSelected ? '#10b981' : '#34d399',
      warning: isSelected ? '#f59e0b' : '#fbbf24',
      danger: isSelected ? '#ef4444' : '#f87171'
    }
    return colors[color] || colors.success
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

  const formatNumber = (num) => {
    return new Intl.NumberFormat('id-ID').format(num)
  }

  return (
    <div className="card">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-lg font-medium text-gray-900">
              Peta Zoning Integrasi
            </h3>
            <p className="text-sm text-gray-500">
              Visualisasi geografis kinerja dan anggaran per zona
            </p>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setMapView('performance')}
              className={`px-3 py-1 text-sm rounded-md ${
                mapView === 'performance'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Kinerja
            </button>
            <button
              onClick={() => setMapView('budget')}
              className={`px-3 py-1 text-sm rounded-md ${
                mapView === 'budget'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Anggaran
            </button>
            <button
              onClick={() => setMapView('population')}
              className={`px-3 py-1 text-sm rounded-md ${
                mapView === 'population'
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Populasi
            </button>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map Visualization */}
          <div className="lg:col-span-2">
            <div className="relative bg-gray-100 rounded-lg h-80 overflow-hidden">
              {/* Simplified map background */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-100 to-green-100">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Simplified region boundaries */}
                  <path
                    d="M10,10 L90,10 L90,90 L10,90 Z"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="0.5"
                  />
                  <path
                    d="M10,35 L90,35 M10,65 L90,65 M35,10 L35,90 M65,10 L65,90"
                    stroke="#e5e7eb"
                    strokeWidth="0.3"
                  />
                  
                  {/* Zone markers */}
                  {zones.map((zone) => (
                    <g key={zone.id}>
                      <circle
                        cx={zone.coordinates.x}
                        cy={zone.coordinates.y}
                        r={selectedZone?.id === zone.id ? "4" : "3"}
                        fill={getZoneColor(zone.color, selectedZone?.id === zone.id)}
                        stroke="white"
                        strokeWidth="1"
                        className="cursor-pointer transition-all duration-200 hover:r-4"
                        onClick={() => setSelectedZone(zone)}
                      />
                      <text
                        x={zone.coordinates.x}
                        y={zone.coordinates.y - 6}
                        textAnchor="middle"
                        className="text-xs font-medium fill-gray-700"
                      >
                        {zone.name}
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
              
              {/* Legend */}
              <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-sm">
                <h4 className="text-xs font-medium text-gray-900 mb-2">
                  {mapView === 'performance' && 'Tingkat Kinerja'}
                  {mapView === 'budget' && 'Anggaran'}
                  {mapView === 'population' && 'Populasi'}
                </h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-success-400"></div>
                    <span className="text-xs text-gray-600">
                      {mapView === 'performance' && 'Tinggi (≥85%)'}
                      {mapView === 'budget' && 'Besar (≥400M)'}
                      {mapView === 'population' && 'Padat (≥100K)'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-warning-400"></div>
                    <span className="text-xs text-gray-600">
                      {mapView === 'performance' && 'Sedang (75-84%)'}
                      {mapView === 'budget' && 'Sedang (250-399M)'}
                      {mapView === 'population' && 'Sedang (70-99K)'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-danger-400"></div>
                    <span className="text-xs text-gray-600">
                      {mapView === 'performance' && 'Rendah (<75%)'}
                      {mapView === 'budget' && 'Kecil (<250M)'}
                      {mapView === 'population' && 'Sedikit (<70K)'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Zone Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">Detail Zona</h4>
            
            {selectedZone ? (
              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium text-gray-900 mb-2">
                    {selectedZone.name}
                  </h5>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm text-gray-600">Kinerja</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {selectedZone.performance}%
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Anggaran</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatCurrency(selectedZone.budget)}
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600">Populasi</p>
                      <p className="text-lg font-semibold text-gray-900">
                        {formatNumber(selectedZone.population)} jiwa
                      </p>
                    </div>
                    
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Kecamatan</p>
                      <div className="space-y-1">
                        {selectedZone.districts.map((district, index) => (
                          <p key={index} className="text-sm text-gray-700">
                            • {district}
                          </p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  Pilih Zona
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Klik pada zona di peta untuk melihat detail
                </p>
              </div>
            )}
            
            {/* Zone List */}
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-900">Semua Zona</h5>
              {zones.map((zone) => (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`w-full text-left p-2 rounded-md text-sm transition-colors ${
                    selectedZone?.id === zone.id
                      ? 'bg-primary-50 text-primary-700'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{zone.name}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      zone.color === 'success' ? 'bg-success-100 text-success-700' :
                      zone.color === 'warning' ? 'bg-warning-100 text-warning-700' :
                      'bg-danger-100 text-danger-700'
                    }`}>
                      {zone.performance}%
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ZoningMap