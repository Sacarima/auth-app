import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';

async function start() {
  try {
    await connectDB(config.mongoUri);

  // Start server
  //use render port if available
    const port = process.env.PORT || config.port || 7500;

    const server = app.listen(port, () => {
      console.log(`[server] ${config.env} listening on :${port}`);
    });

    //  shutdown
    const shutdown = (signal) => () => {
      console.log(`[server] ${signal} received, shutting down...`);
      server.close(() => {
        console.log('[server] http server closed');
        // Close DB if you expose a close() util; otherwise mongoose.connection.close()
        import('mongoose').then(({ default: mongoose }) =>
          mongoose.connection.close(false, () => {
            console.log('[db] connection closed');
            process.exit(0);
          })
        );
      });
      // Fallback hard-exit in 10s
      setTimeout(() => process.exit(1), 10_000).unref();
    };

    process.on('SIGTERM', shutdown('SIGTERM'));
    process.on('SIGINT', shutdown('SIGINT'));
  } catch (error) {
    console.error(`[server] Failed to start server: ${error.message}`);
    process.exit(1);
  }
}

start();
