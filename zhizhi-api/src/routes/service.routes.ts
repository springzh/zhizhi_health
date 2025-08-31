import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { paginationValidation, searchValidation } from '../validators';
import { ServiceModel } from '../models/service.model';
import { ResponseUtil } from '../utils/response.util';

const router = Router();

// 获取所有服务分类
router.get(
  '/categories',
  asyncHandler(async (req, res) => {
    const categories = await ServiceModel.findAllCategories();

    ResponseUtil.success(res, categories, 'Service categories retrieved successfully');
  })
);

// 根据类型获取服务分类
router.get(
  '/categories/type/:type',
  asyncHandler(async (req, res) => {
    const { type } = req.params;
    
    if (!['dental', 'cell', 'membership'].includes(type)) {
      return ResponseUtil.badRequest(res, 'Invalid service type');
    }

    const categories = await ServiceModel.findCategoriesByType(type as any);

    ResponseUtil.success(res, categories, `${type} categories retrieved successfully`);
  })
);

// 根据ID获取服务分类
router.get(
  '/categories/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const category = await ServiceModel.findCategoryById(Number(id));

    if (!category) {
      return ResponseUtil.notFound(res, 'Service category not found');
    }

    ResponseUtil.success(res, category, 'Service category retrieved successfully');
  })
);

// 获取分类下的所有服务
router.get(
  '/category/:categoryId/services',
  asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const services = await ServiceModel.findServicesByCategory(Number(categoryId));

    ResponseUtil.success(res, services, 'Services in category retrieved successfully');
  })
);

// 获取所有服务
router.get(
  '/',
  paginationValidation,
  validateRequest,
  asyncHandler(async (req, res) => {
    const params = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      category_id: req.query.category_id ? Number(req.query.category_id) : undefined,
      type: req.query.type as string,
      is_recommended: req.query.is_recommended ? req.query.is_recommended === 'true' : undefined,
    };

    const result = await ServiceModel.findAllServices(params);

    ResponseUtil.paginated(
      res,
      result.services,
      result.total,
      result.page,
      result.limit,
      'Services retrieved successfully'
    );
  })
);

// 根据ID获取服务
router.get(
  '/:id',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = await ServiceModel.findServiceById(Number(id));

    if (!service) {
      return ResponseUtil.notFound(res, 'Service not found');
    }

    ResponseUtil.success(res, service, 'Service retrieved successfully');
  })
);

// 获取服务详情（包含分类信息）
router.get(
  '/:id/details',
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const service = await ServiceModel.getServiceWithCategory(Number(id));

    if (!service) {
      return ResponseUtil.notFound(res, 'Service not found');
    }

    ResponseUtil.success(res, service, 'Service details retrieved successfully');
  })
);

// 搜索服务
router.get(
  '/search/:keyword',
  searchValidation,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { keyword } = req.params;
    const { type } = req.query;
    
    const services = await ServiceModel.searchServices(keyword, type as string);

    ResponseUtil.success(res, services, 'Search results retrieved successfully');
  })
);

// 获取推荐服务
router.get(
  '/recommended/list',
  asyncHandler(async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const services = await ServiceModel.findRecommendedServices(limit);

    ResponseUtil.success(res, services, 'Recommended services retrieved successfully');
  })
);

// 获取热门服务
router.get(
  '/popular/list',
  asyncHandler(async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const services = await ServiceModel.findPopularServices(limit);

    ResponseUtil.success(res, services, 'Popular services retrieved successfully');
  })
);

// 根据类型获取服务
router.get(
  '/type/:serviceType',
  asyncHandler(async (req, res) => {
    const { serviceType } = req.params;
    
    if (!['dental', 'cell', 'membership'].includes(serviceType)) {
      return ResponseUtil.badRequest(res, 'Invalid service type');
    }

    const services = await ServiceModel.findServicesByType(serviceType as any);

    ResponseUtil.success(res, services, `${serviceType} services retrieved successfully`);
  })
);

// 获取口腔服务
router.get(
  '/dental/list',
  asyncHandler(async (req, res) => {
    const services = await ServiceModel.findServicesByType('dental');

    ResponseUtil.success(res, services, 'Dental services retrieved successfully');
  })
);

// 获取细胞服务
router.get(
  '/cell/list',
  asyncHandler(async (req, res) => {
    const services = await ServiceModel.findServicesByType('cell');

    ResponseUtil.success(res, services, 'Cell services retrieved successfully');
  })
);

// 获取会员服务
router.get(
  '/membership/list',
  asyncHandler(async (req, res) => {
    const services = await ServiceModel.findServicesByType('membership');

    ResponseUtil.success(res, services, 'Membership services retrieved successfully');
  })
);

export default router;