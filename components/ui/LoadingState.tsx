import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '../../theme';

export interface LoadingStateProps {
  message?: string;
  style?: ViewStyle;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading...',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size="large" color={colors.primaryGreen} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xl,
  },
  message: {
    marginTop: spacing.md,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.medium,
    color: colors.secondaryText,
  },
});
