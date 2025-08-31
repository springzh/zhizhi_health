import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { userValidation } from '../validators';
import { UserModel } from '../models/user.model';
import { ResponseUtil } from '../utils/response.util';

const router = Router();

// 获取所有用户
router.get(
  '/',
  userValidation.query,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, search } = req.query;
    
    const result = await UserModel.findAll({
      page: Number(page),
      limit: Number(limit),
      search: search as string,
    });

    ResponseUtil.paginated(
      res,
      result.users,
      result.total,
      Number(page),
      Number(limit),
      'Users retrieved successfully'
    );
  })
);

// 根据ID获取用户
router.get(
  '/:id',
  userValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const user = await UserModel.findById(Number(id));

    if (!user) {
      return ResponseUtil.notFound(res, 'User not found');
    }

    ResponseUtil.success(res, user, 'User retrieved successfully');
  })
);

// 创建用户
router.post(
  '/',
  userValidation.create,
  validateRequest,
  asyncHandler(async (req, res) => {
    const userData = req.validatedData;
    const user = await UserModel.create(userData);

    ResponseUtil.created(res, user, 'User created successfully');
  })
);

// 更新用户
router.put(
  '/:id',
  userValidation.update,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.validatedData;
    
    const user = await UserModel.update(Number(id), updateData);

    if (!user) {
      return ResponseUtil.notFound(res, 'User not found');
    }

    ResponseUtil.success(res, user, 'User updated successfully');
  })
);

// 删除用户
router.delete(
  '/:id',
  userValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await UserModel.delete(Number(id));

    if (!deleted) {
      return ResponseUtil.notFound(res, 'User not found');
    }

    ResponseUtil.deleted(res, 'User deleted successfully');
  })
);

// 根据手机号查找用户
router.get(
  '/phone/:phone',
  asyncHandler(async (req, res) => {
    const { phone } = req.params;
    const user = await UserModel.findByPhone(phone);

    if (!user) {
      return ResponseUtil.notFound(res, 'User not found');
    }

    ResponseUtil.success(res, user, 'User retrieved successfully');
  })
);

export default router;