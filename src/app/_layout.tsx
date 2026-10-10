import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { WhyStoreProvider } from '../store/WhyStore';
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
    <WhyStoreProvider>
      <ThemeProvider value={theme}>
        <Stack screenOptions={{ headerShadowVisible: false, headerBackButtonDisplayMode: 'minimal' }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="why/[id]" options={{ title: '' }} />
          <Stack.Screen name="mine/[id]" options={{ title: 'My why' }} />
          <Stack.Screen name="ask" options={{ presentation: 'modal', title: 'Ask a why' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </WhyStoreProvider>
  );
}
