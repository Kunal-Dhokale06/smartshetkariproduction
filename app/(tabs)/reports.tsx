import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {
  Menu,
  FileText,
  Download,
  Eye,
  TrendingUp,
  ShoppingCart,
  Receipt,
  Sprout,
  X,
  Printer,
  Calendar,
  CheckCircle,
  Award,
  Sparkles,
  ChevronRight,
} from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { Card } from '../../components/ui/Card';
import { colors, spacing, fontSize, fontWeight, borderRadius, shadows } from '../../theme';
import { useLanguage, TranslationKey } from '../../locales/languageContext';
import { useCropsStore } from '../../data/cropsStore';
import { useExpensesStore } from '../../data/expensesStore';
import { useSalesStore } from '../../data/salesStore';
import { getCropMeta } from '../../utils/cropIcons';
import { formatCurrency } from '../../utils';
import { useAuth } from '../../data/authStore';
import {
  ReportType,
  ReportContextData,
  downloadOrShareReport,
  printDirect,
  getDictionary,
  translateCategory,
} from '../../services/reportGenerator';

const YEARS = ['2026', '2025', '2024'] as const;
type YearType = typeof YEARS[number];

interface PreviewModalData {
  type: ReportType;
  title: string;
  subtitle: string;
  year: string;
  cropName?: string;
  items: { label: string; value: string; isBold?: boolean; highlight?: 'green' | 'orange' | 'red' }[];
  totalLabel: string;
  totalValue: string;
  accentColor: string;
  tableData?: {
    headers: string[];
    rows: (string | number)[][];
  };
}

