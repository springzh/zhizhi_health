import { Router } from 'express';
import { healthCheck } from '../middleware/common.middleware';

const router = Router();

// 健康检查
router.get('/', healthCheck);

// 详细健康信息
router.get('/detailed', (req, res) => {
  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: process.env.npm_package_version || '1.0.0',
    node: process.version,
    platform: process.platform,
    arch: process.arch,
    memory: process.memoryUsage(),
    environment: process.env.NODE_ENV,
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || '5432',
      database: process.env.DB_NAME || 'zhizhi_health',
    },
    redis: {
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT || '6379',
    },
  };

  res.json({
    success: true,
    message: 'System is healthy',
    data: healthData,
    timestamp: new Date(),
  });
});

// 数据库连接测试
router.get('/database', async (req, res) => {
  try {
    const { query } = await import('../config/database.config');
    const result = await query('SELECT NOW() as time');
    
    res.json({
      success: true,
      message: 'Database connection is healthy',
      data: {
        time: result.rows[0].time,
        database: process.env.DB_NAME || 'zhizhi_health',
      },
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date(),
    });
  }
});

// Redis连接测试
router.get('/redis', async (req, res) => {
  try {
    const { redisClient } = await import('../config/redis.config');
    await redisClient.ping();
    
    res.json({
      success: true,
      message: 'Redis connection is healthy',
      data: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || '6379',
      },
      timestamp: new Date(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Redis connection failed',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date(),
    });
  }
});

export default router;