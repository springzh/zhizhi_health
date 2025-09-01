import { Router } from 'express';
import { FAQController } from '../controllers/faq.controller';
import { body, param, query } from 'express-validator';
import { ValidationMiddleware } from '../middleware/validation.middleware';

const router = Router();
const faqController = new FAQController();

// FAQ Categories Routes
router.post('/categories', 
  [
    body('name').notEmpty().withMessage('分类名称不能为空'),
    body('name').isLength({ max: 100 }).withMessage('分类名称不能超过100个字符'),
    body('description').optional().isLength({ max: 500 }).withMessage('描述不能超过500个字符'),
    body('sort_order').optional().isInt({ min: 0 }).withMessage('排序必须是非负整数')
  ],
  ValidationMiddleware.validate,
  faqController.createCategory.bind(faqController)
);

router.put('/categories/:id', 
  [
    param('id').isInt().withMessage('ID必须是整数'),
    body('name').optional().notEmpty().withMessage('分类名称不能为空'),
    body('name').optional().isLength({ max: 100 }).withMessage('分类名称不能超过100个字符'),
    body('description').optional().isLength({ max: 500 }).withMessage('描述不能超过500个字符'),
    body('sort_order').optional().isInt({ min: 0 }).withMessage('排序必须是非负整数')
  ],
  ValidationMiddleware.validate,
  faqController.updateCategory.bind(faqController)
);

router.delete('/categories/:id', 
  [param('id').isInt().withMessage('ID必须是整数')],
  ValidationMiddleware.validate,
  faqController.deleteCategory.bind(faqController)
);

router.get('/categories', 
  faqController.getCategories.bind(faqController)
);

router.get('/categories/:id', 
  [param('id').isInt().withMessage('ID必须是整数')],
  ValidationMiddleware.validate,
  faqController.getCategoryById.bind(faqController)
);

// FAQs Routes
router.post('/', 
  [
    body('question').notEmpty().withMessage('问题不能为空'),
    body('question').isLength({ max: 500 }).withMessage('问题不能超过500个字符'),
    body('answer').notEmpty().withMessage('答案不能为空'),
    body('category_id').optional().isInt().withMessage('分类ID必须是整数'),
    body('is_popular').optional().isBoolean().withMessage('是否热门必须是布尔值'),
    body('sort_order').optional().isInt({ min: 0 }).withMessage('排序必须是非负整数')
  ],
  ValidationMiddleware.validate,
  faqController.createFAQ.bind(faqController)
);

router.put('/:id', 
  [
    param('id').isInt().withMessage('ID必须是整数'),
    body('question').optional().notEmpty().withMessage('问题不能为空'),
    body('question').optional().isLength({ max: 500 }).withMessage('问题不能超过500个字符'),
    body('answer').optional().notEmpty().withMessage('答案不能为空'),
    body('category_id').optional().isInt().withMessage('分类ID必须是整数'),
    body('is_popular').optional().isBoolean().withMessage('是否热门必须是布尔值'),
    body('sort_order').optional().isInt({ min: 0 }).withMessage('排序必须是非负整数')
  ],
  ValidationMiddleware.validate,
  faqController.updateFAQ.bind(faqController)
);

router.delete('/:id', 
  [param('id').isInt().withMessage('ID必须是整数')],
  ValidationMiddleware.validate,
  faqController.deleteFAQ.bind(faqController)
);

router.get('/', 
  [
    query('category_id').optional().isInt().withMessage('分类ID必须是整数'),
    query('is_popular').optional().isBoolean().withMessage('是否热门必须是布尔值'),
    query('search').optional().isLength({ max: 100 }).withMessage('搜索关键词不能超过100个字符'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('限制数量必须在1-100之间'),
    query('offset').optional().isInt({ min: 0 }).withMessage('偏移量必须是非负整数')
  ],
  ValidationMiddleware.validate,
  faqController.getFAQs.bind(faqController)
);

router.get('/popular', 
  [
    query('limit').optional().isInt({ min: 1, max: 20 }).withMessage('限制数量必须在1-20之间')
  ],
  ValidationMiddleware.validate,
  faqController.getPopularFAQs.bind(faqController)
);

router.get('/:id', 
  [param('id').isInt().withMessage('ID必须是整数')],
  ValidationMiddleware.validate,
  faqController.getFAQById.bind(faqController)
);

export default router;