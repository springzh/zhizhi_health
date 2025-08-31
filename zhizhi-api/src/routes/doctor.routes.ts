import { Router } from 'express';
import { asyncHandler } from '../middleware/error.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { doctorValidation } from '../validators';
import { DoctorModel } from '../models/doctor.model';
import { ResponseUtil } from '../utils/response.util';

const router = Router();

// 获取所有医生
router.get(
  '/',
  doctorValidation.query,
  validateRequest,
  asyncHandler(async (req, res) => {
    const params = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
      location: req.query.location as string,
      specialty: req.query.specialty as string,
      search: req.query.search as string,
      is_available: req.query.is_available ? req.query.is_available === 'true' : undefined,
      sort_by: req.query.sort_by as any,
      order: req.query.order as any,
    };

    const result = await DoctorModel.findAll(params);

    ResponseUtil.paginated(
      res,
      result.doctors,
      result.total,
      result.page,
      result.limit,
      'Doctors retrieved successfully'
    );
  })
);

// 根据ID获取医生
router.get(
  '/:id',
  doctorValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const doctor = await DoctorModel.findById(Number(id));

    if (!doctor) {
      return ResponseUtil.notFound(res, 'Doctor not found');
    }

    ResponseUtil.success(res, doctor, 'Doctor retrieved successfully');
  })
);

// 创建医生
router.post(
  '/',
  doctorValidation.create,
  validateRequest,
  asyncHandler(async (req, res) => {
    const doctorData = req.validatedData;
    const doctor = await DoctorModel.create(doctorData);

    ResponseUtil.created(res, doctor, 'Doctor created successfully');
  })
);

// 更新医生
router.put(
  '/:id',
  doctorValidation.update,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const updateData = req.validatedData;
    
    const doctor = await DoctorModel.update(Number(id), updateData);

    if (!doctor) {
      return ResponseUtil.notFound(res, 'Doctor not found');
    }

    ResponseUtil.success(res, doctor, 'Doctor updated successfully');
  })
);

// 删除医生
router.delete(
  '/:id',
  doctorValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    const deleted = await DoctorModel.delete(Number(id));

    if (!deleted) {
      return ResponseUtil.notFound(res, 'Doctor not found');
    }

    ResponseUtil.deleted(res, 'Doctor deleted successfully');
  })
);

// 获取热门医生
router.get(
  '/popular/list',
  asyncHandler(async (req, res) => {
    const limit = req.query.limit ? Number(req.query.limit) : 10;
    const doctors = await DoctorModel.getPopularDoctors(limit);

    ResponseUtil.success(res, doctors, 'Popular doctors retrieved successfully');
  })
);

// 根据地区获取医生
router.get(
  '/location/:location',
  asyncHandler(async (req, res) => {
    const { location } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const doctors = await DoctorModel.getDoctorsByLocation(location, limit);

    ResponseUtil.success(res, doctors, `Doctors in ${location} retrieved successfully`);
  })
);

// 根据专长获取医生
router.get(
  '/specialty/:specialty',
  asyncHandler(async (req, res) => {
    const { specialty } = req.params;
    const limit = req.query.limit ? Number(req.query.limit) : 20;
    const doctors = await DoctorModel.getDoctorsBySpecialty(specialty, limit);

    ResponseUtil.success(res, doctors, `Doctors with specialty ${specialty} retrieved successfully`);
  })
);

// 搜索医生
router.get(
  '/search/:query',
  asyncHandler(async (req, res) => {
    const { query } = req.params;
    const params = {
      page: req.query.page ? Number(req.query.page) : 1,
      limit: req.query.limit ? Number(req.query.limit) : 10,
    };

    const result = await DoctorModel.searchDoctors(query, params);

    ResponseUtil.paginated(
      res,
      result.doctors,
      result.total,
      result.page,
      result.limit,
      'Search results retrieved successfully'
    );
  })
);

// 更新医生咨询次数
router.post(
  '/:id/increment-consultation',
  doctorValidation.id,
  validateRequest,
  asyncHandler(async (req, res) => {
    const { id } = req.params;
    await DoctorModel.incrementConsultationCount(Number(id));

    ResponseUtil.success(res, null, 'Consultation count incremented successfully');
  })
);

// 批量更新医生可用状态
router.put(
  '/batch/availability',
  asyncHandler(async (req, res) => {
    const { updates } = req.body;
    
    if (!Array.isArray(updates)) {
      return ResponseUtil.badRequest(res, 'Updates must be an array');
    }

    await DoctorModel.batchUpdateAvailability(updates);

    ResponseUtil.success(res, null, 'Doctor availability updated successfully');
  })
);

export default router;