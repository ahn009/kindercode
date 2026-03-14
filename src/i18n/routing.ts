import { defineRouting } from 'next-intl/routing'

export const routing = defineRouting({
  locales: ['en', 'es', 'zh', 'hi', 'ur', 'ko', 'pt', 'it', 'ru', 'fr'],
  defaultLocale: 'en',
})
