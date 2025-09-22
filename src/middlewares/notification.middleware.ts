import { PrismaClient } from '@prisma/client';
import { NextFunction, Request, Response } from 'express';
const prisma = new PrismaClient();

/**
 * Middleware to create a notification on POST, PATCH, PUT requests.
 * Expects req.body.projectId to be present.
 */
export async function createNotificationOnChange(req: Request, res: Response, next: NextFunction) {
  const method = req.method.toLowerCase();
  if (['post', 'put', 'patch'].includes(method)) {
    const { projectId } = req.body;
    if (projectId) {
      try {
        // Determine resource type using switch-case
        let resourceType = 'resource';
        switch (true) {
          case req.originalUrl.includes('todo'):
            resourceType = 'todo';
            break;
          case req.originalUrl.includes('gantt'):
            resourceType = 'gantt task';
            break;
          case req.originalUrl.includes('history'):
            resourceType = 'history';
            break;
          case req.originalUrl.includes('permission'):
            resourceType = 'permission';
            break;
          case req.originalUrl.includes('file'):
            resourceType = 'file';
            break;
          case req.originalUrl.includes('asset'):
            resourceType = 'asset';
            break;
          case req.originalUrl.includes('user'):
            resourceType = 'user';
            break;
          case req.originalUrl.includes('location'):
            resourceType = 'location';
            break;
          case req.originalUrl.includes('webhook'):
            resourceType = 'webhook';
            break;
          case req.originalUrl.includes('linked-item'):
            resourceType = 'linked-item';
            break;
        }
        // Get userId if present
        const userId = req.body.userId || 'unknown';
        await prisma.notification.create({
          data: {
            projectId,
            title: `Project ${projectId} ${resourceType} ${method.toUpperCase()} change`,
            message: `A ${method.toUpperCase()} operation was performed on ${resourceType} by user ${userId}.\nRequest body: ${JSON.stringify(req.body)}`,
            type: resourceType,
            data: req.body,
          },
        });
      } catch (err) {
        // Optionally log error, but don't block the request
        // console.error('Failed to create notification:', err);
      }
    }
  }
  next();
}
