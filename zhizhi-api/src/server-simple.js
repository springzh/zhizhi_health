import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { Pool } from 'pg';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

dotenv.config();

// Database connection
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'zhizhi_health',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Test database connection
pool.connect((err, client, release) => {
  if (err) {
    console.error('Database connection error:', err);
    return;
  }
  console.log('Database connected successfully');
  release();
});

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000', 'http://localhost:3002', 'http://localhost:8080', 'http://127.0.0.1:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Simple in-memory data for testing
const doctors = [
  {
    id: 1,
    name: "张医生",
    title: "主任医师",
    specialty: "口腔种植",
    hospital: "知治口腔医院",
    location: "北京市朝阳区",
    rating: "4.9",
    consultation_count: 1520,
    introduction: "从事口腔临床工作20余年，擅长口腔种植、牙齿矫正等。",
    service_types: ["种植牙", "牙齿矫正", "口腔修复"],
    avatar_url: "https://via.placeholder.com/150",
    is_available: true,
    education: ["北京大学口腔医学院 博士", "哈佛大学牙医学院 访问学者"],
    experience: "20年",
    certifications: ["中华口腔医学会种植专业委员会 委员", "国际口腔种植学会 会员"],
    languages: ["中文", "英文"],
    consultation_price: 500.00
  },
  {
    id: 2,
    name: "李医生",
    title: "副主任医师",
    specialty: "牙齿矫正",
    hospital: "知治口腔医院",
    location: "北京市朝阳区",
    rating: "4.8",
    consultation_count: 1200,
    introduction: "专业从事牙齿矫正工作15年，擅长各类错颌畸形的矫正。",
    service_types: ["牙齿矫正", "隐形矫正", "儿童矫正"],
    avatar_url: "https://via.placeholder.com/150",
    is_available: true,
    education: ["四川大学华西口腔医学院 硕士", "美国正畸学会 认证医师"],
    experience: "15年",
    certifications: ["中华口腔医学会正畸专业委员会 委员", "美国正畸学会 会员"],
    languages: ["中文", "英文"],
    consultation_price: 450.00
  },
  {
    id: 3,
    name: "王医生",
    title: "主治医师",
    specialty: "口腔修复",
    hospital: "知治口腔医院",
    location: "北京市朝阳区",
    rating: "4.7",
    consultation_count: 800,
    introduction: "专注于口腔修复工作，擅长牙齿美容修复、全口义齿修复。",
    service_types: ["牙齿修复", "美容修复", "全口义齿"],
    avatar_url: "https://via.placeholder.com/150",
    is_available: false,
    education: ["第四军医大学口腔医学院 硕士", "中华口腔医学会修复专业委员会 会员"],
    experience: "12年",
    certifications: ["中华口腔医学会 会员", "口腔修复专业认证"],
    languages: ["中文"],
    consultation_price: 380.00
  },
  {
    id: 4,
    name: "刘医生",
    title: "主任医师",
    specialty: "牙周病治疗",
    hospital: "知治口腔医院",
    location: "北京市朝阳区",
    rating: "4.8",
    consultation_count: 950,
    introduction: "专注牙周病治疗18年，擅长各种牙周疾病的系统治疗。",
    service_types: ["牙周治疗", "牙龈护理", "口腔外科"],
    avatar_url: "https://via.placeholder.com/150",
    is_available: true,
    education: ["上海交通大学口腔医学院 博士", "香港大学牙医学院 访问学者"],
    experience: "18年",
    certifications: ["中华口腔医学会牙周病学专业委员会 委员", "国际牙科研究会 会员"],
    languages: ["中文", "英文"],
    consultation_price: 420.00
  },
  {
    id: 5,
    name: "陈医生",
    title: "副主任医师",
    specialty: "儿童牙科",
    hospital: "知治口腔医院",
    location: "北京市朝阳区",
    rating: "4.9",
    consultation_count: 1100,
    introduction: "专业儿童牙科医生，擅长儿童牙齿预防和早期干预治疗。",
    service_types: ["儿童牙科", "预防保健", "早期矫正"],
    avatar_url: "https://via.placeholder.com/150",
    is_available: true
  },
  {
    id: 6,
    name: "赵医生",
    title: "主治医师",
    specialty: "口腔内科",
    hospital: "知治口腔医院",
    location: "北京市朝阳区",
    rating: "4.6",
    consultation_count: 650,
    introduction: "专业口腔内科治疗，擅长牙髓病和根管治疗。",
    service_types: ["根管治疗", "牙体修复", "口腔内科"],
    avatar_url: "https://via.placeholder.com/150",
    is_available: true
  },
  {
    id: 7,
    name: "孙医生",
    title: "主任医师",
    specialty: "口腔颌面外科",
    hospital: "知治口腔医院",
    location: "北京市朝阳区",
    rating: "4.8",
    consultation_count: 880,
    introduction: "从事口腔颌面外科工作16年，擅长复杂口腔外科手术。",
    service_types: ["口腔外科", "颌面手术", "复杂拔牙"],
    avatar_url: "https://via.placeholder.com/150",
    is_available: false
  },
  {
    id: 8,
    name: "周医生",
    title: "副主任医师",
    specialty: "牙齿美学",
    hospital: "知治口腔医院",
    location: "北京市朝阳区",
    rating: "4.9",
    consultation_count: 1350,
    introduction: "专业牙齿美学修复，擅长微笑设计和美容修复。",
    service_types: ["牙齿美学", "微笑设计", "美容修复"],
    avatar_url: "https://via.placeholder.com/150",
    is_available: true
  }
];

