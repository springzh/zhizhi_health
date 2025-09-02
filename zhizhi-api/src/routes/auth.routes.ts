import { Router } from 'express';
import { body } from 'express-validator';
import { validateRequest } from '../middleware/validation.middleware';
import { ResponseUtil } from '../utils/response.util';
import { UserModel } from '../models/user.model';
import { authenticate, generateToken } from '../middleware/auth.middleware';
import { logger } from '../utils/logger';

const router = Router();

// 用户注册
router.post('/register', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('password').isLength({ min: 6 }).withMessage('密码长度至少6个字符'),
  body('phone').optional().isMobilePhone('zh-CN').withMessage('请输入有效的手机号码'),
  body('nickname').optional().isLength({ min: 2, max: 20 }).withMessage('昵称长度必须在2-20个字符之间'),
], validateRequest, async (req, res) => {
  try {
    const { email, password, phone, nickname, province, city, district, address } = req.body;
    
    const user = await UserModel.register({
      email,
      password,
      phone,
      nickname,
      province,
      city,
      district,
      address
    });

    // 记录注册成功日志
    await UserModel.logLogin(user.id, 'email', 'success', req.ip, req.get('User-Agent'));

    // 生成JWT令牌
    const token = generateToken({ id: user.id, email: user.email });

    ResponseUtil.created(res, {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        phone: user.phone,
        province: user.province,
        city: user.city,
        district: user.district,
        address: user.address
      },
      token
    }, '注册成功');
  } catch (error) {
    logger.error('Registration error:', error);
    
    if (error instanceof Error && error.message === '邮箱已存在') {
      return ResponseUtil.badRequest(res, '邮箱已存在');
    }
    
    ResponseUtil.badRequest(res, '注册失败');
  }
});

// 用户登录
router.post('/login', [
  body('email').isEmail().withMessage('请输入有效的邮箱地址'),
  body('password').notEmpty().withMessage('密码不能为空'),
], validateRequest, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await UserModel.login({ email, password });
    
    if (!user) {
      // 记录登录失败日志（如果有用户的话）
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        await UserModel.logLogin(existingUser.id, 'email', 'failed', req.ip, req.get('User-Agent'));
      }
      
      return ResponseUtil.unauthorized(res, '邮箱或密码错误');
    }

    // 记录登录成功日志
    await UserModel.logLogin(user.id, 'email', 'success', req.ip, req.get('User-Agent'));

    // 生成JWT令牌
    const token = generateToken({ id: user.id, email: user.email });

    ResponseUtil.success(res, {
      user: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        phone: user.phone,
        province: user.province,
        city: user.city,
        district: user.district,
        address: user.address
      },
      token
    }, '登录成功');
  } catch (error) {
    logger.error('Login error:', error);
    ResponseUtil.badRequest(res, '登录失败');
  }
});

// 获取当前用户信息
router.get('/me', authenticate, async (req, res) => {
  try {
    const user = await UserModel.findById(req.user!.id);
    if (!user) {
      return ResponseUtil.notFound(res, '用户不存在');
    }

    ResponseUtil.success(res, {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      phone: user.phone,
      province: user.province,
      city: user.city,
      district: user.district,
      address: user.address,
      last_login_at: user.last_login_at,
      login_count: user.login_count,
      auth_provider: user.auth_provider
    }, '获取用户信息成功');
  } catch (error) {
    logger.error('Get user info error:', error);
    ResponseUtil.badRequest(res, '获取用户信息失败');
  }
});

// 修改密码
router.put('/change-password', [
  body('current_password').notEmpty().withMessage('当前密码不能为空'),
  body('new_password').isLength({ min: 6 }).withMessage('新密码长度至少6个字符'),
], validateRequest, authenticate, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    
    await UserModel.changePassword(req.user!.id, {
      current_password,
      new_password
    });

    ResponseUtil.success(res, null, '密码修改成功');
  } catch (error) {
    logger.error('Change password error:', error);
    
    if (error instanceof Error) {
      if (error.message === '用户不存在或未设置密码') {
        return ResponseUtil.notFound(res, error.message);
      }
      if (error.message === '当前密码错误') {
        return ResponseUtil.badRequest(res, error.message);
      }
    }
    
    ResponseUtil.badRequest(res, '密码修改失败');
  }
});

// 更新用户信息
router.put('/profile', [
  body('nickname').optional().isLength({ min: 2, max: 20 }).withMessage('昵称长度必须在2-20个字符之间'),
  body('phone').optional().isMobilePhone('zh-CN').withMessage('请输入有效的手机号码'),
  body('email').optional().isEmail().withMessage('请输入有效的邮箱地址'),
], validateRequest, authenticate, async (req, res) => {
  try {
    const { nickname, phone, email, province, city, district, address } = req.body;
    
    const user = await UserModel.update(req.user!.id, {
      nickname,
      phone,
      email,
      province,
      city,
      district,
      address
    });

    if (!user) {
      return ResponseUtil.notFound(res, '用户不存在');
    }

    ResponseUtil.success(res, {
      id: user.id,
      email: user.email,
      nickname: user.nickname,
      phone: user.phone,
      province: user.province,
      city: user.city,
      district: user.district,
      address: user.address
    }, '用户信息更新成功');
  } catch (error) {
    logger.error('Update profile error:', error);
    ResponseUtil.badRequest(res, '用户信息更新失败');
  }
});

// 登出
router.post('/logout', authenticate, async (req, res) => {
  try {
    // TODO: 可以在这里实现令牌黑名单功能
    ResponseUtil.success(res, null, '登出成功');
  } catch (error) {
    logger.error('Logout error:', error);
    ResponseUtil.badRequest(res, '登出失败');
  }
});

export default router;