export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', flag: '🇺🇸', dir: 'ltr' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸', dir: 'ltr' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳', dir: 'ltr' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳', dir: 'ltr' },
  { code: 'ur', name: 'Urdu', flag: '🇵🇰', dir: 'rtl' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷', dir: 'ltr' },
  { code: 'pt', name: 'Portuguese', flag: '🇵🇹', dir: 'ltr' },
  { code: 'it', name: 'Italian', flag: '🇮🇹', dir: 'ltr' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺', dir: 'ltr' },
  { code: 'fr', name: 'French', flag: '🇫🇷', dir: 'ltr' },
] as const

export type SupportedLocale = (typeof SUPPORTED_LANGUAGES)[number]['code']
