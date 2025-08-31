import dotenv from 'dotenv';

// 加载环境变量
dotenv.config();

export interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  username: string;
  password: string;
  ssl: boolean | object;
  logging: boolean;
  pool: {
    min: number;
    max: number;
    idle: number;
    acquire: number;
  };
}

export interface RedisConfig {
  host: string;
  port: number;
  password?: string;
  db: number;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}

export interface SmsConfig {
  accessKeyId: string;
  accessKeySecret: string;
  signName: string;
  templateCode: string;
}

export interface WechatConfig {
  appId: string;
  appSecret: string;
}

export interface OssConfig {
  accessKeyId: string;
  accessKeySecret: string;
  bucket: string;
  region: string;
}

export interface AppConfig {
  nodeEnv: string;
  port: number;
  cors: {
    origin: string | string[];
    credentials: boolean;
  };
  upload: {
    maxSize: number;
    allowedTypes: string[];
  };
  rateLimit: {
    windowMs: number;
    maxRequests: number;
  };
  swagger: {
    title: string;
    description: string;
    version: string;
  };
}

export const databaseConfig: DatabaseConfig = {
  host: process.env.DATABASE_HOST || 'localhost',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  database: process.env.DATABASE_NAME || 'zhizhi_health',
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || '',
  ssl: process.env.DATABASE_SSL === 'true' ? {
    rejectUnauthorized: process.env.DATABASE_SSL_REJECT_UNAUTHORIZED !== 'false'
  } : false,
  logging: process.env.DATABASE_LOGGING === 'true',
  pool: {
    min: parseInt(process.env.DATABASE_POOL_MIN || '2'),
    max: parseInt(process.env.DATABASE_POOL_MAX || '10'),
    idle: parseInt(process.env.DATABASE_POOL_IDLE || '30000'),
    acquire: parseInt(process.env.DATABASE_POOL_ACQUIRE || '60000'),
  },
};

export const redisConfig: RedisConfig = {
  host: process.env.REDIS_HOST || 'localhost',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  password: process.env.REDIS_PASSWORD || undefined,
  db: parseInt(process.env.REDIS_DB || '0'),
};

export const jwtConfig: JwtConfig = {
  secret: process.env.JWT_SECRET || 'your-secret-key',
  expiresIn: process.env.JWT_EXPIRES_IN || '7d',
};

export const smsConfig: SmsConfig = {
  accessKeyId: process.env.ALIYUN_SMS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.ALIYUN_SMS_ACCESS_KEY_SECRET || '',
  signName: process.env.ALIYUN_SMS_SIGN_NAME || '知治健康',
  templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE || '',
};

export const wechatConfig: WechatConfig = {
  appId: process.env.WECHAT_APP_ID || '',
  appSecret: process.env.WECHAT_APP_SECRET || '',
};

export const ossConfig: OssConfig = {
  accessKeyId: process.env.OSS_ACCESS_KEY_ID || '',
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET || '',
  bucket: process.env.OSS_BUCKET || '',
  region: process.env.OSS_REGION || 'oss-cn-hangzhou',
};

export const appConfig: AppConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  upload: {
    maxSize: parseInt(process.env.UPLOAD_MAX_SIZE || '10485760'), // 10MB
    allowedTypes: process.env.UPLOAD_ALLOWED_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ],
  },
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15分钟
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },
  swagger: {
    title: process.env.SWAGGER_TITLE || '知治健康API',
    description: process.env.SWAGGER_DESCRIPTION || '知治健康服务平台API文档',
    version: process.env.SWAGGER_VERSION || '1.0.0',
  },
};

// 环境标识
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// 数据库连接字符串生成器
export function getDatabaseConnectionString(): string {
  const { host, port, database, username, password, ssl } = databaseConfig;
  const sslParam = ssl ? '&sslmode=require' : '';
  return `postgresql://${username}:${password}@${host}:${port}/${database}?client_encoding=utf8${sslParam}`;
}

// 验证必要配置
export function validateConfig(): void {
  const requiredEnvVars = [
    'DATABASE_HOST',
    'DATABASE_NAME',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'JWT_SECRET',
  ];

  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }

  // 验证JWT密钥强度
  if (jwtConfig.secret.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long');
  }

  // 生产环境额外验证
  if (isProduction) {
    const prodRequiredVars = [
      'ALIYUN_SMS_ACCESS_KEY_ID',
      'ALIYUN_SMS_ACCESS_KEY_SECRET',
      'WECHAT_APP_ID',
      'WECHAT_APP_SECRET',
    ];

    const prodMissingVars = prodRequiredVars.filter(varName => !process.env[varName]);
    
    if (prodMissingVars.length > 0) {
      throw new Error(`Production environment missing required variables: ${prodMissingVars.join(', ')}`);
    }
  }
}

export default {
  database: databaseConfig,
  redis: redisConfig,
  jwt: jwtConfig,
  sms: smsConfig,
  wechat: wechatConfig,
  oss: ossConfig,
  app: appConfig,
  validateConfig,
  getDatabaseConnectionString,
  isDevelopment,
  isProduction,
  isTest,
};