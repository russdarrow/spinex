import { useEffect, useState } from 'react';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, useRouter, useSegments } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/lib/useColorScheme';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '@/lib/auth-context';

const ONBOARDING_KEY = '@spinex_onboarding_complete';

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function useOnboardingCheck() {
  const [isOnboardingLoading, setIsOnboardingLoading] = useState(true);
  const [hasCompletedOnboarding, setHasCompletedOnboarding] = useState(false);
  const { user, isLoading: isAuthLoading, isConfigured } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    async function checkOnboarding() {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY);
        console.log('[Onboarding] Check value:', value);
        setHasCompletedOnboarding(value === 'true');
      } catch (e) {
        console.log('[Onboarding] Error:', e);
        setHasCompletedOnboarding(false);
      } finally {
        setIsOnboardingLoading(false);
        await SplashScreen.hideAsync();
      }
    }
    checkOnboarding();
  }, []);

  useEffect(() => {
    if (isOnboardingLoading || isAuthLoading) return;

    const inOnboarding = segments[0] === 'onboarding';
    const inAuth = segments[0] === 'login' || segments[0] === 'signup';
    const inProtectedRoute = segments[0] === '(tabs)' || segments[0] === 'compose' || segments[0] === 'edit-profile' || segments[0] === 'post';

    // First check onboarding
    if (!hasCompletedOnboarding && !inOnboarding) {
      router.replace('/onboarding');
      return;
    }

    // If onboarding complete, check auth (only if Supabase is configured)
    if (hasCompletedOnboarding && isConfigured) {
      if (!user && !inAuth && !inOnboarding) {
        // Not logged in, redirect to login
        router.replace('/login');
      } else if (user && inAuth) {
        // Logged in but on auth screen, go to main app
        router.replace('/(tabs)');
      }
    } else if (hasCompletedOnboarding && !isConfigured && inOnboarding) {
      // Supabase not configured, just go to tabs after onboarding
      router.replace('/(tabs)');
    }
  }, [isOnboardingLoading, isAuthLoading, hasCompletedOnboarding, user, segments, router, isConfigured]);

  return { isLoading: isOnboardingLoading || isAuthLoading, hasCompletedOnboarding };
}

function RootLayoutNav({ colorScheme }: { colorScheme: 'light' | 'dark' | null | undefined }) {
  useOnboardingCheck();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="login" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="signup" options={{ headerShown: false, animation: 'fade' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="compose" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="edit-profile" options={{ presentation: 'modal', headerShown: false }} />
        <Stack.Screen name="post/[id]" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
      </Stack>
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardProvider>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
            <RootLayoutNav colorScheme={colorScheme} />
          </KeyboardProvider>
        </GestureHandlerRootView>
      </AuthProvider>
    </QueryClientProvider>
  );
}
