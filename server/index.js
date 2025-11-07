import { connectDB } from './config/db.js';
import app from './app.js';
import { env, isProd } from './config/config.js';

connectDB().then(() => {
  app.listen(env.port, () => {
    if (!isProd) {
      console.log(`API running http://localhost:${env.port}`);
    }
  });
}).catch((e) => {
  console.error('DB connect error:', isProd ? 'Database connection failed' : e.message);
  process.exit(1);
});