import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Bot, ArrowRight } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { useLanguage } from '../locales/languageContext';

export const AIBanner: React.FC = () => {
  const router = useRouter();
  const { t } = useLanguage();

  const handleOpenAI = () => {
    router.push('/(tabs)/ai-assistant');
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t('needHelp')}</Text>
        <Text style={styles.subtitle}>
          {t('aiSubtitle')}
        </Text>
        <TouchableOpacity style={styles.chatButton} onPress={handleOpenAI}>
          <Text style={styles.chatButtonText}>{t('chatNow')}</Text>
          <ArrowRight size={14} color={colors.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.avatarContainer}>
        <View style={styles.avatarBg}>
          <Bot size={40} color={colors.primaryGreen} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.lightGreen,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#D1FAE5',
    borderWidth: 1,
  },
  textContainer: {
    flex: 1,
    paddingRight: spacing.md,
  },
  title: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    marginBottom: spacing.md,
    lineHeight: 16,
  },
  chatButton: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: spacing.xs,
  },
  chatButtonText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
  },
  avatarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: colors.primaryGreen,
  },
});
