import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/db';

const router = Router();

// Post a message to a log
router.post('/', async (req: Request, res: Response) => {
  try {
    const { logId, userId, content } = req.body;

    if (!logId || !userId || !content) {
      return res.status(400).json({ error: 'logId, userId, and content are required' });
    }

    const db = await getDatabase();
    const id = uuidv4();

    await db.run(
      'INSERT INTO messages (id, logId, userId, content) VALUES (?, ?, ?, ?)',
      [id, logId, userId, content]
    );

    const message = await db.get(
      `SELECT m.*, u.username, u.displayName, u.avatar 
       FROM messages m 
       LEFT JOIN users u ON m.userId = u.id 
       WHERE m.id = ?`,
      [id]
    );

    res.status(201).json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get messages for a log
router.get('/log/:logId', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const messages = await db.all(
      `SELECT m.*, u.username, u.displayName, u.avatar 
       FROM messages m 
       LEFT JOIN users u ON m.userId = u.id 
       WHERE m.logId = ? 
       ORDER BY m.timestamp ASC`,
      [req.params.logId]
    );

    res.json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Edit a message
router.put('/:id', async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const db = await getDatabase();

    await db.run(
      'UPDATE messages SET content = ?, edited = 1, editedAt = CURRENT_TIMESTAMP WHERE id = ?',
      [content, req.params.id]
    );

    const message = await db.get(
      `SELECT m.*, u.username, u.displayName, u.avatar 
       FROM messages m 
       LEFT JOIN users u ON m.userId = u.id 
       WHERE m.id = ?`,
      [req.params.id]
    );

    res.json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Delete a message
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    await db.run('DELETE FROM messages WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
