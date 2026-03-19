'use client'

import { useState, useRef } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'
import { Upload, X, CheckCircle } from 'lucide-react'
import { doc, updateDoc, serverTimestamp, addDoc, collection } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useAuth } from '@/context/AuthContext'

/* ─── Types ───────────────────────────────────────────────── */
interface SchoolFormErrors {
  name?: string
  size?: string
  location?: string
  type?: string
}

/* ─── Constants ───────────────────────────────────────────── */
const SCHOOL_SIZES = [
  '< 100 students',
  '100–300 students',
  '300–500 students',
  '500–1,000 students',
  '> 1,000 students',
]

const SCHOOL_TYPES = [
  { id: 'public',     label: 'Public School',   emoji: '🏫' },
  { id: 'private',    label: 'Private School',  emoji: '🏛️' },
  { id: 'charter',    label: 'Charter School',  emoji: '📜' },
  { id: 'homeschool', label: 'Homeschool',      emoji: '🏠' },
  { id: 'online',     label: 'Online School',   emoji: '💻' },
]

const ACCEPTED_TYPES = ['.pdf', '.doc', '.docx']
const MAX_FILE_SIZE = 5 * 1024 * 1024

const TOTAL_STEPS = 4

/*
 * School Admin onboarding flow (matches flowchart):
 *   1  Register school — required (name, size, location, type)
 *   2  Legal documents — optional
 *   3  Management setup — accept invitations info
 *   4  Complete
 */
