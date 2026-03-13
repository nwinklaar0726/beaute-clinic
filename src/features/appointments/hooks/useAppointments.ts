import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/shared/api/client';
import type { 
  Appointment, 
  CreateAppointmentDTO, 
  UpdateAppointmentDTO,
  AppointmentFilters 
} from '../types';

// Query keys for cache management
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (filters: AppointmentFilters) => [...appointmentKeys.lists(), filters] as const,
  details: () => [...appointmentKeys.all, 'detail'] as const,
  detail: (id: number) => [...appointmentKeys.details(), id] as const,
  today: () => [...appointmentKeys.all, 'today'] as const,
  upcoming: () => [...appointmentKeys.all, 'upcoming'] as const,
};

// Get all appointments with filters
export function useAppointments(filters: AppointmentFilters = {}) {
  return useQuery({
    queryKey: appointmentKeys.list(filters),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (filters.status) searchParams.append('status', filters.status);
      if (filters.date) searchParams.append('date', filters.date);
      if (filters.patient) searchParams.append('patient', filters.patient);
      if (filters.limit) searchParams.append('limit', filters.limit.toString());
      
      const query = searchParams.toString();
      return api.get<Appointment[]>(`/api/appointments${query ? `?${query}` : ''}`);
    },
  });
}

// Get today's appointments
export function useTodayAppointments() {
  return useQuery({
    queryKey: appointmentKeys.today(),
    queryFn: () => api.get<Appointment[]>('/api/appointments/today'),
  });
}

// Get upcoming appointments
export function useUpcomingAppointments() {
  return useQuery({
    queryKey: appointmentKeys.upcoming(),
    queryFn: () => api.get<Appointment[]>('/api/appointments/upcoming'),
  });
}

// Get single appointment
export function useAppointment(id: number) {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => api.get<Appointment>(`/api/appointments/${id}`),
    enabled: !!id,
  });
}

// Create appointment mutation
export function useCreateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: CreateAppointmentDTO) => 
      api.post<Appointment>('/api/appointments', data),
    onSuccess: () => {
      // Invalidate and refetch appointments lists
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.upcoming() });
    },
  });
}

// Update appointment mutation
export function useUpdateAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateAppointmentDTO }) =>
      api.patch<Appointment>(`/api/appointments/${id}`, data),
    onSuccess: (_, variables) => {
      // Invalidate specific appointment and lists
      queryClient.invalidateQueries({ 
        queryKey: appointmentKeys.detail(variables.id) 
      });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
    },
  });
}

// Delete appointment mutation
export function useDeleteAppointment() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => api.delete<void>(`/api/appointments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.today() });
      queryClient.invalidateQueries({ queryKey: appointmentKeys.upcoming() });
    },
  });
}
