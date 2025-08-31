import { Request, Response } from 'express';
import { logger } from '../utils/logger';

export interface RateLimitConfig {
  windowMs: number; // 时间窗口（毫秒）
  max: number; // 最大请求数
  message?: string;
  skipSuccessfulRequests?: boolean;
  skipFailedRequests?: boolean;
  keyGenerator?: (req: Request) => string;
}

export class RateLimiter {
  private store: Map<string, { count: number; resetTime: number }> = new Map();
  private config: RateLimitConfig;

  constructor(config: RateLimitConfig) {
    this.config = {
      windowMs: 15 * 60 * 1000, // 15分钟
      max: 100,
      message: 'Too many requests, please try again later.',
      ...config,
    };
  }

  middleware(req: Request, res: Response, next: Function) {
    const key = this.config.keyGenerator ? this.config.keyGenerator(req) : this.getDefaultKey(req);
    const now = Date.now();
    const record = this.store.get(key);

    if (!record || now > record.resetTime) {
      // 创建新记录或重置过期记录
      this.store.set(key, {
        count: 1,
        resetTime: now + this.config.windowMs,
      });
      return next();
    }

    if (record.count >= this.config.max) {
      logger.warn('Rate limit exceeded:', {
        key,
        count: record.count,
        url: req.url,
        method: req.method,
        ip: req.ip,
      });

      return res.status(429).json({
        success: false,
        message: this.config.message,
        retryAfter: Math.ceil((record.resetTime - now) / 1000),
        timestamp: new Date(),
      });
    }

    record.count++;
    next();
  }

  private getDefaultKey(req: Request): string {
    return req.ip || req.connection.remoteAddress || 'unknown';
  }

  // 清理过期记录的方法
  cleanup() {
    const now = Date.now();
    for (const [key, record] of this.store.entries()) {
      if (now > record.resetTime) {
        this.store.delete(key);
      }
    }
  }
}

// 预定义的速率限制器
export const createRateLimiter = (config: RateLimitConfig) => {
  const limiter = new RateLimiter(config);
  return limiter.middleware.bind(limiter);
};

// 通用API速率限制
export const generalRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 每个IP 100次请求
  message: 'Too many requests from this IP, please try again later.',
});

// 登录速率限制
export const loginRateLimit = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 5, // 每个IP 5次登录尝试
  message: 'Too many login attempts, please try again later.',
});

// 短信发送速率限制
export const smsRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 10, // 每个手机号 10次
  message: 'Too many SMS requests, please try again later.',
  keyGenerator: (req: Request) => {
    return req.body.phone || req.ip;
  },
});

// 文件上传速率限制
export const uploadRateLimit = createRateLimiter({
  windowMs: 60 * 60 * 1000, // 1小时
  max: 20, // 每个IP 20次上传
  message: 'Too many upload requests, please try again later.',
});

// 定期清理过期记录
setInterval(() => {
  // 这里可以添加清理逻辑
}, 5 * 60 * 1000); // 每5分钟清理一次