import { createContext, useCallback, useMemo, useState } from 'react';
import { loginUser } from '../services/api';

export const AuthContext = createContext(null);

const STORAGE_KEY = 'sabores-oaxaca:user';

/** Recupera la sesión guardada (para no perderla al recargar o compartir un enlace). */
function readStoredUser() {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) ?? localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function storeUser(user, remember) {
  try {
    const storage = remember ? localStorage : sessionStorage;
    storage.setItem(STORAGE_KEY, JSON.stringify(user));
  } catch {
    /* El navegador bloqueó el almacenamiento: la sesión vive solo en el estado. */
  }
}

function clearStoredUser() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* sin almacenamiento disponible */
  }
}

export function AuthProvider({ children }) {
  // El usuario autenticado vive en el estado de la app (useState).
  const [user, setUser] = useState(readStoredUser);

  const login = useCallback(async ({ usernameOrEmail, password, remember }) => {
    const data = await loginUser({ usernameOrEmail, password });
    const authenticatedUser = {
      id: data.id,
      username: data.username,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      image: data.image,
      accessToken: data.accessToken,
    };
    setUser(authenticatedUser);
    storeUser(authenticatedUser, remember);
    return authenticatedUser;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    clearStoredUser();
  }, []);

  const value = useMemo(
    () => ({ user, isAuthenticated: Boolean(user), login, logout }),
    [user, login, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
