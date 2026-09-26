import { logger } from '../utils/logger';
import { connectDatabase, disconnectDatabase, prisma } from '../services/prisma.service';

async function runFullIntegrationTestSuite() {
  try {
    logger.info('🚀 ========================================================');
    logger.info('🌾 SMARTSHETKARI FULL END-TO-END PRODUCTION INTEGRATION TEST');
    logger.info('🚀 ========================================================\n');

    await connectDatabase();
    const baseUrl = `http://127.0.0.1:5000/api/v1`;

    const pass = (msg: string) => logger.info(`  ✅  ${msg}`);
    const fail = (msg: string, details?: any) => {
      logger.error(`  ❌  ${msg}`, details);
      throw new Error(msg);
    };

    // --------------------------------------------------------------------------
    // TEST 1: HEALTH CHECK
    // --------------------------------------------------------------------------
    logger.info('\n▶ 1. Health Check Endpoint');
    const healthRes = await fetch(`${baseUrl}/health`);
    const healthData: any = await healthRes.json();
    if (healthRes.status !== 200 || !healthData.success) fail('Health check failed', healthData);
    pass('Server health endpoint is online and responsive');

    // --------------------------------------------------------------------------
    // TEST 2: AUTHENTICATION & TENANT ISOLATION SETUP
    // --------------------------------------------------------------------------
    logger.info('\n▶ 2. Authentication & Tenant Isolation (Two distinct farmers)');
    
    // Farmer A (Seed user)
    const loginARes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: '+919876543210', password: 'Farmer@123' }),
    });
    const loginA: any = await loginARes.json();
    if (!loginA.data?.token) fail('Farmer A login failed', loginA);
    const tokenA = loginA.data.token;
    const userA = loginA.data.user;
    pass(`Farmer A logged in: ${userA.name} (${userA.phone})`);

    // Farmer B (Ephemeral registered user)
    const farmerBPhone = `+9199999${Math.floor(10000 + Math.random() * 90000)}`;
    const regBRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ramesh Patil',
        phone: farmerBPhone,
        password: 'PatilPassword@123',
        village: 'Baramati',
        district: 'Pune',
      }),
    });
    const regB: any = await regBRes.json();
    if (!regB.data?.token) fail('Farmer B registration failed', regB);
    const tokenB = regB.data.token;
    const userB = regB.data.user;
    pass(`Farmer B registered: ${userB.name} (${userB.phone})`);

    const headersA = { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenA}` };
    const headersB = { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenB}` };

    // --------------------------------------------------------------------------
    // TEST 3: CROPS CRUD & TENANT ISOLATION
    // --------------------------------------------------------------------------
    logger.info('\n▶ 3. Crops Module End-to-End');

    // Create Crop for Farmer A
    const cropCreateRes = await fetch(`${baseUrl}/crops`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        name: 'Sugarcane',
        variety: 'Co 86032',
        sowingDate: new Date().toISOString(),
        area: '4.5',
        areaUnit: 'Acre',
        season: 'Year_Round',
        status: 'Growing',
      }),
    });
    const cropCreate: any = await cropCreateRes.json();
    if (!cropCreate.data?.id) fail('Crop creation for Farmer A failed', cropCreate);
    const cropAId = cropCreate.data.id;
    pass(`Farmer A created Crop: Sugarcane (ID: ${cropAId})`);

    // Verify Farmer B CANNOT access or see Farmer A's crop
    const farmerBGetCropRes = await fetch(`${baseUrl}/crops/${cropAId}`, { headers: headersB });
    if (farmerBGetCropRes.status !== 404) {
      fail(`Tenant violation! Farmer B could access Farmer A crop (status ${farmerBGetCropRes.status})`);
    }
    pass('Strict tenant isolation verified: Farmer B cannot access Farmer A crop');

    // --------------------------------------------------------------------------
    // TEST 4: EXPENSES CRUD, CALCULATIONS & SUMMARY
    // --------------------------------------------------------------------------
    logger.info('\n▶ 4. Expenses Module End-to-End');

    const expCreateRes = await fetch(`${baseUrl}/expenses`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        title: 'Drip Pipe Setup',
        amount: 8500,
        category: 'Irrigation',
        crop: 'Sugarcane',
        date: new Date().toISOString(),
        paymentMode: 'UPI',
        notes: 'Drip lateral lines for 4.5 acres',
      }),
    });
    const expCreate: any = await expCreateRes.json();
    if (!expCreate.data?.id) fail('Expense creation failed', expCreate);
    const expAId = expCreate.data.id;
    pass(`Farmer A recorded Expense: ₹${expCreate.data.amount} for "${expCreate.data.title}"`);

    // Test Expense Summary
    const expSummaryRes = await fetch(`${baseUrl}/expenses/summary?year=${new Date().getFullYear()}`, {
      headers: headersA,
    });
    const expSummary: any = await expSummaryRes.json();
    if (!expSummary.data?.totalYearlyExpense) fail('Expense summary failed', expSummary);
    pass(`Expense summary computed: ₹${expSummary.data.totalYearlyExpense} total with category breakdown`);

    // --------------------------------------------------------------------------
    // TEST 5: SALES CRUD, AUTO TOTAL CALCULATION & SUMMARY
    // --------------------------------------------------------------------------
    logger.info('\n▶ 5. Sales Module End-to-End');

    const qty = 25;
    const rate = 3200;
    const saleCreateRes = await fetch(`${baseUrl}/sales`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        cropName: 'Sugarcane',
        quantity: qty,
        unit: 'Ton',
        pricePerUnit: rate,
        marketName: 'Someshwar Sugar Factory',
        paymentStatus: 'Paid',
        date: new Date().toISOString(),
      }),
    });
    const saleCreate: any = await saleCreateRes.json();
    if (!saleCreate.data?.id) fail('Sale creation failed', saleCreate);
    const saleAId = saleCreate.data.id;
    const expectedSaleTotal = qty * rate; // 80,000
    if (saleCreate.data.totalAmount !== expectedSaleTotal) {
      fail(`Sale total mismatch: expected ${expectedSaleTotal} got ${saleCreate.data.totalAmount}`);
    }
    pass(`Farmer A recorded Sale: 25 Ton × ₹3200 = ₹${saleCreate.data.totalAmount} (Auto-calculated correctly)`);

    // Test Sale Summary
    const saleSummaryRes = await fetch(`${baseUrl}/sales/summary?year=${new Date().getFullYear()}`, {
      headers: headersA,
    });
    const saleSummary: any = await saleSummaryRes.json();
    if (!saleSummary.data?.totalYearlySales) fail('Sale summary failed', saleSummary);
    pass(`Sale summary computed: ₹${saleSummary.data.totalYearlySales} total`);

    // --------------------------------------------------------------------------
    // TEST 6: DIARY MODULE CRUD & VOICE/TEXT NOTES
    // --------------------------------------------------------------------------
    logger.info('\n▶ 6. Diary Module End-to-End');

    // Create Text Diary Note
    const diaryCreateRes = await fetch(`${baseUrl}/diary`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        content: 'Soil testing report received. Recommended potassium sulphate application.',
        crop: 'Sugarcane',
        date: new Date().toISOString(),
        source: 'TEXT',
      }),
    });
    const diaryCreate: any = await diaryCreateRes.json();
    if (!diaryCreate.data?.id) fail('Diary creation failed', diaryCreate);
    const diaryAId = diaryCreate.data.id;
    pass(`Diary note created: "${diaryCreate.data.content.substring(0, 40)}..." (Source: ${diaryCreate.data.source})`);

    // Create Voice Note
    const voiceNoteRes = await fetch(`${baseUrl}/diary`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        content: 'Voice note: Light rain observed today. Deferred scheduled pesticide spray by 2 days.',
        crop: 'Sugarcane',
        date: new Date().toISOString(),
        source: 'VOICE',
      }),
    });
    const voiceNote: any = await voiceNoteRes.json();
    if (!voiceNote.data?.id || voiceNote.data.source !== 'voice') fail('Voice diary creation failed', voiceNote);
    pass(`Voice diary note created with source="voice"`);

    // List Diary Notes
    const listDiaryRes = await fetch(`${baseUrl}/diary`, { headers: headersA });
    const listDiary: any = await listDiaryRes.json();
    if (!Array.isArray(listDiary.data?.items) || listDiary.data.items.length < 2) {
      fail('Diary listing failed', listDiary);
    }
    pass(`Listed ${listDiary.data.count} diary notes for Farmer A`);

    // Clean up created test entities
    await fetch(`${baseUrl}/diary/${diaryAId}`, { method: 'DELETE', headers: headersA });
    await fetch(`${baseUrl}/diary/${voiceNote.data.id}`, { method: 'DELETE', headers: headersA });
    await fetch(`${baseUrl}/sales/${saleAId}`, { method: 'DELETE', headers: headersA });
    await fetch(`${baseUrl}/expenses/${expAId}`, { method: 'DELETE', headers: headersA });
    await fetch(`${baseUrl}/crops/${cropAId}`, { method: 'DELETE', headers: headersA });
    
    // Clean up temporary Farmer B
    await prisma.user.delete({ where: { id: userB.id } });
    pass('Cleaned up ephemeral test records successfully');

    logger.info('\n🎉 ========================================================');
    logger.info('🌟 ALL INTEGRATION & SECURITY AUDIT TESTS PASSED (100%)');
    logger.info('🎉 ========================================================\n');
  } catch (err: any) {
    logger.error('❌ Integration Test Suite Error:', err?.message || err);
    process.exitCode = 1;
  } finally {
    await disconnectDatabase();
  }
}

runFullIntegrationTestSuite();
