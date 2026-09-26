import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../services/api';
import { resetCropsForUser } from './cropsStore';
import { resetExpensesForUser } from './expensesStore';
import { resetSalesForUser } from './salesStore';
import { resetDiaryForUser } from '../services/diaryStorage';

export interface AuthUser {
  id: string;
  phone: string;
  name: string;
  email?: string | null;
  avatarUrl?: string | null;
  village?: string | null;
  taluka?: string | null;
  district?: string | null;
  state?: string;
  landArea?: number | string | null;
  landAreaUnit?: string;
  language?: string;
  isVerified?: boolean;
}

const USER_STORAGE_KEY = '@smartshetkari_auth_user_v1';
const TOKEN_STORAGE_KEY = '@smartshetkari_auth_token_v1';

let globalUser: AuthUser | null = null;
let globalToken: string | null = null;
let globalLoading = true;
let globalError: string | null = null;
const listeners = new Set<() => void>();

function notify() {
  listeners.forEach((fn) => fn());
}

// Initial hydration from AsyncStorage
export async function initAuth(): Promise<AuthUser | null> {
  try {
    globalLoading = true;
    notify();

    const [storedToken, storedUser] = await Promise.all([
      AsyncStorage.getItem(TOKEN_STORAGE_KEY),
      AsyncStorage.getItem(USER_STORAGE_KEY),
    ]);

    if (storedToken && storedUser) {
      globalToken = storedToken;
      globalUser = JSON.parse(storedUser);
      api.setAuthHeader(storedToken);

      // Hydrate all stores specifically for this user
      if (globalUser?.id) {
        await Promise.allSettled([
          resetCropsForUser(globalUser.id),
          resetExpensesForUser(globalUser.id),
          resetSalesForUser(globalUser.id),
          resetDiaryForUser(globalUser.id),
        ]);
      }

      // Verify token with backend in background
      api.getMe()
        .then(async (user) => {
          if (user) {
            globalUser = user;
            await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
            notify();
          }
        })
        .catch(() => {
          // Token expired or invalid
        });
    } else {
      // Unauthenticated / Guest state: hydrate guest data without clearing
      globalToken = null;
      globalUser = null;
      await Promise.allSettled([
        resetCropsForUser(null, false),
        resetExpensesForUser(null, false),
        resetSalesForUser(null, false),
        resetDiaryForUser(null, false),
      ]);
    }
  } catch (err: any) {
    console.warn('[authStore] Error during initAuth:', err?.message || err);
  } finally {
    globalLoading = false;
    notify();
  }
  return globalUser;
}

// Auto-run initAuth on import
initAuth();

export async function loginUser(identifier: string, password: string): Promise<AuthUser> {
  globalLoading = true;
  globalError = null;
  notify();

  try {
    const res = await api.login({ identifier: identifier.trim(), password });
    if (!res.token || !res.user) {
      throw new Error(res.message || 'Login failed. Please check your credentials.');
    }

    globalToken = res.token;
    globalUser = res.user;

    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
    api.setAuthHeader(res.token);

    await Promise.allSettled([
      resetCropsForUser(res.user.id),
      resetExpensesForUser(res.user.id),
      resetSalesForUser(res.user.id),
      resetDiaryForUser(res.user.id),
    ]);

    globalError = null;
    return res.user;
  } catch (err: any) {
    // Only activate offline mode for genuine network-unreachable errors (no internet)
    // NOT for wrong URL / 404 / bad credentials / JSON parse from wrong endpoint
    const errMsg = err?.message?.toLowerCase() || '';
    const isGenuineOffline =
      errMsg.includes('network request failed') ||
      errMsg.includes('econnrefused') ||
      errMsg.includes('etimedout') ||
      errMsg.includes('enotfound') ||
      errMsg.includes('no internet') ||
      errMsg.includes('failed to fetch');

    if (isGenuineOffline) {
      // Offline mode: farmer has no internet - allow local session
      const mockOfflineUser: AuthUser = {
        id: `offline_${Date.now()}`,
        phone: identifier.startsWith('+') ? identifier : `+91${identifier}`,
        name: 'Shetkari Farmer',
        village: '',
        district: '',
        state: '',
        isVerified: false,
      };
      const mockToken = `offline_token_${Date.now()}`;
      globalToken = mockToken;
      globalUser = mockOfflineUser;
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, mockToken);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockOfflineUser));
      api.setAuthHeader(mockToken);
      await Promise.allSettled([
        resetCropsForUser(mockOfflineUser.id),
        resetExpensesForUser(mockOfflineUser.id),
        resetSalesForUser(mockOfflineUser.id),
        resetDiaryForUser(mockOfflineUser.id),
      ]);
      globalError = null;
      return mockOfflineUser;
    }
    const msg = err?.message || 'Login failed. Please check your credentials.';
    globalError = msg;
    throw new Error(msg);
  } finally {
    globalLoading = false;
    notify();
  }
}

