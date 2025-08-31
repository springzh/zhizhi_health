import { query } from '../config/database.config';
import { Service, ServiceCategory } from '../types';

export class ServiceModel {
  private static readonly SERVICE_TABLE = 'services';
  private static readonly CATEGORY_TABLE = 'service_categories';

  // 获取所有服务分类
  static async findAllCategories(): Promise<ServiceCategory[]> {
    const result = await query(`
      SELECT * FROM ${this.CATEGORY_TABLE} 
      WHERE is_active = true 
      ORDER BY sort_order ASC, created_at ASC
    `);

    return result.rows.map(this.mapRowToCategory);
  }

  // 根据ID获取服务分类
  static async findCategoryById(id: number): Promise<ServiceCategory | null> {
    const result = await query(
      `SELECT * FROM ${this.CATEGORY_TABLE} WHERE id = $1`,
      [id]
    );

    return result.rows.length > 0 ? this.mapRowToCategory(result.rows[0]) : null;
  }

  // 根据类型获取服务分类
  static async findCategoriesByType(type: 'dental' | 'cell' | 'membership'): Promise<ServiceCategory[]> {
    const result = await query(`
      SELECT * FROM ${this.CATEGORY_TABLE} 
      WHERE type = $1 AND is_active = true 
      ORDER BY sort_order ASC, created_at ASC
    `, [type]);

    return result.rows.map(this.mapRowToCategory);
  }

  // 获取分类下的所有服务
  static async findServicesByCategory(categoryId: number): Promise<Service[]> {
    const result = await query(`
      SELECT * FROM ${this.SERVICE_TABLE} 
      WHERE category_id = $1 
      ORDER BY sort_order ASC, created_at DESC
    `, [categoryId]);

    return result.rows.map(this.mapRowToService);
  }

  // 获取推荐服务
  static async findRecommendedServices(limit: number = 10): Promise<Service[]> {
    const result = await query(`
      SELECT s.*, sc.name as category_name, sc.type as category_type
      FROM ${this.SERVICE_TABLE} s
      JOIN ${this.CATEGORY_TABLE} sc ON s.category_id = sc.id
      WHERE s.is_recommended = true AND sc.is_active = true
      ORDER BY s.sort_order ASC, s.created_at DESC
      LIMIT $1
    `, [limit]);

    return result.rows.map(this.mapRowToService);
  }

  // 根据类型获取服务
  static async findServicesByType(type: 'dental' | 'cell' | 'membership'): Promise<Service[]> {
    const result = await query(`
      SELECT s.*, sc.name as category_name, sc.type as category_type
      FROM ${this.SERVICE_TABLE} s
      JOIN ${this.CATEGORY_TABLE} sc ON s.category_id = sc.id
      WHERE sc.type = $1 AND sc.is_active = true
      ORDER BY s.sort_order ASC, s.created_at DESC
    `, [type]);

    return result.rows.map(this.mapRowToService);
  }

  // 根据ID获取服务
  static async findServiceById(id: number): Promise<Service | null> {
    const result = await query(`
      SELECT s.*, sc.name as category_name, sc.type as category_type
      FROM ${this.SERVICE_TABLE} s
      JOIN ${this.CATEGORY_TABLE} sc ON s.category_id = sc.id
      WHERE s.id = $1
    `, [id]);

    return result.rows.length > 0 ? this.mapRowToService(result.rows[0]) : null;
  }

  // 搜索服务
  static async searchServices(keyword: string, type?: string): Promise<Service[]> {
    let sql = `
      SELECT s.*, sc.name as category_name, sc.type as category_type
      FROM ${this.SERVICE_TABLE} s
      JOIN ${this.CATEGORY_TABLE} sc ON s.category_id = sc.id
      WHERE sc.is_active = true AND (
        s.name ILIKE $1 OR 
        s.description ILIKE $1 OR
        sc.name ILIKE $1
      )
    `;
    const params = [`%${keyword}%`];

    if (type) {
      sql += ` AND sc.type = $2`;
      params.push(type);
    }

    sql += ` ORDER BY s.sort_order ASC, s.created_at DESC`;

    const result = await query(sql, params);
    return result.rows.map(this.mapRowToService);
  }

