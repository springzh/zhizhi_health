import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.id,
  });

  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    method: req.method,
    timestamp: new Date(),
  });
};

export const healthCheck = (req: Request, res: Response, next: NextFunction) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    node: process.version,
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
  };

  res.status(200).json({
    success: true,
    message: 'System is healthy',
    data: healthData,
    timestamp: new Date(),
  });
};