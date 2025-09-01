import { Request, Response } from 'express';
import { FAQModel } from '../models/faq.model';
import { FAQCreateRequest, FAQUpdateRequest, FAQCategoryCreateRequest, FAQCategoryUpdateRequest, FAQQueryParams } from '../types/faq.types';
import { validationResult } from 'express-validator';
import { ResponseUtil } from '../utils/response.util';

export class FAQController {
  private faqModel = new FAQModel();

  // FAQ Categories
  async createCategory(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        ResponseUtil.validationError(res, errors.array());
        return;
      }

      const categoryData: FAQCategoryCreateRequest = req.body;
      const category = await this.faqModel.createCategory(categoryData);
      
      ResponseUtil.success(res, category, 'FAQ分类创建成功', 201);
    } catch (error) {
      ResponseUtil.error(res, '创建FAQ分类失败', 500, error);
    }
  }

  async updateCategory(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        ResponseUtil.validationError(res, errors.array());
        return;
      }

      const { id } = req.params;
      const categoryData: FAQCategoryUpdateRequest = { id: parseInt(id), ...req.body };
      const category = await this.faqModel.updateCategory(parseInt(id), categoryData);
      
      if (!category) {
        ResponseUtil.notFound(res, 'FAQ分类未找到');
        return;
      }

      ResponseUtil.success(res, category, 'FAQ分类更新成功');
    } catch (error) {
      ResponseUtil.error(res, '更新FAQ分类失败', 500, error);
    }
  }

  async deleteCategory(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.faqModel.deleteCategory(parseInt(id));
      
      if (!success) {
        ResponseUtil.notFound(res, 'FAQ分类未找到');
        return;
      }

      ResponseUtil.success(res, null, 'FAQ分类删除成功');
    } catch (error) {
      ResponseUtil.error(res, '删除FAQ分类失败', 500, error);
    }
  }

  async getCategories(req: Request, res: Response): Promise<void> {
    try {
      const categories = await this.faqModel.getCategories();
      ResponseUtil.success(res, categories, '获取FAQ分类列表成功');
    } catch (error) {
      ResponseUtil.error(res, '获取FAQ分类列表失败', 500, error);
    }
  }

  async getCategoryById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const category = await this.faqModel.getCategoryById(parseInt(id));
      
      if (!category) {
        ResponseUtil.notFound(res, 'FAQ分类未找到');
        return;
      }

      ResponseUtil.success(res, category, '获取FAQ分类详情成功');
    } catch (error) {
      ResponseUtil.error(res, '获取FAQ分类详情失败', 500, error);
    }
  }

  // FAQs
  async createFAQ(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        ResponseUtil.validationError(res, errors.array());
        return;
      }

      const faqData: FAQCreateRequest = req.body;
      const faq = await this.faqModel.createFAQ(faqData);
      
      ResponseUtil.success(res, faq, 'FAQ创建成功', 201);
    } catch (error) {
      ResponseUtil.error(res, '创建FAQ失败', 500, error);
    }
  }

  async updateFAQ(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        ResponseUtil.validationError(res, errors.array());
        return;
      }

      const { id } = req.params;
      const faqData: FAQUpdateRequest = { id: parseInt(id), ...req.body };
      const faq = await this.faqModel.updateFAQ(parseInt(id), faqData);
      
      if (!faq) {
        ResponseUtil.notFound(res, 'FAQ未找到');
        return;
      }

      ResponseUtil.success(res, faq, 'FAQ更新成功');
    } catch (error) {
      ResponseUtil.error(res, '更新FAQ失败', 500, error);
    }
  }

  async deleteFAQ(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await this.faqModel.deleteFAQ(parseInt(id));
      
      if (!success) {
        ResponseUtil.notFound(res, 'FAQ未找到');
        return;
      }

      ResponseUtil.success(res, null, 'FAQ删除成功');
    } catch (error) {
      ResponseUtil.error(res, '删除FAQ失败', 500, error);
    }
  }

  async getFAQs(req: Request, res: Response): Promise<void> {
    try {
      const params: FAQQueryParams = {
        category_id: req.query.category_id ? parseInt(req.query.category_id as string) : undefined,
        is_popular: req.query.is_popular === 'true',
        search: req.query.search as string,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        offset: req.query.offset ? parseInt(req.query.offset as string) : undefined
      };

      const result = await this.faqModel.getFAQs(params);
      ResponseUtil.success(res, result, '获取FAQ列表成功');
    } catch (error) {
      ResponseUtil.error(res, '获取FAQ列表失败', 500, error);
    }
  }

  async getPopularFAQs(req: Request, res: Response): Promise<void> {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const faqs = await this.faqModel.getPopularFAQs(limit);
      ResponseUtil.success(res, faqs, '获取热门FAQ成功');
    } catch (error) {
      ResponseUtil.error(res, '获取热门FAQ失败', 500, error);
    }
  }

  async getFAQById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const faq = await this.faqModel.getFAQById(parseInt(id));
      
      if (!faq) {
        ResponseUtil.notFound(res, 'FAQ未找到');
        return;
      }

      // 增加浏览次数
      await this.faqModel.incrementViewCount(parseInt(id));

      ResponseUtil.success(res, faq, '获取FAQ详情成功');
    } catch (error) {
      ResponseUtil.error(res, '获取FAQ详情失败', 500, error);
    }
  }
}