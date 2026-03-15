'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail, MessageSquare, Clock, ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What age group is KinderCode designed for?',
    a: 'KinderCode is designed for children aged 6–16 years old, with age-appropriate content and adaptive difficulty levels.',
  },
  {
    q: 'Is KinderCode free to use?',
    a: 'We offer a free tier with access to basic courses. Premium plans unlock advanced content, competitions, and detailed progress reports.',
  },
  {
    q: 'Can parents monitor their child\'s progress?',
    a: 'Yes! Parents get a dedicated dashboard with detailed reports on learning progress, time spent, and achievements.',
  },
  {
    q: 'What coding languages does KinderCode teach?',
    a: 'We start with visual block-based coding, then progress to Scratch, Python, HTML/CSS, and JavaScript as kids advance.',
  },
  {
    q: 'Is there a mobile app available?',
    a: 'Our platform is fully responsive and works on all devices. A dedicated mobile app is currently in development.',
  },
]

export default function ContactPage() {
  const t = useTranslations('contact')
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [sending, setSending] = useState(false)
  const [success, setSuccess] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json() as { success?: boolean; error?: string }
      if (!res.ok) throw new Error(data.error ?? 'Unknown error')
      setSuccess(true)
      setForm({ name: '', email: '', subject: '', message: '' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to send message. Please try again.'
      alert(msg)
    } finally {
      setSending(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <div
        className="py-16 px-6 text-center"
        style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}
      >
        <div className="max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-4 text-sm font-bold text-[#FFD93D]"
            style={{ background: 'rgba(255,217,61,0.15)', border: '1px solid rgba(255,217,61,0.3)' }}>
            <MessageSquare className="w-4 h-4" /> Get in Touch
          </div>
          <h1 className="font-fredoka text-4xl md:text-5xl font-bold text-white mb-4">{t('title')} 👋</h1>
          <p className="text-white/70 text-lg">{t('subtitle')}</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div>
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            {success ? (
              <div className="text-center py-8">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="font-fredoka text-2xl font-bold text-slate-800 mb-2">Thank you!</h3>
                <p className="text-slate-600">{t('success')}</p>
                <button
                  onClick={() => setSuccess(false)}
                  className="mt-6 px-6 py-2.5 rounded-xl font-semibold text-white transition-all hover:-translate-y-0.5"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('name')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('namePlaceholder')}
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#667eea]/40 focus:border-[#667eea] text-slate-800 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('emailField')}</label>
                  <input
                    type="email"
                    required
                    placeholder={t('emailPlaceholder')}
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#667eea]/40 focus:border-[#667eea] text-slate-800 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('subject')}</label>
                  <input
                    type="text"
                    required
                    placeholder={t('subjectPlaceholder')}
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#667eea]/40 focus:border-[#667eea] text-slate-800 text-sm transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">{t('message')}</label>
                  <textarea
                    required
                    rows={5}
                    placeholder={t('messagePlaceholder')}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#667eea]/40 focus:border-[#667eea] text-slate-800 text-sm transition-all resize-none"
                  />
                </div>
                <button
                  type="submit"
                  disabled={sending}
                  className="w-full py-3.5 rounded-xl font-bold text-white transition-all hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed"
                  style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
                >
                  {sending ? t('sending') : t('send')}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#667eea]/10 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#667eea]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Email</p>
                <p className="text-sm font-bold text-slate-800">support@kindercode.com</p>
              </div>
            </div>
            <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#27AE60]/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-[#27AE60]" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500">Response</p>
                <p className="text-sm font-bold text-slate-800">Within 24 hours</p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="font-fredoka text-2xl font-bold text-slate-800 mb-6">{t('faqTitle')} 🙋</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 flex-shrink-0 ml-3 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}
