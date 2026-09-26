import React, { useState, useEffect, useMemo } from 'react';
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
import { X, ShoppingCart, TrendingUp, Sprout, Plus } from 'lucide-react-native';
import { Input } from '../components/ui/Input';
import { CropDropdown } from '../components/ui/CropDropdown';
import { UnitDropdown } from '../components/ui/UnitDropdown';
import { DateField } from '../components/ui/DateField';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../theme';
import { addSale } from '../data/salesStore';
import { useCropsStore } from '../data/cropsStore';
import { formatCurrency } from '../utils';
import { useLanguage } from '../locales/languageContext';

function getTodayString(): string {
  const d = new Date();
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function AddSaleScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { crops } = useCropsStore();

  const activeCrops = useMemo(
    () => crops.filter((c: any) => c.status !== 'Deleted' && !c.isDeleted),
    [crops]
  );

  const [cropName, setCropName]         = useState(activeCrops.length > 0 ? activeCrops[0].name : '');
  const [quantity, setQuantity]         = useState('');
  const [unit, setUnit]                 = useState('Quintal');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [marketName, setMarketName]     = useState('Pune APMC Market');
  const [date, setDate]                 = useState(getTodayString());
  const [notes, setNotes]               = useState('');
  const [errors, setErrors]             = useState<Record<string, string>>({});

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)/sales');
    }
  };

  useEffect(() => {
    const onBackPress = () => {
      handleClose();
      return true;
    };
    const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (!cropName && activeCrops.length > 0) {
      setCropName(activeCrops[0].name);
    }
  }, [activeCrops]);

  const numQty   = parseFloat(quantity.trim())      || 0;
  const numPrice = parseFloat(pricePerUnit.trim())  || 0;
  const calculatedTotal = numQty * numPrice;

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!cropName.trim())          newErrors.cropName    = t('valSelectCrop');
    if (numQty <= 0)               newErrors.quantity    = t('valEnterValidQuantity');
    if (numPrice <= 0)             newErrors.pricePerUnit = t('valEnterValidPrice');
    if (!marketName.trim())        newErrors.marketName  = t('valEnterMarketName');
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const clearError = (field: string) =>
    setErrors((prev) => { const e = { ...prev }; delete e[field]; return e; });

  const handleSave = () => {
    if (!validate()) return;

    const matchedCrop = activeCrops.find(
      (c: any) => c.name.trim().toLowerCase() === cropName.trim().toLowerCase()
    );
    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const validCropId = matchedCrop?.id && UUID_REGEX.test(matchedCrop.id) ? matchedCrop.id : undefined;

    addSale({
      cropName:     cropName.trim(),
      cropId:       validCropId,
      quantity:     numQty,
      unit,
      pricePerUnit: numPrice,
      marketName:   marketName.trim(),
      totalAmount:  calculatedTotal,
      date:         date.trim() || getTodayString(),
    });

    handleClose();
  };

  // If no active crops registered, block and prompt to add crop first
  if (activeCrops.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.closeBtn} onPress={handleClose}>
            <X size={24} color={colors.primaryText} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('addSale')}</Text>
          <View style={styles.closeBtn} />
        </View>

        <View style={styles.noCropContainer}>
          <View style={styles.noCropIconCircle}>
            <Sprout size={48} color={colors.primaryGreen} />
          </View>
          <Text style={styles.noCropTitle}>{t('addCropFirst')}</Text>
          <Text style={styles.noCropSubtitle}>{t('noCropsToRecordSale')}</Text>

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
        <Text style={styles.headerTitle}>{t('addSale')}</Text>
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
              <ShoppingCart size={32} color={colors.primaryGreen} />
            </View>
            <Text style={styles.heroTitle}>{t('recordMarketSale')}</Text>
            <Text style={styles.heroSubtitle}>{t('recordMarketSaleSubtitle')}</Text>
          </View>

          {/* Dynamic Crop Dropdown from Registered Crops Only */}
          <CropDropdown
            label={`${t('cropLabel')} *`}
            value={cropName}
            onChange={(selected) => {
              setCropName(selected);
              clearError('cropName');
            }}
            error={errors.cropName}
          />

          {/* Quantity and Unit Dropdown Row */}
          <View style={styles.row}>
            <View style={styles.colHalf}>
              <Input
                label={`${t('quantity')} *`}
                placeholder="e.g. 10"
                keyboardType="numeric"
                value={quantity}
                onChangeText={(v) => { setQuantity(v); clearError('quantity'); }}
                error={errors.quantity}
              />
            </View>

            <View style={styles.colHalf}>
              <UnitDropdown
                label={`${t('unit')} *`}
                value={unit}
                onChange={(selectedUnit) => setUnit(selectedUnit)}
                compact
              />
            </View>
          </View>

          {/* Price Per Unit */}
          <Input
            label={`${t('pricePerUnit')} (₹/${unit}) *`}
            placeholder="e.g. 2500"
            keyboardType="numeric"
            value={pricePerUnit}
            onChangeText={(v) => { setPricePerUnit(v); clearError('pricePerUnit'); }}
            error={errors.pricePerUnit}
          />

          {/* Live Total Revenue Card */}
          <View style={[styles.totalCard, calculatedTotal > 0 && styles.totalCardActive]}>
            <View>
              <Text style={styles.totalLabel}>{t('calculatedTotalRevenue')}</Text>
              <Text style={styles.totalSubLabel}>
                {numQty > 0 && numPrice > 0
                  ? `${numQty} ${unit} × ₹${numPrice.toLocaleString('en-IN')}`
                  : t('enterQuantityAndPrice')}
              </Text>
            </View>
            <View style={styles.totalAmountGroup}>
              {calculatedTotal > 0 && <TrendingUp size={18} color={colors.primaryGreen} />}
              <Text style={[styles.totalAmount, calculatedTotal > 0 && styles.totalAmountActive]}>
                {formatCurrency(calculatedTotal)}
              </Text>
            </View>
          </View>

          {/* Market / Buyer Name */}
          <Input
            label={`${t('marketBuyerName')} *`}
            placeholder="e.g. Pune APMC, Local Trader"
            value={marketName}
            onChangeText={(v) => { setMarketName(v); clearError('marketName'); }}
            error={errors.marketName}
            autoCapitalize="words"
          />

          {/* Sale Date (Calendar Date Picker) */}
          <DateField
            label={`${t('saleDate')} *`}
            value={date}
            onChangeDate={setDate}
            helperText={t('dateCalendarHelper')}
          />

          {/* Notes */}
          <Input
            label={t('notesOptional')}
            placeholder="e.g. Quality grade, transport remarks..."
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
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.sm,
    borderWidth: 1.5,
    borderColor: '#BAE6FD',
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
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'flex-start',
  },
  colHalf: {
    flex: 1,
  },
  totalCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: spacing.sm,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  totalCardActive: {
    backgroundColor: colors.lightGreen,
    borderColor: colors.primaryGreen,
    ...shadows.sm,
  },
  totalLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  totalSubLabel: {
    fontSize: 12,
    color: colors.secondaryText,
    marginTop: 2,
  },
  totalAmountGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  totalAmount: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.mutedText,
  },
  totalAmountActive: {
    color: colors.primaryGreen,
  },
  multilineInput: {
    height: 88,
    textAlignVertical: 'top',
    paddingTop: spacing.sm,
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
