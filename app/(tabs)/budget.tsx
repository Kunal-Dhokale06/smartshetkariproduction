import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import {
  Menu, ClipboardList, PieChart, Banknote, ShieldAlert, Users, Sprout,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import { formatCurrency, safeNavigate } from '../../utils';
import { useLanguage, TranslationKey } from '../../locales/languageContext';
import { useExpensesStore } from '../../data/expensesStore';

export default function BudgetScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { expenses, totalExpense } = useExpensesStore();

  const [totalBudget, setTotalBudget] = useState(60000);

  const { fertilizerSpent, seedsSpent, laborSpent, irrigationSpent } = useMemo(() => {
    let f = 0;
    let s = 0;
    let l = 0;
    let i = 0;

    for (let idx = 0; idx < expenses.length; idx++) {
      const e = expenses[idx];
      const amt = Number(e.amount) || 0;
      if (e.category === 'Fertilizer' || e.category === 'Pesticide') {
        f += amt;
      } else if (e.category === 'Seeds') {
        s += amt;
      } else if (e.category === 'Labor') {
        l += amt;
      } else {
        i += amt;
      }
    }

    return {
      fertilizerSpent: f,
      seedsSpent: s,
      laborSpent: l,
      irrigationSpent: i,
    };
  }, [expenses]);

  const remaining = useMemo(
    () => Math.max(0, totalBudget - totalExpense),
    [totalBudget, totalExpense]
  );
  const spentPct = useMemo(
    () => Math.min(100, Math.round((totalExpense / totalBudget) * 100)),
    [totalExpense, totalBudget]
  );

  const budgetCategories = useMemo(
    () => [
      {
        id: 'b1',
        titleKey: 'fertilizersAndChemicals' as TranslationKey,
        allocated: 25000,
        spent: fertilizerSpent,
        icon: Banknote,
        color: colors.primaryGreen,
        bgColor: '#EAF7EF',
      },
      {
        id: 'b2',
        titleKey: 'seedsAndSowing' as TranslationKey,
        allocated: 12000,
        spent: seedsSpent,
        icon: Sprout,
        color: '#0284C7',
        bgColor: '#E0F2FE',
      },
      {
        id: 'b3',
        titleKey: 'laborAndWages' as TranslationKey,
        allocated: 15000,
        spent: laborSpent,
        icon: Users,
        color: '#7E22CE',
        bgColor: '#F3E8FF',
      },
      {
        id: 'b4',
        titleKey: 'machineryAndIrrigation' as TranslationKey,
        allocated: 8000,
        spent: irrigationSpent,
        icon: ShieldAlert,
        color: '#D97706',
        bgColor: '#FEF3C7',
      },
    ],
    [fertilizerSpent, seedsSpent, laborSpent, irrigationSpent]
  );

  const handleAdjustBudget = (amount: number) => {
    setTotalBudget((prev) => prev + amount);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => safeNavigate(() => router.push('/drawer'))}>
          <Menu size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('budget')}</Text>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => Alert.alert(t('budgetInfoTitle'), t('budgetInfoMsg'))}
        >
          <ClipboardList size={22} color={colors.primaryGreen} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Total Budget Summary Hero Card */}
        <Card style={styles.heroCard}>
          <View style={styles.heroHeaderRow}>
            <View style={styles.heroTextGroup}>
              <Text style={styles.heroLabel}>{t('seasonKharif')}</Text>
              <Text style={styles.heroAmount}>{formatCurrency(totalBudget)}</Text>
            </View>
            <View style={styles.heroIconCircle}>
              <PieChart size={24} color={colors.primaryGreen} />
            </View>
          </View>

          {/* Quick budget adjustment buttons */}
          <View style={styles.budgetAdjustRow}>
            <Text style={styles.adjustLabel}>{t('adjustBudget')}:</Text>
            <TouchableOpacity style={styles.adjustPill} onPress={() => handleAdjustBudget(5000)}>
              <Text style={styles.adjustPillText}>+ ₹5,000</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.adjustPill} onPress={() => handleAdjustBudget(10000)}>
              <Text style={styles.adjustPillText}>+ ₹10,000</Text>
            </TouchableOpacity>
          </View>

          {/* Spent Progress Bar */}
          <View style={styles.progressSection}>
            <View style={styles.progressTextRow}>
              <Text style={styles.progressLabel}>
                {t('spent')}: {formatCurrency(totalExpense)} ({spentPct}%)
              </Text>
              <Text style={styles.remainingLabel}>
                {t('left')}: {formatCurrency(remaining)}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${spentPct}%` as any }]} />
            </View>
          </View>
        </Card>

        {/* Category Budget Allocation List */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('categoryAllocations')}</Text>

          <View style={styles.categoriesList}>
            {budgetCategories.map((cat) => {
              const Icon = cat.icon;
              const catPct = Math.min(100, Math.round((cat.spent / cat.allocated) * 100));
              const isOver = cat.spent > cat.allocated;
              const categoryTitle = t(cat.titleKey);

              return (
                <Card key={cat.id} style={styles.categoryCard}>
                  <View style={styles.catTopRow}>
                    <View style={[styles.catIconCircle, { backgroundColor: cat.bgColor }]}>
                      <Icon size={20} color={cat.color} />
                    </View>
                    <View style={styles.catInfo}>
                      <Text style={styles.catTitle}>{categoryTitle}</Text>
                      <Text style={styles.catMeta}>
                        {t('spent')}: {formatCurrency(cat.spent)} / {t('allocated')}: {formatCurrency(cat.allocated)}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.catBadge,
                        { borderColor: isOver ? colors.danger : cat.color + '40' },
                        isOver && { backgroundColor: '#FEE2E2' },
                      ]}
                    >
                      <Text style={[styles.catBadgeText, { color: isOver ? colors.danger : cat.color }]}>
                        {catPct}%
                      </Text>
                    </View>
                  </View>

                  <View style={styles.catProgressTrack}>
                    <View
                      style={[
                        styles.catProgressFill,
                        {
                          width: `${catPct}%` as any,
                          backgroundColor: isOver ? colors.danger : cat.color,
                        },
                      ]}
                    />
                  </View>
                </Card>
              );
            })}
          </View>
        </View>
      </ScrollView>
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
    paddingVertical: spacing.md,
  },
  iconButton: {
    padding: spacing.xs,
  },
  headerTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  heroCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
    marginVertical: spacing.sm,
  },
  heroHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroTextGroup: {
    flex: 1,
  },
  heroLabel: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  heroAmount: {
    fontSize: fontSize.xxl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginTop: 2,
  },
  heroIconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.lightGreen,
    justifyContent: 'center',
    alignItems: 'center',
  },
  budgetAdjustRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: spacing.sm,
  },
  adjustLabel: {
    fontSize: 11,
    color: colors.secondaryText,
  },
  adjustPill: {
    backgroundColor: colors.lightGreen,
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  adjustPillText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  progressSection: {
    marginTop: spacing.md,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  progressTextRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xs,
  },
  progressLabel: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  remainingLabel: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
  },
  progressTrack: {
    height: 10,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primaryGreen,
    borderRadius: borderRadius.full,
  },
  sectionContainer: {
    marginTop: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: spacing.sm,
  },
  categoriesList: {
    gap: spacing.md,
  },
  categoryCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.md,
  },
  catTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  catIconCircle: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  catInfo: {
    flex: 1,
  },
  catTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  catMeta: {
    fontSize: fontSize.xs - 1,
    color: colors.secondaryText,
    marginTop: 2,
  },
  catBadge: {
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xs + 2,
    paddingVertical: 2,
    borderRadius: borderRadius.xs,
    borderWidth: 1,
  },
  catBadgeText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
  },
  catProgressTrack: {
    height: 6,
    backgroundColor: colors.background,
    borderRadius: borderRadius.full,
    overflow: 'hidden',
  },
  catProgressFill: {
    height: '100%',
    borderRadius: borderRadius.full,
  },
});
