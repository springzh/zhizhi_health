-- 知治健康数据库种子数据
-- 根据网站硬编码数据生成

-- 1. 服务分类数据
INSERT INTO service_categories (name, type, description, icon, sort_order, is_active) VALUES
('口腔检查', 'dental', '专业口腔检查服务，预防口腔疾病', '🦷', 1, true),
('龋齿治疗', 'dental', '专业龋齿诊断和治疗服务', '🔧', 2, true),
('牙周治疗', 'dental', '牙周疾病专业治疗', '🦷', 3, true),
('牙齿美容', 'dental', '牙齿美白和美容服务', '✨', 4, true),
('牙齿修复', 'dental', '牙齿修复和重建服务', '🦷', 5, true),
('种植牙', 'dental', '专业种植牙服务', '🌱', 6, true),
('正畸矫正', 'dental', '牙齿矫正和正畸服务', '📐', 7, true),
('儿童牙科', 'dental', '儿童专业牙科服务', '👶', 8, true),
('口腔外科', 'dental', '口腔外科手术服务', '🔪', 9, true),
('干细胞存储', 'cell', '干细胞长期存储服务', '🧬', 1, true),
('免疫细胞存储', 'cell', '免疫细胞存储和制备', '🛡️', 2, true),
('细胞治疗', 'cell', '前沿细胞治疗服务', '💊', 3, true),
('健康管理', 'cell', '基于细胞技术的健康管理', '📊', 4, true),
('会员服务', 'membership', '专属会员权益服务', '💎', 1, true);

-- 2. 医疗权益卡数据
INSERT INTO membership_cards (name, price, duration_days, benefits, description, is_available, sort_order) VALUES
('基础版', 1999, 365, 
 '{"oral_exam": 2, "teeth_cleaning": 2, "x_ray": 1, "online_consultation": "unlimited", "priority_level": "normal"}', 
 '适合个人基础口腔护理需求，包含基础检查和预防服务', true, 1),

('标准版', 3999, 365, 
 '{"oral_exam": 4, "teeth_cleaning": 4, "x_ray": 2, "basic_treatment_discount": 0.8, "cosmetic_treatment_discount": 0.9, "online_consultation": "unlimited", "priority_level": "high", "exclusive_service": true}', 
 '适合经常需要口腔护理的用户，享受更多服务和优惠', true, 2),

('尊享版', 8999, 365, 
 '{"oral_exam": "unlimited", "teeth_cleaning": "unlimited", "x_ray": "unlimited", "basic_treatment_discount": 0.7, "cosmetic_treatment_discount": 0.8, "implant_discount": 0.9, "exclusive_doctor": true, "priority_level": "highest", "support_24h": true, "home_service": true, "annual_checkup": true}', 
 '追求高品质服务的最佳选择，享受全方位尊贵服务', true, 3),

('家庭版', 12999, 365, 
 '{"oral_exam": "unlimited", "teeth_cleaning": "unlimited", "x_ray": "unlimited", "basic_treatment_discount": 0.75, "cosmetic_treatment_discount": 0.85, "pediatric_dental": true, "family_doctor": true, "priority_level": "high", "family_records": true, "regular_followup": true, "family_members": 4}', 
 '适合2-4人家庭共享，全家人的口腔健康守护者', true, 4);

-- 3. 服务项目数据

-- 口腔检查类服务
INSERT INTO services (category_id, name, description, price, duration, images, content, is_recommended, sort_order) VALUES
(1, '全面口腔检查', '全面的口腔健康检查，包括牙齿、牙龈、口腔黏膜等各项检查', 350, 45, '["/images/services/oral-exam.jpg"]', '专业口腔医生进行全面检查，早期发现口腔问题，制定个性化治疗方案', true, 1),

(1, '数字化口腔扫描', '采用先进数字化技术进行口腔三维扫描', 550, 45, '["/images/services/digital-scan.jpg"]', '无辐射、高精度的口腔扫描，为治疗提供精确数据支持', false, 2),

(1, '口腔CT检查', '三维口腔CT成像，全面了解口腔内部结构', 850, 20, '["/images/services/ct-scan.jpg"]', '高精度CT检查，为复杂治疗提供详细诊断依据', false, 3),

(1, '牙齿拍片检查', '常规牙齿X光检查，了解牙齿根部情况', 200, 15, '["/images/services/x-ray.jpg"]', '基础影像检查，辅助诊断牙齿内部问题', false, 4);

