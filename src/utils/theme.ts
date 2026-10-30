/**
 * Color Themes Configuration & Management for Bajitpur Samity Dhaka
 */

import { ThemeConfig } from '../types';

export const THEME_STORAGE_KEY = 'bajitpur_samity_theme_v1';

export const THEME_PRESETS: ThemeConfig[] = [
  {
    id: 'emerald',
    name: 'এমারেল্ড ও গোল্ড (ঐতিহ্যবাহী)',
    primary: '#047857',
    primaryDark: '#064e3b',
    primaryLight: '#ecfdf5',
    primaryBorder: '#a7f3d0',
    accent: '#f59e0b',
    accentGlow: '#fbbf24',
    accentHover: '#d97706',
    accentLight: '#fef3c7',
    headerGradient: 'linear-gradient(135deg, #064e3b 0%, #0f766e 50%, #0f172a 100%)',
    headerBorder: '#065f46',
  },
  {
    id: 'royal-blue',
    name: 'রয়েল ব্লু ও গোল্ড (মর্যাদাপূর্ণ)',
    primary: '#1d4ed8',
    primaryDark: '#1e3a8a',
    primaryLight: '#eff6ff',
    primaryBorder: '#bfdbfe',
    accent: '#f59e0b',
    accentGlow: '#fbbf24',
    accentHover: '#d97706',
    accentLight: '#fef3c7',
    headerGradient: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 50%, #0f172a 100%)',
    headerBorder: '#1d4ed8',
  },
  {
    id: 'deep-teal',
    name: 'ডিপ টিল ও সানশাইন (আধুনিক)',
    primary: '#0f766e',
    primaryDark: '#134e4a',
    primaryLight: '#f0fdfa',
    primaryBorder: '#99f6e4',
    accent: '#eab308',
    accentGlow: '#facc15',
    accentHover: '#ca8a04',
    accentLight: '#fef9c3',
    headerGradient: 'linear-gradient(135deg, #134e4a 0%, #0e7490 50%, #0f172a 100%)',
    headerBorder: '#0f766e',
  },
  {
    id: 'maroon',
    name: 'ক্লাসিক মেরুন ও গোল্ড (আভিজাত্য)',
    primary: '#9f1239',
    primaryDark: '#881337',
    primaryLight: '#fff1f2',
    primaryBorder: '#fecdd3',
    accent: '#f59e0b',
    accentGlow: '#fbbf24',
    accentHover: '#d97706',
    accentLight: '#fef3c7',
    headerGradient: 'linear-gradient(135deg, #881337 0%, #701a75 50%, #0f172a 100%)',
    headerBorder: '#9f1239',
  },
  {
    id: 'forest',
    name: 'ফরেস্ট পাইন ও ব্রোঞ্জ (শান্ত ও সুদৃঢ়)',
    primary: '#15803d',
    primaryDark: '#14532d',
    primaryLight: '#f0fdf4',
    primaryBorder: '#bbf7d0',
    accent: '#ca8a04',
    accentGlow: '#eab308',
    accentHover: '#a16207',
    accentLight: '#fef9c3',
    headerGradient: 'linear-gradient(135deg, #14532d 0%, #166534 50%, #092c15 100%)',
    headerBorder: '#166534',
  },
  {
    id: 'royal-purple',
    name: 'রয়েল পার্পল ও গোল্ড (রাজকীয়)',
    primary: '#6d28d9',
    primaryDark: '#3b0764',
    primaryLight: '#faf5ff',
    primaryBorder: '#e9d5ff',
    accent: '#f59e0b',
    accentGlow: '#fbbf24',
    accentHover: '#d97706',
    accentLight: '#fef3c7',
    headerGradient: 'linear-gradient(135deg, #3b0764 0%, #581c87 50%, #0f172a 100%)',
    headerBorder: '#581c87',
  },
  {
    id: 'charcoal',
    name: 'চারকোল ও এম্বার (মডার্ন ডার্ক)',
    primary: '#334155',
    primaryDark: '#0f172a',
    primaryLight: '#f8fafc',
    primaryBorder: '#cbd5e1',
    accent: '#f97316',
    accentGlow: '#fb923c',
    accentHover: '#ea580c',
    accentLight: '#ffedd5',
    headerGradient: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)',
    headerBorder: '#334155',
  },
  {
    id: 'indigo',
    name: 'নেভি ইন্ডিগো ও সিয়ান (কর্পোরেট)',
    primary: '#4338ca',
    primaryDark: '#1e1b4b',
    primaryLight: '#eef2ff',
    primaryBorder: '#c7d2fe',
    accent: '#06b6d4',
    accentGlow: '#22d3ee',
    accentHover: '#0891b2',
    accentLight: '#cffafe',
    headerGradient: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #0369a1 100%)',
    headerBorder: '#3730a3',
  },
];

export const DEFAULT_THEME = THEME_PRESETS[0];

/**
 * Adjust hex color brightness
 */
function adjustBrightness(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  return (
    '#' +
    (
      0x1000000 +
      (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 1 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

/**
 * Generate a complete ThemeConfig from custom primary & accent colors
 */
export function createCustomTheme(primaryHex: string, accentHex: string): ThemeConfig {
  const primaryDark = adjustBrightness(primaryHex, -35);
  const primaryBorder = adjustBrightness(primaryHex, 45);
  const accentHover = adjustBrightness(accentHex, -15);
  const accentGlow = adjustBrightness(accentHex, 20);

  return {
    id: 'custom',
    name: 'কাস্টম কালার প্যালেট',
    primary: primaryHex,
    primaryDark: primaryDark,
    primaryLight: adjustBrightness(primaryHex, 85),
    primaryBorder: primaryBorder,
    accent: accentHex,
    accentGlow: accentGlow,
    accentHover: accentHover,
    accentLight: adjustBrightness(accentHex, 80),
    headerGradient: `linear-gradient(135deg, ${primaryDark} 0%, ${primaryHex} 60%, #0f172a 100%)`,
    headerBorder: primaryDark,
    isCustom: true,
  };
}

export function getCachedTheme(): ThemeConfig {
  if (typeof window === 'undefined') return DEFAULT_THEME;
  try {
    const raw = localStorage.getItem(THEME_STORAGE_KEY);
    if (!raw) return DEFAULT_THEME;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.primary && parsed.headerGradient) {
      return parsed;
    }
  } catch (e) {
    console.error('Failed to load theme from cache', e);
  }
  return DEFAULT_THEME;
}

export function cacheTheme(theme: ThemeConfig): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(theme));
    applyThemeToDocument(theme);
  } catch (e) {
    console.error('Failed to cache theme', e);
  }
}

/**
 * Injects CSS variables onto :root to allow global styles to dynamically follow the theme
 */
export function applyThemeToDocument(theme: ThemeConfig): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  root.style.setProperty('--theme-primary', theme.primary);
  root.style.setProperty('--theme-primary-dark', theme.primaryDark);
  root.style.setProperty('--theme-primary-light', theme.primaryLight);
  root.style.setProperty('--theme-primary-border', theme.primaryBorder);
  root.style.setProperty('--theme-accent', theme.accent);
  root.style.setProperty('--theme-accent-glow', theme.accentGlow);
  root.style.setProperty('--theme-accent-hover', theme.accentHover);
  root.style.setProperty('--theme-accent-light', theme.accentLight);
  root.style.setProperty('--theme-header-bg', theme.headerGradient);
  root.style.setProperty('--theme-header-border', theme.headerBorder);
}
