import adminService from '../services/adminService.js';

export const adminController = {
  /**
   * GET /api/admin/overview
   * Retrieve platform aggregated metrics and recent registrations
   */
  async getOverview(req, res, next) {
    try {
      const data = await adminService.getOverview();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/admin/users
   * Paginated user directory with search and role filters
   */
  async listUsers(req, res, next) {
    try {
      const { search, role, page, limit } = req.query;
      const data = await adminService.listUsers({ search, role, page, limit });
      return res.status(200).json({
        success: true,
        data: data.users,
        pagination: data.pagination,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * PATCH /api/admin/users/:id/role
   * Securely update a user's role (client / admin) with safety guards
   */
  async updateUserRole(req, res, next) {
    try {
      const targetUserId = req.params.id;
      const { role } = req.body;

      if (!role) {
        return res.status(400).json({
          success: false,
          error: 'Role is required in request body (client or admin)',
        });
      }

      const result = await adminService.updateUserRole({
        actorUserId: req.user.id,
        actorEmail: req.user.email,
        targetUserId,
        newRole: role,
      });

      return res.status(200).json({
        success: true,
        message: result.message,
        data: result.user,
        note: result.note,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/admin/activity
   * Retrieve non-sensitive system activity audit logs
   */
  async getActivityLogs(req, res, next) {
    try {
      const { limit, page } = req.query;
      const data = await adminService.getActivityLogs({ limit, page });
      return res.status(200).json({
        success: true,
        data: data.logs,
        pagination: data.pagination,
      });
    } catch (error) {
      return next(error);
    }
  },

  /**
   * GET /api/admin/health
   * Retrieve system diagnostics and safe health metrics
   */
  async getHealth(req, res, next) {
    try {
      const data = adminService.getSystemHealth();
      return res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      return next(error);
    }
  },
};

export default adminController;
