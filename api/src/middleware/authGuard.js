import { verifyFromCookie } from "../modules/auth/tokens";

export function authGuard(req, res, next) {
  const payload = verifyFromCookie(req);
  if (!payload) return res.status(401).json({ error: 'Unauthorized' });
  req.user = { id: payload.sub, email: payload.email };
  next();
}