  // 获取热门服务（基于价格或推荐）
  static async findPopularServices(limit: number = 10): Promise<Service[]> {
    const result = await query(`
      SELECT s.*, sc.name as category_name, sc.type as category_type
      FROM ${this.SERVICE_TABLE} s
      JOIN ${this.CATEGORY_TABLE} sc ON s.category_id = sc.id
      WHERE sc.is_active = true
      ORDER BY s.is_recommended DESC, s.price DESC, s.sort_order ASC
      LIMIT $1
    `, [limit]);

    return result.rows.map(this.mapRowToService);
  }

  // 获取服务详情（包含分类信息）
  static async getServiceWithCategory(serviceId: number): Promise<(Service & { category: ServiceCategory }) | null> {
    const result = await query(`
      SELECT s.*, sc.name as category_name, sc.type as category_type, 
             sc.description as category_description, sc.icon as category_icon
      FROM ${this.SERVICE_TABLE} s
      JOIN ${this.CATEGORY_TABLE} sc ON s.category_id = sc.id
      WHERE s.id = $1
    `, [serviceId]);

    if (result.rows.length === 0) {
      return null;
    }

    const row = result.rows[0];
    const service = this.mapRowToService(row);
    const category: ServiceCategory = {
      id: row.category_id,
      name: row.category_name,
      type: row.category_type,
      description: row.category_description,
      icon: row.category_icon,
      sort_order: 0, // 不在查询中
      is_active: true, // 假设活跃
      created_at: new Date(), // 不在查询中
      updated_at: new Date(), // 不在查询中
    };

    return { ...service, category };
  }

  // 获取所有服务（分页）
  static async findAllServices(params: {
    page?: number;
    limit?: number;
    category_id?: number;
    type?: string;
    is_recommended?: boolean;
  } = {}): Promise<{
    services: Service[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const { page = 1, limit = 10, category_id, type, is_recommended } = params;
    const offset = (page - 1) * limit;

    let whereClause = 'WHERE sc.is_active = true';
    const queryParams: any[] = [];
    let paramIndex = 1;

    if (category_id) {
      whereClause += ` AND s.category_id = $${paramIndex}`;
      queryParams.push(category_id);
      paramIndex++;
    }

    if (type) {
      whereClause += ` AND sc.type = $${paramIndex}`;
      queryParams.push(type);
      paramIndex++;
    }

    if (is_recommended !== undefined) {
      whereClause += ` AND s.is_recommended = $${paramIndex}`;
      queryParams.push(is_recommended);
      paramIndex++;
    }

    // 查询总数
    const countQuery = `
      SELECT COUNT(*) 
      FROM ${this.SERVICE_TABLE} s
      JOIN ${this.CATEGORY_TABLE} sc ON s.category_id = sc.id
      ${whereClause}
    `;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // 查询数据
    const dataQuery = `
      SELECT s.*, sc.name as category_name, sc.type as category_type
      FROM ${this.SERVICE_TABLE} s
      JOIN ${this.CATEGORY_TABLE} sc ON s.category_id = sc.id
      ${whereClause}
      ORDER BY s.sort_order ASC, s.created_at DESC
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const result = await query(dataQuery, queryParams);
    const services = result.rows.map(this.mapRowToService);

    return {
      services,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  // 映射数据库行到Category对象
  private static mapRowToCategory(row: any): ServiceCategory {
    return {
      id: row.id,
      name: row.name,
      type: row.type,
      description: row.description,
      icon: row.icon,
      sort_order: row.sort_order,
      is_active: row.is_active,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }

  // 映射数据库行到Service对象
  private static mapRowToService(row: any): Service {
    return {
      id: row.id,
      category_id: row.category_id,
      name: row.name,
      description: row.description,
      price: row.price ? parseFloat(row.price) : undefined,
      duration: row.duration,
      images: row.images || [],
      content: row.content,
      is_recommended: row.is_recommended,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}