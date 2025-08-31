// 咨询相关类型定义
export interface Consultation {
  id: number;
  user_id?: number;
  doctor_id?: number | undefined;
  guest_name?: string;
  guest_phone?: string;
  guest_email?: string;
  title: string;
  content: string;
  category: 'general' | 'dental' | 'cell' | 'membership' | 'appointment';
  status: 'pending' | 'replied' | 'closed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  is_public: boolean;
  view_count: number;
  reply_count: number;
  created_at: Date;
  updated_at: Date;
}

export interface ConsultationReply {
  id: number;
  consultation_id: number;
  user_id?: number;
  reply_type: 'doctor' | 'admin' | 'user';
  content: string;
  is_internal_note: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface ConsultationAttachment {
  id: number;
  consultation_id: number;
  file_name: string;
  file_url: string;
  file_type?: string;
  file_size?: number;
  uploaded_at: Date;
}

export interface CreateConsultationRequest {
  user_id?: number;
  doctor_id?: number | undefined;
  guest_name?: string;
  guest_phone?: string;
  guest_email?: string;
  title: string;
  content: string;
  category: 'general' | 'dental' | 'cell' | 'membership' | 'appointment';
  priority?: 'low' | 'normal' | 'high' | 'urgent';
  is_public?: boolean;
}

export interface CreateConsultationReplyRequest {
  consultation_id: number;
  user_id?: number;
  reply_type: 'doctor' | 'admin' | 'user';
  content: string;
  is_internal_note?: boolean;
}

export interface ConsultationQueryParams {
  page?: number;
  limit?: number;
  category?: string;
  status?: string;
  priority?: string;
  user_id?: number;
  doctor_id?: number | undefined;
  guest_phone?: string;
  is_public?: boolean;
  sort_by?: 'created_at' | 'updated_at' | 'priority' | 'view_count';
  order?: 'asc' | 'desc';
  search?: string;
}

export interface ConsultationListResponse {
  consultations: Consultation[];
  total: number;
  totalPages: number;
  page: number;
  limit: number;
}