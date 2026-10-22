import userRepository from '../repositories/userRepository.js';
import transactionRepository from '../repositories/transactionRepository.js';
import activityLogRepository from '../repositories/activityLogRepository.js';
import config from '../config/env.js';
import { isDatabaseReady } from '../config/database.js';

export const adminService = {
  /**
   * Get comprehensive admin overview metrics and recent registrations
   * @returns {Promise<Object>}
   */
  async getOverview() {
    if (!isDatabaseReady()) {
      const err = new Error('Database is currently unavailable');
      err.statusCode = 503;
      throw err;
    }

    const [
      totalUsers,
      clientCount,
      adminCount,
      activeUsers,
      totalTransactions,
      globalVolume,
      recentUsers,
    ] = await Promise.all([
      userRepository.count(),
      userRepository.count({ role: 'client' }),
      userRepository.count({ role: 'admin' }),
      transactionRepository.countActiveUsers(30),
      transactionRepository.countAll(),
      transactionRepository.aggregateGlobalVolume(),
      userRepository.find({}, { limit: 8, skip: 0 }),
    ]);

    return {
      metrics: {
        totalUsers,
        clientCount,
        adminCount,
        activeUsers,
        totalTransactions,
        totalIncome: globalVolume.totalIncome,
        totalExpense: globalVolume.totalExpense,
        netSystemVolume: globalVolume.totalIncome - globalVolume.totalExpense,
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

  /**
   * Search and paginate user directory with role filters
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async listUsers({ search, role, page = 1, limit = 10 } = {}) {
    if (!isDatabaseReady()) {
      const err = new Error('Database is currently unavailable');
      err.statusCode = 503;
      throw err;
    }

    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 10));

    const result = await userRepository.findPaginated({
      search,
      role,
      page: parsedPage,
      limit: parsedLimit,
    });

    return {
      users: result.users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role,
        picture: u.picture,
        isAllowlistedAdmin: config.isAdminEmail(u.email),
        createdAt: u.createdAt,
        updatedAt: u.updatedAt,
      })),
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
      },
    };
  },

  /**
   * Update a user's role with strict safety validations and auditing
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async updateUserRole({ actorUserId, actorEmail, targetUserId, newRole }) {
    if (!isDatabaseReady()) {
      const err = new Error('Database is currently unavailable');
      err.statusCode = 503;
      throw err;
    }

    // 1. Validate target role
    if (!['client', 'admin'].includes(newRole)) {
      const err = new Error('Invalid role specified. Must be either "client" or "admin".');
      err.statusCode = 400;
      throw err;
    }

    // 2. Look up target user
    const targetUser = await userRepository.findById(targetUserId);
    if (!targetUser) {
      const err = new Error('Target user not found');
      err.statusCode = 404;
      throw err;
    }

    // 3. Self-demotion guard: an admin cannot demote themselves to client
    if (actorUserId && actorUserId.toString() === targetUserId.toString() && newRole === 'client') {
      const err = new Error('Administrators cannot demote their own account. Please request another administrator to adjust your role.');
      err.statusCode = 400;
      throw err;
    }

    // 4. Last Administrator guard: prevent removing the last admin in the system
    if (targetUser.role === 'admin' && newRole === 'client') {
      const adminCount = await userRepository.count({ role: 'admin' });
      if (adminCount <= 1) {
        const err = new Error('Action blocked: Cannot demote the last remaining administrator in the system.');
        err.statusCode = 400;
        throw err;
      }
    }

    // 5. Check if email is in ADMIN_EMAILS environment allowlist
    const isAllowlisted = config.isAdminEmail(targetUser.email);
    let note = '';
    if (isAllowlisted && newRole === 'client') {
      note = 'Note: This email is configured in the server ADMIN_EMAILS allowlist. If the user logs in via Google again, their role may be automatically restored to admin unless removed from the server configuration.';
    }

    // 6. Execute update via repository
    const updatedUser = await userRepository.updateById(targetUserId, { role: newRole });

    // 7. Audit log creation
    const actorUser = actorUserId ? await userRepository.findById(actorUserId) : null;
    await activityLogRepository.create({
      type: 'role_changed',
      actorId: actorUserId || null,
      actorName: actorUser?.name || 'Administrator',
      actorEmail: actorEmail || actorUser?.email || 'admin@rupeewise.internal',
      targetUserId: targetUser._id,
      targetUserEmail: targetUser.email,
      summary: `Administrative role updated from '${targetUser.role}' to '${newRole}' for user '${targetUser.email}'`,
      metadata: {
        previousRole: targetUser.role,
        newRole,
        isAllowlisted,
        note,
      },
    });

    return {
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        picture: updatedUser.picture,
        createdAt: updatedUser.createdAt,
        updatedAt: updatedUser.updatedAt,
      },
      note: note || undefined,
      message: `User role successfully updated to ${newRole}`,
    };
  },

  /**
   * Retrieve recent system activity audit logs
   * @param {Object} params
   * @returns {Promise<Object>}
   */
  async getActivityLogs({ limit = 20, page = 1 } = {}) {
    if (!isDatabaseReady()) {
      const err = new Error('Database is currently unavailable');
      err.statusCode = 503;
      throw err;
    }

    const parsedLimit = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const parsedPage = Math.max(1, parseInt(page, 10) || 1);
    const skip = (parsedPage - 1) * parsedLimit;

    const [logs, total] = await Promise.all([
      activityLogRepository.getRecent({ limit: parsedLimit, skip }),
      activityLogRepository.count(),
    ]);

    return {
      logs: logs.map((l) => ({
        id: l._id.toString(),
        type: l.type,
        actorName: l.actorName,
        actorEmail: l.actorEmail,
        targetUserEmail: l.targetUserEmail,
        summary: l.summary,
        metadata: l.metadata,
        createdAt: l.createdAt,
      })),
      pagination: {
        total,
        page: parsedPage,
        limit: parsedLimit,
        totalPages: Math.ceil(total / parsedLimit) || 1,
      },
    };
  },

  /**
   * Get safe system health diagnostics
   * @returns {Object}
   */
  getSystemHealth() {
    return {
      status: 'operational',
      environment: config.NODE_ENV,
      database: {
        connected: isDatabaseReady(),
        driver: 'Mongoose / MongoDB Atlas',
      },
      security: {
        cookieName: config.COOKIE_NAME,
        adminAllowlistCount: config.adminEmails.size,
        googleAuthEnabled: Boolean(config.GOOGLE_CLIENT_ID),
      },
      nodeVersion: process.version,
      memoryUsageMb: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      uptimeSeconds: Math.floor(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  },
};

export default adminService;
