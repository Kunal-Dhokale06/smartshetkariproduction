import React, { useState, useMemo, useCallback, memo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Menu, Plus, Trash2, Calendar, Maximize2 } from 'lucide-react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import { useCropsStore } from '../../data/cropsStore';
import { Crop, CropStatus } from '../../types';
import { useLanguage, TranslationKey } from '../../locales/languageContext';
import { getCropMeta } from '../../utils/cropIcons';
import { confirmAction } from '../../utils';

const FILTER_TABS: Array<'All' | CropStatus> = ['All', 'Growing', 'Harvested'];

interface CropItemProps {
  crop: Crop;
  onDelete: (id: string) => void;
  formatCropName: (name: string) => string;
  growingLabel: string;
  harvestedLabel: string;
  sowingDateLabel: string;
  areaLabel: string;
  deleteLabel: string;
}

const CropItem = memo(
  ({
    crop,
    onDelete,
    formatCropName,
    growingLabel,
    harvestedLabel,
    sowingDateLabel,
    areaLabel,
    deleteLabel,
  }: CropItemProps) => {
    const rawName = crop.name || (crop as any).cropName || 'Crop';
    const meta = getCropMeta(rawName);
    const CropIcon = meta.icon;
    const cropDisplay = formatCropName(rawName);
    const isGrowing = (crop.status || '').toLowerCase() === 'growing';

    return (
      <View style={styles.cropCard}>
        <View style={styles.cropCardMain}>
          <View style={[styles.cropIconWrapper, { backgroundColor: meta.bg }]}>
            <CropIcon size={32} color={meta.color} />
          </View>

          <View style={styles.cropInfo}>
            <View style={styles.cropHeaderRow}>
              <Text style={styles.cropName}>{cropDisplay}</Text>
              <Badge
                label={isGrowing ? growingLabel : harvestedLabel}
                variant={isGrowing ? 'growing' : 'harvested'}
              />
            </View>

            <View style={styles.detailsRow}>
              <View style={styles.detailItem}>
                <Calendar size={14} color={colors.secondaryText} />
                <Text style={styles.detailLabel}>{sowingDateLabel}:</Text>
                <Text style={styles.detailValue}>{crop.sowingDate}</Text>
              </View>
              <View style={styles.detailItem}>
                <Maximize2 size={14} color={colors.secondaryText} />
                <Text style={styles.detailLabel}>{areaLabel}:</Text>
                <Text style={styles.detailValue}>{crop.area}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Delete Row */}
        <View style={styles.cardFooterRow}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(crop.id)}
            activeOpacity={0.7}
          >
            <Trash2 size={20} color={colors.danger} />
            <Text style={styles.deleteBtnText}>{deleteLabel}</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
);

CropItem.displayName = 'CropItem';

