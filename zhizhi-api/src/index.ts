import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';

// 导入配置
import { appConfig, validateConfig } from './config/app.config';
import { connectDatabase } from './config/database.config';
import { connectRedis } from './config/redis.config';
import { setupSwagger } from './config/swagger.config';
import { logger } from './utils/logger';
import { errorHandler } from './middleware/error.middleware';
import { rateLimiter } from './middleware/rate-limiter.middleware';

// 导入路由
import healthRoutes from './routes/health.routes';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import doctorRoutes from './routes/doctor.routes';
import serviceRoutes from './routes/service.routes';
import appointmentRoutes from './routes/appointment.routes';
import membershipRoutes from './routes/membership.routes';

// 加载环境变量
dotenv.config();

class Application {
  private app: express.Application;
  private port: number;

  constructor() {
    this.app = express();
    this.port = appConfig.port;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    // 安全中间件
    this.app.use(helmet());
    
    // CORS配置
    this.app.use(cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:3000',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    }));

    // 压缩响应
    this.app.use(compression());
    
    // 日志记录
    this.app.use(morgan('combined', { stream }));
    
    // 请求解析
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    
    // 限流中间件
    this.app.use(rateLimiter);
    
    // 请求ID
    this.app.use((req, res, next) => {
      req.id = require('uuid').v4();
      next();
    });
  }

  private setupRoutes(): void {
    // 健康检查路由
    this.app.use('/api/health', healthRoutes);
    
    // API路由
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/users', userRoutes);
    this.app.use('/api/doctors', doctorRoutes);
    this.app.use('/api/services', serviceRoutes);
    this.app.use('/api/appointments', appointmentRoutes);
    this.app.use('/api/membership', membershipRoutes);
    
    // 404处理
    this.app.use('*', (req, res) => {
      res.status(404).json({
        success: false,
        message: 'API endpoint not found',
        path: req.originalUrl,
      });
    });
  }

  private setupErrorHandling(): void {
    this.app.use(errorHandler);
    
    // 未捕获的异常处理
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }

  private async setupDatabase(): Promise<void> {
    try {
      await connectDatabase();
      logger.info('Database connected successfully');
    } catch (error) {
      logger.error('Database connection failed:', error);
      process.exit(1);
    }
  }

  private async setupRedis(): Promise<void> {
    try {
      await connectRedis();
      logger.info('Redis connected successfully');
    } catch (error) {
      logger.warn('Redis connection failed, continuing without cache:', error.message);
    }
  }

  private setupSwagger(): void {
    setupSwagger(this.app);
    logger.info('Swagger documentation setup completed');
  }

  public async start(): Promise<void> {
    try {
      // 验证配置
      validateConfig();
      
      // 连接数据库
      await this.setupDatabase();
      
      // 连接Redis
      await this.setupRedis();
      
      // 设置Swagger文档
      this.setupSwagger();
      
      // 启动服务器
      this.app.listen(this.port, () => {
        logger.info(`🚀 Server is running on port ${this.port}`);
        logger.info(`📖 API Documentation: http://localhost:${this.port}/api-docs`);
        logger.info(`🔍 Health Check: http://localhost:${this.port}/api/health`);
      });
      
    } catch (error) {
      logger.error('Failed to start application:', error);
      process.exit(1);
    }
  }
}

// 启动应用
const app = new Application();
app.start();

export default app;