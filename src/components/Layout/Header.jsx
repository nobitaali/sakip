import { Menu, Bell, Search } from 'lucide-react'
import { useAuthStore } from '../../stores/authStore'

const Header = ({ onMenuClick, currentPath }) => {
  const { user } = useAuthStore()

  const getPageTitle = (path) => {
    const titles = {
      '/dashboard': 'Dashboard Utama',
      '/planning': 'Modul Perencanaan',
      '/performance': 'Pengukuran Kinerja',
      '/budget': 'Modul Anggaran',
      '/reporting': 'Modul Pelaporan',
      '/evaluation': 'Modul Evaluasi',
      '/integration': 'Integrasi & API',
      '/documentation': 'Dokumentasi',
      '/admin': 'Manajemen User'
    }
    
    for (const [route, title] of Object.entries(titles)) {
      if (path.startsWith(route)) {
        return title
      }
    }
    return 'SAKIP'
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 flex-shrink-0">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side */}
          <div className="flex items-center min-w-0 flex-1">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 lg:hidden mr-2"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                {getPageTitle(currentPath)}
              </h1>
              <p className="text-sm text-gray-500 truncate">
                Sistem Akuntabilitas Kinerja Instansi Pemerintah
              </p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center space-x-4 flex-shrink-0">
            {/* Search */}
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Cari..."
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            {/* Notifications */}
            <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
            </button>

            {/* User info */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user?.name?.charAt(0) || 'U'}
                  </span>
                </div>
              </div>
              <div className="ml-3 hidden lg:block">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.opd || user?.role}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header