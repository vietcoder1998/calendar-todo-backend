// Broadcast a sync event to all users in a project
export function broadcastProjectSync(projectId: string) {
  if (!io) return;
  io.to(`project:${projectId}`).emit('project:sync', { projectId });
}
// Helper to join a project room (call from client connection handler)
export function joinProjectRoom(socket: any, projectId: string) {
  socket.join(`project:${projectId}`);
}
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';

let io: SocketIOServer | null = null;

export function setupSocket(server: HttpServer) {
  io = new SocketIOServer(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized!');
  return io;
}
