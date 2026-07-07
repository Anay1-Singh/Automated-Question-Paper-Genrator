import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ForgotPassword from '../pages/ForgotPassword'
import VerifyOTP from '../pages/VerifyOTP'
import AdminDashboard from '../pages/AdminDashboard'
import StudentDashboard from '../pages/StudentDashboard'

/**
 * Redirects unauthenticated users to /login.
 */
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  return children
}

/**
 * Allows access only if the user's stored role matches the required role.
 * Redirects to the correct dashboard if roles mismatch.
 */
function RoleGuard({ requiredRole, children }) {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }

  const role = localStorage.getItem('role') || 'student'
  if (role !== requiredRole) {
    return <Navigate to={role === 'admin' ? '/dashboard/admin' : '/dashboard/student'} replace />
  }

  return children
}

/**
 * Redirects /dashboard to the correct role-based dashboard.
 */
function DashboardRedirect() {
  const token = localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }
  const role = localStorage.getItem('role') || 'student'
  return <Navigate to={role === 'admin' ? '/dashboard/admin' : '/dashboard/student'} replace />
}

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Legacy /dashboard redirects to role-based path */}
        <Route path="/dashboard" element={<DashboardRedirect />} />

        {/* Admin Dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            <RoleGuard requiredRole="admin">
              <AdminDashboard />
            </RoleGuard>
          }
        />

        {/* Student Dashboard */}
        <Route
          path="/dashboard/student"
          element={
            <RoleGuard requiredRole="student">
              <StudentDashboard />
            </RoleGuard>
          }
        />
      </Routes>
    </Router>
  )
}
