import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
  ActivityIndicator,
  Alert,
  ScrollView,
  TextInput,
  Image,
  BackHandler,
  Platform,
} from 'react-native';
import {
  ChevronLeft,
  Image as ImageIcon,
  Zap,
  ZapOff,
  CheckCircle2,
  RefreshCw,
  FileText,
  Camera,
  Layers,
  Calendar,
  DollarSign,
  Tag,
  Store,
  AlertCircle,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';

// Lazy loader for heavy expo-image-picker
async function getImagePicker() {
  return await import('expo-image-picker');
}
import { addExpense } from '../data/expensesStore';
import { useCropsStore } from '../data/cropsStore';
import { PrimaryButton } from '../components/ui/PrimaryButton';
import { SecondaryButton } from '../components/ui/SecondaryButton';
import { useLanguage } from '../locales/languageContext';
import { api } from '../services/api';

interface ExtractedItem {
  name: string;
  quantity: number;
  unit: string;
  price: number;
  amount: number;
}

export default function ScanBillScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { crops } = useCropsStore();

  const [scanState, setScanState] = useState<'idle' | 'scanning' | 'scanned'>('idle');
  const [flashOn, setFlashOn] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [imageMime, setImageMime] = useState<string>('image/jpeg');
  const [isSaving, setIsSaving] = useState(false);
  const [rawOcrText, setRawOcrText] = useState<string>('');

  // Extracted & Farmer-Editable Fields — strictly initialized as empty (no dummy data)
  const [vendorName, setVendorName] = useState<string>('');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('');
  const [billDate, setBillDate] = useState<string>('');
  const [totalAmount, setTotalAmount] = useState<string>('');
  const [items, setItems] = useState<ExtractedItem[]>([]);
  const [selectedCrop, setSelectedCrop] = useState<string>(crops.length > 0 ? crops[0].name : 'General');
  const [selectedCategory, setSelectedCategory] = useState<string>('FERTILIZER');
  const [paymentMode, setPaymentMode] = useState<string>('CASH');

  const laserAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (scanState === 'scanning') {
      laserAnim.setValue(0);
      const loop = Animated.loop(
        Animated.sequence([
          Animated.timing(laserAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          Animated.timing(laserAnim, {
            toValue: 0,
            duration: 1200,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
        ])
      );
      loop.start();
      return () => loop.stop();
    }
  }, [scanState]);

  const handleClose = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(tabs)');
    }
  };

  useEffect(() => {
    if (Platform.OS !== 'android') return;
    const backAction = () => {
      handleClose();
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  // Request permissions and open Camera
  const handleCaptureCamera = async () => {
    try {
      const ImagePicker = await getImagePicker();
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Camera access is needed to scan bills and receipts directly.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.85,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          processImageOcr(asset.uri, asset.base64, asset.mimeType || 'image/jpeg');
        }
      }
    } catch (err: any) {
      console.error('Camera error:', err);
      Alert.alert('Camera Error', err?.message || 'Could not open camera');
    }
  };

  // Open Gallery picker
  const handlePickGallery = async () => {
    try {
      const ImagePicker = await getImagePicker();
      const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        Alert.alert(
          'Permission Required',
          'Photo library access is needed to select receipt photos.'
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.85,
        base64: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const asset = result.assets[0];
        if (asset.base64) {
          processImageOcr(asset.uri, asset.base64, asset.mimeType || 'image/jpeg');
        }
      }
    } catch (err: any) {
      console.error('Gallery error:', err);
      Alert.alert('Gallery Error', err?.message || 'Could not pick image');
    }
  };

  // Process OCR on backend using the actual uploaded image
  const processImageOcr = async (uri: string, base64: string, mime: string) => {
    setImageUri(uri);
    setImageBase64(base64);
    setImageMime(mime);
    setScanState('scanning');

    // Reset previous values
    setVendorName('');
    setInvoiceNumber('');
    setBillDate(new Date().toISOString().split('T')[0]);
    setTotalAmount('');
    setItems([]);
    setRawOcrText('');

    try {
      const ocrResult = await api.scanBillOcr({
        imageBase64: base64,
        mimeType: mime,
      });

      if (ocrResult) {
        // Set ONLY actual extracted fields from the image
        setVendorName(ocrResult.vendorName || '');
        setInvoiceNumber(ocrResult.invoiceNumber || '');
        if (ocrResult.billDate) {
          setBillDate(ocrResult.billDate);
        } else {
          setBillDate(new Date().toISOString().split('T')[0]);
        }
        setTotalAmount(ocrResult.totalAmount && ocrResult.totalAmount > 0 ? String(ocrResult.totalAmount) : '');
        setItems(Array.isArray(ocrResult.items) ? ocrResult.items : []);
        setRawOcrText(ocrResult.rawText || '');

        // Set category from Gemini AI if detected
        if (ocrResult.category && ['FERTILIZER', 'SEEDS', 'PESTICIDE', 'MACHINERY', 'LABOR', 'IRRIGATION', 'OTHER'].includes(ocrResult.category)) {
          setSelectedCategory(ocrResult.category);
        } else {
          // Keyword detection fallback
          const detectedText = `${ocrResult.vendorName || ''} ${ocrResult.rawText || ''}`.toLowerCase();
          if (detectedText.includes('fertil') || detectedText.includes('dap') || detectedText.includes('urea') || detectedText.includes('npk')) {
            setSelectedCategory('FERTILIZER');
          } else if (detectedText.includes('seed') || detectedText.includes('beej') || detectedText.includes('biya')) {
            setSelectedCategory('SEEDS');
          } else if (detectedText.includes('pest') || detectedText.includes('insect') || detectedText.includes('spray') || detectedText.includes('fungi')) {
            setSelectedCategory('PESTICIDE');
          } else if (detectedText.includes('diesel') || detectedText.includes('tractor') || detectedText.includes('machin') || detectedText.includes('motor')) {
            setSelectedCategory('MACHINERY');
          }
        }
      }

      setScanState('scanned');
    } catch (err: any) {
      console.warn('OCR processing notice:', err?.message || err);
      Alert.alert(
        'Scan Notice',
        'Could not automatically read details from this photo. You can verify and fill in the bill details below.'
      );
      setScanState('scanned');
    }
  };

  const handleSaveExpense = async () => {
    const numericAmount = parseFloat(totalAmount);
    if (isNaN(numericAmount) || numericAmount <= 0) {
      Alert.alert('Amount Required', 'Please enter a valid bill amount before saving.');
      return;
    }

    setIsSaving(true);
    try {
      // Find matching crop ID
      const matchingCrop = crops.find((c) => c.name === selectedCrop);
      const cropId = matchingCrop ? matchingCrop.id : undefined;

      const finalVendor = vendorName.trim() || 'Farm Expense';
      const finalTitle = `${finalVendor}${invoiceNumber ? ` (Bill #${invoiceNumber.trim()})` : ''}`;

      // 1. Save Bill & linked Expense record to Neon PostgreSQL
      await api.saveBill({
        imageBase64: imageBase64 || undefined,
        mimeType: imageMime,
        vendorName: finalVendor,
        invoiceNumber: invoiceNumber.trim() || undefined,
        billDate: billDate || new Date().toISOString().split('T')[0],
        totalAmount: numericAmount,
        rawOcrText: rawOcrText || undefined,
        expenseTitle: finalTitle,
        expenseCategory: selectedCategory,
        expenseCrop: selectedCrop,
        expenseCropId: cropId,
        expensePaymentMode: paymentMode,
        expenseNotes: items.length > 0 ? items.map((i) => `${i.name} (${i.quantity} ${i.unit}): ₹${i.amount}`).join(', ') : undefined,
      });

      // 2. Also register in local state for immediate UI reflection
      const catMap: Record<string, 'Fertilizer' | 'Seeds' | 'Pesticide' | 'Labor' | 'Irrigation' | 'Other'> = {
        FERTILIZER: 'Fertilizer',
        SEEDS: 'Seeds',
        PESTICIDE: 'Pesticide',
        LABOR: 'Labor',
        MACHINERY: 'Other',
        IRRIGATION: 'Irrigation',
        OTHER: 'Other',
      };
      const formattedCategory = catMap[selectedCategory] || 'Other';

      addExpense({
        title: finalTitle,
        amount: numericAmount,
        category: formattedCategory,
        crop: selectedCrop,
        date: billDate || new Date().toISOString().split('T')[0],
      });

      // 3. Automatically close scan window and navigate directly to Expenses tab
      router.replace('/(tabs)/expenses');
    } catch (err: any) {
      console.error('Failed to save bill:', err);
      Alert.alert('Save Error', err?.message || 'Failed to save bill. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleScanAnother = () => {
    setImageUri(null);
    setImageBase64(null);
    setVendorName('');
    setInvoiceNumber('');
    setBillDate('');
    setTotalAmount('');
    setItems([]);
    setRawOcrText('');
    setScanState('idle');
  };

  const translateY = laserAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 260],
  });

  const categories = [
    { id: 'FERTILIZER', label: 'Fertilizer' },
    { id: 'SEEDS', label: 'Seeds' },
    { id: 'PESTICIDE', label: 'Pesticide' },
    { id: 'MACHINERY', label: 'Machinery' },
    { id: 'LABOR', label: 'Labor' },
    { id: 'OTHER', label: 'Other' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom', 'left', 'right']}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.iconBtn} onPress={handleClose}>
          <ChevronLeft size={26} color={colors.white} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>{t('scanBill')}</Text>

        <TouchableOpacity style={styles.iconBtn} onPress={handlePickGallery}>
          <ImageIcon size={22} color={colors.white} />
        </TouchableOpacity>
      </View>

      {/* Viewfinder Camera Scanner Area */}
      {scanState !== 'scanned' && (
        <View style={styles.viewfinderContainer}>
          <View style={styles.scannerFrame}>
            {scanState === 'scanning' && (
              <Animated.View
                style={[
                  styles.laserLine,
                  { transform: [{ translateY }] },
                ]}
              />
            )}

            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.capturedPreview} resizeMode="contain" />
            ) : (
              <View style={styles.cameraPlaceholderBox}>
                <FileText size={48} color="rgba(255,255,255,0.3)" />
                <Text style={styles.cameraPlaceholderText}>
                  Align physical bill or receipt inside the frame
                </Text>
                <Text style={styles.cameraPlaceholderSubtext}>
                  Ensure good lighting for accurate text extraction
                </Text>
              </View>
            )}

            <View style={[styles.corner, styles.cornerTL]} />
            <View style={[styles.corner, styles.cornerTR]} />
            <View style={[styles.corner, styles.cornerBL]} />
            <View style={[styles.corner, styles.cornerBR]} />
          </View>
        </View>
      )}

      {scanState === 'scanning' && (
        <View style={styles.scanningBanner}>
          <ActivityIndicator color={colors.primaryGreen} size="small" />
          <Text style={styles.scanningText}>{t('scanningBill')}</Text>
        </View>
      )}

      {scanState === 'idle' && (
        <>
          <View style={styles.guidanceContainer}>
            <View style={styles.guidancePill}>
              <Text style={styles.guidanceText}>
                {t('ensureBillClear')}
              </Text>
            </View>
          </View>

          <View style={styles.controlsBar}>
            <TouchableOpacity style={styles.controlCircleBtn} onPress={handlePickGallery}>
              <ImageIcon size={22} color={colors.white} />
            </TouchableOpacity>

            <TouchableOpacity style={styles.shutterOuterRing} onPress={handleCaptureCamera}>
              <View style={styles.shutterInnerCircle} />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.controlCircleBtn}
              onPress={() => setFlashOn(!flashOn)}
            >
              {flashOn ? (
                <Zap size={22} color="#F59E0B" />
              ) : (
                <ZapOff size={22} color={colors.white} />
              )}
            </TouchableOpacity>
          </View>
        </>
      )}

      {/* Review & Edit Scanned Data */}
      {scanState === 'scanned' && (
        <ScrollView style={styles.scannedScrollContainer} contentContainerStyle={styles.scannedScrollContent}>
          <View style={styles.scannedResultCard}>
            {/* Captured Bill Thumbnail & Status */}
            <View style={styles.resultHeaderRow}>
              {imageUri && (
                <Image source={{ uri: imageUri }} style={styles.thumbnailImage} resizeMode="cover" />
              )}
              <View style={{ flex: 1 }}>
                <View style={styles.statusBadge}>
                  <CheckCircle2 size={16} color={colors.primaryGreen} />
                  <Text style={styles.statusBadgeText}>OCR Extracted Details</Text>
                </View>
                <Text style={styles.resultFieldLabel}>Vendor / Shop Name</Text>
                <TextInput
                  style={styles.vendorInput}
                  value={vendorName}
                  onChangeText={setVendorName}
                  placeholder="e.g. Shree Agro Center"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Bill Meta Row */}
            <View style={styles.metaEditRow}>
              <View style={styles.metaField}>
                <Text style={styles.metaFieldLabel}>Bill / Invoice #</Text>
                <TextInput
                  style={styles.metaInput}
                  value={invoiceNumber}
                  onChangeText={setInvoiceNumber}
                  placeholder="e.g. 2456"
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={styles.metaField}>
                <Text style={styles.metaFieldLabel}>Bill Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.metaInput}
                  value={billDate}
                  onChangeText={setBillDate}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Extracted Line Items */}
            <View style={styles.resultItemsSummary}>
              <Text style={styles.itemsSectionTitle}>
                Detected Line Items ({items.length})
              </Text>

              {items.length > 0 ? (
                items.map((item, idx) => (
                  <View key={idx} style={styles.itemRow}>
                    <Text style={styles.itemBullet}>•</Text>
                    <Text style={styles.resultItemText}>
                      {item.name} {item.quantity > 1 || item.unit !== 'unit' ? `(${item.quantity} ${item.unit})` : ''}
                    </Text>
                    <Text style={styles.itemAmountText}>₹{item.amount.toLocaleString()}</Text>
                  </View>
                ))
              ) : (
                <Text style={styles.noItemsText}>
                  No individual line items detected. You can edit the total amount below.
                </Text>
              )}

              {/* Total Amount Input */}
              <View style={styles.resultTotalRow}>
                <Text style={styles.resultTotalLabel}>{t('extractedTotalAmount')}</Text>
                <View style={styles.totalInputRow}>
                  <Text style={styles.rupeeSymbol}>₹</Text>
                  <TextInput
                    style={styles.totalAmountInput}
                    value={totalAmount}
                    onChangeText={setTotalAmount}
                    keyboardType="numeric"
                    placeholder="0"
                    placeholderTextColor="#94A3B8"
                  />
                </View>
              </View>
            </View>

            {/* Link to Crop */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerSectionLabel}>Link to Crop</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                {crops.map((c) => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.pill, selectedCrop === c.name && styles.pillActive]}
                    onPress={() => setSelectedCrop(c.name)}
                  >
                    <Text style={[styles.pillText, selectedCrop === c.name && styles.pillTextActive]}>
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                ))}
                <TouchableOpacity
                  style={[styles.pill, selectedCrop === 'General' && styles.pillActive]}
                  onPress={() => setSelectedCrop('General')}
                >
                  <Text style={[styles.pillText, selectedCrop === 'General' && styles.pillTextActive]}>
                    General / Farm
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {/* Select Expense Category */}
            <View style={styles.pickerSection}>
              <Text style={styles.pickerSectionLabel}>Expense Category</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.pillsScroll}>
                {categories.map((cat) => (
                  <TouchableOpacity
                    key={cat.id}
                    style={[styles.pill, selectedCategory === cat.id && styles.pillActive]}
                    onPress={() => setSelectedCategory(cat.id)}
                  >
                    <Text style={[styles.pillText, selectedCategory === cat.id && styles.pillTextActive]}>
                      {cat.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Action Buttons */}
            <View style={styles.scannedActions}>
              <SecondaryButton
                title={t('scanAnotherBill')}
                onPress={handleScanAnother}
                icon={<RefreshCw size={16} color={colors.primaryGreen} />}
                style={styles.actionCol}
              />
              <PrimaryButton
                title={isSaving ? 'Saving...' : t('saveExpense')}
                onPress={handleSaveExpense}
                disabled={isSaving}
                style={styles.actionCol}
              />
            </View>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
  },
  iconBtn: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.white,
  },
  viewfinderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.xl,
  },
  scannerFrame: {
    width: '100%',
    height: 320,
    borderRadius: borderRadius.md,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing.md,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  capturedPreview: {
    width: '100%',
    height: '100%',
    borderRadius: borderRadius.sm,
  },
  cameraPlaceholderBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },
  cameraPlaceholderText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    textAlign: 'center',
  },
  cameraPlaceholderSubtext: {
    color: '#94A3B8',
    fontSize: fontSize.xs,
    textAlign: 'center',
  },
  laserLine: {
    position: 'absolute',
    left: 10,
    right: 10,
    top: 10,
    height: 3,
    backgroundColor: colors.primaryGreen,
    zIndex: 20,
    shadowColor: colors.primaryGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 6,
    elevation: 8,
  },
  corner: {
    position: 'absolute',
    width: 28,
    height: 28,
    borderColor: colors.primaryGreen,
  },
  cornerTL: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: borderRadius.sm,
  },
  cornerTR: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: borderRadius.sm,
  },
  cornerBL: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: borderRadius.sm,
  },
  cornerBR: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: borderRadius.sm,
  },
  scanningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    marginVertical: spacing.lg,
  },
  scanningText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  guidanceContainer: {
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  guidancePill: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
  },
  guidanceText: {
    color: colors.white,
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
  },
  controlsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: spacing.xl,
    paddingHorizontal: spacing.xl,
  },
  controlCircleBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterOuterRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shutterInnerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: colors.primaryGreen,
  },
  scannedScrollContainer: {
    flex: 1,
    backgroundColor: colors.white,
    borderTopLeftRadius: borderRadius.xl,
    borderTopRightRadius: borderRadius.xl,
  },
  scannedScrollContent: {
    padding: spacing.lg,
  },
  scannedResultCard: {
    gap: spacing.md,
  },
  resultHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  thumbnailImage: {
    width: 64,
    height: 64,
    borderRadius: borderRadius.sm,
    backgroundColor: colors.background,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  statusBadgeText: {
    fontSize: fontSize.xs,
    color: colors.primaryGreen,
    fontWeight: fontWeight.bold,
  },
  resultFieldLabel: {
    fontSize: 10,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  vendorInput: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    paddingVertical: 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  metaEditRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metaField: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    padding: spacing.sm,
  },
  metaFieldLabel: {
    fontSize: 10,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
    marginBottom: 2,
  },
  metaInput: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.primaryText,
    padding: 0,
  },
  resultItemsSummary: {
    backgroundColor: colors.background,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    gap: 6,
  },
  itemsSectionTitle: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.secondaryText,
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemBullet: {
    color: colors.primaryGreen,
    fontWeight: fontWeight.bold,
    marginRight: 4,
  },
  resultItemText: {
    flex: 1,
    fontSize: fontSize.xs,
    color: colors.primaryText,
  },
  itemAmountText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.primaryText,
  },
  noItemsText: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontStyle: 'italic',
    marginVertical: 4,
  },
  resultTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.xs,
    paddingTop: spacing.xs,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  resultTotalLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  totalInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rupeeSymbol: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
    marginRight: 2,
  },
  totalAmountInput: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
    minWidth: 80,
    textAlign: 'right',
    padding: 0,
  },
  pickerSection: {
    gap: spacing.xs,
  },
  pickerSectionLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.secondaryText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pillsScroll: {
    flexDirection: 'row',
  },
  pill: {
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: spacing.xs,
  },
  pillActive: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  pillText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.secondaryText,
  },
  pillTextActive: {
    color: colors.white,
  },
  scannedActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  actionCol: {
    flex: 1,
  },
});
