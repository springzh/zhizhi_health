import express from 'express';
import { Pool } from 'pg';

const app = express();
const PORT = process.env.PORT || 3001;

// 中间件
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 数据库连接
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  database: process.env.DB_NAME || 'zhizhi_health',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  ssl: false,
});

// 健康检查
app.get('/api/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({
      success: true,
      message: 'API is running',
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Database connection failed',
      error: error.message,
    });
  }
});

// 获取医生列表
app.get('/api/doctors', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM doctors ORDER BY rating DESC');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctors',
      error: error.message,
    });
  }
});

// 获取单个医生详情
app.get('/api/doctors/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM doctors WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Doctor not found',
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch doctor',
      error: error.message,
    });
  }
});

// 创建预约
app.post('/api/appointments', async (req, res) => {
  try {
    const {
      doctor_id,
      patient_name,
      patient_phone,
      patient_email,
      service_type,
      appointment_date,
      appointment_time,
      symptoms
    } = req.body;
    
    // 验证必填字段
    if (!doctor_id || !patient_name || !patient_phone || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }
    
    // 检查时间段是否可用
    const existingAppointment = await pool.query(
      'SELECT * FROM appointments WHERE doctor_id = $1 AND appointment_date = $2 AND appointment_time = $3 AND status != $4',
      [doctor_id, appointment_date, appointment_time, 'cancelled']
    );
    
    if (existingAppointment.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Time slot is already booked',
      });
    }
    
    // 创建预约
    const result = await pool.query(
      `INSERT INTO appointments (doctor_id, patient_name, patient_phone, service_type, appointment_date, appointment_time, symptoms, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [doctor_id, patient_name, patient_phone, service_type, appointment_date, appointment_time, symptoms]
    );
    
    res.status(201).json({
      success: true,
      message: 'Appointment created successfully',
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create appointment',
      error: error.message,
    });
  }
});

// 获取服务列表
app.get('/api/services', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM services ORDER BY id');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch services',
      error: error.message,
    });
  }
});

// 获取会员卡列表
app.get('/api/membership', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM membership_cards ORDER BY price');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch membership cards',
      error: error.message,
    });
  }
});

// FAQ相关API
// 获取FAQ分类
app.get('/api/faq/categories', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM faq_categories WHERE is_active = true ORDER BY sort_order ASC');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ categories',
      error: error.message,
    });
  }
});

// 获取热门FAQ
app.get('/api/faq/popular', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const result = await pool.query(`
      SELECT f.*, fc.name as category_name, fc.description as category_description
      FROM faqs f
      LEFT JOIN faq_categories fc ON f.category_id = fc.id
      WHERE f.is_active = true AND f.is_popular = true
      ORDER BY f.view_count DESC, f.sort_order ASC
      LIMIT $1
    `, [limit]);
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular FAQs',
      error: error.message,
    });
  }
});

// 获取所有FAQ
app.get('/api/faq', async (req, res) => {
  try {
    const { category_id, search, limit = 50, offset = 0 } = req.query;
    let query = `
      SELECT f.*, fc.name as category_name, fc.description as category_description
      FROM faqs f
      LEFT JOIN faq_categories fc ON f.category_id = fc.id
      WHERE f.is_active = true
    `;
    const params = [];
    let paramIndex = 1;

    if (category_id) {
      query += ` AND f.category_id = $${paramIndex++}`;
      params.push(category_id);
    }

    if (search) {
      query += ` AND (f.question ILIKE $${paramIndex} OR f.answer ILIKE $${paramIndex})`;
      params.push(`%${search}%`);
      paramIndex++;
    }

    query += ' ORDER BY f.sort_order ASC, f.created_at DESC';

    if (limit) {
      query += ` LIMIT $${paramIndex++}`;
      params.push(parseInt(limit));
    }

    if (offset) {
      query += ` OFFSET $${paramIndex++}`;
      params.push(parseInt(offset));
    }

    const result = await pool.query(query, params);
    
    // 获取总数
    let countQuery = 'SELECT COUNT(*) as total FROM faqs WHERE is_active = true';
    const countParams = [];
    let countParamIndex = 1;

    if (category_id) {
      countQuery += ` AND category_id = $${countParamIndex++}`;
      countParams.push(category_id);
    }

    if (search) {
      countQuery += ` AND (question ILIKE $${countParamIndex} OR answer ILIKE $${countParamIndex})`;
      countParams.push(`%${search}%`);
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: {
        data: result.rows,
        total: parseInt(countResult.rows[0].total),
        page: Math.floor(parseInt(offset) / parseInt(limit)) + 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQs',
      error: error.message,
    });
  }
});

// 获取单个FAQ详情
app.get('/api/faq/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(`
      SELECT f.*, fc.name as category_name, fc.description as category_description
      FROM faqs f
      LEFT JOIN faq_categories fc ON f.category_id = fc.id
      WHERE f.id = $1 AND f.is_active = true
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'FAQ not found',
      });
    }

    // 增加浏览次数
    await pool.query('UPDATE faqs SET view_count = view_count + 1 WHERE id = $1', [id]);

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch FAQ',
      error: error.message,
    });
  }
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`👨‍⚕️ Doctors: http://localhost:${PORT}/api/doctors`);
  console.log(`🏥 Services: http://localhost:${PORT}/api/services`);
  console.log(`💳 Membership: http://localhost:${PORT}/api/membership`);
  console.log(`❓ FAQ: http://localhost:${PORT}/api/faq`);
});