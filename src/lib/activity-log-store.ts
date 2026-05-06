"use client";

export type ActivityType = 'payment_added' | 'payment_deleted' | 'client_created';

export type ActivityEntry = {
  id: string;
  type: ActivityType;
  actor: string;
  description: string;
  timestamp: string;
};

const STORAGE_KEY = 'onmid-activity-log';

// Current user is hardcoded until auth is implemented
export const CURRENT_USER = 'Matheus Campos';

export function logActivity(type: ActivityType, description: string): void {
  if (typeof window === 'undefined') return;

  const stored = window.localStorage.getItem(STORAGE_KEY);
  const entries: ActivityEntry[] = stored ? (JSON.parse(stored) as ActivityEntry[]) : [];

  entries.unshift({
    id: `log-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    actor: CURRENT_USER,
    description,
    timestamp: new Date().toISOString(),
  });

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
}

export function readActivityLog(): ActivityEntry[] {
  if (typeof window === 'undefined') return [];

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored) as ActivityEntry[];
  } catch {
    return [];
  }
}

export function clearActivityLog(): void {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(STORAGE_KEY);
}
