'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { CheckCircle, Search } from 'lucide-react'
import {
  doc,
  updateDoc,
  serverTimestamp,
  addDoc,
  collection,
  getDocs,
  query,
  where,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'

/* ─── Types ───────────────────────────────────────────────── */
interface FirestoreSchool {
  id: string
  name: string
  location: string
  type: string
  size: string
}

type TeacherPath = 'school' | 'freelancer' | null

/*
 * Step names represent the content, not sequential numbers.
 * School path:     welcome → avatar → path → school-search → subject → complete
 * Freelancer path: welcome → avatar → path → subject → complete
 */
type StepName = 'welcome' | 'avatar' | 'path' | 'school-search' | 'subject' | 'complete'

const SCHOOL_FLOW: StepName[] = ['welcome', 'avatar', 'path', 'school-search', 'subject', 'complete']
const FREELANCER_FLOW: StepName[] = ['welcome', 'avatar', 'path', 'subject', 'complete']

/* ─── Constants ───────────────────────────────────────────── */
const AVATARS = ['🦊', '🐼', '🦁', '🐸', '🤖', '🦋', '🐙', '🦄']

const SUBJECTS = [
  { id: 'math',    label: 'Mathematics',               emoji: '🔢' },
  { id: 'science', label: 'Science',                   emoji: '🔬' },
  { id: 'english', label: 'English / Language Arts',   emoji: '📖' },
  { id: 'coding',  label: 'Coding & Computer Science', emoji: '💻' },
  { id: 'art',     label: 'Art & Design',              emoji: '🎨' },
  { id: 'music',   label: 'Music',                     emoji: '🎵' },
  { id: 'history', label: 'History & Social Studies',  emoji: '🌍' },
  { id: 'physics', label: 'Physics',                   emoji: '⚡' },
]

const STEP_META: Record<StepName, { title: string; subtitle: string }> = {
  welcome: {
    title: 'Welcome to KinderCode! 🎉',
    subtitle: "Let's set up your teacher profile.",
  },
  avatar: {
    title: 'Your Profile',
    subtitle: 'Choose an avatar to represent you.',
  },
  path: {
    title: 'Your Teaching Setup',
    subtitle: 'Are you teaching at a school or as a freelancer?',
  },
  'school-search': {
    title: 'Find Your School',
    subtitle: 'Search and select your school — a request will be sent to the admin.',
  },
  subject: {
    title: 'Main Subject',
    subtitle: 'What is your primary teaching subject?',
  },
  complete: {
    title: "You're All Set! 🚀",
    subtitle: 'Your teacher profile is ready.',
  },
}

export default function TeacherOnboarding() {
  const t = useTranslations('onboarding')
  const router = useRouter()
  const { user } = useAuth()

  const [currentStep, setCurrentStep] = useState<StepName>('welcome')
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Step: avatar
  const [avatar, setAvatar] = useState('')

  // Step: path
  const [teacherPath, setTeacherPath] = useState<TeacherPath>(null)

  // Step: school-search
  const [schoolSearch, setSchoolSearch] = useState('')
  const [schoolResults, setSchoolResults] = useState<FirestoreSchool[]>([])
  const [schoolSearching, setSchoolSearching] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<FirestoreSchool | null>(null)
  const [joinRequestSent, setJoinRequestSent] = useState(false)
  const [schoolId, setSchoolId] = useState('')

  // Step: subject
  const [subject, setSubject] = useState('')

  /* ─── Derived ───────────────────────────────────────────── */
  const flow = teacherPath === 'freelancer' ? FREELANCER_FLOW : SCHOOL_FLOW
  const currentIndex = flow.indexOf(currentStep)
  const totalSteps = flow.length

  /* ─── Helpers ───────────────────────────────────────────── */
  async function searchSchools(term: string) {
    if (term.trim().length < 2) { setSchoolResults([]); return }
    setSchoolSearching(true)
    try {
      const snap = await getDocs(
        query(
          collection(db, 'schools'),
          where('nameLower', '>=', term.toLowerCase()),
          where('nameLower', '<=', term.toLowerCase() + '\uf8ff'),
        ),
      )
      setSchoolResults(
        snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<FirestoreSchool, 'id'>) })),
      )
    } finally {
      setSchoolSearching(false)
    }
  }

  async function sendJoinRequest(): Promise<boolean> {
    if (!selectedSchool) return false
    setSaving(true)
    try {
      await addDoc(collection(db, 'schoolJoinRequests'), {
        teacherId: user?.uid ?? null,
        schoolId: selectedSchool.id,
        schoolName: selectedSchool.name,
        role: 'teacher',
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setSchoolId(selectedSchool.id)
      setJoinRequestSent(true)
      return true
    } catch {
      setSaveError('Failed to send join request. Please try again.')
      return false
    } finally {
      setSaving(false)
    }
  }

  async function handleFinish() {
    setSaving(true)
    setSaveError('')
    try {
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          role: 'teacher',
          avatar: avatar || '🤖',
          teacherType: teacherPath,
          schoolId: schoolId || null,
          mainSubject: subject || null,
          onboardingComplete: true,
          updatedAt: serverTimestamp(),
        })
      }
      router.push('/home')
    } catch {
      setSaveError('Failed to save preferences. Redirecting anyway…')
      setTimeout(() => router.push('/home'), 1500)
    } finally {
      setSaving(false)
    }
  }

  /* ─── Navigation ────────────────────────────────────────── */
  function goNext() {
    const nextStep = flow[currentIndex + 1]
    if (nextStep) setCurrentStep(nextStep)
  }

  function goPrev() {
    const prevStep = flow[currentIndex - 1]
    if (prevStep) setCurrentStep(prevStep)
  }

  async function handleNext() {
    if (currentStep === 'path' && teacherPath === 'school') {
      goNext() // → school-search
      return
    }
    if (currentStep === 'path' && teacherPath === 'freelancer') {
      goNext() // → subject (freelancer flow skips school-search)
      return
    }
    if (currentStep === 'school-search') {
      if (!joinRequestSent && selectedSchool) {
        const ok = await sendJoinRequest()
        if (!ok) return
      }
      goNext()
      return
    }
    goNext()
  }

  function canProceed(): boolean {
    if (currentStep === 'path') return teacherPath !== null
    if (currentStep === 'school-search') return selectedSchool !== null || joinRequestSent
    if (currentStep === 'subject') return subject !== ''
    return true
  }

  /* ─── Render ────────────────────────────────────────────── */
  const meta = STEP_META[currentStep]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-[30px] p-8 shadow-2xl border border-white/30">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-indigo-600">
              Step {currentIndex + 1} of {totalSteps}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round(((currentIndex + 1) / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${((currentIndex + 1) / totalSteps) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i <= currentIndex ? 'bg-indigo-500 scale-110' : 'bg-indigo-100'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Step header */}
        <div className="text-center mb-6">
          <h1
            className="text-2xl font-bold mb-2"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            {meta.title}
          </h1>
          <p className="text-gray-500">{meta.subtitle}</p>
        </div>

        {saveError && (
          <div className="mb-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-700 text-sm font-semibold text-center">
            {saveError}
          </div>
        )}

        {/* ── Step content ── */}
        <div className="min-h-[200px]">

          {/* Welcome */}
          {currentStep === 'welcome' && (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">👩‍🏫</div>
              <p className="text-gray-600 leading-relaxed">
                You&apos;re joining as a{' '}
                <span className="font-bold text-indigo-600">Teacher</span>.
              </p>
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { emoji: '📋', text: 'Manage Class' },
                  { emoji: '📊', text: 'Track Progress' },
                  { emoji: '🏆', text: 'Run Contests' },
                ].map((item) => (
                  <div key={item.text} className="bg-indigo-50 rounded-2xl p-3 text-center">
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-xs font-semibold text-indigo-700">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Avatar */}
          {currentStep === 'avatar' && (
            <div>
              <p className="text-sm font-semibold text-gray-700 mb-3">Choose your avatar</p>
              <div className="grid grid-cols-4 gap-3">
                {AVATARS.map((a) => (
                  <button
                    key={a}
                    onClick={() => setAvatar(a)}
                    className={`text-3xl p-3 rounded-2xl transition-all ${
                      avatar === a
                        ? 'bg-indigo-100 ring-2 ring-indigo-500 scale-110'
                        : 'bg-gray-50 hover:bg-indigo-50'
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* School or Freelancer choice */}
          {currentStep === 'path' && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {[
                {
                  id: 'school' as const,
                  emoji: '🏫',
                  label: 'I teach at a school',
                  desc: 'Connect with your school admin',
                },
                {
                  id: 'freelancer' as const,
                  emoji: '💻',
                  label: "I'm a freelancer",
                  desc: 'Independent teacher or tutor',
                },
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setTeacherPath(opt.id)}
                  className={`p-5 rounded-2xl border-2 transition-all text-left ${
                    teacherPath === opt.id
                      ? 'border-indigo-500 bg-indigo-50 scale-[1.02]'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <div className="text-3xl mb-2">{opt.emoji}</div>
                  <div className="text-sm font-bold text-gray-800">{opt.label}</div>
                  <div className="text-xs text-gray-500 mt-1">{opt.desc}</div>
                  {teacherPath === opt.id && (
                    <CheckCircle className="w-4 h-4 text-indigo-500 mt-2" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* School search */}
          {currentStep === 'school-search' && (
            <div className="space-y-4">
              {joinRequestSent ? (
                <div className="text-center py-4 space-y-3">
                  <div className="text-5xl">✅</div>
                  <p className="font-bold text-gray-800">Request Sent!</p>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    Your join request has been sent to the admin of{' '}
                    <span className="font-semibold text-indigo-600">{selectedSchool?.name}</span>.
                    You&apos;ll be notified once approved.
                  </p>
                  <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-xs text-amber-700 font-medium">
                    School approval pending — you can still continue!
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={schoolSearch}
                      onChange={(e) => {
                        setSchoolSearch(e.target.value)
                        searchSchools(e.target.value)
                      }}
                      placeholder="Search schools by name…"
                      className="w-full pl-9 pr-4 py-3 border-2 border-indigo-100 rounded-2xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all"
                    />
                  </div>

                  {schoolSearching && (
                    <p className="text-xs text-center text-gray-400">Searching…</p>
                  )}

                  {!schoolSearching && schoolSearch.length >= 2 && schoolResults.length === 0 && (
                    <p className="text-xs text-center text-gray-400">
                      No schools found. Ask your school admin to register first.
                    </p>
                  )}

                  {schoolResults.length > 0 && (
                    <ul className="space-y-2 max-h-48 overflow-y-auto">
                      {schoolResults.map((school) => (
                        <li key={school.id}>
                          <button
                            onClick={() => setSelectedSchool(school)}
                            className={`w-full text-left p-3 rounded-2xl border-2 transition-all ${
                              selectedSchool?.id === school.id
                                ? 'border-indigo-500 bg-indigo-50'
                                : 'border-gray-200 hover:border-indigo-300'
                            }`}
                          >
                            <p className="text-sm font-semibold text-gray-800">{school.name}</p>
                            <p className="text-xs text-gray-500">
                              {school.location} · {school.type}
                            </p>
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}

                  {selectedSchool && (
                    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-3 flex items-center gap-3">
                      <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{selectedSchool.name}</p>
                        <p className="text-xs text-gray-500">{selectedSchool.location}</p>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          )}

          {/* Subject selection */}
          {currentStep === 'subject' && (
            <div className="grid grid-cols-2 gap-3">
              {SUBJECTS.map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => setSubject(sub.id)}
                  className={`p-4 rounded-2xl border-2 transition-all text-center ${
                    subject === sub.id
                      ? 'border-indigo-500 bg-indigo-50 scale-[1.04]'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <div className="text-3xl mb-1.5">{sub.emoji}</div>
                  <div className="text-xs font-bold text-gray-700 leading-tight">{sub.label}</div>
                </button>
              ))}
            </div>
          )}

          {/* Complete */}
          {currentStep === 'complete' && (
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🚀</div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Avatar: <span className="text-2xl">{avatar || '🤖'}</span>
                </p>
                <p className="text-gray-600">
                  Teaching as:{' '}
                  <span className="font-bold text-indigo-600 capitalize">
                    {teacherPath === 'school' ? 'School Teacher' : 'Freelancer'}
                  </span>
                </p>
                {subject && (
                  <p className="text-gray-600">
                    Subject:{' '}
                    <span className="font-bold text-indigo-600">
                      {SUBJECTS.find((s) => s.id === subject)?.label}
                    </span>
                  </p>
                )}
              </div>
              {schoolId && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-700">
                  <span className="font-semibold">School approval pending</span> — you&apos;ll be
                  notified once the school admin approves your request.
                </div>
              )}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {['📋 Class Ready', '✅ Profile Set', "🌟 Let's Teach"].map((text) => (
                  <div
                    key={text}
                    className="bg-green-50 rounded-2xl p-3 text-center text-xs font-semibold text-green-700"
                  >
                    {text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {currentIndex > 0 && (
            <button
              onClick={goPrev}
              disabled={saving}
              className="flex-1 py-3 border-2 border-indigo-200 rounded-2xl text-indigo-600 font-semibold hover:bg-indigo-50 transition-all disabled:opacity-50"
            >
              {t('back')}
            </button>
          )}

          {currentStep !== 'complete' ? (
            <button
              onClick={handleNext}
              disabled={!canProceed() || saving}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              style={{
                boxShadow: canProceed() && !saving ? '0 4px 15px rgba(99,102,241,0.4)' : undefined,
              }}
            >
              {saving ? 'Saving…' : t('next')}
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={saving}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
              style={{ boxShadow: '0 4px 15px rgba(34,197,94,0.4)' }}
            >
              {saving ? 'Saving…' : t('finish')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
