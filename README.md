# MERN Auth  Modular, Secure, and Testable

![App Preview](https://raw.githubusercontent.com/Sacarima/auth-app/main/web/src/assets/preview.jpg)

A minimal, secure authentication system built with **Node.js + Express + MongoDB** and a **React** SPA (vanilla CSS). Designed for modularity, statelessness, and security-first principles.

---

## Stack

- **Backend:** Node.js (ESM), Express, Mongoose, Helmet, CORS, cookie-parser, compression, morgan  
- **Security:** express-rate-limit, express-mongo-sanitize, hpp, helmet (CSP-ready), csurf (CSRF tokens), httpOnly cookies  
- **Frontend:** React, Vite, react-router, react-icons, vanilla CSS  
- **Auth:** JWT (httpOnly cookie), 30-minute expiry

---

## Architecture

```
apps/
└─ api/
   └─ src/
      ├─ config/          # env, security, db
      ├─ modules/
      │  ├─ auth/         # tokens, helpers
      │  └─ user/         # model + repo
      ├─ routes/          # auth.routes.js, index.js
      ├─ middleware/      # errors, notFound
      ├─ app.js
      └─ server.js
└─ web/
   └─ src/
      ├─ api/             # client.js (CSRF + 401 handling)
      ├─ context/         # AuthProvider
      ├─ pages/           # Login, Signup, Welcome
      ├─ routes/          # ProtectedRoute
      └─ styles.css

```

### Flow (stateless)

1. **Login/Register** → server validates → issues **JWT** in **httpOnly** cookie (30m).  
2. SPA calls **`/api/auth/me`** to restore session.  
3. **Logout** clears cookie.  
4. **CSRF:** SPA fetches **`/api/csrf`** and sends `X-CSRF-Token` for mutations.

---

## Run locally

### Prereqs

- Node **22 LTS** (or Node **20.19+**)  
- MongoDB (local or Atlas)

### Backend

```bash
cd apps/api
cp .env.example .env
npm i
npm run dev
# Health check:
# GET http://localhost:7500/api/health -> { "status": "ok" }

```
```
NODE_ENV=development
PORT=7500
MONGO_URI=mongodb://localhost:27017/auth_app

# JWT
JWT_ACCESS_SECRET=replace_me
JWT_ACCESS_EXPIRES=30m

# Cookies
COOKIE_SAMESITE=lax
COOKIE_SECURE=false

# CORS
CORS_ORIGIN=http://localhost:5173

# Rate limit
RATE_LIMIT_WINDOW_MS=60000
RATE_LIMIT_MAX=5
```

# FRONTEND
```
cd apps/web
echo "VITE_API_BASE_URL=http://localhost:7500" > .env
npm i
npm run dev
# Open http://localhost:5173
```

### API Endpoints
POST /api/auth/register   # body: { email, password }
POST /api/auth/login      # body: { email, password }
GET  /api/auth/me         # returns { user } if authenticated
POST /api/auth/logout     # clears auth cookie
GET  /api/csrf            # returns { csrfToken } for mutation requests

### Notes
Rate-limited: /login, /register

CSRF-protected: all POST auth routes

Responses use { success, message, ... } shape

### Security
```
NoSQL Injection: express-mongo-sanitize, mongoose.set('sanitizeFilter', true), strict validators

XSS: React auto-escaping, Helmet (CSP-ready), no dangerouslySetInnerHTML

CSRF: csurf with SPA X-CSRF-Token header, httpOnly cookies

Brute-force: express-rate-limit on /login & /register

CORS: locked to web origin; credentials: true

Cookies: httpOnly; SameSite=Lax in dev

Production:
            COOKIE_SAMESITE=none
            COOKIE_SECURE=true   # HTTPS required
Headers: helmet(), x-powered-by disabled

Body limits: JSON/urlencoded 1 MB

HPP: hpp to block parameter pollution
```

### Trade-offs

Access tokens only (30m) — no refresh token to keep scope simple (easy to add later).

Mongo-only in this MVP — repository pattern allows a MySQL adapter if needed.

CSR-only client — protected route guard + /me bootstrap.


## License

MIT License

Copyright (c) 2025 Joao Aleixo

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.


