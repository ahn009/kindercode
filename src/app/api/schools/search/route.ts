import { NextResponse } from 'next/server'

// School search is handled client-side using Firebase Firestore SDK
// in app/[locale]/onboarding/teacher/school-connection/page.tsx
// This route is kept as a placeholder for future server-side search integration
export async function GET() {
  return NextResponse.json({ schools: [] })
}
