import { query, transaction } from '../config/database.config';
import { 
  Doctor, 
  CreateDoctorRequest, 
  UpdateDoctorRequest, 
  DoctorQueryParams 
} from '../types';

export class DoctorModel {
  private static readonly TABLE_NAME = 'doctors';

  // 创建医生
  static async create(doctorData: CreateDoctorRequest): Promise<Doctor> {
    const { name, title, specialty, hospital, location, avatar_url, introduction, service_types } = doctorData;
    
    const result = await query(`
      INSERT INTO ${this.TABLE_NAME} (name, title, specialty, hospital, location, avatar_url, introduction, service_types)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [name, title, specialty, hospital, location, avatar_url, introduction, JSON.stringify(service_types || [])]);

    return this.mapRowToDoctor(result.rows[0]);
  }

  // 根据ID查找医生
  static async findById(id: number): Promise<Doctor | null> {
    const result = await query(
      `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`,
      [id]
    );

    return result.rows.length > 0 ? this.mapRowToDoctor(result.rows[0]) : null;
  }

  // 更新医生信息
  static async update(id: number, updateData: UpdateDoctorRequest): Promise<Doctor | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        if (key === 'service_types') {
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

    return result.rows.length > 0 ? this.mapRowToDoctor(result.rows[0]) : null;
  }

  // 删除医生
  static async delete(id: number): Promise<boolean> {
    const result = await query(
      `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`,
      [id]
    );

    return result.rowCount > 0;
  }

  // 分页查询医生
  static async findAll(params: DoctorQueryParams = {}): Promise<{ 
    doctors: Doctor[]; 
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const { 
      page = 1, 
      limit = 10, 
      location, 
      specialty, 
      search, 
      is_available,
      sort_by = 'created_at',
      order = 'desc'
    } = params;
    
    const offset = (page - 1) * limit;

    let whereClause = '';
    const queryParams: any[] = [];
    let paramIndex = 1;

    const whereConditions = [];

    if (location) {
      whereConditions.push(`location = $${paramIndex}`);
      queryParams.push(location);
      paramIndex++;
    }

    if (specialty) {
      whereConditions.push(`specialty ILIKE $${paramIndex}`);
      queryParams.push(`%${specialty}%`);
      paramIndex++;
    }

    if (search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR hospital ILIKE $${paramIndex})`);
      queryParams.push(`%${search}%`);
      paramIndex++;
    }

    if (is_available !== undefined) {
      whereConditions.push(`is_available = $${paramIndex}`);
      queryParams.push(is_available);
      paramIndex++;
    }

    if (whereConditions.length > 0) {
      whereClause = `WHERE ${whereConditions.join(' AND ')}`;
    }

    // 验证排序字段
    const validSortFields = ['name', 'rating', 'consultation_count', 'created_at'];
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
    const doctors = result.rows.map(this.mapRowToDoctor);

    return {
      doctors,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  // 获取热门医生
  static async getPopularDoctors(limit: number = 10): Promise<Doctor[]> {
    const result = await query(`
      SELECT * FROM ${this.TABLE_NAME} 
      WHERE is_available = true 
      ORDER BY rating DESC, consultation_count DESC
      LIMIT $1
    `, [limit]);

    return result.rows.map(this.mapRowToDoctor);
  }

  // 根据地区获取医生
  static async getDoctorsByLocation(location: string, limit: number = 20): Promise<Doctor[]> {
    const result = await query(`
      SELECT * FROM ${this.TABLE_NAME} 
      WHERE location = $1 AND is_available = true
      ORDER BY rating DESC
      LIMIT $2
    `, [location, limit]);

    return result.rows.map(this.mapRowToDoctor);
  }

  // 根据专长获取医生
  static async getDoctorsBySpecialty(specialty: string, limit: number = 20): Promise<Doctor[]> {
    const result = await query(`
      SELECT * FROM ${this.TABLE_NAME} 
      WHERE specialty ILIKE $1 AND is_available = true
      ORDER BY rating DESC
      LIMIT $2
    », [`%${specialty}%`, limit]);

    return result.rows.map(this.mapRowToDoctor);
  }

  // 更新医生咨询次数
  static async incrementConsultationCount(id: number): Promise<void> {
    await query(
      `UPDATE ${this.TABLE_NAME} 
       SET consultation_count = consultation_count + 1, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [id]
    );
  }

  // 批量更新医生可用状态
  static async batchUpdateAvailability(updates: { id: number; is_available: boolean }[]): Promise<void> {
    return transaction(async (client) => {
      for (const update of updates) {
        await client.query(
          `UPDATE ${this.TABLE_NAME} 
           SET is_available = $1, updated_at = CURRENT_TIMESTAMP 
           WHERE id = $2`,
          [update.is_available, update.id]
        );
      }
    });
  }

  // 搜索医生（全文搜索）
  static async searchDoctors(queryText: string, params: DoctorQueryParams = {}): Promise<{
    doctors: Doctor[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;

    // 使用PostgreSQL的全文搜索
    const searchQuery = `
      SELECT *, 
             ts_rank_cd(textsearchable_index_col, query) as rank
      FROM ${this.TABLE_NAME}, 
           to_tsquery('simple', $1) query
      WHERE textsearchable_index_col @@ query
        AND is_available = true
      ORDER BY rank DESC, rating DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await query(searchQuery, [queryText, limit, offset]);
    
    // 获取总数
    const countQuery = `
      SELECT COUNT(*) 
      FROM ${this.TABLE_NAME}, 
           to_tsquery('simple', $1) query
      WHERE textsearchable_index_col @@ query
        AND is_available = true
    `;
    const countResult = await query(countQuery, [queryText]);
    const total = parseInt(countResult.rows[0].count);

    const doctors = result.rows.map(this.mapRowToDoctor);

    return {
      doctors,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  // 映射数据库行到Doctor对象
  private static mapRowToDoctor(row: any): Doctor {
    return {
      id: row.id,
      name: row.name,
      title: row.title,
      specialty: row.specialty,
      hospital: row.hospital,
      location: row.location,
      avatar_url: row.avatar_url,
      introduction: row.introduction,
      rating: parseFloat(row.rating),
      consultation_count: row.consultation_count,
      is_available: row.is_available,
      service_types: row.service_types || [],
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}