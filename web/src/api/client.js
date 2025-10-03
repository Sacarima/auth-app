// apps/web/src/api/client.js
const API = (import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:7500').trim();
const BASE = API.replace(/\/+$/, '');

let CSRF = null;


export async function ensureCsrf() {
  if (CSRF) return CSRF;
  try {
    const res = await fetch(`${BASE}/api/csrf`, { credentials: 'include' });
    const data = await res.json().catch(() => ({}));
    CSRF = data?.csrfToken || null;
  } catch {
    CSRF = null; // proceed; server will reject if required
  }
  return CSRF;
}

function isMutation(method = 'GET') {
  return /^(POST|PUT|PATCH|DELETE)$/i.test(method);
}

async function jsonFetch(path, { method = 'GET', body, headers, allow401 = false } = {}) {
  // For mutations, make sure we have a CSRF token and send it
  if (isMutation(method) && !CSRF) {
    await ensureCsrf();
  }

  const h = { 'Content-Type': 'application/json', ...(headers || {}) };
  if (isMutation(method) && CSRF) h['X-CSRF-Token'] = CSRF;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, {
      method,
      headers: h,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include', // send/receive cookies
    });
  } catch (networkErr) {
    const err = new Error('Network error. Please check your connection.');
    err.cause = networkErr;
    err.status = 0;
    throw err;
  }

  const isJson = res.headers.get('content-type')?.includes('application/json');
  const data = isJson ? await res.json().catch(() => ({})) : null;

  if (!res.ok) {
    if (res.status === 401 && allow401) {
      // return a canonical “not authenticated” response without error/redirect
      return { user: null, authenticated: false };
    }
    if ([401, 419, 440].includes(res.status)) onUnauthorized();
    // If CSRF token was invalid/rotated, clear and let caller retry if desired
    if (res.status === 403 && data?.message?.toLowerCase().includes('csrf')) {
      CSRF = null;
    }
    const err = new Error(data?.message || 'Request failed');
    err.status = res.status;
    err.details = data?.details;
    throw err;
  }

  return data;
}

export const api = {
  login: (email, password) =>
    jsonFetch('/api/auth/login', { method: 'POST', body: { email, password } }),
  register: (email, password) =>
    jsonFetch('/api/auth/register', { method: 'POST', body: { email, password } }),
  me: () => jsonFetch('/api/auth/me', {allow401: true }),
  logout: () => jsonFetch('/api/auth/logout', { method: 'POST' }),
};

export { BASE as API_BASE };
