import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { appConfig } from './app.config';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: appConfig.swagger.title,
      version: appConfig.swagger.version,
      description: appConfig.swagger.description,
      contact: {
        name: '知治健康技术团队',
        email: 'tech@zhizhi.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${appConfig.port}/api`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true,
            },
            message: {
              type: 'string',
              example: 'Operation successful',
            },
            data: {
              type: 'object',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            message: {
              type: 'string',
              example: 'Error message',
            },
            error: {
              type: 'string',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            openid: {
              type: 'string',
              example: 'wx_openid_123',
            },
            nickname: {
              type: 'string',
              example: '张三',
            },
            avatar_url: {
              type: 'string',
              example: 'https://example.com/avatar.jpg',
            },
            phone: {
              type: 'string',
              example: '13800138000',
            },
            created_at: {
              type: 'string',
              format: 'date-time',
            },
          },
        },
        Doctor: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            name: {
              type: 'string',
              example: '张医生',
            },
            title: {
              type: 'string',
              example: '主任医师',
            },
            specialty: {
              type: 'string',
              example: '口腔修复',
            },
            hospital: {
              type: 'string',
              example: '广州口腔医院',
            },
            location: {
              type: 'string',
              example: '广州',
            },
            rating: {
              type: 'number',
              example: 4.8,
            },
            is_available: {
              type: 'boolean',
              example: true,
            },
          },
        },
        Appointment: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            doctor_id: {
              type: 'integer',
              example: 1,
            },
            patient_name: {
              type: 'string',
              example: '李四',
            },
            patient_phone: {
              type: 'string',
              example: '13900139000',
            },
            appointment_date: {
              type: 'string',
              format: 'date',
              example: '2024-01-20',
            },
            appointment_time: {
              type: 'string',
              format: 'time',
              example: '14:30:00',
            },
            status: {
              type: 'string',
              enum: ['pending', 'confirmed', 'completed', 'cancelled'],
              example: 'pending',
            },
          },
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    tags: [
      {
        name: 'Health',
        description: '健康检查和系统状态',
      },
      {
        name: 'Auth',
        description: '用户认证相关接口',
      },
      {
        name: 'Users',
        description: '用户管理相关接口',
      },
      {
        name: 'Doctors',
        description: '医生管理相关接口',
      },
      {
        name: 'Services',
        description: '服务管理相关接口',
      },
      {
        name: 'Appointments',
        description: '预约管理相关接口',
      },
      {
        name: 'Membership',
        description: '会员权益相关接口',
      },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

const specs = swaggerJsdoc(options);

export function setupSwagger(app: any): void {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: '知治健康 API 文档',
  }));

  // 提供 JSON 格式的文档
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
}

export default setupSwagger;