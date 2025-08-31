import { Pool, PoolClient } from 'pg';
import { databaseConfig, getDatabaseConnectionString } from './app.config';
import { logger } from '../utils/logger';

let pool: Pool;

export async function connectDatabase(): Promise<Pool> {
  try {
    if (pool) {
      return pool;
    }

    // 创建连接池
    pool = new Pool({
      connectionString: getDatabaseConnectionString(),
      max: databaseConfig.pool.max,
      min: databaseConfig.pool.min,
      idleTimeoutMillis: databaseConfig.pool.idle,
      connectionTimeoutMillis: 5000,
    });

    // 测试连接
    const client = await pool.connect();
    await client.query('SELECT NOW()');
    client.release();

    logger.info('Database connection pool created successfully');
    
    // 监听连接池事件
    pool.on('error', (err) => {
      logger.error('Unexpected error on idle client', err);
    });

    return pool;
  } catch (error) {
    logger.error('Failed to connect to database:', error);
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  try {
    if (pool) {
      await pool.end();
      pool = undefined as any;
      logger.info('Database connection pool closed');
    }
  } catch (error) {
    logger.error('Error closing database connection:', error);
    throw error;
  }
}

export async function query(text: string, params?: any[]): Promise<any> {
  const start = Date.now();
  
  try {
    const result = await pool.query(text, params);
    const duration = Date.now() - start;
    
    if (databaseConfig.logging) {
      logger.debug(`Query executed in ${duration}ms: ${text}`, params);
    }
    
    return result;
  } catch (error) {
    const duration = Date.now() - start;
    logger.error(`Query failed after ${duration}ms: ${text}`, params, error);
    throw error;
  }
}

export async function transaction<T>(callback: (client: PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');
    
    const result = await callback(client);
    
    await client.query('COMMIT');
    
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    logger.error('Transaction failed, rolled back:', error);
    throw error;
  } finally {
    client.release();
  }
}

// 获取连接池统计信息
export function getPoolStats() {
  if (!pool) {
    return null;
  }

  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  };
}

// 健康检查
export async function healthCheck(): Promise<boolean> {
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (error) {
    logger.error('Database health check failed:', error);
    return false;
  }
}

export default {
  connectDatabase,
  disconnectDatabase,
  query,
  transaction,
  getPoolStats,
  healthCheck,
};