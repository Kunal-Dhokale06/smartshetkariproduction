import { Platform } from 'react-native';

export const fontSize = {
  xs: 12,
  sm: 14,
  md: 16,
  lg: 18,
  xl: 22,
  xxl: 26,
  xxxl: 30,
} as const;

export const fontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const lineHeight = {
  tight: 18,
  normal: 22,
  relaxed: 26,
  heading: 34,
} as const;

export const fontFamily = {
  regular: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  }),
  medium: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  }),
  bold: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
  }),
};

export type FontSize = typeof fontSize;
export type FontWeight = typeof fontWeight;
