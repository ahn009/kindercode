import { NextRequest, NextResponse } from 'next/server'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface ContactPayload {
  name: string
  email: string
  subject: string
  message: string
}

// Simple in-memory rate limiting (resets on server restart / cold start)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT = 3       // max submissions
const WINDOW_MS = 60_000   // per 60 seconds

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const entry = rateLimitMap.get(ip)

  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return false
  }

  if (entry.count >= RATE_LIMIT) return true

  entry.count++
  return false
}

export async function POST(req: NextRequest) {
  // Rate limit by IP
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a minute before trying again.' },
      { status: 429 },
    )
  }

  let body: ContactPayload
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request body.' }, { status: 400 })
  }

  const { name, email, subject, message } = body

  // Server-side validation
  if (!name?.trim() || !email?.trim() || !subject?.trim() || !message?.trim()) {
    return NextResponse.json({ error: 'All fields are required.' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address.' }, { status: 400 })
  }

  if (name.length > 100 || subject.length > 200 || message.length > 2000) {
    return NextResponse.json({ error: 'Input exceeds maximum length.' }, { status: 400 })
  }

  try {
    // Store submission in Firestore
    await addDoc(collection(db, 'contact_submissions'), {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      ip,
      status: 'new',
      createdAt: serverTimestamp(),
    })

    // TODO: Add email notification here using Resend, SendGrid, or similar.
    // Example with Resend:
    //   const resend = new Resend(process.env.RESEND_API_KEY)
    //   await resend.emails.send({
    //     from: 'noreply@kindercode.com',
    //     to: 'support@kindercode.com',
    //     subject: `New contact: ${subject}`,
    //     html: `<p>From: ${name} (${email})</p><p>${message}</p>`
    //   })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (err) {
    console.error('Contact form error:', err)
    return NextResponse.json(
      { error: 'Failed to send message. Please try again.' },
      { status: 500 },
    )
  }
}
