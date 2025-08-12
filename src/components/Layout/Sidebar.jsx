import { Link, useLocation } from 'react-router-dom'
import { useAuthStore } from '../../stores/authStore'
import {
  LayoutDashboard,
  ClipboardList,
  TrendingUp,
  DollarSign,
  FileText,
  CheckSquare,
  Link as LinkIcon,
  Users,
  Settings,
  LogOut,
  Book
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['super_admin', 'admin_opd', 'evaluator', 'viewer']
  },
  {
    name: 'Perencanaan',
    href: '/planning',
    icon: ClipboardList,
    roles: ['super_admin', 'admin_opd']
  },
  {
    name: 'Pengukuran Kinerja',
    href: '/performance',
    icon: TrendingUp,
    roles: ['super_admin', 'admin_opd', 'evaluator']
  },
  {
    name: 'Anggaran',
    href: '/budget',
    icon: DollarSign,
    roles: ['super_admin', 'admin_opd']
  },
  {
    name: 'Pelaporan',
    href: '/reporting',
    icon: FileText,
    roles: ['super_admin', 'admin_opd', 'evaluator']
  },
  {
    name: 'Evaluasi',
    href: '/evaluation',
    icon: CheckSquare,
    roles: ['super_admin', 'evaluator']
  },
  {
    name: 'Integrasi & API',
    href: '/integration',
    icon: LinkIcon,
    roles: ['super_admin']
  },
  {
    name: 'Dokumentasi',
    href: '/documentation',
    icon: Book,
    roles: ['super_admin', 'admin_opd', 'evaluator', 'viewer']
  },
  {
    name: 'Manajemen User',
    href: '/admin',
    icon: Users,
    roles: ['super_admin']
  }
]

const Sidebar = () => {
  const location = useLocation()
  const { user, logout, hasRole } = useAuthStore()

  const filteredNavigation = navigation.filter(item => 
    item.roles.some(role => hasRole(role))
  )

  return (
    <div className="flex flex-col h-full w-64 bg-white">
      {/* Logo */}
      <div className="flex items-center h-16 px-4 border-b border-gray-200 flex-shrink-0">
        <div className="flex items-center w-full">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">S</span>
            </div>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <h1 className="text-lg font-bold text-gray-900 truncate">SAKIP</h1>
            <p className="text-xs text-gray-500 truncate">Versi Terpadu</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto scrollbar-thin">
        {filteredNavigation.map((item) => {
          const isActive = location.pathname.startsWith(item.href)
          return (
            <Link
              key={item.name}
              to={item.href}
              className={`
                flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors duration-150 ease-in-out
                ${isActive
                  ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-500'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }
              `}
            >
              <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          )
        })}
      </nav>

      {/* User info and logout */}
      <div className="border-t border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center mb-3">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-primary-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user?.name?.charAt(0) || 'U'}
              </span>
            </div>
          </div>
          <div className="ml-3 min-w-0 flex-1">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.opd || user?.role}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm text-gray-600 rounded-lg hover:bg-gray-50 hover:text-gray-900 transition-colors duration-150 ease-in-out"
        >
          <LogOut className="mr-3 h-4 w-4 flex-shrink-0" />
          <span>Keluar</span>
        </button>
      </div>
    </div>
  )
}

export default Sidebar