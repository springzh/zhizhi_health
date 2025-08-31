-- =================================================================
-- 知治健康 PostgreSQL 数据库 Schema
-- 创建时间: 2025-01-20
-- 数据库版本: PostgreSQL 15+
-- =================================================================

-- 创建数据库（如果不存在）
-- CREATE DATABASE zhizhi_health;
-- \c zhizhi_health;

-- 创建扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =================================================================
-- 1. 用户相关表
-- =================================================================

-- 用户表
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    openid VARCHAR(255) UNIQUE,
    unionid VARCHAR(255),
    nickname VARCHAR(100),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户索引
CREATE INDEX IF NOT EXISTS idx_users_openid ON users(openid);
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- =================================================================
-- 2. 医生相关表
-- =================================================================

-- 医生表
CREATE TABLE IF NOT EXISTS doctors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    title VARCHAR(100),
    specialty VARCHAR(200),
    hospital VARCHAR(200),
    location VARCHAR(100),
    avatar_url VARCHAR(500),
    introduction TEXT,
    rating DECIMAL(3,2) DEFAULT 0.0 CHECK (rating >= 0 AND rating <= 5),
    consultation_count INTEGER DEFAULT 0 CHECK (consultation_count >= 0),
    is_available BOOLEAN DEFAULT true,
    service_types JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 医生索引
CREATE INDEX IF NOT EXISTS idx_doctors_name ON doctors(name);
CREATE INDEX IF NOT EXISTS idx_doctors_location ON doctors(location);
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors USING GIN(to_tsvector('simple', specialty));
CREATE INDEX IF NOT EXISTS idx_doctors_rating ON doctors(rating DESC);
CREATE INDEX IF NOT EXISTS idx_doctors_available ON doctors(is_available);
CREATE INDEX IF NOT EXISTS idx_doctors_created_at ON doctors(created_at);

-- =================================================================
-- 3. 服务相关表
-- =================================================================

-- 服务分类表
CREATE TABLE IF NOT EXISTS service_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('dental', 'cell', 'membership')),
    description TEXT,
    icon VARCHAR(100),
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name, type)
);

