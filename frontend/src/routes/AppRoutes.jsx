import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Landing from '../pages/Landing'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import ForgotPassword from '../pages/ForgotPassword'
import VerifyOTP from '../pages/VerifyOTP'
import TeacherDashboard from '../pages/TeacherDashboard'
import SystemAdminDashboard from '../pages/SystemAdminDashboard'
import StudentDashboard from '../pages/StudentDashboard'

/**
 * Returns the dashboard path for the authenticated role.
 */
function getDashboardPath(role) {
  if (role === 'teacher') return '/dashboard/teacher'
  if (role === 'admin') return '/dashboard/admin'
  return '/dashboard/student'
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
    return <Navigate to={getDashboardPath(role)} replace />
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
  return <Navigate to={getDashboardPath(role)} replace />
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

        {/* Teacher Dashboard */}
        <Route
          path="/dashboard/teacher"
          element={
            <RoleGuard requiredRole="teacher">
              <TeacherDashboard />
            </RoleGuard>
          }
        />

        {/* Hidden System Admin Dashboard */}
        <Route
          path="/dashboard/admin"
          element={
            <RoleGuard requiredRole="admin">
              <SystemAdminDashboard />
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
