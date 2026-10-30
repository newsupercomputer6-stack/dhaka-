import { Member } from '../types';
import { ALL_MEMBERS } from '../data/members';

const STORAGE_KEY = 'bajitpur_samity_members_v1';

export function getCachedMembers(): Member[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading members from localStorage', e);
  }
  return ALL_MEMBERS;
}

export function cacheMembers(members: Member[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
  } catch (e) {
    console.error('Error caching members to localStorage', e);
  }
}

export async function fetchMembersFromServer(): Promise<Member[] | null> {
  try {
    const res = await fetch('/api/members');
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        cacheMembers(data);
        return data;
      }
    }
  } catch (e) {
    // Backend unreachable, fallback to localStorage cache
  }
  return null;
}

export async function registerNewMemberApi(newMemberData: Omit<Member, 'sl'> & { sl?: number }): Promise<Member> {
  try {
    const res = await fetch('/api/members', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMemberData),
    });
    if (res.ok) {
      const createdMember: Member = await res.json();
      // Update local cache
      const current = getCachedMembers();
      const updated = [createdMember, ...current.filter(m => m.sl !== createdMember.sl)];
      cacheMembers(updated);
      return createdMember;
    }
  } catch (e) {
    console.error('Backend registration error, fallback to local', e);
  }

  // Fallback if backend is not reachable: calculate next SL locally
  const current = getCachedMembers();
  const maxSl = current.reduce((max, m) => (m.sl > max ? m.sl : max), 0);
  const fallbackMember: Member = {
    ...newMemberData,
    sl: maxSl + 1,
  };
  const updated = [fallbackMember, ...current];
  cacheMembers(updated);
  return fallbackMember;
}
