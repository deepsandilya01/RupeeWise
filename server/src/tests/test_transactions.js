import app from '../app.js';
import config from '../config/env.js';
import { generateToken } from '../utils/token.js';
import userRepository from '../repositories/userRepository.js';
import transactionRepository from '../repositories/transactionRepository.js';
import { connectDatabase } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runTransactionTests() {
  console.log('=== STARTING RUPEEWISE TRANSACTIONS ENGINE TEST SUITE ===\n');

  // Test 1: Architectural Integrity Check
  console.log('Test 1: Architectural Constraint - Controllers & Services must not import Mongoose models directly');
  const controllerPath = path.resolve(__dirname, '../controllers/transactionController.js');
  const controllerContent = fs.readFileSync(controllerPath, 'utf8');
  if (controllerContent.includes("from '../models/") || controllerContent.includes('mongoose')) {
    throw new Error('FAIL: transactionController directly imports Mongoose model or mongoose!');
  }

  const servicePath = path.resolve(__dirname, '../services/transactionService.js');
  const serviceContent = fs.readFileSync(servicePath, 'utf8');
  if (serviceContent.includes("from '../models/") || serviceContent.includes('mongoose')) {
    throw new Error('FAIL: transactionService directly imports Mongoose model or mongoose!');
  }
  console.log('  PASS: Controller & Service strictly adhere to repository pattern without direct Mongoose imports.');

  // Test 2: Connect DB
  console.log('\nTest 2: Connecting to MongoDB Atlas for transaction tests');
  await connectDatabase();
  console.log('  PASS: Database connected.');

  const testPort = 5097;
  const server = app.listen(testPort);
  const baseUrl = `http://localhost:${testPort}`;

  try {
    // Set up test users: User A (primary test client) and User B (isolated other user)
    const testUserA = await userRepository.findByEmail('test.user.a@rupeewise.test') ||
      await userRepository.create({
        name: 'Test Client Alpha',
        email: 'test.user.a@rupeewise.test',
        googleId: 'google-sub-alpha-12345',
        role: 'client',
      });

    const testUserB = await userRepository.findByEmail('test.user.b@rupeewise.test') ||
      await userRepository.create({
        name: 'Test Client Beta',
        email: 'test.user.b@rupeewise.test',
        googleId: 'google-sub-beta-67890',
        role: 'client',
      });

    const tokenA = generateToken({
      userId: testUserA._id.toString(),
      role: testUserA.role || 'client',
    });

    const tokenB = generateToken({
      userId: testUserB._id.toString(),
      role: testUserB.role || 'client',
    });

    const headersA = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Cookie': `${config.COOKIE_NAME}=${tokenA}`,
      'Origin': config.CLIENT_URL,
    };

    const headersB = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Cookie': `${config.COOKIE_NAME}=${tokenB}`,
      'Origin': config.CLIENT_URL,
    };

    // Test 3: Unauthenticated access returns 401
    console.log('\nTest 3: Unauthenticated access to /api/transactions returns 401');
    const unauthRes = await fetch(`${baseUrl}/api/transactions`);
    if (unauthRes.status !== 401) {
      throw new Error(`FAIL: Expected 401, got ${unauthRes.status}`);
    }
    console.log('  PASS: Unauthenticated access rejected with 401.');

    // Test 4: Validation rejects invalid amounts and types
    console.log('\nTest 4: Validation rejects negative amounts and invalid types');
    const invalidRes = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        title: 'Invalid Tx',
        amount: -500,
        type: 'crypto_swap',
        category: 'Food',
      }),
    });
    const invalidData = await invalidRes.json();
    if (invalidRes.status !== 400 || invalidData.success !== false) {
      throw new Error(`FAIL: Expected 400 validation error, got ${invalidRes.status}`);
    }
    console.log('  PASS: Invalid payloads rejected with 400 Validation Error:', invalidData.details);

    // Test 5: Create Income & Expense transactions for User A
    console.log('\nTest 5: Create valid income and expense transactions for User A');
    const incomeRes = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        title: 'Monthly Software Consulting',
        amount: 50000,
        type: 'income',
        category: 'Salary & Income',
        paymentMethod: 'Net Banking',
        description: 'Client retainer invoice',
      }),
    });
    const incomeData = await incomeRes.json();
    if (incomeRes.status !== 201 || !incomeData.data.id) {
      throw new Error(`FAIL: Income creation failed: ${JSON.stringify(incomeData)}`);
    }
    const incomeTxId = incomeData.data.id;

    const expenseRes = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        title: 'Fresh Groceries Basket',
        amount: 3200,
        type: 'expense',
        category: 'Food & Dining',
        paymentMethod: 'UPI',
        description: 'Supermarket weekly grocery',
      }),
    });
    const expenseData = await expenseRes.json();
    if (expenseRes.status !== 201 || !expenseData.data.id) {
      throw new Error(`FAIL: Expense creation failed: ${JSON.stringify(expenseData)}`);
    }
    const expenseTxId = expenseData.data.id;
    console.log(`  PASS: Created transactions: Income (ID: ${incomeTxId}), Expense (ID: ${expenseTxId})`);

    // Test 6: Create transaction for User B to test data isolation
    console.log('\nTest 6: Multi-tenant Data Ownership Isolation');
    const txBRes = await fetch(`${baseUrl}/api/transactions`, {
      method: 'POST',
      headers: headersB,
      body: JSON.stringify({
        title: "User B Private Transaction",
        amount: 99999,
        type: 'expense',
        category: 'Travel',
      }),
    });
    const txBData = await txBRes.json();
    const txBId = txBData.data.id;

    // User A attempts to read User B's transaction -> MUST return 404
    const crossReadRes = await fetch(`${baseUrl}/api/transactions/${txBId}`, {
      headers: headersA,
    });
    if (crossReadRes.status !== 404) {
      throw new Error(`FAIL: Cross-tenant read returned ${crossReadRes.status} instead of 404!`);
    }

    // User A attempts to update User B's transaction -> MUST return 404
    const crossUpdateRes = await fetch(`${baseUrl}/api/transactions/${txBId}`, {
      method: 'PATCH',
      headers: headersA,
      body: JSON.stringify({ amount: 1 }),
    });
    if (crossUpdateRes.status !== 404) {
      throw new Error(`FAIL: Cross-tenant update returned ${crossUpdateRes.status} instead of 404!`);
    }

    // User A attempts to delete User B's transaction -> MUST return 404
    const crossDeleteRes = await fetch(`${baseUrl}/api/transactions/${txBId}`, {
      method: 'DELETE',
      headers: headersA,
    });
    if (crossDeleteRes.status !== 404) {
      throw new Error(`FAIL: Cross-tenant delete returned ${crossDeleteRes.status} instead of 404!`);
    }
    console.log('  PASS: Strict data isolation verified. Cross-user read, update, and delete all safely return 404.');

    // Test 7: List transactions with pagination and filters
    console.log('\nTest 7: List user transactions with filtering and pagination');
    const listRes = await fetch(`${baseUrl}/api/transactions?type=expense&limit=10`, {
      headers: headersA,
    });
    const listData = await listRes.json();
    if (listRes.status !== 200 || !Array.isArray(listData.data)) {
      throw new Error('FAIL: Listing transactions failed');
    }
    // Verify none of User B's transactions are present
    const leaked = listData.data.some((t) => t.id === txBId);
    if (leaked) {
      throw new Error('FAIL: Leak detected! User B transaction showed up in User A list!');
    }
    console.log(`  PASS: Listed ${listData.data.length} transactions with total ${listData.pagination.total}. No leakage.`);

    // Test 8: Financial Summary Calculation
    console.log('\nTest 8: GET /api/transactions/summary accurate calculation');
    const summaryRes = await fetch(`${baseUrl}/api/transactions/summary`, {
      headers: headersA,
    });
    const summaryData = await summaryRes.json();
    if (summaryRes.status !== 200 || !summaryData.data) {
      throw new Error('FAIL: /api/transactions/summary failed');
    }
    const s = summaryData.data;
    console.log('  Summary Payload:', {
      monthlyIncome: s.monthlyIncome,
      monthlyExpenses: s.monthlyExpenses,
      netCashFlow: s.netCashFlow,
      savingsRate: s.savingsRate + '%',
      totalBalance: s.totalBalance,
      categoriesCount: s.categories.length,
      historyCount: s.monthlyHistory.length,
    });
    if (s.monthlyIncome < 50000 || s.monthlyExpenses < 3200) {
      throw new Error('FAIL: Summary totals do not match created transactions!');
    }
    if (s.netCashFlow !== s.monthlyIncome - s.monthlyExpenses) {
      throw new Error('FAIL: Net cash flow does not equal income minus expenses!');
    }
    console.log('  PASS: Financial summaries and analytics correctly calculated.');

    // Test 9: Update Transaction
    console.log('\nTest 9: PATCH /api/transactions/:id updates transaction');
    const updateRes = await fetch(`${baseUrl}/api/transactions/${expenseTxId}`, {
      method: 'PATCH',
      headers: headersA,
      body: JSON.stringify({
        title: 'Fresh Organic Groceries',
        amount: 3500,
      }),
    });
    const updateData = await updateRes.json();
    if (updateRes.status !== 200 || updateData.data.title !== 'Fresh Organic Groceries' || updateData.data.amount !== 3500) {
      throw new Error(`FAIL: Update failed: ${JSON.stringify(updateData)}`);
    }
    console.log('  PASS: Transaction updated successfully:', updateData.data.title, '₹' + updateData.data.amount);

    // Test 10: Delete Transaction
    console.log('\nTest 10: DELETE /api/transactions/:id deletes transaction');
    const deleteRes = await fetch(`${baseUrl}/api/transactions/${incomeTxId}`, {
      method: 'DELETE',
      headers: headersA,
    });
    const deleteData = await deleteRes.json();
    if (deleteRes.status !== 200 || !deleteData.data.deleted) {
      throw new Error(`FAIL: Delete failed: ${JSON.stringify(deleteData)}`);
    }

    // Verify it is gone
    const verifyGone = await fetch(`${baseUrl}/api/transactions/${incomeTxId}`, {
      headers: headersA,
    });
    if (verifyGone.status !== 404) {
      throw new Error('FAIL: Deleted transaction still accessible!');
    }
    console.log('  PASS: Transaction deleted and subsequent lookup returns 404.');

    // Clean up User B's transaction
    await fetch(`${baseUrl}/api/transactions/${txBId}`, {
      method: 'DELETE',
      headers: headersB,
    });

    console.log('\n=== ALL 10 TRANSACTIONS ENGINE TESTS PASSED PERFECTLY ===\n');
  } finally {
    server.close();
  }
}

runTransactionTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('TRANSACTIONS TEST ERROR:', err);
    process.exit(1);
  });