-- 龋齿治疗类服务
INSERT INTO services (category_id, name, description, price, duration, images, content, is_recommended, sort_order) VALUES
(2, '龋齿治疗', '专业龋齿诊断和充填治疗', 900, 90, '["/images/services/caries-treatment.jpg"]', '早期龋齿治疗，防止病情恶化，恢复牙齿功能', true, 1),

(2, '树脂补牙', '采用进口树脂材料进行牙齿充填', 600, 60, '["/images/services/resin-filling.jpg"]', '美观耐用的树脂补牙，颜色与天然牙齿接近', false, 2);

-- 牙周治疗类服务
INSERT INTO services (category_id, name, description, price, duration, images, content, is_recommended, sort_order) VALUES
(3, '牙周治疗', '专业牙周疾病治疗和护理', 1250, 75, '["/images/services/periodontal.jpg"]', '深度牙周清洁和治疗，预防和控制牙周疾病', true, 1),

(3, '牙龈刮治', '专业牙龈刮治和深层清洁', 800, 60, '["/images/services/scaling.jpg"]', '清除牙菌斑和牙结石，改善牙龈健康', false, 2);

-- 牙齿美容类服务
INSERT INTO services (category_id, name, description, price, duration, images, content, is_recommended, sort_order) VALUES
(4, '牙齿美白', '专业牙齿美白服务，恢复牙齿自然光泽', 1900, 90, '["/images/services/teeth-whitening.jpg"]', '安全有效的牙齿美白，提升笑容魅力', true, 1),

(4, '牙齿贴面', '瓷贴面美容修复，改善牙齿外观', 3250, 150, '["/images/services/veneers.jpg"]', '微创美容修复，快速改善牙齿形态和颜色', false, 2),

(4, '隐形矫正', '隐形牙齿矫正，美观舒适', 35000, 720, '["/images/services/invisible-braces.jpg"]', '隐形矫正器，不影响美观，矫正效果显著', false, 3);

-- 牙齿修复类服务
INSERT INTO services (category_id, name, description, price, duration, images, content, is_recommended, sort_order) VALUES
(5, '种植牙', '专业种植牙手术，恢复牙齿功能', 15000, 180, '["/images/services/dental-implant.jpg"]', '高端种植牙技术，恢复咀嚼功能和美观', true, 1),

(5, '烤瓷牙', '烤瓷牙冠修复，美观耐用', 3250, 150, '["/images/services/porcelain-crown.jpg"]', '经典烤瓷修复，性价比高，效果稳定', false, 2),

(5, '活动义齿', '可拆卸义齿修复', 9000, 14, '["/images/services/denture.jpg"]', '经济实惠的义齿选择，适合多颗牙齿缺失', false, 3);

-- 根管治疗类服务
INSERT INTO services (category_id, name, description, price, duration, images, content, is_recommended, sort_order) VALUES
(6, '根管治疗', '专业根管治疗，保存患牙', 1650, 120, '["/images/services/root-canal.jpg"]', '显微根管治疗，最大限度保存天然牙齿', true, 1),

(6, '显微根管', '显微镜下精密根管治疗', 2500, 150, '["/images/services/microscopic-root-canal.jpg"]', '高精度显微治疗，提高成功率', false, 2);

-- 牙齿拔除类服务
INSERT INTO services (category_id, name, description, price, duration, images, content, is_recommended, sort_order) VALUES
(7, '复杂拔牙', '复杂牙齿拔除手术', 600, 45, '["/images/services/complex-extraction.jpg"]', '专业复杂拔牙，减少创伤和并发症', true, 1),

(7, '智齿拔除', '智齿拔除手术', 800, 60, '["/images/services/wisdom-tooth.jpg"]', '专业智齿拔除，预防相关口腔问题', false, 2);

-- 正畸矫正类服务
INSERT INTO services (category_id, name, description, price, duration, images, content, is_recommended, sort_order) VALUES
(8, '传统矫正', '传统金属托槽矫正', 25000, 600, '["/images/services/traditional-braces.jpg"]', '经典矫正方法，效果稳定可靠', true, 1),

(8, '儿童矫正', '儿童早期干预矫正', 20000, 480, '["/images/services/children-braces.jpg"]', '儿童时期矫正干预，效果更佳', false, 2);

-- 儿童牙科类服务
INSERT INTO services (category_id, name, description, price, duration, images, content, is_recommended, sort_order) VALUES
(9, '窝沟封闭', '儿童窝沟封闭预防龋齿', 200, 30, '["/images/services/pit-sealant.jpg"]', '预防性治疗，减少儿童龋齿发生', true, 1),

