import React, { useCallback, memo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import {
  Menu, Plus, Package, Sprout, ShieldAlert, Users, Droplets, Banknote, TrendingDown, Trash2,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { EmptyState } from '../../components/ui/EmptyState';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import { useExpensesStore } from '../../data/expensesStore';
import { formatCurrency, confirmAction, safeNavigate } from '../../utils';
import { useLanguage, TranslationKey } from '../../locales/languageContext';
import { getCropMeta } from '../../utils/cropIcons';
import { Expense } from '../../types';

const CATEGORY_META: Record<string, { icon: any; color: string; bg: string }> = {
  Fertilizer: { icon: Package,     color: colors.primaryGreen, bg: '#EAF7EF' },
  Seeds:      { icon: Sprout,      color: '#0284C7',           bg: '#E0F2FE' },
  Pesticide:  { icon: ShieldAlert, color: '#D97706',           bg: '#FEF3C7' },
  Labor:      { icon: Users,       color: '#7E22CE',           bg: '#F3E8FF' },
  Irrigation: { icon: Droplets,    color: '#2563EB',           bg: '#EFF6FF' },
  Other:      { icon: Banknote,    color: '#6B7280',           bg: '#F3F4F6' },
};

interface ExpenseItemProps {
  item: Expense;
  onDelete: (id: string) => void;
  getCategoryLabel: (cat: string) => string;
  deleteLabel: string;
}

const ExpenseItem = memo(({ item, onDelete, getCategoryLabel, deleteLabel }: ExpenseItemProps) => {
  const meta = CATEGORY_META[item.category] ?? CATEGORY_META['Other'];
  const Icon = meta.icon;
  const cropName = item.crop || 'General';
  const cropMeta = getCropMeta(cropName);

  return (
    <View style={styles.expenseCard}>
      {/* Top Row: Symbol + Details + Amount */}
      <View style={styles.cardMainRow}>
        <View style={[styles.categoryIconBox, { backgroundColor: meta.bg }]}>
          <Icon size={30} color={meta.color} />
        </View>

        <View style={styles.expenseDetails}>
          <Text style={styles.expenseTitle} numberOfLines={1}>
            {item.title}
          </Text>

          <View style={styles.expenseMeta}>
            <View style={[styles.categoryBadge, { backgroundColor: meta.bg }]}>
              <Text style={[styles.categoryBadgeText, { color: meta.color }]}>
                {getCategoryLabel(item.category)}
              </Text>
            </View>

            <View style={[styles.cropBadge, { backgroundColor: cropMeta.bg }]}>
              <Sprout size={14} color={cropMeta.color} />
              <Text style={[styles.cropBadgeText, { color: cropMeta.color }]}>
                {cropName}
              </Text>
            </View>
          </View>

          <Text style={styles.expenseDate}>{item.date}</Text>
        </View>

        <Text style={styles.amountText}>{formatCurrency(item.amount)}</Text>
      </View>

      {/* Bottom Action Row: Big Clear Delete Button */}
      <View style={styles.cardFooterRow}>
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
});

ExpenseItem.displayName = 'ExpenseItem';

export default function ExpensesScreen() {
  const router = useRouter();
  const { expenses, totalExpense, deleteExpense } = useExpensesStore();
  const { t } = useLanguage();

  const handleOpenAddExpense = useCallback(() => {
    safeNavigate(() => router.push('/add-expense'));
  }, [router]);

  const getCategoryLabel = useCallback(
    (cat: string): string => {
      const key = cat.toLowerCase() as TranslationKey;
      const val = t(key);
      return val !== key ? val : cat;
    },
    [t]
  );

  const handleDelete = useCallback(
    (id: string) => {
      confirmAction(
        t('deleteExpenseTitle'),
        t('deleteExpenseMsg'),
        () => {
          deleteExpense(id);
        },
        t('cancel'),
        t('delete')
      );
    },
    [t, deleteExpense]
  );

  const renderExpenseItem = useCallback(
    ({ item }: { item: Expense }) => (
      <ExpenseItem
        item={item}
        onDelete={handleDelete}
        getCategoryLabel={getCategoryLabel}
        deleteLabel={t('delete')}
      />
    ),
    [handleDelete, getCategoryLabel, t]
  );

  const keyExtractor = useCallback((item: Expense) => item.id, []);

  const ListHeader = useCallback(
    () => (
      <>
        {/* Large Summary Card */}
        <Card style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.summaryLabel}>{t('totalExpenses')}</Text>
              <Text style={styles.summaryAmount}>{formatCurrency(totalExpense)}</Text>
            </View>
            <View style={styles.summaryIconCircle}>
              <Banknote size={32} color="#D97706" />
            </View>
          </View>
          <View style={styles.summaryBottomRow}>
            <Text style={styles.periodText}>{t('thisMonth')}</Text>
            <View style={styles.trendBadge}>
              <TrendingDown size={16} color={colors.primaryGreen} />
              <Text style={styles.trendText}>8% {t('vsLastMonth')}</Text>
            </View>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>{t('recentExpenses')}</Text>
      </>
    ),
    [t, totalExpense]
  );

  const ListEmpty = useCallback(
    () => (
      <EmptyState
        title={t('noExpensesYet')}
        description={t('expensesEmptyDescription')}
        actionTitle={`+ ${t('addExpense')}`}
        onActionPress={handleOpenAddExpense}
        icon={<Banknote size={48} color={colors.primaryGreen} />}
      />
    ),
    [t, handleOpenAddExpense]
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => safeNavigate(() => router.push('/drawer'))}>
          <Menu size={28} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('expenses')}</Text>
        <TouchableOpacity style={styles.addButton} onPress={handleOpenAddExpense} activeOpacity={0.8}>
          <Plus size={20} color={colors.white} />
          <Text style={styles.addButtonText}>+ {t('addExpense')}</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={expenses}
        keyExtractor={keyExtractor}
        renderItem={renderExpenseItem}
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
  summaryIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FEF3C7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  summaryBottomRow: {
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
  listSection: {
    marginTop: spacing.sm,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: spacing.md,
  },
  expensesList: {
    gap: spacing.md + 2,
  },
  expenseCard: {
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
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md + 4,
  },
  categoryIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    flexShrink: 0,
  },
  expenseDetails: {
    flex: 1,
    marginRight: spacing.sm,
  },
  expenseTitle: {
    fontSize: fontSize.md + 1,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 6,
  },
  expenseMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  categoryBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  categoryBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  cropBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  cropBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  expenseDate: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  amountText: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginLeft: spacing.xs,
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
