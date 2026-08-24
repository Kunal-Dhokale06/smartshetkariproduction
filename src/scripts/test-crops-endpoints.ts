import { createApp } from '../app';
import { Server } from 'http';
import { logger } from '../utils/logger';
import { connectDatabase, disconnectDatabase } from '../services/prisma.service';

async function runCropTests() {
  let server: Server | null = null;
  const PORT = 5056;

  try {
    logger.info('🧪 Starting SmartShetkari Crops CRUD Test Suite...');
    await connectDatabase();

    const app = createApp();
    server = app.listen(PORT);
    const baseUrl = `http://localhost:${PORT}/api/v1`;

    // 1. Authenticate as seeded farmer Kunal
    logger.info('\n▶ STEP 1: Authenticate Farmer (+919876543210)');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: '+919876543210',
        password: 'Farmer@123',
      }),
    });
    const loginData: any = await loginRes.json();
    const token = loginData.data.token;
    logger.info(`✅ Logged in successfully. Token obtained.`);

    // 2. LIST Crops
    logger.info('\n▶ TEST 1: LIST Crops (GET /api/v1/crops)');
    const listRes = await fetch(`${baseUrl}/crops`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const listData: any = await listRes.json();
    if (!listRes.ok || !Array.isArray(listData.data)) {
      throw new Error(`List crops failed: ${JSON.stringify(listData)}`);
    }
    logger.info(`✅ Successfully listed ${listData.data.length} crops from Neon DB.`);
    listData.data.forEach((c: any) => {
      logger.info(`   - Crop: ${c.name} | Area: ${c.area} | Status: ${c.status} | Sowing: ${c.sowingDate}`);
    });

    // 3. CREATE Crop
    logger.info('\n▶ TEST 2: CREATE Crop (POST /api/v1/crops)');
    const createRes = await fetch(`${baseUrl}/crops`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name: 'Soybean',
        variety: 'JS 335',
        sowingDate: '2026-06-15',
        area: 2.5,
        areaUnit: 'Acre',
        season: 'KHARIF',
        status: 'Growing',
        iconName: 'sprout',
        notes: 'Pre-monsoon soil preparation done.',
      }),
    });
    const createData: any = await createRes.json();
    if (!createRes.ok || !createData.data?.id) {
      throw new Error(`Create crop failed: ${JSON.stringify(createData)}`);
    }
    const createdCropId = createData.data.id;
    logger.info(`✅ Crop Created! ID: ${createdCropId} | Name: ${createData.data.name} | Area: ${createData.data.area}`);

    // 4. GET Crop by ID
    logger.info(`\n▶ TEST 3: GET Crop Details (GET /api/v1/crops/${createdCropId})`);
    const getRes = await fetch(`${baseUrl}/crops/${createdCropId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const getData: any = await getRes.json();
    if (!getRes.ok || getData.data?.name !== 'Soybean') {
      throw new Error(`Get crop failed: ${JSON.stringify(getData)}`);
    }
    logger.info(`✅ Crop retrieved successfully! Variety: ${getData.data.variety}, Area: ${getData.data.area}`);

    // 5. UPDATE Crop
    logger.info(`\n▶ TEST 4: UPDATE Crop (PUT /api/v1/crops/${createdCropId})`);
    const updateRes = await fetch(`${baseUrl}/crops/${createdCropId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        area: 3.0,
        status: 'Harvested',
        notes: 'Harvested successfully with good yield.',
      }),
    });
    const updateData: any = await updateRes.json();
    if (!updateRes.ok || updateData.data?.status !== 'Harvested') {
      throw new Error(`Update crop failed: ${JSON.stringify(updateData)}`);
    }
    logger.info(`✅ Crop Updated! New Area: ${updateData.data.area}, New Status: ${updateData.data.status}`);

    // 6. DELETE Crop
    logger.info(`\n▶ TEST 5: DELETE Crop (DELETE /api/v1/crops/${createdCropId})`);
    const deleteRes = await fetch(`${baseUrl}/crops/${createdCropId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const deleteData: any = await deleteRes.json();
    if (!deleteRes.ok) {
      throw new Error(`Delete crop failed: ${JSON.stringify(deleteData)}`);
    }
    logger.info(`✅ Crop Deleted! Message: ${deleteData.message}`);

    logger.info('\n🎉 ALL 5 CROPS CRUD ENDPOINTS PASSED WITH 100% SUCCESS ON NEON POSTGRESQL!');
  } catch (error: any) {
    logger.error('❌ Crops test failed:', error.message);
    process.exit(1);
  } finally {
    if (server) server.close();
    await disconnectDatabase();
  }
}

runCropTests();