(9, '儿童补牙', '儿童专用补牙材料', 400, 45, '["/images/services/children-filling.jpg"]', '儿童友好型补牙材料，颜色美观', false, 2);

-- 细胞服务类服务
INSERT INTO services (category_id, name, description, price, duration, images, content, is_recommended, sort_order) VALUES
(10, '脐带血干细胞存储', '新生儿脐带血干细胞长期存储服务', 19800, 0, '["/images/services/cord-blood.jpg"]', '为宝宝存储珍贵生命资源，未来健康保障', true, 1),

(10, '脂肪干细胞存储', '脂肪干细胞提取和存储服务', 29800, 0, '["/images/services/adipose-stem.jpg"]', '成人干细胞存储，抗衰老和疾病治疗储备', false, 2),

(11, '免疫细胞存储', '免疫细胞存储和制备服务', 16800, 0, '["/images/services/immune-cell.jpg"]', '守护免疫系统，为健康保驾护航', true, 1),

(11, 'CAR-T细胞制备', '个性化CAR-T细胞制备服务', 98000, 0, '["/images/services/car-t.jpg"]', '前沿细胞治疗技术，针对性治疗', false, 2),

(12, '抗衰老治疗', '干细胞抗衰老治疗服务', 58000, 0, '["/images/services/anti-aging.jpg"]', '前沿细胞技术，延缓衰老过程', true, 1),

(12, '免疫系统调节', '细胞免疫系统调节治疗', 38000, 0, '["/images/services/immune-therapy.jpg"]', '调节免疫系统功能，改善亚健康', false, 2),

(13, '健康评估检测', '全面健康评估和检测服务', 2800, 120, '["/images/services/health-assessment.jpg"]', '基于细胞技术的全面健康评估', true, 1),

(13, '个性化健康方案', '定制化健康管理方案', 1800, 90, '["/images/services/health-plan.jpg"]', '根据个人情况制定专属健康方案', false, 2);

-- 4. 医生数据
INSERT INTO doctors (name, title, specialty, hospital, location, avatar_url, introduction, rating, consultation_count, is_available, service_types, created_at, updated_at) VALUES
('张建华', '主任医师', '口腔修复', '广州口腔医院', '广州', '/images/doctors/zhang-jianhua.jpg', '专注于口腔修复领域20年，擅长种植牙、烤瓷牙等修复治疗，临床经验丰富。毕业于中山大学口腔医学院，获得博士学位。曾在国内外多家知名口腔医院进修学习，发表专业论文30余篇。', 4.9, 1500, true, '["种植牙", "烤瓷牙", "全口修复", "美学修复"]', NOW(), NOW()),

('李明珠', '副主任医师', '牙周治疗', '深圳人民医院', '深圳', '/images/doctors/li-mingzhu.jpg', '牙周病治疗专家，在牙龈疾病治疗和口腔健康管理方面有深入研究。华西口腔医学院硕士毕业，从事牙周病临床治疗15年，特别擅长牙龈刮治和牙周再生治疗。', 4.8, 1200, true, '["牙周治疗", "牙龈刮治", "口腔保健", "激光治疗"]', NOW(), NOW()),

('王志强', '主治医师', '牙齿美容', '广州协和医院', '广州', '/images/doctors/wang-zhiqiang.jpg', '牙齿美容和矫正专家，致力于为患者创造完美笑容。第四军医大学口腔医学院毕业，12年临床经验，在牙齿美白、隐形矫正等方面有独到见解。', 4.7, 900, true, '["牙齿美白", "隐形矫正", "牙齿贴面", "美学设计"]', NOW(), NOW()),

('陈小玲', '主任医师', '儿童牙科', '深圳儿童医院', '深圳', '/images/doctors/chen-xiaoling.jpg', '儿童牙科专家，擅长儿童牙齿矫正和预防治疗，亲和力强。北京大学口腔医学院博士，18年儿童牙科临床经验，特别擅长与儿童沟通，让小朋友快乐看牙。', 4.9, 1100, true, '["儿童牙齿矫正", "窝沟封闭", "儿童补牙", "口腔预防"]', NOW(), NOW()),

('刘建国', '主任医师', '口腔外科', '广州中山医院', '广州', '/images/doctors/li-jianguo.jpg', '口腔外科资深专家，复杂牙齿拔除和口腔手术经验丰富。上海交通大学口腔医学院毕业，25年临床经验，擅长复杂拔牙、口腔颌面外科手术。', 4.8, 1800, true, '["复杂拔牙", "口腔手术", "种植外科", "颌面外科"]', NOW(), NOW()),

