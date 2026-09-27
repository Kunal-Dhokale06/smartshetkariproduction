import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Menu, TrendingUp, TrendingDown, DollarSign, PieChart, BarChart3, LineChart } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { Card } from '../../components/ui/Card';
import { colors, spacing, fontSize, fontWeight, borderRadius } from '../../theme';
import { useLanguage } from '../../locales/languageContext';
import { useExpensesStore } from '../../data/expensesStore';
import { useSalesStore } from '../../data/salesStore';
import { formatCurrency, safeNavigate } from '../../utils';

const FILTER_KEYS = [
  { labelKey: 'thisWeek', text: 'This Week', multiplier: 0.25 },
  { labelKey: 'thisMonth', text: 'This Month', multiplier: 1 },
  { labelKey: 'threeMonths', text: '3 Months', multiplier: 2.8 },
  { labelKey: 'sixMonths', text: '6 Months', multiplier: 5.5 },
  { labelKey: 'oneYear', text: '1 Year', multiplier: 11.2 },
] as const;

export default function AnalyticsScreen() {
  const router = useRouter();
  const { t } = useLanguage();
  const { expenses, totalExpense } = useExpensesStore();
  const { sales, totalSalesAmount } = useSalesStore();

  const [selectedFilter, setSelectedFilter] = useState('This Month');

  const currentMultiplier = useMemo(
    () => FILTER_KEYS.find((f) => f.text === selectedFilter)?.multiplier || 1,
    [selectedFilter]
  );

  const displayRevenue = useMemo(
    () => Math.round(totalSalesAmount * currentMultiplier),
    [totalSalesAmount, currentMultiplier]
  );
  const displayExpenses = useMemo(
    () => Math.round(totalExpense * currentMultiplier),
    [totalExpense, currentMultiplier]
  );
  const displayProfit = useMemo(
    () => Math.max(0, displayRevenue - displayExpenses),
    [displayRevenue, displayExpenses]
  );
  const marginPercentage = useMemo(
    () => (displayRevenue > 0 ? Math.round((displayProfit / displayRevenue) * 100) : 0),
    [displayProfit, displayRevenue]
  );

  // Compute actual monthly sums from the farmer's real records
  const { salesData, expensesData, maxSales, maxExpenses, totalSalesSeries, totalExpensesSeries } = useMemo(() => {
    const months = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
    
    const computeMonthly = (items: Array<{ date: string; amount?: number; totalAmount?: number }>) => {
      const map: Record<string, number> = { jan: 0, feb: 0, mar: 0, apr: 0, may: 0 };
      items.forEach((item) => {
        const val = Number(item.amount || item.totalAmount || 0);
        const dStr = (item.date || '').toLowerCase();
        for (const m of months.slice(0, 5)) {
          if (dStr.includes(m)) {
            map[m] = (map[m] || 0) + val;
            return;
          }
        }
        const parsed = new Date(item.date);
        if (!isNaN(parsed.getTime())) {
          const mIdx = parsed.getMonth();
          if (mIdx < 5) {
            const mKey = months[mIdx];
            map[mKey] = (map[mKey] || 0) + val;
          }
        }
      });
      return map;
    };

    const sMonths = computeMonthly(sales);
    const eMonths = computeMonthly(expenses);

    const sData = [
      { monthKey: 'janShort' as const, amount: sMonths.jan },
      { monthKey: 'febShort' as const, amount: sMonths.feb },
      { monthKey: 'marShort' as const, amount: sMonths.mar },
      { monthKey: 'aprShort' as const, amount: sMonths.apr },
      { monthKey: 'mayShort' as const, amount: sMonths.may || Math.round(totalSalesAmount) },
    ];

    const eData = [
      { monthKey: 'janShort' as const, amount: eMonths.jan },
      { monthKey: 'febShort' as const, amount: eMonths.feb },
      { monthKey: 'marShort' as const, amount: eMonths.mar },
      { monthKey: 'aprShort' as const, amount: eMonths.apr },
      { monthKey: 'mayShort' as const, amount: eMonths.may || Math.round(totalExpense) },
    ];

    const mSales = Math.max(...sData.map((d) => d.amount), 1000);
    const mExpenses = Math.max(...eData.map((d) => d.amount), 1000);
    const tSales = sData.reduce((sum, d) => sum + d.amount, 0);
    const tExpenses = eData.reduce((sum, d) => sum + d.amount, 0);

    return {
      salesData: sData,
      expensesData: eData,
      maxSales: mSales,
      maxExpenses: mExpenses,
      totalSalesSeries: tSales,
      totalExpensesSeries: tExpenses,
    };
  }, [sales, expenses, totalSalesAmount, totalExpense]);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => safeNavigate(() => router.push('/drawer'))}>
          <Menu size={24} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('analytics')}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <BarChart3 size={22} color={colors.primaryGreen} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Horizontal Time Horizon Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTER_KEYS.map((item) => {
            const isActive = selectedFilter === item.text;
            return (
              <TouchableOpacity
                key={item.text}
                style={[styles.filterPill, isActive && styles.activeFilterPill]}
                onPress={() => setSelectedFilter(item.text)}
              >
                <Text style={[styles.filterPillText, isActive && styles.activeFilterPillText]}>
                  {t(item.labelKey as any)}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* 4 Summary Metric Cards (2x2 Grid) */}
        <View style={styles.metricsGrid}>
          {/* Revenue */}
          <Card style={styles.metricCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.metricLabel}>{t('revenue')}</Text>
              <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
                <TrendingUp size={16} color="#0284C7" />
              </View>
            </View>
            <Text style={styles.metricValue}>{formatCurrency(displayRevenue)}</Text>
            <Text style={styles.metricSubText}>+12% {t('vsLastMonth')}</Text>
          </Card>

          {/* Expenses */}
          <Card style={styles.metricCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.metricLabel}>{t('expenses')}</Text>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <TrendingDown size={16} color="#D97706" />
              </View>
            </View>
            <Text style={styles.metricValue}>{formatCurrency(displayExpenses)}</Text>
            <Text style={styles.metricSubText}>-8% {t('vsLastMonth')}</Text>
          </Card>

          {/* Net Profit */}
          <Card style={styles.metricCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.metricLabel}>{t('netProfit')}</Text>
              <View style={[styles.iconCircle, { backgroundColor: colors.lightGreen }]}>
                <DollarSign size={16} color={colors.primaryGreen} />
              </View>
            </View>
            <Text style={[styles.metricValue, { color: colors.primaryGreen }]}>
              {formatCurrency(displayProfit)}
            </Text>
            <Text style={styles.metricSubText}>+15% {t('vsLastMonth')}</Text>
          </Card>

          {/* Profit Margin */}
          <Card style={styles.metricCard}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.metricLabel}>{t('profitMargin')}</Text>
              <View style={[styles.iconCircle, { backgroundColor: '#F3E8FF' }]}>
                <PieChart size={16} color="#7E22CE" />
              </View>
            </View>
            <Text style={styles.metricValue}>{marginPercentage}%</Text>
            <Text style={styles.metricSubText}>{marginPercentage >= 40 ? t('healthyMargin') : t('moderateMargin')}</Text>
          </Card>
        </View>

        {/* Monthly Sales Bar Chart Card */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>{t('monthlySales')}</Text>
            <Text style={styles.chartTotal}>{t('total')}: {formatCurrency(totalSalesSeries)}</Text>
          </View>
          <View style={styles.barChartContainer}>
            {salesData.map((d) => {
              const heightPct = `${(d.amount / maxSales) * 100}%`;
              return (
                <View key={d.monthKey} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: heightPct as any, backgroundColor: colors.primaryGreen },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{t(d.monthKey)}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Monthly Expenses Bar Chart Card */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>{t('monthlyExpenses')}</Text>
            <Text style={styles.chartTotal}>{t('total')}: {formatCurrency(totalExpensesSeries)}</Text>
          </View>
          <View style={styles.barChartContainer}>
            {expensesData.map((d) => {
              const heightPct = `${(d.amount / maxExpenses) * 100}%`;
              return (
                <View key={d.monthKey} style={styles.barCol}>
                  <View style={styles.barTrack}>
                    <View
                      style={[
                        styles.barFill,
                        { height: heightPct as any, backgroundColor: '#D97706' },
                      ]}
                    />
                  </View>
                  <Text style={styles.barLabel}>{t(d.monthKey)}</Text>
                </View>
              );
            })}
          </View>
        </Card>

        {/* Profit Trend SVG Curve */}
        <Card style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <Text style={styles.chartTitle}>{t('profitTrend')}</Text>
            <Text style={[styles.chartTotal, { color: colors.primaryGreen }]}>
              {t('netProfit')}: {formatCurrency(displayProfit)}
            </Text>
          </View>

          <View style={styles.svgContainer}>
            <Svg width="100%" height={120} viewBox="0 0 300 100">
              <Path
                d="M 10 75 Q 75 35 150 55 T 290 20"
                fill="none"
                stroke={colors.primaryGreen}
                strokeWidth={3.5}
              />
              <Circle cx={10} cy={75} r={4.5} fill={colors.white} stroke={colors.primaryGreen} strokeWidth={2.5} />
              <Circle cx={85} cy={48} r={4.5} fill={colors.white} stroke={colors.primaryGreen} strokeWidth={2.5} />
              <Circle cx={150} cy={55} r={4.5} fill={colors.white} stroke={colors.primaryGreen} strokeWidth={2.5} />
              <Circle cx={225} cy={35} r={4.5} fill={colors.white} stroke={colors.primaryGreen} strokeWidth={2.5} />
              <Circle cx={290} cy={20} r={5.5} fill={colors.primaryGreen} stroke={colors.white} strokeWidth={2} />
            </Svg>

            <View style={styles.chartXAxis}>
              <Text style={styles.xAxisLabel}>{t('janShort')}</Text>
              <Text style={styles.xAxisLabel}>{t('febShort')}</Text>
              <Text style={styles.xAxisLabel}>{t('marShort')}</Text>
              <Text style={styles.xAxisLabel}>{t('aprShort')}</Text>
              <Text style={styles.xAxisLabel}>{t('mayShort')}</Text>
            </View>
          </View>
        </Card>
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
  filterScroll: {
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    marginBottom: spacing.sm,
  },
  filterPill: {
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    borderColor: colors.border,
  },
  activeFilterPill: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  filterPillText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.secondaryText,
  },
  activeFilterPillText: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  metricCard: {
    width: '47%',
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.md,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  metricLabel: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricValue: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginVertical: 2,
  },
  metricSubText: {
    fontSize: 10,
    color: colors.secondaryText,
  },
  chartCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1,
    padding: spacing.lg,
    marginBottom: spacing.md,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  chartTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  chartTotal: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    fontWeight: fontWeight.medium,
  },
  barChartContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 120,
    paddingTop: spacing.xs,
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 18,
    height: 90,
    backgroundColor: colors.background,
    borderRadius: borderRadius.sm,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: borderRadius.sm,
  },
  barLabel: {
    fontSize: 10,
    color: colors.secondaryText,
    marginTop: 6,
  },
  svgContainer: {
    marginTop: spacing.xs,
  },
  chartXAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.xs,
    marginTop: 4,
  },
  xAxisLabel: {
    fontSize: 10,
    color: colors.secondaryText,
  },
});
