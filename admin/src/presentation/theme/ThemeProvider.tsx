import { createContext, useContext, useEffect, useMemo, useState } from 'react';

export interface ThemePreset {
  id: string;
  name: string;
  subtitle: string;
  mode: 'light' | 'dark';
  brandHex: string;
  secondaryHex: string;
  canvasRgb?: string;
}

export type FontScaleId = 'default' | 'comfortable' | 'large';

export interface FontScaleOption {
  id: FontScaleId;
  label: string;
  px: number;
  desc: string;
}

export const FONT_SCALE_OPTIONS: FontScaleOption[] = [
  { id: 'default', label: 'Chuẩn 16px', px: 16, desc: 'Tỷ lệ chuẩn SaaS (WCAG AA)' },
  { id: 'comfortable', label: 'Thoáng 17px', px: 17, desc: 'Rộng rãi cho màn 2K / Ultrawide' },
  { id: 'large', label: 'Lớn 18px', px: 18, desc: 'Tối ưu đọc dài & màn 4K' },
];

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'nordic-cobalt',
    name: 'Nordic Cobalt',
    subtitle: 'Mercury / Stripe · Xám bạc & Xanh Cobalt',
    mode: 'light',
    brandHex: '#2563EB',
    secondaryHex: '#0EA5E9',
    canvasRgb: '244 246 249',
  },
  {
    id: 'graphite-mono',
    name: 'Graphite Mono',
    subtitle: 'Linear / Vercel · Đơn sắc Đen & Bạc',
    mode: 'light',
    brandHex: '#18181B',
    secondaryHex: '#64748B',
    canvasRgb: '246 247 248',
  },
  {
    id: 'alpine-emerald',
    name: 'Alpine Emerald',
    subtitle: 'Wise / Ramp · Sương trắng & Ngọc lục bảo',
    mode: 'light',
    brandHex: '#059669',
    secondaryHex: '#0D9488',
    canvasRgb: '243 247 245',
  },
  {
    id: 'royal-indigo',
    name: 'Slate Indigo',
    subtitle: 'Attio / Raycast · Trắng lạnh & Chàm trầm',
    mode: 'light',
    brandHex: '#4F46E5',
    secondaryHex: '#0284C7',
    canvasRgb: '244 245 250',
  },
  {
    id: 'obsidian-dark',
    name: 'Obsidian Dark',
    subtitle: 'Dark Glass · Đen tuyền & Cobalt',
    mode: 'dark',
    brandHex: '#3B82F6',
    secondaryHex: '#38BDF8',
    canvasRgb: '10 13 20',
  },
  {
    id: 'aurum-gold',
    name: 'Aurum Black & Gold',
    subtitle: 'Private Wealth · Đen tuyền & Vàng kim 24K',
    mode: 'dark',
    brandHex: '#D4AF37',
    secondaryHex: '#F59E0B',
    canvasRgb: '9 9 12',
  },
];

const STORAGE_KEY = 'landinghub:theme-tokens:v1';

interface StoredThemeState {
  presetId: string;
  customHex: string | null;
  mode: 'light' | 'dark';
  fontScale?: FontScaleId;
}

interface ThemeContextValue {
  presetId: string;
  mode: 'light' | 'dark';
  activeHex: string;
  fontScale: FontScaleId;
  presets: ThemePreset[];
  fontScales: FontScaleOption[];
  selectPreset: (id: string) => void;
  setCustomHex: (hex: string) => void;
  toggleMode: () => void;
  setFontScale: (scale: FontScaleId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '').trim();
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map(c => c + c)
          .join('')
      : clean.padEnd(6, '0').slice(0, 6);
  const num = parseInt(full, 16);
  return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
}

function clampByte(n: number): number {
  return Math.max(0, Math.min(255, Math.round(n)));
}

function shadeRgb([r, g, b]: [number, number, number], factor: number): string {
  return `${clampByte(r * factor)} ${clampByte(g * factor)} ${clampByte(b * factor)}`;
}

function applyTokensToRoot(state: StoredThemeState) {
  const root = document.documentElement;
  const preset = THEME_PRESETS.find(p => p.id === state.presetId) ?? THEME_PRESETS[0];
  const scaleOpt =
    FONT_SCALE_OPTIONS.find(f => f.id === (state.fontScale ?? 'default')) ?? FONT_SCALE_OPTIONS[0];

  const primaryHex = state.customHex ?? preset.brandHex;
  const [r, g, b] = hexToRgb(primaryHex);
  const [sr, sg, sb] = state.customHex
    ? [clampByte(r * 0.65 + 40), clampByte(g * 0.75 + 55), clampByte(b * 0.85 + 35)]
    : hexToRgb(preset.secondaryHex);

  root.setAttribute('data-mode', state.mode);
  root.style.setProperty('--base-font-size', `${scaleOpt.px}px`);

  if (state.mode === 'light' && preset.canvasRgb && !state.customHex) {
    root.style.setProperty('--canvas', preset.canvasRgb);
  } else {
    root.style.removeProperty('--canvas');
  }

  // Single-point Brand Tokens applied to :root
  root.style.setProperty('--brand', `${r} ${g} ${b}`);
  root.style.setProperty(
    '--brand-strong',
    state.mode === 'dark' ? shadeRgb([r, g, b], 0.88) : shadeRgb([r, g, b], 0.82),
  );
  root.style.setProperty('--brand-secondary', `${sr} ${sg} ${sb}`);

  // WCAG contrast check for text inside solid primary button (Gold/Yellow uses dark obsidian ink)
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  root.style.setProperty('--brand-fg', luminance > 0.60 ? '15 23 42' : '255 255 255');
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoredThemeState>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as StoredThemeState;
        if (parsed.presetId) {
          return {
            ...parsed,
            fontScale: parsed.fontScale ?? 'default',
          };
        }
      }
    } catch {
      // ignore corrupted storage
    }
    return { presetId: 'nordic-cobalt', customHex: null, mode: 'light', fontScale: 'default' };
  });

  useEffect(() => {
    applyTokensToRoot(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const value = useMemo<ThemeContextValue>(() => {
    const preset = THEME_PRESETS.find(p => p.id === state.presetId) ?? THEME_PRESETS[0];
    return {
      presetId: state.presetId,
      mode: state.mode,
      activeHex: state.customHex ?? preset.brandHex,
      fontScale: state.fontScale ?? 'default',
      presets: THEME_PRESETS,
      fontScales: FONT_SCALE_OPTIONS,
      selectPreset: (id: string) => {
        const next = THEME_PRESETS.find(p => p.id === id) ?? THEME_PRESETS[0];
        setState(prev => ({
          ...prev,
          presetId: next.id,
          customHex: null,
          mode: next.mode,
        }));
      },
      setCustomHex: (hex: string) => {
        setState(prev => ({ ...prev, customHex: hex }));
      },
      toggleMode: () => {
        setState(prev => ({ ...prev, mode: prev.mode === 'light' ? 'dark' : 'light' }));
      },
      setFontScale: (scale: FontScaleId) => {
        setState(prev => ({ ...prev, fontScale: scale }));
      },
    };
  }, [state]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useThemeTokens(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useThemeTokens must be used within ThemeProvider');
  }
  return ctx;
}
