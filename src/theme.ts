import { useColorScheme } from 'react-native';

import type { Category } from './data/whys';

const light = {
  background: '#F7F5F2',
  card: '#FFFFFF',
  text: '#1C1B1F',
  muted: '#6B6870',
  border: '#E6E2DC',
  accent: '#5B4FE0',
  accentText: '#FFFFFF',
  accentSoft: '#ECEAFD',
  danger: '#C62F3D',
  warning: '#9A5B00',
  warningSoft: '#FFF1D6',
};

export type Palette = typeof light;

const dark: Palette = {
  background: '#121116',
  card: '#1D1C22',
  text: '#F2F0F5',
  muted: '#A19DA8',
  border: '#2E2C35',
  accent: '#9C93FF',
  accentText: '#121116',
  accentSoft: '#2A2748',
  danger: '#FF6B76',
  warning: '#F5B95A',
  warningSoft: '#3A2D14',
};

export const CATEGORY_COLORS: Record<Category, string> = {
  Nature: '#2E9E5B',
  Body: '#D9485F',
  Space: '#4C6FE0',
  Everyday: '#D98A1E',
  Culture: '#9B51C9',
};

export const CATEGORY_ICONS: Record<Category, 'leaf' | 'heart' | 'planet' | 'cafe' | 'library'> = {
  Nature: 'leaf',
  Body: 'heart',
  Space: 'planet',
  Everyday: 'cafe',
  Culture: 'library',
};

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}
