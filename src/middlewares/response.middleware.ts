import { Request, Response, NextFunction } from 'express';
import logger from '../logger';

// Extend Express Request to allow meta property
declare module 'express-serve-static-core' {
  interface Request {
    meta?: {
      query: Record<string, any>;
      params: Record<string, any>;
      page: number;
      pageSize: number;
      q: string;
      [key: string]: any;
    };
  }
}

/**
 * Middleware to wrap all responses in a boundary format: { data, message }
 * Usage: Place after all routes, before error handler.
 */
export function boundaryResponse(req: Request, res: Response, next: NextFunction) {
  // If x-project-id header is present, add projectId to req.params
  const projectIdHeader = req.headers['x-project-id'];

  if (projectIdHeader) {
    req.params = { ...req.params, projectId: String(projectIdHeader) };
    req.body = { ...req.body, projectId: String(projectIdHeader) };
  }

  // Mock all query and params into req.meta
  req.meta = {
    ...req.meta,
    query: { ...req.query },
    params: { ...req.params },
    page: req.query.page ? Number(req.query.page) : 1,
    pageSize: req.query.pageSize ? Number(req.query.pageSize) : 10,
    q: typeof req.query.q === 'string' ? req.query.q : '',
  };
  const oldJson = res.json;
  res.json = function (body: any) {
    // If already in boundary format, don't double-wrap
    if (body && typeof body === 'object' && 'data' in body && 'message' in body) {
      return oldJson.call(this, body);
    }
    // If body is an error or string, treat as message
    if (body instanceof Error || (body && body.error)) {
      // If error object, try to extract code and errorCode
      const code = body.code || 500;
      const errorCode = body.errorCode || body.code || 'UNKNOWN_ERROR';
      const message = body.message || body.error || String(body);
      logger.error(
        'API Error: %s | Path: %s | Method: %s | Body: %o | Headers: %o',
        message,
        req.originalUrl,
        req.method,
        req.body,
        req.headers,
      );
      return oldJson.call(this, { data: null, message, code, errorCode });
    }
    if (typeof body === 'string') {
      return oldJson.call(this, { data: null, message: String(body) });
    }
    // If data is an array, add total, page, pageSize
    if (Array.isArray(body)) {
      const page = req.meta?.page ?? 1;
      const pageSize = req.meta?.pageSize ?? 10;
      return oldJson.call(this, {
        data: body,
        total: body.length,
        page,
        pageSize,
        message: 'Success',
      });
    }
    // Default: wrap in { data, message }
    return oldJson.call(this, { data: body, message: 'Success' });
  };
  next();
}
