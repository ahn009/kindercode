'use client'

import { useEffect, useState } from 'react'

type Role = 'student' | 'teacher' | 'school-admin' | null

/**
 * Reads the role stored by the select-role page via sessionStorage.
 * Returns null during SSR and until the client mounts.
 * Clears the stored value after reading so it isn't stale on back-navigation.
 */
export function useSelectedRole(clearAfterRead = false): Role {
  const [role, setRole] = useState<Role>(null)

  useEffect(() => {
    const stored = sessionStorage.getItem('selectedRole') as Role | null
    if (stored) {
      setRole(stored)
      if (clearAfterRead) {
        sessionStorage.removeItem('selectedRole')
      }
    }
  }, [clearAfterRead])

  return role
}
