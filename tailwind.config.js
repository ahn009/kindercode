/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  // Single glob covers all source files; the three redundant paths are removed.
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // KinderCode design tokens — use these instead of hardcoded hex values
        kinder: {
          primary: '#4A90E2',
          'primary-dark': '#357ABD',
          secondary: '#FF6B6B',
          accent: '#FFD93D',
          success: '#6BCB77',
          purple: '#9B59B6',
          orange: '#FF8C42',
          dark: '#2C3E50',
          light: '#F0F4F8',
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        fredoka: ['var(--font-fredoka)', 'sans-serif'],
        nunito: ['var(--font-nunito)', 'sans-serif'],
      },
      keyframes: {
        float: {
          // Removed rotateX — it forces a 3D compositing layer on every
          // element using this animation (logo rocket). Pure translateY is
          // GPU-composited cheaply on the transform layer.
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        'pulse-glow': {
          // Use opacity instead of boxShadow — opacity is a cheap composited
          // property, whereas animating boxShadow triggers layout repaints.
          '0%, 100%': { opacity: '0.85' },
          '50%': { opacity: '1' },
        },
        'slide-up-3d': {
          '0%': { opacity: '0', transform: 'translateY(50px) rotateX(-15deg)' },
          '100%': { opacity: '1', transform: 'translateY(0) rotateX(0deg)' },
        },
        'bounce-3d': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
      },
      animation: {
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s infinite',
        'slide-up-3d': 'slide-up-3d 1s ease-out',
        'bounce-3d': 'bounce-3d 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
