import { useQuery } from '@tanstack/react-query';
import { api } from '@/shared/api/client';

export interface Service {
  id: string;
  name: string;
  duration: number;
  price?: number;
  description?: string;
  category?: string;
}

export const serviceKeys = {
  all: ['services'] as const,
  lists: () => [...serviceKeys.all, 'list'] as const,
  detail: (id: string) => [...serviceKeys.all, 'detail', id] as const,
  slots: (date: string) => [...serviceKeys.all, 'slots', date] as const,
};

// Get all services
export function useServices() {
  return useQuery({
    queryKey: serviceKeys.lists(),
    queryFn: () => api.get<Service[]>('/api/services'),
    staleTime: 1000 * 60 * 30, // 30 minutes - services don't change often
  });
}

// Get available time slots for a date
export function useAvailableSlots(date: string | null) {
  return useQuery({
    queryKey: serviceKeys.slots(date || ''),
    queryFn: () => api.get<string[]>(`/api/slots/available?date=${date}`),
    enabled: !!date,
    staleTime: 1000 * 60, // 1 minute - slots availability changes frequently
  });
}
