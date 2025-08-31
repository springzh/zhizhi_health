import { body, param, query } from 'express-validator';

// 用户验证规则
export const userValidation = {
  // 创建用户
  create: [
    body('openid')
      .optional()
      .isString()
      .withMessage('OpenID must be a string'),
    body('unionid')
      .optional()
      .isString()
      .withMessage('UnionID must be a string'),
    body('nickname')
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage('Nickname must be between 1 and 50 characters'),
    body('avatar_url')
      .optional()
      .isURL()
      .withMessage('Avatar URL must be a valid URL'),
    body('phone')
      .optional()
      .matches(/^1[3-9]\d{9}$/)
      .withMessage('Phone number must be a valid Chinese mobile number'),
  ],

  // 更新用户
  update: [
    body('nickname')
      .optional()
      .isLength({ min: 1, max: 50 })
      .withMessage('Nickname must be between 1 and 50 characters'),
    body('avatar_url')
      .optional()
      .isURL()
      .withMessage('Avatar URL must be a valid URL'),
    body('phone')
      .optional()
      .matches(/^1[3-9]\d{9}$/)
      .withMessage('Phone number must be a valid Chinese mobile number'),
  ],
};

// 医生验证规则
export const doctorValidation = {
  // 创建医生
  create: [
    body('name')
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('title')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Title must be between 1 and 100 characters'),
    body('specialty')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Specialty must be between 1 and 200 characters'),
    body('hospital')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Hospital must be between 1 and 200 characters'),
    body('location')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Location must be between 1 and 200 characters'),
    body('avatar_url')
      .optional()
      .isURL()
      .withMessage('Avatar URL must be a valid URL'),
    body('introduction')
      .optional()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Introduction must be between 1 and 2000 characters'),
    body('rating')
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage('Rating must be between 0 and 5'),
    body('consultation_count')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Consultation count must be a positive integer'),
    body('is_available')
      .optional()
      .isBoolean()
      .withMessage('Available status must be a boolean'),
    body('service_types')
      .optional()
      .isArray()
      .withMessage('Service types must be an array'),
  ],

  // 更新医生
  update: [
    body('name')
      .optional()
      .isLength({ min: 2, max: 50 })
      .withMessage('Name must be between 2 and 50 characters'),
    body('title')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Title must be between 1 and 100 characters'),
    body('specialty')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Specialty must be between 1 and 200 characters'),
    body('hospital')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Hospital must be between 1 and 200 characters'),
    body('location')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Location must be between 1 and 200 characters'),
    body('avatar_url')
      .optional()
      .isURL()
      .withMessage('Avatar URL must be a valid URL'),
    body('introduction')
      .optional()
      .isLength({ min: 1, max: 2000 })
      .withMessage('Introduction must be between 1 and 2000 characters'),
    body('rating')
      .optional()
      .isFloat({ min: 0, max: 5 })
      .withMessage('Rating must be between 0 and 5'),
    body('consultation_count')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Consultation count must be a positive integer'),
    body('is_available')
      .optional()
      .isBoolean()
      .withMessage('Available status must be a boolean'),
    body('service_types')
      .optional()
      .isArray()
      .withMessage('Service types must be an array'),
  ],

  // 查询参数
  query: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('location')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Location must be between 1 and 200 characters'),
    query('specialty')
      .optional()
      .isLength({ min: 1, max: 200 })
      .withMessage('Specialty must be between 1 and 200 characters'),
    query('search')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Search term must be between 1 and 100 characters'),
    query('is_available')
      .optional()
      .isBoolean()
      .withMessage('Available status must be a boolean'),
    query('sort_by')
      .optional()
      .isIn(['name', 'rating', 'consultation_count', 'created_at'])
      .withMessage('Sort by must be one of: name, rating, consultation_count, created_at'),
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be either asc or desc'),
  ],

  // ID参数
  id: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID must be a positive integer'),
  ],
};

