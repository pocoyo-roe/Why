import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { BookingsProvider } from '../store/BookingsStore';
import { usePalette } from '../theme';

export default function RootLayout() {
  const scheme = useColorScheme();
  const palette = usePalette();
  const base = scheme === 'dark' ? DarkTheme : DefaultTheme;
  const theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: palette.accent,
      background: palette.background,
      card: palette.background,
      text: palette.text,
      border: palette.border,
    },
  };

  return (
    <BookingsProvider>
      <ThemeProvider value={theme}>
        <Stack screenOptions={{ headerShadowVisible: false, headerBackButtonDisplayMode: 'minimal' }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="book/[id]" options={{ title: 'Book' }} />
          <Stack.Screen name="booking/[id]" options={{ title: 'Your booking' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </BookingsProvider>
  );
}
