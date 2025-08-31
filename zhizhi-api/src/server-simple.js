import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Simple in-memory data for testing
const doctors = [
  {
    id: 1,
    name: "张医生",
    title: "主任医师",
    specialty: "口腔种植",
    hospital: "知治口腔医院",
    location: "北京市朝阳区",
    rating: "4.9",
    consultation_count: 1520,
    introduction: "从事口腔临床工作20余年，擅长口腔种植、牙齿矫正等。",
    service_types: ["种植牙", "牙齿矫正", "口腔修复"],
    avatar_url: "https://via.placeholder.com/150",
    is_available: true
  },
  {
    id: 2,
    name: "李医生",
    title: "副主任医师",
    specialty: "牙齿矫正",
    hospital: "知治口腔医院",
    location: "北京市朝阳区",
    rating: "4.8",
    consultation_count: 1200,
    introduction: "专业从事牙齿矫正工作15年，擅长各类错颌畸形的矫正。",
    service_types: ["牙齿矫正", "隐形矫正", "儿童矫正"],
    avatar_url: "https://via.placeholder.com/150",
    is_available: true
  },
  {
    id: 3,
    name: "王医生",
    title: "主治医师",
    specialty: "口腔修复",
    hospital: "知治口腔医院",
    location: "北京市朝阳区",
    rating: "4.7",
    consultation_count: 800,
    introduction: "专注于口腔修复工作，擅长牙齿美容修复、全口义齿修复。",
    service_types: ["牙齿修复", "美容修复", "全口义齿"],
    avatar_url: "https://via.placeholder.com/150",
    is_available: false
  }
];

const services = [
  {
    id: 1,
    name: "牙齿种植",
    category: 1,
    description: "采用国际先进的种植技术，为您恢复完美的牙齿功能",
    price: 3000,
    duration: 60,
    image_url: "https://via.placeholder.com/300x200",
    features: ["微创种植", "快速恢复", "终身质保"]
  },
  {
    id: 2,
    name: "牙齿矫正",
    category: 1,
    description: "专业的牙齿矫正服务，让您的牙齿整齐美观",
    price: 2000,
    duration: 30,
    image_url: "https://via.placeholder.com/300x200",
    features: ["隐形矫正", "快速矫正", "舒适体验"]
  },
  {
    id: 3,
    name: "洗牙护理",
    category: 1,
    description: "专业的洗牙服务，预防口腔疾病",
    price: 200,
    duration: 30,
    image_url: "https://via.placeholder.com/300x200",
    features: ["超声波洗牙", "抛光护理", "口腔检查"]
  },
  {
    id: 4,
    name: "牙齿美白",
    category: 1,
    description: "先进的牙齿美白技术，让您的牙齿更加美白",
    price: 800,
    duration: 45,
    image_url: "https://via.placeholder.com/300x200",
    features: ["冷光美白", "安全无痛", "效果持久"]
  },
  {
    id: 5,
    name: "细胞存储",
    category: 10,
    description: "专业的细胞存储服务，为您的健康保驾护航",
    price: 10000,
    duration: 0,
    image_url: "https://via.placeholder.com/300x200",
    features: ["专业存储", "安全可靠", "长期保存"]
  },
  {
    id: 6,
    name: "基因检测",
    category: 11,
    description: "全面的基因检测服务，了解您的健康状况",
    price: 5000,
    duration: 0,
    image_url: "https://via.placeholder.com/300x200",
    features: ["全面检测", "准确可靠", "专业解读"]
  },
  {
    id: 7,
    name: "免疫治疗",
    category: 12,
    description: "先进的免疫治疗技术，增强您的免疫力",
    price: 20000,
    duration: 0,
    image_url: "https://via.placeholder.com/300x200",
    features: ["先进技术", "专业治疗", "效果显著"]
  },
  {
    id: 8,
    name: "干细胞治疗",
    category: 13,
    description: "前沿的干细胞治疗技术，治疗多种疾病",
    price: 30000,
    duration: 0,
    image_url: "https://via.placeholder.com/300x200",
    features: ["前沿技术", "安全有效", "专业治疗"]
  }
];

const membershipCards = [
  {
    id: 1,
    name: "基础会员卡",
    description: "适合个人基础口腔护理",
    price: 1200,
    duration: 12,
    benefits: {
      oral_exam: true,
      teeth_cleaning: 2,
      x_ray: 1,
      consultation: true,
      discount: 0.9
    },
    features: ["全面口腔检查", "2次专业洗牙", "口腔拍片检查", "免费咨询", "9折优惠"]
  },
  {
    id: 2,
    name: "家庭会员卡",
    description: "适合3-4人家庭使用",
    price: 2800,
    duration: 12,
    benefits: {
      oral_exam: true,
      teeth_cleaning: 6,
      x_ray: 2,
      consultation: true,
      discount: 0.85,
      family_members: 4
    },
    features: ["家庭成员共享", "6次专业洗牙", "2次拍片检查", "免费咨询", "85折优惠"]
  },
  {
    id: 3,
    name: "尊享会员卡",
    description: "高端服务，尊贵体验",
    price: 5800,
    duration: 12,
    benefits: {
      oral_exam: true,
      teeth_cleaning: 12,
      x_ray: 4,
      consultation: true,
      discount: 0.75,
      priority_service: true,
      free_whitening: 1
    },
    features: ["12次专业洗牙", "4次拍片检查", "优先预约", "免费牙齿美白1次", "75折优惠"]
  }
];

// API Routes
app.get('/api/doctors', (req, res) => {
  res.json({
    success: true,
    message: "Doctors retrieved successfully",
    data: doctors,
    timestamp: new Date()
  });
});

app.get('/api/services', (req, res) => {
  const category = req.query.category;
  let filteredServices = services;
  
  if (category) {
    filteredServices = services.filter(service => service.category === parseInt(category));
  }
  
  res.json({
    success: true,
    message: "Services retrieved successfully",
    data: filteredServices,
    timestamp: new Date()
  });
});

app.get('/api/memberships', (req, res) => {
  res.json({
    success: true,
    message: "Membership cards retrieved successfully",
    data: membershipCards,
    timestamp: new Date()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: "API is running",
    timestamp: new Date()
  });
});

// Root route
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: "知治健康 API Server",
    version: "1.0.0",
    timestamp: new Date(),
    endpoints: {
      health: "/api/health",
      doctors: "/api/doctors",
      services: "/api/services",
      memberships: "/api/memberships"
    }
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`🔍 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`📖 API Documentation: http://localhost:${PORT}/api`);
});

export default app;