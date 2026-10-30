import { Notice } from '../types';
import { INITIAL_NOTICES } from '../data/initialNotices';

const NOTICES_STORAGE_KEY = 'bajitpur_samity_notices_v1';

export function getCachedNotices(): Notice[] {
  try {
    const raw = localStorage.getItem(NOTICES_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading notices from localStorage', e);
  }
  return INITIAL_NOTICES;
}

export function cacheNotices(notices: Notice[]): void {
  try {
    localStorage.setItem(NOTICES_STORAGE_KEY, JSON.stringify(notices));
  } catch (e) {
    console.error('Error saving notices to localStorage', e);
  }
}

export async function fetchNotices(): Promise<Notice[]> {
  try {
    const res = await fetch('/api/notices');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        cacheNotices(data);
        return data;
      }
    }
  } catch (e) {
    // Backend unreachable, fallback to localStorage cache
  }
  return getCachedNotices();
}

export async function saveNewNotice(newNotice: Notice): Promise<Notice> {
  try {
    const res = await fetch('/api/notices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newNotice),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    // If backend fails, return the new notice for local state
  }
  return newNotice;
}

export async function updateNotice(updated: Notice): Promise<Notice> {
  try {
    const res = await fetch(`/api/notices/${updated.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updated),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    // Fallback to local
  }
  return updated;
}

export async function deleteNoticeApi(noticeId: string): Promise<boolean> {
  try {
    const res = await fetch(`/api/notices/${noticeId}`, {
      method: 'DELETE',
    });
    return res.ok;
  } catch (e) {
    return true;
  }
}