const services = [
  {
    id: 1,
    name: "牙齿种植",
    category: 1,
    description: "采用国际先进的种植技术，为您恢复完美的牙齿功能",
    price: 3000,
    duration: 60,
    image_url: "https://via.placeholder.com/300x200",
    features: ["微创种植", "快速恢复", "终身质保"]
  },
  {
    id: 2,
    name: "牙齿矫正",
    category: 1,
    description: "专业的牙齿矫正服务，让您的牙齿整齐美观",
    price: 2000,
    duration: 30,
    image_url: "https://via.placeholder.com/300x200",
    features: ["隐形矫正", "快速矫正", "舒适体验"]
  },
  {
    id: 3,
    name: "洗牙护理",
    category: 1,
    description: "专业的洗牙服务，预防口腔疾病",
    price: 200,
    duration: 30,
    image_url: "https://via.placeholder.com/300x200",
    features: ["超声波洗牙", "抛光护理", "口腔检查"]
  },
  {
    id: 4,
    name: "牙齿美白",
    category: 1,
    description: "先进的牙齿美白技术，让您的牙齿更加美白",
    price: 800,
    duration: 45,
    image_url: "https://via.placeholder.com/300x200",
    features: ["冷光美白", "安全无痛", "效果持久"]
  },
  {
    id: 5,
    name: "细胞存储",
    category: 10,
    description: "专业的细胞存储服务，为您的健康保驾护航",
    price: 10000,
    duration: 0,
    image_url: "https://via.placeholder.com/300x200",
    features: ["专业存储", "安全可靠", "长期保存"]
  },
  {
    id: 6,
    name: "基因检测",
    category: 11,
    description: "全面的基因检测服务，了解您的健康状况",
    price: 5000,
    duration: 0,
    image_url: "https://via.placeholder.com/300x200",
    features: ["全面检测", "准确可靠", "专业解读"]
  },
  {
    id: 7,
    name: "免疫治疗",
    category: 12,
    description: "先进的免疫治疗技术，增强您的免疫力",
    price: 20000,
    duration: 0,
    image_url: "https://via.placeholder.com/300x200",
    features: ["先进技术", "专业治疗", "效果显著"]
  },
  {
    id: 8,
    name: "干细胞治疗",
    category: 13,
    description: "前沿的干细胞治疗技术，治疗多种疾病",
    price: 30000,
    duration: 0,
    image_url: "https://via.placeholder.com/300x200",
    features: ["前沿技术", "安全有效", "专业治疗"]
  }
];

