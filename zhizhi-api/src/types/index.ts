// 用户相关类型
export interface User {
  id: number;
  openid?: string;
  unionid?: string;
  nickname?: string;
  avatar_url?: string;
  phone?: string;
  role?: 'user' | 'admin' | 'doctor';
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRequest {
  openid?: string;
  unionid?: string;
  nickname?: string;
  avatar_url?: string;
  phone?: string;
}

export interface UpdateUserRequest {
  nickname?: string;
  avatar_url?: string;
  phone?: string;
}

// 医生相关类型
export interface Doctor {
  id: number;
  name: string;
  title?: string;
  specialty?: string;
  hospital?: string;
  location?: string;
  avatar_url?: string;
  introduction?: string;
  rating: number;
  consultation_count: number;
  is_available: boolean;
  service_types: string[];
  education: string[];
  experience: string;
  certifications: string[];
  languages: string[];
  consultation_price: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateDoctorRequest {
  name: string;
  title?: string;
  specialty?: string;
  hospital?: string;
  location?: string;
  avatar_url?: string;
  introduction?: string;
  service_types?: string[];
  education?: string[];
  experience?: string;
  certifications?: string[];
  languages?: string[];
  consultation_price?: number;
}

export interface UpdateDoctorRequest {
  name?: string;
  title?: string;
  specialty?: string;
  hospital?: string;
  location?: string;
  avatar_url?: string;
  introduction?: string;
  rating?: number;
  consultation_count?: number;
  is_available?: boolean;
  service_types?: string[];
  education?: string[];
  experience?: string;
  certifications?: string[];
  languages?: string[];
  consultation_price?: number;
}

export interface DoctorQueryParams {
  page?: number;
  limit?: number;
  location?: string;
  specialty?: string;
  search?: string;
  is_available?: boolean;
  sort_by?: 'name' | 'rating' | 'consultation_count' | 'created_at';
  order?: 'asc' | 'desc';
}

// 服务分类相关类型
export interface ServiceCategory {
  id: number;
  name: string;
  type: 'dental' | 'cell' | 'membership';
  description?: string;
  icon?: string;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// 服务项目相关类型
export interface Service {
  id: number;
  category_id: number;
  name: string;
  description?: string;
  price?: number;
  duration?: number;
  images: string[];
  content?: string;
  is_recommended: boolean;
  created_at: Date;
  updated_at: Date;
}

// 权益卡相关类型
export interface MembershipCard {
  id: number;
  name: string;
  price: number;
  duration_days: number;
  benefits: Record<string, any>;
  description?: string;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface CreateMembershipCardRequest {
  name: string;
  price: number;
  duration_days: number;
  benefits: Record<string, any>;
  description?: string;
}

// 用户权益相关类型
export interface UserMembership {
  id: number;
  user_id: number;
  card_id: number;
  start_date: Date;
  end_date: Date;
  remaining_services: Record<string, any>;
  status: 'active' | 'expired' | 'cancelled';
  created_at: Date;
  updated_at: Date;
}

// 权益卡产品相关类型
export interface RightsCard {
  id: number;
  name: string;
  type: 'nursing' | 'special_drug' | 'other';
  description?: string;
  price: number;
  duration_years: number;
  activation_age_min: number;
  activation_age_max: number;
  coverage_details: Record<string, any>;
  service_limits: Record<string, any>;
  eligibility_rules: Record<string, any>;
  application_process: Record<string, any>;
  key_features: string[];
  benefits: string[];
  target_audience: string[];
  faq: Record<string, any>;
  comparison_points: Record<string, any>;
  is_available: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRightsCardRequest {
  name: string;
  type: 'nursing' | 'special_drug' | 'other';
  description?: string;
  price: number;
  duration_years: number;
  activation_age_min?: number;
  activation_age_max?: number;
  coverage_details?: Record<string, any>;
  service_limits?: Record<string, any>;
  eligibility_rules?: Record<string, any>;
  application_process?: Record<string, any>;
  key_features?: string[];
  benefits?: string[];
  target_audience?: string[];
  faq?: Record<string, any>;
  comparison_points?: Record<string, any>;
  sort_order?: number;
}

// 用户权益卡相关类型
export interface UserRightsCard {
  id: number;
  user_id: number;
  card_id: number;
  card_number: string;
  activation_date?: Date;
  expiry_date?: Date;
  status: 'inactive' | 'active' | 'expired' | 'cancelled';
  remaining_benefits: Record<string, any>;
  usage_records: any[];
  payment_status: 'pending' | 'paid' | 'refunded' | 'failed';
  payment_method?: string;
  payment_amount?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateUserRightsCardRequest {
  user_id: number;
  card_id: number;
  payment_method?: string;
  payment_amount?: number;
}

// 权益卡使用记录相关类型
export interface RightsCardUsage {
  id: number;
  user_card_id: number;
  service_type: string;
  service_details: Record<string, any>;
  usage_date: Date;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  approval_notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface CreateRightsCardUsageRequest {
  user_card_id: number;
  service_type: string;
  service_details?: Record<string, any>;
}

// 预约相关类型
export interface Appointment {
  id: number;
  user_id?: number;
  doctor_id: number;
  service_type?: string;
  patient_name: string;
  patient_phone: string;
  patient_age?: number;
  patient_gender?: 'male' | 'female' | 'other';
  appointment_date: Date;
  appointment_time: string;
  symptoms?: string;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  membership_id?: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateAppointmentRequest {
  doctor_id: number;
  service_type?: string;
  patient_name: string;
  patient_phone: string;
  patient_age?: number;
  patient_gender?: 'male' | 'female' | 'other';
  appointment_date: string;
  appointment_time: string;
  symptoms?: string;
  notes?: string;
  membership_id?: number;
}

export interface UpdateAppointmentRequest {
  status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
}

export interface AppointmentQueryParams {
  page?: number;
  limit?: number;
  user_id?: number;
  doctor_id?: number;
  status?: string;
  start_date?: string;
  end_date?: string;
  sort_by?: 'appointment_date' | 'created_at';
  order?: 'asc' | 'desc';
}

// 短信配置相关类型
export interface SmsConfig {
  id: number;
  template_id: string;
  recipient_type: 'customer_service' | 'doctor' | 'both';
  is_enabled: boolean;
  config: Record<string, any>;
  created_at: Date;
  updated_at: Date;
}

// 系统配置相关类型
export interface SystemConfig {
  id: number;
  config_key: string;
  config_value: Record<string, any>;
  description?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

// 操作日志相关类型
export interface OperationLog {
  id: number;
  user_id?: number;
  operation_type: string;
  operation_detail: Record<string, any>;
  ip_address?: string;
  user_agent?: string;
  created_at: Date;
}

// API响应相关类型
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: Date;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

// 微信相关类型
export interface WechatLoginRequest {
  code: string;
}

export interface WechatUserInfo {
  openid: string;
  unionid?: string;
  nickname?: string;
  headimgurl?: string;
}

// 查询参数类型
export interface QueryParams {
  page?: number;
  limit?: number;
  sort_by?: string;
  order?: 'asc' | 'desc';
}

// 分页类型
export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

// 通用类型
export interface IdParams {
  id: string;
}

export interface SearchParams {
  keyword?: string;
}

export interface DateRangeParams {
  start_date?: string;
  end_date?: string;
}

// 扩展Express Request类型
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      id?: string;
      user?: User;
      cache?: any;
    }
  }
}