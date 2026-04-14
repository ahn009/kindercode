'use client'

import { useState } from 'react'
import { ChevronLeft, Map } from 'lucide-react'
import { useRouter } from '@/i18n/navigation'

// ── Tech logo SVGs ─────────────────────────────────────────────────────────
function Html5Logo() {
  return (
    <svg viewBox="0 0 48 54" width="44" height="44" aria-hidden>
      <path d="M4 2h40L40.5 44 24 49 7.5 44Z" fill="#E44D26"/>
      <path d="M24 5.5v39.8l13.2-3.7L40 5.5Z" fill="#F16529"/>
      <path fill="white" d="M13 15h11v5.2H13zm.5 8h16.3l-.6 6.2-5.2 1.5-5.2-1.5-.4-4H13l.8 10 10.2 2.8 10.2-2.8 1.4-15.2H13.5z"/>
      <path fill="#EBEBEB" d="M24 15v5.2h10.8l-.4 4.5L24 26.2v5.2l9.5-2.6 1.3-13.8z"/>
    </svg>
  )
}

function ReactLogo() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden>
      <circle cx="24" cy="24" r="5" fill="#61DAFB"/>
      <ellipse cx="24" cy="24" rx="21" ry="8.5" fill="none" stroke="#61DAFB" strokeWidth="2.2"/>
      <ellipse cx="24" cy="24" rx="21" ry="8.5" fill="none" stroke="#61DAFB" strokeWidth="2.2" transform="rotate(60 24 24)"/>
      <ellipse cx="24" cy="24" rx="21" ry="8.5" fill="none" stroke="#61DAFB" strokeWidth="2.2" transform="rotate(120 24 24)"/>
    </svg>
  )
}

function GamepadLogo() {
  return (
    <svg viewBox="0 0 56 40" width="50" height="36" aria-hidden>
      <rect x="4" y="6" width="48" height="28" rx="14" fill="#7C3AED"/>
      <rect x="4" y="6" width="48" height="28" rx="14" fill="url(#gpad)" opacity="0.9"/>
      <defs>
        <linearGradient id="gpad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8B5CF6"/>
          <stop offset="100%" stopColor="#4F46E5"/>
        </linearGradient>
      </defs>
      {/* D-pad */}
      <rect x="14" y="16" width="4" height="12" rx="1" fill="white" opacity="0.9"/>
      <rect x="11" y="19" width="10" height="4" rx="1" fill="white" opacity="0.9"/>
      {/* Buttons */}
      <circle cx="38" cy="17" r="3" fill="#EC4899"/>
      <circle cx="44" cy="22" r="3" fill="#10B981"/>
      <circle cx="38" cy="27" r="3" fill="#F59E0B"/>
      <circle cx="32" cy="22" r="3" fill="#6366F1"/>
      {/* Analog sticks */}
      <circle cx="20" cy="30" r="4" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.5"/>
      <circle cx="34" cy="30" r="4" fill="rgba(255,255,255,0.25)" stroke="white" strokeWidth="1.5"/>
    </svg>
  )
}

function BrainLogo() {
  return (
    <svg viewBox="0 0 48 48" width="44" height="44" aria-hidden>
      {/* Neural network */}
      <circle cx="8"  cy="14" r="4.5" fill="#FCD34D"/>
      <circle cx="8"  cy="34" r="4.5" fill="#FCD34D"/>
      <circle cx="24" cy="8"  r="4.5" fill="#FBBF24"/>
      <circle cx="24" cy="24" r="4.5" fill="#FBBF24"/>
      <circle cx="24" cy="40" r="4.5" fill="#FBBF24"/>
      <circle cx="40" cy="18" r="4.5" fill="#F59E0B"/>
      <circle cx="40" cy="30" r="4.5" fill="#F59E0B"/>
      {/* Connections */}
      <line x1="12" y1="14" x2="19.5" y2="9"  stroke="#FDE68A" strokeWidth="1.8" strokeOpacity="0.7"/>
      <line x1="12" y1="14" x2="19.5" y2="24" stroke="#FDE68A" strokeWidth="1.8" strokeOpacity="0.7"/>
      <line x1="12" y1="34" x2="19.5" y2="24" stroke="#FDE68A" strokeWidth="1.8" strokeOpacity="0.7"/>
      <line x1="12" y1="34" x2="19.5" y2="40" stroke="#FDE68A" strokeWidth="1.8" strokeOpacity="0.7"/>
      <line x1="28.5" y1="9"  x2="35.5" y2="18" stroke="#FDE68A" strokeWidth="1.8" strokeOpacity="0.7"/>
      <line x1="28.5" y1="24" x2="35.5" y2="18" stroke="#FDE68A" strokeWidth="1.8" strokeOpacity="0.7"/>
      <line x1="28.5" y1="24" x2="35.5" y2="30" stroke="#FDE68A" strokeWidth="1.8" strokeOpacity="0.7"/>
      <line x1="28.5" y1="40" x2="35.5" y2="30" stroke="#FDE68A" strokeWidth="1.8" strokeOpacity="0.7"/>
    </svg>
  )
}