const membershipCards = [
  {
    id: 1,
    name: "基础会员卡",
    description: "适合个人基础口腔护理",
    price: 1200,
    duration: 12,
    benefits: {
      oral_exam: true,
      teeth_cleaning: 2,
      x_ray: 1,
      consultation: true,
      discount: 0.9
    },
    features: ["全面口腔检查", "2次专业洗牙", "口腔拍片检查", "免费咨询", "9折优惠"]
  },
  {
    id: 2,
    name: "家庭会员卡",
    description: "适合3-4人家庭使用",
    price: 2800,
    duration: 12,
    benefits: {
      oral_exam: true,
      teeth_cleaning: 6,
      x_ray: 2,
      consultation: true,
      discount: 0.85,
      family_members: 4
    },
    features: ["家庭成员共享", "6次专业洗牙", "2次拍片检查", "免费咨询", "85折优惠"]
  },
  {
    id: 3,
    name: "尊享会员卡",
    description: "高端服务，尊贵体验",
    price: 5800,
    duration: 12,
    benefits: {
      oral_exam: true,
      teeth_cleaning: 12,
      x_ray: 4,
      consultation: true,
      discount: 0.75,
      priority_service: true,
      free_whitening: 1
    },
    features: ["12次专业洗牙", "4次拍片检查", "优先预约", "免费牙齿美白1次", "75折优惠"]
  }
];

const rightsCards = [
  {
    id: 1,
    name: "基础护工卡",
    type: "nursing",
    description: "提供基础住院期间的护理服务，适合一般护理需求",
    price: 2999,
    duration_years: 1,
    activation_age_min: 18,
    activation_age_max: 80,
    key_features: [
      "8天7夜一对一专业护工",
      "基础生活照料",
      "协助医护人员沟通",
      "病情观察记录"
    ],
    benefits: [
      "专业持证护工服务",
      "24小时不间断护理",
      "个性化护理方案",
      "护理质量保证"
    ],
    target_audience: [
      "术后康复患者",
      "老年人日常护理",
      "慢性病患者"
    ],
    is_available: true
  },
  {
    id: 2,
    name: "标准护工卡",
    type: "nursing",
    description: "提供全面的住院护理服务，包含专业医疗护理技能",
    price: 4999,
    duration_years: 1,
    activation_age_min: 18,
    activation_age_max: 80,
    key_features: [
      "8天7夜一对一专业护工",
      "专业医疗护理技能",
      "康复训练指导",
      "心理疏导支持"
    ],
    benefits: [
      "资深护工团队",
      "医疗级护理标准",
      "康复计划制定",
      "心理健康关注"
    ],
    target_audience: [
      "重大手术患者",
      "需要专业护理的患者",
      "康复期患者"
    ],
    is_available: true
  },
  {
    id: 3,
    name: "尊享护工卡",
    type: "nursing",
    description: "高端定制化护理服务，专家级护工团队",
    price: 8999,
    duration_years: 1,
    activation_age_min: 18,
    activation_age_max: 80,
    key_features: [
      "8天7夜一对一专家护工",
      "个性化定制护理方案",
      "多学科团队协作",
      "全程健康管理"
    ],
    benefits: [
      "专家级护工服务",
      "个性化护理方案",
      "多学科协作支持",
      "健康管理档案"
    ],
    target_audience: [
      "高端医疗需求患者",
      "特殊护理需求",
      "VIP客户"
    ],
    is_available: true
  },
  {
    id: 4,
    name: "基础特药卡",
    type: "special_drug",
    description: "覆盖基础特殊药品费用，提供用药指导服务",
    price: 3999,
    duration_years: 1,
    activation_age_min: 0,
    activation_age_max: 100,
    key_features: [
      "年度100万特药保障",
      "覆盖100+种特药",
      "专业用药指导",
      "药品配送服务"
    ],
    benefits: [
      "高额特药保障",
      "用药安全指导",
      "便捷药品配送",
      "费用直接结算"
    ],
    target_audience: [
      "慢性病患者",
      "需要长期用药患者",
      "中老年人"
    ],
    is_available: true
  },
  {
    id: 5,
    name: "尊享特药卡",
    type: "special_drug",
    description: "全面高额特殊药品保障，包含最新药物和专家咨询",
    price: 9999,
    duration_years: 1,
    activation_age_min: 0,
    activation_age_max: 100,
    key_features: [
      "年度300万特药保障",
      "覆盖300+种特药",
      "新药快速准入",
      "专家用药咨询"
    ],
    benefits: [
      "超高额度保障",
      "最新药物覆盖",
      "专家团队咨询",
      "绿色就医通道"
    ],
    target_audience: [
      "重大疾病患者",
      "需要最新药物治疗",
      "高端医疗保障需求"
    ],
    is_available: true
  }
];

