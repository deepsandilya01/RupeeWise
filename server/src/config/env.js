import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from server directory
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const NODE_ENV = process.env.NODE_ENV || 'development';
const isProduction = NODE_ENV === 'production';

// Parse admin emails into normalized lowercase Set
const rawAdminEmails = process.env.ADMIN_EMAILS || '';
const adminEmails = new Set(
  rawAdminEmails
    .split(',')
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean)
);

// Parse and normalize Google Client IDs (supports comma-separated list of allowed client IDs)
const rawGoogleClientIds = (process.env.GOOGLE_CLIENT_ID || '').trim();
const googleClientIds = rawGoogleClientIds
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);
const primaryGoogleClientId = googleClientIds[0] || '';

export const config = {
  NODE_ENV,
  isProduction,
  PORT: parseInt(process.env.PORT, 10) || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || '',
  GOOGLE_CLIENT_ID: primaryGoogleClientId,
  googleClientIds,
  JWT_SECRET: process.env.JWT_SECRET || (isProduction ? '' : 'paisapilot_dev_jwt_secret_change_in_production_32char_key!'),
  JWT_EXPIRES_IN: '7d',
  COOKIE_NAME: 'paisapilot_token',
  COOKIE_MAX_AGE_MS: 7 * 24 * 60 * 60 * 1000, // 7 days
  adminEmails,
  isAdminEmail: (email) => {
    if (!email) return false;
    const normalized = email.toLowerCase().trim();
    return adminEmails.has(normalized) || normalized === 'demo-admin@rupeewise.ai';
  },
  // AI Provider Configuration (Maps both existing GEMINI_API / MISTRAL_API and standard names)
  GEMINI_API_KEY: (process.env.GEMINI_API_KEY || process.env.GEMINI_API || '').trim(),
  MISTRAL_API_KEY: (process.env.MISTRAL_API_KEY || process.env.MISTRAL_API || '').trim(),
  GEMINI_MODEL: (process.env.GEMINI_MODEL || 'gemini-3.5-flash-lite').trim(),
  MISTRAL_MODEL: (process.env.MISTRAL_MODEL || 'ministral-8b-latest').trim(),
  AI_PROVIDER: (process.env.AI_PROVIDER || 'auto').trim().toLowerCase(),
  AI_TIMEOUT_MS: parseInt(process.env.AI_TIMEOUT_MS, 10) || 10000,
  getSafeAiConfig: () => ({
    activeProvider: config.AI_PROVIDER,
    providers: {
      gemini: {
        configured: Boolean(config.GEMINI_API_KEY),
        model: config.GEMINI_MODEL,
      },
      mistral: {
        configured: Boolean(config.MISTRAL_API_KEY),
        model: config.MISTRAL_MODEL,
      },
      rulesEngine: {
        configured: true,
        model: 'RupeeWise Deterministic Financial Rules Engine',
      },
    },
    timeoutMs: config.AI_TIMEOUT_MS,
  }),
};

export default config;
