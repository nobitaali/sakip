import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import { Menu, X } from 'lucide-react'

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Fixed width */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex-shrink-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 lg:hidden">
          <h1 className="text-xl font-bold text-gray-900">SAKIP</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <Sidebar />
      </div>

      {/* Main content area - Flexible width */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header - Full width of remaining space */}
        <Header 
          onMenuClick={() => setSidebarOpen(true)}
          currentPath={location.pathname}
        />

        {/* Page content - Scrollable */}
        <main className="flex-1 overflow-y-auto bg-gray-50 scrollbar-thin">
          <div className="h-full">
            <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
              <div className="fade-in">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default Layout