export default function ReportsScreen() {
  const router = useRouter();
  const { t, language } = useLanguage();
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState<YearType>('2026');

  const { crops } = useCropsStore();
  const { expenses } = useExpensesStore();
  const { sales } = useSalesStore();

  const [previewData, setPreviewData] = useState<PreviewModalData | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<string | null>(null);

  // Filter out any deleted/trashed crops and their corresponding records
  const activeCrops = useMemo(
    () => crops.filter((c: any) => c.status !== 'Deleted' && !c.isDeleted),
    [crops]
  );
  const activeCropNames = useMemo(
    () =>
      new Set(
        activeCrops
          .map((c) => (c.name || (c as any).cropName || '').trim().toLowerCase())
          .filter(Boolean)
      ),
    [activeCrops]
  );
  const activeCropIds = useMemo(
    () => new Set(activeCrops.map((c) => c.id).filter(Boolean)),
    [activeCrops]
  );
  const activeExpenses = useMemo(
    () =>
      expenses.filter((e) => {
        const cName = (e.crop || (e as any).cropName || '').trim().toLowerCase();
        if (!cName || cName === 'general') return true;
        return (e.cropId && activeCropIds.has(e.cropId)) || activeCropNames.has(cName);
      }),
    [expenses, activeCropNames, activeCropIds]
  );
  const activeSales = useMemo(
    () =>
      sales.filter((s) => {
        const cName = (s.cropName || (s as any).crop || '').trim().toLowerCase();
        return (s.cropId && activeCropIds.has(s.cropId)) || (cName && activeCropNames.has(cName));
      }),
    [sales, activeCropNames, activeCropIds]
  );

  const activeTotalExpenses = useMemo(
    () => activeExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0),
    [activeExpenses]
  );
  const activeTotalSales = useMemo(
    () => activeSales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0),
    [activeSales]
  );

  const dict = getDictionary(language);
  const totalNetProfit = activeTotalSales - activeTotalExpenses;
  const isOverallProfit = totalNetProfit >= 0;

  const farmerSubtitle = `${user?.name || (language === 'mr' ? 'शेतकरी खातेदार' : 'Farmer')} · ${
    user?.village ? user.village + ', ' : ''
  }${user?.district || (language === 'mr' ? 'महाराष्ट्र' : 'Maharashtra')}`;

  const getReportContext = (cropName?: string): ReportContextData => {
    return {
      language,
      year: selectedYear,
      user,
      crops: activeCrops,
      expenses: activeExpenses,
      sales: activeSales,
      cropName,
    };
  };

  const handleDownload = async (type: ReportType, reportTitle: string, cropName?: string) => {
    // Prevent duplicate downloads on rapid taps
    if (isGenerating) return;

    try {
      setIsGenerating(reportTitle);
      const ctx = getReportContext(cropName);
      const res = await downloadOrShareReport(type, ctx);
      if (res.success) {
        setDownloadSuccess(res.filename || reportTitle);
        setTimeout(() => {
          setDownloadSuccess(null);
        }, 4000);
      } else {
        Alert.alert(
          language === 'mr' ? 'अहवाल त्रुटी' : 'Report Error',
          res.error || (language === 'mr' ? 'अहवाल तयार करताना अडचण आली.' : 'Unable to generate report PDF.')
        );
      }
    } catch (err: any) {
      Alert.alert(
        language === 'mr' ? 'डाउनलोड त्रुटी' : 'Download Error',
        err?.message || (language === 'mr' ? 'अहवाल डाउनलोड अयशस्वी झाले.' : 'Failed to download report.')
      );
    } finally {
      setIsGenerating(null);
    }
  };

  const handlePrint = async (type: ReportType, cropName?: string) => {
    try {
      const ctx = getReportContext(cropName);
      await printDirect(type, ctx);
    } catch (err: any) {
      Alert.alert(
        language === 'mr' ? 'प्रिंट त्रुटी' : 'Print Error',
        err?.message || (language === 'mr' ? 'अहवाल प्रिंट अयशस्वी झाले.' : 'Failed to print report.')
      );
    }
  };

  // 1. Full Farm Audit & P&L Statement Preview
  const handleOpenAuditReport = () => {
    const totalQty = activeSales.reduce((sum, s) => sum + s.quantity, 0);
    const cropSummaries = activeCrops.map((crop) => {
      const cLower = crop.name.trim().toLowerCase();
      const cSales = activeSales.filter((s) => (s.cropId && s.cropId === crop.id) || (s.cropName || '').trim().toLowerCase() === cLower);
      const cExp = activeExpenses.filter((e) => (e.cropId && e.cropId === crop.id) || (e.crop || '').trim().toLowerCase() === cLower);
      const sSum = cSales.reduce((sum, s) => sum + s.totalAmount, 0);
      const eSum = cExp.reduce((sum, e) => sum + e.amount, 0);
      const p = sSum - eSum;
      return {
        name: crop.name,
        area: crop.area,
        sales: sSum,
        exp: eSum,
        profit: p,
      };
    });

    setPreviewData({
      type: 'farm_audit',
      title: `${dict.farmAuditTitle} (FY ${selectedYear})`,
      subtitle: farmerSubtitle,
      year: selectedYear,
      items: [
        {
          label: dict.totalRevenue,
          value: formatCurrency(activeTotalSales),
          isBold: true,
          highlight: 'green',
        },
        {
          label: dict.totalExpenses,
          value: formatCurrency(activeTotalExpenses),
          isBold: true,
          highlight: 'orange',
        },
        {
          label: dict.activeCropsCount,
          value: `${activeCrops.length} ${language === 'mr' ? 'नोंदणीकृत पिके' : 'Crops'}`,
        },
        {
          label: dict.totalTransactions,
          value: `${activeSales.length + activeExpenses.length} ${dict.totalTransactions}`,
        },
        ...cropSummaries.map((c) => ({
          label: `${c.name} (${c.area}) - ${dict.netProfit}`,
          value: formatCurrency(c.profit),
          highlight: (c.profit >= 0 ? 'green' : 'red') as 'green' | 'red',
        })),
      ],
      totalLabel: `${dict.netProfit} (${selectedYear})`,
      totalValue: `${isOverallProfit ? '+' : '-'}${formatCurrency(Math.abs(totalNetProfit))}`,
      accentColor: isOverallProfit ? colors.primaryGreen : colors.danger,
      tableData: {
        headers: [dict.crop, dict.cropArea, dict.totalRevenue, dict.totalExpenses, dict.netProfit],
        rows: cropSummaries.map((c) => [
          c.name,
          c.area,
          formatCurrency(c.sales),
          formatCurrency(c.exp),
          formatCurrency(c.profit),
        ]),
      },
    });
  };

  // 2. Yearly Sales Report Preview
  const handleOpenYearlySalesReport = () => {
    const totalQty = activeSales.reduce((sum, s) => sum + s.quantity, 0);
    setPreviewData({
      type: 'sales',
      title: `${dict.salesReportTitle} (FY ${selectedYear})`,
      subtitle: farmerSubtitle,
      year: selectedYear,
      items: [
        {
          label: dict.totalRevenue,
          value: formatCurrency(activeTotalSales),
          isBold: true,
          highlight: 'green',
        },
        {
          label: dict.totalQuantitySold,
          value: `${totalQty} ${language === 'mr' ? 'एकके' : language === 'hi' ? 'इकाइयाँ' : 'Units'}`,
        },
        {
          label: dict.totalTransactions,
          value: `${activeSales.length} ${language === 'mr' ? 'पावत्या' : 'Invoices'}`,
        },
        ...activeSales.slice(0, 10).map((s) => ({
          label: `${s.cropName} (${s.quantity} ${s.unit}) - ${s.marketName}`,
          value: formatCurrency(s.totalAmount),
          highlight: 'green' as const,
        })),
      ],
      totalLabel: `${dict.total} ${dict.totalRevenue}`,
      totalValue: formatCurrency(activeTotalSales),
      accentColor: colors.primaryGreen,
      tableData: {
        headers: [dict.date, dict.crop, dict.buyerMarket, dict.quantity, dict.amount],
        rows: activeSales.map((s) => [
          s.date,
          s.cropName,
          s.marketName,
          `${s.quantity} ${s.unit}`,
          formatCurrency(s.totalAmount),
        ]),
      },
    });
  };

  // 3. Yearly Expense Ledger Preview
  const handleOpenYearlyExpenseReport = () => {
    setPreviewData({
      type: 'expenses',
      title: `${dict.expenseReportTitle} (FY ${selectedYear})`,
      subtitle: farmerSubtitle,
      year: selectedYear,
      items: [
        {
          label: dict.totalExpenses,
          value: formatCurrency(activeTotalExpenses),
          isBold: true,
          highlight: 'orange',
        },
        {
          label: dict.totalTransactions,
          value: `${activeExpenses.length} ${language === 'mr' ? 'खर्च नोंदी' : 'Records'}`,
        },
        ...activeExpenses.slice(0, 10).map((e) => ({
          label: `${e.title} [${translateCategory(e.category, language)}] - ${e.crop || (language === 'mr' ? 'सामान्य' : 'General')}`,
          value: formatCurrency(e.amount),
          highlight: 'orange' as const,
        })),
      ],
      totalLabel: `${dict.total} ${dict.totalExpenses}`,
      totalValue: formatCurrency(activeTotalExpenses),
      accentColor: '#D97706',
      tableData: {
        headers: [dict.date, dict.particulars, dict.category, dict.crop, dict.amount],
        rows: activeExpenses.map((e) => [
          e.date,
          e.title,
          translateCategory(e.category, language),
          e.crop || (language === 'mr' ? 'सामान्य' : 'General'),
          formatCurrency(e.amount),
        ]),
      },
    });
  };

  // 4. Crop Performance Report Preview
  const handleOpenCropReport = (cropName: string) => {
    const cropLower = cropName.toLowerCase();
    const cropExpenses = activeExpenses.filter((e) => (e.crop || '').toLowerCase() === cropLower);
    const cropSales = activeSales.filter((s) => (s.cropName || '').toLowerCase() === cropLower);

    const expenseSum = cropExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
    const saleSum = cropSales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
    const profit = saleSum - expenseSum;
    const isProfit = profit >= 0;

    setPreviewData({
      type: 'crop',
      title: `${cropName} - ${dict.cropReportTitle} (FY ${selectedYear})`,
      subtitle: `${user?.name || (language === 'mr' ? 'शेतकरी खातेदार' : 'Farmer')} · ${dict.officialStatement}`,
      year: selectedYear,
      cropName,
      items: [
        { label: dict.crop, value: cropName, isBold: true },
        { label: dict.totalRevenue, value: formatCurrency(saleSum), isBold: true, highlight: 'green' },
        { label: dict.totalExpenses, value: formatCurrency(expenseSum), isBold: true, highlight: 'orange' },
        { label: dict.salesHead, value: `${cropSales.length} ${language === 'mr' ? 'विक्री नोंदी' : 'Sales'}` },
        { label: dict.expensesHead, value: `${cropExpenses.length} ${language === 'mr' ? 'खर्च नोंदी' : 'Entries'}` },
      ],
      totalLabel: `${dict.netProfit} (${cropName})`,
      totalValue: `${isProfit ? '+' : '-'}${formatCurrency(Math.abs(profit))}`,
      accentColor: isProfit ? colors.primaryGreen : colors.danger,
    });
  };

  const formatCropDisplayName = (name: string): string => {
    const key = name.toLowerCase() as TranslationKey;
    const val = t(key);
    return val !== key ? val : name;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.iconButton} onPress={() => router.push('/drawer')}>
          <Menu size={28} color={colors.primaryText} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('reports')}</Text>
        <TouchableOpacity style={styles.iconButton}>
          <FileText size={24} color={colors.primaryGreen} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Download / Generation Success Banner */}
        {downloadSuccess && (
          <View style={styles.successBanner}>
            <CheckCircle size={22} color={colors.primaryGreen} />
            <View style={{ flex: 1 }}>
              <Text style={styles.successBannerTitle}>{t('reportReadyTitle')}</Text>
              <Text style={styles.successBannerText}>
                {downloadSuccess} {t('reportReadyMsg')}
              </Text>
            </View>
          </View>
        )}

        {/* Hero Banner */}
        <Card style={styles.heroCard}>
          <View style={styles.heroContent}>
            <View style={styles.heroIconCircle}>
              <TrendingUp size={30} color={colors.primaryGreen} />
            </View>
            <View style={styles.heroTextGroup}>
              <View style={styles.heroBadgeRow}>
                <Text style={styles.heroBadgeText}>{dict.officialStatement}</Text>
              </View>
              <Text style={styles.heroTitle}>{t('farmStatements')}</Text>
              <Text style={styles.heroSubtitle}>
                {t('reportsSubtitle')}
              </Text>
            </View>
          </View>
        </Card>

        {/* Financial Year Selector */}
        <View style={styles.yearFilterSection}>
          <View style={styles.yearLabelGroup}>
            <Calendar size={16} color={colors.primaryGreen} />
            <Text style={styles.yearFilterLabel}>{t('selectYear')}:</Text>
          </View>
          <View style={styles.yearPillsRow}>
            {YEARS.map((y) => {
              const isSelected = selectedYear === y;
              return (
                <TouchableOpacity
                  key={y}
                  style={[styles.yearPill, isSelected && styles.yearPillActive]}
                  onPress={() => setSelectedYear(y)}
                  activeOpacity={0.8}
                >
                  <Text style={[styles.yearPillText, isSelected && styles.yearPillTextActive]}>
                    FY {y}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* 1. YEARLY STATEMENTS SECTION */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('yearlyReports')}</Text>

          {/* Farm Audit & Annual P&L Statement Card */}
          <Card style={styles.reportCard}>
            <View style={styles.cardMainRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#DCFCE7' }]}>
                <Award size={26} color={colors.primaryGreen} />
              </View>

              <View style={styles.reportDetails}>
                <Text style={styles.reportTitle}>
                  {dict.farmAuditTitle} ({selectedYear})
                </Text>
                <Text style={styles.reportSubtitleText}>{dict.farmAuditSubtitle}</Text>
                <View style={styles.metaBadgeRow}>
                  <Text
                    style={[
                      styles.revenueHighlight,
                      { color: isOverallProfit ? colors.primaryGreen : colors.danger },
                    ]}
                  >
                    {dict.netProfit}: {isOverallProfit ? '+' : '-'}{formatCurrency(Math.abs(totalNetProfit))}
                  </Text>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.reportSize}>
                    {activeCrops.length} {language === 'mr' ? 'पिके' : 'Crops'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardActionsRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleOpenAuditReport}
                activeOpacity={0.8}
              >
                <Eye size={16} color={colors.secondaryText} />
                <Text style={styles.actionBtnText}>{t('preview')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.primaryActionBtn]}
                onPress={() =>
                  handleDownload('farm_audit', `${dict.farmAuditTitle} (${selectedYear})`)
                }
                activeOpacity={0.8}
                disabled={isGenerating !== null}
              >
                {isGenerating === `${dict.farmAuditTitle} (${selectedYear})` ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Download size={16} color={colors.white} />
                )}
                <Text style={styles.primaryActionBtnText}>{t('downloadPdf')}</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Yearly Sales Report Card */}
          <Card style={styles.reportCard}>
            <View style={styles.cardMainRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#E0F2FE' }]}>
                <ShoppingCart size={26} color="#0284C7" />
              </View>

              <View style={styles.reportDetails}>
                <Text style={styles.reportTitle}>
                  {t('yearlySalesReport')} ({selectedYear})
                </Text>
                <Text style={styles.reportSubtitleText}>{t('yearlySalesReportSubtitle')}</Text>
                <View style={styles.metaBadgeRow}>
                  <Text style={styles.revenueHighlight}>
                    {dict.total}: {formatCurrency(activeTotalSales)}
                  </Text>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.reportSize}>
                    {activeSales.length} {t('totalEntries')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardActionsRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleOpenYearlySalesReport}
                activeOpacity={0.8}
              >
                <Eye size={16} color={colors.secondaryText} />
                <Text style={styles.actionBtnText}>{t('preview')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.primaryActionBtn]}
                onPress={() =>
                  handleDownload('sales', `${t('yearlySalesReport')} (${selectedYear})`)
                }
                activeOpacity={0.8}
                disabled={isGenerating !== null}
              >
                {isGenerating === `${t('yearlySalesReport')} (${selectedYear})` ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Download size={16} color={colors.white} />
                )}
                <Text style={styles.primaryActionBtnText}>{t('downloadPdf')}</Text>
              </TouchableOpacity>
            </View>
          </Card>

          {/* Yearly Expense Report Card */}
          <Card style={styles.reportCard}>
            <View style={styles.cardMainRow}>
              <View style={[styles.iconCircle, { backgroundColor: '#FEF3C7' }]}>
                <Receipt size={26} color="#D97706" />
              </View>

              <View style={styles.reportDetails}>
                <Text style={styles.reportTitle}>
                  {t('yearlyExpenseReport')} ({selectedYear})
                </Text>
                <Text style={styles.reportSubtitleText}>{t('yearlyExpenseReportSubtitle')}</Text>
                <View style={styles.metaBadgeRow}>
                  <Text style={[styles.revenueHighlight, { color: '#D97706' }]}>
                    {dict.total}: {formatCurrency(activeTotalExpenses)}
                  </Text>
                  <Text style={styles.dotSeparator}>•</Text>
                  <Text style={styles.reportSize}>
                    {activeExpenses.length} {t('totalEntries')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.cardActionsRow}>
              <TouchableOpacity
                style={styles.actionBtn}
                onPress={handleOpenYearlyExpenseReport}
                activeOpacity={0.8}
              >
                <Eye size={16} color={colors.secondaryText} />
                <Text style={styles.actionBtnText}>{t('preview')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, styles.primaryActionBtn]}
                onPress={() =>
                  handleDownload('expenses', `${t('yearlyExpenseReport')} (${selectedYear})`)
                }
                activeOpacity={0.8}
                disabled={isGenerating !== null}
              >
                {isGenerating === `${t('yearlyExpenseReport')} (${selectedYear})` ? (
                  <ActivityIndicator size="small" color={colors.white} />
                ) : (
                  <Download size={16} color={colors.white} />
                )}
                <Text style={styles.primaryActionBtnText}>{t('downloadPdf')}</Text>
              </TouchableOpacity>
            </View>
          </Card>
        </View>

        {/* 2. CROP-WISE REPORTS SECTION */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>{t('cropwiseReports')}</Text>

          {activeCrops.length === 0 ? (
            <Card style={styles.emptyCropCard}>
              <Sprout size={36} color={colors.secondaryText} />
              <Text style={styles.emptyCropTitle}>{t('noCropsFound')}</Text>
              <Text style={styles.emptyCropDesc}>{t('noCropsFoundDesc')}</Text>
              <TouchableOpacity
                style={styles.addCropBtn}
                onPress={() => router.push('/add-crop')}
              >
                <Text style={styles.addCropBtnText}>+ {t('addCrop')}</Text>
              </TouchableOpacity>
            </Card>
          ) : (
            activeCrops.map((crop) => {
              const meta = getCropMeta(crop.name);
              const CropIcon = meta.icon;
              const displayName = formatCropDisplayName(crop.name);

              const cropLower = crop.name.trim().toLowerCase();
              const cropExpenses = activeExpenses.filter(
                (e) => (e.cropId && e.cropId === crop.id) || (e.crop || '').trim().toLowerCase() === cropLower
              );
              const cropSales = activeSales.filter(
                (s) => (s.cropId && s.cropId === crop.id) || (s.cropName || '').trim().toLowerCase() === cropLower
              );
              const expSum = cropExpenses.reduce((sum, e) => sum + (Number(e.amount) || 0), 0);
              const saleSum = cropSales.reduce((sum, s) => sum + (Number(s.totalAmount) || 0), 0);
              const netProfit = saleSum - expSum;

              return (
                <Card key={crop.id} style={styles.reportCard}>
                  <View style={styles.cardMainRow}>
                    <View style={[styles.iconCircle, { backgroundColor: meta.bg }]}>
                      <CropIcon size={28} color={meta.color} />
                    </View>

                    <View style={styles.reportDetails}>
                      <View style={styles.cropTitleRow}>
                        <Text style={styles.reportTitle}>{displayName}</Text>
                        <Text
                          style={[
                            styles.profitBadge,
                            netProfit >= 0 ? styles.profitGreen : styles.profitRed,
                          ]}
                        >
                          {netProfit >= 0 ? '+' : '-'}{formatCurrency(Math.abs(netProfit))}
                        </Text>
                      </View>

                      <Text style={styles.reportSubtitleText}>
                        {crop.area} · {t('sowingDate')}: {crop.sowingDate}
                      </Text>

                      <View style={styles.cropStatsRow}>
                        <Text style={styles.cropStatLabel}>
                          {t('cropSales')}:{' '}
                          <Text style={styles.boldText}>{formatCurrency(saleSum)}</Text>
                        </Text>
                        <Text style={styles.dotSeparator}>•</Text>
                        <Text style={styles.cropStatLabel}>
                          {t('cropExpenses')}:{' '}
                          <Text style={styles.boldText}>{formatCurrency(expSum)}</Text>
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.cardActionsRow}>
                    <TouchableOpacity
                      style={styles.actionBtn}
                      onPress={() => handleOpenCropReport(crop.name)}
                      activeOpacity={0.8}
                    >
                      <Eye size={16} color={colors.secondaryText} />
                      <Text style={styles.actionBtnText}>{t('preview')}</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={[styles.actionBtn, styles.primaryActionBtn]}
                      onPress={() =>
                        handleDownload(
                          'crop',
                          `${displayName} ${t('cropReportTitle')} (${selectedYear})`,
                          crop.name
                        )
                      }
                      activeOpacity={0.8}
                      disabled={isGenerating !== null}
                    >
                      {isGenerating ===
                      `${displayName} ${t('cropReportTitle')} (${selectedYear})` ? (
                        <ActivityIndicator size="small" color={colors.white} />
                      ) : (
                        <Download size={16} color={colors.white} />
                      )}
                      <Text style={styles.primaryActionBtnText}>{t('downloadPdf')}</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              );
            })
          )}
        </View>
      </ScrollView>

      {/* DETAILED REPORT PREVIEW MODAL */}
      <Modal
        visible={previewData !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setPreviewData(null)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setPreviewData(null)}>
          <View style={styles.previewSheet} onStartShouldSetResponder={() => true}>
            {/* Sheet Header */}
            <View style={styles.previewHeader}>
              <View style={{ flex: 1 }}>
                <Text style={styles.previewHeaderTitle}>{t('reportPreviewTitle')}</Text>
                <Text style={styles.previewHeaderSubtitle}>
                  {t('generatedOn')}: {new Date().toLocaleDateString(language === 'mr' ? 'mr-IN' : 'en-IN')} · FY {previewData?.year}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.previewCloseBtn}
                onPress={() => setPreviewData(null)}
              >
                <X size={22} color={colors.primaryText} />
              </TouchableOpacity>
            </View>

            {previewData && (
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.previewContent}
              >
                {/* Printable Document Box */}
                <View style={styles.documentBox}>
                  {/* Document Header */}
                  <View style={styles.docHeader}>
                    <View style={styles.docBrandBadge}>
                      <Text style={styles.docBrandText}>🌱 {dict.appTitle}</Text>
                    </View>
                    <Text style={styles.docReportTitle}>{previewData.title}</Text>
                    <Text style={styles.docSubtitle}>{previewData.subtitle}</Text>
                  </View>

                  {/* Farmer Info Strip */}
                  <View style={styles.docFarmerStrip}>
                    <View style={styles.docFarmerItem}>
                      <Text style={styles.docFarmerLbl}>{dict.farmerName}</Text>
                      <Text style={styles.docFarmerVal}>{user?.name || (language === 'mr' ? 'शेतकरी' : 'Farmer')}</Text>
                    </View>
                    <View style={styles.docFarmerItem}>
                      <Text style={styles.docFarmerLbl}>{dict.location}</Text>
                      <Text style={styles.docFarmerVal}>
                        {[user?.village, user?.district || 'Maharashtra'].filter(Boolean).join(', ')}
                      </Text>
                    </View>
                    <View style={styles.docFarmerItem}>
                      <Text style={styles.docFarmerLbl}>{dict.financialYear}</Text>
                      <Text style={styles.docFarmerVal}>FY {previewData.year}</Text>
                    </View>
                  </View>

                  <View style={styles.docDivider} />

                  {/* Document Rows */}
                  <View style={styles.docRowsList}>
                    {previewData.items.map((row, index) => (
                      <View key={index} style={styles.docRow}>
                        <Text style={[styles.docRowLabel, row.isBold && styles.docRowLabelBold]}>
                          {row.label}
                        </Text>
                        <Text
                          style={[
                            styles.docRowValue,
                            row.isBold && styles.docRowValueBold,
                            row.highlight === 'green' && { color: colors.primaryGreen },
                            row.highlight === 'orange' && { color: '#D97706' },
                            row.highlight === 'red' && { color: colors.danger },
                          ]}
                        >
                          {row.value}
                        </Text>
                      </View>
                    ))}
                  </View>

                  {/* Table Data Preview if present */}
                  {previewData.tableData && previewData.tableData.rows.length > 0 && (
                    <View style={styles.tablePreviewBox}>
                      <View style={styles.tablePreviewHeader}>
                        {previewData.tableData.headers.map((h, hIdx) => (
                          <Text
                            key={hIdx}
                            style={[
                              styles.tableHeaderCell,
                              hIdx === 0 && { flex: 1.5 },
                              hIdx > 1 && { textAlign: 'right' },
                            ]}
                          >
                            {h}
                          </Text>
                        ))}
                      </View>
                      {previewData.tableData.rows.slice(0, 5).map((row, rIdx) => (
                        <View key={rIdx} style={styles.tableRowPreview}>
                          {row.map((cell, cIdx) => (
                            <Text
                              key={cIdx}
                              style={[
                                styles.tableBodyCell,
                                cIdx === 0 && { flex: 1.5, fontWeight: fontWeight.semibold },
                                cIdx > 1 && { textAlign: 'right' },
                              ]}
                            >
                              {cell}
                            </Text>
                          ))}
                        </View>
                      ))}
                      {previewData.tableData.rows.length > 5 && (
                        <Text style={styles.moreRecordsText}>
                          + {previewData.tableData.rows.length - 5} {language === 'mr' ? 'आणखी नोंदी (पीडीएफ मध्ये समाविष्ट)' : 'more records in PDF'}
                        </Text>
                      )}
                    </View>
                  )}

                  <View style={styles.docDivider} />

                  {/* Document Total Row */}
                  <View style={styles.docTotalRow}>
                    <Text style={styles.docTotalLabel}>{previewData.totalLabel}</Text>
                    <Text style={[styles.docTotalValue, { color: previewData.accentColor }]}>
                      {previewData.totalValue}
                    </Text>
                  </View>

                  {/* Certification Disclaimer */}
                  <View style={styles.docCertBadge}>
                    <Text style={styles.docCertText}>
                      ✓ {dict.certificationText}
                    </Text>
                  </View>
                </View>

                {/* Modal Action Buttons */}
                <View style={styles.previewActions}>
                  <TouchableOpacity
                    style={styles.printActionBtn}
                    onPress={() => {
                      handlePrint(previewData.type, previewData.cropName);
                    }}
                    activeOpacity={0.8}
                  >
                    <Printer size={18} color={colors.primaryGreen} />
                    <Text style={styles.printActionBtnText}>{t('printReport')}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.downloadActionBtn}
                    onPress={async () => {
                      await handleDownload(previewData.type, previewData.title, previewData.cropName);
                      setPreviewData(null);
                    }}
                    activeOpacity={0.8}
                    disabled={isGenerating !== null}
                  >
                    {isGenerating !== null ? (
                      <ActivityIndicator size="small" color={colors.white} />
                    ) : (
                      <Download size={18} color={colors.white} />
                    )}
                    <Text style={styles.downloadActionBtnText}>{t('downloadPdf')}</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </Pressable>
      </Modal>
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
  scrollContent: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xxl + 20,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm + 2,
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: spacing.md,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  successBannerTitle: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: '#166534',
  },
  successBannerText: {
    fontSize: fontSize.xs,
    color: '#15803D',
    marginTop: 2,
  },
  heroCard: {
    backgroundColor: colors.lightGreen,
    borderColor: '#D1FAE5',
    borderWidth: 1.5,
    padding: spacing.lg,
    marginVertical: spacing.md,
    borderRadius: 18,
  },
  heroContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  heroIconCircle: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: colors.primaryGreen,
    ...shadows.sm,
  },
  heroTextGroup: {
    flex: 1,
  },
  heroBadgeRow: {
    alignSelf: 'flex-start',
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#86EFAC',
    marginBottom: 4,
  },
  heroBadgeText: {
    fontSize: 10,
    fontWeight: fontWeight.bold,
    color: '#166534',
    textTransform: 'uppercase',
  },
  heroTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 2,
  },
  heroSubtitle: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    lineHeight: 18,
  },
  yearFilterSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.white,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: spacing.md,
  },
  yearLabelGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  yearFilterLabel: {
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  yearPillsRow: {
    flexDirection: 'row',
    gap: spacing.xs + 2,
  },
  yearPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.full,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
  },
  yearPillActive: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  yearPillText: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.semibold,
    color: colors.secondaryText,
  },
  yearPillTextActive: {
    color: colors.white,
    fontWeight: fontWeight.bold,
  },

  // Featured Comprehensive Audit Card
  featuredAuditCard: {
    backgroundColor: '#FEFCE8',
    borderColor: '#FDE047',
    borderWidth: 1.5,
    borderRadius: 18,
    padding: spacing.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  featuredHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  featuredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#FACC15',
  },
  featuredBadgeText: {
    fontSize: 10.5,
    fontWeight: fontWeight.bold,
    color: '#854D0E',
    textTransform: 'uppercase',
  },
  auditYearBadge: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: '#713F12',
    backgroundColor: '#FEF08A',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  featuredTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 4,
  },
  featuredSubtitle: {
    fontSize: fontSize.xs,
    color: '#78716C',
    lineHeight: 18,
    marginBottom: spacing.md,
  },
  auditKpiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.white,
    padding: spacing.md,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#FEF08A',
    marginBottom: spacing.md,
  },
  auditKpiItem: {
    flex: 1,
    alignItems: 'center',
  },
  auditKpiLbl: {
    fontSize: 10.5,
    color: colors.secondaryText,
    fontWeight: fontWeight.semibold,
    marginBottom: 2,
    textAlign: 'center',
  },
  auditKpiVal: {
    fontSize: fontSize.sm + 1,
    fontWeight: fontWeight.bold,
  },
  auditKpiDivider: {
    width: 1,
    height: '80%',
    backgroundColor: '#E7E5E4',
  },

  sectionContainer: {
    marginTop: spacing.sm,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  reportCard: {
    backgroundColor: colors.white,
    borderColor: colors.border,
    borderWidth: 1.5,
    borderRadius: 18,
    padding: spacing.lg,
    ...shadows.sm,
  },
  cardMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconCircle: {
    width: 54,
    height: 54,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    flexShrink: 0,
  },
  reportDetails: {
    flex: 1,
  },
  cropTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  profitBadge: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  profitGreen: {
    backgroundColor: '#DCFCE7',
    color: colors.primaryGreen,
  },
  profitRed: {
    backgroundColor: '#FEE2E2',
    color: colors.danger,
  },
  reportTitle: {
    fontSize: fontSize.md + 1,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    marginBottom: 2,
  },
  reportSubtitleText: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    lineHeight: 16,
  },
  metaBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  revenueHighlight: {
    fontSize: fontSize.xs,
    fontWeight: fontWeight.bold,
    color: colors.primaryGreen,
  },
  dotSeparator: {
    color: colors.mutedText,
    fontSize: fontSize.xs,
  },
  reportSize: {
    fontSize: fontSize.xs,
    color: colors.mutedText,
  },
  cropStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 6,
  },
  cropStatLabel: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
  },
  boldText: {
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  cardActionsRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: spacing.sm + 2,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    gap: 6,
  },
  actionBtnText: {
    fontSize: fontSize.xs + 1,
    color: colors.secondaryText,
    fontWeight: fontWeight.semibold,
  },
  primaryActionBtn: {
    backgroundColor: colors.primaryGreen,
    borderColor: colors.primaryGreen,
  },
  primaryActionBtnText: {
    fontSize: fontSize.xs + 1,
    color: colors.white,
    fontWeight: fontWeight.bold,
  },
  emptyCropCard: {
    padding: spacing.xl,
    alignItems: 'center',
    gap: spacing.sm,
  },
  emptyCropTitle: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  emptyCropDesc: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  addCropBtn: {
    backgroundColor: colors.primaryGreen,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.full,
    marginTop: spacing.xs,
  },
  addCropBtnText: {
    color: colors.white,
    fontSize: fontSize.sm,
    fontWeight: fontWeight.bold,
  },

  // Modal Preview Styles
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'flex-end',
  },
  previewSheet: {
    backgroundColor: colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: spacing.xl,
    ...shadows.lg,
  },
  previewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  previewHeaderTitle: {
    fontSize: fontSize.lg,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  previewHeaderSubtitle: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    marginTop: 2,
  },
  previewCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  previewContent: {
    padding: spacing.lg,
    gap: spacing.lg,
  },
  documentBox: {
    backgroundColor: '#FAFAF9',
    borderColor: '#E7E5E4',
    borderWidth: 1.5,
    borderRadius: 14,
    padding: spacing.lg,
  },
  docHeader: {
    alignItems: 'center',
    gap: 4,
  },
  docBrandBadge: {
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#86EFAC',
  },
  docBrandText: {
    fontSize: fontSize.xs,
    color: '#166534',
    fontWeight: fontWeight.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  docReportTitle: {
    fontSize: fontSize.md + 2,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
    textAlign: 'center',
    marginTop: 2,
  },
  docSubtitle: {
    fontSize: fontSize.xs,
    color: colors.secondaryText,
    textAlign: 'center',
  },
  docFarmerStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderWidth: 1,
    borderRadius: 8,
    padding: spacing.sm + 2,
    marginTop: spacing.md,
  },
  docFarmerItem: {
    flex: 1,
  },
  docFarmerLbl: {
    fontSize: 10,
    color: '#166534',
    fontWeight: fontWeight.semibold,
  },
  docFarmerVal: {
    fontSize: fontSize.xs,
    color: colors.primaryText,
    fontWeight: fontWeight.bold,
    marginTop: 1,
  },
  docDivider: {
    height: 1,
    backgroundColor: '#E7E5E4',
    marginVertical: spacing.md,
  },
  docRowsList: {
    gap: 10,
  },
  docRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  docRowLabel: {
    fontSize: fontSize.sm,
    color: colors.secondaryText,
    flex: 1,
    marginRight: spacing.sm,
  },
  docRowLabelBold: {
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  docRowValue: {
    fontSize: fontSize.sm,
    color: colors.primaryText,
    fontWeight: fontWeight.semibold,
  },
  docRowValueBold: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  tablePreviewBox: {
    marginTop: spacing.md,
    backgroundColor: colors.white,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  tablePreviewHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  tableHeaderCell: {
    flex: 1,
    fontSize: 10.5,
    fontWeight: fontWeight.bold,
    color: '#374151',
  },
  tableRowPreview: {
    flexDirection: 'row',
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  tableBodyCell: {
    flex: 1,
    fontSize: 10.5,
    color: '#4B5563',
  },
  moreRecordsText: {
    fontSize: 10,
    color: '#9CA3AF',
    fontStyle: 'italic',
    padding: 6,
    textAlign: 'center',
  },
  docTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: spacing.xs,
  },
  docTotalLabel: {
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
    color: colors.primaryText,
  },
  docTotalValue: {
    fontSize: fontSize.xl,
    fontWeight: fontWeight.bold,
  },
  docCertBadge: {
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: '#F3F4F6',
    borderRadius: 6,
  },
  docCertText: {
    fontSize: 10,
    color: '#6B7280',
    lineHeight: 14,
  },
  previewActions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.xs,
  },
  printActionBtn: {
    flex: 1,
    backgroundColor: '#DCFCE7',
    borderColor: '#86EFAC',
    borderWidth: 1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  printActionBtnText: {
    color: colors.primaryGreen,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
  downloadActionBtn: {
    flex: 1.3,
    backgroundColor: colors.primaryGreen,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
    borderRadius: borderRadius.md,
  },
  downloadActionBtnText: {
    color: colors.white,
    fontSize: fontSize.md,
    fontWeight: fontWeight.bold,
  },
});