type TechId = 'web' | 'app' | 'game' | 'ai'

// ── STEP 1 ─────────────────────────────────────────────────────────────────
const TECHNOLOGIES: {
  id: TechId; title: string; desc: string
  gradient: string; glow: string; Logo: () => JSX.Element
}[] = [
  { id: 'web',  title: 'Web Dev',  desc: 'Build awesome websites!',  gradient: 'linear-gradient(135deg,#6366f1 0%,#a855f7 100%)', glow: 'rgba(99,102,241,0.55)',  Logo: Html5Logo },
  { id: 'app',  title: 'App Dev',  desc: 'Create mobile apps!',      gradient: 'linear-gradient(135deg,#ec4899 0%,#f97316 100%)', glow: 'rgba(236,72,153,0.55)',  Logo: ReactLogo },
  { id: 'game', title: 'Game Dev', desc: 'Build your own games!',    gradient: 'linear-gradient(135deg,#10b981 0%,#06b6d4 100%)', glow: 'rgba(16,185,129,0.55)', Logo: GamepadLogo },
  { id: 'ai',   title: 'AI & ML',  desc: 'Make smart programs!',     gradient: 'linear-gradient(135deg,#f59e0b 0%,#ef4444 100%)', glow: 'rgba(245,158,11,0.55)',  Logo: BrainLogo },
]

// ── STEP 2 ─────────────────────────────────────────────────────────────────
const CHIP_COLORS = [
  { bg: 'rgba(99,102,241,0.18)',  border: 'rgba(99,102,241,0.45)',  text: '#a5b4fc' },
  { bg: 'rgba(236,72,153,0.18)', border: 'rgba(236,72,153,0.45)', text: '#f9a8d4' },
  { bg: 'rgba(16,185,129,0.18)', border: 'rgba(16,185,129,0.45)', text: '#6ee7b7' },
  { bg: 'rgba(245,158,11,0.18)', border: 'rgba(245,158,11,0.45)', text: '#fde68a' },
  { bg: 'rgba(139,92,246,0.18)', border: 'rgba(139,92,246,0.45)', text: '#c4b5fd' },
]

type Topic = { key: string; label: string; desc: string }

const TOPICS: Record<TechId, Topic[]> = {
  web: [
    { key: 'html-css',   label: 'HTML & CSS',   desc: 'Structure & style the web' },
    { key: 'javascript', label: 'JavaScript',    desc: 'Make the web interactive' },
    { key: 'react',      label: 'React',         desc: 'Build modern UI components' },
    { key: 'backend',    label: 'Backend',       desc: 'Servers, APIs & databases' },
    { key: 'fullstack',  label: 'Full Stack',    desc: 'End-to-end web development' },
  ],
  app: [
    { key: 'ios',          label: 'iOS Development',     desc: 'Build apps for iPhone & iPad' },
    { key: 'android',      label: 'Android Development', desc: 'Build apps for Android' },
    { key: 'react-native', label: 'React Native',        desc: 'Cross-platform mobile apps' },
    { key: 'flutter',      label: 'Flutter',             desc: 'Beautiful multi-platform apps' },
  ],
  game: [
    { key: 'unity',     label: 'Unity',      desc: '2D & 3D game development' },
    { key: 'godot',     label: 'Godot',      desc: 'Open-source game engine' },
    { key: 'pygame',    label: 'Pygame',     desc: 'Build games with Python' },
    { key: 'web-games', label: 'Web Games',  desc: 'Browser-based game dev' },
  ],
  ai: [
    { key: 'python-basics',    label: 'Python Fundamentals', desc: 'The language of AI' },
    { key: 'ml-basics',        label: 'Machine Learning',    desc: 'Teach machines to learn' },
    { key: 'deep-learning',    label: 'Deep Learning',       desc: 'Neural networks & AI' },
    { key: 'computer-vision',  label: 'Computer Vision',     desc: 'Teach AI to see' },
  ],
}

