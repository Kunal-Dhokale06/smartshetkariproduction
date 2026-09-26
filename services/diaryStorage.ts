import AsyncStorage from '@react-native-async-storage/async-storage';
import { DiaryNote } from '../types';
import { api } from './api';
import { getDeletedCropNames, getDeletedCropIds, subscribeToCrops } from '../data/cropsStore';

let currentUserId: string | null = null;
let inMemoryNotes: DiaryNote[] = [];
const diaryListeners = new Set<() => void>();

export function notifyDiaryListeners() {
  diaryListeners.forEach((fn) => fn());
}

export function subscribeToDiary(listener: () => void) {
  diaryListeners.add(listener);
  return () => {
    diaryListeners.delete(listener);
  };
}

// Auto-notify diary listeners whenever crops are deleted or restored
subscribeToCrops(() => {
  notifyDiaryListeners();
});

function getStorageKey(userId?: string | null): string {
  return userId ? `@smartshetkari_diary_${userId}` : '@smartshetkari_diary_guest';
}

let lastDiarySyncTime = 0;
const DIARY_SYNC_THROTTLE_MS = 30 * 1000;

export function getActiveDiaryNotes(allNotes = inMemoryNotes): DiaryNote[] {
  const deletedNames = getDeletedCropNames();
  const deletedIds = getDeletedCropIds();

  return allNotes.filter((n) => {
    if ((n as any).cropId && deletedIds.has((n as any).cropId)) {
      return false;
    }
    const cName = (n.crop || '').trim().toLowerCase();
    if (cName && cName !== 'general' && deletedNames.has(cName)) {
      return false;
    }
    return true;
  });
}

export function getInMemoryNotes(): DiaryNote[] {
  return getActiveDiaryNotes(inMemoryNotes);
}

export function getAllDiaryNotesRaw(): DiaryNote[] {
  return inMemoryNotes;
}

export function purgeDiaryNotesForCrop(cropId?: string, cropName?: string) {
  const cName = cropName?.trim().toLowerCase();
  inMemoryNotes = inMemoryNotes.filter((n) => {
    if (cropId && (n as any).cropId === cropId) return false;
    const noteCrop = (n.crop || '').trim().toLowerCase();
    if (cName && noteCrop && noteCrop !== 'general' && noteCrop === cName) return false;
    return true;
  });
  const key = getStorageKey(currentUserId);
  AsyncStorage.setItem(key, JSON.stringify(inMemoryNotes)).catch((err) =>
    console.error('Error persisting diary after purge:', err)
  );
  notifyDiaryListeners();
}

export async function resetDiaryForUser(userId?: string | null, clearAll = false): Promise<void> {
  currentUserId = userId || null;
  const key = getStorageKey(currentUserId);

  if (clearAll) {
    if (currentUserId) {
      await AsyncStorage.removeItem(key).catch(() => {});
    }
    inMemoryNotes = [];
    notifyDiaryListeners();
    return;
  }

  // 1. Read cached diary notes immediately (fast cache-first, works for both user and guest)
  try {
    const saved = await AsyncStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        inMemoryNotes = parsed;
      }
    }
  } catch (err) {
    console.warn('Error reading diary cache:', err);
  } finally {
    notifyDiaryListeners();
  }

  // 2. Fetch fresh user diary notes from Neon PostgreSQL in background if user is logged in
  if (currentUserId) {
    syncDiaryWithBackend().catch(() => {});
  }
}

export async function syncDiaryWithBackend(force = false): Promise<DiaryNote[]> {
  const now = Date.now();
  if (!force && now - lastDiarySyncTime < DIARY_SYNC_THROTTLE_MS && inMemoryNotes.length > 0) {
    return getActiveDiaryNotes(inMemoryNotes);
  }

  try {
    const res = await api.getDiaryNotes();
    if (res && Array.isArray(res.items)) {
      lastDiarySyncTime = Date.now();
      const mappedNotes: DiaryNote[] = res.items.map((item: any) => ({
        id: item.id,
        content: item.content,
        crop: item.crop || 'General',
        cropId: item.cropId,
        date: item.date,
        source: item.source || 'text',
        createdAt: item.createdAt ? new Date(item.createdAt).getTime() : Date.now(),
      }));
      inMemoryNotes = mappedNotes;
      const key = getStorageKey(currentUserId);
      await AsyncStorage.setItem(key, JSON.stringify(mappedNotes));
      notifyDiaryListeners();
      return getActiveDiaryNotes(mappedNotes);
    }
  } catch (error: any) {
    console.warn('[diaryStorage] Backend sync deferred:', error?.message || error);
  }
  return getActiveDiaryNotes(inMemoryNotes);
}