// 预约验证规则
export const appointmentValidation = {
  // 创建预约
  create: [
    body('doctor_id')
      .isInt({ min: 1 })
      .withMessage('Doctor ID must be a positive integer'),
    body('service_type')
      .optional()
      .isLength({ min: 1, max: 100 })
      .withMessage('Service type must be between 1 and 100 characters'),
    body('patient_name')
      .isLength({ min: 2, max: 50 })
      .withMessage('Patient name must be between 2 and 50 characters'),
    body('patient_phone')
      .matches(/^1[3-9]\d{9}$/)
      .withMessage('Patient phone must be a valid Chinese mobile number'),
    body('patient_age')
      .optional()
      .isInt({ min: 0, max: 120 })
      .withMessage('Patient age must be between 0 and 120'),
    body('patient_gender')
      .optional()
      .isIn(['male', 'female', 'other'])
      .withMessage('Patient gender must be male, female, or other'),
    body('appointment_date')
      .isISO8601()
      .withMessage('Appointment date must be a valid ISO8601 date'),
    body('appointment_time')
      .matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/)
      .withMessage('Appointment time must be in HH:MM format'),
    body('symptoms')
      .optional()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Symptoms must be between 1 and 1000 characters'),
    body('notes')
      .optional()
      .isLength({ min: 1, max: 500 })
      .withMessage('Notes must be between 1 and 500 characters'),
    body('membership_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Membership ID must be a positive integer'),
  ],

  // 更新预约
  update: [
    body('status')
      .optional()
      .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
      .withMessage('Status must be one of: pending, confirmed, completed, cancelled'),
    body('notes')
      .optional()
      .isLength({ min: 1, max: 500 })
      .withMessage('Notes must be between 1 and 500 characters'),
  ],

  // 查询参数
  query: [
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
    query('user_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('User ID must be a positive integer'),
    query('doctor_id')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Doctor ID must be a positive integer'),
    query('status')
      .optional()
      .isIn(['pending', 'confirmed', 'completed', 'cancelled'])
      .withMessage('Status must be one of: pending, confirmed, completed, cancelled'),
    query('start_date')
      .optional()
      .isISO8601()
      .withMessage('Start date must be a valid ISO8601 date'),
    query('end_date')
      .optional()
      .isISO8601()
      .withMessage('End date must be a valid ISO8601 date'),
    query('sort_by')
      .optional()
      .isIn(['appointment_date', 'created_at'])
      .withMessage('Sort by must be one of: appointment_date, created_at'),
    query('order')
      .optional()
      .isIn(['asc', 'desc'])
      .withMessage('Order must be either asc or desc'),
  ],

  // ID参数
  id: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID must be a positive integer'),
  ],
};

// 权益卡验证规则
export const membershipValidation = {
  // 创建权益卡
  create: [
    body('name')
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('price')
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('duration_days')
      .isInt({ min: 1 })
      .withMessage('Duration days must be a positive integer'),
    body('benefits')
      .isObject()
      .withMessage('Benefits must be an object'),
    body('description')
      .optional()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Description must be between 1 and 1000 characters'),
  ],

  // 更新权益卡
  update: [
    body('name')
      .optional()
      .isLength({ min: 2, max: 100 })
      .withMessage('Name must be between 2 and 100 characters'),
    body('price')
      .optional()
      .isFloat({ min: 0 })
      .withMessage('Price must be a positive number'),
    body('duration_days')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Duration days must be a positive integer'),
    body('benefits')
      .optional()
      .isObject()
      .withMessage('Benefits must be an object'),
    body('description')
      .optional()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Description must be between 1 and 1000 characters'),
    body('is_available')
      .optional()
      .isBoolean()
      .withMessage('Available status must be a boolean'),
  ],

  // ID参数
  id: [
    param('id')
      .isInt({ min: 1 })
      .withMessage('ID must be a positive integer'),
  ],
};

// 通用分页验证
export const paginationValidation = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sort_by')
    .optional()
    .isString()
    .withMessage('Sort by must be a string'),
  query('order')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be either asc or desc'),
];

// 搜索验证
export const searchValidation = [
  query('keyword')
    .optional()
    .isLength({ min: 1, max: 100 })
    .withMessage('Search keyword must be between 1 and 100 characters'),
];