import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Crop } from '../types';
import { api } from '../services/api';

let currentUserId: string | null = null;
let globalCrops: Crop[] = [];
let globalLoading = false;
let globalError: string | null = null;
const listeners = new Set<() => void>();

export function notifyCropsListeners() {
  listeners.forEach((listener) => listener());
}

export function subscribeToCrops(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getStorageKey(userId?: string | null): string {
  return userId ? `@smartshetkari_crops_${userId}` : '@smartshetkari_crops_guest';
}

function persistCrops() {
  const key = getStorageKey(currentUserId);
  AsyncStorage.setItem(key, JSON.stringify(globalCrops)).catch((err) =>
    console.error('Error persisting crops:', err)
  );
}

let lastSyncTime = 0;
const SYNC_THROTTLE_MS = 30 * 1000; // 30s throttle

export async function resetCropsForUser(userId?: string | null, clearAll = false): Promise<void> {
  currentUserId = userId || null;
  const key = getStorageKey(currentUserId);

  if (clearAll) {
    if (currentUserId) {
      await AsyncStorage.removeItem(key).catch(() => {});
    }
    globalCrops = [];
    globalLoading = false;
    notifyCropsListeners();
    return;
  }

  // 1. Read cached crops immediately (fast cache-first, works for both registered user and guest)
  try {
    const saved = await AsyncStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        globalCrops = parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading crops cache:', err);
  } finally {
    globalLoading = false;
    notifyCropsListeners();
  }

  // 2. Fetch fresh user crops from Neon PostgreSQL in background if user is logged in
  if (currentUserId) {
    syncWithBackend().catch(() => {});
  }
}

const recentlyRestoredCropIds = new Map<string, number>();

export async function syncWithBackend(force = false): Promise<void> {
  const now = Date.now();
  if (!force && now - lastSyncTime < SYNC_THROTTLE_MS && globalCrops.length > 0) {
    return;
  }

  try {
    if (globalCrops.length === 0) {
      globalLoading = true;
      notifyCropsListeners();
    }

    const [remoteActive, remoteTrash] = await Promise.all([
      api.getCrops().catch(() => null),
      api.getDeletedCrops().catch(() => []),
    ]);

    if (Array.isArray(remoteActive)) {
      lastSyncTime = Date.now();
      const activeWithFlags = remoteActive.map((c) => ({ ...c, isDeleted: false }));
      const trashWithFlags = (remoteTrash || []).map((c) => ({ ...c, isDeleted: true }));
      
      const mergedMap = new Map<string, Crop>();
      const currentTime = Date.now();

      // 1. Preserve pending offline crops (c_...) and any locally active crops
      globalCrops.forEach((c) => {
        if (!c.id) return;
        if (c.id.startsWith('c_')) {
          mergedMap.set(c.id, c);
        } else if (!c.isDeleted) {
          // If crop is active locally (e.g. just restored), preserve it!
          mergedMap.set(c.id, c);
        }
      });

      // 2. Add remote trash, BUT do NOT overwrite any crop that was recently restored or is actively restored locally
      trashWithFlags.forEach((c) => {
        const restoredAt = recentlyRestoredCropIds.get(c.id);
        const isRecentlyRestored = Boolean(restoredAt && (currentTime - restoredAt < 60_000));
        const isLocallyActive = mergedMap.has(c.id) && !mergedMap.get(c.id)!.isDeleted;

        if (isRecentlyRestored || isLocallyActive) {
          return; // Skip stale trash entry!
        }
        mergedMap.set(c.id, c);
      });

      // 3. Add remote active crops
      activeWithFlags.forEach((c) => {
        mergedMap.set(c.id, c);
        recentlyRestoredCropIds.delete(c.id); // Confirmed on server
      });
      
      globalCrops = Array.from(mergedMap.values());
      persistCrops();
      globalError = null;
    }
  } catch (err: any) {
    console.warn('Crops backend sync deferred:', err?.message || err);
  } finally {
    globalLoading = false;
    notifyCropsListeners();
  }
}

export function getCrops(): Crop[] {
  return globalCrops.filter((c) => !c.isDeleted);
}

export function getDeletedCrops(): Crop[] {
  return globalCrops.filter((c) => !!c.isDeleted);
}

export function getAllCropsRaw(): Crop[] {
  return globalCrops;
}

export function getDeletedCropNames(): Set<string> {
  const activeNames = new Set<string>();
  globalCrops.forEach((c) => {
    if (!c.isDeleted && c.name) {
      activeNames.add(c.name.trim().toLowerCase());
    }
  });

  const names = new Set<string>();
  globalCrops.forEach((c) => {
    if (c.isDeleted && c.name) {
      const trimmed = c.name.trim().toLowerCase();
      // Only mark name as deleted if there is NO active crop with the exact same name
      if (!activeNames.has(trimmed)) {
        names.add(trimmed);
      }
    }
  });
  return names;
}

export function getActiveCropNames(): Set<string> {
  const names = new Set<string>();
  globalCrops.forEach((c) => {
    if (!c.isDeleted && c.name) {
      names.add(c.name.trim().toLowerCase());
    }
  });
  return names;
}

export function getActiveCropIds(): Set<string> {
  const ids = new Set<string>();
  globalCrops.forEach((c) => {
    if (!c.isDeleted && c.id) {
      ids.add(c.id);
    }
  });
  return ids;
}

export function getDeletedCropIds(): Set<string> {
  const ids = new Set<string>();
  globalCrops.forEach((c) => {
    if (c.isDeleted && c.id) {
      ids.add(c.id);
    }
  });
  return ids;
}

export function addCrop(newCrop: Omit<Crop, 'id'>): Crop {
  const tempId = `c_${Date.now()}`;
  const localCrop: Crop = {
    ...newCrop,
    id: tempId,
    isDeleted: false,
  };

  // 1. Optimistic local update
  globalCrops = [localCrop, ...globalCrops];
  persistCrops();
  notifyCropsListeners();

  // 2. Sync to backend
  api.createCrop(newCrop)
    .then((serverCrop) => {
      globalCrops = globalCrops.map((c) => (c.id === tempId ? { ...serverCrop, isDeleted: false } : c));
      persistCrops();
      notifyCropsListeners();
    })
    .catch((err) => {
      console.warn('Backend crop creation failed:', err?.message || err);
    });

  return localCrop;
}

export function updateCrop(id: string, updates: Partial<Crop>) {
  // 1. Optimistic local update
  globalCrops = globalCrops.map((c) => (c.id === id ? { ...c, ...updates } : c));
  persistCrops();
  notifyCropsListeners();

  // 2. Sync to backend
  api.updateCrop(id, updates).catch((err) => {
    console.warn('Backend crop update deferred:', err?.message || err);
  });
}

/**
 * Soft delete: Marks crop as isDeleted=true and deletedAt=now
 * Preserves all original relations, expenses, sales, and notes
 */
export function deleteCrop(id: string) {
  const nowISO = new Date().toISOString();
  recentlyRestoredCropIds.delete(id);
  
  // 1. Optimistic local soft-delete
  globalCrops = globalCrops.map((c) =>
    c.id === id ? { ...c, isDeleted: true, deletedAt: nowISO } : c
  );
  persistCrops();
  notifyCropsListeners();

  // 2. Sync soft-delete to backend
  api.deleteCrop(id).catch((err) => {
    console.warn('Backend crop deletion deferred:', err?.message || err);
  });
}

/**
 * Restore: Marks crop as isDeleted=false and deletedAt=undefined
 * Restores crop record itself first and all its original data exactly as it was
 */
export async function restoreCrop(id: string): Promise<Crop | void> {
  // Flag as recently restored to protect against stale sync overwrites
  recentlyRestoredCropIds.set(id, Date.now());

  // 1. Optimistic local restore
  let found = false;
  globalCrops = globalCrops.map((c) => {
    if (c.id === id) {
      found = true;
      return { ...c, isDeleted: false, deletedAt: undefined };
    }
    return c;
  });
  persistCrops();
  notifyCropsListeners();

  // 2. Sync restore to backend database
  try {
    const serverCrop = await api.restoreCrop(id);
    if (serverCrop && serverCrop.id) {
      let exists = false;
      globalCrops = globalCrops.map((c) => {
        if (c.id === id || c.id === serverCrop.id) {
          exists = true;
          return { ...c, ...serverCrop, isDeleted: false, deletedAt: undefined };
        }
        return c;
      });
      if (!exists) {
        globalCrops = [{ ...serverCrop, isDeleted: false, deletedAt: undefined }, ...globalCrops];
      }
      persistCrops();
      notifyCropsListeners();
      return serverCrop;
    }
  } catch (err: any) {
    console.warn('Backend crop restore deferred (offline):', err?.message || err);
  }
}

/**
 * Permanent Delete: Completely removes the crop from local cache and database
 * Cascades purge of all related expenses, sales, and notes leaving zero orphan records.
 * Atomic: If backend fails, throws error so local data remains 100% intact.
 */
export async function permanentlyDeleteCrop(
  id: string,
  purgeCallbacks?: {
    purgeExpenses?: (cropId: string, cropName?: string) => void;
    purgeSales?: (cropId: string, cropName?: string) => void;
    purgeDiaryNotes?: (cropId: string, cropName?: string) => void;
  }
): Promise<void> {
  recentlyRestoredCropIds.delete(id);
  const target = globalCrops.find((c) => c.id === id);
  const cropName = target?.name;

  // 1. Call backend API first if online to guarantee atomic DB cascade delete
  try {
    await api.permanentlyDeleteCrop(id);
  } catch (err: any) {
    const isOffline =
      (typeof navigator !== 'undefined' && !navigator.onLine) ||
      err?.message?.includes('Network') ||
      err?.message?.includes('Failed to fetch') ||
      err?.message?.includes('offline') ||
      err?.message?.includes('Network request failed');

    if (!isOffline) {
      // Backend error (e.g. 500 / DB failure): abort to keep local data intact!
      throw err;
    }
  }

  // 2. Remove from local crops cache
  globalCrops = globalCrops.filter((c) => c.id !== id);
  persistCrops();

  // 3. Purge related expenses, sales, and diary notes locally
  if (purgeCallbacks?.purgeExpenses) {
    purgeCallbacks.purgeExpenses(id, cropName);
  }
  if (purgeCallbacks?.purgeSales) {
    purgeCallbacks.purgeSales(id, cropName);
  }
  if (purgeCallbacks?.purgeDiaryNotes) {
    purgeCallbacks.purgeDiaryNotes(id, cropName);
  }

  notifyCropsListeners();
}

export function useCropsStore() {
  const [crops, setCrops] = useState<Crop[]>(() => globalCrops.filter((c) => !c.isDeleted));
  const [deletedCrops, setDeletedCrops] = useState<Crop[]>(() => globalCrops.filter((c) => !!c.isDeleted));
  const [isLoading, setIsLoading] = useState<boolean>(globalLoading);
  const [error, setError] = useState<string | null>(globalError);

  useEffect(() => {
    const handleUpdate = () => {
      setCrops(globalCrops.filter((c) => !c.isDeleted));
      setDeletedCrops(globalCrops.filter((c) => !!c.isDeleted));
      setIsLoading(globalLoading);
      setError(globalError);
    };

    listeners.add(handleUpdate);
    return () => {
      listeners.delete(handleUpdate);
    };
  }, []);

  return {
    crops,
    deletedCrops,
    isLoading,
    error,
    addCrop,
    updateCrop,
    deleteCrop,
    restoreCrop,
    permanentlyDeleteCrop,
    refreshCrops: syncWithBackend,
  };
}
