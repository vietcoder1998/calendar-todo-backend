import bodyParser from 'body-parser';
import cors from 'cors';
import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { addHistoryOnUpdate, attachAssetOnCreate } from './middlewares/asset.middleware';
import { parseQueryParams } from './middlewares/query.middleware';
import { boundaryResponse } from './middlewares/response.middleware';
import { createNotificationOnChange } from './middlewares/notification.middleware';
import assetRoutes from './routes/asset.routes';
import fileRouter from './routes/file.routes';
import ganttTaskRouter from './routes/ganttTask.routes';
import historyRouter from './routes/history.routes';
import linkedItemRouter from './routes/linkedItem.routes';
import locationRouter from './routes/location.routes';
import permissionRouter from './routes/permission.routes';
import projectRouter from './routes/project.routes';
import todoRouter from './routes/todo.routes';
import userRouter from './routes/user.routes';
import webhookRouter from './routes/webhook.routes';
import { setupSocket } from './socket';

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(parseQueryParams);
app.use(boundaryResponse);
app.use(attachAssetOnCreate);
app.use(addHistoryOnUpdate);
app.use(createNotificationOnChange);

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

app.get('/', (req: Request, res: Response) => {
  res.status(200).json({ message: 'server is running' });
});

const PORT = process.env.PORT || 4000;
httpServer.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
