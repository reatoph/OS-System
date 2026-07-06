# OS System - Message Log Store

A Cytus 2 OS System implementation featuring a message log storage and retrieval system. Users can create logs (channels/collections), post messages, and browse conversations from the in-universe OS.

## Features

- **User Management**: Create and manage user profiles
- **Log System**: Create and organize message logs/channels
- **Message Storage**: Post, edit, and delete messages within logs
- **Full Message History**: Browse complete conversation logs with timestamps
- **REST API**: Complete API for all operations

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: SQLite3 (local file-based)
- **Package Manager**: npm

## Installation

```bash
# Clone the repository
git clone https://github.com/reatoph/OS-System.git
cd OS-System

# Install dependencies
npm install

# Set up environment
cp .env.example .env

# Create data directory
mkdir -p data
```

## Running the Server

```bash
# Development (with hot reload)
npm run dev

# Production
npm run build
npm start
```

Server will start on `http://localhost:3000`

## API Endpoints

### Users
- `POST /api/users` - Create a new user
- `GET /api/users` - List all users
- `GET /api/users/:id` - Get user by ID

### Logs (Channels)
- `POST /api/logs` - Create a new log
- `GET /api/logs` - List all logs
- `GET /api/logs/:id` - Get log with all messages
- `PUT /api/logs/:id` - Update log

### Messages
- `POST /api/messages` - Post a message
- `GET /api/messages/log/:logId` - Get all messages in a log
- `PUT /api/messages/:id` - Edit a message
- `DELETE /api/messages/:id` - Delete a message

## Usage Example

```bash
# Create a user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"username": "player001", "displayName": "Player 001"}'

# Create a log
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{"title": "System Messages", "channel": "general"}'

# Post a message
curl -X POST http://localhost:3000/api/messages \
  -H "Content-Type: application/json" \
  -d '{"logId": "[log-id]", "userId": "[user-id]", "content": "Hello OS System!"}'

# Get log with messages
curl http://localhost:3000/api/logs/[log-id]
```

## Database Schema

- **users**: User profiles with username and display name
- **logs**: Message containers/channels with title and optional channel name
- **messages**: Individual messages with content, timestamps, and edit tracking

## Project Structure

```
src/
  ├── database/
  │   ├── db.ts          Database connection handler
  │   └── schema.ts      Table initialization
  ├── routes/
  │   ├── users.ts       User endpoints
  │   ├── logs.ts        Log endpoints
  │   └── messages.ts    Message endpoints
  ├── types/
  │   └── index.ts       TypeScript interfaces
  └── server.ts          Express app setup
```

## Development

```bash
# Build TypeScript
npm run build

# Run tests (when added)
npm test
```

## License

MIT
