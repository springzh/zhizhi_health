import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

export class ResponseUtil {
  // 成功响应
  static success<T = any>(
    res: Response,
    data?: T,
    message: string = 'Success',
    statusCode: number = 200
  ): Response {
    const response: ApiResponse<T> = {
      success: true,
      message,
      data,
      timestamp: new Date(),
    };

    return res.status(statusCode).json(response);
  }

  // 分页响应
  static paginated<T = any>(
    res: Response,
    items: T[],
    total: number,
    page: number,
    limit: number,
    message: string = 'Success'
  ): Response {
    const response: ApiResponse<PaginatedResponse<T>> = {
      success: true,
      message,
      data: {
        items,
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
      },
      timestamp: new Date(),
    };

    return res.status(200).json(response);
  }

  // 创建成功响应
  static created<T = any>(
    res: Response,
    data: T,
    message: string = 'Resource created successfully'
  ): Response {
    return this.success(res, data, message, 201);
  }

  // 更新成功响应
  static updated<T = any>(
    res: Response,
    data: T,
    message: string = 'Resource updated successfully'
  ): Response {
    return this.success(res, data, message, 200);
  }

  // 删除成功响应
  static deleted(
    res: Response,
    message: string = 'Resource deleted successfully'
  ): Response {
    return this.success(res, null, message, 200);
  }

  // 错误响应
  static error(
    res: Response,
    message: string = 'Internal Server Error',
    statusCode: number = 500,
    error?: string
  ): Response {
    const response: ApiResponse = {
      success: false,
      message,
      error,
      timestamp: new Date(),
    };

    return res.status(statusCode).json(response);
  }

  // 客户端错误响应
  static badRequest(
    res: Response,
    message: string = 'Bad Request',
    error?: string
  ): Response {
    return this.error(res, message, 400, error);
  }

  // 未授权响应
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized',
    error?: string
  ): Response {
    return this.error(res, message, 401, error);
  }

  // 禁止访问响应
  static forbidden(
    res: Response,
    message: string = 'Forbidden',
    error?: string
  ): Response {
    return this.error(res, message, 403, error);
  }

  // 资源不存在响应
  static notFound(
    res: Response,
    message: string = 'Resource not found',
    error?: string
  ): Response {
    return this.error(res, message, 404, error);
  }

  // 验证错误响应
  static validationError(
    res: Response,
    errors: Record<string, string[]> | string,
    message: string = 'Validation failed'
  ): Response {
    const errorDetails = typeof errors === 'string' ? errors : JSON.stringify(errors);
    return this.badRequest(res, message, errorDetails);
  }

  // 冲突错误响应
  static conflict(
    res: Response,
    message: string = 'Resource conflict',
    error?: string
  ): Response {
    return this.error(res, message, 409, error);
  }

  // 请求过大响应
  static payloadTooLarge(
    res: Response,
    message: string = 'Request payload too large',
    error?: string
  ): Response {
    return this.error(res, message, 413, error);
  }

  // 服务器错误响应
  static internalServerError(
    res: Response,
    message: string = 'Internal Server Error',
    error?: string
  ): Response {
    return this.error(res, message, 500, error);
  }

  // 服务不可用响应
  static serviceUnavailable(
    res: Response,
    message: string = 'Service Unavailable',
    error?: string
  ): Response {
    return this.error(res, message, 503, error);
  }

  // 自定义状态码响应
  static custom<T = any>(
    res: Response,
    statusCode: number,
    success: boolean,
    message: string,
    data?: T,
    error?: string
  ): Response {
    const response: ApiResponse<T> = {
      success,
      message,
      data,
      error,
      timestamp: new Date(),
    };

    return res.status(statusCode).json(response);
  }

  // 文件上传响应
  static fileUpload(
    res: Response,
    fileInfo: {
      filename: string;
      size: number;
      mimetype: string;
      url: string;
    },
    message: string = 'File uploaded successfully'
  ): Response {
    return this.success(res, fileInfo, message, 201);
  }

  // 批量操作响应
  static batchOperation(
    res: Response,
    results: {
      success: number;
      failed: number;
      errors?: string[];
    },
    message: string = 'Batch operation completed'
  ): Response {
    return this.success(res, results, message, 200);
  }

  // 健康检查响应
  static healthCheck(
    res: Response,
    healthData: {
      status: 'healthy' | 'unhealthy';
      timestamp: string;
      uptime: number;
      version: string;
      database: 'connected' | 'disconnected';
      redis: 'connected' | 'disconnected';
      memory: {
        used: number;
        total: number;
        percentage: number;
      };
    }
  ): Response {
    const statusCode = healthData.status === 'healthy' ? 200 : 503;
    return this.custom(
      res,
      statusCode,
      true,
      healthData.status === 'healthy' ? 'System is healthy' : 'System is unhealthy',
      healthData
    );
  }
}

export default ResponseUtil;