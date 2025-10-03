
import { Router } from 'express';
import { body, validationResult } from 'express-validator';
import { findUserByEmail, createUser } from '../modules/user/user.repo.js';
import {
  signAccessToken,
  setAuthCookie,
  clearAuthCookie,
  verifyFromCookie,
} from '../modules/auth/tokens.js';

const router = Router();

// ping endpoint to check if the auth service is running
router.get('/ping', (req, res) => res.json({ ok: true, at: new Date().toISOString() }));

// POST /api/auth/register
router.post(
  '/register',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password min length 6'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', details: errors.array() });
      }
      const { email, password } = req.body;
      const existing = await findUserByEmail(email.toLowerCase());
      if (existing) return res.status(409).json({ success: false, message: 'Email already registered' });

      const user = await createUser({ email: email.toLowerCase(), password });
      res.status(201).json({ success: true, message: 'User registered successfully', user: { email: user.email } });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  '/login',
  body('email').isEmail().withMessage('Valid email required'),
  body('password').isString().isLength({ min: 6 }).withMessage('Password min length 6'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, message: 'Validation failed', details: errors.array() });
      }
      const { email, password } = req.body;

      const user = await findUserByEmail(email.toLowerCase());
      if (!user || !(await user.verifyPassword(password))) {
        return res.status(401).json({ success: false, message: 'Invalid email or password' });
      }

      const token = signAccessToken({ sub: user.id, email: user.email });
      setAuthCookie(res, token);

      res.json({ success: true, message: 'Logged in successfully', user: { email: user.email } });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/me
router.get('/me', (req, res) => {
  const payload = verifyFromCookie(req);
  if (!payload) return res.status(401).json({ success: false, message: 'Unauthorized' });
  res.json({ success: true, user: { email: payload.email } });
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  clearAuthCookie(res);
  res.json({ success: true, message: 'Logged out' });
});

export default router;
