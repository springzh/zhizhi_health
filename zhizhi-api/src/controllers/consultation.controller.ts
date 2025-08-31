import { Request, Response } from 'express';
import { ConsultationModel } from '../models/consultation.model';
import { CreateConsultationRequest, CreateConsultationReplyRequest, ConsultationQueryParams } from '../types/consultation.types';
import { validationResult } from 'express-validator';
import { ResponseUtil } from '../utils/response.util';

export class ConsultationController {
  // 创建咨询
  static async createConsultation(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseUtil.error(res, '参数验证失败', 400, JSON.stringify(errors.array()));
      }

      const consultationData: CreateConsultationRequest = req.body;
      
      // 如果是用户登录状态，使用用户ID
      if (req.user && req.user.id) {
        consultationData.user_id = req.user.id;
      }

      const consultation = await ConsultationModel.create(consultationData);
      
      return ResponseUtil.created(res, consultation, '咨询创建成功');
    } catch (error) {
      console.error('创建咨询失败:', error);
      return ResponseUtil.error(res, '创建咨询失败', 500);
    }
  }

  // 获取咨询列表
  static async getConsultations(req: Request, res: Response) {
    try {
      const params: ConsultationQueryParams = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        category: req.query.category as string,
        status: req.query.status as string,
        priority: req.query.priority as string,
        doctor_id: req.query.doctor_id ? parseInt(req.query.doctor_id as string) : undefined,
        is_public: req.query.is_public === 'true',
        search: req.query.search as string,
        sort_by: req.query.sort_by as 'created_at' | 'updated_at' | 'priority' | 'view_count',
        order: req.query.order as 'asc' | 'desc'
      };

      // 如果是普通用户，只能查看自己的咨询
      if (req.user && req.user.role && req.user.role === 'user') {
        params.user_id = req.user.id;
      }

      const result = await ConsultationModel.findAll(params);
      
      return ResponseUtil.success(res, result, '获取咨询列表成功');
    } catch (error) {
      console.error('获取咨询列表失败:', error);
      return ResponseUtil.error(res, '获取咨询列表失败', 500);
    }
  }

  // 获取咨询详情
  static async getConsultationById(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const consultationId = parseInt(id);

      if (isNaN(consultationId)) {
        return ResponseUtil.error(res, '无效的咨询ID', 400);
      }

      const consultation = await ConsultationModel.findById(consultationId);
      
      if (!consultation) {
        return ResponseUtil.error(res, '咨询不存在', 404);
      }

      // 权限检查：普通用户只能查看自己的咨询或公开咨询
      if (req.user && req.user.role && req.user.role === 'user') {
        if (consultation.user_id !== req.user.id && !consultation.is_public) {
          return ResponseUtil.error(res, '无权限查看此咨询', 403);
        }
      }

      // 获取回复列表
      const replies = await ConsultationModel.getReplies(consultationId);
      
      // 获取附件列表
      const attachments = await ConsultationModel.getAttachments(consultationId);

      const response = {
        ...consultation,
        replies,
        attachments
      };

      return ResponseUtil.success(res, response, '获取咨询详情成功');
    } catch (error) {
      console.error('获取咨询详情失败:', error);
      return ResponseUtil.error(res, '获取咨询详情失败', 500);
    }
  }

  // 更新咨询状态
  static async updateConsultationStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      const consultationId = parseInt(id);
      
      if (isNaN(consultationId)) {
        return ResponseUtil.error(res, '无效的咨询ID', 400);
      }

      if (!['pending', 'replied', 'closed', 'cancelled'].includes(status)) {
        return ResponseUtil.error(res, '无效的状态值', 400);
      }

      const consultation = await ConsultationModel.updateStatus(consultationId, status);
      
      if (!consultation) {
        return ResponseUtil.error(res, '咨询不存在', 404);
      }

      return ResponseUtil.success(res, consultation, '状态更新成功');
    } catch (error) {
      console.error('更新咨询状态失败:', error);
      return ResponseUtil.error(res, '更新咨询状态失败', 500);
    }
  }

  // 添加回复
  static async addReply(req: Request, res: Response) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return ResponseUtil.error(res, '参数验证失败', 400, JSON.stringify(errors.array()));
      }

      const replyData: CreateConsultationReplyRequest = req.body;
      
      // 设置回复用户ID和类型
      if (req.user && req.user.id) {
        replyData.user_id = req.user.id;
        replyData.reply_type = req.user.role && req.user.role === 'doctor' ? 'doctor' : 
                              req.user.role === 'admin' ? 'admin' : 'user';
      }

      const reply = await ConsultationModel.addReply(replyData);
      
      return ResponseUtil.created(res, reply, '回复添加成功');
    } catch (error) {
      console.error('添加回复失败:', error);
      return ResponseUtil.error(res, '添加回复失败', 500);
    }
  }

  // 获取公开咨询展示
  static async getPublicConsultations(req: Request, res: Response) {
    try {
      const category = req.query.category as string;
      const limit = parseInt(req.query.limit as string) || 10;

      const consultations = await ConsultationModel.getPublicConsultations(category, limit);
      
      return ResponseUtil.success(res, consultations, '获取公开咨询成功');
    } catch (error) {
      console.error('获取公开咨询失败:', error);
      return ResponseUtil.error(res, '获取公开咨询失败', 500);
    }
  }

  // 获取用户咨询历史
  static async getUserConsultations(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.id) {
        return ResponseUtil.error(res, '用户未登录', 401);
      }

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await ConsultationModel.getUserConsultations(req.user.id, page, limit);
      
      return ResponseUtil.success(res, result, '获取用户咨询历史成功');
    } catch (error) {
      console.error('获取用户咨询历史失败:', error);
      return ResponseUtil.error(res, '获取用户咨询历史失败', 500);
    }
  }

  // 获取咨询统计信息
  static async getConsultationStats(req: Request, res: Response) {
    try {
      // 只有管理员和医生可以查看统计信息
      if (!req.user || !req.user.role || !['admin', 'doctor'].includes(req.user.role)) {
        return ResponseUtil.error(res, '无权限查看统计信息', 403);
      }

      const stats = await ConsultationModel.getCategoryStats();
      
      return ResponseUtil.success(res, stats, '获取统计信息成功');
    } catch (error) {
      console.error('获取统计信息失败:', error);
      return ResponseUtil.error(res, '获取统计信息失败', 500);
    }
  }

  // 删除咨询（仅管理员）
  static async deleteConsultation(req: Request, res: Response) {
    try {
      if (!req.user || !req.user.role || req.user.role !== 'admin') {
        return ResponseUtil.error(res, '无权限删除咨询', 403);
      }

      const { id } = req.params;
      const consultationId = parseInt(id);
      
      if (isNaN(consultationId)) {
        return ResponseUtil.error(res, '无效的咨询ID', 400);
      }

      const success = await ConsultationModel.delete(consultationId);
      
      if (!success) {
        return ResponseUtil.error(res, '咨询不存在', 404);
      }

      return ResponseUtil.deleted(res, '咨询删除成功');
    } catch (error) {
      console.error('删除咨询失败:', error);
      return ResponseUtil.error(res, '删除咨询失败', 500);
    }
  }
}