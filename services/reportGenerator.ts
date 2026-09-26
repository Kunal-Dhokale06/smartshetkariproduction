import { Platform } from 'react-native';
import { Crop, Expense, Sale } from '../types';

// Lazy dynamic loaders for heavy native printing & sharing modules
async function getPrintModule() {
  return await import('expo-print');
}

async function getSharingModule() {
  return await import('expo-sharing');
}

async function getFileSystemModule() {
  return await import('expo-file-system');
}
import { AuthUser } from '../data/authStore';
import { Language } from '../locales/languageContext';

export interface ReportUserMeta {
  name?: string;
  phone?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  landArea?: number | string | null;
  landAreaUnit?: string;
}

export interface ReportContextData {
  language: Language;
  year: string;
  user: AuthUser | null;
  crops: Crop[];
  expenses: Expense[];
  sales: Sale[];
  cropName?: string;
}

export type ReportType = 'sales' | 'expenses' | 'crop' | 'farm_audit';

// Multi-language dictionary for PDF & HTML generation
const reportDict = {
  mr: {
    appTitle: 'स्मार्टशेतकरी',
    systemTagline: 'डिजिटल शेती हिशोब आणि कृषी लेखा प्रणाली',
    stateGovt: 'महाराष्ट्र शासन कृषी विभाग संलग्न प्रणाली',
    officialStatement: 'अधिकृत शेती वित्तीय अहवाल',
    docId: 'अहवाल क्र.',
    generatedOn: 'तयार केल्याची तारीख व वेळ',
    financialYear: 'आर्थिक वर्ष',
    farmerDetails: 'शेतकरी व शेतजमीन तपशील',
    farmerName: 'शेतकऱ्याचे पूर्ण नाव',
    contactNumber: 'मोबाईल / संपर्क क्रमांक',
    location: 'गाव / तालुका / जिल्हा',
    landHolding: 'एकूण शेतजमीन क्षेत्र',
    summaryTitle: 'वित्तीय व उत्पादन सारांश',
    totalRevenue: 'एकूण विक्री उत्पन्न',
    totalExpenses: 'एकूण शेती खर्च',
    netProfit: 'निव्वळ नफा (शिल्लक)',
    netLoss: 'निव्वळ तोटा',
    totalTransactions: 'एकूण नोंदी / पावत्या',
    totalQuantitySold: 'एकूण विक्री प्रमाण',
    activeCropsCount: 'नोंदणीकृत पिके संख्या',
    salesReportTitle: 'वार्षिक पीक विक्री व उत्पन्न अहवाल',
    salesReportSubtitle: 'सर्व पीक काढणी विक्री, खरेदीदार, बाजारभाव आणि महसुलाचा सविस्तर ताळेबंद',
    expenseReportTitle: 'वार्षिक शेती खर्च खातेवही अहवाल',
    expenseReportSubtitle: 'बियाणे, खते, मजुरी, कीटकनाशके व यंत्रसामग्री खर्चाचा वार्षिक तपशील',
    cropReportTitle: 'पीक कामगिरी व नफा-तोटा अहवाल',
    cropReportSubtitle: 'या पिकाचे वैयक्तिक उत्पादन, विक्री महसूल व प्रत्यक्ष नफा विवरण',
    farmAuditTitle: 'समग्र शेती वार्षिक ताळेबंद व ऑडिट अहवाल',
    farmAuditSubtitle: 'सर्व पिकांचा एकत्रित नफा-तोटा, एकूण गुंतवणूक, महसूल आणि आर्थिक नफा',
    srNo: 'अ.क्र.',
    date: 'तारीख',
    crop: 'पीक नाव',
    particulars: 'खर्च / विक्री तपशील',
    category: 'वर्ग / प्रकार',
    buyerMarket: 'खरेदीदार / बाजार समिती',
    quantity: 'प्रमाण',
    rate: 'दर (प्रति एकक)',
    amount: 'रक्कम (₹)',
    status: 'स्थिती',
    sowingDate: 'पेरणी तारीख',
    cropArea: 'क्षेत्र',
    expensesHead: 'खर्च तपशील',
    salesHead: 'विक्री तपशील',
    categorySummary: 'वर्गनिहाय खर्च वाटप सारांश',
    cropPerformanceSummary: 'पीकनिहाय कामगिरी सारांश',
    roi: 'गुंतवणूक परतावा (ROI)',
    total: 'एकूण',
    grandTotal: 'सर्वसमावेशक एकूण (Grand Total)',
    certificationText: 'टीप / प्रमाणपत्र: हा अहवाल केवळ शेतकऱ्यांच्या वैयक्तिक माहितीसाठी, शेती व्यवस्थापनासाठी आणि खर्चाच्या नोंदीसाठी तयार करण्यात आला आहे.',
    farmerSignature: 'शेतकऱ्याची स्वाक्षरी',
    officerSignature: 'तपासणी स्वाक्षरी व दिनांक',
    noRecords: 'कोणतीही नोंद आढळली नाही.',
    categories: {
      Fertilizer: 'खते व रसायने',
      Seeds: 'बियाणे व पेरणी',
      Pesticide: 'कीटकनाशके व फवारणी',
      Labor: 'मजुरी व वेतन',
      Irrigation: 'सिंचन व पाणीपुरवठा',
      Other: 'इतर शेती खर्च',
    } as Record<string, string>,
    units: {
      quintal: 'क्विंटल',
      kg: 'किलो',
      ton: 'टन',
      liter: 'लिटर',
      bagCrate: 'पोते / क्रेट',
      acre: 'एकर',
      guntha: 'गुंठा',
    } as Record<string, string>,
  },
  hi: {
    appTitle: 'स्मार्टशेतकारी',
    systemTagline: 'डिजिटल कृषि लेखा एवं फार्म प्रबंधन प्रणाली',
    stateGovt: 'कृषि विभाग समर्थित डिजिटल प्रणाली',
    officialStatement: 'आधिकारिक कृषि वित्तीय रिपोर्ट',
    docId: 'रिपोर्ट सं.',
    generatedOn: 'तैयार करने की तिथि एवं समय',
    financialYear: 'वित्तीय वर्ष',
    farmerDetails: 'किसान एवं कृषि भूमि विवरण',
    farmerName: 'किसान का पूरा नाम',
    contactNumber: 'मोबाइल / संपर्क नंबर',
    location: 'गाँव / तालुका / जिला',
    landHolding: 'कुल कृषि भूमि क्षेत्रफल',
    summaryTitle: 'वित्तीय एवं उत्पादन सारांश',
    totalRevenue: 'कुल बिक्री आय',
    totalExpenses: 'कुल कृषि खर्च',
    netProfit: 'शुद्ध लाभ (बचत)',
    netLoss: 'शुद्ध हानि',
    totalTransactions: 'कुल प्रविष्टियां / रसीदें',
    totalQuantitySold: 'कुल बिक्री मात्रा',
    activeCropsCount: 'पंजीकृत फसलें संख्या',
    salesReportTitle: 'वार्षिक फसल बिक्री एवं आय रिपोर्ट',
    salesReportSubtitle: 'समस्त फसल कटाई बिक्री, मंडी भाव, खरीदार एवं राजस्व का पूर्ण विवरण',
    expenseReportTitle: 'वार्षिक कृषि खर्च खाता-बही रिपोर्ट',
    expenseReportSubtitle: 'बीज, उर्वरक, मजदूरी, कीटनाशक एवं सिंचाई खर्च का वार्षिक विवरण',
    cropReportTitle: 'फसलवार प्रदर्शन एवं लाभ-हानि रिपोर्ट',
    cropReportSubtitle: 'इस फसल का व्यक्तिगत उत्पादन, आय एवं शुद्ध लाभ का विवरण',
    farmAuditTitle: 'समग्र कृषि वार्षिक आय-व्यय व ऑडिट रिपोर्ट',
    farmAuditSubtitle: 'सभी फसलों का एकीकृत लाभ-हानि, कुल निवेश और वित्तीय विवरण',
    srNo: 'क्र.सं.',
    date: 'तारीख',
    crop: 'फसल का नाम',
    particulars: 'खर्च / बिक्री विवरण',
    category: 'वर्ग / श्रेणी',
    buyerMarket: 'खरीदार / मंडी',
    quantity: 'मात्रा',
    rate: 'दर (प्रति इकाई)',
    amount: 'राशि (₹)',
    status: 'स्थिति',
    sowingDate: 'बुवाई तिथि',
    cropArea: 'क्षेत्रफल',
    expensesHead: 'खर्च विवरण',
    salesHead: 'बिक्री विवरण',
    categorySummary: 'श्रेणीवार खर्च सारांश',
    cropPerformanceSummary: 'फसलवार प्रदर्शन सारांश',
    roi: 'निवेश पर प्रतिफल (ROI)',
    total: 'कुल',
    grandTotal: 'सर्वसमावेशी कुल (Grand Total)',
    certificationText: 'सूचना / प्रमाणपत्र: यह रिपोर्ट केवल किसानों की व्यक्तिगत जानकारी, कृषि प्रबंधन एवं खर्चों के रिकॉर्ड के लिए तैयार की गई है।',
    farmerSignature: 'किसान के हस्ताक्षर',
    officerSignature: 'सत्यापन हस्ताक्षर एवं तिथि',
    noRecords: 'कोई रिकॉर्ड नहीं मिला।',
    categories: {
      Fertilizer: 'उर्वरक एवं रसायन',
      Seeds: 'बीज एवं बुवाई',
      Pesticide: 'कीटनाशक एवं छिड़काव',
      Labor: 'मजदूरी एवं वेतन',
      Irrigation: 'सिंचाई एवं जल प्रबंधन',
      Other: 'अन्य कृषि खर्च',
    } as Record<string, string>,
    units: {
      quintal: 'क्विंटल',
      kg: 'किलो',
      ton: 'टन',
      liter: 'लीटर',
      bagCrate: 'बोरी / क्रेट',
      acre: 'एकड़',
      guntha: 'गुंठा',
    } as Record<string, string>,
  },
  en: {
    appTitle: 'SmartShetkari',
    systemTagline: 'Digital Farm Accounting & Agro-Management Ledger',
    stateGovt: 'Standard Agricultural Financial Statement',
    officialStatement: 'Official Agricultural Financial Report',
    docId: 'Report ID',
    generatedOn: 'Generated On & Time',
    financialYear: 'Financial Year',
    farmerDetails: 'Farmer & Land Particulars',
    farmerName: 'Farmer Full Name',
    contactNumber: 'Mobile / Contact Number',
    location: 'Village / Taluka / District',
    landHolding: 'Total Land Holding Area',
    summaryTitle: 'Financial & Quantitative Overview',
    totalRevenue: 'Total Harvest Revenue',
    totalExpenses: 'Total Cultivation Expenses',
    netProfit: 'Net Farm Profit',
    netLoss: 'Net Loss',
    totalTransactions: 'Total Invoices / Entries',
    totalQuantitySold: 'Total Quantity Sold',
    activeCropsCount: 'Total Registered Crops',
    salesReportTitle: 'Annual Harvest Sales & Revenue Statement',
    salesReportSubtitle: 'Itemized breakdown of crop harvest sales, mandi prices, buyers & income',
    expenseReportTitle: 'Annual Farm Expense Ledger',
    expenseReportSubtitle: 'Itemized breakdown of seeds, fertilizers, labor, pesticides & irrigation costs',
    cropReportTitle: 'Crop Performance & P&L Statement',
    cropReportSubtitle: 'Individual harvest yield, input investment and net profit statement',
    farmAuditTitle: 'Comprehensive Annual Farm Financial Audit',
    farmAuditSubtitle: 'Consolidated profit & loss statement across all crops and seasonal operations',
    srNo: 'Sr.',
    date: 'Date',
    crop: 'Crop Name',
    particulars: 'Details / Item Description',
    category: 'Category',
    buyerMarket: 'Buyer / Mandi',
    quantity: 'Quantity',
    rate: 'Rate (Per Unit)',
    amount: 'Amount (₹)',
    status: 'Status',
    sowingDate: 'Sowing Date',
    cropArea: 'Area',
    expensesHead: 'Expense Items',
    salesHead: 'Sales Invoices',
    categorySummary: 'Category-wise Allocation Summary',
    cropPerformanceSummary: 'Crop-wise Performance Summary',
    roi: 'Return on Investment (ROI)',
    total: 'Total',
    grandTotal: 'Grand Total',
    certificationText: 'Note / Declaration: This report is generated solely for the farmer\'s personal information, farm management, and accounting records.',
    farmerSignature: 'Farmer Signature',
    officerSignature: 'Verification Signature & Date',
    noRecords: 'No records found.',
    categories: {
      Fertilizer: 'Fertilizers & Chemicals',
      Seeds: 'Seeds & Sowing',
      Pesticide: 'Pesticides & Spraying',
      Labor: 'Labor & Wages',
      Irrigation: 'Irrigation & Machinery',
      Other: 'Other Farm Costs',
    } as Record<string, string>,
    units: {
      quintal: 'Quintal',
      kg: 'Kg',
      ton: 'Ton',
      liter: 'Liter',
      bagCrate: 'Bags / Crates',
      acre: 'Acre',
      guntha: 'Guntha',
    } as Record<string, string>,
  },
};

