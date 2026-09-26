import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import { PrimaryButton } from './PrimaryButton';
import { colors, spacing, fontSize, fontWeight } from '../../theme';

export interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  retryText?: string;
  style?: ViewStyle;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something went wrong',
  message,
  onRetry,
  retryText = 'Try Again',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        <AlertTriangle size={36} color={colors.danger} />
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <PrimaryButton
          title={retryText}
          onPress={onRetry}
          style={styles.retryBtn}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xxl,
    marginVertical: spacing.xl,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    textAlign: 'center',
    marginBottom: spacing.xs,
  },
  message: {
    fontSize: fontSize.sm,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  retryBtn: {
    minWidth: 140,
    backgroundColor: colors.danger,
  },
});
