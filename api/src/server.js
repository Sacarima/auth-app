import { config } from './config/env.js';
import { connectDB } from './config/db.js';
import app from './app.js';


async function start() {
    try {
        await connectDB(config.mongoUri);
        app.listen(config.port, () => {
            console.log(`[server] ${config.env} listening on http://localhost:${config.port}/api`);
        });
    } catch (error) {
        console.error(`[server] Failed to start server: ${error.message}`);
    }
}

start();