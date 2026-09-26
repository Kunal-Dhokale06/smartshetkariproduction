import { colors } from './colors';
import { spacing } from './spacing';
import { borderRadius } from './borderRadius';
import { shadows } from './shadows';
import { fontSize, fontWeight, lineHeight } from './typography';
import { iconSizes } from './iconSizes';

export const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
  fontSize,
  fontWeight,
  lineHeight,
  iconSizes,
} as const;

export type Theme = typeof theme;
export { colors, spacing, borderRadius, shadows, fontSize, fontWeight, lineHeight, iconSizes };