('赵美丽', '副主任医师', '根管治疗', '深圳第二人民医院', '深圳', '/images/doctors/zhao-meili.jpg', '根管治疗专家，显微根管治疗技术精湛，成功率高。武汉大学口腔医学院硕士，16年根管治疗经验，在复杂根管治疗方面有深入研究。', 4.9, 1300, true, '["根管治疗", "显微根管", "牙髓治疗", "牙齿保存"]', NOW(), NOW()),

('孙大伟', '主治医师', '口腔正畸', '广州口腔医院', '广州', '/images/doctors/sun-dawei.jpg', '正畸专科医生，各类错颌畸形矫正经验丰富。南京医科大学口腔医学院毕业，10年正畸临床经验，擅长各类矫正技术。', 4.6, 800, true, '["传统矫正", "隐形矫正", "儿童矫正", "成人矫正"]', NOW(), NOW()),

('周雅琴', '副主任医师', '口腔综合', '深圳北大医院', '深圳', '/images/doctors/zhou-yaqin.jpg', '综合口腔治疗专家，擅长常见口腔疾病的诊断和治疗。中山大学口腔医学院硕士，14年临床经验，提供全面的口腔健康服务。', 4.8, 1000, true, '["综合治疗", "预防保健", "常见病治疗", "口腔检查"]', NOW(), NOW());

-- 5. 系统配置数据
INSERT INTO system_configs (config_key, config_value, description, is_active) VALUES
('site_settings', '{"site_name": "知治健康", "site_description": "专业的口腔健康和细胞治疗服务平台", "contact_phone": "400-123-4567", "contact_email": "contact@zhizhi.com"}', '网站基本设置', true),

('appointment_settings', '{"advance_days": 30, "cancel_hours": 24, "reminder_hours": 2, "time_slots": ["09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30"]}', '预约系统设置', true),

('payment_settings', '{"supported_methods": ["wechat", "alipay", "bank"], "currency": "CNY", "auto_refund": true}', '支付系统设置', true),

('sms_settings', '{"enabled": true, "provider": "aliyun", "templates": {"appointment": "SMS_123456789", "reminder": "SMS_987654321"}}', '短信服务设置', true),

('wechat_settings', '{"enabled": true, "mini_program": {"app_id": "your_app_id"}, "payment": {"mch_id": "your_mch_id"}}', '微信服务设置', true);

-- 6. 操作日志示例（系统管理员操作）
INSERT INTO operation_logs (user_id, operation_type, operation_detail, ip_address, user_agent) VALUES
(NULL, 'system_init', '系统初始化，导入基础数据', '127.0.0.1', 'System Initialization');

-- 创建索引优化查询性能
CREATE INDEX IF NOT EXISTS idx_doctors_specialty ON doctors USING gin(to_tsvector('simple', specialty));
CREATE INDEX IF NOT EXISTS idx_doctors_location ON doctors(location);
CREATE INDEX IF NOT EXISTS idx_doctors_rating ON doctors(rating DESC);
CREATE INDEX IF NOT EXISTS idx_services_category ON services(category_id);
CREATE INDEX IF NOT EXISTS idx_services_price ON services(price);
CREATE INDEX IF NOT EXISTS idx_services_recommended ON services(is_recommended);
CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_status ON appointments(status);
CREATE INDEX IF NOT EXISTS idx_user_memberships_user ON user_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_user_memberships_status ON user_memberships(status);

-- 更新序列值
SELECT setval('doctors_id_seq', (SELECT MAX(id) FROM doctors));
SELECT setval('services_id_seq', (SELECT MAX(id) FROM services));
SELECT setval('service_categories_id_seq', (SELECT MAX(id) FROM service_categories));
SELECT setval('membership_cards_id_seq', (SELECT MAX(id) FROM membership_cards));
SELECT setval('system_configs_id_seq', (SELECT MAX(id) FROM system_configs));
SELECT setval('operation_logs_id_seq', (SELECT MAX(id) FROM operation_logs));

-- 种子数据导入完成提示
DO $$
BEGIN
    RAISE NOTICE '种子数据导入完成！';
    RAISE NOTICE '已导入数据统计：';
    RAISE NOTICE '- 服务分类: 14 个';
    RAISE NOTICE '- 医疗权益卡: 4 个';
    RAISE NOTICE '- 服务项目: 27 个';
    RAISE NOTICE '- 医生信息: 8 位';
    RAISE NOTICE '- 系统配置: 5 项';
    RAISE NOTICE '- 操作日志: 1 条';
END $$;