import { useNavigate } from 'react-router-dom'
import { AlertCircle, LayoutDashboard, LogOut, ShieldCheck } from 'lucide-react'

export default function SystemAdminDashboard() {
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    localStorage.removeItem('role')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-[#09090B] text-white">
      <header className="flex h-16 items-center justify-between border-b border-[#1a1a2e] bg-[#09090B]/90 px-4 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/10 text-amber-300">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold">System Administration</p>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-amber-400">Hidden platform role</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 transition-colors hover:bg-red-500/15"
        >
          <LogOut className="h-3.5 w-3.5" />
          Logout
        </button>
      </header>

      <main className="mx-auto flex max-w-5xl flex-col gap-6 p-4 sm:p-6 lg:p-8">
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-amber-500/20 bg-amber-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-300">
            <LayoutDashboard className="h-3.5 w-3.5" />
            Admin Console
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Welcome, {user.name || 'Administrator'}</h1>
          <p className="mt-2 max-w-2xl text-sm text-zinc-500">
            Platform administration is reserved for manually provisioned accounts. Teacher and student registration stays separate from this role.
          </p>
        </div>

        <div className="flex items-start gap-3 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm text-amber-100">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <p>Platform management endpoints are not enabled yet. This route only verifies hidden admin authentication and routing.</p>
        </div>
      </main>
    </div>
  )
}
