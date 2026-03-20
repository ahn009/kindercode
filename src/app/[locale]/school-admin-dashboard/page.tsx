'use client'

import { useState, useEffect } from 'react'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/context/AuthContext'
import { doc, onSnapshot, getDoc } from 'firebase/firestore'
import { sendEmailVerification, reload } from 'firebase/auth'
import { db } from '@/lib/firebase'
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Trophy,
  FileText,
  Settings,
  Bell,
  Plus,
  Eye,
  Upload,
  Download,
  ChevronDown,
  LogOut,
  TrendingUp,
  Menu,
  X,
  Building2,
  UserCheck,
  BarChart3,
  Target,
  Zap,
  ChevronRight,
  MapPin,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
} from 'lucide-react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts'

// ── Types ───────────────────────────────────────────────────────────────────
interface SchoolData {
  schoolId: string
  schoolName: string
  schoolType: string
  country: string
  stateCity: string
  adminName: string
  adminEmail: string
  status: string
}

// ── Mock data ──────────────────────────────────────────────────────────────
const WEEKLY_DATA = [
  { day: 'Mon', classes: 6 },
  { day: 'Tue', classes: 8 },
  { day: 'Wed', classes: 5 },
  { day: 'Thu', classes: 9 },
  { day: 'Fri', classes: 7 },
  { day: 'Sat', classes: 3 },
  { day: 'Sun', classes: 2 },
]

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, href: '/school-admin-dashboard' },
  { id: 'teachers', label: 'Teachers', icon: Users, href: '#' },
  { id: 'classes', label: 'Classes', icon: BookOpen, href: '#' },
  { id: 'students', label: 'Students', icon: GraduationCap, href: '#' },
  { id: 'competitions', label: 'Competitions', icon: Trophy, href: '#' },
  { id: 'reports', label: 'Reports', icon: FileText, href: '#' },
]

// ── School building SVG ────────────────────────────────────────────────────
function SchoolBanner({ school, adminName, emailVerified }: { school: SchoolData | null; adminName: string; emailVerified: boolean }) {
  const displayName = adminName || 'Admin'
  const firstName = displayName.split(' ')[0]
  return (
    <div
      className="w-full rounded-2xl overflow-hidden relative flex items-center"
      style={{
        background: 'linear-gradient(135deg, #e8f0fe 0%, #f0e8ff 50%, #e8f8ff 100%)',
        minHeight: 140,
        border: '1.5px solid rgba(200,210,240,0.6)',
      }}
    >
      <div className="px-6 py-5 flex-1 z-10">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4" style={{ color: '#4a90e2' }} />
          <span className="text-sm font-bold" style={{ color: '#4a90e2' }}>
            {school?.schoolName || 'Your School'}
          </span>
        </div>
        <p className="text-2xl font-bold text-gray-800 mb-1">
          Welcome back, <span style={{ color: '#ff7b42' }}>{firstName}!</span>
        </p>
        <p className="text-sm text-gray-500">Manage your school, track progress, and grow your community.</p>
        <div className="mt-3 flex items-center gap-2 flex-wrap">
          {emailVerified ? (
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#e8f8ee', color: '#27ae60', border: '1px solid #27ae60' }}>
              ✓ Account Verified
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#fff8e1', color: '#f39c12', border: '1px solid #f39c12' }}>
              ⏳ Pending Verification
            </span>
          )}
          {school?.schoolId && (
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: '#e8f0fe', color: '#4a90e2', border: '1px solid #4a90e2' }}>
              #{school.schoolId}
            </span>
          )}
        </div>
      </div>

      <div className="absolute right-0 top-0 bottom-0 w-64 opacity-60 pointer-events-none" aria-hidden="true">
        <svg viewBox="0 0 260 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <rect x="60" y="55" width="140" height="70" rx="4" fill="#c8d8f0" />
          <polygon points="55,58 130,20 205,58" fill="#9aa8cc" />
          <line x1="130" y1="5" x2="130" y2="22" stroke="#888" strokeWidth="2.5" />
          <rect x="130" y="5" width="20" height="12" rx="2" fill="#ff6b6b" />
          <rect x="118" y="90" width="24" height="35" rx="3" fill="#6a9dbf" />
          <rect x="75" y="70" width="18" height="16" rx="2" fill="#7ec8f7" />
          <line x1="84" y1="70" x2="84" y2="86" stroke="white" strokeWidth="1" opacity="0.7" />
          <line x1="75" y1="78" x2="93" y2="78" stroke="white" strokeWidth="1" opacity="0.7" />
          <rect x="167" y="70" width="18" height="16" rx="2" fill="#7ec8f7" />
          <line x1="176" y1="70" x2="176" y2="86" stroke="white" strokeWidth="1" opacity="0.7" />
          <line x1="167" y1="78" x2="185" y2="78" stroke="white" strokeWidth="1" opacity="0.7" />
          <circle cx="35" cy="115" r="16" fill="#52b788" />
          <rect x="31" y="115" width="8" height="14" rx="2" fill="#5a3620" />
          <circle cx="225" cy="113" r="14" fill="#6bcb77" />
          <rect x="221" y="113" width="8" height="14" rx="2" fill="#5a3620" />
        </svg>
      </div>
    </div>
  )
}

