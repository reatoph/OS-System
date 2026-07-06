import { Database } from 'sqlite';

export async function initializeDatabase(db: Database) {
  // Users table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      displayName TEXT NOT NULL,
      avatar TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Logs table (channels/collections of messages)
  await db.exec(`
    CREATE TABLE IF NOT EXISTS logs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      channel TEXT,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Messages table
  await db.exec(`
    CREATE TABLE IF NOT EXISTS messages (
      id TEXT PRIMARY KEY,
      logId TEXT NOT NULL,
      userId TEXT NOT NULL,
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      edited BOOLEAN DEFAULT 0,
      editedAt DATETIME,
      FOREIGN KEY (logId) REFERENCES logs(id),
      FOREIGN KEY (userId) REFERENCES users(id)
    )
  `);

  // Indexes for performance
  await db.exec(`
    CREATE INDEX IF NOT EXISTS idx_messages_logId ON messages(logId);
    CREATE INDEX IF NOT EXISTS idx_messages_userId ON messages(userId);
    CREATE INDEX IF NOT EXISTS idx_messages_timestamp ON messages(timestamp);
    CREATE INDEX IF NOT EXISTS idx_logs_channel ON logs(channel);
  `);
}
