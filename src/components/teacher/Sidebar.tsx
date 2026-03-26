'use client'

import { LayoutDashboard, Users, BookOpen, Trophy, BarChart2, Settings, Plus } from 'lucide-react'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
  onCreateClass: () => void
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Students', icon: Users },
  { id: 'assignments', label: 'Assignments', icon: BookOpen },
  { id: 'competitions', label: 'Competitions', icon: Trophy },
  { id: 'reports', label: 'Reports', icon: BarChart2 },
  { id: 'settings', label: 'Settings', icon: Settings },
]

export default function Sidebar({ activeTab, onTabChange, onCreateClass }: SidebarProps) {
  return (
    <aside
      className="flex flex-col w-52 min-h-full flex-shrink-0"
      style={{
        background: 'rgba(255,255,255,0.5)',
        backdropFilter: 'blur(16px)',
        borderRight: '1.5px solid rgba(200,210,240,0.5)',
      }}
    >
      {/* Main nav */}
      <nav className="flex-1 px-3 pt-4 space-y-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: active ? 'linear-gradient(135deg, #4a90e2, #1e88e5)' : 'transparent',
                color: active ? 'white' : '#4b5563',
                boxShadow: active ? '0 4px 12px rgba(30,136,229,0.3)' : 'none',
              }}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </button>
          )
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-5 pt-3 space-y-1" style={{ borderTop: '1px solid rgba(200,210,240,0.4)' }}>
        <button
          onClick={onCreateClass}
          className="flex items-center justify-center gap-2 w-full py-3 rounded-xl text-white text-sm font-bold mb-2 transition-all"
          style={{
            background: 'linear-gradient(135deg, #4a90e2, #1e88e5)',
            boxShadow: '0 4px 14px rgba(30,136,229,0.35)',
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 18px rgba(30,136,229,0.5)' }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 14px rgba(30,136,229,0.35)' }}
        >
          <Plus className="w-4 h-4" />
          Create Class
        </button>

        <button
          onClick={() => onTabChange('dashboard')}
          className="flex items-center gap-3 w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 transition-colors hover:text-gray-700"
        >
          <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
          Dashboard
        </button>

        <button
          onClick={() => onTabChange('settings')}
          className="flex items-center justify-between w-full px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-500 transition-colors hover:text-gray-700"
        >
          <span className="flex items-center gap-3">
            <Settings className="w-4 h-4 flex-shrink-0" />
            Settings
          </span>
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </aside>
  )
}
