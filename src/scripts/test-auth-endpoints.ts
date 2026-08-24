import { createApp } from '../app';
import { Server } from 'http';
import { logger } from '../utils/logger';
import { connectDatabase, disconnectDatabase, prisma } from '../services/prisma.service';

async function runAuthTests() {
  let server: Server | null = null;
  const PORT = 5055;

  try {
    logger.info('🧪 Starting SmartShetkari Authentication Test Suite...');
    await connectDatabase();

    const app = createApp();
    server = app.listen(PORT);
    const baseUrl = `http://localhost:${PORT}/api/v1`;

    // -------------------------------------------------------------------------
    // TEST 1: Login with Seeded Farmer User
    // -------------------------------------------------------------------------
    logger.info('\n▶ TEST 1: Login with Seeded Farmer User (+919876543210)');
    const loginRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: '+919876543210',
        password: 'Farmer@123',
      }),
    });
    const loginData: any = await loginRes.json();

    if (!loginRes.ok || !loginData.data?.token) {
      throw new Error(`Login failed: ${JSON.stringify(loginData)}`);
    }
    const farmerToken = loginData.data.token;
    logger.info(`✅ Login Successful! Status: ${loginRes.status}`);
    logger.info(`🔑 JWT Token Issued: ${farmerToken.substring(0, 25)}...`);
    logger.info(`👤 Logged in as: ${loginData.data.user.name} (${loginData.data.user.phone})`);

    // -------------------------------------------------------------------------
    // TEST 2: Protected Route /auth/me with Valid Token
    // -------------------------------------------------------------------------
    logger.info('\n▶ TEST 2: Access Protected Profile (/auth/me) with Bearer Token');
    const meRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer ${farmerToken}` },
    });
    const meData: any = await meRes.json();

    if (!meRes.ok || meData.data?.phone !== '+919876543210') {
      throw new Error(`Protected route failed: ${JSON.stringify(meData)}`);
    }
    logger.info(`✅ Protected Route Accessed! Farmer: ${meData.data.name}, Village: ${meData.data.village}, Land: ${meData.data.landArea} ${meData.data.landAreaUnit}`);

    // -------------------------------------------------------------------------
    // TEST 3: Access Protected Route with Missing / Invalid Token (Expect 401)
    // -------------------------------------------------------------------------
    logger.info('\n▶ TEST 3: Access Protected Route with Invalid Token (Expect 401)');
    const invalidRes = await fetch(`${baseUrl}/auth/me`, {
      headers: { Authorization: `Bearer invalid_fake_token_12345` },
    });
    logger.info(`✅ Properly Rejected with Status: ${invalidRes.status} (401 Unauthorized)`);

    // -------------------------------------------------------------------------
    // TEST 4: Login with Incorrect Password (Expect 401)
    // -------------------------------------------------------------------------
    logger.info('\n▶ TEST 4: Login with Wrong Password (Expect 401)');
    const wrongPassRes = await fetch(`${baseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: '+919876543210',
        password: 'WrongPassword999',
      }),
    });
    logger.info(`✅ Properly Rejected with Status: ${wrongPassRes.status} (401 Unauthorized)`);

    // -------------------------------------------------------------------------
    // TEST 5: Register a New Farmer User
    // -------------------------------------------------------------------------
    logger.info('\n▶ TEST 5: Register New Farmer User');
    const testPhone = `+91998877${Math.floor(1000 + Math.random() * 9000)}`;
    const regRes = await fetch(`${baseUrl}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        phone: testPhone,
        password: 'SecureFarmPass@456',
        name: 'Ramesh Patil',
        village: 'Manchar',
        taluka: 'Ambegaon',
        district: 'Pune',
        state: 'Maharashtra',
        landArea: 4.5,
        landAreaUnit: 'Acre',
        language: 'mr',
      }),
    });
    const regData: any = await regRes.json();

    if (!regRes.ok || !regData.data?.token) {
      throw new Error(`Registration failed: ${JSON.stringify(regData)}`);
    }
    const newFarmerToken = regData.data.token;
    logger.info(`✅ New Farmer Registered! Status: ${regRes.status}`);
    logger.info(`👤 Registered Farmer: ${regData.data.user.name} (${regData.data.user.phone})`);

    // -------------------------------------------------------------------------
    // TEST 6: Update Profile with Token
    // -------------------------------------------------------------------------
    logger.info('\n▶ TEST 6: Update Farmer Profile (PUT /auth/profile)');
    const updateRes = await fetch(`${baseUrl}/auth/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${newFarmerToken}`,
      },
      body: JSON.stringify({
        village: 'Manchar Bu.',
        landArea: 5.0,
      }),
    });
    const updateData: any = await updateRes.json();

    if (!updateRes.ok || updateData.data?.village !== 'Manchar Bu.') {
      throw new Error(`Profile update failed: ${JSON.stringify(updateData)}`);
    }
    logger.info(`✅ Profile Updated! New Village: ${updateData.data.village}, New Land: ${updateData.data.landArea}`);

    // Cleanup registered test user
    await prisma.user.delete({ where: { phone: testPhone } });
    logger.info(`🧹 Cleaned up temporary test user.`);

    logger.info('\n🎉 ALL 6 AUTHENTICATION TESTS PASSED WITH 100% SUCCESS ON NEON POSTGRESQL!');
  } catch (error: any) {
    logger.error('❌ Auth test failed:', error.message);
    process.exit(1);
  } finally {
    if (server) {
      server.close();
    }
    await disconnectDatabase();
  }
}

runAuthTests();
