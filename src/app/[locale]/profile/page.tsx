'use client'

import { useAuth } from '@/context/AuthContext'
import { useRouter, Link } from '@/i18n/navigation'
import { useEffect, useState } from 'react'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth'
import { db, auth } from '@/lib/firebase'
import {
  User, Mail, Calendar, Rocket, Flame, Trophy, Award, BarChart3,
  Lightbulb, Brain, Gamepad2, Cpu, Target, Swords, Users, Star,
  Bell, Shield, CreditCard, Settings, Edit3, CheckCircle, Clock,
  BookOpen, Zap, Medal, TrendingUp, Lock, LogOut, ChevronRight,
  Camera,
} from 'lucide-react'

/* ──────────────────────────────────────────────
   Types
────────────────────────────────────────────── */
interface FirestoreProfile {
  role: string | null
  gradeLevel: string | null
  country: string | null
  streak: number
  points: number
  level: number
  avatar: string | null
  onboardingComplete: boolean
  adminRole?: string | null
  schoolId?: string | null
}

type TabId = 'overview' | 'edit' | 'settings' | 'activity'

/* ──────────────────────────────────────────────
   Mock activity data
────────────────────────────────────────────── */
const mockActivity = [
  { id: 1, type: 'lesson', title: 'Lesson 4: How AI Makes Decisions', course: 'AI Thinking Skills', time: '2 hours ago', status: 'completed', icon: Brain, color: '#9B59B6' },
  { id: 2, type: 'challenge', title: 'Weekly Coding Challenge', course: 'Problem Solving', time: 'Yesterday', status: 'in-progress', icon: Target, color: '#FF8C42' },
  { id: 3, type: 'competition', title: 'National Coding Battle', course: 'Competition', time: '3 days ago', status: 'registered', icon: Swords, color: '#FF6B6B' },
  { id: 4, type: 'lesson', title: 'Lesson 3: Pattern Recognition', course: 'AI Thinking Skills', time: '4 days ago', status: 'completed', icon: Lightbulb, color: '#4A90E2' },
  { id: 5, type: 'badge', title: 'Earned "Problem Solver" Badge', course: 'Achievement', time: '1 week ago', status: 'earned', icon: Medal, color: '#FFD93D' },
]

const mockStats = [
  { icon: Flame, color: '#FF8C42', bg: 'rgba(255,140,66,0.1)', label: 'Day Streak', val: '12' },
  { icon: BookOpen, color: '#4A90E2', bg: 'rgba(74,144,226,0.1)', label: 'Lessons Done', val: '34' },
  { icon: Award, color: '#9B59B6', bg: 'rgba(155,89,182,0.1)', label: 'Certificates', val: '3' },
  { icon: Clock, color: '#6BCB77', bg: 'rgba(107,203,119,0.1)', label: 'Hours Coded', val: '48' },
]

/* ──────────────────────────────────────────────
   Sidebar data (mirrors home page)
────────────────────────────────────────────── */
const skillPaths = [
  { label: 'Problem Solving', icon: Lightbulb, color: '#FFD93D' },
  { label: 'AI Thinking', icon: Brain, color: '#9B59B6' },
  { label: 'Game Dev', icon: Gamepad2, color: '#FF6B6B' },
  { label: 'Robotics', icon: Cpu, color: '#4A90E2' },
]

const navItems = [
  { label: 'Challenges', icon: Target, color: '#FF8C42', href: '/home' },
  { label: 'Competition', icon: Swords, color: '#FF6B6B', href: '/home' },
  { label: 'Leaderboard', icon: Trophy, color: '#FFD93D', href: '/home' },
  { label: 'Community', icon: Users, color: '#6BCB77', href: '/home' },
  { label: 'Progress', icon: BarChart3, color: '#4A90E2', href: '/home' },
  { label: 'Certificates', icon: Award, color: '#9B59B6', href: '/home' },
  { label: 'Profile', icon: User, color: '#FF8C42', href: '/profile', active: true },
]

