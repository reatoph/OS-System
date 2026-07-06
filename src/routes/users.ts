import { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getDatabase } from '../database/db';
import { User } from '../types';

const router = Router();

// Create a new user
router.post('/', async (req: Request, res: Response) => {
  try {
    const { username, displayName, avatar } = req.body;

    if (!username || !displayName) {
      return res.status(400).json({ error: 'Username and displayName are required' });
    }

    const db = await getDatabase();
    const id = uuidv4();

    await db.run(
      'INSERT INTO users (id, username, displayName, avatar) VALUES (?, ?, ?, ?)',
      [id, username, displayName, avatar || null]
    );

    const user = await db.get('SELECT * FROM users WHERE id = ?', [id]);
    res.status(201).json(user);
  } catch (error: any) {
    if (error.message.includes('UNIQUE')) {
      res.status(409).json({ error: 'Username already exists' });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
});

// Get all users
router.get('/', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const users = await db.all('SELECT * FROM users ORDER BY createdAt DESC');
    res.json(users);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get user by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const db = await getDatabase();
    const user = await db.get('SELECT * FROM users WHERE id = ?', [req.params.id]);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