export async function getDiaryNotes(): Promise<DiaryNote[]> {
  if (inMemoryNotes.length > 0) {
    syncDiaryWithBackend().catch(() => {});
    return getActiveDiaryNotes(inMemoryNotes);
  }

  const key = getStorageKey(currentUserId);
  try {
    const jsonStr = await AsyncStorage.getItem(key);
    if (jsonStr !== null) {
      const parsed: DiaryNote[] = JSON.parse(jsonStr);
      inMemoryNotes = parsed;
      syncDiaryWithBackend().catch(() => {});
      return getActiveDiaryNotes(parsed);
    }
  } catch (error) {
    console.warn('[diaryStorage] Error reading AsyncStorage:', error);
  }

  await syncDiaryWithBackend().catch(() => {});
  return getActiveDiaryNotes(inMemoryNotes);
}

export async function saveAllDiaryNotes(notes: DiaryNote[]): Promise<void> {
  inMemoryNotes = notes;
  const key = getStorageKey(currentUserId);
  try {
    await AsyncStorage.setItem(key, JSON.stringify(notes));
  } catch (error) {
    console.warn('[diaryStorage] Error saving to AsyncStorage:', error);
  }
}

export async function saveDiaryNote(
  noteData: Omit<DiaryNote, 'id' | 'createdAt'> & { id?: string; createdAt?: number }
): Promise<DiaryNote> {
  const existingNotes = await getDiaryNotes();

  if (noteData.id) {
    // Edit existing note
    const updatedNotes = existingNotes.map((n) =>
      n.id === noteData.id
        ? {
            ...n,
            ...noteData,
          }
        : n
    );
    await saveAllDiaryNotes(updatedNotes);

    // Background sync to backend
    api.updateDiaryNote(noteData.id, {
      content: noteData.content,
      crop: noteData.crop,
      date: noteData.date,
      source: noteData.source,
    }).catch((err) => console.warn('[diaryStorage] Note update deferred:', err?.message || err));

    return updatedNotes.find((n) => n.id === noteData.id)!;
  } else {
    // Add new note (optimistic local ID)
    const tempId = `dn_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const newNote: DiaryNote = {
      id: tempId,
      content: noteData.content,
      crop: noteData.crop,
      date: noteData.date,
      source: noteData.source || 'text',
      createdAt: Date.now(),
    };
    const updatedNotes = [newNote, ...existingNotes];
    await saveAllDiaryNotes(updatedNotes);

    // Background create on backend
    api.createDiaryNote({
      content: noteData.content,
      crop: noteData.crop,
      date: noteData.date,
      source: noteData.source,
    }).then((created) => {
      if (created && created.id) {
        inMemoryNotes = (inMemoryNotes || []).map((n) => (n.id === tempId ? { ...n, id: created.id } : n));
        const key = getStorageKey(currentUserId);
        AsyncStorage.setItem(key, JSON.stringify(inMemoryNotes)).catch(() => {});
      }
    }).catch((err) => console.warn('[diaryStorage] Note creation deferred:', err?.message || err));

    return newNote;
  }
}

export async function deleteDiaryNote(id: string): Promise<void> {
  const existingNotes = await getDiaryNotes();
  const updatedNotes = existingNotes.filter((n) => n.id !== id);
  await saveAllDiaryNotes(updatedNotes);

  // Background delete on backend
  api.deleteDiaryNote(id).catch((err) => console.warn('[diaryStorage] Note deletion deferred:', err?.message || err));
}
