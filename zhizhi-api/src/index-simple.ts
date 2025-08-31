import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 导入配置
import { connectDatabase } from './config/database.config';
import { connectRedis } from './config/redis.config';
import { logger, stream } from './utils/logger';
import { errorHandler } from './middleware/error.middleware';
import { generalRateLimit } from './middleware/rate-limit.middleware';

// 导入路由
import apiRoutes from './routes/index';

// 加载环境变量
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件设置
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(compression());
app.use(morgan('combined', { stream: stream as any }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(generalRateLimit);

// 请求ID
app.use((req: any, _res, next) => {
  req.id = Math.random().toString(36).substr(2, 9);
  next();
});

// 路由设置
app.use('/api', apiRoutes);

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found',
    path: req.originalUrl,
  });
});

// 错误处理
app.use(errorHandler);

// 启动函数
async function startServer() {
  try {
    // 连接数据库
    await connectDatabase();
    logger.info('Database connected successfully');
    
    // 连接Redis（可选）
    try {
      await connectRedis();
      logger.info('Redis connected successfully');
    } catch (redisError) {
      logger.warn('Redis connection failed, continuing without cache');
    }
    
    // 启动服务器
    app.listen(PORT, () => {
      logger.info(`🚀 Server is running on port ${PORT}`);
      logger.info(`🔍 Health Check: http://localhost:${PORT}/api/health`);
      logger.info(`📖 API Documentation: http://localhost:${PORT}/api`);
    });
    
  } catch (error) {
    logger.error('Failed to start application:', error);
    process.exit(1);
  }
}

// 未捕获的异常处理
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// 启动服务器
startServer();

export default app;