import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Menu, Bell, Sprout } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { INITIAL_USER } from '../constants';
import { useLanguage } from '../locales/languageContext';
import { useAuth } from '../data/authStore';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showUserGreeting?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showUserGreeting = false,
}) => {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const farmerName = user?.name ? user.name.split(' ')[0] : 'Farmer';

  const handleOpenDrawer = () => {
    router.push('/drawer');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={handleOpenDrawer}
        style={styles.iconButton}
        accessibilityLabel="Open menu"
      >
        <Menu size={24} color={colors.primaryText} />
      </TouchableOpacity>

      <View style={styles.centerContainer}>
        {showUserGreeting ? (
          <>
            <Text style={styles.greetingTitle} numberOfLines={1}>
              {language === 'mr' ? `नमस्ते, ${farmerName}!` : language === 'hi' ? `नमस्ते, ${farmerName}!` : `Namaste, ${farmerName}!`} 👋
            </Text>
            <Text style={styles.greetingSubtitle} numberOfLines={1}>
              {user?.village ? `${user.village}${user.district ? ', ' + user.district : ''}` : t('subGreeting')}
            </Text>
          </>
        ) : (
          title && <Text style={styles.titleText} numberOfLines={1}>{title}</Text>
        )}
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity style={styles.iconButton} accessibilityLabel="Notifications">
          <Bell size={22} color={colors.primaryText} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.avatarButton} onPress={handleOpenDrawer}>
          <View style={styles.avatarCircle}>
            <Sprout size={16} color={colors.primaryGreen} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
  },
  iconButton: {
    padding: spacing.xs,
    position: 'relative',
  },
  centerContainer: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  greetingTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  greetingSubtitle: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    marginTop: 2,
  },
  titleText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: colors.danger,
    borderRadius: borderRadius.full,
    width: 16,
    height: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  avatarButton: {
    marginLeft: spacing.xs,
  },
  avatarCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.lightGreen,
    borderWidth: 1,
    borderColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