export async function registerUser(payload: {
  name: string;
  phone: string;
  password: string;
  email?: string;
  village?: string;
  taluka?: string;
  district?: string;
  state?: string;
  landArea?: number;
  landAreaUnit?: string;
  language?: string;
}): Promise<AuthUser> {
  globalLoading = true;
  globalError = null;
  notify();

  try {
    const res = await api.register(payload);
    if (!res.token || !res.user) {
      throw new Error(res.message || 'Registration failed. Please check details.');
    }

    globalToken = res.token;
    globalUser = res.user;

    await AsyncStorage.setItem(TOKEN_STORAGE_KEY, res.token);
    await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(res.user));
    api.setAuthHeader(res.token);

    await Promise.allSettled([
      resetCropsForUser(res.user.id),
      resetExpensesForUser(res.user.id),
      resetSalesForUser(res.user.id),
      resetDiaryForUser(res.user.id),
    ]);

    globalError = null;
    return res.user;
  } catch (err: any) {
    // Only activate offline mode for genuine network-unreachable errors (no internet)
    const errMsg = err?.message?.toLowerCase() || '';
    const isGenuineOffline =
      errMsg.includes('network request failed') ||
      errMsg.includes('econnrefused') ||
      errMsg.includes('etimedout') ||
      errMsg.includes('enotfound') ||
      errMsg.includes('no internet') ||
      errMsg.includes('failed to fetch');

    if (isGenuineOffline) {
      // Offline mode: farmer has no internet - allow local registered session
      const mockOfflineUser: AuthUser = {
        id: `offline_${Date.now()}`,
        phone: payload.phone,
        name: payload.name,
        village: payload.village || '',
        district: payload.district || '',
        state: payload.state || '',
        landArea: payload.landArea,
        language: payload.language,
        isVerified: false,
      };
      const mockToken = `offline_token_${Date.now()}`;
      globalToken = mockToken;
      globalUser = mockOfflineUser;
      await AsyncStorage.setItem(TOKEN_STORAGE_KEY, mockToken);
      await AsyncStorage.setItem(USER_STORAGE_KEY, JSON.stringify(mockOfflineUser));
      api.setAuthHeader(mockToken);
      await Promise.allSettled([
        resetCropsForUser(mockOfflineUser.id),
        resetExpensesForUser(mockOfflineUser.id),
        resetSalesForUser(mockOfflineUser.id),
        resetDiaryForUser(mockOfflineUser.id),
      ]);
      globalError = null;
      return mockOfflineUser;
    }
    const msg = err?.message || 'Registration failed. Please check your details.';
    globalError = msg;
    throw new Error(msg);
  } finally {
    globalLoading = false;
    notify();
  }
}

export async function logoutUser(): Promise<void> {
  globalLoading = true;
  notify();

  try {
    await api.logout().catch(() => {});
  } finally {
    const oldUserId = globalUser?.id;
    globalToken = null;
    globalUser = null;
    globalError = null;
    api.setAuthHeader(null);

    await AsyncStorage.multiRemove([
      TOKEN_STORAGE_KEY,
      USER_STORAGE_KEY,
    ]);

    // Clear in-memory stores and user cache
    await Promise.allSettled([
      resetCropsForUser(oldUserId, true),
      resetExpensesForUser(oldUserId, true),
      resetSalesForUser(oldUserId, true),
      resetDiaryForUser(oldUserId, true),
    ]);

    globalLoading = false;
    notify();
  }
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(globalUser);
  const [token, setToken] = useState<string | null>(globalToken);
  const [isLoading, setIsLoading] = useState<boolean>(globalLoading);
  const [error, setError] = useState<string | null>(globalError);

  useEffect(() => {
    const handler = () => {
      setUser(globalUser ? { ...globalUser } : null);
      setToken(globalToken);
      setIsLoading(globalLoading);
      setError(globalError);
    };
    listeners.add(handler);
    return () => {
      listeners.delete(handler);
    };
  }, []);

  return {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    error,
    login: loginUser,
    register: registerUser,
    logout: logoutUser,
    refreshUser: initAuth,
  };
}
