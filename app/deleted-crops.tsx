import React, { useCallback, memo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
  Alert,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { ArrowLeft, RotateCcw, Trash2, Calendar, Maximize2, ShieldAlert } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { EmptyState } from '../components/ui/EmptyState';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../theme';
import { useCropsStore } from '../data/cropsStore';
import { purgeExpensesForCrop } from '../data/expensesStore';
import { purgeSalesForCrop } from '../data/salesStore';
import { purgeDiaryNotesForCrop } from '../services/diaryStorage';
import { Crop } from '../types';
import { useLanguage, TranslationKey } from '../locales/languageContext';
import { getCropMeta } from '../utils/cropIcons';
import { confirmAction } from '../utils';

interface TrashedCropItemProps {
  crop: Crop;
  onRestore: (id: string, name: string) => void;
  onPermanentDelete: (id: string, name: string) => void;
  formatCropName: (name: string) => string;
  restoreLabel: string;
  permanentDeleteLabel: string;
  sowingDateLabel: string;
  areaLabel: string;
  deletedAtLabel: string;
}

const TrashedCropItem = memo(
  ({
    crop,
    onRestore,
    onPermanentDelete,
    formatCropName,
    restoreLabel,
    permanentDeleteLabel,
    sowingDateLabel,
    areaLabel,
    deletedAtLabel,
  }: TrashedCropItemProps) => {
    const rawName = crop.name || (crop as any).cropName || 'Crop';
    const meta = getCropMeta(rawName);
    const CropIcon = meta.icon;
    const cropDisplay = formatCropName(rawName);

    // Format deleted timestamp
    const deletedDateDisplay = crop.deletedAt
      ? new Date(crop.deletedAt).toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        })
      : 'Recently';

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cropIconWrapper, { backgroundColor: '#FEE2E2' }]}>
            <CropIcon size={30} color={colors.danger} />
          </View>

          <View style={styles.cropInfo}>
            <View style={styles.titleRow}>
              <Text style={styles.cropName}>{cropDisplay}</Text>
              <View style={styles.trashTag}>
                <Text style={styles.trashTagText}>Trashed</Text>
              </View>
            </View>

            <View style={styles.metaRow}>
              <View style={styles.metaItem}>
                <Calendar size={13} color={colors.secondaryText} />
                <Text style={styles.metaLabel}>{sowingDateLabel}:</Text>
                <Text style={styles.metaValue}>{crop.sowingDate}</Text>
              </View>

              <View style={styles.metaItem}>
                <Maximize2 size={13} color={colors.secondaryText} />
                <Text style={styles.metaLabel}>{areaLabel}:</Text>
                <Text style={styles.metaValue}>{crop.area}</Text>
              </View>
            </View>

            <View style={styles.deletedDateRow}>
              <Text style={styles.deletedDateText}>
                {deletedAtLabel}: {deletedDateDisplay}
              </Text>
            </View>
          </View>
        </View>

        {/* Action Buttons: Restore (Primary Green) & Permanent Delete (Red) */}
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={styles.restoreBtn}
            onPress={() => onRestore(crop.id, cropDisplay)}
            activeOpacity={0.8}
          >
            <RotateCcw size={16} color={colors.white} />
            <Text style={styles.restoreBtnText}>{restoreLabel}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.permanentDeleteBtn}
            onPress={() => onPermanentDelete(crop.id, cropDisplay)}
            activeOpacity={0.8}
          >
            <Trash2 size={16} color={colors.danger} />
            <Text style={styles.permanentDeleteBtnText}>{permanentDeleteLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

TrashedCropItem.displayName = 'TrashedCropItem';

export default function DeletedCropsScreen() {
  const router = useRouter();
  const { deletedCrops, restoreCrop, permanentlyDeleteCrop, refreshCrops } = useCropsStore();
  const { t } = useLanguage();
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Automatically refresh latest trashed crops whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      refreshCrops(true).catch(() => {});
    }, [refreshCrops])
  );

  const formatCropName = useCallback(
    (cropName?: string): string => {
      if (!cropName) return '';
      const key = cropName.toLowerCase() as TranslationKey;
      const val = t(key);
      return val !== key ? val : cropName;
    },
    [t]
  );

  const handleRestore = useCallback(
    async (id: string, name: string) => {
      try {
        await restoreCrop(id);
        setActionNotice(`"${name}" ${t('cropRestored')}`);
        setTimeout(() => setActionNotice(null), 3500);
      } catch (err: any) {
        Alert.alert('Error', err?.message || 'Failed to restore crop');
      }
    },
    [restoreCrop, t]
  );

  const handlePermanentDelete = useCallback(
    (id: string, name: string) => {
      confirmAction(
        t('confirmPermanentDeleteTitle'),
        t('confirmPermanentDeleteMsg').replace('{name}', name),
        async () => {
          try {
            await permanentlyDeleteCrop(id, {
              purgeExpenses: purgeExpensesForCrop,
              purgeSales: purgeSalesForCrop,
              purgeDiaryNotes: purgeDiaryNotesForCrop,
            });
            setActionNotice(`"${name}" ${t('cropPermanentlyDeleted')}`);
            setTimeout(() => setActionNotice(null), 3500);
          } catch (err: any) {
            Alert.alert(
              'Error',
              err?.message || 'Failed to permanently delete crop. Data kept intact.'
            );
          }
        },
        t('cancel'),
        t('permanentDelete')
      );
    },
    [permanentlyDeleteCrop, t]
  );

  const renderItem = useCallback(
    ({ item }: { item: Crop }) => (
      <TrashedCropItem
        crop={item}
        onRestore={handleRestore}
        onPermanentDelete={handlePermanentDelete}
        formatCropName={formatCropName}
        restoreLabel={t('restore')}
        permanentDeleteLabel={t('permanentDelete')}
        sowingDateLabel={t('sowingDate')}
        areaLabel={t('area')}
        deletedAtLabel={t('deletedAt')}
      />
    ),
    [handleRestore, handlePermanentDelete, formatCropName, t]
  );

  const keyExtractor = useCallback((item: Crop) => item.id, []);

  const ListEmpty = useCallback(
    () => (
      <EmptyState
        title={t('emptyTrash')}
        description={t('emptyTrashDesc')}
        actionTitle={t('myCrops')}
        onActionPress={() => router.replace('/(tabs)/crops')}
      />
    ),
    [t, router]
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => {
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/(tabs)/crops');
            }
          }}
          activeOpacity={0.7}
        >
          <ArrowLeft size={24} color={colors.primaryText} />
        </TouchableOpacity>

        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>{t('trash')}</Text>
          <Text style={styles.headerSubtitle}>
            {deletedCrops.length} {t('deletedCrops').toLowerCase()}
          </Text>
        </View>

        <View style={{ width: 40 }} />
      </View>

      {/* Info notice bar */}
      <View style={styles.infoBanner}>
        <ShieldAlert size={18} color="#991B1B" />
        <Text style={styles.infoBannerText}>
          {t('softDeleteNotice')}
        </Text>
      </View>

      {/* Action feedback message */}
      {actionNotice && (
        <View style={styles.toastNotice}>
          <Text style={styles.toastNoticeText}>{actionNotice}</Text>
        </View>
      )}

      {/* List of Trashed Crops */}
      <FlatList
        data={deletedCrops}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  headerTitleContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  headerSubtitle: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    marginTop: 2,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderBottomWidth: 1,
    borderBottomColor: '#FEE2E2',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    gap: spacing.sm,
  },
  infoBannerText: {
    flex: 1,
    fontSize: fontSize.xs,
    color: '#991B1B',
    lineHeight: 18,
  },
  toastNotice: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toastNoticeText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  listContent: {
    padding: spacing.md,
    paddingBottom: 40,
    flexGrow: 1,
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: '#FECACA',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
      },
      android: {
        elevation: 1,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  cropIconWrapper: {
    width: 50,
    height: 50,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.md,
  },
  cropInfo: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  cropName: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  trashTag: {
    backgroundColor: '#FEE2E2',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: borderRadius.sm,
  },
  trashTagText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.danger,
    textTransform: 'uppercase',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    marginBottom: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaLabel: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
  },
  metaValue: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.medium,
    color: colors.primaryText,
  },
  deletedDateRow: {
    marginTop: 2,
  },
  deletedDateText: {
    fontSize: 11,
    color: colors.secondaryText,
    fontStyle: 'italic',
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm,
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  restoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  restoreBtnText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
  permanentDeleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    gap: 6,
  },
  permanentDeleteBtnText: {
    color: colors.danger,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
  },
});
