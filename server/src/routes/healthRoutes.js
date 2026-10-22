import express from 'express';
import { getDatabaseStatus } from '../config/database.js';
import config from '../config/env.js';

const router = express.Router();

// GET /api/health - Expose database and server status without credentials
router.get('/', (req, res) => {
  const dbStatus = getDatabaseStatus();

  return res.status(200).json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: config.NODE_ENV,
    uptimeSeconds: Math.floor(process.uptime()),
    database: {
      configured: dbStatus.configured,
      connected: dbStatus.connected,
      state: dbStatus.state,
    },
    services: {
      googleAuth: Boolean(config.GOOGLE_CLIENT_ID),
      adminAllowlistConfigured: config.adminEmails.size > 0,
    },
  });
});

export default router;
