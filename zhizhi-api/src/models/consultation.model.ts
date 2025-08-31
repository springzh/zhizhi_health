import { query, transaction } from '../config/database.config';
import { 
  Consultation, 
  CreateConsultationRequest, 
  ConsultationQueryParams,
  ConsultationListResponse,
  ConsultationReply,
  CreateConsultationReplyRequest,
  ConsultationAttachment
} from '../types/consultation.types';

export class ConsultationModel {
  private static readonly TABLE_NAME = 'consultations';
  private static readonly REPLIES_TABLE_NAME = 'consultation_replies';
  private static readonly ATTACHMENTS_TABLE_NAME = 'consultation_attachments';

  // 创建咨询
  static async create(consultationData: CreateConsultationRequest): Promise<Consultation> {
    const { 
      user_id, 
      doctor_id,
      guest_name, 
      guest_phone, 
      guest_email, 
      title, 
      content, 
      category, 
      priority = 'normal',
      is_public = false 
    } = consultationData;
    
    const result = await query(`
      INSERT INTO ${this.TABLE_NAME} (
        user_id, doctor_id, guest_name, guest_phone, guest_email, title, content, 
        category, priority, is_public
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [user_id, doctor_id, guest_name, guest_phone, guest_email, title, content, category, priority, is_public]);

    return this.mapRowToConsultation(result.rows[0]);
  }

  // 根据ID查找咨询
  static async findById(id: number): Promise<Consultation | null> {
    // 增加查看次数
    await query(
      `UPDATE ${this.TABLE_NAME} SET view_count = view_count + 1 WHERE id = $1`,
      [id]
    );

    const result = await query(
      `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`,
      [id]
    );

    return result.rows.length > 0 ? this.mapRowToConsultation(result.rows[0]) : null;
  }

  // 分页查询咨询
  static async findAll(params: ConsultationQueryParams = {}): Promise<ConsultationListResponse> {
    const { 
      page = 1, 
      limit = 10, 
      category, 
      status, 
      priority,
      user_id,
      doctor_id,
      guest_phone,
      is_public,
      sort_by = 'created_at',
      order = 'desc',
      search
    } = params;
    
    const offset = (page - 1) * limit;

    let whereClause = '';
    const queryParams: any[] = [];
    let paramIndex = 1;

    const whereConditions = [];

    if (category) {
      whereConditions.push(`category = $${paramIndex}`);
      queryParams.push(category);
      paramIndex++;
    }

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (priority) {
      whereConditions.push(`priority = $${paramIndex}`);
      queryParams.push(priority);
      paramIndex++;
    }

    if (user_id) {
      whereConditions.push(`user_id = $${paramIndex}`);
      queryParams.push(user_id);
      paramIndex++;
    }

    if (doctor_id) {
      whereConditions.push(`doctor_id = $${paramIndex}`);
      queryParams.push(doctor_id);
      paramIndex++;
    }

    if (guest_phone) {
      whereConditions.push(`guest_phone = $${paramIndex}`);
      queryParams.push(guest_phone);
      paramIndex++;
    }

    if (is_public !== undefined) {
      whereConditions.push(`is_public = $${paramIndex}`);
      queryParams.push(is_public);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(title ILIKE $${paramIndex} OR content ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (whereConditions.length > 0) {
      whereClause = `WHERE ${whereConditions.join(' AND ')}`;
    }

    // 验证排序字段
    const validSortFields = ['created_at', 'updated_at', 'priority', 'view_count'];
    const sortBy = validSortFields.includes(sort_by) ? sort_by : 'created_at';
    const orderBy = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // 查询总数
    const countQuery = `SELECT COUNT(*) FROM ${this.TABLE_NAME} ${whereClause}`;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // 查询数据
    const dataQuery = `
      SELECT * FROM ${this.TABLE_NAME} 
      ${whereClause}
      ORDER BY ${sortBy} ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const result = await query(dataQuery, queryParams);
    const consultations = result.rows.map(this.mapRowToConsultation);

    return {
      consultations,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  // 更新咨询状态
  static async updateStatus(id: number, status: string): Promise<Consultation | null> {
    const result = await query(
      `UPDATE ${this.TABLE_NAME} 
       SET status = $1, updated_at = CURRENT_TIMESTAMP 
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    return result.rows.length > 0 ? this.mapRowToConsultation(result.rows[0]) : null;
  }

  // 删除咨询
  static async delete(id: number): Promise<boolean> {
    const result = await query(
      `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`,
      [id]
    );

    return result.rowCount > 0;
  }

  // 获取咨询的回复列表
  static async getReplies(consultationId: number): Promise<ConsultationReply[]> {
    const result = await query(
      `SELECT * FROM ${this.REPLIES_TABLE_NAME} 
       WHERE consultation_id = $1 
       ORDER BY created_at ASC`,
      [consultationId]
    );

    return result.rows.map(this.mapRowToReply);
  }

  // 添加回复
  static async addReply(replyData: CreateConsultationReplyRequest): Promise<ConsultationReply> {
    const { consultation_id, user_id, reply_type, content, is_internal_note = false } = replyData;
    
    const result = await query(`
      INSERT INTO ${this.REPLIES_TABLE_NAME} (
        consultation_id, user_id, reply_type, content, is_internal_note
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [consultation_id, user_id, reply_type, content, is_internal_note]);

    return this.mapRowToReply(result.rows[0]);
  }

  // 获取咨询的附件
  static async getAttachments(consultationId: number): Promise<ConsultationAttachment[]> {
    const result = await query(
      `SELECT * FROM ${this.ATTACHMENTS_TABLE_NAME} 
       WHERE consultation_id = $1 
       ORDER BY uploaded_at ASC`,
      [consultationId]
    );

    return result.rows.map(this.mapRowToAttachment);
  }

  // 添加附件
  static async addAttachment(consultationId: number, fileName: string, fileUrl: string, fileType?: string, fileSize?: number): Promise<ConsultationAttachment> {
    const result = await query(`
      INSERT INTO ${this.ATTACHMENTS_TABLE_NAME} (
        consultation_id, file_name, file_url, file_type, file_size
      )
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [consultationId, fileName, fileUrl, fileType, fileSize]);

    return this.mapRowToAttachment(result.rows[0]);
  }

  // 获取公开咨询（用于展示）
  static async getPublicConsultations(category?: string, limit: number = 10): Promise<Consultation[]> {
    let queryStr = `
      SELECT * FROM ${this.TABLE_NAME} 
      WHERE is_public = true AND status = 'replied'
    `;
    const queryParams: any[] = [];

    if (category) {
      queryStr += ` AND category = $1`;
      queryParams.push(category);
    }

    queryStr += ` ORDER BY view_count DESC, created_at DESC LIMIT $${queryParams.length + 1}`;
    queryParams.push(limit);

    const result = await query(queryStr, queryParams);
    return result.rows.map(this.mapRowToConsultation);
  }

  // 获取用户的咨询历史
  static async getUserConsultations(userId: number, page: number = 1, limit: number = 10): Promise<ConsultationListResponse> {
    return this.findAll({ user_id: userId, page, limit, order: 'desc' });
  }

  // 获取指定类别的统计信息
  static async getCategoryStats(): Promise<{ category: string; count: number; pending: number; replied: number }[]> {
    const result = await query(`
      SELECT 
        category,
        COUNT(*) as count,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'replied' THEN 1 END) as replied
      FROM ${this.TABLE_NAME} 
      GROUP BY category
      ORDER BY count DESC
    `);

    return result.rows.map(row => ({
      category: row.category,
      count: parseInt(row.count),
      pending: parseInt(row.pending),
      replied: parseInt(row.replied)
    }));
  }

  // 映射数据库行到Consultation对象
  private static mapRowToConsultation(row: any): Consultation {
    return {
      id: row.id,
      user_id: row.user_id,
      doctor_id: row.doctor_id,
      guest_name: row.guest_name,
      guest_phone: row.guest_phone,
      guest_email: row.guest_email,
      title: row.title,
      content: row.content,
      category: row.category,
      status: row.status,
      priority: row.priority,
      is_public: row.is_public,
      view_count: row.view_count,
      reply_count: row.reply_count,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  // 映射数据库行到Reply对象
  private static mapRowToReply(row: any): ConsultationReply {
    return {
      id: row.id,
      consultation_id: row.consultation_id,
      user_id: row.user_id,
      reply_type: row.reply_type,
      content: row.content,
      is_internal_note: row.is_internal_note,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  // 映射数据库行到Attachment对象
  private static mapRowToAttachment(row: any): ConsultationAttachment {
    return {
      id: row.id,
      consultation_id: row.consultation_id,
      file_name: row.file_name,
      file_url: row.file_url,
      file_type: row.file_type,
      file_size: row.file_size,
      uploaded_at: new Date(row.uploaded_at),
    };
  }
}