import React from 'react';
import { View, StyleSheet, ViewStyle, StyleProp } from 'react-native';
import { colors, borderRadius, spacing, shadows } from '../../theme';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'flat';
}

export const Card: React.FC<CardProps> = ({
  children,
  style,
  variant = 'elevated',
}) => {
  return (
    <View
      style={[
        styles.card,
        variant === 'elevated' && [styles.elevated, shadows.sm],
        variant === 'outlined' && styles.outlined,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.cardBackground,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  elevated: {
    borderColor: '#F1F5F9',
  },
  outlined: {
    borderWidth: 1,
    borderColor: colors.border,
  },
});
