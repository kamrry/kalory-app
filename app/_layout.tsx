import React from 'react';
import 'react-native-gesture-handler';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router } from 'expo-router';
import { StatusBar, useColorScheme } from 'react-native';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { useConfigStore, useDiaryStore } from '../utils/state';
import OnboardingStart from './onboarding';
import 'react-native-reanimated';
import { useTranslation } from '@/i18n';
import { initPurchases, hasProAccess } from '@/utils/purchases';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};


SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf')
  });

  const { createSnapshotsForPastEntries } = useDiaryStore();

  useEffect(() => {
    if (loaded) {
      // Wrap everything in try-catch to prevent crashes
      const init = async () => {
        // Temporarily skip initPurchases to prevent potential crash
        // try {
        //   await initPurchases();
        // } catch (e) {
        //   console.error('initPurchases error:', e);
        // }
        try {
          SplashScreen.hideAsync();
        } catch (e) {
          console.error('hideAsync error:', e);
        }
        try {
          createSnapshotsForPastEntries();
        } catch (e) {
          console.error('createSnapshotsForPastEntries error:', e);
        }
      };
      init();
    }
  }, [loaded]);

  // Temporary: skip pro check to prevent potential crash. Can re-enable later.
  // const checkProStatus = async () => {
  //   try {
  //     const proAccess = await hasProAccess();
  //     if (!proAccess) {
  //       router.replace('/paywall');
  //     }
  //   } catch (e) {
  //     console.error('checkProStatus error:', e);
  //   }
  // };
  const checkProStatus = async () => {
    // Skip for now - can re-enable after testing
    console.log('Skipping pro check to prevent crash');
  };

  const { completedOnboarding } = useConfigStore();

  if (!loaded) {
    return null;
  }

  if (!completedOnboarding) {
    return (
      <OnboardingStart />
    )
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false, title: '' }} />
        <Stack.Screen name="food/[id]" options={{
          presentation: 'modal',
          headerLargeTitle: true
        }} />
        <Stack.Screen name="ai-settings" options={{
          headerTitle: t('settings.aiSettings'),
          headerLargeTitle: true
        }}
        />
        <Stack.Screen name="language" options={{
          headerTitle: t('settings.language'),
          headerLargeTitle: true
        }}
        />
        <Stack.Screen name="notification-settings" options={{
          headerTitle: t('settings.notifications'),
          headerLargeTitle: true
        }}
        />
        <Stack.Screen name="food-database" options={{
          headerTitle: t('settings.foodDatabase'),
          headerLargeTitle: true
        }}
        />
        <Stack.Screen name="ai-scanner" options={{
          headerTitle: 'Ai Scanner',
        }}
        />
        <Stack.Screen name="paywall" options={{
          presentation: 'modal',
          headerShown: false,
        }}
        />
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar />
    </ThemeProvider>
  );
}
