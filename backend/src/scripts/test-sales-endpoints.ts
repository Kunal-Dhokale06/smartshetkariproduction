import { createApp } from '../app';
import { Server } from 'http';
import { logger } from '../utils/logger';
import { connectDatabase, disconnectDatabase } from '../services/prisma.service';

async function runSaleTests() {
  let server: Server | null = null;
  const PORT = 5058;

  try {
    logger.info('🧪 Starting SmartShetkari Sales CRUD Test Suite...');
    await connectDatabase();

    const app = createApp();
    server = app.listen(PORT);
    const baseUrl = `http://localhost:${PORT}/api/v1`;

    // ─── Step 1: Authenticate ──────────────────────────────────────────────
    logger.info('\n▶ STEP 1: Authenticate Farmer');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: '+919876543210', password: 'Farmer@123' }),
    });
    const loginData: any = await loginRes.json();
    if (!loginData?.data?.token) throw new Error('Login failed: ' + JSON.stringify(loginData));
    const token = loginData.data.token;
    logger.info('✅ Logged in. Token obtained.');

    const authHeaders = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    };

    // ─── Step 2: Create Sale ──────────────────────────────────────────────
    logger.info('\n▶ STEP 2: Create Sale (quantity × pricePerUnit auto-calculates totalAmount)');
    const createRes = await fetch(`${baseUrl}/sales`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        cropName: 'Wheat',
        quantity: 15,
        unit: 'Quintal',
        pricePerUnit: 2800,
        marketName: 'Pune APMC Market',
        paymentStatus: 'Paid',
        date: new Date().toISOString(),
        notes: 'Integration test sale',
      }),
    });
    const createData: any = await createRes.json();
    if (!createData?.data?.id) throw new Error('Create sale failed: ' + JSON.stringify(createData));
    const saleId = createData.data.id;
    const expectedTotal = 15 * 2800;
    if (createData.data.totalAmount !== expectedTotal) {
      throw new Error(`totalAmount mismatch: expected ${expectedTotal} got ${createData.data.totalAmount}`);
    }
    logger.info(`✅ Created sale: ${saleId} — ${createData.data.quantity} Quintal × ₹${createData.data.pricePerUnit} = ₹${createData.data.totalAmount}`);

    // ─── Step 3: List Sales ───────────────────────────────────────────────
    logger.info('\n▶ STEP 3: List Sales');
    const listRes = await fetch(`${baseUrl}/sales`, { method: 'GET', headers: authHeaders });
    const listData: any = await listRes.json();
    if (!Array.isArray(listData?.data?.items)) throw new Error('List sales failed: ' + JSON.stringify(listData));
    logger.info(`✅ Found ${listData.data.count} sale(s). Total: ₹${listData.data.totalAmount}`);

    // ─── Step 4: Get by ID ────────────────────────────────────────────────
    logger.info('\n▶ STEP 4: Get Sale by ID');
    const getRes = await fetch(`${baseUrl}/sales/${saleId}`, { method: 'GET', headers: authHeaders });
    const getData: any = await getRes.json();
    if (getData?.data?.id !== saleId) throw new Error('Get by ID failed: ' + JSON.stringify(getData));
    logger.info(`✅ Got sale: cropName=${getData.data.cropName}, unit=${getData.data.unit}`);

    // ─── Step 5: Update Sale (recalculate totalAmount) ────────────────────
    logger.info('\n▶ STEP 5: Update Sale — change quantity to 20 (totalAmount should be 20×2800=56000)');
    const updateRes = await fetch(`${baseUrl}/sales/${saleId}`, {
      method: 'PUT',
      headers: authHeaders,
      body: JSON.stringify({ quantity: 20, notes: 'Updated by integration test' }),
    });
    const updateData: any = await updateRes.json();
    const expectedUpdatedTotal = 20 * 2800;
    if (updateData?.data?.totalAmount !== expectedUpdatedTotal) {
      throw new Error(`Updated totalAmount mismatch: expected ${expectedUpdatedTotal} got ${updateData?.data?.totalAmount}`);
    }
    logger.info(`✅ Updated: quantity=20, totalAmount=₹${updateData.data.totalAmount} ✓`);

    // ─── Step 6: Yearly Sales Summary ────────────────────────────────────
    logger.info('\n▶ STEP 6: Yearly Summary');
    const year = new Date().getFullYear();
    const summaryRes = await fetch(`${baseUrl}/sales/summary?year=${year}`, { method: 'GET', headers: authHeaders });
    const summaryData: any = await summaryRes.json();
    if (summaryData?.data?.year !== year) throw new Error('Summary failed: ' + JSON.stringify(summaryData));
    logger.info(`✅ ${year} summary: ₹${summaryData.data.totalYearlySales} total sales`);
    logger.info(`   Crop breakdown: ${JSON.stringify(summaryData.data.cropBreakdown)}`);

    // ─── Step 7: Delete Sale ──────────────────────────────────────────────
    logger.info('\n▶ STEP 7: Delete Sale');
    const deleteRes = await fetch(`${baseUrl}/sales/${saleId}`, { method: 'DELETE', headers: authHeaders });
    const deleteData: any = await deleteRes.json();
    if (!deleteData?.success) throw new Error('Delete sale failed: ' + JSON.stringify(deleteData));
    logger.info(`✅ Deleted sale ${saleId}`);

    // ─── Step 8: Confirm 404 ─────────────────────────────────────────────
    logger.info('\n▶ STEP 8: Confirm 404 after delete');
    const check404 = await fetch(`${baseUrl}/sales/${saleId}`, { method: 'GET', headers: authHeaders });
    if (check404.status !== 404) throw new Error(`Expected 404 but got ${check404.status}`);
    logger.info('✅ Confirmed 404 — sale no longer exists');

    logger.info('\n🎉 All 8 Sales API tests PASSED!\n');
  } catch (err) {
    logger.error('❌ Test failed:', err);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
    if (server) server.close();
  }
}

runSaleTests();