// Helper functions for authentication
const hashPassword = (password, salt = null) => {
  const passwordSalt = salt || crypto.randomBytes(16).toString('hex');
  const hash = crypto.createHash('sha256').update(password + passwordSalt).digest('hex');
  return { hash, salt: passwordSalt };
};

const verifyPassword = (password, hash, salt) => {
  const computedHash = crypto.createHash('sha256').update(password + salt).digest('hex');
  return computedHash === hash;
};

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

// Authentication Routes
app.post('/api/auth/register', async (req, res) => {
  const { email, password, phone, nickname, province, city, district, address } = req.body;
  
  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        timestamp: new Date()
      });
    }
    
    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Email already exists",
        timestamp: new Date()
      });
    }
    
    // Hash password
    const { hash, salt } = hashPassword(password);
    
    // Create user
    const result = await pool.query(
      `INSERT INTO users (email, password_hash, salt, phone, nickname, province, city, district, address, auth_provider, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'email', true)
       RETURNING id, email, phone, nickname, province, city, district, address, created_at`,
      [email, hash, salt, phone, nickname, province, city, district, address]
    );
    
    const user = result.rows[0];
    
    // Log registration
    await pool.query(
      `INSERT INTO user_login_logs (user_id, login_type, login_status, ip_address, user_agent)
       VALUES ($1, 'email', 'success', $2, $3)`,
      [user.id, req.ip, req.get('User-Agent')]
    );
    
    // Generate token
    const token = generateToken({ id: user.id, email: user.email });
    
    res.status(201).json({
      success: true,
      message: "Registration successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          nickname: user.nickname,
          province: user.province,
          city: user.city,
          district: user.district,
          address: user.address
        },
        token
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
      timestamp: new Date()
    });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  try {
    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
        timestamp: new Date()
      });
    }
    
    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND is_active = true',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        timestamp: new Date()
      });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const isValidPassword = verifyPassword(password, user.password_hash, user.salt);
    if (!isValidPassword) {
      // Log failed login
      await pool.query(
        `INSERT INTO user_login_logs (user_id, login_type, login_status, ip_address, user_agent)
         VALUES ($1, 'email', 'failed', $2, $3)`,
        [user.id, req.ip, req.get('User-Agent')]
      );
      
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
        timestamp: new Date()
      });
    }
    
    // Update login count and last login
    await pool.query(
      `UPDATE users SET login_count = COALESCE(login_count, 0) + 1, last_login_at = CURRENT_TIMESTAMP
       WHERE id = $1`,
      [user.id]
    );
    
    // Log successful login
    await pool.query(
      `INSERT INTO user_login_logs (user_id, login_type, login_status, ip_address, user_agent)
       VALUES ($1, 'email', 'success', $2, $3)`,
      [user.id, req.ip, req.get('User-Agent')]
    );
    
    // Generate token
    const token = generateToken({ id: user.id, email: user.email });
    
    res.json({
      success: true,
      message: "Login successful",
      data: {
        user: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          nickname: user.nickname,
          province: user.province,
          city: user.city,
          district: user.district,
          address: user.address,
          last_login_at: user.last_login_at,
          login_count: user.login_count,
          auth_provider: user.auth_provider
        },
        token
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
      timestamp: new Date()
    });
  }
});

// Authentication middleware
const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token, authorization denied",
        timestamp: new Date()
      });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from database
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1 AND is_active = true',
      [decoded.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid",
        timestamp: new Date()
      });
    }
    
    req.user = result.rows[0];
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({
      success: false,
      message: "Token is not valid",
      timestamp: new Date()
    });
  }
};

app.get('/api/auth/me', authenticate, async (req, res) => {
  try {
    const user = req.user;
    
    res.json({
      success: true,
      message: "User info retrieved successfully",
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
        auth_provider: user.auth_provider
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Get user info error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to get user info",
      error: error.message,
      timestamp: new Date()
    });
  }
});

