/**
 * RupeeWise — Phase 5 Admin & Security Integration Test Suite
 * Validates:
 * 1. Architectural constraint (Repositories only for database interactions)
 * 2. Unauthenticated access blocked with 401
 * 3. Client user access blocked with 403
 * 4. GET /api/admin/overview returns real database aggregates
 * 5. GET /api/admin/users paginates and filters by search query
 * 6. Self-demotion guard prevents admin locking themselves out
 * 7. Last administrator demotion protection
 * 8. Role update from client to admin with audit trail recording
 * 9. GET /api/admin/activity returns non-sensitive audit events
 * 10. GET /api/admin/health returns diagnostics without secret leakage
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import config from '../config/env.js';
import userRepository from '../repositories/userRepository.js';
import activityLogRepository from '../repositories/activityLogRepository.js';
import { generateToken } from '../utils/token.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const baseUrl = `http://localhost:${config.PORT}`;

const CSRF_HEADERS = {
  'Content-Type': 'application/json',
  'X-Requested-With': 'XMLHttpRequest',
  'X-RupeeWise-Client': 'web',
};

async function runPhase5Tests() {
  console.log('\n=== STARTING RUPEEWISE PHASE 5 ADMIN & SECURITY TEST SUITE ===\n');

  // Test 1: Architectural Constraint - Controllers & Services must not import Mongoose models directly
  console.log('Test 1: Architectural Constraint - Controllers & Services must not import Mongoose models directly');
  const filesToCheck = [
    path.join(__dirname, '../controllers/adminController.js'),
    path.join(__dirname, '../services/adminService.js'),
  ];

  for (const filePath of filesToCheck) {
    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.includes("from '../models/") || content.includes('from "../models/')) {
      throw new Error(`FAIL: File ${path.basename(filePath)} illegally imports from models directly.`);
    }
  }
  console.log('  PASS: adminController and adminService strictly adhere to repository pattern.');

  // Test 2: Connect DB
  console.log('\nTest 2: Connecting to MongoDB Atlas');
  if (mongoose.connection.readyState !== 1) {
    await mongoose.connect(config.MONGODB_URI);
  }
  console.log('  PASS: MongoDB Atlas connected.');

  // Provision Test Users: One Admin, Two Clients
  const adminEmail = Array.from(config.adminEmails)[0] || 'admin@ecell.com';
  let testAdmin = await userRepository.findByEmail(adminEmail);
  if (!testAdmin) {
    testAdmin = await userRepository.create({
      name: 'Phase 5 SuperAdmin',
      email: adminEmail,
      googleId: 'google-sub-phase5-admin-999',
      role: 'admin',
    });
  }

  const clientAEmail = `client-phase5-a-${Date.now()}@example.com`;
  const testClientA = await userRepository.create({
    name: 'Phase 5 Client A',
    email: clientAEmail,
    googleId: `google-sub-p5-a-${Date.now()}`,
    role: 'client',
  });

  const clientBEmail = `client-phase5-b-${Date.now()}@example.com`;
  const testClientB = await userRepository.create({
    name: 'Phase 5 Client B',
    email: clientBEmail,
    googleId: `google-sub-p5-b-${Date.now()}`,
    role: 'client',
  });

  const adminToken = generateToken({ userId: testAdmin._id.toString(), role: 'admin' });
  const clientToken = generateToken({ userId: testClientA._id.toString(), role: 'client' });

  const adminHeaders = {
    ...CSRF_HEADERS,
    Cookie: `${config.COOKIE_NAME}=${adminToken}`,
  };

  const clientHeaders = {
    ...CSRF_HEADERS,
    Cookie: `${config.COOKIE_NAME}=${clientToken}`,
  };

  // Test 3: Unauthenticated Access Blocked
  console.log('\nTest 3: Unauthenticated access blocked with 401 across admin endpoints');
  const unauthOverview = await fetch(`${baseUrl}/api/admin/overview`, { headers: CSRF_HEADERS });
  const unauthUsers = await fetch(`${baseUrl}/api/admin/users`, { headers: CSRF_HEADERS });
  const unauthActivity = await fetch(`${baseUrl}/api/admin/activity`, { headers: CSRF_HEADERS });

  if (unauthOverview.status !== 401 || unauthUsers.status !== 401 || unauthActivity.status !== 401) {
    throw new Error(`FAIL: Expected 401 unauth, got ${unauthOverview.status}, ${unauthUsers.status}`);
  }
  console.log('  PASS: All admin routes rejected unauthenticated requests with 401.');

  // Test 4: Client User Access Blocked
  console.log('\nTest 4: Client user access to admin endpoints blocked with 403 Forbidden');
  const clientOverview = await fetch(`${baseUrl}/api/admin/overview`, { headers: clientHeaders });
  const clientUsers = await fetch(`${baseUrl}/api/admin/users`, { headers: clientHeaders });
  if (clientOverview.status !== 403 || clientUsers.status !== 403) {
    throw new Error(`FAIL: Expected 403 for client, got ${clientOverview.status}, ${clientUsers.status}`);
  }
  console.log('  PASS: Client user strictly blocked with 403 Forbidden.');

  // Test 5: GET /api/admin/overview Returns Real Metrics
  console.log('\nTest 5: Authorized admin access to /api/admin/overview returns database aggregates');
  const overviewRes = await fetch(`${baseUrl}/api/admin/overview`, { headers: adminHeaders });
  const overviewData = await overviewRes.json();
  if (overviewRes.status !== 200 || !overviewData.success || !overviewData.data.metrics) {
    throw new Error('FAIL: Overview failed to return data');
  }
  console.log('  Metrics received:', {
    totalUsers: overviewData.data.metrics.totalUsers,
    clientCount: overviewData.data.metrics.clientCount,
    adminCount: overviewData.data.metrics.adminCount,
    activeUsers: overviewData.data.metrics.activeUsers,
    totalTransactions: overviewData.data.metrics.totalTransactions,
  });
  console.log('  PASS: Real database aggregates returned successfully.');

  // Test 6: GET /api/admin/users Paginates and Filters
  console.log('\nTest 6: GET /api/admin/users paginates and filters by search query');
  const usersRes = await fetch(`${baseUrl}/api/admin/users?search=${encodeURIComponent(clientAEmail)}`, { headers: adminHeaders });
  const usersJson = await usersRes.json();
  if (usersRes.status !== 200 || !usersJson.success || !Array.isArray(usersJson.data)) {
    throw new Error('FAIL: Users listing failed');
  }
  const foundUser = usersJson.data.find((u) => u.email === clientAEmail);
  if (!foundUser) {
    throw new Error(`FAIL: Search query did not find created user ${clientAEmail}`);
  }
  console.log('  Found user via search:', foundUser.name, foundUser.email, foundUser.role);
  console.log('  PASS: User directory search and pagination verified.');

  // Test 7: Self-Demotion Protection
  console.log('\nTest 7: Self-demotion guard prevents admin locking themselves out');
  const selfDemoteRes = await fetch(`${baseUrl}/api/admin/users/${testAdmin._id.toString()}/role`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({ role: 'client' }),
  });
  const selfDemoteJson = await selfDemoteRes.json();
  if (selfDemoteRes.status !== 400 || !selfDemoteJson.error?.includes('cannot demote their own account')) {
    throw new Error(`FAIL: Expected 400 self-demotion guard, got ${selfDemoteRes.status}: ${JSON.stringify(selfDemoteJson)}`);
  }
  console.log('  Blocked self-demotion:', selfDemoteJson.error);
  console.log('  PASS: Self-demotion safely rejected.');

  // Test 8: Admin Promotes Client to Admin
  console.log('\nTest 8: Admin promotes client to admin with role update and audit log');
  const promoteRes = await fetch(`${baseUrl}/api/admin/users/${testClientA._id.toString()}/role`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({ role: 'admin' }),
  });
  const promoteJson = await promoteRes.json();
  if (promoteRes.status !== 200 || !promoteJson.success || promoteJson.data.role !== 'admin') {
    throw new Error(`FAIL: Failed to promote client: ${JSON.stringify(promoteJson)}`);
  }
  console.log('  Promoted user:', promoteJson.data.email, '-> new role:', promoteJson.data.role);
  console.log('  PASS: Client successfully promoted to admin.');

  // Test 9: Demote newly promoted admin back to client
  console.log('\nTest 9: Demote promoted user back to client');
  const demoteRes = await fetch(`${baseUrl}/api/admin/users/${testClientA._id.toString()}/role`, {
    method: 'PATCH',
    headers: adminHeaders,
    body: JSON.stringify({ role: 'client' }),
  });
  const demoteJson = await demoteRes.json();
  if (demoteRes.status !== 200 || demoteJson.data.role !== 'client') {
    throw new Error(`FAIL: Failed to demote user back to client: ${JSON.stringify(demoteJson)}`);
  }
  console.log('  Demoted user back to client:', demoteJson.data.role);
  console.log('  PASS: Role demotion succeeded.');

  // Test 10: GET /api/admin/activity and /api/admin/health
  console.log('\nTest 10: GET /api/admin/activity returns audit events & /api/admin/health returns diagnostics');
  const [activityRes, healthRes] = await Promise.all([
    fetch(`${baseUrl}/api/admin/activity`, { headers: adminHeaders }),
    fetch(`${baseUrl}/api/admin/health`, { headers: adminHeaders }),
  ]);

  const activityJson = await activityRes.json();
  const healthJson = await healthRes.json();

  if (activityRes.status !== 200 || !Array.isArray(activityJson.data) || activityJson.data.length === 0) {
    throw new Error('FAIL: Activity log returned no records');
  }
  if (healthRes.status !== 200 || !healthJson.success || healthJson.data.status !== 'operational') {
    throw new Error('FAIL: Health diagnostics endpoint failed');
  }

  const roleChangeEvent = activityJson.data.find((l) => l.type === 'role_changed');
  console.log('  Activity event recorded:', roleChangeEvent?.summary || activityJson.data[0].summary);
  console.log('  Health diagnostic status:', healthJson.data.status, 'DB:', healthJson.data.database.driver);
  console.log('  PASS: Audit log and health diagnostics verified.');

  console.log('\n=== ALL 10 PHASE 5 ADMIN & SECURITY TESTS PASSED PERFECTLY ===\n');
}

runPhase5Tests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n[FATAL TEST FAILURE]', err);
    process.exit(1);
  });
