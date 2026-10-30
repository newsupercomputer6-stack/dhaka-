import { OrgProfile } from '../types';
import { DEFAULT_ORG_PROFILE } from '../data/initialOrgProfile';

const ORG_STORAGE_KEY = 'bajitpur_samity_profile_v1';

export function getCachedOrgProfile(): OrgProfile {
  try {
    const raw = localStorage.getItem(ORG_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed.name === 'string') {
        return {
          ...DEFAULT_ORG_PROFILE,
          ...parsed,
        };
      }
    }
  } catch (e) {
    console.error('Error reading org profile from localStorage', e);
  }
  return DEFAULT_ORG_PROFILE;
}

export function cacheOrgProfile(profile: OrgProfile): void {
  try {
    localStorage.setItem(ORG_STORAGE_KEY, JSON.stringify(profile));
  } catch (e) {
    console.error('Error saving org profile to localStorage', e);
  }
}

export async function fetchOrgProfile(): Promise<OrgProfile> {
  try {
    const res = await fetch('/api/organization');
    if (res.ok) {
      const data = await res.json();
      if (data && typeof data.name === 'string') {
        const fullProfile = { ...DEFAULT_ORG_PROFILE, ...data };
        cacheOrgProfile(fullProfile);
        return fullProfile;
      }
    }
  } catch (e) {
    // Fallback to local
  }
  return getCachedOrgProfile();
}

export async function saveOrgProfileApi(profile: OrgProfile): Promise<OrgProfile> {
  cacheOrgProfile(profile);
  try {
    const res = await fetch('/api/organization', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profile),
    });
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (e) {
    console.error('Failed to sync org profile to server, cached locally', e);
  }
  return profile;
}
