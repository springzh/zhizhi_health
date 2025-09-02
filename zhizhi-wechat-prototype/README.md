# 知治健康微信小程序 - 高保真HTML原型

## 项目概述

本项目为知治健康微信小程序的高保真HTML原型设计，包含所有核心功能界面，可直接用于微信小程序开发参考。

## 🎯 项目目标

- 提供完整的微信小程序UI原型
- 符合iOS/Android最新设计规范
- 现代化UI元素和交互体验
- 高清晰度和可缩放性设计
- 直接用于开发参考的标准化代码

## 📁 项目结构

```
zhizhi-wechat-prototype/
├── index.html                    # 首页
├── doctors.html                  # 医生列表
├── doctor-detail.html             # 医生详情
├── appointment.html              # 预约流程
├── profile.html                  # 个人中心
├── services.html                 # 服务介绍
├── faq.html                     # 常见问题
├── rights-cards.html            # 权益卡
├── consultation.html             # 在线咨询
├── assets/
│   └── styles.css               # 统一设计规范
└── README.md                    # 项目说明
```

## 🎨 设计规范

### 色彩系统
- **主色**: #1E88E5 (医疗蓝)
- **辅助色**: #43A047 (健康绿)
- **成功色**: #4CAF50 (绿色)
- **警告色**: #FF9800 (橙色)
- **错误色**: #F44336 (红色)

### 字体规范
- **大标题**: 36rpx, 600
- **标题**: 32rpx, 600
- **副标题**: 28rpx, 500
- **正文**: 26rpx, normal
- **辅助文字**: 24rpx, normal
- **提示文字**: 22rpx, normal

### 间距规范
- **页面间距**: 32rpx
- **组件间距**: 24rpx
- **内间距**: 16rpx
- **小间距**: 8rpx
- **微小间距**: 4rpx

## 📱 界面功能

### 1. 首页 (index.html)
- 轮播广告位
- 快速预约入口
- 推荐医生展示
- 服务分类导航
- 热门FAQ
- 平台数据统计

### 2. 医生列表 (doctors.html)
- 搜索功能
- 地区筛选
- 专科筛选
- 排序功能
- 医生卡片展示
- 筛选弹窗

### 3. 医生详情 (doctor-detail.html)
- 医生基本信息
- 专业背景介绍
- 服务项目列表
- 患者评价
- 预约排班
- 底部预约栏

### 4. 预约流程 (appointment.html)
- 分步骤预约表单
- 进度条显示
- 医生选择
- 服务项目选择
- 时间选择
- 患者信息填写

### 5. 个人中心 (profile.html)
- 用户信息展示
- 预约状态管理
- 功能菜单
- 常用工具
- 设置选项

### 6. 服务介绍 (services.html)
- 服务分类筛选
- 服务卡片展示
- 详情弹窗
- 价格信息
- 服务说明

### 7. 常见问题 (faq.html)
- 问题分类
- 热门问题排行
- 展开/收起答案
- 搜索功能
- 详情弹窗

### 8. 权益卡 (rights-cards.html)
- 我的权益卡
- 推荐权益卡
- 购买功能
- 详情弹窗
- 权益说明

### 9. 在线咨询 (consultation.html)
- 咨询分类
- 快速咨询表单
- 咨询记录
- 医生回复展示
- 匿名咨询选项

## 🛠 技术特点

### 响应式设计
- 标准iPhone尺寸 (375x812px)
- 移动端适配
- 触摸友好交互

### 现代化UI
- 卡片式布局
- 圆角设计
- 阴影效果
- 平滑动画

### 交互体验
- 悬停效果
- 点击反馈
- 加载状态
- 空状态处理

### 性能优化
- CSS动画优化
- 图标字体使用
- 懒加载支持
- 内存管理

## 🎯 核心功能

### 预约系统
- 完整的预约流程
- 时间选择器
- 医生排班展示
- 预约状态管理

### 搜索筛选
- 多条件筛选
- 实时搜索
- 排序功能
- 筛选条件管理

### 用户中心
- 个人信息管理
- 预约记录
- 收藏功能
- 设置选项

### 支付功能
- 权益卡购买
- 价格展示
- 购物车
- 订单管理

## 📊 数据结构

### 医生信息
```javascript
{
  id: number,
  name: string,
  title: string,
  hospital: string,
  avatar: string,
  rating: number,
  consultation_count: number,
  experience: string,
  specialties: string[],
  services: Array<{
    name: string,
    price: string
  }>
}
```

### 预约信息
```javascript
{
  doctor_id: number,
  patient_name: string,
  patient_phone: string,
  patient_email: string,
  service_type: string,
  appointment_date: string,
  appointment_time: string,
  symptoms: string,
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
}
```

## 🔧 开发建议

### 微信小程序适配
1. **页面结构**: 使用WXML重构HTML结构
2. **样式转换**: 将CSS转换为WXSS
3. **交互逻辑**: 使用JavaScript重写交互逻辑
4. **组件化**: 将可复用UI组件化
5. **API集成**: 对接后端API接口

### 性能优化
1. **图片懒加载**: 使用小程序懒加载组件
2. **分页加载**: 列表数据分页处理
3. **缓存策略**: 合理使用本地缓存
4. **分包加载**: 按功能模块分包

### 用户体验
1. **加载状态**: 所有异步操作显示加载状态
2. **错误处理**: 完善的错误提示机制
3. **空状态**: 数据为空时的友好提示
4. **网络异常**: 网络问题的处理方案

## 📝 使用说明

### 浏览器查看
1. 直接用浏览器打开HTML文件
2. 建议使用Chrome或Safari浏览器
3. 开启开发者模式查看响应式效果

### 开发参考
1. 参考HTML结构设计WXML页面
2. 参考CSS样式编写WXSS样式
3. 参考JavaScript逻辑重写小程序逻辑
4. 参考交互设计实现用户体验

## 🎨 设计资源

### 图标系统
- 使用Emoji图标作为占位符
- 实际开发中替换为图标字体或SVG
- 支持自定义图标导入

### 图片资源
- 使用渐变背景作为图片占位符
- 实际开发中替换为真实图片
- 支持CDN图片链接

### 色彩主题
- 完整的色彩系统定义
- 支持主题切换
- 可扩展的色彩变量

## 🔗 相关链接

- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)
- [设计规范参考](https://developers.weixin.qq.com/miniprogram/design/)
- [UI组件库推荐](https://developers.weixin.qq.com/miniprogram/dev/extended/weui/)

## 📄 许可证

本项目仅供学习和参考使用，不得用于商业用途。

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进这个原型项目。

---

*最后更新: 2025-09-02*
*版本: v1.0.0*
*技术栈: HTML5 + CSS3 + JavaScript*