import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight, shadows } from '../../theme';

export interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  icon,
  style,
  textStyle,
  fullWidth = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        shadows.sm,
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.85}
      disabled={disabled || loading}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={colors.white} size="small" />
      ) : (
        <>
          {icon}
          <Text style={[styles.text, textStyle]}>{title}</Text>
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
    gap: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    backgroundColor: '#9CA3AF',
    opacity: 0.7,
  },
  text: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    letterSpacing: 0.2,
  },
});
