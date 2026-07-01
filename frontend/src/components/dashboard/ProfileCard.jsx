import { User, Landmark, ShieldAlert, Shield } from 'lucide-react'

export default function ProfileCard({ user }) {
  const profile = {
    name: user?.name || 'Academic User',
    email: user?.email || 'name@university.edu',
    role: user?.role || 'Professor',
    university: user?.university || 'Delhi Technological University',
    subscription: 'Enterprise Account',
    storageUsed: 2.4, // GB
    storageLimit: 10 // GB
  }

  const storagePercentage = (profile.storageUsed / profile.storageLimit) * 100

  // Get user initials
  const userInitials = profile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  return (
    <div className="bg-[#18181B] border border-[#27272A] p-5 rounded-xl text-left shadow-sm">
      
      {/* Profile Details Header */}
      <div className="flex flex-col items-center justify-center text-center pb-6 border-b border-[#27272A]/70 mb-5">
        <div className="w-16 h-16 rounded-full bg-blue-600 border border-blue-500/20 text-white font-extrabold text-xl flex items-center justify-center mb-3">
          {userInitials}
        </div>
        
        <h3 className="font-display font-bold text-white text-base leading-none">{profile.name}</h3>
        <span className="text-[10px] text-zinc-500 font-mono mt-1.5 uppercase tracking-wider">{profile.role}</span>
      </div>

      <div className="space-y-4">
        {/* Info Rows */}
        <div className="flex items-center gap-3 text-xs">
          <div className="w-7 h-7 rounded bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-zinc-400 shrink-0">
            <User className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Account Email</span>
            <span className="text-white font-medium truncate max-w-[190px]">{profile.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="w-7 h-7 rounded bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-zinc-400 shrink-0">
            <Landmark className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Institution</span>
            <span className="text-white font-medium truncate max-w-[190px]">{profile.university}</span>
          </div>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="w-7 h-7 rounded bg-blue-500/5 border border-blue-500/10 flex items-center justify-center text-zinc-400 shrink-0">
            <Shield className="w-4 h-4 text-blue-500" />
          </div>
          <div className="flex flex-col text-left">
            <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Access Clearance</span>
            <span className="text-white font-bold">{profile.subscription}</span>
          </div>
        </div>

        {/* Storage Bar Indicator */}
        <div className="pt-2">
          <div className="flex justify-between items-center text-[10px] font-bold text-zinc-500 mb-1.5 uppercase tracking-wide">
            <span>Workspace Storage</span>
            <span>{profile.storageUsed} GB / {profile.storageLimit} GB</span>
          </div>
          
          <div className="w-full bg-[#09090B] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-blue-600 h-full rounded-full"
              style={{ width: `${storagePercentage}%` }}
            />
          </div>
        </div>

      </div>

    </div>
  )
}
