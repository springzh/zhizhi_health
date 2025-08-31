import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  // 记录请求开始
  logger.info(`${req.method} ${req.originalUrl} started`, {
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    requestId: req.id,
  });

  res.on('finish', () => {
    const duration = Date.now() - start;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'info';
    
    logger[logLevel](`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      ip: req.ip,
      userAgent: req.get('User-Agent'),
      requestId: req.id,
      duration,
      statusCode: res.statusCode,
    });
  });

  next();
};

export const requestId = (req: Request, res: Response, next: NextFunction) => {
  req.id = req.headers['x-request-id'] as string || 
           req.headers['request-id'] as string || 
           generateRequestId();
  
  res.setHeader('X-Request-ID', req.id);
  next();
};

function generateRequestId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const securityHeaders = (req: Request, res: Response, next: NextFunction) => {
  // 安全相关的响应头
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  
  next();
};

export const corsHandler = (req: Request, res: Response, next: NextFunction) => {
  // CORS已经通过cors中间件处理，这里可以添加额外的CORS逻辑
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  
  next();
};