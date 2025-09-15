import { PrismaClient } from '@prisma/client';
import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';

const prisma = new PrismaClient();
const app = express();

app.use(cors({ origin: '*' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ strict: false }));

// --- USERS (Prisma) ---
app.get('/api/users', async (req: Request, res: Response) => {
  const users = await prisma.user.findMany();
  res.json(users);
});
app.post('/api/users', async (req: Request, res: Response) => {
  const { name, email } = req.body;
  try {
    const user = await prisma.user.create({ data: { name, email } });
    res.status(201).json(user);
  } catch (e: any) {
    res.status(400).json({ error: 'User creation failed', details: e?.message || String(e) });
  }
});
app.put('/api/users/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;
  try {
    const user = await prisma.user.update({
      where: { id },
      data: { name, email },
    });
    res.json(user);
  } catch (e: any) {
    res.status(404).json({ error: 'User not found', details: e?.message || String(e) });
  }
});
app.delete('/api/users/:id', async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  try {
    await prisma.user.delete({ where: { id } });
    res.status(204).end();
  } catch (e: any) {
    res.status(404).json({ error: 'User not found', details: e?.message || String(e) });
  }
});

// --- TODOS (Mock) ---
type Todo = { id: string; [key: string]: unknown };
let todos: Todo[] = [];

app.get('/api/todos', (req: Request, res: Response) => {
  try {
    res.json(todos);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch todos', details: e?.message || String(e) });
  }
});
app.post('/api/todos', (req: Request, res: Response) => {
  try {
    const todo = req.body;
    todos.push(todo);
    res.status(201).json(todo);
  } catch (e: any) {
    res.status(400).json({ error: 'Todo creation failed', details: e?.message || String(e) });
  }
});
app.put('/api/todos/:id', (req: Request, res: Response) => {
  try {
    const body = req.body;
    const idx = todos.findIndex((t) => t.id === req.params.id);
    if (idx !== -1) {
      todos[idx] = { ...todos[idx], ...body };
      return res.json(todos[idx]);
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'Todo update failed', details: e?.message || String(e) });
  }
});
app.delete('/api/todos/:id', (req: Request, res: Response) => {
  try {
    todos = todos.filter((t) => t.id !== req.params.id);
    res.status(204).end();
  } catch (e: any) {
    res.status(400).json({ error: 'Todo deletion failed', details: e?.message || String(e) });
  }
});

// --- FILES (Mock) ---
type FileItem = { id: string; [key: string]: unknown };
const files: FileItem[] = [];
app.get('/api/files', (req: Request, res: Response) => {
  try {
    res.json(files);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch files', details: e?.message || String(e) });
  }
});
app.post('/api/files', (req: Request, res: Response) => {
  try {
    const file = req.body;
    files.push(file);
    res.status(201).json(file);
  } catch (e: any) {
    res.status(400).json({ error: 'File creation failed', details: e?.message || String(e) });
  }
});
app.put('/api/files/:id', (req: Request, res: Response) => {
  try {
    const body = req.body;
    const idx = files.findIndex((f) => f.id === req.params.id);
    if (idx !== -1 && typeof files[idx] === 'object') {
      files[idx] = { ...files[idx], ...body };
      return res.json(files[idx]);
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'File update failed', details: e?.message || String(e) });
  }
});
app.delete('/api/files/:id', (req: Request, res: Response) => {
  try {
    const idx = files.findIndex((f) => f.id === req.params.id);
    if (idx !== -1) {
      files.splice(idx, 1);
      return res.status(204).end();
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'File deletion failed', details: e?.message || String(e) });
  }
});

// --- PERMISSIONS (Prisma) ---
app.get('/api/permissions', async (req: Request, res: Response) => {
  try {
    const permissions = await prisma.permission.findMany();
    res.json(permissions);
  } catch (e: any) {
    res
      .status(500)
      .json({ error: 'Failed to fetch permissions', details: e?.message || String(e) });
  }
});
app.post('/api/permissions', async (req: Request, res: Response) => {
  try {
    const permission = await prisma.permission.create({ data: req.body });
    res.status(201).json(permission);
  } catch (e: any) {
    res.status(400).json({ error: 'Permission creation failed', details: e?.message || String(e) });
  }
});
app.delete('/api/permissions/:id', async (req: Request, res: Response) => {
  try {
    await prisma.permission.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e: any) {
    res.status(400).json({ error: 'Permission deletion failed', details: e?.message || String(e) });
  }
});

