import { Response } from 'express';
import { logger } from './logger';

export interface PaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

export interface PaginationResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export const calculatePagination = (
  total: number,
  options: PaginationOptions
) => {
  const { page, limit } = options;
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
};

export const formatPaginationResponse = <T>(
  data: T[],
  total: number,
  options: PaginationOptions
): PaginationResult<T> => {
  return {
    data,
    pagination: calculatePagination(total, options),
  };
};

export const getOffsetLimit = (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return { offset, limit };
};

export const validatePaginationParams = (req: any): PaginationOptions => {
  const page = Math.max(1, parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
  const sortBy = req.query.sortBy || 'created_at';
  const sortOrder = req.query.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

  return { page, limit, sortBy, sortOrder };
};

export const buildOrderByClause = (sortBy: string, sortOrder: 'ASC' | 'DESC') => {
  // 防止SQL注入，只允许特定字段
  const allowedSortFields = [
    'created_at', 'updated_at', 'id', 'name', 'rating', 
    'consultation_count', 'price', 'appointment_date'
  ];
  
  const field = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
  const order = sortOrder === 'ASC' ? 'ASC' : 'DESC';
  
  return `${field} ${order}`;
};