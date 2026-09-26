import React from 'react';
import { TouchableOpacity, StyleSheet, ViewStyle } from 'react-native';
import { colors, borderRadius, spacing } from '../../theme';

export interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  variant?: 'default' | 'filled' | 'outlined' | 'primary';
  size?: number;
  style?: ViewStyle;
  badgeCount?: number;
  accessibilityLabel?: string;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  variant = 'default',
  size = 44,
  style,
  accessibilityLabel,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { width: size, height: size, borderRadius: size / 2 },
        variant === 'filled' && styles.filled,
        variant === 'outlined' && styles.outlined,
        variant === 'primary' && styles.primary,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {icon}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.xs,
  },
  filled: {
    backgroundColor: '#F3F4F6',
  },
  outlined: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
  },
  primary: {
    backgroundColor: colors.primaryGreen,
  },
});
