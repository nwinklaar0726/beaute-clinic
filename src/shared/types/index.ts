/**
 * Shared types across the application
 */

export interface Patient {
  id: number;
  full_name: string;
  phone: string;
  email?: string;
  channel?: string;
  channel_id?: string;
  created_at?: string;
}

export interface Message {
  id: number;
  patient_id: number;
  patient_name?: string;
  content: string;
  direction: 'inbound' | 'outbound';
  channel: string;
  created_at: string;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
