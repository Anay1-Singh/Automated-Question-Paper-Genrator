import {
  User,
  Mail,
  Lock,
  Bell,
  Trash2,
  AlertTriangle,
  Save,
} from 'lucide-react'

export default function StudentSettings() {
  const user = JSON.parse(localStorage.getItem('user') || '{}')

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">Settings</h1>
        <p className="text-xs text-zinc-500 mt-1">Manage your profile, security, and notification preferences.</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
        <h3 className="text-sm font-bold mb-4">Profile</h3>
        <div className="flex flex-col sm:flex-row items-start gap-5">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl font-black text-white shadow-lg shadow-emerald-900/30">
            {(user.name || 'S').charAt(0).toUpperCase()}
          </div>
          <div className="flex-1 space-y-3 w-full">
            <div className="flex flex-wrap items-center gap-2">
              <h4 className="text-sm font-bold text-white">{user.name || 'Student User'}</h4>
              <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Student
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-zinc-500">
              <Mail className="h-3.5 w-3.5" />
              {user.email || 'student@university.edu'}
            </div>
            <button className="inline-flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-300 transition-colors hover:bg-emerald-500/20">
              <User className="h-3.5 w-3.5" />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Change Password */}
      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Lock className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold">Change Password</h3>
        </div>
        <div className="space-y-3 max-w-md">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-300">Current Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-emerald-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-300">New Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-emerald-500"
              placeholder="••••••••"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-bold text-zinc-300">Confirm New Password</label>
            <input
              type="password"
              className="w-full rounded-xl border border-[#27272A] bg-[#09090B] px-3 py-2.5 text-sm text-white outline-none placeholder:text-zinc-700 focus:border-emerald-500"
              placeholder="••••••••"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-lg shadow-emerald-900/20 transition-all hover:-translate-y-0.5 hover:bg-emerald-500">
            <Save className="h-3.5 w-3.5" />
            Update Password
          </button>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-[#1a1a2e] bg-[#0f0f14] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Bell className="h-4 w-4 text-emerald-400" />
          <h3 className="text-sm font-bold">Notification Preferences</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Email notifications for study summaries', defaultChecked: true },
            { label: 'Email notifications for new notes uploads', defaultChecked: true },
            { label: 'Weekly revision tips', defaultChecked: false },
          ].map(item => (
            <label key={item.label} className="flex items-center justify-between gap-4 cursor-pointer group">
              <span className="text-xs font-semibold text-zinc-400 group-hover:text-zinc-300 transition-colors">{item.label}</span>
              <div className="relative">
                <input type="checkbox" defaultChecked={item.defaultChecked} className="peer sr-only" />
                <div className="h-6 w-11 rounded-full bg-[#27272A] transition-colors peer-checked:bg-emerald-600" />
                <div className="absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-zinc-400 transition-all peer-checked:translate-x-5 peer-checked:bg-white" />
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <h3 className="text-sm font-bold text-red-400">Danger Zone</h3>
        </div>
        <p className="text-xs text-zinc-500 mb-4">
          Once you delete your account, there is no going back. All your uploaded notes, generated study summaries, and custom cards data will be permanently removed.
        </p>
        <button className="inline-flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-2.5 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/20">
          <Trash2 className="h-3.5 w-3.5" />
          Delete Account
        </button>
      </div>
    </div>
  )
}
