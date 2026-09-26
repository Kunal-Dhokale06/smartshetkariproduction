import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Expense } from '../types';
import { api } from '../services/api';
import { getDeletedCropNames, getDeletedCropIds, subscribeToCrops } from './cropsStore';

let currentUserId: string | null = null;
let globalExpenses: Expense[] = [];
let globalLoading = false;
let globalError: string | null = null;
const listeners = new Set<() => void>();

export function notifyExpensesListeners() {
  listeners.forEach((listener) => listener());
}

// Auto-subscribe to cropsStore so whenever a crop is deleted/restored, expenses re-filter immediately!
subscribeToCrops(() => {
  notifyExpensesListeners();
});

function getStorageKey(userId?: string | null): string {
  return userId ? `@smartshetkari_expenses_${userId}` : '@smartshetkari_expenses_guest';
}

function persistExpenses() {
  const key = getStorageKey(currentUserId);
  AsyncStorage.setItem(key, JSON.stringify(globalExpenses)).catch((err) =>
    console.error('Error persisting expenses:', err)
  );
}

let lastSyncTime = 0;
const SYNC_THROTTLE_MS = 30 * 1000; // 30s throttle

export async function resetExpensesForUser(userId?: string | null, clearAll = false): Promise<void> {
  currentUserId = userId || null;
  const key = getStorageKey(currentUserId);

  if (clearAll) {
    if (currentUserId) {
      await AsyncStorage.removeItem(key).catch(() => {});
    }
    globalExpenses = [];
    globalLoading = false;
    notifyExpensesListeners();
    return;
  }

  // 1. Read cached expenses immediately (fast cache-first, works for both user and guest)
  try {
    const saved = await AsyncStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        globalExpenses = parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading expenses cache:', err);
  } finally {
    globalLoading = false;
    notifyExpensesListeners();
  }

  // 2. Fetch fresh user expenses from backend in background if user is logged in
  if (currentUserId) {
    syncWithBackend().catch(() => {});
  }
}

export async function syncWithBackend(force = false): Promise<void> {
  const now = Date.now();
  if (!force && now - lastSyncTime < SYNC_THROTTLE_MS && globalExpenses.length > 0) {
    return;
  }

  try {
    if (globalExpenses.length === 0) {
      globalLoading = true;
      notifyExpensesListeners();
    }

    const result = await api.getExpenses();
    if (result && Array.isArray(result.items)) {
      lastSyncTime = Date.now();
      globalExpenses = result.items;
      persistExpenses();
      globalError = null;
    }
  } catch (err: any) {
    console.warn('Expenses backend sync deferred:', err?.message || err);
  } finally {
    globalLoading = false;
    notifyExpensesListeners();
  }
}

/**
 * Filter out expenses that belong to soft-deleted crops.
 * Preserves general farm expenses (crop is null/undefined or 'General').
 */
export function getActiveExpenses(allExpenses = globalExpenses): Expense[] {
  const deletedNames = getDeletedCropNames();
  const deletedIds = getDeletedCropIds();

  return allExpenses.filter((e) => {
    // If expense has a cropId and it matches a deleted crop, exclude it
    if (e.cropId && deletedIds.has(e.cropId)) {
      return false;
    }
    // If expense has a crop name (other than general) and matches a deleted crop name, exclude it
    const cName = (e.crop || (e as any).cropName || '').trim().toLowerCase();
    if (cName && cName !== 'general' && deletedNames.has(cName)) {
      return false;
    }
    return true;
  });
}

export function getExpenses(): Expense[] {
  return getActiveExpenses();
}

export function getAllExpensesRaw(): Expense[] {
  return globalExpenses;
}

/**
 * Permanently purge expenses associated with a permanently deleted crop
 */
export function purgeExpensesForCrop(cropId?: string, cropName?: string) {
  const cName = cropName?.trim().toLowerCase();
  globalExpenses = globalExpenses.filter((e) => {
    if (cropId && e.cropId === cropId) return false;
    const name = (e.crop || (e as any).cropName || '').trim().toLowerCase();
    if (cName && name && name !== 'general' && name === cName) return false;
    return true;
  });
  persistExpenses();
  notifyExpensesListeners();
}

export function addExpense(newExpense: Omit<Expense, 'id'>): Expense {
  const tempId = `e_${Date.now()}`;
  const localExpense: Expense = {
    ...newExpense,
    id: tempId,
  };

  // 1. Optimistic local update
  globalExpenses = [localExpense, ...globalExpenses];
  persistExpenses();
  notifyExpensesListeners();

  // 2. Sync to backend
  api.createExpense(newExpense)
    .then((serverExpense) => {
      globalExpenses = globalExpenses.map((e) =>
        e.id === tempId ? { ...serverExpense, id: serverExpense.id } : e
      );
      persistExpenses();
      notifyExpensesListeners();
    })
    .catch((err) => {
      console.warn('Backend expense creation deferred:', err?.message || err);
    });

  return localExpense;
}

export function updateExpense(id: string, updates: Partial<Expense>) {
  // 1. Optimistic local update
  globalExpenses = globalExpenses.map((e) => (e.id === id ? { ...e, ...updates } : e));
  persistExpenses();
  notifyExpensesListeners();

  // 2. Sync to backend
  api.updateExpense(id, updates).catch((err) => {
    console.warn('Backend expense update deferred:', err?.message || err);
  });
}

export function deleteExpense(id: string) {
  // 1. Optimistic local update
  globalExpenses = globalExpenses.filter((e) => e.id !== id);
  persistExpenses();
  notifyExpensesListeners();

  // 2. Sync to backend
  api.deleteExpense(id).catch((err) => {
    console.warn('Backend expense deletion deferred:', err?.message || err);
  });
}

export function useExpensesStore() {
  const [activeExpenses, setActiveExpenses] = useState<Expense[]>(() => getActiveExpenses());
  const [isLoading, setIsLoading] = useState<boolean>(globalLoading);
  const [error, setError] = useState<string | null>(globalError);

  useEffect(() => {
    const handleUpdate = () => {
      setActiveExpenses(getActiveExpenses());
      setIsLoading(globalLoading);
      setError(globalError);
    };

    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const totalExpense = useMemo(
    () => activeExpenses.reduce((sum, item) => sum + (Number(item.amount) || 0), 0),
    [activeExpenses]
  );

  return {
    expenses: activeExpenses,
    totalExpense,
    isLoading,
    error,
    addExpense,
    updateExpense,
    deleteExpense,
    purgeExpensesForCrop,
    refreshExpenses: syncWithBackend,
  };
}
