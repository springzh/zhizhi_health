import { RateLimiterMemory } from 'rate-limiter-flexible';
import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

// 创建内存速率限制器
const rateLimiter = new RateLimiterMemory({
  points: 100, // 每个时间窗口允许的请求数
  duration: 900, // 时间窗口（秒）
});

// 速率限制中间件
export const rateLimiterMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const key = req.ip || req.connection.remoteAddress || 'unknown';
    
    await rateLimiter.consume(key);
    next();
  } catch (rejRes: any) {
    const remainingPoints = rejRes.remainingPoints || 0;
    const msBeforeNext = rejRes.msBeforeNext || 1000;
    
    logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
    
    res.set('Retry-After', String(Math.round(msBeforeNext / 1000)));
    res.set('X-RateLimit-Limit', '100');
    res.set('X-RateLimit-Remaining', String(remainingPoints));
    res.set('X-RateLimit-Reset', String(new Date(Date.now() + msBeforeNext)));
    
    res.status(429).json({
      success: false,
      message: '请求过于频繁，请稍后再试',
      error: 'RATE_LIMIT_EXCEEDED'
    });
  }
};

// 通用速率限制器
export const generalRateLimit = rateLimiterMiddleware;

export default {
  rateLimiterMiddleware,
  generalRateLimit,
};