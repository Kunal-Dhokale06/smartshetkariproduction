import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

export interface SecondaryButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
  fullWidth?: boolean;
}

export const SecondaryButton: React.FC<SecondaryButtonProps> = ({
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
        fullWidth && styles.fullWidth,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
      disabled={disabled || loading}
      accessibilityRole="button"
    >
      {loading ? (
        <ActivityIndicator color={colors.primaryGreen} size="small" />
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
    backgroundColor: colors.lightGreen,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#D1FAE5',
    gap: spacing.sm,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    backgroundColor: '#F3F4F6',
    borderColor: colors.border,
    opacity: 0.6,
  },
  text: {
    color: colors.primaryGreen,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
