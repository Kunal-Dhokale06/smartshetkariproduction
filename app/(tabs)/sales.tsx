import React, { useCallback, memo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Menu, Plus, ShoppingCart, Store, TrendingUp, Trash2 } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import { useSalesStore } from '../../data/salesStore';
import { formatCurrency, confirmAction } from '../../utils';
import { useLanguage, TranslationKey } from '../../locales/languageContext';
import { getCropMeta } from '../../utils/cropIcons';
import { Sale } from '../../types';

interface SaleItemProps {
  item: Sale;
  onDelete: (id: string) => void;
  formatCropName: (name: string) => string;
  formatUnitName: (unit: string) => string;
  formatMarketName: (market: string) => string;
  deleteLabel: string;
}

const SaleItem = memo(
  ({ item, onDelete, formatCropName, formatUnitName, formatMarketName, deleteLabel }: SaleItemProps) => {
    const meta = getCropMeta(item.cropName);
    const CropIcon = meta.icon;

    return (
      <View style={styles.saleCard}>
        {/* Top row: Symbol + Details + Revenue */}
        <View style={styles.cardTopRow}>
          <View style={[styles.cropIconWrapper, { backgroundColor: meta.bg }]}>
            <CropIcon size={32} color={meta.color} />
          </View>

          <View style={styles.saleDetails}>
            <Text style={styles.cropName}>{formatCropName(item.cropName)}</Text>
            <View style={styles.metaRow}>
              <Text style={styles.qtyText}>
                {item.quantity} {formatUnitName(item.unit)}
              </Text>
              <Text style={styles.dotSeparator}>•</Text>
              <Text style={styles.rateText}>
                ₹{item.pricePerUnit.toLocaleString('en-IN')}/{formatUnitName(item.unit).charAt(0)}
              </Text>
            </View>
            <View style={styles.marketRow}>
              <Store size={15} color={colors.secondaryText} />
              <Text style={styles.marketName}>{formatMarketName(item.marketName)}</Text>
              <Text style={styles.dateText}> · {item.date}</Text>
            </View>
          </View>

          <Text style={styles.totalAmount}>{formatCurrency(item.totalAmount)}</Text>
        </View>

        {/* Bottom delete action row */}
        <View style={styles.cardBottomRow}>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(item.id)}
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

SaleItem.displayName = 'SaleItem';

export default function SalesScreen() {
  const router = useRouter();
  const { sales, totalSalesAmount, deleteSale } = useSalesStore();
  const { t } = useLanguage();

  const handleOpenAddSale = useCallback(() => {
    router.push('/add-sale');
  }, [router]);

  const formatCropName = useCallback(
    (cropName: string): string => {
      const key = cropName.toLowerCase() as TranslationKey;
      const translated = t(key);
      return translated !== key ? translated : cropName;
    },
    [t]
  );

  const formatUnitName = useCallback(
    (unit: string): string => {
      const key = unit.toLowerCase() as TranslationKey;
      const translated = t(key);
      return translated !== key ? translated : unit;
    },
    [t]
  );

  const formatMarketName = useCallback(
    (market: string): string => {
      if (market.toLowerCase().includes('pune')) {
        return t('puneMarket');
      }
      return market;
    },
    [t]
  );

  const handleDelete = useCallback(
    (id: string) => {
      confirmAction(
        t('deleteSaleTitle'),
        t('deleteSaleMsg'),
        () => {
          deleteSale(id);
        },
        t('cancel'),
        t('delete')
      );
    },
    [t, deleteSale]
  );

  const renderSaleItem = useCallback(
    ({ item }: { item: Sale }) => (
      <SaleItem
        item={item}
        onDelete={handleDelete}
        formatCropName={formatCropName}
        formatUnitName={formatUnitName}
        formatMarketName={formatMarketName}
        deleteLabel={t('delete')}
      />
    ),
    [handleDelete, formatCropName, formatUnitName, formatMarketName, t]
  );

  const keyExtractor = useCallback((item: Sale) => item.id, []);

  const ListHeader = useCallback(
    () => (
      <>
        {/* Large Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryLabel}>{t('totalSales')}</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(totalSalesAmount)}</Text>
            </View>
            <View style={styles.iconCircle}>
              <ShoppingCart size={32} color={colors.primaryGreen} />
            </View>
          </View>
          <View style={styles.summaryBadgeRow}>
            <Text style={styles.periodText}>{t('thisMonth')}</Text>
            <View style={styles.trendBadge}>
              <TrendingUp size={16} color={colors.primaryGreen} />
              <Text style={styles.trendText}>+12% {t('vsLastMonth')}</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>{t('recentMarketSales')}</Text>
      </>
    ),
    [t, totalSalesAmount]
  );

  const ListEmpty = useCallback(
    () => (
      <EmptyState
        title={t('noSalesYet')}
        description={t('salesEmptyDescription')}
        actionTitle={`+ ${t('addSale')}`}
        onActionPress={handleOpenAddSale}
        icon={<ShoppingCart size={48} color={colors.primaryGreen} />}
      />
    ),
    [t, handleOpenAddSale]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/drawer')}>
          <Menu size={28} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('sales')}</Text>
        <TouchableOpacity style={styles.addSaleButton} onPress={handleOpenAddSale} activeOpacity={0.8}>
          <Plus size={20} color={colors.white} />
          <Text style={styles.addSaleText}>+ {t('addSale')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={sales}
        keyExtractor={keyExtractor}
        renderItem={renderSaleItem}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
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
  addSaleButton: {
    backgroundColor: colors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md + 2,
    paddingVertical: spacing.sm + 2,
    borderRadius: borderRadius.full,
    gap: 6,
  },
  addSaleText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + 20,
  },
  summaryCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.xl,
    marginVertical: spacing.md,
    borderRadius: 18,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: fontSize.md,
    color: colors.secondaryText,
    fontWeight: fontWeight.semibold,
  },
  summaryAmount: {
    fontSize: 34,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginTop: 6,
  },
  iconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryBadgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  periodText: {
    fontSize: fontSize.sm,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  trendBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.lightGreen,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: borderRadius.sm,
    gap: 6,
  },
  trendText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  listContainer: {
    marginTop: spacing.sm,
    gap: spacing.md + 2,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: spacing.xs,
  },
  saleCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 18,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  cardTopRow: {
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
  saleDetails: {
    flex: 1,
  },
  cropName: {
    fontSize: fontSize.md + 2,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  qtyText: {
    fontSize: fontSize.sm,
    color: colors.secondaryText,
    fontWeight: fontWeight.semibold,
  },
  dotSeparator: {
    marginHorizontal: spacing.xs,
    color: colors.mutedText,
    fontSize: fontSize.sm,
  },
  rateText: {
    fontSize: fontSize.sm,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  marketRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  marketName: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  dateText: {
    fontSize: fontSize.xs,
    color: colors.mutedText,
  },
  totalAmount: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
    marginLeft: spacing.sm,
    flexShrink: 0,
  },
  cardBottomRow: {
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
