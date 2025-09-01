-- =================================================================
-- 权益卡功能数据表
-- 创建时间: 2025-09-01
-- 功能描述: 护工卡、特药卡等权益卡产品管理
-- =================================================================

-- 权益卡产品表
CREATE TABLE IF NOT EXISTS rights_cards (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('nursing', 'special_drug', 'other')),
    description TEXT,
    price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
    duration_years INTEGER NOT NULL CHECK (duration_years > 0),
    activation_age_min INTEGER DEFAULT 0 CHECK (activation_age_min >= 0),
    activation_age_max INTEGER DEFAULT 75 CHECK (activation_age_max > activation_age_min),
    coverage_details JSONB DEFAULT '{}',
    service_limits JSONB DEFAULT '{}',
    eligibility_rules JSONB DEFAULT '{}',
    application_process JSONB DEFAULT '{}',
    key_features TEXT[] DEFAULT '{}',
    benefits TEXT[] DEFAULT '{}',
    target_audience TEXT[] DEFAULT '{}',
    faq JSONB DEFAULT '{}',
    comparison_points JSONB DEFAULT '{}',
    is_available BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 用户权益卡表
CREATE TABLE IF NOT EXISTS user_rights_cards (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    card_id INTEGER REFERENCES rights_cards(id) ON DELETE CASCADE,
    card_number VARCHAR(50) UNIQUE NOT NULL,
    activation_date DATE,
    expiry_date DATE,
    status VARCHAR(20) DEFAULT 'inactive' CHECK (status IN ('inactive', 'active', 'expired', 'cancelled')),
    remaining_benefits JSONB DEFAULT '{}',
    usage_records JSONB DEFAULT '[]',
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'refunded', 'failed')),
    payment_method VARCHAR(50),
    payment_amount DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 权益卡使用记录表
CREATE TABLE IF NOT EXISTS rights_card_usage (
    id SERIAL PRIMARY KEY,
    user_card_id INTEGER REFERENCES user_rights_cards(id) ON DELETE CASCADE,
    service_type VARCHAR(100) NOT NULL,
    service_details JSONB DEFAULT '{}',
    usage_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'completed', 'cancelled')),
    approval_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 权益卡表索引
CREATE INDEX IF NOT EXISTS idx_rights_cards_type ON rights_cards(type);
CREATE INDEX IF NOT EXISTS idx_rights_cards_price ON rights_cards(price);
CREATE INDEX IF NOT EXISTS idx_rights_cards_available ON rights_cards(is_available);
CREATE INDEX IF NOT EXISTS idx_rights_cards_sort_order ON rights_cards(sort_order);
CREATE INDEX IF NOT EXISTS idx_rights_cards_created_at ON rights_cards(created_at);

-- 用户权益卡表索引
CREATE INDEX IF NOT EXISTS idx_user_rights_cards_user_id ON user_rights_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_user_rights_cards_card_id ON user_rights_cards(card_id);
CREATE INDEX IF NOT EXISTS idx_user_rights_cards_status ON user_rights_cards(status);
CREATE INDEX IF NOT EXISTS idx_user_rights_cards_card_number ON user_rights_cards(card_number);
CREATE INDEX IF NOT EXISTS idx_user_rights_cards_activation_date ON user_rights_cards(activation_date);
CREATE INDEX IF NOT EXISTS idx_user_rights_cards_expiry_date ON user_rights_cards(expiry_date);
CREATE INDEX IF NOT EXISTS idx_user_rights_cards_payment_status ON user_rights_cards(payment_status);

-- 使用记录表索引
CREATE INDEX IF NOT EXISTS idx_rights_card_usage_user_card_id ON rights_card_usage(user_card_id);
CREATE INDEX IF NOT EXISTS idx_rights_card_usage_service_type ON rights_card_usage(service_type);
CREATE INDEX IF NOT EXISTS idx_rights_card_usage_status ON rights_card_usage(status);
CREATE INDEX IF NOT EXISTS idx_rights_card_usage_usage_date ON rights_card_usage(usage_date);

