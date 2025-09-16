// --- Shared with frontend ---
export type TodoHistoryEntry = {
  type: 'created' | 'updated' | 'deleted';
  date: string;
  changes?: Partial<Todo>;
};

export type Todo = {
  id: string;
  title: string;
  description: string;
  date: string;
  deadline?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  createdAt: string;
  updatedAt: string;
  locationId?: string;
  relatedTaskIds?: string[];
  projectId: string;
  history?: TodoHistoryEntry[];
  linkedItems?: string[];
  assignedUsers?: string[];
  files?: string[];
  webhooks?: string[];
  ganttTaskIds?: string[];
};

export type User = {
  id: number;
  name: string;
  email: string;
};

export type FileItem = {
  id: string;
  name: string | null;
  url: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  projectId: string;
};

export type Permission = {
  id: string;
  type: string;
  resource: string;
  userId: string;
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
};

export type LinkedItem = {
  id: string;
  todoId: string;
  title: string;
  description: string | null;
  url: string;
  status: 'active' | 'archived' | 'pending' | null;
  createdAt: string;
  updatedAt: string;
  projectId: string;
};

export type GanttTask = {
  id: string;
  name?: string | null;
  start?: string | null;
  end?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  projectId: string;
  color: string;
};

export type Webhook = {
  id: string;
  name: string;
  platform: string;
  token: string | null;
  chatId: string | null;
  webhookUrl: string | null;
  enabled: boolean;
  projectId: string;
};

export type Project = {
  id: string;
  name: string;
  description?: string;
  avatarUrl?: string;
  plan?: string;
  members?: number;
};

export type History = {
  id: string;
  changes?: any;
  date: string;
  type: string;
  action: string;
  payload?: any;
  timestamp: string;
  user?: string;
};
