'use client'

import { useEffect } from 'react'

/**
 * Sets lang and dir on <html> to match the active locale.
 *
 * The root layout renders <html suppressHydrationWarning> without a lang
 * attribute. This component runs immediately after hydration and applies
 * the correct attributes so screen readers and CSS :lang() selectors work.
 * It renders no DOM nodes of its own.
 */
export default function LocaleHtmlAttributes({
  locale,
  dir,
}: {
  locale: string
  dir: 'ltr' | 'rtl'
}) {
  useEffect(() => {
    document.documentElement.lang = locale
    document.documentElement.dir = dir
  }, [locale, dir])

  return null
}
