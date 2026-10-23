import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Platform } from 'react-native';
import { Home, Sprout, Camera, BookOpen, FileText } from 'lucide-react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, fontWeight, shadows } from '../theme';
import { useLanguage } from '../locales/languageContext';

export const BottomBar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const { t } = useLanguage();

  const scaleAnim = useRef(new Animated.Value(1)).current;

  const isHomeActive = pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';
  const isCropsActive = pathname.includes('crops');
  const isDiaryActive = pathname.includes('diary');
  const isReportsActive = pathname.includes('reports');
  const isNavigatingRef = useRef(false);

  const handleNavigate = (path: string) => {
    // Avoid redundant navigation if already on this tab
    if (
      (path === '/(tabs)' && isHomeActive) ||
      (path.includes('crops') && isCropsActive) ||
      (path.includes('diary') && isDiaryActive) ||
      (path.includes('reports') && isReportsActive)
    ) {
      return;
    }
    router.navigate(path as any);
  };

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.9,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 4,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };

  const handleScanBill = () => {
    // Guard against duplicate push on rapid double-tap
    if (isNavigatingRef.current || pathname === '/scan-bill') return;
    isNavigatingRef.current = true;
    router.push('/scan-bill');
    setTimeout(() => {
      isNavigatingRef.current = false;
    }, 600);
  };

  const paddingBottom = Platform.OS === 'ios' ? Math.max(insets.bottom, 12) : spacing.xs;

  return (
    <View style={[styles.container, { paddingBottom }, shadows.sm]}>
      {/* Home Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleNavigate('/(tabs)')}
        activeOpacity={0.75}
      >
        <View style={[styles.tabIconBox, isHomeActive && { backgroundColor: '#DCFCE7' }]}>
          <Home size={22} color={isHomeActive ? '#16A34A' : colors.secondaryText} />
        </View>
        <Text style={[styles.tabLabel, isHomeActive && { color: '#16A34A', fontWeight: fontWeight.bold }]} numberOfLines={1}>
          {t('home')}
        </Text>
        {isHomeActive && <View style={[styles.activeDot, { backgroundColor: '#16A34A' }]} />}
      </TouchableOpacity>

      {/* Crops Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleNavigate('/(tabs)/crops')}
        activeOpacity={0.75}
      >
        <View style={[styles.tabIconBox, isCropsActive && { backgroundColor: '#DCFCE7' }]}>
          <Sprout size={22} color={isCropsActive ? '#16A34A' : colors.secondaryText} />
        </View>
        <Text style={[styles.tabLabel, isCropsActive && { color: '#16A34A', fontWeight: fontWeight.bold }]} numberOfLines={1}>
          {t('crops')}
        </Text>
        {isCropsActive && <View style={[styles.activeDot, { backgroundColor: '#16A34A' }]} />}
      </TouchableOpacity>

      {/* Primary Floating Center Camera Button */}
      <View style={styles.centerButtonWrapper}>
        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity
            style={styles.centerButton}
            onPressIn={handlePressIn}
            onPressOut={handlePressOut}
            onPress={handleScanBill}
            activeOpacity={0.9}
            accessibilityLabel="Scan Bill Camera"
          >
            <Camera size={28} color={colors.white} />
          </TouchableOpacity>
        </Animated.View>
      </View>

      {/* Diary Tab (Purple for records) */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleNavigate('/(tabs)/diary')}
        activeOpacity={0.75}
      >
        <View style={[styles.tabIconBox, isDiaryActive && { backgroundColor: '#F3E8FF' }]}>
          <BookOpen size={22} color={isDiaryActive ? '#9333EA' : colors.secondaryText} />
        </View>
        <Text style={[styles.tabLabel, isDiaryActive && { color: '#9333EA', fontWeight: fontWeight.bold }]} numberOfLines={1}>
          {t('diary')}
        </Text>
        {isDiaryActive && <View style={[styles.activeDot, { backgroundColor: '#9333EA' }]} />}
      </TouchableOpacity>

      {/* Reports Tab */}
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => handleNavigate('/(tabs)/reports')}
        activeOpacity={0.75}
      >
        <View style={[styles.tabIconBox, isReportsActive && { backgroundColor: '#E0F2FE' }]}>
          <FileText size={22} color={isReportsActive ? '#0284C7' : colors.secondaryText} />
        </View>
        <Text style={[styles.tabLabel, isReportsActive && { color: '#0284C7', fontWeight: fontWeight.bold }]} numberOfLines={1}>
          {t('reports')}
        </Text>
        {isReportsActive && <View style={[styles.activeDot, { backgroundColor: '#0284C7' }]} />}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: spacing.xs,
    paddingHorizontal: spacing.xs,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 66,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    position: 'relative',
  },
  tabIconBox: {
    width: 36,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: fontSize.xs - 1,
    color: colors.secondaryText,
    marginTop: 3,
    fontWeight: fontWeight.medium,
  },
  activeTabLabel: {
    color: colors.primaryGreen,
    fontWeight: fontWeight.bold,
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.primaryGreen,
    position: 'absolute',
    bottom: 2,
  },
  centerButtonWrapper: {
    top: -22,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3.5,
    borderColor: colors.white,
    ...shadows.lg,
  },
});
