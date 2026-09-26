import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  Pressable,
} from 'react-native';
import { ChevronDown, Scale, Weight, Droplets, Package, Sprout, Check } from 'lucide-react-native';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';
import { useLanguage, TranslationKey } from '../../locales/languageContext';

export interface UnitOption {
  key: string;
  nameKey: TranslationKey;
  subLabelKey?: string;
  icon: any;
  color: string;
  bg: string;
}

export const UNIT_OPTIONS: UnitOption[] = [
  {
    key: 'Quintal',
    nameKey: 'quintal',
    icon: Scale,
    color: '#D97706',
    bg: '#FEF3C7',
  },
  {
    key: 'Kg',
    nameKey: 'kg',
    icon: Scale,
    color: colors.primaryGreen,
    bg: '#EAF7EF',
  },
  {
    key: 'Ton',
    nameKey: 'ton',
    icon: Weight,
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  {
    key: 'Gram',
    nameKey: 'gram',
    icon: Scale,
    color: '#7E22CE',
    bg: '#F3E8FF',
  },
  {
    key: 'Liter',
    nameKey: 'liter',
    icon: Droplets,
    color: '#0284C7',
    bg: '#E0F2FE',
  },
  {
    key: 'Milliliter',
    nameKey: 'milliliter',
    icon: Droplets,
    color: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    key: 'Bag / Crate',
    nameKey: 'bagCrate',
    icon: Package,
    color: '#D97706',
    bg: '#FEF3C7',
  },
  {
    key: 'Bunch / Dozen',
    nameKey: 'bunchDozen',
    icon: Sprout,
    color: '#059669',
    bg: '#D1FAE5',
  },
];

interface UnitDropdownProps {
  label?: string;
  value: string;
  onChange: (unitKey: string) => void;
  error?: string;
  compact?: boolean;
}

export const UnitDropdown: React.FC<UnitDropdownProps> = ({
  label,
  value,
  onChange,
  error,
  compact = false,
}) => {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const selected = UNIT_OPTIONS.find((u) => u.key.toLowerCase() === value.toLowerCase()) || {
    key: value,
    nameKey: 'unit' as TranslationKey,
    icon: Scale,
    color: colors.primaryGreen,
    bg: colors.lightGreen,
  };

  const SelectedIcon = selected.icon;
  const selectedLabel = t(selected.nameKey);

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[
          styles.trigger,
          compact && styles.compactTrigger,
          error ? styles.triggerError : null,
        ]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <View style={styles.triggerLeft}>
          <View style={[styles.triggerIconBox, { backgroundColor: selected.bg }]}>
            <SelectedIcon size={16} color={selected.color} />
          </View>
          <Text style={[styles.triggerText, compact && styles.compactTriggerText]} numberOfLines={1}>
            {selectedLabel}
          </Text>
        </View>
        <ChevronDown size={16} color={colors.secondaryText} />
      </TouchableOpacity>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Modal Dropdown Picker */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setOpen(false)}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetIconCircle}>
                <Scale size={20} color={colors.primaryGreen} />
              </View>
              <View>
                <Text style={styles.sheetTitle}>{t('selectWeightUnit')}</Text>
                <Text style={styles.sheetSubtitle}>{t('chooseStandardUnit')}</Text>
              </View>
            </View>

            <FlatList
              data={UNIT_OPTIONS}
              keyExtractor={(item) => item.key}
              contentContainerStyle={styles.listContent}
              renderItem={({ item }) => {
                const isActive = item.key.toLowerCase() === value.toLowerCase();
                const Icon = item.icon;
                const itemLabel = t(item.nameKey);

                return (
                  <TouchableOpacity
                    style={[styles.optionRow, isActive && styles.optionRowActive]}
                    onPress={() => {
                      onChange(item.key);
                      setOpen(false);
                    }}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.optionIconBox, { backgroundColor: item.bg }]}>
                      <Icon size={18} color={item.color} />
                    </View>
                    <View style={styles.optionTextCol}>
                      <Text style={[styles.optionName, isActive && styles.optionNameActive]}>
                        {itemLabel}
                      </Text>
                    </View>
                    {isActive && <Check size={18} color={colors.primaryGreen} />}
                  </TouchableOpacity>
                );
              }}
            />

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setOpen(false)}>
              <Text style={styles.cancelText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.xs,
  },
  label: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 6,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
  },
  compactTrigger: {
    paddingHorizontal: spacing.sm + 2,
    minHeight: 52,
  },
  triggerError: {
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs + 2,
    flex: 1,
  },
  triggerIconBox: {
    width: 28,
    height: 28,
    borderRadius: 7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerText: {
    fontSize: fontSize.sm,
    color: colors.primaryText,
    fontWeight: fontWeight.semibold,
  },
  compactTriggerText: {
    fontSize: fontSize.xs + 1,
  },
  errorText: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 4,
  },
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxl,
    maxHeight: '75%',
    ...shadows.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  sheetIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  sheetSubtitle: {
    fontSize: 11,
    color: colors.secondaryText,
    marginTop: 2,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs,
    gap: 8,
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  optionRowActive: {
    borderColor: colors.primaryGreen,
    backgroundColor: colors.lightGreen,
  },
  optionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionTextCol: {
    flex: 1,
  },
  optionName: {
    fontSize: fontSize.sm,
    color: colors.primaryText,
    fontWeight: fontWeight.medium,
  },
  optionNameActive: {
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  cancelBtn: {
    marginHorizontal: spacing.lg,
    marginTop: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.secondaryText,
  },
});
