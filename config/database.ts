// 数据库配置文件
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

export interface AppConfig {
  nodeEnv: string;
  port: number;
  jwt: {
    secret: string;
    expiresIn: string;
  };
  redis?: {
    host: string;
    port: number;
    password?: string;
    db: number;
  };
  sms: {
    accessKeyId: string;
    accessKeySecret: string;
    signName: string;
    templateCode: string;
  };
  wechat: {
    appId: string;
    appSecret: string;
  };
  oss?: {
    accessKeyId: string;
    accessKeySecret: string;
    bucket: string;
    region: string;
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

export const appConfig: AppConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000'),
  jwt: {
    secret: process.env.JWT_SECRET || 'your-secret-key',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  redis: process.env.REDIS_HOST ? {
    host: process.env.REDIS_HOST,
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
    db: parseInt(process.env.REDIS_DB || '0'),
  } : undefined,
  sms: {
    accessKeyId: process.env.ALIYUN_SMS_ACCESS_KEY_ID || '',
    accessKeySecret: process.env.ALIYUN_SMS_ACCESS_KEY_SECRET || '',
    signName: process.env.ALIYUN_SMS_SIGN_NAME || '知治健康',
    templateCode: process.env.ALIYUN_SMS_TEMPLATE_CODE || '',
  },
  wechat: {
    appId: process.env.WECHAT_APP_ID || '',
    appSecret: process.env.WECHAT_APP_SECRET || '',
  },
  oss: process.env.OSS_ACCESS_KEY_ID ? {
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    bucket: process.env.OSS_BUCKET || '',
    region: process.env.OSS_REGION || 'oss-cn-hangzhou',
  } : undefined,
};

// 验证必要配置
export function validateConfig(): void {
  const requiredEnvVars = [
    'DATABASE_HOST',
    'DATABASE_NAME',
    'DATABASE_USER',
    'DATABASE_PASSWORD',
    'JWT_SECRET',
    'ALIYUN_SMS_ACCESS_KEY_ID',
    'ALIYUN_SMS_ACCESS_KEY_SECRET',
    'WECHAT_APP_ID',
    'WECHAT_APP_SECRET',
  ];

  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingEnvVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingEnvVars.join(', ')}`);
  }
}

// 开发环境配置
export const isDevelopment = process.env.NODE_ENV === 'development';
export const isProduction = process.env.NODE_ENV === 'production';
export const isTest = process.env.NODE_ENV === 'test';

// 数据库连接字符串生成器
export function getDatabaseConnectionString(): string {
  const { host, port, database, username, password, ssl } = databaseConfig;
  const sslParam = ssl ? '&sslmode=require' : '';
  return `postgresql://${username}:${password}@${host}:${port}/${database}?client_encoding=utf8${sslParam}`;
}

export default {
  database: databaseConfig,
  app: appConfig,
  validateConfig,
  getDatabaseConnectionString,
  isDevelopment,
  isProduction,
  isTest,
};