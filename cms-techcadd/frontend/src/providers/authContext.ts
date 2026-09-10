import { createContext } from 'react'

import type { Session } from '../api/resources/auth'
import type { UserRole } from '../types'

/** Coarse permissions. The server must enforce these too — hiding UI is not security. */
export type Permission = 'manage-users' | 'manage-settings' | 'delete-content' | 'publish-content'

/**
 * What each role may do, beyond which sections it can open.
 *
 * Section-level access is `config/access.ts`; this is the finer grain inside a
 * section a role already has — who may publish, who may delete, who may change
 * the team. A counsellor holds none of these because they reach no content
 * module in the first place.
 *
 * Adding and removing people is admin-only, which is what stops a team member
 * removing another one or an admin. The API enforces it; this only hides the
 * buttons.
 */
const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: ['manage-users', 'manage-settings', 'delete-content', 'publish-content'],
  content: ['delete-content', 'publish-content'],
  counsellor: [],
}

export function roleAllows(role: UserRole, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false
}

/**
 * `loading` exists because the session now lives in an httpOnly cookie, so it
 * can only be resolved by asking the server. Without this state the app would
 * flash the login screen on every refresh before `/auth/me` came back.
 */
export type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

export interface AuthContextValue {
  session: Session | null
  status: AuthStatus
  login(identifier: string, password: string): Promise<void>
  logout(): Promise<void>
  can(permission: Permission): boolean
}

/** Separate module so `AuthProvider.tsx` exports only a component. */
export const AuthContext = createContext<AuthContextValue | null>(null)
