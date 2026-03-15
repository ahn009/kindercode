export default function LocaleLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1e3c72] to-[#2d3748]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-4 border-[#FFD93D] border-t-transparent animate-spin" />
        <p className="text-white/60 font-semibold text-sm">Loading…</p>
      </div>
    </div>
  )
}
