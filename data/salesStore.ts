import { useState, useEffect, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Sale } from '../types';
import { api } from '../services/api';
import { getDeletedCropNames, getDeletedCropIds, subscribeToCrops } from './cropsStore';

let currentUserId: string | null = null;
let globalSales: Sale[] = [];
let globalLoading = false;
let globalError: string | null = null;
const listeners = new Set<() => void>();

export function notifySalesListeners() {
  listeners.forEach((listener) => listener());
}

// Auto-subscribe to cropsStore so whenever a crop is deleted/restored, sales re-filter immediately!
subscribeToCrops(() => {
  notifySalesListeners();
});

function getStorageKey(userId?: string | null): string {
  return userId ? `@smartshetkari_sales_${userId}` : '@smartshetkari_sales_guest';
}

function persistSales() {
  const key = getStorageKey(currentUserId);
  AsyncStorage.setItem(key, JSON.stringify(globalSales)).catch((err) =>
    console.error('Error persisting sales:', err)
  );
}

let lastSyncTime = 0;
const SYNC_THROTTLE_MS = 30 * 1000; // 30s throttle

export async function resetSalesForUser(userId?: string | null, clearAll = false): Promise<void> {
  currentUserId = userId || null;
  const key = getStorageKey(currentUserId);

  if (clearAll) {
    if (currentUserId) {
      await AsyncStorage.removeItem(key).catch(() => {});
    }
    globalSales = [];
    globalLoading = false;
    notifySalesListeners();
    return;
  }

  // 1. Read cached sales immediately (fast cache-first, works for both user and guest)
  try {
    const saved = await AsyncStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        globalSales = parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading sales cache:', err);
  } finally {
    globalLoading = false;
    notifySalesListeners();
  }

  // 2. Fetch fresh user sales from backend in background if user is logged in
  if (currentUserId) {
    syncWithBackend().catch(() => {});
  }
}

export async function syncWithBackend(force = false): Promise<void> {
  const now = Date.now();
  if (!force && now - lastSyncTime < SYNC_THROTTLE_MS && globalSales.length > 0) {
    return;
  }

  try {
    if (globalSales.length === 0) {
      globalLoading = true;
      notifySalesListeners();
    }

    const result = await api.getSales();
    if (result && Array.isArray(result.items)) {
      lastSyncTime = Date.now();
      globalSales = result.items;
      persistSales();
      globalError = null;
    }
  } catch (err: any) {
    console.warn('Sales backend sync deferred:', err?.message || err);
  } finally {
    globalLoading = false;
    notifySalesListeners();
  }
}

/**
 * Filter out sales that belong to soft-deleted crops.
 */
export function getActiveSales(allSales = globalSales): Sale[] {
  const deletedNames = getDeletedCropNames();
  const deletedIds = getDeletedCropIds();

  return allSales.filter((s) => {
    if (s.cropId && deletedIds.has(s.cropId)) {
      return false;
    }
    const cName = (s.cropName || (s as any).crop || '').trim().toLowerCase();
    if (cName && deletedNames.has(cName)) {
      return false;
    }
    return true;
  });
}

export function getSales(): Sale[] {
  return getActiveSales();
}

export function getAllSalesRaw(): Sale[] {
  return globalSales;
}

/**
 * Permanently purge sales associated with a permanently deleted crop
 */
export function purgeSalesForCrop(cropId?: string, cropName?: string) {
  const cName = cropName?.trim().toLowerCase();
  globalSales = globalSales.filter((s) => {
    if (cropId && s.cropId === cropId) return false;
    const name = (s.cropName || (s as any).crop || '').trim().toLowerCase();
    if (cName && name && name === cName) return false;
    return true;
  });
  persistSales();
  notifySalesListeners();
}

export function addSale(newSale: Omit<Sale, 'id'>): Sale {
  const tempId = `s_${Date.now()}`;
  const localSale: Sale = {
    ...newSale,
    id: tempId,
  };

  // 1. Optimistic local update
  globalSales = [localSale, ...globalSales];
  persistSales();
  notifySalesListeners();

  // 2. Sync to backend
  api.createSale(newSale)
    .then((serverSale) => {
      globalSales = globalSales.map((s) =>
        s.id === tempId ? { ...serverSale, id: serverSale.id } : s
      );
      persistSales();
      notifySalesListeners();
    })
    .catch((err) => {
      console.warn('Backend sale creation deferred:', err?.message || err);
    });

  return localSale;
}

export function updateSale(id: string, updates: Partial<Sale>) {
  // 1. Optimistic local update
  globalSales = globalSales.map((s) => (s.id === id ? { ...s, ...updates } : s));
  persistSales();
  notifySalesListeners();

  // 2. Sync to backend
  api.updateSale(id, updates).catch((err) => {
    console.warn('Backend sale update deferred:', err?.message || err);
  });
}

export function deleteSale(id: string) {
  // 1. Optimistic local update
  globalSales = globalSales.filter((s) => s.id !== id);
  persistSales();
  notifySalesListeners();

  // 2. Sync to backend
  api.deleteSale(id).catch((err) => {
    console.warn('Backend sale deletion deferred:', err?.message || err);
  });
}

export function useSalesStore() {
  const [activeSales, setActiveSales] = useState<Sale[]>(() => getActiveSales());
  const [isLoading, setIsLoading] = useState<boolean>(globalLoading);
  const [error, setError] = useState<string | null>(globalError);

  useEffect(() => {
    const handleUpdate = () => {
      setActiveSales(getActiveSales());
      setIsLoading(globalLoading);
      setError(globalError);
    };

    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  const totalSalesAmount = useMemo(
    () => activeSales.reduce((sum, item) => sum + (Number(item.totalAmount) || 0), 0),
    [activeSales]
  );

  return {
    sales: activeSales,
    totalSalesAmount,
    isLoading,
    error,
    addSale,
    updateSale,
    deleteSale,
    purgeSalesForCrop,
    refreshSales: syncWithBackend,
  };
}
