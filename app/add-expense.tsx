import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  BackHandler,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { X, Banknote, Camera, Package, Sprout, ShieldAlert, Users, Droplets, CheckCircle2, AlertCircle, Plus } from 'lucide-react-native';
import { Input } from '../components/ui/Input';
import { CropDropdown } from '../components/ui/CropDropdown';
import { DateField } from '../components/ui/DateField';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { addExpense } from '../data/expensesStore';
import { useCropsStore } from '../data/cropsStore';
import { useLanguage, TranslationKey } from '../locales/languageContext';

type Category = 'Fertilizer' | 'Seeds' | 'Pesticide' | 'Labor' | 'Irrigation' | 'Other';

const CATEGORIES: { key: Category; icon: any; color: string; bg: string }[] = [
  { key: 'Fertilizer', icon: Package,     color: colors.primaryGreen, bg: '#EAF7EF' },
  { key: 'Seeds',      icon: Sprout,      color: '#0284C7',           bg: '#E0F2FE' },
  { key: 'Pesticide',  icon: ShieldAlert, color: '#D97706',           bg: '#FEF3C7' },
  { key: 'Labor',      icon: Users,       color: '#7E22CE',           bg: '#F3E8FF' },
  { key: 'Irrigation', icon: Droplets,    color: '#2563EB',           bg: '#EFF6FF' },
  { key: 'Other',      icon: Banknote,    color: '#6B7280',           bg: '#F3F4F6' },
];

