#!/usr/bin/env node

import app from './src/index';
import config from './src/config';
import { logger } from './src/utils/logger';

const server = app.listen(config.server.port, config.server.host, () => {
  logger.info(`🚀 Server is running on http://${config.server.host}:${config.server.port}`);
  logger.info(`📊 Environment: ${config.server.env}`);
  logger.info(`📚 API Documentation: http://${config.server.host}:${config.server.port}/api-docs`);
  logger.info(`💚 Health Check: http://${config.server.host}:${config.server.port}/api/health`);
});

// 优雅关闭
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  server.close(() => {
    logger.info('Process terminated');
    process.exit(0);
  });
});

// 未捕获的异常
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// 未处理的Promise拒绝
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});