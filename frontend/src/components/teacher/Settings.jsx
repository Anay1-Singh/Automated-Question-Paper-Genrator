import {
  AlertCircle,
  Lock,
  Mail,
  ShieldCheck,
  User,
} from 'lucide-react'

function readStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('user') || '{}')
  } catch {
    return {}
  }
}

export default function TeacherSettings({ user: userProp }) {
  const user = userProp || readStoredUser()
  const displayName = user?.name || 'Signed in teacher'
  const displayEmail = user?.email || 'Email unavailable'
  const displayRole = user?.role || 'teacher'
  const initials = displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Settings</h1>
        <p className="mt-1 text-xs text-zinc-500">View the authenticated account connected to this workspace.</p>
      </div>

      <section className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
        <h3 className="mb-4 text-sm font-bold">Profile</h3>
        <div className="flex flex-col items-start gap-5 sm:flex-row">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-600 text-2xl font-black text-white shadow-lg shadow-indigo-900/30">
            {initials || 'T'}
          </div>
          <div className="w-full flex-1 space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-white">{displayName}</h4>
              <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-indigo-400">
                {displayRole}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Mail className="h-3.5 w-3.5" />
              {displayEmail}
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <ShieldCheck className="h-3.5 w-3.5" />
              Workspace data is loaded from MongoDB for this authenticated user.
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
        <div className="mb-3 flex items-center gap-2">
          <Lock className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-bold">Account Management</h3>
        </div>
        <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs text-amber-100">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
          <p>Password changes, notification preferences, profile edits, and account deletion require dedicated backend endpoints before they can be enabled.</p>
        </div>
        <button
          type="button"
          disabled
          className="mt-4 inline-flex cursor-not-allowed items-center gap-2 rounded-xl border border-[#27272A] bg-[#09090B] px-4 py-2.5 text-xs font-bold text-zinc-600"
        >
          <User className="h-3.5 w-3.5" />
          Profile updates unavailable
        </button>
      </section>
    </div>
  )
}
