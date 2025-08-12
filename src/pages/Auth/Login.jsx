import { useState } from 'react'
import { useAuthStore } from '../../stores/authStore'
import { Eye, EyeOff, Lock, User } from 'lucide-react'

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuthStore()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Demo users for different roles
      const demoUsers = {
        'superadmin': {
          id: 1,
          name: 'Super Administrator',
          username: 'superadmin',
          role: 'super_admin',
          opd: 'Sekretariat Daerah',
          permissions: ['all']
        },
        'admin': {
          id: 2,
          name: 'Admin OPD',
          username: 'admin',
          role: 'admin_opd',
          opd: 'Dinas Pendidikan',
          permissions: ['planning', 'performance', 'budget', 'reporting']
        },
        'evaluator': {
          id: 3,
          name: 'Evaluator SAKIP',
          username: 'evaluator',
          role: 'evaluator',
          opd: 'Inspektorat',
          permissions: ['evaluation', 'performance', 'reporting']
        },
        'viewer': {
          id: 4,
          name: 'Public Viewer',
          username: 'viewer',
          role: 'viewer',
          opd: 'Publik',
          permissions: ['dashboard']
        }
      }

      const user = demoUsers[formData.username]
      if (user && formData.password === 'password') {
        login(user)
      } else {
        alert('Username atau password salah')
      }
      setLoading(false)
    }, 1000)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xl">S</span>
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            SAKIP
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Sistem Akuntabilitas Kinerja Instansi Pemerintah
          </p>
          <p className="text-center text-xs text-gray-500">
            Versi Terpadu & Terintegrasi
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="sr-only">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className="input pl-10"
                  placeholder="Username"
                  value={formData.username}
                  onChange={handleChange}
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  className="input pl-10 pr-10"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {loading ? 'Masuk...' : 'Masuk'}
            </button>
          </div>

          <div className="mt-6">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="text-sm font-medium text-gray-900 mb-2">Demo Accounts:</h3>
              <div className="text-xs text-gray-600 space-y-1">
                <div><strong>Super Admin:</strong> superadmin / password</div>
                <div><strong>Admin OPD:</strong> admin / password</div>
                <div><strong>Evaluator:</strong> evaluator / password</div>
                <div><strong>Viewer:</strong> viewer / password</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login