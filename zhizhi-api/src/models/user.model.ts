import { query, transaction } from '../config/database.config';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest 
} from '../types';

export class UserModel {
  private static readonly TABLE_NAME = 'users';

  // 创建用户
  static async create(userData: CreateUserRequest): Promise<User> {
    const { openid, unionid, nickname, avatar_url, phone } = userData;
    
    const result = await query(`
      INSERT INTO ${this.TABLE_NAME} (openid, unionid, nickname, avatar_url, phone)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [openid, unionid, nickname, avatar_url, phone]);

    return this.mapRowToUser(result.rows[0]);
  }

  // 根据ID查找用户
  static async findById(id: number): Promise<User | null> {
    const result = await query(
      `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`,
      [id]
    );

    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  // 根据OpenID查找用户
  static async findByOpenid(openid: string): Promise<User | null> {
    const result = await query(
      `SELECT * FROM ${this.TABLE_NAME} WHERE openid = $1`,
      [openid]
    );

    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  // 根据手机号查找用户
  static async findByPhone(phone: string): Promise<User | null> {
    const result = await query(
      `SELECT * FROM ${this.TABLE_NAME} WHERE phone = $1`,
      [phone]
    );

    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  // 更新用户信息
  static async update(id: number, updateData: UpdateUserRequest): Promise<User | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const sql = `
      UPDATE ${this.TABLE_NAME} 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, values);

    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  // 删除用户
  static async delete(id: number): Promise<boolean> {
    const result = await query(
      `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`,
      [id]
    );

    return result.rowCount > 0;
  }

  // 分页查询用户
  static async findAll(params: {
    page?: number;
    limit?: number;
    search?: string;
  } = {}): Promise<{ users: User[]; total: number }> {
    const { page = 1, limit = 10, search } = params;
    const offset = (page - 1) * limit;

    let whereClause = '';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (search) {
      whereClause = `WHERE nickname ILIKE $${paramIndex} OR phone ILIKE $${paramIndex}`;
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    // 查询总数
    const countQuery = `SELECT COUNT(*) FROM ${this.TABLE_NAME} ${whereClause}`;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // 查询数据
    const dataQuery = `
      SELECT * FROM ${this.TABLE_NAME} 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const result = await query(dataQuery, queryParams);
    const users = result.rows.map(this.mapRowToUser);

    return { users, total };
  }

  // 创建或更新用户（微信登录用）
  static async upsertByWechat(userData: {
    openid: string;
    unionid?: string;
    nickname?: string;
    avatar_url?: string;
  }): Promise<User> {
    return transaction(async (client) => {
      // 先查询是否存在
      const existingUser = await client.query(
        `SELECT * FROM ${this.TABLE_NAME} WHERE openid = $1`,
        [userData.openid]
      );

      if (existingUser.rows.length > 0) {
        // 更新现有用户
        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;

        for (const [key, value] of Object.entries(userData)) {
          if (value !== undefined && key !== 'openid') {
            updateFields.push(`${key} = $${paramIndex}`);
            updateValues.push(value);
            paramIndex++;
          }
        }

        if (updateFields.length > 0) {
          updateValues.push(userData.openid);
          const updateQuery = `
            UPDATE ${this.TABLE_NAME} 
            SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
            WHERE openid = $${paramIndex}
            RETURNING *
          `;
          
          const result = await client.query(updateQuery, updateValues);
          return this.mapRowToUser(result.rows[0]);
        }

        return this.mapRowToUser(existingUser.rows[0]);
      } else {
        // 创建新用户
        const insertQuery = `
          INSERT INTO ${this.TABLE_NAME} (openid, unionid, nickname, avatar_url)
          VALUES ($1, $2, $3, $4)
          RETURNING *
        `;
        
        const result = await client.query(insertQuery, [
          userData.openid,
          userData.unionid,
          userData.nickname,
          userData.avatar_url,
        ]);
        
        return this.mapRowToUser(result.rows[0]);
      }
    });
  }

  // 映射数据库行到User对象
  private static mapRowToUser(row: any): User {
    return {
      id: row.id,
      openid: row.openid,
      unionid: row.unionid,
      nickname: row.nickname,
      avatar_url: row.avatar_url,
      phone: row.phone,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}