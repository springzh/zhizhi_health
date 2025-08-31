import winston from 'winston';
import path from 'path';

// 日志级别
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// 日志颜色
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// 添加颜色支持
winston.addColors(colors);

// 日志格式
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// 日志文件路径
const logDir = process.env.LOG_DIR || 'logs';

// 创建logger实例
export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels,
  format,
  transports: [
    // 控制台输出
    new winston.transports.Console(),
    
    // 错误日志文件
    new winston.transports.File({
      filename: path.join(logDir, 'error.log'),
      level: 'error',
    }),
    
    // 所有日志文件
    new winston.transports.File({
      filename: path.join(logDir, 'combined.log'),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'exceptions.log') }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: path.join(logDir, 'rejections.log') }),
  ],
});

// 创建Morgan日志流
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// 导出stream供其他模块使用
export { stream };

// HTTP请求日志中间件
export const httpLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.http(`${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`);
  });
  
  next();
};

// 性能监控日志
export const performanceLogger = (label: string) => {
  const start = Date.now();
  
  return {
    end: () => {
      const duration = Date.now() - start;
      logger.debug(`Performance [${label}]: ${duration}ms`);
      return duration;
    },
  };
};

// 数据库查询日志
export const queryLogger = (query: string, params: any[], duration: number) => {
  if (process.env.DATABASE_LOGGING === 'true') {
    logger.debug(`Database Query [${duration}ms]: ${query}`, params);
  }
};

// API调用日志
export const apiLogger = (req: any, res: any, next: any) => {
  const start = Date.now();
  const originalSend = res.send;
  
  res.send = function(data: any) {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      userAgent: req.get('User-Agent'),
      ip: req.ip,
      userId: req.user?.id,
      requestId: req.id,
    };
    
    if (res.statusCode >= 400) {
      logger.warn('API Call Error:', logData);
    } else {
      logger.info('API Call Success:', logData);
    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

// 业务逻辑日志
export const businessLogger = {
  // 用户相关日志
  userAction: (userId: number, action: string, details?: any) => {
    logger.info(`User Action [${userId}]: ${action}`, details);
  },
  
  // 预约相关日志
  appointmentAction: (appointmentId: number, action: string, details?: any) => {
    logger.info(`Appointment Action [${appointmentId}]: ${action}`, details);
  },
  
  // 支付相关日志
  paymentAction: (paymentId: string, action: string, details?: any) => {
    logger.info(`Payment Action [${paymentId}]: ${action}`, details);
  },
  
  // 短信相关日志
  smsAction: (phone: string, action: string, details?: any) => {
    logger.info(`SMS Action [${phone}]: ${action}`, details);
  },
};

// 安全日志
export const securityLogger = {
  // 登录日志
  login: (userId: number, ip: string, userAgent: string, success: boolean) => {
    logger.info(`Login Attempt [${userId}]: ${success ? 'Success' : 'Failed'}`, {
      ip,
      userAgent,
      timestamp: new Date().toISOString(),
    });
  },
  
  // 权限错误日志
  authorizationError: (userId: number, resource: string, action: string) => {
    logger.warn(`Authorization Error [${userId}]: ${action} on ${resource}`);
  },
  
  // 验证错误日志
  validationError: (field: string, value: any, error: string) => {
    logger.warn(`Validation Error [${field}]: ${error}`, { value });
  },
};

export default logger;