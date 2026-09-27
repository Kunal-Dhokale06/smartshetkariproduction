import React, { useState, useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Platform } from 'react-native';
import { colors } from '../theme';
import { LanguageProvider } from '../locales/languageContext';
import { useAuth } from '../data/authStore';
import { SplashScreen } from '../components/SplashScreen';

// Inject global CSS border reset for web
if (Platform.OS === 'web' && typeof document !== 'undefined') {
  const style = document.createElement('style');
  style.innerHTML = `
    * { box-sizing: border-box; }
    input, textarea, select, button {
      outline: none !important;
      border: none !important;
      box-shadow: none !important;
      -webkit-appearance: none;
    }
    input:focus, textarea:focus, select:focus {
      outline: none !important;
      border: none !important;
      box-shadow: none !important;
    }
    [data-focusable]:focus { outline: none !important; }
  `;
  document.head.appendChild(style);
}

function AuthGate({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    // Smooth, fast branding presentation: dismiss smoothly once auth hydration finishes
    if (!isLoading) {
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isLoading || showSplash) return;

    const inAuthGroup = segments[0] === 'auth';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/auth');
    } else if (isAuthenticated && inAuthGroup) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, isLoading, showSplash, segments]);

  if (isLoading || showSplash) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <LanguageProvider>
        <StatusBar style="dark" backgroundColor={colors.background} />
        <AuthGate>
          <Stack
            screenOptions={{
              headerShown: false,
              contentStyle: { backgroundColor: colors.background },
            }}
          >
            <Stack.Screen name="auth" options={{ headerShown: false }} />
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen
              name="scan-bill"
              options={{
                headerShown: false,
                presentation: 'fullScreenModal',
              }}
            />
            <Stack.Screen
              name="drawer"
              options={{
                headerShown: false,
                presentation: 'transparentModal',
                animation: 'fade',
              }}
            />
            <Stack.Screen
              name="add-crop"
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="add-expense"
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="add-sale"
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="add-diary-note"
              options={{
                headerShown: false,
                presentation: 'modal',
              }}
            />
            <Stack.Screen
              name="profile"
              options={{
                headerShown: false,
                presentation: 'card',
              }}
            />
            <Stack.Screen
              name="deleted-crops"
              options={{
                headerShown: false,
                presentation: 'card',
              }}
            />
          </Stack>
        </AuthGate>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