-- 更新时间戳触发器
CREATE TRIGGER update_rights_cards_updated_at BEFORE UPDATE ON rights_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_rights_cards_updated_at BEFORE UPDATE ON user_rights_cards
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_rights_card_usage_updated_at BEFORE UPDATE ON rights_card_usage
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 插入默认权益卡产品数据
INSERT INTO rights_cards (
    name, type, description, price, duration_years, activation_age_min, activation_age_max,
    coverage_details, service_limits, eligibility_rules, key_features, benefits, target_audience,
    sort_order
) VALUES 
(
    '全能护无忧卡', 'nursing', 
    '提供院内一对一专业护工照护，每次8天7晚，涵盖入院前后辅助服务，包含既往症保障',
    338.00, 10, 0, 75,
    '{"service_type": "院内一对一护工", "duration": "8天7晚", "coverage": "入院前后辅助服务", "previous_conditions": true}',
    '{"application_lead_time": "48小时", "insurance_binding": true, "hospital_level": "公立三甲医院", "waiting_period": 30}',
    '{"age_range": "0-75周岁", "insurance_required": true, "health_requirements": "无特殊要求"}',
    ARRAY['专业护工服务', '8天7晚全程照护', '包含既往症', '入院前后服务'],
    ARRAY['缓解家属照护压力', '专业护理保障', '弥补医院资源不足', '经济实惠'],
    ARRAY['工作繁忙人群', '异地就医患者', '专业护理需求者', '经济压力较大家庭'],
    1
),
(
    '至尊无忧护工卡', 'nursing',
    '无需绑定保单的护工服务，提供8天7晚专业照护，包含既往症保障',
    298.00, 5, 0, 80,
    '{"service_type": "院内一对一护工", "duration": "8天7晚", "coverage": "入院前后辅助服务", "previous_conditions": true}',
    '{"application_lead_time": "48小时", "insurance_binding": false, "hospital_level": "二级及以上公立医院", "waiting_period": 30}',
    '{"age_range": "0-80周岁", "insurance_required": false, "health_requirements": "无特殊要求"}',
    ARRAY['无需绑定保单', '8天7晚全程照护', '包含既往症', '医院选择更广'],
    ARRAY['购买门槛低', '服务覆盖广', '专业护理保障', '性价比高'],
    ARRAY['无保单用户', '需要既往症保障', '医院选择灵活', '预算有限用户'],
    2
),
(
    '基础护工卡', 'nursing',
    '经济型护工服务，提供8天7晚专业照护，不含既往症',
    138.00, 5, 0, 75,
    '{"service_type": "院内一对一护工", "duration": "8天7晚", "coverage": "入院前后辅助服务", "previous_conditions": false}',
    '{"application_lead_time": "48小时", "insurance_binding": false, "hospital_level": "公立三甲医院", "waiting_period": 30}',
    '{"age_range": "0-75周岁", "insurance_required": false, "health_requirements": "无既往症"}',
    ARRAY['价格优惠', '8天7晚照护', '无需绑定保单', '专业服务'],
    ARRAY['价格最优惠', '基础保障充足', '使用门槛低', '性价比极高'],
    ARRAY['预算有限用户', '健康人群', '首次体验用户', '年轻人群'],
    3
),
(
    '千万药健康特药卡', 'special_drug',
    '提供高额特药保障，国内120种特药+海外100种特药，年额度最高300万，总保额1500万',
    1999.00, 10, 28, 75,
    '{"domestic_drugs": 120, "overseas_drugs": 100, "annual_limit": 3000000, "total_coverage": 15000000, "car_t_coverage": 1500000}',
    '{"usage_period": "确诊后5年", "age_limit": "保障至90周岁", "health_declaration": "仅排除激活前恶性肿瘤"}',
    '{"age_range": "28天-75周岁", "activation_age": "至75周岁", "coverage_age": "至90周岁", "health_requirements": "非恶性肿瘤患者"}',
    ARRAY['特药直付无需垫付', '海南博鳌海外特药', 'CAR-T疗法保障', '健康告知宽松'],
    ARRAY['解决吃不起特药问题', '解决吃不上特药问题', '全球顶尖药物通道', '长期用药保障'],
    ARRAY['关注癌症风险人群', '有特药需求患者', '经济压力大人群', '需要海外特药患者'],
    4
),
(
    '家庭至尊护工卡', 'nursing',
    '家庭共享护工服务，10年有效期，支持多人使用',
    1149.00, 10, 0, 75,
    '{"service_type": "院内一对一护工", "duration": "8天7晚", "coverage": "入院前后辅助服务", "previous_conditions": true, "family_sharing": true}',
    '{"application_lead_time": "48小时", "insurance_binding": false, "hospital_level": "二级及以上公立医院", "waiting_period": 30, "max_users": 5}',
    '{"age_range": "0-75周岁", "insurance_required": false, "health_requirements": "无特殊要求", "family_members": "直系亲属"}',
    ARRAY['家庭共享', '10年超长期', '多人使用', '包含既往症'],
    ARRAY['家庭整体保障', '性价比极高', '长期安心', '全家共享'],
    ARRAY['有老人家庭', '有小孩家庭', '需要长期保障', '预算充足家庭'],
    5
);

-- 插入系统配置
INSERT INTO system_config (config_key, config_value, description) VALUES
('rights_card_settings', '{"auto_activation": false, "activation_period_days": 365, "refund_policy": "购买后7天内可退款", "customer_service_phone": "400-123-4567"}', '权益卡功能设置'),
('rights_card_approval', '{"requires_approval": true, "auto_approve_threshold": 1000, "approval_roles": ["admin"], "notification_enabled": true}', '权益卡使用审批设置')
ON CONFLICT (config_key) DO NOTHING;

-- =================================================================
-- 权益卡数据表创建完成
-- =================================================================

COMMENT ON TABLE rights_cards IS '权益卡产品表';
COMMENT ON TABLE user_rights_cards IS '用户权益卡表';
COMMENT ON TABLE rights_card_usage IS '权益卡使用记录表';

-- 显示创建结果
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('rights_cards', 'user_rights_cards', 'rights_card_usage')
ORDER BY table_name, ordinal_position;