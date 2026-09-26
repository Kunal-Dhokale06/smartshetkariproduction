export const colors = {
  // Brand Colors
  primaryGreen: '#008A45',
  darkGreen: '#006B36',
  lightGreen: '#EAF7EF',

  // System & Layout
  background: '#F8FAF9',
  cardBackground: '#FFFFFF',
  white: '#FFFFFF',
  border: '#E5E7EB',

  // Typography
  primaryText: '#17202A',
  secondaryText: '#6B7280',
  mutedText: '#9CA3AF',

  // Status & Accents
  warning: '#F59E0B',
  danger: '#DC2626',
  success: '#10B981',
  info: '#3B82F6',

  // Weather Card specific gradient simulation
  weatherCardBg: '#EFF6FF',
  weatherCardBorder: '#DBEAFE',

  // Badge backgrounds
  growingBadgeBg: '#EAF7EF',
  growingBadgeText: '#008A45',
  harvestedBadgeBg: '#E0F2FE',
  harvestedBadgeText: '#0284C7',

  // Camera view
  cameraOverlay: 'rgba(0, 0, 0, 0.85)',
} as const;

export type Colors = typeof colors;
