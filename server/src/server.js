import app from './app.js';
import config from './config/env.js';
import { connectDatabase } from './config/database.js';

const startServer = async () => {
  // Attempt database connection without blocking server startup
  console.log(`[PaisaPilot Server] Initializing in ${config.NODE_ENV} mode...`);
  
  await connectDatabase();

  const server = app.listen(config.PORT, () => {
    console.log(`=======================================================`);
    console.log(` PaisaPilot AI API Server running on port ${config.PORT}`);
    console.log(` Health endpoint : http://localhost:${config.PORT}/api/health`);
    console.log(` Client origin   : ${config.CLIENT_URL}`);
    console.log(` Admin allowlist : ${config.adminEmails.size} configured emails`);
    console.log(`=======================================================`);
  });

  const handleShutdown = (signal) => {
    console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
    server.close(() => {
      console.log('[Server] HTTP server closed.');
      process.exit(0);
    });
  };

  process.on('SIGINT', () => handleShutdown('SIGINT'));
  process.on('SIGTERM', () => handleShutdown('SIGTERM'));
};

startServer().catch((err) => {
  console.error('[Server Startup Error]:', err);
  process.exit(1);
});
