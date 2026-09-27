import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Switch } from 'react-native';
import {
  Menu,
  User,
  Globe,
  Bell,
  Palette,
  ShieldCheck,
  Banknote,
  Scale,
  HelpCircle,
  Info,
  LogOut,
  ChevronRight,
  Sprout,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { colors, spacing, fontSize, fontWeight } from '../../theme';
import { INITIAL_USER } from '../../constants';
import { useLanguage } from '../../locales/languageContext';
import { useAuth } from '../../data/authStore';
import { LanguageSelectorModal } from '../../components/LanguageSelectorModal';
import { safeNavigate } from '../../utils';

export default function SettingsScreen() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { user, logout } = useAuth();

  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [langModalVisible, setLangModalVisible] = useState(false);

  const handleRowPress = (title: string, subtitle?: string) => {
    if (title === 'Account' || title === t('account')) {
      router.push('/profile');
    } else if (title === 'Language' || title === t('language')) {
      setLangModalVisible(true);
    } else if (title === 'Logout' || title === t('logout')) {
      Alert.alert(
        t('confirmLogoutTitle'),
        t('confirmLogoutMsg'),
        [
          { text: t('cancel'), style: 'cancel' },
          {
            text: t('logout'),
            style: 'destructive',
            onPress: async () => {
              await logout();
              router.replace('/auth');
            },
          },
        ]
      );
    } else {
      Alert.alert(title, `${subtitle || title} configuration updated.`);
    }
  };

  const settingsItems = [
    {
      key: 'account',
      title: t('account'),
      subtitle: t('accountSubtitle'),
      icon: User,
      action: () => router.push('/profile'),
    },
    {
      key: 'language',
      title: t('language'),
      subtitle: language === 'mr' ? 'मराठी (Marathi)' : language === 'hi' ? 'हिन्दी (Hindi)' : 'English',
      icon: Globe,
      action: () => setLangModalVisible(true),
    },
    {
      key: 'notifications',
      title: t('notifications'),
      subtitle: notificationsEnabled ? t('notificationsSubtitleEnabled') : t('notificationsSubtitleDisabled'),
      icon: Bell,
      isToggle: true,
      toggleValue: notificationsEnabled,
      onToggle: setNotificationsEnabled,
    },
    {
      key: 'theme',
      title: t('theme'),
      subtitle: t('themeSubtitle'),
      icon: Palette,
      action: () => handleRowPress(t('theme'), t('themeSubtitle')),
    },
    {
      key: 'privacy',
      title: t('privacy'),
      subtitle: t('privacySubtitle'),
      icon: ShieldCheck,
      action: () => handleRowPress(t('privacy'), t('privacySubtitle')),
    },
    {
      key: 'currency',
      title: t('currency'),
      subtitle: t('currencySubtitle'),
      icon: Banknote,
      action: () => handleRowPress(t('currency'), t('currencySubtitle')),
    },
    {
      key: 'units',
      title: t('units'),
      subtitle: t('unitsSubtitle'),
      icon: Scale,
      action: () => handleRowPress(t('units'), t('unitsSubtitle')),
    },
    {
      key: 'help',
      title: t('helpSupport'),
      subtitle: t('helpSubtitle'),
      icon: HelpCircle,
      action: () => handleRowPress(t('helpSupport'), t('helpSubtitle')),
    },
    {
      key: 'about',
      title: t('aboutApp'),
      subtitle: t('aboutSubtitle'),
      icon: Info,
      action: () => handleRowPress(t('aboutApp'), t('aboutSubtitle')),
    },
    {
      key: 'logout',
      title: t('logout'),
      subtitle: t('logoutSubtitle'),
      icon: LogOut,
      isDanger: true,
      action: () => handleRowPress('Logout'),
    },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => safeNavigate(() => router.push('/drawer'))}>
          <Menu size={24} color={colors.primaryText} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('settings')}</Text>

        <TouchableOpacity style={styles.iconButton} onPress={() => safeNavigate(() => router.push('/profile'))}>
          <User size={22} color={colors.primaryGreen} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Profile Card Header Link */}
        <TouchableOpacity activeOpacity={0.8} onPress={() => safeNavigate(() => router.push('/profile'))}>
          <Card style={styles.profileSummaryCard}>
            <View style={styles.avatarCircle}>
              <Sprout size={28} color={colors.primaryGreen} />
            </View>
            <View style={styles.profileSummaryContent}>
              <Text style={styles.profileName}>{user?.name || 'Kunal Deshmukh'}</Text>
              <Text style={styles.profileRole}>
                {user?.village ? `${user.village}${user.district ? ', ' + user.district : ''}` : 'Farmer • Maharashtra'}
              </Text>
            </View>
            <ChevronRight size={20} color={colors.secondaryText} />
          </Card>
        </TouchableOpacity>

        {/* Preferences Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('appPreferences')}</Text>

          <Card style={styles.settingsCard}>
            {settingsItems.map((item, index) => {
              const Icon = item.icon;
              const isLast = index === settingsItems.length - 1;

              return (
                <View key={item.key}>
                  <TouchableOpacity
                    style={[styles.settingsRow, item.isDanger && styles.dangerRow]}
                    onPress={item.action}
                    disabled={item.isToggle}
                    activeOpacity={item.isToggle ? 1 : 0.7}
                  >
                    <View
                      style={[
                        styles.rowIconCircle,
                        item.isDanger && styles.dangerIconCircle,
                      ]}
                    >
                      <Icon
                        size={20}
                        color={item.isDanger ? colors.danger : colors.primaryGreen}
                      />
                    </View>

                    <View style={styles.rowTextContainer}>
                      <Text
                        style={[
                          styles.rowTitle,
                          item.isDanger && styles.dangerText,
                        ]}
                      >
                        {item.title}
                      </Text>
                      {item.subtitle ? (
                        <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
                      ) : null}
                    </View>

                    {item.isToggle ? (
                      <Switch
                        value={item.toggleValue}
                        onValueChange={item.onToggle}
                        trackColor={{ false: '#E5E7EB', true: colors.lightGreen }}
                        thumbColor={item.toggleValue ? colors.primaryGreen : '#9CA3AF'}
                      />
                    ) : (
                      <ChevronRight size={18} color={colors.mutedText} />
                    )}
                  </TouchableOpacity>

                  {!isLast && <View style={styles.divider} />}
                </View>
              );
            })}
          </Card>
        </View>
      </ScrollView>

      {/* Language Selector Modal */}
      <LanguageSelectorModal
        visible={langModalVisible}
        onClose={() => setLangModalVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  profileSummaryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  profileSummaryContent: {
    flex: 1,
  },
  profileName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  profileRole: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    marginTop: 2,
  },
  sectionContainer: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: spacing.sm,
  },
  settingsCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    padding: 0,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    minHeight: 56,
  },
  dangerRow: {
    backgroundColor: '#FFF5F5',
  },
  rowIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  dangerIconCircle: {
    backgroundColor: '#FEE2E2',
  },
  rowTextContainer: {
    flex: 1,
  },
  rowTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primaryText,
  },
  rowSubtitle: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    marginTop: 2,
  },
  dangerText: {
    color: colors.danger,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginLeft: 60,
  },
});
