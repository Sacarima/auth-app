import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';


import { buildHelmet, buildCors, buildAuthLimiter } from './config/security.js';
import { config } from './config/env.js';
import routes from './routes/index.js';
import { errorHandler, notFound } from './middleware/errorHandler.js';

import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import csurf from 'csurf';



const app = express();


//Security and infra middlewares
app.disable('x-powered-by');
app.set('trust proxy', 1);


app.use(buildHelmet());
app.use(buildCors(config.corsOrigin));
app.use(morgan(config.env === 'production' ? 'combined' : 'dev'));
app.use(compression());

// Parsers first
app.use(cookieParser());
app.use(express.json({ limit: '1mb' }));   
app.use(express.urlencoded({ extended: false, limit: '1mb' }))     

// Data sanitization against NoSQL injection attacks
// Prevents operators like $gt, $lt, $in, etc. from being used in query strings
app.use((req, _res, next) => {
  if (req.body)   req.body   = mongoSanitize.sanitize(req.body,   { replaceWith: '_' });
  if (req.params) req.params = mongoSanitize.sanitize(req.params, { replaceWith: '_' });
  next();
});


app.use(hpp({ checkBody: true, checkQuery: true }));

// CSRF protection setup: issue/verify tokens with a dedicated cookie
// Sets a _csrf cookie that the client must send back in the x-csrf-token header for state-changing requests (POST, PUT, DELETE)

const csrfProtection = csurf({
  cookie: {
    httpOnly: true,
    sameSite: config.cookieSameSite,                 // 'lax' in dev; 'none' in prod (with secure)
    secure: config.cookieSecure && config.isProd,    // true only on HTTPS in prod
    path: '/',                                       // token cookie available for whole site
  },
});

app.get('/api/csrf', csrfProtection, (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});


// Rate limiter for auth routes, to prevent brute-force attacks
// Applies to login and register routes
// endpoints such as /me or logout are not limited
const authLimiter = buildAuthLimiter({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// CSRF protection mutations
app.use('/api/auth/register', csrfProtection);
app.use('/api/auth/login', csrfProtection);


//Routes
app.use('/api', routes);

//404 error handler
app.use(notFound);
app.use(errorHandler);

export default app;