-- 服务项目表
CREATE TABLE IF NOT EXISTS services (
    id SERIAL PRIMARY KEY,
    category_id INTEGER NOT NULL REFERENCES service_categories(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) CHECK (price >= 0),
    duration INTEGER CHECK (duration > 0),
    images JSONB DEFAULT '[]',
    content TEXT,
    is_recommended BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 服务索引
CREATE INDEX IF NOT EXISTS idx_services_category_id ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_name ON services(name);
CREATE INDEX IF NOT EXISTS idx_services_recommended ON services(is_recommended);
CREATE INDEX IF NOT EXISTS idx_services_price ON services(price);
CREATE INDEX IF NOT EXISTS idx_services_created_at ON services(created_at);

-- =================================================================
-- 4. 权益卡相关表
-- =================================================================

-- 权益卡表
CREATE TABLE IF NOT EXISTS membership_cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    duration_days INTEGER NOT NULL CHECK (duration_days > 0),
    benefits JSONB NOT NULL,
    description TEXT,
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户权益表
CREATE TABLE IF NOT EXISTS user_memberships (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    card_id INTEGER NOT NULL REFERENCES membership_cards(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    remaining_services JSONB DEFAULT '{}',
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (end_date > start_date)
);

-- 权益卡索引
CREATE INDEX IF NOT EXISTS idx_membership_cards_name ON membership_cards(name);
CREATE INDEX IF NOT EXISTS idx_membership_cards_available ON membership_cards(is_available);
CREATE INDEX IF NOT EXISTS idx_membership_cards_price ON membership_cards(price);

-- 用户权益索引
CREATE INDEX IF NOT EXISTS idx_user_memberships_user_id ON user_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_card_id ON user_memberships(card_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_status ON user_memberships(status);
CREATE INDEX IF NOT EXISTS idx_user_memberships_end_date ON user_memberships(end_date);

-- =================================================================
-- 5. 预约相关表
-- =================================================================

-- 预约表
CREATE TABLE IF NOT EXISTS appointments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    doctor_id INTEGER NOT NULL REFERENCES doctors(id) ON DELETE RESTRICT,
    service_type VARCHAR(100),
    patient_name VARCHAR(100) NOT NULL,
    patient_phone VARCHAR(20) NOT NULL,
    patient_age INTEGER CHECK (patient_age > 0 AND patient_age < 120),
    patient_gender VARCHAR(10) CHECK (patient_gender IN ('male', 'female', 'other')),
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    symptoms TEXT,
    notes TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    membership_id INTEGER REFERENCES user_memberships(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CHECK (appointment_date >= CURRENT_DATE)
);

-- 预约索引
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_doctor_id ON appointments(doctor_id);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_datetime ON appointments(appointment_date, appointment_time);
CREATE INDEX IF NOT EXISTS idx_appointments_created_at ON appointments(created_at);
CREATE INDEX IF NOT EXISTS idx_appointments_membership_id ON appointments(membership_id);

-- =================================================================
-- 6. 系统配置表
-- =================================================================

-- 短信配置表
CREATE TABLE IF NOT EXISTS sms_config (
    id SERIAL PRIMARY KEY,
    template_id VARCHAR(100) NOT NULL,
    recipient_type VARCHAR(50) NOT NULL CHECK (recipient_type IN ('customer_service', 'doctor', 'both')),
    is_enabled BOOLEAN DEFAULT true,
    config JSONB DEFAULT '{}',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 系统配置表
CREATE TABLE IF NOT EXISTS system_config (
    id SERIAL PRIMARY KEY,
    config_key VARCHAR(100) UNIQUE NOT NULL,
    config_value JSONB NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =================================================================
-- 7. 审计和日志表
-- =================================================================

-- 操作日志表
CREATE TABLE IF NOT EXISTS operation_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    operation_type VARCHAR(50) NOT NULL,
    operation_detail JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 短信发送记录表
CREATE TABLE IF NOT EXISTS sms_logs (
    id SERIAL PRIMARY KEY,
    template_id VARCHAR(100),
    phone_number VARCHAR(20) NOT NULL,
    content TEXT,
    status VARCHAR(20) NOT NULL,
    error_message TEXT,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 日志索引
CREATE INDEX IF NOT EXISTS idx_operation_logs_user_id ON operation_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_operation_logs_type ON operation_logs(operation_type);
CREATE INDEX IF NOT EXISTS idx_operation_logs_created_at ON operation_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_sms_logs_phone ON sms_logs(phone_number);
CREATE INDEX IF NOT EXISTS idx_sms_logs_status ON sms_logs(status);
CREATE INDEX IF NOT EXISTS idx_sms_logs_sent_at ON sms_logs(sent_at);

-- =================================================================
-- 8. 触发器
-- =================================================================

-- 更新时间戳触发器函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为需要updated_at字段的表创建触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_doctors_updated_at BEFORE UPDATE ON doctors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_categories_updated_at BEFORE UPDATE ON service_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_membership_cards_updated_at BEFORE UPDATE ON membership_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_memberships_updated_at BEFORE UPDATE ON user_memberships
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at BEFORE UPDATE ON appointments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sms_config_updated_at BEFORE UPDATE ON sms_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_system_config_updated_at BEFORE UPDATE ON system_config
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =================================================================
-- 9. 初始化数据
-- =================================================================

-- 插入默认服务分类
INSERT INTO service_categories (name, type, description, icon, sort_order) VALUES
('口腔检查类', 'dental', '全面的口腔健康检查服务', '🔍', 1),
('治疗类服务', 'dental', '专业的口腔疾病治疗', '⚕️', 2),
('美容类服务', 'dental', '提升笑容美观度', '✨', 3),
('修复类服务', 'dental', '恢复牙齿功能和美观', '🦷', 4),
('干细胞存储', 'cell', '为未来健康投资，存储珍贵生命资源', '🧬', 1),
('免疫细胞存储', 'cell', '守护免疫系统，为健康保驾护航', '🛡️', 2),
('细胞治疗', 'cell', '前沿细胞技术，针对性治疗多种疾病', '💊', 3),
('健康管理', 'cell', '基于细胞技术的全方位健康管理', '📊', 4)
ON CONFLICT (name, type) DO NOTHING;

-- 插入默认系统配置
INSERT INTO system_config (config_key, config_value, description) VALUES
('site_settings', '{"site_name": "知治健康", "site_description": "专业口腔健康服务平台"}', '网站基础设置'),
('appointment_settings', '{"max_advance_days": 30, "min_advance_hours": 2, "daily_limit": 50}', '预约相关设置'),
('sms_settings', '{"enabled": true, "daily_limit": 1000}', '短信服务设置')
ON CONFLICT (config_key) DO NOTHING;

-- 插入默认短信配置
INSERT INTO sms_config (template_id, recipient_type, is_enabled, config) VALUES
('appointment_confirm', 'customer_service', true, '{"template_name": "预约确认通知"}'),
('appointment_reminder', 'both', true, '{"template_name": "预约提醒通知"}'),
('appointment_cancel', 'customer_service', true, '{"template_name": "预约取消通知"}')
ON CONFLICT DO NOTHING;

-- =================================================================
-- 10. 权限设置
-- =================================================================

-- 创建只读角色
-- CREATE ROLE readonly;
-- GRANT CONNECT ON DATABASE zhizhi_health TO readonly;
-- GRANT USAGE ON SCHEMA public TO readonly;
-- GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly;

-- 创建读写角色
-- CREATE ROLE readwrite;
-- GRANT CONNECT ON DATABASE zhizhi_health TO readwrite;
-- GRANT USAGE ON SCHEMA public TO readwrite;
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO readwrite;
-- GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO readwrite;

-- 创建管理员角色
-- CREATE ROLE admin;
-- GRANT CONNECT ON DATABASE zhizhi_health TO admin;
-- GRANT USAGE ON SCHEMA public TO admin;
-- GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO admin;
-- GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO admin;

-- =================================================================
-- Schema 创建完成
-- =================================================================

COMMENT ON DATABASE zhizhi_health IS '知治健康服务平台数据库';
COMMENT ON SCHEMA public IS '公开模式';

-- 显示创建结果
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('users', 'doctors', 'service_categories', 'services', 'membership_cards', 'user_memberships', 'appointments', 'sms_config', 'system_config', 'operation_logs', 'sms_logs')
ORDER BY table_name, ordinal_position;