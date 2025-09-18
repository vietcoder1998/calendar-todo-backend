import { Request, Response, NextFunction } from 'express';

/**
 * Middleware to wrap all responses in a boundary format: { data, message }
 * Usage: Place after all routes, before error handler.
 */
export function boundaryResponse(req: Request, res: Response, next: NextFunction) {
  const oldJson = res.json;
  res.json = function (body: any) {
    // If already in boundary format, don't double-wrap
    if (body && typeof body === 'object' && 'data' in body && 'message' in body) {
      return oldJson.call(this, body);
    }
    // If body is an error or string, treat as message
    if (typeof body === 'string' || body instanceof Error) {
      return oldJson.call(this, { data: null, message: String(body) });
    }
    // Default: wrap in { data, message }
    return oldJson.call(this, { data: body, message: 'Success' });
  };
  next();
}
