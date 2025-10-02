import { pingMySQL } from './prisma';

import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { addHistoryOnUpdate, attachAssetOnCreate } from './middlewares/asset.middleware';
import { createNotificationOnChange } from './middlewares/notification.middleware';
import { parseQueryParams } from './middlewares/query.middleware';
import { boundaryResponse } from './middlewares/response.middleware';
import assetRoutes from './routes/asset.routes';
import fileRouter from './routes/file.routes';
import ganttTaskRouter from './routes/ganttTask.routes';
import historyRouter from './routes/history.routes';
import linkedItemRouter from './routes/linkedItem.routes';
import locationRouter from './routes/location.routes';
import notificationRouter from './routes/notification.routes';
import permissionRouter from './routes/permission.routes';
import projectRouter from './routes/project.routes';
import todoRouter from './routes/todo.routes';
import userRouter from './routes/user.routes';
import webhookRouter from './routes/webhook.routes';
import jobRouter from './routes/job.routes';
import notificationTemplateRouter from './routes/notificationTemplate.routes';
import reportRouter from './routes/report.routes';
import { setupSocket } from './socket';
import logger from './logger';

const app = express();
app.get('/api/ping-mysql', async (req: Request, res: Response) => {
  const ok = await pingMySQL();
  if (ok) {
    res.status(200).json({ status: 'ok', message: 'MySQL connection successful' });
  } else {
    res.status(500).json({ status: 'error', message: 'MySQL connection failed' });
  }
});

app.use(cors());
app.use(bodyParser.json());
app.use(parseQueryParams);
app.use(boundaryResponse);
app.use(attachAssetOnCreate);
app.use(addHistoryOnUpdate);
app.use(createNotificationOnChange);

// MySQL ping endpoint (must be after app is declared)
app.get('/api/ping-mysql', async (req: Request, res: Response) => {
  const ok = await pingMySQL();
  if (ok) {
    res.status(200).json({ status: 'ok', message: 'MySQL connection successful' });
  } else {
    res.status(500).json({ status: 'error', message: 'MySQL connection failed' });
  }
});

const httpServer = createServer(app);
setupSocket(httpServer);

// --- PROJECTS ROUTES ---

app.use('/api/projects', projectRouter);
app.use('/api/users', userRouter);
app.use('/api/todos', todoRouter);
app.use('/api/files', fileRouter);
app.use('/api/permissions', permissionRouter);
app.use('/api/linked-items', linkedItemRouter);
app.use('/api/gantt-tasks', ganttTaskRouter);
app.use('/api/webhooks', webhookRouter);
app.use('/api/histories', historyRouter);
app.use('/api/jobs', jobRouter);

// --- PROJECTS ROUTES ---
app.use('/api/projects', projectRouter);
app.use('/api/users', userRouter);
app.use('/api/todos', todoRouter);
app.use('/api/files', fileRouter);
app.use('/api/permissions', permissionRouter);
app.use('/api/linked-items', linkedItemRouter);
app.use('/api/gantt-tasks', ganttTaskRouter);
app.use('/api/webhooks', webhookRouter);
app.use('/api/histories', historyRouter);
app.use('/api/locations', locationRouter);
app.use('/api/assets', assetRoutes);
app.use('/api/notifications', notificationRouter);
app.use('/api/jobs', jobRouter);
app.use('/api/notification-templates', notificationTemplateRouter);
app.use('/api/reports', reportRouter);

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'server is running' });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  logger.info(`API server running on http://localhost:${PORT}`);
});
