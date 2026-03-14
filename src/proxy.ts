import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Match all paths except static assets and Next.js internals
    '/((?!_next|_vercel|api|favicon\\.ico|images|.*\\..*).*)',
  ],
}
