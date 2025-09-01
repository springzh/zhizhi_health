# 知治健康项目 - Claude 开发文档

## 项目概述
知治（广州）健康科技有限公司口腔服务平台，包含企业官网和后台API系统。

## 已知问题和解决方案

### 1. Node.js 模块类型警告
**问题**: 启动服务器时出现 `MODULE_TYPELESS_PACKAGE_JSON` 警告
```
[MODULE_TYPELESS_PACKAGE_JSON] Warning: Module type of file:///Users/spring/Dev/ai/ai_coding/zhizhi-health/zhizhi-api/server-simple.js is not specified and it doesn't parse as CommonJS.
```

**解决方案**: 
- 在 `package.json` 中添加 `"type": "module"` 来明确指定为 ES 模块
- 或者忽略此警告，服务器仍可正常运行

### 2. 代理错误 (Privoxy Error)
**问题**: 访问 API 时出现 500 Internal Privoxy Error
```
500 Internal Privoxy Error
Could not load template file no-server-data
```

**解决方案**:
- 这是网络代理配置问题，不影响本地开发
- 使用 localhost 或 127.0.0.1 直接访问，避免通过代理
- API 端点: http://localhost:3001/api/*

### 3. TypeScript 编译错误
**问题**: 运行 `npm run build` 时出现多个 TypeScript 错误
- 路径引用错误
- 类型定义错误  
- 模块导出错误

**解决方案**:
- 使用 `node server-simple.js` 启动开发服务器
- 生产环境需要修复所有 TypeScript 错误后才能构建

### 4. 前端组件导入路径
**问题**: React 组件导入路径错误
```
Module not found: Can't resolve '../components/Header'
```

**解决方案**:
- 从 `src/app/` 目录导入组件使用 `../components/ComponentName`
- 从 `src/app/faq/` 目录导入组件使用 `../../components/ComponentName`

## 项目结构

### 后端 (zhizhi-api/)
```
src/
├── controllers/     # 控制器
├── models/         # 数据模型
├── routes/         # 路由定义
├── types/          # TypeScript 类型定义
├── middleware/     # 中间件
├── config/         # 配置文件
└── utils/          # 工具函数
```

### 前端 (zhizhi-website/)
```
src/
├── app/            # Next.js 页面路由
├── components/     # React 组件
└── globals.css     # 全局样式
```

## 开发指南

### 启动后端服务
```bash
cd zhizhi-api
node server-simple.js
```

### 启动前端服务
```bash
cd zhizhi-website
npm run dev
```

### 数据库操作
```bash
# 运行迁移
cd zhizhi-api
node run-migration.js ../database/migrations/[迁移文件名].sql

# 直接连接数据库
psql -h localhost -U postgres -d zhizhi_health
```

## API 端点

### 基础 API
- `GET /api/health` - 健康检查
- `GET /api/doctors` - 获取医生列表
- `GET /api/services` - 获取服务列表
- `GET /api/membership` - 获取会员卡列表

### FAQ API (新增)
- `GET /api/faq` - 获取FAQ列表
- `GET /api/faq/popular` - 获取热门FAQ
- `GET /api/faq/:id` - 获取FAQ详情
- `GET /api/faq/categories` - 获取FAQ分类

## 功能模块

### FAQ 常见问题解答
- **数据库表**: `faqs`, `faq_categories`
- **前端页面**: `/faq` (FAQ页面), 首页FAQ区域
- **功能特性**:
  - 分类筛选
  - 搜索功能
  - 展开/收起答案
  - 热门FAQ展示
  - 响应式设计

## 开发注意事项

1. **路径引用**: 注意相对路径的正确性
2. **端口配置**: 后端默认端口 3001，前端默认端口 3000
3. **数据库**: PostgreSQL 连接配置在环境变量中
4. **样式**: 使用 Tailwind CSS，遵循设计规范
5. **API 响应格式**: 统一使用 `{ success: true/false, data: any, message: string }` 格式

## 部署要求

### 环境要求
- Node.js 18+
- PostgreSQL 15+
- npm 或 yarn

### 环境变量
- `DB_HOST` - 数据库主机
- `DB_PORT` - 数据库端口
- `DB_NAME` - 数据库名称
- `DB_USER` - 数据库用户
- `DB_PASSWORD` - 数据库密码
- `PORT` - 服务端口

## 常用命令

```bash
# 安装依赖
npm install

# 构建项目
npm run build

# 启动服务
npm start

# 开发模式
npm run dev

# 运行测试
npm test
```

## 联系信息

如有问题请联系开发团队或参考项目文档。