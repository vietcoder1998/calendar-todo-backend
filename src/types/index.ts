// Project with all relations for backend service use
export type ProjectWithAll = Project & {
  todos: Todo[];
  files: FileItem[];
  permissions: Permission[];
  linkedItems: LinkedItem[];
  ganttTasks: GanttTask[];
  webhooks: Webhook[];
  users: User[];
};

export interface Asset {
  id: string;
  name: string;
  label?: string | null;
  typeId: string;
  type?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
  status?: number; // delete: -2, remove: -1, inactive: 0, active: 1

  todos?: Todo[];
  files?: FileItem[];
  locations?: Location[];
  ganttTasks?: GanttTask[];
  linkedItems?: LinkedItem[];
  permissions?: Permission[];
}
export type Location = {
  id: string;
  name: string;
  label?: string | null;
  latitude: number;
  longitude: number;
  googleMapsLink: string | null;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  status?: number; // delete: -2, remove: -1, inactive: 0, active: 1
  //  (removed)
};
// --- Shared with frontend ---
export type TodoHistoryEntry = {
  type: 'created' | 'updated' | 'deleted';
  date: string;
  changes?: Partial<Todo>;
};

export type Todo = {
  id: string;
  title: string;
  label?: string | null;
  description: string;
  date: string;
  deadline?: string | null;
  status: 'todo' | 'in-progress' | 'review' | 'done' | number; // string for legacy, number for new status
  createdAt: string;
  updatedAt: string;
  locationId?: string | null;
  relatedTaskIds?: string[] | null;
  projectId: string;
  history?: TodoHistoryEntry[];
  linkedItems?: string[];
  assignedUsers?: string[];
  files?: string[];
  webhooks?: string[];
  ganttTaskIds?: string[];
};

export type Role = {
  id: string;
  name: string;
  projectId: string;
  status?: number; // delete: -2, remove: -1, inactive: 0, active: 1
  createdAt: Date;
  updatedAt: Date;
};

export type User = {
  id: string;
  name: string;
  email: string;
  label?: string | null;
  status?: number; // delete: -2, remove: -1, inactive: 0, active: 1
  roleId?: string | null; // <-- Add this line for user-role relation
  role?: Role | null; // <-- Add this line for user-role relation
};

export type FileItem = {
  id: string;
  name: string | null;
  label?: string | null;
  url: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  projectId: string;
  assetId?: string | null;
  status?: number; // delete: -2, remove: -1, inactive: 0, active: 1
};

export type Permission = {
  id: string;
  type: string;
  resource: string;
  userId: string;
  projectId: string;
  assetId: string | null;
  asset?: Record<string, unknown>;
  name?: string | null;
  description?: string | null;
  label?: string | null;
  status?: number; // delete: -2, remove: -1, inactive: 0, active: 1
  createdAt: Date;
  updatedAt: Date;
  users?: User[]; // Add users relation for many-to-many mapping
};

export type LinkedItem = {
  id: string;
  todoId: string;
  title: string;
  label: string | null;
  description: string | null;
  url: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  projectId: string;
  assetId: string | null;
};

export type GanttTask = {
  id: string;
  name: string | null;
  label?: string | null;
  start: string | null;
  end: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  startDate: string | null;
  endDate: string | null;
  color: string | null;
  projectId: string;
  assetId: string | null;
  status?: number; // delete: -2, remove: -1, inactive: 0, active: 1
};

export type Webhook = {
  id: string;
  name: string;
  label?: string | null;
  platform: string;
  token: string | null;
  chatId: string | null;
  webhookUrl: string | null;
  enabled: boolean;
  projectId: string;
  status?: number; // delete: -2, remove: -1, inactive: 0, active: 1
};

export type Project = {
  id: string;
  name: string;
  label?: string | null;
  description?: string | null;
  avatarUrl?: string | null;
  plan?: string | null;
  members?: number | null;
  status?: number; // delete: -2, remove: -1, inactive: 0, active: 1
};

export type History = {
  id: string;
  changes?: Record<string, unknown>;
  date: string;
  type: string;
  action: string;
  payload?: Record<string, unknown>;
  timestamp: string;
  user?: string;
  status?: number; // delete: -2, remove: -1, inactive: 0, active: 1

  projectId: string;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: string;
  data?: Record<string, unknown>;
  read: boolean;
  createdAt: string;
  updatedAt: string;
  status?: number; // delete: -2, remove: -1, inactive: 0, active: 1
  projectId: string;
};
