import { openDB, IDBPDatabase } from "idb";

let dbPromise: Promise<IDBPDatabase> | null = null;

const initDB = (): Promise<IDBPDatabase> => {
  if (!dbPromise) {
    dbPromise = openDB("SpeedMarketDB", 1, {
      upgrade(db) {
        if (!db.objectStoreNames.contains("keys")) {
          db.createObjectStore("keys");
        }
      },
    });
  }
  return dbPromise;
};

export const saveIndexKey = async <T>(key: string, value: T): Promise<boolean> => {
  const db = await initDB();
  await db.put("keys", value, key);
  return true;
};

export const getIndexKey = async <T>(key: string): Promise<T | undefined> => {
  const db = await initDB();
  return await db.get("keys", key);
};
