-- =================================================================
-- FAQ功能模块数据库迁移
-- 创建时间: 2025-01-20
-- 迁移版本: 004
-- =================================================================

-- 创建FAQ分类表
CREATE TABLE IF NOT EXISTS faq_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(name)
);

-- 创建FAQ问题表
CREATE TABLE IF NOT EXISTS faqs (
    id SERIAL PRIMARY KEY,
    category_id INTEGER REFERENCES faq_categories(id) ON DELETE SET NULL,
    question VARCHAR(500) NOT NULL,
    answer TEXT NOT NULL,
    view_count INTEGER DEFAULT 0,
    is_popular BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 创建FAQ索引
CREATE INDEX IF NOT EXISTS idx_faqs_category_id ON faqs(category_id);
CREATE INDEX IF NOT EXISTS idx_faqs_popular ON faqs(is_popular);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON faqs(is_active);
CREATE INDEX IF NOT EXISTS idx_faqs_sort_order ON faqs(sort_order);
CREATE INDEX IF NOT EXISTS idx_faqs_view_count ON faqs(view_count DESC);
CREATE INDEX IF NOT EXISTS idx_faqs_created_at ON faqs(created_at);

-- 创建FAQ分类索引
CREATE INDEX IF NOT EXISTS idx_faq_categories_active ON faq_categories(is_active);
CREATE INDEX IF NOT EXISTS idx_faq_categories_sort_order ON faq_categories(sort_order);

-- 插入默认FAQ分类
INSERT INTO faq_categories (name, description, sort_order) VALUES
('预约流程', '关于预约流程的相关问题', 1),
('服务项目', '关于各项口腔服务的说明', 2),
('会员权益', '关于会员卡和权益卡的疑问', 3),
('支付方式', '关于支付和费用的说明', 4),
('医生信息', '关于医生资质和专业的问题', 5)
ON CONFLICT (name) DO NOTHING;

-- 插入默认FAQ数据
INSERT INTO faqs (category_id, question, answer, is_popular, sort_order) VALUES
(1, '如何预约医生？', '您可以通过以下方式预约医生：1. 在官网首页点击"立即预约"按钮；2. 浏览医生页面选择心仪医生并点击预约；3. 在服务页面直接预约特定服务。预约时请填写患者基本信息和期望的就诊时间。', true, 1),
(1, '预约后需要多久才能得到确认？', '通常情况下，我们会在24小时内通过电话或短信与您确认预约信息。如遇紧急情况，我们会尽快与您联系。请保持电话畅通。', true, 2),
(2, '口腔检查包括哪些项目？', '我们的口腔检查包括：口腔全景检查、牙齿龋坏检查、牙周状况检查、咬合关系检查、口腔黏膜检查等。如有需要，还会进行X光片检查。', true, 3),
(2, '牙齿美白的效果能持续多久？', '牙齿美白的效果通常可以维持1-2年，具体时间取决于个人饮食习惯和口腔护理。建议避免饮用咖啡、茶、红酒等易染色饮品，并保持良好的口腔卫生习惯。', false, 4),
(3, '会员卡有哪些权益？', '我们的会员卡提供多项权益：优先预约、专属折扣、免费复查、定期口腔检查、专家会诊等。不同等级的会员卡享受的权益不同，详情请查看会员页面。', true, 5),
(3, '权益卡和会员卡有什么区别？', '会员卡是长期会员资格，提供持续的优惠和服务；权益卡是单次或多次服务包，专注于特定项目的优惠。您可以根据需求选择适合的卡片类型。', false, 6),
(4, '支持哪些支付方式？', '我们支持多种支付方式：微信支付、支付宝、银行卡支付、现金支付。部分高端服务也支持分期付款，详情请咨询客服。', true, 7),
(4, '治疗费用是否可以医保报销？', '目前我们的服务暂不支持医保报销，但我们提供合理的价格和优质的医疗服务。会员可享受专属折扣优惠。', false, 8),
(5, '医生的资质如何？', '我们的医生都具备国家执业医师资格，拥有丰富的临床经验。部分医生还具有海外留学背景或专业认证，详细信息可在医生页面查看。', true, 9),
(5, '可以选择特定的医生吗？', '当然可以！我们的平台提供医生详细信息，包括专业背景、患者评价等，您可以根据需求选择合适的医生进行预约。', false, 10)
ON CONFLICT DO NOTHING;

-- 创建更新时间戳触发器
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为FAQ表创建触发器
CREATE TRIGGER update_faq_categories_updated_at BEFORE UPDATE ON faq_categories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON faqs
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- 显示创建结果
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
    AND table_name IN ('faq_categories', 'faqs')
ORDER BY table_name, ordinal_position;

-- 显示插入的数据统计
SELECT 
    'faq_categories' as table_name,
    COUNT(*) as record_count
FROM faq_categories
UNION ALL
SELECT 
    'faqs' as table_name,
    COUNT(*) as record_count
FROM faqs;

-- 迁移完成提示
SELECT 'FAQ功能模块数据库迁移完成 - ' || current_timestamp as migration_status;