// ── Verification banner ─────────────────────────────────────────────────────
function VerificationBanner({ email, onResend, resending, justResent }: {
  email: string
  onResend: () => void
  resending: boolean
  justResent: boolean
}) {
  return (
    <div
      className="w-full rounded-2xl px-5 py-3 flex items-center gap-3 flex-wrap"
      style={{ background: '#fff8e1', border: '1.5px solid #f39c12' }}
    >
      <AlertTriangle className="w-5 h-5 flex-shrink-0" style={{ color: '#f39c12' }} />
      <p className="text-sm font-semibold text-yellow-800 flex-1 min-w-0">
        <span className="font-bold">ACTION REQUIRED:</span> Your email address{' '}
        <span className="font-bold">{email}</span> has not been verified. Please check your inbox and click the verification link to activate your school account.
      </p>
      <button
        onClick={onResend}
        disabled={resending || justResent}
        className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-60"
        style={{ background: '#f39c12', color: 'white' }}
      >
        {resending ? (
          <RefreshCw className="w-3 h-3 animate-spin" />
        ) : justResent ? (
          <CheckCircle className="w-3 h-3" />
        ) : (
          <RefreshCw className="w-3 h-3" />
        )}
        {justResent ? 'Sent!' : resending ? 'Sending...' : 'Resend Email'}
      </button>
    </div>
  )
}

