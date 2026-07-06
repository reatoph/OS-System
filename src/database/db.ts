import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import { initializeDatabase } from './schema';

let db: Database | null = null;

export async function getDatabase(): Promise<Database> {
  if (db) return db;

  const dbPath = process.env.DATABASE_PATH || path.join(process.cwd(), 'data', 'messages.db');
  
  db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });

  await initializeDatabase(db);
  return db;
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.close();
    db = null;
  }
}
