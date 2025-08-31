import Redis from 'ioredis';
import { redisConfig, logger } from '../utils/logger';

let redisClient: Redis | null = null;

export async function connectRedis(): Promise<Redis> {
  try {
    if (redisClient) {
      return redisClient;
    }

    redisClient = new Redis({
      host: redisConfig.host,
      port: redisConfig.port,
      password: redisConfig.password,
      db: redisConfig.db,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      lazyConnect: true,
      connectTimeout: 5000,
      commandTimeout: 5000,
    });

    // 监听连接事件
    redisClient.on('connect', () => {
      logger.info('Redis client connected');
    });

    redisClient.on('error', (err) => {
      logger.error('Redis client error:', err);
    });

    redisClient.on('reconnecting', () => {
      logger.warn('Redis client reconnecting...');
    });

    // 测试连接
    await redisClient.ping();
    
    logger.info('Redis connection established successfully');
    return redisClient;
  } catch (error) {
    logger.error('Failed to connect to Redis:', error);
    redisClient = null;
    throw error;
  }
}

export async function disconnectRedis(): Promise<void> {
  try {
    if (redisClient) {
      await redisClient.quit();
      redisClient = null;
      logger.info('Redis client disconnected');
    }
  } catch (error) {
    logger.error('Error disconnecting Redis:', error);
    throw error;
  }
}

export function getRedisClient(): Redis | null {
  return redisClient;
}

// Redis健康检查
export async function redisHealthCheck(): Promise<boolean> {
  try {
    if (!redisClient) {
      return false;
    }
    
    await redisClient.ping();
    return true;
  } catch (error) {
    logger.error('Redis health check failed:', error);
    return false;
  }
}

// 缓存工具函数
export class CacheManager {
  private static instance: CacheManager;
  private client: Redis | null;

  private constructor() {
    this.client = getRedisClient();
  }

  public static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager();
    }
    return CacheManager.instance;
  }

  public async set(key: string, value: any, expireInSeconds?: number): Promise<void> {
    try {
      if (!this.client) {
        return;
      }
      
      const serializedValue = JSON.stringify(value);
      
      if (expireInSeconds) {
        await this.client.setex(key, expireInSeconds, serializedValue);
      } else {
        await this.client.set(key, serializedValue);
      }
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  }

  public async get<T>(key: string): Promise<T | null> {
    try {
      if (!this.client) {
        return null;
      }
      
      const value = await this.client.get(key);
      if (!value) {
        return null;
      }
      
      return JSON.parse(value) as T;
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  }

  public async del(key: string): Promise<void> {
    try {
      if (!this.client) {
        return;
      }
      
      await this.client.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  }

  public async exists(key: string): Promise<boolean> {
    try {
      if (!this.client) {
        return false;
      }
      
      const result = await this.client.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  }

  public async ttl(key: string): Promise<number> {
    try {
      if (!this.client) {
        return -1;
      }
      
      return await this.client.ttl(key);
    } catch (error) {
      logger.error('Cache TTL error:', error);
      return -1;
    }
  }

  public async clearPattern(pattern: string): Promise<number> {
    try {
      if (!this.client) {
        return 0;
      }
      
      const keys = await this.client.keys(pattern);
      if (keys.length === 0) {
        return 0;
      }
      
      return await this.client.del(...keys);
    } catch (error) {
      logger.error('Cache clear pattern error:', error);
      return 0;
    }
  }
}

// 导出缓存管理器实例
export const cacheManager = CacheManager.getInstance();

export default {
  connectRedis,
  disconnectRedis,
  getRedisClient,
  redisHealthCheck,
  cacheManager,
};