/* ──────────────────────────────────────────────
   Helpers
────────────────────────────────────────────── */
function roleBadge(role: string | null) {
  const map: Record<string, { label: string; color: string; bg: string }> = {
    student: { label: 'Student', color: '#4A90E2', bg: 'rgba(74,144,226,0.15)' },
    teacher: { label: 'Teacher', color: '#6BCB77', bg: 'rgba(107,203,119,0.15)' },
    'school-admin': { label: 'School Admin', color: '#9B59B6', bg: 'rgba(155,89,182,0.15)' },
  }
  return map[role ?? ''] ?? { label: 'Member', color: '#FFD93D', bg: 'rgba(255,217,61,0.15)' }
}

function StatusBadge({ verified }: { verified: boolean }) {
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
      style={verified
        ? { background: 'rgba(107,203,119,0.15)', color: '#27ae60', border: '1px solid rgba(107,203,119,0.3)' }
        : { background: 'rgba(255,140,66,0.15)', color: '#e67e22', border: '1px solid rgba(255,140,66,0.3)' }
      }
    >
      {verified ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
      {verified ? 'Verified' : 'Unverified'}
    </span>
  )
}

/* ──────────────────────────────────────────────
   Main component
────────────────────────────────────────────── */
export default function ProfilePage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()

  const [profile, setProfile] = useState<FirestoreProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabId>('overview')

  // Edit profile form
  const [editName, setEditName] = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editSuccess, setEditSuccess] = useState('')
  const [editError, setEditError] = useState('')

  // Change password form
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const [pwSaving, setPwSaving] = useState(false)
  const [pwSuccess, setPwSuccess] = useState('')
  const [pwError, setPwError] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    if (!user) return
    setEditName(user.displayName ?? '')
    getDoc(doc(db, 'users', user.uid)).then((snap) => {
      if (snap.exists()) setProfile(snap.data() as FirestoreProfile)
      setProfileLoading(false)
    }).catch(() => setProfileLoading(false))
  }, [user])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2d3748]">
        <div className="w-12 h-12 rounded-full border-4 border-[#FFD93D] border-t-transparent animate-spin" />
      </div>
    )
  }

  const displayName = user.displayName ?? user.email?.split('@')[0] ?? 'Coder'
  const userInitials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
  const badge = roleBadge(profile?.role ?? null)
  const memberSince = user.metadata?.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })
    : '—'

  async function handleSaveName(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !editName.trim()) return
    setEditSaving(true)
    setEditError('')
    setEditSuccess('')
    try {
      await updateProfile(user, { displayName: editName.trim() })
      await updateDoc(doc(db, 'users', user.uid), { name: editName.trim(), updatedAt: serverTimestamp() })
      setEditSuccess('Name updated successfully!')
    } catch {
      setEditError('Failed to update name. Please try again.')
    } finally {
      setEditSaving(false)
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault()
    if (newPw !== confirmPw) { setPwError('New passwords do not match.'); return }
    if (newPw.length < 6) { setPwError('Password must be at least 6 characters.'); return }
    if (!user?.email) return
    setPwSaving(true)
    setPwError('')
    setPwSuccess('')
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPw)
      await reauthenticateWithCredential(auth.currentUser!, credential)
      await updatePassword(auth.currentUser!, newPw)
      setPwSuccess('Password changed successfully!')
      setCurrentPw(''); setNewPw(''); setConfirmPw('')
    } catch (err: unknown) {
      const code = (err as { code?: string }).code
      if (code === 'auth/wrong-password' || code === 'auth/invalid-credential') {
        setPwError('Current password is incorrect.')
      } else {
        setPwError('Failed to change password. Please try again.')
      }
    } finally {
      setPwSaving(false)
    }
  }

  async function handleLogout() {
    await logout()
    router.push('/login')
  }

  /* ── Tabs ── */
  const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
    { id: 'overview', label: 'Overview', icon: User },
    { id: 'edit', label: 'Edit Profile', icon: Edit3 },
    { id: 'settings', label: 'Security', icon: Shield },
    { id: 'activity', label: 'Activity', icon: Clock },
  ]

  return (
    <div className="flex min-h-screen bg-[#F0F4F8]" style={{ fontFamily: 'var(--font-nunito), sans-serif' }}>

      {/* ══════════════════════════════════════
          LEFT SIDEBAR  (mirrors home page)
      ══════════════════════════════════════ */}
      <aside
        className="flex-shrink-0 flex flex-col py-6 px-4 gap-1 overflow-y-auto"
        style={{
          width: 225,
          minHeight: '100vh',
          background: 'linear-gradient(180deg, #1a2744 0%, #1e3a6e 60%, #1a2f5e 100%)',
          borderRight: '1px solid rgba(255,255,255,0.07)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4A90E2, #9B59B6)' }}>
            <Rocket className="w-5 h-5 text-white" />
          </div>
          <Link href="/home">
            <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>KinderCode</span>
          </Link>
        </div>

        {/* Skill Paths */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-white/40 px-3 mb-1 mt-2">Skill Paths</p>
        {skillPaths.map(({ label, icon: Icon, color }) => (
          <button key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-all text-sm font-medium text-left w-full">
            <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
            {label}
          </button>
        ))}

        <div className="my-2 border-t border-white/10" />

        {/* Nav items */}
        {navItems.map(({ label, icon: Icon, color, href, active }) => (
          <Link key={label} href={href}>
            <button
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium text-left w-full"
              style={active
                ? { background: 'rgba(255,255,255,0.12)', color: 'white' }
                : { color: 'rgba(255,255,255,0.7)' }
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" style={{ color }} />
              {label}
            </button>
          </Link>
        ))}

        {/* Logout at bottom */}
        <div className="mt-auto pt-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-white/50 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium text-left w-full"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Log Out
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <main className="flex-1 min-w-0 overflow-x-hidden">

        {/* ── Top bar ── */}
        <div
          className="flex items-center justify-between px-8 py-4 border-b border-white/20"
          style={{ background: 'linear-gradient(90deg, #1e3c72 0%, #2a5298 100%)' }}
        >
          <div className="flex items-center gap-3">
            <Link href="/home" className="text-white/60 hover:text-white text-sm font-semibold transition-colors flex items-center gap-1">
              ← Dashboard
            </Link>
            <span className="text-white/30">/</span>
            <h1 className="text-lg font-bold text-white" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
              My Profile
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
              <Zap className="w-3.5 h-3.5 text-[#FFD93D]" />
              <span className="text-white font-bold text-sm">Lv {profile?.level ?? 1}</span>
            </div>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #FF8C42, #FFD93D)' }}
            >
              {userInitials}
            </div>
          </div>
        </div>

        <div className="p-6 space-y-5">

          {/* ── Profile Hero Card ── */}
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
          >
            {/* decorative blobs */}
            <div className="absolute -top-10 -right-10 w-48 h-48 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FFD93D, transparent)' }} />
            <div className="absolute bottom-0 left-1/3 w-32 h-32 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #4A90E2, transparent)' }} />

            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div
                  className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-xl"
                  style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #FFD93D 100%)', boxShadow: '0 8px 24px rgba(255,140,66,0.4)' }}
                >
                  {userInitials}
                </div>
                {/* Camera overlay hint */}
                <button
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center transition-all hover:scale-110"
                  style={{ background: 'linear-gradient(135deg, #4A90E2, #9B59B6)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
                  title="Change avatar (coming soon)"
                >
                  <Camera className="w-3.5 h-3.5 text-white" />
                </button>
              </div>

              {/* Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                  <h2 className="text-2xl font-bold text-white" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                    {displayName}
                  </h2>
                  <div className="flex items-center justify-center sm:justify-start gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold" style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.color}40` }}>
                      {badge.label}
                    </span>
                    <StatusBadge verified={user.emailVerified} />
                  </div>
                </div>
                <p className="text-white/60 text-sm mb-3">{user.email}</p>

                {/* Quick stat pills */}
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3">
                  {[
                    { icon: '🔥', val: `${profile?.streak ?? 12}`, label: 'day streak' },
                    { icon: '⭐', val: `${profile?.points ?? 350}`, label: 'XP points' },
                    { icon: '🏅', val: `Lv ${profile?.level ?? 5}`, label: 'current level' },
                    { icon: '📅', val: memberSince, label: 'member since' },
                  ].map(({ icon, val, label }) => (
                    <div key={label} className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-full">
                      <span className="text-sm">{icon}</span>
                      <span className="text-white font-bold text-xs">{val}</span>
                      <span className="text-white/50 text-xs hidden sm:inline">{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* XP Bar */}
              <div className="w-full sm:w-48 flex-shrink-0">
                <div className="bg-white/10 rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/70 text-xs font-semibold flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" /> XP Progress
                    </span>
                    <span className="text-white text-xs font-bold">{profile?.points ?? 350}/500</span>
                  </div>
                  <div className="h-2.5 bg-white/20 rounded-full overflow-hidden mb-3">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${Math.min(((profile?.points ?? 350) / 500) * 100, 100)}%`,
                        background: 'linear-gradient(90deg, #FFD93D, #FF8C42)',
                        boxShadow: '0 0 8px rgba(255,217,61,0.5)',
                      }}
                    />
                  </div>
                  <p className="text-white/50 text-[10px] text-center">Level {profile?.level ?? 5} → {(profile?.level ?? 5) + 1}</p>
                </div>
              </div>
            </div>
          </div>

          {/* ── Activity Stats Row ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {mockStats.map(({ icon: Icon, color, bg, label, val }) => (
              <div key={label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: bg }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <div>
                  <p className="text-2xl font-bold text-slate-800" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>{val}</p>
                  <p className="text-slate-500 text-xs font-semibold">{label}</p>
                </div>
              </div>
            ))}
          </div>

          {/* ── Tab Navigation ── */}
          <div className="flex items-center gap-1 bg-white rounded-2xl p-1.5 shadow-sm border border-slate-100 w-fit">
            {tabs.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={activeTab === id
                  ? { background: 'linear-gradient(135deg, #1e3c72, #2a5298)', color: 'white', boxShadow: '0 3px 10px rgba(30,60,114,0.3)' }
                  : { color: '#64748b' }
                }
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>

          {/* ══════════════════════════════════════
              TAB: OVERVIEW
          ══════════════════════════════════════ */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

              {/* Profile Details */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-5" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                  <User className="w-5 h-5 text-[#4A90E2]" />
                  Profile Information
                </h3>

                {profileLoading ? (
                  <div className="space-y-3">
                    {[1,2,3,4].map((i) => (
                      <div key={i} className="h-14 rounded-xl bg-slate-100 animate-pulse" />
                    ))}
                  </div>
                ) : (
                  <div className="space-y-3">
                    {[
                      { icon: User, color: '#4A90E2', label: 'Display Name', val: displayName },
                      { icon: Mail, color: '#9B59B6', label: 'Email Address', val: user.email ?? '—' },
                      { icon: Shield, color: '#6BCB77', label: 'Account Status', val: user.emailVerified ? 'Email Verified' : 'Email Unverified' },
                      { icon: Star, color: '#FFD93D', label: 'Role', val: badge.label },
                      { icon: Calendar, color: '#FF8C42', label: 'Member Since', val: memberSince },
                      ...(profile?.gradeLevel ? [{ icon: BookOpen, color: '#4A90E2', label: 'Grade Level', val: profile.gradeLevel }] : []),
                      ...(profile?.country ? [{ icon: Target, color: '#FF6B6B', label: 'Country', val: profile.country.toUpperCase() }] : []),
                      ...(profile?.schoolId ? [{ icon: Award, color: '#9B59B6', label: 'School ID', val: `#${profile.schoolId}` }] : []),
                    ].map(({ icon: Icon, color, label, val }) => (
                      <div key={label} className="flex items-center gap-4 px-4 py-3.5 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors" style={{ background: '#FAFBFC' }}>
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                          <Icon className="w-4 h-4" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-wider">{label}</p>
                          <p className="text-slate-800 font-semibold text-sm truncate mt-0.5">{val}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Quick Actions + Subscription */}
              <div className="flex flex-col gap-5">
                {/* Quick Actions */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                    <Zap className="w-5 h-5 text-[#FFD93D]" />
                    Quick Actions
                  </h3>
                  <div className="flex flex-col gap-2">
                    {[
                      { icon: BookOpen, label: 'Start New Course', color: '#4A90E2', href: '/home' },
                      { icon: Swords, label: 'Join Competition', color: '#FF6B6B', href: '/home' },
                      { icon: Users, label: 'Invite Friends', color: '#6BCB77', href: '/home' },
                      { icon: Trophy, label: 'View Leaderboard', color: '#FFD93D', href: '/home' },
                    ].map(({ icon: Icon, label, color, href }) => (
                      <Link key={label} href={href}>
                        <button
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 hover:shadow-sm text-slate-700 border border-slate-100 hover:border-slate-200"
                          style={{ background: '#FAFBFC' }}
                        >
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                            <Icon className="w-3.5 h-3.5" style={{ color }} />
                          </div>
                          {label}
                          <ChevronRight className="w-4 h-4 text-slate-300 ml-auto" />
                        </button>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Plan badge */}
                <div
                  className="rounded-2xl p-5 relative overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
                >
                  <div className="absolute -top-5 -right-5 w-24 h-24 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #FFD93D, transparent)' }} />
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-2">
                      <CreditCard className="w-4 h-4 text-[#FFD93D]" />
                      <span className="text-white/70 text-xs font-bold uppercase tracking-wide">Current Plan</span>
                    </div>
                    <p className="text-white font-bold text-xl mb-1" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>Free Plan</p>
                    <p className="text-white/50 text-xs mb-4">Upgrade for unlimited lessons, competitions, and certificates.</p>
                    <button
                      className="w-full py-2.5 rounded-xl font-bold text-sm transition-all hover:-translate-y-0.5"
                      style={{ background: 'linear-gradient(135deg, #FFD93D, #FF8C42)', color: '#1e3c72' }}
                    >
                      Upgrade to Pro ✨
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              TAB: EDIT PROFILE
          ══════════════════════════════════════ */}
          {activeTab === 'edit' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Edit Name */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-5" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                  <Edit3 className="w-5 h-5 text-[#4A90E2]" />
                  Personal Information
                </h3>

                <form onSubmit={handleSaveName} className="space-y-4">
                  {/* Avatar placeholder */}
                  <div className="flex flex-col items-center gap-3 py-4 border-2 border-dashed border-slate-200 rounded-2xl">
                    <div
                      className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #FF8C42, #FFD93D)' }}
                    >
                      {userInitials}
                    </div>
                    <button
                      type="button"
                      className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all hover:bg-slate-100"
                      style={{ color: '#4A90E2', background: 'rgba(74,144,226,0.08)' }}
                    >
                      <Camera className="w-4 h-4" />
                      Change Photo (coming soon)
                    </button>
                  </div>

                  {/* Display name */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Display Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      placeholder="Your display name"
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#4A90E2] focus:ring-4 focus:ring-[#4A90E2]/10 transition-all"
                    />
                  </div>

                  {/* Email (read-only) */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Address</label>
                    <div className="relative">
                      <input
                        type="email"
                        value={user.email ?? ''}
                        readOnly
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-100 text-slate-400 text-sm bg-slate-50 cursor-not-allowed"
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">Read-only</span>
                    </div>
                    <p className="text-slate-400 text-xs mt-1">Email changes require identity verification.</p>
                  </div>

                  {editSuccess && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(107,203,119,0.12)', color: '#27ae60', border: '1px solid rgba(107,203,119,0.3)' }}>
                      <CheckCircle className="w-4 h-4" /> {editSuccess}
                    </div>
                  )}
                  {editError && (
                    <div className="px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(255,107,107,0.1)', color: '#c0392b', border: '1px solid rgba(255,107,107,0.25)' }}>
                      {editError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={editSaving}
                    className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    style={{ background: 'linear-gradient(135deg, #4A90E2, #357ABD)', boxShadow: '0 4px 14px rgba(74,144,226,0.3)' }}
                  >
                    {editSaving ? 'Saving…' : 'Save Changes'}
                  </button>
                </form>
              </div>

              {/* Notification Preferences */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-5" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                  <Bell className="w-5 h-5 text-[#9B59B6]" />
                  Notification Preferences
                </h3>
                <div className="space-y-3">
                  {[
                    { label: 'New Lesson Available', desc: 'When a new lesson is added to your path', defaultOn: true },
                    { label: 'Competition Reminders', desc: 'Notifications before competitions start', defaultOn: true },
                    { label: 'Streak Reminders', desc: 'Daily reminder to keep your streak going', defaultOn: true },
                    { label: 'Community Mentions', desc: 'When someone replies to your post', defaultOn: false },
                    { label: 'Marketing Emails', desc: 'KinderCode news and product updates', defaultOn: false },
                  ].map(({ label, desc, defaultOn }) => {
                    const [on, setOn] = useState(defaultOn)
                    return (
                      <div key={label} className="flex items-center justify-between gap-4 px-4 py-3.5 rounded-xl border border-slate-100" style={{ background: '#FAFBFC' }}>
                        <div className="min-w-0">
                          <p className="text-slate-800 font-semibold text-sm">{label}</p>
                          <p className="text-slate-400 text-xs mt-0.5 leading-tight">{desc}</p>
                        </div>
                        <button
                          onClick={() => setOn((v) => !v)}
                          className="flex-shrink-0 w-11 h-6 rounded-full relative transition-all"
                          style={{ background: on ? 'linear-gradient(135deg, #4A90E2, #9B59B6)' : '#e2e8f0' }}
                        >
                          <span
                            className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all"
                            style={{ left: on ? 'calc(100% - 22px)' : '2px' }}
                          />
                        </button>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              TAB: SECURITY / SETTINGS
          ══════════════════════════════════════ */}
          {activeTab === 'settings' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Change Password */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-5" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                  <Lock className="w-5 h-5 text-[#FF8C42]" />
                  Change Password
                </h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  {[
                    { label: 'Current Password', val: currentPw, set: setCurrentPw, placeholder: '••••••••' },
                    { label: 'New Password', val: newPw, set: setNewPw, placeholder: '••••••••' },
                    { label: 'Confirm New Password', val: confirmPw, set: setConfirmPw, placeholder: '••••••••' },
                  ].map(({ label, val, set, placeholder }) => (
                    <div key={label}>
                      <label className="block text-sm font-semibold text-slate-700 mb-1.5">{label}</label>
                      <input
                        type="password"
                        value={val}
                        onChange={(e) => set(e.target.value)}
                        placeholder={placeholder}
                        required
                        className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 text-slate-800 text-sm focus:outline-none focus:border-[#FF8C42] focus:ring-4 focus:ring-[#FF8C42]/10 transition-all"
                      />
                    </div>
                  ))}

                  {pwSuccess && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(107,203,119,0.12)', color: '#27ae60', border: '1px solid rgba(107,203,119,0.3)' }}>
                      <CheckCircle className="w-4 h-4" /> {pwSuccess}
                    </div>
                  )}
                  {pwError && (
                    <div className="px-4 py-3 rounded-xl text-sm font-semibold" style={{ background: 'rgba(255,107,107,0.1)', color: '#c0392b', border: '1px solid rgba(255,107,107,0.25)' }}>
                      {pwError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={pwSaving}
                    className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none"
                    style={{ background: 'linear-gradient(135deg, #FF8C42, #FF6B6B)', boxShadow: '0 4px 14px rgba(255,140,66,0.3)' }}
                  >
                    {pwSaving ? 'Updating…' : 'Update Password'}
                  </button>
                </form>
              </div>

              {/* Account Security Info */}
              <div className="flex flex-col gap-4">
                {/* Verification status */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                    <Shield className="w-5 h-5 text-[#6BCB77]" />
                    Account Security
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-slate-100" style={{ background: '#FAFBFC' }}>
                      <div className="flex items-center gap-3">
                        <Mail className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-700 font-semibold text-sm">Email Verification</p>
                          <p className="text-slate-400 text-xs">Verify your email address</p>
                        </div>
                      </div>
                      <StatusBadge verified={user.emailVerified} />
                    </div>
                    <div className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-slate-100" style={{ background: '#FAFBFC' }}>
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-700 font-semibold text-sm">Two-Factor Auth</p>
                          <p className="text-slate-400 text-xs">Extra layer of security</p>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">Coming Soon</span>
                    </div>
                    <div className="flex items-center justify-between px-4 py-3.5 rounded-xl border border-slate-100" style={{ background: '#FAFBFC' }}>
                      <div className="flex items-center gap-3">
                        <Settings className="w-4 h-4 text-slate-400" />
                        <div>
                          <p className="text-slate-700 font-semibold text-sm">Connected: Google</p>
                          <p className="text-slate-400 text-xs">Sign in with Google enabled</p>
                        </div>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-bold" style={{ color: '#27ae60' }}>
                        <CheckCircle className="w-3.5 h-3.5" /> Active
                      </span>
                    </div>
                  </div>
                </div>

                {/* Danger zone */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
                  <h3 className="font-bold text-red-600 text-sm flex items-center gap-2 mb-3 uppercase tracking-wide">
                    ⚠️ Danger Zone
                  </h3>
                  <p className="text-slate-500 text-xs mb-4 leading-relaxed">These actions are permanent and cannot be undone.</p>
                  <button
                    className="w-full py-3 rounded-xl font-bold text-sm transition-all hover:bg-red-600 hover:text-white border-2 border-red-200 text-red-500 hover:border-red-600"
                    onClick={() => alert('Account deletion requires confirmation. Please contact support.')}
                  >
                    Delete Account
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ══════════════════════════════════════
              TAB: ACTIVITY
          ══════════════════════════════════════ */}
          {activeTab === 'activity' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Recent Activity */}
              <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-5" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                  <Clock className="w-5 h-5 text-[#4A90E2]" />
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {mockActivity.map(({ id, title, course, time, status, icon: Icon, color }) => {
                    const statusStyle: Record<string, { label: string; color: string; bg: string }> = {
                      completed: { label: 'Completed', color: '#27ae60', bg: 'rgba(107,203,119,0.12)' },
                      'in-progress': { label: 'In Progress', color: '#e67e22', bg: 'rgba(255,140,66,0.12)' },
                      registered: { label: 'Registered', color: '#4A90E2', bg: 'rgba(74,144,226,0.12)' },
                      earned: { label: 'Earned', color: '#9B59B6', bg: 'rgba(155,89,182,0.12)' },
                    }
                    const s = statusStyle[status]
                    return (
                      <div key={id} className="flex items-center gap-4 px-4 py-4 rounded-xl border border-slate-100 hover:border-slate-200 transition-colors" style={{ background: '#FAFBFC' }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${color}18` }}>
                          <Icon className="w-5 h-5" style={{ color }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-800 font-semibold text-sm truncate">{title}</p>
                          <p className="text-slate-400 text-xs mt-0.5">{course} · {time}</p>
                        </div>
                        <span className="flex-shrink-0 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: s.bg, color: s.color }}>
                          {s.label}
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Achievements */}
              <div className="flex flex-col gap-4">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                    <Trophy className="w-5 h-5 text-[#FFD93D]" />
                    Badges & Awards
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { emoji: '🔥', label: 'Streak Master', earned: true },
                      { emoji: '🧠', label: 'AI Thinker', earned: true },
                      { emoji: '🎮', label: 'Game Dev', earned: true },
                      { emoji: '🏆', label: 'Champion', earned: false },
                      { emoji: '🤖', label: 'Robot Builder', earned: false },
                      { emoji: '💡', label: 'Innovator', earned: false },
                    ].map(({ emoji, label, earned }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1.5 py-3 rounded-xl text-center transition-all"
                        style={earned
                          ? { background: 'rgba(255,217,61,0.1)', border: '1.5px solid rgba(255,217,61,0.3)' }
                          : { background: '#F8FAFC', border: '1.5px solid #e2e8f0', opacity: 0.5 }
                        }
                      >
                        <span className="text-2xl">{emoji}</span>
                        <span className="text-[10px] font-bold text-slate-600 leading-tight">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skill breakdown */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                  <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2 mb-4" style={{ fontFamily: 'var(--font-fredoka), sans-serif' }}>
                    <BarChart3 className="w-5 h-5 text-[#4A90E2]" />
                    Skill Levels
                  </h3>
                  <div className="space-y-3">
                    {[
                      { label: 'Problem Solving', pct: 75, from: '#4A90E2', to: '#2575fc' },
                      { label: 'Game Development', pct: 60, from: '#FF8C42', to: '#FF6B6B' },
                      { label: 'Programming', pct: 45, from: '#9B59B6', to: '#6C3483' },
                    ].map(({ label, pct, from, to }) => (
                      <div key={label}>
                        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1">
                          <span>{label}</span>
                          <span style={{ color: from }}>{pct}%</span>
                        </div>
                        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${from}, ${to})` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="h-4" />
        </div>
      </main>
    </div>
  )
}
