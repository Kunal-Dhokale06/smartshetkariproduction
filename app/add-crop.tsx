import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  FlatList,
  Pressable,
  TextInput,
  BackHandler,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Sprout, ChevronDown, Check, Search } from 'lucide-react-native';
import { AppHeader } from '../components/ui/AppHeader';
import { Input } from '../components/ui/Input';
import { DateField } from '../components/ui/DateField';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { addCrop } from '../data/cropsStore';
import { useLanguage, TranslationKey } from '../locales/languageContext';
import { getCropMeta } from '../utils/cropIcons';

const AREA_UNITS = [
  { key: 'Acre', labelKey: 'acre' as TranslationKey },
  { key: 'Hectare', labelKey: 'hectare' as TranslationKey },
  { key: 'Guntha', labelKey: 'guntha' as TranslationKey },
];

const AVAILABLE_CROPS_LIST = [
  // Food Grains & Cereals
  { name: 'Wheat', labelKey: 'wheat' as TranslationKey },
  { name: 'Paddy', labelKey: 'paddy' as TranslationKey },
  { name: 'Maize', labelKey: 'maize' as TranslationKey },
  { name: 'Jowar', labelKey: 'jowar' as TranslationKey },
  { name: 'Bajra', labelKey: 'bajra' as TranslationKey },
  { name: 'Ragi', labelKey: 'ragi' as TranslationKey },

  // Cash & Commercial Crops
  { name: 'Cotton', labelKey: 'cotton' as TranslationKey },
  { name: 'Sugarcane', labelKey: 'sugarcane' as TranslationKey },
  { name: 'Turmeric', labelKey: 'turmeric' as TranslationKey },
  { name: 'Ginger', labelKey: 'ginger' as TranslationKey },
  { name: 'Tobacco', labelKey: 'tobacco' as TranslationKey },

  // Pulses & Oilseeds
  { name: 'Soybean', labelKey: 'soybean' as TranslationKey },
  { name: 'Gram', labelKey: 'gram' as TranslationKey },
  { name: 'Tur', labelKey: 'tur' as TranslationKey },
  { name: 'Moong', labelKey: 'moong' as TranslationKey },
  { name: 'Urad', labelKey: 'urad' as TranslationKey },
  { name: 'Groundnut', labelKey: 'groundnut' as TranslationKey },
  { name: 'Sunflower', labelKey: 'sunflower' as TranslationKey },
  { name: 'Mustard', labelKey: 'mustard' as TranslationKey },
  { name: 'Sesame', labelKey: 'sesame' as TranslationKey },

  // Vegetables
  { name: 'Onion', labelKey: 'onion' as TranslationKey },
  { name: 'Tomato', labelKey: 'tomato' as TranslationKey },
  { name: 'Potato', labelKey: 'potato' as TranslationKey },
  { name: 'Garlic', labelKey: 'garlic' as TranslationKey },
  { name: 'Chilli', labelKey: 'chilli' as TranslationKey },
  { name: 'Brinjal', labelKey: 'brinjal' as TranslationKey },
  { name: 'Cabbage', labelKey: 'cabbage' as TranslationKey },
  { name: 'Cauliflower', labelKey: 'cauliflower' as TranslationKey },
  { name: 'Okra', labelKey: 'okra' as TranslationKey },
  { name: 'Green Peas', labelKey: 'greenpeas' as TranslationKey },
  { name: 'Bitter Gourd', labelKey: 'bittergourd' as TranslationKey },
  { name: 'Bottle Gourd', labelKey: 'bottlegourd' as TranslationKey },
  { name: 'Cucumber', labelKey: 'cucumber' as TranslationKey },
  { name: 'Capsicum', labelKey: 'capsicum' as TranslationKey },
  { name: 'Spinach', labelKey: 'spinach' as TranslationKey },
  { name: 'Fenugreek', labelKey: 'fenugreek' as TranslationKey },
  { name: 'Coriander', labelKey: 'coriander' as TranslationKey },

  // Fruits & Horticulture
  { name: 'Banana', labelKey: 'banana' as TranslationKey },
  { name: 'Pomegranate', labelKey: 'pomegranate' as TranslationKey },
  { name: 'Mango', labelKey: 'mango' as TranslationKey },
  { name: 'Grapes', labelKey: 'grapes' as TranslationKey },
  { name: 'Orange', labelKey: 'orange' as TranslationKey },
  { name: 'Sweet Lime', labelKey: 'sweetlime' as TranslationKey },
  { name: 'Papaya', labelKey: 'papaya' as TranslationKey },
  { name: 'Guava', labelKey: 'guava' as TranslationKey },
  { name: 'Custard Apple', labelKey: 'custardapple' as TranslationKey },
  { name: 'Watermelon', labelKey: 'watermelon' as TranslationKey },
  { name: 'Dragon Fruit', labelKey: 'dragonfruit' as TranslationKey },
  { name: 'Coconut', labelKey: 'coconut' as TranslationKey },
];

