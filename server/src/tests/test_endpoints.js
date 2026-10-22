import app from '../app.js';
import config from '../config/env.js';
import { generateToken } from '../utils/token.js';
import userRepository from '../repositories/userRepository.js';
import { connectDatabase } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runVerification() {
  console.log('=== STARTING PAISAPILOT AUDIT & TEST SUITE ===\n');

  // Test 1: Architectural Constraint - Controllers must not import Mongoose models directly
  console.log('Test 1: Architectural Constraint - Controllers must not import Mongoose models directly');
  const controllerPath = path.resolve(__dirname, '../controllers/authController.js');
  const controllerContent = fs.readFileSync(controllerPath, 'utf8');
  if (controllerContent.includes("from '../models/") || controllerContent.includes('mongoose')) {
    throw new Error('FAIL: Controller directly imports Mongoose model or mongoose!');
  }
  console.log('  PASS: authController does not import Mongoose models.');

  // Test 2: Database Connection
  console.log('\nTest 2: MongoDB Atlas connection check');
  await connectDatabase();
  console.log('  PASS: MongoDB Atlas connected successfully.');

  // Start server on an ephemeral port
  const testPort = 5098;
  const server = app.listen(testPort);

  try {
    const baseUrl = `http://localhost:${testPort}`;

    // Test 3: GET /api/health
    console.log('\nTest 3: GET /api/health returns accurate status and dependency state');
    const healthRes = await fetch(`${baseUrl}/api/health`);
    const healthData = await healthRes.json();
    console.log(`  Status code: ${healthRes.status}, body:`, healthData);
    if (!healthData.success || healthData.status !== 'healthy') {
      throw new Error('FAIL: /api/health returned unexpected payload');
    }
    // Verify no secret leak in health endpoint
    const healthString = JSON.stringify(healthData);
    if (
      healthString.includes('mongodb+srv') ||
      healthString.includes('password') ||
      healthString.includes('secret')
    ) {
      throw new Error('FAIL: /api/health leaked sensitive connection details or secrets!');
    }
    console.log('  PASS: /api/health verified safe without leaking credentials.');

    // Test 4: Unknown route returns structured 404
    console.log('\nTest 4: Unknown routes return structured 404');
    const notFoundRes = await fetch(`${baseUrl}/api/unknown-endpoint-xyz`);
    const notFoundData = await notFoundRes.json();
    console.log(`  404 Status: ${notFoundRes.status}, body:`, notFoundData);
    if (notFoundRes.status !== 404 || notFoundData.success !== false) {
      throw new Error('FAIL: Unknown route did not return structured 404');
    }
    console.log('  PASS: Unknown route correctly returns structured 404.');

    // Test 5: CORS Headers for approved origin vs unapproved origin
    console.log('\nTest 5: CORS allows configured frontend origin and blocks unapproved origin');
    const corsApprovedRes = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: config.CLIENT_URL },
    });
    const allowOriginHeader = corsApprovedRes.headers.get('access-control-allow-origin');
    const allowCredentialsHeader = corsApprovedRes.headers.get('access-control-allow-credentials');
    console.log(`  Approved origin CORS header: ${allowOriginHeader}, credentials: ${allowCredentialsHeader}`);
    if (allowOriginHeader !== config.CLIENT_URL || allowCredentialsHeader !== 'true') {
      throw new Error('FAIL: Approved origin did not receive correct CORS headers');
    }

    const corsBlockedRes = await fetch(`${baseUrl}/api/health`, {
      headers: { Origin: 'http://malicious-attacker-site.com' },
    });
    const blockedAllowOrigin = corsBlockedRes.headers.get('access-control-allow-origin');
    console.log(`  Unapproved origin CORS header: ${blockedAllowOrigin}`);
    if (blockedAllowOrigin === 'http://malicious-attacker-site.com') {
      throw new Error('FAIL: CORS improperly reflected unauthorized origin!');
    }
    console.log('  PASS: CORS properly restricts cross-origin access.');

    // Test 6: Unauthenticated protected routes return 401
    console.log('\nTest 6: Unauthenticated protected routes return 401');
    const meUnauth = await fetch(`${baseUrl}/api/auth/me`);
    const adminUnauth = await fetch(`${baseUrl}/api/admin/overview`);
    console.log(`  /api/auth/me: ${meUnauth.status}, /api/admin/overview: ${adminUnauth.status}`);
    if (meUnauth.status !== 401 || adminUnauth.status !== 401) {
      throw new Error('FAIL: Unauthenticated protected endpoints did not return 401');
    }
    console.log('  PASS: Unauthenticated protected endpoints rejected with 401.');

    // Test 7: Tampered or invalid token in cookie returns 401
    console.log('\nTest 7: Tampered or invalid session cookie returns 401');
    const tamperedRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Cookie: `${config.COOKIE_NAME}=tampered.garbage.token` },
    });
    console.log(`  Tampered token status: ${tamperedRes.status}`);
    if (tamperedRes.status !== 401) {
      throw new Error('FAIL: Tampered session token was not rejected with 401');
    }
    console.log('  PASS: Tampered session token safely rejected with 401.');

    // Test 8: Missing or invalid Google credential in POST /api/auth/google
    console.log('\nTest 8: POST /api/auth/google body validation and token verification');
    const emptyGoogleRes = await fetch(`${baseUrl}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({}),
    });
    console.log(`  Empty body status: ${emptyGoogleRes.status}`);
    if (emptyGoogleRes.status !== 400) {
      throw new Error(`FAIL: Expected 400 validation error, got ${emptyGoogleRes.status}`);
    }

    const invalidGoogleRes = await fetch(`${baseUrl}/api/auth/google`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ credential: 'fake-invalid-token-12345' }),
    });
    console.log(`  Invalid token status: ${invalidGoogleRes.status}`);
    if (invalidGoogleRes.status !== 401) {
      throw new Error(`FAIL: Expected 401 verification failure, got ${invalidGoogleRes.status}`);
    }
    console.log('  PASS: Google endpoint rejects missing and invalid credentials.');

    // Test 9: Client user access to admin-only endpoint returns 403
    console.log('\nTest 9: Client user access to admin-only endpoint returns 403 Forbidden');
    let clientUser = await userRepository.findByEmail('audittestclient@example.com');
    if (!clientUser) {
      clientUser = await userRepository.create({
        name: 'Audit Test Client',
        email: 'audittestclient@example.com',
        googleId: 'google-sub-audit-client-999',
        role: 'client',
      });
    }

    const clientToken = generateToken({
      userId: clientUser._id.toString(),
      role: 'client',
    });

    const clientAdminRes = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: {
        Cookie: `${config.COOKIE_NAME}=${clientToken}`,
      },
    });
    console.log(`  Client hitting /api/admin/overview: ${clientAdminRes.status}`);
    if (clientAdminRes.status !== 403) {
      throw new Error(`FAIL: Expected 403 for client accessing admin endpoint, got ${clientAdminRes.status}`);
    }
    console.log('  PASS: Client blocked from admin route with 403 Forbidden.');

    // Test 10: Client user session restoration via /api/auth/me
    console.log('\nTest 10: Client user session restoration via /api/auth/me');
    const clientMeRes = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Cookie: `${config.COOKIE_NAME}=${clientToken}`,
      },
    });
    console.log(`  Client hitting /api/auth/me: ${clientMeRes.status}`);
    const clientMeData = await clientMeRes.json();
    if (clientMeRes.status !== 200 || clientMeData.user.email !== 'audittestclient@example.com') {
      throw new Error('FAIL: /api/auth/me failed to restore user profile');
    }
    console.log('  PASS: Session restored from cookie successfully.');

    // Test 11: Authorized Admin Access
    console.log('\nTest 11: Authorized admin access to /api/admin/overview succeeds');
    const adminEmail = Array.from(config.adminEmails)[0] || 'admin@ecell.com';
    let adminUser = await userRepository.findByEmail(adminEmail);
    if (!adminUser) {
      adminUser = await userRepository.create({
        name: 'Audit Super Admin',
        email: adminEmail,
        googleId: 'google-sub-audit-admin-888',
        role: 'admin',
      });
    }

    const adminToken = generateToken({
      userId: adminUser._id.toString(),
      role: 'admin',
    });

    const adminRes = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: {
        Cookie: `${config.COOKIE_NAME}=${adminToken}`,
      },
    });
    console.log(`  Admin hitting /api/admin/overview: ${adminRes.status}`);
    const adminData = await adminRes.json();
    if (adminRes.status !== 200 || !adminData.success || !adminData.data.metrics) {
      throw new Error('FAIL: Admin endpoint failed to return data');
    }
    console.log('  PASS: Admin endpoint returned valid metrics:', adminData.data.metrics);

    // Test 12: Dynamic Admin Revocation when removed from allowlist
    console.log('\nTest 12: Dynamic admin revocation when email is removed from allowlist');
    // Create an admin user with an email NOT in allowlist
    let revokedAdminUser = await userRepository.findByEmail('revoked-admin@example.com');
    if (!revokedAdminUser) {
      revokedAdminUser = await userRepository.create({
        name: 'Revoked Admin',
        email: 'revoked-admin@example.com',
        googleId: 'google-sub-revoked-admin-777',
        role: 'admin', // Stored as admin, but email is NOT in config.adminEmails
      });
    } else {
      await userRepository.updateById(revokedAdminUser._id, { role: 'admin' });
    }

    const revokedToken = generateToken({
      userId: revokedAdminUser._id.toString(),
      role: 'admin',
    });

    const revokedAdminRes = await fetch(`${baseUrl}/api/admin/overview`, {
      headers: {
        Cookie: `${config.COOKIE_NAME}=${revokedToken}`,
      },
    });
    console.log(`  Revoked admin hitting /api/admin/overview: ${revokedAdminRes.status}`);
    if (revokedAdminRes.status !== 403) {
      throw new Error(`FAIL: Expected 403 for revoked admin, got ${revokedAdminRes.status}`);
    }

    // Check that role was dynamically updated to 'client' in database
    const refreshedUser = await userRepository.findById(revokedAdminUser._id);
    if (refreshedUser.role !== 'client') {
      throw new Error('FAIL: User role was not revoked to client in database');
    }
    console.log('  PASS: Admin revoked dynamically and demoted to client in DB.');

    // Test 13: POST /api/auth/logout sets cookie expiry
    console.log('\nTest 13: POST /api/auth/logout sets cookie expiry');
    const logoutRes = await fetch(`${baseUrl}/api/auth/logout`, {
      method: 'POST',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
      },
    });
    console.log(`  Logout status: ${logoutRes.status}`);
    const setCookie = logoutRes.headers.get('set-cookie');
    console.log(`  Set-Cookie header on logout: ${setCookie}`);
    if (!setCookie || (!setCookie.includes('Max-Age=0') && !setCookie.includes('Expires='))) {
      throw new Error('FAIL: Logout did not clear cookie');
    }
    console.log('  PASS: Logout clears session cookie.');

    console.log('\n=== ALL 13 AUDIT & VERIFICATION CHECKS PASSED PERFECTLY ===\n');
  } finally {
    server.close();
    await (await import('mongoose')).default.disconnect();
    process.exit(0);
  }
}

runVerification().catch((err) => {
  console.error('\nAUDIT VERIFICATION FAILED:', err);
  process.exit(1);
});
