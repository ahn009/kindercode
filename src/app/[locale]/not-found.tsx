import { Link } from '@/i18n/navigation'

export default function NotFound() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-[#667eea] to-[#764ba2] flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="text-8xl mb-6 animate-bounce">🤖</div>
        <h1 className="font-fredoka text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="font-fredoka text-2xl font-bold text-white/90 mb-3">
          Oops! Page Not Found
        </h2>
        <p className="text-white/70 leading-relaxed mb-8">
          It looks like this page got lost in space! Don&apos;t worry, even the
          best coders make mistakes. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/"
            className="px-8 py-3 rounded-2xl font-bold text-white transition-all hover:-translate-y-1"
            style={{
              background: 'linear-gradient(135deg, #FF8C42 0%, #FFD93D 100%)',
              boxShadow: '0 6px 20px rgba(255,140,66,0.4)',
            }}
          >
            🏠 Go Home
          </Link>
          <Link
            href="/home"
            className="px-8 py-3 rounded-2xl font-bold text-white transition-all hover:-translate-y-1 hover:bg-white/20"
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: '1.5px solid rgba(255,255,255,0.3)',
            }}
          >
            🚀 Dashboard
          </Link>
        </div>

        {/* Fun coding decoration */}
        <div className="mt-12 bg-black/20 rounded-2xl p-4 text-left">
          <p className="text-white/40 text-xs font-mono mb-1">// Error log</p>
          <p className="text-[#FFD93D] font-mono text-sm">
            {'> '}<span className="text-white/70">PageNotFoundError:</span>
          </p>
          <p className="text-white/50 font-mono text-sm pl-4">
            The page you requested
          </p>
          <p className="text-white/50 font-mono text-sm pl-4">
            does not exist (yet! 🚧)
          </p>
        </div>
      </div>
    </main>
  )
}
