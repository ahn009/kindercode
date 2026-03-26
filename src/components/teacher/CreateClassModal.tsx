'use client'

import { useState } from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface CreatedClass {
  id: string
  name: string
  grade: string
  section: string
  studentCount: number
  activeStudents: number
  averageProgress: number
}

interface CreateClassModalProps {
  isOpen: boolean
  onClose: () => void
  teacherId: string
  schoolId: string
  onSuccess: (newClass: CreatedClass) => void
}

export default function CreateClassModal({
  isOpen,
  onClose,
  teacherId,
  schoolId,
  onSuccess,
}: CreateClassModalProps) {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const [section, setSection] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !grade.trim() || !section.trim()) {
      setError('All fields are required.')
      return
    }
    setCreating(true)
    setError(null)
    try {
      const ref = await addDoc(collection(db, 'classes'), {
        name: name.trim(),
        grade: grade.trim(),
        section: section.trim(),
        teacherId,
        schoolId,
        studentCount: 0,
        activeStudents: 0,
        averageProgress: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      onSuccess({
        id: ref.id,
        name: name.trim(),
        grade: grade.trim(),
        section: section.trim(),
        studentCount: 0,
        activeStudents: 0,
        averageProgress: 0,
      })
      setName('')
      setGrade('')
      setSection('')
      onClose()
    } catch {
      setError('Failed to create class. Please try again.')
    } finally {
      setCreating(false)
    }
  }

  if (!isOpen) return null

  const fields = [
    { label: 'Class Name', value: name, setter: setName, placeholder: 'e.g. Math – Morning' },
    { label: 'Grade', value: grade, setter: setGrade, placeholder: 'e.g. Grade 5' },
    { label: 'Section', value: section, setter: setSection, placeholder: 'e.g. A' },
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0"
        style={{ background: 'rgba(0,0,0,0.28)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-3xl p-6"
        style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(20px)',
          border: '1.5px solid rgba(255,255,255,0.9)',
          boxShadow: '0 16px 56px rgba(100,80,180,0.22)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-800">Create New Class</h2>
            <p className="text-xs text-gray-400 mt-0.5">Set up a classroom for your students</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
            style={{ background: 'rgba(240,245,255,0.8)' }}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map(({ label, value, setter, placeholder }) => (
            <div key={label}>
              <label className="block text-xs font-bold text-gray-600 mb-1.5">{label}</label>
              <input
                type="text"
                value={value}
                onChange={(e) => setter(e.target.value)}
                placeholder={placeholder}
                className="w-full px-4 py-2.5 rounded-xl text-sm text-gray-800 focus:outline-none transition-all"
                style={{
                  background: 'rgba(240,245,255,0.8)',
                  border: '1.5px solid rgba(180,180,220,0.5)',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.borderColor = '#4a90e2'
                  e.currentTarget.style.boxShadow = '0 0 0 3px rgba(74,144,226,0.15)'
                }}
                onBlur={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(180,180,220,0.5)'
                  e.currentTarget.style.boxShadow = 'none'
                }}
              />
            </div>
          ))}

          {error && (
            <p className="text-xs text-red-500 flex items-center gap-1">
              <svg className="w-3.5 h-3.5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-gray-600 transition-all"
              style={{ background: 'rgba(240,245,255,0.8)', border: '1.5px solid rgba(180,180,220,0.5)' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={creating}
              className="flex-1 py-2.5 rounded-xl text-sm font-bold text-white transition-all flex items-center justify-center gap-2"
              style={{
                background: 'linear-gradient(135deg, #4a90e2, #1e88e5)',
                boxShadow: '0 4px 12px rgba(30,136,229,0.35)',
                opacity: creating ? 0.8 : 1,
              }}
            >
              {creating && (
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3" />
                  <path d="M12 2a10 10 0 0110 10" stroke="white" strokeWidth="3" strokeLinecap="round" />
                </svg>
              )}
              {creating ? 'Creating…' : 'Create Class'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
