import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { getDatabase, closeDatabase } from './database/db';
import usersRouter from './routes/users';
import logsRouter from './routes/logs';
import messagesRouter from './routes/messages';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/users', usersRouter);
app.use('/api/logs', logsRouter);
app.use('/api/messages', messagesRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 OS System Message Log Store running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  server.close();
  await closeDatabase();
  process.exit(0);
});
