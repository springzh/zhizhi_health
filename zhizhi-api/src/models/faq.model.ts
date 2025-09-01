import { Database } from '../config/database.config';
import { FAQ, FAQCategory, FAQCreateRequest, FAQUpdateRequest, FAQCategoryCreateRequest, FAQCategoryUpdateRequest, FAQQueryParams } from '../types/faq.types';

export class FAQModel {
  private db = Database.getInstance();

  // FAQ Categories
  async createCategory(categoryData: FAQCategoryCreateRequest): Promise<FAQCategory> {
    const query = `
      INSERT INTO faq_categories (name, description, sort_order, is_active)
      VALUES ($1, $2, $3, true)
      RETURNING *
    `;
    const values = [categoryData.name, categoryData.description, categoryData.sort_order || 0];
    
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateCategory(id: number, categoryData: FAQCategoryUpdateRequest): Promise<FAQCategory | null> {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    if (categoryData.name !== undefined) {
      setClause.push(`name = $${paramIndex++}`);
      values.push(categoryData.name);
    }
    if (categoryData.description !== undefined) {
      setClause.push(`description = $${paramIndex++}`);
      values.push(categoryData.description);
    }
    if (categoryData.sort_order !== undefined) {
      setClause.push(`sort_order = $${paramIndex++}`);
      values.push(categoryData.sort_order);
    }

    if (setClause.length === 0) {
      return null;
    }

    values.push(id);
    const query = `
      UPDATE faq_categories
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteCategory(id: number): Promise<boolean> {
    const query = 'DELETE FROM faq_categories WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rowCount > 0;
  }

  async getCategories(): Promise<FAQCategory[]> {
    const query = `
      SELECT * FROM faq_categories
      WHERE is_active = true
      ORDER BY sort_order ASC, name ASC
    `;
    const result = await this.db.query(query);
    return result.rows;
  }

  async getCategoryById(id: number): Promise<FAQCategory | null> {
    const query = 'SELECT * FROM faq_categories WHERE id = $1 AND is_active = true';
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  // FAQs
  async createFAQ(faqData: FAQCreateRequest): Promise<FAQ> {
    const query = `
      INSERT INTO faqs (category_id, question, answer, is_popular, is_active, sort_order)
      VALUES ($1, $2, $3, $4, true, $5)
      RETURNING *
    `;
    const values = [
      faqData.category_id,
      faqData.question,
      faqData.answer,
      faqData.is_popular || false,
      faqData.sort_order || 0
    ];
    
    const result = await this.db.query(query, values);
    return result.rows[0];
  }

  async updateFAQ(id: number, faqData: FAQUpdateRequest): Promise<FAQ | null> {
    const setClause = [];
    const values = [];
    let paramIndex = 1;

    if (faqData.category_id !== undefined) {
      setClause.push(`category_id = $${paramIndex++}`);
      values.push(faqData.category_id);
    }
    if (faqData.question !== undefined) {
      setClause.push(`question = $${paramIndex++}`);
      values.push(faqData.question);
    }
    if (faqData.answer !== undefined) {
      setClause.push(`answer = $${paramIndex++}`);
      values.push(faqData.answer);
    }
    if (faqData.is_popular !== undefined) {
      setClause.push(`is_popular = $${paramIndex++}`);
      values.push(faqData.is_popular);
    }
    if (faqData.sort_order !== undefined) {
      setClause.push(`sort_order = $${paramIndex++}`);
      values.push(faqData.sort_order);
    }

    if (setClause.length === 0) {
      return null;
    }

    values.push(id);
    const query = `
      UPDATE faqs
      SET ${setClause.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await this.db.query(query, values);
    return result.rows[0] || null;
  }

  async deleteFAQ(id: number): Promise<boolean> {
    const query = 'UPDATE faqs SET is_active = false WHERE id = $1';
    const result = await this.db.query(query, [id]);
    return result.rowCount > 0;
  }

  async getFAQs(params: FAQQueryParams = {}): Promise<{ data: FAQ[]; total: number }> {
    let query = `
      SELECT f.*, fc.name as category_name, fc.description as category_description
      FROM faqs f
      LEFT JOIN faq_categories fc ON f.category_id = fc.id
      WHERE f.is_active = true
    `;
    const countQuery = `
      SELECT COUNT(*) as total
      FROM faqs f
      WHERE f.is_active = true
    `;
    
    const values = [];
    let paramIndex = 1;

    if (params.category_id) {
      query += ` AND f.category_id = $${paramIndex++}`;
      values.push(params.category_id);
    }
    if (params.is_popular !== undefined) {
      query += ` AND f.is_popular = $${paramIndex++}`;
      values.push(params.is_popular);
    }
    if (params.search) {
      query += ` AND (f.question ILIKE $${paramIndex} OR f.answer ILIKE $${paramIndex})`;
      values.push(`%${params.search}%`);
      paramIndex++;
    }

    query += ' ORDER BY f.sort_order ASC, f.created_at DESC';

    if (params.limit) {
      query += ` LIMIT $${paramIndex++}`;
      values.push(params.limit);
    }
    if (params.offset) {
      query += ` OFFSET $${paramIndex++}`;
      values.push(params.offset);
    }

    const [result, countResult] = await Promise.all([
      this.db.query(query, values),
      this.db.query(countQuery, values.slice(0, paramIndex - (params.limit ? 1 : 0) - (params.offset ? 1 : 0)))
    ]);

    return {
      data: result.rows,
      total: parseInt(countResult.rows[0].total)
    };
  }

  async getPopularFAQs(limit: number = 5): Promise<FAQ[]> {
    const query = `
      SELECT f.*, fc.name as category_name, fc.description as category_description
      FROM faqs f
      LEFT JOIN faq_categories fc ON f.category_id = fc.id
      WHERE f.is_active = true AND f.is_popular = true
      ORDER BY f.view_count DESC, f.sort_order ASC
      LIMIT $1
    `;
    const result = await this.db.query(query, [limit]);
    return result.rows;
  }

  async getFAQById(id: number): Promise<FAQ | null> {
    const query = `
      SELECT f.*, fc.name as category_name, fc.description as category_description
      FROM faqs f
      LEFT JOIN faq_categories fc ON f.category_id = fc.id
      WHERE f.id = $1 AND f.is_active = true
    `;
    const result = await this.db.query(query, [id]);
    return result.rows[0] || null;
  }

  async incrementViewCount(id: number): Promise<void> {
    const query = 'UPDATE faqs SET view_count = view_count + 1 WHERE id = $1';
    await this.db.query(query, [id]);
  }
}