import React, { useEffect } from 'react';
import { View, StyleSheet, BackHandler, Platform } from 'react-native';
import { Slot, useRouter, usePathname } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BottomBar } from '../../components/BottomBar';
import { colors } from '../../theme';

export default function TabsLayout() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const onBackPress = () => {
      const isHome =
        pathname === '/' ||
        pathname === '/(tabs)' ||
        pathname === '/(tabs)/index';

      // If user is on any secondary tab (Crops, Expenses, Sales, Analytics, Diary, Budget, etc.)
      // pressing hardware Back button returns directly to Home Dashboard
      if (!isHome) {
        router.navigate('/(tabs)');
        return true;
      }

      // If on Home Dashboard, allow standard exit
      return false;
    };

    const subscription = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => subscription.remove();
  }, [pathname]);

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
