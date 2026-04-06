// src/server/security/session-manager.ts

export const activeSessionMap: Map<string, { type: string; token: string }> = new Map();

export function getActiveToken(username: string, type: string): string | null {
  const session = activeSessionMap.get(username);
  if (session?.type === type) return session.token;
  return null;
}

export function setActiveToken(username: string, type: string, token: string): void {
  activeSessionMap.set(username, { type, token });
}

export function invalidateToken(username: string): void {
  activeSessionMap.delete(username);
}