// ── STEP 3 ─────────────────────────────────────────────────────────────────
type Lang = { key: string; label: string; icon: string }
type RoadmapItem = { emoji: string; label: string; desc: string }

const LANGUAGES: Record<string, Lang[]> = {
  'html-css':       [{ key: 'html5',   label: 'HTML5 + CSS3',        icon: '🏗️' }],
  javascript:       [{ key: 'js',      label: 'JavaScript',          icon: '🟡' }, { key: 'ts', label: 'TypeScript', icon: '🔷' }],
  react:            [{ key: 'rjs',     label: 'React + JavaScript',  icon: '⚛️' }, { key: 'rts', label: 'React + TypeScript', icon: '⚛️' }],
  backend:          [{ key: 'node',    label: 'Node.js',             icon: '🟢' }, { key: 'dj', label: 'Python / Django', icon: '🐍' }, { key: 'fa', label: 'FastAPI', icon: '🐍' }],
  fullstack:        [{ key: 'mern',    label: 'MERN Stack',          icon: '⚡' }, { key: 'next', label: 'Next.js', icon: '▲' }],
  ios:              [{ key: 'swift',   label: 'Swift',               icon: '🍎' }],
  android:          [{ key: 'kotlin',  label: 'Kotlin',              icon: '🟣' }, { key: 'java', label: 'Java', icon: '☕' }],
  'react-native':   [{ key: 'rnjs',    label: 'JavaScript',          icon: '🟡' }, { key: 'rnts', label: 'TypeScript', icon: '🔷' }],
  flutter:          [{ key: 'dart',    label: 'Dart',                icon: '🎯' }],
  unity:            [{ key: 'cs',      label: 'C#',                  icon: '💜' }],
  godot:            [{ key: 'gds',     label: 'GDScript',            icon: '🕹️' }, { key: 'csg', label: 'C#', icon: '💜' }],
  pygame:           [{ key: 'py',      label: 'Python',              icon: '🐍' }],
  'web-games':      [{ key: 'jsw',     label: 'JavaScript',          icon: '🟡' }, { key: 'tsw', label: 'TypeScript', icon: '🔷' }],
  'python-basics':  [{ key: 'py3',     label: 'Python 3',            icon: '🐍' }],
  'ml-basics':      [{ key: 'skl',     label: 'Python + scikit-learn', icon: '🧠' }],
  'deep-learning':  [{ key: 'pt',      label: 'Python + PyTorch',    icon: '🔥' }, { key: 'tf', label: 'TensorFlow', icon: '🧡' }],
  'computer-vision':[{ key: 'cv',      label: 'Python + OpenCV',     icon: '👁️' }],
}

