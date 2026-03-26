'use client'

import { useEffect, useState } from 'react'
import { useRouter } from '@/i18n/navigation'
import { useAuth } from '@/context/AuthContext'
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Plus } from 'lucide-react'

import Sidebar from '@/components/teacher/Sidebar'
import ClassCard, { ClassCardSkeleton } from '@/components/teacher/ClassCard'
import AssignmentItem, { AssignmentSkeleton } from '@/components/teacher/AssignmentItem'
import CompetitionCard from '@/components/teacher/CompetitionCard'
import ProgressChart from '@/components/teacher/ProgressChart'
import ReportCard from '@/components/teacher/ReportCard'
import CreateClassModal from '@/components/teacher/CreateClassModal'

// ─── Interfaces ───────────────────────────────────────────────

interface TeacherProfile {
  name: string
  schoolId: string
  schoolName: string
}

interface ClassData {
  id: string
  name: string
  grade: string
  section: string
  studentCount: number
  activeStudents: number
  averageProgress: number
}

interface Assignment {
  id: string
  title: string
  type: string
  submissions: number
  dueDate: string
}

interface Competition {
  id: string
  title: string
  participants: number
  startDate: string
  status: 'upcoming' | 'active' | 'completed'
}

interface ReportEntry {
  className: string
  percentage: number
  studentCount: number
}

// ─── Static dummy data (replace with Firestore calls when ready) ───

const DUMMY_ASSIGNMENTS: Assignment[] = [
  { id: '1', title: 'Intro to Loops', type: 'LogicBasics', submissions: 19, dueDate: 'Apr. 2024' },
  { id: '2', title: 'Debugging Quest', type: 'Debugging', submissions: 16, dueDate: 'Apr. 2024' },
]

const DUMMY_COMPETITIONS: Competition[] = [
  {
    id: '1',
    title: 'Weekly Coding Challenge',
    participants: 15,
    startDate: 'Apr 28, 2024',
    status: 'active',
  },
]

const DUMMY_CHART_DATA = [
  { day: 'Mon', points: 800 },
  { day: 'Tue', points: 1200 },
  { day: 'Wed', points: 900 },
  { day: 'Thu', points: 2000 },
  { day: 'Fri', points: 2800 },
  { day: 'Sat', points: 3500 },
  { day: 'Sun', points: 2200 },
  { day: 'Mon', points: 2600 },
]

const ANALYTICS = { totalPoints: 22150, weeklyStreak: 5 }

const BG =
  'linear-gradient(180deg, #b8c8e8 0%, #c8d8f5 20%, #dce4f5 40%, #e8d8f0 65%, #d8c8e8 85%, #c8b8d8 100%)'

// ─── Section panel wrapper ─────────────────────────────────────

