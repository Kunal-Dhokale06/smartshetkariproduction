import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { Card } from './Card';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';

export interface StatCardProps {
  label: string;
  value: string | number;
  subValue?: string;
  changePercentage?: number;
  icon?: React.ReactNode;
  style?: ViewStyle;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subValue,
  changePercentage,
  icon,
  style,
}) => {
  const isPositive = changePercentage && changePercentage > 0;

  return (
    <Card style={[styles.card, style]}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>{label}</Text>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
      </View>

      <Text style={styles.value}>{value}</Text>

      {subValue && <Text style={styles.subValue}>{subValue}</Text>}

      {changePercentage !== undefined && (
        <View style={styles.footerRow}>
          <Text style={styles.periodText}>This Month</Text>
          <View
            style={[
              styles.changeBadge,
              { backgroundColor: isPositive ? colors.lightGreen : '#FEF2F2' },
            ]}
          >
            <Text
              style={[
                styles.changeText,
                { color: isPositive ? colors.primaryGreen : colors.danger },
              ]}
            >
              {isPositive ? '↑' : '↓'} {Math.abs(changePercentage)}%
            </Text>
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  value: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  subValue: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    marginTop: 2,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  periodText: {
    fontSize: 10,
    color: colors.secondaryText,
  },
  changeBadge: {
    paddingHorizontal: spacing.xs,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
  },
  changeText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
});
