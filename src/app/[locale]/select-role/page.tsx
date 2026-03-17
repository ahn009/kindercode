'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter } from '@/i18n/navigation'

const ROLE_IDS = ['student', 'teacher', 'school-admin'] as const

// Inline SVG illustrations (unchanged from original)
const ILLUSTRATIONS: Record<string, React.ReactNode> = {
  student: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="120" rx="12" fill="#f0f4ff" />
      <rect x="20" y="85" width="80" height="8" rx="3" fill="#c8a97e" />
      <rect x="30" y="93" width="8" height="18" rx="2" fill="#b8956a" />
      <rect x="82" y="93" width="8" height="18" rx="2" fill="#b8956a" />
      <rect x="38" y="65" width="44" height="28" rx="3" fill="#4a90d9" />
      <rect x="40" y="67" width="40" height="22" rx="2" fill="#7ec8f7" />
      <rect x="30" y="93" width="60" height="4" rx="2" fill="#3a7abf" />
      <line x1="44" y1="73" x2="72" y2="73" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <line x1="44" y1="78" x2="64" y2="78" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <rect x="18" y="74" width="12" height="14" rx="2" fill="#6bcb77" />
      <line x1="22" y1="68" x2="22" y2="74" stroke="#ff6b6b" strokeWidth="2" strokeLinecap="round" />
      <line x1="25" y1="66" x2="25" y2="74" stroke="#ffd93d" strokeWidth="2" strokeLinecap="round" />
      <line x1="28" y1="67" x2="28" y2="74" stroke="#4a90d9" strokeWidth="2" strokeLinecap="round" />
      <rect x="52" y="40" width="16" height="22" rx="4" fill="#ffd93d" />
      <circle cx="60" cy="30" r="14" fill="#ffd5a0" />
      <path d="M46 28 Q46 16 60 16 Q74 16 74 28 Q74 20 60 18 Q48 18 46 28Z" fill="#8b4513" />
      <path d="M46 28 Q44 38 46 40" stroke="#8b4513" strokeWidth="4" strokeLinecap="round" fill="none" />
      <circle cx="46" cy="26" r="3" fill="#ff6b6b" />
      <circle cx="56" cy="30" r="1.5" fill="#333" />
      <circle cx="64" cy="30" r="1.5" fill="#333" />
      <path d="M56 35 Q60 38 64 35" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M68 46 Q78 38 82 32" stroke="#ffd5a0" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="82" cy="31" r="4" fill="#ffd5a0" />
      <text x="85" y="52" fontSize="10" fill="#ffd93d">✦</text>
      <text x="14" y="50" fontSize="8" fill="#ff6b6b">✦</text>
    </svg>
  ),
  teacher: (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="120" rx="12" fill="#f0fff4" />
      <rect x="15" y="18" width="90" height="58" rx="4" fill="#2d6a4f" />
      <rect x="18" y="21" width="84" height="52" rx="2" fill="#40916c" />
      <rect x="15" y="74" width="90" height="5" rx="2" fill="#a0522d" />
      <line x1="26" y1="35" x2="60" y2="35" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.7" />
      <line x1="26" y1="42" x2="50" y2="42" stroke="white" strokeWidth="1.5" strokeLinecap="round" opacity="0.5" />
      <text x="62" y="55" fontSize="14" fill="#ffd93d" opacity="0.9">✦</text>
      <rect x="14" y="90" width="18" height="10" rx="1" fill="#ff6b6b" />
      <rect x="16" y="88" width="18" height="10" rx="1" fill="#4a90d9" />
      <rect x="18" y="86" width="18" height="10" rx="1" fill="#6bcb77" />
      <circle cx="72" cy="91" r="7" fill="#ff6b6b" />
      <path d="M72 84 Q74 80 76 82" stroke="#8b4513" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M72 84 Q70 82 68 84" stroke="#6bcb77" strokeWidth="2" fill="none" strokeLinecap="round" />
      <rect x="50" y="50" width="20" height="28" rx="4" fill="#ffd93d" />
      <circle cx="60" cy="40" r="13" fill="#ffd5a0" />
      <path d="M47 38 Q47 27 60 27 Q73 27 73 38 Q73 30 60 28 Q49 28 47 38Z" fill="#8b4513" />
      <circle cx="60" cy="27" r="5" fill="#8b4513" />
      <circle cx="56" cy="40" r="1.5" fill="#333" />
      <circle cx="64" cy="40" r="1.5" fill="#333" />
      <path d="M56 45 Q60 48 64 45" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
      <path d="M70 55 Q82 48 88 38" stroke="#ffd5a0" strokeWidth="5" strokeLinecap="round" fill="none" />
      <circle cx="88" cy="37" r="4" fill="#ffd5a0" />
      <rect x="38" y="54" width="14" height="18" rx="2" fill="#4a90d9" />
      <line x1="41" y1="58" x2="49" y2="58" stroke="white" strokeWidth="1" opacity="0.6" />
      <line x1="41" y1="62" x2="49" y2="62" stroke="white" strokeWidth="1" opacity="0.4" />
    </svg>
  ),
  'school-admin': (
    <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      <rect width="120" height="120" rx="12" fill="#f0f0ff" />
      <rect x="60" y="40" width="50" height="50" rx="2" fill="#c8d8f0" />
      <rect x="60" y="30" width="50" height="15" rx="2" fill="#a0b8d8" />
      <polygon points="60,30 85,15 110,30" fill="#8090b8" />
      <line x1="85" y1="5" x2="85" y2="18" stroke="#666" strokeWidth="1.5" />
      <rect x="85" y="5" width="12" height="8" rx="1" fill="#ff6b6b" />
      <rect x="65" y="45" width="12" height="10" rx="1" fill="#7ec8f7" />
      <rect x="83" y="45" width="12" height="10" rx="1" fill="#7ec8f7" />
      <rect x="95" y="45" width="12" height="10" rx="1" fill="#7ec8f7" />
      <rect x="76" y="70" width="10" height="20" rx="2" fill="#a0522d" />
      <circle cx="84" cy="80" r="1.5" fill="#ffd93d" />
      <circle cx="64" cy="90" r="8" fill="#52b788" />
      <circle cx="72" cy="88" r="6" fill="#6bcb77" />
      <rect x="18" y="55" width="18" height="26" rx="4" fill="#74b0d4" />
      <path d="M27 55 L25 65 L27 70 L29 65 Z" fill="#ff6b6b" />
      <rect x="8" y="60" width="16" height="20" rx="2" fill="#4a4a6a" />
      <rect x="9" y="61" width="14" height="17" rx="1" fill="#7ec8f7" />
      <line x1="11" y1="65" x2="21" y2="65" stroke="white" strokeWidth="1" opacity="0.6" />
      <line x1="11" y1="68" x2="18" y2="68" stroke="white" strokeWidth="1" opacity="0.4" />
      <circle cx="27" cy="44" r="13" fill="#ffd5a0" />
      <path d="M14 42 Q14 31 27 31 Q40 31 40 42 Q40 34 27 32 Q16 32 14 42Z" fill="#8b6914" />
      <circle cx="23" cy="44" r="1.5" fill="#333" />
      <circle cx="31" cy="44" r="1.5" fill="#333" />
      <path d="M23 49 Q27 52 31 49" stroke="#333" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  ),
}

