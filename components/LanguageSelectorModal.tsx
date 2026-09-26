import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Check, Globe } from 'lucide-react-native';
import { AppModal } from './ui/Modal';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { useLanguage, Language } from '../locales/languageContext';

interface LanguageSelectorModalProps {
  visible: boolean;
  onClose: () => void;
}

export const LanguageSelectorModal: React.FC<LanguageSelectorModalProps> = ({
  visible,
  onClose,
}) => {
  const { language, setLanguage, t } = useLanguage();

  const handleSelect = (lang: Language) => {
    setLanguage(lang);
    onClose();
  };

  const options: { code: Language; name: string; subtitle: string }[] = [
    { code: 'en', name: 'English', subtitle: 'English (Default)' },
    { code: 'mr', name: 'मराठी', subtitle: 'मराठी भाषा (Marathi)' },
    { code: 'hi', name: 'हिन्दी', subtitle: 'हिन्दी भाषा (Hindi)' },
  ];

  return (
    <AppModal visible={visible} onClose={onClose} title={t('selectLanguage')}>
      <View style={styles.container}>
        {options.map((opt) => {
          const isSelected = language === opt.code;
          return (
            <TouchableOpacity
              key={opt.code}
              style={[styles.optionCard, isSelected && styles.activeCard]}
              onPress={() => handleSelect(opt.code)}
              activeOpacity={0.8}
            >
              <View style={styles.leftRow}>
                <View style={styles.globeBox}>
                  <Globe size={20} color={colors.primaryGreen} />
                </View>
                <View>
                  <Text style={styles.langName}>{opt.name}</Text>
                  <Text style={styles.langSubtitle}>{opt.subtitle}</Text>
                </View>
              </View>

              {isSelected && (
                <View style={styles.checkBadge}>
                  <Check size={16} color={colors.white} />
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </AppModal>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    marginVertical: spacing.xs,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeCard: {
    backgroundColor: colors.lightGreen,
    borderColor: colors.primaryGreen,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  globeBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  langName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  langSubtitle: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    marginTop: 2,
  },
  checkBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primaryGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
