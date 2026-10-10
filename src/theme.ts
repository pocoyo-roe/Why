import { useColorScheme } from 'react-native';

const light = {
  background: '#F6F1EB',
  card: '#FFFFFF',
  text: '#231A15',
  muted: '#76685E',
  border: '#E6DCD1',
  accent: '#B5532A',
  accentText: '#FFFFFF',
  accentSoft: '#F6E3D8',
  success: '#2F7D4F',
  successSoft: '#DDF0E3',
  danger: '#B3261E',
  warningSoft: '#FFF0D4',
  warning: '#8A5300',
};

export type Palette = typeof light;

const dark: Palette = {
  background: '#16110E',
  card: '#221B17',
  text: '#F4ECE5',
  muted: '#AE9F93',
  border: '#382D26',
  accent: '#F08A5D',
  accentText: '#16110E',
  accentSoft: '#3B241A',
  success: '#7FD39D',
  successSoft: '#1D3326',
  danger: '#FF8A80',
  warningSoft: '#3A2B12',
  warning: '#F5C063',
};

export function usePalette(): Palette {
  return useColorScheme() === 'dark' ? dark : light;
}
