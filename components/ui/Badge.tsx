import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, borderRadius, spacing, fontSize, fontWeight } from '../../theme';

interface BadgeProps {
  label: string;
  variant?: 'growing' | 'harvested' | 'danger' | 'warning' | 'primary';
  style?: ViewStyle;
  textStyle?: TextStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  style,
  textStyle,
}) => {
  const getBadgeStyle = () => {
    switch (variant) {
      case 'growing':
        return { bg: colors.growingBadgeBg, text: colors.growingBadgeText };
      case 'harvested':
        return { bg: colors.harvestedBadgeBg, text: colors.harvestedBadgeText };
      case 'danger':
        return { bg: '#FEE2E2', text: colors.danger };
      case 'warning':
        return { bg: '#FEF3C7', text: colors.warning };
      case 'primary':
      default:
        return { bg: colors.lightGreen, text: colors.primaryGreen };
    }
  };

  const currentVariant = getBadgeStyle();

  return (
    <View style={[styles.badge, { backgroundColor: currentVariant.bg }, style]}>
      <Text style={[styles.text, { color: currentVariant.text }, textStyle]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
});
