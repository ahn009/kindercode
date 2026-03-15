import { useTranslations } from 'next-intl'

const sections = [
  {
    emoji: '⚖️',
    title: 'Eligibility',
    content: [
      'KinderCode is designed for children aged 6–16 years old.',
      'Children under 13 require verifiable parental consent to create an account.',
      'Parents or guardians are responsible for monitoring their child\'s use of the platform.',
      'By creating an account, you confirm that all information provided is accurate.',
    ],
  },
  {
    emoji: '🎮',
    title: 'Using KinderCode',
    content: [
      'You may use KinderCode for personal, non-commercial educational purposes.',
      'You may not copy, modify, or distribute our content without permission.',
      'Your account is personal and may not be shared with others.',
      'We reserve the right to update, modify, or discontinue features with notice.',
    ],
  },
  {
    emoji: '💰',
    title: 'Payments and Subscriptions',
    content: [
      'Free tier accounts have access to basic features with no payment required.',
      'Premium subscriptions are billed monthly or annually as selected at checkout.',
      'You may cancel your subscription at any time from your account settings.',
      'Refunds are available within 14 days of purchase if you are unsatisfied.',
      'We use secure payment processors and do not store credit card information.',
    ],
  },
  {
    emoji: '🚫',
    title: 'Rules for Kids',
    content: [
      'Be kind and respectful to other learners in community areas.',
      'Do not share personal information (address, phone number, school name) with others.',
      'Do not attempt to hack, cheat, or exploit the platform.',
      'Do not post inappropriate content in any community features.',
      'If you see something uncomfortable, tell a parent or use the report button.',
    ],
  },
  {
    emoji: '👤',
    title: 'Account Responsibilities',
    content: [
      'You are responsible for keeping your password secure.',
      'Notify us immediately if you suspect unauthorized access to your account.',
      'We may suspend accounts that violate these terms.',
      'Account data may be deleted after 12 months of inactivity with prior notice.',
    ],
  },
  {
    emoji: '⚠️',
    title: 'Safety Guidelines',
    content: [
      'Take regular breaks — we recommend no more than 1-2 hours of screen time for young children.',
      'Sit at a comfortable distance from the screen with good lighting.',
      'Use headphones at a safe volume level.',
      'Tell a trusted adult if you experience any discomfort while using the platform.',
    ],
  },
  {
    emoji: '📋',
    title: 'Intellectual Property',
    content: [
      'All KinderCode content, including courses, games, and branding, is owned by KinderCode.',
      'Code projects you create remain yours — you own your work.',
      'By sharing projects publicly, you grant KinderCode a license to display them on the platform.',
    ],
  },
]

export default function TermsPage() {
  const t = useTranslations('terms')

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div
        className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <span className="text-5xl block mb-4">📜</span>
          <h1 className="font-fredoka text-4xl md:text-5xl font-bold text-white mb-4">{t('title')}</h1>
          <p className="text-white/70">
            {t('lastUpdated')}: <strong className="text-white">March 15, 2026</strong>
          </p>
        </div>
      </div>

      {/* Intro */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <div className="bg-[#4A90E2]/10 border border-[#4A90E2]/30 rounded-2xl p-6 mb-8">
          <p className="text-slate-700 leading-relaxed">
            Welcome to <strong>KinderCode</strong>! These Terms of Service govern your use of our platform.
            By accessing or using KinderCode, you agree to these terms. Please read them carefully.
            If you are a parent setting up an account for your child, you agree to these terms on their behalf.
          </p>
        </div>

        {/* Parent Checklist */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-7 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">✅</span>
            <h2 className="font-fredoka text-xl font-bold text-slate-800">Parent/Guardian Checklist</h2>
          </div>
          <div className="space-y-3">
            {[
              'I have read and understand the Privacy Policy',
              'I consent to my child using KinderCode',
              'I will supervise my child\'s activity on the platform',
              'I understand the refund and cancellation policy',
              'I agree to the community rules and safety guidelines',
            ].map((item, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded accent-[#667eea]" />
                <span className="text-sm text-slate-600 group-hover:text-slate-800 transition-colors">{item}</span>
              </label>
            ))}
          </div>
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
                    <span className="text-[#667eea] mt-0.5 flex-shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Footer note */}
        <div className="mt-8 text-center text-slate-500 text-sm">
          <p>These terms may be updated. Continued use of KinderCode after changes constitutes acceptance.</p>
          <p className="mt-2">
            Questions? Contact us at{' '}
            <a href="mailto:legal@kindercode.com" className="text-[#4A90E2] hover:underline font-semibold">
              legal@kindercode.com
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}
