import { Router } from 'express';
import userRoutes from './user.routes';
import doctorRoutes from './doctor.routes';
import appointmentRoutes from './appointment.routes';
import membershipRoutes from './membership.routes';
import serviceRoutes from './service.routes';
import healthRoutes from './health.routes';
import consultationRoutes from './consultation.routes';

const router = Router();

// 健康检查路由
router.use('/health', healthRoutes);

// API路由
router.use('/users', userRoutes);
router.use('/doctors', doctorRoutes);
router.use('/appointments', appointmentRoutes);
router.use('/memberships', membershipRoutes);
router.use('/services', serviceRoutes);
router.use('/consultations', consultationRoutes);

// API根路径
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: '知治健康 API Server',
    version: '1.0.0',
    timestamp: new Date(),
    endpoints: {
      health: '/api/health',
      users: '/api/users',
      doctors: '/api/doctors',
      appointments: '/api/appointments',
      memberships: '/api/memberships',
      services: '/api/services',
      consultations: '/api/consultations',
    },
  });
});

export default router;