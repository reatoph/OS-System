export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar?: string;
  createdAt: Date;
}

export interface Message {
  id: string;
  userId: string;
  content: string;
  timestamp: Date;
  edited?: boolean;
  editedAt?: Date;
}

export interface LogEntry {
  id: string;
  title: string;
  channel?: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}
