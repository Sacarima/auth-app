import jwt from 'jsonwebtoken';
import { config } from '../../config/env.js';

const ACCESS_COOKIE = 'access_token';
const sameSite = ['lax', 'strict', 'none'].includes(config.cookieSameSite)
  ? config.cookieSameSite
  : 'lax';


export function signAccessToken(payload) {
    return jwt.sign(payload, config.jwtAccessSecret, { expiresIn: config.jwtAccessExpires });
}

export function setAuthCookie(res, token) {
    res.cookie(ACCESS_COOKIE, token, {
        httpOnly: true,
        secure: config.cookieSecure && config.isProd,
        sameSite,
        path: '/',
    });
}

export function clearAuthCookie(res) {
    res.clearCookie(ACCESS_COOKIE, {
        httpOnly: true,
        secure: config.cookieSecure && config.isProd,
        sameSite,
        path: '/',
    });
}

export function verifyFromCookie(req) {
  const token = req.cookies?.[ACCESS_COOKIE];
  if (!token) return null;
  try {
    return jwt.verify(token, config.jwtAccessSecret);
  } catch {
    return null;
  }
}


