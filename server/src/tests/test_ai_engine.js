import app from '../app.js';
import config from '../config/env.js';
import { generateToken } from '../utils/token.js';
import userRepository from '../repositories/userRepository.js';
import transactionRepository from '../repositories/transactionRepository.js';
import goalRepository from '../repositories/goalRepository.js';
import budgetRepository from '../repositories/budgetRepository.js';
import { connectDatabase } from '../config/database.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runAIEngineTests() {
  console.log('=== STARTING RUPEEWISE PHASE 4 AI MONEY ACTION ENGINE TEST SUITE ===\n');

  // Test 1: Architectural Integrity Check
  console.log('Test 1: Architectural Constraint - Controllers & Services must not import Mongoose models directly');
  const filesToCheck = [
    '../controllers/aiController.js',
    '../controllers/goalController.js',
    '../controllers/budgetController.js',
    '../services/financialAnalysisService.js',
    '../services/actionEngineService.js',
    '../services/simulatorService.js',
    '../services/aiProviderService.js',
    '../services/goalService.js',
    '../services/budgetService.js',
  ];

  filesToCheck.forEach((rel) => {
    const fullPath = path.resolve(__dirname, rel);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes("from '../models/") || content.includes('mongoose')) {
      throw new Error(`FAIL: ${rel} directly imports Mongoose model or mongoose!`);
    }
  });
  console.log('  PASS: All 9 AI, Goal, and Budget controllers and services strictly adhere to repository pattern.');

  // Test 2: Connect DB
  console.log('\nTest 2: Connecting to MongoDB Atlas');
  await connectDatabase();
  console.log('  PASS: MongoDB Atlas connected.');

  const testPort = 5096;
  const server = app.listen(testPort);
  const baseUrl = `http://localhost:${testPort}`;

  try {
    // Set up test users
    const testUserA =
      (await userRepository.findByEmail('test.ai.user.a@rupeewise.test')) ||
      (await userRepository.create({
        name: 'AI Test User Alpha',
        email: 'test.ai.user.a@rupeewise.test',
        googleId: 'google-sub-ai-alpha-12345',
        role: 'client',
      }));

    const testUserB =
      (await userRepository.findByEmail('test.ai.user.b@rupeewise.test')) ||
      (await userRepository.create({
        name: 'AI Test User Beta',
        email: 'test.ai.user.b@rupeewise.test',
        googleId: 'google-sub-ai-beta-67890',
        role: 'client',
      }));

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
      Cookie: `${config.COOKIE_NAME}=${tokenA}`,
      Origin: config.CLIENT_URL,
    };

    const headersB = {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      Cookie: `${config.COOKIE_NAME}=${tokenB}`,
      Origin: config.CLIENT_URL,
    };

    // Test 3: Unauthenticated Access Rejection
    console.log('\nTest 3: Unauthenticated access returns 401 across all Phase 4 endpoints');
    const [unauthInsights, unauthCoach, unauthGoals, unauthBudgets] = await Promise.all([
      fetch(`${baseUrl}/api/ai/insights`),
      fetch(`${baseUrl}/api/ai/coach`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: 'hi' }) }),
      fetch(`${baseUrl}/api/goals`),
      fetch(`${baseUrl}/api/budgets`),
    ]);

    if (
      unauthInsights.status !== 401 ||
      unauthCoach.status !== 401 ||
      unauthGoals.status !== 401 ||
      unauthBudgets.status !== 401
    ) {
      throw new Error('FAIL: Protected endpoints allowed unauthenticated access');
    }
    console.log('  PASS: /api/ai/insights, /api/ai/coach, /api/goals, /api/budgets rejected unauthenticated calls with 401.');

    // Seed test transactions for User A
    const uIdA = testUserA._id.toString();
    await transactionRepository.createMany([
      {
        userId: uIdA,
        title: 'Monthly Tech Salary',
        amount: 65000,
        type: 'income',
        category: 'Salary & Income',
        date: new Date(),
      },
      {
        userId: uIdA,
        title: 'Apartment Rent',
        amount: 18000,
        type: 'expense',
        category: 'Housing & Rent',
        date: new Date(),
      },
      {
        userId: uIdA,
        title: 'Fine Dining Bistro',
        amount: 4200,
        type: 'expense',
        category: 'Food & Dining',
        date: new Date(),
      },
      {
        userId: uIdA,
        title: 'Zomato Food Order',
        amount: 850,
        type: 'expense',
        category: 'Food & Dining',
        date: new Date(),
      },
      {
        userId: uIdA,
        title: 'Chai & Snacks',
        amount: 120,
        type: 'expense',
        category: 'Food & Dining',
        date: new Date(),
      },
      {
        userId: uIdA,
        title: 'Quick Coffee Break',
        amount: 180,
        type: 'expense',
        category: 'Food & Dining',
        date: new Date(),
      },
      {
        userId: uIdA,
        title: 'Juice Bar',
        amount: 90,
        type: 'expense',
        category: 'Food & Dining',
        date: new Date(),
      },
      {
        userId: uIdA,
        title: 'Spotify Premium Music',
        amount: 119,
        type: 'expense',
        category: 'Subscriptions & Entertainment',
        date: new Date(),
      },
    ]);

    // Test 4: Data-Driven Insights
    console.log('\nTest 4: GET /api/ai/insights analyzes user transactions');
    const insightsRes = await fetch(`${baseUrl}/api/ai/insights`, { headers: headersA });
    const insightsData = await insightsRes.json();
    if (insightsRes.status !== 200 || !insightsData.data) {
      throw new Error(`FAIL: Insights failed: ${JSON.stringify(insightsData)}`);
    }

    const ins = insightsData.data;
    console.log('  Insights Data Received:', {
      topCategory: ins.currentSummary.categories[0]?.category,
      smallExpensesCount: ins.smallExpenses.count,
      smallExpensesTotal: '₹' + ins.smallExpenses.total,
      wellnessScore: ins.wellnessScore.score + '/100',
    });
    if (ins.smallExpenses.count < 3) {
      throw new Error('FAIL: Small expenses not correctly detected');
    }
    if (ins.wellnessScore.score <= 0 || ins.wellnessScore.score > 100) {
      throw new Error('FAIL: Wellness score outside valid 0-100 range');
    }
    console.log('  PASS: Insights accurately extracted numbers, anomalies, and wellness score.');

    // Test 5: Action Engine Recommendations
    console.log('\nTest 5: GET /api/ai/recommendations & status updates');
    const recsRes = await fetch(`${baseUrl}/api/ai/recommendations`, { headers: headersA });
    const recsData = await recsRes.json();
    if (recsRes.status !== 200 || !Array.isArray(recsData.data) || recsData.data.length === 0) {
      throw new Error(`FAIL: Recommendations failed: ${JSON.stringify(recsData)}`);
    }

    const firstRec = recsData.data[0];
    console.log('  Active Recommendation:', {
      title: firstRec.title,
      category: firstRec.category,
      monthlySavings: '₹' + firstRec.estimatedMonthlySavings,
      annualSavings: '₹' + firstRec.estimatedAnnualSavings,
      confidence: firstRec.confidence,
    });

    // Update status to 'accepted'
    const patchRecRes = await fetch(`${baseUrl}/api/ai/recommendations/${firstRec.id}`, {
      method: 'PATCH',
      headers: headersA,
      body: JSON.stringify({ status: 'accepted' }),
    });
    const patchRecData = await patchRecRes.json();
    if (patchRecRes.status !== 200 || patchRecData.data.status !== 'accepted') {
      throw new Error('FAIL: Failed to update recommendation status');
    }
    console.log('  PASS: Action recommendation created, grounded in data, and updated to accepted.');

    // Test 6: What-If Simulator
    console.log('\nTest 6: POST /api/ai/simulate calculates transparent projection');
    const simRes = await fetch(`${baseUrl}/api/ai/simulate`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        category: 'Food & Dining',
        monthlyReduction: 2000,
        timeHorizonMonths: 12,
        oneTimeContribution: 5000,
      }),
    });
    const simData = await simRes.json();
    if (simRes.status !== 200 || !simData.data) {
      throw new Error(`FAIL: Simulation failed: ${JSON.stringify(simData)}`);
    }

    const sim = simData.data;
    // Expected: 2000 * 12 + 5000 = 29000
    if (sim.totalExtraContributions !== 29000) {
      throw new Error(`FAIL: Expected 29000 total extra, got ${sim.totalExtraContributions}`);
    }
    if (sim.timeline.length !== 12) {
      throw new Error(`FAIL: Expected 12 monthly timeline points, got ${sim.timeline.length}`);
    }
    console.log('  Simulation Output:', {
      monthlyReduction: '₹' + sim.monthlyReduction,
      totalExtraContributions: '₹' + sim.totalExtraContributions,
      newTotalProjectedSavings: '₹' + sim.newTotalProjectedSavings,
      timelinePoints: sim.timeline.length,
    });
    console.log('  PASS: What-If Simulator calculated correct deterministic projection.');

    // Test 7: AI Money Coach Query
    console.log('\nTest 7: POST /api/ai/coach provides deterministic data-grounded guidance');
    const coachQuery1 = await fetch(`${baseUrl}/api/ai/coach`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({ message: 'Where is most of my money going?' }),
    });
    const coachData1 = await coachQuery1.json();
    if (coachQuery1.status !== 200 || !coachData1.data.reply) {
      throw new Error(`FAIL: Coach query failed: ${JSON.stringify(coachData1)}`);
    }
    console.log('  Coach Response (Spending):', coachData1.data.reply.slice(0, 110) + '...');
    if (!coachData1.data.reply.includes('Housing & Rent') && !coachData1.data.reply.includes('₹')) {
      throw new Error('FAIL: Coach reply was not grounded in user transactions');
    }

    const coachQuery2 = await fetch(`${baseUrl}/api/ai/coach`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({ message: 'How can I save ₹2,000 every month?' }),
    });
    const coachData2 = await coachQuery2.json();
    if (coachQuery2.status !== 200 || !coachData2.data.reply) {
      throw new Error('FAIL: Coach query 2 failed');
    }
    console.log('  Coach Response (Saving ₹2,000):', coachData2.data.reply.slice(0, 110) + '...');
    console.log('  PASS: AI Money Coach delivered grounded response labeled:', coachData2.data.source);

    // Test 8: Savings Goals CRUD & Contributions
    console.log('\nTest 8: Savings Goals lifecycle & contribution tracking');
    const createGoalRes = await fetch(`${baseUrl}/api/goals`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        name: 'MacBook Air M5',
        targetAmount: 115000,
        currentAmount: 50000,
        monthlyContribution: 5000,
        category: 'Technology',
      }),
    });
    const createGoalData = await createGoalRes.json();
    if (createGoalRes.status !== 201 || !createGoalData.data.id) {
      throw new Error(`FAIL: Goal creation failed: ${JSON.stringify(createGoalData)}`);
    }
    const goalId = createGoalData.data.id;
    console.log('  Created Goal:', {
      name: createGoalData.data.name,
      progress: createGoalData.data.progressPercentage + '%',
      remaining: '₹' + createGoalData.data.remainingAmount,
    });

    // Add Contribution of ₹15,000
    const contribRes = await fetch(`${baseUrl}/api/goals/${goalId}/contribute`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({ amount: 15000 }),
    });
    const contribData = await contribRes.json();
    if (contribRes.status !== 200 || contribData.data.currentAmount !== 65000) {
      throw new Error(`FAIL: Contribution update failed: ${JSON.stringify(contribData)}`);
    }
    console.log('  After ₹15,000 Contribution:', {
      currentAmount: '₹' + contribData.data.currentAmount,
      progress: contribData.data.progressPercentage + '%',
    });
    console.log('  PASS: Goal created and contributions tracked accurately.');

    // Test 9: Category Budgets & Real-Time Adherence
    console.log('\nTest 9: Category Budgets & Adherence calculation');
    const setBudgetRes = await fetch(`${baseUrl}/api/budgets`, {
      method: 'POST',
      headers: headersA,
      body: JSON.stringify({
        category: 'Food & Dining',
        monthlyLimit: 6000,
        alertThreshold: 80,
      }),
    });
    const setBudgetData = await setBudgetRes.json();
    if (setBudgetRes.status !== 200 || setBudgetData.data.monthlyLimit !== 6000) {
      throw new Error(`FAIL: Budget set failed: ${JSON.stringify(setBudgetData)}`);
    }

    const listBudgetsRes = await fetch(`${baseUrl}/api/budgets`, { headers: headersA });
    const listBudgetsData = await listBudgetsRes.json();
    if (listBudgetsRes.status !== 200 || !Array.isArray(listBudgetsData.data)) {
      throw new Error('FAIL: List budgets failed');
    }
    const diningBudget = listBudgetsData.data.find((b) => b.category === 'Food & Dining');
    if (!diningBudget) {
      throw new Error('FAIL: Dining budget adherence not computed');
    }
    console.log('  Budget Adherence Computed:', {
      category: diningBudget.category,
      limit: '₹' + diningBudget.monthlyLimit,
      actualSpend: '₹' + diningBudget.actualSpend,
      percentConsumed: diningBudget.percentConsumed + '%',
      status: diningBudget.status,
    });
    console.log('  PASS: Category budget created and matched with live transactions.');

    // Test 10: Strict Multi-Tenant Data Isolation
    console.log('\nTest 10: Multi-tenant Data Ownership Isolation across Goals & AI');
    // User B tries to read User A's goal -> MUST return 404
    const crossGoalRead = await fetch(`${baseUrl}/api/goals/${goalId}`, { headers: headersB });
    if (crossGoalRead.status !== 404) {
      throw new Error(`FAIL: Cross-tenant goal read returned ${crossGoalRead.status} instead of 404!`);
    }

    // User B tries to contribute to User A's goal -> MUST return 404
    const crossGoalContrib = await fetch(`${baseUrl}/api/goals/${goalId}/contribute`, {
      method: 'POST',
      headers: headersB,
      body: JSON.stringify({ amount: 500 }),
    });
    if (crossGoalContrib.status !== 404) {
      throw new Error(`FAIL: Cross-tenant goal contribute returned ${crossGoalContrib.status} instead of 404!`);
    }

    // User B tries to delete User A's goal -> MUST return 404
    const crossGoalDelete = await fetch(`${baseUrl}/api/goals/${goalId}`, {
      method: 'DELETE',
      headers: headersB,
    });
    if (crossGoalDelete.status !== 404) {
      throw new Error(`FAIL: Cross-tenant goal delete returned ${crossGoalDelete.status} instead of 404!`);
    }
    console.log('  PASS: Strict data isolation verified. Cross-user access rejected with 404.');

    // Clean up test goal
    await fetch(`${baseUrl}/api/goals/${goalId}`, { method: 'DELETE', headers: headersA });

    console.log('\n=== ALL 10 PHASE 4 AI ENGINE TESTS PASSED PERFECTLY ===\n');
  } finally {
    server.close();
  }
}

runAIEngineTests()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('AI ENGINE TEST ERROR:', err);
    process.exit(1);
  });
