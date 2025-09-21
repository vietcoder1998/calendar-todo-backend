import { Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
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
        await prisma.notification.create({
          data: {
            projectId,
            title: `Project ${projectId} ${method.toUpperCase()} change`,
            message: `A ${method.toUpperCase()} operation was performed on project ${projectId}.`,
            type: 'info',
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
