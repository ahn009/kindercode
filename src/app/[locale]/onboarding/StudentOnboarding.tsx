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

/* ─── Constants ───────────────────────────────────────────── */
const AVATARS = ['🦊', '🐼', '🦁', '🐸', '🤖', '🦋', '🐙', '🦄']

const GRADES = [
  'Kindergarten', 'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4',
  'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8',
]

const LEARNING_STYLES = [
  { id: 'story',  emoji: '📖', label: 'Story Based'  },
  { id: 'game',   emoji: '🎮', label: 'Game Based'   },
  { id: 'card',   emoji: '🃏', label: 'Card Based'   },
  { id: 'puzzle', emoji: '🧩', label: 'Puzzle Based' },
]

const TOTAL_STEPS = 6

/*
 * Student onboarding flow (matches flowchart):
 *   1  Welcome
 *   2  Avatar + Grade
 *   3  School selection — optional (skip available)
 *        → if school selected: join request sent to admin, then continue
 *        → if skipped: continue without school
 *   4  Learning style
 *   5  Goals (optional / skippable)
 *   6  All set
 */
export default function StudentOnboarding() {
  const t = useTranslations('onboarding')
  const router = useRouter()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Step 2
  const [avatar, setAvatar] = useState('')
  const [grade, setGrade] = useState('')

  // Step 3 – school (optional)
  const [schoolSearch, setSchoolSearch] = useState('')
  const [schoolResults, setSchoolResults] = useState<FirestoreSchool[]>([])
  const [schoolSearching, setSchoolSearching] = useState(false)
  const [selectedSchool, setSelectedSchool] = useState<FirestoreSchool | null>(null)
  const [joinRequestSent, setJoinRequestSent] = useState(false)
  const [schoolId, setSchoolId] = useState('')

  // Step 4
  const [learningStyle, setLearningStyle] = useState('')

  // Step 5
  const [goals, setGoals] = useState<string[]>([])

  /* ─── Step meta ─────────────────────────────────────────── */
  const stepMeta: Record<number, { title: string; subtitle: string }> = {
    1: { title: t('step1Title'), subtitle: t('step1Subtitle') },
    2: { title: t('step2Title'), subtitle: t('step2Subtitle') },
    3: {
      title: 'Select Your School',
      subtitle: 'Find your school and request to join — or skip and continue.',
    },
    4: { title: t('step3Title'), subtitle: t('step3Subtitle') },
    5: { title: t('step4Title'), subtitle: t('step4Subtitle') },
    6: { title: t('step5Title'), subtitle: t('step5Subtitle') },
  }

  /* ─── Helpers ───────────────────────────────────────────── */
  function toggleGoal(goal: string) {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    )
  }

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

  async function sendJoinRequest(): Promise<void> {
    if (!selectedSchool || joinRequestSent) return
    try {
      await addDoc(collection(db, 'schoolJoinRequests'), {
        studentId: user?.uid ?? null,
        schoolId: selectedSchool.id,
        schoolName: selectedSchool.name,
        status: 'pending',
        createdAt: serverTimestamp(),
      })
      setSchoolId(selectedSchool.id)
      setJoinRequestSent(true)
    } catch {
      // non-blocking – student can still continue onboarding
    }
  }

  async function handleFinish() {
    setSaving(true)
    setSaveError('')
    try {
      if (user) {
        await updateDoc(doc(db, 'users', user.uid), {
          role: 'student',
          avatar: avatar || '🤖',
          gradeLevel: grade || null,
          schoolId: schoolId || null,
          learningStyle: learningStyle || null,
          goals,
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
  async function handleNext() {
    // Step 3: if a school is selected and request not yet sent, fire & forget
    if (step === 3 && selectedSchool && !joinRequestSent) {
      await sendJoinRequest()
    }
    setStep((s) => s + 1)
  }

  function handleSkip() {
    setStep((s) => s + 1)
  }

  /* ─── Render ────────────────────────────────────────────── */
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-[30px] p-8 shadow-2xl border border-white/30">

        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-indigo-600">
              Step {step} of {TOTAL_STEPS}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round((step / TOTAL_STEPS) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${(step / TOTAL_STEPS) * 100}%` }}
            />
          </div>
          <div className="flex justify-between mt-3">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i + 1 <= step ? 'bg-indigo-500 scale-110' : 'bg-indigo-100'
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
            {stepMeta[step].title}
          </h1>
          <p className="text-gray-500">{stepMeta[step].subtitle}</p>
        </div>

        {saveError && (
          <div className="mb-4 px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-2xl text-yellow-700 text-sm font-semibold text-center">
            {saveError}
          </div>
        )}

        {/* ── Step content ── */}
        <div className="min-h-[200px]">

          {/* Step 1 – Welcome */}
          {step === 1 && (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-600 leading-relaxed">
                {t('confirmRole')}{' '}
                <span className="font-bold text-indigo-600">Student</span>
              </p>
              <div className="grid grid-cols-3 gap-3 mt-6">
                {[
                  { emoji: '🎮', text: 'Fun Learning' },
                  { emoji: '🏆', text: 'Earn Badges' },
                  { emoji: '🌍', text: 'Global Community' },
                ].map((item) => (
                  <div key={item.text} className="bg-indigo-50 rounded-2xl p-3 text-center">
                    <div className="text-2xl mb-1">{item.emoji}</div>
                    <div className="text-xs font-semibold text-indigo-700">{item.text}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2 – Avatar + Grade */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <p className="text-sm font-semibold text-gray-700 mb-3">{t('avatar')}</p>
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
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  {t('grade')}
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-indigo-100 rounded-2xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white"
                >
                  <option value="">Select grade</option>
                  {GRADES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
            </div>
          )}

          {/* Step 3 – School (optional) */}
          {step === 3 && (
            <div className="space-y-4">
              {joinRequestSent ? (
                /* Request sent confirmation — user can now click Next */
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
                      No schools found. You can skip and add your school later.
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

          {/* Step 4 – Learning Style */}
          {step === 4 && (
            <div className="grid grid-cols-2 gap-4">
              {LEARNING_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setLearningStyle(style.id)}
                  className={`p-5 rounded-2xl border-2 transition-all text-center ${
                    learningStyle === style.id
                      ? 'border-indigo-500 bg-indigo-50 scale-105'
                      : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
                  }`}
                >
                  <div className="text-4xl mb-2">{style.emoji}</div>
                  <div className="text-sm font-bold text-gray-700">{style.label}</div>
                </button>
              ))}
            </div>
          )}

          {/* Step 5 – Goals */}
          {step === 5 && (
            <div className="space-y-3">
              {[
                { id: 'create',  label: t('goalCreate'),  emoji: '🎮' },
                { id: 'compete', label: t('goalCompete'), emoji: '🏆' },
                { id: 'learn',   label: t('goalLearn'),   emoji: '📚' },
                { id: 'teach',   label: t('goalTeach'),   emoji: '👩‍🏫' },
              ].map((goal) => (
                <button
                  key={goal.id}
                  onClick={() => toggleGoal(goal.id)}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${
                    goals.includes(goal.id)
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <span className="text-2xl">{goal.emoji}</span>
                  <span className="text-sm font-semibold text-gray-700 flex-1">{goal.label}</span>
                  {goals.includes(goal.id) && (
                    <CheckCircle className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Step 6 – Complete */}
          {step === 6 && (
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🚀</div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  Avatar: <span className="text-2xl">{avatar || '🤖'}</span>
                </p>
                {grade && (
                  <p className="text-gray-600">
                    Grade: <span className="font-bold text-indigo-600">{grade}</span>
                  </p>
                )}
                {learningStyle && (
                  <p className="text-gray-600">
                    Learning style:{' '}
                    <span className="font-bold text-indigo-600 capitalize">{learningStyle}</span>
                  </p>
                )}
                {goals.length > 0 && (
                  <p className="text-gray-600">
                    Goals: <span className="font-bold text-indigo-600">{goals.length} selected</span>
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
                {["🎯 Goals Set", "✅ Profile Ready", "🌟 Let's Code"].map((text) => (
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
          {step > 1 && (
            <button
              onClick={() => setStep((s) => s - 1)}
              disabled={saving}
              className="flex-1 py-3 border-2 border-indigo-200 rounded-2xl text-indigo-600 font-semibold hover:bg-indigo-50 transition-all disabled:opacity-50"
            >
              {t('back')}
            </button>
          )}

          {step < TOTAL_STEPS ? (
            <>
              {/* Skip only on school (step 3) and goals (step 5) */}
              {(step === 3 || step === 5) && (
                <button
                  onClick={handleSkip}
                  className="py-3 px-5 border-2 border-gray-200 rounded-2xl text-gray-500 font-semibold hover:bg-gray-50 transition-all"
                >
                  {t('skip')}
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={saving}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50"
                style={{ boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
              >
                {saving ? 'Saving…' : t('next')}
              </button>
            </>
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
