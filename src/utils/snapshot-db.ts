/**
 * Snapshot 데이터베이스 유틸리티
 * IndexedDB를 사용하여 스냅샷을 저장하고 관리합니다.
 */

export type SnapshotTrigger = 
  | 'parent-mismatch'
  | 'node-mismatch'
  | 'selection-jump'
  | 'boundary-input'
  | 'data-length-mismatch'
  | 'data-content-mismatch'
  | 'selection-mismatch'
  | 'text-leak'
  | 'sibling-created'
  | 'missing-beforeinput'
  | string; // For combined triggers

export interface Snapshot {
  id?: number;
  timestamp: number;
  trigger?: SnapshotTrigger;
  triggerDetail?: string;
  environment: {
    os: string;
    osVersion: string;
    browser: string;
    browserVersion: string;
    device: string;
    isMobile: boolean;
  };
  eventLogs: any[];
  domBefore: string;
  domAfter: string;
  ranges: {
    sel?: any;
    comp?: any;
    bi?: any;
    input?: any;
  };
  phases: any[];
  anomalies: any[];
  domChangeResult?: any;
}

const DB_NAME = 'contenteditable-snapshots';
const DB_VERSION = 1;
const STORE_NAME = 'snapshots';

let dbPromise: Promise<IDBDatabase> | null = null;

function openDB(): Promise<IDBDatabase> {
  if (dbPromise) {
    return dbPromise;
  }

  dbPromise = new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true });
        store.createIndex('timestamp', 'timestamp', { unique: false });
      }
    };
  });

  return dbPromise;
}

const MAX_SNAPSHOTS = 20;

export async function saveSnapshot(snapshot: Omit<Snapshot, 'id'>): Promise<number> {
  const db = await openDB();
  
  // 먼저 스냅샷 저장
  const id = await new Promise<number>((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.add({ ...snapshot, timestamp: snapshot.timestamp || Date.now() });

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
  
  // 저장 후 20개 제한 적용: 오래된 스냅샷 삭제
  try {
    const allSnapshots = await getAllSnapshots();
    
    if (allSnapshots.length > MAX_SNAPSHOTS) {
      // 최신 20개만 유지하고 나머지 삭제
      const toDelete = allSnapshots.slice(MAX_SNAPSHOTS);
      
      // 병렬로 삭제
      await Promise.all(
        toDelete.map((oldSnapshot) => deleteSnapshot(oldSnapshot.id!))
      );
    }
  } catch (error) {
    // 제한 적용 실패해도 저장은 성공했으므로 경고만 출력
    console.warn('Failed to enforce snapshot limit:', error);
  }
  
  return id;
}

export async function getSnapshot(id: number): Promise<Snapshot | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);

    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllSnapshots(): Promise<Snapshot[]> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('timestamp');
    const request = index.getAll();

    request.onsuccess = () => {
      const snapshots = request.result || [];
      // 최신순으로 정렬
      snapshots.sort((a, b) => b.timestamp - a.timestamp);
      resolve(snapshots);
    };
    request.onerror = () => reject(request.error);
  });
}

export async function deleteSnapshot(id: number): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

export async function clearAllSnapshots(): Promise<void> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.clear();

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

