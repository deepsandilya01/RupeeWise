import { OAuth2Client } from 'google-auth-library';
import bcrypt from 'bcryptjs';
import config from '../config/env.js';
import userRepository from '../repositories/userRepository.js';
import activityLogRepository from '../repositories/activityLogRepository.js';
import transactionRepository from '../repositories/transactionRepository.js';
import goalRepository from '../repositories/goalRepository.js';
import budgetRepository from '../repositories/budgetRepository.js';
import { generateToken } from '../utils/token.js';
import { isDatabaseReady } from '../config/database.js';

let googleClient = null;

const getGoogleClient = () => {
  if (!googleClient && config.GOOGLE_CLIENT_ID) {
    googleClient = new OAuth2Client(config.GOOGLE_CLIENT_ID);
  }
  return googleClient;
};

export const authService = {
  /**
   * Register a new user with email and password
   * @param {Object} params
   * @param {string} params.name
   * @param {string} params.email
   * @param {string} params.password
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async registerWithEmailPassword({ name, email, password }) {
    if (!isDatabaseReady()) {
      const err = new Error('Persistent database is currently unavailable. Registration cannot proceed.');
      err.statusCode = 503;
      throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedName = name.trim();

    // Check duplicate account
    const existingUser = await userRepository.findByEmail(normalizedEmail);
    if (existingUser) {
      const err = new Error('An account with this email address already exists.');
      err.statusCode = 409;
      throw err;
    }

    // Secure password hashing with salt cost factor 12
    const passwordHash = await bcrypt.hash(password, 12);
    const expectedRole = config.isAdminEmail(normalizedEmail) ? 'admin' : 'client';

    const user = await userRepository.create({
      name: normalizedName,
      email: normalizedEmail,
      passwordHash,
      role: expectedRole,
      authMethod: 'local',
      isDemo: false,
    });

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    activityLogRepository.create({
      type: 'user_registered',
      actorId: user._id,
      actorName: user.name,
      actorEmail: user.email,
      summary: `User '${user.email}' registered with email/password (${user.role})`,
    }).catch(() => {});

    return {
      user: user.toSafeObject(),
      token,
    };
  },

  /**
   * Authenticate an existing user with email and password
   * @param {Object} params
   * @param {string} params.email
   * @param {string} params.password
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async loginWithEmailPassword({ email, password }) {
    if (!isDatabaseReady()) {
      const err = new Error('Persistent database is currently unavailable. Authentication cannot proceed.');
      err.statusCode = 503;
      throw err;
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await userRepository.findByEmailWithPassword(normalizedEmail);

    // Generic error message preventing account enumeration
    if (!user || !user.passwordHash) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      const err = new Error('Invalid email or password.');
      err.statusCode = 401;
      throw err;
    }

    // Dynamic role revocation or synchronization
    const expectedRole = config.isAdminEmail(user.email) ? 'admin' : 'client';
    if (user.role !== expectedRole) {
      await userRepository.updateById(user._id, { role: expectedRole });
      user.role = expectedRole;
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    activityLogRepository.create({
      type: 'user_login',
      actorId: user._id,
      actorName: user.name,
      actorEmail: user.email,
      summary: `User '${user.email}' signed in via email/password (${user.role})`,
    }).catch(() => {});

    return {
      user: user.toSafeObject(),
      token,
    };
  },

  /**
   * Provision or sign into an isolated, server-authorized demonstration account
   * @param {string} role - 'client' | 'admin'
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async loginDemoAccount(role) {
    if (!isDatabaseReady()) {
      const err = new Error('Persistent database is currently unavailable. Demo authentication cannot proceed.');
      err.statusCode = 503;
      throw err;
    }

    if (!['client', 'admin'].includes(role)) {
      const err = new Error('Invalid demo role requested.');
      err.statusCode = 400;
      throw err;
    }

    const isDemoAdmin = role === 'admin';
    const demoEmail = isDemoAdmin ? 'demo-admin@rupeewise.ai' : 'demo-client@rupeewise.ai';
    const demoName = isDemoAdmin ? 'Demo Admin' : 'Demo Client';
    const assignedRole = isDemoAdmin ? 'admin' : 'client';

    let user = await userRepository.findByEmail(demoEmail);

    if (!user) {
      user = await userRepository.create({
        name: demoName,
        email: demoEmail,
        role: assignedRole,
        isDemo: true,
        authMethod: 'demo',
      });
    } else {
      // Ensure demo account flags and expected role match
      if (user.role !== assignedRole || !user.isDemo) {
        user = await userRepository.updateById(user._id, {
          role: assignedRole,
          isDemo: true,
          authMethod: 'demo',
        });
      }
    }

    // For client demo, ensure rich sample data is available for exploration
    if (!isDemoAdmin) {
      const transactionCount = await transactionRepository.count({ userId: user._id });
      if (transactionCount === 0) {
        const now = new Date();
        const demoTransactions = [
          {
            userId: user._id,
            title: 'Monthly Tech Salary',
            amount: 85000,
            type: 'income',
            category: 'Salary & Income',
            paymentMethod: 'Net Banking',
            date: new Date(now.getFullYear(), now.getMonth(), 1),
            notes: 'Monthly direct bank deposit',
          },
          {
            userId: user._id,
            title: 'Modern Apartment Rent',
            amount: 22000,
            type: 'expense',
            category: 'Housing & Rent',
            paymentMethod: 'Net Banking',
            date: new Date(now.getFullYear(), now.getMonth(), 3),
            notes: 'Monthly residential lease',
          },
          {
            userId: user._id,
            title: 'Nature Basket Organic Groceries',
            amount: 4850,
            type: 'expense',
            category: 'Food & Dining',
            paymentMethod: 'UPI',
            date: new Date(now.getFullYear(), now.getMonth(), 6),
            notes: 'Weekly pantry replenishment',
          },
          {
            userId: user._id,
            title: 'Nifty 50 Index Mutual Fund SIP',
            amount: 15000,
            type: 'expense',
            category: 'Investments & Savings',
            paymentMethod: 'Net Banking',
            date: new Date(now.getFullYear(), now.getMonth(), 10),
            notes: 'Automated recurring wealth accumulation',
          },
          {
            userId: user._id,
            title: 'Artisan Cafe & Weekend Brunch',
            amount: 2450,
            type: 'expense',
            category: 'Food & Dining',
            paymentMethod: 'Credit Card',
            date: new Date(now.getFullYear(), now.getMonth(), 12),
            notes: 'Social gathering & coffee',
          },
          {
            userId: user._id,
            title: 'High-Speed Fiber Broadband',
            amount: 1499,
            type: 'expense',
            category: 'Utilities',
            paymentMethod: 'UPI',
            date: new Date(now.getFullYear(), now.getMonth(), 14),
            notes: 'Work from home internet connection',
          },
          {
            userId: user._id,
            title: 'Freelance Design Consultation',
            amount: 25000,
            type: 'income',
            category: 'Salary & Income',
            paymentMethod: 'UPI',
            date: new Date(now.getFullYear(), now.getMonth(), 16),
            notes: 'Fintech design sprint deliverables',
          },
          {
            userId: user._id,
            title: 'Premium Streaming & Music Subs',
            amount: 1199,
            type: 'expense',
            category: 'Subscriptions & Entertainment',
            paymentMethod: 'Credit Card',
            date: new Date(now.getFullYear(), now.getMonth(), 18),
            notes: 'Netflix, Spotify & cloud storage',
          },
        ];

        await transactionRepository.createMany(demoTransactions);
        await budgetRepository.upsert(user._id.toString(), 'Food & Dining', 12000, 80);
        await budgetRepository.upsert(user._id.toString(), 'Housing & Rent', 25000, 90);
        await budgetRepository.upsert(user._id.toString(), 'Investments & Savings', 20000, 75);

        await goalRepository.create({
          userId: user._id,
          name: 'Emergency Reserve Fund (6 Months)',
          targetAmount: 200000,
          currentAmount: 135000,
          targetDate: new Date(now.getFullYear() + 1, now.getMonth(), 1),
          category: 'emergency_fund',
        });
        await goalRepository.create({
          userId: user._id,
          name: 'MacBook Pro M3 Max Workstation',
          targetAmount: 180000,
          currentAmount: 95000,
          targetDate: new Date(now.getFullYear(), now.getMonth() + 4, 1),
          category: 'gadget',
        });
      }
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    activityLogRepository.create({
      type: 'user_login',
      actorId: user._id,
      actorName: user.name,
      actorEmail: user.email,
      summary: `Demonstration account '${user.email}' signed in (${user.role})`,
    }).catch(() => {});

    return {
      user: user.toSafeObject(),
      token,
    };
  },
  /**
   * Verify Google ID token and authenticate/provision user
   * @param {string} credential - Google ID credential from GIS
   * @returns {Promise<{ user: Object, token: string }>}
   */
  async loginWithGoogle(credential) {
    if (!credential || typeof credential !== 'string') {
      const err = new Error('Google credential is required and must be a valid string');
      err.statusCode = 400;
      throw err;
    }

    if (!config.GOOGLE_CLIENT_ID) {
      const err = new Error('Google OAuth Client ID is not configured on the server');
      err.statusCode = 500;
      throw err;
    }

    // Verify Google ID token using google-auth-library
    const client = getGoogleClient();
    let ticket;
    const allowedAudiences =
      config.googleClientIds && config.googleClientIds.length > 0
        ? config.googleClientIds
        : config.GOOGLE_CLIENT_ID;

    try {
      ticket = await client.verifyIdToken({
        idToken: credential,
        audience: allowedAudiences,
      });
    } catch (verifyError) {
      const err = new Error(`Google token verification failed: ${verifyError.message}`);
      err.statusCode = 401;
      throw err;
    }

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email) {
      const err = new Error('Invalid Google token payload: missing required identity fields');
      err.statusCode = 401;
      throw err;
    }

    // Enforce email verification by Google
    if (!payload.email_verified) {
      const err = new Error('Google account email is not verified');
      err.statusCode = 403;
      throw err;
    }

    // Ensure database is connected before persistence operations
    if (!isDatabaseReady()) {
      const err = new Error('Persistent database is currently unavailable. Authentication cannot proceed.');
      err.statusCode = 503;
      throw err;
    }

    const googleId = payload.sub;
    const email = payload.email.toLowerCase().trim();
    const name = payload.name || email.split('@')[0];
    const picture = payload.picture || '';

    // Determine role based on server-side allowlist (trusted server config only)
    const expectedRole = config.isAdminEmail(email) ? 'admin' : 'client';

    // 1. Look up existing user by Google subject ID
    let user = await userRepository.findByGoogleId(googleId);

    if (user) {
      // User exists with this Google ID: update profile and sync role with current server allowlist
      const updates = {};
      if (user.name !== name) updates.name = name;
      if (user.picture !== picture) updates.picture = picture;
      if (user.role !== expectedRole) updates.role = expectedRole;

      if (Object.keys(updates).length > 0) {
        user = await userRepository.updateById(user._id, updates);
      }
    } else {
      // Check if a user with this email already exists
      const existingUserByEmail = await userRepository.findByEmail(email);

      if (existingUserByEmail) {
        // Account linking policy: if email matches and user was not linked yet
        if (!existingUserByEmail.googleId) {
          user = await userRepository.updateById(existingUserByEmail._id, {
            googleId,
            name: existingUserByEmail.name || name,
            picture: picture || existingUserByEmail.picture,
            role: expectedRole,
          });
        } else {
          // A different Google ID is already bound to this email address!
          const err = new Error('Account conflict: this email is already linked to a different provider identity.');
          err.statusCode = 409;
          throw err;
        }
      } else {
        // Provision new user
        user = await userRepository.create({
          name,
          email,
          googleId,
          picture,
          role: expectedRole,
        });
      }
    }

    const token = generateToken({
      userId: user._id.toString(),
      role: user.role,
    });

    // Record non-sensitive authentication activity
    activityLogRepository.create({
      type: 'user_login',
      actorId: user._id,
      actorName: user.name,
      actorEmail: user.email,
      summary: `User '${user.email}' signed in via Google OAuth (${user.role})`,
    }).catch(() => {});

    return {
      user: typeof user.toSafeObject === 'function' ? user.toSafeObject() : {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        picture: user.picture,
        role: user.role,
      },
      token,
    };
  },

  /**
   * Get current authenticated user details from database and verify role allowlist
   * @param {string} userId
   * @returns {Promise<Object>}
   */
  async getCurrentUser(userId) {
    if (!isDatabaseReady()) {
      const err = new Error('Database is currently unavailable');
      err.statusCode = 503;
      throw err;
    }

    const user = await userRepository.findById(userId);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    // Dynamic role revocation check: verify if role needs update based on ADMIN_EMAILS
    const expectedRole = config.isAdminEmail(user.email) ? 'admin' : 'client';
    if (user.role !== expectedRole) {
      const updatedUser = await userRepository.updateById(user._id, { role: expectedRole });
      return updatedUser.toSafeObject();
    }

    return user.toSafeObject();
  },

  /**
   * Admin overview metrics query through repository
   * @returns {Promise<Object>}
   */
  async getAdminOverview() {
    if (!isDatabaseReady()) {
      const err = new Error('Database is currently unavailable');
      err.statusCode = 503;
      throw err;
    }

    const [totalUsers, clientCount, adminCount, recentUsers] = await Promise.all([
      userRepository.count(),
      userRepository.count({ role: 'client' }),
      userRepository.count({ role: 'admin' }),
      userRepository.find({}, { limit: 10, skip: 0 }),
    ]);

    return {
      metrics: {
        totalUsers,
        clientCount,
        adminCount,
      },
      recentUsers: recentUsers.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        picture: u.picture,
        createdAt: u.createdAt,
      })),
      timestamp: new Date().toISOString(),
    };
  },
};

export default authService;
