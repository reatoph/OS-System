import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/db';

const router = Router();

// Create a new log
router.post('/', async (req: Request, res: Response) => {
  try {
    const { title, channel } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    const db = await getDatabase();
    const id = uuidv4();

    await db.run(
      'INSERT INTO logs (id, title, channel) VALUES (?, ?, ?)',
      [id, title, channel || null]
    );

    const log = await db.get('SELECT * FROM logs WHERE id = ?', [id]);
    res.status(201).json(log);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get all logs
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const logs = await db.all('SELECT * FROM logs ORDER BY createdAt DESC');
    res.json(logs);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get log with all messages
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const log = await db.get('SELECT * FROM logs WHERE id = ?', [req.params.id]);
    
    if (!log) {
      return res.status(404).json({ error: 'Log not found' });
    }

    const messages = await db.all(
      `SELECT m.*, u.username, u.displayName, u.avatar 
       FROM messages m 
       LEFT JOIN users u ON m.userId = u.id 
       WHERE m.logId = ? 
       ORDER BY m.timestamp ASC`,
      [req.params.id]
    );

    res.json({ ...log, messages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Update log
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { title, channel } = req.body;
    const db = await getDatabase();

    await db.run(
      'UPDATE logs SET title = ?, channel = ?, updatedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [title, channel, req.params.id]
    );

    const log = await db.get('SELECT * FROM logs WHERE id = ?', [req.params.id]);
    res.json(log);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
