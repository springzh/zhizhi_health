import { query, transaction } from '../config/database.config';
import { 
  RightsCard, 
  CreateRightsCardRequest,
  UserRightsCard,
  CreateUserRightsCardRequest,
  RightsCardUsage,
  CreateRightsCardUsageRequest
} from '../types';

export class RightsCardModel {
  private static readonly TABLE_NAME = 'rights_cards';
  private static readonly USER_RIGHTS_CARD_TABLE = 'user_rights_cards';
  private static readonly RIGHTS_CARD_USAGE_TABLE = 'rights_card_usage';

  // 创建权益卡产品
  static async createCard(cardData: CreateRightsCardRequest): Promise<RightsCard> {
    const {
      name, type, description, price, duration_years, activation_age_min, activation_age_max,
      coverage_details, service_limits, eligibility_rules, application_process,
      key_features, benefits, target_audience, faq, comparison_points, sort_order
    } = cardData;

    const result = await query(`
      INSERT INTO ${this.TABLE_NAME} (
        name, type, description, price, duration_years, activation_age_min, activation_age_max,
        coverage_details, service_limits, eligibility_rules, application_process,
        key_features, benefits, target_audience, faq, comparison_points, sort_order
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)
      RETURNING *
    `, [
      name, type, description, price, duration_years, activation_age_min || 0, activation_age_max || 75,
      JSON.stringify(coverage_details || {}), JSON.stringify(service_limits || {}),
      JSON.stringify(eligibility_rules || {}), JSON.stringify(application_process || {}),
      key_features || [], benefits || [], target_audience || [],
      JSON.stringify(faq || {}), JSON.stringify(comparison_points || {}), sort_order || 0
    ]);

    return this.mapRowToRightsCard(result.rows[0]);
  }

  // 根据ID获取权益卡
  static async findCardById(id: number): Promise<RightsCard | null> {
    const result = await query(
      `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`,
      [id]
    );

    return result.rows.length > 0 ? this.mapRowToRightsCard(result.rows[0]) : null;
  }

  // 获取所有可用权益卡
  static async findAllAvailableCards(): Promise<RightsCard[]> {
    const result = await query(`
      SELECT * FROM ${this.TABLE_NAME} 
      WHERE is_available = true 
      ORDER BY sort_order ASC, created_at DESC
    `);

    return result.rows.map(this.mapRowToRightsCard);
  }

  // 根据类型获取权益卡
  static async findCardsByType(type: 'nursing' | 'special_drug' | 'other'): Promise<RightsCard[]> {
    const result = await query(`
      SELECT * FROM ${this.TABLE_NAME} 
      WHERE type = $1 AND is_available = true 
      ORDER BY sort_order ASC, created_at DESC
    `, [type]);

    return result.rows.map(this.mapRowToRightsCard);
  }

