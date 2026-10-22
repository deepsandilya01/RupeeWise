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
      if (transactionCount < 20) {
        // Clear any minimal/outdated demo transactions and goals for this demo user to seed a rich, vibrant dataset
        await transactionRepository.deleteMany({ userId: user._id });
        await goalRepository.deleteMany({ userId: user._id });

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;

        const demoTransactions = [
          // Current Month - Incomes
          {
            userId: user._id,
            title: 'Senior Software Engineering Salary',
            amount: 85000,
            type: 'income',
            category: 'Salary & Income',
            paymentMethod: 'Net Banking',
            date: new Date(currentYear, currentMonth, 1, 9, 30),
            notes: 'Monthly direct salary transfer from tech employer',
          },
          {
            userId: user._id,
            title: 'Freelance Fintech UI/UX Project',
            amount: 25000,
            type: 'income',
            category: 'Salary & Income',
            paymentMethod: 'UPI',
            date: new Date(currentYear, currentMonth, 15, 14, 0),
            notes: 'Milestone payment for design sprint deliverables',
          },
          // Current Month - Housing & Utilities
          {
            userId: user._id,
            title: 'Modern Apartment 2BHK Rent',
            amount: 22000,
            type: 'expense',
            category: 'Housing & Rent',
            paymentMethod: 'Net Banking',
            date: new Date(currentYear, currentMonth, 3, 10, 0),
            notes: 'Monthly residential lease transfer',
          },
          {
            userId: user._id,
            title: 'High-Speed Fiber Broadband 300 Mbps',
            amount: 1499,
            type: 'expense',
            category: 'Utilities',
            paymentMethod: 'UPI',
            date: new Date(currentYear, currentMonth, 5, 11, 15),
            notes: 'Work from home internet connection',
          },
          {
            userId: user._id,
            title: 'BESCOM City Electricity Bill',
            amount: 1850,
            type: 'expense',
            category: 'Utilities',
            paymentMethod: 'Net Banking',
            date: new Date(currentYear, currentMonth, 8, 16, 20),
            notes: 'Monthly power utilities payment',
          },
          // Current Month - Food & Dining
          {
            userId: user._id,
            title: 'Nature Basket Organic Groceries',
            amount: 4850,
            type: 'expense',
            category: 'Food & Dining',
            paymentMethod: 'UPI',
            date: new Date(currentYear, currentMonth, 6, 18, 45),
            notes: 'Weekly organic pantry & farm fresh vegetables',
          },
          {
            userId: user._id,
            title: 'Zomato Office Gourmet Lunch',
            amount: 420,
            type: 'expense',
            category: 'Food & Dining',
            paymentMethod: 'UPI',
            date: new Date(currentYear, currentMonth, 9, 13, 15),
            notes: 'Team lunch bowls',
          },
          {
            userId: user._id,
            title: 'Blue Tokai Specialty Coffee & Croissant',
            amount: 380,
            type: 'expense',
            category: 'Food & Dining',
            paymentMethod: 'UPI',
            date: new Date(currentYear, currentMonth, 11, 10, 30),
            notes: 'Morning espresso and bakery treat',
          },
          {
            userId: user._id,
            title: 'Swiggy Weekend Family Feast',
            amount: 1290,
            type: 'expense',
            category: 'Food & Dining',
            paymentMethod: 'Credit Card',
            date: new Date(currentYear, currentMonth, 13, 20, 10),
            notes: 'North Indian dinner order',
          },
          {
            userId: user._id,
            title: 'Blinkit 10-Min Quick Groceries',
            amount: 620,
            type: 'expense',
            category: 'Food & Dining',
            paymentMethod: 'UPI',
            date: new Date(currentYear, currentMonth, 16, 17, 0),
            notes: 'Milk, oats, snacks & essentials',
          },
          // Current Month - Shopping
          {
            userId: user._id,
            title: 'Amazon India - Sony WH-1000XM5 Headphones',
            amount: 3499,
            type: 'expense',
            category: 'Shopping',
            paymentMethod: 'Credit Card',
            date: new Date(currentYear, currentMonth, 7, 15, 30),
            notes: 'Noise-canceling headphones for focus work',
          },
          {
            userId: user._id,
            title: 'Myntra Autumn Festive Wardrobe',
            amount: 2450,
            type: 'expense',
            category: 'Shopping',
            paymentMethod: 'UPI',
            date: new Date(currentYear, currentMonth, 14, 19, 0),
            notes: 'Casual cotton shirts and trousers',
          },
          // Current Month - Transportation
          {
            userId: user._id,
            title: 'Uber Premier to Client Tech Park',
            amount: 420,
            type: 'expense',
            category: 'Transportation',
            paymentMethod: 'UPI',
            date: new Date(currentYear, currentMonth, 4, 9, 0),
            notes: 'Morning meeting transit',
          },
          {
            userId: user._id,
            title: 'Shell Petrol / Fuel Refill',
            amount: 2100,
            type: 'expense',
            category: 'Transportation',
            paymentMethod: 'Credit Card',
            date: new Date(currentYear, currentMonth, 10, 18, 30),
            notes: 'Full tank fuel for weekend getaway',
          },
          {
            userId: user._id,
            title: 'Namma Metro Smart Card Auto-Topup',
            amount: 800,
            type: 'expense',
            category: 'Transportation',
            paymentMethod: 'UPI',
            date: new Date(currentYear, currentMonth, 17, 8, 45),
            notes: 'Daily rapid transit commute recharge',
          },
          // Current Month - Health & Fitness
          {
            userId: user._id,
            title: 'Cult.fit Elite Gym Membership Pass',
            amount: 1800,
            type: 'expense',
            category: 'Health & Medical',
            paymentMethod: 'Net Banking',
            date: new Date(currentYear, currentMonth, 2, 7, 0),
            notes: 'Monthly strength & conditioning access',
          },
          {
            userId: user._id,
            title: 'Apollo 24|7 Pharmacy Vitamins & Skincare',
            amount: 680,
            type: 'expense',
            category: 'Health & Medical',
            paymentMethod: 'UPI',
            date: new Date(currentYear, currentMonth, 12, 16, 0),
            notes: 'Daily multivitamins & Omega 3 supplements',
          },
          // Current Month - Subscriptions & Entertainment
          {
            userId: user._id,
            title: 'Netflix 4K Ultra & Spotify Family Plan',
            amount: 1199,
            type: 'expense',
            category: 'Subscriptions & Entertainment',
            paymentMethod: 'Credit Card',
            date: new Date(currentYear, currentMonth, 5, 12, 0),
            notes: 'Monthly recurring entertainment subscriptions',
          },
          {
            userId: user._id,
            title: 'BookMyShow IMAX Weekend Movie Tickets',
            amount: 840,
            type: 'expense',
            category: 'Subscriptions & Entertainment',
            paymentMethod: 'UPI',
            date: new Date(currentYear, currentMonth, 18, 21, 30),
            notes: '2 tickets for blockbuster sci-fi release',
          },
          // Current Month - Investments & Wealth
          {
            userId: user._id,
            title: 'Nifty 50 Index Mutual Fund SIP',
            amount: 15000,
            type: 'expense',
            category: 'Investments & Savings',
            paymentMethod: 'Net Banking',
            date: new Date(currentYear, currentMonth, 10, 6, 0),
            notes: 'Automated disciplined long-term compounding SIP',
          },
          {
            userId: user._id,
            title: 'Parag Parikh Flexi Cap Fund SIP',
            amount: 7500,
            type: 'expense',
            category: 'Investments & Savings',
            paymentMethod: 'Net Banking',
            date: new Date(currentYear, currentMonth, 10, 6, 5),
            notes: 'Diversified equity mutual fund accumulation',
          },
          {
            userId: user._id,
            title: 'Sovereign Digital Gold SGB Purchase',
            amount: 5000,
            type: 'expense',
            category: 'Investments & Savings',
            paymentMethod: 'Net Banking',
            date: new Date(currentYear, currentMonth, 15, 11, 0),
            notes: 'Gold hedge allocation via RBI tranche',
          },
          // Current Month - Education
          {
            userId: user._id,
            title: 'Coursera Generative AI Professional Certificate',
            amount: 2999,
            type: 'expense',
            category: 'Education',
            paymentMethod: 'Credit Card',
            date: new Date(currentYear, currentMonth, 14, 15, 0),
            notes: 'Continuous professional learning course',
          },

          // Previous Month - For historical MoM comparison and AI analysis
          {
            userId: user._id,
            title: 'Monthly Tech Salary (Previous Month)',
            amount: 85000,
            type: 'income',
            category: 'Salary & Income',
            paymentMethod: 'Net Banking',
            date: new Date(prevYear, prevMonth, 1, 9, 30),
            notes: 'September direct bank deposit',
          },
          {
            userId: user._id,
            title: 'Apartment Rent (Previous Month)',
            amount: 22000,
            type: 'expense',
            category: 'Housing & Rent',
            paymentMethod: 'Net Banking',
            date: new Date(prevYear, prevMonth, 3, 10, 0),
            notes: 'September residential lease',
          },
          {
            userId: user._id,
            title: 'Supermarket Groceries & Provisions',
            amount: 5100,
            type: 'expense',
            category: 'Food & Dining',
            paymentMethod: 'UPI',
            date: new Date(prevYear, prevMonth, 7, 18, 0),
            notes: 'Monthly staples & provisions',
          },
          {
            userId: user._id,
            title: 'Casual Dinners & Weekend Cafes',
            amount: 2800,
            type: 'expense',
            category: 'Food & Dining',
            paymentMethod: 'Credit Card',
            date: new Date(prevYear, prevMonth, 15, 20, 0),
            notes: 'Social dining and takeout',
          },
          {
            userId: user._id,
            title: 'Flipkart Big Billion Days Electronic Gadget',
            amount: 4800,
            type: 'expense',
            category: 'Shopping',
            paymentMethod: 'Credit Card',
            date: new Date(prevYear, prevMonth, 22, 14, 30),
            notes: 'Ergonomic mouse and desk mat',
          },
          {
            userId: user._id,
            title: 'City Cabs & Metro Travel Pass',
            amount: 2400,
            type: 'expense',
            category: 'Transportation',
            paymentMethod: 'UPI',
            date: new Date(prevYear, prevMonth, 16, 9, 0),
            notes: 'Monthly transportation commute',
          },
          {
            userId: user._id,
            title: 'Automated Mutual Fund SIP Transfers',
            amount: 22500,
            type: 'expense',
            category: 'Investments & Savings',
            paymentMethod: 'Net Banking',
            date: new Date(prevYear, prevMonth, 10, 6, 0),
            notes: 'Monthly recurring wealth SIP',
          },
          {
            userId: user._id,
            title: 'Utility Invoices (Power & Internet)',
            amount: 3150,
            type: 'expense',
            category: 'Utilities',
            paymentMethod: 'UPI',
            date: new Date(prevYear, prevMonth, 8, 11, 0),
            notes: 'Electricity and fiber connectivity bills',
          },
        ];

        await transactionRepository.createMany(demoTransactions);

        // Seed Budgets with realistic limits & thresholds
        await budgetRepository.upsert(user._id.toString(), 'Food & Dining', 12000, 80);
        await budgetRepository.upsert(user._id.toString(), 'Housing & Rent', 25000, 90);
        await budgetRepository.upsert(user._id.toString(), 'Shopping', 8000, 80);
        await budgetRepository.upsert(user._id.toString(), 'Investments & Savings', 30000, 75);
        await budgetRepository.upsert(user._id.toString(), 'Subscriptions & Entertainment', 3000, 70);

        // Seed Goals with meaningful financial milestones
        await goalRepository.create({
          userId: user._id,
          name: 'Emergency Reserve Fund (6 Months)',
          targetAmount: 200000,
          currentAmount: 135000,
          monthlyContribution: 10000,
          targetDate: new Date(currentYear + 1, currentMonth, 1),
          category: 'Emergency Fund',
        });
        await goalRepository.create({
          userId: user._id,
          name: 'MacBook Air M5 Workstation',
          targetAmount: 115000,
          currentAmount: 76000,
          monthlyContribution: 8000,
          targetDate: new Date(currentYear, currentMonth + 4, 1),
          category: 'Technology',
        });
        await goalRepository.create({
          userId: user._id,
          name: 'Europe Holiday Trip 2027',
          targetAmount: 250000,
          currentAmount: 85000,
          monthlyContribution: 12000,
          targetDate: new Date(currentYear + 1, currentMonth + 6, 1),
          category: 'Travel',
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
