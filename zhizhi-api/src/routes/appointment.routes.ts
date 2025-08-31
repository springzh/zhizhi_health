import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { appointmentValidation } from '../validators';
import { AppointmentModel } from '../models/appointment.model';
import { ResponseUtil } from '../utils/response.util';

const router = Router();

// 获取所有预约
router.get(
  '/',
  appointmentValidation.query,
  validateRequest,
  asyncHandler(async (req, res) => {
    const params = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      user_id: req.query.user_id ? Number(req.query.user_id) : undefined,
      doctor_id: req.query.doctor_id ? Number(req.query.doctor_id) : undefined,
      status: req.query.status as string,
      start_date: req.query.start_date as string,
      end_date: req.query.end_date as string,
      sort_by: req.query.sort_by as any,
      order: req.query.order as any,
    };

    const result = await AppointmentModel.findAll(params);

    ResponseUtil.paginated(
      res,
      result.appointments,
      result.total,
      result.page,
      result.limit,
      'Appointments retrieved successfully'
    );
  })
);

// 根据ID获取预约
router.get(
  '/:id',
  appointmentValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const appointment = await AppointmentModel.findById(Number(id));

    if (!appointment) {
      return ResponseUtil.notFound(res, 'Appointment not found');
    }

    ResponseUtil.success(res, appointment, 'Appointment retrieved successfully');
  })
);

// 创建预约
router.post(
  '/',
  appointmentValidation.create,
  validateRequest,
  asyncHandler(async (req, res) => {
    const appointmentData = {
      ...req.validatedData,
      user_id: req.user?.id, // 从认证中间件获取用户ID
      appointment_date: new Date(req.validatedData.appointment_date).toISOString().split('T')[0],
    };

    // 检查时间段是否可用
    const isAvailable = await AppointmentModel.isTimeSlotAvailable(
      appointmentData.doctor_id,
      appointmentData.appointment_date,
      appointmentData.appointment_time
    );

    if (!isAvailable) {
      return ResponseUtil.conflict(res, 'Time slot is already booked');
    }

    const appointment = await AppointmentModel.create(appointmentData);

    ResponseUtil.created(res, appointment, 'Appointment created successfully');
  })
);

// 更新预约
router.put(
  '/:id',
  appointmentValidation.update,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.validatedData;
    
    const appointment = await AppointmentModel.update(Number(id), updateData);

    if (!appointment) {
      return ResponseUtil.notFound(res, 'Appointment not found');
    }

    ResponseUtil.success(res, appointment, 'Appointment updated successfully');
  })
);

// 删除预约
router.delete(
  '/:id',
  appointmentValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await AppointmentModel.delete(Number(id));

    if (!deleted) {
      return ResponseUtil.notFound(res, 'Appointment not found');
    }

    ResponseUtil.deleted(res, 'Appointment deleted successfully');
  })
);

// 获取用户的预约
router.get(
  '/user/:userId',
  asyncHandler(async (req, res) => {
    const { userId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const appointments = await AppointmentModel.findByUserId(Number(userId), {
      page: Number(page),
      limit: Number(limit),
    });

    ResponseUtil.success(res, appointments, 'User appointments retrieved successfully');
  })
);

// 获取医生的预约
router.get(
  '/doctor/:doctorId',
  asyncHandler(async (req, res) => {
    const { doctorId } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const appointments = await AppointmentModel.findByDoctorId(Number(doctorId), {
      page: Number(page),
      limit: Number(limit),
    });

    ResponseUtil.success(res, appointments, 'Doctor appointments retrieved successfully');
  })
);

// 获取指定日期的预约
router.get(
  '/date/:date',
  asyncHandler(async (req, res) => {
    const { date } = req.params;
    const { doctorId } = req.query;
    
    const appointments = await AppointmentModel.findByDate(
      date, 
      doctorId ? Number(doctorId) : undefined
    );

    ResponseUtil.success(res, appointments, `Appointments for ${date} retrieved successfully`);
  })
);

// 检查时间段可用性
router.get(
  '/check-availability',
  asyncHandler(async (req, res) => {
    const { doctorId, date, time } = req.query;
    
    if (!doctorId || !date || !time) {
      return ResponseUtil.badRequest(res, 'Missing required parameters');
    }

    const isAvailable = await AppointmentModel.isTimeSlotAvailable(
      Number(doctorId),
      date as string,
      time as string
    );

    ResponseUtil.success(res, { isAvailable }, 'Availability checked successfully');
  })
);

// 取消预约
router.post(
  '/:id/cancel',
  appointmentValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const appointment = await AppointmentModel.update(Number(id), { status: 'cancelled' });

    if (!appointment) {
      return ResponseUtil.notFound(res, 'Appointment not found');
    }

    ResponseUtil.success(res, appointment, 'Appointment cancelled successfully');
  })
);

// 确认预约
router.post(
  '/:id/confirm',
  appointmentValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const appointment = await AppointmentModel.update(Number(id), { status: 'confirmed' });

    if (!appointment) {
      return ResponseUtil.notFound(res, 'Appointment not found');
    }

    ResponseUtil.success(res, appointment, 'Appointment confirmed successfully');
  })
);

// 完成预约
router.post(
  '/:id/complete',
  appointmentValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const appointment = await AppointmentModel.update(Number(id), { status: 'completed' });

    if (!appointment) {
      return ResponseUtil.notFound(res, 'Appointment not found');
    }

    ResponseUtil.success(res, appointment, 'Appointment completed successfully');
  })
);

export default router;