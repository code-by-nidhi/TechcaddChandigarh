import type { BaseEntity, User } from '../../types'
import { createHttpResource } from '../http/resource'

/**
 * Role is optional on the wire, not absent.
 *
 * The team form always sends one. It stays optional here because the API
 * defaults an omitted role to `content` — the narrower grant — so a caller
 * that forgets creates someone with less access rather than more.
 */
export type UserCreate = Omit<User, keyof BaseEntity | 'role'> & { role?: User['role'] }
export type UserUpdate = Partial<UserCreate>

/**
 * Live against the Express API.
 *
 * The API never returns password material. When a user is created without a
 * password it returns a one-time `temporaryPassword` alongside the record —
 * see `UserWithTemporaryPassword`.
 */
export const usersApi = createHttpResource<User, UserCreate, UserUpdate>('/users')

/** What `create` resolves to when the API generated a password. */
export interface UserWithTemporaryPassword extends User {
  temporaryPassword?: string
}
