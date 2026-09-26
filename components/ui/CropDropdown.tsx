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
import { ChevronDown, Check, Sprout, Plus } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { useCropsStore } from '../../data/cropsStore';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';
import { getCropMeta } from '../../utils/cropIcons';
import { useLanguage, TranslationKey } from '../../locales/languageContext';

interface CropDropdownProps {
  label?: string;
  value: string;
  onChange: (cropName: string) => void;
  error?: string;
  includeGeneral?: boolean;
}

export const CropDropdown: React.FC<CropDropdownProps> = ({
  label,
  value,
  onChange,
  error,
}) => {
  const router = useRouter();
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  const { crops } = useCropsStore();
  const cropOptions = crops;

  const selected = cropOptions.find((c) => c.name.toLowerCase() === value.toLowerCase()) || (value ? { id: 'custom', name: value } : undefined);
  const selectedMeta = selected ? getCropMeta(selected.name) : null;
  const SelectedIcon = selectedMeta ? selectedMeta.icon : Sprout;

  const formatCropDisplayName = (cropName: string): string => {
    const key = cropName.toLowerCase() as TranslationKey;
    const translated = t(key);
    return translated !== key ? translated : cropName;
  };

  const handleGoToAddCrop = () => {
    setOpen(false);
    router.push('/add-crop');
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      <TouchableOpacity
        style={[styles.trigger, error ? styles.triggerError : null]}
        onPress={() => setOpen(true)}
        activeOpacity={0.8}
      >
        <View style={styles.triggerLeft}>
          <View
            style={[
              styles.triggerIconBox,
              { backgroundColor: selectedMeta ? selectedMeta.bg : colors.lightGreen },
            ]}
          >
            <SelectedIcon
              size={20}
              color={selectedMeta ? selectedMeta.color : colors.primaryGreen}
            />
          </View>
          <Text style={[styles.triggerText, !selected && styles.triggerPlaceholder]}>
            {selected ? formatCropDisplayName(selected.name) : t('selectCropClick')}
          </Text>
        </View>
        <ChevronDown size={20} color={colors.secondaryText} />
      </TouchableOpacity>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      {/* Dropdown Modal */}
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
                <Sprout size={24} color={colors.primaryGreen} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle}>{t('selectCrop')}</Text>
                <Text style={styles.sheetSubtitle}>{t('selectCropVariety')}</Text>
              </View>
            </View>

            {cropOptions.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>{t('noCropsFound')}</Text>
                <TouchableOpacity
                  style={styles.addCropBtn}
                  onPress={handleGoToAddCrop}
                  activeOpacity={0.8}
                >
                  <Plus size={18} color={colors.white} />
                  <Text style={styles.addCropBtnText}>+ {t('addCrop')}</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={cropOptions}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.listContent}
                renderItem={({ item }) => {
                  const isActive = item.name.toLowerCase() === value.toLowerCase();
                  const meta = getCropMeta(item.name);
                  const ItemIcon = meta.icon;
                  const cropDisplayName = formatCropDisplayName(item.name);

                  return (
                    <TouchableOpacity
                      style={[styles.optionRow, isActive && styles.optionRowActive]}
                      onPress={() => {
                        onChange(item.name);
                        setOpen(false);
                      }}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.optionIconBox, { backgroundColor: meta.bg }]}>
                        <ItemIcon size={22} color={meta.color} />
                      </View>
                      <Text style={[styles.optionText, isActive && styles.optionTextActive]}>
                        {cropDisplayName}
                      </Text>
                      {isActive && <Check size={20} color={colors.primaryGreen} />}
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            <TouchableOpacity style={styles.cancelBtn} onPress={() => setOpen(false)}>
              <Text style={styles.cancelText}>{t('cancel')}</Text>
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
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 6,
  },
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 54,
  },
  triggerError: {
    borderWidth: 1.5,
    borderColor: colors.danger,
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    flex: 1,
  },
  triggerIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerText: {
    fontSize: fontSize.md,
    color: colors.primaryText,
    fontWeight: fontWeight.semibold,
  },
  triggerPlaceholder: {
    color: colors.mutedText,
    fontWeight: fontWeight.regular,
  },
  errorText: {
    fontSize: 12,
    color: colors.danger,
    marginTop: 4,
    fontWeight: fontWeight.medium,
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
    maxHeight: '70%',
    ...shadows.lg,
  },
  sheetHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  sheetIconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheetTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  sheetSubtitle: {
    fontSize: fontSize.xs,
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
  },
  optionRowActive: {
    borderColor: colors.primaryGreen,
    backgroundColor: colors.lightGreen,
  },
  optionIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    flex: 1,
    fontSize: fontSize.md,
    color: colors.primaryText,
    fontWeight: fontWeight.medium,
  },
  optionTextActive: {
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  emptyContainer: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.md,
  },
  emptyText: {
    fontSize: fontSize.md,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  addCropBtn: {
    backgroundColor: colors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  addCropBtnText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
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
    fontSize: fontSize.md,
    fontWeight: fontWeight.semibold,
    color: colors.secondaryText,
  },
});