export function formatIndianRupees(val: number): string {
  const formatted = new Intl.NumberFormat('en-IN', {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(val);
  return `₹${formatted}`;
}

export function translateCategory(cat: string, lang: Language): string {
  const d = reportDict[lang] || reportDict.en;
  return d.categories[cat] || cat;
}

export function getDictionary(lang: Language) {
  return reportDict[lang] || reportDict.mr;
}

/**
 * Builds the complete professional HTML template for the report
 */
export function buildReportHtml(type: ReportType, ctx: ReportContextData): string {
  const { language, year, user, crops, expenses, sales, cropName } = ctx;
  const d = getDictionary(language);

  const farmerName = user?.name || (language === 'mr' ? 'शेतकरी खातेदार' : language === 'hi' ? 'किसान खाताधारक' : 'Farmer');
  const phone = user?.phone || '-';
  const village = user?.village ? user.village : '';
  const taluka = user?.taluka ? user.taluka : '';
  const district = user?.district ? user.district : (language === 'mr' ? 'महाराष्ट्र' : 'Maharashtra');
  const locationStr = [village, taluka, district].filter(Boolean).join(', ') || district;
  const landArea = user?.landArea ? `${user.landArea} ${user.landAreaUnit || (language === 'mr' ? 'एकर' : 'Acres')}` : '-';

  const docNo = `SS-${year}-${Math.floor(100000 + Math.random() * 900000)}`;
  const now = new Date();
  const dateStr = now.toLocaleDateString(language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  const timeStr = now.toLocaleTimeString(language === 'mr' ? 'mr-IN' : language === 'hi' ? 'hi-IN' : 'en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  let reportTitle = '';
  let reportSubtitle = '';
  let contentHtml = '';

  // 1. ANNUAL SALES REPORT
  if (type === 'sales') {
    reportTitle = `${d.salesReportTitle} (FY ${year})`;
    reportSubtitle = d.salesReportSubtitle;

    const totalSalesSum = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalQty = sales.reduce((sum, s) => sum + s.quantity, 0);
    const avgRate = totalQty > 0 ? totalSalesSum / totalQty : 0;

    contentHtml = `
      <!-- Summary KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card highlight-green">
          <div class="kpi-label">${d.totalRevenue}</div>
          <div class="kpi-value">${formatIndianRupees(totalSalesSum)}</div>
          <div class="kpi-sub">${sales.length} ${d.totalTransactions}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${d.totalQuantitySold}</div>
          <div class="kpi-value">${totalQty.toLocaleString('en-IN')} ${language === 'mr' ? 'एकके' : language === 'hi' ? 'इकाइयाँ' : 'Units'}</div>
          <div class="kpi-sub">${language === 'mr' ? 'सर्व पिकांचे प्रमाण' : 'Across all crops'}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${language === 'mr' ? 'सरासरी विक्री दर' : language === 'hi' ? 'औसत बिक्री दर' : 'Average Sale Rate'}</div>
          <div class="kpi-value">${formatIndianRupees(avgRate)}</div>
          <div class="kpi-sub">${language === 'mr' ? 'प्रति एकक सरासरी' : 'Per unit avg'}</div>
        </div>
      </div>

      <!-- Sales Table -->
      <div class="table-container">
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 40px;">${d.srNo}</th>
              <th>${d.date}</th>
              <th>${d.crop}</th>
              <th>${d.buyerMarket}</th>
              <th style="text-align: right;">${d.quantity}</th>
              <th style="text-align: right;">${d.rate}</th>
              <th style="text-align: right;">${d.amount}</th>
            </tr>
          </thead>
          <tbody>
            ${
              sales.length === 0
                ? `<tr><td colspan="7" class="text-center empty-cell">${d.noRecords}</td></tr>`
                : sales
                    .map(
                      (s, idx) => `
              <tr>
                <td class="text-center font-bold">${idx + 1}</td>
                <td>${s.date}</td>
                <td><span class="crop-badge">${s.cropName}</span></td>
                <td>${s.marketName || '-'}</td>
                <td class="text-right">${s.quantity} ${s.unit}</td>
                <td class="text-right">${formatIndianRupees(s.pricePerUnit)}</td>
                <td class="text-right font-bold text-green">${formatIndianRupees(s.totalAmount)}</td>
              </tr>
            `
                    )
                    .join('')
            }
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="4" class="text-right font-bold">${d.grandTotal}:</td>
              <td class="text-right font-bold">${totalQty} ${language === 'mr' ? 'एकके' : 'Units'}</td>
              <td class="text-right">-</td>
              <td class="text-right font-bold text-green text-lg">${formatIndianRupees(totalSalesSum)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  }
  // 2. ANNUAL EXPENSE LEDGER
  else if (type === 'expenses') {
    reportTitle = `${d.expenseReportTitle} (FY ${year})`;
    reportSubtitle = d.expenseReportSubtitle;

    const totalExpSum = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Group expenses by category
    const categoryTotals: Record<string, number> = {};
    expenses.forEach((e) => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + e.amount;
    });

    contentHtml = `
      <!-- Summary KPIs -->
      <div class="kpi-grid">
        <div class="kpi-card highlight-orange">
          <div class="kpi-label">${d.totalExpenses}</div>
          <div class="kpi-value">${formatIndianRupees(totalExpSum)}</div>
          <div class="kpi-sub">${expenses.length} ${d.totalTransactions}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${language === 'mr' ? 'सर्वाधिक खर्च वर्ग' : language === 'hi' ? 'उच्चतम खर्च श्रेणी' : 'Top Expense Head'}</div>
          <div class="kpi-value" style="font-size: 16px;">
            ${
              Object.keys(categoryTotals).length > 0
                ? translateCategory(
                    Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0][0],
                    language
                  )
                : '-'
            }
          </div>
          <div class="kpi-sub">${language === 'mr' ? 'प्रमुख खर्च' : 'Major cost'}</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">${language === 'mr' ? 'सरासरी नोंद खर्च' : language === 'hi' ? 'औसत प्रविष्टि खर्च' : 'Average Per Entry'}</div>
          <div class="kpi-value">${formatIndianRupees(expenses.length > 0 ? totalExpSum / expenses.length : 0)}</div>
          <div class="kpi-sub">${language === 'mr' ? 'प्रति नोंद सरासरी' : 'Average cost'}</div>
        </div>
      </div>

      <!-- Category Allocation Pills -->
      <div class="category-summary-box">
        <div class="box-title">${d.categorySummary}</div>
        <div class="category-pills">
          ${Object.entries(categoryTotals)
            .map(
              ([cat, amt]) => `
            <div class="cat-pill">
              <span class="cat-name">${translateCategory(cat, language)}:</span>
              <span class="cat-amt">${formatIndianRupees(amt)}</span>
              <span class="cat-pct">(${totalExpSum > 0 ? ((amt / totalExpSum) * 100).toFixed(1) : 0}%)</span>
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <!-- Expense Table -->
      <div class="table-container">
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 40px;">${d.srNo}</th>
              <th>${d.date}</th>
              <th>${d.particulars}</th>
              <th>${d.category}</th>
              <th>${d.crop}</th>
              <th style="text-align: right;">${d.amount}</th>
            </tr>
          </thead>
          <tbody>
            ${
              expenses.length === 0
                ? `<tr><td colspan="6" class="text-center empty-cell">${d.noRecords}</td></tr>`
                : expenses
                    .map(
                      (e, idx) => `
              <tr>
                <td class="text-center font-bold">${idx + 1}</td>
                <td>${e.date}</td>
                <td class="font-semibold">${e.title}</td>
                <td><span class="category-badge">${translateCategory(e.category, language)}</span></td>
                <td><span class="crop-badge">${e.crop || (language === 'mr' ? 'सामान्य' : 'General')}</span></td>
                <td class="text-right font-bold text-orange">${formatIndianRupees(e.amount)}</td>
              </tr>
            `
                    )
                    .join('')
            }
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="5" class="text-right font-bold">${d.grandTotal}:</td>
              <td class="text-right font-bold text-orange text-lg">${formatIndianRupees(totalExpSum)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  }
  // 3. INDIVIDUAL CROP PERFORMANCE REPORT
  else if (type === 'crop') {
    const selectedCrop = cropName || (crops[0]?.name ?? 'Crop');
    reportTitle = `${selectedCrop} - ${d.cropReportTitle} (FY ${year})`;
    reportSubtitle = d.cropReportSubtitle;

    const cropObj = crops.find((c) => c.name.toLowerCase() === selectedCrop.toLowerCase());
    const cropLower = selectedCrop.toLowerCase();
    const cropSales = sales.filter((s) => (s.cropName || '').toLowerCase() === cropLower);
    const cropExpenses = expenses.filter((e) => (e.crop || '').toLowerCase() === cropLower);

    const saleSum = cropSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const expSum = cropExpenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = saleSum - expSum;
    const isProfit = netProfit >= 0;
    const roi = expSum > 0 ? ((netProfit / expSum) * 100).toFixed(1) : '100.0';

    contentHtml = `
      <!-- Crop Meta Header Bar -->
      <div class="crop-meta-box">
        <div class="meta-item">
          <span class="meta-lbl">${d.crop}:</span>
          <span class="meta-val font-bold text-lg">${selectedCrop}</span>
        </div>
        <div class="meta-item">
          <span class="meta-lbl">${d.cropArea}:</span>
          <span class="meta-val">${cropObj?.area || '-'}</span>
        </div>
        <div class="meta-item">
          <span class="meta-lbl">${d.sowingDate}:</span>
          <span class="meta-val">${cropObj?.sowingDate || '-'}</span>
        </div>
        <div class="meta-item">
          <span class="meta-lbl">${d.status}:</span>
          <span class="meta-val badge-status">${cropObj?.status || (language === 'mr' ? 'सक्रिय' : 'Active')}</span>
        </div>
      </div>

      <!-- Financial KPI Grid -->
      <div class="kpi-grid">
        <div class="kpi-card highlight-green">
          <div class="kpi-label">${d.totalRevenue}</div>
          <div class="kpi-value">${formatIndianRupees(saleSum)}</div>
          <div class="kpi-sub">${cropSales.length} ${language === 'mr' ? 'विक्री पावत्या' : 'Sales'}</div>
        </div>
        <div class="kpi-card highlight-orange">
          <div class="kpi-label">${d.totalExpenses}</div>
          <div class="kpi-value">${formatIndianRupees(expSum)}</div>
          <div class="kpi-sub">${cropExpenses.length} ${language === 'mr' ? 'खर्च नोंदी' : 'Expenses'}</div>
        </div>
        <div class="kpi-card ${isProfit ? 'highlight-profit' : 'highlight-loss'}">
          <div class="kpi-label">${isProfit ? d.netProfit : d.netLoss}</div>
          <div class="kpi-value ${isProfit ? 'text-green' : 'text-red'}">${formatIndianRupees(Math.abs(netProfit))}</div>
          <div class="kpi-sub">${d.roi}: ${roi}%</div>
        </div>
      </div>

      <!-- 1. Crop Sales Table -->
      <div class="section-title-bar">${d.salesHead}</div>
      <div class="table-container">
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 40px;">${d.srNo}</th>
              <th>${d.date}</th>
              <th>${d.buyerMarket}</th>
              <th style="text-align: right;">${d.quantity}</th>
              <th style="text-align: right;">${d.rate}</th>
              <th style="text-align: right;">${d.amount}</th>
            </tr>
          </thead>
          <tbody>
            ${
              cropSales.length === 0
                ? `<tr><td colspan="6" class="text-center empty-cell">${d.noRecords}</td></tr>`
                : cropSales
                    .map(
                      (s, idx) => `
              <tr>
                <td class="text-center font-bold">${idx + 1}</td>
                <td>${s.date}</td>
                <td>${s.marketName}</td>
                <td class="text-right">${s.quantity} ${s.unit}</td>
                <td class="text-right">${formatIndianRupees(s.pricePerUnit)}</td>
                <td class="text-right font-bold text-green">${formatIndianRupees(s.totalAmount)}</td>
              </tr>
            `
                    )
                    .join('')
            }
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="5" class="text-right font-bold">${d.total} ${d.salesHead}:</td>
              <td class="text-right font-bold text-green">${formatIndianRupees(saleSum)}</td>
            </tr>
          </tfoot>
        </table>
      </div>

      <!-- 2. Crop Expenses Table -->
      <div class="section-title-bar" style="margin-top: 15px;">${d.expensesHead}</div>
      <div class="table-container">
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 40px;">${d.srNo}</th>
              <th>${d.date}</th>
              <th>${d.particulars}</th>
              <th>${d.category}</th>
              <th style="text-align: right;">${d.amount}</th>
            </tr>
          </thead>
          <tbody>
            ${
              cropExpenses.length === 0
                ? `<tr><td colspan="5" class="text-center empty-cell">${d.noRecords}</td></tr>`
                : cropExpenses
                    .map(
                      (e, idx) => `
              <tr>
                <td class="text-center font-bold">${idx + 1}</td>
                <td>${e.date}</td>
                <td class="font-semibold">${e.title}</td>
                <td><span class="category-badge">${translateCategory(e.category, language)}</span></td>
                <td class="text-right font-bold text-orange">${formatIndianRupees(e.amount)}</td>
              </tr>
            `
                    )
                    .join('')
            }
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="4" class="text-right font-bold">${d.total} ${d.expensesHead}:</td>
              <td class="text-right font-bold text-orange">${formatIndianRupees(expSum)}</td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  }
  // 4. COMPREHENSIVE FARM AUDIT & P&L REPORT
  else {
    reportTitle = `${d.farmAuditTitle} (FY ${year})`;
    reportSubtitle = d.farmAuditSubtitle;

    const totalSalesSum = sales.reduce((sum, s) => sum + s.totalAmount, 0);
    const totalExpSum = expenses.reduce((sum, e) => sum + e.amount, 0);
    const netProfit = totalSalesSum - totalExpSum;
    const isProfit = netProfit >= 0;
    const overallRoi = totalExpSum > 0 ? ((netProfit / totalExpSum) * 100).toFixed(1) : '100.0';

    // Crop wise summary table calculation
    const cropSummaries = crops.map((crop) => {
      const cLower = crop.name.toLowerCase();
      const cSales = sales.filter((s) => (s.cropName || '').toLowerCase() === cLower);
      const cExp = expenses.filter((e) => (e.crop || '').toLowerCase() === cLower);
      const cSaleSum = cSales.reduce((sum, s) => sum + s.totalAmount, 0);
      const cExpSum = cExp.reduce((sum, e) => sum + e.amount, 0);
      const cNet = cSaleSum - cExpSum;
      return {
        crop,
        salesSum: cSaleSum,
        expSum: cExpSum,
        netProfit: cNet,
        isProfit: cNet >= 0,
      };
    });

    contentHtml = `
      <!-- Overall Financial Health Box -->
      <div class="kpi-grid">
        <div class="kpi-card highlight-green">
          <div class="kpi-label">${d.totalRevenue}</div>
          <div class="kpi-value">${formatIndianRupees(totalSalesSum)}</div>
          <div class="kpi-sub">${sales.length} ${language === 'mr' ? 'एकूण विक्री व्यवहार' : 'Total sales'}</div>
        </div>
        <div class="kpi-card highlight-orange">
          <div class="kpi-label">${d.totalExpenses}</div>
          <div class="kpi-value">${formatIndianRupees(totalExpSum)}</div>
          <div class="kpi-sub">${expenses.length} ${language === 'mr' ? 'एकूण खर्च नोंदी' : 'Total expenses'}</div>
        </div>
        <div class="kpi-card ${isProfit ? 'highlight-profit' : 'highlight-loss'}">
          <div class="kpi-label">${isProfit ? d.netProfit : d.netLoss}</div>
          <div class="kpi-value ${isProfit ? 'text-green' : 'text-red'}">${formatIndianRupees(Math.abs(netProfit))}</div>
          <div class="kpi-sub">${d.roi}: ${overallRoi}%</div>
        </div>
      </div>

      <!-- Crop-wise Summary Table -->
      <div class="section-title-bar">${d.cropPerformanceSummary}</div>
      <div class="table-container">
        <table class="report-table">
          <thead>
            <tr>
              <th style="width: 40px;">${d.srNo}</th>
              <th>${d.crop}</th>
              <th>${d.cropArea}</th>
              <th>${d.sowingDate}</th>
              <th style="text-align: right;">${d.totalRevenue}</th>
              <th style="text-align: right;">${d.totalExpenses}</th>
              <th style="text-align: right;">${d.netProfit}</th>
            </tr>
          </thead>
          <tbody>
            ${
              cropSummaries.length === 0
                ? `<tr><td colspan="7" class="text-center empty-cell">${d.noRecords}</td></tr>`
                : cropSummaries
                    .map(
                      (item, idx) => `
              <tr>
                <td class="text-center font-bold">${idx + 1}</td>
                <td><span class="crop-badge">${item.crop.name}</span></td>
                <td>${item.crop.area}</td>
                <td>${item.crop.sowingDate}</td>
                <td class="text-right font-semibold text-green">${formatIndianRupees(item.salesSum)}</td>
                <td class="text-right font-semibold text-orange">${formatIndianRupees(item.expSum)}</td>
                <td class="text-right font-bold ${item.isProfit ? 'text-green' : 'text-red'}">
                  ${item.isProfit ? '+' : '-'}${formatIndianRupees(Math.abs(item.netProfit))}
                </td>
              </tr>
            `
                    )
                    .join('')
            }
          </tbody>
          <tfoot>
            <tr class="total-row">
              <td colspan="4" class="text-right font-bold">${d.grandTotal}:</td>
              <td class="text-right font-bold text-green">${formatIndianRupees(totalSalesSum)}</td>
              <td class="text-right font-bold text-orange">${formatIndianRupees(totalExpSum)}</td>
              <td class="text-right font-bold text-lg ${isProfit ? 'text-green' : 'text-red'}">
                ${isProfit ? '+' : '-'}${formatIndianRupees(Math.abs(netProfit))}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    `;
  }

  // Complete HTML document with rich Devanagari typography and standard print CSS
  return `
<!DOCTYPE html>
<html lang="${language}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${reportTitle} - ${d.appTitle}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Mukta:wght@400;500;600;700;800&family=Noto+Sans+Devanagari:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Noto Sans Devanagari', 'Mukta', 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #1F2937;
      background-color: #FFFFFF;
      line-height: 1.45;
      font-size: 13px;
      padding: 16px;
    }
    @page {
      size: A4 portrait;
      margin: 12mm 15mm;
    }
    @media print {
      body {
        padding: 0;
        background: transparent;
      }
      .no-print {
        display: none !important;
      }
      .page-break {
        page-break-after: always;
      }
    }
    .report-wrapper {
      max-width: 840px;
      margin: 0 auto;
      background: #FFFFFF;
      border: 1.5px solid #E5E7EB;
      border-radius: 12px;
      padding: 24px;
      box-shadow: 0 4px 16px rgba(0,0,0,0.06);
    }
    @media print {
      .report-wrapper {
        border: none;
        box-shadow: none;
        padding: 0;
      }
    }

    /* HEADER BANNER */
    .header-banner {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2.5px solid #16A34A;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    .brand-section {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .logo-container {
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-svg {
      width: 52px;
      height: 52px;
      border-radius: 12px;
      box-shadow: 0 3px 8px rgba(22, 163, 74, 0.25);
    }
    .brand-text h1 {
      font-size: 22px;
      font-weight: 800;
      color: #15803D;
      letter-spacing: -0.3px;
      line-height: 1.2;
    }
    .brand-text p {
      font-size: 11.5px;
      color: #4B5563;
      font-weight: 600;
    }
    .meta-tag-section {
      text-align: right;
    }
    .official-badge {
      display: inline-block;
      background: #DCFCE7;
      color: #166534;
      font-size: 10px;
      font-weight: 700;
      padding: 3px 8px;
      border-radius: 6px;
      border: 1px solid #86EFAC;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 4px;
    }
    .meta-tag-section .meta-line {
      font-size: 11px;
      color: #4B5563;
    }
    .meta-tag-section .meta-line strong {
      color: #111827;
    }

    /* TITLE SECTION */
    .title-box {
      text-align: center;
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 12px;
      margin-bottom: 16px;
    }
    .title-box h2 {
      font-size: 18px;
      font-weight: 800;
      color: #111827;
      margin-bottom: 2px;
    }
    .title-box p {
      font-size: 11.5px;
      color: #6B7280;
    }

    /* FARMER INFO GRID */
    .farmer-info-card {
      background: #F0FDF4;
      border: 1.5px solid #BBF7D0;
      border-radius: 8px;
      padding: 12px 16px;
      margin-bottom: 16px;
    }
    .farmer-card-title {
      font-size: 11.5px;
      font-weight: 700;
      color: #166534;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 8px;
      border-bottom: 1px solid #DCFCE7;
      padding-bottom: 4px;
    }
    .farmer-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
    }
    .info-col {
      display: flex;
      flex-direction: column;
    }
    .info-lbl {
      font-size: 10.5px;
      color: #4B5563;
      font-weight: 500;
    }
    .info-val {
      font-size: 12.5px;
      font-weight: 700;
      color: #111827;
    }

    /* CROP META BAR */
    .crop-meta-box {
      display: flex;
      justify-content: space-between;
      background: #ECFDF5;
      border: 1px solid #A7F3D0;
      border-radius: 8px;
      padding: 10px 16px;
      margin-bottom: 16px;
    }
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .meta-lbl {
      font-size: 11px;
      color: #065F46;
      font-weight: 600;
    }
    .meta-val {
      font-size: 12.5px;
      color: #111827;
      font-weight: 600;
    }
    .badge-status {
      background: #10B981;
      color: #FFFFFF;
      padding: 2px 8px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 700;
    }

    /* KPI CARDS */
    .kpi-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
      margin-bottom: 16px;
    }
    .kpi-card {
      background: #F9FAFB;
      border: 1.5px solid #E5E7EB;
      border-radius: 8px;
      padding: 12px;
      text-align: center;
    }
    .kpi-card.highlight-green {
      background: #F0FDF4;
      border-color: #86EFAC;
    }
    .kpi-card.highlight-orange {
      background: #FFFBEB;
      border-color: #FDE68A;
    }
    .kpi-card.highlight-profit {
      background: #ECFDF5;
      border-color: #6EE7B7;
    }
    .kpi-card.highlight-loss {
      background: #FEF2F2;
      border-color: #FECACA;
    }
    .kpi-label {
      font-size: 11px;
      font-weight: 600;
      color: #4B5563;
      margin-bottom: 4px;
    }
    .kpi-value {
      font-size: 20px;
      font-weight: 800;
      color: #111827;
      line-height: 1.2;
    }
    .kpi-sub {
      font-size: 10px;
      color: #6B7280;
      margin-top: 4px;
    }

    /* CATEGORY SUMMARY */
    .category-summary-box {
      background: #F9FAFB;
      border: 1px solid #E5E7EB;
      border-radius: 8px;
      padding: 10px 14px;
      margin-bottom: 16px;
    }
    .box-title {
      font-size: 11px;
      font-weight: 700;
      color: #374151;
      margin-bottom: 6px;
    }
    .category-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .cat-pill {
      background: #FFFFFF;
      border: 1px solid #D1D5DB;
      padding: 4px 8px;
      border-radius: 6px;
      font-size: 11px;
      display: flex;
      gap: 4px;
    }
    .cat-name {
      color: #4B5563;
      font-weight: 600;
    }
    .cat-amt {
      color: #D97706;
      font-weight: 700;
    }
    .cat-pct {
      color: #9CA3AF;
      font-size: 10px;
    }

    /* SECTION BAR */
    .section-title-bar {
      font-size: 12.5px;
      font-weight: 700;
      color: #15803D;
      background: #DCFCE7;
      padding: 6px 12px;
      border-left: 4px solid #16A34A;
      border-radius: 0 6px 6px 0;
      margin-bottom: 8px;
    }

    /* TABLES */
    .table-container {
      margin-bottom: 16px;
      overflow-x: auto;
    }
    .report-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 11.5px;
    }
    .report-table th {
      background: #F3F4F6;
      color: #374151;
      font-weight: 700;
      padding: 8px 10px;
      border: 1px solid #D1D5DB;
      text-align: left;
    }
    .report-table td {
      padding: 7px 10px;
      border: 1px solid #E5E7EB;
      color: #1F2937;
    }
    .report-table tr:nth-child(even) {
      background: #F9FAFB;
    }
    .report-table tr:hover {
      background: #F0FDF4;
    }
    .total-row {
      background: #E5E7EB !important;
      font-weight: 800;
    }
    .total-row td {
      border-top: 2px solid #9CA3AF;
      color: #111827;
      padding: 10px;
    }

    /* BADGES & HELPERS */
    .crop-badge {
      display: inline-block;
      background: #ECFDF5;
      color: #065F46;
      border: 1px solid #A7F3D0;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    .category-badge {
      display: inline-block;
      background: #FEF3C7;
      color: #92400E;
      border: 1px solid #FDE68A;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10.5px;
      font-weight: 600;
    }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-bold { font-weight: 700; }
    .font-semibold { font-weight: 600; }
    .text-green { color: #15803D; }
    .text-orange { color: #D97706; }
    .text-red { color: #DC2626; }
    .text-lg { font-size: 13.5px; }
    .empty-cell {
      padding: 20px !important;
      color: #9CA3AF;
      font-style: italic;
    }

    /* DISCLAIMER FOOTER */
    .cert-box {
      background: #F9FAFB;
      border: 1px dashed #9CA3AF;
      border-radius: 8px;
      padding: 10px 14px;
      margin-top: 20px;
      margin-bottom: 12px;
    }
    .cert-text {
      font-size: 10.5px;
      color: #4B5563;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="report-wrapper">
    <!-- Header Banner -->
    <div class="header-banner">
      <div class="brand-section">
        <div class="logo-container">
          <svg width="50" height="50" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" class="logo-svg">
            <rect width="100" height="100" rx="20" fill="url(#ssLogoGrad)" />
            <circle cx="50" cy="50" r="38" fill="#15803D" opacity="0.25"/>
            <!-- Sprout Plant Logo Icon -->
            <path d="M50 75V44C50 35 42 29 31 29C31 42 39 49 48 49" stroke="#FFFFFF" stroke-width="5" stroke-linecap="round" stroke-linejoin="round" fill="#86EFAC"/>
            <path d="M50 58C57 52 70 48 74 34C61 34 52 43 50 51" stroke="#FFFFFF" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="#DCFCE7"/>
            <circle cx="50" cy="22" r="5" fill="#FEF08A"/>
            <defs>
              <linearGradient id="ssLogoGrad" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
                <stop stop-color="#16A34A"/>
                <stop offset="1" stop-color="#15803D"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <div class="brand-text">
          <h1>${d.appTitle}</h1>
          <p>${d.systemTagline}</p>
        </div>
      </div>
      <div class="meta-tag-section">
        <div class="official-badge">${d.officialStatement}</div>
        <div class="meta-line"><strong>${d.docId}:</strong> ${docNo}</div>
        <div class="meta-line"><strong>${d.financialYear}:</strong> FY ${year}</div>
        <div class="meta-line"><strong>${d.generatedOn}:</strong> ${dateStr}, ${timeStr}</div>
      </div>
    </div>

    <!-- Title Section -->
    <div class="title-box">
      <h2>${reportTitle}</h2>
      <p>${reportSubtitle}</p>
    </div>

    <!-- Farmer Particulars -->
    <div class="farmer-info-card">
      <div class="farmer-card-title">${d.farmerDetails}</div>
      <div class="farmer-grid">
        <div class="info-col">
          <span class="info-lbl">${d.farmerName}:</span>
          <span class="info-val">${farmerName}</span>
        </div>
        <div class="info-col">
          <span class="info-lbl">${d.contactNumber}:</span>
          <span class="info-val">${phone}</span>
        </div>
        <div class="info-col">
          <span class="info-lbl">${d.location}:</span>
          <span class="info-val">${locationStr}</span>
        </div>
        <div class="info-col">
          <span class="info-lbl">${d.landHolding}:</span>
          <span class="info-val">${landArea}</span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    ${contentHtml}

    <!-- Official Certification Box -->
    <div class="cert-box">
      <div class="cert-text">
        <strong>${language === 'mr' ? 'टीप' : language === 'hi' ? 'सूचना' : 'Note'}:</strong>
        ${d.certificationText}
      </div>
    </div>
  </div>
</body>
</html>
  `;
}

/**
 * Downloads or shares the generated PDF report
 */
export async function downloadOrShareReport(
  type: ReportType,
  ctx: ReportContextData
): Promise<{ success: boolean; uri?: string; filename?: string; error?: string }> {
  try {
    // 1. Strict filtering: exclude any deleted/trashed crops and their corresponding records
    const activeCrops = ctx.crops.filter((c: any) => c.status !== 'Deleted' && !c.isDeleted);
    const activeCropNames = new Set(activeCrops.map((c) => c.name.toLowerCase()));

    const activeExpenses = ctx.expenses.filter((e) => {
      if (!e.crop || e.crop.toLowerCase() === 'general') return true;
      return activeCropNames.has(e.crop.toLowerCase());
    });
    const activeSales = ctx.sales.filter((s) => {
      if (!s.cropName) return true;
      return activeCropNames.has(s.cropName.toLowerCase());
    });

    const sanitizedCtx: ReportContextData = {
      ...ctx,
      crops: activeCrops,
      expenses: activeExpenses,
      sales: activeSales,
    };

    const html = buildReportHtml(type, sanitizedCtx);

    // 2. Meaningful filename: SmartShetkari_Report_Date.pdf
    const dateStr = new Date().toISOString().split('T')[0];
    const typeLabelMap: Record<ReportType, string> = {
      sales: 'Sales_Report',
      expenses: 'Expense_Report',
      crop: 'Crop_Report',
      farm_audit: 'Farm_Audit_Report',
    };
    const reportTypePart = typeLabelMap[type] || 'Report';
    const cropPart = sanitizedCtx.cropName ? `${sanitizedCtx.cropName.replace(/\s+/g, '_')}_` : '';
    const cleanFilename = `SmartShetkari_${cropPart}${reportTypePart}_${sanitizedCtx.year}_${dateStr}.pdf`;

    if (Platform.OS === 'web') {
      // For web: Open printable window or create downloadable Blob
      if (typeof window !== 'undefined') {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.open();
          printWindow.document.write(html);
          printWindow.document.close();
          // Give time for fonts & styles to load before print prompt
          setTimeout(() => {
            printWindow.focus();
            printWindow.print();
          }, 450);
          return { success: true, filename: cleanFilename };
        } else {
          // Fallback: trigger HTML download
          const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = cleanFilename.replace('.pdf', '.html');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          return { success: true, filename: cleanFilename };
        }
      }
      return { success: true, filename: cleanFilename };
    }

    // 3. Native (iOS/Android): Lazy-load expo-print and generate complete PDF
    const Print = await getPrintModule();
    const { uri: tempPdfUri } = await Print.printToFileAsync({
      html,
      base64: false,
    });

    if (!tempPdfUri) {
      throw new Error('Failed to generate PDF document on device.');
    }

    // 4. Save PDF with meaningful filename into storage
    const FileSystem = await getFileSystemModule();
    const baseDir = FileSystem.documentDirectory || FileSystem.cacheDirectory;
    const targetFileUri = `${baseDir}${cleanFilename}`;

    try {
      await FileSystem.copyAsync({
        from: tempPdfUri,
        to: targetFileUri,
      });
    } catch {
      await FileSystem.deleteAsync(targetFileUri, { idempotent: true }).catch(() => {});
      await FileSystem.copyAsync({
        from: tempPdfUri,
        to: targetFileUri,
      }).catch(() => {});
    }

    // 5. Ensure PDF file exists and is completely written before opening
    const fileInfo = await FileSystem.getInfoAsync(targetFileUri);
    const validUri = (fileInfo.exists && (!fileInfo.size || fileInfo.size > 0)) ? targetFileUri : tempPdfUri;

    // 6. Automatically open the PDF using the device's default PDF viewer
    const Sharing = await getSharingModule();
    const isSharingAvailable = await Sharing.isAvailableAsync();
    if (isSharingAvailable) {
      await Sharing.shareAsync(validUri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: `${cleanFilename.replace('.pdf', '')}`,
      });
    }

    return { success: true, uri: validUri, filename: cleanFilename };
  } catch (err: any) {
    console.error('Error generating PDF report:', err);
    return { success: false, error: err?.message || 'Failed to generate report PDF.' };
  }
}

/**
 * Direct print trigger
 */
export async function printDirect(type: ReportType, ctx: ReportContextData): Promise<void> {
  const activeCrops = ctx.crops.filter((c: any) => c.status !== 'Deleted' && !c.isDeleted);
  const activeCropNames = new Set(activeCrops.map((c) => c.name.toLowerCase()));
  const activeExpenses = ctx.expenses.filter((e) => {
    if (!e.crop || e.crop.toLowerCase() === 'general') return true;
    return activeCropNames.has(e.crop.toLowerCase());
  });
  const activeSales = ctx.sales.filter((s) => {
    if (!s.cropName) return true;
    return activeCropNames.has(s.cropName.toLowerCase());
  });

  const sanitizedCtx: ReportContextData = {
    ...ctx,
    crops: activeCrops,
    expenses: activeExpenses,
    sales: activeSales,
  };

  const html = buildReportHtml(type, sanitizedCtx);
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.open();
        printWindow.document.write(html);
        printWindow.document.close();
        setTimeout(() => {
          printWindow.focus();
          printWindow.print();
        }, 400);
      }
    }
  } else {
    const Print = await getPrintModule();
    await Print.printAsync({ html });
  }
}
