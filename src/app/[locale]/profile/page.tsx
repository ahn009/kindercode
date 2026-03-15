'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useRouter } from '@/i18n/navigation'
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore'
import { updateProfile } from 'firebase/auth'
import { db, auth } from '@/lib/firebase'
import { User, Mail, BookOpen, Globe, Edit3, Check, X } from 'lucide-react'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'

interface UserProfile {
  name: string
  email: string
  gradeLevel: string
  country: string
  preferredLanguage: string
  role: string
  avatar: string
  learningStyle: string
  goals: string[]
  streak: number
  points: number
  level: number
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<Partial<UserProfile>>({})
  const [fetching, setFetching] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editName, setEditName] = useState('')

  useEffect(() => {
    if (!loading && !user) router.push('/login')
  }, [user, loading, router])

  useEffect(() => {
    async function fetchProfile() {
      if (!user) return
      try {
        const snap = await getDoc(doc(db, 'users', user.uid))
        if (snap.exists()) {
          setProfile(snap.data() as UserProfile)
          setEditName(snap.data().name ?? '')
        }
      } finally {
        setFetching(false)
      }
    }
    if (user) fetchProfile()
  }, [user])

  async function handleSaveName() {
    if (!user || !editName.trim()) return
    setSaving(true)
    try {
      await updateProfile(auth.currentUser!, { displayName: editName.trim() })
      await updateDoc(doc(db, 'users', user.uid), {
        name: editName.trim(),
        updatedAt: serverTimestamp(),
      })
      setProfile((p) => ({ ...p, name: editName.trim() }))
      setEditing(false)
    } finally {
      setSaving(false)
    }
  }

  if (loading || fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2d3748]">
        <div className="w-12 h-12 rounded-full border-4 border-[#FFD93D] border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!user) return null

  const displayName = profile.name ?? user.displayName ?? user.email?.split('@')[0] ?? 'Coder'
  const initials = displayName.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div className="py-12 px-6" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
        <div className="max-w-4xl mx-auto flex items-center gap-6">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #FF8C42 0%, #FFD93D 100%)' }}
          >
            {profile.avatar || initials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              {editing ? (
                <div className="flex items-center gap-2">
                  <input
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="font-fredoka text-2xl font-bold bg-white/20 text-white rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-[#FFD93D]"
                  />
                  <button onClick={handleSaveName} disabled={saving} className="text-green-400 hover:text-green-300">
                    <Check className="w-5 h-5" />
                  </button>
                  <button onClick={() => setEditing(false)} className="text-red-400 hover:text-red-300">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <h1 className="font-fredoka text-3xl font-bold text-white">{displayName}</h1>
                  <button onClick={() => setEditing(true)} className="text-white/50 hover:text-white transition-colors">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
            <p className="text-white/60 text-sm mt-1">{user.email}</p>
            <div className="flex items-center gap-4 mt-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#FFD93D]/20 text-[#FFD93D] capitalize">
                {profile.role ?? 'student'}
              </span>
              {profile.learningStyle && (
                <span className="text-xs font-semibold text-white/60 capitalize">{profile.learningStyle} learner</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="max-w-4xl mx-auto px-6 -mt-6 mb-8">
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Streak', value: profile.streak ?? 0, emoji: '🔥' },
            { label: 'Points', value: (profile.points ?? 0).toLocaleString(), emoji: '⭐' },
            { label: 'Level', value: profile.level ?? 1, emoji: '⚡' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 text-center">
              <div className="text-2xl mb-1">{stat.emoji}</div>
              <div className="text-2xl font-extrabold text-slate-800">{stat.value}</div>
              <div className="text-xs font-semibold text-slate-500">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Profile Details */}
      <div className="max-w-4xl mx-auto px-6 pb-12">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 divide-y divide-slate-100">
          {[
            { icon: User, label: 'Display Name', value: displayName },
            { icon: Mail, label: 'Email', value: user.email ?? '—' },
            { icon: BookOpen, label: 'Grade Level', value: profile.gradeLevel ?? '—' },
            { icon: Globe, label: 'Country', value: profile.country ?? '—' },
            {
              icon: Globe,
              label: 'Preferred Language',
              value: SUPPORTED_LANGUAGES.find((l) => l.code === profile.preferredLanguage)?.name ?? profile.preferredLanguage ?? '—',
            },
          ].map(({ icon: Icon, label, value }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-4">
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-slate-500" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-400">{label}</p>
                <p className="text-sm font-semibold text-slate-800 truncate">{value}</p>
              </div>
            </div>
          ))}
        </div>

        {profile.goals && profile.goals.length > 0 && (
          <div className="mt-6 bg-white rounded-3xl shadow-sm border border-slate-100 p-6">
            <h2 className="font-fredoka text-xl font-bold text-slate-800 mb-4">🎯 My Goals</h2>
            <div className="flex flex-wrap gap-2">
              {profile.goals.map((goal) => (
                <span key={goal} className="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold capitalize">
                  {goal}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
