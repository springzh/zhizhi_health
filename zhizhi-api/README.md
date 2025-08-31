# 知治健康 API

知治健康平台后端API服务，基于Node.js + Express + TypeScript + PostgreSQL构建。

## 🚀 快速开始

### 环境要求

- Node.js >= 18.0.0
- npm >= 8.0.0
- PostgreSQL >= 15
- Redis >= 7 (可选)

### 安装依赖

```bash
npm install
```

### 环境配置

复制环境变量模板：

```bash
cp .env.example .env
```

编辑 `.env` 文件，配置数据库连接等信息：

```env
# 服务器配置
NODE_ENV=development
PORT=3000
HOST=localhost

# 数据库配置
DB_HOST=localhost
DB_PORT=5432
DB_NAME=zhizhi_health
DB_USER=postgres
DB_PASSWORD=password

# Redis配置
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0

# JWT配置
JWT_SECRET=your-jwt-secret-key
JWT_REFRESH_SECRET=your-refresh-secret-key

# 日志配置
LOG_LEVEL=info
LOG_DIR=logs
```

### 数据库设置

1. 创建数据库：

```sql
CREATE DATABASE zhizhi_health;
```

2. 运行数据库迁移：

```bash
npm run db:migrate
```

3. 运行数据种子（可选）：

```bash
npm run db:seed
```

### 启动服务

开发模式：

```bash
npm run dev
```

生产模式：

```bash
npm run build
npm start
```

## 🐳 Docker 部署

### 开发环境

```bash
# 启动开发环境
npm run docker:dev

# 查看日志
docker-compose -f docker-compose.dev.yml logs -f
```

### 生产环境

```bash
# 构建并启动
npm run docker:prod

# 停止服务
npm run docker:stop

# 清理数据
npm run docker:clean
```

## 📚 API 文档

启动服务后，访问以下地址：

- API文档：http://localhost:3000/api-docs
- 健康检查：http://localhost:3000/api/health
- API根路径：http://localhost:3000/api

## 🏗️ 项目结构

```
zhizhi-api/
├── src/
│   ├── config/           # 配置文件
│   ├── controllers/     # 控制器
│   ├── middleware/      # 中间件
│   ├── models/          # 数据模型
│   ├── routes/          # 路由定义
│   ├── types/           # TypeScript类型定义
│   ├── utils/           # 工具函数
│   ├── validators/      # 验证规则
│   └── index.ts         # 应用入口
├── database/            # 数据库相关文件
├── logs/                # 日志文件
├── dist/                # 编译输出
├── tests/               # 测试文件
└── docs/                # API文档
```

## 🔧 可用脚本

```bash
# 开发
npm run dev              # 启动开发服务器
npm run build            # 构建生产版本
npm start               # 启动生产服务器

# 测试
npm test               # 运行测试
npm run test:watch     # 监听模式运行测试
npm run test:coverage  # 运行测试覆盖率

# 代码质量
npm run lint            # 代码检查
npm run lint:fix        # 自动修复代码问题
npm run typecheck       # TypeScript类型检查

# 数据库
npm run db:migrate      # 运行数据库迁移
npm run db:seed         # 运行数据种子
npm run db:reset        # 重置数据库

# Docker
npm run docker:dev      # 启动开发环境
npm run docker:prod     # 启动生产环境
npm run docker:stop     # 停止Docker服务

# 日志
npm run logs            # 查看所有日志
npm run logs:errors     # 查看错误日志
```

## 📊 API 端点

### 健康检查
- `GET /api/health` - 基础健康检查
- `GET /api/health/detailed` - 详细健康信息
- `GET /api/health/database` - 数据库连接测试
- `GET /api/health/redis` - Redis连接测试

### 用户管理
- `GET /api/users` - 获取用户列表
- `POST /api/users` - 创建用户
- `GET /api/users/:id` - 获取用户详情
- `PUT /api/users/:id` - 更新用户
- `DELETE /api/users/:id` - 删除用户

### 医生管理
- `GET /api/doctors` - 获取医生列表
- `POST /api/doctors` - 创建医生
- `GET /api/doctors/:id` - 获取医生详情
- `PUT /api/doctors/:id` - 更新医生
- `DELETE /api/doctors/:id` - 删除医生
- `GET /api/doctors/popular/list` - 获取热门医生
- `GET /api/doctors/location/:location` - 按地区获取医生
- `GET /api/doctors/specialty/:specialty` - 按专长获取医生

### 预约管理
- `GET /api/appointments` - 获取预约列表
- `POST /api/appointments` - 创建预约
- `GET /api/appointments/:id` - 获取预约详情
- `PUT /api/appointments/:id` - 更新预约
- `DELETE /api/appointments/:id` - 删除预约
- `POST /api/appointments/:id/cancel` - 取消预约
- `POST /api/appointments/:id/confirm` - 确认预约
- `POST /api/appointments/:id/complete` - 完成预约

### 权益卡管理
- `GET /api/memberships/cards` - 获取权益卡列表
- `POST /api/memberships/cards` - 创建权益卡
- `GET /api/memberships/cards/:id` - 获取权益卡详情
- `PUT /api/memberships/cards/:id` - 更新权益卡
- `DELETE /api/memberships/cards/:id` - 删除权益卡
- `GET /api/memberships/user/:userId` - 获取用户权益
- `POST /api/memberships/user/:userId/purchase` - 购买权益卡

### 服务管理
- `GET /api/services` - 获取服务列表
- `GET /api/services/categories` - 获取服务分类
- `GET /api/services/:id` - 获取服务详情
- `GET /api/services/type/:type` - 按类型获取服务
- `GET /api/services/search/:keyword` - 搜索服务

## 🔒 安全特性

- JWT身份认证
- 请求速率限制
- 输入验证和清理
- CORS跨域配置
- 安全响应头
- SQL注入防护
- XSS攻击防护

## 📈 监控和日志

- 结构化日志记录
- 请求/响应日志
- 错误日志
- 性能监控
- 健康检查
- Prometheus指标 (可选)

## 🚀 部署

### 环境变量

生产环境需要配置以下环境变量：

```env
NODE_ENV=production
PORT=3000
DB_HOST=your-db-host
DB_NAME=zhizhi_health
DB_USER=your-db-user
DB_PASSWORD=your-db-password
JWT_SECRET=your-production-jwt-secret
JWT_REFRESH_SECRET=your-production-refresh-secret
```

### PM2部署

```bash
# 安装PM2
npm install -g pm2

# 启动应用
pm2 start dist/server.js --name zhizhi-api

# 查看状态
pm2 status

# 查看日志
pm2 logs zhizhi-api
```

## 🤝 贡献

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

知治健康技术团队 - [contact@zhizhi.com](mailto:contact@zhizhi.com)