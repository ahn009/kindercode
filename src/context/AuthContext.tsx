'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react'
import {
  User,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  GoogleAuthProvider,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence,
  updateProfile,
} from 'firebase/auth'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '@/lib/firebase'

interface SignupProfile {
  name: string
  gradeLevel: string
  country: string
  language: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  signup: (email: string, password: string, profile: SignupProfile) => Promise<void>
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>
  googleLogin: () => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setLoading(false)
    })
    return unsubscribe
  }, [])

  async function signup(email: string, password: string, profile: SignupProfile) {
    const credential = await createUserWithEmailAndPassword(auth, email, password)
    const { user: newUser } = credential

    // Set display name on the Firebase Auth profile
    await updateProfile(newUser, { displayName: profile.name })

    // Persist full profile to Firestore
    await setDoc(doc(db, 'users', newUser.uid), {
      uid: newUser.uid,
      email,
      name: profile.name,
      gradeLevel: profile.gradeLevel,
      country: profile.country,
      preferredLanguage: profile.language,
      role: null,           // set during select-role
      avatar: null,         // set during onboarding
      learningStyle: null,  // set during onboarding
      goals: [],            // set during onboarding
      schoolType: null,     // set during onboarding
      onboardingComplete: false,
      streak: 0,
      points: 0,
      level: 1,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
  }

  async function login(email: string, password: string, rememberMe = true) {
    const persistence = rememberMe
      ? browserLocalPersistence
      : browserSessionPersistence
    await setPersistence(auth, persistence)
    await signInWithEmailAndPassword(auth, email, password)
  }

  async function googleLogin() {
    const provider = new GoogleAuthProvider()
    const credential = await signInWithPopup(auth, provider)
    const { user: googleUser } = credential

    // Create Firestore document on first Google login (setDoc with merge is idempotent)
    await setDoc(
      doc(db, 'users', googleUser.uid),
      {
        uid: googleUser.uid,
        email: googleUser.email,
        name: googleUser.displayName ?? googleUser.email?.split('@')[0] ?? 'Coder',
        gradeLevel: null,
        country: null,
        preferredLanguage: 'en',
        role: null,
        avatar: null,
        learningStyle: null,
        goals: [],
        schoolType: null,
        onboardingComplete: false,
        streak: 0,
        points: 0,
        level: 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }, // won't overwrite if document already exists
    )
  }

  async function logout() {
    await signOut(auth)
  }

  async function resetPassword(email: string) {
    await sendPasswordResetEmail(auth, email)
  }

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, googleLogin, logout, resetPassword }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider')
  }
  return context
}
