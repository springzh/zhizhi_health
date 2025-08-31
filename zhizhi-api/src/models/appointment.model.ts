import { query, transaction } from '../config/database.config';
import { 
  Appointment, 
  CreateAppointmentRequest, 
  UpdateAppointmentRequest, 
  AppointmentQueryParams 
} from '../types';

export class AppointmentModel {
  private static readonly TABLE_NAME = 'appointments';

  // 创建预约
  static async create(appointmentData: CreateAppointmentRequest): Promise<Appointment> {
    const { 
      user_id, 
      doctor_id, 
      service_type, 
      patient_name, 
      patient_phone, 
      patient_age, 
      patient_gender, 
      appointment_date, 
      appointment_time, 
      symptoms, 
      notes, 
      membership_id 
    } = appointmentData;
    
    const result = await query(`
      INSERT INTO ${this.TABLE_NAME} (
        user_id, doctor_id, service_type, patient_name, patient_phone, 
        patient_age, patient_gender, appointment_date, appointment_time, 
        symptoms, notes, membership_id
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `, [
      user_id, doctor_id, service_type, patient_name, patient_phone,
      patient_age, patient_gender, appointment_date, appointment_time,
      symptoms, notes, membership_id
    ]);

    return this.mapRowToAppointment(result.rows[0]);
  }

  // 根据ID查找预约
  static async findById(id: number): Promise<Appointment | null> {
    const result = await query(
      `SELECT * FROM ${this.TABLE_NAME} WHERE id = $1`,
      [id]
    );

    return result.rows.length > 0 ? this.mapRowToAppointment(result.rows[0]) : null;
  }

  // 更新预约
  static async update(id: number, updateData: UpdateAppointmentRequest): Promise<Appointment | null> {
    const fields = [];
    const values = [];
    let paramIndex = 1;

    for (const [key, value] of Object.entries(updateData)) {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    }

    if (fields.length === 0) {
      return this.findById(id);
    }

    values.push(id);
    const sql = `
      UPDATE ${this.TABLE_NAME} 
      SET ${fields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await query(sql, values);

    return result.rows.length > 0 ? this.mapRowToAppointment(result.rows[0]) : null;
  }

  // 删除预约
  static async delete(id: number): Promise<boolean> {
    const result = await query(
      `DELETE FROM ${this.TABLE_NAME} WHERE id = $1`,
      [id]
    );

    return result.rowCount > 0;
  }

  // 分页查询预约
  static async findAll(params: AppointmentQueryParams = {}): Promise<{
    appointments: Appointment[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  }> {
    const { 
      page = 1, 
      limit = 10, 
      user_id, 
      doctor_id, 
      status, 
      start_date, 
      end_date,
      sort_by = 'appointment_date',
      order = 'desc'
    } = params;
    
    const offset = (page - 1) * limit;

    let whereClause = '';
    const queryParams: any[] = [];
    let paramIndex = 1;

    const whereConditions = [];

    if (user_id) {
      whereConditions.push(`user_id = $${paramIndex}`);
      queryParams.push(user_id);
      paramIndex++;
    }

    if (doctor_id) {
      whereConditions.push(`doctor_id = $${paramIndex}`);
      queryParams.push(doctor_id);
      paramIndex++;
    }

    if (status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(status);
      paramIndex++;
    }

    if (start_date) {
      whereConditions.push(`appointment_date >= $${paramIndex}`);
      queryParams.push(start_date);
      paramIndex++;
    }

    if (end_date) {
      whereConditions.push(`appointment_date <= $${paramIndex}`);
      queryParams.push(end_date);
      paramIndex++;
    }

    if (whereConditions.length > 0) {
      whereClause = `WHERE ${whereConditions.join(' AND ')}`;
    }

    // 验证排序字段
    const validSortFields = ['appointment_date', 'created_at', 'patient_name'];
    const sortBy = validSortFields.includes(sort_by) ? sort_by : 'appointment_date';
    const orderBy = order.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    // 查询总数
    const countQuery = `SELECT COUNT(*) FROM ${this.TABLE_NAME} ${whereClause}`;
    const countResult = await query(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].count);

    // 查询数据
    const dataQuery = `
      SELECT * FROM ${this.TABLE_NAME} 
      ${whereClause}
      ORDER BY ${sortBy} ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    queryParams.push(limit, offset);

    const result = await query(dataQuery, queryParams);
    const appointments = result.rows.map(this.mapRowToAppointment);

    return {
      appointments,
      total,
      totalPages: Math.ceil(total / limit),
      page,
      limit,
    };
  }

  // 获取用户的预约
  static async findByUserId(userId: number, params: AppointmentQueryParams = {}): Promise<Appointment[]> {
    const { page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;

    const result = await query(`
      SELECT * FROM ${this.TABLE_NAME} 
      WHERE user_id = $1 
      ORDER BY appointment_date DESC, created_at DESC
      LIMIT $2 OFFSET $3
    `, [userId, limit, offset]);

    return result.rows.map(this.mapRowToAppointment);
  }

  // 获取医生的预约
  static async findByDoctorId(doctorId: number, params: AppointmentQueryParams = {}): Promise<Appointment[]> {
    const { page = 1, limit = 10 } = params;
    const offset = (page - 1) * limit;

    const result = await query(`
      SELECT * FROM ${this.TABLE_NAME} 
      WHERE doctor_id = $1 
      ORDER BY appointment_date DESC, created_at DESC
      LIMIT $2 OFFSET $3
    `, [doctorId, limit, offset]);

    return result.rows.map(this.mapRowToAppointment);
  }

  // 获取指定日期的预约
  static async findByDate(date: string, doctorId?: number): Promise<Appointment[]> {
    let sql = `
      SELECT * FROM ${this.TABLE_NAME} 
      WHERE appointment_date = $1
    `;
    const params: any[] = [date];

    if (doctorId) {
      sql += ` AND doctor_id = $2`;
      params.push(doctorId);
    }

    sql += ` ORDER BY appointment_time`;

    const result = await query(sql, params);
    return result.rows.map(this.mapRowToAppointment);
  }

  // 检查时间段是否已被预约
  static async isTimeSlotAvailable(doctorId: number, date: string, time: string): Promise<boolean> {
    const result = await query(`
      SELECT COUNT(*) as count FROM ${this.TABLE_NAME} 
      WHERE doctor_id = $1 
      AND appointment_date = $2 
      AND appointment_time = $3
      AND status != 'cancelled'
    `, [doctorId, date, time]);

    return parseInt(result.rows[0].count) === 0;
  }

  // 映射数据库行到Appointment对象
  private static mapRowToAppointment(row: any): Appointment {
    return {
      id: row.id,
      user_id: row.user_id,
      doctor_id: row.doctor_id,
      service_type: row.service_type,
      patient_name: row.patient_name,
      patient_phone: row.patient_phone,
      patient_age: row.patient_age,
      patient_gender: row.patient_gender,
      appointment_date: new Date(row.appointment_date),
      appointment_time: row.appointment_time,
      symptoms: row.symptoms,
      notes: row.notes,
      status: row.status,
      membership_id: row.membership_id,
      created_at: new Date(row.created_at),
      updated_at: new Date(row.updated_at),
    };
  }
}