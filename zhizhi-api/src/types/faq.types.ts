export interface FAQCategory {
  id: number;
  name: string;
  description?: string;
  sort_order: number;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface FAQ {
  id: number;
  category_id?: number;
  question: string;
  answer: string;
  view_count: number;
  is_popular: boolean;
  is_active: boolean;
  sort_order: number;
  created_at: Date;
  updated_at: Date;
  category?: FAQCategory;
}

export interface FAQCreateRequest {
  category_id?: number;
  question: string;
  answer: string;
  is_popular?: boolean;
  sort_order?: number;
}

export interface FAQUpdateRequest extends Partial<FAQCreateRequest> {
  id: number;
}

export interface FAQCategoryCreateRequest {
  name: string;
  description?: string;
  sort_order?: number;
}

export interface FAQCategoryUpdateRequest extends Partial<FAQCategoryCreateRequest> {
  id: number;
}

export interface FAQQueryParams {
  category_id?: number;
  is_popular?: boolean;
  is_active?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface FAQResponse {
  data: FAQ[];
  total: number;
  page: number;
  limit: number;
}

export interface FAQCategoryResponse {
  data: FAQCategory[];
  total: number;
}