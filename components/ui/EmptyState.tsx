import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Sprout } from 'lucide-react-native';
import { PrimaryButton } from './PrimaryButton';
import { colors, spacing, fontSize, fontWeight } from '../../theme';

export interface EmptyStateProps {
  title: string;
  description: string;
  actionTitle?: string;
  onActionPress?: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionTitle,
  onActionPress,
  icon,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.iconCircle}>
        {icon || <Sprout size={36} color={colors.primaryGreen} />}
      </View>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.description}>{description}</Text>

      {actionTitle && onActionPress && (
        <PrimaryButton
          title={actionTitle}
          onPress={onActionPress}
          style={styles.actionBtn}
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
    backgroundColor: colors.lightGreen,
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
  description: {
    fontSize: fontSize.sm,
    color: colors.secondaryText,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 20,
  },
  actionBtn: {
    minWidth: 160,
  },
});
