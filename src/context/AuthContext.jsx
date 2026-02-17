import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const ACCOUNTS_KEY = 'doctor_dashboard_accounts';
const CURRENT_ID_KEY = 'doctor_dashboard_current_id';

function loadAccounts() {
  try {
    const s = localStorage.getItem(ACCOUNTS_KEY);
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

function loadCurrentId() {
  return localStorage.getItem(CURRENT_ID_KEY);
}

function saveCurrentId(id) {
  if (id == null) localStorage.removeItem(CURRENT_ID_KEY);
  else localStorage.setItem(CURRENT_ID_KEY, id);
}

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [accounts, setAccounts] = useState(loadAccounts);
  const [currentId, setCurrentId] = useState(loadCurrentId);

  useEffect(() => {
    try {
      const oldUser = localStorage.getItem('doctor_dashboard_user');
      const accs = loadAccounts();
      if (oldUser && accs.length === 0) {
        const u = JSON.parse(oldUser);
        const id = u.email || 'legacy';
        const account = { id, email: u.email || '', name: u.name || 'Doctor' };
        setAccounts([account]);
        setCurrentId(id);
        saveAccounts([account]);
        saveCurrentId(id);
        localStorage.removeItem('doctor_dashboard_user');
      }
    } catch (_) {}
  }, []);

  const user = accounts.find((a) => a.id === currentId) ?? null;

  const addOrSetCurrent = useCallback((account) => {
    setAccounts((prev) => {
      const exists = prev.find((a) => a.id === account.id);
      const next = exists ? prev.map((a) => (a.id === account.id ? account : a)) : [...prev, account];
      saveAccounts(next);
      return next;
    });
    setCurrentId(account.id);
    saveCurrentId(account.id);
  }, []);

  const login = useCallback((email, password) => {
    const id = email?.trim() || 'unknown';
    const name = `Dr. ${(email?.split('@')[0] || 'Doctor').replace(/^dr\.?/i, '').trim() || 'Doctor'}`;
    const account = { id, email, name };
    addOrSetCurrent(account);
  }, [addOrSetCurrent]);

  const addAccount = useCallback((email, password) => {
    const id = email?.trim() || `doc-${Date.now()}`;
    const name = `Dr. ${(email?.split('@')[0] || 'Doctor').replace(/^dr\.?/i, '').trim() || 'Doctor'}`;
    const account = { id, email, name };
    setAccounts((prev) => {
      const next = prev.some((a) => a.id === id) ? prev : [...prev, account];
      saveAccounts(next);
      return next;
    });
    return account;
  }, []);

  const switchAccount = useCallback((id) => {
    setCurrentId(id);
    saveCurrentId(id);
  }, []);

  const removeAccount = useCallback((id) => {
    const next = accounts.filter((a) => a.id !== id);
    saveAccounts(next);
    setAccounts(next);
    if (currentId === id) {
      const nextId = next.length ? next[0].id : null;
      setCurrentId(nextId);
      saveCurrentId(nextId);
    }
  }, [accounts, currentId]);

  const logout = useCallback(() => {
    setCurrentId(null);
    saveCurrentId(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accounts,
        login,
        addAccount,
        switchAccount,
        removeAccount,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function getSettingsKey(accountId) {
  return accountId ? `doctor_dashboard_settings_${accountId}` : 'doctor_dashboard_settings';
}

export function useCurrentSettings(DEFAULT_SETTINGS) {
  const { user } = useAuth();
  const key = getSettingsKey(user?.id);
  if (!DEFAULT_SETTINGS) return {};
  try {
    const s = localStorage.getItem(key);
    return s ? { ...DEFAULT_SETTINGS, ...JSON.parse(s) } : { ...DEFAULT_SETTINGS };
  } catch {
    return { ...DEFAULT_SETTINGS };
  }
}
