import { Router } from 'express';
import { ConsultationController } from '../controllers/consultation.controller';
import { body, query } from 'express-validator';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();

// 验证规则
const createConsultationValidation = [
  body('title').notEmpty().withMessage('咨询标题不能为空'),
  body('content').notEmpty().withMessage('咨询内容不能为空'),
  body('category').isIn(['general', 'dental', 'cell', 'membership', 'appointment']).withMessage('无效的咨询类别'),
  body('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('无效的优先级'),
  body('doctor_id').optional().isInt({ min: 1 }).withMessage('无效的医生ID'),
  body('guest_name').optional().isLength({ min: 2, max: 100 }).withMessage('姓名长度为2-100个字符'),
  body('guest_phone').optional().isMobilePhone('zh-CN').withMessage('请输入有效的手机号码'),
  body('guest_email').optional().isEmail().withMessage('请输入有效的邮箱地址'),
];

const addReplyValidation = [
  body('consultation_id').isInt({ min: 1 }).withMessage('无效的咨询ID'),
  body('content').notEmpty().withMessage('回复内容不能为空'),
  body('is_internal_note').optional().isBoolean().withMessage('内部备注必须是布尔值'),
];

// 公开路由 - 无需登录
router.get('/public', 
  [
    query('category').optional().isIn(['general', 'dental', 'cell', 'membership', 'appointment']).withMessage('无效的咨询类别'),
    query('limit').optional().isInt({ min: 1, max: 50 }).withMessage('限制数量为1-50')
  ],
  ConsultationController.getPublicConsultations
);

// 需要登录的路由
router.use(authMiddleware);

// 创建咨询 - 允许匿名和登录用户
router.post('/', 
  createConsultationValidation,
  ConsultationController.createConsultation
);

// 获取咨询列表
router.get('/', 
  [
    query('page').optional().isInt({ min: 1 }).withMessage('页码必须大于0'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('限制数量为1-100'),
    query('category').optional().isIn(['general', 'dental', 'cell', 'membership', 'appointment']).withMessage('无效的咨询类别'),
    query('status').optional().isIn(['pending', 'replied', 'closed', 'cancelled']).withMessage('无效的状态'),
    query('priority').optional().isIn(['low', 'normal', 'high', 'urgent']).withMessage('无效的优先级'),
    query('doctor_id').optional().isInt({ min: 1 }).withMessage('无效的医生ID'),
    query('sort_by').optional().isIn(['created_at', 'updated_at', 'priority', 'view_count']).withMessage('无效的排序字段'),
    query('order').optional().isIn(['asc', 'desc']).withMessage('无效的排序方式'),
    query('is_public').optional().isBoolean().withMessage('公开标志必须是布尔值')
  ],
  ConsultationController.getConsultations
);

// 获取用户咨询历史
router.get('/my-consultations', 
  [
    query('page').optional().isInt({ min: 1 }).withMessage('页码必须大于0'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('限制数量为1-100')
  ],
  ConsultationController.getUserConsultations
);

// 获取咨询详情
router.get('/:id', 
  ConsultationController.getConsultationById
);

// 添加回复
router.post('/replies', 
  addReplyValidation,
  ConsultationController.addReply
);

// 管理员和医生权限的路由
router.patch('/:id/status', 
  [
    body('status').isIn(['pending', 'replied', 'closed', 'cancelled']).withMessage('无效的状态')
  ],
  ConsultationController.updateConsultationStatus
);

// 管理员权限的路由
router.delete('/:id', 
  ConsultationController.deleteConsultation
);

// 获取统计信息（管理员和医生）
router.get('/stats/summary', 
  ConsultationController.getConsultationStats
);

export default router;