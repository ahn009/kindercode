'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Link, useRouter, usePathname } from '@/i18n/navigation'
import { Menu, X, Rocket, Globe, ChevronDown } from 'lucide-react'
import { SUPPORTED_LANGUAGES } from '@/lib/languages'

export default function Header() {
  const locale = useLocale()
  const t = useTranslations('nav')

  const navLinks = [
    // Removed home anchor tag
    { href: '/#how-it-works', label: t('howItWorks') },
    { href: '/#learning', label: t('learningMethods') },
    { href: '/#skills', label: t('skillPaths') },
    { href: '/#competitions', label: t('competitions') },
    { href: '/#schools', label: t('forSchools') },
    { href: '/#pricing', label: t('pricing') },
    { href: '/#community', label: t('community') },
  ]
  const router = useRouter()
  const pathname = usePathname()

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef<HTMLDivElement>(null)

  const currentLang =
    SUPPORTED_LANGUAGES.find((l) => l.code === locale) ?? SUPPORTED_LANGUAGES[0]

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function switchLocale(code: string) {
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('kinder-locale', code)
      document.cookie = `NEXT_LOCALE=${code}; path=/; max-age=31536000`
    }
    router.replace(pathname, { locale: code })
    setLangOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-[rgba(30,60,114,0.95)] backdrop-blur-xl shadow-lg border-b border-white/10">
      <div className="container-kinder">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Rocket className="w-8 h-8 text-[#FFD93D] animate-float" />
            <span className="font-fredoka text-2xl font-bold bg-gradient-to-r from-[#FFD93D] to-[#FF8C42] bg-clip-text text-transparent">
              KinderCode
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href as '/'}
                className="relative font-bold text-sm transition-all duration-300 py-1 text-white/90 hover:text-[#FFD93D] group"
              >
                {link.label}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-[#FFD93D] to-[#FF6B6B] rounded-full transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Language Selector */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-sm font-semibold transition-all"
                aria-label="Select language"
                aria-expanded={langOpen}
              >
                <Globe className="w-4 h-4 opacity-80" />
                <span>{currentLang.flag}</span>
                <span className="uppercase">{currentLang.code}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 opacity-70 transition-transform ${langOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {langOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 rounded-2xl shadow-2xl border border-white/20 overflow-hidden z-50"
                  style={{ background: 'rgba(30,60,114,0.98)', backdropFilter: 'blur(16px)' }}
                  role="listbox"
                  aria-label="Language options"
                >
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => switchLocale(lang.code)}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm font-semibold transition-colors ${
                        locale === lang.code
                          ? 'bg-white/20 text-[#FFD93D]'
                          : 'text-white/90 hover:bg-white/10'
                      }`}
                      role="option"
                      aria-selected={locale === lang.code}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span>{lang.name}</span>
                      {lang.dir === 'rtl' && (
                        <span className="ml-auto text-xs opacity-50">RTL</span>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/login"
              className="btn-kinder btn-kinder-secondary btn-kinder-sm bg-transparent text-white border-white/50 hover:bg-white/20"
            >
              {t('login')}
            </Link>

            <Link
              href="/signup"
              className="btn-kinder btn-kinder-sm text-white transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
            >
              {t('getStarted')} 🚀
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav className="lg:hidden pb-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href as '/'}
                  className="font-bold text-sm transition-all duration-300 py-2 text-white/90 hover:text-[#FFD93D]"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-white/20">
                {/* Mobile Language Grid */}
                <p className="text-white/60 text-xs font-semibold uppercase tracking-wider">
                  Language
                </p>
                <div className="grid grid-cols-5 gap-2">
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        switchLocale(lang.code)
                        setMobileMenuOpen(false)
                      }}
                      title={lang.name}
                      className={`flex flex-col items-center gap-0.5 p-2 rounded-xl text-xs font-bold transition-all ${
                        locale === lang.code
                          ? 'bg-[#FFD93D]/20 text-[#FFD93D] ring-1 ring-[#FFD93D]/50'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <span className="text-base">{lang.flag}</span>
                      <span className="uppercase">{lang.code}</span>
                    </button>
                  ))}
                </div>
                <Link
                  href="/login"
                  className="btn-kinder btn-kinder-secondary bg-transparent text-white border-white/50 text-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('login')}
                </Link>
                <Link
                  href="/signup"
                  className="btn-kinder text-white text-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all"
                  style={{ background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {t('getStarted')} 🚀
                </Link>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  )
}