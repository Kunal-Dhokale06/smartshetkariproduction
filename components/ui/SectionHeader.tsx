import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '../../theme';

export interface SectionHeaderProps {
  title: string;
  actionText?: string;
  onActionPress?: () => void;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  actionText,
  onActionPress,
  icon,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.titleGroup}>
        {icon}
        <Text style={styles.title}>{title}</Text>
      </View>
      {actionText && onActionPress && (
        <TouchableOpacity onPress={onActionPress}>
          <Text style={styles.actionText}>{actionText}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: spacing.sm,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  actionText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.primaryGreen,
  },
});
