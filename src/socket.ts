import { Server as HttpServer } from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import amqp from 'amqplib';
import { RABBITMQ_URL } from './env';

const QUEUE_NAME = 'notification-events';
let io: SocketIOServer | null = null;

export function broadcastProjectSync(projectId: string, payload: any = {}) {
  if (!io) return;
  io.to(`project:${projectId}`).emit('project:sync', { projectId, ...payload });
}

export function emitTodoUpdate(projectId: string, todo: any) {
  if (!io) return;
  io.to(`project:${projectId}`).emit('todo:updated', { projectId, todo });
}

export function joinProjectRoom(socket: Socket, projectId: string) {
  socket.join(`project:${projectId}`);
}

export function setupSocket(server: HttpServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket: Socket) => {
    console.log('A user connected:', socket.id);

    socket.on('joinProject', (projectId: string) => {
      socket.join(`project:${projectId}`);
      console.log(`Socket ${socket.id} joined project:${projectId}`);
    });

    socket.on('todo:update', ({ projectId, todo }: { projectId: string; todo: any }) => {
      emitTodoUpdate(projectId, todo);
    });

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  // Start RabbitMQ consumer for notification events
  (async () => {
    try {
      const conn = await amqp.connect(RABBITMQ_URL);
      const channel = await conn.createChannel();
      await channel.assertQueue(QUEUE_NAME, { durable: false });
      channel.consume(QUEUE_NAME, (msg) => {
        if (msg !== null) {
          try {
            const event: any = JSON.parse(msg.content.toString());
            if (event.type === 'notification' && event.projectId && event.notification) {
              io!.to(`project:${event.projectId}`).emit('notification:new', event.notification);
            }
          } catch (err) {
            // Optionally log error
          }
          channel.ack(msg);
        }
      });
    } catch (err) {
      // Optionally log error
    }
  })();

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
}
