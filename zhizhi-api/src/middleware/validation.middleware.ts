import { Request, Response, NextFunction } from 'express';
import { validationResult, matchedData } from 'express-validator';
import { logger } from '../utils/logger';

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => ({
      field: error.param,
      message: error.msg,
      value: error.value,
    }));

    logger.warn('Validation failed:', {
      errors: errorMessages,
      url: req.url,
      method: req.method,
      ip: req.ip,
    });

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errorMessages,
      timestamp: new Date(),
    });
  }

  // 将验证后的数据附加到请求对象
  req.validatedData = matchedData(req);
  next();
};

export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // 基础输入清理
  if (req.body) {
    sanitizeObject(req.body);
  }
  
  if (req.query) {
    sanitizeObject(req.query);
  }
  
  if (req.params) {
    sanitizeObject(req.params);
  }

  next();
};

function sanitizeObject(obj: any) {
  for (const key in obj) {
    if (typeof obj[key] === 'string') {
      // 移除潜在的XSS攻击字符
      obj[key] = obj[key]
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '');
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      sanitizeObject(obj[key]);
    }
  }
}

// 扩展Express Request类型
declare global {
  namespace Express {
    interface Request {
      validatedData?: any;
    }
  }
}