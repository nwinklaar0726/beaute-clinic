import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { 
  Appointment, 
  Patient, 
  Service, 
  DashboardStats,
  AppointmentFilters,
  PatientFilters 
} from '../types'

// API Base URL
const API_URL = '/api'

// Fetch helpers
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    ...options,
  })
  
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  
  return response.json()
}

// ==================== STATS ====================
export function useDashboardStats() {
  return useQuery<DashboardStats>({
    queryKey: ['admin', 'stats'],
    queryFn: () => fetchAPI('/admin/stats'),
    refetchInterval: 30000, // Refresh every 30 seconds
  })
}

// ==================== APPOINTMENTS ====================
export function useAppointments(filters?: AppointmentFilters) {
  const queryString = new URLSearchParams()
  if (filters?.status) queryString.append('status', filters.status)
  if (filters?.search) queryString.append('search', filters.search)
  if (filters?.dateRange?.start) queryString.append('start', filters.dateRange.start)
  if (filters?.dateRange?.end) queryString.append('end', filters.dateRange.end)
  
  return useQuery<Appointment[]>({
    queryKey: ['admin', 'appointments', filters],
    queryFn: () => fetchAPI(`/admin/appointments?${queryString.toString()}`),
  })
}

export function useAppointment(id: string) {
  return useQuery<Appointment>({
    queryKey: ['admin', 'appointments', id],
    queryFn: () => fetchAPI(`/admin/appointments/${id}`),
    enabled: !!id,
  })
}

export function useCreateAppointment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Partial<Appointment>) => 
      fetchAPI('/admin/appointments', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

export function useUpdateAppointment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Appointment> }) => 
      fetchAPI(`/admin/appointments/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments', id] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

export function useCancelAppointment() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, reason }: { id: string; reason?: string }) => 
      fetchAPI(`/admin/appointments/${id}/cancel`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'appointments'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

// ==================== PATIENTS ====================
export function usePatients(filters?: PatientFilters) {
  const queryString = new URLSearchParams()
  if (filters?.search) queryString.append('search', filters.search)
  if (filters?.sortBy) queryString.append('sortBy', filters.sortBy)
  if (filters?.sortOrder) queryString.append('sortOrder', filters.sortOrder)
  
  return useQuery<Patient[]>({
    queryKey: ['admin', 'patients', filters],
    queryFn: () => fetchAPI(`/admin/patients?${queryString.toString()}`),
  })
}

export function usePatient(id: string) {
  return useQuery<Patient>({
    queryKey: ['admin', 'patients', id],
    queryFn: () => fetchAPI(`/admin/patients/${id}`),
    enabled: !!id,
  })
}

export function useCreatePatient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: Partial<Patient>) => 
      fetchAPI('/admin/patients', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'patients'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'stats'] })
    },
  })
}

export function useUpdatePatient() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Patient> }) => 
      fetchAPI(`/admin/patients/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'patients'] })
      queryClient.invalidateQueries({ queryKey: ['admin', 'patients', id] })
    },
  })
}

// ==================== SERVICES ====================
export function useServices() {
  return useQuery<Service[]>({
    queryKey: ['admin', 'services'],
    queryFn: () => fetchAPI('/admin/services'),
  })
}

export function useUpdateService() {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Service> }) => 
      fetchAPI(`/admin/services/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'services'] })
    },
  })
}

// ==================== CALENDAR ====================
export function useCalendarEvents(date: Date) {
  const month = date.toISOString().slice(0, 7) // YYYY-MM
  
  return useQuery({
    queryKey: ['admin', 'calendar', month],
    queryFn: () => fetchAPI(`/admin/calendar?month=${month}`),
  })
}

// ==================== REPORTS ====================
export function useRevenueReport(dateRange: { start: string; end: string }) {
  return useQuery({
    queryKey: ['admin', 'reports', 'revenue', dateRange],
    queryFn: () => fetchAPI(`/admin/reports/revenue?start=${dateRange.start}&end=${dateRange.end}`),
  })
}

export function useServicesReport(dateRange: { start: string; end: string }) {
  return useQuery({
    queryKey: ['admin', 'reports', 'services', dateRange],
    queryFn: () => fetchAPI(`/admin/reports/services?start=${dateRange.start}&end=${dateRange.end}`),
  })
}
