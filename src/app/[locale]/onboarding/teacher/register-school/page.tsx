'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { useAuth } from '@/context/AuthContext'
import { doc, collection, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'

const COUNTRIES = [
  { value: 'us', label: '🇺🇸 United States' },
  { value: 'gb', label: '🇬🇧 United Kingdom' },
  { value: 'ca', label: '🇨🇦 Canada' },
  { value: 'au', label: '🇦🇺 Australia' },
  { value: 'de', label: '🇩🇪 Germany' },
  { value: 'fr', label: '🇫🇷 France' },
  { value: 'in', label: '🇮🇳 India' },
  { value: 'pk', label: '🇵🇰 Pakistan' },
  { value: 'bd', label: '🇧🇩 Bangladesh' },
  { value: 'ng', label: '🇳🇬 Nigeria' },
  { value: 'br', label: '🇧🇷 Brazil' },
  { value: 'mx', label: '🇲🇽 Mexico' },
  { value: 'other', label: '🌍 Other' },
]

const SCHOOL_TYPES = [
  { value: 'private', label: 'Private' },
  { value: 'public', label: 'Public' },
  { value: 'international', label: 'International' },
  { value: 'montessori', label: 'Montessori' },
  { value: 'coaching-center', label: 'Coaching Center' },
  { value: 'online-academy', label: 'Online Academy' },
]

const SCHOOL_SIZES = [
  { value: 'under100', label: 'Under 100 students' },
  { value: '100-500', label: '100 – 500 students' },
  { value: '500-1000', label: '500 – 1,000 students' },
  { value: '1000plus', label: '1,000+ students' },
]

const MAX_FILE_SIZE = 2 * 1024 * 1024 // 2 MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

function Sparkle({ size = 16, color = '#ffd93d' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill={color} />
    </svg>
  )
}

function generateSchoolId(): string {
  const num = Math.floor(10000 + Math.random() * 90000)
  return `SCL-${num}`
}

const inputStyle = {
  background: 'rgba(255,255,255,0.85)',
  border: '1.5px solid rgba(180,180,220,0.5)',
  boxShadow: 'inset 0 1px 4px rgba(0,0,0,0.05)',
}

const selectStyle = {
  ...inputStyle,
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='2' stroke-linecap='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat' as const,
  backgroundPosition: 'right 10px center',
  paddingRight: '2rem',
}

function focusIn(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = '#a78bfa'
  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(167,139,250,0.2)'
}
function focusOut(e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) {
  e.currentTarget.style.borderColor = 'rgba(180,180,220,0.5)'
  e.currentTarget.style.boxShadow = 'inset 0 1px 4px rgba(0,0,0,0.05)'
}

// ─── Logo Upload Component ────────────────────────────────────────────────────
function LogoUpload({
  preview,
  uploadError,
  onFileSelect,
  onRemove,
}: {
  preview: string | null
  uploadError: string
  onFileSelect: (file: File) => void
  onRemove: () => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function validateAndSelect(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      return
    }
    onFileSelect(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) validateAndSelect(file)
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) validateAndSelect(file)
    // reset so same file can be re-selected
    e.target.value = ''
  }

  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">
        School Logo
        <span className="ml-1 font-normal text-gray-400">(optional · JPG, PNG, WEBP · max 2 MB)</span>
      </label>

      {preview ? (
        /* ── Preview state ── */
        <div className="flex items-center gap-4">
          <div
            className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center"
            style={{ border: '2px solid rgba(167,139,250,0.4)', background: 'rgba(255,255,255,0.7)' }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="School logo preview" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-700 mb-1">Logo selected</p>
            <p className="text-xs text-gray-400 mb-2">Looks great! Will be uploaded on submit.</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 transition-all"
                style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)' }}
              >
                Change
              </button>
              <button
                type="button"
                onClick={onRemove}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 transition-all"
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* ── Drop zone ── */
        <div
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className="w-full flex flex-col items-center justify-center gap-2 py-5 rounded-2xl cursor-pointer transition-all"
          style={{
            background: dragging ? 'rgba(167,139,250,0.1)' : 'rgba(255,255,255,0.6)',
            border: dragging
              ? '2px dashed #a78bfa'
              : '2px dashed rgba(180,180,220,0.5)',
          }}
        >
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #e8e0ff, #d8d0f8)' }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="4" stroke="#a78bfa" strokeWidth="2" />
              <circle cx="8.5" cy="8.5" r="1.5" fill="#a78bfa" />
              <path d="M3 16l5-5 4 4 3-3 6 6" stroke="#a78bfa" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold text-gray-600">
              {dragging ? 'Drop your logo here' : 'Upload School Logo'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">Drag & drop or click to browse</p>
            <p className="text-xs text-gray-400">Recommended: 200×200 px square</p>
          </div>
        </div>
      )}

      {uploadError && (
        <p className="mt-1.5 text-xs text-red-500 font-medium">{uploadError}</p>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
        aria-label="Upload school logo"
      />
    </div>
  )
}

// ─── Upload Progress Bar ──────────────────────────────────────────────────────
function UploadProgress({ percent }: { percent: number }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)' }}>
      <svg className="w-4 h-4 animate-spin flex-shrink-0" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="10" stroke="rgba(167,139,250,0.3)" strokeWidth="3" />
        <path d="M12 2a10 10 0 0110 10" stroke="#a78bfa" strokeWidth="3" strokeLinecap="round" />
      </svg>
      <div className="flex-1">
        <div className="flex justify-between text-xs font-semibold text-indigo-600 mb-1">
          <span>Uploading logo…</span>
          <span>{percent}%</span>
        </div>
        <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(167,139,250,0.2)' }}>
          <div
            className="h-1.5 rounded-full transition-all"
            style={{ width: `${percent}%`, background: 'linear-gradient(90deg, #a78bfa, #7c3aed)' }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function RegisterSchoolPage() {
  const router = useRouter()
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [uploadPercent, setUploadPercent] = useState(0)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const [form, setForm] = useState({
    schoolName: '',
    schoolType: 'private',
    country: 'us',
    city: '',
    address: '',
    officialEmail: '',
    contactNumber: '',
    schoolSize: 'under100',
    studentCapacity: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLogoSelect = useCallback((file: File) => {
    setUploadError('')
    if (!ALLOWED_TYPES.includes(file.type)) {
      setUploadError('Only JPG, PNG and WEBP images are supported.')
      return
    }
    if (file.size > MAX_FILE_SIZE) {
      setUploadError('File is too large. Maximum size is 2 MB.')
      return
    }
    setLogoFile(file)
    const reader = new FileReader()
    reader.onloadend = () => setLogoPreview(reader.result as string)
    reader.readAsDataURL(file)
  }, [])

  const handleLogoRemove = useCallback(() => {
    setLogoFile(null)
    setLogoPreview(null)
    setUploadError('')
  }, [])

  async function uploadLogo(schoolDocId: string): Promise<string | null> {
    if (!logoFile) return null
    const ext = logoFile.name.split('.').pop() ?? 'jpg'
    const logoRef = ref(storage, `school-logos/${schoolDocId}/logo.${ext}`)
    return new Promise((resolve, reject) => {
      const task = uploadBytesResumable(logoRef, logoFile, { contentType: logoFile.type })
      task.on(
        'state_changed',
        (snap) => {
          setUploadPercent(Math.round((snap.bytesTransferred / snap.totalBytes) * 100))
        },
        (err) => reject(err),
        async () => {
          const url = await getDownloadURL(task.snapshot.ref)
          resolve(url)
        },
      )
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!user) {
      setError('You must be logged in to register a school.')
      return
    }
    setError('')
    setLoading(true)
    try {
      const schoolId = generateSchoolId()

      // 1 — Create school document (without logo first)
      const schoolRef = await addDoc(collection(db, 'schools'), {
        schoolId,
        name: form.schoolName,
        type: form.schoolType,
        country: form.country,
        city: form.city,
        address: form.address,
        officialEmail: form.officialEmail,
        contactNumber: form.contactNumber,
        size: form.schoolSize,
        studentCapacity: form.studentCapacity ? Number(form.studentCapacity) : null,
        adminUid: user.uid,
        teachersCount: 1,
        logoUrl: null,
        status: 'active',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })

      // 2 — Upload logo if provided (non-blocking on failure)
      let logoUrl: string | null = null
      if (logoFile) {
        try {
          logoUrl = await uploadLogo(schoolRef.id)
          await updateDoc(schoolRef, { logoUrl, logoUpdatedAt: serverTimestamp() })
        } catch {
          // Logo upload failed — continue without logo
          setUploadError('Logo upload failed but your school was saved. You can add a logo later.')
        }
      }

      // 3 — Update teacher profile
      await updateDoc(doc(db, 'users', user.uid), {
        schoolId: schoolRef.id,
        schoolName: form.schoolName,
        schoolLogo: logoUrl,
        isSchoolAdmin: true,
        teacherStatus: 'ACTIVE',
        onboardingComplete: true,
        updatedAt: serverTimestamp(),
      })

      router.push('/home')
    } catch (err) {
      console.error(err)
      setError('Failed to register school. Please try again.')
    } finally {
      setLoading(false)
      setUploadPercent(0)
    }
  }

  const isUploading = loading && logoFile !== null && uploadPercent > 0 && uploadPercent < 100

  return (
    <div
      className="min-h-screen flex flex-col relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #b8c8e8 0%, #c8d8f5 20%, #dce4f5 40%, #e8d8f0 65%, #d8c8e8 85%, #c8b8d8 100%)' }}
    >
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute rounded-full" style={{ width: 320, height: 90, top: '4%', left: '-6%', background: 'rgba(255,255,255,0.75)', filter: 'blur(10px)' }} />
        <div className="absolute rounded-full" style={{ width: 250, height: 70, top: '2%', left: '2%', background: 'rgba(255,255,255,0.85)', filter: 'blur(5px)' }} />
        <div className="absolute rounded-full" style={{ width: 280, height: 80, top: '7%', right: '-4%', background: 'rgba(255,255,255,0.75)', filter: 'blur(10px)' }} />
        <div className="absolute rounded-full" style={{ width: 600, height: 140, bottom: '5%', left: '-8%', background: 'rgba(255,255,255,0.55)', filter: 'blur(20px)' }} />
        {[
          { top: '3%', left: '8%', size: 18, color: '#ffd93d' },
          { top: '6%', left: '28%', size: 14, color: '#ffd93d' },
          { top: '4%', right: '15%', size: 16, color: '#ffd93d' },
          { top: '8%', right: '5%', size: 12, color: '#ff9ebc' },
        ].map((s, i) => (
          <span key={i} className="absolute" style={{ top: s.top, left: (s as { left?: string }).left, right: (s as { right?: string }).right }}>
            <Sparkle size={s.size} color={s.color} />
          </span>
        ))}
        {[
          { top: '25%', left: '1%', color: '#ff9ebc', size: 8 },
          { top: '40%', left: '2%', color: '#a8d8ea', size: 6 },
          { top: '25%', right: '1%', color: '#6bcb77', size: 8 },
          { top: '40%', right: '2%', color: '#ff6b6b', size: 6 },
        ].map((d, i) => (
          <span key={`dot-${i}`} className="absolute rounded-full" style={{ top: d.top, left: (d as { left?: string }).left, right: (d as { right?: string }).right, width: d.size, height: d.size, background: d.color, opacity: 0.6 }} />
        ))}
      </div>

      <main className="flex-1 flex items-center justify-center py-8 px-4 relative z-10">
        <div
          className="w-full max-w-lg rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.55)',
            backdropFilter: 'blur(18px)',
            border: '1.5px solid rgba(255,255,255,0.75)',
            boxShadow: '0 8px 40px rgba(100,80,180,0.18)',
          }}
        >
          <div className="px-8 pt-7 pb-8">
            {/* Logo */}
            <div className="text-center mb-4">
              <div className="inline-flex items-center gap-0.5 text-3xl font-extrabold tracking-tight font-fredoka">
                {['K', 'i', 'n', 'd', 'e', 'r', 'C', 'o', 'd', 'e'].map((ch, i) => (
                  <span key={i} style={{ color: ['#e53935', '#fb8c00', '#fdd835', '#43a047', '#1e88e5', '#8e24aa', '#e53935', '#fb8c00', '#1e88e5', '#43a047'][i] }}>{ch}</span>
                ))}
                <span className="ml-1"><Sparkle size={14} color="#ffd93d" /></span>
              </div>
            </div>

            <h1 className="text-center text-2xl font-bold text-gray-800 mb-1">Register Your School</h1>
            <p className="text-center text-sm text-gray-500 mb-5">You will become the school admin after registration</p>

            {/* Back link */}
            <Link
              href="/onboarding/teacher/school-connection"
              className="inline-flex items-center gap-1.5 text-sm text-indigo-600 font-semibold hover:underline mb-4"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Back to school search
            </Link>

            {error && (
              <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-2xl text-red-600 text-sm font-semibold text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

              {/* ── Logo Upload ── */}
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.5)', border: '1.5px solid rgba(200,210,240,0.6)' }}>
                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <rect x="3" y="3" width="18" height="18" rx="4" stroke="currentColor" strokeWidth="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                    <path d="M3 16l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  School Logo
                </h2>
                <LogoUpload
                  preview={logoPreview}
                  uploadError={uploadError}
                  onFileSelect={handleLogoSelect}
                  onRemove={handleLogoRemove}
                />
              </div>

              {/* ── School Information ── */}
              <div className="rounded-2xl p-4" style={{ background: 'rgba(255,255,255,0.5)', border: '1.5px solid rgba(200,210,240,0.6)' }}>
                <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M3 21V9l9-6 9 6v12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <rect x="9" y="14" width="6" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  School Information
                </h2>
                <div className="space-y-3">

                  {/* School Name */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">School Name *</label>
                    <input
                      type="text"
                      name="schoolName"
                      value={form.schoolName}
                      onChange={handleChange}
                      placeholder="e.g. Green Valley School"
                      required
                      className="w-full px-4 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                      style={inputStyle}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>

                  {/* School Type + Size */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">School Type *</label>
                      <select
                        name="schoolType"
                        value={form.schoolType}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all appearance-none cursor-pointer"
                        style={selectStyle}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      >
                        {SCHOOL_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">School Size *</label>
                      <select
                        name="schoolSize"
                        value={form.schoolSize}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all appearance-none cursor-pointer"
                        style={selectStyle}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      >
                        {SCHOOL_SIZES.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </div>
                  </div>

                  {/* Country + City */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Country *</label>
                      <select
                        name="country"
                        value={form.country}
                        onChange={handleChange}
                        className="w-full px-3 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all appearance-none cursor-pointer"
                        style={selectStyle}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      >
                        {COUNTRIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={form.city}
                        onChange={handleChange}
                        placeholder="e.g. New York"
                        required
                        className="w-full px-3 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                        style={inputStyle}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">School Address</label>
                    <input
                      type="text"
                      name="address"
                      value={form.address}
                      onChange={handleChange}
                      placeholder="Street address"
                      className="w-full px-4 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                      style={inputStyle}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>

                  {/* Official Email + Contact */}
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Official Email</label>
                      <input
                        type="email"
                        name="officialEmail"
                        value={form.officialEmail}
                        onChange={handleChange}
                        placeholder="school@edu.com"
                        className="w-full px-3 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                        style={inputStyle}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Contact Number</label>
                      <input
                        type="tel"
                        name="contactNumber"
                        value={form.contactNumber}
                        onChange={handleChange}
                        placeholder="+1 555-0000"
                        className="w-full px-3 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                        style={inputStyle}
                        onFocus={focusIn}
                        onBlur={focusOut}
                      />
                    </div>
                  </div>

                  {/* Student Capacity */}
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 mb-1">Student Capacity</label>
                    <input
                      type="number"
                      name="studentCapacity"
                      value={form.studentCapacity}
                      onChange={handleChange}
                      placeholder="e.g. 500"
                      min="1"
                      className="w-full px-4 py-2.5 rounded-xl text-gray-800 text-sm focus:outline-none transition-all"
                      style={inputStyle}
                      onFocus={focusIn}
                      onBlur={focusOut}
                    />
                  </div>

                </div>
              </div>

              {/* Upload progress */}
              {isUploading && <UploadProgress percent={uploadPercent} />}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl text-white font-bold text-base transition-all"
                style={{
                  background: loading
                    ? 'linear-gradient(135deg, #9ca3af, #6b7280)'
                    : 'linear-gradient(135deg, #52b788, #43a047)',
                  boxShadow: loading ? 'none' : '0 6px 20px rgba(67,160,71,0.4)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}
                onMouseEnter={(e) => { if (!loading) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(67,160,71,0.5)' } }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = loading ? 'none' : '0 6px 20px rgba(67,160,71,0.4)' }}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                      <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                    {isUploading ? `Uploading logo (${uploadPercent}%)…` : 'Registering School…'}
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <path d="M3 21V9l9-6 9 6v12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Register School & Continue
                  </span>
                )}
              </button>

            </form>
          </div>
        </div>
      </main>
    </div>
  )
}
