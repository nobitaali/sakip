import { Routes, Route } from 'react-router-dom'
import { useState } from 'react'
import { Users, Plus, Edit, Trash2, Eye, Shield, Search, Filter } from 'lucide-react'

const UserManagementOverview = () => {
  const [activeTab, setActiveTab] = useState('users')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')

  const userData = {
    users: [
      {
        id: 1,
        username: 'superadmin',
        name: 'Super Administrator',
        email: 'superadmin@pemda.go.id',
        role: 'super_admin',
        opd: 'Sekretariat Daerah',
        status: 'active',
        last_login: '2024-12-20 10:30:00',
        created_at: '2024-01-01 00:00:00'
      },
      {
        id: 2,
        username: 'admin_diknas',
        name: 'Admin Dinas Pendidikan',
        email: 'admin@diknas.pemda.go.id',
        role: 'admin_opd',
        opd: 'Dinas Pendidikan',
        status: 'active',
        last_login: '2024-12-20 09:15:00',
        created_at: '2024-01-15 00:00:00'
      },
      {
        id: 3,
        username: 'admin_dinkes',
        name: 'Admin Dinas Kesehatan',
        email: 'admin@dinkes.pemda.go.id',
        role: 'admin_opd',
        opd: 'Dinas Kesehatan',
        status: 'active',
        last_login: '2024-12-19 16:45:00',
        created_at: '2024-01-15 00:00:00'
      },
      {
        id: 4,
        username: 'evaluator1',
        name: 'Evaluator SAKIP',
        email: 'evaluator@inspektorat.pemda.go.id',
        role: 'evaluator',
        opd: 'Inspektorat',
        status: 'active',
        last_login: '2024-12-20 08:00:00',
        created_at: '2024-02-01 00:00:00'
      },
      {
        id: 5,
        username: 'viewer_public',
        name: 'Public Viewer',
        email: 'public@pemda.go.id',
        role: 'viewer',
        opd: 'Publik',
        status: 'inactive',
        last_login: '2024-12-18 14:20:00',
        created_at: '2024-03-01 00:00:00'
      }
    ],
    roles: [
      {
        id: 'super_admin',
        name: 'Super Administrator',
        description: 'Full system access and control',
        user_count: 1,
        permissions: [
          'dashboard', 'planning', 'performance', 'budget', 'reporting',
          'evaluation', 'integration', 'user_management', 'system_config'
        ]
      },
      {
        id: 'admin_opd',
        name: 'Admin OPD',
        description: 'OPD-level data management',
        user_count: 25,
        permissions: [
          'dashboard', 'planning', 'performance', 'budget', 'reporting'
        ]
      },
      {
        id: 'evaluator',
        name: 'Evaluator',
        description: 'Evaluation and assessment access',
        user_count: 3,
        permissions: [
          'dashboard', 'evaluation', 'performance', 'reporting'
        ]
      },
      {
        id: 'viewer',
        name: 'Public Viewer',
        description: 'Read-only public access',
        user_count: 5,
        permissions: ['dashboard']
      }
    ],
    activity_log: [
      {
        id: 1,
        user: 'admin_diknas',
        action: 'update_performance',
        description: 'Updated performance data for Q4 2024',
        timestamp: '2024-12-20 09:30:00',
        ip_address: '192.168.1.100'
      },
      {
        id: 2,
        user: 'superadmin',
        action: 'create_user',
        description: 'Created new user account for Dinas Pariwisata',
        timestamp: '2024-12-19 14:20:00',
        ip_address: '192.168.1.50'
      },
      {
        id: 3,
        user: 'evaluator1',
        action: 'complete_evaluation',
        description: 'Completed internal evaluation for Dinas Kesehatan',
        timestamp: '2024-12-19 11:15:00',
        ip_address: '192.168.1.75'
      }
    ]
  }

  const getRoleColor = (role) => {
    const colors = {
      super_admin: 'bg-purple-100 text-purple-700',
      admin_opd: 'bg-primary-100 text-primary-700',
      evaluator: 'bg-warning-100 text-warning-700',
      viewer: 'bg-gray-100 text-gray-700'
    }
    return colors[role] || colors.viewer
  }

  const getStatusColor = (status) => {
    const colors = {
      active: 'bg-success-100 text-success-700',
      inactive: 'bg-danger-100 text-danger-700',
      suspended: 'bg-warning-100 text-warning-700'
    }
    return colors[status] || colors.inactive
  }

  const getStatusText = (status) => {
    const texts = {
      active: 'Aktif',
      inactive: 'Tidak Aktif',
      suspended: 'Ditangguhkan'
    }
    return texts[status] || 'Tidak Diketahui'
  }

  const filteredUsers = userData.users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = selectedRole === 'all' || user.role === selectedRole
    return matchesSearch && matchesRole
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manajemen User</h1>
          <p className="text-gray-600">Kelola pengguna sistem dan hak akses</p>
        </div>
        <div className="flex space-x-3">
          <button className="btn-secondary">
            <Shield className="h-4 w-4 mr-2" />
            Audit Log
          </button>
          <button className="btn-primary">
            <Plus className="h-4 w-4 mr-2" />
            Tambah User
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-primary-100">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Users</p>
              <p className="text-2xl font-semibold text-gray-900">
                {userData.users.length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-success-100">
              <Users className="h-6 w-6 text-success-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Active Users</p>
              <p className="text-2xl font-semibold text-success-600">
                {userData.users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-warning-100">
              <Shield className="h-6 w-6 text-warning-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Admin OPD</p>
              <p className="text-2xl font-semibold text-warning-600">
                {userData.users.filter(u => u.role === 'admin_opd').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-gray-100">
              <Eye className="h-6 w-6 text-gray-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Online Now</p>
              <p className="text-2xl font-semibold text-gray-900">3</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'users', name: 'Users' },
            { id: 'roles', name: 'Roles & Permissions' },
            { id: 'activity', name: 'Activity Log' },
            { id: 'settings', name: 'Settings' }
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
      {activeTab === 'users' && (
        <div className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari user..."
                  className="input pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                className="input"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="all">Semua Role</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin_opd">Admin OPD</option>
                <option value="evaluator">Evaluator</option>
                <option value="viewer">Viewer</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      OPD
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Last Login
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-sm font-medium text-primary-600">
                                {user.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {user.opd}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(user.status)}`}>
                          {getStatusText(user.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.last_login).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end space-x-2">
                          <button className="text-primary-600 hover:text-primary-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-warning-600 hover:text-warning-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-danger-600 hover:text-danger-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'roles' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {userData.roles.map((role) => (
            <div key={role.id} className="card p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{role.name}</h3>
                  <p className="text-sm text-gray-500">{role.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary-600">{role.user_count}</p>
                  <p className="text-xs text-gray-500">Users</p>
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Permissions:</h4>
                <div className="flex flex-wrap gap-1">
                  {role.permissions.map((permission, index) => (
                    <span key={index} className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                      {permission.replace('_', ' ')}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-2">
                <button className="btn-secondary text-sm flex-1">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit Role
                </button>
                <button className="btn-secondary text-sm">
                  <Eye className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'activity' && (
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {userData.activity_log.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0 h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <Users className="h-4 w-4 text-primary-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.user}</p>
                    <p className="text-sm text-gray-500">{activity.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-900">{new Date(activity.timestamp).toLocaleString('id-ID')}</p>
                  <p className="text-xs text-gray-500">{activity.ip_address}</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full text-center text-sm text-primary-600 hover:text-primary-500 font-medium">
              Load More Activities →
            </button>
          </div>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Password Policy</p>
                  <p className="text-sm text-gray-500">Minimum 8 characters, mixed case</p>
                </div>
                <button className="btn-secondary text-sm">Configure</button>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                  <p className="text-sm text-gray-500">Require 2FA for admin users</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Session Timeout</p>
                  <p className="text-sm text-gray-500">Auto logout after inactivity</p>
                </div>
                <select className="input w-32">
                  <option>30 min</option>
                  <option>1 hour</option>
                  <option>2 hours</option>
                  <option>4 hours</option>
                </select>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">User Registration</p>
                  <p className="text-sm text-gray-500">Allow self-registration</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-500">Send email for user activities</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Audit Logging</p>
                  <p className="text-sm text-gray-500">Log all user activities</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

const UserManagement = () => {
  return (
    <Routes>
      <Route path="/" element={<UserManagementOverview />} />
      <Route path="/*" element={<UserManagementOverview />} />
    </Routes>
  )
}

export default UserManagement