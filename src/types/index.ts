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
// src/types/index.ts
export type User = {
  id: number;
  name: string;
  email: string;
};

export type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
};

export type Comment = {
  id: number;
  content: string;
  postId: number;
  authorId: number;
};