  // 分页查询权益卡
  static async findAllCards(params: {
    page?: number;
    limit?: number;
    type?: string;
    is_available?: boolean;
  } = {}): Promise<{
    cards: RightsCard[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, type, is_available } = params;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const queryParams: any[] = [];

    // 构建WHERE条件
    const conditions = [];
    if (type !== undefined) {
      conditions.push(`type = $${queryParams.length + 1}`);
      queryParams.push(type);
    }
    if (is_available !== undefined) {
      conditions.push(`is_available = $${queryParams.length + 1}`);
      queryParams.push(is_available);
    }

    if (conditions.length > 0) {
      whereClause = `WHERE ${conditions.join(' AND ')}`;
    }

    // 查询总数
    const countQuery = `SELECT COUNT(*) FROM ${this.TABLE_NAME} ${whereClause}`;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // 查询数据
    const dataQuery = `
      SELECT * FROM ${this.TABLE_NAME} 
      ${whereClause}
      ORDER BY sort_order ASC, created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    queryParams.push(limit, offset);

    const result = await query(dataQuery, queryParams);
    const cards = result.rows.map(this.mapRowToRightsCard);

    return {
      cards,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  // 更新权益卡
  static async updateCard(id: number, updateData: Partial<RightsCard>): Promise<RightsCard | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        if ([
          'coverage_details', 'service_limits', 'eligibility_rules', 'application_process',
          'key_features', 'benefits', 'target_audience', 'faq', 'comparison_points'
        ].includes(key)) {
          fields.push(`${key} = $${paramIndex}`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${key} = $${paramIndex}`);
          values.push(value);
        }
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return this.findCardById(id);
    }

    values.push(id);
    const sql = `
      UPDATE ${this.TABLE_NAME} 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, values);

    return result.rows.length > 0 ? this.mapRowToRightsCard(result.rows[0]) : null;
  }

  // 删除权益卡
  static async deleteCard(id: number): Promise<boolean> {
    const result = await query(
      `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`,
      [id]
    );

    return result.rowCount > 0;
  }

  // 创建用户权益卡
  static async createUserRightsCard(userData: CreateUserRightsCardRequest): Promise<UserRightsCard> {
    const { user_id, card_id, payment_method, payment_amount } = userData;
    
    // 生成卡号
    const cardNumber = this.generateCardNumber();
    
    const result = await query(`
      INSERT INTO ${this.USER_RIGHTS_CARD_TABLE} (
        user_id, card_id, card_number, payment_method, payment_amount
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [user_id, card_id, cardNumber, payment_method, payment_amount]);

    return this.mapRowToUserRightsCard(result.rows[0]);
  }

  // 获取用户权益卡
  static async findUserRightsCardById(id: number): Promise<UserRightsCard | null> {
    const result = await query(
      `SELECT * FROM ${this.USER_RIGHTS_CARD_TABLE} WHERE id = $1`,
      [id]
    );

    return result.rows.length > 0 ? this.mapRowToUserRightsCard(result.rows[0]) : null;
  }

  // 获取用户的权益卡
  static async findUserRightsCardsByUserId(userId: number, params: {
    status?: string;
    card_type?: string;
  } = {}): Promise<UserRightsCard[]> {
    const { status, card_type } = params;
    
    let whereClause = 'WHERE urc.user_id = $1';
    const queryParams: any[] = [userId];

    if (status) {
      whereClause += ` AND urc.status = $${queryParams.length + 1}`;
      queryParams.push(status);
    }

    if (card_type) {
      whereClause += ` AND rc.type = $${queryParams.length + 1}`;
      queryParams.push(card_type);
    }

    const result = await query(`
      SELECT urc.*, rc.name as card_name, rc.type as card_type, rc.price as card_price
      FROM ${this.USER_RIGHTS_CARD_TABLE} urc
      JOIN ${this.TABLE_NAME} rc ON urc.card_id = rc.id
      ${whereClause}
      ORDER BY urc.created_at DESC
    `, queryParams);

    return result.rows.map(this.mapRowToUserRightsCard);
  }

  // 激活权益卡
  static async activateCard(id: number): Promise<UserRightsCard | null> {
    const card = await this.findUserRightsCardById(id);
    if (!card) {
      return null;
    }

    const rightsCard = await this.findCardById(card.card_id);
    if (!rightsCard) {
      return null;
    }

    const activationDate = new Date();
    const expiryDate = new Date(activationDate.getFullYear() + rightsCard.duration_years, activationDate.getMonth(), activationDate.getDate());

    const result = await query(`
      UPDATE ${this.USER_RIGHTS_CARD_TABLE} 
      SET activation_date = $1, expiry_date = $2, status = 'active', updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
      RETURNING *
    `, [activationDate, expiryDate, id]);

    return result.rows.length > 0 ? this.mapRowToUserRightsCard(result.rows[0]) : null;
  }

  // 创建使用记录
  static async createUsageRecord(usageData: CreateRightsCardUsageRequest): Promise<RightsCardUsage> {
    const { user_card_id, service_type, service_details } = usageData;
    
    const result = await query(`
      INSERT INTO ${this.RIGHTS_CARD_USAGE_TABLE} (
        user_card_id, service_type, service_details
      )
      VALUES ($1, $2, $3)
      RETURNING *
    `, [user_card_id, service_type, JSON.stringify(service_details || {})]);

    return this.mapRowToRightsCardUsage(result.rows[0]);
  }

  // 获取使用记录
  static async findUsageRecordsByUserCardId(userCardId: number): Promise<RightsCardUsage[]> {
    const result = await query(`
      SELECT * FROM ${this.RIGHTS_CARD_USAGE_TABLE} 
      WHERE user_card_id = $1 
      ORDER BY usage_date DESC
    `, [userCardId]);

    return result.rows.map(this.mapRowToRightsCardUsage);
  }

  // 生成卡号
  private static generateCardNumber(): string {
    const timestamp = Date.now().toString();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `RC${timestamp}${random}`;
  }

  // 映射数据库行到RightsCard对象
  private static mapRowToRightsCard(row: any): RightsCard {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      description: row.description,
      price: parseFloat(row.price),
      duration_years: row.duration_years,
      activation_age_min: row.activation_age_min,
      activation_age_max: row.activation_age_max,
      coverage_details: row.coverage_details || {},
      service_limits: row.service_limits || {},
      eligibility_rules: row.eligibility_rules || {},
      application_process: row.application_process || {},
      key_features: row.key_features || [],
      benefits: row.benefits || [],
      target_audience: row.target_audience || [],
      faq: row.faq || {},
      comparison_points: row.comparison_points || {},
      is_available: row.is_available,
      sort_order: row.sort_order,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  // 映射数据库行到UserRightsCard对象
  private static mapRowToUserRightsCard(row: any): UserRightsCard {
    return {
      id: row.id,
      user_id: row.user_id,
      card_id: row.card_id,
      card_number: row.card_number,
      activation_date: row.activation_date ? new Date(row.activation_date) : undefined,
      expiry_date: row.expiry_date ? new Date(row.expiry_date) : undefined,
      status: row.status,
      remaining_benefits: row.remaining_benefits || {},
      usage_records: row.usage_records || [],
      payment_status: row.payment_status,
      payment_method: row.payment_method,
      payment_amount: row.payment_amount ? parseFloat(row.payment_amount) : undefined,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  // 映射数据库行到RightsCardUsage对象
  private static mapRowToRightsCardUsage(row: any): RightsCardUsage {
    return {
      id: row.id,
      user_card_id: row.user_card_id,
      service_type: row.service_type,
      service_details: row.service_details || {},
      usage_date: new Date(row.usage_date),
      status: row.status,
      approval_notes: row.approval_notes,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}