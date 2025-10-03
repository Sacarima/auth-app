export const isValidEmail = (e) => /^\S+@\S+\.\S+$/.test(String(e || '').trim());
export const isValidPassword = (p) => String(p || '').length >= 6;
