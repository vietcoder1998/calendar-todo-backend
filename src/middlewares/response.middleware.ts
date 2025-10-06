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
      const errorCode = body.errorCode || body.code || -1;
      const message = body.message || body.error || String(body);
      const details = body.details || undefined;
      logger.error(
        [
          'API Error:',
          `message: ${message}`,
          `path: ${req.url}`,
          `method: ${req.method}`,
          'body:',
          formatTable(req.body), // <-- table format for body
          'headers:',
          formatTable(req.headers), // <-- table format for headers
          'calledDetail:',
          formatTable(req.meta), // <-- table format for meta
          details ? `details:\n${formatTable(details)}` : '',
        ]
          .filter(Boolean)
          .join('\n'),
      );
      return oldJson.call(this, { data: null, message, code, errorCode, details });
    }
    if (typeof body === 'string') {
      logger.info(
        [
          'API Success:',
          `message: ${body}`,
          `path: ${req.url}`,
          `method: ${req.method}`,
          'body:',
          formatTable(req.body),
          'headers:',
          formatTable(req.headers),
          'calledDetail:',
          formatTable(req.meta),
        ].join('\n'),
      );
      return oldJson.call(this, { data: null, message: String(body) });
    }
    // If data is an array, add total, page, pageSize
    if (Array.isArray(body)) {
      const page = req.meta?.page ?? 1;
      const pageSize = req.meta?.pageSize ?? 10;
      logger.info(
        [
          'API Success:',
          `message: Success`,
          `path: ${req.url}`,
          `method: ${req.method}`,
          'body:',
          formatTable(req.body),
          'headers:',
          formatTable(req.headers),
          'calledDetail:',
          formatTable(req.meta),
        ].join('\n'),
      );
      return oldJson.call(this, {
        data: body,
        total: body.length,
        page,
        pageSize,
        message: 'Success',
      });
    }
    // Default: wrap in { data, message }
    logger.info(
      [
        'API Success:',
        `message: Success`,
        `path: ${req.url}`,
        `method: ${req.method}`,
        'body:',
        formatTable(req.body),
        'headers:',
        formatTable(req.headers),
        'calledDetail:',
        formatTable(req.meta),
      ].join('\n'),
    );
    return oldJson.call(this, { data: body, message: 'Success' });
  };
  next();
}

// Helper to format objects as a table-like string for logging
function formatTable(obj: any): string {
  if (!obj || typeof obj !== 'object') return '';
  const entries = Object.entries(obj);
  if (entries.length === 0) return '';
  const header = '| Key           | Value         |\n|---------------|---------------|';
  const rows = entries
    .map(([key, value]) => {
      const val =
        typeof value === 'object' && value !== null ? JSON.stringify(value) : String(value);
      return `| ${key.padEnd(13)} | ${val.padEnd(13)} |`;
    })
    .join('\n');
  return `${header}\n${rows}`;
}
