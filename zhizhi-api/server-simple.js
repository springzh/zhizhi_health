import express from 'express';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// CORS中间件
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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

// 辅助函数：生成盐值
function generateSalt() {
  return crypto.randomBytes(16).toString('hex');
}

// 辅助函数：密码加密
function hashPassword(password, salt) {
  return crypto.createHash('sha256').update(password + salt).digest('hex');
}

// 辅助函数：验证密码
function verifyPassword(password, salt, hash) {
  return hashPassword(password, salt) === hash;
}

// 辅助函数：生成JWT令牌
function generateToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
}

// 辅助函数：认证中间件
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token, authorization denied',
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // 从数据库获取用户信息
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1 AND is_active = true', [decoded.id]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Token is not valid',
      });
    }
    
    req.user = userResult.rows[0];
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      message: 'Token is not valid',
    });
  }
};

// 用户注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, phone, nickname, province, city, district, address } = req.body;
    
    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码为必填项',
      });
    }
    
    // 检查邮箱是否已存在
    const existingUser = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: '邮箱已存在',
      });
    }
    
    // 生成密码哈希
    const salt = generateSalt();
    const password_hash = hashPassword(password, salt);
    
    // 创建用户
    const result = await pool.query(`
      INSERT INTO users (email, password_hash, salt, phone, nickname, province, city, district, address, auth_provider, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'email', true)
      RETURNING *
    `, [email, password_hash, salt, phone, nickname, province, city, district, address]);
    
    const user = result.rows[0];
    
    // 记录登录日志
    await pool.query(`
      INSERT INTO user_login_logs (user_id, login_type, ip_address, user_agent, login_status)
      VALUES ($1, 'email', $2, $3, 'success')
    `, [user.id, req.ip, req.get('User-Agent')]);
    
    // 生成JWT令牌
    const token = generateToken({ id: user.id, email: user.email });
    
    res.status(201).json({
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          phone: user.phone,
          province: user.province,
          city: user.city,
          district: user.district,
          address: user.address,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: '注册失败',
      error: error.message,
    });
  }
});

// 用户登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // 验证必填字段
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: '邮箱和密码为必填项',
      });
    }
    
    // 查找用户
    const userResult = await pool.query('SELECT * FROM users WHERE email = $1 AND is_active = true', [email]);
    if (userResult.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误',
      });
    }
    
    const user = userResult.rows[0];
    
    // 验证密码
    const isPasswordValid = verifyPassword(password, user.salt, user.password_hash);
    if (!isPasswordValid) {
      // 记录登录失败日志
      await pool.query(`
        INSERT INTO user_login_logs (user_id, login_type, ip_address, user_agent, login_status)
        VALUES ($1, 'email', $2, $3, 'failed')
      `, [user.id, req.ip, req.get('User-Agent')]);
      
      return res.status(401).json({
        success: false,
        message: '邮箱或密码错误',
      });
    }
    
    // 更新登录信息
    await pool.query(`
      UPDATE users 
      SET last_login_at = CURRENT_TIMESTAMP, login_count = login_count + 1 
      WHERE id = $1
    `, [user.id]);
    
    // 记录登录成功日志
    await pool.query(`
      INSERT INTO user_login_logs (user_id, login_type, ip_address, user_agent, login_status)
      VALUES ($1, 'email', $2, $3, 'success')
    `, [user.id, req.ip, req.get('User-Agent')]);
    
    // 生成JWT令牌
    const token = generateToken({ id: user.id, email: user.email });
    
    res.json({
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          email: user.email,
          nickname: user.nickname,
          phone: user.phone,
          province: user.province,
          city: user.city,
          district: user.district,
          address: user.address,
        },
        token,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: '登录失败',
      error: error.message,
    });
  }
});

// 获取当前用户信息
app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      message: '获取用户信息成功',
      data: {
        id: user.id,
        email: user.email,
        nickname: user.nickname,
        phone: user.phone,
        province: user.province,
        city: user.city,
        district: user.district,
        address: user.address,
        last_login_at: user.last_login_at,
        login_count: user.login_count,
        auth_provider: user.auth_provider,
      },
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      success: false,
      message: '获取用户信息失败',
      error: error.message,
    });
  }
});

// 修改密码
app.put('/api/auth/change-password', authenticate, async (req, res) => {
  try {
    const { current_password, new_password } = req.body;
    const user = req.user;
    
    // 验证当前密码
    const isCurrentPasswordValid = verifyPassword(current_password, user.salt, user.password_hash);
    if (!isCurrentPasswordValid) {
      return res.status(400).json({
        success: false,
        message: '当前密码错误',
      });
    }
    
    // 生成新密码
    const salt = generateSalt();
    const password_hash = hashPassword(new_password, salt);
    
    // 更新密码
    await pool.query(`
      UPDATE users 
      SET password_hash = $1, salt = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $3
    `, [password_hash, salt, user.id]);
    
    res.json({
      success: true,
      message: '密码修改成功',
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: '密码修改失败',
      error: error.message,
    });
  }
});

// 更新用户信息
app.put('/api/auth/profile', authenticate, async (req, res) => {
  try {
    const { nickname, phone, province, city, district, address } = req.body;
    const user = req.user;
    
    const result = await pool.query(`
      UPDATE users 
      SET nickname = COALESCE($1, nickname),
          phone = COALESCE($2, phone),
          province = COALESCE($3, province),
          city = COALESCE($4, city),
          district = COALESCE($5, district),
          address = COALESCE($6, address),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING *
    `, [nickname, phone, province, city, district, address, user.id]);
    
    const updatedUser = result.rows[0];
    
    res.json({
      success: true,
      message: '用户信息更新成功',
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        nickname: updatedUser.nickname,
        phone: updatedUser.phone,
        province: updatedUser.province,
        city: updatedUser.city,
        district: updatedUser.district,
        address: updatedUser.address,
      },
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: '用户信息更新失败',
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

// 获取健康权益卡列表
app.get('/api/rights-cards/cards', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rights_cards ORDER BY sort_order ASC');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rights cards',
      error: error.message,
    });
  }
});

// 获取可用的健康权益卡
app.get('/api/rights-cards/cards/available', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM rights_cards WHERE is_available = true ORDER BY sort_order ASC');
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch available rights cards',
      error: error.message,
    });
  }
});

// 获取单个健康权益卡详情
app.get('/api/rights-cards/cards/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM rights_cards WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rights card not found',
      });
    }
    
    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rights card',
      error: error.message,
    });
  }
});

// 按类型获取健康权益卡
app.get('/api/rights-cards/cards/type/:type', async (req, res) => {
  try {
    const { type } = req.params;
    const result = await pool.query('SELECT * FROM rights_cards WHERE type = $1 AND is_available = true ORDER BY sort_order ASC', [type]);
    
    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch rights cards by type',
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