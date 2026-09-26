import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Image, Animated, ActivityIndicator, Dimensions } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '../theme';
import { useLanguage } from '../locales/languageContext';

const { width } = Dimensions.get('window');

interface SplashScreenProps {
  message?: string;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ message }) => {
  const { language } = useLanguage();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 7,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const defaultMsg =
    language === 'mr'
      ? 'सुरक्षित प्रणाली लोड होत आहे...'
      : language === 'hi'
      ? 'सुरक्षित सिस्टम लोड हो रहा है...'
      : 'Loading SmartShetkari ERP...';

  // Responsive logo size (up to 300px wide, unconstrained and unshaped)
  const logoDimension = Math.min(width * 0.78, 300);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.contentBox,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Full, Uncropped, Natural Logo with no circle or clipping */}
        <Image
          source={require('../assets/logo.png')}
          style={[styles.fullLogoImage, { width: logoDimension, height: logoDimension }]}
          resizeMode="contain"
        />

        {/* Loading Spinner & Status Message */}
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primaryGreen} />
          <Text style={styles.loadingText}>{message || defaultMsg}</Text>
        </View>
      </Animated.View>

      {/* Footer Branding */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>100% Secure • SmartShetkari Digital Agriculture</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contentBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  fullLogoImage: {
    marginBottom: spacing.lg,
  },
  loaderContainer: {
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.sm,
  },
  loadingText: {
    fontSize: fontSize.sm,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  footer: {
    position: 'absolute',
    bottom: spacing.xl,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 11,
    color: colors.mutedText,
    fontWeight: fontWeight.medium,
  },
});