export default function SchoolAdminOnboarding() {
  const t = useTranslations('onboarding')
  const router = useRouter()
  const { user } = useAuth()

  const [step, setStep] = useState(1)
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')

  // Step 1 – school registration
  const [schoolForm, setSchoolForm] = useState({
    name: '',
    size: '',
    location: '',
    type: '',
  })
  const [schoolFormErrors, setSchoolFormErrors] = useState<SchoolFormErrors>({})

  // Step 2 – documents
  const [docFiles, setDocFiles] = useState<File[]>([])
  const [docError, setDocError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Registered school id (set after step 1 save)
  const [schoolId, setSchoolId] = useState('')

  /* ─── Step meta ─────────────────────────────────────────── */
  const stepMeta = [
    { title: 'Register Your School', subtitle: 'Fill in your school details to get started.' },
    {
      title: 'Legal Documents',
      subtitle: 'Upload any required legal documents. This step is optional.',
    },
    {
      title: 'School Management',
      subtitle: 'Review how to manage your school, teachers, and students.',
    },
    { title: "You're All Set! 🏫", subtitle: 'Your school is registered. Welcome aboard!' },
  ]

  /* ─── Helpers ───────────────────────────────────────────── */
  function validateForm(): boolean {
    const errors: SchoolFormErrors = {}
    if (!schoolForm.name.trim()) errors.name = 'School name is required'
    if (!schoolForm.size) errors.size = 'School size is required'
    if (!schoolForm.location.trim()) errors.location = 'Location is required'
    if (!schoolForm.type) errors.type = 'School type is required'
    setSchoolFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  function handleFiles(files: FileList | null) {
    if (!files) return
    setDocError('')
    for (const file of Array.from(files)) {
      const ext = '.' + (file.name.split('.').pop() ?? '').toLowerCase()
      if (!ACCEPTED_TYPES.includes(ext)) {
        setDocError('Only PDF, DOC, DOCX files are allowed.')
        return
      }
      if (file.size > MAX_FILE_SIZE) {
        setDocError('Each file must be under 5 MB.')
        return
      }
    }
    setDocFiles((prev) => [...prev, ...Array.from(files)])
  }

  /* ─── Navigation ────────────────────────────────────────── */
  async function handleNext() {
    if (step === 1) {
      if (!validateForm()) return
      // Register school in Firestore on first Next click
      if (!schoolId) {
        setSaving(true)
        try {
          const schoolDoc = await addDoc(collection(db, 'schools'), {
            name: schoolForm.name.trim(),
            nameLower: schoolForm.name.trim().toLowerCase(),
            size: schoolForm.size,
            location: schoolForm.location.trim(),
            type: schoolForm.type,
            adminId: user?.uid ?? null,
            status: 'active', // admin-registered schools are active immediately
            documentNames: [],
            createdAt: serverTimestamp(),
          })
          setSchoolId(schoolDoc.id)
        } catch {
          setSaveError('Failed to register school. Please try again.')
          setSaving(false)
          return
        }
        setSaving(false)
      }
    }
    setStep((s) => s + 1)
  }

  async function handleFinish() {
    setSaving(true)
    setSaveError('')
    try {
      if (user) {
        // Update school document with any uploaded document names
        if (schoolId && docFiles.length > 0) {
          await updateDoc(doc(db, 'schools', schoolId), {
            documentNames: docFiles.map((f) => f.name),
            updatedAt: serverTimestamp(),
          })
        }
        await updateDoc(doc(db, 'users', user.uid), {
          role: 'school-admin',
          schoolId: schoolId || null,
          onboardingComplete: true,
          updatedAt: serverTimestamp(),
        })
      }
      router.push('/home')
    } catch {
      setSaveError('Failed to save. Redirecting anyway…')
      setTimeout(() => router.push('/home'), 1500)
    } finally {
      setSaving(false)
    }
  }

  /* ─── Render ────────────────────────────────────────────── */
  const meta = stepMeta[step - 1]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-[30px] p-8 shadow-2xl border border-white/30">

        {/* Progress */}
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

        {/* Header */}
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

          {/* Step 1 – Register school */}
          {step === 1 && (
            <div className="space-y-4 overflow-y-auto max-h-[400px] pr-1">
              {/* Name */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  School Name <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={schoolForm.name}
                  onChange={(e) => setSchoolForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="Enter school name"
                  className={`w-full px-4 py-3 border-2 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all ${
                    schoolFormErrors.name
                      ? 'border-red-400 bg-red-50'
                      : 'border-indigo-100 focus:border-indigo-500'
                  }`}
                />
                {schoolFormErrors.name && (
                  <p className="text-xs text-red-500 mt-1">{schoolFormErrors.name}</p>
                )}
              </div>

              {/* Size */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  School Size <span className="text-red-400">*</span>
                </label>
                <select
                  value={schoolForm.size}
                  onChange={(e) => setSchoolForm((f) => ({ ...f, size: e.target.value }))}
                  className={`w-full px-4 py-3 border-2 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all bg-white ${
                    schoolFormErrors.size
                      ? 'border-red-400 bg-red-50'
                      : 'border-indigo-100 focus:border-indigo-500'
                  }`}
                >
                  <option value="">Select school size</option>
                  {SCHOOL_SIZES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {schoolFormErrors.size && (
                  <p className="text-xs text-red-500 mt-1">{schoolFormErrors.size}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1 block">
                  Location <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={schoolForm.location}
                  onChange={(e) => setSchoolForm((f) => ({ ...f, location: e.target.value }))}
                  placeholder="City, Country"
                  className={`w-full px-4 py-3 border-2 rounded-2xl text-gray-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 transition-all ${
                    schoolFormErrors.location
                      ? 'border-red-400 bg-red-50'
                      : 'border-indigo-100 focus:border-indigo-500'
                  }`}
                />
                {schoolFormErrors.location && (
                  <p className="text-xs text-red-500 mt-1">{schoolFormErrors.location}</p>
                )}
              </div>

              {/* School Type */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-2 block">
                  School Type <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {SCHOOL_TYPES.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => setSchoolForm((f) => ({ ...f, type: type.id }))}
                      className={`p-2.5 rounded-xl border-2 text-center transition-all ${
                        schoolForm.type === type.id
                          ? 'border-indigo-500 bg-indigo-50'
                          : 'border-gray-200 hover:border-indigo-300'
                      }`}
                    >
                      <div className="text-xl">{type.emoji}</div>
                      <div className="text-xs font-semibold text-gray-700 mt-1 leading-tight">
                        {type.label}
                      </div>
                    </button>
                  ))}
                </div>
                {schoolFormErrors.type && (
                  <p className="text-xs text-red-500 mt-1">{schoolFormErrors.type}</p>
                )}
              </div>
            </div>
          )}

          {/* Step 2 – Legal documents */}
          {step === 2 && (
            <div className="space-y-4">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => { e.preventDefault(); handleFiles(e.dataTransfer.files) }}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-indigo-200 rounded-2xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/30 transition-all"
              >
                <Upload className="w-8 h-8 mx-auto text-indigo-400 mb-2" />
                <p className="text-sm text-gray-600 font-medium">
                  Drop documents here or click to upload
                </p>
                <p className="text-xs text-gray-400 mt-1">PDF, DOC, DOCX — max 5 MB each</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>

              {docError && <p className="text-xs text-red-500">{docError}</p>}

              {docFiles.length > 0 ? (
                <ul className="space-y-2">
                  {docFiles.map((f, i) => (
                    <li
                      key={i}
                      className="flex items-center justify-between bg-indigo-50 rounded-xl px-3 py-2.5 text-sm"
                    >
                      <span className="text-gray-700 truncate">{f.name}</span>
                      <button
                        onClick={() => setDocFiles((prev) => prev.filter((_, j) => j !== i))}
                        className="ml-2 text-gray-400 hover:text-red-500 flex-shrink-0"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-center text-gray-400 py-2">
                  No documents uploaded yet — you can skip this step.
                </p>
              )}
            </div>
          )}

          {/* Step 3 – Management info */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 leading-relaxed">
                As the school admin, you can manage your school from your dashboard:
              </p>
              <div className="space-y-3">
                {[
                  {
                    emoji: '✅',
                    title: 'Accept Teacher Invitations',
                    desc: 'Review and approve teachers who request to join your school.',
                  },
                  {
                    emoji: '🎓',
                    title: 'Approve Student Requests',
                    desc: 'Students who select your school will need your approval.',
                  },
                  {
                    emoji: '📊',
                    title: 'Monitor Progress',
                    desc: "Track your school's performance and student achievements.",
                  },
                  {
                    emoji: '🏆',
                    title: 'Run School Contests',
                    desc: 'Organise coding competitions and challenges for your school.',
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-3 p-3 bg-indigo-50 rounded-2xl"
                  >
                    <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                    <div>
                      <p className="text-sm font-bold text-gray-800">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 4 – Complete */}
          {step === 4 && (
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🏫</div>
              <div className="space-y-2">
                <p className="text-gray-600">
                  School:{' '}
                  <span className="font-bold text-indigo-600">{schoolForm.name}</span>
                </p>
                <p className="text-gray-600">
                  Location:{' '}
                  <span className="font-bold text-indigo-600">{schoolForm.location}</span>
                </p>
                <p className="text-gray-600">
                  Type:{' '}
                  <span className="font-bold text-indigo-600 capitalize">{schoolForm.type}</span>
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-2xl px-4 py-3 flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                <p className="text-sm text-green-700 font-medium">
                  Your school is registered and ready to accept teachers and students.
                </p>
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
              {/* Skip only on documents step */}
              {step === 2 && (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="py-3 px-5 border-2 border-gray-200 rounded-2xl text-gray-500 font-semibold hover:bg-gray-50 transition-all"
                >
                  {t('skip')}
                </button>
              )}
              <button
                onClick={handleNext}
                disabled={saving}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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