function getTodayFormatted(): string {
  const d = new Date();
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AddCropScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const [cropName, setCropName] = useState('');
  const [cropType, setCropType] = useState('Kharif');
  const [sowingDate, setSowingDate] = useState(getTodayFormatted());
  const [area, setArea] = useState('');
  const [areaUnit, setAreaUnit] = useState('Acre');
  const [expectedHarvestDate, setExpectedHarvestDate] = useState('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<{ cropName?: string; area?: string }>({});

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [cropSearchQuery, setCropSearchQuery] = useState('');

  const filteredCropsList = AVAILABLE_CROPS_LIST.filter((item) => {
    if (!cropSearchQuery.trim()) return true;
    const query = cropSearchQuery.toLowerCase().trim();
    const englishName = item.name.toLowerCase();
    const translatedName = t(item.labelKey).toLowerCase();
    return englishName.includes(query) || translatedName.includes(query);
  });

  const selectedMeta = cropName ? getCropMeta(cropName) : null;
  const SelectedIcon = selectedMeta ? selectedMeta.icon : Sprout;

  const handleSave = () => {
    const newErrors: { cropName?: string; area?: string } = {};
    if (!cropName.trim()) {
      newErrors.cropName = t('valSelectOrEnterCrop');
    }
    if (!area.trim() || isNaN(parseFloat(area.trim())) || parseFloat(area.trim()) <= 0) {
      newErrors.area = t('valEnterCropArea');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    addCrop({
      name: cropName.trim(),
      sowingDate: sowingDate.trim() || getTodayFormatted(),
      area: `${area.trim()} ${areaUnit}`,
      status: 'Growing',
      iconName: 'wheat',
    });

    handleClose();
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/crops');
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const backAction = () => {
      if (dropdownOpen) {
        setDropdownOpen(false);
        return true;
      }
      handleClose();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => sub.remove();
  }, [dropdownOpen]);

  const getCropDisplayName = (name: string): string => {
    const item = AVAILABLE_CROPS_LIST.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (item) return t(item.labelKey);
    const key = name.toLowerCase() as TranslationKey;
    const translated = t(key);
    return translated !== key ? translated : name;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      <AppHeader
        title={t('addCrop')}
        leftIcon={<X size={24} color={colors.primaryText} />}
        onLeftPress={handleClose}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.formHeader}>
            <View style={styles.iconCircle}>
              <Sprout size={32} color={colors.primaryGreen} />
            </View>
            <Text style={styles.formTitle}>{t('recordNewCrop')}</Text>
            <Text style={styles.formSubtitle}>{t('recordNewCropSubtitle')}</Text>
          </View>

          {/* Interactive Crop Dropdown Trigger */}
          <Text style={styles.fieldLabel}>{t('selectCrop')} *</Text>
          <TouchableOpacity
            style={[styles.dropdownTrigger, errors.cropName ? styles.dropdownError : null]}
            onPress={() => setDropdownOpen(true)}
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
                  size={18}
                  color={selectedMeta ? selectedMeta.color : colors.primaryGreen}
                />
              </View>
              <Text style={[styles.triggerText, !cropName && styles.triggerPlaceholder]}>
                {cropName ? getCropDisplayName(cropName) : t('selectCropClick')}
              </Text>
            </View>
            <ChevronDown size={20} color={colors.secondaryText} />
          </TouchableOpacity>
          {errors.cropName ? <Text style={styles.errorText}>{errors.cropName}</Text> : null}

          {/* Or enter custom crop name */}
          <Input
            label={`${t('cropName')} (${t('customCropName')})`}
            placeholder="e.g. Wheat, Cotton, Tomato, Turmeric"
            value={cropName}
            onChangeText={(v) => {
              setCropName(v);
              if (errors.cropName) setErrors({ ...errors, cropName: undefined });
            }}
            autoCapitalize="words"
          />

          {/* Sowing Date with Interactive Calendar */}
          <DateField
            label={`${t('sowingDate')} *`}
            value={sowingDate}
            onChangeDate={setSowingDate}
            helperText={t('dateCalendarHelper')}
          />

          {/* Area & Unit Row */}
          <View style={styles.row}>
            <View style={styles.halfCol}>
              <Input
                label={`${t('area')} *`}
                placeholder="e.g. 2.5"
                keyboardType="numeric"
                value={area}
                onChangeText={(v) => {
                  setArea(v);
                  if (errors.area) setErrors({ ...errors, area: undefined });
                }}
                error={errors.area}
              />
            </View>
            <View style={styles.halfCol}>
              <Text style={styles.fieldLabel}>{t('areaUnit')}</Text>
              <View style={styles.unitSelector}>
                {AREA_UNITS.map((u) => {
                  const isActive = areaUnit === u.key;
                  return (
                    <TouchableOpacity
                      key={u.key}
                      style={[styles.unitPill, isActive && styles.activeUnitPill]}
                      onPress={() => setAreaUnit(u.key)}
                    >
                      <Text
                        style={[styles.unitText, isActive && styles.activeUnitText]}
                        numberOfLines={1}
                      >
                        {t(u.labelKey)}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Crop Season / Type — Pill Selector */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t('cropType')}</Text>
            <View style={styles.seasonRow}>
              {(['Kharif', 'Rabi', 'Zaid'] as const).map((season) => {
                const isActive = cropType === season;
                const label = season === 'Kharif' ? t('kharif') : season === 'Rabi' ? t('rabi') : t('zaid');
                return (
                  <TouchableOpacity
                    key={season}
                    style={[styles.seasonPill, isActive && styles.activeSeasonPill]}
                    onPress={() => setCropType(season)}
                  >
                    <Text style={[styles.seasonPillText, isActive && styles.activeSeasonPillText]}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Expected Harvest Date with Interactive Calendar */}
          <DateField
            label={t('expectedHarvestDate')}
            value={expectedHarvestDate}
            onChangeDate={setExpectedHarvestDate}
            helperText={t('notesOptional')}
          />

          {/* Notes */}
          <Input
            label={t('notesOptional')}
            placeholder="e.g. Variety / seed brand, irrigation method..."
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
            style={styles.multilineInput}
          />

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <SecondaryButton
              title={t('cancel')}
              onPress={() => router.back()}
              style={styles.actionCol}
            />
            <PrimaryButton
              title={t('save')}
              onPress={handleSave}
              style={styles.actionCol}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Crop Selection Dropdown Modal */}
      <Modal
        visible={dropdownOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setDropdownOpen(false)}
      >
        <Pressable style={styles.backdrop} onPress={() => setDropdownOpen(false)}>
          <View style={styles.sheet}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetIconCircle}>
                <Sprout size={20} color={colors.primaryGreen} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.sheetTitle}>{t('chooseCrop')}</Text>
                <Text style={styles.sheetSubtitle}>{AVAILABLE_CROPS_LIST.length}+ {t('selectCropVariety')}</Text>
              </View>
              <TouchableOpacity
                style={styles.sheetCloseBtn}
                onPress={() => setDropdownOpen(false)}
              >
                <X size={20} color={colors.secondaryText} />
              </TouchableOpacity>
            </View>

            {/* Quick Search Bar */}
            <View style={styles.searchBarBox}>
              <Search size={18} color={colors.secondaryText} />
              <TextInput
                style={styles.searchInput}
                placeholder={t('chooseCrop') + '...'}
                placeholderTextColor={colors.mutedText}
                value={cropSearchQuery}
                onChangeText={setCropSearchQuery}
                autoCapitalize="none"
              />
              {cropSearchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setCropSearchQuery('')}>
                  <X size={16} color={colors.secondaryText} />
                </TouchableOpacity>
              )}
            </View>

            {filteredCropsList.length === 0 ? (
              <View style={styles.noSearchMatch}>
                <Text style={styles.noSearchMatchText}>{t('noCropsFound')}</Text>
              </View>
            ) : (
              <FlatList
                data={filteredCropsList}
                keyExtractor={(item) => item.name}
                contentContainerStyle={styles.listContent}
                keyboardShouldPersistTaps="handled"
                renderItem={({ item }) => {
                  const isSelected = cropName.toLowerCase() === item.name.toLowerCase();
                  const meta = getCropMeta(item.name);
                  const ItemIcon = meta.icon;
                  const cropLabel = t(item.labelKey);

                  return (
                    <TouchableOpacity
                      style={[styles.optionRow, isSelected && styles.optionRowActive]}
                      onPress={() => {
                        setCropName(item.name);
                        if (errors.cropName) setErrors({ ...errors, cropName: undefined });
                        setDropdownOpen(false);
                        setCropSearchQuery('');
                      }}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.optionIconBox, { backgroundColor: meta.bg }]}>
                        <ItemIcon size={18} color={meta.color} />
                      </View>
                      <Text style={[styles.optionText, isSelected && styles.optionTextActive]}>
                        {cropLabel} <Text style={styles.englishSubName}>({item.name})</Text>
                      </Text>
                      {isSelected && <Check size={18} color={colors.primaryGreen} />}
                    </TouchableOpacity>
                  );
                }}
              />
            )}

            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setDropdownOpen(false);
                setCropSearchQuery('');
              }}
            >
              <Text style={styles.cancelText}>{t('close')}</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  formHeader: {
    alignItems: 'center',
    marginVertical: spacing.md,
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  formTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  formSubtitle: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    textAlign: 'center',
    marginTop: 2,
  },
  fieldLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 6,
    marginTop: spacing.xs,
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    minHeight: 52,
    marginBottom: 6,
  },
  dropdownError: {
    borderColor: colors.danger,
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    flex: 1,
  },
  triggerIconBox: {
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  triggerText: {
    fontSize: fontSize.sm,
    color: colors.primaryText,
    fontWeight: fontWeight.semibold,
  },
  triggerPlaceholder: {
    color: colors.mutedText,
    fontWeight: fontWeight.regular,
  },
  errorText: {
    fontSize: 11,
    color: colors.danger,
    marginTop: 2,
    marginBottom: 4,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  halfCol: {
    flex: 1,
  },
  unitSelector: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: 3,
    borderWidth: 1,
    borderColor: colors.border,
    height: 48,
    alignItems: 'center',
  },
  unitPill: {
    flex: 1,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    borderRadius: borderRadius.sm,
  },
  activeUnitPill: {
    backgroundColor: colors.primaryGreen,
  },
  unitText: {
    fontSize: 10,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  activeUnitText: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  multilineInput: {
    height: 80,
    textAlignVertical: 'top',
    paddingTop: spacing.xs,
  },
  fieldGroup: {
    marginVertical: spacing.xs,
  },
  seasonRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.xs,
  },
  seasonPill: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    alignItems: 'center',
  },
  activeSeasonPill: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  seasonPillText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  activeSeasonPillText: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  actionCol: {
    flex: 1,
  },
  // Modal Sheet
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
    gap: spacing.sm,
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: spacing.xs,
  },
  sheetIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
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
  optionText: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.primaryText,
    fontWeight: fontWeight.medium,
  },
  optionTextActive: {
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  sheetCloseBtn: {
    padding: 6,
  },
  searchBarBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 10,
    marginHorizontal: spacing.lg,
    marginVertical: spacing.xs + 2,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: fontSize.sm,
    color: colors.primaryText,
    padding: 0,
  },
  noSearchMatch: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  noSearchMatchText: {
    fontSize: fontSize.sm,
    color: colors.secondaryText,
  },
  englishSubName: {
    fontSize: 12,
    color: colors.mutedText,
    fontWeight: 'normal',
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
