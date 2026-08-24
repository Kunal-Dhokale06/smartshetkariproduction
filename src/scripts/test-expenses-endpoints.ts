import { createApp } from '../app';
import { Server } from 'http';
import { logger } from '../utils/logger';
import { connectDatabase, disconnectDatabase } from '../services/prisma.service';

async function runExpenseTests() {
  let server: Server | null = null;
  const PORT = 5057;

  try {
    logger.info('🧪 Starting SmartShetkari Expenses CRUD Test Suite...');
    await connectDatabase();

    const app = createApp();
    server = app.listen(PORT);
    const baseUrl = `http://localhost:${PORT}/api/v1`;

    // ----- STEP 1: Authenticate -----
    logger.info('\n▶ STEP 1: Authenticate Farmer (+919876543210)');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: '+919876543210', password: 'Farmer@123' }),
    });
    const loginData: any = await loginRes.json();
    if (!loginData?.data?.token) {
      throw new Error('Login failed: ' + JSON.stringify(loginData));
    }
    const token = loginData.data.token;
    logger.info('✅ Logged in. Token obtained.');

    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // ----- STEP 2: Create Expense -----
    logger.info('\n▶ STEP 2: Create Expense');
    const createRes = await fetch(`${baseUrl}/expenses`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        title: 'Integration Test Fertilizer',
        amount: 5000,
        category: 'Fertilizer',
        date: new Date().toISOString(),
        paymentMode: 'Cash',
        crop: 'Wheat',
        notes: 'Automated expense test',
      }),
    });
    const createData: any = await createRes.json();
    if (!createData?.data?.id) {
      throw new Error('Create expense failed: ' + JSON.stringify(createData));
    }
    const expenseId = createData.data.id;
    logger.info(`✅ Created expense: ${expenseId} — "${createData.data.title}" ₹${createData.data.amount}`);

    // ----- STEP 3: List Expenses -----
    logger.info('\n▶ STEP 3: List Expenses');
    const listRes = await fetch(`${baseUrl}/expenses`, { method: 'GET', headers: authHeaders });
    const listData: any = await listRes.json();
    if (!Array.isArray(listData?.data?.items)) {
      throw new Error('List expenses failed: ' + JSON.stringify(listData));
    }
    logger.info(`✅ Found ${listData.data.count} expense(s). Total: ₹${listData.data.totalAmount}`);

    // ----- STEP 4: Get by ID -----
    logger.info('\n▶ STEP 4: Get Expense by ID');
    const getRes = await fetch(`${baseUrl}/expenses/${expenseId}`, { method: 'GET', headers: authHeaders });
    const getData: any = await getRes.json();
    if (getData?.data?.id !== expenseId) {
      throw new Error('Get by ID failed: ' + JSON.stringify(getData));
    }
    logger.info(`✅ Got expense: "${getData.data.title}"`);

    // ----- STEP 5: Update Expense -----
    logger.info('\n▶ STEP 5: Update Expense');
    const updateRes = await fetch(`${baseUrl}/expenses/${expenseId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ amount: 7500, notes: 'Updated by integration test' }),
    });
    const updateData: any = await updateRes.json();
    if (updateData?.data?.amount !== 7500) {
      throw new Error('Update expense failed: ' + JSON.stringify(updateData));
    }
    logger.info(`✅ Updated amount to ₹${updateData.data.amount}`);

    // ----- STEP 6: Expense Summary -----
    logger.info('\n▶ STEP 6: Expense Summary');
    const year = new Date().getFullYear();
    const summaryRes = await fetch(`${baseUrl}/expenses/summary?year=${year}`, { method: 'GET', headers: authHeaders });
    const summaryData: any = await summaryRes.json();
    if (summaryData?.data?.year !== year) {
      throw new Error('Summary failed: ' + JSON.stringify(summaryData));
    }
    logger.info(`✅ Yearly summary ${year}: ₹${summaryData.data.totalYearlyExpense} total`);
    logger.info(`   Category breakdown: ${JSON.stringify(summaryData.data.categoryBreakdown)}`);

    // ----- STEP 7: Delete Expense -----
    logger.info('\n▶ STEP 7: Delete Expense');
    const deleteRes = await fetch(`${baseUrl}/expenses/${expenseId}`, { method: 'DELETE', headers: authHeaders });
    const deleteData: any = await deleteRes.json();
    if (!deleteData?.success) {
      throw new Error('Delete expense failed: ' + JSON.stringify(deleteData));
    }
    logger.info(`✅ Deleted expense ${expenseId}`);

    // ----- STEP 8: Confirm 404 -----
    logger.info('\n▶ STEP 8: Confirm 404 after delete');
    const check404Res = await fetch(`${baseUrl}/expenses/${expenseId}`, { method: 'GET', headers: authHeaders });
    if (check404Res.status !== 404) {
      throw new Error(`Expected 404 but got ${check404Res.status}`);
    }
    logger.info(`✅ Confirmed 404 — expense no longer exists`);

    logger.info('\n🎉 All 8 Expense CRUD tests PASSED!\n');
  } catch (err) {
    logger.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
    if (server) server.close();
  }
}

runExpenseTests();
