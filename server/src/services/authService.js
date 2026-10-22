import { OAuth2Client } from 'google-auth-library';
import config from '../config/env.js';
import userRepository from '../repositories/userRepository.js';
import activityLogRepository from '../repositories/activityLogRepository.js';
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
