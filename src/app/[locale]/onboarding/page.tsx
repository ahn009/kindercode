'use client'

import { useState, Suspense } from 'react'
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { useRouter } from '@/i18n/navigation'
import { CheckCircle } from 'lucide-react'

const AVATARS = ['🦊', '🐼', '🦁', '🐸', '🤖', '🦋', '🐙', '🦄']

const LEARNING_STYLES = [
  { id: 'story', emoji: '📖', label: 'Story Based' },
  { id: 'game', emoji: '🎮', label: 'Game Based' },
  { id: 'card', emoji: '🃏', label: 'Card Based' },
  { id: 'puzzle', emoji: '🧩', label: 'Puzzle Based' },
]

function OnboardingContent() {
  const t = useTranslations('onboarding')
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') ?? 'student'

  const [step, setStep] = useState(1)
  const [avatar, setAvatar] = useState('')
  const [learningStyle, setLearningStyle] = useState('')
  const [goals, setGoals] = useState<string[]>([])
  const [schoolType, setSchoolType] = useState('')

  const totalSteps = 5

  function toggleGoal(goal: string) {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal],
    )
  }

  function handleFinish() {
    router.push('/')
  }

  const stepTitles = [
    t('step1Title'),
    t('step2Title'),
    t('step3Title'),
    t('step4Title'),
    t('step5Title'),
  ]

  const stepSubtitles = [
    t('step1Subtitle'),
    t('step2Subtitle'),
    t('step3Subtitle'),
    t('step4Subtitle'),
    t('step5Subtitle'),
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-[30px] p-8 shadow-2xl border border-white/30">
        {/* Progress bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-indigo-600">
              Step {step} of {totalSteps}
            </span>
            <span className="text-sm text-gray-400">
              {Math.round((step / totalSteps) * 100)}%
            </span>
          </div>
          <div className="h-2 bg-indigo-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${(step / totalSteps) * 100}%` }}
            />
          </div>
          {/* Step dots */}
          <div className="flex justify-between mt-3">
            {Array.from({ length: totalSteps }).map((_, i) => (
              <div
                key={i}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  i + 1 <= step
                    ? 'bg-indigo-500 scale-110'
                    : 'bg-indigo-100'
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
            {stepTitles[step - 1]}
          </h1>
          <p className="text-gray-500">{stepSubtitles[step - 1]}</p>
        </div>

        {/* Step content */}
        <div className="min-h-[200px]">
          {/* Step 1: Welcome + role confirmation */}
          {step === 1 && (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-600 leading-relaxed">
                {t('confirmRole')} <span className="font-bold text-indigo-600 capitalize">{role.replace('-', ' ')}</span>
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

          {/* Step 2: Profile — avatar + grade (students) or school type (teachers) */}
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

              {role === 'teacher' || role === 'school-admin' ? (
                <div>
                  <p className="text-sm font-semibold text-gray-700 mb-3">{t('school')}</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'school', label: t('schoolOption'), emoji: '🏫' },
                      { id: 'freelancer', label: t('freelancerOption'), emoji: '💻' },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setSchoolType(opt.id)}
                        className={`p-4 rounded-2xl border-2 transition-all text-left ${
                          schoolType === opt.id
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-indigo-300'
                        }`}
                      >
                        <div className="text-2xl mb-1">{opt.emoji}</div>
                        <div className="text-sm font-semibold text-gray-700">{opt.label}</div>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-2 block">{t('grade')}</label>
                  <select className="w-full px-4 py-3 border-2 border-indigo-100 rounded-2xl text-gray-800 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-white">
                    <option value="">Select grade</option>
                    {['Kindergarten','Grade 1','Grade 2','Grade 3','Grade 4','Grade 5','Grade 6','Grade 7','Grade 8'].map((g) => (
                      <option key={g}>{g}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Learning style */}
          {step === 3 && (
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

          {/* Step 4: Goals */}
          {step === 4 && (
            <div className="space-y-3">
              {[
                { id: 'create', label: t('goalCreate'), emoji: '🎮' },
                { id: 'compete', label: t('goalCompete'), emoji: '🏆' },
                { id: 'learn', label: t('goalLearn'), emoji: '📚' },
                { id: 'teach', label: t('goalTeach'), emoji: '👩‍🏫' },
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

          {/* Step 5: Complete */}
          {step === 5 && (
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🚀</div>
              <div className="space-y-2">
                <p className="text-gray-600">Your selected avatar: <span className="text-2xl">{avatar || '🤖'}</span></p>
                <p className="text-gray-600">Learning style: <span className="font-bold text-indigo-600 capitalize">{learningStyle || 'Not set'}</span></p>
                {goals.length > 0 && (
                  <p className="text-gray-600">Goals: <span className="font-bold text-indigo-600">{goals.length} selected</span></p>
                )}
              </div>
              <div className="grid grid-cols-3 gap-3 mt-4">
                {['🎯 Goals Set', '✅ Profile Ready', '🌟 Let\'s Code'].map((text) => (
                  <div key={text} className="bg-green-50 rounded-2xl p-3 text-center text-xs font-semibold text-green-700">
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
              className="flex-1 py-3 border-2 border-indigo-200 rounded-2xl text-indigo-600 font-semibold hover:bg-indigo-50 transition-all"
            >
              {t('back')}
            </button>
          )}

          {step < totalSteps ? (
            <>
              {step === 4 && (
                <button
                  onClick={() => setStep((s) => s + 1)}
                  className="py-3 px-5 border-2 border-gray-200 rounded-2xl text-gray-500 font-semibold hover:bg-gray-50 transition-all"
                >
                  {t('skip')}
                </button>
              )}
              <button
                onClick={() => setStep((s) => s + 1)}
                className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all"
                style={{ boxShadow: '0 4px 15px rgba(99,102,241,0.4)' }}
              >
                {t('next')}
              </button>
            </>
          ) : (
            <button
              onClick={handleFinish}
              className="flex-1 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-2xl font-bold hover:shadow-xl hover:-translate-y-0.5 transition-all"
              style={{ boxShadow: '0 4px 15px rgba(34,197,94,0.4)' }}
            >
              {t('finish')}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default function OnboardingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center"><div className="text-white text-xl">Loading…</div></div>}>
      <OnboardingContent />
    </Suspense>
  )
}
