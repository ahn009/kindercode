import { db } from '@/lib/firebase'
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  serverTimestamp,
  arrayUnion,
} from 'firebase/firestore'

export interface UserProfile {
  uid: string
  name: string
  email: string
  role: string
  schoolId?: string
  schoolName?: string
  children?: string[]
  notificationSettings?: NotificationSettings
}

export interface StudentProfile {
  id: string
  name: string
  grade: string
  subject?: string
  teacher?: string
  school?: string
  accessCode?: string
  parentId?: string
  level?: number
  totalPoints?: number
}

export interface TeacherProfile {
  id: string
  name: string
  email: string
  schoolId?: string
  teacherStatus?: string
}

export interface JoinRequest {
  id: string
  teacherUid: string
  teacherName?: string
  teacherEmail?: string
  schoolId: string
  status: string
  createdAt?: Date | null
}

export interface SchoolStats {
  teacherCount: number
  studentCount: number
  classCount: number
}

export interface NotificationSettings {
  weeklyReport: boolean
  dailyActivity: boolean
  teacherNotes: boolean
  achievements: boolean
}

export async function fetchUserProfile(uid: string): Promise<UserProfile | null> {
  try {
    const snap = await getDoc(doc(db, 'users', uid))
    if (!snap.exists()) return null
    return { uid, ...snap.data() } as UserProfile
  } catch {
    return null
  }
}

export async function fetchChildren(parentId: string): Promise<StudentProfile[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'students'), where('parentId', '==', parentId))
    )
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as StudentProfile))
  } catch {
    return []
  }
}

export async function fetchSchoolTeachers(schoolId: string): Promise<TeacherProfile[]> {
  try {
    const snap = await getDocs(
      query(collection(db, 'users'), where('schoolId', '==', schoolId), where('role', '==', 'teacher'))
    )
    return snap.docs.map((d) => ({ id: d.id, ...d.data() } as TeacherProfile))
  } catch {
    return []
  }
}

export async function fetchSchoolStats(schoolId: string): Promise<SchoolStats> {
  try {
    const [teachersSnap, studentsSnap, classesSnap] = await Promise.all([
      getDocs(query(collection(db, 'users'), where('schoolId', '==', schoolId), where('role', '==', 'teacher'))),
      getDocs(query(collection(db, 'users'), where('schoolId', '==', schoolId), where('role', '==', 'student'))),
      getDocs(query(collection(db, 'classes'), where('schoolId', '==', schoolId))),
    ])
    return {
      teacherCount: teachersSnap.size,
      studentCount: studentsSnap.size,
      classCount: classesSnap.size,
    }
  } catch {
    return { teacherCount: 0, studentCount: 0, classCount: 0 }
  }
}

export async function fetchPendingJoinRequests(schoolId: string): Promise<JoinRequest[]> {
  try {
    const snap = await getDocs(
      query(
        collection(db, 'teacherJoinRequests'),
        where('schoolId', '==', schoolId),
        where('status', '==', 'PENDING')
      )
    )
    return snap.docs.map((d) => {
      const data = d.data()
      return {
        id: d.id,
        teacherUid: data.teacherUid ?? '',
        teacherName: data.teacherName ?? data.name ?? '',
        teacherEmail: data.teacherEmail ?? data.email ?? '',
        schoolId: data.schoolId ?? schoolId,
        status: data.status ?? 'PENDING',
        createdAt: data.createdAt?.toDate?.() ?? null,
      } as JoinRequest
    })
  } catch {
    return []
  }
}

export async function approveTeacherRequest(
  requestId: string,
  teacherUid: string,
  schoolId: string,
  schoolName: string
): Promise<void> {
  await Promise.all([
    updateDoc(doc(db, 'teacherJoinRequests', requestId), {
      status: 'APPROVED',
      updatedAt: serverTimestamp(),
    }),
    updateDoc(doc(db, 'users', teacherUid), {
      teacherStatus: 'ACTIVE',
      role: 'teacher',
      schoolId,
      schoolName,
      updatedAt: serverTimestamp(),
    }),
  ])
}

export async function rejectTeacherRequest(requestId: string): Promise<void> {
  await updateDoc(doc(db, 'teacherJoinRequests', requestId), {
    status: 'REJECTED',
    updatedAt: serverTimestamp(),
  })
}

export async function linkChildToParent(
  parentUid: string,
  studentId: string
): Promise<void> {
  await Promise.all([
    updateDoc(doc(db, 'users', parentUid), {
      children: arrayUnion(studentId),
      updatedAt: serverTimestamp(),
    }),
    updateDoc(doc(db, 'students', studentId), {
      parentId: parentUid,
      updatedAt: serverTimestamp(),
    }),
  ])
}