// ── Sidebar ────────────────────────────────────────────────────────────────
function Sidebar({ active, onNav, mobile, onClose, emailVerified }: {
  active: string
  onNav: (id: string) => void
  mobile?: boolean
  onClose?: () => void
  emailVerified: boolean
}) {
  return (
    <aside
      className={`flex flex-col h-full ${mobile ? 'w-72' : 'w-64'}`}
      style={{
        background: 'rgba(30,60,114,0.97)',
        backdropFilter: 'blur(16px)',
        borderRight: '1px solid rgba(255,255,255,0.08)',
      }}
    >
      <div className="px-6 py-5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #FFD93D, #FF8C42)' }}>
            <span className="text-white font-black text-xs">K</span>
          </div>
          <span className="font-fredoka text-xl font-bold" style={{ background: 'linear-gradient(135deg, #FFD93D, #FF8C42)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
            KinderCode
          </span>
        </div>
        {mobile && onClose && (
          <button onClick={onClose} className="text-white/60 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const isActive = active === item.id
          const isLocked = !emailVerified && item.id !== 'dashboard'
          return (
            <button
              key={item.id}
              onClick={() => { if (!isLocked) { onNav(item.id); onClose?.() } }}
              title={isLocked ? 'Verify your email to access this section' : undefined}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-left"
              style={{
                background: isActive ? 'linear-gradient(135deg, rgba(74,144,226,0.3), rgba(142,36,170,0.2))' : 'transparent',
                border: isActive ? '1px solid rgba(74,144,226,0.4)' : '1px solid transparent',
                color: isLocked ? 'rgba(255,255,255,0.3)' : isActive ? '#FFD93D' : 'rgba(255,255,255,0.7)',
                cursor: isLocked ? 'not-allowed' : 'pointer',
              }}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="text-sm font-semibold">{item.label}</span>
              {isLocked && <span className="ml-auto text-xs opacity-50">🔒</span>}
              {!isLocked && item.id === 'teachers' && (
                <span className="ml-auto px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: '#ff6b6b', color: 'white' }}>3</span>
              )}
            </button>
          )
        })}
      </nav>

      <div className="px-3 py-4 border-t border-white/10 space-y-2">
        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/60 hover:text-white hover:bg-white/10 transition-all">
          <Settings className="w-4 h-4" />
          <span className="text-sm font-semibold">Settings</span>
        </button>
        <Link
          href="/"
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-semibold">Logout</span>
        </Link>
      </div>
    </aside>
  )
}

// ── Stat card ──────────────────────────────────────────────────────────────
const STATS_TEMPLATE = [
  { label: 'Total Teachers', icon: Users, color: '#4a90e2', bg: '#e8f0fe', trend: '+2 this month' },
  { label: 'Total Students', icon: GraduationCap, color: '#ff7b42', bg: '#fff0ea', trend: '+18 this month' },
  { label: 'Total Classes', icon: BookOpen, color: '#27ae60', bg: '#e8f8ee', trend: '4 active' },
  { label: 'School Progress', icon: BarChart3, color: '#8e24aa', bg: '#f3e8ff', trend: '+5% this week' },
]

function StatCard({ stat, pending }: { stat: typeof STATS_TEMPLATE[0] & { value: string | number }; pending: boolean }) {
  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 relative overflow-hidden">
      <div
        className="absolute top-4 right-4 w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: stat.bg }}
      >
        <stat.icon className="w-5 h-5" style={{ color: pending ? '#9ca3af' : stat.color }} />
      </div>
      <p className="text-sm font-semibold text-gray-500 mb-1">{stat.label}</p>
      <p className="text-3xl font-black mb-1" style={{ color: pending ? '#d1d5db' : '#1f2937' }}>
        {pending ? '—' : stat.value}
      </p>
      <div className="flex items-center gap-1">
        <TrendingUp className="w-3 h-3" style={{ color: pending ? '#d1d5db' : '#22c55e' }} />
        <span className="text-xs font-semibold" style={{ color: pending ? '#d1d5db' : '#16a34a' }}>
          {pending ? 'Verify email to unlock' : stat.trend}
        </span>
      </div>
      {stat.label === 'School Progress' && !pending && (
        <div className="mt-3 w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
          <div className="h-full rounded-full" style={{ width: '83%', background: stat.color }} />
        </div>
      )}
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 ${className}`}>
      {children}
    </div>
  )
}

function CardHeader({ icon: Icon, title, color = '#4a90e2' }: { icon: React.ElementType; title: string; color?: string }) {
  return (
    <div className="flex items-center gap-2 px-5 py-4 border-b border-slate-50">
      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: `${color}18` }}>
        <Icon className="w-4 h-4" style={{ color }} />
      </div>
      <h3 className="font-bold text-gray-800 text-sm">{title}</h3>
    </div>
  )
}

function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{value: number}>; label?: string }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-100 rounded-xl shadow-lg px-3 py-2">
        <p className="text-xs font-bold text-gray-500">{label}</p>
        <p className="text-sm font-black text-indigo-600">{payload[0].value} classes</p>
      </div>
    )
  }
  return null
}

// ── Locked action button ────────────────────────────────────────────────────
function ActionButton({ label, icon: Icon, primary, color, locked }: {
  label: string
  icon: React.ElementType
  primary?: boolean
  color: string
  locked: boolean
}) {
  const lockedStyle = { background: '#f3f4f6', color: '#9ca3af', cursor: 'not-allowed', border: '1px solid #e5e7eb', boxShadow: 'none' }
  const activeStyle = primary
    ? { background: `linear-gradient(135deg, ${color}, ${color}dd)`, color: 'white', boxShadow: `0 4px 14px ${color}55` }
    : { border: `2px solid ${color}`, color, background: `${color}11` }

  return (
    <button
      disabled={locked}
      title={locked ? 'Verify your email to unlock this feature' : undefined}
      className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
      style={locked ? lockedStyle : activeStyle}
    >
      <Icon className="w-4 h-4" /> {label}
    </button>
  )
}

// ── Main dashboard page ────────────────────────────────────────────────────
export default function SchoolAdminDashboard() {
  const { user, logout } = useAuth()
  const [activeNav, setActiveNav] = useState('dashboard')
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [school, setSchool] = useState<SchoolData | null>(null)
  const [emailVerified, setEmailVerified] = useState(user?.emailVerified ?? false)
  const [resending, setResending] = useState(false)
  const [justResent, setJustResent] = useState(false)
  const [verifiedBannerDismissed, setVerifiedBannerDismissed] = useState(false)

  // Load school data from Firestore based on user's schoolId
  useEffect(() => {
    if (!user) return
    setEmailVerified(user.emailVerified)

    let unsubscribeSchool: (() => void) | undefined

    async function loadSchool() {
      const userSnap = await getDoc(doc(db, 'users', user!.uid))
      const userData = userSnap.data()
      const schoolId = userData?.schoolId
      if (!schoolId) return

      unsubscribeSchool = onSnapshot(doc(db, 'schools', schoolId), (snap) => {
        if (snap.exists()) {
          setSchool(snap.data() as SchoolData)
        }
      })
    }

    loadSchool()
    return () => { unsubscribeSchool?.() }
  }, [user])

  // Poll Firebase Auth to detect when email gets verified
  useEffect(() => {
    if (emailVerified) return
    if (!user) return

    const interval = setInterval(async () => {
      await reload(user)
      if (user.emailVerified) {
        setEmailVerified(true)
        clearInterval(interval)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [user, emailVerified])

  async function handleResendVerification() {
    if (!user || resending) return
    setResending(true)
    try {
      await sendEmailVerification(user)
      setJustResent(true)
      setTimeout(() => setJustResent(false), 5000)
    } catch {
      // silently fail — user may have too many requests
    } finally {
      setResending(false)
    }
  }

  const adminName = user?.displayName || school?.adminName || 'Admin'
  const initials = adminName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase()

  const STATS = [
    { ...STATS_TEMPLATE[0], value: 12 },
    { ...STATS_TEMPLATE[1], value: 240 },
    { ...STATS_TEMPLATE[2], value: 8 },
    { ...STATS_TEMPLATE[3], value: '83%' },
  ]

  return (
    <div className="flex min-h-screen" style={{ background: 'linear-gradient(135deg, #f0f4ff 0%, #f5f0ff 50%, #f0f8ff 100%)' }}>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex flex-col flex-shrink-0" style={{ width: 256 }}>
        <Sidebar active={activeNav} onNav={setActiveNav} emailVerified={emailVerified} />
      </div>

      {/* Mobile Sidebar Drawer */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 flex flex-col shadow-2xl">
            <Sidebar active={activeNav} onNav={setActiveNav} mobile onClose={() => setSidebarOpen(false)} emailVerified={emailVerified} />
          </div>
        </div>
      )}

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* Top bar */}
        <header className="flex-shrink-0 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                className="lg:hidden text-gray-600 hover:text-gray-900"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">School Admin Dashboard</h1>
                {school && (
                  <p className="text-xs text-gray-400 hidden sm:block">
                    {school.schoolName} · #{school.schoolId}
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button className="relative w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <Bell className="w-4 h-4 text-gray-600" />
                {!emailVerified && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-yellow-500 text-white text-xs font-bold flex items-center justify-center">!</span>
                )}
              </button>

              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #4a90e2, #8e24aa)' }}
                  >
                    {initials || 'SA'}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 hidden sm:block">{adminName}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-gray-500 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-2xl shadow-xl border border-slate-100 py-1 z-50">
                    <div className="px-4 py-2.5 border-b border-slate-50">
                      <p className="text-sm font-bold text-gray-800">{adminName}</p>
                      <p className="text-xs text-gray-400">
                        {emailVerified ? 'Verified · School Admin' : 'Pending verification'}
                      </p>
                    </div>
                    <Link href="/profile" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:bg-slate-50 transition-colors">
                      <UserCheck className="w-4 h-4" /> Profile
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable content */}
        <main className="flex-1 p-5 space-y-5">

          {/* Verification banners */}
          {!emailVerified && (
            <VerificationBanner
              email={user?.email || school?.adminEmail || ''}
              onResend={handleResendVerification}
              resending={resending}
              justResent={justResent}
            />
          )}

          {emailVerified && !verifiedBannerDismissed && (
            <div
              className="w-full rounded-2xl px-5 py-3 flex items-center gap-3"
              style={{ background: '#f0fff4', border: '1.5px solid #27ae60' }}
            >
              <CheckCircle className="w-5 h-5 flex-shrink-0 text-green-600" />
              <p className="text-sm font-semibold text-green-800 flex-1">
                Your school account is fully active! All features are now available.
              </p>
              <button
                onClick={() => setVerifiedBannerDismissed(true)}
                className="text-green-600 hover:text-green-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* School banner */}
          <SchoolBanner school={school} adminName={adminName} emailVerified={emailVerified} />

          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {STATS.map((stat, i) => <StatCard key={i} stat={stat} pending={!emailVerified} />)}
          </div>

          {/* Two-column layout */}
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-5">

            {/* LEFT: Management cards */}
            <div className="xl:col-span-3 space-y-4">

              {/* Manage Teachers */}
              <Card>
                <CardHeader icon={Users} title="Manage Teachers" color="#4a90e2" />
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton label="Add Teacher" icon={Plus} primary color="#4a90e2" locked={!emailVerified} />
                    <ActionButton label="Approve Requests" icon={Bell} color="#4a90e2" locked={!emailVerified} />
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { label: 'Remove Teacher', icon: X },
                      { label: 'View Class Students', icon: Eye },
                      { label: 'View Window', icon: Building2 },
                    ].map((action) => (
                      <button
                        key={action.label}
                        disabled={!emailVerified}
                        title={!emailVerified ? 'Verify your email to unlock this feature' : undefined}
                        className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl text-xs font-semibold border transition-all text-center"
                        style={!emailVerified
                          ? { background: '#f9fafb', color: '#d1d5db', borderColor: '#f3f4f6', cursor: 'not-allowed' }
                          : { background: 'white', color: '#6b7280', borderColor: '#f1f5f9', cursor: 'pointer' }
                        }
                      >
                        <action.icon className="w-4 h-4" style={{ color: !emailVerified ? '#d1d5db' : '#9ca3af' }} />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Manage Classes */}
              <Card>
                <CardHeader icon={BookOpen} title="Manage Classes" color="#27ae60" />
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-3">
                    <ActionButton label="Create Class" icon={Plus} primary color="#27ae60" locked={!emailVerified} />
                    <ActionButton label="View Class" icon={Eye} color="#27ae60" locked={!emailVerified} />
                    <ActionButton label="Students" icon={Users} color="#27ae60" locked={!emailVerified} />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2">
                    {[
                      { label: 'Create School Competition', icon: Target },
                      { label: 'Engagement Alerts', icon: Zap },
                    ].map((item) => (
                      <button
                        key={item.label}
                        disabled={!emailVerified}
                        title={!emailVerified ? 'Verify your email to unlock this feature' : undefined}
                        className="flex items-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold border transition-all"
                        style={!emailVerified
                          ? { background: '#f9fafb', color: '#d1d5db', borderColor: '#f3f4f6', cursor: 'not-allowed' }
                          : { background: 'white', color: '#4b5563', borderColor: '#f1f5f9', cursor: 'pointer' }
                        }
                      >
                        <item.icon className="w-3.5 h-3.5" style={{ color: !emailVerified ? '#d1d5db' : '#6b7280' }} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Manage Students */}
              <Card>
                <CardHeader icon={GraduationCap} title="Manage Students" color="#ff7b42" />
                <div className="p-5 space-y-3">
                  <div className="grid grid-cols-2 gap-3">
                    <ActionButton label="Add Student" icon={Plus} primary color="#ff7b42" locked={!emailVerified} />
                    <ActionButton label="Bulk Upload" icon={Upload} color="#ff7b42" locked={!emailVerified} />
                  </div>
                  <div className="rounded-xl overflow-hidden border border-slate-100">
                    <div className="px-4 py-2 bg-slate-50 flex items-center justify-between">
                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Recent Students</span>
                      <button
                        disabled={!emailVerified}
                        className="text-xs font-semibold flex items-center gap-0.5 disabled:opacity-40"
                        style={{ color: emailVerified ? '#3b82f6' : '#9ca3af' }}
                      >
                        View all <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>
                    {emailVerified ? (
                      ['Aisha Khan', 'Carlos Rivera', 'Emma Thompson'].map((name, i) => (
                        <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-t border-slate-50 hover:bg-slate-50 transition-colors">
                          <div
                            className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                            style={{ background: ['#4a90e2', '#ff7b42', '#27ae60'][i] }}
                          >
                            {name[0]}
                          </div>
                          <span className="text-sm font-medium text-gray-700">{name}</span>
                          <span className="ml-auto text-xs text-green-600 font-semibold">Active</span>
                        </div>
                      ))
                    ) : (
                      <div className="px-4 py-6 text-center text-sm text-gray-400">
                        Verify your email to view student data
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </div>

            {/* RIGHT: Analytics & info cards */}
            <div className="xl:col-span-2 space-y-4">

              {/* School Analytics */}
              <Card>
                <CardHeader icon={BarChart3} title="School Analytics" color="#8e24aa" />
                <div className="p-5">
                  {emailVerified ? (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <p className="text-xs font-bold text-gray-500">Weekly Activity</p>
                          <p className="text-sm font-black text-gray-800">34 Classes this week</p>
                        </div>
                        <span className="px-2 py-1 rounded-full text-xs font-bold" style={{ background: '#f3e8ff', color: '#8e24aa' }}>
                          +12% ↑
                        </span>
                      </div>
                      <ResponsiveContainer width="100%" height={140}>
                        <BarChart data={WEEKLY_DATA} barSize={16}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                          <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                          <YAxis hide />
                          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(142,36,170,0.05)' }} />
                          <Bar dataKey="classes" radius={[6, 6, 0, 0]} fill="url(#purpleGrad)" />
                          <defs>
                            <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#8e24aa" stopOpacity={1} />
                              <stop offset="100%" stopColor="#4a90e2" stopOpacity={0.7} />
                            </linearGradient>
                          </defs>
                        </BarChart>
                      </ResponsiveContainer>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-8 text-center">
                      <BarChart3 className="w-10 h-10 text-gray-200 mb-2" />
                      <p className="text-sm font-semibold text-gray-400">Analytics locked</p>
                      <p className="text-xs text-gray-400 mt-1">Verify your email to view activity data</p>
                    </div>
                  )}
                </div>
              </Card>

              {/* Engagement Rate */}
              <Card>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#fff0ea' }}>
                        <Zap className="w-4 h-4" style={{ color: emailVerified ? '#ff7b42' : '#d1d5db' }} />
                      </div>
                      <span className="text-sm font-bold text-gray-700">Engagement Rate</span>
                    </div>
                    {emailVerified && (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                        <TrendingUp className="w-3 h-3" /> +5%
                      </span>
                    )}
                  </div>
                  {emailVerified ? (
                    <>
                      <div className="flex items-end gap-3 mb-3">
                        <span className="text-4xl font-black text-gray-800">78%</span>
                        <span className="text-sm text-gray-400 mb-1 font-medium">this week</span>
                      </div>
                      <div className="w-full h-2.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: '78%', background: 'linear-gradient(90deg, #ff7b42, #FFD93D)' }} />
                      </div>
                    </>
                  ) : (
                    <div className="flex items-end gap-3 mb-3">
                      <span className="text-4xl font-black text-gray-300">—</span>
                      <span className="text-sm text-gray-400 mb-1 font-medium">pending</span>
                    </div>
                  )}
                </div>
              </Card>

              {/* Competitions */}
              <Card>
                <CardHeader icon={Trophy} title="Competitions" color="#f39c12" />
                <div className="px-5 py-4 space-y-2">
                  {[
                    { label: 'Create School Competition', icon: Plus },
                    { label: 'View Rankings', icon: BarChart3 },
                  ].map((item) => (
                    <button
                      key={item.label}
                      disabled={!emailVerified}
                      title={!emailVerified ? 'Verify your email to unlock this feature' : undefined}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold border border-transparent transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ color: '#6b7280' }}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-amber-500 group-disabled:text-gray-300" />
                        {item.label}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  ))}
                </div>
              </Card>

              {/* Reports */}
              <Card>
                <CardHeader icon={FileText} title="Reports" color="#4a90e2" />
                <div className="px-5 py-4 space-y-2">
                  {[
                    { label: 'Download School Report (PDF)', icon: Download },
                    { label: 'Export Student Data', icon: Upload },
                  ].map((item) => (
                    <button
                      key={item.label}
                      disabled={!emailVerified}
                      title={!emailVerified ? 'Verify your email to unlock this feature' : undefined}
                      className="w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold border border-transparent transition-all group disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{ color: '#6b7280' }}
                    >
                      <div className="flex items-center gap-2">
                        <item.icon className="w-4 h-4 text-blue-400 group-disabled:text-gray-300" />
                        {item.label}
                      </div>
                      <ChevronRight className="w-4 h-4 text-gray-300" />
                    </button>
                  ))}
                </div>
              </Card>

            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
