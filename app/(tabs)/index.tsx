import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Sprout, Banknote, ShoppingCart, ClipboardList, TrendingDown, TrendingUp } from 'lucide-react-native';
import { Header } from '../../components/Header';
import { WeatherCard } from '../../components/WeatherCard';
import { AIBanner } from '../../components/AIBanner';
import { Card } from '../../components/ui/Card';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';

import { formatCurrency, safeNavigate } from '../../utils';
import { useLanguage } from '../../locales/languageContext';
import { useExpensesStore } from '../../data/expensesStore';
import { useSalesStore } from '../../data/salesStore';
import { useCropsStore } from '../../data/cropsStore';

export default function DashboardScreen() {
  const router = useRouter();
  const { t } = useLanguage();

  const { totalExpense } = useExpensesStore();
  const { totalSalesAmount } = useSalesStore();
  const { crops } = useCropsStore();

  const activeCropsCount = useMemo(
    () => crops.filter((c) => (c.status || '').toLowerCase() === 'growing' && !c.isDeleted).length,
    [crops]
  );
  const estimatedProfit = useMemo(
    () => Math.max(0, totalSalesAmount - totalExpense),
    [totalSalesAmount, totalExpense]
  );
  const isProfitPositive = useMemo(
    () => totalSalesAmount >= totalExpense,
    [totalSalesAmount, totalExpense]
  );

  return (
    <View style={styles.container}>
      <Header showUserGreeting />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Weather Card */}
        <WeatherCard />

        {/* Quick Actions Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('quickActions')}</Text>
          <View style={styles.quickActionsGrid}>
            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => safeNavigate(() => router.push('/add-crop'))}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIconBg, { backgroundColor: '#F0FDF4' }]}>
                <Sprout size={32} color={colors.primaryGreen} />
              </View>
              <Text style={styles.quickActionLabel} numberOfLines={1}>
                {t('addCrop')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => safeNavigate(() => router.push('/add-expense'))}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIconBg, { backgroundColor: '#FEF3C7' }]}>
                <Banknote size={32} color="#D97706" />
              </View>
              <Text style={styles.quickActionLabel} numberOfLines={1}>
                {t('expenses')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => safeNavigate(() => router.push('/add-sale'))}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIconBg, { backgroundColor: '#E0F2FE' }]}>
                <ShoppingCart size={32} color="#0284C7" />
              </View>
              <Text style={styles.quickActionLabel} numberOfLines={1}>
                {t('sales')}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.quickActionItem}
              onPress={() => router.navigate('/(tabs)/budget')}
              activeOpacity={0.8}
            >
              <View style={[styles.quickActionIconBg, { backgroundColor: '#F3E8FF' }]}>
                <ClipboardList size={32} color="#7E22CE" />
              </View>
              <Text style={styles.quickActionLabel} numberOfLines={1}>
                {t('budget')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Live Overview Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('overview')}</Text>
          <View style={styles.overviewGrid}>
            {/* Total Expenses */}
            <TouchableOpacity
              style={styles.overviewCardWrapper}
              activeOpacity={0.8}
              onPress={() => router.navigate('/(tabs)/expenses')}
            >
              <View style={styles.overviewCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.overviewLabel} numberOfLines={1}>
                    {t('totalExpenses')}
                  </Text>
                  <View style={[styles.cardIconCircle, { backgroundColor: '#FEF3C7' }]}>
                    <Banknote size={20} color="#D97706" />
                  </View>
                </View>
                <Text style={styles.overviewValue}>
                  {formatCurrency(totalExpense)}
                </Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.periodText}>{t('thisMonth')}</Text>
                  <View style={[styles.changeBadge, { backgroundColor: '#FEF2F2' }]}>
                    <TrendingDown size={14} color={colors.danger} />
                    <Text style={[styles.changeText, { color: colors.danger }]}>
                      8%
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Total Sales */}
            <TouchableOpacity
              style={styles.overviewCardWrapper}
              activeOpacity={0.8}
              onPress={() => router.navigate('/(tabs)/sales')}
            >
              <View style={styles.overviewCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.overviewLabel} numberOfLines={1}>
                    {t('totalSales')}
                  </Text>
                  <View style={[styles.cardIconCircle, { backgroundColor: '#E0F2FE' }]}>
                    <ShoppingCart size={20} color="#0284C7" />
                  </View>
                </View>
                <Text style={styles.overviewValue}>
                  {formatCurrency(totalSalesAmount)}
                </Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.periodText}>{t('thisMonth')}</Text>
                  <View style={[styles.changeBadge, { backgroundColor: colors.lightGreen }]}>
                    <TrendingUp size={14} color={colors.primaryGreen} />
                    <Text style={[styles.changeText, { color: colors.primaryGreen }]}>
                      +12%
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Active Crops */}
            <TouchableOpacity
              style={styles.overviewCardWrapper}
              activeOpacity={0.8}
              onPress={() => router.navigate('/(tabs)/crops')}
            >
              <View style={styles.overviewCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.overviewLabel} numberOfLines={1}>
                    {t('activeCrops')}
                  </Text>
                  <View style={[styles.cardIconCircle, { backgroundColor: '#F0FDF4' }]}>
                    <Sprout size={20} color={colors.primaryGreen} />
                  </View>
                </View>
                <Text style={styles.overviewValue}>{activeCropsCount}</Text>
                <Text style={styles.subValueText}>{t('crops')}</Text>
              </View>
            </TouchableOpacity>

            {/* Estimated Profit */}
            <TouchableOpacity
              style={styles.overviewCardWrapper}
              activeOpacity={0.8}
              onPress={() => router.navigate('/(tabs)/analytics')}
            >
              <View style={styles.overviewCard}>
                <View style={styles.cardHeaderRow}>
                  <Text style={styles.overviewLabel} numberOfLines={1}>
                    {t('estimatedProfit')}
                  </Text>
                  <View style={[styles.cardIconCircle, { backgroundColor: '#DCFCE7' }]}>
                    <Banknote size={20} color={colors.primaryGreen} />
                  </View>
                </View>
                <Text style={[styles.overviewValue, { color: isProfitPositive ? colors.primaryGreen : colors.danger }]}>
                  {formatCurrency(estimatedProfit)}
                </Text>
                <View style={styles.badgeRow}>
                  <Text style={styles.periodText}>{t('thisMonth')}</Text>
                  <View style={[styles.changeBadge, { backgroundColor: isProfitPositive ? colors.lightGreen : '#FEF2F2' }]}>
                    <TrendingUp size={14} color={isProfitPositive ? colors.primaryGreen : colors.danger} />
                    <Text style={[styles.changeText, { color: isProfitPositive ? colors.primaryGreen : colors.danger }]}>
                      {isProfitPositive ? '+15%' : '-5%'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* AI Assistant Banner */}
        <AIBanner />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    paddingBottom: spacing.xxl + 20,
  },
  sectionContainer: {
    paddingHorizontal: spacing.lg,
    marginTop: spacing.lg,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: spacing.md,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: spacing.sm + 2,
  },
  quickActionItem: {
    backgroundColor: colors.white,
    borderRadius: 18,
    paddingVertical: spacing.md + 2,
    paddingHorizontal: spacing.xs,
    alignItems: 'center',
    flex: 1,
    borderWidth: 1.5,
    borderColor: colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  quickActionIconBg: {
    width: 58,
    height: 58,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: spacing.xs + 2,
  },
  quickActionLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    textAlign: 'center',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  overviewCardWrapper: {
    width: '47.5%',
  },
  overviewCard: {
    padding: spacing.md + 2,
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.white,
    borderRadius: 18,
    minHeight: 124,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  overviewLabel: {
    fontSize: fontSize.xs + 1,
    color: colors.secondaryText,
    fontWeight: fontWeight.semibold,
    flex: 1,
    marginRight: 4,
  },
  cardIconCircle: {
    width: 34,
    height: 34,
    borderRadius: 17,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overviewValue: {
    fontSize: fontSize.xl + 1,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginVertical: 4,
  },
  subValueText: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  periodText: {
    fontSize: 11,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  changeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: borderRadius.xs,
    gap: 4,
  },
  changeText: {
    fontSize: 11,
    fontWeight: fontWeight.bold,
  },
});
