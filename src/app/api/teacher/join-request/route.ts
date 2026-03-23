import { NextResponse } from 'next/server'

// Join requests are handled client-side using Firebase Firestore SDK
// in app/[locale]/onboarding/teacher/school-connection/page.tsx
// This route is kept as a placeholder for future server-side integration
export async function POST() {
  return NextResponse.json({ message: 'Use client-side Firestore SDK directly' }, { status: 200 })
}