app.put('/api/auth/change-password', authenticate, async (req, res) => {
  const { current_password, new_password } = req.body;
  
  try {
    if (!current_password || !new_password) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
        timestamp: new Date()
      });
    }
    
    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "New password must be at least 6 characters",
        timestamp: new Date()
      });
    }
    
    const user = req.user;
    
    // Verify current password
    const isValidPassword = verifyPassword(current_password, user.password_hash, user.salt);
    if (!isValidPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
        timestamp: new Date()
      });
    }
    
    // Hash new password
    const { hash, salt } = hashPassword(new_password);
    
    // Update password
    await pool.query(
      'UPDATE users SET password_hash = $1, salt = $2 WHERE id = $3',
      [hash, salt, user.id]
    );
    
    res.json({
      success: true,
      message: "Password changed successfully",
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
      timestamp: new Date()
    });
  }
});

app.put('/api/auth/profile', authenticate, async (req, res) => {
  const { nickname, phone, email, province, city, district, address } = req.body;
  
  try {
    const user = req.user;
    
    // Check if email is being changed and already exists
    if (email && email !== user.email) {
      const existingUser = await pool.query(
        'SELECT id FROM users WHERE email = $1 AND id != $2',
        [email, user.id]
      );
      
      if (existingUser.rows.length > 0) {
        return res.status(409).json({
          success: false,
          message: "Email already exists",
          timestamp: new Date()
        });
      }
    }
    
    // Update user profile
    const result = await pool.query(
      `UPDATE users SET 
        nickname = COALESCE($1, nickname),
        phone = COALESCE($2, phone),
        email = COALESCE($3, email),
        province = COALESCE($4, province),
        city = COALESCE($5, city),
        district = COALESCE($6, district),
        address = COALESCE($7, address)
       WHERE id = $8
       RETURNING id, email, phone, nickname, province, city, district, address`,
      [nickname, phone, email, province, city, district, address, user.id]
    );
    
    const updatedUser = result.rows[0];
    
    res.json({
      success: true,
      message: "Profile updated successfully",
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        nickname: updatedUser.nickname,
        phone: updatedUser.phone,
        province: updatedUser.province,
        city: updatedUser.city,
        district: updatedUser.district,
        address: updatedUser.address
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
      timestamp: new Date()
    });
  }
});

// API Routes
app.get('/api/doctors', (req, res) => {
  res.json({
    success: true,
    message: "Doctors retrieved successfully",
    data: doctors,
    timestamp: new Date()
  });
});

app.get('/api/doctors/:id', (req, res) => {
  const doctorId = parseInt(req.params.id);
  const doctor = doctors.find(d => d.id === doctorId);
  
  if (!doctor) {
    return res.status(404).json({
      success: false,
      message: "Doctor not found",
      timestamp: new Date()
    });
  }
  
  res.json({
    success: true,
    message: "Doctor retrieved successfully",
    data: doctor,
    timestamp: new Date()
  });
});

app.post('/api/appointments', async (req, res) => {
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
  
  try {
    // Validate required fields
    if (!doctor_id || !patient_name || !patient_phone || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
        timestamp: new Date()
      });
    }
    
    // Check if doctor exists
    const doctor = doctors.find(d => d.id === parseInt(doctor_id));
    if (!doctor) {
      return res.status(404).json({
        success: false,
        message: "Doctor not found",
        timestamp: new Date()
      });
    }
    
    // Check if time slot is available
    const availabilityCheck = await pool.query(
      `SELECT COUNT(*) as count FROM appointments 
       WHERE doctor_id = $1 
       AND appointment_date = $2 
       AND appointment_time = $3
       AND status != 'cancelled'`,
      [doctor_id, appointment_date, appointment_time]
    );
    
    if (parseInt(availabilityCheck.rows[0].count) > 0) {
      return res.status(409).json({
        success: false,
        message: "Time slot is already booked",
        timestamp: new Date()
      });
    }
    
    // Save appointment to database
    const params = [
      parseInt(doctor_id), 
      patient_name, 
      patient_phone, 
      service_type, 
      appointment_date, 
      appointment_time, 
      symptoms
    ];
    console.log('Insert parameters:', params);
    console.log('Parameters length:', params.length);
    
    const result = await pool.query('INSERT INTO appointments (doctor_id, patient_name, patient_phone, service_type, appointment_date, appointment_time, symptoms) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *', params);
    
    const appointment = result.rows[0];
    
    res.status(201).json({
      success: true,
      message: "Appointment created successfully",
      data: {
        id: appointment.id,
        doctor_id: appointment.doctor_id,
        patient_name: appointment.patient_name,
        patient_phone: appointment.patient_phone,
        patient_email: appointment.patient_email,
        service_type: appointment.service_type,
        appointment_date: appointment.appointment_date,
        appointment_time: appointment.appointment_time,
        symptoms: appointment.symptoms,
        status: appointment.status,
        created_at: appointment.created_at
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating appointment:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail
    });
    res.status(500).json({
      success: false,
      message: "Failed to create appointment",
      error: error.message,
      timestamp: new Date()
    });
  }
});

