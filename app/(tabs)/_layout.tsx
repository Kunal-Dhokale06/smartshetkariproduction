import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, BackHandler, Platform } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomBar } from '../../components/BottomBar';
import { colors } from '../../theme';

const VALID_TAB_NAMES = new Set([
  'index',
  'crops',
  'expenses',
  'sales',
  'reports',
  'diary',
  'budget',
  'ai-assistant',
  'analytics',
  'settings',
]);

function isTabRoute(path: string): boolean {
  if (!path || path === '/' || path === '/(tabs)' || path === '/(tabs)/index') return true;
  const parts = path.split('/').filter(Boolean);
  const routeName = parts[parts.length - 1];
  return VALID_TAB_NAMES.has(routeName);
}

function normalizeTabPath(path: string): string {
  if (!path || path === '/' || path === '/(tabs)' || path === '/(tabs)/index') {
    return '/(tabs)';
  }
  const clean = path.replace(/^\/\(tabs\)/, '');
  return `/(tabs)${clean.startsWith('/') ? clean : `/${clean}`}`;
}

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();
  const tabHistoryRef = useRef<string[]>(['/(tabs)']);

  // Track tab navigation history for smooth Android Back navigation
  useEffect(() => {
    if (!isTabRoute(pathname)) {
      // User is currently viewing a modal or stack screen outside tabs (e.g. /add-crop, /profile)
      return;
    }

    const currentTab = normalizeTabPath(pathname);
    const history = tabHistoryRef.current;
    const lastTab = history[history.length - 1];

    if (currentTab === '/(tabs)') {
      // Back to Home Dashboard: reset history so pressing Back from Home exits cleanly
      tabHistoryRef.current = ['/(tabs)'];
    } else if (lastTab !== currentTab) {
      tabHistoryRef.current = [...history.slice(-9), currentTab];
    }
  }, [pathname]);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      // If user is currently on a modal or stack screen outside tabs (like /add-crop, /profile, /scan-bill, /drawer)
      // DO NOT intercept here; let the active screen's own back handler or navigation stack handle it!
      if (!isTabRoute(pathname)) {
        return false;
      }

      const isHome = normalizeTabPath(pathname) === '/(tabs)';

      // On Home Dashboard (root screen), allow standard OS exit
      if (isHome) {
        return false;
      }

      // If user is on a secondary tab, pop previous tab from history
      const history = tabHistoryRef.current;
      if (history.length > 1) {
        history.pop(); // Remove current tab
        const prevTab = history[history.length - 1] || '/(tabs)';
        router.navigate(prevTab as any);
        return true;
      }

      // Fallback: return to Home Dashboard
      router.navigate('/(tabs)');
      return true;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [pathname, router]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Slot />
        </View>
        <BottomBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
