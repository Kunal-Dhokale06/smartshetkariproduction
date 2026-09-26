import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, spacing, fontSize, fontWeight } from '../../theme';
import { IconButton } from './IconButton';

export interface AppHeaderProps {
  title?: string;
  subtitle?: string;
  leftIcon?: React.ReactNode;
  onLeftPress?: () => void;
  rightIcon?: React.ReactNode;
  onRightPress?: () => void;
  centerComponent?: React.ReactNode;
  style?: ViewStyle;
}

export const AppHeader: React.FC<AppHeaderProps> = ({
  title,
  subtitle,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  centerComponent,
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.sideSlot}>
        {leftIcon && onLeftPress && (
          <IconButton icon={leftIcon} onPress={onLeftPress} />
        )}
      </View>

      <View style={styles.centerSlot}>
        {centerComponent ? (
          centerComponent
        ) : (
          <>
            {title && <Text style={styles.title} numberOfLines={1}>{title}</Text>}
            {subtitle && <Text style={styles.subtitle} numberOfLines={1}>{subtitle}</Text>}
          </>
        )}
      </View>

      <View style={styles.sideSlot}>
        {rightIcon && onRightPress && (
          <IconButton icon={rightIcon} onPress={onRightPress} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.background,
  },
  sideSlot: {
    width: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerSlot: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.sm,
  },
  title: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    marginTop: 2,
  },
});
