import { storage } from "./storage"

const ADMIN_TOKEN_KEY = "campus-sarthi-admin-token"

export function setAdminToken(token: string): void {
  storage.setItem(ADMIN_TOKEN_KEY, token)
}

export function getAdminToken(): string | null {
  return storage.getItem(ADMIN_TOKEN_KEY)
}

export function clearAdminToken(): void {
  storage.removeItem(ADMIN_TOKEN_KEY)
}

export function isAuthenticated(): boolean {
  return !!getAdminToken()
}

export async function validateToken(token: string): Promise<boolean> {
  // TODO: Validate token with backend
  // For now, accept any non-empty token
  return token.length > 0
}
