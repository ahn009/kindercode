import { useTranslations } from 'next-intl'

const sections = [
  {
    emoji: '📚',
    title: 'What Information We Collect',
    content: [
      'Account information: name, email address, and password when you create an account.',
      'Profile data: grade level, country, preferred language, and learning preferences.',
      'Usage data: games played, courses completed, time spent, and progress milestones.',
      'Device information: browser type, operating system, and IP address for security purposes.',
    ],
  },
  {
    emoji: '🔒',
    title: 'How We Protect Your Data',
    content: [
      'All data is encrypted in transit using TLS/SSL and at rest using AES-256 encryption.',
      'We never sell your personal data to third parties.',
      'Access to personal information is strictly limited to authorized team members.',
      'Regular security audits and vulnerability assessments are conducted.',
      'You can request deletion of your account and all associated data at any time.',
    ],
  },
  {
    emoji: '👨‍👩‍👧',
    title: 'Parental Controls',
    content: [
      'Parents and guardians have full visibility into their child\'s activity and progress.',
      'Parental consent is required for children under 13 years of age.',
      'Parents can restrict content, set time limits, and review communication.',
      'We comply with COPPA (Children\'s Online Privacy Protection Act) and GDPR.',
    ],
  },
  {
    emoji: '🎮',
    title: 'Game Data and Progress',
    content: [
      'Learning progress and game scores are stored to personalize your experience.',
      'Achievement data helps us recommend appropriate difficulty levels.',
      'Progress reports are shared with parents/guardians if a family account is set up.',
      'You can export your learning data at any time from your account settings.',
    ],
  },
  {
    emoji: '🍪',
    title: 'Cookies and Tracking',
    content: [
      'We use essential cookies to keep you logged in and remember your preferences.',
      'Analytics cookies help us improve the platform (you can opt out).',
      'We do not use advertising cookies or track you across other websites.',
    ],
  },
  {
    emoji: '📧',
    title: 'Contact for Privacy Concerns',
    content: [
      'For any privacy-related questions, email us at privacy@kindercode.com.',
      'We respond to all privacy requests within 30 days.',
      'You have the right to access, correct, or delete your personal data.',
      'To exercise your rights, submit a request through our contact form.',
    ],
  },
]

export default function PrivacyPolicyPage() {
  const t = useTranslations('privacy')

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div
        className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <span className="text-5xl block mb-4">🔐</span>
          <h1 className="font-fredoka text-4xl md:text-5xl font-bold text-white mb-4">{t('title')}</h1>
          <p className="text-white/70">
            {t('lastUpdated')}: <strong className="text-white">March 15, 2026</strong>
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-[#FFD93D]/10 border border-[#FFD93D]/30 rounded-2xl p-6 mb-8">
          <p className="text-slate-700 leading-relaxed">
            At <strong>KinderCode</strong>, your child&apos;s privacy is our top priority. We are committed to
            protecting personal information and being transparent about how we use it. This policy explains
            what data we collect, how it is used, and the rights you have as a parent or guardian.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">
          {sections.map((section, i) => (
            <div key={i} className="bg-white rounded-3xl shadow-sm border border-slate-100 p-7">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">{section.emoji}</span>
                <h2 className="font-fredoka text-xl font-bold text-slate-800">{section.title}</h2>
              </div>
              <ul className="space-y-2">
                {section.content.map((item, j) => (
                  <li key={j} className="flex items-start gap-2 text-slate-600 text-sm leading-relaxed">
                    <span className="text-[#4A90E2] mt-0.5 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>This privacy policy may be updated periodically. We will notify you of significant changes via email.</p>
          <p className="mt-2">
            Questions? Contact us at{' '}
            <a href="mailto:privacy@kindercode.com" className="text-[#4A90E2] hover:underline font-semibold">
              privacy@kindercode.com
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