const ROADMAPS: Record<string, RoadmapItem[]> = {
  'html-css': [
    { emoji:'🏗️', label:'HTML Structure',   desc:'Tags, elements, semantic HTML' },
    { emoji:'🎨', label:'CSS Styling',       desc:'Colors, fonts, the box model' },
    { emoji:'📐', label:'Layouts',           desc:'Flexbox, Grid, positioning' },
    { emoji:'📱', label:'Responsive Design', desc:'Works on any screen size!' },
    { emoji:'✨', label:'Animations',        desc:'Transitions & keyframes' },
    { emoji:'🚀', label:'Build a Website!',  desc:'Your very first project' },
  ],
  javascript: [
    { emoji:'📦', label:'JS Fundamentals',   desc:'Variables, loops, functions' },
    { emoji:'🖱️', label:'DOM & Events',      desc:'Click buttons, update pages' },
    { emoji:'⏳', label:'Async JavaScript',  desc:'Promises and fetch API' },
    { emoji:'✨', label:'ES6+ Features',     desc:'Modern JS syntax' },
    { emoji:'🏛️', label:'OOP Patterns',     desc:'Classes & design patterns' },
    { emoji:'🚀', label:'Build a Web App!',  desc:'Interactive web application' },
  ],
  react: [
    { emoji:'⚛️', label:'React Basics',      desc:'Components, JSX, rendering' },
    { emoji:'💾', label:'State & Props',      desc:'useState and data flow' },
    { emoji:'🪝', label:'Hooks',             desc:'useEffect, useContext' },
    { emoji:'🗺️', label:'Routing',           desc:'Pages and navigation' },
    { emoji:'🏗️', label:'State Management', desc:'Context API, Zustand' },
    { emoji:'🚀', label:'Build a React App!',desc:'Full React application' },
  ],
  backend: [
    { emoji:'🌐', label:'HTTP & REST',        desc:'Requests, responses, REST' },
    { emoji:'🛣️', label:'Routing & Middleware',desc:'Route handlers' },
    { emoji:'🗄️', label:'Databases',         desc:'SQL, PostgreSQL, MongoDB' },
    { emoji:'🔐', label:'Authentication',     desc:'JWT, sessions, OAuth' },
    { emoji:'☁️', label:'Deployment',         desc:'Cloud and CI/CD basics' },
    { emoji:'🚀', label:'Ship a REST API!',   desc:'Build and deploy' },
  ],
  unity: [
    { emoji:'🖥️', label:'Unity Interface',    desc:'Editor and inspector' },
    { emoji:'💻', label:'C# Scripting',        desc:'Code your game logic' },
    { emoji:'🌍', label:'Physics & Collisions',desc:'Gravity and triggers' },
    { emoji:'🎭', label:'2D Mechanics',        desc:'Sprites and animation' },
    { emoji:'🔊', label:'UI & Audio',          desc:'Buttons, menus, sound' },
    { emoji:'🎮', label:'Publish Your Game!',  desc:'Share with the world' },
  ],
  'python-basics': [
    { emoji:'🐣', label:'Python Syntax',       desc:'Variables, loops, if/else' },
    { emoji:'🔧', label:'Functions & Modules', desc:'Organize your code' },
    { emoji:'📦', label:'Data Structures',     desc:'Lists, dicts, tuples' },
    { emoji:'🏛️', label:'OOP',                desc:'Classes and objects' },
    { emoji:'🌐', label:'File I/O & APIs',     desc:'Read files, fetch data' },
    { emoji:'🚀', label:'Build a Program!',    desc:'Your first Python app' },
  ],
  'ml-basics': [
    { emoji:'📊', label:'NumPy & Pandas',      desc:'Work with real data' },
    { emoji:'📈', label:'Data Visualization',  desc:'Charts and graphs' },
    { emoji:'🧠', label:'Supervised Learning', desc:'Train your first model' },
    { emoji:'📏', label:'Model Evaluation',    desc:'Is your model good?' },
    { emoji:'🌳', label:'Advanced Algorithms', desc:'Decision trees, SVM' },
    { emoji:'🚀', label:'Deploy an ML Model!', desc:'Share your AI with the world!' },
  ],
}

const DEFAULT_ROADMAP: RoadmapItem[] = [
  { emoji:'🌱', label:'Fundamentals',    desc:'Core concepts and syntax' },
  { emoji:'🔧', label:'Core Features',   desc:'Key tools and patterns' },
  { emoji:'🏗️', label:'Build Projects', desc:'Apply skills in real scenarios' },
  { emoji:'⚡', label:'Advanced Topics', desc:'Architecture and optimization' },
  { emoji:'🚀', label:'Final Project!',  desc:'Build and share something real' },
]