export default function CropsScreen() {
  const router = useRouter();
  const { crops, deletedCrops, deleteCrop, refreshCrops } = useCropsStore();
  const { t } = useLanguage();
  const [selectedTab, setSelectedTab] = useState<'All' | CropStatus>('All');

  // Automatically refresh latest crops and trash state when screen is focused
  useFocusEffect(
    useCallback(() => {
      refreshCrops(true).catch(() => {});
    }, [refreshCrops])
  );

  const filteredCrops = useMemo(() => {
    if (selectedTab === 'All') return crops;
    return crops.filter(
      (c) => (c.status || '').toLowerCase() === selectedTab.toLowerCase()
    );
  }, [crops, selectedTab]);

  const handleOpenAddCrop = useCallback(() => router.push('/add-crop'), [router]);

  const getFilterLabel = useCallback(
    (tab: 'All' | CropStatus): string => {
      if (tab === 'All') return t('all');
      if (tab === 'Growing') return t('growing');
      return t('harvested');
    },
    [t]
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

  const handleDeleteCrop = useCallback(
    (id: string) => {
      confirmAction(
        t('deleteCropTitle'),
        t('deleteCropMsg'),
        () => {
          deleteCrop(id);
        },
        t('cancel'),
        t('delete')
      );
    },
    [t, deleteCrop]
  );

  const renderCropItem = useCallback(
    ({ item }: { item: Crop }) => (
      <CropItem
        crop={item}
        onDelete={handleDeleteCrop}
        formatCropName={formatCropName}
        growingLabel={t('growing')}
        harvestedLabel={t('harvested')}
        sowingDateLabel={t('sowingDate')}
        areaLabel={t('area')}
        deleteLabel={t('delete')}
      />
    ),
    [handleDeleteCrop, formatCropName, t]
  );

  const keyExtractor = useCallback((item: Crop) => item.id, []);

  const ListEmpty = useCallback(
    () => (
      <EmptyState
        title={t('noCropsFound')}
        description={t('noCropsFoundDesc')}
        actionTitle={`+ ${t('addCrop')}`}
        onActionPress={handleOpenAddCrop}
      />
    ),
    [t, handleOpenAddCrop]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/drawer')}>
          <Menu size={28} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('myCrops')}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TouchableOpacity
            style={styles.trashIconButton}
            onPress={() => router.push('/deleted-crops')}
            activeOpacity={0.7}
            accessibilityLabel={t('trash')}
          >
            <Trash2 size={20} color={deletedCrops.length > 0 ? colors.danger : colors.secondaryText} />
            {deletedCrops.length > 0 && (
              <View style={styles.trashBadge}>
                <Text style={styles.trashBadgeText}>{deletedCrops.length}</Text>
              </View>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.addButton} onPress={handleOpenAddCrop} activeOpacity={0.8}>
            <Plus size={20} color={colors.white} />
            <Text style={styles.addButtonText}>+ {t('addCrop')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {FILTER_TABS.map((tab) => {
          const isActive = selectedTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.filterTab, isActive && styles.activeFilterTab]}
              onPress={() => setSelectedTab(tab)}
              activeOpacity={0.8}
            >
              <Text style={[styles.filterTabText, isActive && styles.activeFilterTabText]} numberOfLines={1}>
                {getFilterLabel(tab)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Crop List */}
      <FlatList
        data={filteredCrops}
        keyExtractor={keyExtractor}
        renderItem={renderCropItem}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        initialNumToRender={8}
        maxToRenderPerBatch={10}
        windowSize={5}
        removeClippedSubviews={Platform.OS !== 'web'}
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
    paddingVertical: spacing.md + 4,
    backgroundColor: colors.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  iconButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  trashIconButton: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.md,
    backgroundColor: '#FEE2E2',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  trashBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: colors.danger,
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  trashBadgeText: {
    color: colors.white,
    fontSize: 10,
    fontWeight: fontWeight.bold,
  },
  addButton: {
    backgroundColor: colors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  addButtonText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  filterRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    gap: spacing.sm + 2,
  },
  filterTab: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    backgroundColor: colors.white,
    borderWidth: 1.5,
    borderColor: colors.border,
  },
  activeFilterTab: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  filterTabText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.semibold,
    color: colors.secondaryText,
  },
  activeFilterTabText: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  listContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + 20,
    gap: spacing.md + 2,
  },
  cropCard: {
    borderColor: colors.border,
    borderWidth: 1.5,
    backgroundColor: colors.white,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cropCardMain: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md + 4,
  },
  cropIconWrapper: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    flexShrink: 0,
  },
  cropInfo: {
    flex: 1,
  },
  cropHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cropName: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    flex: 1,
    marginRight: 8,
  },
  detailsRow: {
    gap: 6,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailLabel: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  detailValue: {
    fontSize: fontSize.sm,
    color: colors.primaryText,
    fontWeight: fontWeight.bold,
  },
  cardFooterRow: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingHorizontal: spacing.md + 4,
    paddingVertical: spacing.sm + 2,
    backgroundColor: '#FAFAFA',
  },
  deleteBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FECACA',
  },
  deleteBtnText: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.danger,
  },
});
