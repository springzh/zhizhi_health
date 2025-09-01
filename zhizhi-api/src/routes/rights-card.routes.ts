import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { rightsCardValidation } from '../validators';
import { RightsCardModel } from '../models/rights-card.model';
import { ResponseUtil } from '../utils/response.util';

const router = Router();

// 获取所有权益卡产品
router.get(
  '/cards',
  rightsCardValidation.query,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, type, is_available } = req.query;
    
    const result = await RightsCardModel.findAllCards({
      page: Number(page),
      limit: Number(limit),
      type: type as string,
      is_available: is_available === 'true' ? true : is_available === 'false' ? false : undefined,
    });

    ResponseUtil.paginated(
      res,
      result.cards,
      result.total,
      result.page,
      result.limit,
      'Rights cards retrieved successfully'
    );
  })
);

// 获取可用权益卡产品
router.get(
  '/cards/available',
  asyncHandler(async (req, res) => {
    const cards = await RightsCardModel.findAllAvailableCards();

    ResponseUtil.success(res, cards, 'Available rights cards retrieved successfully');
  })
);

// 根据类型获取权益卡产品
router.get(
  '/cards/type/:type',
  asyncHandler(async (req, res) => {
    const { type } = req.params;
    
    if (!['nursing', 'special_drug', 'other'].includes(type)) {
      return ResponseUtil.badRequest(res, 'Invalid card type');
    }

    const cards = await RightsCardModel.findCardsByType(type as 'nursing' | 'special_drug' | 'other');

    ResponseUtil.success(res, cards, `Available ${type} cards retrieved successfully`);
  })
);

// 根据ID获取权益卡产品
router.get(
  '/cards/:id',
  rightsCardValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const card = await RightsCardModel.findCardById(Number(id));

    if (!card) {
      return ResponseUtil.notFound(res, 'Rights card not found');
    }

    ResponseUtil.success(res, card, 'Rights card retrieved successfully');
  })
);

// 创建权益卡产品
router.post(
  '/cards',
  rightsCardValidation.create,
  validateRequest,
  asyncHandler(async (req, res) => {
    const cardData = req.validatedData;
    const card = await RightsCardModel.createCard(cardData);

    ResponseUtil.created(res, card, 'Rights card created successfully');
  })
);

// 更新权益卡产品
router.put(
  '/cards/:id',
  rightsCardValidation.update,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.validatedData;
    
    const card = await RightsCardModel.updateCard(Number(id), updateData);

    if (!card) {
      return ResponseUtil.notFound(res, 'Rights card not found');
    }

    ResponseUtil.success(res, card, 'Rights card updated successfully');
  })
);

// 删除权益卡产品
router.delete(
  '/cards/:id',
  rightsCardValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await RightsCardModel.deleteCard(Number(id));

    if (!deleted) {
      return ResponseUtil.notFound(res, 'Rights card not found');
    }

    ResponseUtil.deleted(res, 'Rights card deleted successfully');
  })
);

// 获取用户的权益卡
router.get(
  '/user/:userId',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { status, card_type } = req.query;
    
    const userCards = await RightsCardModel.findUserRightsCardsByUserId(Number(userId), {
      status: status as string,
      card_type: card_type as string,
    });

    ResponseUtil.success(res, userCards, 'User rights cards retrieved successfully');
  })
);

// 创建用户权益卡（购买）
router.post(
  '/user/:userId/purchase',
  rightsCardValidation.createUserCard,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { card_id, payment_method, payment_amount } = req.validatedData;
    
    // 检查权益卡是否存在
    const card = await RightsCardModel.findCardById(Number(card_id));
    if (!card) {
      return ResponseUtil.notFound(res, 'Rights card not found');
    }

    // 创建用户权益卡
    const userCard = await RightsCardModel.createUserRightsCard({
      user_id: Number(userId),
      card_id: Number(card_id),
      payment_method,
      payment_amount: payment_amount || card.price,
    });

    // 这里可以添加支付逻辑
    // const paymentResult = await processPayment(payment_amount || card.price, payment_method);

    ResponseUtil.created(res, userCard, 'Rights card purchased successfully');
  })
);

// 激活权益卡
router.post(
  '/user/:userId/cards/:cardId/activate',
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    
    const userCard = await RightsCardModel.activateCard(Number(cardId));

    if (!userCard) {
      return ResponseUtil.notFound(res, 'User rights card not found');
    }

    ResponseUtil.success(res, userCard, 'Rights card activated successfully');
  })
);

// 获取用户权益卡详情
router.get(
  '/user-cards/:cardId',
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const userCard = await RightsCardModel.findUserRightsCardById(Number(cardId));

    if (!userCard) {
      return ResponseUtil.notFound(res, 'User rights card not found');
    }

    ResponseUtil.success(res, userCard, 'User rights card retrieved successfully');
  })
);

// 创建使用记录
router.post(
  '/user-cards/:cardId/usage',
  rightsCardValidation.createUsage,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    const { service_type, service_details } = req.validatedData;
    
    // 检查用户权益卡是否存在
    const userCard = await RightsCardModel.findUserRightsCardById(Number(cardId));
    if (!userCard) {
      return ResponseUtil.notFound(res, 'User rights card not found');
    }

    // 检查权益卡是否已激活
    if (userCard.status !== 'active') {
      return ResponseUtil.badRequest(res, 'Rights card is not active');
    }

    // 检查权益卡是否已过期
    if (userCard.expiry_date && new Date(userCard.expiry_date) < new Date()) {
      return ResponseUtil.badRequest(res, 'Rights card has expired');
    }

    // 创建使用记录
    const usage = await RightsCardModel.createUsageRecord({
      user_card_id: Number(cardId),
      service_type,
      service_details,
    });

    ResponseUtil.created(res, usage, 'Usage record created successfully');
  })
);

// 获取使用记录
router.get(
  '/user-cards/:cardId/usage',
  asyncHandler(async (req, res) => {
    const { cardId } = req.params;
    
    // 检查用户权益卡是否存在
    const userCard = await RightsCardModel.findUserRightsCardById(Number(cardId));
    if (!userCard) {
      return ResponseUtil.notFound(res, 'User rights card not found');
    }

    const usageRecords = await RightsCardModel.findUsageRecordsByUserCardId(Number(cardId));

    ResponseUtil.success(res, usageRecords, 'Usage records retrieved successfully');
  })
);

export default router;