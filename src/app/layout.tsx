// Root layout — minimal wrapper required by Next.js App Router.
// The [locale]/layout.tsx handles <html>, <body>, fonts, and providers.
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
