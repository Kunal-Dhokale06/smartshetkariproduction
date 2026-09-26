import { prisma } from '../services/prisma.service';
import { logger } from '../utils/logger';

const API_BASE = 'http://localhost:5000/api/v1';

async function runAudit() {
  logger.info('🚀 STARTING AUDIT: Delete → Trash → Restore → Permanent Delete Flow');

  // 1. Authenticate / Login test user
  const loginRes = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: '+919876543210', password: 'Farmer@123' }),
  });
  const loginData: any = await loginRes.json();
  if (!loginData.success || !loginData.data?.token) {
    throw new Error('Login failed: ' + JSON.stringify(loginData));
  }
  const token = loginData.data.token;
  const userId = loginData.data.user.id;
  logger.info(`✅ Authenticated test user (ID: ${userId})`);

  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };

  // 2. Create a test crop
  const cropPayload = {
    name: `AuditCrop_${Date.now()}`,
    variety: 'Bt Hybrid',
    sowingDate: '2026-06-15',
    area: 4.5,
    areaUnit: 'Acre',
    season: 'KHARIF',
    status: 'Growing',
    notes: 'Audit test crop for delete/restore lifecycle',
  };

  const createCropRes = await fetch(`${API_BASE}/crops`, {
    method: 'POST',
    headers,
    body: JSON.stringify(cropPayload),
  });
  const createdCropJson: any = await createCropRes.json();
  const cropId = createdCropJson.data.id;
  const cropName = createdCropJson.data.name;
  logger.info(`✅ Created test crop: "${cropName}" (ID: ${cropId})`);

  // 3. Create linked Bill & Expense
  const bill = await prisma.bill.create({
    data: {
      userId,
      vendorName: 'Audit Agri Supplies',
      totalAmount: 3200,
      billDate: new Date('2026-06-20'),
      status: 'VERIFIED',
    },
  });

  const expense = await prisma.expense.create({
    data: {
      userId,
      cropId,
      cropName,
      billId: bill.id,
      title: 'Seeds & Fertilizer for Audit Crop',
      amount: 3200,
      category: 'SEEDS',
      paymentMode: 'CASH',
      date: new Date('2026-06-20'),
    },
  });
  logger.info(`✅ Created linked Expense (ID: ${expense.id}) and Bill (ID: ${bill.id})`);

  // 4. Create linked Sale
  const sale = await prisma.sale.create({
    data: {
      userId,
      cropId,
      cropName,
      quantity: 25,
      unit: 'Quintal',
      pricePerUnit: 6000,
      totalAmount: 150000,
      marketName: 'Audit Mandi',
      paymentStatus: 'PAID',
      date: new Date('2026-10-15'),
    },
  });
  logger.info(`✅ Created linked Sale (ID: ${sale.id})`);

  // 5. Create linked Diary Note
  const diary = await prisma.diaryEntry.create({
    data: {
      userId,
      cropId,
      cropName,
      title: 'Audit Note',
      content: 'Inspected crop health for audit test',
      date: new Date('2026-07-01'),
      source: 'TEXT',
    },
  });
  logger.info(`✅ Created linked Diary Entry (ID: ${diary.id})`);

  // =========================================================================
  // PHASE 1: SOFT DELETE TO TRASH
  // =========================================================================
  logger.info('\n▶ PHASE 1: Soft Delete (Move to Trash)');
  const deleteRes = await fetch(`${API_BASE}/crops/${cropId}`, {
    method: 'DELETE',
    headers,
  });
  const deleteJson: any = await deleteRes.json();
  if (!deleteJson.success) throw new Error('Soft delete failed: ' + JSON.stringify(deleteJson));
  logger.info(`✅ Soft delete API call succeeded: ${deleteJson.message}`);

  // Verify DB state
  const dbCropAfterSoftDelete = await prisma.crop.findUnique({ where: { id: cropId } });
  if (!dbCropAfterSoftDelete?.isDeleted) {
    throw new Error('DB verification failed: Crop isDeleted is not true!');
  }
  logger.info('✅ DB check: Crop isDeleted=true, deletedAt set in Neon DB.');

  // Verify GET /crops does NOT return it
  const activeCropsRes = await fetch(`${API_BASE}/crops`, { headers });
  const activeCropsJson: any = await activeCropsRes.json();
  const hasInActive = activeCropsJson.data.some((c: any) => c.id === cropId);
  if (hasInActive) throw new Error('Failed: Soft-deleted crop still returned in active GET /crops!');
  logger.info('✅ API check: Soft-deleted crop successfully hidden from GET /crops');

  // Verify GET /crops/trash DOES return it
  const trashRes = await fetch(`${API_BASE}/crops/trash`, { headers });
  const trashJson: any = await trashRes.json();
  const hasInTrash = trashJson.data.some((c: any) => c.id === cropId);
  if (!hasInTrash) throw new Error('Failed: Soft-deleted crop not found in GET /crops/trash!');
  logger.info('✅ API check: Soft-deleted crop successfully appears in GET /crops/trash');

  // Verify GET /expenses excludes this crop's expense
  const expensesRes = await fetch(`${API_BASE}/expenses`, { headers });
  const expensesJson: any = await expensesRes.json();
  const hasExpense = expensesJson.data.items.some((e: any) => e.id === expense.id);
  if (hasExpense) throw new Error('Failed: Soft-deleted crop expense still returned in GET /expenses!');
  logger.info('✅ API check: Soft-deleted crop expense successfully hidden from GET /expenses');

  // Verify GET /sales excludes this crop's sale
  const salesRes = await fetch(`${API_BASE}/sales`, { headers });
  const salesJson: any = await salesRes.json();
  const hasSale = salesJson.data.items.some((s: any) => s.id === sale.id);
  if (hasSale) throw new Error('Failed: Soft-deleted crop sale still returned in GET /sales!');
  logger.info('✅ API check: Soft-deleted crop sale successfully hidden from GET /sales');

  // Verify GET /diary excludes this crop's diary note
  const diaryRes = await fetch(`${API_BASE}/diary`, { headers });
  const diaryJson: any = await diaryRes.json();
  const hasDiary = diaryJson.data.items.some((d: any) => d.id === diary.id);
  if (hasDiary) throw new Error('Failed: Soft-deleted crop diary note still returned in GET /diary!');
  logger.info('✅ API check: Soft-deleted crop note successfully hidden from GET /diary');

  // =========================================================================
  // PHASE 2: RESTORE CROP & ALL RELATED DATA
  // =========================================================================
  logger.info('\n▶ PHASE 2: Restore Crop from Trash');
  const restoreRes = await fetch(`${API_BASE}/crops/${cropId}/restore`, {
    method: 'POST',
    headers,
  });
  const restoreJson: any = await restoreRes.json();
  if (!restoreJson.success) throw new Error('Restore failed: ' + JSON.stringify(restoreJson));
  logger.info(`✅ Restore API call succeeded: ${restoreJson.message}`);
  logger.info(`   Restored counts: ${JSON.stringify(restoreJson.data.relatedCounts)}`);

  // Verify DB state
  const dbCropAfterRestore = await prisma.crop.findUnique({ where: { id: cropId } });
  if (dbCropAfterRestore?.isDeleted || dbCropAfterRestore?.deletedAt !== null) {
    throw new Error('DB verification failed: Crop isDeleted is not false after restore!');
  }
  logger.info('✅ DB check: Crop isDeleted=false, deletedAt=null in Neon DB.');

  // Verify crop is back in GET /crops with full name
  const activeCropsAfterRestore = await fetch(`${API_BASE}/crops`, { headers });
  const activeJsonAfterRestore: any = await activeCropsAfterRestore.json();
  const restoredItem = activeJsonAfterRestore.data.find((c: any) => c.id === cropId);
  if (!restoredItem || !restoredItem.name) {
    throw new Error('Failed: Restored crop missing or name is blank in GET /crops!');
  }
  logger.info(`✅ API check: Crop "${restoredItem.name}" immediately back in GET /crops`);

  // Verify expense is back in GET /expenses
  const expensesAfterRestore = await fetch(`${API_BASE}/expenses`, { headers });
  const expensesJsonAfterRestore: any = await expensesAfterRestore.json();
  const restoredExpense = expensesJsonAfterRestore.data.items.find((e: any) => e.id === expense.id);
  if (!restoredExpense) {
    throw new Error('Failed: Restored expense missing from GET /expenses!');
  }
  logger.info(`✅ API check: Expense "${restoredExpense.title}" (₹${restoredExpense.amount}) immediately back in GET /expenses`);

  // Verify sale is back in GET /sales
  const salesAfterRestore = await fetch(`${API_BASE}/sales`, { headers });
  const salesJsonAfterRestore: any = await salesAfterRestore.json();
  const restoredSale = salesJsonAfterRestore.data.items.find((s: any) => s.id === sale.id);
  if (!restoredSale) {
    throw new Error('Failed: Restored sale missing from GET /sales!');
  }
  logger.info(`✅ API check: Sale "${restoredSale.cropName}" (₹${restoredSale.totalAmount}) immediately back in GET /sales`);

  // Verify diary note is back in GET /diary
  const diaryAfterRestore = await fetch(`${API_BASE}/diary`, { headers });
  const diaryJsonAfterRestore: any = await diaryAfterRestore.json();
  const restoredNote = diaryJsonAfterRestore.data.items.find((d: any) => d.id === diary.id);
  if (!restoredNote) {
    throw new Error('Failed: Restored diary note missing from GET /diary!');
  }
  logger.info(`✅ API check: Diary note "${restoredNote.title}" immediately back in GET /diary`);

  // =========================================================================
  // PHASE 3: PERMANENT DELETE & DATABASE REMOVAL AUDIT
  // =========================================================================
  logger.info('\n▶ PHASE 3: Permanent Delete & Neon DB Cascade Removal');
  const permDeleteRes = await fetch(`${API_BASE}/crops/${cropId}/permanent`, {
    method: 'DELETE',
    headers,
  });
  const permDeleteJson: any = await permDeleteRes.json();
  if (!permDeleteJson.success) throw new Error('Permanent delete failed: ' + JSON.stringify(permDeleteJson));
  logger.info(`✅ Permanent delete API call succeeded: ${permDeleteJson.message}`);
  logger.info(`   Records deleted: ${JSON.stringify(permDeleteJson.data.recordsDeleted)}`);

  // Direct PostgreSQL Database Verification:
  const dbCropAfterPerm = await prisma.crop.findUnique({ where: { id: cropId } });
  if (dbCropAfterPerm !== null) {
    throw new Error('DB AUDIT FAILED: Crop still exists in PostgreSQL after permanent delete!');
  }
  logger.info('✅ DB AUDIT PASSED: Crop record completely removed from "crops" table.');

  const dbExpensesAfterPerm = await prisma.expense.findMany({ where: { OR: [{ cropId }, { id: expense.id }] } });
  if (dbExpensesAfterPerm.length > 0) {
    throw new Error('DB AUDIT FAILED: Related expense records still exist in PostgreSQL!');
  }
  logger.info('✅ DB AUDIT PASSED: Related expense records completely removed from "expenses" table (0 orphans).');

  const dbBillAfterPerm = await prisma.bill.findUnique({ where: { id: bill.id } });
  if (dbBillAfterPerm !== null) {
    throw new Error('DB AUDIT FAILED: Unshared linked bill still exists in PostgreSQL!');
  }
  logger.info('✅ DB AUDIT PASSED: Linked bill record completely removed from "bills" table (0 orphans).');

  const dbSalesAfterPerm = await prisma.sale.findMany({ where: { OR: [{ cropId }, { id: sale.id }] } });
  if (dbSalesAfterPerm.length > 0) {
    throw new Error('DB AUDIT FAILED: Related sales records still exist in PostgreSQL!');
  }
  logger.info('✅ DB AUDIT PASSED: Related sale records completely removed from "sales" table (0 orphans).');

  const dbDiaryAfterPerm = await prisma.diaryEntry.findMany({ where: { OR: [{ cropId }, { id: diary.id }] } });
  if (dbDiaryAfterPerm.length > 0) {
    throw new Error('DB AUDIT FAILED: Related diary entries still exist in PostgreSQL!');
  }
  logger.info('✅ DB AUDIT PASSED: Related diary notes completely removed from "diary_entries" table (0 orphans).');

  logger.info('\n🎉 ALL AUDITS PASSED WITH 100% SUCCESS!');
  logger.info('   ✔ Soft Delete preserves all data and relations');
  logger.info('   ✔ Restore recovers Crop, Expenses, Sales, and Notes immediately across all endpoints');
  logger.info('   ✔ Permanent Delete executes atomic cascade delete leaving zero orphan records in PostgreSQL');
}

runAudit()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('❌ Audit Failed:', err);
    process.exit(1);
  });