// ── STEP 4 ─────────────────────────────────────────────────────────────────
const LEARNING_METHODS = [
  { key:'story',  emoji:'📖', title:'Story Based Coding',  desc:'Learn through interactive stories and adventures', gradient:'linear-gradient(135deg,#6366f1 0%,#8b5cf6 100%)', glow:'rgba(99,102,241,0.45)' },
  { key:'age',    emoji:'🎂', title:'Age Based Coding',    desc:'Curriculum tailored to your age and skill level',  gradient:'linear-gradient(135deg,#ec4899 0%,#f472b6 100%)', glow:'rgba(236,72,153,0.45)' },
  { key:'card',   emoji:'🃏', title:'Card Based Coding',   desc:'Hands-on coding cards for fun learning',           gradient:'linear-gradient(135deg,#f59e0b 0%,#f97316 100%)', glow:'rgba(245,158,11,0.45)' },
  { key:'game',   emoji:'🎮', title:'Game Based Coding',   desc:'Create games while you learn to code!',            gradient:'linear-gradient(135deg,#10b981 0%,#06b6d4 100%)', glow:'rgba(16,185,129,0.45)' },
  { key:'puzzle', emoji:'🧩', title:'Puzzle Based Coding', desc:'Solve puzzles to unlock brand-new skills!',        gradient:'linear-gradient(135deg,#8b5cf6 0%,#ec4899 100%)', glow:'rgba(139,92,246,0.45)' },
]

// ── Step progress indicator ─────────────────────────────────────────────────
const STEP_COLORS = ['#818cf8','#f472b6','#fbbf24','#34d399']
const STEP_LABELS = ['Tech','Topic','Language','Learn!']

