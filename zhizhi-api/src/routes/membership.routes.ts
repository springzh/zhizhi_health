import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { membershipValidation } from '../validators';
import { MembershipModel } from '../models/membership.model';
import { ResponseUtil } from '../utils/response.util';

const router = Router();

// 获取所有权益卡
router.get(
  '/cards',
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, is_available } = req.query;
    
    const result = await MembershipModel.findAllCards({
      page: Number(page),
      limit: Number(limit),
      is_available: is_available === 'true' ? true : is_available === 'false' ? false : undefined,
    });

    ResponseUtil.paginated(
      res,
      result.cards,
      result.total,
      result.page,
      result.limit,
      'Membership cards retrieved successfully'
    );
  })
);

// 获取可用权益卡
router.get(
  '/cards/available',
  asyncHandler(async (req, res) => {
    const cards = await MembershipModel.findAllAvailableCards();

    ResponseUtil.success(res, cards, 'Available membership cards retrieved successfully');
  })
);

// 根据ID获取权益卡
router.get(
  '/cards/:id',
  membershipValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const card = await MembershipModel.findCardById(Number(id));

    if (!card) {
      return ResponseUtil.notFound(res, 'Membership card not found');
    }

    ResponseUtil.success(res, card, 'Membership card retrieved successfully');
  })
);

// 创建权益卡
router.post(
  '/cards',
  membershipValidation.create,
  validateRequest,
  asyncHandler(async (req, res) => {
    const cardData = req.validatedData;
    const card = await MembershipModel.createCard(cardData);

    ResponseUtil.created(res, card, 'Membership card created successfully');
  })
);

// 更新权益卡
router.put(
  '/cards/:id',
  membershipValidation.update,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.validatedData;
    
    const card = await MembershipModel.updateCard(Number(id), updateData);

    if (!card) {
      return ResponseUtil.notFound(res, 'Membership card not found');
    }

    ResponseUtil.success(res, card, 'Membership card updated successfully');
  })
);

// 删除权益卡
router.delete(
  '/cards/:id',
  membershipValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await MembershipModel.deleteCard(Number(id));

    if (!deleted) {
      return ResponseUtil.notFound(res, 'Membership card not found');
    }

    ResponseUtil.deleted(res, 'Membership card deleted successfully');
  })
);

// 获取用户权益
router.get(
  '/user/:userId',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { active_only } = req.query;
    
    let memberships;
    if (active_only === 'true') {
      memberships = await MembershipModel.findActiveMembershipsByUserId(Number(userId));
    } else {
      memberships = await MembershipModel.findAllMembershipsByUserId(Number(userId));
    }

    ResponseUtil.success(res, memberships, 'User memberships retrieved successfully');
  })
);

// 创建用户权益
router.post(
  '/user/:userId/purchase',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { card_id, payment_method } = req.body;
    
    if (!card_id) {
      return ResponseUtil.badRequest(res, 'Card ID is required');
    }

    // 获取权益卡信息
    const card = await MembershipModel.findCardById(Number(card_id));
    if (!card) {
      return ResponseUtil.notFound(res, 'Membership card not found');
    }

    // 创建用户权益
    const startDate = new Date();
    const endDate = new Date(startDate.getTime() + card.duration_days * 24 * 60 * 60 * 1000);
    
    const membership = await MembershipModel.createUserMembership({
      user_id: Number(userId),
      card_id: Number(card_id),
      start_date: startDate,
      end_date: endDate,
      remaining_services: { ...card.benefits }, // 复制权益卡的权益
    });

    // 这里可以添加支付逻辑
    // const paymentResult = await processPayment(card.price, payment_method);

    ResponseUtil.created(res, membership, 'Membership purchased successfully');
  })
);

// 使用服务
router.post(
  '/:membershipId/use-service',
  asyncHandler(async (req, res) => {
    const { membershipId } = req.params;
    const { service_type, quantity = 1 } = req.body;
    
    if (!service_type) {
      return ResponseUtil.badRequest(res, 'Service type is required');
    }

    try {
      await MembershipModel.useService(Number(membershipId), service_type, Number(quantity));
      
      ResponseUtil.success(res, null, 'Service used successfully');
    } catch (error) {
      if (error instanceof Error) {
        if (error.message === 'Membership not found') {
          return ResponseUtil.notFound(res, 'Membership not found');
        }
        if (error.message === 'Insufficient service credits') {
          return ResponseUtil.badRequest(res, 'Insufficient service credits');
        }
      }
      throw error;
    }
  })
);

// 检查用户是否有活跃权益
router.get(
  '/user/:userId/has-active-membership',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { card_id } = req.query;
    
    const hasMembership = await MembershipModel.hasActiveMembership(
      Number(userId),
      card_id ? Number(card_id) : undefined
    );

    ResponseUtil.success(res, { has_active_membership: hasMembership }, 'Membership status checked');
  })
);

// 获取用户权益详情
router.get(
  '/:membershipId',
  asyncHandler(async (req, res) => {
    const { membershipId } = req.params;
    const membership = await MembershipModel.findUserMembershipById(Number(membershipId));

    if (!membership) {
      return ResponseUtil.notFound(res, 'Membership not found');
    }

    ResponseUtil.success(res, membership, 'Membership retrieved successfully');
  })
);

// 更新用户权益
router.put(
  '/:membershipId',
  asyncHandler(async (req, res) => {
    const { membershipId } = req.params;
    const updateData = req.body;
    
    const membership = await MembershipModel.updateUserMembership(Number(membershipId), updateData);

    if (!membership) {
      return ResponseUtil.notFound(res, 'Membership not found');
    }

    ResponseUtil.success(res, membership, 'Membership updated successfully');
  })
);

export default router;