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
  addDoc,
  updateDoc,
  serverTimestamp,
  Timestamp,
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

interface StudentData {
  id: string
  name: string
  grade: string
  level: number
  completedLessons: number
  stars: number
  classId: string
  className: string
}

const DUMMY_CHART_DATA = [
  { day: 'Mon', points: 0 },
  { day: 'Tue', points: 0 },
  { day: 'Wed', points: 0 },
  { day: 'Thu', points: 0 },
  { day: 'Fri', points: 0 },
  { day: 'Sat', points: 0 },
  { day: 'Sun', points: 0 },
]

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
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [students, setStudents] = useState<StudentData[]>([])
  const [totalPoints, setTotalPoints] = useState(0)
  const [weeklyStreak, setWeeklyStreak] = useState(0)
  const [dataLoading, setDataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Assignment create form
  const [showAssignmentForm, setShowAssignmentForm] = useState(false)
  const [assignmentTitle, setAssignmentTitle] = useState('')
  const [assignmentType, setAssignmentType] = useState('homework')
  const [assignmentDueDate, setAssignmentDueDate] = useState('')
  const [assignmentClassId, setAssignmentClassId] = useState('')
  const [assignmentSaving, setAssignmentSaving] = useState(false)

  // Competition create form
  const [showCompetitionForm, setShowCompetitionForm] = useState(false)
  const [competitionTitle, setCompetitionTitle] = useState('')
  const [competitionStartDate, setCompetitionStartDate] = useState('')
  const [competitionSaving, setCompetitionSaving] = useState(false)

  // Settings
  const [settingsName, setSettingsName] = useState('')
  const [settingsSaving, setSettingsSaving] = useState(false)
  const [settingsSaved, setSettingsSaved] = useState(false)

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

        setSettingsName(data.name ?? user!.displayName ?? 'Teacher')

        // Fetch classes, assignments, competitions, students in parallel
        const [classSnap, assignSnap, compSnap, studentSnap] = await Promise.all([
          getDocs(query(collection(db, 'classes'), where('teacherId', '==', user!.uid))),
          getDocs(query(collection(db, 'assignments'), where('teacherId', '==', user!.uid))),
          getDocs(query(collection(db, 'competitions'), where('teacherId', '==', user!.uid))),
          getDocs(query(collection(db, 'students'), where('teacherId', '==', user!.uid))),
        ])

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

        const fetchedAssignments: Assignment[] = assignSnap.docs.map((d) => {
          const ad = d.data()
          let dueDateStr = ad.dueDate ?? ''
          if (ad.dueDate instanceof Timestamp) {
            dueDateStr = ad.dueDate.toDate().toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
          }
          return {
            id: d.id,
            title: ad.title ?? '',
            type: ad.type ?? '',
            submissions: ad.submissions ?? 0,
            dueDate: dueDateStr,
          }
        })
        setAssignments(fetchedAssignments)

        const fetchedCompetitions: Competition[] = compSnap.docs.map((d) => {
          const cd = d.data()
          let startDateStr = cd.startDate ?? ''
          if (cd.startDate instanceof Timestamp) {
            startDateStr = cd.startDate.toDate().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          }
          return {
            id: d.id,
            title: cd.title ?? '',
            participants: cd.participants ?? 0,
            startDate: startDateStr,
            status: cd.status ?? 'upcoming',
          }
        })
        setCompetitions(fetchedCompetitions)

        const fetchedStudents: StudentData[] = studentSnap.docs.map((d) => {
          const sd = d.data()
          const cls = fetchedClasses.find((c) => c.id === sd.classId)
          return {
            id: d.id,
            name: sd.name ?? '',
            grade: sd.grade ?? '',
            level: sd.level ?? 1,
            completedLessons: sd.completedLessons ?? 0,
            stars: sd.stars ?? 0,
            classId: sd.classId ?? '',
            className: cls?.name ?? '',
          }
        })
        setStudents(fetchedStudents)

        // Derive aggregate analytics from classes
        const pts = fetchedClasses.reduce((sum, c) => sum + c.studentCount * c.averageProgress, 0)
        setTotalPoints(Math.round(pts))
        setWeeklyStreak(data.weeklyStreak ?? 0)
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

  async function handleCreateAssignment(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !assignmentTitle.trim()) return
    setAssignmentSaving(true)
    try {
      const newRef = await addDoc(collection(db, 'assignments'), {
        title: assignmentTitle.trim(),
        type: assignmentType,
        dueDate: assignmentDueDate || '',
        classId: assignmentClassId || '',
        teacherId: user.uid,
        submissions: 0,
        createdAt: serverTimestamp(),
      })
      setAssignments((prev) => [
        ...prev,
        { id: newRef.id, title: assignmentTitle.trim(), type: assignmentType, dueDate: assignmentDueDate, submissions: 0 },
      ])
      setAssignmentTitle('')
      setAssignmentDueDate('')
      setAssignmentClassId('')
      setShowAssignmentForm(false)
    } catch { /* silently fail */ } finally {
      setAssignmentSaving(false)
    }
  }

  async function handleCreateCompetition(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !competitionTitle.trim()) return
    setCompetitionSaving(true)
    try {
      const newRef = await addDoc(collection(db, 'competitions'), {
        title: competitionTitle.trim(),
        startDate: competitionStartDate || '',
        status: 'upcoming',
        participants: 0,
        teacherId: user.uid,
        schoolId: teacher?.schoolId ?? '',
        createdAt: serverTimestamp(),
      })
      setCompetitions((prev) => [
        ...prev,
        { id: newRef.id, title: competitionTitle.trim(), participants: 0, startDate: competitionStartDate, status: 'upcoming' as const },
      ])
      setCompetitionTitle('')
      setCompetitionStartDate('')
      setShowCompetitionForm(false)
    } catch { /* silently fail */ } finally {
      setCompetitionSaving(false)
    }
  }

  async function handleSaveSettings(e: React.FormEvent) {
    e.preventDefault()
    if (!user || !settingsName.trim()) return
    setSettingsSaving(true)
    try {
      await updateDoc(doc(db, 'users', user.uid), { name: settingsName.trim(), updatedAt: serverTimestamp() })
      setTeacher((prev) => prev ? { ...prev, name: settingsName.trim() } : null)
      setSettingsSaved(true)
      setTimeout(() => setSettingsSaved(false), 2500)
    } catch { /* silently fail */ } finally {
      setSettingsSaving(false)
    }
  }

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
        <main className="flex-1 overflow-y-auto p-6">

          {/* ── DASHBOARD TAB ── */}
          {activeTab === 'dashboard' && (
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold text-gray-800">Teacher Dashboard</h2>

              {/* Classes Overview */}
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
                    style={{ background: 'linear-gradient(135deg, #4a90e2, #1e88e5)', boxShadow: '0 3px 10px rgba(30,136,229,0.35)' }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    Create Class
                  </button>
                }
              >
                <div className="flex gap-4 flex-wrap">
                  {dataLoading ? (
                    <><ClassCardSkeleton /><ClassCardSkeleton /></>
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
                      <div
                        className="flex flex-col items-center justify-center gap-2 p-5 rounded-2xl min-w-[140px] cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.5)', border: '2px dashed rgba(200,210,240,0.7)', minHeight: 170 }}
                        onClick={() => setShowCreateModal(true)}
                        role="button"
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #4a90e2, #1e88e5)' }}>
                          <Plus className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xs font-semibold text-gray-400">Add Class</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-10 w-full gap-3">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #e8f0fe, #dce4f8)' }}>
                        <svg className="w-7 h-7 text-blue-400" viewBox="0 0 24 24" fill="none">
                          <rect x="3" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                          <rect x="14" y="3" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                          <rect x="3" y="14" width="7" height="7" rx="1.5" stroke="currentColor" strokeWidth="2" />
                          <path d="M17.5 17.5v5M15 20h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <p className="text-gray-500 font-semibold text-sm">No classes yet</p>
                      <p className="text-gray-400 text-xs text-center max-w-xs">Create your first class to start managing students and assignments.</p>
                      <button
                        onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-sm font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #4a90e2, #1e88e5)', boxShadow: '0 4px 12px rgba(30,136,229,0.35)' }}
                      >
                        <Plus className="w-4 h-4" /> Create First Class
                      </button>
                    </div>
                  )}
                </div>
              </SectionPanel>

              {/* Assignments + Competitions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SectionPanel
                  icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M9 7h6M9 11h6M9 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                  title="Assignments"
                  action={<button onClick={() => { setActiveTab('assignments'); setShowAssignmentForm(true) }} className="text-xs font-bold text-blue-500 hover:text-blue-700">+ New</button>}
                >
                  {dataLoading ? <div className="flex flex-col gap-2"><AssignmentSkeleton /><AssignmentSkeleton /></div>
                    : assignments.length > 0
                      ? assignments.slice(0, 3).map((a) => <AssignmentItem key={a.id} title={a.title} type={a.type} submissions={a.submissions} dueDate={a.dueDate} onView={() => setActiveTab('assignments')} />)
                      : <p className="text-sm text-gray-400 text-center py-4">No assignments yet</p>}
                </SectionPanel>
                <SectionPanel
                  icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M8 21h8M12 17v4M17 3H7L5 9c0 3.31 3.13 6 7 6s7-2.69 7-6l-2-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 9H3a2 2 0 000 4h1.5M19 9h2a2 2 0 010 4h-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                  title="Competitions"
                  action={<button onClick={() => { setActiveTab('competitions'); setShowCompetitionForm(true) }} className="text-xs font-bold text-blue-500 hover:text-blue-700">+ New</button>}
                >
                  {dataLoading ? <AssignmentSkeleton />
                    : competitions.length > 0
                      ? competitions.slice(0, 2).map((comp) => <CompetitionCard key={comp.id} title={comp.title} participants={comp.participants} startDate={comp.startDate} status={comp.status} onView={() => setActiveTab('competitions')} onLeaderboard={() => setActiveTab('competitions')} />)
                      : <p className="text-sm text-gray-400 text-center py-4">No competitions yet</p>}
                </SectionPanel>
              </div>

              {/* Progress Analytics + Reports */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <SectionPanel
                  icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M3 3v18h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M7 16l4-6 4 4 4-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                  title="Progress Analytics"
                >
                  <ProgressChart data={DUMMY_CHART_DATA} totalPoints={totalPoints} weeklyStreak={weeklyStreak} />
                </SectionPanel>
                <SectionPanel
                  icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                  title="Reports"
                >
                  {reports.length > 0
                    ? <ReportCard reports={reports} onView={() => setActiveTab('reports')} />
                    : <p className="text-sm text-gray-400 text-center py-4">No class data yet</p>}
                </SectionPanel>
              </div>
              <div className="h-4" />
            </div>
          )}

          {/* ── STUDENTS TAB ── */}
          {activeTab === 'students' && (
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold text-gray-800">Students ({students.length})</h2>
              <SectionPanel
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" /><path d="M3 21v-2a4 4 0 014-4h4a4 4 0 014 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /><path d="M16 3.13a4 4 0 010 7.75M21 21v-2a4 4 0 00-3-3.85" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                title="All Students"
              >
                {dataLoading ? (
                  <div className="flex flex-col gap-3">{[1,2,3].map((i) => <div key={i} className="h-12 rounded-xl bg-gray-100 animate-pulse" />)}</div>
                ) : students.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-left border-b border-gray-100">
                          <th className="pb-3 font-semibold text-gray-500 pr-4">Name</th>
                          <th className="pb-3 font-semibold text-gray-500 pr-4">Class</th>
                          <th className="pb-3 font-semibold text-gray-500 pr-4">Grade</th>
                          <th className="pb-3 font-semibold text-gray-500 pr-4">Level</th>
                          <th className="pb-3 font-semibold text-gray-500 pr-4">Lessons</th>
                          <th className="pb-3 font-semibold text-gray-500">Stars</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {students.map((s) => (
                          <tr key={s.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 pr-4">
                              <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0" style={{ background: 'linear-gradient(135deg, #4a90e2, #7c3aed)' }}>
                                  {s.name ? s.name[0].toUpperCase() : '?'}
                                </div>
                                <span className="font-medium text-gray-700">{s.name || 'Unknown'}</span>
                              </div>
                            </td>
                            <td className="py-3 pr-4 text-gray-500">{s.className || '—'}</td>
                            <td className="py-3 pr-4 text-gray-500">{s.grade || '—'}</td>
                            <td className="py-3 pr-4">
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold" style={{ background: '#e8f0fe', color: '#4a90e2' }}>
                                Lv {s.level}
                              </span>
                            </td>
                            <td className="py-3 pr-4 text-gray-600 font-medium">{s.completedLessons}</td>
                            <td className="py-3 text-amber-500 font-bold">⭐ {s.stars}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500 font-semibold text-sm">No students yet</p>
                    <p className="text-gray-400 text-xs mt-1">Students will appear here once they join your classes.</p>
                  </div>
                )}
              </SectionPanel>
            </div>
          )}

          {/* ── ASSIGNMENTS TAB ── */}
          {activeTab === 'assignments' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-gray-800">Assignments</h2>
                <button
                  onClick={() => setShowAssignmentForm((v) => !v)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #4a90e2, #1e88e5)', boxShadow: '0 3px 10px rgba(30,136,229,0.35)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showAssignmentForm ? 'Cancel' : 'New Assignment'}
                </button>
              </div>

              {showAssignmentForm && (
                <SectionPanel
                  icon={<Plus className="w-5 h-5" />}
                  title="Create Assignment"
                >
                  <form onSubmit={handleCreateAssignment} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
                        <input
                          type="text"
                          value={assignmentTitle}
                          onChange={(e) => setAssignmentTitle(e.target.value)}
                          required
                          placeholder="e.g. Variables Quiz"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Type</label>
                        <select
                          value={assignmentType}
                          onChange={(e) => setAssignmentType(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-blue-400"
                        >
                          <option value="homework">Homework</option>
                          <option value="quiz">Quiz</option>
                          <option value="project">Project</option>
                          <option value="exercise">Exercise</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Due Date</label>
                        <input
                          type="date"
                          value={assignmentDueDate}
                          onChange={(e) => setAssignmentDueDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Class</label>
                        <select
                          value={assignmentClassId}
                          onChange={(e) => setAssignmentClassId(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm bg-white focus:outline-none focus:border-blue-400"
                        >
                          <option value="">All Classes</option>
                          {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={assignmentSaving || !assignmentTitle.trim()}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, #4a90e2, #1e88e5)' }}
                    >
                      {assignmentSaving ? 'Creating…' : 'Create Assignment'}
                    </button>
                  </form>
                </SectionPanel>
              )}

              <SectionPanel
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><rect x="5" y="2" width="14" height="20" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M9 7h6M9 11h6M9 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                title={`All Assignments (${assignments.length})`}
              >
                {assignments.length > 0 ? (
                  <div className="divide-y divide-gray-50">
                    {assignments.map((a) => (
                      <AssignmentItem key={a.id} title={a.title} type={a.type} submissions={a.submissions} dueDate={a.dueDate} onView={() => {}} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500 font-semibold text-sm">No assignments yet</p>
                    <p className="text-gray-400 text-xs mt-1">Create your first assignment using the button above.</p>
                  </div>
                )}
              </SectionPanel>
            </div>
          )}

          {/* ── COMPETITIONS TAB ── */}
          {activeTab === 'competitions' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-extrabold text-gray-800">Competitions</h2>
                <button
                  onClick={() => setShowCompetitionForm((v) => !v)}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white"
                  style={{ background: 'linear-gradient(135deg, #f39c12, #e67e22)', boxShadow: '0 3px 10px rgba(243,156,18,0.35)' }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  {showCompetitionForm ? 'Cancel' : 'New Competition'}
                </button>
              </div>

              {showCompetitionForm && (
                <SectionPanel
                  icon={<Plus className="w-5 h-5" />}
                  title="Create Competition"
                >
                  <form onSubmit={handleCreateCompetition} className="space-y-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Title *</label>
                        <input
                          type="text"
                          value={competitionTitle}
                          onChange={(e) => setCompetitionTitle(e.target.value)}
                          required
                          placeholder="e.g. Coding Sprint"
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 mb-1">Start Date</label>
                        <input
                          type="date"
                          value={competitionStartDate}
                          onChange={(e) => setCompetitionStartDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      disabled={competitionSaving || !competitionTitle.trim()}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, #f39c12, #e67e22)' }}
                    >
                      {competitionSaving ? 'Creating…' : 'Create Competition'}
                    </button>
                  </form>
                </SectionPanel>
              )}

              <SectionPanel
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M8 21h8M12 17v4M17 3H7L5 9c0 3.31 3.13 6 7 6s7-2.69 7-6l-2-6z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 9H3a2 2 0 000 4h1.5M19 9h2a2 2 0 010 4h-1.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                title={`All Competitions (${competitions.length})`}
              >
                {competitions.length > 0 ? (
                  competitions.map((comp) => (
                    <CompetitionCard
                      key={comp.id}
                      title={comp.title}
                      participants={comp.participants}
                      startDate={comp.startDate}
                      status={comp.status}
                      onView={() => {}}
                      onLeaderboard={() => {}}
                    />
                  ))
                ) : (
                  <div className="text-center py-10">
                    <p className="text-gray-500 font-semibold text-sm">No competitions yet</p>
                    <p className="text-gray-400 text-xs mt-1">Create a competition to engage your students.</p>
                  </div>
                )}
              </SectionPanel>
            </div>
          )}

          {/* ── REPORTS TAB ── */}
          {activeTab === 'reports' && (
            <div className="space-y-5">
              <h2 className="text-xl font-extrabold text-gray-800">Reports</h2>
              <SectionPanel
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                title="Progress Analytics"
              >
                <ProgressChart data={DUMMY_CHART_DATA} totalPoints={totalPoints} weeklyStreak={weeklyStreak} />
              </SectionPanel>
              {reports.length > 0 ? (
                <>
                  <SectionPanel
                    icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="2" /><path d="M9 8h6M9 12h6M9 16h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                    title="Class Reports"
                  >
                    <ReportCard reports={reports} onView={() => {}} />
                  </SectionPanel>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classes.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-2xl p-4"
                        style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(200,210,240,0.55)' }}
                      >
                        <p className="font-bold text-gray-800 text-sm mb-0.5">{c.name}</p>
                        <p className="text-xs text-gray-400 mb-3">Grade {c.grade} · Section {c.section}</p>
                        <div className="flex items-center justify-between text-xs mb-1.5">
                          <span className="text-gray-500 font-medium">Progress</span>
                          <span className="font-bold text-gray-700">{c.averageProgress}%</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${c.averageProgress}%`, background: 'linear-gradient(90deg, #4a90e2, #7c3aed)' }} />
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                          <span>{c.studentCount} students</span>
                          <span>{c.activeStudents} active</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div
                  className="rounded-2xl p-10 text-center"
                  style={{ background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(14px)', border: '1.5px solid rgba(200,210,240,0.55)' }}
                >
                  <p className="text-gray-500 font-semibold text-sm">No class data yet</p>
                  <p className="text-gray-400 text-xs mt-1">Create classes and add students to generate reports.</p>
                </div>
              )}
            </div>
          )}

          {/* ── SETTINGS TAB ── */}
          {activeTab === 'settings' && (
            <div className="space-y-5 max-w-lg">
              <h2 className="text-xl font-extrabold text-gray-800">Settings</h2>
              <SectionPanel
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" /><path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>}
                title="Profile Settings"
              >
                <form onSubmit={handleSaveSettings} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name</label>
                    <input
                      type="text"
                      value={settingsName}
                      onChange={(e) => setSettingsName(e.target.value)}
                      required
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">Email</label>
                    <input
                      type="email"
                      value={user?.email ?? ''}
                      readOnly
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-100 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 mb-1">School</label>
                    <input
                      type="text"
                      value={teacher?.schoolName ?? ''}
                      readOnly
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-100 text-sm bg-gray-50 text-gray-400 cursor-not-allowed"
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="submit"
                      disabled={settingsSaving}
                      className="px-5 py-2.5 rounded-xl text-sm font-bold text-white disabled:opacity-60"
                      style={{ background: 'linear-gradient(135deg, #4a90e2, #1e88e5)' }}
                    >
                      {settingsSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                    {settingsSaved && <span className="text-xs text-green-600 font-semibold">✓ Saved</span>}
                  </div>
                </form>
              </SectionPanel>

              <SectionPanel
                icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none"><path d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>}
                title="Account"
              >
                <button
                  onClick={() => router.push('/settings')}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors w-full"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" stroke="currentColor" strokeWidth="2" /></svg>
                  App Settings
                </button>
              </SectionPanel>
            </div>
          )}

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
