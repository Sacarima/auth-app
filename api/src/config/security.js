import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';


export function buildHelmet() {
    return helmet({
        //contentSecurityPolicy: false, might need it if i add inline scripts, need to come back to it
    });

}

export function buildCors(origin) {
  return cors({
    origin,
    credentials: true, 
  });
}



export function buildAuthLimiter({ windowMs = 60_000, max = 5 } = {}) {
  return rateLimit({
    windowMs,
    limit: max,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' },
  });
}