function SectionPanel({
  icon,
  title,
  children,
  className = '',
  action,
}: {
  icon: React.ReactNode
  title: string
  children: React.ReactNode
  className?: string
  action?: React.ReactNode
}) {
  return (
    <div
      className={`rounded-2xl p-5 flex flex-col gap-4 ${className}`}
      style={{
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(14px)',
        border: '1.5px solid rgba(200,210,240,0.55)',
        boxShadow: '0 2px 12px rgba(100,80,180,0.07)',
      }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-gray-500">{icon}</span>
          <h2 className="font-bold text-gray-800 text-base">{title}</h2>
        </div>
        <div className="flex items-center gap-2">
          {action}
          <button className="text-gray-300 hover:text-gray-500 transition-colors p-1">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" />
            </svg>
          </button>
        </div>
      </div>
      {children}
    </div>
  )
}

// ─── Dashboard page ────────────────────────────────────────────

export default function TeacherDashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [activeTab, setActiveTab] = useState('dashboard')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [teacher, setTeacher] = useState<TeacherProfile | null>(null)
  const [classes, setClasses] = useState<ClassData[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch teacher profile + classes
  useEffect(() => {
    if (!user) return

    async function fetchData() {
      try {
        // Fetch teacher profile
        const userSnap = await getDoc(doc(db, 'users', user!.uid))
        if (!userSnap.exists()) {
          setError('Teacher profile not found.')
          setDataLoading(false)
          return
        }
        const data = userSnap.data()

        if (data.role !== 'teacher') {
          router.replace('/select-role')
          return
        }
        setTeacher({
          name: data.name ?? user!.displayName ?? 'Teacher',
          schoolId: data.schoolId ?? '',
          schoolName: data.schoolName ?? '',
        })

        // Fetch classes
        const classSnap = await getDocs(
          query(collection(db, 'classes'), where('teacherId', '==', user!.uid))
        )
        const fetchedClasses: ClassData[] = classSnap.docs.map((d) => {
          const cd = d.data()
          return {
            id: d.id,
            name: cd.name ?? '',
            grade: cd.grade ?? '',
            section: cd.section ?? '',
            studentCount: cd.studentCount ?? 0,
            activeStudents: cd.activeStudents ?? 0,
            averageProgress: cd.averageProgress ?? 0,
          }
        })
        setClasses(fetchedClasses)
      } catch {
        setError('Failed to load dashboard. Please refresh.')
      } finally {
        setDataLoading(false)
      }
    }

    fetchData()
  }, [user, router])

  // Derive report data from classes
  const reports: ReportEntry[] = classes.map((c) => ({
    className: `${c.grade} – Section ${c.section}`,
    percentage: c.averageProgress,
    studentCount: c.studentCount,
  }))

  const teacherInitials = teacher?.name
    ? teacher.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'T'

  // ── Loading ──
  if (authLoading || dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: BG }}>
        <div className="w-10 h-10 rounded-full border-4 border-white border-t-transparent animate-spin" />
      </div>
    )
  }

  // ── Error ──
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: BG }}>
        <div
          className="w-full max-w-sm rounded-3xl p-8 text-center"
          style={{
            background: 'rgba(255,255,255,0.75)',
            backdropFilter: 'blur(20px)',
            border: '1.5px solid rgba(255,255,255,0.85)',
            boxShadow: '0 8px 40px rgba(100,80,180,0.18)',
          }}
        >
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 rounded-xl text-white font-semibold text-sm"
            style={{ background: 'linear-gradient(135deg, #4a90e2, #1e88e5)' }}
          >
            Retry
          </button>
        </div>
      </div>
    )
  }

  // ── Dashboard ──
  return (
    <div className="h-screen flex flex-col overflow-hidden" style={{ background: BG }}>

      {/* ── Top Header ── */}
      <header
        className="flex items-center gap-4 px-6 py-3 flex-shrink-0 z-20"
        style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(16px)',
          borderBottom: '1.5px solid rgba(200,210,240,0.5)',
          boxShadow: '0 2px 12px rgba(100,80,180,0.07)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#4a90e2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <div className="inline-flex items-center gap-0 text-lg font-extrabold tracking-tight">
            {['K', 'i', 'n', 'd', 'e', 'r', 'C', 'o', 'd', 'e'].map((ch, i) => (
              <span key={i} style={{ color: ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#e53935', '#fb8c00', '#1e88e5', '#43a047'][i] }}>
                {ch}
              </span>
            ))}
          </div>
        </div>

        {/* Title */}
        <h1 className="text-base font-bold text-gray-700 ml-2 hidden sm:block">Teacher Dashboard</h1>

        <div className="flex-1" />

        {/* Teacher name dropdown */}
        <div
          className="flex items-center gap-2 px-4 py-2 rounded-full cursor-pointer"
          style={{
            background: 'rgba(255,255,255,0.8)',
            border: '1.5px solid rgba(200,210,240,0.6)',
            boxShadow: '0 1px 4px rgba(0,0,0,0.05)',
          }}
        >
          <span className="text-gray-700 font-semibold text-sm">{teacher?.name ?? 'Teacher'}</span>
          <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none">
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* Avatar */}
        <div
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #4a90e2, #7c3aed)' }}
        >
          {teacherInitials}
          <span
            className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center text-white text-[9px] font-bold"
            style={{ background: '#e53935' }}
          >
            3
          </span>
        </div>
      </header>

      {/* ── Body: Sidebar + Content ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* Sidebar */}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          onCreateClass={() => setShowCreateModal(true)}
        />

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6 space-y-5">

          <h2 className="text-xl font-extrabold text-gray-800">Teacher Dashboard</h2>

          {/* ── Classes Overview ── */}
          <SectionPanel
            icon={
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
              </svg>
            }
            title="Classes Overview"
            action={
              <button
                onClick={() => setShowCreateModal(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white transition-all"
                style={{
                  background: 'linear-gradient(135deg, #4a90e2, #1e88e5)',
                  boxShadow: '0 3px 10px rgba(30,136,229,0.35)',
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                Create Class
              </button>
            }
          >
            <div className="flex gap-4 flex-wrap">
              {dataLoading ? (
                <>
                  <ClassCardSkeleton />
                  <ClassCardSkeleton />
                </>
              ) : classes.length > 0 ? (
                <>
                  {classes.map((c) => (
                    <ClassCard
                      key={c.id}
                      name={c.name}
                      grade={c.grade}
                      section={c.section}
                      studentCount={c.studentCount}
                      activeStudents={c.activeStudents}
                      averageProgress={c.averageProgress}
                      onViewClass={() => router.push(`/teacher/classes/${c.id}`)}
                    />
                  ))}
                  {/* Add class placeholder */}
                  <div
                    className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl min-w-[140px] cursor-pointer transition-all"
                    style={{
                      background: 'rgba(255,255,255,0.5)',
                      border: '2px dashed rgba(200,210,240,0.7)',
                      minHeight: 170,
                    }}
                    onClick={() => setShowCreateModal(true)}
                    role="button"
                  >
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center"
                      style={{ background: 'linear-gradient(135deg, #4a90e2, #1e88e5)', boxShadow: '0 3px 10px rgba(30,136,229,0.3)' }}
                    >
                      <Plus className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-gray-400">Add Class</span>
                  </div>
                </>
              ) : (
                /* Empty state */
                <div className="flex flex-col items-center justify-center py-10 w-full gap-3">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #e8f0fe, #dce4f8)' }}
                  >
                    <svg className="w-7 h-7 text-blue-400" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                      <path d="M17.5 17.5v5M15 20h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  <p className="text-gray-500 font-semibold text-sm">No classes yet</p>
                  <p className="text-gray-400 text-xs text-center max-w-xs">
                    Create your first class to start managing students and assignments.
                  </p>
                  <button
                    onClick={() => setShowCreateModal(true)}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #4a90e2, #1e88e5)', boxShadow: '0 4px 12px rgba(30,136,229,0.35)' }}
                  >
                    <Plus className="w-4 h-4" />
                    Create First Class
                  </button>
                </div>
              )}
            </div>
          </SectionPanel>

          {/* ── Assignments + Competitions ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Assignments */}
            <SectionPanel
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 7h6M9 11h6M9 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              title="Assignments"
            >
              {DUMMY_ASSIGNMENTS.length > 0 ? (
                <div>
                  {DUMMY_ASSIGNMENTS.map((a) => (
                    <AssignmentItem
                      key={a.id}
                      title={a.title}
                      type={a.type}
                      submissions={a.submissions}
                      dueDate={a.dueDate}
                      onView={() => {}}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  <AssignmentSkeleton />
                  <AssignmentSkeleton />
                </div>
              )}
            </SectionPanel>

            {/* Competitions */}
            <SectionPanel
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M8 21h8M12 17v4M17 3H7L5 9c0 3.31 3.13 6 7 6s7-2.69 7-6l-2-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M5 9H3a2 2 0 000 4h1.5M19 9h2a2 2 0 010 4h-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              title="Competitions"
            >
              {DUMMY_COMPETITIONS.map((comp) => (
                <CompetitionCard
                  key={comp.id}
                  title={comp.title}
                  participants={comp.participants}
                  startDate={comp.startDate}
                  status={comp.status}
                  onView={() => {}}
                  onLeaderboard={() => {}}
                />
              ))}
            </SectionPanel>
          </div>

          {/* ── Progress Analytics + Reports ── */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Progress Analytics */}
            <SectionPanel
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M7 16l4-6 4 4 4-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              }
              title="Progress Analytics"
            >
              <ProgressChart
                data={DUMMY_CHART_DATA}
                totalPoints={ANALYTICS.totalPoints}
                weeklyStreak={ANALYTICS.weeklyStreak}
              />
            </SectionPanel>

            {/* Reports */}
            <SectionPanel
              icon={
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              }
              title="Reports"
            >
              {reports.length > 0 ? (
                <ReportCard
                  reports={reports}
                  onView={() => setActiveTab('reports')}
                />
              ) : (
                /* Dummy reports while classes load */
                <ReportCard
                  reports={[
                    { className: 'Grade 5 – Section A', percentage: 74, studentCount: 18 },
                    { className: 'Grade 4 – Section B', percentage: 82, studentCount: 22 },
                  ]}
                  onView={() => setActiveTab('reports')}
                />
              )}
            </SectionPanel>
          </div>

          {/* Bottom spacer */}
          <div className="h-4" />
        </main>
      </div>

      {/* Create Class Modal */}
      <CreateClassModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        teacherId={user?.uid ?? ''}
        schoolId={teacher?.schoolId ?? ''}
        onSuccess={(newClass) => {
          setClasses((prev) => [...prev, newClass])
        }}
      />
    </div>
  )
}