export default function SelectRolePage() {
  const t = useTranslations('roles')
  const [selected, setSelected] = useState<string | null>(null)
  const router = useRouter()

  const ROLES = [
    { id: 'student', label: t('student') },
    { id: 'teacher', label: t('teacher') },
    { id: 'school-admin', label: t('schoolAdmin') },
  ]

  function handleContinue() {
    if (!selected) return
    if (selected === 'student') {
      router.push('/signup')
    } else if (selected === 'teacher') {
      router.push('/teacher-signup')
    } else if (selected === 'school-admin') {
      router.push('/school-admin-signup')
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden"
      style={{
        background: 'linear-gradient(180deg, #c9d8f5 0%, #dce8ff 35%, #e8d5f5 65%, #d0c8e8 100%)',
      }}
    >
      {/* Decorative background (clouds, stars, confetti) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute rounded-full opacity-60" style={{ width: 260, height: 80, top: '8%', left: '-4%', background: 'rgba(255,255,255,0.7)', filter: 'blur(8px)' }} />
        <div className="absolute rounded-full opacity-50" style={{ width: 200, height: 60, top: '6%', left: '3%', background: 'rgba(255,255,255,0.8)', filter: 'blur(4px)' }} />
        <div className="absolute rounded-full opacity-55" style={{ width: 300, height: 90, top: '12%', right: '-5%', background: 'rgba(255,255,255,0.7)', filter: 'blur(8px)' }} />
        <div className="absolute rounded-full opacity-40" style={{ width: 500, height: 120, bottom: '8%', left: '-10%', background: 'rgba(255,255,255,0.6)', filter: 'blur(20px)' }} />
        {[
          { top: '5%', left: '12%', size: 16, color: '#ffd93d' },
          { top: '8%', left: '45%', size: 12, color: '#ffd93d' },
          { top: '6%', right: '18%', size: 14, color: '#ffd93d' },
        ].map((s, i) => (
          <span key={i} className="absolute" style={{ top: s.top, left: (s as {left?: string}).left, right: (s as {right?: string}).right }}>
            <svg width={s.size} height={s.size} viewBox="0 0 24 24">
              <path d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5Z" fill={s.color} />
            </svg>
          </span>
        ))}
      </div>

      {/* Card */}
      <div
        className="relative z-10 w-full max-w-2xl rounded-3xl p-8 sm:p-10"
        style={{
          background: 'rgba(255,255,255,0.55)',
          backdropFilter: 'blur(16px)',
          border: '1.5px solid rgba(255,255,255,0.7)',
          boxShadow: '0 8px 40px rgba(120,100,200,0.18)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-1">
          <div className="inline-flex items-center gap-1 text-3xl font-extrabold tracking-tight font-fredoka">
            {['K','i','n','d','e','r','C','o','d','e'].map((ch, i) => (
              <span key={i} style={{ color: ['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#8e24aa','#e53935','#fb8c00','#1e88e5','#43a047'][i] }}>{ch}</span>
            ))}
          </div>
          <h1 className="text-2xl font-bold text-gray-700 mt-1">{t('title')}</h1>
        </div>

        {/* Role Cards */}
        <div className="grid grid-cols-3 gap-4 mt-8">
          {ROLES.map((role) => {
            const isSelected = selected === role.id
            return (
              <button
                key={role.id}
                onClick={() => setSelected(role.id)}
                className="relative flex flex-col items-center rounded-2xl p-3 transition-all duration-200 cursor-pointer focus:outline-none"
                style={{
                  background: isSelected ? 'linear-gradient(160deg, #f0fff4 0%, #dcfce7 100%)' : 'rgba(255,255,255,0.8)',
                  border: isSelected ? '2.5px solid #4ade80' : '2px solid rgba(200,200,220,0.5)',
                  boxShadow: isSelected ? '0 4px 20px rgba(74,222,128,0.3)' : '0 2px 10px rgba(0,0,0,0.06)',
                  transform: isSelected ? 'translateY(-3px)' : 'none',
                }}
              >
                {isSelected && (
                  <div className="absolute -top-3 -right-3 w-7 h-7 rounded-full flex items-center justify-center z-10" style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 2px 8px rgba(34,197,94,0.4)' }}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                      <path d="M5 12L10 17L19 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                )}
                <span className="text-sm font-bold mb-2" style={{ color: isSelected ? '#166534' : '#6366f1' }}>{role.label}</span>
                <div className="w-24 h-24 rounded-xl overflow-hidden mb-2">{ILLUSTRATIONS[role.id]}</div>
                <span className="text-sm font-bold text-gray-700">{role.label}</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={handleContinue}
          disabled={!selected}
          className="mt-8 w-full py-4 rounded-2xl text-white text-xl font-bold transition-all duration-200"
          style={{
            background: selected ? 'linear-gradient(135deg, #4ade80 0%, #22c55e 50%, #16a34a 100%)' : 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
            boxShadow: selected ? '0 6px 24px rgba(34,197,94,0.45)' : 'none',
            cursor: selected ? 'pointer' : 'not-allowed',
          }}
        >
          {t('continue')}
        </button>
      </div>
    </div>
  )
}
