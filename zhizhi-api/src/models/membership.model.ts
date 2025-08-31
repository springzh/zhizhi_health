import { query, transaction } from '../config/database.config';
import { 
  MembershipCard, 
  CreateMembershipCardRequest, 
  UserMembership 
} from '../types';

export class MembershipModel {
  private static readonly TABLE_NAME = 'membership_cards';
  private static readonly USER_MEMBERSHIP_TABLE = 'user_memberships';

  // 创建权益卡
  static async createCard(cardData: CreateMembershipCardRequest): Promise<MembershipCard> {
    const { name, price, duration_days, benefits, description } = cardData;
    
    const result = await query(`
      INSERT INTO ${this.TABLE_NAME} (name, price, duration_days, benefits, description)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [name, price, duration_days, JSON.stringify(benefits), description]);

    return this.mapRowToMembershipCard(result.rows[0]);
  }

  // 根据ID获取权益卡
  static async findCardById(id: number): Promise<MembershipCard | null> {
    const result = await query(
      `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`,
      [id]
    );

    return result.rows.length > 0 ? this.mapRowToMembershipCard(result.rows[0]) : null;
  }

  // 获取所有可用权益卡
  static async findAllAvailableCards(): Promise<MembershipCard[]> {
    const result = await query(`
      SELECT * FROM ${this.TABLE_NAME} 
      WHERE is_available = true 
      ORDER BY sort_order ASC, created_at DESC
    `);

    return result.rows.map(this.mapRowToMembershipCard);
  }

  // 分页查询权益卡
  static async findAllCards(params: {
    page?: number;
    limit?: number;
    is_available?: boolean;
  } = {}): Promise<{
    cards: MembershipCard[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, is_available } = params;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const queryParams: any[] = [];

    if (is_available !== undefined) {
      whereClause = 'WHERE is_available = $1';
      queryParams.push(is_available);
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
    const cards = result.rows.map(this.mapRowToMembershipCard);

    return {
      cards,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  // 更新权益卡
  static async updateCard(id: number, updateData: Partial<MembershipCard>): Promise<MembershipCard | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        if (key === 'benefits') {
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

    return result.rows.length > 0 ? this.mapRowToMembershipCard(result.rows[0]) : null;
  }

  // 删除权益卡
  static async deleteCard(id: number): Promise<boolean> {
    const result = await query(
      `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`,
      [id]
    );

    return result.rowCount > 0;
  }

  // 创建用户权益
  static async createUserMembership(userData: {
    user_id: number;
    card_id: number;
    start_date: Date;
    end_date: Date;
    remaining_services: Record<string, any>;
  }): Promise<UserMembership> {
    const { user_id, card_id, start_date, end_date, remaining_services } = userData;
    
    const result = await query(`
      INSERT INTO ${this.USER_MEMBERSHIP_TABLE} (
        user_id, card_id, start_date, end_date, remaining_services, status
      )
      VALUES ($1, $2, $3, $4, $5, 'active')
      RETURNING *
    `, [user_id, card_id, start_date, end_date, JSON.stringify(remaining_services)]);

    return this.mapRowToUserMembership(result.rows[0]);
  }

  // 获取用户权益
  static async findUserMembershipById(id: number): Promise<UserMembership | null> {
    const result = await query(
      `SELECT * FROM ${this.USER_MEMBERSHIP_TABLE} WHERE id = $1`,
      [id]
    );

    return result.rows.length > 0 ? this.mapRowToUserMembership(result.rows[0]) : null;
  }

  // 获取用户的活跃权益
  static async findActiveMembershipsByUserId(userId: number): Promise<UserMembership[]> {
    const result = await query(`
      SELECT um.*, mc.name as card_name, mc.price as card_price
      FROM ${this.USER_MEMBERSHIP_TABLE} um
      JOIN ${this.TABLE_NAME} mc ON um.card_id = mc.id
      WHERE um.user_id = $1 AND um.status = 'active' AND um.end_date > NOW()
      ORDER BY um.created_at DESC
    `, [userId]);

    return result.rows.map(this.mapRowToUserMembership);
  }

  // 获取用户的所有权益
  static async findAllMembershipsByUserId(userId: number): Promise<UserMembership[]> {
    const result = await query(`
      SELECT um.*, mc.name as card_name, mc.price as card_price
      FROM ${this.USER_MEMBERSHIP_TABLE} um
      JOIN ${this.TABLE_NAME} mc ON um.card_id = mc.id
      WHERE um.user_id = $1
      ORDER BY um.created_at DESC
    `, [userId]);

    return result.rows.map(this.mapRowToUserMembership);
  }

  // 更新用户权益
  static async updateUserMembership(id: number, updateData: Partial<UserMembership>): Promise<UserMembership | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        if (key === 'remaining_services') {
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
      return this.findUserMembershipById(id);
    }

    values.push(id);
    const sql = `
      UPDATE ${this.USER_MEMBERSHIP_TABLE} 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, values);

    return result.rows.length > 0 ? this.mapRowToUserMembership(result.rows[0]) : null;
  }

  // 检查用户是否有指定权益
  static async hasActiveMembership(userId: number, cardId?: number): Promise<boolean> {
    let sql = `
      SELECT COUNT(*) as count FROM ${this.USER_MEMBERSHIP_TABLE} 
      WHERE user_id = $1 AND status = 'active' AND end_date > NOW()
    `;
    const params: any[] = [userId];

    if (cardId) {
      sql += ` AND card_id = $2`;
      params.push(cardId);
    }

    const result = await query(sql, params);
    return parseInt(result.rows[0].count) > 0;
  }

  // 使用服务
  static async useService(membershipId: number, serviceType: string, quantity: number = 1): Promise<boolean> {
    return transaction(async (client) => {
      // 获取当前权益信息
      const membershipResult = await client.query(
        `SELECT * FROM ${this.USER_MEMBERSHIP_TABLE} WHERE id = $1`,
        [membershipId]
      );

      if (membershipResult.rows.length === 0) {
        throw new Error('Membership not found');
      }

      const membership = membershipResult.rows[0];
      const remainingServices = JSON.parse(membership.remaining_services || '{}');

      // 检查服务是否可用
      if (!remainingServices[serviceType] || remainingServices[serviceType] < quantity) {
        throw new Error('Insufficient service credits');
      }

      // 扣减服务次数
      remainingServices[serviceType] -= quantity;
      if (remainingServices[serviceType] <= 0) {
        delete remainingServices[serviceType];
      }

      // 更新数据库
      await client.query(
        `UPDATE ${this.USER_MEMBERSHIP_TABLE} 
         SET remaining_services = $1, updated_at = CURRENT_TIMESTAMP 
         WHERE id = $2`,
        [JSON.stringify(remainingServices), membershipId]
      );

      return true;
    });
  }

  // 映射数据库行到MembershipCard对象
  private static mapRowToMembershipCard(row: any): MembershipCard {
    return {
      id: row.id,
      name: row.name,
      price: parseFloat(row.price),
      duration_days: row.duration_days,
      benefits: row.benefits || {},
      description: row.description,
      is_available: row.is_available,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  // 映射数据库行到UserMembership对象
  private static mapRowToUserMembership(row: any): UserMembership {
    return {
      id: row.id,
      user_id: row.user_id,
      card_id: row.card_id,
      start_date: new Date(row.start_date),
      end_date: new Date(row.end_date),
      remaining_services: row.remaining_services || {},
      status: row.status,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}