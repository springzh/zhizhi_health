import { query, transaction } from '../config/database.config';
import { 
  User, 
  CreateUserRequest, 
  UpdateUserRequest,
  UserLoginRequest,
  UserRegisterRequest,
  ChangePasswordRequest,
  UserSession,
  UserLoginLog
} from '../types';
import crypto from 'crypto';

export class UserModel {
  private static readonly TABLE_NAME = 'users';

  // 生成随机盐值
  private static generateSalt(): string {
    return crypto.randomBytes(16).toString('hex');
  }

  // 密码加密
  static hashPassword(password: string, salt: string): string {
    return crypto.createHash('sha256').update(password + salt).digest('hex');
  }

  // 验证密码
  static verifyPassword(password: string, salt: string, hash: string): boolean {
    const hashedPassword = this.hashPassword(password, salt);
    return hashedPassword === hash;
  }

  // 创建用户
  static async create(userData: CreateUserRequest): Promise<User> {
    const { 
      openid, 
      unionid, 
      nickname, 
      avatar_url, 
      phone, 
      email, 
      password, 
      province, 
      city, 
      district, 
      address, 
      auth_provider = 'wechat' 
    } = userData;
    
    let password_hash = null;
    let salt = null;
    
    if (password) {
      salt = this.generateSalt();
      password_hash = this.hashPassword(password, salt);
    }
    
    const result = await query(`
      INSERT INTO ${this.TABLE_NAME} (
        openid, unionid, nickname, avatar_url, phone, 
        email, password_hash, salt, province, city, 
        district, address, auth_provider
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `, [
      openid, unionid, nickname, avatar_url, phone, 
      email, password_hash, salt, province, city, 
      district, address, auth_provider
    ]);

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

  // 根据邮箱查找用户
  static async findByEmail(email: string): Promise<User | null> {
    const result = await query(
      `SELECT * FROM ${this.TABLE_NAME} WHERE email = $1`,
      [email]
    );

    return result.rows.length > 0 ? this.mapRowToUser(result.rows[0]) : null;
  }

  // 用户注册
  static async register(userData: UserRegisterRequest): Promise<User> {
    const { email, password, phone, nickname, province, city, district, address } = userData;
    
    // 检查邮箱是否已存在
    const existingUser = await this.findByEmail(email);
    if (existingUser) {
      throw new Error('邮箱已存在');
    }

    const salt = this.generateSalt();
    const password_hash = this.hashPassword(password, salt);
    
    const result = await query(`
      INSERT INTO ${this.TABLE_NAME} (
        email, password_hash, salt, phone, nickname, 
        province, city, district, address, auth_provider
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'email')
      RETURNING *
    `, [
      email, password_hash, salt, phone, nickname, 
      province, city, district, address
    ]);

    return this.mapRowToUser(result.rows[0]);
  }

  // 用户登录
  static async login(loginData: UserLoginRequest): Promise<User | null> {
    const { email, password } = loginData;
    
    const user = await this.findByEmail(email);
    if (!user || !user.password_hash || !user.salt) {
      return null;
    }

    const isPasswordValid = this.verifyPassword(password, user.salt, user.password_hash);
    if (!isPasswordValid) {
      return null;
    }

    // 更新登录信息
    await query(`
      UPDATE ${this.TABLE_NAME} 
      SET last_login_at = CURRENT_TIMESTAMP, 
          login_count = login_count + 1
      WHERE id = $1
    `, [user.id]);

    return user;
  }

  // 修改密码
  static async changePassword(userId: number, passwordData: ChangePasswordRequest): Promise<boolean> {
    const { current_password, new_password } = passwordData;
    
    // 获取当前用户
    const user = await this.findById(userId);
    if (!user || !user.password_hash || !user.salt) {
      throw new Error('用户不存在或未设置密码');
    }

    // 验证当前密码
    const isCurrentPasswordValid = this.verifyPassword(current_password, user.salt, user.password_hash);
    if (!isCurrentPasswordValid) {
      throw new Error('当前密码错误');
    }

    // 生成新密码
    const salt = this.generateSalt();
    const password_hash = this.hashPassword(new_password, salt);
    
    // 更新密码
    await query(`
      UPDATE ${this.TABLE_NAME} 
      SET password_hash = $1, salt = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [password_hash, salt, userId]);

    return true;
  }

  // 记录登录日志
  static async logLogin(userId: number, loginType: 'wechat' | 'email' | 'phone', status: 'success' | 'failed', ip?: string, userAgent?: string): Promise<void> {
    await query(`
      INSERT INTO user_login_logs (user_id, login_type, ip_address, user_agent, login_status)
      VALUES ($1, $2, $3, $4, $5)
    `, [userId, loginType, ip, userAgent, status]);
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
      email: row.email,
      password_hash: row.password_hash,
      salt: row.salt,
      province: row.province,
      city: row.city,
      district: row.district,
      address: row.address,
      is_active: row.is_active,
      last_login_at: row.last_login_at ? new Date(row.last_login_at) : undefined,
      login_count: row.login_count,
      auth_provider: row.auth_provider,
      email_verified: row.email_verified,
      phone_verified: row.phone_verified,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}