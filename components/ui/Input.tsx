import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  Platform,
} from 'react-native';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../../theme';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  containerStyle,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View
        style={[
          styles.inputWrapper,
          error
            ? styles.errorBorder
            : isFocused
            ? styles.focusedBorder
            : styles.normalBorder,
        ]}
      >
        {leftIcon && <View style={styles.iconBox}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            style,
            // Suppress native browser black outline on web
            Platform.OS === 'web' ? ({ outlineStyle: 'none', outline: 'none' } as any) : undefined,
          ]}
          placeholderTextColor={colors.mutedText}
          onFocus={(e) => {
            setIsFocused(true);
            if (onFocus) onFocus(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) onBlur(e);
          }}
          {...props}
        />
        {rightIcon && <View style={styles.iconBox}>{rightIcon}</View>}
      </View>
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 6,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 50,
  },
  normalBorder: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  focusedBorder: {
    borderWidth: 1.5,
    borderColor: colors.primaryGreen,
  },
  errorBorder: {
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  input: {
    flex: 1,
    height: '100%',
    fontSize: fontSize.sm,
    color: colors.primaryText,
  },
  iconBox: {
    marginRight: spacing.xs,
  },
  errorText: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 4,
  },
  helperText: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 4,
  },
});
