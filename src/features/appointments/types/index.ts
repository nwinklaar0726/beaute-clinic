/**
 * Appointment Feature Types
 */

export type AppointmentStatus = 'pendiente' | 'confirmada' | 'cancelada' | 'completada';

export interface Appointment {
  id: number;
  patient_id: number;
  patient_name?: string;
  patient_phone?: string;
  appointment_at: string;
  status: AppointmentStatus;
  notes?: string;
  service?: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateAppointmentDTO {
  patient_name: string;
  patient_phone: string;
  appointment_at: string;
  service: string;
  notes?: string;
  channel?: 'web' | 'whatsapp' | 'instagram';
}

export interface UpdateAppointmentDTO {
  patient_name?: string;
  patient_phone?: string;
  appointment_at?: string;
  status?: AppointmentStatus;
  service?: string;
  notes?: string;
}

export interface AppointmentFilters {
  status?: AppointmentStatus;
  date?: string;
  patient?: string;
  limit?: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
}