app.get('/api/services', (req, res) => {
  const category = req.query.category;
  let filteredServices = services;
  
  if (category) {
    filteredServices = services.filter(service => service.category === parseInt(category));
  }
  
  res.json({
    success: true,
    message: "Services retrieved successfully",
    data: filteredServices,
    timestamp: new Date()
  });
});

app.get('/api/memberships', (req, res) => {
  res.json({
    success: true,
    message: "Membership cards retrieved successfully",
    data: membershipCards,
    timestamp: new Date()
  });
});

// Rights Cards Routes
app.get('/api/rights-cards/cards/available', (req, res) => {
  const availableCards = rightsCards.filter(card => card.is_available);
  res.json({
    success: true,
    message: "Available rights cards retrieved successfully",
    data: availableCards,
    timestamp: new Date()
  });
});

app.get('/api/rights-cards/cards', (req, res) => {
  const { type, is_available } = req.query;
  let filteredCards = rightsCards;
  
  if (type) {
    filteredCards = filteredCards.filter(card => card.type === type);
  }
  
  if (is_available !== undefined) {
    const available = is_available === 'true';
    filteredCards = filteredCards.filter(card => card.is_available === available);
  }
  
  res.json({
    success: true,
    message: "Rights cards retrieved successfully",
    data: filteredCards,
    timestamp: new Date()
  });
});

app.get('/api/rights-cards/cards/:id', (req, res) => {
  const cardId = parseInt(req.params.id);
  const card = rightsCards.find(c => c.id === cardId);
  
  if (!card) {
    return res.status(404).json({
      success: false,
      message: "Rights card not found",
      timestamp: new Date()
    });
  }
  
  res.json({
    success: true,
    message: "Rights card retrieved successfully",
    data: card,
    timestamp: new Date()
  });
});

app.get('/api/rights-cards/cards/type/:type', (req, res) => {
  const { type } = req.params;
  
  if (!['nursing', 'special_drug', 'other'].includes(type)) {
    return res.status(400).json({
      success: false,
      message: "Invalid card type",
      timestamp: new Date()
    });
  }
  
  const cards = rightsCards.filter(card => card.type === type);
  
  res.json({
    success: true,
    message: `Available ${type} cards retrieved successfully`,
    data: cards,
    timestamp: new Date()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date()
  });
});

// Optional authentication middleware for consultations
const optionalAuth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Get user from database
      const result = await pool.query(
        'SELECT * FROM users WHERE id = $1 AND is_active = true',
        [decoded.id]
      );
      
      if (result.rows.length > 0) {
        req.user = result.rows[0];
      }
    }
    
    next();
  } catch (error) {
    // Optional authentication, continue even if token is invalid
    next();
  }
};

// Consultation Routes
app.post('/api/consultations', optionalAuth, async (req, res) => {
  const {
    title,
    content,
    category,
    priority,
    doctor_id,
    guest_name,
    guest_phone,
    guest_email,
    is_public
  } = req.body;
  
  try {
    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields: title, content, category",
        timestamp: new Date()
      });
    }
    
    // Validate category
    const validCategories = ['general', 'dental', 'cell', 'membership', 'appointment'];
    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category. Must be one of: " + validCategories.join(', '),
        timestamp: new Date()
      });
    }
    
    // Validate priority if provided
    const validPriorities = ['low', 'normal', 'high', 'urgent'];
    if (priority && !validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: "Invalid priority. Must be one of: " + validPriorities.join(', '),
        timestamp: new Date()
      });
    }
    
    // Save consultation to database
    const user_id = req.user ? req.user.id : null;
    
    console.log('Inserting consultation with data:', {
      title, content, category, priority, doctor_id,
      guest_name, guest_phone, guest_email, is_public, user_id
    });
    
    const result = await pool.query(
      `INSERT INTO consultations (
        title, content, category, priority, doctor_id, user_id,
        guest_name, guest_phone, guest_email, is_public, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending') 
      RETURNING *`,
      [
        title, content, category, priority || 'normal', 
        doctor_id ? parseInt(doctor_id) : null,
        user_id,
        guest_name, guest_phone, guest_email, is_public || false
      ]
    );
    
    const consultation = result.rows[0];
    
    res.status(201).json({
      success: true,
      message: "Consultation created successfully",
      data: {
        id: consultation.id,
        title: consultation.title,
        content: consultation.content,
        category: consultation.category,
        priority: consultation.priority,
        doctor_id: consultation.doctor_id,
        guest_name: consultation.guest_name,
        guest_phone: consultation.guest_phone,
        guest_email: consultation.guest_email,
        is_public: consultation.is_public,
        status: consultation.status,
        created_at: consultation.created_at
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error creating consultation:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      code: error.code,
      detail: error.detail
    });
    res.status(500).json({
      success: false,
      message: "Failed to create consultation",
      error: error.message,
      timestamp: new Date()
    });
  }
});

