const TOKEN_KEY = 'token';
const USER_KEY = 'user';
export const REMEMBER_EMAIL_KEY = 'rememberEmail';

export function getStoredAuth() {
  const token = localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY);
  const userJson = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY);
  return {
    token,
    userJson,
    isPersistent: Boolean(localStorage.getItem(TOKEN_KEY)),
  };
}

export function setStoredAuth(token: string, userJson: string, remember: boolean) {
  clearStoredAuth();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, userJson);
}

export function clearStoredAuth() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(USER_KEY);
}
