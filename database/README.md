# 数据库配置和部署说明

## 概述
本项目使用PostgreSQL 15+作为主数据库，包含完整的数据库Schema、配置文件和部署脚本。

## 文件结构
```
zhizhi-health/
├── database/
│   ├── schema.sql              # 完整的数据库Schema
│   └── backups/               # 数据库备份目录
├── config/
│   ├── database.config.example # 环境变量配置模板
│   └── database.ts            # TypeScript配置文件
├── scripts/
│   ├── backup.sh              # 数据库备份脚本
│   └── restore.sh             # 数据库恢复脚本
└── docker-compose.yml         # Docker开发环境
```

## 快速开始

### 1. 环境准备
```bash
# 安装Docker和Docker Compose
# 克隆项目
git clone <repository-url>
cd zhizhi-health

# 复制配置文件
cp config/database.config.example config/database.config.local
```

### 2. 配置环境变量
编辑 `config/database.config.local` 文件，填入实际配置：

```bash
# 数据库配置
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_NAME=zhizhi_health
DATABASE_USER=postgres
DATABASE_PASSWORD=your_secure_password

# 应用配置
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
PORT=3000

# 第三方服务配置
ALIYUN_SMS_ACCESS_KEY_ID=your_sms_key
ALIYUN_SMS_ACCESS_KEY_SECRET=your_sms_secret
WECHAT_APP_ID=your_wechat_app_id
WECHAT_APP_SECRET=your_wechat_secret
```

### 3. 启动开发环境
```bash
# 启动数据库和Redis
docker-compose up -d

# 等待数据库启动完成
docker-compose ps

# 查看数据库日志
docker-compose logs postgres

# 初始化数据库Schema (Docker会自动执行schema.sql)
```

### 4. 连接数据库
- **主机**: localhost
- **端口**: 5432
- **数据库**: zhizhi_health
- **用户名**: postgres
- **密码**: postgres123 (或配置文件中的密码)

### 5. 使用管理工具 (可选)
```bash
# 启动pgAdmin和Redis管理工具
docker-compose --profile tools up -d

# 访问pgAdmin: http://localhost:8080
# 用户名: admin@example.com
# 密码: admin123

# 访问Redis Commander: http://localhost:8081
```

## 数据库管理

### 备份数据库
```bash
# 备份数据库 (开发环境)
./scripts/backup.sh development

# 备份数据库 (生产环境)
./scripts/backup.sh production
```

### 恢复数据库
```bash
# 恢复数据库
./scripts/restore.sh /path/to/backup/file.sql.gz development
```

### 手动执行Schema
```bash
# 连接到数据库并执行Schema
psql -h localhost -p 5432 -U postgres -d zhizhi_health -f database/schema.sql
```

## 生产环境部署

### 1. 环境变量配置
```bash
# 生产环境配置示例
DATABASE_HOST=prod-db.example.com
DATABASE_PORT=5432
DATABASE_NAME=zhizhi_health_prod
DATABASE_USER=zhizhi_user
DATABASE_PASSWORD=production_secure_password
DATABASE_SSL=true

NODE_ENV=production
PORT=3000
JWT_SECRET=production_jwt_secret_key
```

### 2. 数据库初始化
```bash
# 连接到生产数据库
psql -h prod-db.example.com -p 5432 -U zhizhi_user -d zhizhi_health_prod

# 执行Schema
\i database/schema.sql
```

### 3. 定期备份
建议设置定时任务自动备份数据库：

```bash
# 添加到crontab
0 2 * * * /path/to/project/scripts/backup.sh production
```

## 数据库结构说明

### 核心表结构
1. **users** - 用户信息表
2. **doctors** - 医生信息表
3. **service_categories** - 服务分类表
4. **services** - 服务项目表
5. **membership_cards** - 权益卡表
6. **user_memberships** - 用户权益表
7. **appointments** - 预约表
8. **sms_config** - 短信配置表
9. **system_config** - 系统配置表
10. **operation_logs** - 操作日志表
11. **sms_logs** - 短信发送记录表

### 主要特性
- 使用PostgreSQL 15+特性
- JSONB字段存储灵活数据
- 完整的索引优化
- 外键约束保证数据完整性
- 触发器自动更新时间戳
- 审计日志记录

## 安全配置

### 数据库安全
1. 使用强密码
2. 启用SSL连接
3. 配置防火墙规则
4. 定期更新密码
5. 最小权限原则

### 应用安全
1. 环境变量加密
2. JWT密钥管理
3. API访问控制
4. 输入验证和SQL注入防护
5. 定期安全审计

## 监控和维护

### 健康检查
```bash
# 检查数据库连接
psql -h localhost -p 5432 -U postgres -d zhizhi_health -c "SELECT 1;"

# 检查表大小
psql -h localhost -p 5432 -U postgres -d zhizhi_health -c "
  SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
  FROM pg_tables 
  WHERE schemaname = 'public'
  ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"
```

### 性能监控
```sql
-- 查看慢查询
SELECT query, calls, total_time, mean_time, min_time, max_time
FROM pg_stat_statements 
ORDER BY total_time DESC 
LIMIT 10;

-- 查看索引使用情况
SELECT schemaname, tablename, indexname, idx_scan 
FROM pg_stat_user_indexes 
ORDER BY idx_scan;
```

## 故障排除

### 常见问题
1. **连接失败**: 检查数据库端口和密码配置
2. **权限问题**: 确保用户有足够权限
3. **SSL错误**: 检查SSL证书配置
4. **性能问题**: 检查索引和查询优化

### 日志查看
```bash
# 查看Docker容器日志
docker-compose logs postgres
docker-compose logs redis

# 查看应用日志
tail -f logs/app.log
```

## 支持

如有问题，请联系技术支持团队或查看项目文档。