app.get('/api/consultations/my-consultations', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // For now, return empty consultations since we don't have user authentication
    // In a real app, you would get the user ID from the session/token
    const result = await pool.query(
      `SELECT c.*, COUNT(cr.id) as reply_count, COUNT(ca.id) as attachment_count
       FROM consultations c
       LEFT JOIN consultation_replies cr ON c.id = cr.consultation_id
       LEFT JOIN consultation_attachments ca ON c.id = ca.consultation_id
       WHERE c.guest_email IS NOT NULL
       GROUP BY c.id
       ORDER BY c.created_at DESC
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );
    
    const countResult = await pool.query(
      'SELECT COUNT(*) FROM consultations WHERE guest_email IS NOT NULL'
    );
    
    const consultations = result.rows;
    const total = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(total / limit);
    
    res.json({
      success: true,
      message: "Consultations retrieved successfully",
      data: {
        consultations,
        pagination: {
          page,
          limit,
          total,
          totalPages
        }
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error retrieving consultations:', error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve consultations",
      error: error.message,
      timestamp: new Date()
    });
  }
});

app.get('/api/consultations/:id', async (req, res) => {
  try {
    const consultationId = parseInt(req.params.id);
    
    const result = await pool.query(
      `SELECT c.*, 
        COUNT(cr.id) as reply_count,
        COUNT(ca.id) as attachment_count,
        COUNT(DISTINCT cv.id) as view_count
       FROM consultations c
       LEFT JOIN consultation_replies cr ON c.id = cr.consultation_id
       LEFT JOIN consultation_attachments ca ON c.id = ca.consultation_id
       LEFT JOIN consultation_views cv ON c.id = cv.consultation_id
       WHERE c.id = $1
       GROUP BY c.id`,
      [consultationId]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Consultation not found",
        timestamp: new Date()
      });
    }
    
    const consultation = result.rows[0];
    
    // Get replies
    const repliesResult = await pool.query(
      `SELECT * FROM consultation_replies 
       WHERE consultation_id = $1 
       ORDER BY created_at ASC`,
      [consultationId]
    );
    
    // Get attachments
    const attachmentsResult = await pool.query(
      `SELECT * FROM consultation_attachments 
       WHERE consultation_id = $1 
       ORDER BY uploaded_at ASC`,
      [consultationId]
    );
    
    // Record view (simplified - just increment counter)
    await pool.query(
      'UPDATE consultations SET view_count = COALESCE(view_count, 0) + 1 WHERE id = $1',
      [consultationId]
    );
    
    res.json({
      success: true,
      message: "Consultation retrieved successfully",
      data: {
        ...consultation,
        replies: repliesResult.rows,
        attachments: attachmentsResult.rows
      },
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error retrieving consultation:', error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve consultation",
      error: error.message,
      timestamp: new Date()
    });
  }
});

// FAQ Endpoints
const faqCategories = [
  { id: 1, name: "就诊须知", description: "关于就诊流程和注意事项的常见问题" },
  { id: 2, name: "费用问题", description: "关于诊疗费用、医保报销等费用相关问题" },
  { id: 3, name: "治疗相关", description: "关于治疗方案、治疗过程等技术性问题" },
  { id: 4, name: "预约挂号", description: "关于预约挂号、改期取消等操作问题" },
  { id: 5, name: "会员服务", description: "关于会员权益、服务套餐等问题" }
];

const faqs = [
  {
    id: 1,
    category_id: 1,
    question: "初次就诊需要带什么证件？",
    answer: "初次就诊请携带身份证、医保卡（如有）、既往病历资料。建议提前预约并按时到达医院。",
    is_popular: true,
    is_active: true,
    sort_order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    category_id: 1,
    question: "就诊流程是怎样的？",
    answer: "1. 预约挂号 → 2. 按时到院 → 3. 前台登记 → 4. 等候就诊 → 5. 医生诊疗 → 6. 缴费取药 → 7. 预约复诊",
    is_popular: true,
    is_active: true,
    sort_order: 2,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 3,
    category_id: 2,
    question: "诊疗费用如何计算？",
    answer: "诊疗费用根据具体项目和治疗方案确定。我们会在治疗前提供详细费用清单，包括检查费、治疗费、材料费等。支持医保报销和自费支付。",
    is_popular: false,
    is_active: true,
    sort_order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 4,
    category_id: 3,
    question: "种植牙需要多长时间？",
    answer: "种植牙治疗通常需要3-6个月完成，具体时间因个人情况而异。包括：术前检查（1周）、种植体植入（1-2小时）、愈合期（3-4个月）、牙冠修复（2-3周）。",
    is_popular: true,
    is_active: true,
    sort_order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  },
  {
    id: 5,
    category_id: 4,
    question: "如何取消预约？",
    answer: "请提前24小时通过微信小程序、APP或电话取消预约。临时取消可能会影响您的信用记录。如需改期，请先取消原预约后重新预约。",
    is_popular: false,
    is_active: true,
    sort_order: 1,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z"
  }
];

// FAQ Categories endpoint
app.get('/api/faq/categories', (req, res) => {
  res.json({
    success: true,
    message: "FAQ categories retrieved successfully",
    data: faqCategories,
    timestamp: new Date().toISOString()
  });
});

// FAQ Popular endpoint
app.get('/api/faq/popular', (req, res) => {
  const popularFaqs = faqs.filter(faq => faq.is_popular && faq.is_active);
  res.json({
    success: true,
    message: "Popular FAQs retrieved successfully",
    data: popularFaqs,
    timestamp: new Date().toISOString()
  });
});

// FAQ List endpoint
app.get('/api/faq', (req, res) => {
  const { category_id, limit = 10, offset = 0 } = req.query;
  let filteredFaqs = faqs.filter(faq => faq.is_active);
  
  if (category_id) {
    filteredFaqs = filteredFaqs.filter(faq => faq.category_id === parseInt(category_id));
  }
  
  const paginatedFaqs = filteredFaqs.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
  
  res.json({
    success: true,
    message: "FAQs retrieved successfully",
    data: paginatedFaqs,
    pagination: {
      total: filteredFaqs.length,
      limit: parseInt(limit),
      offset: parseInt(offset),
      has_more: parseInt(offset) + parseInt(limit) < filteredFaqs.length
    },
    timestamp: new Date().toISOString()
  });
});

// FAQ Detail endpoint
app.get('/api/faq/:id', (req, res) => {
  const faq = faqs.find(f => f.id === parseInt(req.params.id) && f.is_active);
  
  if (!faq) {
    return res.status(404).json({
      success: false,
      message: "FAQ not found",
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    message: "FAQ retrieved successfully",
    data: faq,
    timestamp: new Date().toISOString()
  });
});

// Root route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: "知治健康 API Server",
    version: "1.0.0",
    timestamp: new Date(),
    endpoints: {
      health: "/api/health",
      doctors: "/api/doctors",
      services: "/api/services",
      memberships: "/api/memberships",
      "rights-cards": "/api/rights-cards",
      "rights-cards-available": "/api/rights-cards/cards/available",
      consultations: "/api/consultations",
      "my-consultations": "/api/consultations/my-consultations",
      "consultation-detail": "/api/consultations/:id",
      "faq-categories": "/api/faq/categories",
      "faq-popular": "/api/faq/popular",
      "faq": "/api/faq",
      "faq-detail": "/api/faq/:id"
    }
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api`);
});

export default app;