import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuthStore } from './stores/authStore'
import Layout from './components/Layout/Layout'
import Login from './pages/Auth/Login'
import Dashboard from './pages/Dashboard/Dashboard'
import Planning from './pages/Planning/Planning'
import Performance from './pages/Performance/Performance'
import Budget from './pages/Budget/Budget'
import Reporting from './pages/Reporting/Reporting'
import Evaluation from './pages/Evaluation/Evaluation'
import Integration from './pages/Integration/Integration'
import Documentation from './pages/Documentation/Documentation'
import UserManagement from './pages/Admin/UserManagement'

function App() {
  const { isAuthenticated } = useAuthStore()

  if (!isAuthenticated) {
    return <Login />
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/planning/*" element={<Planning />} />
        <Route path="/performance/*" element={<Performance />} />
        <Route path="/budget/*" element={<Budget />} />
        <Route path="/reporting/*" element={<Reporting />} />
        <Route path="/evaluation/*" element={<Evaluation />} />
        <Route path="/integration/*" element={<Integration />} />
        <Route path="/documentation/*" element={<Documentation />} />
        <Route path="/admin/*" element={<UserManagement />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Layout>
  )
}

export default App