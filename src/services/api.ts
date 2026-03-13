/**
 * API Service for Beauté - Connects to appointment-bot backend
 */

const API_BASE = import.meta.env.VITE_API_URL || '';

// Helper for API calls
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Unknown error' }));
    throw new Error(error.error || `HTTP ${response.status}`);
  }
  
  return response.json();
}

// Dashboard
export async function getDashboardStats() {
  return fetchAPI('/api/dashboard/stats');
}

// Appointments
export interface Appointment {
  id: number;
  patient_id: number;
  patient_name?: string;
  patient_phone?: string;
  appointment_at: string;
  status: 'pendiente' | 'confirmada' | 'cancelada' | 'completada';
  notes?: string;
  service?: string;
  created_at?: string;
}

export interface CreateAppointmentData {
  patient_id?: number;
  patient_name: string;
  patient_phone: string;
  appointment_at: string;
  service: string;
  notes?: string;
  channel?: 'web' | 'whatsapp' | 'instagram';
}

export async function getAppointments(params?: { 
  status?: string; 
  date?: string; 
  patient?: string;
  limit?: number;
}) {
  const searchParams = new URLSearchParams();
  if (params?.status) searchParams.append('status', params.status);
  if (params?.date) searchParams.append('date', params.date);
  if (params?.patient) searchParams.append('patient', params.patient);
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  const query = searchParams.toString();
  return fetchAPI(`/api/appointments${query ? `?${query}` : ''}`);
}

export async function getTodayAppointments() {
  return fetchAPI('/api/appointments/today');
}

export async function getUpcomingAppointments() {
  return fetchAPI('/api/appointments/upcoming');
}

export async function getAppointment(id: number) {
  return fetchAPI(`/api/appointments/${id}`);
}

export async function createAppointment(data: CreateAppointmentData) {
  return fetchAPI('/api/appointments', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export async function updateAppointment(id: number, data: Partial<Appointment>) {
  return fetchAPI(`/api/appointments/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteAppointment(id: number) {
  return fetchAPI(`/api/appointments/${id}`, {
    method: 'DELETE',
  });
}

// Available time slots
export async function getAvailableSlots(date: string) {
  return fetchAPI(`/api/slots/available?date=${date}`);
}

// Patients
export interface Patient {
  id: number;
  full_name: string;
  phone: string;
  channel?: string;
  channel_id?: string;
  created_at?: string;
}

export async function getPatients(params?: { search?: string; limit?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.search) searchParams.append('search', params.search);
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  const query = searchParams.toString();
  return fetchAPI(`/api/patients${query ? `?${query}` : ''}`);
}

export async function getPatient(id: number) {
  return fetchAPI(`/api/patients/${id}`);
}

export async function updatePatient(id: number, data: Partial<Patient>) {
  return fetchAPI(`/api/patients/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

// Services
export interface Service {
  id: string;
  name: string;
  duration: number;
  price?: number;
  description?: string;
  category?: string;
}

export async function getServices() {
  return fetchAPI('/api/services');
}

// Messages (for admin panel)
export interface Message {
  id: number;
  patient_id: number;
  patient_name?: string;
  content: string;
  direction: 'inbound' | 'outbound';
  channel: string;
  created_at: string;
}

export async function getMessages(params?: { patient?: number; limit?: number }) {
  const searchParams = new URLSearchParams();
  if (params?.patient) searchParams.append('patient', params.patient.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  
  const query = searchParams.toString();
  return fetchAPI(`/api/messages${query ? `?${query}` : ''}`);
}
