'use client'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts'

interface ProgressChartProps {
  data: { day: string; points: number }[]
  totalPoints: number
  weeklyStreak: number
}

const BAR_COLORS = [
  '#93c5fd', '#93c5fd', '#93c5fd', '#93c5fd',
  '#60a5fa', '#4a90e2', '#52b788', '#a3e635', '#fbbf24',
]

export default function ProgressChart({ data, totalPoints, weeklyStreak }: ProgressChartProps) {
  return (
    <div className="flex flex-col gap-2">
      {/* Total points */}
      <div className="flex items-baseline gap-2 mb-1">
        <span className="text-2xl font-extrabold text-gray-800">
          {totalPoints.toLocaleString()}
        </span>
        <span className="text-xs text-gray-400">0+</span>
      </div>

      {/* Bar chart */}
      <ResponsiveContainer width="100%" height={130}>
        <BarChart data={data} barSize={18} margin={{ top: 4, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="rgba(200,210,240,0.4)" />
          <XAxis
            dataKey="day"
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af' }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => v >= 1000 ? `${v / 1000}k` : String(v)}
          />
          <Tooltip
            cursor={{ fill: 'rgba(74,144,226,0.08)' }}
            contentStyle={{
              borderRadius: 8,
              border: '1px solid rgba(200,210,240,0.5)',
              fontSize: 12,
              background: 'rgba(255,255,255,0.95)',
            }}
          />
          <Bar dataKey="points" radius={[4, 4, 0, 0]}>
            {data.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={BAR_COLORS[index % BAR_COLORS.length]}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      {/* Footer stats */}
      <div
        className="flex items-center justify-between pt-2"
        style={{ borderTop: '1px solid rgba(200,210,240,0.4)' }}
      >
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-amber-400" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" />
          </svg>
          <span className="text-xs font-bold text-gray-700">
            {weeklyStreak} Days Weekly Streak
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-green-500" viewBox="0 0 24 24" fill="none">
            <path
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="text-xs font-bold text-gray-700">
            {totalPoints.toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  )
}
