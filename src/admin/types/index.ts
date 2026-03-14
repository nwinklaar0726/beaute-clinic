/**
 * Admin Dashboard Types
 * Beauté Clinic - Admin Panel
 */

// User/Admin
export interface AdminUser {
  id: string
  name: string
  email: string
  role: 'admin' | 'doctor' | 'receptionist'
  avatar?: string
}

// Appointment
export interface Appointment {
  id: string
  patientId: string
  patientName: string
  patientPhone: string
  patientEmail?: string
  serviceId: string
  serviceName: string
  date: string
  time: string
  duration: number
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'no-show'
  notes?: string
  createdAt: string
  updatedAt: string
}

// Patient
export interface Patient {
  id: string
  firstName: string
  lastName: string
  email?: string
  phone: string
  dateOfBirth?: string
  gender?: 'female' | 'male' | 'other'
  address?: string
  city?: string
  emergencyContact?: string
  emergencyPhone?: string
  medicalHistory?: string
  allergies?: string
  totalAppointments: number
  lastVisit?: string
  createdAt: string
  updatedAt: string
}

// Service
export interface Service {
  id: string
  name: string
  description: string
  duration: number
  price: number
  category: 'aparatologia' | 'medicina-estetica' | 'nutricion' | 'beauty-bar' | 'wellness'
  image?: string
  isActive: boolean
  requiresConsultation: boolean
  popular?: boolean
  createdAt: string
  updatedAt: string
}

// Stats
export interface DashboardStats {
  totalAppointments: number
  appointmentsToday: number
  appointmentsWeek: number
  appointmentsMonth: number
  totalPatients: number
  newPatientsMonth: number
  totalRevenue: number
  revenueMonth: number
  cancellationRate: number
  averageRating: number
}

// Chart Data
export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    color?: string
  }[]
}

// Calendar Event
export interface CalendarEvent {
  id: string
  title: string
  patientName: string
  serviceName: string
  start: Date
  end: Date
  status: Appointment['status']
  color: string
}

// Notification
export interface Notification {
  id: string
  type: 'appointment' | 'cancellation' | 'reminder' | 'system'
  title: string
  message: string
  read: boolean
  createdAt: string
}

// Filters
export interface DateRange {
  start: string
  end: string
}

export interface AppointmentFilters {
  status?: Appointment['status']
  dateRange?: DateRange
  patientId?: string
  serviceId?: string
  search?: string
}

export interface PatientFilters {
  search?: string
  sortBy?: 'name' | 'lastVisit' | 'appointments'
  sortOrder?: 'asc' | 'desc'
}