// --- LINKED ITEMS (Mock) ---
type LinkedItem = { id: string; [key: string]: unknown };
const linkedItems: LinkedItem[] = [];
app.get('/api/linked-items', (req: Request, res: Response) => {
  try {
    res.json(linkedItems);
  } catch (e: any) {
    res
      .status(500)
      .json({ error: 'Failed to fetch linked items', details: e?.message || String(e) });
  }
});
app.post('/api/linked-items', (req: Request, res: Response) => {
  try {
    const item = req.body;
    linkedItems.push(item);
    res.status(201).json(item);
  } catch (e: any) {
    res
      .status(400)
      .json({ error: 'Linked item creation failed', details: e?.message || String(e) });
  }
});
app.put('/api/linked-items/:id', (req: Request, res: Response) => {
  try {
    const body = req.body;
    const idx = linkedItems.findIndex((i) => i.id === req.params.id);
    if (idx !== -1 && typeof linkedItems[idx] === 'object') {
      linkedItems[idx] = { ...linkedItems[idx], ...body };
      return res.json(linkedItems[idx]);
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'Linked item update failed', details: e?.message || String(e) });
  }
});
app.delete('/api/linked-items/:id', (req: Request, res: Response) => {
  try {
    const idx = linkedItems.findIndex((i) => i.id === req.params.id);
    if (idx !== -1) {
      linkedItems.splice(idx, 1);
      return res.status(204).end();
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res
      .status(400)
      .json({ error: 'Linked item deletion failed', details: e?.message || String(e) });
  }
});

// --- GANTT TASKS (Mock) ---
type GanttTask = { id: string; [key: string]: unknown };
const ganttTasks: GanttTask[] = [];
app.get('/api/gantt-tasks', (req: Request, res: Response) => {
  try {
    res.json(ganttTasks);
  } catch (e: any) {
    res
      .status(500)
      .json({ error: 'Failed to fetch gantt tasks', details: e?.message || String(e) });
  }
});
app.post('/api/gantt-tasks', (req: Request, res: Response) => {
  try {
    const task = req.body;
    ganttTasks.push(task);
    res.status(201).json(task);
  } catch (e: any) {
    res.status(400).json({ error: 'Gantt task creation failed', details: e?.message || String(e) });
  }
});
app.put('/api/gantt-tasks/:id', (req: Request, res: Response) => {
  try {
    const body = req.body;
    const idx = ganttTasks.findIndex((t) => t.id === req.params.id);
    if (idx !== -1 && typeof ganttTasks[idx] === 'object') {
      ganttTasks[idx] = { ...ganttTasks[idx], ...body };
      return res.json(ganttTasks[idx]);
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'Gantt task update failed', details: e?.message || String(e) });
  }
});
app.delete('/api/gantt-tasks/:id', (req: Request, res: Response) => {
  try {
    const idx = ganttTasks.findIndex((t) => t.id === req.params.id);
    if (idx !== -1) {
      ganttTasks.splice(idx, 1);
      return res.status(204).end();
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'Gantt task deletion failed', details: e?.message || String(e) });
  }
});

// --- WEBHOOKS (Mock) ---
type Webhook = { id: string; [key: string]: unknown };
const webhooks: Webhook[] = [];
app.get('/api/webhooks', (req: Request, res: Response) => {
  try {
    res.json(webhooks);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch webhooks', details: e?.message || String(e) });
  }
});
app.post('/api/webhooks', (req: Request, res: Response) => {
  try {
    const webhook = req.body;
    webhooks.push(webhook);
    res.status(201).json(webhook);
  } catch (e: any) {
    res.status(400).json({ error: 'Webhook creation failed', details: e?.message || String(e) });
  }
});
app.put('/api/webhooks/:id', (req: Request, res: Response) => {
  try {
    const body = req.body;
    const idx = webhooks.findIndex((w) => w.id === req.params.id);
    if (idx !== -1 && typeof webhooks[idx] === 'object') {
      webhooks[idx] = { ...webhooks[idx], ...body };
      return res.json(webhooks[idx]);
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'Webhook update failed', details: e?.message || String(e) });
  }
});
app.delete('/api/webhooks/:id', (req: Request, res: Response) => {
  try {
    const idx = webhooks.findIndex((w) => w.id === req.params.id);
    if (idx !== -1) {
      webhooks.splice(idx, 1);
      return res.status(204).end();
    }
    res.status(404).json({ error: 'Not found' });
  } catch (e: any) {
    res.status(400).json({ error: 'Webhook deletion failed', details: e?.message || String(e) });
  }
});

// --- PROJECTS CRUD với Prisma ---
app.get('/api/projects', async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch projects', details: e?.message || String(e) });
  }
});

app.post('/api/projects', async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.create({
      data: req.body, // nhớ validate trước khi save
    });
    res.status(201).json(project);
  } catch (e: any) {
    res.status(400).json({ error: 'Project creation failed', details: e?.message || String(e) });
  }
});

app.put('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const project = await prisma.project.update({
      where: { id },
      data: req.body,
    });
    res.json(project);
  } catch (e: any) {
    res.status(400).json({ error: 'Project update failed', details: e?.message || String(e) });
  }
});

app.delete('/api/projects/:id', async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await prisma.project.delete({
      where: { id },
    });
    res.status(204).end();
  } catch (e: any) {
    res.status(400).json({ error: 'Project deletion failed', details: e?.message || String(e) });
  }
});

app.get('/api/projects', async (req: Request, res: Response) => {
  try {
    const projects = await prisma.project.findMany();
    res.json(projects);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch projects', details: e?.message || String(e) });
  }
});

app.post('/api/projects', async (req: Request, res: Response) => {
  try {
    const project = await prisma.project.create({
      data: req.body, // nhớ validate trước khi save
    });
    res.status(201).json(project);
  } catch (e: any) {
    res.status(400).json({ error: 'Project creation failed', details: e?.message || String(e) });
  }
});

// --- HISTORY (Mock) ---
type HistoryEntry = {
  changes?: HistoryEntry[];
  date: string | number | Date;
  type: string;
  action: string;
  payload: unknown;
  timestamp: string;
  user?: string;
};
let history: HistoryEntry[] = [];
app.get('/api/history', (req: Request, res: Response) => {
  try {
    res.json(history);
  } catch (e: any) {
    res.status(500).json({ error: 'Failed to fetch history', details: e?.message || String(e) });
  }
});
app.post('/api/history', (req: Request, res: Response) => {
  try {
    const entry = req.body as HistoryEntry;
    history.push(entry);
    res.status(201).json(entry);
  } catch (e: any) {
    res
      .status(400)
      .json({ error: 'History entry creation failed', details: e?.message || String(e) });
  }
});
app.delete('/api/history', (req: Request, res: Response) => {
  try {
    history = [];
    res.status(204).end();
  } catch (e: any) {
    res.status(400).json({ error: 'History deletion failed', details: e?.message || String(e) });
  }
});

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'server is running' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
