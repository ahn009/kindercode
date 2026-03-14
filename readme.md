**Where Kids Become Future Coders!**

An interactive, gamified coding education platform designed specifically for children. Built with Next.js 14, internationalization support, and Firebase authentication.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-Auth-FFCA28?style=flat-square&logo=firebase)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=flat-square&logo=vercel)](https://vercel.com/)

🌐 **Live Demo**: [https://kindercode-sigma.vercel.app](https://kindercode-sigma.vercel.app)

---

## 🚀 Overview

KinderCode is a comprehensive, multilingual coding education platform that makes programming accessible and fun for kids worldwide. The platform features multiple learning methods, skill paths, competitions, school integration, and community features—all wrapped in a delightful, child-friendly UI with gamification elements.

### ✨ Key Features

- **🎮 Multiple Learning Methods**: Story-based, age-based, card-based, game-based, and puzzle-based coding
- **🛤️ Skill Paths**: Problem solving, game logic, web thinking, AI thinking, and robotics logic
- **🏆 Competitions**: Leaderboards, weekly challenges, live tournaments, and school contests
- **🏫 School Integration**: Turnkey curriculum, teacher dashboards, progress monitoring, and certification
- **👥 Community**: Safe environment for kids to connect, share projects, and participate in clubs
- **💰 Flexible Pricing**: Free, Plus, Pro, and School plans
- **🌍 Internationalization**: Support for 10 languages (English, Spanish, French, Hindi, Italian, Korean, Portuguese, Russian, Urdu, Chinese)
- **🔐 Authentication**: Firebase-powered auth with login, signup, and protected routes

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui |
| **State Management** | React Context API |
| **Authentication** | Firebase Auth |
| **Animations** | CSS Animations + Intersection Observer |
| **Icons** | Lucide React |
| **i18n** | next-intl |
| **AI Tools** | Claude CLI, Claude Code |
| **Deployment** | Vercel |

---

## 📁 Project Structure

```
kindercode/
├── design-images/              # Figma/wireframe reference images
│   ├── for-schools.png
│   ├── Frame 54.png
│   └── prices-section-figma-design.png
│
├── messages/                   # i18n translation files
│   ├── en.json                # English
│   ├── es.json                # Spanish
│   ├── fr.json                # French
│   ├── hi.json                # Hindi
│   ├── it.json                # Italian
│   ├── ko.json                # Korean
│   ├── pt.json                # Portuguese
│   ├── ru.json                # Russian
│   ├── ur.json                # Urdu
│   └── zh.json                # Chinese
│
├── public/
│   ├── favicon.ico
│   └── images/                # Static image assets
│       ├── aged-based-coding.png
│       ├── ai-thinking.png
│       ├── card-based-coading.png
│       ├── game-based-coding.png
│       ├── game-logic.png
│       ├── problem-solving.png
│       ├── puzzle-based-coding.png
│       ├── robotics-logic.png
│       ├── story-based-coding.png
│       └── web-thinking.png
│
├── src/
│   ├── app/
│   │   ├── globals.css        # Global styles & Tailwind
│   │   ├── layout.tsx         # Root layout
│   │   └── [locale]/          # Localized routes
│   │       ├── page.tsx       # Landing page
│   │       ├── layout.tsx     # Locale layout
│   │       ├── login/         # Login page
│   │       ├── signup/        # Signup page
│   │       ├── forgot-password/ # Password reset
│   │       ├── onboarding/    # User onboarding
│   │       └── select-role/   # Role selection
│   │
│   ├── components/
│   │   ├── Header.tsx         # Navigation header
│   │   ├── Footer.tsx         # Site footer
│   │   ├── Providers.tsx      # App providers
│   │   ├── ProtectedRoute.tsx # Auth protection
│   │   ├── LocaleHtmlAttributes.tsx # i18n HTML attrs
│   │   └── sections/          # Page sections
│   │       ├── Hero.tsx
│   │       ├── LearningMethods.tsx
│   │       ├── SkillPaths.tsx
│   │       ├── Competitions.tsx
│   │       ├── Schools.tsx    # For Schools section
│   │       ├── Community.tsx
│   │       ├── Pricing.tsx
│   │       └── Testimonials.tsx
│   │
│   ├── context/
│   │   └── AuthContext.tsx    # Firebase auth context
│   │
│   ├── hooks/
│   │   └── useReveal.ts       # Scroll reveal animation hook
│   │
│   ├── i18n/
│   │   ├── navigation.ts      # i18n navigation config
│   │   ├── request.ts         # i18n request handler
│   │   └── routing.ts         # i18n routing setup
│   │
│   ├── lib/
│   │   ├── firebase.ts        # Firebase configuration
│   │   ├── utils.ts           # Utility functions
│   │   ├── languages.ts       # Language configuration
│   │   └── imageConfig.ts     # Image optimization config
│   │
│   └── proxy.ts               # Proxy configuration
│
├── next.config.js             # Next.js configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── tsconfig.json              # TypeScript configuration
└── package.json               # Dependencies
```

---

## 🎨 Design System

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--sky-50` | `#f0f9ff` | Light backgrounds |
| `--sky-100` | `#e0f2fe` | Section backgrounds |
| `--sky-200` | `#bae6fd` | Gradients |
| `--sky-300` | `#7dd3fc` | Gradients |
| `--sky-400` | `#38bdf8` | Accents |
| `--emerald-500` | `#10b981` | Primary CTA buttons |
| `--emerald-600` | `#059669` | Button hover states |
| `--slate-800` | `#1e293b` | Primary text |
| `--slate-600` | `#475569` | Secondary text |

### Typography

- **Headings**: Bold, rounded sans-serif (system-ui, Inter)
- **Body**: Clean, readable sans-serif
- **Strategy**: Mobile-first responsive scaling

### Visual Elements

- **Cloud Decorations**: SVG-based cloud layers at section boundaries
- **Stars/Sparkles**: CSS animated pulse effects for magical atmosphere
- **Glassmorphism**: `backdrop-filter: blur(12px)` with `rgba(255,255,255,0.82)`
- **Gradients**: Soft linear gradients for depth and visual interest
- **Rounded Corners**: `rounded-2xl` (16px) for cards, `rounded-full` for buttons

---

## 🏫 For Schools Section

Located in `src/components/sections/Schools.tsx`

### Layout Structure (Wireframe Compliant)

**Top Row - Quick Actions (4 columns):**
| Feature | Icon | Color |
|---------|------|-------|
| Get Curriculum | BookOpen | Blue |
| Monitor Progress | BarChart3 | Emerald |
| Engage Students | Users | Yellow |
| Get Certified | Award | Purple |

**CTA 1**: "Request a Demo"  
**Subtext**: "Join Over 1,000+ Schools Making Coding Fun"

**Bottom Row - Core Features (4 columns):**
| Feature | Icon | Color |
|---------|------|-------|
| Turnkey Curriculum | ClipboardList | Blue |
| Teacher Dashboard | BookOpen | Emerald |
| Fun Competitions | Trophy | Yellow |
| Certificates & Rewards | GraduationCap | Purple |

**CTA 2**: "Get Your School Started"

### Responsive Behavior

- **Desktop (≥1024px)**: 4 columns
- **Tablet (640px-1024px)**: 2 columns
- **Mobile (<640px)**: 2 columns (condensed)

---

## 🌍 Internationalization (i18n)

The app supports 10 languages using `next-intl`:

### Supported Locales

| Code | Language | File |
|------|----------|------|
| `en` | English | `messages/en.json` |
| `es` | Spanish | `messages/es.json` |
| `fr` | French | `messages/fr.json` |
| `hi` | Hindi | `messages/hi.json` |
| `it` | Italian | `messages/it.json` |
| `ko` | Korean | `messages/ko.json` |
| `pt` | Portuguese | `messages/pt.json` |
| `ru` | Russian | `messages/ru.json` |
| `ur` | Urdu | `messages/ur.json` |
| `zh` | Chinese | `messages/zh.json` |

### URL Structure

```
/              # Default locale (English)
/en            # English
/es            # Spanish
/ur            # Urdu
```

---

## 🔐 Authentication Flow

Firebase Authentication implementation:

```
[Login Page] → [Firebase Auth] → [Select Role] → [Onboarding] → [Dashboard]
     ↑              ↑                  ↑
[Signup Page]   [Google/Email]   [Student/Teacher/School]
```

### Protected Routes

Uses `ProtectedRoute` component to guard authenticated pages:
- Dashboard (future)
- Profile settings
- Learning paths
- Competition entries

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm 9+ or yarn
- Git
- Firebase project (for auth)

### Installation

```bash
# Clone the repository
git clone https://github.com/ahn009/kindercode.git

# Navigate to project
cd kindercode

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create `.env.local`:

```env
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Build for Production

```bash
# Create optimized build
npm run build

# Start production server
npm start
```

---

## 🧩 Development Workflow

This project follows an **AI-assisted development** approach using Claude CLI for rapid iteration and pixel-perfect implementation from Figma designs.

### Key Principles

1. **Component-First**: Build sections as isolated, reusable components
2. **Design-to-Code**: Convert Figma designs directly to React + Tailwind
3. **i18n-Ready**: All user-facing text uses translation keys
4. **Mobile-First**: Responsive design starting at 320px
5. **Accessibility**: WCAG 2.1 AA compliant components

### Custom Hooks

#### `useReveal`
Located in `src/hooks/useReveal.ts`

Handles scroll-triggered fade-in animations using Intersection Observer API.

```typescript
const sectionRef = useReveal<HTMLElement>();

// Usage
<section ref={sectionRef}>
  <div className="reveal">Content fades in on scroll</div>
</section>
```

---

## 📱 Responsive Breakpoints

| Breakpoint | Width | Columns | Font Scale |
|------------|-------|---------|------------|
| **Mobile** | < 640px | 1-2 | Base |
| **Tablet** | 640px - 1024px | 2 | Base × 1.1 |
| **Desktop** | > 1024px | 4 | Base × 1.2 |

### Tailwind Classes Strategy

```
grid-cols-2 lg:grid-cols-4
text-sm md:text-base
px-4 md:px-6 lg:px-8
```

---

## 🎯 Performance Optimizations

- **Next.js Image Optimization**: Automatic WebP conversion via `next/image`
- **Font Optimization**: System font stack for zero layout shift
- **Code Splitting**: Automatic route-based splitting by Next.js
- **Animation Performance**: GPU-accelerated transforms (`translate3d`, `opacity`)
- **i18n Optimization**: Lazy loading of translation messages
- **Firebase**: Tree-shaking for minimal bundle size

### Lighthouse Targets

- **Performance**: 90+
- **Accessibility**: 95+
- **Best Practices**: 95+
- **SEO**: 90+

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork** the repository
2. **Create** your feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m 'feat: add amazing feature'
   ```
4. **Push** to the branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting)
- `refactor:` Code refactoring
- `perf:` Performance improvements
- `test:` Adding tests

---

## 📄 License

This project is proprietary software owned by **WebCraft**.

All rights reserved. Unauthorized copying, distribution, or use is strictly prohibited.

---

## 👨‍💻 Author

**Muhammad Ahsan** - Frontend Developer & Founder of WebCraft

- 🌐 Portfolio: [webcraft.dev](https://webcraft.dev)
- 💼 LinkedIn: [linkedin.com/in/muhammadahsan](https://linkedin.com/in/muhammadahsan)
- 🐦 Twitter: [@muhammadahsan](https://twitter.com/muhammadahsan)
- 📧 Email: [ahsan@webcraft.dev](mailto:ahsan@webcraft.dev)

**Location**: Rahimyar Khan, Pakistan 🇵🇰

Built with ❤️ using Next.js, Tailwind CSS, and AI-assisted development

---

## 🙏 Acknowledgments

- **Design**: Wireframes and mockups created in Figma
- **Icons**: [Lucide React](https://lucide.dev) - Beautiful, consistent icons
- **UI Components**: [shadcn/ui](https://ui.shadcn.com) - High-quality components
- **Authentication**: [Firebase](https://firebase.google.com) - Secure, scalable auth
- **i18n**: [next-intl](https://next-intl-docs.vercel.app/) - Internationalization made easy
- **AI Assistance**: [Claude](https://claude.ai) by Anthropic - Development workflow
- **Deployment**: [Vercel](https://vercel.com) - Seamless Next.js hosting

---

## 🗺️ Roadmap

- [ ] **Q2 2026**: Interactive coding playground
- [ ] **Q2 2026**: Real-time collaboration features
- [ ] **Q3 2026**: Mobile app (React Native)
- [ ] **Q3 2026**: AI-powered code assistant for kids
- [ ] **Q4 2026**: School management dashboard
- [ ] **Q4 2026**: Advanced analytics for teachers

---

<p align="center">
  <strong>⭐ Star this repo if you find it helpful!</strong><br>
  <sub>Made with 💻 and 🎨 by WebCraft</sub>
</p>
