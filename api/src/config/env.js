import 'dotenv/config';


function normalizeSameSite(v) {
  if (typeof v !== 'string') return 'lax';
  const s = v.trim().toLowerCase();
  return ['lax', 'strict', 'none'].includes(s) ? s : 'lax';
}


const required = (name, fallback) => {
    const value = process.env[name] ?? fallback;
    if ( value === undefined ) {
        console.error(`[config] Missing env var: ${name}`);
        process.exit(1);
    }
    return value;
};


export const config = {
  env: process.env.NODE_ENV || 'development',
  isProd: (process.env.NODE_ENV || 'development') === 'production',
  port: Number(process.env.PORT || 7500),
  mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/auth_app',
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'CHANGE_ME',
  jwtAccessExpires: process.env.JWT_ACCESS_EXPIRES || '30m',

  cookieSecure: String(process.env.COOKIE_SECURE || 'false').toLowerCase() === 'true',
  cookieSameSite: normalizeSameSite(process.env.COOKIE_SAMESITE || 'lax'),

  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60_000),
  rateLimitMax: Number(process.env.RATE_LIMIT_MAX || 5),
};



