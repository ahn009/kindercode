'use client'

import { useState } from 'react'
import { X, Play, BookOpen, Trophy, Check, ChevronDown } from 'lucide-react'

// ── YouTube video IDs ──────────────────────────────────────────────────────
const VIDEO_IDS: Record<string, string> = {
  html: 'UB1O30fR-EE',
  css: 'yfoY53QXEnI',
  'js-basics': 'hdI2bqOjy3c',
  react: 'w7ejDZ8SWv8',
  components: 'w7ejDZ8SWv8',
  'state-props': 'w7ejDZ8SWv8',
  backend: 'ENrzD9HAZK4',
  apis: 'GbamFztTE8I',
  'swift-kotlin': 'comQ1-x2a1Q',
  'unity-godot': 'gB1F9G0JXOo',
  'game-loops': 'gB1F9G0JXOo',
  'what-is-ai': 'mJeNghZXtMo',
  'neural-networks': 'aircAruvnKk',
  'pattern-recognition': 'mJeNghZXtMo',
}

// ── Quiz Questions ─────────────────────────────────────────────────────────
type Q = { q: string; options: string[]; answer: number }

const QUIZ: Record<string, Q[]> = {
  html: [
    { q: 'What does HTML stand for?', options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Hyper Transfer Markup Layout', 'Home Tool Markup Language'], answer: 0 },
    { q: 'Which tag creates a paragraph?', options: ['<div>', '<p>', '<span>', '<section>'], answer: 1 },
    { q: 'Which tag is the largest heading?', options: ['<h6>', '<h3>', '<h1>', '<heading>'], answer: 2 },
    { q: 'What does the <a> tag do?', options: ['Makes text bold', 'Creates a link', 'Adds an image', 'Creates a list'], answer: 1 },
    { q: 'Which tag embeds an image?', options: ['<pic>', '<photo>', '<image>', '<img>'], answer: 3 },
  ],
  css: [
    { q: 'What does CSS stand for?', options: ['Creative Style Sheets', 'Cascading Style Sheets', 'Colorful Style Syntax', 'Computer Style System'], answer: 1 },
    { q: 'Which property changes text color?', options: ['font-color', 'text-color', 'color', 'text-style'], answer: 2 },
    { q: 'How do you center a div horizontally?', options: ['align: center', 'margin: 0 auto', 'text-align: center', 'position: center'], answer: 1 },
    { q: 'Which makes an element invisible but keeps space?', options: ['display: none', 'visibility: hidden', 'opacity: 0', 'Both B and C'], answer: 3 },
    { q: 'What is the box model?', options: ['A 3D model tool', 'Content + Padding + Border + Margin', 'A way to draw boxes', 'A CSS grid system'], answer: 1 },
  ],
  'js-basics': [
    { q: 'Which keyword declares a variable in modern JS?', options: ['var only', 'let only', 'const only', 'Both let and const'], answer: 3 },
    { q: 'What does console.log() do?', options: ['Creates a log file', 'Prints to the browser console', 'Logs you into a website', 'Saves data'], answer: 1 },
    { q: 'Which is a JavaScript data type?', options: ['integer', 'float', 'string', 'char'], answer: 2 },
    { q: 'What does === check?', options: ['Value equality only', 'Value and type equality', 'Reference equality', 'Type only'], answer: 1 },
    { q: 'How do you define a function?', options: ['function myFunc() {}', 'def myFunc():', 'func myFunc() {}', 'method myFunc() {}'], answer: 0 },
  ],
  react: [
    { q: 'What is React?', options: ['A database', 'A server framework', 'A UI component library', 'A CSS framework'], answer: 2 },
    { q: 'What is JSX?', options: ['JavaScript extension for SQL', 'JavaScript XML — HTML in JS', 'A JSON format', 'A testing framework'], answer: 1 },
    { q: 'What does useState return?', options: ['A value only', 'A setter only', 'A value and a setter function', 'A promise'], answer: 2 },
    { q: 'What is a React component?', options: ['A CSS class', 'A reusable UI building block', 'A database table', 'An API endpoint'], answer: 1 },
    { q: 'Which hook runs code after render?', options: ['useState', 'useEffect', 'useContext', 'useRef'], answer: 1 },
  ],
  'what-is-ai': [
    { q: 'What does AI stand for?', options: ['Automatic Intelligence', 'Artificial Intelligence', 'Advanced Internet', 'Automated Instructions'], answer: 1 },
    { q: 'What is machine learning?', options: ['Teaching machines to lift', 'Programming without code', 'Teaching computers to learn from data', 'A type of robot'], answer: 2 },
    { q: 'Which is an example of AI?', options: ['A calculator', 'A light switch', 'A spam filter', 'A clock'], answer: 2 },
    { q: 'What is a neural network inspired by?', options: ['Computer chips', 'The human brain', 'The internet', 'Electrical circuits'], answer: 1 },
    { q: 'What does a chatbot do?', options: ['Plays games', 'Browses the internet', 'Talks to users using AI', 'Fixes bugs'], answer: 2 },
  ],
  'game-loops': [
    { q: 'What is a game loop?', options: ['A level design pattern', 'Code that runs every frame', 'A multiplayer feature', 'A game genre'], answer: 1 },
    { q: 'What does FPS stand for in gaming?', options: ['First Person Shooter', 'Frames Per Second', 'Full Play System', 'File Processing Speed'], answer: 1 },
    { q: 'What is a sprite?', options: ['A character type', 'A 2D image for an object', 'A sound effect', 'A game engine'], answer: 1 },
    { q: 'What is collision detection?', options: ['Finding game bugs', 'Checking when objects touch', 'Loading game assets', 'Saving game state'], answer: 1 },
    { q: 'What is delta time?', options: ['The game score', 'Time between frames', 'A countdown timer', 'Player health'], answer: 1 },
  ],
}

const DEFAULT_QUIZ: Q[] = [
  { q: 'What is coding?', options: ['Writing secret messages', 'Giving instructions to computers', 'Drawing on a computer', 'Playing video games'], answer: 1 },
  { q: 'Which is a programming language?', options: ['English', 'Python', 'Latin', 'French'], answer: 1 },
  { q: 'What is a bug in coding?', options: ['An actual insect', 'A feature request', 'An error in the code', 'A type of computer'], answer: 2 },
  { q: 'What does an algorithm do?', options: ['Draws pictures', 'Solves problems step by step', 'Stores passwords', 'Connects to WiFi'], answer: 1 },
  { q: 'What is open source software?', options: ['Software that costs money', 'Software with public code', 'Old software', 'Mobile apps only'], answer: 1 },
]

// ── Info Cards ─────────────────────────────────────────────────────────────
type Card = { title: string; emoji: string; content: string; funFact: string }

const CARDS: Record<string, Card[]> = {
  html: [
    { title: 'What is HTML?', emoji: '🏗️', content: 'HTML is the skeleton of every webpage! It uses special tags to tell browsers how to structure content.', funFact: 'HTML was invented in 1991 by Tim Berners-Lee!' },
    { title: 'Tags & Elements', emoji: '🏷️', content: 'Tags are like containers. <p> holds a paragraph, <h1> holds a big heading, <div> groups things together.', funFact: 'There are over 100 different HTML tags you can use!' },
    { title: 'Attributes', emoji: '✨', content: 'Attributes give extra info to tags. Like src="image.jpg" tells the <img> tag which picture to show.', funFact: '"href" in links stands for "hypertext reference"!' },
    { title: 'Your First Webpage', emoji: '🚀', content: 'Every HTML page starts with <!DOCTYPE html> and has a <head> for settings and a <body> for visible content.', funFact: 'The first ever website (info.cern.ch) is still online today!' },
  ],
  css: [
    { title: 'What is CSS?', emoji: '🎨', content: 'CSS is the painter of the web! It controls colors, fonts, spacing, and layout to make pages beautiful.', funFact: '"Cascading" means styles flow from parent to child elements!' },
    { title: 'Selectors', emoji: '🎯', content: 'Selectors target HTML elements to style them. p {} targets all paragraphs, .class {} targets elements with that class.', funFact: 'CSS has over 500 different properties you can use!' },
    { title: 'The Box Model', emoji: '📦', content: 'Every element is a box: content (inside), padding (inner space), border (the edge), and margin (outer space).', funFact: 'Understanding the box model is the #1 skill for CSS layouts!' },
    { title: 'Flexbox', emoji: '🧲', content: 'Flexbox makes it easy to arrange items in rows or columns and center them. Just add display: flex!', funFact: 'Flexbox was introduced in 2009 but browsers supported it by 2012!' },
  ],
  'js-basics': [
    { title: 'What is JavaScript?', emoji: '⚡', content: 'JavaScript makes websites interactive! It responds to clicks, updates content, and talks to servers.', funFact: 'JavaScript was created in just 10 days in 1995!' },
    { title: 'Variables', emoji: '📦', content: 'Variables store data. Use const for values that won\'t change, let for values that will change.', funFact: 'JavaScript has 8 different data types including strings, numbers, and booleans!' },
    { title: 'Functions', emoji: '🔧', content: 'Functions are reusable blocks of code. Define once, call many times. They can take inputs and return outputs.', funFact: 'JS functions are "first-class objects" — they can be stored in variables!' },
    { title: 'Events', emoji: '🎯', content: 'Events let you respond to user actions. Click a button? Event! Type something? Event! Move the mouse? Event!', funFact: 'Browsers fire hundreds of different types of events!' },
  ],
  react: [
    { title: 'What is React?', emoji: '⚛️', content: 'React is a library for building user interfaces. It lets you build reusable UI pieces called components.', funFact: 'React was created by Facebook (Meta) in 2013!' },
    { title: 'Components', emoji: '🧩', content: 'Components are like LEGO bricks for your UI. Build small pieces and combine them to make complex interfaces.', funFact: 'Every React app has at least one component — the App component!' },
    { title: 'Props', emoji: '📮', content: 'Props (properties) are how you pass data from parent to child components — like function arguments for components.', funFact: 'Props are read-only — a component should never modify its own props!' },
    { title: 'State', emoji: '🔄', content: 'State is data that can change. When state changes, React automatically re-renders the component.', funFact: 'useState is the most-used React hook!' },
  ],
  'what-is-ai': [
    { title: 'What is AI?', emoji: '🤖', content: 'AI is teaching computers to do things that normally require human thinking — like recognizing faces or translating languages.', funFact: 'The term "AI" was coined in 1956 at a conference at Dartmouth College!' },
    { title: 'Machine Learning', emoji: '🧠', content: 'Machine learning is when computers learn from examples. Show it 1000 cat photos, it learns what a cat looks like!', funFact: 'Netflix uses machine learning to recommend 80% of what you watch!' },
    { title: 'Training Data', emoji: '📊', content: 'AI learns from data. The more data it sees, the smarter it gets. A self-driving car needs millions of miles of data!', funFact: 'GPT-4 was trained on over 1 trillion words of text!' },
    { title: 'AI in Daily Life', emoji: '🌟', content: 'You already use AI every day! Spotify playlists, Google Maps routes, spam filters, and voice assistants are all AI.', funFact: 'By 2030, AI could add $15 trillion to the global economy!' },
  ],
  'game-loops': [
    { title: 'The Game Loop', emoji: '🔄', content: 'A game loop runs code 60 times per second! Each "tick" it processes input, updates game state, and draws the screen.', funFact: 'Most games run at 60 FPS — that\'s 60 full updates every second!' },
    { title: 'Player Input', emoji: '🎮', content: 'The loop constantly checks: is a key pressed? Is the mouse moving? This lets games respond instantly!', funFact: 'Pro gamers can react in under 150 milliseconds!' },
    { title: 'Sprites', emoji: '👾', content: 'Sprites are 2D images representing characters and objects. Many sprites played in sequence create animation!', funFact: 'Early arcade games had sprites as small as 8×8 pixels!' },
    { title: 'Collision Detection', emoji: '💥', content: 'Games check if objects overlap. Did the bullet hit the enemy? Did the player land on a platform? That\'s collision!', funFact: 'Simple games use "bounding box" collision — checking if rectangles overlap!' },
  ],
}

const DEFAULT_CARDS: Card[] = [
  { title: 'What is Coding?', emoji: '💻', content: 'Coding is giving instructions to a computer in a language it understands. You are the director, the computer is the actor!', funFact: 'There are over 700 programming languages in existence!' },
  { title: 'Problem Solving', emoji: '🧩', content: 'Great coders are great problem solvers. Break big problems into tiny steps, solve each step, and combine the solutions!', funFact: 'The word "computer" originally meant a human who did calculations!' },
  { title: 'Debugging', emoji: '🐛', content: 'Bugs are errors in code. Debugging is finding and fixing them. Every programmer debugs — it\'s a core skill!', funFact: 'The first "bug" was an actual moth found inside a computer in 1947!' },
  { title: 'Keep Practicing', emoji: '🚀', content: 'The best programmers wrote thousands of lines of code to get good. Start small, build projects, and keep going!', funFact: 'Mark Zuckerberg started coding at age 12!' },
]

// ── Sub-components ─────────────────────────────────────────────────────────

function VideoTab({ topicKey, topicLabel }: { topicKey: string; topicLabel: string }) {
  const videoId = VIDEO_IDS[topicKey]
  if (!videoId) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="text-6xl mb-4">🎬</div>
        <p className="text-white/60 text-lg font-semibold">Video coming soon for <span className="text-white">{topicLabel}</span></p>
        <p className="text-white/40 text-sm mt-2">Check back later — we're adding content every week!</p>
      </div>
    )
  }
  return (
    <div>
      <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingTop: '56.25%' }}>
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&modestbranding=1`}
          title={`${topicLabel} Tutorial`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <p className="text-white/40 text-xs text-center mt-3">Video provided by YouTube. Content is for educational purposes.</p>
    </div>
  )
}

function CardsTab({ topicKey }: { topicKey: string }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const cards = CARDS[topicKey] ?? DEFAULT_CARDS

  return (
    <div className="space-y-3">
      {cards.map((card, i) => (
        <div
          key={i}
          className="rounded-2xl overflow-hidden border border-white/10"
          style={{ background: 'rgba(255,255,255,0.07)' }}
        >
          <button
            className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 transition-colors"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{card.emoji}</span>
              <span className="text-white font-bold">{card.title}</span>
            </div>
            <ChevronDown
              size={18}
              className="text-white/50 flex-shrink-0 transition-transform duration-200"
              style={{ transform: openIdx === i ? 'rotate(180deg)' : 'rotate(0deg)' }}
            />
          </button>
          {openIdx === i && (
            <div className="px-4 pb-4">
              <p className="text-white/80 text-sm leading-relaxed mb-3">{card.content}</p>
              <div className="flex items-start gap-2 bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3">
                <span className="text-yellow-300 text-lg flex-shrink-0">💡</span>
                <p className="text-yellow-200/80 text-xs leading-relaxed"><strong>Fun fact:</strong> {card.funFact}</p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

function QuizTab({ topicKey, topicLabel }: { topicKey: string; topicLabel: string }) {
  const questions = QUIZ[topicKey] ?? DEFAULT_QUIZ
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [score, setScore] = useState(0)
  const [done, setDone] = useState(false)
  const [answered, setAnswered] = useState(false)

  function handleAnswer(idx: number) {
    if (answered) return
    setSelected(idx)
    setAnswered(true)
    if (idx === questions[current].answer) setScore((s) => s + 1)
  }

  function next() {
    if (current + 1 >= questions.length) {
      setDone(true)
    } else {
      setCurrent((c) => c + 1)
      setSelected(null)
      setAnswered(false)
    }
  }

  function restart() {
    setCurrent(0)
    setSelected(null)
    setAnswered(false)
    setScore(0)
    setDone(false)
  }

  if (done) {
    const pct = Math.round((score / questions.length) * 100)
    const passed = pct >= 80
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="text-6xl mb-4">{passed ? '🏆' : '💪'}</div>
        <h3 className="text-2xl font-extrabold text-white mb-2">
          {passed ? 'Amazing! You nailed it!' : 'Good effort! Keep practicing!'}
        </h3>
        <div className="text-5xl font-extrabold mb-1" style={{ color: passed ? '#10b981' : '#f59e0b' }}>{pct}%</div>
        <p className="text-white/60 text-sm mb-6">{score} / {questions.length} correct</p>
        {passed && <div className="text-4xl mb-6 animate-bounce">🎉 🌟 🎊</div>}
        <button
          onClick={restart}
          className="px-8 py-3 rounded-2xl font-extrabold text-white text-base transition-all duration-200 hover:scale-105 active:scale-95"
          style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)', boxShadow: '0 8px 24px rgba(99,102,241,0.5)' }}
        >
          Try Again
        </button>
      </div>
    )
  }

  const q = questions[current]
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <span className="text-white/50 text-sm font-semibold">Question {current + 1} / {questions.length}</span>
        <span className="text-white/50 text-sm font-semibold">Score: {score}</span>
      </div>
      {/* Progress bar */}
      <div className="h-1.5 bg-white/10 rounded-full mb-6 overflow-hidden">
        <div className="h-full bg-indigo-500 rounded-full transition-all duration-500" style={{ width: `${(current / questions.length) * 100}%` }} />
      </div>

      <p className="text-white font-bold text-lg mb-5 leading-snug">{q.q}</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
        {q.options.map((opt, i) => {
          let bg = 'rgba(255,255,255,0.08)'
          let border = 'rgba(255,255,255,0.15)'
          if (answered) {
            if (i === q.answer) { bg = 'rgba(16,185,129,0.25)'; border = '#10b981' }
            else if (i === selected) { bg = 'rgba(239,68,68,0.25)'; border = '#ef4444' }
          }
          return (
            <button
              key={i}
              onClick={() => handleAnswer(i)}
              disabled={answered}
              className="text-left p-4 rounded-2xl text-sm font-semibold text-white transition-all duration-200 hover:brightness-110 active:scale-95 disabled:cursor-default"
              style={{ background: bg, border: `1.5px solid ${border}` }}
            >
              <span className="text-white/50 mr-2">{String.fromCharCode(65 + i)}.</span> {opt}
            </button>
          )
        })}
      </div>

      {answered && (
        <div className="flex justify-end">
          <button
            onClick={next}
            className="px-6 py-2.5 rounded-2xl font-bold text-white text-sm transition-all duration-200 hover:scale-105"
            style={{ background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)' }}
          >
            {current + 1 >= questions.length ? 'See Results' : 'Next →'}
          </button>
        </div>
      )}
    </div>
  )
}

// ── Main Modal ─────────────────────────────────────────────────────────────

type Tab = 'video' | 'cards' | 'quiz'

interface Props {
  topicKey: string
  topicLabel: string
  onClose: () => void
}

export default function LearningModal({ topicKey, topicLabel, onClose }: Props) {
  const [tab, setTab] = useState<Tab>('video')

  const tabs: { id: Tab; icon: typeof Play; label: string }[] = [
    { id: 'video', icon: Play, label: 'Watch' },
    { id: 'cards', icon: BookOpen, label: 'Learn' },
    { id: 'quiz', icon: Trophy, label: 'Quiz' },
  ]

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full sm:max-w-2xl rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
        style={{ background: 'linear-gradient(145deg, #1a1a3e 0%, #2d2d6b 100%)', border: '1px solid rgba(255,255,255,0.12)', maxHeight: '92vh' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-white/10 flex-shrink-0">
          <div>
            <p className="text-white/50 text-xs font-semibold uppercase tracking-wider mb-0.5">Learning Topic</p>
            <h3 className="text-white font-extrabold text-xl">{topicLabel}</h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors text-white/60 hover:text-white"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 p-4 border-b border-white/10 flex-shrink-0">
          {tabs.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-200"
              style={tab === id
                ? { background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', boxShadow: '0 4px 16px rgba(99,102,241,0.4)' }
                : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.55)' }
              }
            >
              <Icon size={15} />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-5 flex-1">
          {tab === 'video' && <VideoTab topicKey={topicKey} topicLabel={topicLabel} />}
          {tab === 'cards' && <CardsTab topicKey={topicKey} />}
          {tab === 'quiz' && <QuizTab topicKey={topicKey} topicLabel={topicLabel} />}
        </div>
      </div>
    </div>
  )
}
