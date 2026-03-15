export default function DashboardLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 animate-pulse">
      {/* Header skeleton */}
      <div className="py-10 px-6 md:px-10" style={{ background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)' }}>
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20" />
            <div className="space-y-2">
              <div className="h-3 w-24 bg-white/20 rounded-full" />
              <div className="h-6 w-40 bg-white/30 rounded-full" />
            </div>
          </div>
          <div className="flex items-center gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-1">
                <div className="h-6 w-10 bg-white/20 rounded-full" />
                <div className="h-3 w-14 bg-white/10 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 md:px-10 py-8 space-y-8">
        {/* Daily challenge skeleton */}
        <div className="h-28 rounded-2xl bg-slate-200" />

        {/* Progress cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-28 shadow-sm border border-slate-100">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-slate-100" />
                <div className="space-y-1">
                  <div className="h-3 w-24 bg-slate-100 rounded-full" />
                  <div className="h-2 w-16 bg-slate-100 rounded-full" />
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>

        {/* Game categories skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-5 h-28 shadow-sm border border-slate-100 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-slate-100" />
              <div className="h-3 w-20 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>

        {/* Achievements skeleton */}
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white rounded-2xl p-4 h-24 shadow-sm border border-slate-100 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-slate-100" />
              <div className="h-2 w-12 bg-slate-100 rounded-full" />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
