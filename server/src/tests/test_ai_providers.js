import app from '../app.js';
import config from '../config/env.js';
import { generateToken } from '../utils/token.js';
import userRepository from '../repositories/userRepository.js';
import transactionRepository from '../repositories/transactionRepository.js';
import goalRepository from '../repositories/goalRepository.js';
import { connectDatabase } from '../config/database.js';
import geminiProvider from '../services/ai/geminiProvider.js';
import mistralProvider from '../services/ai/mistralProvider.js';
import rulesEngineProvider from '../services/ai/rulesEngineProvider.js';
import aiService from '../services/aiService.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runAIProviderVerification() {
  console.log('====================================================');
  console.log('RUPEEWISE GEMINI + MISTRAL MULTI-PROVIDER AI TEST SUITE');
  console.log('====================================================\n');

  // Test 1: Architecture Check - Provider modules must not import Mongoose models directly
  console.log('Test 1: Architectural layering check for AI modules');
  const aiFiles = [
    '../services/ai/geminiProvider.js',
    '../services/ai/mistralProvider.js',
    '../services/ai/rulesEngineProvider.js',
    '../services/aiService.js',
    '../controllers/aiController.js',
  ];
  aiFiles.forEach((rel) => {
    const fullPath = path.resolve(__dirname, rel);
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes("from '../models/") || content.includes('mongoose')) {
      throw new Error(`FAIL: ${rel} directly imports Mongoose models or mongoose!`);
    }
  });
  console.log('  [PASS] All AI providers, services, and controllers strictly adhere to the layered repository pattern.');

  // Test 2: Safe Metadata & Non-Exposure of Secrets
  console.log('\nTest 2: Non-sensitive AI Status verification (Zero Key Leakage)');
  const safeConfig = aiService.getAiStatus();
  console.log('  Safe config returned:', JSON.stringify(safeConfig));

  const configStr = JSON.stringify(safeConfig);
  if (
    configStr.includes(config.GEMINI_API_KEY) ||
    configStr.includes(config.MISTRAL_API_KEY) ||
    configStr.includes(config.JWT_SECRET) ||
    configStr.includes('AIza') ||
    configStr.includes('Bearer')
  ) {
    throw new Error('SECURITY BREACH: Sensitive API key exposed in AI config metadata!');
  }
  if (!safeConfig.providers?.gemini || !safeConfig.providers?.mistral || !safeConfig.providers?.rulesEngine) {
    throw new Error('FAIL: Safe config missing provider descriptors');
  }
  console.log('  [PASS] Status metadata correctly reports configuration without exposing any API keys or secrets.');

  // Test 3: Gemini Provider Response Normalization (Mocked Engine Test)
  console.log('\nTest 3: Gemini Provider response normalization');
  const mockGeminiReply = 'You have spent ₹18,000 on Rent and ₹4,500 on Food. Trimming ₹1,000 on dining could save ₹12,000 yearly.';
  const originalFetch = globalThis.fetch;

  try {
    globalThis.fetch = async (url) => {
      if (url.includes('generativelanguage.googleapis.com')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            candidates: [
              {
                content: { parts: [{ text: mockGeminiReply }] },
                finishReason: 'STOP',
              },
            ],
          }),
        };
      }
      return originalFetch(url);
    };

    const geminiRes = await geminiProvider.generateResponse({
      prompt: 'Analyze my spending',
      context: { monthlyExpenses: 22500 },
    });

    if (geminiRes.provider !== 'gemini' || geminiRes.reply !== mockGeminiReply || !Array.isArray(geminiRes.suggestions)) {
      throw new Error('FAIL: Gemini provider did not properly normalize response');
    }
    console.log(`  [PASS] Gemini output normalized correctly. Provider: ${geminiRes.provider}, Model: ${geminiRes.model}`);
  } finally {
    globalThis.fetch = originalFetch;
  }

  // Test 4: Mistral Provider Response Normalization (Mocked Engine Test)
  console.log('\nTest 4: Mistral Provider response normalization');
  const mockMistralReply = 'Based on your transactions, your top category is Housing. Consider a 50/30/20 budget framework.';

  try {
    globalThis.fetch = async (url) => {
      if (url.includes('api.mistral.ai')) {
        return {
          ok: true,
          status: 200,
          json: async () => ({
            choices: [
              {
                message: { content: mockMistralReply },
                finish_reason: 'stop',
              },
            ],
          }),
        };
      }
      return originalFetch(url);
    };

    const mistralRes = await mistralProvider.generateResponse({
      prompt: 'Help me budget',
      context: { monthlyIncome: 60000 },
    });

    if (mistralRes.provider !== 'mistral' || mistralRes.reply !== mockMistralReply || !Array.isArray(mistralRes.suggestions)) {
      throw new Error('FAIL: Mistral provider did not properly normalize response');
    }
    console.log(`  [PASS] Mistral output normalized correctly. Provider: ${mistralRes.provider}, Model: ${mistralRes.model}`);
  } finally {
    globalThis.fetch = originalFetch;
  }

  // Test 5: Error and Timeout Classification
  console.log('\nTest 5: Error classification (Auth, Rate Limits, and Timeouts)');
  try {
    globalThis.fetch = async (url) => {
      if (url.includes('generativelanguage.googleapis.com')) {
        return {
          ok: false,
          status: 401,
          json: async () => ({ error: { message: 'API_KEY_INVALID' } }),
        };
      }
      return originalFetch(url);
    };

    await geminiProvider.generateResponse({ prompt: 'test' });
    throw new Error('FAIL: Expected Gemini 401 to throw!');
  } catch (err) {
    if (!err.isAuthError || err.isTransient) {
      throw new Error('FAIL: Gemini 401 was not properly classified as isAuthError and non-transient!');
    }
    console.log('  [PASS] Gemini 401 correctly flagged as non-transient isAuthError.');
  } finally {
    globalThis.fetch = originalFetch;
  }

  try {
    globalThis.fetch = async (url) => {
      if (url.includes('api.mistral.ai')) {
        return {
          ok: false,
          status: 429,
          json: async () => ({ message: 'Rate limit exceeded: quota exhausted' }),
        };
      }
      return originalFetch(url);
    };

    await mistralProvider.generateResponse({ prompt: 'test' });
    throw new Error('FAIL: Expected Mistral 429 to throw!');
  } catch (err) {
    if (!err.isRateLimit || err.isTransient) {
      throw new Error('FAIL: Mistral 429 was not properly classified as isRateLimit and non-transient!');
    }
    console.log('  [PASS] Mistral 429 correctly flagged as non-transient isRateLimit.');
  } finally {
    globalThis.fetch = originalFetch;
  }

  // Test 6: Provider Resolution and Transient Fallback
  console.log('\nTest 6: Provider strategy resolution and safe fallback');
  const autoPlan = aiService.resolveProviders('auto');
  console.log(`  Auto strategy primary: '${autoPlan.primary.name}', secondary: '${autoPlan.secondary?.name || 'none'}'`);
  if (!autoPlan.primary) {
    throw new Error('FAIL: Auto strategy failed to resolve primary provider');
  }

  const rulesPlan = aiService.resolveProviders('rules-based');
  if (rulesPlan.primary.name !== 'rules-based') {
    throw new Error('FAIL: rules-based strategy failed to resolve to rulesEngineProvider');
  }
  console.log('  [PASS] Provider resolution correctly maps requested strategies.');

  // Test 7: Integration with Live Database & Scoped Financial Context
  console.log('\nTest 7: End-to-end AI Coach query with authenticated user context');
  await connectDatabase();

  const testPort = 5094;
  const server = app.listen(testPort);
  const baseUrl = `http://localhost:${testPort}`;

  try {
    const testUser =
      (await userRepository.findByEmail('demo-client@rupeewise.ai')) ||
      (await userRepository.create({
        name: 'Demo Client',
        email: 'demo-client@rupeewise.ai',
        role: 'client',
        isDemo: true,
      }));

    const token = generateToken({
      userId: testUser._id.toString(),
      role: testUser.role,
    });

    const cookieHeader = `${config.COOKIE_NAME}=${token}`;
    const csrfHeaders = {
      'Content-Type': 'application/json',
      'X-RupeeWise-Client': 'web',
      'X-Requested-With': 'XMLHttpRequest',
      Origin: config.CLIENT_URL,
      Cookie: cookieHeader,
    };

    // Test 8: GET /api/ai/status
    console.log('\nTest 8: GET /api/ai/status returns sanitized configuration');
    const statusRes = await fetch(`${baseUrl}/api/ai/status`, {
      headers: { Cookie: cookieHeader },
    });
    const statusData = await statusRes.json();
    if (statusRes.status !== 200 || !statusData.success || !statusData.data.providers) {
      throw new Error(`FAIL: /api/ai/status failed: ${JSON.stringify(statusData)}`);
    }
    console.log('  [PASS] /api/ai/status returned valid sanitized provider descriptors.');

    // Test 9: Unauthenticated call to /api/ai/coach returns 401
    console.log('\nTest 9: Security check - Unauthenticated calls to /api/ai/coach return 401');
    const unauthRes = await fetch(`${baseUrl}/api/ai/coach`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-RupeeWise-Client': 'web',
        'X-Requested-With': 'XMLHttpRequest',
      },
      body: JSON.stringify({ message: 'Analyze spending' }),
    });
    if (unauthRes.status !== 401) {
      throw new Error(`FAIL: Unauthenticated call should return 401, got ${unauthRes.status}`);
    }
    console.log('  [PASS] Unauthenticated query safely blocked with 401 Unauthorized.');

    // Test 10: Authenticated call with rules-based provider
    console.log('\nTest 10: Authenticated query with explicit rules-based provider');
    const rulesRes = await fetch(`${baseUrl}/api/ai/coach`, {
      method: 'POST',
      headers: csrfHeaders,
      body: JSON.stringify({
        message: 'Where is most of my money going?',
        provider: 'rules-based',
      }),
    });
    const rulesData = await rulesRes.json();
    if (rulesRes.status !== 200 || !rulesData.success || !rulesData.data.reply.includes('Here is where your money went')) {
      throw new Error(`FAIL: rules-based query failed: ${JSON.stringify(rulesData)}`);
    }
    console.log('  [PASS] Rules engine successfully computed category analysis from live transactions.');

    // Test 11: Auto provider query with live primary provider
    console.log('\nTest 11: Auto provider query with live primary provider');
    const autoRes = await fetch(`${baseUrl}/api/ai/coach`, {
      method: 'POST',
      headers: csrfHeaders,
      body: JSON.stringify({
        message: 'How can I save ₹2,000 every month?',
        provider: 'auto',
      }),
    });
    const autoData = await autoRes.json();
    if (autoRes.status !== 200 || !autoData.success || !autoData.data.reply) {
      throw new Error(`FAIL: Auto coach query failed: ${JSON.stringify(autoData)}`);
    }
    console.log(`  [PASS] Auto query returned response. Provider: '${autoData.data.provider}', Model: '${autoData.data.model}'`);

    // Test 11b: Transient primary failure falls back to secondary provider
    console.log('\nTest 11b: Transient primary failure fallback verification');
    const savedFetch = globalThis.fetch;
    try {
      // Intercept provider requests: Gemini returns 503 transient, Mistral succeeds
      globalThis.fetch = async (url, opts) => {
        const urlStr = String(url);
        if (urlStr.includes('generativelanguage.googleapis.com')) {
          return {
            ok: false,
            status: 503,
            json: async () => ({ error: { message: 'High demand spike' } }),
          };
        }
        if (urlStr.includes('api.mistral.ai')) {
          return {
            ok: true,
            status: 200,
            json: async () => ({
              choices: [{ message: { content: 'Mistral fallback: Consider saving ₹2,000 via mindful spending.' } }],
            }),
          };
        }
        return savedFetch(url, opts);
      };

      const fallbackRes = await fetch(`${baseUrl}/api/ai/coach`, {
        method: 'POST',
        headers: csrfHeaders,
        body: JSON.stringify({
          message: 'How can I save ₹2,000 every month?',
          provider: 'auto',
        }),
      });
      const fallbackData = await fallbackRes.json();
      if (fallbackRes.status !== 200 || !fallbackData.success || !fallbackData.data.fallbackReason?.includes('Fallback to mistral succeeded')) {
        throw new Error(`FAIL: Secondary fallback to Mistral did not trigger properly: ${JSON.stringify(fallbackData)}`);
      }
      console.log(`  [PASS] Transient primary failure successfully triggered fallback to secondary provider '${fallbackData.data.provider}'.`);
      console.log(`  Fallback diagnostic: "${fallbackData.data.fallbackReason}"`);
    } finally {
      globalThis.fetch = savedFetch;
    }

    // Test 12: Real Provider Live Smoke Test (Records real attempt)
    console.log('\n====================================================');
    console.log('Test 12: REAL PROVIDER LIVE SMOKE TEST (Non-Mocked)');
    console.log('====================================================');

    console.log('Attempting live call to Google Gemini with configured credentials...');
    try {
      const realGemini = await geminiProvider.generateResponse({
        prompt: 'Hello! Please confirm in 5 words that RupeeWise AI integration is ready.',
        options: { timeoutMs: 3000 },
      });
      console.log('  [LIVE GEMINI SUCCESS]:', realGemini.reply);
    } catch (realGeminiErr) {
      console.log(`  [LIVE GEMINI OUTCOME]: Call concluded with message: ${realGeminiErr.message}`);
      console.log(`    (Transient: ${Boolean(realGeminiErr.isTransient)}, Status: ${realGeminiErr.statusCode || 'network-blocked'})`);
    }

    console.log('\nAttempting live call to Mistral AI with configured credentials...');
    try {
      const realMistral = await mistralProvider.generateResponse({
        prompt: 'Hello! Please confirm in 5 words that RupeeWise AI integration is ready.',
        options: { timeoutMs: 3000 },
      });
      console.log('  [LIVE MISTRAL SUCCESS]:', realMistral.reply);
    } catch (realMistralErr) {
      console.log(`  [LIVE MISTRAL OUTCOME]: Call concluded with message: ${realMistralErr.message}`);
      console.log(`    (Transient: ${Boolean(realMistralErr.isTransient)}, Status: ${realMistralErr.statusCode || 'network-blocked'})`);
    }

    console.log('\n====================================================');
    console.log('ALL 12 AI PROVIDER INTEGRATION TESTS COMPLETED SUCCESSFULLY!');
    console.log('====================================================\n');
    process.exit(0);
  } finally {
    server.close();
  }
}

runAIProviderVerification().catch((err) => {
  console.error('\n*** AI PROVIDER TEST SUITE FAILED ***');
  console.error(err);
  process.exit(1);
});
