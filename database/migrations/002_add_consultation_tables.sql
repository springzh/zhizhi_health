-- =================================================================
-- 在线咨询功能数据表
-- 创建时间: 2025-08-31
-- 功能描述: 用户留言咨询，医生/管理员回复功能
-- =================================================================

-- 咨询留言表
CREATE TABLE IF NOT EXISTS consultations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    doctor_id INTEGER REFERENCES doctors(id) ON DELETE SET NULL,
    guest_name VARCHAR(100),
    guest_phone VARCHAR(20),
    guest_email VARCHAR(100),
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'dental', 'cell', 'membership', 'appointment')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'replied', 'closed', 'cancelled')),
    priority VARCHAR(20) DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
    is_public BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 咨询回复表
CREATE TABLE IF NOT EXISTS consultation_replies (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    reply_type VARCHAR(20) NOT NULL CHECK (reply_type IN ('doctor', 'admin', 'user')),
    content TEXT NOT NULL,
    is_internal_note BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 咨询附件表（可选，用于支持图片、文档等附件）
CREATE TABLE IF NOT EXISTS consultation_attachments (
    id SERIAL PRIMARY KEY,
    consultation_id INTEGER NOT NULL REFERENCES consultations(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(50),
    file_size BIGINT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 咨询表索引
CREATE INDEX IF NOT EXISTS idx_consultations_user_id ON consultations(user_id);
CREATE INDEX IF NOT EXISTS idx_consultations_doctor_id ON consultations(doctor_id);
CREATE INDEX IF NOT EXISTS idx_consultations_status ON consultations(status);
CREATE INDEX IF NOT EXISTS idx_consultations_category ON consultations(category);
CREATE INDEX IF NOT EXISTS idx_consultations_priority ON consultations(priority);
CREATE INDEX IF NOT EXISTS idx_consultations_created_at ON consultations(created_at);
CREATE INDEX IF NOT EXISTS idx_consultations_guest_phone ON consultations(guest_phone);
CREATE INDEX IF NOT EXISTS idx_consultations_is_public ON consultations(is_public);

-- 回复表索引
CREATE INDEX IF NOT EXISTS idx_consultation_replies_consultation_id ON consultation_replies(consultation_id);
CREATE INDEX IF NOT EXISTS idx_consultation_replies_user_id ON consultation_replies(user_id);
CREATE INDEX IF NOT EXISTS idx_consultation_replies_reply_type ON consultation_replies(reply_type);
CREATE INDEX IF NOT EXISTS idx_consultation_replies_created_at ON consultation_replies(created_at);

-- 附件表索引
CREATE INDEX IF NOT EXISTS idx_consultation_attachments_consultation_id ON consultation_attachments(consultation_id);
CREATE INDEX IF NOT EXISTS idx_consultation_attachments_file_type ON consultation_attachments(file_type);

-- 更新时间戳触发器
CREATE TRIGGER update_consultations_updated_at BEFORE UPDATE ON consultations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_consultation_replies_updated_at BEFORE UPDATE ON consultation_replies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 咨询状态更新触发器（当有回复时自动更新状态和回复数）
CREATE OR REPLACE FUNCTION update_consultation_status()
RETURNS TRIGGER AS $$
BEGIN
    -- 更新咨询的回复数
    UPDATE consultations 
    SET reply_count = reply_count + 1,
        status = CASE 
            WHEN consultations.status = 'pending' THEN 'replied'
            ELSE consultations.status
        END,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.consultation_id;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_consultation_status
    AFTER INSERT ON consultation_replies
    FOR EACH ROW EXECUTE FUNCTION update_consultation_status();

-- 插入默认咨询分类配置
INSERT INTO system_config (config_key, config_value, description) VALUES
('consultation_settings', '{"allow_guest": true, "require_login": false, "max_attachments": 3, "max_file_size": 5242880, "allowed_file_types": ["image/jpeg", "image/png", "image/gif", "application/pdf"]}', '咨询功能设置'),
('consultation_categories', '{"general": "一般咨询", "dental": "口腔咨询", "cell": "细胞咨询", "membership": "权益卡咨询", "appointment": "预约咨询"}', '咨询分类设置'),
('consultation_auto_reply', '{"enabled": false, "reply_template": "感谢您的咨询，我们会尽快回复您。"}', '自动回复设置')
ON CONFLICT (config_key) DO NOTHING;

-- =================================================================
-- 在线咨询数据表创建完成
-- =================================================================

COMMENT ON TABLE consultations IS '用户咨询留言表';
COMMENT ON TABLE consultation_replies IS '咨询回复表';
COMMENT ON TABLE consultation_attachments IS '咨询附件表';

-- 显示创建结果
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('consultations', 'consultation_replies', 'consultation_attachments')
ORDER BY table_name, ordinal_position;