function getTodayString(): string {
  const d = new Date();
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AddExpenseScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { crops } = useCropsStore();

  const [title, setTitle]       = useState('');
  const [amount, setAmount]     = useState('');
  const [category, setCategory] = useState<Category>('Fertilizer');
  const [crop, setCrop]         = useState(crops.length > 0 ? crops[0].name : '');
  const [date, setDate]         = useState(getTodayString());
  const [notes, setNotes]       = useState('');
  const [errors, setErrors]     = useState<{ title?: string; amount?: string; crop?: string }>({});

  useEffect(() => {
    if (!crop && crops.length > 0) {
      setCrop(crops[0].name);
    }
  }, [crops]);

  const validate = (): boolean => {
    const newErrors: { title?: string; amount?: string; crop?: string } = {};
    if (!title.trim()) newErrors.title = t('valEnterExpenseName');
    const parsed = parseFloat(amount.trim());
    if (!amount.trim() || isNaN(parsed) || parsed <= 0) newErrors.amount = t('valEnterValidAmount');
    if (!crop.trim()) newErrors.crop = t('valSelectCrop');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (!validate()) return;

    const matchedCrop = crops.find(
      (c) => c.name.trim().toLowerCase() === crop.trim().toLowerCase()
    );
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validCropId = matchedCrop?.id && UUID_REGEX.test(matchedCrop.id) ? matchedCrop.id : undefined;

    addExpense({
      title:    title.trim(),
      amount:   parseFloat(amount.trim()),
      category,
      crop:     crop.trim(),
      cropId:   validCropId,
      date:     date.trim() || getTodayString(),
    });

    handleClose();
  };

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/expenses');
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const backAction = () => {
      handleClose();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => sub.remove();
  }, []);

  const handleScanBill = () => {
    router.push('/scan-bill');
  };

  const getCategoryLabel = (key: string): string => {
    const tKey = key.toLowerCase() as TranslationKey;
    const val = t(tKey);
    return val !== key ? val : key;
  };

  // If no crops registered, block and prompt to add crop first
  if (crops.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <X size={24} color={colors.primaryText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('addExpense')}</Text>
          <View style={styles.closeBtn} />
        </View>

        <View style={styles.noCropContainer}>
          <View style={styles.noCropIconCircle}>
            <Sprout size={48} color={colors.primaryGreen} />
          </View>
          <Text style={styles.noCropTitle}>{t('addCropFirst')}</Text>
          <Text style={styles.noCropSubtitle}>{t('noCropsToRecordExpense')}</Text>

          <TouchableOpacity
            style={styles.addCropFirstBtn}
            onPress={() => router.push('/add-crop')}
            activeOpacity={0.8}
          >
            <Plus size={20} color={colors.white} />
            <Text style={styles.addCropFirstBtnText}>+ {t('addCrop')}</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
          <X size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('addExpense')}</Text>
        <View style={styles.closeBtn} />
      </View>

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Hero */}
          <View style={styles.formHero}>
            <View style={styles.heroIconCircle}>
              <Banknote size={32} color={colors.primaryGreen} />
            </View>
            <Text style={styles.heroTitle}>{t('recordFarmExpense')}</Text>
            <Text style={styles.heroSubtitle}>{t('recordFarmExpenseSubtitle')}</Text>
          </View>

          {/* Associated Crop — Selected from Registered Crops Only */}
          <CropDropdown
            label={`${t('associatedCrop')} *`}
            value={crop}
            onChange={(selectedCrop) => {
              setCrop(selectedCrop);
              if (errors.crop) setErrors({ ...errors, crop: undefined });
            }}
            error={errors.crop}
          />

          {/* Expense Name */}
          <Input
            label={`${t('expenseName')} *`}
            placeholder="e.g. DAP Fertilizer, Cotton Seeds, Labour"
            value={title}
            onChangeText={(v) => { setTitle(v); if (errors.title) setErrors({ ...errors, title: undefined }); }}
            error={errors.title}
            autoCapitalize="words"
          />

          {/* Amount */}
          <Input
            label={`${t('amount')} (₹) *`}
            placeholder="e.g. 1450"
            keyboardType="numeric"
            value={amount}
            onChangeText={(v) => { setAmount(v); if (errors.amount) setErrors({ ...errors, amount: undefined }); }}
            error={errors.amount}
          />

          {/* Category Selector */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>{t('category')}</Text>
            <View style={styles.categoryGrid}>
              {CATEGORIES.map(({ key, icon: Icon, color, bg }) => {
                const isActive = category === key;
                return (
                  <TouchableOpacity
                    key={key}
                    style={[
                      styles.categoryCard,
                      isActive && { borderColor: color, backgroundColor: bg, ...shadows.sm },
                    ]}
                    onPress={() => setCategory(key)}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.catIconCircle, { backgroundColor: isActive ? bg : colors.background }]}>
                      <Icon size={20} color={isActive ? color : colors.secondaryText} />
                    </View>
                    <Text style={[styles.catLabel, isActive && { color, fontWeight: fontWeight.bold }]}>
                      {getCategoryLabel(key)}
                    </Text>
                    {isActive && (
                      <CheckCircle2 size={16} color={color} style={styles.checkIcon} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Interactive Date Picker Calendar Field */}
          <DateField
            label={`${t('dateLabel')} *`}
            value={date}
            onChangeDate={setDate}
            helperText={t('dateCalendarHelper')}
          />

          {/* Notes */}
          <Input
            label={t('notesOptional')}
            placeholder="e.g. Dealer name, receipt number, remarks..."
            multiline
            numberOfLines={3}
            value={notes}
            onChangeText={setNotes}
            style={styles.multilineInput}
          />

          {/* Scan Bill Shortcut */}
          <TouchableOpacity style={styles.scanBillRow} onPress={handleScanBill} activeOpacity={0.8}>
            <Camera size={20} color={colors.primaryGreen} />
            <Text style={styles.scanBillText}>{t('scanBill')} — {t('scanBillAutofill')}</Text>
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actionsRow}>
            <SecondaryButton
              title={t('cancel')}
              onPress={() => router.back()}
              style={styles.btnHalf}
            />
            <PrimaryButton
              title={t('save')}
              onPress={handleSave}
              style={styles.btnHalf}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: colors.white,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
    paddingBottom: 40,
  },
  formHero: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    marginBottom: spacing.xs,
  },
  heroIconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: '#D1FAE5',
  },
  heroTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 4,
  },
  heroSubtitle: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  fieldGroup: {
    marginVertical: spacing.xs,
  },
  fieldLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 8,
    marginTop: spacing.xs,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryCard: {
    width: '30%',
    flexGrow: 1,
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    borderColor: colors.border,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    gap: 4,
    position: 'relative',
  },
  catIconCircle: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
    textAlign: 'center',
  },
  checkIcon: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  multilineInput: {
    height: 88,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
  },
  scanBillRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    backgroundColor: colors.lightGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderRadius: borderRadius.md,
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  scanBillText: {
    fontSize: fontSize.sm,
    color: colors.primaryGreen,
    fontWeight: fontWeight.semibold,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.lg,
  },
  btnHalf: {
    flex: 1,
  },
  noCropContainer: {
    flex: 1,
    padding: spacing.xxl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  noCropIconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.lg,
    borderWidth: 2,
    borderColor: '#A7F3D0',
  },
  noCropTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  noCropSubtitle: {
    fontSize: fontSize.sm,
    color: colors.secondaryText,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
  },
  addCropFirstBtn: {
    backgroundColor: colors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.full,
    gap: 8,
    ...shadows.md,
  },
  addCropFirstBtnText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
