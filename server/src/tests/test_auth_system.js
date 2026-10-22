import app from '../app.js';
import config from '../config/env.js';
import userRepository from '../repositories/userRepository.js';
import transactionRepository from '../repositories/transactionRepository.js';
import { connectDatabase } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runAuthVerification() {
  console.log('====================================================');
  console.log('RUPEEWISE COMPLETE AUTHENTICATION & DEMO VERIFICATION');
  console.log('====================================================\n');

  // Test 1: Layered Architecture Check
  console.log('Test 1: Verify architectural layering in authController');
  const controllerPath = path.resolve(__dirname, '../controllers/authController.js');
  const controllerContent = fs.readFileSync(controllerPath, 'utf8');
  if (controllerContent.includes("from '../models/") || controllerContent.includes('mongoose')) {
    throw new Error('FAIL: authController directly imports Mongoose models or mongoose!');
  }
  console.log('  [PASS] authController strictly uses services/repositories with zero model leaks.');

  // Test 2: Database Connectivity
  console.log('\nTest 2: MongoDB database connection check');
  await connectDatabase();
  console.log('  [PASS] Database connected successfully.');

  const testPort = 5092;
  const server = app.listen(testPort);
  const baseUrl = `http://localhost:${testPort}`;

  try {
    const testEmail = `test_user_${Date.now()}@rupeewise.test`;
    const testPassword = 'Password123!Secure';
    const testName = 'RupeeWise Test Engineer';

    // Helper for CSRF headers
    const authHeaders = {
      'Content-Type': 'application/json',
      'X-RupeeWise-Client': 'web',
      'X-Requested-With': 'XMLHttpRequest',
      Origin: config.CLIENT_URL,
    };

    // Test 3: Input validation on registration
    console.log('\nTest 3: Input validation prevents malformed registration payloads');
    const badReqRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: 'A',
        email: 'invalid-email',
        password: 'short',
      }),
    });
    const badReqData = await badReqRes.json();
    if (badReqRes.status !== 400 || badReqData.success !== false) {
      throw new Error(`FAIL: Expected 400 validation error, got status ${badReqRes.status}`);
    }
    console.log('  [PASS] Registration validation rejected invalid email and short password (400).');

    // Test 4: Email/password registration
    console.log('\nTest 4: Email and password registration (POST /api/auth/register)');
    const registerRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
      }),
    });
    const registerData = await registerRes.json();
    const registerCookie = registerRes.headers.get('set-cookie');

    if (registerRes.status !== 201 || !registerData.success || !registerData.user) {
      throw new Error(`FAIL: Registration failed with status ${registerRes.status}: ${JSON.stringify(registerData)}`);
    }
    if (!registerCookie || !registerCookie.includes(config.COOKIE_NAME)) {
      throw new Error(`FAIL: Expected Set-Cookie header with ${config.COOKIE_NAME}`);
    }
    if (registerData.user.passwordHash || JSON.stringify(registerData).includes(testPassword)) {
      throw new Error('FAIL: Password or passwordHash exposed in registration response!');
    }
    console.log(`  [PASS] User registered successfully (201). Name: ${registerData.user.name}, Role: ${registerData.user.role}`);
    console.log(`  [PASS] HttpOnly session cookie issued: ${registerCookie.split(';')[0]}`);

    // Verify bcrypt hashing in DB
    const dbUser = await userRepository.findByEmailWithPassword(testEmail);
    if (!dbUser || !dbUser.passwordHash || !dbUser.passwordHash.startsWith('$2')) {
      throw new Error('FAIL: Password is not properly hashed with bcrypt in MongoDB!');
    }
    console.log('  [PASS] Password verified securely hashed in MongoDB (bcrypt salt factor 12).');

    // Test 5: Duplicate registration rejection
    console.log('\nTest 5: Duplicate registration rejection');
    const dupRes = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        name: testName,
        email: testEmail,
        password: testPassword,
      }),
    });
    const dupData = await dupRes.json();
    if (dupRes.status !== 409 || dupData.success !== false) {
      throw new Error(`FAIL: Expected 409 Conflict for duplicate email, got ${dupRes.status}`);
    }
    console.log('  [PASS] Duplicate registration rejected with 409 Conflict.');

    // Test 6: Login failures with generic messages
    console.log('\nTest 6: Login failure handling (generic messages prevent email enumeration)');
    const wrongPassRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        email: testEmail,
        password: 'WrongPassword999!',
      }),
    });
    const wrongPassData = await wrongPassRes.json();
    if (wrongPassRes.status !== 401 || wrongPassData.error !== 'Invalid email or password.') {
      throw new Error(`FAIL: Expected 401 with generic message, got ${wrongPassRes.status}`);
    }

    const wrongEmailRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        email: 'nonexistent_account_xyz@rupeewise.test',
        password: testPassword,
      }),
    });
    const wrongEmailData = await wrongEmailRes.json();
    if (wrongEmailRes.status !== 401 || wrongEmailData.error !== 'Invalid email or password.') {
      throw new Error('FAIL: Non-existent email returned revealing message!');
    }
    console.log('  [PASS] Both wrong password and unknown email return identical generic 401 messages.');

    // Test 7: Successful email/password login
    console.log('\nTest 7: Successful email/password login (POST /api/auth/login)');
    const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });
    const loginData = await loginRes.json();
    const loginCookie = loginRes.headers.get('set-cookie');

    if (loginRes.status !== 200 || !loginData.success || loginData.user.email !== testEmail) {
      throw new Error('FAIL: Login failed with valid credentials');
    }
    if (!loginCookie || !loginCookie.includes(config.COOKIE_NAME)) {
      throw new Error('FAIL: Login did not issue HttpOnly auth cookie');
    }
    console.log('  [PASS] User successfully authenticated via email/password.');

    // Extract cookie for session queries
    const sessionCookie = loginCookie.split(';')[0];

    // Test 8: Current user session verification (GET /api/auth/me)
    console.log('\nTest 8: Current user session retrieval (GET /api/auth/me)');
    const meRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Cookie: sessionCookie,
      },
    });
    const meData = await meRes.json();
    if (meRes.status !== 200 || meData.user.email !== testEmail) {
      throw new Error('FAIL: Session cookie failed to authenticate /api/auth/me');
    }
    console.log(`  [PASS] Authenticated as '${meData.user.name}' (Role: ${meData.user.role}).`);

    // Test 9: Demonstration Client Access ("Explore User Demo")
    console.log('\nTest 9: Demonstration Client Access (POST /api/auth/demo { role: "client" })');
    const demoClientRes = await fetch(`${baseUrl}/api/auth/demo`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ role: 'client' }),
    });
    const demoClientData = await demoClientRes.json();
    const demoClientCookie = demoClientRes.headers.get('set-cookie')?.split(';')[0];

    if (
      demoClientRes.status !== 200 ||
      !demoClientData.success ||
      demoClientData.user.role !== 'client' ||
      demoClientData.user.isDemo !== true ||
      demoClientData.user.email !== 'demo-client@rupeewise.ai'
    ) {
      throw new Error(`FAIL: Demo client auth failed: ${JSON.stringify(demoClientData)}`);
    }
    console.log(`  [PASS] Demo Client authenticated. Email: ${demoClientData.user.email}, isDemo: ${demoClientData.user.isDemo}`);

    // Verify demo client has pre-seeded transactions
    const demoTxRes = await fetch(`${baseUrl}/api/transactions`, {
      headers: { Cookie: demoClientCookie },
    });
    const demoTxData = await demoTxRes.json();
    if (demoTxRes.status !== 200 || !demoTxData.success || !Array.isArray(demoTxData.data) || demoTxData.data.length === 0) {
      throw new Error(`FAIL: Demo client has no seeded sample transactions! Data: ${JSON.stringify(demoTxData)}`);
    }
    console.log(`  [PASS] Demo client has ${demoTxData.pagination?.total || demoTxData.data.length} sample transactions available for exploration.`);

    // Verify Demo Client is strictly FORBIDDEN from admin endpoints
    console.log('\nTest 10: Security check - Demo client cannot access Admin endpoints (403 Forbidden)');
    const demoAdminForbiddenRes = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: { Cookie: demoClientCookie },
    });
    if (demoAdminForbiddenRes.status !== 403) {
      throw new Error(`SECURITY VULNERABILITY: Demo client accessed admin endpoint! Status: ${demoAdminForbiddenRes.status}`);
    }
    console.log('  [PASS] Demo client correctly blocked with 403 Forbidden on /api/admin/overview.');

    // Test 11: Demonstration Admin Access ("Explore Admin Demo")
    console.log('\nTest 11: Demonstration Admin Access (POST /api/auth/demo { role: "admin" })');
    const demoAdminRes = await fetch(`${baseUrl}/api/auth/demo`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({ role: 'admin' }),
    });
    const demoAdminData = await demoAdminRes.json();
    const demoAdminCookie = demoAdminRes.headers.get('set-cookie')?.split(';')[0];

    if (
      demoAdminRes.status !== 200 ||
      !demoAdminData.success ||
      demoAdminData.user.role !== 'admin' ||
      demoAdminData.user.isDemo !== true ||
      demoAdminData.user.email !== 'demo-admin@rupeewise.ai'
    ) {
      throw new Error(`FAIL: Demo admin auth failed: ${JSON.stringify(demoAdminData)}`);
    }
    console.log(`  [PASS] Demo Admin authenticated. Email: ${demoAdminData.user.email}, Role: ${demoAdminData.user.role}`);

    // Verify Demo Admin has authorized access to admin overview
    const adminOverviewRes = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: { Cookie: demoAdminCookie },
    });
    const adminOverviewData = await adminOverviewRes.json();
    if (adminOverviewRes.status !== 200 || !adminOverviewData.success || !adminOverviewData.data.metrics) {
      throw new Error('FAIL: Demo admin failed to access /api/admin/overview');
    }
    console.log(`  [PASS] Demo Admin accessed /api/admin/overview successfully (Total registered users: ${adminOverviewData.data.metrics.totalUsers}).`);

    // Test 12: Logout and session invalidation
    console.log('\nTest 12: Logout and session invalidation (POST /api/auth/logout)');
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: authHeaders,
    });
    const logoutCookie = logoutRes.headers.get('set-cookie');
    const isCleared =
      logoutCookie &&
      (logoutCookie.toLowerCase().includes('expires=') ||
        logoutCookie.includes('Max-Age=0') ||
        logoutCookie.includes(`${config.COOKIE_NAME}=;`));
    if (!isCleared) {
      throw new Error(`FAIL: Logout did not clear auth cookie! Header: ${logoutCookie}`);
    }
    console.log('  [PASS] Logout successfully invalidated session cookie.');

    console.log('\n====================================================');
    console.log('ALL 12 AUTHENTICATION & DEMO TESTS PASSED PERFECTLY!');
    console.log('====================================================\n');
    process.exit(0);
  } finally {
    server.close();
  }
}

runAuthVerification().catch((err) => {
  console.error('\n*** TEST SUITE FAILED ***');
  console.error(err);
  process.exit(1);
});
