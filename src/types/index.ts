// Job type for backend service use
export type Job = {
  id: string;
  name: string;
  schedule: string;
  enabled: boolean;
  webhookId: string;
  status: number;
  createdAt: string;
  updatedAt: string;
  position: number | null;
};
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
  status: number | null; // delete: -2, remove: -1, inactive: 0, active: 1

  todos?: Todo[];
  files?: FileItem[];
  locations?: Location[];
  ganttTasks?: GanttTask[];
  linkedItems?: LinkedItem[];
  permissions?: Permission[];
  position: number | null;
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
  status: number | null; // delete: -2, remove: -1, inactive: 0, active: 1
  position: number | null;
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
  status: number; // string for legacy, number for new status
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
  position: number | null;
  startDate?: string | null;
  endDate?: string | null;
};

export type Role = {
  id: string;
  name: string;
  projectId: string;
  status: number | null; // delete: -2, remove: -1, inactive: 0, active: 1
  createdAt: Date;
  updatedAt: Date;
  position: number | null;
};

export type User = {
  id: string;
  name: string;
  email: string;
  label?: string | null;
  status: number | null; // delete: -2, remove: -1, inactive: 0, active: 1
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
  status: number | null; // delete: -2, remove: -1, inactive: 0, active: 1
  position: number | null;
};

export type Permission = {
  id: string;
  type: string;
  resource: string;
  userId: string;
  projectId: string;
  assetId: string | null;
  asset?: Record<string, unknown>;
  label?: string | null;
  name?: string; // added for display name
  description?: string; // added for optional description
  status: number | null; // delete: -2, remove: -1, inactive: 0, active: 1
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
  position: number | null;
};

export type GanttTask = {
  id: string;
  name: string | null;
  label?: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  startDate: string | null;
  endDate: string | null;
  color: string | null;
  projectId: string;
  assetId: string | null;
  status: number | null; // delete: -2, remove: -1, inactive: 0, active: 1
  position: number | null;
  progress: number; // 0 to 100
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
  status: number | null; // delete: -2, remove: -1, inactive: 0, active: 1
};

export type Project = {
  id: string;
  name: string;
  label?: string | null;
  description?: string | null;
  avatarUrl?: string | null;
  plan?: string | null;
  members: number | null | null;
  status: number | null; // delete: -2, remove: -1, inactive: 0, active: 1
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

export type JobInput = {
  name: string;
  description?: string;
  schedule: string;
  webhookUrl: string;
  enabled?: boolean;
  config?: any;
  webhookId?: string | null;
  status: number | null; // delete: -2, remove: -1, inactive: 0, active: 1

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
  status: number | null; // delete: -2, remove: -1, inactive: 0, active: 1
  projectId: string;
  position: number | null;
};

export type Label = {
  id: string;
  name: string;
  color?: string | null;
  projectId: string;
  status: number | null;
  createdAt: string;
  updatedAt: string;
  position: number | null;
};

export type Report = {
  id: string;
  title: string;
  content?: string | null;
  projectId: string;
  status: number | null;
  createdAt: string;
  updatedAt: string;
  position: number | null;
};