function StepBar({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center gap-1 mb-10">
      {[1,2,3,4].map((s) => (
        <div key={s} className="flex items-center gap-1">
          <div className="flex flex-col items-center gap-1">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-extrabold transition-all duration-300"
              style={
                s === step
                  ? { background: `linear-gradient(135deg,${STEP_COLORS[s-1]},${STEP_COLORS[s % 4]})`, color:'#fff', boxShadow:`0 0 18px ${STEP_COLORS[s-1]}99` }
                  : s < step
                  ? { background: STEP_COLORS[s-1]+'33', color: STEP_COLORS[s-1], border:`1.5px solid ${STEP_COLORS[s-1]}66` }
                  : { background:'rgba(255,255,255,0.06)', color:'rgba(255,255,255,0.2)', border:'1.5px solid rgba(255,255,255,0.08)' }
              }
            >
              {s < step ? '✓' : s}
            </div>
            <span className="text-[10px] font-bold hidden sm:block" style={{ color: s <= step ? STEP_COLORS[s-1] : 'rgba(255,255,255,0.2)' }}>
              {STEP_LABELS[s-1]}
            </span>
          </div>
          {s < 4 && (
            <div className="w-8 sm:w-12 h-px mb-4 transition-all duration-500" style={{ background: s < step ? STEP_COLORS[s-1]+'55' : 'rgba(255,255,255,0.08)' }} />
          )}
        </div>
      ))}
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function ChooseSkillPathPage() {
  const router = useRouter()
  const [step, setStep]   = useState(1)
  const [tech, setTech]   = useState<TechId | null>(null)
  const [topic, setTopic] = useState<Topic | null>(null)
  const [lang, setLang]   = useState<string | null>(null)
  const [comingSoon, setComingSoon] = useState(false)

  const techData = tech ? TECHNOLOGIES.find((t) => t.id === tech) : null

  function pickTech(id: TechId) {
    setTech(id); setTopic(null); setLang(null); setStep(2)
    if (typeof window !== 'undefined') localStorage.setItem('kindercode_tech', id)
  }

  function pickTopic(t: Topic) {
    setTopic(t)
    const langs = LANGUAGES[t.key] ?? []
    setLang(langs.length <= 1 ? (langs[0]?.key ?? 'default') : null)
    setStep(3)
  }

  return (
    <div className="min-h-screen flex flex-col py-10 px-4"
      style={{ background:'linear-gradient(135deg,#0f0c29 0%,#302b63 50%,#24243e 100%)' }}
    >
      {/* Ambient orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden>
        <div className="absolute top-1/4 left-[10%] w-80 h-80 rounded-full blur-3xl opacity-20 animate-float" style={{ background:'radial-gradient(circle,#a78bfa,transparent)' }} />
        <div className="absolute bottom-1/4 right-[10%] w-64 h-64 rounded-full blur-3xl opacity-20 animate-float" style={{ background:'radial-gradient(circle,#f472b6,transparent)', animationDelay:'2s' }} />
        <div className="absolute top-1/2 right-1/4 w-48 h-48 rounded-full blur-3xl opacity-10 animate-float" style={{ background:'radial-gradient(circle,#06b6d4,transparent)', animationDelay:'3.5s' }} />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto w-full">

        {step > 1 && (
          <button onClick={() => setStep((s) => s - 1)} className="flex items-center gap-1.5 mb-6 text-white/50 hover:text-white transition-colors text-sm font-semibold">
            <ChevronLeft size={16} /> Back
          </button>
        )}

        <StepBar step={step} />

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-white/60 text-xs font-semibold mb-5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Step 1 of 4 — What do you want to build?
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3 leading-tight">
                Choose Your{' '}
                <span style={{ background:'linear-gradient(135deg,#a78bfa 0%,#f472b6 60%,#fb923c 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  Adventure!
                </span>{' '}🚀
              </h1>
              <p className="text-white/50 text-base">Pick what you want to create today!</p>
            </div>

            <div className="flex flex-wrap justify-center gap-5">
              {TECHNOLOGIES.map((t) => {
                const Logo = t.Logo
                return (
                  <button
                    key={t.id}
                    onClick={() => pickTech(t.id)}
                    className="w-48 rounded-3xl p-6 text-center group transition-all duration-300 hover:scale-105 active:scale-95 flex flex-col items-center"
                    style={{ background: t.gradient, boxShadow:`0 8px 32px ${t.glow}` }}
                    onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 18px 56px ${t.glow}` }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = `0 8px 32px ${t.glow}` }}
                  >
                    <div className="mb-4 group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">
                      <Logo />
                    </div>
                    <p className="text-white font-extrabold text-base mb-1">{t.title}</p>
                    <p className="text-white/70 text-xs mb-5 leading-snug">{t.desc}</p>
                    <div className="bg-white/20 hover:bg-white/30 rounded-xl px-4 py-1.5 text-white text-xs font-bold transition-colors">
                      Let&apos;s Go! →
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-center mt-12">
              <button
                onClick={() => router.push('/home')}
                className="px-12 py-4 rounded-2xl text-white text-base font-extrabold transition-all duration-300 hover:scale-105 active:scale-95"
                style={{ background:'linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#ec4899 100%)', boxShadow:'0 10px 40px rgba(99,102,241,0.5)' }}
              >
                🚀 Go to Dashboard
              </button>
            </div>
          </>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && tech && (
          <>
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/15 px-4 py-1.5 rounded-full text-white/60 text-xs font-semibold mb-4">
                {techData?.title}
              </div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                What do you want to{' '}
                <span style={{ background:'linear-gradient(135deg,#a78bfa 0%,#34d399 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  learn?
                </span>
              </h1>
              <p className="text-white/40 text-sm">Pick one topic to start your journey! 🗺️</p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {TOPICS[tech].map((t, i) => {
                const c = CHIP_COLORS[i % CHIP_COLORS.length]
                return (
                  <button
                    key={t.key}
                    onClick={() => pickTopic(t)}
                    className="w-56 p-6 rounded-2xl text-left transition-all duration-200 group hover:scale-105 active:scale-95"
                    style={{ background: c.bg, border:`1.5px solid ${c.border}` }}
                  >
                    <p className="font-extrabold text-base mb-1.5" style={{ color: c.text }}>{t.label}</p>
                    <p className="text-white/50 text-sm mb-4 leading-relaxed">{t.desc}</p>
                    <div className="text-xs font-bold flex items-center gap-1" style={{ color: c.text }}>
                      Select <span className="group-hover:translate-x-1 transition-transform inline-block">→</span>
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}

        {/* ── STEP 3 ── */}
        {step === 3 && topic && (
          <div className="space-y-8 max-w-2xl mx-auto">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white mb-2">
                Pick Your{' '}
                <span style={{ background:'linear-gradient(135deg,#fbbf24 0%,#f472b6 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  Language
                </span>{' '}🧑‍💻
              </h2>
              <p className="text-white/40 text-sm">{topic.label} — how do you want to code it?</p>
            </div>

            {/* Language pills */}
            <div className="flex flex-wrap gap-3 justify-center">
              {(LANGUAGES[topic.key] ?? [{ key:'default', label:'Standard', icon:'💻' }]).map((l) => (
                <button
                  key={l.key}
                  onClick={() => setLang(l.key)}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-bold transition-all duration-200 hover:scale-105 active:scale-95"
                  style={
                    lang === l.key
                      ? { background:'linear-gradient(135deg,#6366f1,#a855f7)', color:'white', boxShadow:'0 4px 20px rgba(99,102,241,0.5)' }
                      : { background:'rgba(255,255,255,0.08)', border:'1.5px solid rgba(255,255,255,0.15)', color:'rgba(255,255,255,0.6)' }
                  }
                >
                  <span className="text-lg">{l.icon}</span> {l.label}
                </button>
              ))}
            </div>

            {/* Roadmap */}
            <div className="rounded-3xl p-6" style={{ background:'rgba(255,255,255,0.06)', border:'1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-2 mb-5">
                <Map size={16} className="text-purple-400" />
                <span className="text-white font-extrabold text-sm">Your Learning Roadmap 🗺️</span>
              </div>
              {(ROADMAPS[topic.key] ?? DEFAULT_ROADMAP).map((item, i, arr) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 text-base"
                      style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.3),rgba(168,85,247,0.3))', border:'1px solid rgba(99,102,241,0.4)' }}>
                      {item.emoji}
                    </div>
                    {i < arr.length - 1 && <div className="w-px my-1 flex-1" style={{ background:'rgba(255,255,255,0.08)', minHeight:'16px' }} />}
                  </div>
                  <div className="pb-4">
                    <p className="text-white font-bold text-sm">{item.label}</p>
                    <p className="text-white/40 text-xs mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center">
              <button
                onClick={() => lang && setStep(4)}
                disabled={!lang}
                className="px-10 py-4 rounded-2xl text-white font-extrabold text-base transition-all duration-300 hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background:'linear-gradient(135deg,#6366f1,#a855f7)', boxShadow: lang ? '0 8px 32px rgba(99,102,241,0.5)' : 'none' }}
              >
                {lang ? 'Continue to Learning Methods! →' : 'Select a language first ☝️'}
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 4 ── */}
        {step === 4 && (
          <div>
            <div className="text-center mb-8">
              <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-2">
                How do you want to{' '}
                <span style={{ background:'linear-gradient(135deg,#fbbf24 0%,#34d399 100%)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
                  learn?
                </span>{' '}✨
              </h2>
              {topic && (
                <p className="text-white/40 text-sm">
                  {techData?.title} · {topic.label} ·{' '}
                  <span className="text-purple-400">{LANGUAGES[topic.key]?.find((l) => l.key === lang)?.label ?? lang}</span>
                </p>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-5">
              {LEARNING_METHODS.map((m) => (
                <div
                  key={m.key}
                  className="w-56 rounded-3xl overflow-hidden flex flex-col"
                  style={{ background: m.gradient, boxShadow:`0 8px 32px ${m.glow}` }}
                >
                  <div className="p-6 flex flex-col flex-1">
                    <div className="text-4xl mb-4">{m.emoji}</div>
                    <p className="font-extrabold text-white text-base mb-2">{m.title}</p>
                    <p className="text-white/75 text-sm flex-1 leading-relaxed mb-5">{m.desc}</p>
                    <button
                      onClick={() => setComingSoon(true)}
                      className="w-full py-3 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-extrabold text-sm transition-all duration-200 active:scale-95"
                    >
                      Code Now! ▶
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Coming Soon overlay */}
      {comingSoon && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background:'rgba(0,0,0,0.75)', backdropFilter:'blur(12px)' }}
          onClick={() => setComingSoon(false)}
        >
          <div
            className="text-center p-10 rounded-3xl w-full max-w-xs"
            style={{ background:'linear-gradient(135deg,#1a1a3e,#2d2d6b)', border:'1px solid rgba(255,255,255,0.15)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-6xl mb-4">🚧</div>
            <h3 className="text-xl font-extrabold text-white mb-2">Coming Soon!</h3>
            <p className="text-white/50 text-sm mb-6 leading-relaxed">
              This awesome learning module is being built right now. Check back soon! 🎉
            </p>
            <button
              onClick={() => setComingSoon(false)}
              className="px-8 py-3 rounded-2xl font-extrabold text-white text-sm transition-all duration-200 hover:scale-105"
              style={{ background:'linear-gradient(135deg,#6366f1,#a855f7)' }}
            >
              OK, got it! 👍
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
