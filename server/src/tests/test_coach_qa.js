import { connectDatabase } from '../config/database.js';
import userRepository from '../repositories/userRepository.js';
import { generateToken } from '../services/authService.js';
import config from '../config/env.js';

async function testCoachQuestions() {
  await connectDatabase();
  const testUser = await userRepository.findByEmail('demo-client@rupeewise.ai');
  if (!testUser) {
    console.error('Demo client not found');
    process.exit(1);
  }

  const token = generateToken({ userId: testUser._id.toString(), role: testUser.role });
  const cookieHeader = `${config.COOKIE_NAME}=${token}`;

  const questions = [
    'What is a mutual fund SIP and should I start one?',
    'How much should I keep in an emergency fund?',
    'Where is most of my money going this month?',
    'Hi, who are you and how can you help me?'
  ];

  for (const q of questions) {
    console.log(`\n========================================`);
    console.log(`TEST QUERY: "${q}"`);
    console.log(`========================================`);

    const res = await fetch('http://localhost:5000/api/ai/coach', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': cookieHeader,
        'X-RupeeWise-Client': 'web',
        'X-Requested-With': 'XMLHttpRequest'
      },
      body: JSON.stringify({ message: q, provider: 'auto' })
    });

    const data = await res.json();
    if (!res.ok || !data.success) {
      console.error('FAIL:', data);
      continue;
    }

    console.log(`Provider: ${data.data.provider} (${data.data.model})`);
    if (data.data.fallbackReason) {
      console.log(`Fallback Note: ${data.data.fallbackReason}`);
    }
    console.log(`Reply Preview:\n${data.data.reply.substring(0, 300)}...`);
  }

  process.exit(0);
}

testCoachQuestions().catch(err => {
  console.error(err);
  process.exit(1);
});
